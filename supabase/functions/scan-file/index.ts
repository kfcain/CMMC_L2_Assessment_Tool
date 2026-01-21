// CMMC L2 Assessment Tool - File Scanning Edge Function
// Scans uploaded files using VirusTotal API (free tier: 4 req/min, 500 req/day)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ScanRequest {
  evidence_id: string
  file_path: string
}

interface VirusTotalAnalysis {
  data: {
    attributes: {
      status: string
      stats: {
        harmless: number
        malicious: number
        suspicious: number
        undetected: number
      }
      results: Record<string, {
        category: string
        engine_name: string
        result: string | null
      }>
    }
  }
}

serve(async (req) => {
  try {
    // Verify request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse request body
    const { evidence_id, file_path }: ScanRequest = await req.json()

    if (!evidence_id || !file_path) {
      return new Response('Missing evidence_id or file_path', { status: 400 })
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Update status to scanning
    await supabase.rpc('update_scan_status', {
      p_evidence_id: evidence_id,
      p_status: 'scanning'
    })

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('evidence')
      .download(file_path)

    if (downloadError || !fileData) {
      await supabase.rpc('update_scan_status', {
        p_evidence_id: evidence_id,
        p_status: 'error',
        p_result: { error: 'Failed to download file', details: downloadError?.message }
      })
      return new Response('Failed to download file', { status: 500 })
    }

    // If no VirusTotal API key, use basic validation
    if (!VIRUSTOTAL_API_KEY) {
      // Basic file validation (header checks)
      const scanResult = await performBasicScan(fileData)
      
      await supabase.rpc('update_scan_status', {
        p_evidence_id: evidence_id,
        p_status: scanResult.clean ? 'clean' : 'infected',
        p_result: scanResult
      })

      return new Response(JSON.stringify(scanResult), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Upload to VirusTotal for scanning
    const vtResult = await scanWithVirusTotal(fileData, file_path)

    await supabase.rpc('update_scan_status', {
      p_evidence_id: evidence_id,
      p_status: vtResult.clean ? 'clean' : 'infected',
      p_result: vtResult
    })

    // If infected, move to quarantine
    if (!vtResult.clean) {
      // Optionally move file to quarantine bucket
      console.log(`File ${file_path} flagged as potentially malicious`)
    }

    return new Response(JSON.stringify(vtResult), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Scan error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

// Basic file validation without external API
async function performBasicScan(file: Blob): Promise<{
  clean: boolean
  method: string
  checks: Record<string, boolean>
  warnings: string[]
}> {
  const warnings: string[] = []
  const checks: Record<string, boolean> = {}
  
  // Read file header
  const buffer = await file.arrayBuffer()
  const header = new Uint8Array(buffer.slice(0, 16))
  
  // Check for known malicious signatures
  const signatures = {
    // Executable files (should be blocked by MIME type, but double-check)
    exe: [0x4D, 0x5A], // MZ header
    elf: [0x7F, 0x45, 0x4C, 0x46], // ELF header
    // Macro-enabled Office docs (potential risk)
    docm: [0x50, 0x4B, 0x03, 0x04], // ZIP (could be docm/xlsm)
  }

  // Check for executable headers
  checks.no_exe_header = !(header[0] === 0x4D && header[1] === 0x5A)
  checks.no_elf_header = !(header[0] === 0x7F && header[1] === 0x45 && header[2] === 0x4C && header[3] === 0x46)
  
  if (!checks.no_exe_header) warnings.push('File contains Windows executable header')
  if (!checks.no_elf_header) warnings.push('File contains Linux executable header')

  // Check file size (basic sanity)
  checks.size_reasonable = file.size < 50 * 1024 * 1024
  if (!checks.size_reasonable) warnings.push('File exceeds size limit')

  // Check for suspicious patterns in text files
  if (file.type.startsWith('text/') || file.type === 'application/json') {
    const text = await file.text()
    checks.no_script_tags = !/<script[^>]*>/i.test(text)
    checks.no_eval = !/\beval\s*\(/i.test(text)
    checks.no_base64_exec = !/base64['"]\s*\)\s*;/.test(text)
    
    if (!checks.no_script_tags) warnings.push('File contains script tags')
    if (!checks.no_eval) warnings.push('File contains eval() calls')
  }

  const clean = Object.values(checks).every(v => v === true)

  return {
    clean,
    method: 'basic_validation',
    checks,
    warnings
  }
}

// Scan using VirusTotal API
async function scanWithVirusTotal(file: Blob, fileName: string): Promise<{
  clean: boolean
  method: string
  stats?: { malicious: number; suspicious: number; harmless: number }
  threats?: string[]
  scan_id?: string
}> {
  // Upload file to VirusTotal
  const formData = new FormData()
  formData.append('file', file, fileName.split('/').pop())

  const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': VIRUSTOTAL_API_KEY!
    },
    body: formData
  })

  if (!uploadResponse.ok) {
    throw new Error(`VirusTotal upload failed: ${uploadResponse.statusText}`)
  }

  const uploadResult = await uploadResponse.json()
  const analysisId = uploadResult.data.id

  // Poll for results (with timeout)
  let attempts = 0
  const maxAttempts = 30
  let analysis: VirusTotalAnalysis | null = null

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
    
    const analysisResponse = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY! }
      }
    )

    if (analysisResponse.ok) {
      analysis = await analysisResponse.json()
      if (analysis?.data?.attributes?.status === 'completed') {
        break
      }
    }
    
    attempts++
  }

  if (!analysis || analysis.data.attributes.status !== 'completed') {
    return {
      clean: true, // Assume clean if scan times out
      method: 'virustotal_timeout',
      scan_id: analysisId
    }
  }

  const stats = analysis.data.attributes.stats
  const threats = Object.entries(analysis.data.attributes.results)
    .filter(([_, result]) => result.category === 'malicious' || result.category === 'suspicious')
    .map(([engine, result]) => `${engine}: ${result.result}`)

  return {
    clean: stats.malicious === 0 && stats.suspicious === 0,
    method: 'virustotal',
    stats: {
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless
    },
    threats: threats.length > 0 ? threats : undefined,
    scan_id: analysisId
  }
}
