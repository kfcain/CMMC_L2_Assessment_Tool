// Document to Markdown Converter
// Converts uploaded documents to markdown for AI assessment
// Handles PDF, Word, Text files - skips JSON, YAML, screenshots

const DocumentConverter = {
    config: {
        version: "1.0.0",
        storageKey: 'nist-document-storage',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        supportedFormats: {
            // Convert to markdown
            'application/pdf': { type: 'PDF', convert: true },
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'Word', convert: true },
            'text/plain': { type: 'Text', convert: true },
            'text/html': { type: 'HTML', convert: true },
            // Keep as-is (no conversion)
            'application/json': { type: 'JSON', convert: false },
            'application/x-yaml': { type: 'YAML', convert: false },
            'text/yaml': { type: 'YAML', convert: false },
            'image/png': { type: 'Screenshot', convert: false },
            'image/jpeg': { type: 'Screenshot', convert: false },
            'image/jpg': { type: 'Screenshot', convert: false },
            'image/gif': { type: 'Screenshot', convert: false }
        }
    },

    documentStorage: {},

    init: function() {
        this.loadDocumentStorage();
        console.log('[DocumentConverter] Initialized');
    },

    loadDocumentStorage: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.documentStorage = saved ? JSON.parse(saved) : {};
    },

    saveDocumentStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.documentStorage));
    },

    // Process file and convert to markdown if applicable
    async processFile(file, objectiveId = null) {
        const fileInfo = this.config.supportedFormats[file.type];
        
        if (!fileInfo) {
            throw new Error(`Unsupported file type: ${file.type}`);
        }

        if (file.size > this.config.maxFileSize) {
            throw new Error(`File too large: ${this.formatFileSize(file.size)} (max ${this.formatFileSize(this.config.maxFileSize)})`);
        }

        const fileId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        const documentData = {
            id: fileId,
            fileName: file.name,
            fileType: fileInfo.type,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: Date.now(),
            uploadedBy: localStorage.getItem('nist-user-name') || 'Unknown',
            objectiveId: objectiveId,
            shouldConvert: fileInfo.convert,
            originalContent: null,
            markdownContent: null,
            conversionStatus: 'pending'
        };

        try {
            // Read file content
            const content = await this.readFileContent(file);
            documentData.originalContent = content;

            // Convert to markdown if applicable
            if (fileInfo.convert) {
                documentData.markdownContent = await this.convertToMarkdown(content, fileInfo.type, file.name);
                documentData.conversionStatus = 'converted';
            } else {
                documentData.conversionStatus = 'skipped';
            }

            // Store document
            this.documentStorage[fileId] = documentData;
            this.saveDocumentStorage();

            return documentData;
        } catch (error) {
            documentData.conversionStatus = 'failed';
            documentData.error = error.message;
            throw error;
        }
    },

    // Read file content based on type
    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            // Read as text for most files, base64 for images
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    },

    // Convert content to markdown based on file type
    async convertToMarkdown(content, fileType, fileName) {
        let markdown = '';

        // Add document header
        markdown += `# ${fileName}\n\n`;
        markdown += `**Document Type:** ${fileType}\n`;
        markdown += `**Converted:** ${new Date().toLocaleString()}\n\n`;
        markdown += `---\n\n`;

        switch (fileType) {
            case 'PDF':
                markdown += await this.convertPDFToMarkdown(content, fileName);
                break;
            case 'Word':
                markdown += await this.convertWordToMarkdown(content, fileName);
                break;
            case 'Text':
                markdown += this.convertTextToMarkdown(content);
                break;
            case 'HTML':
                markdown += this.convertHTMLToMarkdown(content);
                break;
            default:
                markdown += content;
        }

        return markdown;
    },

    // Convert PDF to markdown (client-side using PDF.js if available)
    async convertPDFToMarkdown(content, fileName) {
        // Note: This is a simplified version. For full PDF parsing, you'd need PDF.js library
        // For now, we'll provide instructions for manual extraction
        let markdown = `## PDF Document: ${fileName}\n\n`;
        markdown += `> **Note:** This is a PDF document. For full AI assessment capability, please:\n`;
        markdown += `> 1. Extract text from the PDF using a PDF reader\n`;
        markdown += `> 2. Copy the text content\n`;
        markdown += `> 3. Upload as a .txt file for automatic markdown conversion\n\n`;
        markdown += `**PDF Content Preview:**\n\n`;
        markdown += '```\n';
        markdown += content.substring(0, 1000);
        markdown += '\n...\n```\n\n';
        markdown += `**To enable AI assessment:** Please extract and re-upload as text.\n`;
        
        return markdown;
    },

    // Convert Word document to markdown
    async convertWordToMarkdown(content, fileName) {
        // Note: Full .docx parsing requires mammoth.js or similar library
        // For now, we'll provide a simplified conversion
        let markdown = `## Word Document: ${fileName}\n\n`;
        markdown += `> **Note:** This is a Word document. For full AI assessment capability:\n`;
        markdown += `> 1. Open the document in Word\n`;
        markdown += `> 2. Save as .txt or copy all text\n`;
        markdown += `> 3. Upload as a .txt file for automatic markdown conversion\n\n`;
        
        return markdown;
    },

    // Convert plain text to markdown
    convertTextToMarkdown(content) {
        let markdown = '';
        
        // Split into lines
        const lines = content.split('\n');
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) {
                markdown += '\n';
                continue;
            }

            // Detect headings (lines in ALL CAPS or with specific patterns)
            if (line === line.toUpperCase() && line.length > 3 && line.length < 100) {
                markdown += `## ${line}\n\n`;
            }
            // Detect numbered lists
            else if (/^\d+[\.)]\s/.test(line)) {
                markdown += `${line}\n`;
            }
            // Detect bullet points
            else if (/^[-*•]\s/.test(line)) {
                markdown += `${line}\n`;
            }
            // Detect section headers (e.g., "1.0 Introduction")
            else if (/^\d+(\.\d+)*\s+[A-Z]/.test(line)) {
                const level = (line.match(/\./g) || []).length + 2;
                const headerPrefix = '#'.repeat(Math.min(level, 6));
                markdown += `${headerPrefix} ${line}\n\n`;
            }
            // Regular paragraph
            else {
                markdown += `${line}\n\n`;
            }
        }

        // Clean up excessive newlines
        markdown = markdown.replace(/\n{3,}/g, '\n\n');

        return markdown;
    },

    // Convert HTML to markdown
    convertHTMLToMarkdown(content) {
        let markdown = content;
        
        // Remove HTML tags and convert to markdown
        markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
        markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
        markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
        markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
        markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
        markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
        markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1');
        markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1');
        markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
        markdown = markdown.replace(/<[^>]+>/g, '');
        markdown = markdown.replace(/&nbsp;/g, ' ');
        markdown = markdown.replace(/&amp;/g, '&');
        markdown = markdown.replace(/&lt;/g, '<');
        markdown = markdown.replace(/&gt;/g, '>');
        
        return markdown;
    },

    // Get document by ID
    getDocument(documentId) {
        return this.documentStorage[documentId];
    },

    // Get all documents for an objective
    getDocumentsForObjective(objectiveId) {
        return Object.values(this.documentStorage).filter(doc => doc.objectiveId === objectiveId);
    },

    // Get markdown content for AI assessment
    getMarkdownForAI(documentId) {
        const doc = this.documentStorage[documentId];
        if (!doc) return null;
        
        return doc.markdownContent || doc.originalContent;
    },

    // Delete document
    deleteDocument(documentId) {
        delete this.documentStorage[documentId];
        this.saveDocumentStorage();
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // Export all documents for an objective as markdown
    exportObjectiveDocumentsAsMarkdown(objectiveId) {
        const docs = this.getDocumentsForObjective(objectiveId);
        let combinedMarkdown = `# Evidence Documents for ${objectiveId}\n\n`;
        combinedMarkdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
        combinedMarkdown += `---\n\n`;

        docs.forEach(doc => {
            combinedMarkdown += `## ${doc.fileName}\n\n`;
            combinedMarkdown += `**Type:** ${doc.fileType}\n`;
            combinedMarkdown += `**Uploaded:** ${new Date(doc.uploadedAt).toLocaleString()}\n`;
            combinedMarkdown += `**Status:** ${doc.conversionStatus}\n\n`;
            
            if (doc.markdownContent) {
                combinedMarkdown += doc.markdownContent + '\n\n';
            } else if (doc.originalContent && !doc.shouldConvert) {
                combinedMarkdown += '```\n' + doc.originalContent + '\n```\n\n';
            }
            
            combinedMarkdown += `---\n\n`;
        });

        return combinedMarkdown;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DocumentConverter.init());
} else {
    DocumentConverter.init();
}
