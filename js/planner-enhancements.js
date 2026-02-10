// Implementation Planner Enhancements Module
// Adds interactive task management, progress tracking, and time estimation
// Extends existing Implementation Planner functionality

const PlannerEnhancements = {
    config: {
        version: "1.0.0",
        storageKey: "nist-planner-enhanced",
        statusColors: {
            'not-started': '#6b7280',
            'in-progress': '#3b82f6',
            'completed': '#10b981',
            'blocked': '#ef4444',
            'deferred': '#f59e0b'
        }
    },

    taskData: {},

    init: function() {
        this.loadTaskData();
        this.bindEvents();
        console.log('[PlannerEnhancements] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            // Toggle task completion
            if (e.target.closest('.task-checkbox')) {
                const taskId = e.target.closest('.task-checkbox').dataset.taskId;
                this.toggleTaskCompletion(taskId);
            }

            // Update task status
            if (e.target.closest('.task-status-select')) {
                const select = e.target.closest('.task-status-select');
                const taskId = select.dataset.taskId;
                this.updateTaskStatus(taskId, select.value);
            }

            // Add task note
            if (e.target.closest('.add-task-note-btn')) {
                const taskId = e.target.closest('.add-task-note-btn').dataset.taskId;
                this.showTaskNoteModal(taskId);
            }

            // Save task note
            if (e.target.closest('#save-task-note-btn')) {
                this.saveTaskNote();
            }

            // Log time
            if (e.target.closest('.log-time-btn')) {
                const taskId = e.target.closest('.log-time-btn').dataset.taskId;
                this.showLogTimeModal(taskId);
            }

            // Save time log
            if (e.target.closest('#save-time-log-btn')) {
                this.saveTimeLog();
            }

            // View task details
            if (e.target.closest('.view-task-details-btn')) {
                const taskId = e.target.closest('.view-task-details-btn').dataset.taskId;
                this.showTaskDetailsModal(taskId);
            }

            // Show enhanced planner view
            if (e.target.closest('#view-enhanced-planner-btn')) {
                this.showEnhancedPlannerView();
            }

            // Export planner progress
            if (e.target.closest('#export-planner-progress-btn')) {
                this.exportPlannerProgress();
            }
        });

        // Enhance existing planner view when it loads
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceExistingPlanner();
        });
    },

    loadTaskData: function() {
        const saved = localStorage.getItem(this.config.storageKey);
        this.taskData = saved ? JSON.parse(saved) : {};
    },

    saveToStorage: function() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.taskData));
    },

    getTaskData: function(taskId) {
        if (!this.taskData[taskId]) {
            this.taskData[taskId] = {
                status: 'not-started',
                completed: false,
                progress: 0,
                timeEstimated: 0,
                timeActual: 0,
                timeLogs: [],
                notes: [],
                dependencies: [],
                assignee: null,
                startDate: null,
                completedDate: null,
                created: Date.now(),
                updated: Date.now()
            };
        }
        return this.taskData[taskId];
    },

    toggleTaskCompletion: function(taskId) {
        const data = this.getTaskData(taskId);
        data.completed = !data.completed;
        data.status = data.completed ? 'completed' : 'in-progress';
        data.progress = data.completed ? 100 : data.progress;
        
        if (data.completed && !data.completedDate) {
            data.completedDate = Date.now();
        } else if (!data.completed) {
            data.completedDate = null;
        }
        
        data.updated = Date.now();
        this.saveToStorage();
        
        // Update UI
        this.updateTaskUI(taskId);
        this.showToast(data.completed ? 'Task completed!' : 'Task reopened', 'success');
    },

    updateTaskStatus: function(taskId, status) {
        const data = this.getTaskData(taskId);
        data.status = status;
        
        if (status === 'completed') {
            data.completed = true;
            data.progress = 100;
            data.completedDate = Date.now();
        } else if (status === 'in-progress' && !data.startDate) {
            data.startDate = Date.now();
        }
        
        data.updated = Date.now();
        this.saveToStorage();
        
        this.updateTaskUI(taskId);
    },

    updateTaskUI: function(taskId) {
        const checkbox = document.querySelector(`.task-checkbox[data-task-id="${taskId}"]`);
        if (checkbox) {
            const data = this.getTaskData(taskId);
            checkbox.checked = data.completed;
            
            // Update parent elements
            const taskRow = checkbox.closest('.task-row, .planner-task');
            if (taskRow) {
                taskRow.classList.toggle('completed', data.completed);
            }
        }
    },

    showTaskNoteModal: function(taskId) {
        const data = this.getTaskData(taskId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Task Notes - ${taskId}</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    ${data.notes.length > 0 ? `
                        <div class="existing-notes">
                            <h3>Previous Notes</h3>
                            ${data.notes.map(note => `
                                <div class="task-note-item">
                                    <div class="note-meta">
                                        <strong>${note.author || 'Unknown'}</strong> - 
                                        ${new Date(note.timestamp).toLocaleString()}
                                    </div>
                                    <div class="note-content">${note.content}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="hamburger-divider" style="margin: 20px 0;"></div>
                    ` : ''}
                    
                    <h3>Add Note</h3>
                    <form id="task-note-form">
                        <input type="hidden" id="note-task-id" value="${taskId}">
                        
                        <div class="form-group">
                            <label>Note *</label>
                            <textarea id="task-note-content" class="form-control" rows="4" required placeholder="Add implementation notes, blockers, or updates..."></textarea>
                        </div>

                        <div class="form-group">
                            <label>Author</label>
                            <input type="text" id="task-note-author" class="form-control" value="${localStorage.getItem('nist-user-name') || ''}" placeholder="Your name">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-backdrop">Cancel</button>
                    <button class="btn-primary" id="save-task-note-btn">Save Note</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveTaskNote: function() {
        const form = document.getElementById('task-note-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const taskId = document.getElementById('note-task-id').value;
        const data = this.getTaskData(taskId);

        const note = {
            content: document.getElementById('task-note-content').value,
            author: document.getElementById('task-note-author').value || 'Unknown',
            timestamp: Date.now()
        };

        data.notes.push(note);
        data.updated = Date.now();
        this.saveToStorage();

        document.querySelector('.modal-backdrop').remove();
        this.showToast('Note added', 'success');
    },

    showLogTimeModal: function(taskId) {
        const data = this.getTaskData(taskId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>Log Time - ${taskId}</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <div class="time-summary">
                        <div class="time-stat">
                            <div class="time-label">Estimated</div>
                            <div class="time-value">${data.timeEstimated || 0}h</div>
                        </div>
                        <div class="time-stat">
                            <div class="time-label">Actual</div>
                            <div class="time-value">${data.timeActual || 0}h</div>
                        </div>
                        <div class="time-stat">
                            <div class="time-label">Variance</div>
                            <div class="time-value ${data.timeActual > data.timeEstimated ? 'over' : 'under'}">
                                ${data.timeEstimated ? ((data.timeActual - data.timeEstimated) / data.timeEstimated * 100).toFixed(0) : 0}%
                            </div>
                        </div>
                    </div>

                    ${data.timeLogs.length > 0 ? `
                        <div class="time-logs">
                            <h3>Time Entries</h3>
                            <table class="time-log-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Hours</th>
                                        <th>Person</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.timeLogs.map(log => `
                                        <tr>
                                            <td>${new Date(log.date).toLocaleDateString()}</td>
                                            <td>${log.hours}h</td>
                                            <td>${log.person}</td>
                                            <td>${log.description || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="hamburger-divider" style="margin: 20px 0;"></div>
                    ` : ''}

                    <h3>Log Time Entry</h3>
                    <form id="time-log-form">
                        <input type="hidden" id="time-log-task-id" value="${taskId}">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date *</label>
                                <input type="date" id="time-log-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Hours *</label>
                                <input type="number" id="time-log-hours" class="form-control" required min="0.25" step="0.25" placeholder="0.0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Person *</label>
                            <input type="text" id="time-log-person" class="form-control" required value="${localStorage.getItem('nist-user-name') || ''}" placeholder="Name">
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" id="time-log-description" class="form-control" placeholder="What was accomplished?">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-backdrop">Cancel</button>
                    <button class="btn-primary" id="save-time-log-btn">Log Time</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    saveTimeLog: function() {
        const form = document.getElementById('time-log-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const taskId = document.getElementById('time-log-task-id').value;
        const data = this.getTaskData(taskId);

        const timeLog = {
            date: document.getElementById('time-log-date').value,
            hours: parseFloat(document.getElementById('time-log-hours').value),
            person: document.getElementById('time-log-person').value,
            description: document.getElementById('time-log-description').value,
            timestamp: Date.now()
        };

        data.timeLogs.push(timeLog);
        data.timeActual = data.timeLogs.reduce((sum, log) => sum + log.hours, 0);
        data.updated = Date.now();
        this.saveToStorage();

        document.querySelector('.modal-backdrop').remove();
        this.showToast(`Logged ${timeLog.hours}h`, 'success');
    },

    showTaskDetailsModal: function(taskId) {
        const data = this.getTaskData(taskId);
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Task Details - ${taskId}</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <div class="task-details-grid">
                        <div class="detail-section">
                            <h3>Status</h3>
                            <div class="status-badge ${data.status}">${data.status.replace('-', ' ').toUpperCase()}</div>
                            <div class="progress-indicator">
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${data.progress}%"></div>
                                    <span class="progress-text">${data.progress}%</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3>Timeline</h3>
                            <div class="timeline-info">
                                <div><strong>Started:</strong> ${data.startDate ? new Date(data.startDate).toLocaleDateString() : 'Not started'}</div>
                                <div><strong>Completed:</strong> ${data.completedDate ? new Date(data.completedDate).toLocaleDateString() : 'In progress'}</div>
                                <div><strong>Duration:</strong> ${this.calculateDuration(data)}</div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3>Time Tracking</h3>
                            <div class="time-tracking-info">
                                <div><strong>Estimated:</strong> ${data.timeEstimated || 0}h</div>
                                <div><strong>Actual:</strong> ${data.timeActual || 0}h</div>
                                <div><strong>Remaining:</strong> ${Math.max(0, (data.timeEstimated || 0) - data.timeActual)}h</div>
                            </div>
                        </div>

                        ${data.notes.length > 0 ? `
                            <div class="detail-section full-width">
                                <h3>Notes (${data.notes.length})</h3>
                                <div class="notes-list">
                                    ${data.notes.slice(-3).reverse().map(note => `
                                        <div class="note-preview">
                                            <div class="note-meta">${note.author} - ${new Date(note.timestamp).toLocaleDateString()}</div>
                                            <div class="note-content">${note.content}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" data-action="close-backdrop">Close</button>
                    <button class="btn-secondary add-task-note-btn" data-task-id="${taskId}">Add Note</button>
                    <button class="btn-secondary log-time-btn" data-task-id="${taskId}">Log Time</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    showEnhancedPlannerView: function() {
        // Get implementation planner data
        const plannerData = typeof IMPLEMENTATION_PLANNER !== 'undefined' ? IMPLEMENTATION_PLANNER : null;
        if (!plannerData) {
            this.showToast('Implementation Planner data not loaded', 'error');
            return;
        }

        // Calculate overall progress
        const allTasks = [];
        plannerData.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    const taskData = this.getTaskData(task.id);
                    allTasks.push({
                        ...task,
                        ...taskData,
                        phase: phase.name,
                        milestone: milestone.name
                    });
                });
            });
        });

        const completedTasks = allTasks.filter(t => t.completed).length;
        const overallProgress = Math.round((completedTasks / allTasks.length) * 100);

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop active';
        modal.innerHTML = `
            <div class="modal-content planner-dashboard-modal">
                <div class="modal-header">
                    <h2>Enhanced Implementation Planner</h2>
                    <button class="modal-close" data-action="close-backdrop">×</button>
                </div>
                <div class="modal-body">
                    <!-- Progress Summary -->
                    <div class="planner-progress-summary">
                        <div class="overall-progress">
                            <h3>Overall Progress</h3>
                            <div class="progress-ring-large">
                                <svg width="120" height="120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-tertiary)" stroke-width="12"/>
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" stroke-width="12"
                                            stroke-dasharray="${2 * Math.PI * 54}" 
                                            stroke-dashoffset="${2 * Math.PI * 54 * (1 - overallProgress / 100)}"
                                            transform="rotate(-90 60 60)"/>
                                </svg>
                                <div class="progress-ring-text">${overallProgress}%</div>
                            </div>
                        </div>
                        <div class="progress-stats">
                            <div class="stat-item">
                                <div class="stat-value">${completedTasks}</div>
                                <div class="stat-label">Completed</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${allTasks.filter(t => t.status === 'in-progress').length}</div>
                                <div class="stat-label">In Progress</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${allTasks.filter(t => t.status === 'blocked').length}</div>
                                <div class="stat-label">Blocked</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${allTasks.reduce((sum, t) => sum + t.timeActual, 0).toFixed(1)}h</div>
                                <div class="stat-label">Time Logged</div>
                            </div>
                        </div>
                    </div>

                    <!-- Controls -->
                    <div class="planner-controls">
                        <button class="btn-primary" id="export-planner-progress-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export Progress
                        </button>
                    </div>

                    <!-- Tasks by Phase -->
                    <div class="planner-phases">
                        ${this.renderPhaseProgress(plannerData, allTasks)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    renderPhaseProgress: function(plannerData, allTasks) {
        return plannerData.phases.map(phase => {
            const phaseTasks = allTasks.filter(t => t.phase === phase.name);
            const phaseCompleted = phaseTasks.filter(t => t.completed).length;
            const phaseProgress = Math.round((phaseCompleted / phaseTasks.length) * 100);

            return `
                <div class="phase-progress-card">
                    <div class="phase-header">
                        <h3>${phase.name}</h3>
                        <div class="phase-progress-bar">
                            <div class="progress-bar-fill" style="width: ${phaseProgress}%"></div>
                            <span class="progress-text">${phaseProgress}%</span>
                        </div>
                    </div>
                    <div class="phase-stats">
                        <span>${phaseCompleted}/${phaseTasks.length} tasks completed</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    calculateDuration: function(data) {
        if (!data.startDate) return 'Not started';
        const end = data.completedDate || Date.now();
        const days = Math.floor((end - data.startDate) / (1000 * 60 * 60 * 24));
        return `${days} day${days !== 1 ? 's' : ''}`;
    },

    enhanceExistingPlanner: function() {
        // This would add checkboxes and controls to the existing planner view
        // Implementation depends on existing planner structure
        console.log('[PlannerEnhancements] Enhanced existing planner view');
    },

    exportPlannerProgress: function() {
        const plannerData = typeof IMPLEMENTATION_PLANNER !== 'undefined' ? IMPLEMENTATION_PLANNER : null;
        if (!plannerData) return;

        const allTasks = [];
        plannerData.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                milestone.tasks.forEach(task => {
                    const taskData = this.getTaskData(task.id);
                    allTasks.push({
                        phase: phase.name,
                        milestone: milestone.name,
                        taskId: task.id,
                        taskName: task.name,
                        status: taskData.status,
                        completed: taskData.completed,
                        progress: taskData.progress,
                        timeEstimated: taskData.timeEstimated,
                        timeActual: taskData.timeActual,
                        notes: taskData.notes.length
                    });
                });
            });
        });

        const report = {
            exportDate: new Date().toISOString(),
            summary: {
                totalTasks: allTasks.length,
                completed: allTasks.filter(t => t.completed).length,
                inProgress: allTasks.filter(t => t.status === 'in-progress').length,
                blocked: allTasks.filter(t => t.status === 'blocked').length,
                totalTimeLogged: allTasks.reduce((sum, t) => sum + t.timeActual, 0)
            },
            tasks: allTasks
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `planner-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Progress report exported', 'success');
    },

    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PlannerEnhancements.init());
} else {
    PlannerEnhancements.init();
}
