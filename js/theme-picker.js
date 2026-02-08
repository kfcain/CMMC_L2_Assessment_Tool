// Theme Picker Module
// Handles theme switching and persistence across the site

const ThemePicker = {
    // Available themes — Deep Obsidian is the premium default
    themes: {
        // Deep Obsidian — Premium dark theme with animated purple background
        deepObsidian: {
            name: 'Deep Obsidian',
            icon: 'gem',
            category: 'premium',
            hasPurpleBg: true,
            colors: {
                '--bg-primary': '#0a0a0f',
                '--bg-secondary': '#0f1117',
                '--bg-tertiary': '#161822',
                '--bg-elevated': '#1a1d2b',
                '--text-primary': '#e4e5ea',
                '--text-secondary': '#8b8fa3',
                '--text-muted': '#4e5263',
                '--border-color': '#1e2030',
                '--border-subtle': 'rgba(255, 255, 255, 0.04)',
                '--accent-blue': '#6c8aff',
                '--accent-blue-hover': '#5470e0',
                '--accent-glow': 'rgba(108, 138, 255, 0.15)',
                '--input-bg': '#0d0e14',
                '--card-bg': '#0f1117',
                '--modal-bg': '#0f1117',
                '--shadow-color': 'rgba(0, 0, 0, 0.6)',
                '--glass-bg': 'rgba(15, 17, 23, 0.72)',
                '--glass-border': 'rgba(255, 255, 255, 0.05)',
                '--glow-primary': 'rgba(108, 138, 255, 0.08)',
                '--glow-accent': 'rgba(139, 92, 246, 0.06)',
                '--hover-bg': 'rgba(108, 138, 255, 0.06)',
                '--hover-border': 'rgba(108, 138, 255, 0.15)',
                '--hover-glow': 'rgba(108, 138, 255, 0.08)',
                '--focus-border': 'rgba(108, 138, 255, 0.3)',
                '--focus-glow': 'rgba(108, 138, 255, 0.08)',
                '--card-hover-border': 'rgba(108, 138, 255, 0.1)',
                '--card-hover-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 20px rgba(108, 138, 255, 0.04)',
                '--table-hover-bg': 'rgba(108, 138, 255, 0.03)',
                '--table-border': 'rgba(255, 255, 255, 0.03)',
                '--table-header-bg': 'rgba(255, 255, 255, 0.02)',
                '--accent-line': 'linear-gradient(90deg, transparent, rgba(108, 138, 255, 0.15), transparent)',
                '--nav-active-bg': 'linear-gradient(135deg, rgba(108, 138, 255, 0.15), rgba(139, 92, 246, 0.1))',
                '--nav-active-border': 'rgba(108, 138, 255, 0.2)',
                '--nav-active-bar': 'linear-gradient(180deg, #6c8aff, #8b5cf6)'
            }
        },
        // One Dark Pro - Most popular VS Code theme (Atom One Dark inspired)
        oneDarkPro: {
            name: 'One Dark Pro',
            icon: 'moon',
            colors: {
                '--bg-primary': '#282c34',
                '--bg-secondary': '#21252b',
                '--bg-tertiary': '#2c313a',
                '--bg-elevated': '#353b45',
                '--text-primary': '#abb2bf',
                '--text-secondary': '#828997',
                '--text-muted': '#5c6370',
                '--border-color': '#3e4451',
                '--accent-blue': '#61afef',
                '--accent-blue-hover': '#528bcc',
                '--input-bg': '#1d1f23',
                '--card-bg': '#21252b',
                '--modal-bg': '#21252b',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)',
                '--glass-bg': 'rgba(33, 37, 43, 0.8)',
                '--glass-border': 'rgba(255, 255, 255, 0.06)',
                '--glow-primary': 'rgba(97, 175, 239, 0.08)',
                '--glow-accent': 'rgba(97, 175, 239, 0.06)',
                '--hover-bg': 'rgba(97, 175, 239, 0.06)',
                '--hover-border': 'rgba(97, 175, 239, 0.15)',
                '--card-hover-border': 'rgba(97, 175, 239, 0.12)',
                '--card-hover-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(97, 175, 239, 0.04)',
                '--table-hover-bg': 'rgba(97, 175, 239, 0.04)',
                '--accent-line': 'linear-gradient(90deg, transparent, rgba(97, 175, 239, 0.15), transparent)',
                '--nav-active-bg': 'linear-gradient(135deg, rgba(97, 175, 239, 0.15), rgba(97, 175, 239, 0.08))',
                '--nav-active-border': 'rgba(97, 175, 239, 0.2)',
                '--nav-active-bar': 'linear-gradient(180deg, #61afef, #528bcc)'
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
                '--bg-elevated': '#3d4058',
                '--text-primary': '#f8f8f2',
                '--text-secondary': '#bd93f9',
                '--text-muted': '#6272a4',
                '--border-color': '#44475a',
                '--accent-blue': '#bd93f9',
                '--accent-blue-hover': '#ff79c6',
                '--input-bg': '#21222c',
                '--card-bg': '#21222c',
                '--modal-bg': '#21222c',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)',
                '--glass-bg': 'rgba(33, 34, 44, 0.8)',
                '--glass-border': 'rgba(255, 255, 255, 0.06)',
                '--glow-primary': 'rgba(189, 147, 249, 0.08)',
                '--glow-accent': 'rgba(255, 121, 198, 0.06)',
                '--hover-bg': 'rgba(189, 147, 249, 0.06)',
                '--hover-border': 'rgba(189, 147, 249, 0.15)',
                '--card-hover-border': 'rgba(189, 147, 249, 0.12)',
                '--card-hover-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(189, 147, 249, 0.06)',
                '--table-hover-bg': 'rgba(189, 147, 249, 0.04)',
                '--accent-line': 'linear-gradient(90deg, transparent, rgba(189, 147, 249, 0.15), transparent)',
                '--nav-active-bg': 'linear-gradient(135deg, rgba(189, 147, 249, 0.15), rgba(255, 121, 198, 0.1))',
                '--nav-active-border': 'rgba(189, 147, 249, 0.2)',
                '--nav-active-bar': 'linear-gradient(180deg, #bd93f9, #ff79c6)'
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
                '--bg-elevated': '#2d333b',
                '--text-primary': '#e6edf3',
                '--text-secondary': '#8b949e',
                '--text-muted': '#6e7681',
                '--border-color': '#30363d',
                '--accent-blue': '#58a6ff',
                '--accent-blue-hover': '#1f6feb',
                '--input-bg': '#0d1117',
                '--card-bg': '#161b22',
                '--modal-bg': '#161b22',
                '--shadow-color': 'rgba(0, 0, 0, 0.4)',
                '--glass-bg': 'rgba(22, 27, 34, 0.8)',
                '--glass-border': 'rgba(255, 255, 255, 0.06)',
                '--glow-primary': 'rgba(88, 166, 255, 0.08)',
                '--hover-bg': 'rgba(88, 166, 255, 0.06)',
                '--hover-border': 'rgba(88, 166, 255, 0.15)',
                '--card-hover-border': 'rgba(88, 166, 255, 0.12)',
                '--card-hover-shadow': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(88, 166, 255, 0.04)',
                '--table-hover-bg': 'rgba(88, 166, 255, 0.04)',
                '--accent-line': 'linear-gradient(90deg, transparent, rgba(88, 166, 255, 0.15), transparent)',
                '--nav-active-bg': 'linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.08))',
                '--nav-active-border': 'rgba(88, 166, 255, 0.2)',
                '--nav-active-bar': 'linear-gradient(180deg, #58a6ff, #1f6feb)'
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
                '--bg-elevated': '#ffffff',
                '--text-primary': '#1f2328',
                '--text-secondary': '#656d76',
                '--text-muted': '#8b949e',
                '--border-color': '#d1d9e0',
                '--accent-blue': '#0969da',
                '--accent-blue-hover': '#0550ae',
                '--input-bg': '#ffffff',
                '--card-bg': '#ffffff',
                '--modal-bg': '#ffffff',
                '--shadow-color': 'rgba(31, 35, 40, 0.12)',
                '--glass-bg': 'rgba(255, 255, 255, 0.85)',
                '--glass-border': 'rgba(0, 0, 0, 0.1)',
                '--glow-primary': 'rgba(9, 105, 218, 0.06)',
                '--hover-bg': 'rgba(9, 105, 218, 0.04)',
                '--hover-border': 'rgba(9, 105, 218, 0.2)',
                '--card-hover-border': 'rgba(9, 105, 218, 0.15)',
                '--card-hover-shadow': '0 4px 16px rgba(31, 35, 40, 0.1)',
                '--table-hover-bg': 'rgba(9, 105, 218, 0.03)',
                '--accent-line': 'linear-gradient(90deg, transparent, rgba(9, 105, 218, 0.15), transparent)',
                '--nav-active-bg': 'linear-gradient(135deg, rgba(9, 105, 218, 0.1), rgba(9, 105, 218, 0.05))',
                '--nav-active-border': 'rgba(9, 105, 218, 0.25)',
                '--nav-active-bar': 'linear-gradient(180deg, #0969da, #0550ae)'
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
            category: 'classic',
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
        },
        // === CYBERPUNK & NEON ===
        // Cyberpunk 2077 - Neon-soaked dystopian future
        cyberpunk: {
            name: 'Cyberpunk',
            icon: 'zap',
            category: 'neon',
            colors: {
                '--bg-primary': '#0a0a0f',
                '--bg-secondary': '#12121a',
                '--bg-tertiary': '#1a1a25',
                '--text-primary': '#00f0ff',
                '--text-secondary': '#ff00aa',
                '--text-muted': '#666680',
                '--border-color': '#2a2a40',
                '--accent-blue': '#00f0ff',
                '--accent-blue-hover': '#ff00aa',
                '--input-bg': '#0f0f18',
                '--card-bg': '#12121a',
                '--modal-bg': '#0a0a0f',
                '--shadow-color': 'rgba(0, 240, 255, 0.15)'
            }
        },
        // Synthwave - 80s retro-futurism
        synthwave: {
            name: 'Synthwave',
            icon: 'music',
            category: 'neon',
            colors: {
                '--bg-primary': '#1a1025',
                '--bg-secondary': '#241734',
                '--bg-tertiary': '#2e1f42',
                '--text-primary': '#ff7edb',
                '--text-secondary': '#36f9f6',
                '--text-muted': '#848bbd',
                '--border-color': '#3d2a54',
                '--accent-blue': '#ff7edb',
                '--accent-blue-hover': '#36f9f6',
                '--input-bg': '#1a1025',
                '--card-bg': '#241734',
                '--modal-bg': '#1a1025',
                '--shadow-color': 'rgba(255, 126, 219, 0.2)'
            }
        },
        // Neon Noir - Dark with electric accents
        neonNoir: {
            name: 'Neon Noir',
            icon: 'zap',
            category: 'neon',
            colors: {
                '--bg-primary': '#0d0d0d',
                '--bg-secondary': '#151515',
                '--bg-tertiary': '#1f1f1f',
                '--text-primary': '#e0e0e0',
                '--text-secondary': '#39ff14',
                '--text-muted': '#555555',
                '--border-color': '#2a2a2a',
                '--accent-blue': '#39ff14',
                '--accent-blue-hover': '#00ff88',
                '--input-bg': '#0d0d0d',
                '--card-bg': '#151515',
                '--modal-bg': '#0d0d0d',
                '--shadow-color': 'rgba(57, 255, 20, 0.15)'
            }
        },
        // === RETRO & VINTAGE ===
        // Roaring Twenties - Art Deco gold and black
        roaring20s: {
            name: 'Roaring 20s',
            icon: 'diamond',
            category: 'vintage',
            colors: {
                '--bg-primary': '#1a1a1a',
                '--bg-secondary': '#0d0d0d',
                '--bg-tertiary': '#252525',
                '--text-primary': '#d4af37',
                '--text-secondary': '#c9b037',
                '--text-muted': '#8b7355',
                '--border-color': '#3d3424',
                '--accent-blue': '#d4af37',
                '--accent-blue-hover': '#ffd700',
                '--input-bg': '#0d0d0d',
                '--card-bg': '#0d0d0d',
                '--modal-bg': '#1a1a1a',
                '--shadow-color': 'rgba(212, 175, 55, 0.2)'
            }
        },
        // Vintage Terminal - Green phosphor CRT
        terminal: {
            name: 'Terminal',
            icon: 'terminal',
            category: 'vintage',
            colors: {
                '--bg-primary': '#0c0c0c',
                '--bg-secondary': '#0a0a0a',
                '--bg-tertiary': '#141414',
                '--text-primary': '#33ff33',
                '--text-secondary': '#00cc00',
                '--text-muted': '#226622',
                '--border-color': '#1a3d1a',
                '--accent-blue': '#33ff33',
                '--accent-blue-hover': '#66ff66',
                '--input-bg': '#080808',
                '--card-bg': '#0a0a0a',
                '--modal-bg': '#0c0c0c',
                '--shadow-color': 'rgba(51, 255, 51, 0.1)'
            }
        },
        // Amber CRT - Classic amber monitor
        amberCRT: {
            name: 'Amber CRT',
            icon: 'terminal',
            category: 'vintage',
            colors: {
                '--bg-primary': '#1a1408',
                '--bg-secondary': '#120e05',
                '--bg-tertiary': '#221a0c',
                '--text-primary': '#ffb000',
                '--text-secondary': '#cc8800',
                '--text-muted': '#665500',
                '--border-color': '#3d2e11',
                '--accent-blue': '#ffb000',
                '--accent-blue-hover': '#ffcc44',
                '--input-bg': '#0f0b04',
                '--card-bg': '#120e05',
                '--modal-bg': '#1a1408',
                '--shadow-color': 'rgba(255, 176, 0, 0.15)'
            }
        },
        // === NATURE & EARTH ===
        // Forest - Deep greens and earth tones
        forest: {
            name: 'Forest',
            icon: 'tree',
            category: 'nature',
            colors: {
                '--bg-primary': '#1a2416',
                '--bg-secondary': '#141d11',
                '--bg-tertiary': '#243320',
                '--text-primary': '#c4d7b2',
                '--text-secondary': '#8fb573',
                '--text-muted': '#5c7a4a',
                '--border-color': '#2d4425',
                '--accent-blue': '#8fb573',
                '--accent-blue-hover': '#a8cf8a',
                '--input-bg': '#141d11',
                '--card-bg': '#141d11',
                '--modal-bg': '#1a2416',
                '--shadow-color': 'rgba(143, 181, 115, 0.15)'
            }
        },
        // Ocean - Deep sea blues
        ocean: {
            name: 'Ocean',
            icon: 'waves',
            category: 'nature',
            colors: {
                '--bg-primary': '#0a1628',
                '--bg-secondary': '#071020',
                '--bg-tertiary': '#0f2038',
                '--text-primary': '#a0c4e8',
                '--text-secondary': '#5da9e9',
                '--text-muted': '#3a6d96',
                '--border-color': '#1a3a5c',
                '--accent-blue': '#5da9e9',
                '--accent-blue-hover': '#7ec4ff',
                '--input-bg': '#071020',
                '--card-bg': '#071020',
                '--modal-bg': '#0a1628',
                '--shadow-color': 'rgba(93, 169, 233, 0.15)'
            }
        },
        // === WARM TONES ===
        // Sunset - Warm oranges and purples
        sunset: {
            name: 'Sunset',
            icon: 'sun',
            category: 'warm',
            colors: {
                '--bg-primary': '#1f1520',
                '--bg-secondary': '#18101a',
                '--bg-tertiary': '#2a1d2c',
                '--text-primary': '#f5d0c5',
                '--text-secondary': '#f28c70',
                '--text-muted': '#8b6d7a',
                '--border-color': '#3d2d40',
                '--accent-blue': '#f28c70',
                '--accent-blue-hover': '#ffa588',
                '--input-bg': '#18101a',
                '--card-bg': '#18101a',
                '--modal-bg': '#1f1520',
                '--shadow-color': 'rgba(242, 140, 112, 0.15)'
            }
        },
        // Lava - Deep reds and oranges
        lava: {
            name: 'Lava',
            icon: 'flame',
            category: 'warm',
            colors: {
                '--bg-primary': '#1a0f0f',
                '--bg-secondary': '#120a0a',
                '--bg-tertiary': '#241515',
                '--text-primary': '#ff6b6b',
                '--text-secondary': '#ff4757',
                '--text-muted': '#8b4545',
                '--border-color': '#3d2020',
                '--accent-blue': '#ff4757',
                '--accent-blue-hover': '#ff6b6b',
                '--input-bg': '#120a0a',
                '--card-bg': '#120a0a',
                '--modal-bg': '#1a0f0f',
                '--shadow-color': 'rgba(255, 71, 87, 0.2)'
            }
        }
    },
    
    // Theme categories for organized display
    themeCategories: {
        premium: { name: 'Premium', themes: ['deepObsidian'] },
        popular: { name: 'Popular', themes: ['oneDarkPro', 'dracula', 'githubDark', 'githubLight', 'tokyoNight'] },
        classic: { name: 'Classic', themes: ['nightOwl', 'nord', 'catppuccin', 'gruvbox', 'solarized'] },
        neon: { name: 'Neon & Cyber', themes: ['cyberpunk', 'synthwave', 'neonNoir'] },
        vintage: { name: 'Retro', themes: ['roaring20s', 'terminal', 'amberCRT'] },
        nature: { name: 'Nature', themes: ['forest', 'ocean'] },
        warm: { name: 'Warm', themes: ['sunset', 'lava'] }
    },

    currentTheme: 'deepObsidian',
    storageKey: 'cmmc-theme-preference',

    // Auto-fill extended CSS variables for themes that only define the basic set
    _fillDefaults() {
        Object.entries(this.themes).forEach(([key, theme]) => {
            const c = theme.colors;
            // Skip themes that already have the full extended set
            if (c['--glass-bg'] && c['--hover-bg'] && c['--nav-active-bg']) return;

            // Parse accent color hex to RGB for rgba() generation
            const accent = c['--accent-blue'] || '#6c8aff';
            const accentHover = c['--accent-blue-hover'] || accent;
            const bgSec = c['--bg-secondary'] || '#0f1117';
            const isLight = theme.name === 'GitHub Light';

            // Helper: hex to r,g,b string
            const hexToRgb = (hex) => {
                hex = hex.replace('#', '');
                if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                const n = parseInt(hex, 16);
                return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
            };

            const ar = hexToRgb(accent);
            const bgR = hexToRgb(bgSec);

            // Fill in missing extended variables
            if (!c['--bg-elevated']) c['--bg-elevated'] = c['--bg-tertiary'] || '#1a1d2b';
            if (!c['--border-subtle']) c['--border-subtle'] = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.04)';
            if (!c['--accent-glow']) c['--accent-glow'] = `rgba(${ar}, 0.15)`;
            if (!c['--glass-bg']) c['--glass-bg'] = isLight ? 'rgba(255, 255, 255, 0.85)' : `rgba(${bgR}, 0.8)`;
            if (!c['--glass-border']) c['--glass-border'] = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.06)';
            if (!c['--glow-primary']) c['--glow-primary'] = `rgba(${ar}, 0.08)`;
            if (!c['--glow-accent']) c['--glow-accent'] = `rgba(${ar}, 0.06)`;
            if (!c['--hover-bg']) c['--hover-bg'] = `rgba(${ar}, 0.06)`;
            if (!c['--hover-border']) c['--hover-border'] = `rgba(${ar}, 0.15)`;
            if (!c['--hover-glow']) c['--hover-glow'] = `rgba(${ar}, 0.08)`;
            if (!c['--focus-border']) c['--focus-border'] = `rgba(${ar}, 0.3)`;
            if (!c['--focus-glow']) c['--focus-glow'] = `rgba(${ar}, 0.08)`;
            if (!c['--card-hover-border']) c['--card-hover-border'] = `rgba(${ar}, 0.12)`;
            if (!c['--card-hover-shadow']) c['--card-hover-shadow'] = `0 4px 24px rgba(0, 0, 0, 0.2), 0 0 16px rgba(${ar}, 0.04)`;
            if (!c['--table-hover-bg']) c['--table-hover-bg'] = `rgba(${ar}, 0.04)`;
            if (!c['--table-border']) c['--table-border'] = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.03)';
            if (!c['--table-header-bg']) c['--table-header-bg'] = isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)';
            if (!c['--accent-line']) c['--accent-line'] = `linear-gradient(90deg, transparent, rgba(${ar}, 0.15), transparent)`;
            if (!c['--nav-active-bg']) c['--nav-active-bg'] = `linear-gradient(135deg, rgba(${ar}, 0.15), rgba(${ar}, 0.08))`;
            if (!c['--nav-active-border']) c['--nav-active-border'] = `rgba(${ar}, 0.2)`;
            if (!c['--nav-active-bar']) c['--nav-active-bar'] = `linear-gradient(180deg, ${accent}, ${accentHover})`;
        });
    },

    // Initialize the theme picker
    init() {
        this._fillDefaults();
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

        // Toggle purple background canvas based on theme
        this._updatePurpleBackground(theme.hasPurpleBg);

        // Set html background color to match theme
        document.documentElement.style.backgroundColor = theme.hasPurpleBg ? '#08070f' : theme.colors['--bg-primary'];

        this.currentTheme = themeName;
        this.saveTheme(themeName);
        this.updatePickerUI();

        // Dispatch custom event for other components that might need to know
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeName, colors: theme.colors }
        }));
    },

    // Show/hide the animated purple background canvas
    _updatePurpleBackground(show) {
        const canvas = document.getElementById('purple-bg-canvas');
        if (!canvas) return;
        canvas.style.display = show ? '' : 'none';
        // Also set body background for non-canvas themes
        document.body.style.backgroundColor = show ? 'transparent' : 'var(--bg-primary)';
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
            chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
            zap: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
            music: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
            diamond: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"></path></svg>',
            terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
            tree: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"></path><path d="M9 22h6"></path><path d="M12 15l-5-5 3.5-.5-1.5-3 4-3 4 3-1.5 3L19 10z"></path></svg>',
            waves: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>',
            flame: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
            gem: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>'
        };
        return icons[iconName] || icons.palette;
    },

    // Render the theme picker component
    renderPicker() {
        // Render compact version in header only
        this.renderHeaderPicker();
    },
    
    // Render compact header theme picker
    renderHeaderPicker() {
        const container = document.getElementById('header-theme-picker');
        if (!container) return;
        
        const currentTheme = this.themes[this.currentTheme];
        
        // Build categorized theme menu
        let menuContent = '';
        Object.entries(this.themeCategories).forEach(([catKey, category]) => {
            menuContent += `<div class="header-theme-category">${category.name}</div>`;
            category.themes.forEach(themeKey => {
                const theme = this.themes[themeKey];
                if (theme) {
                    menuContent += `
                        <button class="header-theme-option ${themeKey === this.currentTheme ? 'active' : ''}" data-theme="${themeKey}">
                            <span class="header-theme-swatch" style="background: ${theme.colors['--bg-primary']}; border-color: ${theme.colors['--accent-blue']};"></span>
                            <span class="header-theme-name">${theme.name}</span>
                            ${themeKey === this.currentTheme ? '<span class="header-theme-check">✓</span>' : ''}
                        </button>
                    `;
                }
            });
        });
        
        container.innerHTML = `
            <div class="header-theme-dropdown">
                <button class="header-theme-btn" id="header-theme-btn" aria-label="Choose theme" title="Choose theme: ${currentTheme.name}">
                    ${this.getIcon('palette')}
                    ${this.getIcon('chevronDown')}
                </button>
                <div class="header-theme-menu" id="header-theme-menu">
                    ${menuContent}
                </div>
            </div>
        `;
        
        // Bind header theme picker events
        this.bindHeaderPickerEvents();
    },
    
    // Bind events for header theme picker
    bindHeaderPickerEvents() {
        const btn = document.getElementById('header-theme-btn');
        const menu = document.getElementById('header-theme-menu');
        
        if (!btn || !menu) return;
        
        // Clone and replace to remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        
        // Close on click outside (only add once)
        if (!this._headerClickHandler) {
            this._headerClickHandler = (e) => {
                const openMenu = document.getElementById('header-theme-menu');
                if (openMenu && !e.target.closest('.header-theme-dropdown')) {
                    openMenu.classList.remove('open');
                }
            };
            document.addEventListener('click', this._headerClickHandler);
        }
        
        // Theme option clicks
        menu.querySelectorAll('.header-theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                menu.classList.remove('open');
                this.renderHeaderPicker();
            });
        });
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
