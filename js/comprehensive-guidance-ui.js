// Comprehensive Guidance UI Module
// Renders the comprehensive implementation guidance for assessment objectives

const ComprehensiveGuidanceUI = {
    
    // Render comprehensive guidance for an objective
    renderGuidance: function(objectiveId, container) {
        // Check both guidance data sources
        const guidance = this.getGuidanceForObjective(objectiveId);
        
        if (!guidance) {
            return; // No comprehensive guidance available
        }
        
        const guidanceDiv = document.createElement('div');
        guidanceDiv.className = 'comprehensive-guidance';
        guidanceDiv.innerHTML = `
            <div class="guidance-header">
                <h4>📚 Comprehensive Implementation Guidance</h4>
                ${guidance.summary ? `<p class="guidance-summary">${guidance.summary}</p>` : ''}
            </div>
            ${this.renderGuidanceSections(guidance)}
        `;
        
        container.appendChild(guidanceDiv);
    },
    
    // Get guidance data for an objective
    getGuidanceForObjective: function(objectiveId) {
        // Check Part 1 (comprehensive-implementation-guidance.js)
        if (typeof COMPREHENSIVE_GUIDANCE !== 'undefined' && 
            COMPREHENSIVE_GUIDANCE.objectives && 
            COMPREHENSIVE_GUIDANCE.objectives[objectiveId]) {
            return COMPREHENSIVE_GUIDANCE.objectives[objectiveId];
        }
        
        // Check Part 2 (comprehensive-guidance-expansion-part2.js)
        if (typeof COMPREHENSIVE_GUIDANCE_PART2 !== 'undefined' && 
            COMPREHENSIVE_GUIDANCE_PART2.objectives && 
            COMPREHENSIVE_GUIDANCE_PART2.objectives[objectiveId]) {
            return COMPREHENSIVE_GUIDANCE_PART2.objectives[objectiveId];
        }
        
        return null;
    },
    
    // Render all guidance sections
    renderGuidanceSections: function(guidance) {
        let html = '<div class="guidance-sections">';
        
        // Cloud platforms
        if (guidance.cloud) {
            html += this.renderCloudSection(guidance.cloud);
        }
        
        // Containers/Kubernetes
        if (guidance.containers) {
            html += this.renderContainersSection(guidance.containers);
        }
        
        // SaaS platforms
        if (guidance.saas) {
            html += this.renderSaaSSection(guidance.saas);
        }
        
        // Custom applications
        if (guidance.custom_apps) {
            html += this.renderCustomAppsSection(guidance.custom_apps);
        }
        
        // Databases
        if (guidance.database) {
            html += this.renderDatabaseSection(guidance.database);
        }
        
        // Operating systems
        if (guidance.operating_system) {
            html += this.renderOSSection(guidance.operating_system);
        }
        
        // Network equipment
        if (guidance.network) {
            html += this.renderNetworkSection(guidance.network);
        }
        
        // Application layer
        if (guidance.application) {
            html += this.renderApplicationSection(guidance.application);
        }
        
        // Mobile devices
        if (guidance.mobile) {
            html += this.renderMobileSection(guidance.mobile);
        }
        
        // General implementation
        if (guidance.implementation) {
            html += this.renderGeneralImplementation(guidance.implementation);
        }
        
        // Small business approach
        if (guidance.small_business) {
            html += this.renderSmallBusinessSection(guidance.small_business);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render cloud platforms section
    renderCloudSection: function(cloud) {
        let html = '<div class="guidance-category"><h5>☁️ Cloud Platforms</h5>';
        
        if (cloud.aws) {
            html += this.renderPlatformCard('AWS', '🟠', cloud.aws);
        }
        if (cloud.azure) {
            html += this.renderPlatformCard('Azure', '🔷', cloud.azure);
        }
        if (cloud.gcp) {
            html += this.renderPlatformCard('GCP', '🔴', cloud.gcp);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render containers section
    renderContainersSection: function(containers) {
        let html = '<div class="guidance-category"><h5>🐳 Container Platforms</h5>';
        
        if (containers.kubernetes) {
            html += this.renderPlatformCard('Kubernetes', '⎈', containers.kubernetes);
        }
        if (containers.eks) {
            html += this.renderPlatformCard('Amazon EKS', '🟠', containers.eks);
        }
        if (containers.aks) {
            html += this.renderPlatformCard('Azure AKS', '🔷', containers.aks);
        }
        if (containers.gke) {
            html += this.renderPlatformCard('Google GKE', '🔴', containers.gke);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render SaaS section
    renderSaaSSection: function(saas) {
        let html = '<div class="guidance-category"><h5>📦 SaaS Platforms</h5>';
        
        if (saas.microsoft365) {
            html += this.renderPlatformCard('Microsoft 365', '🔷', saas.microsoft365);
        }
        if (saas.google_workspace) {
            html += this.renderPlatformCard('Google Workspace', '🔴', saas.google_workspace);
        }
        if (saas.salesforce) {
            html += this.renderPlatformCard('Salesforce', '☁️', saas.salesforce);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render database section
    renderDatabaseSection: function(database) {
        let html = '<div class="guidance-category"><h5>🗄️ Databases</h5>';
        
        if (database.postgresql) {
            html += this.renderPlatformCard('PostgreSQL', '🐘', database.postgresql);
        }
        if (database.mysql) {
            html += this.renderPlatformCard('MySQL', '🐬', database.mysql);
        }
        if (database.sqlserver) {
            html += this.renderPlatformCard('SQL Server', '🔷', database.sqlserver);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render OS section
    renderOSSection: function(os) {
        let html = '<div class="guidance-category"><h5>💻 Operating Systems</h5>';
        
        if (os.windows) {
            html += this.renderPlatformCard('Windows', '🪟', os.windows);
        }
        if (os.linux) {
            html += this.renderPlatformCard('Linux', '🐧', os.linux);
        }
        if (os.macos) {
            html += this.renderPlatformCard('macOS', '🍎', os.macos);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render network equipment section
    renderNetworkSection: function(network) {
        let html = '<div class="guidance-category"><h5>🌐 Network Equipment</h5>';
        
        if (network.paloalto) {
            html += this.renderPlatformCard('Palo Alto', '🔥', network.paloalto);
        }
        if (network.cisco) {
            html += this.renderPlatformCard('Cisco', '🔵', network.cisco);
        }
        if (network.fortinet) {
            html += this.renderPlatformCard('Fortinet', '🔴', network.fortinet);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render application section
    renderApplicationSection: function(application) {
        let html = '<div class="guidance-category"><h5>⚙️ Application Layer</h5>';
        
        if (application.nodejs) {
            html += this.renderPlatformCard('Node.js', '🟢', application.nodejs);
        }
        if (application.python) {
            html += this.renderPlatformCard('Python', '🐍', application.python);
        }
        if (application.dotnet) {
            html += this.renderPlatformCard('.NET', '🔷', application.dotnet);
        }
        if (application.general) {
            html += this.renderPlatformCard('General', '⚙️', application.general);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render mobile section
    renderMobileSection: function(mobile) {
        let html = '<div class="guidance-category"><h5>📱 Mobile Devices</h5>';
        
        if (mobile.ios) {
            html += this.renderPlatformCard('iOS', '🍎', mobile.ios);
        }
        if (mobile.android) {
            html += this.renderPlatformCard('Android', '🤖', mobile.android);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render custom apps section
    renderCustomAppsSection: function(customApps) {
        let html = '<div class="guidance-category"><h5>🛠️ Custom Applications</h5>';
        
        Object.keys(customApps).forEach(appKey => {
            const app = customApps[appKey];
            const title = appKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            html += this.renderPlatformCard(title, '🛠️', app);
        });
        
        html += '</div>';
        return html;
    },
    
    // Render general implementation
    renderGeneralImplementation: function(implementation) {
        let html = '<div class="guidance-category"><h5>📋 General Implementation</h5>';
        
        if (implementation.general) {
            html += this.renderPlatformCard('General Guidance', '📋', implementation.general);
        }
        
        html += '</div>';
        return html;
    },
    
    // Render small business section
    renderSmallBusinessSection: function(smallBiz) {
        let html = `
            <div class="guidance-category small-business-section">
                <h5>💼 Small Business Approach</h5>
                <div class="platform-card">
                    <div class="card-header">
                        <span class="platform-icon">💰</span>
                        <span class="platform-name">Budget-Friendly Implementation</span>
                    </div>
                    <div class="card-body">
                        ${smallBiz.budget_tier ? `<p><strong>Budget Tier:</strong> ${smallBiz.budget_tier}</p>` : ''}
                        ${smallBiz.recommended_approach ? `<p><strong>Approach:</strong> ${smallBiz.recommended_approach}</p>` : ''}
                        ${smallBiz.approach ? `<p><strong>Approach:</strong> ${smallBiz.approach}</p>` : ''}
                        ${smallBiz.implementation && smallBiz.implementation.steps ? `
                            <div class="implementation-steps">
                                <strong>Steps:</strong>
                                <ol>
                                    ${smallBiz.implementation.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        ` : ''}
                        ${smallBiz.implementation && smallBiz.implementation.tools ? `
                            <div class="tools-list">
                                <strong>Tools:</strong>
                                <ul>
                                    ${smallBiz.implementation.tools.map(tool => 
                                        `<li><strong>${tool.name}</strong> - ${tool.cost} (${tool.purpose})</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${smallBiz.total_cost_estimate || smallBiz.cost_estimate ? `
                            <p class="cost-estimate"><strong>💵 Cost:</strong> ${smallBiz.total_cost_estimate || smallBiz.cost_estimate}</p>
                        ` : ''}
                        ${smallBiz.implementation && smallBiz.implementation.effort_hours ? `
                            <p class="effort-estimate"><strong>⏱️ Effort:</strong> ${smallBiz.implementation.effort_hours} hours</p>
                        ` : smallBiz.effort_hours ? `
                            <p class="effort-estimate"><strong>⏱️ Effort:</strong> ${smallBiz.effort_hours} hours</p>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        return html;
    },
    
    // Render individual platform card
    renderPlatformCard: function(name, icon, platform) {
        const impl = platform.implementation || platform;
        
        let html = `
            <div class="platform-card">
                <div class="card-header">
                    <span class="platform-icon">${icon}</span>
                    <span class="platform-name">${name}</span>
                </div>
                <div class="card-body">
        `;
        
        // Services/Features
        if (platform.services) {
            html += `<p><strong>Services:</strong> ${platform.services.join(', ')}</p>`;
        }
        if (platform.features) {
            html += `<p><strong>Features:</strong> ${platform.features.join(', ')}</p>`;
        }
        
        // Implementation steps
        if (impl.steps && impl.steps.length > 0) {
            html += `
                <div class="implementation-steps">
                    <strong>Implementation Steps:</strong>
                    <ol>
                        ${impl.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        // Code examples
        if (impl.terraform_example) {
            html += `<details class="code-example"><summary>📄 Terraform Example</summary><pre><code>${this.escapeHtml(impl.terraform_example)}</code></pre></details>`;
        }
        if (impl.yaml_example) {
            html += `<details class="code-example"><summary>📄 YAML Example</summary><pre><code>${this.escapeHtml(impl.yaml_example)}</code></pre></details>`;
        }
        if (impl.azure_cli_example) {
            html += `<details class="code-example"><summary>📄 Azure CLI Example</summary><pre><code>${this.escapeHtml(impl.azure_cli_example)}</code></pre></details>`;
        }
        if (impl.gcloud_example) {
            html += `<details class="code-example"><summary>📄 gcloud Example</summary><pre><code>${this.escapeHtml(impl.gcloud_example)}</code></pre></details>`;
        }
        if (impl.powershell_example) {
            html += `<details class="code-example"><summary>📄 PowerShell Example</summary><pre><code>${this.escapeHtml(impl.powershell_example)}</code></pre></details>`;
        }
        if (impl.sql_example) {
            html += `<details class="code-example"><summary>📄 SQL Example</summary><pre><code>${this.escapeHtml(impl.sql_example)}</code></pre></details>`;
        }
        if (impl.code_example) {
            html += `<details class="code-example"><summary>📄 Code Example</summary><pre><code>${this.escapeHtml(impl.code_example)}</code></pre></details>`;
        }
        if (impl.cli_example) {
            html += `<details class="code-example"><summary>📄 CLI Example</summary><pre><code>${this.escapeHtml(impl.cli_example)}</code></pre></details>`;
        }
        
        // Banner template (for AC.L2-3.1.9)
        if (impl.banner_template) {
            html += `<details class="code-example"><summary>📄 Banner Template</summary><pre><code>${this.escapeHtml(impl.banner_template)}</code></pre></details>`;
        }
        
        // Verification steps
        if (impl.verification && impl.verification.length > 0) {
            html += `
                <div class="verification-steps">
                    <strong>✅ Verification:</strong>
                    <ul>
                        ${impl.verification.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Cost and effort estimates
        if (impl.cost_estimate) {
            html += `<p class="cost-estimate"><strong>💵 Cost:</strong> ${impl.cost_estimate}</p>`;
        }
        if (impl.effort_hours) {
            html += `<p class="effort-estimate"><strong>⏱️ Effort:</strong> ${impl.effort_hours} hours</p>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    },
    
    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ComprehensiveGuidanceUI = ComprehensiveGuidanceUI;
}

console.log('[ComprehensiveGuidanceUI] Module loaded');
