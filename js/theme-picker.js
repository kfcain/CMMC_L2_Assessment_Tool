// Theme Picker Module
// Handles theme switching and persistence across the site

const ThemePicker = {
    // Available themes with their CSS variable values
    themes: {
        dark: {
            name: 'Dark',
            icon: 'moon',
            colors: {
                '--bg-primary': '#0f172a',
                '--bg-secondary': '#1e293b',
                '--bg-tertiary': '#334155',
                '--text-primary': '#f8fafc',
                '--text-secondary': '#94a3b8',
                '--text-muted': '#64748b',
                '--border-color': '#334155',
                '--accent-blue': '#3b82f6',
                '--accent-blue-hover': '#2563eb',
                '--input-bg': '#1e293b',
                '--card-bg': '#1e293b',
                '--modal-bg': '#1e293b',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        },
        light: {
            name: 'Light',
            icon: 'sun',
            colors: {
                '--bg-primary': '#f8fafc',
                '--bg-secondary': '#ffffff',
                '--bg-tertiary': '#e2e8f0',
                '--text-primary': '#0f172a',
                '--text-secondary': '#475569',
                '--text-muted': '#64748b',
                '--border-color': '#cbd5e1',
                '--accent-blue': '#2563eb',
                '--accent-blue-hover': '#1d4ed8',
                '--input-bg': '#ffffff',
                '--card-bg': '#ffffff',
                '--modal-bg': '#ffffff',
                '--shadow-color': 'rgba(0, 0, 0, 0.1)'
            }
        },
        midnight: {
            name: 'Midnight',
            icon: 'stars',
            colors: {
                '--bg-primary': '#030712',
                '--bg-secondary': '#111827',
                '--bg-tertiary': '#1f2937',
                '--text-primary': '#f9fafb',
                '--text-secondary': '#9ca3af',
                '--text-muted': '#6b7280',
                '--border-color': '#1f2937',
                '--accent-blue': '#6366f1',
                '--accent-blue-hover': '#4f46e5',
                '--input-bg': '#111827',
                '--card-bg': '#111827',
                '--modal-bg': '#111827',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)'
            }
        },
        ocean: {
            name: 'Ocean',
            icon: 'waves',
            colors: {
                '--bg-primary': '#0c1929',
                '--bg-secondary': '#132f4c',
                '--bg-tertiary': '#1e4976',
                '--text-primary': '#e3f2fd',
                '--text-secondary': '#90caf9',
                '--text-muted': '#5c98c5',
                '--border-color': '#1e4976',
                '--accent-blue': '#29b6f6',
                '--accent-blue-hover': '#0288d1',
                '--input-bg': '#132f4c',
                '--card-bg': '#132f4c',
                '--modal-bg': '#132f4c',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        },
        forest: {
            name: 'Forest',
            icon: 'leaf',
            colors: {
                '--bg-primary': '#0d1f17',
                '--bg-secondary': '#1a3329',
                '--bg-tertiary': '#264d3a',
                '--text-primary': '#ecfdf5',
                '--text-secondary': '#a7f3d0',
                '--text-muted': '#6ee7b7',
                '--border-color': '#264d3a',
                '--accent-blue': '#10b981',
                '--accent-blue-hover': '#059669',
                '--input-bg': '#1a3329',
                '--card-bg': '#1a3329',
                '--modal-bg': '#1a3329',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        },
        highContrast: {
            name: 'High Contrast',
            icon: 'contrast',
            colors: {
                '--bg-primary': '#000000',
                '--bg-secondary': '#1a1a1a',
                '--bg-tertiary': '#333333',
                '--text-primary': '#ffffff',
                '--text-secondary': '#e0e0e0',
                '--text-muted': '#b0b0b0',
                '--border-color': '#555555',
                '--accent-blue': '#00d4ff',
                '--accent-blue-hover': '#00a8cc',
                '--input-bg': '#1a1a1a',
                '--card-bg': '#1a1a1a',
                '--modal-bg': '#1a1a1a',
                '--shadow-color': 'rgba(255, 255, 255, 0.1)'
            }
        }
    },

    currentTheme: 'dark',
    storageKey: 'cmmc-theme-preference',

    // Initialize the theme picker
    init() {
        this.loadSavedTheme();
        this.renderPicker();
        this.bindEvents();
        this.applyTheme(this.currentTheme);
    },

    // Load saved theme from localStorage
    loadSavedTheme() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    },

    // Save theme preference to localStorage
    saveTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
    },

    // Apply theme by updating CSS variables
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        this.currentTheme = themeName;
        this.saveTheme(themeName);
        this.updatePickerUI();

        // Dispatch custom event for other components that might need to know
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeName, colors: theme.colors }
        }));
    },

    // Get SVG icon for theme
    getIcon(iconName) {
        const icons = {
            moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
            sun: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
            stars: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"></path></svg>',
            waves: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>',
            leaf: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>',
            contrast: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M12 2a10 10 0 0 1 0 20"></path></svg>',
            palette: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"></path></svg>',
            chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        };
        return icons[iconName] || icons.palette;
    },

    // Render the theme picker component
    renderPicker() {
        const container = document.getElementById('theme-picker-container');
        if (!container) return;

        const currentTheme = this.themes[this.currentTheme];

        container.innerHTML = `
            <div class="theme-picker">
                <button class="theme-picker-btn" id="theme-picker-btn" aria-label="Choose theme" title="Choose theme">
                    ${this.getIcon('palette')}
                    <span class="theme-picker-label">Theme</span>
                    ${this.getIcon('chevronDown')}
                </button>
                <div class="theme-picker-dropdown" id="theme-picker-dropdown">
                    <div class="theme-picker-header">Choose Theme</div>
                    <div class="theme-picker-options">
                        ${Object.entries(this.themes).map(([key, theme]) => `
                            <button class="theme-option ${key === this.currentTheme ? 'active' : ''}" data-theme="${key}">
                                <span class="theme-option-preview" style="background: ${theme.colors['--bg-primary']}; border-color: ${theme.colors['--border-color']};">
                                    <span class="theme-option-preview-accent" style="background: ${theme.colors['--accent-blue']};"></span>
                                </span>
                                <span class="theme-option-info">
                                    <span class="theme-option-name">${theme.name}</span>
                                </span>
                                ${key === this.currentTheme ? '<span class="theme-option-check">✓</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Update picker UI to reflect current theme
    updatePickerUI() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            const theme = option.dataset.theme;
            const isActive = theme === this.currentTheme;
            option.classList.toggle('active', isActive);

            // Update checkmark
            const existingCheck = option.querySelector('.theme-option-check');
            if (isActive && !existingCheck) {
                option.insertAdjacentHTML('beforeend', '<span class="theme-option-check">✓</span>');
            } else if (!isActive && existingCheck) {
                existingCheck.remove();
            }
        });
    },

    // Bind click events
    bindEvents() {
        // Toggle dropdown
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#theme-picker-btn');
            const dropdown = document.getElementById('theme-picker-dropdown');

            if (btn) {
                e.stopPropagation();
                dropdown?.classList.toggle('open');
                return;
            }

            // Theme selection
            const option = e.target.closest('.theme-option');
            if (option) {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                dropdown?.classList.remove('open');
                return;
            }

            // Close dropdown when clicking outside
            if (!e.target.closest('.theme-picker')) {
                dropdown?.classList.remove('open');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('theme-picker-dropdown')?.classList.remove('open');
            }
        });
    },

    // Get current theme colors (useful for dynamic styling)
    getCurrentColors() {
        return this.themes[this.currentTheme]?.colors || this.themes.dark.colors;
    },

    // Check if current theme is a light theme
    isLightTheme() {
        return this.currentTheme === 'light';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemePicker.init();
});

// Make available globally
window.ThemePicker = ThemePicker;
