// MarkItDown — Client-Side Document to Markdown Converter
// Inspired by Microsoft's markitdown (github.com/microsoft/markitdown)
// Converts DOCX, PDF, XLSX, PPTX, HTML, CSV, TXT to clean Markdown
// Uses mammoth.js (DOCX), pdf.js (PDF), SheetJS (XLSX/CSV), JSZip (PPTX)

const DocumentConverter = {
    version: "2.0.0",

    // Supported file extensions → handler mapping
    handlers: {
        'docx': { label: 'Word',       icon: '📝', method: '_convertDocx' },
        'doc':  { label: 'Word (Legacy)', icon: '📝', method: '_convertDocLegacy' },
        'pdf':  { label: 'PDF',        icon: '📕', method: '_convertPdf' },
        'xlsx': { label: 'Excel',      icon: '📊', method: '_convertXlsx' },
        'xls':  { label: 'Excel (Legacy)', icon: '📊', method: '_convertXlsx' },
        'csv':  { label: 'CSV',        icon: '📊', method: '_convertCsv' },
        'pptx': { label: 'PowerPoint', icon: '📙', method: '_convertPptx' },
        'html': { label: 'HTML',       icon: '🌐', method: '_convertHtml' },
        'htm':  { label: 'HTML',       icon: '🌐', method: '_convertHtml' },
        'txt':  { label: 'Text',       icon: '📄', method: '_convertText' },
        'md':   { label: 'Markdown',   icon: '📋', method: '_convertMarkdown' },
        'json': { label: 'JSON',       icon: '🔧', method: '_convertJson' },
        'xml':  { label: 'XML',        icon: '🔧', method: '_convertXml' },
        'rtf':  { label: 'RTF',        icon: '📝', method: '_convertRtf' }
    },

    maxFileSize: 50 * 1024 * 1024, // 50MB

    // Library readiness flags
    _libs: { mammoth: false, pdfjsLib: false, JSZip: false, XLSX: false },

    init: function() {
        this._checkLibraries();
        console.log('[DocumentConverter] v2.0 initialized — MarkItDown-style converter');
    },

    _checkLibraries: function() {
        this._libs.mammoth = typeof mammoth !== 'undefined';
        this._libs.pdfjsLib = typeof pdfjsLib !== 'undefined';
        this._libs.JSZip = typeof JSZip !== 'undefined';
        this._libs.XLSX = typeof XLSX !== 'undefined';
    },

    // Get file extension from name
    _ext: function(name) {
        return (name || '').split('.').pop().toLowerCase();
    },

    // Check if a file is supported
    isSupported: function(fileName) {
        return !!this.handlers[this._ext(fileName)];
    },

    // Get handler info for a file
    getHandlerInfo: function(fileName) {
        return this.handlers[this._ext(fileName)] || null;
    },

    // Main entry point: convert a File object to markdown
    convert: async function(file, onProgress) {
        var ext = this._ext(file.name);
        var handler = this.handlers[ext];
        if (!handler) throw new Error('Unsupported file type: .' + ext);
        if (file.size > this.maxFileSize) throw new Error('File too large (max 50MB)');

        if (onProgress) onProgress('Reading file...');
        this._checkLibraries();

        var result = {
            fileName: file.name,
            fileSize: file.size,
            fileType: handler.label,
            icon: handler.icon,
            markdown: '',
            convertedAt: new Date().toISOString(),
            warnings: [],
            stats: { wordCount: 0, lineCount: 0, tableCount: 0, headingCount: 0 }
        };

        try {
            if (onProgress) onProgress('Converting ' + handler.label + '...');
            result.markdown = await this[handler.method](file, result);
            // Compute stats
            result.stats.wordCount = (result.markdown.match(/\S+/g) || []).length;
            result.stats.lineCount = result.markdown.split('\n').length;
            result.stats.tableCount = (result.markdown.match(/^\|/gm) || []).length > 0
                ? (result.markdown.match(/^\|[-:| ]+\|$/gm) || []).length : 0;
            result.stats.headingCount = (result.markdown.match(/^#{1,6}\s/gm) || []).length;
        } catch (err) {
            result.markdown = '# Conversion Error\n\n> **Error:** ' + err.message + '\n\n';
            result.warnings.push(err.message);
        }

        return result;
    },

    // ═══════════════════════════════════════════
    //  DOCX → Markdown (via mammoth.js)
    // ═══════════════════════════════════════════
    _convertDocx: async function(file, result) {
        if (!this._libs.mammoth) {
            result.warnings.push('mammoth.js not loaded — using fallback XML extraction');
            return this._convertDocxFallback(file, result);
        }
        var arrayBuffer = await file.arrayBuffer();
        var mammothResult = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        if (mammothResult.messages && mammothResult.messages.length > 0) {
            mammothResult.messages.forEach(function(m) { result.warnings.push(m.message); });
        }
        return this._htmlToMarkdown(mammothResult.value, file.name);
    },

    // Fallback DOCX parser when mammoth.js is not available
    _convertDocxFallback: async function(file, result) {
        if (!this._libs.JSZip) {
            result.warnings.push('JSZip not loaded — cannot parse DOCX');
            return '# ' + file.name + '\n\n> DOCX conversion requires mammoth.js or JSZip. Please ensure libraries are loaded.\n';
        }
        var arrayBuffer = await file.arrayBuffer();
        var zip = await JSZip.loadAsync(arrayBuffer);
        var docXml = await zip.file('word/document.xml').async('string');
        // Strip XML tags, preserve paragraph breaks
        var text = docXml
            .replace(/<w:p[^>]*\/>/gi, '\n')
            .replace(/<w:p[^>]*>/gi, '\n')
            .replace(/<w:tab\/>/gi, '\t')
            .replace(/<w:br\/>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        return '# ' + file.name + '\n\n' + text + '\n';
    },

    _convertDocLegacy: async function(file, result) {
        result.warnings.push('.doc (legacy Word) format has limited support — text extraction only');
        var text = await file.text();
        // .doc files are binary; extract readable ASCII/UTF-8 runs
        var cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/ {3,}/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
        return '# ' + file.name + '\n\n> **Note:** Legacy .doc format — some formatting may be lost.\n\n' + cleaned + '\n';
    },

    // ═══════════════════════════════════════════
    //  PDF → Markdown (via pdf.js)
    // ═══════════════════════════════════════════
    _convertPdf: async function(file, result) {
        if (!this._libs.pdfjsLib) {
            result.warnings.push('pdf.js not loaded — cannot extract PDF text');
            return '# ' + file.name + '\n\n> PDF conversion requires pdf.js. Please ensure the library is loaded.\n';
        }
        var arrayBuffer = await file.arrayBuffer();
        var pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        var totalPages = pdf.numPages;
        var markdown = '# ' + file.name + '\n\n';
        markdown += '**Pages:** ' + totalPages + '\n\n---\n\n';

        for (var i = 1; i <= totalPages; i++) {
            var page = await pdf.getPage(i);
            var content = await page.getTextContent();
            var pageText = '';
            var lastY = null;
            content.items.forEach(function(item) {
                // Detect line breaks by Y-position changes
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
                    pageText += '\n';
                }
                pageText += item.str;
                lastY = item.transform[5];
            });
            if (totalPages > 1) {
                markdown += '## Page ' + i + '\n\n';
            }
            markdown += pageText.trim() + '\n\n';
        }
        return markdown;
    },

    // ═══════════════════════════════════════════
    //  XLSX / XLS → Markdown (via SheetJS)
    // ═══════════════════════════════════════════
    _convertXlsx: async function(file, result) {
        if (!this._libs.XLSX) {
            result.warnings.push('SheetJS not loaded — cannot parse spreadsheet');
            return '# ' + file.name + '\n\n> Excel conversion requires SheetJS.\n';
        }
        var arrayBuffer = await file.arrayBuffer();
        var workbook = XLSX.read(arrayBuffer, { type: 'array' });
        var markdown = '# ' + file.name + '\n\n';
        markdown += '**Sheets:** ' + workbook.SheetNames.join(', ') + '\n\n---\n\n';

        workbook.SheetNames.forEach(function(sheetName) {
            var sheet = workbook.Sheets[sheetName];
            var data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            if (data.length === 0) return;

            markdown += '## ' + sheetName + '\n\n';

            // Build markdown table
            var headerRow = data[0];
            markdown += '| ' + headerRow.map(function(c) { return String(c).replace(/\|/g, '\\|'); }).join(' | ') + ' |\n';
            markdown += '| ' + headerRow.map(function() { return '---'; }).join(' | ') + ' |\n';

            for (var r = 1; r < data.length; r++) {
                var row = data[r];
                markdown += '| ' + row.map(function(c) { return String(c).replace(/\|/g, '\\|'); }).join(' | ') + ' |\n';
            }
            markdown += '\n';
        });

        return markdown;
    },

    // ═══════════════════════════════════════════
    //  CSV → Markdown table
    // ═══════════════════════════════════════════
    _convertCsv: async function(file, result) {
        var text = await file.text();
        var lines = text.trim().split('\n');
        if (lines.length === 0) return '# ' + file.name + '\n\n*Empty CSV file*\n';

        var markdown = '# ' + file.name + '\n\n';
        // Parse CSV (handle quoted fields)
        var rows = lines.map(function(line) {
            var cells = [];
            var current = '';
            var inQuotes = false;
            for (var i = 0; i < line.length; i++) {
                var ch = line[i];
                if (ch === '"') { inQuotes = !inQuotes; }
                else if (ch === ',' && !inQuotes) { cells.push(current.trim()); current = ''; }
                else { current += ch; }
            }
            cells.push(current.trim());
            return cells;
        });

        var header = rows[0];
        markdown += '| ' + header.map(function(c) { return c.replace(/\|/g, '\\|'); }).join(' | ') + ' |\n';
        markdown += '| ' + header.map(function() { return '---'; }).join(' | ') + ' |\n';
        for (var r = 1; r < rows.length; r++) {
            markdown += '| ' + rows[r].map(function(c) { return c.replace(/\|/g, '\\|'); }).join(' | ') + ' |\n';
        }
        return markdown;
    },

    // ═══════════════════════════════════════════
    //  PPTX → Markdown (via JSZip)
    // ═══════════════════════════════════════════
    _convertPptx: async function(file, result) {
        if (!this._libs.JSZip) {
            result.warnings.push('JSZip not loaded — cannot parse PowerPoint');
            return '# ' + file.name + '\n\n> PPTX conversion requires JSZip.\n';
        }
        var arrayBuffer = await file.arrayBuffer();
        var zip = await JSZip.loadAsync(arrayBuffer);
        var markdown = '# ' + file.name + '\n\n';

        // Find all slide XML files
        var slideFiles = Object.keys(zip.files)
            .filter(function(f) { return f.match(/^ppt\/slides\/slide\d+\.xml$/); })
            .sort(function(a, b) {
                var na = parseInt(a.match(/slide(\d+)/)[1]);
                var nb = parseInt(b.match(/slide(\d+)/)[1]);
                return na - nb;
            });

        for (var i = 0; i < slideFiles.length; i++) {
            var slideXml = await zip.file(slideFiles[i]).async('string');
            markdown += '## Slide ' + (i + 1) + '\n\n';
            // Extract text from <a:t> tags
            var texts = [];
            var regex = /<a:t>([^<]*)<\/a:t>/g;
            var match;
            while ((match = regex.exec(slideXml)) !== null) {
                if (match[1].trim()) texts.push(match[1].trim());
            }
            if (texts.length > 0) {
                // First text is usually the title
                markdown += '### ' + texts[0] + '\n\n';
                for (var t = 1; t < texts.length; t++) {
                    markdown += texts[t] + '\n\n';
                }
            } else {
                markdown += '*No text content on this slide*\n\n';
            }
            markdown += '---\n\n';
        }
        return markdown;
    },

    // ═══════════════════════════════════════════
    //  HTML → Markdown
    // ═══════════════════════════════════════════
    _convertHtml: async function(file, result) {
        var html = await file.text();
        return this._htmlToMarkdown(html, file.name);
    },

    _htmlToMarkdown: function(html, fileName) {
        var md = '';
        // Extract title from <title> if present
        var titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        md += '# ' + (titleMatch ? titleMatch[1].trim() : fileName) + '\n\n';

        // Remove script, style, head
        var body = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');

        // Extract body content if present
        var bodyMatch = body.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (bodyMatch) body = bodyMatch[1];

        // Convert tables to markdown tables
        body = body.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, function(tableHtml) {
            var rows = [];
            var rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
            var rowMatch;
            while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
                var cells = [];
                var cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
                var cellMatch;
                while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
                    cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\|/g, '\\|'));
                }
                rows.push(cells);
            }
            if (rows.length === 0) return '';
            var tableMd = '\n| ' + rows[0].join(' | ') + ' |\n';
            tableMd += '| ' + rows[0].map(function() { return '---'; }).join(' | ') + ' |\n';
            for (var i = 1; i < rows.length; i++) {
                tableMd += '| ' + rows[i].join(' | ') + ' |\n';
            }
            return tableMd + '\n';
        });

        // Convert headings
        body = body.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n## $1\n\n');
        body = body.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n### $1\n\n');
        body = body.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n#### $1\n\n');
        body = body.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n##### $1\n\n');
        body = body.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n###### $1\n\n');

        // Convert links
        body = body.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

        // Convert images
        body = body.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
        body = body.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

        // Convert formatting
        body = body.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
        body = body.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
        body = body.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
        body = body.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
        body = body.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
        body = body.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n');

        // Convert lists
        body = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
        body = body.replace(/<\/?[uo]l[^>]*>/gi, '\n');

        // Convert paragraphs and breaks
        body = body.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
        body = body.replace(/<br\s*\/?>/gi, '\n');
        body = body.replace(/<hr\s*\/?>/gi, '\n---\n');
        body = body.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, function(m, content) {
            return content.trim().split('\n').map(function(l) { return '> ' + l; }).join('\n') + '\n\n';
        });

        // Strip remaining tags
        body = body.replace(/<[^>]+>/g, '');

        // Decode entities
        body = body.replace(/&nbsp;/g, ' ');
        body = body.replace(/&amp;/g, '&');
        body = body.replace(/&lt;/g, '<');
        body = body.replace(/&gt;/g, '>');
        body = body.replace(/&quot;/g, '"');
        body = body.replace(/&#39;/g, "'");
        body = body.replace(/&mdash;/g, '—');
        body = body.replace(/&ndash;/g, '–');
        body = body.replace(/&hellip;/g, '...');

        // Clean up whitespace
        body = body.replace(/\n{3,}/g, '\n\n').trim();

        md += body + '\n';
        return md;
    },

    // ═══════════════════════════════════════════
    //  Plain Text → Markdown
    // ═══════════════════════════════════════════
    _convertText: async function(file, result) {
        var text = await file.text();
        var lines = text.split('\n');
        var md = '# ' + file.name + '\n\n';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trimEnd();
            if (!line.trim()) { md += '\n'; continue; }

            // Detect ALL CAPS headings
            var trimmed = line.trim();
            if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 100 && /[A-Z]/.test(trimmed)) {
                md += '## ' + trimmed + '\n\n';
            }
            // Detect numbered section headers (e.g., "1.0 Introduction")
            else if (/^\d+(\.\d+)*\s+[A-Z]/.test(trimmed)) {
                var level = (trimmed.match(/\./g) || []).length + 2;
                md += '#'.repeat(Math.min(level, 6)) + ' ' + trimmed + '\n\n';
            }
            // Detect bullet points
            else if (/^[-*•]\s/.test(trimmed)) {
                md += trimmed + '\n';
            }
            // Detect numbered lists
            else if (/^\d+[\.)]\s/.test(trimmed)) {
                md += trimmed + '\n';
            }
            // Regular line
            else {
                md += line + '\n';
            }
        }
        return md.replace(/\n{3,}/g, '\n\n');
    },

    // ═══════════════════════════════════════════
    //  Markdown passthrough (already markdown)
    // ═══════════════════════════════════════════
    _convertMarkdown: async function(file) {
        return await file.text();
    },

    // ═══════════════════════════════════════════
    //  JSON → Markdown (formatted code block + structure)
    // ═══════════════════════════════════════════
    _convertJson: async function(file) {
        var text = await file.text();
        var md = '# ' + file.name + '\n\n';
        try {
            var parsed = JSON.parse(text);
            md += '**Type:** ' + (Array.isArray(parsed) ? 'Array (' + parsed.length + ' items)' : 'Object (' + Object.keys(parsed).length + ' keys)') + '\n\n';

            // If it's an array of objects, render as table
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
                var keys = Object.keys(parsed[0]);
                md += '| ' + keys.join(' | ') + ' |\n';
                md += '| ' + keys.map(function() { return '---'; }).join(' | ') + ' |\n';
                parsed.slice(0, 100).forEach(function(row) {
                    md += '| ' + keys.map(function(k) { return String(row[k] || '').replace(/\|/g, '\\|').substring(0, 80); }).join(' | ') + ' |\n';
                });
                if (parsed.length > 100) md += '\n*... and ' + (parsed.length - 100) + ' more rows*\n';
                md += '\n';
            }

            md += '```json\n' + JSON.stringify(parsed, null, 2).substring(0, 10000) + '\n```\n';
        } catch (e) {
            md += '```\n' + text.substring(0, 10000) + '\n```\n';
        }
        return md;
    },

    // ═══════════════════════════════════════════
    //  XML → Markdown
    // ═══════════════════════════════════════════
    _convertXml: async function(file) {
        var text = await file.text();
        var md = '# ' + file.name + '\n\n';
        md += '```xml\n' + text.substring(0, 20000) + '\n```\n';
        return md;
    },

    // ═══════════════════════════════════════════
    //  RTF → Markdown (basic text extraction)
    // ═══════════════════════════════════════════
    _convertRtf: async function(file, result) {
        result.warnings.push('RTF conversion extracts text only — formatting may be lost');
        var text = await file.text();
        // Strip RTF control words and groups
        var cleaned = text
            .replace(/\{\\[^{}]*\}/g, '')      // Remove nested groups
            .replace(/\\[a-z]+\d*\s?/gi, '')   // Remove control words
            .replace(/[{}]/g, '')               // Remove braces
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        return '# ' + file.name + '\n\n' + cleaned + '\n';
    },

    // ═══════════════════════════════════════════
    //  Utility: format file size
    // ═══════════════════════════════════════════
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // ═══════════════════════════════════════════
    //  Utility: generate ZIP of all converted files
    // ═══════════════════════════════════════════
    exportAsZip: async function(results) {
        if (!this._libs.JSZip) {
            throw new Error('JSZip is required for ZIP export');
        }
        var zip = new JSZip();
        results.forEach(function(r) {
            var mdName = r.fileName.replace(/\.[^.]+$/, '') + '.md';
            zip.file(mdName, r.markdown);
        });
        return await zip.generateAsync({ type: 'blob' });
    },

    // Utility: download a single markdown file
    downloadMarkdown: function(result) {
        var mdName = result.fileName.replace(/\.[^.]+$/, '') + '.md';
        var blob = new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = mdName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Utility: download ZIP of all results
    downloadZip: async function(results, zipName) {
        var blob = await this.exportAsZip(results);
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = zipName || 'markitdown-export.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { DocumentConverter.init(); });
} else {
    DocumentConverter.init();
}

if (typeof window !== 'undefined') window.DocumentConverter = DocumentConverter;
