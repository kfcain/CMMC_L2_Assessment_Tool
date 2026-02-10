// MSP Portal Views - Extended view renderers for MSP Command Center

const MSPPortalViews = {
    // ==================== CLIENTS VIEW ====================
    clients: function(portal) {
        const clients = portal.state.clients;
        const totalClients = clients.length;
        const readyCount = clients.filter(c => (c.completionPercent || 0) >= 100).length;
        const avgSprs = totalClients > 0 ? Math.round(clients.reduce((s, c) => s + (c.sprsScore || 0), 0) / totalClients) : 0;

        return `
        <div class="msp-clients-view">
            <div class="msp-view-header">
                <div class="msp-search-bar"><input type="search" placeholder="Search clients..." class="msp-search-input" id="msp-client-search"></div>
                <div class="cp-header-stats">
                    <span class="cp-stat">${totalClients} client${totalClients !== 1 ? 's' : ''}</span>
                    <span class="cp-stat good">${readyCount} ready</span>
                    <span class="cp-stat">Avg SPRS: ${avgSprs}</span>
                </div>
                <button class="msp-btn-primary" data-action="add-client">${portal.getIcon('user-plus')} Add Client</button>
            </div>
            <div class="msp-client-grid">
                ${clients.length > 0 ? clients.map(c => this.renderClientCard(c, portal)).join('') : this.renderEmptyClients(portal)}
            </div>
        </div>`;
    },

    renderClientCard: function(client, portal) {
        const tasks = this._getKanbanTasks(client.id);
        const taskStats = this._getKanbanStats(tasks);
        const pct = client.completionPercent || 0;
        const statusClass = pct >= 100 ? 'ready' : pct >= 50 ? 'progress' : 'early';
        const statusLabel = pct >= 100 ? 'Assessment Ready' : pct >= 50 ? 'In Progress' : 'Early Stage';
        const sprsClass = (client.sprsScore ?? -1) >= 70 ? 'good' : (client.sprsScore ?? -1) >= 0 ? 'warning' : '';
        const nextDate = client.nextAssessment ? new Date(client.nextAssessment) : null;
        const daysUntil = nextDate ? Math.ceil((nextDate - new Date()) / 86400000) : null;

        return `
        <div class="msp-client-card" data-client-id="${client.id}">
            <div class="client-card-header">
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <div class="client-meta-row">
                        <span class="client-industry">${client.industry || 'Defense'}</span>
                        <span class="cp-status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <span class="level-badge large">L${client.assessmentLevel}</span>
            </div>
            <div class="client-card-metrics">
                <div class="metric"><span class="metric-value ${sprsClass}">${client.sprsScore ?? '--'}</span><span class="metric-label">SPRS</span></div>
                <div class="metric"><span class="metric-value">${pct}%</span><span class="metric-label">Complete</span></div>
                <div class="metric"><span class="metric-value">${client.poamCount || 0}</span><span class="metric-label">POA&M</span></div>
                <div class="metric"><span class="metric-value">${taskStats.total}</span><span class="metric-label">Tasks</span></div>
            </div>
            <div class="client-card-progress"><div class="progress-bar"><div class="progress-fill ${statusClass}" style="width:${pct}%"></div></div></div>
            ${nextDate ? `<div class="cp-next-assessment ${daysUntil !== null && daysUntil < 30 ? 'urgent' : ''}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Assessment: ${nextDate.toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}${daysUntil !== null ? ` (${daysUntil > 0 ? daysUntil + 'd' : 'overdue'})` : ''}
            </div>` : ''}
            ${taskStats.overdue > 0 ? `<div class="cp-alert"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${taskStats.overdue} overdue task${taskStats.overdue > 1 ? 's' : ''}</div>` : ''}
            <div class="client-card-actions">
                <button class="msp-btn-secondary" data-action="open-client-project" data-param="${client.id}">${portal.getIcon('calendar')} Board</button>
                <button class="msp-btn-secondary" data-action="switch-view" data-param="reports">${portal.getIcon('file-text')} Report</button>
                <button class="msp-btn-icon" data-action="edit-client" data-param="${client.id}" title="Edit client">${portal.getIcon('edit')}</button>
                <button class="msp-btn-icon msp-btn-icon-danger" data-action="remove-client" data-param="${client.id}" title="Remove client">${portal.getIcon('x')}</button>
            </div>
        </div>`;
    },

    renderEmptyClients: function(portal) {
        return `<div class="msp-empty-state full-width"><div class="empty-icon">${portal.getIcon('users')}</div><h3>No Clients Yet</h3><p>Add your first client to start managing CMMC assessments</p><button class="msp-btn-primary" data-action="add-client">${portal.getIcon('user-plus')} Add First Client</button></div>`;
    },

    // ==================== PROJECTS VIEW (KANBAN) ====================
    projects: function(portal) {
        const clients = portal.state.clients;
        const selectedClient = portal._kanbanClient || (clients.length > 0 ? clients[0].id : null);
        const client = clients.find(c => c.id === selectedClient);
        let tasks = this._getKanbanTasks(selectedClient);
        const columns = [
            { id: 'backlog', name: 'Backlog', color: '#4e5263' },
            { id: 'todo', name: 'To Do', color: '#6c8aff' },
            { id: 'in-progress', name: 'In Progress', color: '#f59e0b' },
            { id: 'review', name: 'Review', color: '#8b5cf6' },
            { id: 'done', name: 'Done', color: '#34d399' }
        ];

        if (clients.length === 0) {
            return `<div class="msp-empty-state"><div class="empty-icon">${portal.getIcon('calendar')}</div><h3>No Projects</h3><p>Add clients to create project plans</p><button class="msp-btn-primary" data-action="add-client">${portal.getIcon('user-plus')} Add Client</button></div>`;
        }

        const stats = this._getKanbanStats(tasks);
        const showSeedPrompt = tasks.length === 0 && selectedClient;

        return `
        <div class="kb-planner">
            <div class="kb-header">
                <div class="kb-client-select">
                    <select class="stg-select" id="kb-client-picker">
                        ${clients.map(c => `<option value="${c.id}" ${c.id === selectedClient ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                    ${client ? `<span class="kb-level-badge">L${client.assessmentLevel}</span>` : ''}
                </div>
                <div class="kb-actions">
                    <div class="kb-stats">
                        <span class="kb-stat">${stats.total} tasks</span>
                        <span class="kb-stat done">${stats.done} done</span>
                        ${stats.overdue > 0 ? `<span class="kb-stat overdue">${stats.overdue} overdue</span>` : ''}
                    </div>
                    <button class="msp-btn-secondary" data-action="seed-tasks" data-param="${selectedClient}" title="Load default CMMC tasks">
                        ${portal.getIcon('refresh-cw')} Seed Tasks
                    </button>
                    <button class="msp-btn-primary" data-action="add-task" data-param="${selectedClient}">
                        ${portal.getIcon('plus')} Add Task
                    </button>
                </div>
            </div>
            ${showSeedPrompt ? `
            <div class="kb-seed-prompt">
                <p>No tasks yet for this client. Start with default CMMC assessment tasks?</p>
                <button class="msp-btn-primary" data-action="seed-tasks" data-param="${selectedClient}">
                    ${portal.getIcon('plus')} Load Default CMMC Tasks
                </button>
            </div>` : ''}
            <div class="kb-board" id="kb-board">
                ${columns.map(col => {
                    const colTasks = tasks.filter(t => t.status === col.id);
                    return `
                    <div class="kb-column" data-column="${col.id}">
                        <div class="kb-col-header">
                            <span class="kb-col-dot" style="background:${col.color}"></span>
                            <span class="kb-col-name">${col.name}</span>
                            <span class="kb-col-count">${colTasks.length}</span>
                        </div>
                        <div class="kb-col-body" data-column="${col.id}">
                            ${colTasks.map(task => this._renderKanbanCard(task, portal)).join('')}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    },

    _renderKanbanCard: function(task, portal) {
        const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#34d399' };
        const tagColors = ['#6c8aff', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
        return `
        <div class="kb-card ${isOverdue ? 'overdue' : ''}" draggable="true" data-task-id="${task.id}">
            <div class="kb-card-top">
                <span class="kb-priority" style="background:${priorityColors[task.priority] || '#4e5263'}" title="${task.priority || 'normal'} priority"></span>
                <div class="kb-card-actions">
                    <button class="kb-card-btn" data-action="edit-task" data-param="${task.id}" title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="kb-card-btn" data-action="delete-task" data-param="${task.id}" title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                </div>
            </div>
            <div class="kb-card-title">${task.title}</div>
            ${task.description ? `<div class="kb-card-desc">${task.description}</div>` : ''}
            <div class="kb-card-meta">
                ${(task.tags || []).map((tag, i) => `<span class="kb-tag" style="background:${tagColors[i % tagColors.length]}20;color:${tagColors[i % tagColors.length]}">${tag}</span>`).join('')}
            </div>
            <div class="kb-card-footer">
                ${task.assignee ? `<span class="kb-assignee" title="${task.assignee}">${task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}</span>` : ''}
                ${task.dueDate ? `<span class="kb-due ${isOverdue ? 'overdue' : ''}">${new Date(task.dueDate).toLocaleDateString('en-US', {month:'short',day:'numeric'})}</span>` : ''}
            </div>
        </div>`;
    },

    _getKanbanTasks: function(clientId) {
        if (!clientId) return [];
        try {
            const all = JSON.parse(localStorage.getItem('msp_kanban_tasks') || '{}');
            return all[clientId] || [];
        } catch(e) { return []; }
    },

    _saveKanbanTasks: function(clientId, tasks) {
        try {
            const all = JSON.parse(localStorage.getItem('msp_kanban_tasks') || '{}');
            all[clientId] = tasks;
            localStorage.setItem('msp_kanban_tasks', JSON.stringify(all));
        } catch(e) { console.error('[Kanban] Save failed', e); }
    },

    _getKanbanStats: function(tasks) {
        const now = new Date();
        return {
            total: tasks.length,
            done: tasks.filter(t => t.status === 'done').length,
            overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length
        };
    },

    _switchKanbanClient: function(clientId) {
        if (typeof MSPPortal !== 'undefined') {
            MSPPortal._kanbanClient = clientId;
            MSPPortal.switchView('projects');
        }
    },

    _dragTask: function(e, taskId) {
        e.dataTransfer.setData('text/plain', taskId);
        e.target.classList.add('dragging');
    },

    _dropTask: function(e, columnId) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        const clientId = document.getElementById('kb-client-picker')?.value;
        if (!clientId || !taskId) return;
        const tasks = this._getKanbanTasks(clientId);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = columnId;
            task.updatedAt = new Date().toISOString();
            this._saveKanbanTasks(clientId, tasks);
            if (typeof MSPPortal !== 'undefined') MSPPortal.switchView('projects');
        }
    },

    _showAddTaskModal: function(clientId) {
        const modal = document.createElement('div');
        modal.className = 'msp-modal-overlay';
        modal.id = 'kb-task-modal';
        modal.innerHTML = `
        <div class="msp-modal" style="max-width:500px">
            <div class="msp-modal-header"><h3>Add Task</h3><button class="msp-modal-close" id="kb-add-task-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <div class="msp-modal-body">
                <div class="msp-form-group"><label>Title *</label><input type="text" id="kb-task-title" class="stg-input" style="width:100%" required placeholder="Task title"></div>
                <div class="msp-form-group"><label>Description</label><textarea id="kb-task-desc" class="stg-input" style="width:100%;min-height:60px" placeholder="Optional description"></textarea></div>
                <div class="msp-form-row" style="display:flex;gap:10px">
                    <div class="msp-form-group" style="flex:1"><label>Priority</label><select id="kb-task-priority" class="stg-select"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div>
                    <div class="msp-form-group" style="flex:1"><label>Status</label><select id="kb-task-status" class="stg-select"><option value="backlog">Backlog</option><option value="todo" selected>To Do</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="done">Done</option></select></div>
                </div>
                <div class="msp-form-row" style="display:flex;gap:10px">
                    <div class="msp-form-group" style="flex:1"><label>Due Date</label><input type="date" id="kb-task-due" class="stg-input" style="width:100%"></div>
                    <div class="msp-form-group" style="flex:1"><label>Assignee</label><input type="text" id="kb-task-assignee" class="stg-input" style="width:100%" placeholder="Name"></div>
                </div>
                <div class="msp-form-group"><label>Tags (comma-separated)</label><input type="text" id="kb-task-tags" class="stg-input" style="width:100%" placeholder="SSP, AC, remediation..."></div>
            </div>
            <div class="msp-modal-footer" style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--glass-border,rgba(255,255,255,0.05))">
                <button class="msp-btn-secondary" id="kb-add-task-cancel">Cancel</button>
                <button class="msp-btn-primary" id="kb-add-task-submit">Add Task</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        document.getElementById('kb-add-task-close')?.addEventListener('click', () => document.getElementById('kb-task-modal')?.remove());
        document.getElementById('kb-add-task-cancel')?.addEventListener('click', () => document.getElementById('kb-task-modal')?.remove());
        document.getElementById('kb-add-task-submit')?.addEventListener('click', () => this._submitAddTask(clientId));
        document.getElementById('kb-task-title')?.focus();
    },

    _submitAddTask: function(clientId) {
        const title = document.getElementById('kb-task-title')?.value?.trim();
        if (!title) return;
        const tasks = this._getKanbanTasks(clientId);
        tasks.push({
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            title: title,
            description: document.getElementById('kb-task-desc')?.value?.trim() || '',
            priority: document.getElementById('kb-task-priority')?.value || 'medium',
            status: document.getElementById('kb-task-status')?.value || 'todo',
            dueDate: document.getElementById('kb-task-due')?.value || '',
            assignee: document.getElementById('kb-task-assignee')?.value?.trim() || '',
            tags: (document.getElementById('kb-task-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        this._saveKanbanTasks(clientId, tasks);
        document.getElementById('kb-task-modal')?.remove();
        if (typeof MSPPortal !== 'undefined') MSPPortal.switchView('projects');
    },

    _editTask: function(taskId) {
        const clientId = document.getElementById('kb-client-picker')?.value;
        if (!clientId) return;
        const tasks = this._getKanbanTasks(clientId);
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const modal = document.createElement('div');
        modal.className = 'msp-modal-overlay';
        modal.id = 'kb-task-modal';
        modal.innerHTML = `
        <div class="msp-modal" style="max-width:500px">
            <div class="msp-modal-header"><h3>Edit Task</h3><button class="msp-modal-close" id="kb-edit-task-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <div class="msp-modal-body">
                <div class="msp-form-group"><label>Title *</label><input type="text" id="kb-task-title" class="stg-input" style="width:100%" value="${task.title.replace(/"/g, '&quot;')}"></div>
                <div class="msp-form-group"><label>Description</label><textarea id="kb-task-desc" class="stg-input" style="width:100%;min-height:60px">${task.description || ''}</textarea></div>
                <div class="msp-form-row" style="display:flex;gap:10px">
                    <div class="msp-form-group" style="flex:1"><label>Priority</label><select id="kb-task-priority" class="stg-select"><option value="low" ${task.priority==='low'?'selected':''}>Low</option><option value="medium" ${task.priority==='medium'?'selected':''}>Medium</option><option value="high" ${task.priority==='high'?'selected':''}>High</option></select></div>
                    <div class="msp-form-group" style="flex:1"><label>Status</label><select id="kb-task-status" class="stg-select"><option value="backlog" ${task.status==='backlog'?'selected':''}>Backlog</option><option value="todo" ${task.status==='todo'?'selected':''}>To Do</option><option value="in-progress" ${task.status==='in-progress'?'selected':''}>In Progress</option><option value="review" ${task.status==='review'?'selected':''}>Review</option><option value="done" ${task.status==='done'?'selected':''}>Done</option></select></div>
                </div>
                <div class="msp-form-row" style="display:flex;gap:10px">
                    <div class="msp-form-group" style="flex:1"><label>Due Date</label><input type="date" id="kb-task-due" class="stg-input" style="width:100%" value="${task.dueDate || ''}"></div>
                    <div class="msp-form-group" style="flex:1"><label>Assignee</label><input type="text" id="kb-task-assignee" class="stg-input" style="width:100%" value="${(task.assignee || '').replace(/"/g, '&quot;')}"></div>
                </div>
                <div class="msp-form-group"><label>Tags (comma-separated)</label><input type="text" id="kb-task-tags" class="stg-input" style="width:100%" value="${(task.tags || []).join(', ')}"></div>
            </div>
            <div class="msp-modal-footer" style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--glass-border,rgba(255,255,255,0.05))">
                <button class="msp-btn-secondary" id="kb-edit-task-cancel">Cancel</button>
                <button class="msp-btn-primary" id="kb-edit-task-submit">Save</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        document.getElementById('kb-edit-task-close')?.addEventListener('click', () => document.getElementById('kb-task-modal')?.remove());
        document.getElementById('kb-edit-task-cancel')?.addEventListener('click', () => document.getElementById('kb-task-modal')?.remove());
        document.getElementById('kb-edit-task-submit')?.addEventListener('click', () => this._submitEditTask(clientId, taskId));
    },

    _submitEditTask: function(clientId, taskId) {
        const title = document.getElementById('kb-task-title')?.value?.trim();
        if (!title) return;
        const tasks = this._getKanbanTasks(clientId);
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        task.title = title;
        task.description = document.getElementById('kb-task-desc')?.value?.trim() || '';
        task.priority = document.getElementById('kb-task-priority')?.value || 'medium';
        task.status = document.getElementById('kb-task-status')?.value || 'todo';
        task.dueDate = document.getElementById('kb-task-due')?.value || '';
        task.assignee = document.getElementById('kb-task-assignee')?.value?.trim() || '';
        task.tags = (document.getElementById('kb-task-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
        task.updatedAt = new Date().toISOString();
        this._saveKanbanTasks(clientId, tasks);
        document.getElementById('kb-task-modal')?.remove();
        if (typeof MSPPortal !== 'undefined') MSPPortal.switchView('projects');
    },

    _deleteTask: function(taskId) {
        if (!confirm('Delete this task?')) return;
        const clientId = document.getElementById('kb-client-picker')?.value;
        if (!clientId) return;
        let tasks = this._getKanbanTasks(clientId);
        tasks = tasks.filter(t => t.id !== taskId);
        this._saveKanbanTasks(clientId, tasks);
        if (typeof MSPPortal !== 'undefined') MSPPortal.switchView('projects');
    },

    _seedDefaultTasks: function(clientId) {
        if (!clientId) return;
        const existing = this._getKanbanTasks(clientId);
        if (existing.length > 0 && !confirm('This will add default CMMC tasks. Existing tasks will be kept. Continue?')) return;
        const now = new Date().toISOString();
        const mkId = () => 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        const defaults = [
            { title: 'Define CUI Scope & Data Flows', description: 'Identify all CUI data types, where they are stored/processed/transmitted, and document data flow diagrams.', priority: 'high', status: 'todo', tags: ['Scoping', 'CUI'] },
            { title: 'Complete System Security Plan (SSP)', description: 'Draft or update the SSP covering all 110 CMMC L2 controls with implementation descriptions.', priority: 'high', status: 'backlog', tags: ['SSP', 'Documentation'] },
            { title: 'Conduct Gap Assessment', description: 'Assess current state against all CMMC L2 objectives. Document MET, NOT MET, and PARTIAL findings.', priority: 'high', status: 'todo', tags: ['Assessment', 'Gap Analysis'] },
            { title: 'Deploy Endpoint Protection (EDR/XDR)', description: 'Ensure all endpoints in CUI scope have EDR/XDR deployed and reporting to SIEM.', priority: 'high', status: 'backlog', tags: ['SI', 'Endpoint'] },
            { title: 'Configure MFA for All Users', description: 'Enable phishing-resistant MFA for all user accounts accessing CUI systems.', priority: 'high', status: 'backlog', tags: ['IA', 'MFA'] },
            { title: 'Implement Audit Logging', description: 'Configure centralized logging for authentication, authorization, and system events per AU family.', priority: 'high', status: 'backlog', tags: ['AU', 'SIEM'] },
            { title: 'Vulnerability Scanning Program', description: 'Set up recurring vulnerability scans (Tenable/Qualys) and establish remediation SLAs.', priority: 'medium', status: 'backlog', tags: ['RA', 'Vulnerability'] },
            { title: 'Security Awareness Training', description: 'Enroll all users in security awareness training (KnowBe4) and schedule phishing simulations.', priority: 'medium', status: 'backlog', tags: ['AT', 'Training'] },
            { title: 'Develop Incident Response Plan', description: 'Create IR plan with roles, procedures, communication templates, and DFARS 72-hour reporting process.', priority: 'medium', status: 'backlog', tags: ['IR', 'DFARS'] },
            { title: 'Create POA&M for Gaps', description: 'Document all NOT MET findings in POA&M with milestones, responsible parties, and target dates.', priority: 'medium', status: 'backlog', tags: ['POA&M', 'Remediation'] },
            { title: 'Network Segmentation Review', description: 'Verify CUI enclave is properly segmented from non-CUI networks. Document boundary protections.', priority: 'medium', status: 'backlog', tags: ['SC', 'Network'] },
            { title: 'FIPS 140-2 Crypto Validation', description: 'Verify all encryption for CUI at rest and in transit uses FIPS 140-2 validated modules.', priority: 'medium', status: 'backlog', tags: ['SC', 'FIPS'] },
            { title: 'Physical Security Assessment', description: 'Assess physical access controls, visitor logs, and media protection for CUI areas.', priority: 'low', status: 'backlog', tags: ['PE', 'MP'] },
            { title: 'Configuration Management Baselines', description: 'Establish and document secure configuration baselines (CIS/DISA STIGs) for all system components.', priority: 'medium', status: 'backlog', tags: ['CM', 'Baselines'] },
            { title: 'Pre-Assessment Readiness Review', description: 'Conduct internal mock assessment. Verify all evidence artifacts are collected and organized.', priority: 'low', status: 'backlog', tags: ['C3PAO', 'Readiness'] },
        ];
        const tasks = [...existing, ...defaults.map(d => ({ ...d, id: mkId(), dueDate: '', assignee: '', createdAt: now, updatedAt: now }))];
        this._saveKanbanTasks(clientId, tasks);
        if (typeof MSPPortal !== 'undefined') MSPPortal.switchView('projects');
    },

    // ==================== EVIDENCE VIEW ====================
    evidence: function(portal) {
        if (typeof EvidenceBuilder !== 'undefined') return EvidenceBuilder.renderEvidenceBuilder();
        return '<div class="msp-loading">Loading Evidence Builder...</div>';
    },

    // ==================== REPORTS VIEW ====================
    reports: function(portal) {
        return `
        <div class="msp-reports-view">
            <div class="reports-grid">
                <div class="report-card" data-action="generate-report" data-param="executive"><div class="report-icon">${portal.getIcon('file-text')}</div><h4>Executive Summary</h4><p>High-level compliance status</p></div>
                <div class="report-card" data-action="generate-report" data-param="gap"><div class="report-icon">${portal.getIcon('activity')}</div><h4>Gap Analysis</h4><p>Detailed findings & remediation</p></div>
                <div class="report-card" data-action="generate-report" data-param="c3pao"><div class="report-icon">${portal.getIcon('check-circle')}</div><h4>C3PAO Readiness</h4><p>Pre-assessment checklist</p></div>
                <div class="report-card" data-action="generate-report" data-param="ssp"><div class="report-icon">${portal.getIcon('book')}</div><h4>SSP Appendix</h4><p>Implementation statements</p></div>
                <div class="report-card" data-action="export-portfolio"><div class="report-icon">${portal.getIcon('users')}</div><h4>Portfolio Summary</h4><p>All clients overview</p></div>
                <div class="report-card" data-action="generate-report" data-param="poam"><div class="report-icon">${portal.getIcon('list')}</div><h4>POA&M Report</h4><p>Plan of Action & Milestones</p></div>
            </div>
        </div>`;
    },

    // ==================== ANALYTICS DASHBOARD VIEW ====================
    analytics: function(portal) {
        const clients = portal.state.clients;
        const now = new Date();
        const esc = typeof Sanitize !== 'undefined' ? Sanitize.html : (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

        // Aggregate metrics
        const totalClients = clients.length;
        const avgSprs = totalClients > 0 ? Math.round(clients.reduce((s, c) => s + (c.sprsScore || 0), 0) / totalClients) : 0;
        const avgCompletion = totalClients > 0 ? Math.round(clients.reduce((s, c) => s + (c.completionPercent || 0), 0) / totalClients) : 0;
        const readyCount = clients.filter(c => (c.completionPercent || 0) >= 100).length;
        const atRiskCount = clients.filter(c => c.sprsScore !== null && c.sprsScore !== undefined && c.sprsScore < 70).length;
        const totalPoam = clients.reduce((s, c) => s + (c.poamCount || 0), 0);
        const upcomingAssessments = clients.filter(c => {
            if (!c.nextAssessment) return false;
            const d = new Date(c.nextAssessment);
            return d >= now && d <= new Date(now.getTime() + 90 * 86400000);
        }).length;

        // SPRS distribution buckets
        const sprsBuckets = { 'Below 0': 0, '0-49': 0, '50-69': 0, '70-89': 0, '90-110': 0 };
        clients.forEach(c => {
            const s = c.sprsScore;
            if (s == null) return;
            if (s < 0) sprsBuckets['Below 0']++;
            else if (s < 50) sprsBuckets['0-49']++;
            else if (s < 70) sprsBuckets['50-69']++;
            else if (s < 90) sprsBuckets['70-89']++;
            else sprsBuckets['90-110']++;
        });
        const sprsMax = Math.max(1, ...Object.values(sprsBuckets));

        // Level distribution
        const levelDist = { '1': 0, '2': 0, '3': 0 };
        clients.forEach(c => { levelDist[String(c.assessmentLevel || '2')]++; });

        // Industry distribution
        const industries = {};
        clients.forEach(c => { const ind = c.industry || 'Other'; industries[ind] = (industries[ind] || 0) + 1; });

        // Risk color helper
        const riskColor = (score) => {
            if (score == null) return 'var(--text-muted)';
            if (score >= 90) return 'var(--status-met, #34d399)';
            if (score >= 70) return 'var(--status-partial, #fbbf24)';
            return 'var(--status-not-met, #f87171)';
        };

        // Sparkline SVG helper (mini bar chart)
        const miniBar = (vals, maxH) => {
            if (vals.length === 0) return '';
            const mx = Math.max(1, ...vals);
            const w = 4, gap = 2, totalW = vals.length * (w + gap);
            return `<svg width="${totalW}" height="${maxH}" viewBox="0 0 ${totalW} ${maxH}">${vals.map((v, i) => {
                const h = Math.max(1, (v / mx) * maxH);
                const color = v / mx > 0.7 ? 'var(--status-met)' : v / mx > 0.4 ? 'var(--status-partial)' : 'var(--status-not-met)';
                return `<rect x="${i * (w + gap)}" y="${maxH - h}" width="${w}" height="${h}" rx="1" fill="${color}" opacity="0.8"/>`;
            }).join('')}</svg>`;
        };

        return `
        <div class="splunk-analytics">
            <!-- Ticker Strip -->
            <div class="splk-ticker">
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val">${totalClients}</div>
                    <div class="splk-ticker-lbl">Total Clients</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val" style="color:var(--status-met)">${readyCount}</div>
                    <div class="splk-ticker-lbl">Assessment Ready</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val" style="color:var(--status-not-met)">${atRiskCount}</div>
                    <div class="splk-ticker-lbl">At Risk</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val">${avgSprs}</div>
                    <div class="splk-ticker-lbl">Avg SPRS</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val">${avgCompletion}%</div>
                    <div class="splk-ticker-lbl">Avg Completion</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val" style="color:var(--status-partial)">${totalPoam}</div>
                    <div class="splk-ticker-lbl">Open POA&Ms</div>
                </div>
                <div class="splk-ticker-sep"></div>
                <div class="splk-ticker-item">
                    <div class="splk-ticker-val">${upcomingAssessments}</div>
                    <div class="splk-ticker-lbl">Assessments (90d)</div>
                </div>
            </div>

            <!-- Panel Grid -->
            <div class="splk-grid">

                <!-- SPRS Distribution -->
                <div class="splk-panel">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('bar-chart')} SPRS Score Distribution</span>
                        <span class="splk-panel-badge">${totalClients} clients</span>
                    </div>
                    <div class="splk-panel-body">
                        ${totalClients === 0 ? '<div class="splk-empty">Add clients to see distribution</div>' : `
                        <div class="splk-bar-chart">
                            ${Object.entries(sprsBuckets).map(([label, count]) => `
                                <div class="splk-bar-row">
                                    <div class="splk-bar-label">${label}</div>
                                    <div class="splk-bar-track">
                                        <div class="splk-bar-fill ${label === '90-110' ? 'green' : label === '70-89' ? 'blue' : label === '50-69' ? 'amber' : 'red'}" style="width:${(count / sprsMax) * 100}%"></div>
                                    </div>
                                    <div class="splk-bar-count">${count}</div>
                                </div>
                            `).join('')}
                        </div>`}
                    </div>
                </div>

                <!-- Client Risk Matrix -->
                <div class="splk-panel">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('alert-triangle')} Client Risk Matrix</span>
                    </div>
                    <div class="splk-panel-body">
                        ${totalClients === 0 ? '<div class="splk-empty">No client data</div>' : `
                        <div class="splk-risk-table">
                            <div class="splk-risk-header">
                                <span>Client</span><span>SPRS</span><span>Progress</span><span>Risk</span>
                            </div>
                            ${clients.slice().sort((a, b) => (a.sprsScore || -999) - (b.sprsScore || -999)).slice(0, 8).map(c => {
                                const risk = (c.sprsScore == null || c.sprsScore < 50) ? 'CRITICAL' : c.sprsScore < 70 ? 'HIGH' : c.sprsScore < 90 ? 'MEDIUM' : 'LOW';
                                const riskClass = risk === 'CRITICAL' ? 'critical' : risk === 'HIGH' ? 'high' : risk === 'MEDIUM' ? 'medium' : 'low';
                                return `<div class="splk-risk-row">
                                    <span class="splk-risk-name">${esc(c.name)}</span>
                                    <span style="color:${riskColor(c.sprsScore)};font-weight:600">${c.sprsScore ?? '--'}</span>
                                    <span>
                                        <div class="splk-mini-bar"><div class="splk-mini-fill" style="width:${c.completionPercent || 0}%"></div></div>
                                    </span>
                                    <span class="splk-risk-badge ${riskClass}">${risk}</span>
                                </div>`;
                            }).join('')}
                        </div>`}
                    </div>
                </div>

                <!-- Portfolio Compliance Heatmap -->
                <div class="splk-panel splk-wide">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('layout')} Portfolio Compliance Heatmap</span>
                    </div>
                    <div class="splk-panel-body">
                        ${totalClients === 0 ? '<div class="splk-empty">Add clients to see heatmap</div>' : `
                        <div class="splk-heatmap">
                            ${clients.map(c => {
                                const pct = c.completionPercent || 0;
                                const hue = pct >= 90 ? '160' : pct >= 70 ? '45' : pct >= 40 ? '30' : '0';
                                const sat = '70%';
                                const light = pct >= 90 ? '40%' : pct >= 70 ? '45%' : '45%';
                                return `<div class="splk-hm-cell" title="${esc(c.name)}: ${pct}% complete, SPRS ${c.sprsScore ?? 'N/A'}" style="background:hsla(${hue},${sat},${light},0.7)">
                                    <div class="splk-hm-name">${esc(c.name)}</div>
                                    <div class="splk-hm-val">${pct}%</div>
                                </div>`;
                            }).join('')}
                        </div>`}
                    </div>
                </div>

                <!-- Level Distribution -->
                <div class="splk-panel splk-narrow">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('layers')} CMMC Level Mix</span>
                    </div>
                    <div class="splk-panel-body">
                        <div class="splk-donut-stats">
                            ${['1','2','3'].map(l => {
                                const count = levelDist[l];
                                const pct = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;
                                const color = l === '1' ? 'var(--accent-blue)' : l === '2' ? 'var(--status-partial)' : 'var(--status-not-met)';
                                return `<div class="splk-level-row">
                                    <span class="splk-level-badge" style="background:${color}20;color:${color}">L${l}</span>
                                    <span class="splk-level-bar"><div class="splk-level-fill" style="width:${pct}%;background:${color}"></div></span>
                                    <span class="splk-level-count">${count}</span>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- Industry Breakdown -->
                <div class="splk-panel splk-narrow">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('database')} Industry Breakdown</span>
                    </div>
                    <div class="splk-panel-body">
                        ${Object.keys(industries).length === 0 ? '<div class="splk-empty">No data</div>' : `
                        <div class="splk-industry-list">
                            ${Object.entries(industries).sort((a, b) => b[1] - a[1]).map(([ind, count]) => `
                                <div class="splk-industry-row">
                                    <span class="splk-industry-name">${esc(ind)}</span>
                                    <span class="splk-industry-count">${count}</span>
                                </div>
                            `).join('')}
                        </div>`}
                    </div>
                </div>

                <!-- Upcoming Assessments -->
                <div class="splk-panel">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('calendar')} Upcoming Assessments</span>
                    </div>
                    <div class="splk-panel-body">
                        ${(() => {
                            const upcoming = clients.filter(c => c.nextAssessment).sort((a, b) => new Date(a.nextAssessment) - new Date(b.nextAssessment)).slice(0, 6);
                            if (upcoming.length === 0) return '<div class="splk-empty">No assessment dates set</div>';
                            return `<div class="splk-timeline">${upcoming.map(c => {
                                const d = new Date(c.nextAssessment);
                                const daysOut = Math.ceil((d - now) / 86400000);
                                const urgency = daysOut < 0 ? 'overdue' : daysOut <= 30 ? 'urgent' : daysOut <= 90 ? 'soon' : 'planned';
                                return `<div class="splk-tl-item ${urgency}">
                                    <div class="splk-tl-date">${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    <div class="splk-tl-dot"></div>
                                    <div class="splk-tl-info">
                                        <div class="splk-tl-name">${esc(c.name)}</div>
                                        <div class="splk-tl-days">${daysOut < 0 ? Math.abs(daysOut) + 'd overdue' : daysOut + 'd away'}</div>
                                    </div>
                                </div>`;
                            }).join('')}</div>`;
                        })()}
                    </div>
                </div>

                <!-- Client Completion Sparklines -->
                <div class="splk-panel">
                    <div class="splk-panel-head">
                        <span class="splk-panel-title">${portal.getIcon('activity')} Client Completion Overview</span>
                    </div>
                    <div class="splk-panel-body">
                        ${totalClients === 0 ? '<div class="splk-empty">No clients</div>' : `
                        <div class="splk-spark-list">
                            ${clients.slice(0, 10).map(c => `
                                <div class="splk-spark-row">
                                    <span class="splk-spark-name">${esc(c.name)}</span>
                                    <span class="splk-spark-chart">${miniBar([c.completionPercent || 0, c.sprsScore != null ? Math.max(0, Math.round((c.sprsScore + 203) / 313 * 100)) : 0], 20)}</span>
                                    <span class="splk-spark-val" style="color:${riskColor(c.sprsScore)}">${c.completionPercent || 0}%</span>
                                </div>
                            `).join('')}
                        </div>`}
                    </div>
                </div>

            </div><!-- /splk-grid -->
        </div>`;
    },

    // ==================== ENVIRONMENT SETUP VIEW ====================
    'env-setup': function(portal) {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA : null;
        return `
        <div class="msp-env-setup">
            <div class="msp-intro-banner">
                <h2>Cloud Environment Setup for CMMC</h2>
                <p>Configure FedRAMP High-authorized cloud environments for CMMC Level 2/3 compliance. Each provider requires specific configurations for CUI handling.</p>
            </div>
            <div class="msp-env-tabs">
                <button class="env-tab active" data-provider="azure" data-action="switch-env-tab" data-param="azure">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span>Azure GCC High</span>
                </button>
                <button class="env-tab" data-provider="aws" data-action="switch-env-tab" data-param="aws">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>AWS GovCloud</span>
                </button>
                <button class="env-tab" data-provider="gcp" data-action="switch-env-tab" data-param="gcp">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>GCP Assured Workloads</span>
                </button>
            </div>
            <div class="msp-env-content" id="env-content">${this.renderAzureSetup()}</div>
        </div>`;
    },

    switchEnvTab: function(provider) {
        document.querySelectorAll('.env-tab').forEach(t => t.classList.toggle('active', t.dataset.provider === provider));
        const content = document.getElementById('env-content');
        if (provider === 'azure') content.innerHTML = this.renderAzureSetup();
        else if (provider === 'aws') content.innerHTML = this.renderAWSSetup();
        else if (provider === 'gcp') content.innerHTML = this.renderGCPSetup();
    },

    renderAzureSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.azure : null;
        const overview = data?.overview || {};
        const licensing = data?.licensing || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'Azure Government / GCC High'}</h3>
                <p>${overview.description || 'Configure Microsoft Azure Government for CMMC compliance.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || []).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="${overview.portalUrl || 'https://portal.azure.us'}" target="_blank" rel="noopener noreferrer" class="env-link">Azure Gov Portal ↗</a>
                    <a href="${overview.entraUrl || 'https://entra.microsoft.us'}" target="_blank" rel="noopener noreferrer" class="env-link">Entra Admin Center ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Required Licensing</h3></div>
                <div class="msp-card-body">
                    <div class="licensing-grid">
                        ${(licensing.tiers || [
                            { name: 'M365 GCC High E5', required: true, notes: 'Recommended for full security stack' },
                            { name: 'Entra ID P2', required: true, notes: 'Conditional Access, PIM, Identity Protection' },
                            { name: 'Defender for Endpoint P2', required: true, notes: 'EDR for CMMC SI controls' },
                            { name: 'Microsoft Purview', required: true, notes: 'DLP, sensitivity labels, eDiscovery' }
                        ]).map(t => `
                            <div class="license-item ${t.required ? 'required' : ''}">
                                <div class="license-name">${t.name}</div>
                                <div class="license-notes">${t.notes}</div>
                                ${t.required ? '<span class="req-badge">Required</span>' : '<span class="opt-badge">Optional</span>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>MSP Multi-Tenant Architecture (Azure Lighthouse)</h3></div>
                <div class="msp-card-body">
                    <div class="arch-diagram">
                        <div class="arch-layer msp-layer">
                            <span class="layer-label">MSP Management Tenant</span>
                            <div class="arch-components">
                                <span>Azure Lighthouse</span><span>Sentinel MSSP</span><span>Defender for Cloud</span><span>Intune Multi-tenant</span>
                            </div>
                        </div>
                        <div class="arch-connector">↓ Delegated Resource Management (No credentials stored) ↓</div>
                        <div class="arch-layer client-layer">
                            <span class="layer-label">Client GCC High Tenants</span>
                            <div class="arch-components">
                                <span>Client A (M365 + Azure)</span><span>Client B (M365 + Azure)</span><span>Client C (M365 only)</span>
                            </div>
                        </div>
                    </div>
                    <p class="arch-note"><strong>Key Benefits:</strong> Manage client resources without storing credentials in client tenants. All MSP actions are audited in client's Azure Activity Log.</p>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultAzureChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultAzureChecklist: function() {
        return [
            { name: 'Identity Foundation', items: [
                { task: 'Provision M365 GCC High tenant', critical: true, effort: '1-2 weeks' },
                { task: 'Configure Entra ID with US-only data residency', critical: true, effort: '1 day' },
                { task: 'Enable MFA for all users (FIDO2 security keys preferred)', critical: true, effort: '1-2 days' },
                { task: 'Configure Conditional Access baseline policies', critical: true, effort: '1 day' },
                { task: 'Enable Privileged Identity Management (PIM) for all admin roles', critical: true, effort: '4-8 hours' },
                { task: 'Configure Identity Protection risk-based policies', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Network Security', items: [
                { task: 'Deploy Hub-Spoke or Virtual WAN topology', critical: true, effort: '1-2 days' },
                { task: 'Configure Azure Firewall Premium with threat intelligence', critical: true, effort: '4-8 hours' },
                { task: 'Enable DDoS Protection Standard on hub VNet', critical: false, effort: '1 hour' },
                { task: 'Configure NSGs with deny-by-default rules', critical: true, effort: '2-4 hours' },
                { task: 'Enable NSG flow logs to Log Analytics', critical: true, effort: '2-4 hours' },
                { task: 'Deploy Azure Bastion for secure VM access', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Security & Monitoring', items: [
                { task: 'Enable all Defender for Cloud plans', critical: true, effort: '2-4 hours' },
                { task: 'Deploy Microsoft Sentinel workspace', critical: true, effort: '4-8 hours' },
                { task: 'Connect all data sources to Sentinel', critical: true, effort: '1 day' },
                { task: 'Enable CMMC analytics rules from Content Hub', critical: true, effort: '2-4 hours' },
                { task: 'Configure diagnostic settings for all resources', critical: true, effort: '4-8 hours' },
                { task: 'Deploy Defender for Endpoint on all endpoints', critical: true, effort: '1 day' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Configure sensitivity labels in Microsoft Purview', critical: true, effort: '1 day' },
                { task: 'Deploy DLP policies for CUI protection', critical: true, effort: '1-2 days' },
                { task: 'Configure Azure Information Protection scanner', critical: false, effort: '4-8 hours' },
                { task: 'Enable customer-managed keys for storage', critical: false, effort: '4-8 hours' },
                { task: 'Configure Key Vault with soft delete and purge protection', critical: true, effort: '2-4 hours' }
            ]}
        ];
    },

    renderChecklistFromData: function(categories) {
        return categories.map(cat => `
            <div class="checklist-category">
                <h4>${cat.name}</h4>
                <div class="checklist-grid">
                    ${cat.items.map(i => `
                        <div class="checklist-item ${i.critical ? 'critical' : ''}">
                            <input type="checkbox" id="chk-${i.task.replace(/[^a-z0-9]/gi, '')}">
                            <label for="chk-${i.task.replace(/[^a-z0-9]/gi, '')}">
                                <span class="check-task">${i.task}</span>
                                ${i.effort ? `<span class="check-effort">${i.effort}</span>` : ''}
                                ${i.critical ? '<span class="critical-badge">Critical</span>' : ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    renderAWSSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.aws : null;
        const overview = data?.overview || {};
        const landingZone = data?.landingZone || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'AWS GovCloud (US)'}</h3>
                <p>${overview.description || 'Configure AWS GovCloud for CMMC compliance with FedRAMP High authorization.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || [
                        'Isolated regions: us-gov-west-1 (Oregon), us-gov-east-1 (Ohio)',
                        'US persons only for root account access',
                        'Separate AWS partition (aws-us-gov)',
                        'Linked to commercial AWS for billing'
                    ]).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="${overview.consoleUrl || 'https://console.amazonaws-us-gov.com'}" target="_blank" rel="noopener noreferrer" class="env-link">GovCloud Console ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Landing Zone Architecture</h3></div>
                <div class="msp-card-body">
                    <div class="landing-zone-diagram">
                        <div class="lz-account management">
                            <span class="lz-label">Management Account</span>
                            <div class="lz-services">Organizations • Billing • SCPs</div>
                        </div>
                        <div class="lz-row">
                            <div class="lz-account security">
                                <span class="lz-label">Log Archive</span>
                                <div class="lz-services">CloudTrail • Config Logs</div>
                            </div>
                            <div class="lz-account security">
                                <span class="lz-label">Security Tooling</span>
                                <div class="lz-services">Security Hub • GuardDuty</div>
                            </div>
                            <div class="lz-account shared">
                                <span class="lz-label">Shared Services</span>
                                <div class="lz-services">Transit GW • Directory</div>
                            </div>
                        </div>
                        <div class="lz-connector">↓ SCPs & Guardrails ↓</div>
                        <div class="lz-row">
                            <div class="lz-account workload">
                                <span class="lz-label">Client A OU</span>
                                <div class="lz-services">Prod • Dev • Sandbox</div>
                            </div>
                            <div class="lz-account workload">
                                <span class="lz-label">Client B OU</span>
                                <div class="lz-services">Prod • Dev • Sandbox</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Service Control Policy Example</h3></div>
                <div class="msp-card-body">
                    <pre class="code-block"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyNonGovCloudRegions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["us-gov-west-1", "us-gov-east-1"]
      }
    }
  }]
}</code></pre>
                    <p class="code-note">This SCP prevents resources from being created outside GovCloud regions.</p>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultAWSChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultAWSChecklist: function() {
        return [
            { name: 'Account Setup', items: [
                { task: 'Create GovCloud account via commercial AWS', critical: true, effort: '1-2 days' },
                { task: 'Complete US person verification', critical: true, effort: '1 week' },
                { task: 'Enable AWS Organizations', critical: true, effort: '1 day' },
                { task: 'Create organizational units (Security, Workloads)', critical: true, effort: '2-4 hours' },
                { task: 'Deploy service control policies (SCPs)', critical: true, effort: '4-8 hours' }
            ]},
            { name: 'Identity Foundation', items: [
                { task: 'Enable IAM Identity Center', critical: true, effort: '4-8 hours' },
                { task: 'Integrate with external IdP (Okta, Entra ID)', critical: true, effort: '1 day' },
                { task: 'Configure MFA for all users', critical: true, effort: '2-4 hours' },
                { task: 'Create permission sets with least privilege', critical: true, effort: '1 day' },
                { task: 'Enable IAM Access Analyzer', critical: false, effort: '1 hour' }
            ]},
            { name: 'Security Services', items: [
                { task: 'Enable Security Hub with NIST 800-171 standard', critical: true, effort: '2-4 hours' },
                { task: 'Enable GuardDuty in all accounts', critical: true, effort: '2-4 hours' },
                { task: 'Configure AWS Config with conformance packs', critical: true, effort: '4-8 hours' },
                { task: 'Deploy AWS Network Firewall', critical: true, effort: '1 day' },
                { task: 'Create organization CloudTrail', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Enable default S3 encryption (SSE-KMS)', critical: true, effort: '2-4 hours' },
                { task: 'Create KMS keys per data classification', critical: true, effort: '2-4 hours' },
                { task: 'Enable S3 Block Public Access at account level', critical: true, effort: '1 hour' },
                { task: 'Enable EBS encryption by default', critical: true, effort: '1 hour' }
            ]}
        ];
    },

    renderGCPSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.gcp : null;
        const overview = data?.overview || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'Google Cloud - Assured Workloads'}</h3>
                <p>${overview.description || 'Configure Google Cloud with Assured Workloads for CMMC compliance.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || [
                        'Assured Workloads enforces compliance controls at folder level',
                        'US-only data residency via organization policies',
                        'FedRAMP Moderate, High, and IL4 regimes available',
                        'Premium support tier required for compliance'
                    ]).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" class="env-link">GCP Console ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Assured Workloads Compliance Regimes</h3></div>
                <div class="msp-card-body">
                    <table class="msp-table">
                        <thead>
                            <tr><th>Regime</th><th>Services Available</th><th>Restrictions</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="status-badge success">FedRAMP Moderate</span></td>
                                <td>Most GCP services</td>
                                <td>US regions, access transparency</td>
                            </tr>
                            <tr>
                                <td><span class="status-badge warning">FedRAMP High</span></td>
                                <td>Subset of services</td>
                                <td>US regions, personnel controls, CMEK required</td>
                            </tr>
                            <tr>
                                <td><span class="status-badge danger">IL4</span></td>
                                <td>Limited (Compute, GKE, Storage, BigQuery)</td>
                                <td>Strictest controls, dedicated infrastructure</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Create Assured Workloads Folder</h3></div>
                <div class="msp-card-body">
                    <pre class="code-block"><code># Create Assured Workloads folder for FedRAMP High
gcloud assured workloads create \\
  --organization=ORGANIZATION_ID \\
  --location=us \\
  --display-name="CUI-Workloads" \\
  --compliance-regime=FEDRAMP_HIGH \\
  --billing-account=BILLING_ACCOUNT_ID</code></pre>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultGCPChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultGCPChecklist: function() {
        return [
            { name: 'Organization Setup', items: [
                { task: 'Create GCP Organization with Cloud Identity', critical: true, effort: '1 day' },
                { task: 'Enable Assured Workloads for organization', critical: true, effort: '1 day' },
                { task: 'Create Assured Workloads folder (FedRAMP High)', critical: true, effort: '2-4 hours' },
                { task: 'Configure resource location restriction (US only)', critical: true, effort: '1 hour' }
            ]},
            { name: 'Identity & Access', items: [
                { task: 'Enable 2-Step Verification for all users', critical: true, effort: '2-4 hours' },
                { task: 'Require security keys for admin accounts', critical: true, effort: '4-8 hours' },
                { task: 'Configure IAM roles with least privilege', critical: true, effort: '1 day' },
                { task: 'Set up BeyondCorp Enterprise (if applicable)', critical: false, effort: '1-2 days' }
            ]},
            { name: 'Security & Monitoring', items: [
                { task: 'Enable Security Command Center Premium', critical: true, effort: '2-4 hours' },
                { task: 'Configure Cloud Audit Logs', critical: true, effort: '2-4 hours' },
                { task: 'Set up log sinks to BigQuery/Cloud Storage', critical: true, effort: '4-8 hours' },
                { task: 'Enable VPC Service Controls', critical: true, effort: '4-8 hours' },
                { task: 'Configure Cloud Armor WAF', critical: true, effort: '4-8 hours' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Enable CMEK for all storage services', critical: true, effort: '4-8 hours' },
                { task: 'Configure DLP API for data scanning', critical: false, effort: '1 day' },
                { task: 'Enable VPC Flow Logs', critical: true, effort: '2-4 hours' }
            ]}
        ];
    },

    // ==================== ARCHITECTURE VIEW ====================
    architecture: function(portal) {
        return `
        <div class="msp-architecture-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Multi-Tenant Architecture</h2><p>Design patterns for managing multiple CMMC clients with proper isolation and shared services.</p></div></div>
            <div class="arch-principles">
                <h3>Core Principles</h3>
                <div class="principles-grid">
                    <div class="principle-card"><div class="principle-icon">🔒</div><h4>Tenant Isolation</h4><p>Complete separation of client data, identities, and resources. No shared CUI storage.</p></div>
                    <div class="principle-card"><div class="principle-icon">🎛️</div><h4>Centralized Management</h4><p>Single pane of glass for MSP operations while maintaining client boundaries.</p></div>
                    <div class="principle-card"><div class="principle-icon">📊</div><h4>Unified Monitoring</h4><p>Aggregate security telemetry without mixing client data.</p></div>
                    <div class="principle-card"><div class="principle-icon">⚡</div><h4>Scalable Onboarding</h4><p>Repeatable templates and automation for consistent deployments.</p></div>
                </div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Reference Architecture</h3></div><div class="msp-card-body">${this.renderReferenceArch()}</div></div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Anti-Patterns to Avoid</h3></div><div class="msp-card-body">${this.renderAntiPatterns()}</div></div>
        </div>`;
    },

    renderReferenceArch: function() {
        return `
        <div class="reference-arch">
            <div class="arch-row msp-row"><div class="arch-box msp-tenant"><h4>MSP Management Tenant</h4><div class="arch-services"><span>Azure Lighthouse</span><span>Sentinel Multi-workspace</span><span>Defender for Cloud</span><span>Intune Multi-tenant</span><span>Automation Accounts</span></div></div></div>
            <div class="arch-connections"><div class="connection-line" data-label="Delegated Admin"></div></div>
            <div class="arch-row clients-row">
                <div class="arch-box client-tenant"><h4>Client A (GCC High)</h4><div class="arch-services"><span>M365 GCC High</span><span>Azure Gov Sub</span><span>Log Analytics</span></div></div>
                <div class="arch-box client-tenant"><h4>Client B (GCC High)</h4><div class="arch-services"><span>M365 GCC High</span><span>Azure Gov Sub</span><span>Log Analytics</span></div></div>
                <div class="arch-box client-tenant"><h4>Client C (Commercial)</h4><div class="arch-services"><span>M365 E5</span><span>Azure Commercial</span><span>Log Analytics</span></div></div>
            </div>
        </div>`;
    },

    renderAntiPatterns: function() {
        return `
        <div class="anti-patterns-list">
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Shared CUI Storage</h5><p>Never store multiple clients' CUI in the same storage account, even with folder separation.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Single Admin Accounts</h5><p>Don't use the same admin account across client tenants. Use dedicated accounts with PIM.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Merged Log Analytics</h5><p>Client logs must remain in separate workspaces. Use Sentinel cross-workspace queries for SOC.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Shared VDI Pools</h5><p>Different clients cannot share VDI session host pools when processing CUI.</p></div></div>
        </div>`;
    },

    // ==================== ENCLAVES VIEW ====================
    enclaves: function(portal) {
        return `
        <div class="msp-enclaves-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Enclave Design Patterns</h2><p>Isolated environments for CUI processing with defense-in-depth security controls.</p></div></div>
            <div class="enclave-types">
                <h3>Enclave Architecture Options</h3>
                <div class="enclave-grid">
                    <div class="enclave-card"><h4>🏢 Dedicated Tenant</h4><p><strong>Best for:</strong> Larger clients, strict isolation requirements</p><ul><li>Separate M365/Azure tenant</li><li>Complete data sovereignty</li><li>Independent security policies</li><li>Higher cost, maximum isolation</li></ul></div>
                    <div class="enclave-card"><h4>🔐 Virtual Enclave</h4><p><strong>Best for:</strong> Mid-size clients, cost-conscious</p><ul><li>Isolated subscription/resource groups</li><li>Network-level segmentation</li><li>Shared identity infrastructure</li><li>Balanced cost/isolation</li></ul></div>
                    <div class="enclave-card"><h4>💻 VDI Enclave</h4><p><strong>Best for:</strong> BYOD, contractors, remote access</p><ul><li>Isolated VDI session pools</li><li>No data on endpoints</li><li>Session-based isolation</li><li>Most flexible access</li></ul></div>
                </div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Enclave Security Controls</h3></div><div class="msp-card-body">${this.renderEnclaveControls()}</div></div>
        </div>`;
    },

    renderEnclaveControls: function() {
        return `
        <div class="enclave-controls-grid">
            <div class="control-section"><h4>🌐 Network Boundary</h4><ul><li>Dedicated VNet/VPC per enclave</li><li>Azure Firewall / AWS Network Firewall</li><li>No direct internet egress from CUI systems</li><li>Private endpoints for all PaaS services</li><li>NSG/Security Group deny-by-default</li></ul></div>
            <div class="control-section"><h4>🔑 Identity Boundary</h4><ul><li>Conditional Access: compliant device + MFA</li><li>Privileged Identity Management (JIT)</li><li>No shared service accounts</li><li>Certificate-based auth for admins</li><li>Break-glass procedures documented</li></ul></div>
            <div class="control-section"><h4>💾 Data Boundary</h4><ul><li>Customer-managed encryption keys</li><li>DLP policies blocking external sharing</li><li>Sensitivity labels on all CUI</li><li>No USB/removable media</li><li>Watermarking on documents</li></ul></div>
            <div class="control-section"><h4>📊 Monitoring Boundary</h4><ul><li>Dedicated Log Analytics workspace</li><li>All traffic logged (NSG flow logs)</li><li>UEBA for anomaly detection</li><li>Real-time alerting to SOC</li><li>90-day hot / 1-year cold retention</li></ul></div>
        </div>`;
    },

    // ==================== VDI VIEW ====================
    vdi: function(portal) {
        return `
        <div class="msp-vdi-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Virtual Desktop Infrastructure</h2><p>Deploy secure VDI solutions for CUI processing with proper isolation and compliance controls.</p></div></div>
            <div class="vdi-options-grid">
                <div class="vdi-option-card"><h4>Azure Virtual Desktop</h4><span class="vdi-rec">Recommended for M365</span><ul><li>Native GCC High support</li><li>M365 integration (Office, Teams)</li><li>FSLogix profile containers</li><li>Entra ID Join support</li></ul></div>
                <div class="vdi-option-card"><h4>Amazon WorkSpaces</h4><span class="vdi-rec">Best for AWS-centric</span><ul><li>GovCloud availability</li><li>PCoIP/WSP protocols</li><li>Directory Service integration</li><li>Bring-your-own-license</li></ul></div>
                <div class="vdi-option-card"><h4>Citrix DaaS</h4><span class="vdi-rec">Enterprise feature-rich</span><ul><li>Multi-cloud support</li><li>Advanced HDX protocol</li><li>FedRAMP authorized</li><li>Enhanced security controls</li></ul></div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>VDI Security Requirements for CMMC</h3></div><div class="msp-card-body">${this.renderVDISecurityReqs()}</div></div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>MSP VDI Architecture Pattern</h3></div><div class="msp-card-body">${this.renderVDIArchPattern()}</div></div>
        </div>`;
    },

    renderVDISecurityReqs: function() {
        return `
        <div class="security-reqs-grid">
            <div class="sec-req"><span class="req-icon">🔐</span><h5>Authentication</h5><ul><li>MFA required for all VDI access</li><li>Certificate-based auth preferred</li><li>Session timeout ≤15 minutes</li></ul></div>
            <div class="sec-req"><span class="req-icon">🖥️</span><h5>Endpoint</h5><ul><li>No CUI on local devices</li><li>Clipboard/drive redirection disabled</li><li>Watermarking enabled</li></ul></div>
            <div class="sec-req"><span class="req-icon">🔒</span><h5>Data Protection</h5><ul><li>Encryption in transit (TLS 1.2+)</li><li>Encrypted profile disks</li><li>DLP policies enforced</li></ul></div>
            <div class="sec-req"><span class="req-icon">📊</span><h5>Monitoring</h5><ul><li>Session recording (optional)</li><li>User activity logging</li><li>Anomaly detection</li></ul></div>
        </div>`;
    },

    renderVDIArchPattern: function() {
        return `
        <div class="vdi-arch-diagram">
            <div class="vdi-layer users"><span class="layer-title">End Users</span><div class="layer-items"><span>Thin Clients</span><span>Managed Laptops</span><span>BYOD (restricted)</span></div></div>
            <div class="vdi-connector">↓ MFA + Conditional Access ↓</div>
            <div class="vdi-layer gateway"><span class="layer-title">Gateway Layer</span><div class="layer-items"><span>AVD Gateway</span><span>RD Web Access</span><span>Load Balancer</span></div></div>
            <div class="vdi-connector">↓ Encrypted Session ↓</div>
            <div class="vdi-layer hosts"><span class="layer-title">Session Hosts</span><div class="layer-items"><span>CUI Pool (Isolated)</span><span>Standard Pool</span><span>Personal Desktops</span></div></div>
            <div class="vdi-connector">↓ Private Endpoints ↓</div>
            <div class="vdi-layer backend"><span class="layer-title">Backend Services</span><div class="layer-items"><span>File Shares (CUI)</span><span>Profile Storage</span><span>Domain Services</span></div></div>
        </div>`;
    },

    // ==================== SIEM VIEW (SOC PLAYBOOK) ====================
    siem: function(portal) {
        return `
        <div class="msp-siem-view">
            <div class="msp-intro-banner security"><div class="banner-content"><h2>SOC / MSSP Operations Playbook</h2><p>Comprehensive 24/7 Security Operations Center playbook covering SIEM, SOAR, ticketing, detection engineering, and incident response for CMMC-compliant MSSPs.</p></div></div>
            <div class="msp-tabs siem-tabs">
                <button class="msp-tab active" data-siem-tab="overview">SOC Overview</button>
                <button class="msp-tab" data-siem-tab="siem-platforms">SIEM Platforms</button>
                <button class="msp-tab" data-siem-tab="soar">SOAR & Automation</button>
                <button class="msp-tab" data-siem-tab="ticketing">Ticketing & Incidents</button>
                <button class="msp-tab" data-siem-tab="detection">Detection Engineering</button>
                <button class="msp-tab" data-siem-tab="operations">24/7 Operations</button>
            </div>
            <div class="siem-tab-content" id="siem-tab-content">${this.renderSIEMOverview(portal)}</div>
        </div>`;
    },

    renderSIEMOverview: function(portal) {
        const ih = typeof IntegrationsHub !== 'undefined' ? IntegrationsHub : null;
        const defStats = ih?.data?.defender?.stats;
        const s1Stats = ih?.data?.sentinelone?.stats;
        const csStats = ih?.data?.crowdstrike?.stats;
        const tenStats = ih?.data?.tenable?.stats;
        const totalAlerts = (defStats?.totalAlerts || 0) + (s1Stats?.totalThreats || 0) + (csStats?.detectionCount || 0);
        const critAlerts = (defStats?.criticalAlerts || 0) + (s1Stats?.activeThreats || 0);
        const bar = (val, max, color) => { const pct = max > 0 ? Math.min(100, Math.round((val / max) * 100)) : 0; return '<div class="soc-bar-track"><div class="soc-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>'; };

        return `
        <div class="soc-overview-grid">
            <!-- MSSP Architecture -->
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>MSSP SOC Architecture</h3></div>
                <div class="msp-card-body">
                    <div class="mssp-arch-diagram">
                        <div class="mssp-tier central"><h4>MSSP SOC (24/7)</h4><ul><li>Tier 1: Alert Triage & Monitoring</li><li>Tier 2: Incident Investigation</li><li>Tier 3: Threat Hunting & Forensics</li><li>SOC Manager: Escalation & Reporting</li></ul></div>
                        <div class="mssp-connectors"><div class="connector-line"></div></div>
                        <div class="mssp-tier siem"><h4>Core Platform Stack</h4><div class="siem-options"><span class="siem-badge sentinel">Sentinel</span><span class="siem-badge splunk">Splunk ES</span><span class="siem-badge elastic">Elastic SIEM</span><span class="siem-badge chronicle">Chronicle</span></div><div class="siem-options" style="margin-top:6px"><span class="siem-badge xsoar">Cortex XSOAR</span><span class="siem-badge soar">Splunk SOAR</span><span class="siem-badge swimlane">Swimlane</span></div></div>
                        <div class="mssp-connectors multi"><div class="connector-line"></div></div>
                        <div class="mssp-tier clients"><h4>Client Telemetry Sources</h4><div class="client-sources"><span>EDR/XDR</span><span>Firewall/IDS</span><span>Cloud Audit</span><span>Identity/SSO</span><span>Email Security</span><span>DNS/Proxy</span><span>Vulnerability Scans</span><span>DLP Events</span></div></div>
                    </div>
                </div>
            </div>

            <!-- Live Security Metrics -->
            <div class="msp-card">
                <div class="msp-card-header"><h3>Live Security Metrics</h3></div>
                <div class="msp-card-body">
                    ${totalAlerts === 0 && !defStats && !s1Stats && !csStats ? '<div class="soc-empty">Connect endpoint/SIEM integrations to see live metrics</div>' : `
                    <div class="soc-metric-rows">
                        <div class="soc-metric-row"><span class="soc-metric-name">Total Alerts</span><span class="soc-metric-val ${totalAlerts > 0 ? 'soc-red' : 'soc-green'}">${totalAlerts}</span></div>
                        <div class="soc-metric-row"><span class="soc-metric-name">Critical</span><span class="soc-metric-val ${critAlerts > 0 ? 'soc-red' : 'soc-green'}">${critAlerts}</span></div>
                        ${defStats ? `<div class="soc-metric-row"><span class="soc-metric-name">Defender Compliance</span>${bar(defStats.complianceRate, 100, defStats.complianceRate >= 90 ? '#34d399' : '#f59e0b')}<span class="soc-metric-val">${defStats.complianceRate}%</span></div>` : ''}
                        ${s1Stats ? `<div class="soc-metric-row"><span class="soc-metric-name">S1 Health</span>${bar(s1Stats.healthRate, 100, s1Stats.healthRate >= 90 ? '#34d399' : '#f59e0b')}<span class="soc-metric-val">${s1Stats.healthRate}%</span></div>` : ''}
                        ${tenStats ? `<div class="soc-metric-row"><span class="soc-metric-name">Critical Vulns</span><span class="soc-metric-val soc-red">${tenStats.vulnerabilities?.critical || 0}</span></div>` : ''}
                    </div>`}
                </div>
            </div>

            <!-- SOC Shift Model -->
            <div class="msp-card">
                <div class="msp-card-header"><h3>SOC Shift Model</h3></div>
                <div class="msp-card-body">
                    <div class="shift-model">
                        <div class="shift-row"><span class="shift-badge day">Day (06-14)</span><span class="shift-desc">Primary analysts, threat hunting, client meetings, report generation</span></div>
                        <div class="shift-row"><span class="shift-badge swing">Swing (14-22)</span><span class="shift-desc">Alert triage, incident response, escalation handling</span></div>
                        <div class="shift-row"><span class="shift-badge night">Night (22-06)</span><span class="shift-desc">Monitoring, automated response, critical escalation only</span></div>
                    </div>
                    <div class="shift-kpis" style="margin-top:10px">
                        <div class="shift-kpi"><strong>MTTA:</strong> &lt; 15 min</div>
                        <div class="shift-kpi"><strong>MTTR:</strong> &lt; 4 hrs (P1)</div>
                        <div class="shift-kpi"><strong>SLA:</strong> 99.9% uptime</div>
                    </div>
                </div>
            </div>

            <!-- CMMC Logging Requirements -->
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>CMMC Audit & Logging Requirements</h3></div>
                <div class="msp-card-body">${this.renderLoggingReqs()}</div>
            </div>

            <!-- MSP Backend Operations -->
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>MSP Backend Operations</h3></div>
                <div class="msp-card-body">${this.renderMSPBackendOps()}</div>
            </div>
        </div>`;
    },

    renderSIEMPlatforms: function() {
        return `
        <div class="siem-platforms-section">
            <h3>SIEM Platform Comparison</h3>
            <p class="section-desc">FedRAMP-authorized SIEM platforms for CMMC-compliant MSSP operations. Each platform has unique strengths for multi-tenant SOC environments.</p>
            <table class="msp-comparison-table">
                <thead><tr><th>Feature</th><th>Microsoft Sentinel</th><th>Splunk Enterprise Security</th><th>Elastic SIEM</th><th>Google Chronicle</th><th>IBM QRadar</th></tr></thead>
                <tbody>
                    <tr><td><strong>FedRAMP</strong></td><td class="good">High (GCC High)</td><td class="good">High (GovCloud)</td><td class="moderate">Moderate (Cloud)</td><td class="moderate">Moderate</td><td class="good">High</td></tr>
                    <tr><td><strong>Multi-Tenant</strong></td><td class="good">Native (Lighthouse)</td><td class="moderate">Via Apps/Indexes</td><td class="moderate">Spaces</td><td class="good">Native</td><td class="moderate">Multi-domain</td></tr>
                    <tr><td><strong>SOAR Built-in</strong></td><td class="good">Logic Apps + Playbooks</td><td class="good">Splunk SOAR (Phantom)</td><td class="moderate">Limited</td><td class="moderate">Chronicle SOAR</td><td class="good">QRadar SOAR</td></tr>
                    <tr><td><strong>CMMC Content</strong></td><td class="good">Content Hub packs</td><td class="moderate">ES Content Update</td><td class="moderate">Custom rules</td><td class="moderate">Custom rules</td><td class="moderate">Custom rules</td></tr>
                    <tr><td><strong>Query Language</strong></td><td>KQL (Kusto)</td><td>SPL</td><td>EQL / Lucene</td><td>YARA-L</td><td>AQL</td></tr>
                    <tr><td><strong>Cost Model</strong></td><td>Per GB ingested</td><td>Per GB indexed</td><td>Per node/GB</td><td>Per GB ingested</td><td>Per EPS</td></tr>
                    <tr><td><strong>Best For</strong></td><td>M365/Azure shops</td><td>On-prem + hybrid</td><td>Open-source stack</td><td>GCP environments</td><td>Enterprise SOC</td></tr>
                    <tr><td><strong>XDR Integration</strong></td><td class="good">Defender XDR native</td><td class="good">CrowdStrike, S1</td><td class="good">Elastic Defend</td><td class="moderate">Via connectors</td><td class="good">QRadar XDR</td></tr>
                </tbody>
            </table>

            <h3 style="margin-top:20px">Key Configuration per Platform</h3>
            <div class="siem-config-grid">
                <details class="siem-config-card">
                    <summary><span class="siem-badge sentinel">Sentinel</span> Multi-Tenant Setup</summary>
                    <div class="siem-config-body">
                        <p><strong>Architecture:</strong> Azure Lighthouse + workspace per client</p>
                        <pre><code># Deploy Lighthouse delegation
az deployment create --location eastus --template-file lighthouse.json \\
  --parameters managedByTenantId="{MSP_TENANT}" principalId="{SOC_GROUP}"

# Enable CMMC analytics rules
az sentinel alert-rule list --workspace-name "{CLIENT_WS}" \\
  --resource-group "{RG}" | jq '.[] | select(.kind=="Scheduled")'</code></pre>
                        <p><strong>Data Connectors:</strong> Defender XDR, Entra ID, Office 365, Azure Activity, Syslog (CEF), AWS CloudTrail (via S3)</p>
                    </div>
                </details>
                <details class="siem-config-card">
                    <summary><span class="siem-badge splunk">Splunk ES</span> MSSP Deployment</summary>
                    <div class="siem-config-body">
                        <p><strong>Architecture:</strong> Indexer cluster + search head cluster, per-client indexes</p>
                        <pre><code># inputs.conf for CrowdStrike Falcon Data Replicator
[monitor:///opt/crowdstrike/fdr/data]
sourcetype = crowdstrike:fdr:event
index = client_a_edr

# CMMC correlation search
| tstats count from datamodel=Authentication where Authentication.action=failure 
  by Authentication.user Authentication.src | where count > 10</code></pre>
                        <p><strong>Apps:</strong> Splunk ES, CrowdStrike App, Palo Alto App, AWS App, Splunk SOAR</p>
                    </div>
                </details>
                <details class="siem-config-card">
                    <summary><span class="siem-badge elastic">Elastic SIEM</span> Stack Setup</summary>
                    <div class="siem-config-body">
                        <p><strong>Architecture:</strong> Elasticsearch cluster + Kibana + Fleet Server, Elastic Agent on endpoints</p>
                        <pre><code># Deploy Elastic Agent with Fleet
elastic-agent enroll --url=https://fleet.mssp.local:8220 \\
  --enrollment-token="{TOKEN}" --fleet-server-es=https://es.mssp.local:9200

# Detection rule (EQL)
process where process.name == "powershell.exe" and 
  process.args : ("-enc*", "-e *", "bypass*") and 
  user.name != "SYSTEM"</code></pre>
                        <p><strong>Integrations:</strong> Elastic Defend (EDR), Filebeat, Winlogbeat, Auditbeat, Cloud modules</p>
                    </div>
                </details>
            </div>
        </div>`;
    },

    renderSOARSection: function() {
        return `
        <div class="soar-section">
            <h3>SOAR & Automation Platforms</h3>
            <p class="section-desc">Security Orchestration, Automation, and Response platforms for automating repetitive SOC tasks, enriching alerts, and executing playbooks.</p>

            <table class="msp-comparison-table">
                <thead><tr><th>Platform</th><th>FedRAMP</th><th>Best Integration</th><th>Playbook Language</th><th>MSSP Fit</th><th>Key Capability</th></tr></thead>
                <tbody>
                    <tr><td><strong>Cortex XSOAR</strong></td><td class="good">High</td><td>Palo Alto, CrowdStrike</td><td>Python + YAML</td><td class="good">Excellent</td><td>700+ integrations, war rooms, ML-based triage</td></tr>
                    <tr><td><strong>Splunk SOAR</strong></td><td class="good">High</td><td>Splunk ES</td><td>Python playbooks</td><td class="good">Excellent</td><td>Visual playbook editor, case management</td></tr>
                    <tr><td><strong>Sentinel Playbooks</strong></td><td class="good">High (GCC)</td><td>Microsoft stack</td><td>Logic Apps (JSON)</td><td class="good">Good</td><td>Native Azure, low-code automation</td></tr>
                    <tr><td><strong>Swimlane</strong></td><td class="good">High</td><td>Vendor-agnostic</td><td>Low-code + Python</td><td class="moderate">Good</td><td>Flexible workflows, OT/IoT support</td></tr>
                    <tr><td><strong>Tines</strong></td><td class="moderate">Moderate</td><td>Vendor-agnostic</td><td>No-code (Stories)</td><td class="moderate">Good</td><td>Simple automation, free community tier</td></tr>
                </tbody>
            </table>

            <h3 style="margin-top:20px">Common SOAR Playbooks for CMMC</h3>
            <div class="soar-playbooks-grid">
                <div class="soar-pb-card"><div class="soar-pb-head"><span class="pb-severity high">P1</span><h4>Compromised Account Response</h4></div><div class="soar-pb-body"><ol><li>Disable user account (Entra ID / AD)</li><li>Revoke all active sessions</li><li>Reset credentials + MFA re-enrollment</li><li>Query SIEM for lateral movement</li><li>Block source IPs at firewall</li><li>Create incident ticket (Jira/ServiceNow)</li><li>Notify client SOC contact</li></ol><div class="soar-pb-controls"><strong>CMMC Controls:</strong> 3.1.1, 3.1.2, 3.5.3, 3.6.1, 3.6.2</div></div></div>
                <div class="soar-pb-card"><div class="soar-pb-head"><span class="pb-severity high">P1</span><h4>Malware Detection & Containment</h4></div><div class="soar-pb-body"><ol><li>Isolate endpoint (EDR network quarantine)</li><li>Collect forensic artifacts (memory dump, disk image)</li><li>Submit sample to sandbox (VirusTotal, Any.Run)</li><li>Block IOCs across all clients (hash, IP, domain)</li><li>Scan environment for additional infections</li><li>Remediate and restore from clean backup</li><li>Update detection rules with new IOCs</li></ol><div class="soar-pb-controls"><strong>CMMC Controls:</strong> 3.14.1, 3.14.2, 3.14.3, 3.14.5, 3.14.6</div></div></div>
                <div class="soar-pb-card"><div class="soar-pb-head"><span class="pb-severity medium">P2</span><h4>Phishing Email Triage</h4></div><div class="soar-pb-body"><ol><li>Extract URLs, attachments, headers</li><li>Detonate in sandbox</li><li>Check sender reputation (SPF/DKIM/DMARC)</li><li>Search mailboxes for similar messages</li><li>Purge from all inboxes if malicious</li><li>Block sender/domain at email gateway</li><li>Update KnowBe4 phishing simulation data</li></ol><div class="soar-pb-controls"><strong>CMMC Controls:</strong> 3.2.1, 3.2.2, 3.14.2, 3.14.6</div></div></div>
                <div class="soar-pb-card"><div class="soar-pb-head"><span class="pb-severity medium">P2</span><h4>Vulnerability Remediation Workflow</h4></div><div class="soar-pb-body"><ol><li>Receive critical vuln alert (Tenable/Qualys)</li><li>Enrich with asset context (owner, CUI scope)</li><li>Auto-create Jira ticket with SLA</li><li>Assign to responsible team</li><li>Track patch deployment via RMM</li><li>Re-scan to verify remediation</li><li>Close ticket and update evidence</li></ol><div class="soar-pb-controls"><strong>CMMC Controls:</strong> 3.11.1, 3.11.2, 3.11.3, 3.14.1</div></div></div>
            </div>
        </div>`;
    },

    renderTicketingSection: function() {
        return `
        <div class="ticketing-section">
            <h3>Ticketing & Incident Management</h3>
            <p class="section-desc">Incident ticketing systems integrated with SOC workflows. Tickets serve as evidence artifacts for CMMC audit trails (3.6.1, 3.6.2).</p>

            <table class="msp-comparison-table">
                <thead><tr><th>Platform</th><th>FedRAMP</th><th>ITSM/SOAR</th><th>MSSP Multi-Tenant</th><th>API Integration</th><th>Best For</th></tr></thead>
                <tbody>
                    <tr><td><strong>ServiceNow</strong></td><td class="good">High</td><td class="good">Full ITSM + SecOps</td><td class="good">Domain separation</td><td class="good">REST + MID Server</td><td>Enterprise MSSP</td></tr>
                    <tr><td><strong>Jira Service Mgmt</strong></td><td class="good">High (Atlassian Gov)</td><td class="moderate">ITSM + Opsgenie</td><td class="moderate">Projects per client</td><td class="good">REST API</td><td>Agile SOC teams</td></tr>
                    <tr><td><strong>ConnectWise Manage</strong></td><td class="moderate">N/A (SOC 2)</td><td class="moderate">PSA + RMM</td><td class="good">Native MSP</td><td class="good">REST API</td><td>MSP-focused</td></tr>
                    <tr><td><strong>Halo ITSM</strong></td><td class="moderate">N/A (SOC 2)</td><td class="moderate">ITSM</td><td class="good">Multi-tenant</td><td class="good">REST API</td><td>Mid-market MSP</td></tr>
                </tbody>
            </table>

            <h3 style="margin-top:20px">Communication & Escalation Channels</h3>
            <div class="backend-ops-grid">
                <div class="ops-category"><h4>Slack / Teams Integration</h4><ul><li>Dedicated #soc-alerts channel per client</li><li>Bot auto-posts P1/P2 incidents</li><li>Threaded investigation discussions</li><li>Slash commands: /incident, /escalate, /status</li><li>Webhook from SIEM for real-time alerts</li><li><strong>Evidence:</strong> Export threads as IR documentation</li></ul></div>
                <div class="ops-category"><h4>PagerDuty / Opsgenie</h4><ul><li>On-call rotation management</li><li>Escalation policies (5 min → 15 min → manager)</li><li>Integration with SIEM alert rules</li><li>Mobile push for critical alerts</li><li>Post-incident review scheduling</li><li><strong>SLA tracking:</strong> MTTA, MTTR per severity</li></ul></div>
                <div class="ops-category"><h4>Incident Ticket Workflow</h4><ul><li><strong>New:</strong> Auto-created from SIEM alert</li><li><strong>Triage:</strong> Analyst assigns severity + client</li><li><strong>Investigation:</strong> Evidence collection, IOC enrichment</li><li><strong>Containment:</strong> Automated or manual response</li><li><strong>Resolution:</strong> Root cause + remediation</li><li><strong>Closed:</strong> Lessons learned, evidence archived</li></ul></div>
                <div class="ops-category"><h4>Evidence for CMMC Audit</h4><ul><li>Ticket history = IR documentation (3.6.1)</li><li>Escalation logs = incident tracking (3.6.2)</li><li>SLA reports = monitoring evidence (3.3.5)</li><li>Change tickets = config mgmt (3.4.3)</li><li>Vulnerability tickets = remediation (3.11.1)</li><li><strong>Tip:</strong> Tag tickets with CMMC control IDs</li></ul></div>
            </div>

            ${typeof IntegrationsHub !== 'undefined' && IntegrationsHub.hasCredentials('jira') ? `
            <div class="msp-card" style="margin-top:16px">
                <div class="msp-card-header"><h3>Jira Integration Active</h3></div>
                <div class="msp-card-body">
                    <p style="color:var(--text-secondary);font-size:0.78rem;">Your Jira instance is connected via the Integrations Hub. POA&M items can be pushed directly to Jira as tickets.</p>
                    <button class="msp-btn-primary" data-action="open-hub" style="margin-top:8px">View Jira Data</button>
                </div>
            </div>` : ''}
        </div>`;
    },

    renderDetectionEngineering: function() {
        return `
        <div class="detection-section">
            <h3>Detection Engineering</h3>
            <p class="section-desc">Detection rules, correlation searches, and analytics mapped to CMMC controls. Copy queries directly into your SIEM.</p>

            <div class="detection-rules-grid">
                <details class="detection-rule-card">
                    <summary><span class="pb-severity high">HIGH</span> Brute Force Authentication (3.1.8, 3.5.7)</summary>
                    <div class="detection-body">
                        <div class="detection-queries">
                            <div class="query-block"><span class="query-label">Splunk SPL</span><pre><code>index=auth sourcetype=WinEventLog:Security EventCode=4625
| stats count by src_ip, user, dest
| where count > 10
| sort -count</code></pre></div>
                            <div class="query-block"><span class="query-label">Sentinel KQL</span><pre><code>SigninLogs
| where ResultType != "0"
| summarize FailureCount=count() by IPAddress, UserPrincipalName, bin(TimeGenerated, 5m)
| where FailureCount > 10</code></pre></div>
                            <div class="query-block"><span class="query-label">Elastic EQL</span><pre><code>sequence by source.ip with maxspan=5m
  [authentication where event.outcome == "failure"] with runs=10</code></pre></div>
                        </div>
                        <div class="detection-response"><strong>Response:</strong> Block IP, disable account if compromised, create incident ticket, notify client</div>
                    </div>
                </details>
                <details class="detection-rule-card">
                    <summary><span class="pb-severity high">HIGH</span> Suspicious PowerShell Execution (3.14.2, 3.14.6)</summary>
                    <div class="detection-body">
                        <div class="detection-queries">
                            <div class="query-block"><span class="query-label">Splunk SPL</span><pre><code>index=endpoint sourcetype=sysmon EventCode=1 
  Image="*powershell.exe" 
  (CommandLine="*-enc*" OR CommandLine="*bypass*" OR CommandLine="*hidden*")
| table _time, Computer, User, CommandLine</code></pre></div>
                            <div class="query-block"><span class="query-label">Sentinel KQL</span><pre><code>DeviceProcessEvents
| where FileName == "powershell.exe"
| where ProcessCommandLine has_any ("-enc", "bypass", "-hidden", "IEX", "downloadstring")
| project Timestamp, DeviceName, AccountName, ProcessCommandLine</code></pre></div>
                        </div>
                        <div class="detection-response"><strong>Response:</strong> Isolate endpoint, collect process tree, check for persistence mechanisms, submit to sandbox</div>
                    </div>
                </details>
                <details class="detection-rule-card">
                    <summary><span class="pb-severity medium">MED</span> Impossible Travel Detection (3.1.1, 3.1.2)</summary>
                    <div class="detection-body">
                        <div class="detection-queries">
                            <div class="query-block"><span class="query-label">Sentinel KQL</span><pre><code>let timeWindow = 1h;
SigninLogs
| where ResultType == "0"
| summarize Locations=make_set(Location), LocationCount=dcount(Location) by UserPrincipalName, bin(TimeGenerated, timeWindow)
| where LocationCount > 1</code></pre></div>
                        </div>
                        <div class="detection-response"><strong>Response:</strong> Verify with user, check for VPN usage, force MFA re-auth if suspicious</div>
                    </div>
                </details>
                <details class="detection-rule-card">
                    <summary><span class="pb-severity medium">MED</span> Data Exfiltration via Cloud Storage (3.1.3, 3.8.1)</summary>
                    <div class="detection-body">
                        <div class="detection-queries">
                            <div class="query-block"><span class="query-label">Splunk SPL</span><pre><code>index=proxy sourcetype=web_proxy 
  (dest="*dropbox.com" OR dest="*drive.google.com" OR dest="*onedrive.live.com")
  action=allowed bytes_out>10000000
| stats sum(bytes_out) as total_bytes by src_ip, user, dest
| where total_bytes > 100000000</code></pre></div>
                        </div>
                        <div class="detection-response"><strong>Response:</strong> Block upload, investigate files transferred, check DLP policy violations, notify data owner</div>
                    </div>
                </details>
                <details class="detection-rule-card">
                    <summary><span class="pb-severity low">LOW</span> Audit Log Tampering (3.3.4, 3.3.8)</summary>
                    <div class="detection-body">
                        <div class="detection-queries">
                            <div class="query-block"><span class="query-label">Splunk SPL</span><pre><code>index=wineventlog sourcetype=WinEventLog:Security 
  (EventCode=1102 OR EventCode=1100)
| table _time, Computer, User, EventCode, Message</code></pre></div>
                            <div class="query-block"><span class="query-label">Sentinel KQL</span><pre><code>SecurityEvent
| where EventID in (1102, 1100)
| project TimeGenerated, Computer, Account, Activity</code></pre></div>
                        </div>
                        <div class="detection-response"><strong>Response:</strong> Investigate who cleared logs, check for compromise indicators, restore from backup, escalate to Tier 2</div>
                    </div>
                </details>
            </div>
        </div>`;
    },

    renderOperationsSection: function() {
        return `
        <div class="operations-section">
            <h3>24/7 SOC Operations</h3>
            <p class="section-desc">Standard operating procedures, runbooks, and KPIs for a CMMC-compliant 24/7 Security Operations Center.</p>

            <div class="backend-ops-grid">
                <div class="ops-category"><h4>Tier 1: Alert Monitoring</h4><ul><li>Monitor SIEM dashboards continuously</li><li>Triage alerts within 15 minutes (MTTA)</li><li>Classify: True Positive, False Positive, Benign</li><li>Enrich with threat intelligence (MITRE ATT&CK)</li><li>Escalate P1/P2 to Tier 2 immediately</li><li>Document all actions in ticket system</li><li><strong>Tools:</strong> SIEM console, EDR console, TI feeds</li></ul></div>
                <div class="ops-category"><h4>Tier 2: Investigation</h4><ul><li>Deep-dive analysis of escalated incidents</li><li>Correlate across multiple data sources</li><li>Perform host/network forensics</li><li>Identify attack scope and impact</li><li>Execute containment actions</li><li>Coordinate with client IT teams</li><li><strong>Tools:</strong> SIEM, EDR, SOAR, forensic tools</li></ul></div>
                <div class="ops-category"><h4>Tier 3: Threat Hunting</h4><ul><li>Proactive hypothesis-driven hunts</li><li>MITRE ATT&CK-based hunt campaigns</li><li>Develop new detection rules from findings</li><li>Analyze adversary TTPs</li><li>Red team / purple team exercises</li><li>Threat intelligence analysis</li><li><strong>Tools:</strong> SIEM, EDR, YARA, Sigma rules</li></ul></div>
                <div class="ops-category"><h4>SOC Manager</h4><ul><li>Oversee shift operations and staffing</li><li>Client communication and reporting</li><li>SLA management and metrics</li><li>Incident escalation decisions</li><li>Continuous improvement programs</li><li>Compliance evidence coordination</li><li><strong>Deliverables:</strong> Monthly SOC reports, QBRs</li></ul></div>
            </div>

            <h3 style="margin-top:20px">SOC KPIs & Metrics</h3>
            <table class="msp-comparison-table">
                <thead><tr><th>Metric</th><th>Target</th><th>Measurement</th><th>CMMC Relevance</th></tr></thead>
                <tbody>
                    <tr><td><strong>MTTA</strong> (Mean Time to Acknowledge)</td><td class="good">&lt; 15 min</td><td>Ticket creation → first analyst action</td><td>3.6.1 Incident Handling</td></tr>
                    <tr><td><strong>MTTR</strong> (Mean Time to Resolve)</td><td class="good">&lt; 4 hrs (P1)</td><td>Detection → containment complete</td><td>3.6.1, 3.6.2</td></tr>
                    <tr><td><strong>False Positive Rate</strong></td><td class="good">&lt; 30%</td><td>FP alerts / total alerts</td><td>3.3.5 Audit Review</td></tr>
                    <tr><td><strong>Detection Coverage</strong></td><td class="good">&gt; 80% ATT&CK</td><td>Techniques with active rules</td><td>3.14.6 Monitor Communications</td></tr>
                    <tr><td><strong>Log Source Health</strong></td><td class="good">&gt; 99%</td><td>Active sources / expected sources</td><td>3.3.1 System Auditing</td></tr>
                    <tr><td><strong>Patch SLA Compliance</strong></td><td class="good">&gt; 95%</td><td>Patched within SLA / total critical</td><td>3.14.1 Flaw Remediation</td></tr>
                    <tr><td><strong>Client Satisfaction</strong></td><td class="good">&gt; 4.5/5</td><td>Quarterly survey scores</td><td>Business metric</td></tr>
                </tbody>
            </table>

            <h3 style="margin-top:20px">DFARS 252.204-7012 Incident Reporting</h3>
            <div class="dfars-important" style="margin-top:8px;padding:12px;border-radius:6px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);font-size:0.78rem;">
                <strong>72-Hour Reporting Requirement:</strong> Cyber incidents affecting CUI must be reported to DIBNet within 72 hours. Forensic images must be preserved for 90 days minimum. The MSSP must have pre-established procedures for each client to ensure timely reporting. Report via <a href="https://dibnet.dod.mil" target="_blank" rel="noopener" style="color:#8ba2ff">DIBNet</a>.
            </div>
        </div>`;
    },

    renderLoggingReqs: function() {
        const reqs = [
            { ctrl: '3.3.1', title: 'Create audit records', logs: ['Authentication events', 'Authorization decisions', 'System events', 'Object access', 'Policy changes'] },
            { ctrl: '3.3.2', title: 'Unique user attribution', logs: ['User session logs', 'Service account activity', 'Privileged operations', 'Remote access'] },
            { ctrl: '3.3.4', title: 'Alert on failure', logs: ['Audit processing failures', 'Log storage alerts', 'Agent health', 'Disk space warnings'] },
            { ctrl: '3.3.5', title: 'Correlate audit review', logs: ['Cross-system correlation', 'Timeline analysis', 'Entity behavior analytics', 'UEBA'] },
            { ctrl: '3.3.8', title: 'Protect audit info', logs: ['Log integrity (hashing)', 'Immutable storage', 'Access controls on logs', 'Encryption at rest'] }
        ];
        return `<div class="logging-requirements">${reqs.map(r => `<div class="logging-req-card"><div class="req-header"><span class="req-control">${r.ctrl}</span><span class="req-title">${r.title}</span></div><div class="req-logs">${r.logs.map(l => `<span class="log-tag">${l}</span>`).join('')}</div></div>`).join('')}</div>`;
    },

    renderMSPBackendOps: function() {
        return `
        <div class="backend-ops-grid">
            <div class="ops-category"><h4>Access Separation</h4><ul><li>Dedicated admin accounts per client</li><li>Just-in-time access via PIM</li><li>Separate credentials for CUI environments</li><li>Break-glass procedures documented</li><li>PAM solution for privileged sessions</li></ul></div>
            <div class="ops-category"><h4>Data Isolation</h4><ul><li>Separate Log Analytics workspaces</li><li>Client-specific encryption keys</li><li>Network segmentation per client</li><li>No shared storage for CUI</li><li>Tenant-isolated SIEM indexes</li></ul></div>
            <div class="ops-category"><h4>Retention & Compliance</h4><ul><li>Minimum 1-year log retention</li><li>Immutable audit trails (WORM)</li><li>Regular compliance audits</li><li>Evidence preservation workflows</li><li>Automated retention policies</li></ul></div>
            <div class="ops-category"><h4>Incident Response</h4><ul><li>Client-specific IR playbooks</li><li>Escalation procedures per severity</li><li>Breach notification templates</li><li>Forensic preservation process</li><li>DFARS 72-hour reporting SOP</li></ul></div>
        </div>`;
    },

    // ==================== AUTOMATION VIEW ====================
    automation: function(portal) {
        return `
        <div class="msp-automation-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Automation & Compliance</h2><p>Automate compliance monitoring, remediation, and reporting across client environments.</p></div></div>
            <div class="automation-sections">
                <div class="msp-card"><div class="msp-card-header"><h3>Compliance as Code</h3></div><div class="msp-card-body">
                    <div class="automation-tools">
                        <div class="tool-card"><h4>Azure Policy</h4><p>Built-in CMMC initiative with 180+ policies</p><code>Microsoft.Authorization/policyAssignments</code></div>
                        <div class="tool-card"><h4>AWS Config</h4><p>Conformance packs for NIST 800-171</p><code>aws configservice put-conformance-pack</code></div>
                        <div class="tool-card"><h4>Terraform</h4><p>Infrastructure as Code with compliance modules</p><code>module "cmmc_baseline" { ... }</code></div>
                    </div>
                </div></div>
                <div class="msp-card"><div class="msp-card-header"><h3>Continuous Monitoring</h3></div><div class="msp-card-body">
                    <ul class="monitoring-list">
                        <li><strong>Defender for Cloud Secure Score</strong> - Real-time posture assessment</li>
                        <li><strong>AWS Security Hub</strong> - NIST 800-171 findings</li>
                        <li><strong>Sentinel Workbooks</strong> - CMMC compliance dashboards</li>
                        <li><strong>Custom KQL/SPL Queries</strong> - Control-specific evidence</li>
                    </ul>
                </div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>Automation Scripts</h3></div><div class="msp-card-body">${this.renderAutomationScripts()}</div></div>
            </div>
        </div>`;
    },

    renderAutomationScripts: function() {
        return `
        <div class="scripts-grid">
            <div class="script-card"><h5>Enable MFA for All Users</h5><pre><code># Entra ID
Connect-MgGraph -Scopes "Policy.ReadWrite.ConditionalAccess"
New-MgIdentityConditionalAccessPolicy -DisplayName "Require MFA" \\
  -State "enabled" -Conditions @{...} -GrantControls @{...}</code></pre></div>
            <div class="script-card"><h5>Configure Audit Logging</h5><pre><code># Enable unified audit log
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true

# Azure Activity Logs to Log Analytics
az monitor diagnostic-settings create --resource /subscriptions/{id} \\
  --workspace {workspace-id} --logs '[{"category":"Administrative","enabled":true}]'</code></pre></div>
            <div class="script-card"><h5>Deploy Security Baseline</h5><pre><code># Intune Security Baseline
$baseline = Get-MgDeviceManagementIntent -Filter "displayName eq 'CMMC Baseline'"
New-MgDeviceManagementIntentAssignment -DeviceManagementIntentId $baseline.Id \\
  -Target @{"@odata.type"="#microsoft.graph.allDevicesAssignmentTarget"}</code></pre></div>
        </div>`;
    },

    // ==================== DOCUMENTATION VIEW ====================
    documentation: function(portal) {
        return `
        <div class="msp-documentation-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Best Practices & Documentation</h2><p>Reference guides, templates, and procedures for CMMC compliance management.</p></div></div>
            <div class="docs-grid">
                <div class="doc-section"><h3>📋 Official CMMC Resources</h3><ul class="doc-list">
                    <li><a href="https://dodcio.defense.gov/CMMC/" target="_blank" rel="noopener">CMMC Model Overview ↗</a></li>
                    <li><a href="https://cyberab.org/" target="_blank" rel="noopener">Cyber AB (Accreditation Body) ↗</a></li>
                    <li><a href="https://cyberab.org/Marketplace" target="_blank" rel="noopener">CMMC Marketplace ↗</a></li>
                    <li><a href="https://www.acq.osd.mil/cmmc/" target="_blank" rel="noopener">DoD CMMC Program Office ↗</a></li>
                    <li><a href="https://sam.gov" target="_blank" rel="noopener">SAM.gov Registration ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>📚 NIST Publications</h3><ul class="doc-list">
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final" target="_blank" rel="noopener">NIST SP 800-171 Rev 2 ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-171a/final" target="_blank" rel="noopener">NIST SP 800-171A (Assessment) ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-172/final" target="_blank" rel="noopener">NIST SP 800-172 (Enhanced) ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final" target="_blank" rel="noopener">NIST SP 800-53 Rev 5 ↗</a></li>
                    <li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>☁️ Cloud Provider Resources</h3><ul class="doc-list">
                    <li><a href="https://portal.azure.us" target="_blank" rel="noopener">Azure Government Portal ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc" target="_blank" rel="noopener">Azure CMMC Documentation ↗</a></li>
                    <li><a href="https://console.amazonaws-us-gov.com" target="_blank" rel="noopener">AWS GovCloud Console ↗</a></li>
                    <li><a href="https://aws.amazon.com/compliance/cmmc/" target="_blank" rel="noopener">AWS CMMC Compliance ↗</a></li>
                    <li><a href="https://cloud.google.com/security/compliance/fedramp" target="_blank" rel="noopener">GCP FedRAMP Compliance ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>🛡️ FedRAMP & DoD Resources</h3><ul class="doc-list">
                    <li><a href="https://marketplace.fedramp.gov/" target="_blank" rel="noopener">FedRAMP Marketplace ↗</a></li>
                    <li><a href="https://www.fedramp.gov/baselines/" target="_blank" rel="noopener">FedRAMP Baselines ↗</a></li>
                    <li><a href="https://public.cyber.mil/dccs/" target="_blank" rel="noopener">DoD Cloud Computing SRG ↗</a></li>
                    <li><a href="https://public.cyber.mil/stigs/" target="_blank" rel="noopener">DISA STIGs ↗</a></li>
                    <li><a href="https://www.cisa.gov/resources-tools/resources/cisa-zero-trust-maturity-model" target="_blank" rel="noopener">CISA Zero Trust Model ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>� Technical Guides</h3><ul class="doc-list">
                    <li><a href="https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-get-started-connect-with-portal" target="_blank" rel="noopener">Azure Gov Getting Started ↗</a></li>
                    <li><a href="https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/getting-started.html" target="_blank" rel="noopener">AWS GovCloud Getting Started ↗</a></li>
                    <li><a href="https://cloud.google.com/assured-workloads/docs" target="_blank" rel="noopener">GCP Assured Workloads Docs ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/azure/sentinel/cmmc-guide" target="_blank" rel="noopener">Sentinel CMMC Workbook ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview" target="_blank" rel="noopener">Conditional Access Overview ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>🎓 Training & Certification</h3><ul class="doc-list">
                    <li><a href="https://cyberab.org/Training" target="_blank" rel="noopener">Cyber AB Training Programs ↗</a></li>
                    <li><a href="https://www.comptia.org/certifications/security" target="_blank" rel="noopener">CompTIA Security+ ↗</a></li>
                    <li><a href="https://www.isc2.org/Certifications/CISSP" target="_blank" rel="noopener">ISC2 CISSP ↗</a></li>
                    <li><a href="https://csrc.nist.gov/projects/olir" target="_blank" rel="noopener">NIST OLIR Training ↗</a></li>
                    <li><a href="https://niccs.cisa.gov/" target="_blank" rel="noopener">NICCS Training Catalog ↗</a></li>
                </ul></div>
            </div>
            <div class="msp-card full-width" style="margin-top: 20px;">
                <div class="msp-card-header"><h3>📥 In-App Tools</h3></div>
                <div class="msp-card-body">
                    <div class="in-app-tools-grid">
                        <button class="msp-tool-btn" data-action="close-and-navigate" data-param="sprs">
                            ${portal.getIcon('bar-chart')}<span>SPRS Calculator</span>
                        </button>
                        <button class="msp-tool-btn" data-action="close-and-navigate" data-param="crosswalk">
                            ${portal.getIcon('layers')}<span>Framework Crosswalk</span>
                        </button>
                        <button class="msp-tool-btn" data-action="close-and-navigate" data-param="impl-planner">
                            ${portal.getIcon('calendar')}<span>Implementation Planner</span>
                        </button>
                        <button class="msp-tool-btn" data-action="switch-view" data-param="reports">
                            ${portal.getIcon('file-text')}<span>Generate Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    // Default dashboard passthrough
    dashboard: function(portal) {
        return portal.renderDashboard();
    },

    // ==================== AUTOMATION PLATFORMS VIEW ====================
    'automation-platforms': function(portal) {
        const data = typeof MSP_AUTOMATION_PLATFORMS !== 'undefined' ? MSP_AUTOMATION_PLATFORMS : null;
        if (!data) return '<div class="msp-empty-state"><p>Automation platforms data not loaded</p></div>';
        
        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>RMM & Automation Tools</h2><p>FedRAMP-authorized platforms for managing client environments securely</p></div></div>
            <div class="msp-data-tabs">
                <button class="msp-data-tab active" data-section="remoteManagement">RMM Platforms</button>
                <button class="msp-data-tab" data-section="passwordManagement">Password Management</button>
                <button class="msp-data-tab" data-section="workflowAutomation">Workflow Automation</button>
                <button class="msp-data-tab" data-section="mdmSolutions">MDM Solutions</button>
            </div>
            <div class="msp-data-content" id="automation-platforms-content">
                ${this.renderAutomationPlatformsSection(data, 'remoteManagement')}
            </div>
        </div>`;
    },

    renderAutomationPlatformsSection: function(data, sectionKey) {
        const section = data[sectionKey];
        if (!section) return '<p>Section not found</p>';
        
        const platforms = section.platforms || [];
        return `
        <div class="data-section">
            <h3>${section.title || sectionKey}</h3>
            <p class="section-desc">${section.description || ''}</p>
            <div class="platforms-grid">
                ${platforms.map(p => this.renderPlatformCard(p)).join('')}
            </div>
        </div>`;
    },

    renderPlatformCard: function(platform) {
        const fedrampClass = platform.fedrampStatus?.includes('Authorized') ? 'authorized' : 
                            platform.fedrampStatus?.includes('In Process') ? 'in-process' : 'pending';
        return `
        <div class="platform-card">
            <div class="platform-header">
                <h4>${platform.name}</h4>
                <span class="fedramp-badge ${fedrampClass}">${platform.fedrampStatus || 'Unknown'}</span>
            </div>
            ${platform.url ? `<a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="platform-link">Documentation ↗</a>` : ''}
            ${platform.encryptionMethod ? `<div class="platform-meta"><strong>Encryption:</strong> ${platform.encryptionMethod}</div>` : ''}
            ${platform.features ? `
                <div class="platform-features">
                    <strong>Features:</strong>
                    <ul>${platform.features.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>` : ''}
            ${platform.cmmcAlignment ? `
                <div class="cmmc-alignment">
                    <strong>CMMC Controls:</strong>
                    <div class="control-tags">${platform.cmmcAlignment.map(c => `<span class="control-tag">${c}</span>`).join('')}</div>
                </div>` : ''}
            ${platform.bestPractices ? `
                <div class="best-practices">
                    <strong>Best Practices:</strong>
                    <ul>${platform.bestPractices.map(bp => `<li>${bp}</li>`).join('')}</ul>
                </div>` : ''}
        </div>`;
    },

    // ==================== CLOUD TEMPLATES VIEW ====================
    'cloud-templates': function(portal) {
        const data = typeof MSP_CLOUD_TEMPLATES !== 'undefined' ? MSP_CLOUD_TEMPLATES : null;
        if (!data) return '<div class="msp-empty-state"><p>Cloud templates data not loaded</p></div>';
        
        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Cloud Deployment Templates</h2><p>Infrastructure-as-Code templates for CMMC-compliant cloud environments</p></div></div>
            <div class="msp-data-tabs">
                <button class="msp-data-tab active" data-section="azure">Azure GCC High</button>
                ${data.aws ? '<button class="msp-data-tab" data-section="aws">AWS GovCloud</button>' : ''}
                ${data.gcp ? '<button class="msp-data-tab" data-section="gcp">GCP Assured Workloads</button>' : ''}
            </div>
            <div class="msp-data-content" id="cloud-templates-content">
                ${this.renderCloudTemplatesSection(data, 'azure')}
            </div>
        </div>`;
    },

    renderCloudTemplatesSection: function(data, provider) {
        const section = data[provider];
        if (!section) return '<p>No templates available for this provider</p>';
        
        let html = `<div class="data-section"><h3>${section.title || provider.toUpperCase()}</h3>`;
        if (section.consoleUrl) {
            html += `<p><a href="${section.consoleUrl}" target="_blank" rel="noopener noreferrer" class="platform-link">Open Console ↗</a></p>`;
        }
        
        // Iterate through all keys in the section that are objects (templates)
        Object.keys(section).forEach(key => {
            if (typeof section[key] === 'object' && section[key] !== null && key !== 'consoleUrl') {
                const template = section[key];
                if (template.title || template.terraformTemplate || template.description) {
                    html += this.renderCloudTemplate(template, key);
                }
            }
        });
        
        html += '</div>';
        return html;
    },

    renderCloudTemplate: function(template, type) {
        if (!template) return '';
        const title = template.title || type.charAt(0).toUpperCase() + type.slice(1);
        
        // Collect all code templates (terraformTemplate, windowsServerTemplate, linuxServerTemplate, etc.)
        const codeTemplates = [];
        Object.keys(template).forEach(key => {
            if (key.toLowerCase().includes('template') && typeof template[key] === 'string') {
                const label = key.replace(/([A-Z])/g, ' $1').replace('Template', '').trim();
                codeTemplates.push({ label, code: template[key] });
            }
        });
        
        return `
        <div class="template-card">
            <div class="template-header">
                <h4>${title}</h4>
            </div>
            ${template.description ? `<p class="template-desc">${template.description}</p>` : ''}
            ${template.securityBaseline?.settings ? `
                <div class="best-practices" style="margin-bottom:16px;">
                    <strong>${template.securityBaseline.title || 'Security Baseline'}:</strong>
                    <table class="msp-table" style="margin-top:8px;font-size:0.85rem;">
                        <thead><tr><th>Setting</th><th>Value</th><th>Control</th></tr></thead>
                        <tbody>${template.securityBaseline.settings.map(s => `<tr><td>${s.setting}</td><td>${s.value}</td><td><code>${s.control}</code></td></tr>`).join('')}</tbody>
                    </table>
                </div>` : ''}
            ${codeTemplates.map(t => `
                <div class="code-section" style="margin-bottom:16px;">
                    <strong>${t.label}:</strong>
                    <pre class="code-block" style="max-height:300px;overflow:auto;"><code>${this.escapeHtml(t.code.substring(0, 2500))}${t.code.length > 2500 ? '\n\n... (truncated)' : ''}</code></pre>
                </div>`).join('')}
        </div>`;
    },

    // ==================== CLOUD COMPLIANCE TOOLKITS VIEW ====================
    'cloud-toolkits': function(portal) {
        const aws = typeof MSP_AWS_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AWS_COMPLIANCE_TOOLKIT : null;
        const azure = typeof MSP_AZURE_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AZURE_COMPLIANCE_TOOLKIT : null;
        const gcp = typeof MSP_GCP_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_GCP_COMPLIANCE_TOOLKIT : null;

        if (!aws && !azure && !gcp) return '<div class="msp-empty-state"><p>Cloud compliance toolkit data not loaded</p></div>';

        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner">
                <div class="banner-content">
                    <h2>Cloud Compliance Toolkits</h2>
                    <p>Production-ready templates, functions, detection rules, and orchestration patterns for CMMC/FedRAMP compliance across AWS, Azure, and GCP.</p>
                </div>
            </div>
            <div class="msp-data-tabs">
                ${aws ? '<button class="msp-data-tab active" data-section="aws">AWS GovCloud</button>' : ''}
                ${azure ? '<button class="msp-data-tab' + (!aws ? ' active' : '') + '" data-section="azure">Azure GCC High</button>' : ''}
                ${gcp ? '<button class="msp-data-tab' + (!aws && !azure ? ' active' : '') + '" data-section="gcp">GCP Assured Workloads</button>' : ''}
            </div>
            <div class="msp-data-content" id="cloud-toolkits-content">
                ${this.renderCloudToolkitContent(aws ? 'aws' : azure ? 'azure' : 'gcp')}
            </div>
        </div>`;
    },

    renderCloudToolkitContent: function(provider) {
        const aws = typeof MSP_AWS_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AWS_COMPLIANCE_TOOLKIT : null;
        const azure = typeof MSP_AZURE_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_AZURE_COMPLIANCE_TOOLKIT : null;
        const gcp = typeof MSP_GCP_COMPLIANCE_TOOLKIT !== 'undefined' ? MSP_GCP_COMPLIANCE_TOOLKIT : null;

        if (provider === 'aws' && aws) return this._renderAWSProvider(aws);
        if (provider === 'azure' && azure) return this._renderAzureProvider(azure);
        if (provider === 'gcp' && gcp) return this._renderGCPProvider(gcp);
        return '<p>Provider data not loaded</p>';
    },

    _renderAWSProvider: function(data) {
        const tabs = [
            { id: 'cloudformation', label: 'CloudFormation' },
            { id: 'lambda', label: 'Lambda Functions' },
            { id: 'ssm', label: 'Systems Manager' },
            { id: 'orchestration', label: 'Orchestration' },
            { id: 'athena', label: 'Athena Queries' },
            { id: 'quickref', label: 'Service Map' }
        ];
        return this._renderProviderWithSubTabs(data, tabs, 'aws');
    },

    _renderAzureProvider: function(data) {
        const tabs = [
            { id: 'arm', label: 'ARM / Bicep' },
            { id: 'functions', label: 'Azure Functions' },
            { id: 'logicapps', label: 'Logic Apps' },
            { id: 'sentinel', label: 'Sentinel Analytics' },
            { id: 'lighthouse', label: 'Lighthouse & Multi-Tenant' },
            { id: 'quickref', label: 'Service Map' }
        ];
        return this._renderProviderWithSubTabs(data, tabs, 'azure');
    },

    _renderGCPProvider: function(data) {
        const tabs = [
            { id: 'infra', label: 'Terraform / gcloud' },
            { id: 'functions', label: 'Cloud Functions' },
            { id: 'chronicle', label: 'Chronicle SIEM' },
            { id: 'bigquery', label: 'BigQuery Queries' },
            { id: 'quickref', label: 'Service Map' }
        ];
        return this._renderProviderWithSubTabs(data, tabs, 'gcp');
    },

    _renderProviderWithSubTabs: function(data, tabs, provider) {
        const activeTab = tabs[0].id;
        return `
            <div class="ctk-provider-header">
                <h3>${data.overview.title}</h3>
                <p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0 12px">${data.overview.description}</p>
            </div>
            <div class="ctk-sub-tabs" data-provider="${provider}">
                ${tabs.map((t, i) => `<button class="ctk-sub-tab ${i === 0 ? 'active' : ''}" data-subtab="${t.id}">${t.label}</button>`).join('')}
            </div>
            <div class="ctk-sub-content" id="ctk-sub-content-${provider}">
                ${this._renderProviderSubSection(data, activeTab, provider)}
            </div>`;
    },

    _renderProviderSubSection: function(data, tabId, provider) {
        if (provider === 'aws') {
            if (tabId === 'cloudformation') return this._renderCFNSection(data.cloudformation);
            if (tabId === 'lambda') return this._renderLambdaSection(data.lambda);
            if (tabId === 'ssm') return this._renderSSMSection(data.systemsManager);
            if (tabId === 'orchestration') return this._renderOrchSection(data.orchestration);
            if (tabId === 'athena') return this._renderAthenaSection(data.athena);
            if (tabId === 'quickref') return this._renderQuickRefSection(data.quickReference);
        } else if (provider === 'azure') {
            if (tabId === 'arm') return this._renderCFNSection(data.armTemplates);
            if (tabId === 'functions') return this._renderLambdaSection(data.functions);
            if (tabId === 'logicapps') return this._renderLogicAppsSection(data.logicApps);
            if (tabId === 'sentinel') return this._renderAthenaSection(data.sentinelAnalytics);
            if (tabId === 'lighthouse') return this._renderOrchSection(data.multiTenant);
            if (tabId === 'quickref') return this._renderQuickRefSection(data.quickReference);
        } else if (provider === 'gcp') {
            if (tabId === 'infra') return this._renderCFNSection(data.infrastructure);
            if (tabId === 'functions') return this._renderLambdaSection(data.functions);
            if (tabId === 'chronicle') return this._renderAthenaSection(data.chronicleDetections);
            if (tabId === 'bigquery') return this._renderAthenaSection(data.bigqueryQueries);
            if (tabId === 'quickref') return this._renderQuickRefSection(data.quickReference);
        }
        return '<p>Section not found</p>';
    },

    _renderLogicAppsSection: function(la) {
        if (!la) return '<p>No Logic Apps data</p>';
        return `<div class="data-section">
            <h3>${la.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${la.description}</p>
            ${la.workflows.map(w => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${w.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${w.category}</span>
                            <span class="msp-badge" style="background:rgba(52,211,153,0.12);color:#34d399;font-size:0.7rem">${w.type}</span>
                        </div>
                    </div>
                    <p class="template-desc">${w.description}</p>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${w.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    <details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View Workflow Definition</summary>
                        <pre class="code-block" style="max-height:400px;overflow:auto"><code>${this.escapeHtml(w.template)}</code></pre>
                    </details>
                </div>
            `).join('')}
        </div>`;
    },

    _renderCFNSection: function(cfn) {
        if (!cfn) return '<p>No CloudFormation data</p>';
        return `<div class="data-section">
            <h3>${cfn.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${cfn.description}</p>
            ${cfn.stacks.map(s => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${s.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${s.category}</span>
                            <span class="msp-badge" style="background:rgba(52,211,153,0.12);color:#34d399;font-size:0.7rem">${s.deployMethod}</span>
                        </div>
                    </div>
                    <p class="template-desc">${s.description}</p>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${s.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    <details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View CloudFormation Template</summary>
                        <pre class="code-block" style="max-height:400px;overflow:auto"><code>${this.escapeHtml(s.template)}</code></pre>
                    </details>
                </div>
            `).join('')}
        </div>`;
    },

    _renderLambdaSection: function(lam) {
        if (!lam) return '<p>No Lambda data</p>';
        return `<div class="data-section">
            <h3>${lam.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${lam.description}</p>
            ${lam.functions.map(fn => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${fn.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${fn.category}</span>
                            <span class="msp-badge" style="background:rgba(251,191,36,0.12);color:#fbbf24;font-size:0.7rem">${fn.runtime}</span>
                            <span class="msp-badge" style="background:rgba(139,162,255,0.12);color:#8ba2ff;font-size:0.7rem">${fn.trigger}</span>
                        </div>
                    </div>
                    <p class="template-desc">${fn.description}</p>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${fn.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    ${fn.envVars ? `<div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">Environment Variables:</strong>
                        <table class="msp-table" style="margin-top:6px;font-size:0.8rem">
                            <thead><tr><th>Variable</th><th>Default</th></tr></thead>
                            <tbody>${Object.entries(fn.envVars).map(([k,v]) => '<tr><td><code>' + k + '</code></td><td>' + this.escapeHtml(v) + '</td></tr>').join('')}</tbody>
                        </table>
                    </div>` : ''}
                    <details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View Lambda Code</summary>
                        <pre class="code-block" style="max-height:400px;overflow:auto"><code>${this.escapeHtml(fn.code)}</code></pre>
                    </details>
                    ${fn.iamPolicy ? `<details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View IAM Policy</summary>
                        <pre class="code-block" style="max-height:250px;overflow:auto"><code>${this.escapeHtml(fn.iamPolicy)}</code></pre>
                    </details>` : ''}
                </div>
            `).join('')}
        </div>`;
    },

    _renderSSMSection: function(ssm) {
        if (!ssm) return '<p>No Systems Manager data</p>';
        return `<div class="data-section">
            <h3>${ssm.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${ssm.description}</p>
            ${ssm.documents.map(doc => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${doc.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${doc.category}</span>
                            <span class="msp-badge" style="background:rgba(52,211,153,0.12);color:#34d399;font-size:0.7rem">${doc.type}</span>
                        </div>
                    </div>
                    <p class="template-desc">${doc.description}</p>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${doc.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    <details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View Commands / Template</summary>
                        <pre class="code-block" style="max-height:400px;overflow:auto"><code>${this.escapeHtml(doc.template)}</code></pre>
                    </details>
                </div>
            `).join('')}
        </div>`;
    },

    _renderOrchSection: function(orch) {
        if (!orch) return '<p>No Orchestration data</p>';
        return `<div class="data-section">
            <h3>${orch.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${orch.description}</p>
            ${orch.patterns.map(p => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${p.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${p.category}</span>
                        </div>
                    </div>
                    <p class="template-desc">${p.description}</p>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${p.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    <details class="aws-tk-code-details">
                        <summary class="aws-tk-code-summary">View Template</summary>
                        <pre class="code-block" style="max-height:400px;overflow:auto"><code>${this.escapeHtml(p.template)}</code></pre>
                    </details>
                </div>
            `).join('')}
        </div>`;
    },

    _renderAthenaSection: function(athena) {
        if (!athena) return '<p>No Athena data</p>';
        return `<div class="data-section">
            <h3>${athena.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${athena.description}</p>
            ${athena.queries.map(q => `
                <div class="template-card">
                    <div class="template-header">
                        <h4>${q.name}</h4>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                            <span class="msp-badge" style="background:rgba(108,138,255,0.12);color:#6c8aff;font-size:0.7rem">${q.category}</span>
                        </div>
                    </div>
                    <div style="margin-bottom:10px">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">CMMC Controls:</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted)"> ${q.controls.map(c => '<code>' + c + '</code>').join(' ')}</span>
                    </div>
                    <details class="aws-tk-code-details" open>
                        <summary class="aws-tk-code-summary">SQL Query</summary>
                        <pre class="code-block" style="max-height:300px;overflow:auto"><code>${this.escapeHtml(q.sql)}</code></pre>
                    </details>
                </div>
            `).join('')}
        </div>`;
    },

    _renderQuickRefSection: function(ref) {
        if (!ref) return '<p>No quick reference data</p>';
        return `<div class="data-section">
            <h3>${ref.title}</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem">${ref.description}</p>
            <table class="msp-table" style="font-size:0.82rem">
                <thead><tr><th>AWS Service</th><th>Category</th><th>CMMC Controls</th></tr></thead>
                <tbody>
                    ${ref.mappings.map(m => `<tr>
                        <td><strong>${m.service}</strong></td>
                        <td><span class="msp-badge" style="background:rgba(108,138,255,0.08);color:#8ba2ff;font-size:0.72rem">${m.category}</span></td>
                        <td>${m.controls.map(c => '<code style="font-size:0.75rem">' + c + '</code>').join(' ')}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    },

    // ==================== EVIDENCE LISTS VIEW ====================
    'evidence-lists': function(portal) {
        const data = typeof MSP_EVIDENCE_LISTS !== 'undefined' ? MSP_EVIDENCE_LISTS : null;
        if (!data) return '<div class="msp-empty-state"><p>Evidence lists data not loaded</p></div>';

        const familyMap = {
            accessControl: { id: 'AC', name: 'Access Control', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
            awarenessTraining: { id: 'AT', name: 'Awareness & Training', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>' },
            auditAccountability: { id: 'AU', name: 'Audit & Accountability', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
            configurationManagement: { id: 'CM', name: 'Configuration Management', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
            identificationAuthentication: { id: 'IA', name: 'Identification & Auth', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
            incidentResponse: { id: 'IR', name: 'Incident Response', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
            maintenance: { id: 'MA', name: 'Maintenance', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>' },
            mediaProtection: { id: 'MP', name: 'Media Protection', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' },
            personnelSecurity: { id: 'PS', name: 'Personnel Security', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
            physicalProtection: { id: 'PE', name: 'Physical Protection', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
            riskAssessment: { id: 'RA', name: 'Risk Assessment', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
            securityAssessment: { id: 'CA', name: 'Security Assessment', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>' },
            systemCommunicationsProtection: { id: 'SC', name: 'System & Comms', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
            systemInformationIntegrity: { id: 'SI', name: 'System & Info Integrity', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' }
        };

        const families = Object.entries(familyMap)
            .filter(([key]) => data[key])
            .map(([key, info]) => ({ key, ...info, data: data[key] }));

        // Count total controls and evidence items
        let totalControls = 0, totalEvidence = 0, totalAutomated = 0;
        families.forEach(f => {
            const controls = f.data.controls || [];
            totalControls += controls.length;
            controls.forEach(c => {
                totalEvidence += (c.evidenceItems || []).length;
                if (c.automatedCollection) totalAutomated++;
            });
        });

        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner">
                <div class="banner-content">
                    <h2>Evidence Collection Lists</h2>
                    <p>Comprehensive evidence requirements for all 14 CMMC control families with automated collection commands</p>
                </div>
            </div>
            <div class="dp-stats-strip ev-stats-strip">
                <div class="dp-stat"><span class="dp-stat-num">${families.length}</span><span class="dp-stat-label">Families</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${totalControls}</span><span class="dp-stat-label">Controls</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${totalEvidence}</span><span class="dp-stat-label">Evidence Items</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${totalAutomated}</span><span class="dp-stat-label">Automated</span></div>
            </div>
            <div class="ev-search-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" class="ev-search-input" placeholder="Search evidence items across all families..." id="ev-search-input">
            </div>
            <div class="evidence-family-nav ev-family-nav-enhanced">
                ${families.map((f, i) => `<button class="family-nav-btn ${i === 0 ? 'active' : ''}" data-family="${f.key}" title="${f.name}">${f.icon}<span class="ev-nav-label">${f.id}</span><span class="ev-nav-count">${(f.data.controls || []).length}</span></button>`).join('')}
            </div>
            <div class="msp-data-content" id="evidence-lists-content">
                ${families.length > 0 ? this.renderEvidenceFamily(families[0]) : '<p>No evidence lists available</p>'}
            </div>
        </div>`;
    },

    renderEvidenceFamily: function(family) {
        if (!family || !family.data) return '<p>Family not found</p>';

        const familyData = family.data;
        const controls = familyData.controls || [];
        const totalItems = controls.reduce((sum, c) => sum + (c.evidenceItems || []).length, 0);
        const autoCount = controls.filter(c => c.automatedCollection).length;

        return `
        <div class="ev-family">
            <div class="ev-family-header">
                <div class="ev-family-title">
                    <h3>${family.id} - ${familyData.familyName || family.name}</h3>
                    <p>${familyData.description || ''}</p>
                </div>
                <div class="ev-family-stats">
                    <span class="ev-fstat">${controls.length} controls</span>
                    <span class="ev-fstat">${totalItems} evidence items</span>
                    ${autoCount > 0 ? `<span class="ev-fstat ev-fstat-auto">${autoCount} automated</span>` : ''}
                </div>
            </div>
            <div class="ev-controls-list">
                ${controls.map((c, i) => this.renderEvidenceControl(c, i === 0)).join('')}
            </div>
        </div>`;
    },

    renderEvidenceControl: function(control, expandFirst) {
        const evidenceItems = control.evidenceItems || control.evidence || [];
        const autoCollection = control.automatedCollection;
        const hasAuto = !!autoCollection;

        return `
        <details class="ev-control-card" ${expandFirst ? 'open' : ''}>
            <summary class="ev-control-summary">
                <span class="ev-ctrl-id">${control.controlId || control.id}</span>
                <span class="ev-ctrl-title">${control.title || control.name || ''}</span>
                <span class="ev-ctrl-badges">
                    <span class="ev-item-count">${evidenceItems.length} items</span>
                    ${hasAuto ? '<span class="ev-auto-badge">Automated</span>' : ''}
                </span>
                <svg class="dp-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="ev-control-body">
                <div class="ev-howto-tip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>Collect these artifacts and store them in a labeled folder: <code>${control.controlId || control.id}/</code></span>
                </div>
                <div class="ev-items-grid">
                    ${evidenceItems.map((e, i) => {
                        const name = typeof e === 'string' ? e : e.name || e.item;
                        const isConfig = /config|setting|policy|GPO|Intune/i.test(name);
                        const isLog = /log|record|audit|report/i.test(name);
                        const isDoc = /document|procedure|policy|SOP|plan/i.test(name);
                        const isScreenshot = /screenshot|evidence|proof/i.test(name);
                        const typeClass = isConfig ? 'config' : isLog ? 'log' : isDoc ? 'doc' : isScreenshot ? 'screenshot' : 'general';
                        const typeLabel = isConfig ? 'Config' : isLog ? 'Log/Report' : isDoc ? 'Document' : isScreenshot ? 'Screenshot' : 'Artifact';
                        return `
                        <div class="ev-item" data-search="${this.escapeHtml(name.toLowerCase())}">
                            <div class="ev-item-header">
                                <span class="ev-item-num">${i + 1}</span>
                                <span class="ev-item-name">${name}</span>
                                <span class="ev-item-type ${typeClass}">${typeLabel}</span>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
                ${hasAuto ? `
                <div class="ev-auto-section">
                    <div class="ev-auto-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        <strong>Automated Collection Commands</strong>
                    </div>
                    ${typeof autoCollection === 'object' ? Object.entries(autoCollection).map(([platform, cmd]) => `
                        <div class="ev-auto-cmd">
                            <div class="ev-auto-cmd-header">
                                <span class="ev-auto-platform">${platform.toUpperCase()}</span>
                                <button class="dp-copy-btn dp-copy-sm" data-action="copy-code">Copy</button>
                            </div>
                            <pre class="ev-auto-code"><code>${this.escapeHtml(cmd)}</code></pre>
                        </div>
                    `).join('') : `
                        <div class="ev-auto-cmd">
                            <button class="dp-copy-btn dp-copy-sm" data-action="copy-code" style="float:right">Copy</button>
                            <pre class="ev-auto-code"><code>${this.escapeHtml(autoCollection)}</code></pre>
                        </div>
                    `}
                </div>` : ''}
            </div>
        </details>`;
    },

    // ==================== DATA PROTECTION VIEW ====================
    'data-protection': function(portal) {
        const data = typeof MSP_DATA_PROTECTION !== 'undefined' ? MSP_DATA_PROTECTION : null;
        if (!data) return '<div class="msp-empty-state"><p>Data protection data not loaded</p></div>';

        const purview = data.purview || {};
        const availableTabs = [];
        if (purview.sensitivityLabels) availableTabs.push({ key: 'sensitivityLabels', label: 'Sensitivity Labels', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' });
        if (purview.sensitiveInfoTypes) availableTabs.push({ key: 'sensitiveInfoTypes', label: 'Info Types', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' });
        if (purview.dlpPolicies) availableTabs.push({ key: 'dlpPolicies', label: 'DLP Policies', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' });
        if (purview.autoLabeling) availableTabs.push({ key: 'autoLabeling', label: 'Auto-Labeling', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' });
        if (data.aipScanner) availableTabs.push({ key: 'aipScanner', label: 'AIP Scanner', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' });
        if (data.endpointDlp) availableTabs.push({ key: 'endpointDlp', label: 'Endpoint DLP', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>' });
        if (data.defenderCloudApps) availableTabs.push({ key: 'defenderCloudApps', label: 'Cloud Apps', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>' });
        if (data.cuiCategories) availableTabs.push({ key: 'cuiCategories', label: 'CUI Categories', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' });
        if (data.implementationChecklist) availableTabs.push({ key: 'implementationChecklist', label: 'Checklist', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>' });

        // CMMC control mapping summary
        const controlMap = data.cmmcControlMapping || {};
        const controlCount = Object.keys(controlMap).length;

        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner">
                <div class="banner-content">
                    <h2>Data Protection Guide</h2>
                    <p>Microsoft Purview information protection, sensitivity labels, DLP, endpoint protection, and CUI classification for CMMC Level 2</p>
                </div>
            </div>
            <div class="dp-stats-strip">
                <div class="dp-stat"><span class="dp-stat-num">${availableTabs.length}</span><span class="dp-stat-label">Protection Areas</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${controlCount}</span><span class="dp-stat-label">CMMC Controls</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${(purview.sensitivityLabels?.labelHierarchy || []).length}</span><span class="dp-stat-label">Label Tiers</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${(purview.sensitiveInfoTypes?.customTypes || []).length}</span><span class="dp-stat-label">Info Types</span></div>
                <div class="dp-stat"><span class="dp-stat-num">${(purview.dlpPolicies?.policies || []).length}</span><span class="dp-stat-label">DLP Policies</span></div>
            </div>
            ${controlCount > 0 ? `<div class="dp-control-strip"><strong>CMMC Controls Addressed:</strong> ${Object.keys(controlMap).map(c => '<span class="dp-ctrl-badge">' + c + '</span>').join('')}</div>` : ''}
            <div class="msp-data-tabs dp-tabs-scrollable">
                ${availableTabs.map((t, i) => `<button class="msp-data-tab ${i === 0 ? 'active' : ''}" data-section="${t.key}">${t.icon} ${t.label}</button>`).join('')}
            </div>
            <div class="msp-data-content" id="data-protection-content">
                ${availableTabs.length > 0 ? this.renderDataProtectionSection(data, availableTabs[0].key) : '<p>No data protection content available</p>'}
            </div>
        </div>`;
    },

    renderDataProtectionSection: function(data, sectionKey) {
        const purview = data.purview || {};
        // Some sections are on purview, some on root data
        const section = purview[sectionKey] || data[sectionKey];
        if (!section) return '<p>Section not found: ' + sectionKey + '</p>';

        switch (sectionKey) {
            case 'sensitivityLabels': return this.renderSensitivityLabels(section);
            case 'sensitiveInfoTypes': return this.renderSensitiveInfoTypes(section);
            case 'dlpPolicies': return this.renderDLPPolicies(section);
            case 'autoLabeling': return this.renderAutoLabeling(section);
            case 'aipScanner': return this.renderAIPScanner(section);
            case 'endpointDlp': return this.renderEndpointDLP(section);
            case 'defenderCloudApps': return this.renderCloudApps(section);
            case 'cuiCategories': return this.renderCUICategories(section);
            case 'implementationChecklist': return this.renderDPChecklist(section);
            default: return this.renderGenericDataSection(section);
        }
    },

    _dpCopyBtn: function(text, label) {
        return `<button class="dp-copy-btn" data-action="copy-data" data-copy="${this.escapeHtml(text)}" data-label="${label || 'Copy'}">${label || 'Copy'}</button>`;
    },

    _dpCodeBlock: function(code, lang) {
        return `<div class="dp-code-wrap"><div class="dp-code-header"><span class="dp-code-lang">${lang || 'PowerShell'}</span><button class="dp-copy-btn" data-action="copy-code">Copy</button></div><pre class="dp-code-block"><code>${this.escapeHtml(code)}</code></pre></div>`;
    },

    renderSensitivityLabels: function(section) {
        const labels = section.labelHierarchy || [];
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Sensitivity Labels'}</h3>
                <p>${section.description || ''}</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Implement</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Navigate to Purview:</strong> Go to <a href="https://compliance.microsoft.us" target="_blank" rel="noopener">compliance.microsoft.us</a> (GCC High) &rarr; Information Protection &rarr; Labels</li>
                        <li><strong>Create label hierarchy:</strong> Start with Public, then Internal, Confidential, and CUI tiers below</li>
                        <li><strong>Configure encryption:</strong> Enable Azure RMS encryption for Confidential and all CUI sub-labels</li>
                        <li><strong>Set content markings:</strong> Add headers, footers, and watermarks per the CUI marking guide</li>
                        <li><strong>Publish to users:</strong> Create a label policy targeting your CUI-authorized users first (pilot), then expand</li>
                        <li><strong>Enable mandatory labeling:</strong> Require users to apply a label before saving or sending</li>
                    </ol>
                </div>
            </div>
            <h4 class="dp-sub-heading">Label Hierarchy</h4>
            <div class="dp-labels-grid">
                ${labels.map(label => `
                    <details class="dp-label-card" style="--label-color: ${label.color || '#666'}">
                        <summary class="dp-label-summary">
                            <span class="dp-label-color-dot" style="background:${label.color || '#666'}"></span>
                            <span class="dp-label-name">${label.displayName || label.name}</span>
                            <span class="dp-label-priority">P${label.priority ?? '?'}</span>
                            ${label.settings?.encryption ? '<span class="dp-badge dp-badge-encrypt">Encrypted</span>' : '<span class="dp-badge dp-badge-open">Open</span>'}
                            ${label.sublabels?.length ? '<span class="dp-badge dp-badge-sub">' + label.sublabels.length + ' sub-labels</span>' : ''}
                            <svg class="dp-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="dp-label-body">
                            <p class="dp-label-tooltip">${label.tooltip || ''}</p>
                            ${label.settings ? `
                            <div class="dp-label-settings">
                                <div class="dp-setting-row"><span class="dp-setting-key">Encryption</span><span class="dp-setting-val ${label.settings.encryption ? 'yes' : 'no'}">${label.settings.encryption ? 'Enabled' : 'Disabled'}</span></div>
                                ${label.settings.contentMarking && typeof label.settings.contentMarking === 'object' ? `
                                    <div class="dp-setting-row"><span class="dp-setting-key">Header</span><span class="dp-setting-val"><code>${label.settings.contentMarking.header || 'None'}</code></span></div>
                                    <div class="dp-setting-row"><span class="dp-setting-key">Footer</span><span class="dp-setting-val"><code>${label.settings.contentMarking.footer || 'None'}</code></span></div>
                                    ${label.settings.contentMarking.watermark ? `<div class="dp-setting-row"><span class="dp-setting-key">Watermark</span><span class="dp-setting-val"><code>${label.settings.contentMarking.watermark}</code></span></div>` : ''}
                                ` : ''}
                                ${label.settings.permissions ? `<div class="dp-setting-row"><span class="dp-setting-key">Permissions</span><span class="dp-setting-val">${label.settings.permissions}</span></div>` : ''}
                                ${label.settings.dlpPolicy ? `<div class="dp-setting-row"><span class="dp-setting-key">DLP Action</span><span class="dp-setting-val">${label.settings.dlpPolicy}</span></div>` : ''}
                                ${label.settings.protectionActions ? `<div class="dp-setting-row"><span class="dp-setting-key">Actions</span><span class="dp-setting-val">${label.settings.protectionActions}</span></div>` : ''}
                                ${label.settings.auditLogging ? `<div class="dp-setting-row"><span class="dp-setting-key">Audit Logging</span><span class="dp-setting-val yes">Enabled</span></div>` : ''}
                            </div>` : ''}
                            ${label.sublabels?.length ? `
                            <div class="dp-sublabels">
                                <h5>Sub-Labels</h5>
                                ${label.sublabels.map(sub => `
                                    <div class="dp-sublabel-item">
                                        <span class="dp-sublabel-name">${sub.displayName || sub.name}</span>
                                        ${sub.settings ? `<div class="dp-sublabel-settings">
                                            ${sub.settings.encryption ? '<span class="dp-badge dp-badge-encrypt">Encrypted</span>' : ''}
                                            ${sub.settings.permissions ? '<span class="dp-badge dp-badge-perm">' + sub.settings.permissions + '</span>' : ''}
                                        </div>` : ''}
                                    </div>
                                `).join('')}
                            </div>` : ''}
                        </div>
                    </details>
                `).join('')}
            </div>
            ${section.deploymentScript ? `
                <details class="dp-script-block">
                    <summary class="dp-script-summary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> PowerShell Deployment Script</summary>
                    ${this._dpCodeBlock(section.deploymentScript, 'PowerShell')}
                </details>` : ''}
        </div>`;
    },

    renderSensitiveInfoTypes: function(section) {
        const types = section.customTypes || [];
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Sensitive Information Types'}</h3>
                <p>${section.description || ''}</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Implement</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Go to Purview:</strong> compliance.microsoft.us &rarr; Data Classification &rarr; Sensitive Info Types</li>
                        <li><strong>Create custom SITs:</strong> Click "Create sensitive info type" for each pattern below</li>
                        <li><strong>Add regex patterns:</strong> Copy the regex from each card and paste into the pattern field</li>
                        <li><strong>Add keywords:</strong> Add the corroborating keywords to increase detection confidence</li>
                        <li><strong>Test with Content Explorer:</strong> Run Content Explorer to validate detection accuracy before enabling DLP</li>
                    </ol>
                </div>
            </div>
            <div class="dp-sit-grid">
                ${types.map(type => `
                    <details class="dp-sit-card">
                        <summary class="dp-sit-summary">
                            <span class="dp-sit-name">${type.name}</span>
                            ${type.confidence ? `<span class="dp-confidence-bar"><span class="dp-conf-fill" style="width:${type.confidence.high}%"></span><span class="dp-conf-label">${type.confidence.high}%</span></span>` : ''}
                            <svg class="dp-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="dp-sit-body">
                            <p>${type.description || ''}</p>
                            ${type.note ? `<div class="dp-sit-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${type.note}</div>` : ''}
                            ${type.patterns?.length ? `
                            <div class="dp-sit-patterns">
                                <strong>Detection Patterns:</strong>
                                ${type.patterns.map(p => `
                                    <div class="dp-pattern-row">
                                        <code class="dp-pattern-regex">${this.escapeHtml(p.regex || p.pattern || '')}</code>
                                        <button class="dp-copy-btn dp-copy-sm" data-action="copy-data" data-copy="${this.escapeHtml(p.regex || p.pattern || '')}" data-label="Copy">Copy</button>
                                        <div class="dp-pattern-desc">${p.description || ''}</div>
                                    </div>
                                `).join('')}
                            </div>` : ''}
                            ${type.keywords ? `
                            <div class="dp-sit-keywords">
                                <strong>Corroborating Keywords:</strong>
                                <div class="dp-keyword-pills">${type.keywords.map(k => '<span class="dp-keyword-pill">' + k + '</span>').join('')}</div>
                            </div>` : ''}
                            ${type.confidence ? `
                            <div class="dp-sit-confidence">
                                <strong>Confidence Thresholds:</strong>
                                <div class="dp-conf-bars">
                                    <div class="dp-conf-item"><span class="dp-conf-label-sm">Low</span><div class="dp-conf-track"><div class="dp-conf-fill low" style="width:${type.confidence.low}%"></div></div><span>${type.confidence.low}%</span></div>
                                    <div class="dp-conf-item"><span class="dp-conf-label-sm">Med</span><div class="dp-conf-track"><div class="dp-conf-fill med" style="width:${type.confidence.medium}%"></div></div><span>${type.confidence.medium}%</span></div>
                                    <div class="dp-conf-item"><span class="dp-conf-label-sm">High</span><div class="dp-conf-track"><div class="dp-conf-fill high" style="width:${type.confidence.high}%"></div></div><span>${type.confidence.high}%</span></div>
                                </div>
                            </div>` : ''}
                        </div>
                    </details>
                `).join('')}
            </div>
            ${section.deploymentScript ? `
                <details class="dp-script-block">
                    <summary class="dp-script-summary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> PowerShell: Create Custom SITs</summary>
                    ${this._dpCodeBlock(section.deploymentScript, 'PowerShell')}
                </details>` : ''}
        </div>`;
    },

    renderDLPPolicies: function(section) {
        const policies = section.recommendedPolicies || section.policies || [];
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'DLP Policies'}</h3>
                <p>Data Loss Prevention policies to enforce CUI handling rules across Exchange, SharePoint, OneDrive, Teams, and endpoints.</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Implement</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Start in test mode:</strong> Always deploy DLP policies in "Test with notifications" mode first</li>
                        <li><strong>Run for 2 weeks:</strong> Monitor false positives in the DLP alerts dashboard</li>
                        <li><strong>Tune conditions:</strong> Adjust sensitivity label matches and SIT confidence thresholds</li>
                        <li><strong>Enable blocking:</strong> Switch to "Turn it on right away" only after tuning is complete</li>
                        <li><strong>Set up alerts:</strong> Configure incident reports to go to your security team</li>
                    </ol>
                </div>
            </div>
            <div class="dp-dlp-grid">
                ${policies.map(policy => `
                    <div class="dp-dlp-card">
                        <div class="dp-dlp-header">
                            <h4>${policy.name}</h4>
                            ${policy.cmmcControl ? '<span class="dp-ctrl-badge">' + policy.cmmcControl + '</span>' : ''}
                        </div>
                        <p>${policy.description || ''}</p>
                        ${policy.scope ? `<div class="dp-dlp-meta"><strong>Scope:</strong> <span class="dp-scope-pills">${(Array.isArray(policy.scope) ? policy.scope : [policy.scope]).map(s => '<span class="dp-scope-pill">' + s + '</span>').join('')}</span></div>` : ''}
                        ${policy.conditions ? `<div class="dp-dlp-meta"><strong>Conditions:</strong><ul class="dp-dlp-list">${policy.conditions.map(c => '<li>' + c + '</li>').join('')}</ul></div>` : ''}
                        ${policy.actions ? `<div class="dp-dlp-meta"><strong>Actions:</strong><ul class="dp-dlp-list dp-dlp-actions">${policy.actions.map(a => '<li>' + a + '</li>').join('')}</ul></div>` : ''}
                    </div>
                `).join('')}
            </div>
            ${section.deploymentScript ? `
                <details class="dp-script-block">
                    <summary class="dp-script-summary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> PowerShell: Create DLP Policies</summary>
                    ${this._dpCodeBlock(section.deploymentScript, 'PowerShell')}
                </details>` : ''}
        </div>`;
    },

    renderAutoLabeling: function(section) {
        const classifiers = section.trainableClassifiers || [];
        const sim = section.simulationGuidance || {};
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Automatic Classification'}</h3>
                <p>Use trainable classifiers and auto-labeling policies to automatically identify and label CUI without user intervention.</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Implement</div>
                    <ol class="dp-howto-steps">
                        ${(sim.steps || []).map((s, i) => '<li>' + s + '</li>').join('')}
                    </ol>
                </div>
            </div>
            <h4 class="dp-sub-heading">Trainable Classifiers</h4>
            <div class="dp-classifier-grid">
                ${classifiers.map(c => `
                    <div class="dp-classifier-card">
                        <h4>${c.name}</h4>
                        <p>${c.description || ''}</p>
                        <div class="dp-classifier-meta">
                            <div class="dp-setting-row"><span class="dp-setting-key">Training Required</span><span class="dp-setting-val">${c.trainingRequirements || 'N/A'}</span></div>
                            <div class="dp-setting-row"><span class="dp-setting-key">Recommended Label</span><span class="dp-badge dp-badge-encrypt">${c.recommendedLabel || 'N/A'}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderAIPScanner: function(section) {
        const deploy = section.deployment || {};
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'AIP Scanner'}</h3>
                <p>${section.description || 'Discover and classify CUI in on-premises file shares and SharePoint Server.'}</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Deploy</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Provision scanner server:</strong> Windows Server 2016+ with SQL Server 2016+ (Express OK for &lt;10 repos)</li>
                        <li><strong>Register Entra ID app:</strong> Create app registration with AIPScanner permissions</li>
                        <li><strong>Install AIP client:</strong> Run <code>Install-Module AzureInformationProtection</code></li>
                        <li><strong>Configure cluster:</strong> Run <code>Install-AIPScanner</code> with your SQL instance</li>
                        <li><strong>Add repositories:</strong> Point scanner at file shares containing potential CUI</li>
                        <li><strong>Run discovery scan first:</strong> Use reporting-only mode to baseline before enforcing labels</li>
                    </ol>
                </div>
            </div>
            ${deploy.prerequisites ? `
            <div class="dp-prereq-box">
                <h4>Prerequisites</h4>
                <ul class="dp-prereq-list">${deploy.prerequisites.map(p => '<li><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ' + p + '</li>').join('')}</ul>
            </div>` : ''}
            ${deploy.contentScanJobSettings ? `
            <div class="dp-settings-grid">
                <h4>Scan Job Settings</h4>
                ${Object.entries(deploy.contentScanJobSettings).map(([k, v]) => `
                    <div class="dp-setting-row"><span class="dp-setting-key">${k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span><span class="dp-setting-val">${Array.isArray(v) ? v.join(', ') : v}</span></div>
                `).join('')}
            </div>` : ''}
            ${deploy.installationScript ? `
                <details class="dp-script-block">
                    <summary class="dp-script-summary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Installation Script</summary>
                    ${this._dpCodeBlock(deploy.installationScript, 'PowerShell')}
                </details>` : ''}
        </div>`;
    },

    renderEndpointDLP: function(section) {
        const activities = section.monitoredActivities || [];
        const deploy = section.deployment || {};
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Endpoint DLP'}</h3>
                <p>${section.description || ''}</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Enable</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Onboard devices:</strong> Ensure devices are onboarded to Microsoft Defender for Endpoint</li>
                        <li><strong>Enable Endpoint DLP:</strong> In Purview &rarr; Settings &rarr; Endpoint DLP settings &rarr; Turn on</li>
                        <li><strong>Configure unallowed apps:</strong> Add apps that should not access CUI-labeled files</li>
                        <li><strong>Set USB restrictions:</strong> Block or audit CUI copy to removable storage</li>
                        <li><strong>Deploy via Intune:</strong> Push endpoint protection configuration profiles to managed devices</li>
                    </ol>
                </div>
            </div>
            ${deploy.prerequisites ? `
            <div class="dp-prereq-box">
                <h4>Prerequisites</h4>
                <ul class="dp-prereq-list">${deploy.prerequisites.map(p => '<li><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ' + p + '</li>').join('')}</ul>
            </div>` : ''}
            ${section.capabilities ? `
            <div class="dp-capabilities">
                <h4>Capabilities</h4>
                <div class="dp-cap-grid">${section.capabilities.map(c => '<div class="dp-cap-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ' + c + '</div>').join('')}</div>
            </div>` : ''}
            ${activities.length ? `
            <h4 class="dp-sub-heading">Monitored Activities</h4>
            <table class="dp-activity-table">
                <thead><tr><th>Activity</th><th>Recommended Action</th></tr></thead>
                <tbody>${activities.map(a => '<tr><td>' + a.activity + '</td><td><span class="dp-action-badge ' + (a.action.toLowerCase().includes('block') ? 'block' : 'audit') + '">' + a.action + '</span></td></tr>').join('')}</tbody>
            </table>` : ''}
            ${deploy.intunePolicy ? `
                <details class="dp-script-block">
                    <summary class="dp-script-summary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Intune Configuration Profile (JSON)</summary>
                    ${this._dpCodeBlock(deploy.intunePolicy, 'JSON')}
                </details>` : ''}
        </div>`;
    },

    renderCloudApps: function(section) {
        const policies = section.sessionPolicies || [];
        const appGov = section.appGovernance || {};
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Defender for Cloud Apps'}</h3>
                <p>Session-level controls for CUI protection in cloud applications. Prevents data leakage through unmanaged devices and unsanctioned apps.</p>
                <div class="dp-howto-box">
                    <div class="dp-howto-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> How to Configure</div>
                    <ol class="dp-howto-steps">
                        <li><strong>Enable Conditional Access App Control:</strong> In Entra ID &rarr; Conditional Access, route sessions through Defender for Cloud Apps</li>
                        <li><strong>Create session policies:</strong> In the Cloud Apps portal, create policies for each scenario below</li>
                        <li><strong>Configure app discovery:</strong> Enable Cloud Discovery to identify shadow IT</li>
                        <li><strong>Sanction/unsanction apps:</strong> Mark approved apps as "Sanctioned" and block uploads to others</li>
                    </ol>
                </div>
            </div>
            ${section.portalUrl ? `<div class="dp-portal-link"><a href="${section.portalUrl}" target="_blank" rel="noopener"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open Cloud Apps Portal</a></div>` : ''}
            <h4 class="dp-sub-heading">Session Policies</h4>
            <div class="dp-session-grid">
                ${policies.map(p => `
                    <div class="dp-session-card">
                        <h4>${p.name}</h4>
                        <div class="dp-session-conditions"><strong>Conditions:</strong><ul>${p.conditions.map(c => '<li>' + c + '</li>').join('')}</ul></div>
                        <div class="dp-session-action"><strong>Action:</strong> <span class="dp-action-badge ${p.action.toLowerCase().includes('block') ? 'block' : 'audit'}">${p.action}</span></div>
                    </div>
                `).join('')}
            </div>
            ${appGov.policies ? `
            <h4 class="dp-sub-heading">App Governance</h4>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px">${appGov.description || ''}</p>
            <ul class="dp-gov-list">${appGov.policies.map(p => '<li>' + p + '</li>').join('')}</ul>` : ''}
        </div>`;
    },

    renderCUICategories: function(section) {
        const cats = section.commonCategories || [];
        const dissem = section.limitedDisseminationControls || [];
        const marking = section.markingFormat || {};
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'CUI Categories'}</h3>
                <p>Reference guide for CUI categories, marking formats, and dissemination controls per the <a href="${section.source || 'https://www.archives.gov/cui/registry/category-list'}" target="_blank" rel="noopener">CUI Registry</a>.</p>
            </div>
            <h4 class="dp-sub-heading">Common CUI Categories</h4>
            <div class="dp-cui-grid">
                ${cats.map(c => `
                    <div class="dp-cui-card">
                        <div class="dp-cui-header"><h4>${c.category}</h4><code class="dp-cui-marking">${c.marking}</code></div>
                        <p>${c.description}</p>
                        ${c.controls ? `<div class="dp-cui-meta"><strong>Governing Clause:</strong> ${c.controls}</div>` : ''}
                        ${c.subcategories ? `<div class="dp-cui-meta"><strong>Sub-categories:</strong> ${c.subcategories.join(', ')}</div>` : ''}
                        ${c.examples ? `<div class="dp-cui-meta"><strong>Examples:</strong> ${c.examples.join(', ')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ${dissem.length ? `
            <h4 class="dp-sub-heading">Dissemination Controls</h4>
            <table class="dp-activity-table">
                <thead><tr><th>Code</th><th>Description</th></tr></thead>
                <tbody>${dissem.map(d => '<tr><td><code class="dp-dissem-code">' + d.code + '</code></td><td>' + d.description + '</td></tr>').join('')}</tbody>
            </table>` : ''}
            ${marking.banner ? `
            <h4 class="dp-sub-heading">Marking Format</h4>
            <div class="dp-marking-format">
                <div class="dp-marking-template"><strong>Banner Format:</strong> <code>${marking.banner}</code></div>
                ${marking.portionMarking ? `<div class="dp-marking-template"><strong>Portion Marking:</strong> <code>${marking.portionMarking}</code></div>` : ''}
                ${marking.examples ? `<div class="dp-marking-examples"><strong>Examples:</strong>${marking.examples.map(e => '<div class="dp-marking-example"><code>' + e + '</code></div>').join('')}</div>` : ''}
            </div>` : ''}
        </div>`;
    },

    renderDPChecklist: function(section) {
        const phases = section.phases || [];
        const statusIcons = { required: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>', recommended: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/></svg>', conditional: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12.01" y2="16"/><line x1="12" y1="8" x2="12" y2="12"/></svg>' };
        return `
        <div class="dp-section">
            <div class="dp-section-intro">
                <h3>${section.title || 'Implementation Checklist'}</h3>
                <p>Phased implementation plan for deploying data protection controls. Follow phases sequentially.</p>
            </div>
            <div class="dp-checklist-legend">
                <span class="dp-legend-item"><span class="dp-status-dot required"></span> Required</span>
                <span class="dp-legend-item"><span class="dp-status-dot recommended"></span> Recommended</span>
                <span class="dp-legend-item"><span class="dp-status-dot conditional"></span> Conditional</span>
            </div>
            <div class="dp-checklist-phases">
                ${phases.map((phase, pi) => `
                    <div class="dp-phase-card">
                        <div class="dp-phase-header">
                            <span class="dp-phase-num">${pi + 1}</span>
                            <span class="dp-phase-name">${phase.phase}</span>
                            <span class="dp-phase-count">${phase.tasks.length} tasks</span>
                        </div>
                        <div class="dp-phase-tasks">
                            ${phase.tasks.map(t => `
                                <label class="dp-task-item">
                                    <input type="checkbox" class="dp-task-check">
                                    <span class="dp-task-text">${t.task}</span>
                                    <span class="dp-task-status ${t.status}">${t.status}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderGenericDataSection: function(section) {
        return `
        <div class="dp-section">
            <h3>${section.title || 'Configuration'}</h3>
            <p class="section-desc">${section.description || ''}</p>
            ${section.configuration ? this._dpCodeBlock(JSON.stringify(section.configuration, null, 2), 'JSON') : ''}
            ${section.steps ? `<div class="dp-howto-box"><div class="dp-howto-title">Setup Steps</div><ol class="dp-howto-steps">${section.steps.map(s => '<li>' + s + '</li>').join('')}</ol></div>` : ''}
            ${section.bestPractices ? `<div class="dp-howto-box"><div class="dp-howto-title">Best Practices</div><ul class="dp-howto-steps">${section.bestPractices.map(bp => '<li>' + bp + '</li>').join('')}</ul></div>` : ''}
        </div>`;
    },

    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ==================== MSSP PLAYBOOK VIEW ====================
    'mssp-playbook': function(portal) {
        const data = typeof MSSP_PLAYBOOK_DATA !== 'undefined' ? MSSP_PLAYBOOK_DATA : null;
        if (!data) return '<div class="msp-empty-state"><h3>MSSP Playbook data not loaded</h3></div>';
        return `
        <div class="mssp-playbook-view">
            <div class="msp-intro-banner security">
                <div class="banner-content">
                    <h2>MSSP Playbook</h2>
                    <p>Technical and tactical guidance for Managed Security Service Providers supporting CMMC compliance. Includes asset scoping, tool selection, SOC playbooks, and incident response procedures.</p>
                </div>
            </div>
            <div class="mssp-pb-tabs">
                <button class="mssp-pb-tab active" data-pb-tab="scoping">Asset Scoping</button>
                <button class="mssp-pb-tab" data-pb-tab="tools">Tool Matrix</button>
                <button class="mssp-pb-tab" data-pb-tab="playbooks">SOC Playbooks</button>
                <button class="mssp-pb-tab" data-pb-tab="operations">Operations Reference</button>
                <button class="mssp-pb-tab" data-pb-tab="onboarding">Client Onboarding</button>
                <button class="mssp-pb-tab" data-pb-tab="dfars">DFARS 7012</button>
            </div>
            <div class="mssp-pb-content" id="mssp-pb-content">
                ${this.renderPlaybookScoping(data)}
            </div>
        </div>`;
    },

    renderPlaybookScoping: function(data) {
        const m = data.scopingDecisionMatrix;
        return `
        <div class="mssp-pb-section">
            <h3>${m.title}</h3>
            <p class="section-desc">${m.description}</p>
            <div class="scoping-decision-tree">
                <h4>Decision Tree</h4>
                <div class="decision-flow">
                    ${m.decisionTree.map((step, i) => `
                        <div class="decision-node">
                            <div class="decision-question">${step.question}</div>
                            <div class="decision-branches">
                                <div class="decision-yes"><span class="branch-label">YES</span> <span class="branch-result">${step.yes}</span></div>
                                <div class="decision-no"><span class="branch-label">NO</span> <span class="branch-result">${step.no === 'next' ? 'Continue ↓' : step.no}</span></div>
                            </div>
                        </div>
                    `).join('<div class="decision-connector">↓</div>')}
                </div>
            </div>
            <div class="scoping-categories">
                ${m.categories.map(cat => `
                    <div class="scoping-card" style="border-left: 4px solid ${cat.color}">
                        <div class="scoping-card-header"><h4>${cat.type}</h4></div>
                        <p class="scoping-def">${cat.definition}</p>
                        <div class="scoping-details">
                            <div class="scoping-col"><strong>Examples</strong><ul>${cat.examples.map(e => '<li>' + e + '</li>').join('')}</ul></div>
                            <div class="scoping-col"><strong>Requirements</strong><ul>${cat.requirements.map(r => '<li>' + r + '</li>').join('')}</ul></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderPlaybookTools: function(data) {
        const tm = data.toolMatrix;
        return `
        <div class="mssp-pb-section">
            <h3>Security Tool Comparison Matrix</h3>
            <p class="section-desc">Comprehensive comparison of security tools across all categories. FedRAMP status indicates authorization level for CUI asset use.</p>
            ${tm.categories.map(cat => `
                <div class="tool-category-section">
                    <h4>${cat.name}</h4>
                    <div class="tool-comparison-table-wrap">
                        <table class="msp-comparison-table tool-matrix-table">
                            <thead><tr><th>Tool</th><th>FedRAMP</th><th>Best For</th><th>MSSP Fit</th><th>Cost</th><th>Notes</th></tr></thead>
                            <tbody>
                                ${cat.tools.map(t => `
                                    <tr>
                                        <td><strong>${t.name}</strong></td>
                                        <td><span class="fedramp-badge ${t.fedramp === 'High' ? 'high' : t.fedramp === 'Moderate' ? 'mod' : 'na'}">${t.fedramp}</span></td>
                                        <td>${t.bestFor}</td>
                                        <td><span class="fit-badge ${t.msspFit.toLowerCase()}">${t.msspFit}</span></td>
                                        <td class="cost-cell">${t.cost}</td>
                                        <td class="notes-cell">${t.notes}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `).join('')}
        </div>`;
    },

    renderPlaybookSOC: function(data) {
        return `
        <div class="mssp-pb-section">
            <h3>SOC Operational Playbooks</h3>
            <p class="section-desc">Pre-built detection and response playbooks with Splunk SPL and Sentinel KQL queries. Each playbook maps to specific CMMC controls.</p>
            <div class="soc-playbooks">
                ${data.socPlaybooks.map(pb => `
                    <details class="soc-playbook-card">
                        <summary class="pb-summary">
                            <span class="pb-severity ${pb.severity.toLowerCase()}">${pb.severity}</span>
                            <span class="pb-title">${pb.title}</span>
                            <span class="pb-controls">${pb.cmmcControls.map(c => '<span class="pb-ctrl">' + c + '</span>').join('')}</span>
                            <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="pb-body">
                            <div class="pb-trigger"><strong>Trigger:</strong> ${pb.triggerEvent}</div>
                            <div class="pb-sources"><strong>Detection Sources:</strong> ${pb.detectionSources.join(', ')}</div>
                            <div class="pb-queries">
                                <details class="pb-query-block"><summary><span class="query-icon">S</span> Splunk SPL Query</summary><pre><code>${this.escapeHtml(pb.splunkQuery)}</code></pre></details>
                                <details class="pb-query-block"><summary><span class="query-icon">K</span> Sentinel KQL Query</summary><pre><code>${this.escapeHtml(pb.sentinelKQL)}</code></pre></details>
                            </div>
                            <div class="pb-response"><strong>Response Steps:</strong><ol>${pb.responseSteps.map(s => '<li>' + s + '</li>').join('')}</ol></div>
                            <div class="pb-automation"><strong>Automation Opportunities:</strong><ul>${pb.automationOpportunities.map(a => '<li>' + a + '</li>').join('')}</ul></div>
                            <div class="pb-escalation"><strong>Escalation:</strong> ${pb.escalationCriteria}</div>
                        </div>
                    </details>
                `).join('')}
            </div>
        </div>`;
    },

    renderPlaybookOnboarding: function(data) {
        const ob = data.onboardingChecklist;
        return `
        <div class="mssp-pb-section">
            <h3>Client Onboarding Checklist</h3>
            <p class="section-desc">Structured onboarding process for new CMMC clients. Follow phases sequentially for optimal results.</p>
            <div class="onboarding-phases">
                ${ob.phases.map((phase, pi) => `
                    <div class="onboarding-phase">
                        <div class="phase-header">
                            <span class="phase-num">${pi + 1}</span>
                            <div class="phase-info"><h4>${phase.name}</h4><span class="phase-duration">${phase.duration}</span></div>
                        </div>
                        <div class="phase-tasks">
                            ${phase.tasks.map(t => `
                                <div class="phase-task ${t.critical ? 'critical' : ''}">
                                    <span class="task-indicator">${t.critical ? '!' : '○'}</span>
                                    <div class="task-content">
                                        <span class="task-name">${t.task}</span>
                                        <div class="task-tools">${t.tools.map(tool => '<span class="task-tool">' + tool + '</span>').join('')}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderPlaybookDFARS: function(data) {
        const ir = data.incidentReporting;
        return `
        <div class="mssp-pb-section">
            <h3>${ir.title}</h3>
            <p class="section-desc">Mandatory 72-hour reporting requirement for cyber incidents affecting CUI on contractor systems.</p>
            <div class="dfars-timeline">
                <h4>Incident Response Timeline</h4>
                ${ir.timeline.map(t => `
                    <div class="timeline-step">
                        <div class="timeline-time">${t.time}</div>
                        <div class="timeline-content"><strong>${t.action}</strong><p>${t.details}</p></div>
                    </div>
                `).join('')}
            </div>
            <div class="dfars-required-data">
                <h4>Required Data for DIBNet Report</h4>
                <ul>${ir.requiredData.map(d => '<li>' + d + '</li>').join('')}</ul>
            </div>
            <div class="dfars-important">
                <strong>Important:</strong> Forensic images must be preserved for a minimum of 90 days. Report via <a href="https://dibnet.dod.mil" target="_blank" rel="noopener">DIBNet</a>. Failure to report within 72 hours may result in contract penalties.
            </div>
        </div>`;
    },

    // ==================== MSSP OPERATIONS REFERENCE ====================
    renderPlaybookOperations: function() {
        const ops = typeof MSSP_OPERATIONS_REFERENCE !== 'undefined' ? MSSP_OPERATIONS_REFERENCE : null;
        if (!ops) return '<div class="msp-empty-state"><h3>Operations Reference data not loaded</h3></div>';
        return `
        <div class="mssp-pb-section mssp-ops-ref">
            <div class="ops-stats-strip">
                <div class="ops-stat"><span class="ops-stat-num">4</span><span class="ops-stat-label">SOC Tiers</span></div>
                <div class="ops-stat"><span class="ops-stat-num">5</span><span class="ops-stat-label">Pipeline Stages</span></div>
                <div class="ops-stat"><span class="ops-stat-num">4</span><span class="ops-stat-label">Cloud Platforms</span></div>
                <div class="ops-stat"><span class="ops-stat-num">5</span><span class="ops-stat-label">SOAR Playbooks</span></div>
                <div class="ops-stat"><span class="ops-stat-num">10</span><span class="ops-stat-label">Key Metrics</span></div>
            </div>
            <div class="ops-sub-tabs">
                <button class="ops-sub-tab active" data-ops-tab="soc">SOC Architecture</button>
                <button class="ops-sub-tab" data-ops-tab="logs">Log Management</button>
                <button class="ops-sub-tab" data-ops-tab="ticketing">Ticketing & Cases</button>
                <button class="ops-sub-tab" data-ops-tab="cloud">Cloud Access</button>
                <button class="ops-sub-tab" data-ops-tab="automation">Automation & SOAR</button>
                <button class="ops-sub-tab" data-ops-tab="metrics">Metrics & SLAs</button>
            </div>
            <div class="ops-sub-content" id="ops-sub-content">
                ${this._renderOpsSOC(ops)}
            </div>
        </div>`;
    },

    _renderOpsSection: function(tabKey) {
        const ops = typeof MSSP_OPERATIONS_REFERENCE !== 'undefined' ? MSSP_OPERATIONS_REFERENCE : null;
        if (!ops) return '';
        switch (tabKey) {
            case 'soc': return this._renderOpsSOC(ops);
            case 'logs': return this._renderOpsLogs(ops);
            case 'ticketing': return this._renderOpsTicketing(ops);
            case 'cloud': return this._renderOpsCloud(ops);
            case 'automation': return this._renderOpsAutomation(ops);
            case 'metrics': return this._renderOpsMetrics(ops);
            default: return '';
        }
    },

    _renderOpsSOC: function(ops) {
        const soc = ops.socArchitecture;
        return `
        <div class="ops-section">
            <h3>${soc.title}</h3>
            <p class="section-desc">${soc.description}</p>

            <div class="ops-tiers">
                ${soc.tiers.map(t => `
                    <details class="ops-tier-card" ${t.tier.includes('Tier 1') ? 'open' : ''}>
                        <summary class="ops-tier-header">
                            <span class="ops-tier-name">${t.tier}</span>
                            <span class="ops-tier-role">${t.role}</span>
                            <span class="ops-tier-coverage">${t.coverage}</span>
                            <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="ops-tier-body">
                            <div class="ops-tier-col">
                                <strong>Responsibilities</strong>
                                <ul>${t.responsibilities.map(r => '<li>' + r + '</li>').join('')}</ul>
                            </div>
                            <div class="ops-tier-meta">
                                <div class="ops-tier-tools"><strong>Tools:</strong> ${t.tools.join(', ')}</div>
                                <div class="ops-tier-metrics"><strong>Key Metrics:</strong> ${t.metrics.join(' · ')}</div>
                            </div>
                        </div>
                    </details>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">Shift Coverage Models</h4>
            <div class="ops-shift-models">
                ${soc.shiftModels.map(m => `
                    <div class="ops-shift-card">
                        <div class="ops-shift-name">${m.model}</div>
                        <p class="ops-shift-desc">${m.description}</p>
                        <div class="ops-shift-details">
                            <div class="ops-shift-col"><strong>Pros</strong><ul>${m.pros.map(p => '<li>' + p + '</li>').join('')}</ul></div>
                            <div class="ops-shift-col"><strong>Cons</strong><ul>${m.cons.map(c => '<li>' + c + '</li>').join('')}</ul></div>
                        </div>
                        <div class="ops-shift-best"><strong>Best For:</strong> ${m.bestFor}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    _renderOpsLogs: function(ops) {
        const log = ops.logManagement;
        return `
        <div class="ops-section">
            <h3>${log.title}</h3>
            <p class="section-desc">${log.description}</p>

            ${log.pipeline.map(stage => `
                <details class="ops-pipeline-stage" ${stage.stage.includes('1.') ? 'open' : ''}>
                    <summary class="ops-stage-header">
                        <span class="ops-stage-num">${stage.stage}</span>
                        <span class="ops-stage-desc">${stage.description}</span>
                        <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </summary>
                    <div class="ops-stage-body">
                        ${stage.methods ? stage.methods.map(m => `
                            <div class="ops-method-card">
                                <div class="ops-method-name">${m.method}</div>
                                <p>${m.description}</p>
                                <div class="ops-method-examples"><strong>Examples:</strong> ${m.examples.join(', ')}</div>
                                <div class="ops-method-proscons"><span class="ops-pro">✓ ${m.pros}</span> <span class="ops-con">✗ ${m.cons}</span></div>
                            </div>
                        `).join('') : ''}

                        ${stage.details ? `<ul>${stage.details.map(d => '<li>' + d + '</li>').join('')}</ul>` : ''}

                        ${stage.commonSchemas ? `
                            <div class="ops-schemas">
                                <strong>Common Data Schemas</strong>
                                <div class="ops-schema-grid">
                                    ${stage.commonSchemas.map(s => `<div class="ops-schema-chip"><strong>${s.name}</strong><span>${s.description}</span></div>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${stage.techniques ? `<ul>${stage.techniques.map(t => '<li>' + t + '</li>').join('')}</ul>` : ''}

                        ${stage.costOptimization ? `
                            <div class="ops-cost-tips">
                                <strong>Cost Optimization Tips</strong>
                                <ul>${stage.costOptimization.map(c => '<li>' + c + '</li>').join('')}</ul>
                            </div>
                        ` : ''}

                        ${stage.approaches ? stage.approaches.map(a => `
                            <div class="ops-method-card">
                                <div class="ops-method-name">${a.approach}</div>
                                <p>${a.description}</p>
                                <div class="ops-method-examples"><strong>Examples:</strong> ${a.examples.join(', ')}</div>
                            </div>
                        `).join('') : ''}

                        ${stage.retentionGuidelines ? `
                            <div class="ops-retention-table-wrap">
                                <table class="msp-comparison-table">
                                    <thead><tr><th>Framework</th><th>Retention</th><th>Notes</th></tr></thead>
                                    <tbody>${stage.retentionGuidelines.map(r => `<tr><td><strong>${r.requirement}</strong></td><td>${r.retention}</td><td>${r.notes}</td></tr>`).join('')}</tbody>
                                </table>
                            </div>
                        ` : ''}

                        ${stage.storageArchitecture ? `
                            <div class="ops-storage-tiers">
                                <strong>Storage Architecture</strong>
                                <div class="ops-storage-grid">
                                    ${stage.storageArchitecture.map(s => `
                                        <div class="ops-storage-card">
                                            <div class="ops-storage-tier-name">${s.tier}</div>
                                            <div class="ops-storage-duration">${s.duration}</div>
                                            <div class="ops-storage-tech">${s.technology}</div>
                                            <div class="ops-storage-search">${s.searchable}</div>
                                            <div class="ops-storage-cost">${s.cost}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </details>
            `).join('')}
        </div>`;
    },

    _renderOpsTicketing: function(ops) {
        const tk = ops.ticketingWorkflow;
        return `
        <div class="ops-section">
            <h3>${tk.title}</h3>
            <p class="section-desc">${tk.description}</p>

            <h4>Ticket Lifecycle</h4>
            <div class="ops-ticket-lifecycle">
                ${tk.ticketLifecycle.map((stage, i) => `
                    <div class="ops-ticket-stage">
                        <div class="ops-ticket-stage-num">${i + 1}</div>
                        <div class="ops-ticket-stage-content">
                            <div class="ops-ticket-stage-name">${stage.stage}</div>
                            <p>${stage.description}</p>
                            <div class="ops-ticket-sla"><strong>SLA:</strong> ${stage.sla}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">Priority Matrix</h4>
            <div class="ops-priority-matrix">
                ${tk.priorityMatrix.map(p => `
                    <div class="ops-priority-card ops-priority-${p.priority.substring(0,2).toLowerCase()}">
                        <div class="ops-priority-header">
                            <span class="ops-priority-badge">${p.priority}</span>
                            <span class="ops-priority-time">${p.responseTime}</span>
                        </div>
                        <p>${p.description}</p>
                        <div class="ops-priority-examples">${p.examples.map(e => '<span class="ops-example-chip">' + e + '</span>').join('')}</div>
                    </div>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">Client Communication Channels</h4>
            <div class="ops-comm-channels">
                ${tk.clientCommunication.map(ch => `
                    <details class="ops-comm-card">
                        <summary>
                            <strong>${ch.channel}</strong> — ${ch.description.substring(0, 80)}...
                            <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="ops-comm-body">
                            <p>${ch.description}</p>
                            <ul>${ch.features.map(f => '<li>' + f + '</li>').join('')}</ul>
                        </div>
                    </details>
                `).join('')}
            </div>
        </div>`;
    },

    _renderOpsCloud: function(ops) {
        const ca = ops.cloudAccess;
        return `
        <div class="ops-section">
            <h3>${ca.title}</h3>
            <p class="section-desc">${ca.description}</p>

            <div class="ops-cloud-platforms">
                ${ca.platforms.map(p => `
                    <details class="ops-cloud-card" ${p.cloud === 'AWS' ? 'open' : ''}>
                        <summary class="ops-cloud-header">
                            <span class="ops-cloud-name">${p.cloud}</span>
                            <span class="ops-cloud-model">${p.accessModel}</span>
                            <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="ops-cloud-body">
                            <div class="ops-cloud-steps">
                                <strong>Setup Steps</strong>
                                <ol>${p.setupSteps.map(s => '<li>' + s + '</li>').join('')}</ol>
                            </div>

                            ${p.iamPolicy ? `
                                <details class="ops-code-detail">
                                    <summary>View IAM Policy</summary>
                                    <div class="dp-code-wrap"><div class="dp-code-header"><span class="dp-code-lang">JSON</span><button class="dp-copy-btn" data-action="copy-code">Copy</button></div><pre class="dp-code-block"><code>${this.escapeHtml(p.iamPolicy)}</code></pre></div>
                                </details>
                            ` : ''}

                            ${p.trustPolicy ? `
                                <details class="ops-code-detail">
                                    <summary>View Trust Policy</summary>
                                    <div class="dp-code-wrap"><div class="dp-code-header"><span class="dp-code-lang">JSON</span><button class="dp-copy-btn" data-action="copy-code">Copy</button></div><pre class="dp-code-block"><code>${this.escapeHtml(p.trustPolicy)}</code></pre></div>
                                </details>
                            ` : ''}

                            ${p.lighthouseRoles ? `
                                <div class="ops-roles-table">
                                    <strong>Azure Lighthouse Roles</strong>
                                    <table class="msp-comparison-table">
                                        <thead><tr><th>Role</th><th>Scope</th><th>Purpose</th></tr></thead>
                                        <tbody>${p.lighthouseRoles.map(r => `<tr><td><strong>${r.role}</strong></td><td>${r.scope}</td><td>${r.purpose}</td></tr>`).join('')}</tbody>
                                    </table>
                                </div>
                            ` : ''}

                            ${p.roles ? `
                                <div class="ops-roles-list">
                                    <strong>Required Roles</strong>
                                    <ul>${p.roles.map(r => '<li><code>' + r + '</code></li>').join('')}</ul>
                                </div>
                            ` : ''}

                            ${p.recommendedRoles ? `
                                <div class="ops-roles-list">
                                    <strong>Recommended GDAP Roles</strong>
                                    <ul>${p.recommendedRoles.map(r => '<li>' + r + '</li>').join('')}</ul>
                                </div>
                            ` : ''}

                            <div class="ops-response-actions">
                                <strong>Pre-Approved Response Actions</strong>
                                <div class="ops-action-chips">${p.responseActions.map(a => '<span class="ops-action-chip">' + a + '</span>').join('')}</div>
                            </div>

                            ${p.automationTools ? `
                                <div class="ops-auto-tools"><strong>Automation Tools:</strong> ${p.automationTools.join(', ')}</div>
                            ` : ''}
                        </div>
                    </details>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">Multi-Tenant Management Patterns</h4>
            <p class="section-desc">${ca.multiTenantManagement.description}</p>
            <div class="ops-mt-approaches">
                ${ca.multiTenantManagement.approaches.map(a => `
                    <div class="ops-mt-card">
                        <div class="ops-mt-name">${a.approach}</div>
                        <p>${a.description}</p>
                        <div class="ops-mt-platforms"><strong>Platforms:</strong> ${a.platforms.join(', ')}</div>
                        <div class="ops-method-proscons"><span class="ops-pro">✓ ${a.pros}</span> <span class="ops-con">✗ ${a.cons}</span></div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    _renderOpsAutomation: function(ops) {
        const auto = ops.automationPatterns;
        return `
        <div class="ops-section">
            <h3>${auto.title}</h3>
            <p class="section-desc">${auto.description}</p>

            <div class="ops-playbooks">
                ${auto.commonPlaybooks.map(pb => `
                    <details class="ops-playbook-card">
                        <summary class="ops-playbook-header">
                            <span class="ops-playbook-name">${pb.name}</span>
                            <span class="ops-playbook-time"><span class="ops-time-manual">${pb.timeWithout}</span> → <span class="ops-time-auto">${pb.timeWith}</span></span>
                            <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </summary>
                        <div class="ops-playbook-body">
                            <div class="ops-playbook-trigger"><strong>Trigger:</strong> ${pb.trigger}</div>
                            <div class="ops-playbook-steps">
                                <strong>Automated Steps</strong>
                                <ol>${pb.automatedSteps.map(s => '<li>' + s + '</li>').join('')}</ol>
                            </div>
                            <div class="ops-playbook-meta">
                                <div class="ops-playbook-savings">
                                    <span class="ops-savings-label">Time Savings:</span>
                                    <span class="ops-time-manual">${pb.timeWithout}</span>
                                    <span class="ops-arrow">→</span>
                                    <span class="ops-time-auto">${pb.timeWith}</span>
                                </div>
                                <div class="ops-playbook-platforms"><strong>Platforms:</strong> ${pb.platforms}</div>
                            </div>
                        </div>
                    </details>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">${auto.aiInOperations.title}</h4>
            <div class="ops-ai-grid">
                ${auto.aiInOperations.applications.map(app => `
                    <div class="ops-ai-card">
                        <div class="ops-ai-area">${app.area}</div>
                        <p>${app.description}</p>
                        <div class="ops-ai-impact"><strong>Impact:</strong> ${app.impact}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    _renderOpsMetrics: function(ops) {
        const met = ops.metricsAndSLAs;
        const ir = ops.incidentResponse;
        return `
        <div class="ops-section">
            <h3>${met.title}</h3>
            <p class="section-desc">${met.description}</p>

            <div class="ops-metrics-table-wrap">
                <table class="msp-comparison-table">
                    <thead><tr><th>Metric</th><th>Full Name</th><th>Target</th><th>Description</th></tr></thead>
                    <tbody>${met.coreMetrics.map(m => `
                        <tr>
                            <td><strong class="ops-metric-code">${m.metric}</strong></td>
                            <td>${m.fullName}</td>
                            <td><span class="ops-target-badge">${m.target}</span></td>
                            <td>${m.description}</td>
                        </tr>
                    `).join('')}</tbody>
                </table>
            </div>

            <h4 style="margin-top:24px">Reporting Cadence</h4>
            <div class="ops-reporting-grid">
                ${met.reportingCadence.map(r => `
                    <div class="ops-report-card">
                        <div class="ops-report-name">${r.report}</div>
                        <div class="ops-report-audience"><strong>Audience:</strong> ${r.audience}</div>
                        <div class="ops-report-content">${r.content}</div>
                    </div>
                `).join('')}
            </div>

            <h4 style="margin-top:24px">Incident Response — Pre-Approved Actions</h4>
            <p class="section-desc">${ir.preApprovedActions.description}</p>
            <div class="ops-preapproved-table-wrap">
                <table class="msp-comparison-table">
                    <thead><tr><th>Action</th><th>Approval</th><th>Notes</th></tr></thead>
                    <tbody>${ir.preApprovedActions.typical.map(a => `
                        <tr>
                            <td>${a.action}</td>
                            <td><span class="ops-approval-badge ${a.approval === 'Pre-approved' ? 'approved' : 'requires'}">${a.approval}</span></td>
                            <td>${a.notes}</td>
                        </tr>
                    `).join('')}</tbody>
                </table>
            </div>

            <h4 style="margin-top:24px">War Room Protocol (P1/P2 Incidents)</h4>
            <p class="section-desc">${ir.warRoomProtocol.description}</p>
            <ol class="ops-warroom-steps">${ir.warRoomProtocol.steps.map(s => '<li>' + s + '</li>').join('')}</ol>
        </div>`;
    },

    // ==================== SCuBA BASELINES & CONFIG DRIFT ====================
    'scuba-baselines': function(portal) {
        const d = typeof SCUBA_CONFIG_DRIFT_DATA !== 'undefined' ? SCUBA_CONFIG_DRIFT_DATA : null;
        if (!d) return '<div class="msp-empty-state"><h3>SCuBA Data Not Loaded</h3><p>The SCuBA baselines data file has not loaded yet. Please refresh.</p></div>';

        return `
        <div class="scuba-view">
            <div class="scuba-intro">
                <p>Track configuration drift across M365, Azure, and Google Workspace using Microsoft's UTCM API and CISA's SCuBA assessment tools. These tools map directly to CMMC L2 / NIST 800-171 controls.</p>
            </div>
            <div class="msp-tabs scuba-tabs">
                <button class="msp-tab active" data-scuba-tab="utcm">Config Drift (UTCM)</button>
                <button class="msp-tab" data-scuba-tab="scubagear">ScubaGear (M365)</button>
                <button class="msp-tab" data-scuba-tab="scubagoggles">ScubaGoggles (GWS)</button>
                <button class="msp-tab" data-scuba-tab="mapping">CMMC Mapping</button>
                <button class="msp-tab" data-scuba-tab="automation">Automation</button>
            </div>
            <div class="scuba-tab-content" id="scuba-tab-content">
                ${this.renderScubaUTCM(d.utcm, portal)}
            </div>
        </div>`;
    },

    renderScubaUTCM: function(utcm, portal) {
        return `
        <div class="scuba-section">
            <div class="scuba-header-card">
                <div class="scuba-header-badge">PREVIEW API</div>
                <h3>${utcm.title}</h3>
                <p>${utcm.description}</p>
                <div class="scuba-links">
                    <a href="${utcm.docsUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} API Documentation</a>
                    <a href="${utcm.authSetupUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} Authentication Setup</a>
                </div>
            </div>

            <h4 class="scuba-sub-title">Core API Resources</h4>
            <div class="scuba-resource-grid">
                ${utcm.coreResources.map(r => `
                    <div class="scuba-resource-card">
                        <div class="scuba-resource-name">${r.name}</div>
                        <p>${r.description}</p>
                        <div class="scuba-methods">${r.methods.map(m => '<span class="scuba-method-badge">' + m + '</span>').join('')}</div>
                        <a href="${r.docsUrl}" target="_blank" rel="noopener" class="scuba-link-sm">${portal.getIcon('external-link')} Docs</a>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">API Limits</h4>
            <div class="scuba-limits-grid">
                ${Object.entries(utcm.limits).map(([k, v]) => `
                    <div class="scuba-limit-item">
                        <span class="scuba-limit-key">${k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span class="scuba-limit-val">${v.max ? v.max : '—'}</span>
                        <span class="scuba-limit-note">${v.note}</span>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Setup Steps</h4>
            <div class="scuba-steps">
                ${utcm.setupSteps.map((s, i) => `
                    <div class="scuba-step">
                        <div class="scuba-step-header">
                            <span class="scuba-step-num">${i + 1}</span>
                            <div><strong>${s.title}</strong><p>${s.description}</p></div>
                        </div>
                        <div class="scuba-code-block"><pre>${s.commands.join('\n')}</pre><button class="scuba-copy-btn" data-copy="${s.commands.join('\n').replace(/"/g, '&quot;')}" title="Copy">${portal.getIcon('copy')}</button></div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">CMMC Control Relevance</h4>
            <div class="scuba-cmmc-table">
                <table>
                    <thead><tr><th>Control</th><th>Name</th><th>How UTCM Helps</th></tr></thead>
                    <tbody>
                        ${utcm.cmmcRelevance.map(c => `<tr><td class="scuba-ctrl-id">${c.control}</td><td>${c.name}</td><td>${c.description}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    },

    renderScubaGear: function(sg, portal) {
        return `
        <div class="scuba-section">
            <div class="scuba-header-card">
                <div class="scuba-header-badge scuba-badge-cisa">CISA OFFICIAL</div>
                <h3>${sg.title}</h3>
                <p>${sg.description}</p>
                ${sg.bod2501 ? '<div class="scuba-bod-notice">' + portal.getIcon('alert-triangle') + ' <strong>BOD 25-01:</strong> ' + sg.bod2501Note + '</div>' : ''}
                <div class="scuba-links">
                    <a href="${sg.repoUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} GitHub Repository</a>
                    <a href="${sg.docsUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} Documentation</a>
                    <a href="${sg.mappingsUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} NIST 800-53 Mappings</a>
                </div>
            </div>

            <h4 class="scuba-sub-title">M365 Baselines (${sg.baselines.length} Products)</h4>
            <div class="scuba-baseline-grid">
                ${sg.baselines.map(b => `
                    <div class="scuba-baseline-card" data-baseline-id="${b.id}">
                        <div class="scuba-baseline-header">
                            <h5>${b.name}</h5>
                            <span class="scuba-policy-count">${b.policyCount} policies</span>
                        </div>
                        <p class="scuba-baseline-desc">${b.description}</p>
                        <div class="scuba-baseline-detail" style="display:none;">
                            <h6>Key Policies</h6>
                            <ul>${b.keyPolicies.map(p => '<li>' + p + '</li>').join('')}</ul>
                            <h6>CMMC Controls</h6>
                            <div class="scuba-ctrl-tags">${b.cmmcControls.map(c => '<span class="scuba-ctrl-tag">' + c + '</span>').join('')}</div>
                        </div>
                        <div class="scuba-baseline-footer">
                            <a href="${b.docsUrl}" target="_blank" rel="noopener" class="scuba-link-sm">${portal.getIcon('external-link')} Baseline Docs</a>
                            <button class="scuba-expand-btn" data-expand="${b.id}">${portal.getIcon('chevron-down')}</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Installation & Quick Start</h4>
            <div class="scuba-prereqs">
                <h6>Prerequisites</h6>
                <ul>${sg.installation.prerequisites.map(p => '<li>' + p + '</li>').join('')}</ul>
            </div>
            <div class="scuba-steps">
                ${sg.installation.steps.map((s, i) => `
                    <div class="scuba-step">
                        <div class="scuba-step-header">
                            <span class="scuba-step-num">${i + 1}</span>
                            <strong>${s.title}</strong>
                        </div>
                        <div class="scuba-code-block"><pre>${s.command}</pre><button class="scuba-copy-btn" data-copy="${s.command.replace(/"/g, '&quot;')}" title="Copy">${portal.getIcon('copy')}</button></div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Assessment Workflow</h4>
            <div class="scuba-workflow">
                ${sg.workflow.steps.map(s => `
                    <div class="scuba-workflow-step">
                        <div class="scuba-wf-num">${s.step}</div>
                        <div><strong>${s.name}</strong><p>${s.description}</p></div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Iterative Assessment Approach</h4>
            <div class="scuba-iterative">
                ${sg.iterativeApproach.map((a, i) => `
                    <div class="scuba-iter-step">
                        <span class="scuba-iter-num">${i + 1}</span>
                        <div><strong>${a.run}</strong><p>${a.description}</p></div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">YAML Configuration</h4>
            <div class="scuba-config-info">
                <p>${sg.installation.configFile.description}</p>
                <ul>${sg.installation.configFile.purposes.map(p => '<li>' + p + '</li>').join('')}</ul>
                <div class="scuba-links">
                    <a href="${sg.installation.configFile.sampleUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} Sample Config Files</a>
                    <a href="${sg.installation.configFile.configDocsUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} Configuration Guide</a>
                </div>
            </div>
        </div>`;
    },

    renderScubaGoggles: function(sg, portal) {
        return `
        <div class="scuba-section">
            <div class="scuba-header-card">
                <div class="scuba-header-badge scuba-badge-alpha">ALPHA</div>
                <h3>${sg.title}</h3>
                <p>${sg.description}</p>
                <div class="scuba-status-notice">${portal.getIcon('alert-triangle')} <strong>Status:</strong> ${sg.statusNote}</div>
                <div class="scuba-links">
                    <a href="${sg.repoUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} GitHub Repository</a>
                </div>
            </div>

            <h4 class="scuba-sub-title">Google Workspace Baselines (${sg.baselines.length} Products)</h4>
            <div class="scuba-baseline-grid">
                ${sg.baselines.map(b => `
                    <div class="scuba-baseline-card" data-baseline-id="gg-${b.id}">
                        <div class="scuba-baseline-header">
                            <h5>${b.name}</h5>
                        </div>
                        <p class="scuba-baseline-desc">${b.description}</p>
                        <div class="scuba-baseline-detail" style="display:none;">
                            <h6>Key Policies</h6>
                            <ul>${b.keyPolicies.map(p => '<li>' + p + '</li>').join('')}</ul>
                            <h6>CMMC Controls</h6>
                            <div class="scuba-ctrl-tags">${b.cmmcControls.map(c => '<span class="scuba-ctrl-tag">' + c + '</span>').join('')}</div>
                        </div>
                        <div class="scuba-baseline-footer">
                            <a href="${b.docsUrl}" target="_blank" rel="noopener" class="scuba-link-sm">${portal.getIcon('external-link')} Baseline Docs</a>
                            <button class="scuba-expand-btn" data-expand="gg-${b.id}">${portal.getIcon('chevron-down')}</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Installation & Quick Start</h4>
            <div class="scuba-prereqs">
                <h6>Prerequisites</h6>
                <ul>${sg.installation.prerequisites.map(p => '<li>' + p + '</li>').join('')}</ul>
            </div>
            <div class="scuba-steps">
                ${sg.installation.steps.map((s, i) => `
                    <div class="scuba-step">
                        <div class="scuba-step-header">
                            <span class="scuba-step-num">${i + 1}</span>
                            <strong>${s.title}</strong>
                        </div>
                        <div class="scuba-code-block"><pre>${s.command}</pre><button class="scuba-copy-btn" data-copy="${s.command.replace(/"/g, '&quot;')}" title="Copy">${portal.getIcon('copy')}</button></div>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Authentication Methods</h4>
            <div class="scuba-auth-methods">
                ${sg.installation.authMethods.map(a => `
                    <div class="scuba-auth-card">
                        <strong>${a.method}</strong>
                        <p>${a.description}</p>
                        <a href="${a.docsUrl}" target="_blank" rel="noopener" class="scuba-link-sm">${portal.getIcon('external-link')} Setup Guide</a>
                    </div>
                `).join('')}
            </div>

            <h4 class="scuba-sub-title">Assessment Workflow</h4>
            <div class="scuba-workflow">
                ${sg.workflow.steps.map(s => `
                    <div class="scuba-workflow-step">
                        <div class="scuba-wf-num">${s.step}</div>
                        <div><strong>${s.name}</strong><p>${s.description}</p></div>
                    </div>
                `).join('')}
            </div>

            ${sg.driftRules ? `
            <h4 class="scuba-sub-title">Drift Detection Rules</h4>
            <div class="scuba-drift-info">
                <p>${sg.driftRules.description}</p>
                <a href="${sg.driftRules.docsUrl}" target="_blank" rel="noopener" class="scuba-link">${portal.getIcon('external-link')} View Drift Rules</a>
            </div>` : ''}
        </div>`;
    },

    renderScubaMapping: function(mapping, portal) {
        return `
        <div class="scuba-section">
            <div class="scuba-header-card">
                <h3>CMMC L2 / NIST 800-171 Control Mapping</h3>
                <p>${mapping.description}</p>
            </div>
            ${mapping.families.map(fam => `
                <div class="scuba-mapping-family">
                    <h4 class="scuba-family-title">${fam.family}</h4>
                    <table class="scuba-mapping-table">
                        <thead><tr><th>Control</th><th>Name</th><th>Tools</th><th>Evidence</th></tr></thead>
                        <tbody>
                            ${fam.controls.map(c => `
                                <tr>
                                    <td class="scuba-ctrl-id">${c.id}</td>
                                    <td>${c.name}</td>
                                    <td><div class="scuba-tool-tags">${c.tools.map(t => '<span class="scuba-tool-tag">' + t + '</span>').join('')}</div></td>
                                    <td class="scuba-evidence">${c.evidence}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        </div>`;
    },

    renderScubaAutomation: function(auto, portal) {
        return `
        <div class="scuba-section">
            <div class="scuba-header-card">
                <h3>${auto.title}</h3>
                <p>Schedule recurring SCuBA assessments and leverage UTCM continuous monitoring for automated compliance tracking.</p>
            </div>
            <div class="scuba-auto-grid">
                ${auto.strategies.map(s => `
                    <div class="scuba-auto-card">
                        <div class="scuba-auto-header">
                            <h5>${s.name}</h5>
                            <span class="scuba-platform-badge">${s.platform}</span>
                        </div>
                        <p>${s.description}</p>
                        <div class="scuba-code-block"><pre>${s.commands.join('\n')}</pre><button class="scuba-copy-btn" data-copy="${s.commands.join('\n').replace(/"/g, '&quot;')}" title="Copy">${portal.getIcon('copy')}</button></div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    // ==================== TECHNICAL SCRIPTS VIEW ====================
    'tech-scripts': function(portal) {
        const sources = this._getTechScriptSources();
        if (sources.length === 0) return '<div class="msp-empty-state"><h3>Technical Scripts Not Loaded</h3><p>Script data files are loading. Please refresh.</p></div>';

        const tabs = [
            { key: 'identity', label: 'Identity & Access', icon: '🔑' },
            { key: 'audit', label: 'Audit & Logging', icon: '📋' },
            { key: 'endpoints', label: 'Endpoint Hardening', icon: '🖥️' },
            { key: 'network', label: 'Network Security', icon: '🌐' },
            { key: 'ir', label: 'Incident Response', icon: '🚨' },
            { key: 'evidence', label: 'Evidence Collection', icon: '📁' },
            { key: 'media', label: 'Media & Maintenance', icon: '💾' }
        ];

        const availableTabs = tabs.filter(t => this._getTechScriptSection(t.key));

        return `
        <div class="msp-data-view tech-scripts-view">
            <div class="msp-intro-banner security">
                <div class="banner-content">
                    <h2>Technical Scripts & Automation Library</h2>
                    <p>Full runnable scripts for every CMMC control domain. PowerShell, Bash, KQL, SPL, YARA-L — ready to deploy across Azure GCC High, AWS GovCloud, GCP, and on-prem.</p>
                    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                        <span class="scuba-platform-badge">PowerShell</span>
                        <span class="scuba-platform-badge">Bash</span>
                        <span class="scuba-platform-badge">KQL</span>
                        <span class="scuba-platform-badge">SPL</span>
                        <span class="scuba-platform-badge">YARA-L</span>
                    </div>
                </div>
            </div>
            <div class="tech-scripts-search" style="margin:12px 0;">
                <input type="search" class="msp-search-input" id="tech-scripts-search" placeholder="Search scripts by name, control, platform, language..." style="width:100%;max-width:500px;">
            </div>
            <div class="mssp-pb-tabs">
                ${availableTabs.map((t, i) => `<button class="mssp-pb-tab tech-script-tab ${i === 0 ? 'active' : ''}" data-ts-tab="${t.key}">${t.icon} ${t.label}</button>`).join('')}
            </div>
            <div class="mssp-pb-content" id="tech-scripts-content">
                ${availableTabs.length > 0 ? this.renderTechScriptSection(availableTabs[0].key) : '<p>No scripts available</p>'}
            </div>
        </div>`;
    },

    _getTechScriptSources: function() {
        const sources = [];
        if (typeof MSP_TECHNICAL_SCRIPTS !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS);
        if (typeof MSP_TECHNICAL_SCRIPTS_AUDIT !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_AUDIT);
        if (typeof MSP_TECHNICAL_SCRIPTS_ENDPOINTS !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_ENDPOINTS);
        if (typeof MSP_TECHNICAL_SCRIPTS_NETWORK !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_NETWORK);
        if (typeof MSP_TECHNICAL_SCRIPTS_IR !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_IR);
        if (typeof MSP_TECHNICAL_SCRIPTS_EVIDENCE !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_EVIDENCE);
        if (typeof MSP_TECHNICAL_SCRIPTS_MEDIA !== 'undefined') sources.push(MSP_TECHNICAL_SCRIPTS_MEDIA);
        return sources;
    },

    _getTechScriptSection: function(key) {
        const map = {
            identity: () => typeof MSP_TECHNICAL_SCRIPTS !== 'undefined' ? MSP_TECHNICAL_SCRIPTS.identity : null,
            audit: () => typeof MSP_TECHNICAL_SCRIPTS_AUDIT !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_AUDIT.audit : null,
            endpoints: () => typeof MSP_TECHNICAL_SCRIPTS_ENDPOINTS !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_ENDPOINTS.endpoints : null,
            network: () => typeof MSP_TECHNICAL_SCRIPTS_NETWORK !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_NETWORK.network : null,
            ir: () => typeof MSP_TECHNICAL_SCRIPTS_IR !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_IR.ir : null,
            evidence: () => typeof MSP_TECHNICAL_SCRIPTS_EVIDENCE !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_EVIDENCE.evidence : null,
            media: () => typeof MSP_TECHNICAL_SCRIPTS_MEDIA !== 'undefined' ? MSP_TECHNICAL_SCRIPTS_MEDIA.media : null
        };
        return map[key] ? map[key]() : null;
    },

    renderTechScriptSection: function(sectionKey, searchTerm) {
        const section = this._getTechScriptSection(sectionKey);
        if (!section) return '<div class="msp-empty-state"><p>Section not loaded</p></div>';

        const subsections = section.subsections || [];
        const filtered = searchTerm
            ? subsections.filter(s => {
                const term = searchTerm.toLowerCase();
                return (s.title || '').toLowerCase().includes(term) ||
                       (s.platform || '').toLowerCase().includes(term) ||
                       (s.language || '').toLowerCase().includes(term) ||
                       (s.cmmcControls || []).some(c => c.includes(term)) ||
                       (s.script || '').toLowerCase().includes(term);
            })
            : subsections;

        return `
        <div class="tech-scripts-section">
            <div class="section-header" style="margin-bottom:16px;">
                <h3>${section.title}</h3>
                <p class="section-desc">${section.description}</p>
                <span style="font-size:0.8rem;opacity:0.6;">${filtered.length} script${filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="tech-scripts-list">
                ${filtered.map((s, i) => this.renderTechScriptCard(s, i)).join('')}
            </div>
        </div>`;
    },

    renderTechScriptCard: function(script, index) {
        const langColors = {
            'PowerShell': '#012456', 'Bash': '#2d3436', 'KQL': '#0078d4',
            'SPL': '#65a637', 'YARA-L': '#ff6b35', 'JSON': '#f7df1e'
        };
        const bgColor = langColors[script.language] || '#333';
        const controls = (script.cmmcControls || []).slice(0, 6);
        const prereqs = script.prerequisites || [];
        const evidence = script.evidence || [];
        const scriptId = `ts-${script.id || index}`;

        return `
        <details class="tech-script-card" id="${scriptId}">
            <summary class="ts-summary">
                <div class="ts-summary-left">
                    <span class="ts-lang-badge" style="background:${bgColor}">${script.language || 'Script'}</span>
                    <span class="ts-title">${script.title}</span>
                </div>
                <div class="ts-summary-right">
                    <span class="ts-platform">${script.platform || ''}</span>
                    <div class="ts-controls">${controls.map(c => '<span class="pb-ctrl">' + c + '</span>').join('')}</div>
                    <svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </summary>
            <div class="ts-body">
                ${prereqs.length > 0 ? `<div class="ts-prereqs"><strong>Prerequisites:</strong> ${prereqs.join(' · ')}</div>` : ''}
                ${evidence.length > 0 ? `<div class="ts-evidence"><strong>Evidence Produced:</strong> ${evidence.join(' · ')}</div>` : ''}
                <div class="ts-code-wrap">
                    <div class="ts-code-header">
                        <span>${script.language || 'Script'} — ${script.platform || ''}</span>
                        <button class="ts-copy-btn" data-action="copy-code" data-script-id="${scriptId}">Copy Script</button>
                    </div>
                    <pre class="ts-code-block"><code>${this.escapeHtml(script.script || '# No script content')}</code></pre>
                </div>
            </div>
        </details>`;
    },

    _copyTechScript: function(btn) {
        const card = btn.closest('.tech-script-card');
        if (!card) return;
        const code = card.querySelector('.ts-code-block code');
        if (!code) return;
        navigator.clipboard.writeText(code.textContent).then(() => {
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = '#22c55e';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
        });
    }
};

if (typeof window !== 'undefined') window.MSPPortalViews = MSPPortalViews;
