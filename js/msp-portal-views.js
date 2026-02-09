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
                <div class="msp-search-bar"><input type="search" placeholder="Search clients..." class="msp-search-input" oninput="MSPPortal.filterClients(this.value)"></div>
                <div class="cp-header-stats">
                    <span class="cp-stat">${totalClients} client${totalClients !== 1 ? 's' : ''}</span>
                    <span class="cp-stat good">${readyCount} ready</span>
                    <span class="cp-stat">Avg SPRS: ${avgSprs}</span>
                </div>
                <button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${portal.getIcon('user-plus')} Add Client</button>
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
                <button class="msp-btn-secondary" onclick="MSPPortalViews._switchKanbanClient('${client.id}');MSPPortal.switchView('projects')">${portal.getIcon('calendar')} Board</button>
                <button class="msp-btn-secondary" onclick="MSPPortal.switchView('reports')">${portal.getIcon('file-text')} Report</button>
                <button class="msp-btn-icon" onclick="MSPPortal.editClient('${client.id}')" title="Edit client">${portal.getIcon('edit')}</button>
                <button class="msp-btn-icon msp-btn-icon-danger" onclick="MSPPortal.confirmRemoveClient('${client.id}')" title="Remove client">${portal.getIcon('x')}</button>
            </div>
        </div>`;
    },

    renderEmptyClients: function(portal) {
        return `<div class="msp-empty-state full-width"><div class="empty-icon">${portal.getIcon('users')}</div><h3>No Clients Yet</h3><p>Add your first client to start managing CMMC assessments</p><button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${portal.getIcon('user-plus')} Add First Client</button></div>`;
    },

    // ==================== PROJECTS VIEW (KANBAN) ====================
    projects: function(portal) {
        const clients = portal.state.clients;
        const selectedClient = portal._kanbanClient || (clients.length > 0 ? clients[0].id : null);
        const client = clients.find(c => c.id === selectedClient);
        const tasks = this._getKanbanTasks(selectedClient);
        const columns = [
            { id: 'backlog', name: 'Backlog', color: '#4e5263' },
            { id: 'todo', name: 'To Do', color: '#6c8aff' },
            { id: 'in-progress', name: 'In Progress', color: '#f59e0b' },
            { id: 'review', name: 'Review', color: '#8b5cf6' },
            { id: 'done', name: 'Done', color: '#34d399' }
        ];

        if (clients.length === 0) {
            return `<div class="msp-empty-state"><div class="empty-icon">${portal.getIcon('calendar')}</div><h3>No Projects</h3><p>Add clients to create project plans</p><button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${portal.getIcon('user-plus')} Add Client</button></div>`;
        }

        const stats = this._getKanbanStats(tasks);

        return `
        <div class="kb-planner">
            <div class="kb-header">
                <div class="kb-client-select">
                    <select class="stg-select" id="kb-client-picker" onchange="MSPPortalViews._switchKanbanClient(this.value)">
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
                    <button class="msp-btn-primary" onclick="MSPPortalViews._showAddTaskModal('${selectedClient}')">
                        ${portal.getIcon('plus')} Add Task
                    </button>
                </div>
            </div>
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
                        <div class="kb-col-body" data-column="${col.id}" ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="MSPPortalViews._dropTask(event,'${col.id}')">
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
        <div class="kb-card ${isOverdue ? 'overdue' : ''}" draggable="true" data-task-id="${task.id}" ondragstart="MSPPortalViews._dragTask(event,'${task.id}')">
            <div class="kb-card-top">
                <span class="kb-priority" style="background:${priorityColors[task.priority] || '#4e5263'}" title="${task.priority || 'normal'} priority"></span>
                <div class="kb-card-actions">
                    <button class="kb-card-btn" onclick="MSPPortalViews._editTask('${task.id}')" title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="kb-card-btn" onclick="MSPPortalViews._deleteTask('${task.id}')" title="Delete">
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
            <div class="msp-modal-header"><h3>Add Task</h3><button class="msp-modal-close" onclick="document.getElementById('kb-task-modal')?.remove()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
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
                <button class="msp-btn-secondary" onclick="document.getElementById('kb-task-modal')?.remove()">Cancel</button>
                <button class="msp-btn-primary" onclick="MSPPortalViews._submitAddTask('${clientId}')">Add Task</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
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
            <div class="msp-modal-header"><h3>Edit Task</h3><button class="msp-modal-close" onclick="document.getElementById('kb-task-modal')?.remove()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
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
                <button class="msp-btn-secondary" onclick="document.getElementById('kb-task-modal')?.remove()">Cancel</button>
                <button class="msp-btn-primary" onclick="MSPPortalViews._submitEditTask('${clientId}','${taskId}')">Save</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
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
                <div class="report-card" onclick="MSPPortal.generateReport('executive')"><div class="report-icon">${portal.getIcon('file-text')}</div><h4>Executive Summary</h4><p>High-level compliance status</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('gap')"><div class="report-icon">${portal.getIcon('activity')}</div><h4>Gap Analysis</h4><p>Detailed findings & remediation</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('c3pao')"><div class="report-icon">${portal.getIcon('check-circle')}</div><h4>C3PAO Readiness</h4><p>Pre-assessment checklist</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('ssp')"><div class="report-icon">${portal.getIcon('book')}</div><h4>SSP Appendix</h4><p>Implementation statements</p></div>
                <div class="report-card" onclick="MSPPortal.exportPortfolio()"><div class="report-icon">${portal.getIcon('users')}</div><h4>Portfolio Summary</h4><p>All clients overview</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('poam')"><div class="report-icon">${portal.getIcon('list')}</div><h4>POA&M Report</h4><p>Plan of Action & Milestones</p></div>
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
                <button class="env-tab active" data-provider="azure" onclick="MSPPortalViews.switchEnvTab('azure')">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span>Azure GCC High</span>
                </button>
                <button class="env-tab" data-provider="aws" onclick="MSPPortalViews.switchEnvTab('aws')">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>AWS GovCloud</span>
                </button>
                <button class="env-tab" data-provider="gcp" onclick="MSPPortalViews.switchEnvTab('gcp')">
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

    // ==================== SIEM VIEW ====================
    siem: function(portal) {
        return `
        <div class="msp-siem-view">
            <div class="msp-intro-banner security"><div class="banner-content"><h2>SIEM & MSSP Operations Center</h2><p>Centralized security operations for monitoring and protecting all client environments.</p></div></div>
            <div class="siem-dashboard-grid">
                <div class="msp-card"><div class="msp-card-header"><h3>MSSP Architecture</h3></div><div class="msp-card-body">${this.renderMSSPArchitecture()}</div></div>
                <div class="msp-card"><div class="msp-card-header"><h3>SIEM Platform Comparison</h3></div><div class="msp-card-body">${this.renderSIEMComparison()}</div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>CMMC Logging Requirements</h3></div><div class="msp-card-body">${this.renderLoggingReqs()}</div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>MSP Backend Operations</h3></div><div class="msp-card-body">${this.renderMSPBackendOps()}</div></div>
            </div>
        </div>`;
    },

    renderMSSPArchitecture: function() {
        return `
        <div class="mssp-arch-diagram">
            <div class="mssp-tier central"><h4>MSSP SOC</h4><ul><li>24/7 Monitoring</li><li>Threat Intelligence</li><li>Incident Response</li><li>Compliance Reporting</li></ul></div>
            <div class="mssp-connectors"><div class="connector-line"></div></div>
            <div class="mssp-tier siem"><h4>Central SIEM</h4><div class="siem-options"><span class="siem-badge sentinel">Sentinel</span><span class="siem-badge splunk">Splunk</span><span class="siem-badge chronicle">Chronicle</span></div></div>
            <div class="mssp-connectors multi"><div class="connector-line"></div></div>
            <div class="mssp-tier clients"><h4>Client Data Sources</h4><div class="client-sources"><span>Endpoint Logs</span><span>Network Flows</span><span>Cloud Audit</span><span>Identity Events</span></div></div>
        </div>`;
    },

    renderSIEMComparison: function() {
        return `
        <table class="msp-comparison-table">
            <thead><tr><th>Feature</th><th>Sentinel</th><th>Splunk</th><th>Chronicle</th></tr></thead>
            <tbody>
                <tr><td>FedRAMP</td><td class="good">High (GCC High)</td><td class="good">High (GovCloud)</td><td class="moderate">Moderate</td></tr>
                <tr><td>Multi-Tenant</td><td class="good">Native (Lighthouse)</td><td class="moderate">Via Apps</td><td class="good">Native</td></tr>
                <tr><td>CMMC Mapping</td><td class="good">Built-in</td><td class="moderate">Add-on</td><td class="moderate">Custom</td></tr>
                <tr><td>Cost Model</td><td>Per GB ingested</td><td>Per GB indexed</td><td>Per GB ingested</td></tr>
                <tr><td>Best For</td><td>M365/Azure</td><td>On-prem heavy</td><td>GCP environments</td></tr>
            </tbody>
        </table>`;
    },

    renderLoggingReqs: function() {
        const reqs = [
            { ctrl: '3.3.1', title: 'Create audit records', logs: ['Authentication events', 'Authorization decisions', 'System events'] },
            { ctrl: '3.3.2', title: 'Unique user attribution', logs: ['User session logs', 'Service account activity', 'Privileged operations'] },
            { ctrl: '3.3.4', title: 'Alert on failure', logs: ['Audit processing failures', 'Log storage alerts', 'Agent health'] },
            { ctrl: '3.3.5', title: 'Correlate audit review', logs: ['Cross-system correlation', 'Timeline analysis', 'Entity behavior'] }
        ];
        return `<div class="logging-requirements">${reqs.map(r => `<div class="logging-req-card"><div class="req-header"><span class="req-control">${r.ctrl}</span><span class="req-title">${r.title}</span></div><div class="req-logs">${r.logs.map(l => `<span class="log-tag">${l}</span>`).join('')}</div></div>`).join('')}</div>`;
    },

    renderMSPBackendOps: function() {
        return `
        <div class="backend-ops-grid">
            <div class="ops-category"><h4>🔒 Access Separation</h4><ul><li>Dedicated admin accounts per client</li><li>Just-in-time access via PIM</li><li>Separate credentials for CUI environments</li><li>Break-glass procedures documented</li></ul></div>
            <div class="ops-category"><h4>💾 Data Isolation</h4><ul><li>Separate Log Analytics workspaces</li><li>Client-specific encryption keys</li><li>Network segmentation per client</li><li>No shared storage for CUI</li></ul></div>
            <div class="ops-category"><h4>⏰ Retention & Compliance</h4><ul><li>Minimum 1-year log retention</li><li>Immutable audit trails</li><li>Regular compliance audits</li><li>Evidence preservation workflows</li></ul></div>
            <div class="ops-category"><h4>🚨 Incident Response</h4><ul><li>Client-specific IR playbooks</li><li>Escalation procedures</li><li>Breach notification templates</li><li>Forensic preservation process</li></ul></div>
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
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('sprs');">
                            ${portal.getIcon('bar-chart')}<span>SPRS Calculator</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('crosswalk');">
                            ${portal.getIcon('layers')}<span>Framework Crosswalk</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('impl-planner');">
                            ${portal.getIcon('calendar')}<span>Implementation Planner</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.switchView('reports');">
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

    // ==================== EVIDENCE LISTS VIEW ====================
    'evidence-lists': function(portal) {
        const data = typeof MSP_EVIDENCE_LISTS !== 'undefined' ? MSP_EVIDENCE_LISTS : null;
        if (!data) return '<div class="msp-empty-state"><p>Evidence lists data not loaded</p></div>';
        
        // Build families from actual data keys (must match keys in msp-evidence-lists.js)
        const familyMap = {
            accessControl: { id: 'AC', name: 'Access Control' },
            awarenessTraining: { id: 'AT', name: 'Awareness & Training' },
            auditAccountability: { id: 'AU', name: 'Audit & Accountability' },
            configurationManagement: { id: 'CM', name: 'Configuration Management' },
            identificationAuthentication: { id: 'IA', name: 'Identification & Authentication' },
            incidentResponse: { id: 'IR', name: 'Incident Response' },
            maintenance: { id: 'MA', name: 'Maintenance' },
            mediaProtection: { id: 'MP', name: 'Media Protection' },
            personnelSecurity: { id: 'PS', name: 'Personnel Security' },
            physicalProtection: { id: 'PE', name: 'Physical Protection' },
            riskAssessment: { id: 'RA', name: 'Risk Assessment' },
            securityAssessment: { id: 'CA', name: 'Security Assessment' },
            systemCommunicationsProtection: { id: 'SC', name: 'System & Communications' },
            systemInformationIntegrity: { id: 'SI', name: 'System & Information Integrity' }
        };
        
        const families = Object.entries(familyMap)
            .filter(([key]) => data[key])
            .map(([key, info]) => ({ key, ...info, data: data[key] }));
        
        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Evidence Collection Lists</h2><p>Comprehensive evidence requirements for all 14 CMMC control families</p></div></div>
            <div class="evidence-family-nav">
                ${families.map((f, i) => `<button class="family-nav-btn ${i === 0 ? 'active' : ''}" data-family="${f.key}">${f.id}</button>`).join('')}
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
        return `
        <div class="evidence-family">
            <div class="family-header">
                <h3>${family.id} - ${familyData.familyName || family.name}</h3>
                <p>${familyData.description || ''}</p>
            </div>
            <div class="evidence-controls">
                ${controls.map(c => this.renderEvidenceControl(c)).join('')}
            </div>
        </div>`;
    },

    renderEvidenceControl: function(control) {
        const evidenceItems = control.evidenceItems || control.evidence || [];
        const autoCollection = control.automatedCollection;
        return `
        <div class="evidence-control-card">
            <div class="control-header">
                <span class="control-id">${control.controlId || control.id}</span>
                <span class="control-name">${control.title || control.name || ''}</span>
            </div>
            <div class="evidence-items">
                <strong>Required Evidence:</strong>
                <ul class="evidence-list">
                    ${evidenceItems.map(e => `
                        <li class="evidence-item">
                            <span class="evidence-name">${typeof e === 'string' ? e : e.name || e.item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ${autoCollection ? `
                <div class="auto-collection">
                    <strong>Automated Collection:</strong>
                    <pre class="code-block"><code>${this.escapeHtml(typeof autoCollection === 'object' ? 
                        Object.entries(autoCollection).map(([k,v]) => `# ${k}\n${v}`).join('\n\n') : 
                        autoCollection)}</code></pre>
                </div>` : ''}
        </div>`;
    },

    // ==================== DATA PROTECTION VIEW ====================
    'data-protection': function(portal) {
        const data = typeof MSP_DATA_PROTECTION !== 'undefined' ? MSP_DATA_PROTECTION : null;
        if (!data) return '<div class="msp-empty-state"><p>Data protection data not loaded</p></div>';
        
        // Data is nested under 'purview'
        const purview = data.purview;
        if (!purview) return '<div class="msp-empty-state"><p>Purview data not found</p></div>';
        
        // Build available tabs based on what exists
        const availableTabs = [];
        if (purview.sensitivityLabels) availableTabs.push({ key: 'sensitivityLabels', label: 'Sensitivity Labels' });
        if (purview.sensitiveInfoTypes) availableTabs.push({ key: 'sensitiveInfoTypes', label: 'Sensitive Info Types' });
        if (purview.dlpPolicies) availableTabs.push({ key: 'dlpPolicies', label: 'DLP Policies' });
        if (purview.aipScanner) availableTabs.push({ key: 'aipScanner', label: 'AIP Scanner' });
        if (purview.endpointDLP) availableTabs.push({ key: 'endpointDLP', label: 'Endpoint DLP' });
        
        return `
        <div class="msp-data-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Data Protection Guide</h2><p>Microsoft Purview, sensitivity labels, and DLP configuration for CUI protection</p></div></div>
            <div class="msp-data-tabs">
                ${availableTabs.map((t, i) => `<button class="msp-data-tab ${i === 0 ? 'active' : ''}" data-section="${t.key}">${t.label}</button>`).join('')}
            </div>
            <div class="msp-data-content" id="data-protection-content">
                ${availableTabs.length > 0 ? this.renderDataProtectionSection(data, availableTabs[0].key) : '<p>No data protection content available</p>'}
            </div>
        </div>`;
    },

    renderDataProtectionSection: function(data, sectionKey) {
        const purview = data.purview;
        if (!purview) return '<p>Purview data not found</p>';
        
        const section = purview[sectionKey];
        if (!section) return '<p>Section not found: ' + sectionKey + '</p>';
        
        // Handle different section structures
        if (sectionKey === 'sensitivityLabels') {
            return this.renderSensitivityLabels(section);
        } else if (sectionKey === 'sensitiveInfoTypes') {
            return this.renderSensitiveInfoTypes(section);
        } else if (sectionKey === 'dlpPolicies') {
            return this.renderDLPPolicies(section);
        } else {
            return this.renderGenericDataSection(section);
        }
    },

    renderSensitivityLabels: function(section) {
        const labels = section.labelHierarchy || [];
        return `
        <div class="data-section">
            <h3>${section.title || 'Sensitivity Labels'}</h3>
            <p class="section-desc">${section.description || ''}</p>
            ${section.deploymentScript ? `
                <div class="code-section" style="margin-bottom:20px;">
                    <strong>PowerShell Deployment Script:</strong>
                    <pre class="code-block" style="max-height:300px;overflow:auto;"><code>${this.escapeHtml(section.deploymentScript.substring(0, 2000))}${section.deploymentScript.length > 2000 ? '\n... (truncated)' : ''}</code></pre>
                </div>` : ''}
            <div class="labels-hierarchy">
                ${labels.map(label => `
                    <div class="label-card" style="border-left: 4px solid ${label.color || '#666'}">
                        <div class="label-header">
                            <span class="label-name">${label.displayName || label.name}</span>
                            <span class="label-priority">Priority: ${label.priority ?? 'N/A'}</span>
                        </div>
                        <p class="label-desc">${label.tooltip || ''}</p>
                        ${label.settings ? `
                            <div class="label-protections">
                                <strong>Settings:</strong>
                                <ul>
                                    <li>Encryption: ${label.settings.encryption ? 'Yes' : 'No'}</li>
                                    ${label.settings.contentMarking && typeof label.settings.contentMarking === 'object' ? `<li>Header: ${label.settings.contentMarking.header || 'N/A'}</li>` : ''}
                                    ${label.settings.protectionActions ? `<li>Actions: ${label.settings.protectionActions}</li>` : ''}
                                </ul>
                            </div>` : ''}
                        ${label.sublabels && label.sublabels.length > 0 ? `
                            <div class="sublabels">
                                <strong>Sub-labels (${label.sublabels.length}):</strong>
                                ${label.sublabels.map(sub => `<span class="sublabel">${sub.displayName || sub.name}</span>`).join('')}
                            </div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderSensitiveInfoTypes: function(section) {
        const types = section.customTypes || [];
        return `
        <div class="data-section">
            <h3>${section.title || 'Sensitive Information Types'}</h3>
            <p class="section-desc">${section.description || ''}</p>
            <div class="info-types-grid">
                ${types.map(type => `
                    <div class="info-type-card">
                        <h4>${type.name}</h4>
                        <p>${type.description || ''}</p>
                        ${type.patterns && type.patterns.length > 0 ? `
                            <div class="type-pattern">
                                <strong>Patterns:</strong>
                                ${type.patterns.map(p => `<div style="margin:4px 0;"><code style="font-size:0.75rem;word-break:break-all;">${this.escapeHtml(p.regex || p.pattern || '')}</code><br><small>${p.description || ''}</small></div>`).join('')}
                            </div>` : ''}
                        ${type.keywords ? `<div class="type-keywords"><strong>Keywords:</strong> ${type.keywords.slice(0,8).join(', ')}${type.keywords.length > 8 ? '...' : ''}</div>` : ''}
                        ${type.confidence ? `<div class="type-confidence"><strong>Confidence:</strong> Low: ${type.confidence.low}%, Med: ${type.confidence.medium}%, High: ${type.confidence.high}%</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderDLPPolicies: function(section) {
        const policies = section.recommendedPolicies || section.policies || [];
        return `
        <div class="data-section">
            <h3>${section.title || 'DLP Policies'}</h3>
            <p class="section-desc">${section.description || ''}</p>
            <div class="policies-grid">
                ${policies.length > 0 ? policies.map(policy => `
                    <div class="policy-card">
                        <h4>${policy.name}</h4>
                        <p>${policy.description || ''}</p>
                        ${policy.locations ? `<div class="policy-meta"><strong>Locations:</strong> ${Array.isArray(policy.locations) ? policy.locations.join(', ') : policy.locations}</div>` : ''}
                    </div>
                `).join('') : '<p>No DLP policies defined yet</p>'}
            </div>
        </div>`;
    },

    renderGenericDataSection: function(section) {
        return `
        <div class="data-section">
            <h3>${section.title || 'Configuration'}</h3>
            <p class="section-desc">${section.description || ''}</p>
            ${section.configuration ? `<pre class="code-block"><code>${this.escapeHtml(JSON.stringify(section.configuration, null, 2))}</code></pre>` : ''}
            ${section.steps ? `
                <div class="steps-list">
                    <strong>Setup Steps:</strong>
                    <ol>${section.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                </div>` : ''}
            ${section.bestPractices ? `
                <div class="best-practices">
                    <strong>Best Practices:</strong>
                    <ul>${section.bestPractices.map(bp => `<li>${bp}</li>`).join('')}</ul>
                </div>` : ''}
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
                        <button class="ts-copy-btn" onclick="MSPPortalViews._copyTechScript(this)" data-script-id="${scriptId}">Copy Script</button>
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
