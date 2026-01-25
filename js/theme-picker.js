// Theme Picker Module
// Handles theme switching and persistence across the site

const ThemePicker = {
    // Available themes based on popular VS Code themes
    themes: {
        // One Dark Pro - Most popular VS Code theme (Atom One Dark inspired)
        oneDarkPro: {
            name: 'One Dark Pro',
            icon: 'moon',
            colors: {
                '--bg-primary': '#282c34',
                '--bg-secondary': '#21252b',
                '--bg-tertiary': '#2c313a',
                '--text-primary': '#abb2bf',
                '--text-secondary': '#828997',
                '--text-muted': '#5c6370',
                '--border-color': '#3e4451',
                '--accent-blue': '#61afef',
                '--accent-blue-hover': '#528bcc',
                '--input-bg': '#1d1f23',
                '--card-bg': '#21252b',
                '--modal-bg': '#21252b',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)'
            }
        },
        // Dracula - Popular purple/pink vampire theme
        dracula: {
            name: 'Dracula',
            icon: 'moon',
            colors: {
                '--bg-primary': '#282a36',
                '--bg-secondary': '#21222c',
                '--bg-tertiary': '#343746',
                '--text-primary': '#f8f8f2',
                '--text-secondary': '#bd93f9',
                '--text-muted': '#6272a4',
                '--border-color': '#44475a',
                '--accent-blue': '#bd93f9',
                '--accent-blue-hover': '#ff79c6',
                '--input-bg': '#21222c',
                '--card-bg': '#21222c',
                '--modal-bg': '#21222c',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)'
            }
        },
        // GitHub Dark - Official GitHub dark theme
        githubDark: {
            name: 'GitHub Dark',
            icon: 'moon',
            colors: {
                '--bg-primary': '#0d1117',
                '--bg-secondary': '#161b22',
                '--bg-tertiary': '#21262d',
                '--text-primary': '#e6edf3',
                '--text-secondary': '#8b949e',
                '--text-muted': '#6e7681',
                '--border-color': '#30363d',
                '--accent-blue': '#58a6ff',
                '--accent-blue-hover': '#1f6feb',
                '--input-bg': '#0d1117',
                '--card-bg': '#161b22',
                '--modal-bg': '#161b22',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)'
            }
        },
        // GitHub Light - Official GitHub light theme
        githubLight: {
            name: 'GitHub Light',
            icon: 'sun',
            colors: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f6f8fa',
                '--bg-tertiary': '#eaeef2',
                '--text-primary': '#1f2328',
                '--text-secondary': '#656d76',
                '--text-muted': '#8b949e',
                '--border-color': '#d1d9e0',
                '--accent-blue': '#0969da',
                '--accent-blue-hover': '#0550ae',
                '--input-bg': '#ffffff',
                '--card-bg': '#ffffff',
                '--modal-bg': '#ffffff',
                '--shadow-color': 'rgba(31, 35, 40, 0.12)'
            }
        },
        // Night Owl - Sarah Drasner's popular theme for night coders
        nightOwl: {
            name: 'Night Owl',
            icon: 'moon',
            colors: {
                '--bg-primary': '#011627',
                '--bg-secondary': '#0b2942',
                '--bg-tertiary': '#1d3b53',
                '--text-primary': '#d6deeb',
                '--text-secondary': '#7fdbca',
                '--text-muted': '#637777',
                '--border-color': '#1d3b53',
                '--accent-blue': '#82aaff',
                '--accent-blue-hover': '#5f8af7',
                '--input-bg': '#0b2942',
                '--card-bg': '#0b2942',
                '--modal-bg': '#0b2942',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)'
            }
        },
        // Tokyo Night - Japanese city-lights inspired theme
        tokyoNight: {
            name: 'Tokyo Night',
            icon: 'stars',
            colors: {
                '--bg-primary': '#1a1b26',
                '--bg-secondary': '#16161e',
                '--bg-tertiary': '#24283b',
                '--text-primary': '#c0caf5',
                '--text-secondary': '#9aa5ce',
                '--text-muted': '#565f89',
                '--border-color': '#292e42',
                '--accent-blue': '#7aa2f7',
                '--accent-blue-hover': '#2ac3de',
                '--input-bg': '#16161e',
                '--card-bg': '#16161e',
                '--modal-bg': '#16161e',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)'
            }
        },
        // Nord - Arctic, north-bluish color palette
        nord: {
            name: 'Nord',
            icon: 'snow',
            colors: {
                '--bg-primary': '#2e3440',
                '--bg-secondary': '#3b4252',
                '--bg-tertiary': '#434c5e',
                '--text-primary': '#eceff4',
                '--text-secondary': '#d8dee9',
                '--text-muted': '#81a1c1',
                '--border-color': '#4c566a',
                '--accent-blue': '#88c0d0',
                '--accent-blue-hover': '#81a1c1',
                '--input-bg': '#3b4252',
                '--card-bg': '#3b4252',
                '--modal-bg': '#3b4252',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        },
        // Catppuccin Mocha - Soothing pastel theme
        catppuccin: {
            name: 'Catppuccin',
            icon: 'coffee',
            colors: {
                '--bg-primary': '#1e1e2e',
                '--bg-secondary': '#181825',
                '--bg-tertiary': '#313244',
                '--text-primary': '#cdd6f4',
                '--text-secondary': '#bac2de',
                '--text-muted': '#6c7086',
                '--border-color': '#45475a',
                '--accent-blue': '#89b4fa',
                '--accent-blue-hover': '#b4befe',
                '--input-bg': '#181825',
                '--card-bg': '#181825',
                '--modal-bg': '#181825',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)'
            }
        },
        // Gruvbox Dark - Retro groove color scheme
        gruvbox: {
            name: 'Gruvbox',
            icon: 'sun',
            colors: {
                '--bg-primary': '#282828',
                '--bg-secondary': '#1d2021',
                '--bg-tertiary': '#3c3836',
                '--text-primary': '#ebdbb2',
                '--text-secondary': '#d5c4a1',
                '--text-muted': '#928374',
                '--border-color': '#504945',
                '--accent-blue': '#83a598',
                '--accent-blue-hover': '#8ec07c',
                '--input-bg': '#1d2021',
                '--card-bg': '#1d2021',
                '--modal-bg': '#1d2021',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)'
            }
        },
        // Solarized Dark - Classic Ethan Schoonover theme
        solarized: {
            name: 'Solarized Dark',
            icon: 'sun',
            colors: {
                '--bg-primary': '#002b36',
                '--bg-secondary': '#073642',
                '--bg-tertiary': '#094959',
                '--text-primary': '#839496',
                '--text-secondary': '#93a1a1',
                '--text-muted': '#657b83',
                '--border-color': '#586e75',
                '--accent-blue': '#268bd2',
                '--accent-blue-hover': '#2aa198',
                '--input-bg': '#073642',
                '--card-bg': '#073642',
                '--modal-bg': '#073642',
                '--shadow-color': 'rgba(0, 0, 0, 0.3)'
            }
        }
    },

    currentTheme: 'oneDarkPro',
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
            snow: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line><line x1="20" y1="16" x2="4" y2="8"></line><line x1="20" y1="8" x2="4" y2="16"></line></svg>',
            coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>',
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
        return this.themes[this.currentTheme]?.colors || this.themes.oneDarkPro.colors;
    },

    // Check if current theme is a light theme
    isLightTheme() {
        return this.currentTheme === 'githubLight';
    },

    // Get list of all available themes
    getAvailableThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            id: key,
            name: theme.name
        }));
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemePicker.init();
});

// Make available globally
window.ThemePicker = ThemePicker;
