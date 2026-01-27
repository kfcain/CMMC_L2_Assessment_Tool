# Browser-Based LLM + MCP Server Integration Research

## Executive Summary

This document explores the feasibility and approaches for integrating browser-based Large Language Models (LLMs) with Model Context Protocol (MCP) servers to automate evidence testing and analysis for CMMC compliance assessments.

---

## 1. Overview of Technologies

### 1.1 Browser-Based LLMs

**Definition**: LLMs that can run directly in the web browser using WebGPU, WebAssembly (WASM), or JavaScript-based inference engines.

**Key Technologies**:
- **WebLLM** (Apache TVM): Run LLMs in browser via WebGPU
- **Transformers.js** (Hugging Face): ONNX-based models in browser
- **ONNX Runtime Web**: Microsoft's cross-platform inference
- **llama.cpp WASM**: Compiled llama.cpp for browser execution
- **MediaPipe LLM**: Google's on-device inference

**Advantages**:
- **Privacy**: Data never leaves the browser
- **Offline Capability**: Works without internet after model download
- **No Server Costs**: Client-side compute only
- **Low Latency**: No network round-trips for inference

**Limitations**:
- **Model Size**: Limited to ~7B parameter models (memory constraints)
- **Performance**: Slower than server-side GPU inference
- **Browser Support**: WebGPU required for optimal performance
- **Initial Load**: Large model downloads (1-4GB)

### 1.2 Model Context Protocol (MCP)

**Definition**: Anthropic's open protocol for connecting AI assistants to external data sources and tools through a standardized interface.

**Architecture**:
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   LLM Client    │────▶│   MCP Server    │────▶│  Data Sources   │
│  (Host/Client)  │◀────│   (Provider)    │◀────│  (Resources)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Key Components**:
- **MCP Host**: Application hosting the LLM (e.g., Claude Desktop, IDE)
- **MCP Client**: Protocol handler connecting to servers
- **MCP Server**: Service exposing resources, tools, and prompts
- **Resources**: Read-only data (files, API responses, database records)
- **Tools**: Executable functions the LLM can invoke
- **Prompts**: Reusable prompt templates

---

## 2. Integration Feasibility Analysis

### 2.1 Option A: Full Browser-Based (WebLLM + Browser MCP Client)

**Architecture**:
```
┌───────────────────────────────────────────────────────┐
│                     Browser                            │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────┐ │
│  │   WebLLM    │───▶│ MCP Client  │───▶│   WASM    │ │
│  │  (Inference)│◀───│  (JS/WASM)  │◀───│MCP Server │ │
│  └─────────────┘    └─────────────┘    └───────────┘ │
│                                              │        │
│                                              ▼        │
│                                     ┌───────────────┐ │
│                                     │ Evidence Data │ │
│                                     │ (IndexedDB)   │ │
│                                     └───────────────┘ │
└───────────────────────────────────────────────────────┘
```

**Feasibility**: ⚠️ **Partially Feasible**

**Pros**:
- Complete offline operation
- Maximum privacy (no data leaves browser)
- No infrastructure requirements

**Cons**:
- MCP servers typically use stdio/SSE transport (not designed for browser)
- Would require custom MCP-over-WebSocket or postMessage implementation
- Limited model capabilities (7B max)
- High memory usage

**Implementation Complexity**: High

### 2.2 Option B: Hybrid (Browser UI + Remote LLM + Local MCP)

**Architecture**:
```
┌─────────────────┐          ┌─────────────────────────────┐
│     Browser     │   HTTP   │       Local Server          │
│  ┌───────────┐  │◀────────▶│  ┌─────────┐  ┌──────────┐ │
│  │   React   │  │          │  │  LLM    │  │   MCP    │ │
│  │    UI     │  │          │  │ Server  │──│  Server  │ │
│  └───────────┘  │          │  │(Ollama) │  │(Evidence)│ │
└─────────────────┘          │  └─────────┘  └──────────┘ │
                             └─────────────────────────────┘
```

**Feasibility**: ✅ **Highly Feasible**

**Pros**:
- Standard MCP transport (stdio/SSE)
- Access to larger models via Ollama/LMStudio
- Better performance
- Existing tooling support

**Cons**:
- Requires local server installation
- Not pure browser-based
- User setup complexity

**Implementation Complexity**: Medium

### 2.3 Option C: Cloud Hybrid (Browser + Cloud LLM + MCP Proxy)

**Architecture**:
```
┌─────────────────┐     ┌───────────────────────────────────────┐
│     Browser     │     │            Cloud/Server               │
│  ┌───────────┐  │HTTP │  ┌──────────┐     ┌───────────────┐  │
│  │   React   │◀─┼────▶│  │   API    │────▶│ LLM Provider  │  │
│  │    UI     │  │     │  │  Proxy   │     │(OpenAI/Claude)│  │
│  └───────────┘  │     │  └────┬─────┘     └───────────────┘  │
└─────────────────┘     │       │                               │
                        │       ▼                               │
                        │  ┌──────────┐     ┌───────────────┐  │
                        │  │   MCP    │────▶│ Evidence DB   │  │
                        │  │  Server  │     │ (Supabase)    │  │
                        │  └──────────┘     └───────────────┘  │
                        └───────────────────────────────────────┘
```

**Feasibility**: ✅ **Highly Feasible**

**Pros**:
- Best model quality (GPT-4, Claude)
- Standard MCP implementation
- Scalable architecture
- Works across devices

**Cons**:
- Requires cloud infrastructure
- Data leaves browser (privacy concern for CUI)
- API costs
- Internet required

**Implementation Complexity**: Medium-High

---

## 3. Recommended Architecture for CMMC Evidence Testing

### 3.1 Proposed Solution: Progressive Enhancement

**Tier 1: Basic (Browser-Only)**
- Use Transformers.js with smaller models (Phi-3-mini, TinyLlama)
- Local evidence analysis without MCP
- Simple pattern matching and rule-based checks
- Works offline, no setup required

**Tier 2: Enhanced (Browser + Local LLM)**
- Connect to local Ollama/LMStudio via HTTP
- Use MCP for evidence retrieval
- Better model capabilities (Llama 3, Mistral)
- Requires user to run local server

**Tier 3: Full (Cloud Integration)**
- Connect to cloud LLM providers
- Full MCP server with database integration
- Best analysis capabilities
- Requires account and API keys

### 3.2 Evidence Testing Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   Evidence Testing Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User uploads/selects evidence                           │
│           │                                                  │
│           ▼                                                  │
│  2. LLM receives evidence + control requirements            │
│           │                                                  │
│           ▼                                                  │
│  3. MCP Server provides:                                    │
│     • CMMC assessment objectives                            │
│     • Control implementation guidance                       │
│     • Similar approved evidence examples                    │
│     • Organization context (SSP, policies)                  │
│           │                                                  │
│           ▼                                                  │
│  4. LLM analyzes evidence against requirements              │
│           │                                                  │
│           ▼                                                  │
│  5. Returns structured assessment:                          │
│     • Compliance status (Met/Not Met/Partial)              │
│     • Gaps identified                                       │
│     • Recommendations                                       │
│     • Confidence score                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Guide

### 4.1 Browser-Based LLM Setup (Transformers.js)

```javascript
// evidence-analyzer.js
import { pipeline } from '@xenova/transformers';

class EvidenceAnalyzer {
    constructor() {
        this.generator = null;
        this.ready = false;
    }

    async init() {
        // Load a small, capable model
        this.generator = await pipeline(
            'text-generation',
            'Xenova/Phi-3-mini-4k-instruct-onnx',
            { device: 'webgpu' }  // Use WebGPU if available
        );
        this.ready = true;
    }

    async analyzeEvidence(evidence, controlId, objectives) {
        if (!this.ready) await this.init();

        const prompt = `You are a CMMC compliance assessor. Analyze the following evidence for control ${controlId}.

Assessment Objectives:
${objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Evidence Provided:
${evidence}

Provide your assessment in this JSON format:
{
    "status": "MET|NOT_MET|PARTIALLY_MET",
    "objectivesMet": [list of met objective numbers],
    "gaps": [list of gaps found],
    "recommendations": [list of recommendations],
    "confidence": 0-100
}`;

        const result = await this.generator(prompt, {
            max_new_tokens: 500,
            temperature: 0.3
        });

        return this.parseResponse(result[0].generated_text);
    }

    parseResponse(text) {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            return { error: 'Failed to parse response', raw: text };
        }
    }
}

export default EvidenceAnalyzer;
```

### 4.2 MCP Server for Evidence (Node.js)

```javascript
// mcp-evidence-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
    name: 'cmmc-evidence-server',
    version: '1.0.0'
}, {
    capabilities: {
        resources: {},
        tools: {}
    }
});

// Resource: Get control assessment objectives
server.setRequestHandler('resources/list', async () => ({
    resources: [
        {
            uri: 'cmmc://controls',
            name: 'CMMC Controls',
            description: 'All CMMC Level 2 controls with objectives',
            mimeType: 'application/json'
        },
        {
            uri: 'cmmc://evidence-templates',
            name: 'Evidence Templates',
            description: 'Approved evidence templates by control',
            mimeType: 'application/json'
        }
    ]
}));

server.setRequestHandler('resources/read', async (request) => {
    const uri = request.params.uri;
    
    if (uri === 'cmmc://controls') {
        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(await loadControls())
            }]
        };
    }
    
    if (uri.startsWith('cmmc://control/')) {
        const controlId = uri.replace('cmmc://control/', '');
        return {
            contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(await getControlDetails(controlId))
            }]
        };
    }
});

// Tool: Validate evidence
server.setRequestHandler('tools/list', async () => ({
    tools: [{
        name: 'validate_evidence',
        description: 'Validate evidence against CMMC control requirements',
        inputSchema: {
            type: 'object',
            properties: {
                controlId: { type: 'string', description: 'CMMC control ID (e.g., AC.L2-3.1.1)' },
                evidenceType: { type: 'string', description: 'Type of evidence (policy, screenshot, config)' },
                evidenceContent: { type: 'string', description: 'The evidence content to validate' }
            },
            required: ['controlId', 'evidenceType', 'evidenceContent']
        }
    }]
}));

server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'validate_evidence') {
        const { controlId, evidenceType, evidenceContent } = request.params.arguments;
        const result = await validateEvidence(controlId, evidenceType, evidenceContent);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 4.3 Browser-to-Local-LLM Connection

```javascript
// local-llm-client.js
class LocalLLMClient {
    constructor(baseUrl = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
        this.model = 'llama3.2';
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            return response.ok;
        } catch {
            return false;
        }
    }

    async generate(prompt, options = {}) {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                prompt,
                stream: false,
                options: {
                    temperature: options.temperature || 0.3,
                    num_predict: options.maxTokens || 1000
                }
            })
        });

        if (!response.ok) throw new Error('LLM request failed');
        
        const data = await response.json();
        return data.response;
    }

    async chat(messages, options = {}) {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                messages,
                stream: false,
                options: {
                    temperature: options.temperature || 0.3
                }
            })
        });

        if (!response.ok) throw new Error('LLM chat request failed');
        
        const data = await response.json();
        return data.message.content;
    }
}

export default LocalLLMClient;
```

---

## 5. Security Considerations

### 5.1 CUI Handling

**Critical Requirement**: CMMC assessments may involve Controlled Unclassified Information (CUI).

**Browser-Based (Safe)**:
- Data stays in browser memory/IndexedDB
- No external API calls
- Meets data residency requirements

**Local LLM (Safe)**:
- Data stays on local machine
- No cloud transmission
- Model runs locally

**Cloud LLM (Requires Caution)**:
- Must use FedRAMP-authorized providers
- Azure OpenAI (GCC High) for government use
- AWS Bedrock (GovCloud) as alternative
- Review data processing agreements

### 5.2 Model Selection for CUI

| Model Provider | FedRAMP Status | Recommendation |
|---------------|----------------|----------------|
| Azure OpenAI (GCC High) | FedRAMP High | ✅ Approved for CUI |
| AWS Bedrock (GovCloud) | FedRAMP High | ✅ Approved for CUI |
| OpenAI Commercial | None | ❌ Not for CUI |
| Anthropic Cloud | None | ❌ Not for CUI |
| Local Ollama | N/A | ✅ Safe (local) |
| Browser WebLLM | N/A | ✅ Safe (client) |

---

## 6. Implementation Roadmap

### Phase 1: Foundation (2-3 weeks)
- [ ] Integrate Transformers.js for basic browser inference
- [ ] Create evidence analysis prompts for each CMMC control family
- [ ] Build UI for evidence upload and analysis
- [ ] Implement offline-first architecture

### Phase 2: Local LLM Integration (2-3 weeks)
- [ ] Add Ollama/LMStudio connection support
- [ ] Build MCP server for evidence retrieval
- [ ] Create control objective database
- [ ] Implement structured output parsing

### Phase 3: Advanced Features (3-4 weeks)
- [ ] Add batch evidence analysis
- [ ] Implement confidence scoring
- [ ] Create gap analysis reports
- [ ] Build evidence comparison tools

### Phase 4: Cloud Option (2-3 weeks)
- [ ] Add Azure OpenAI (GCC High) integration
- [ ] Implement secure API key management
- [ ] Add usage tracking and limits
- [ ] Create fallback chain (browser → local → cloud)

---

## 7. Proof of Concept Code

### 7.1 Minimal Browser Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>CMMC Evidence Analyzer</title>
    <script type="module">
        import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.0';

        let generator = null;

        async function initModel() {
            document.getElementById('status').textContent = 'Loading model...';
            generator = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0');
            document.getElementById('status').textContent = 'Model ready!';
            document.getElementById('analyzeBtn').disabled = false;
        }

        async function analyzeEvidence() {
            const evidence = document.getElementById('evidence').value;
            const controlId = document.getElementById('controlId').value;
            
            document.getElementById('result').textContent = 'Analyzing...';
            
            const prompt = `Analyze this evidence for CMMC control ${controlId}: ${evidence}`;
            
            const result = await generator(prompt, { max_new_tokens: 200 });
            document.getElementById('result').textContent = result[0].generated_text;
        }

        window.onload = initModel;
    </script>
</head>
<body>
    <h1>CMMC Evidence Analyzer (Browser-Based)</h1>
    <p id="status">Initializing...</p>
    
    <div>
        <label>Control ID:</label>
        <input type="text" id="controlId" value="AC.L2-3.1.1" />
    </div>
    
    <div>
        <label>Evidence:</label>
        <textarea id="evidence" rows="6" cols="60">Our organization uses Active Directory with role-based access control...</textarea>
    </div>
    
    <button id="analyzeBtn" onclick="analyzeEvidence()" disabled>Analyze Evidence</button>
    
    <h2>Analysis Result:</h2>
    <pre id="result"></pre>
</body>
</html>
```

---

## 8. Conclusion

### 8.1 Feasibility Summary

| Approach | Feasibility | Best For |
|----------|-------------|----------|
| Full Browser (WebLLM) | ⚠️ Partial | Simple checks, offline use, max privacy |
| Browser + Local LLM | ✅ High | Power users, CUI handling, better models |
| Browser + Cloud LLM | ✅ High | Best quality, requires FedRAMP for CUI |

### 8.2 Recommendation

For the CMMC Assessment Tool, implement a **progressive enhancement** approach:

1. **Default**: Browser-based Transformers.js for basic analysis (works offline, no setup)
2. **Enhanced**: Optional Ollama connection for users who want better models locally
3. **Enterprise**: Azure OpenAI (GCC High) integration for organizations with existing cloud infrastructure

### 8.3 Key Takeaways

- **Browser-based LLMs are viable** for basic evidence analysis with models like Phi-3-mini
- **MCP integration requires adaptation** for browser environments (WebSocket transport)
- **CUI considerations** favor local/browser solutions over commercial cloud APIs
- **Progressive enhancement** provides the best user experience across different needs

### 8.4 Next Steps

1. Prototype browser-based analyzer with Transformers.js
2. Build MCP server for CMMC control objectives
3. Test with sample evidence across control families
4. Gather user feedback on accuracy and usability
5. Iterate based on real-world assessment scenarios

---

## Appendix A: Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js/)
- [WebLLM Project](https://webllm.mlc.ai/)
- [Ollama Documentation](https://ollama.ai/)
- [Azure OpenAI GCC High](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-plan-openai)

## Appendix B: Model Recommendations

| Use Case | Model | Size | Platform |
|----------|-------|------|----------|
| Browser (basic) | TinyLlama-1.1B | 1.1B | Transformers.js |
| Browser (better) | Phi-3-mini | 3.8B | WebLLM/WebGPU |
| Local (good) | Llama 3.2 3B | 3B | Ollama |
| Local (best) | Llama 3.1 8B | 8B | Ollama |
| Cloud (enterprise) | GPT-4o | - | Azure OpenAI |
