// Purple Ambient Background — Canvas-based animated background
// Adapted from React PurpleBackground component for vanilla JS
// Blends with Deep Obsidian theme palette (blue-purple spectrum)

const PurpleBackground = {
    canvas: null,
    ctx: null,
    animationId: 0,
    timeRef: 0,
    _paused: false,
    _reduced: false,
    _lightMode: false,

    // Blob definitions — organic flowing shapes
    blobs: [
        { x: 0.15, y: 0.2,  rx: 0.22, ry: 0.35, speed: 0.0003,  phase: 0,   drift: 0.04  },
        { x: 0.75, y: 0.15, rx: 0.18, ry: 0.28, speed: 0.00025, phase: 1.2, drift: 0.05  },
        { x: 0.5,  y: 0.5,  rx: 0.3,  ry: 0.4,  speed: 0.0002,  phase: 2.4, drift: 0.03  },
        { x: 0.85, y: 0.7,  rx: 0.2,  ry: 0.32, speed: 0.00035, phase: 3.6, drift: 0.045 },
        { x: 0.3,  y: 0.8,  rx: 0.25, ry: 0.3,  speed: 0.00028, phase: 4.8, drift: 0.035 },
        { x: 0.6,  y: 0.3,  rx: 0.15, ry: 0.25, speed: 0.0004,  phase: 0.8, drift: 0.055 },
        { x: 0.1,  y: 0.55, rx: 0.17, ry: 0.22, speed: 0.00032, phase: 2.0, drift: 0.04  }
    ],

    // Deep Obsidian–tuned purple palette (shifted toward blue-purple to match accent-blue #6c8aff)
    darkColors: [
        "rgba(108, 80, 210, 0.40)",   // blue-violet
        "rgba(90, 60, 190, 0.35)",    // deep violet
        "rgba(139, 92, 246, 0.32)",   // vivid purple (matches --glow-accent)
        "rgba(100, 70, 200, 0.38)",   // mid violet
        "rgba(120, 100, 240, 0.28)",  // periwinkle
        "rgba(80, 50, 180, 0.35)",    // dark violet
        "rgba(108, 138, 255, 0.25)"   // accent-blue tint (matches --accent-blue)
    ],

    // Polar White–tuned palette — soft lavender/violet on white, lower opacity for readability
    lightColors: [
        "rgba(124, 92, 220, 0.12)",   // soft violet
        "rgba(139, 92, 246, 0.10)",   // lavender
        "rgba(108, 80, 210, 0.09)",   // muted blue-violet
        "rgba(160, 120, 255, 0.08)",  // light periwinkle
        "rgba(100, 70, 200, 0.10)",   // mid violet
        "rgba(130, 100, 240, 0.07)",  // pale periwinkle
        "rgba(108, 138, 255, 0.08)"   // accent-blue tint
    ],

    get colors() {
        return this._lightMode ? this.lightColors : this.darkColors;
    },

    init: function() {
        this.canvas = document.getElementById('purple-bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        // Check reduced motion preference
        this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this._resize();
        window.addEventListener('resize', this._onResize.bind(this));

        // Pause when tab hidden for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this._paused = true;
                cancelAnimationFrame(this.animationId);
            } else {
                this._paused = false;
                this.animationId = requestAnimationFrame(this._animate.bind(this));
            }
        });

        // If reduced motion, draw one static frame
        if (this._reduced) {
            this._animate(0);
        } else {
            this.animationId = requestAnimationFrame(this._animate.bind(this));
        }
    },

    _onResize: function() {
        this._resize();
    },

    _resize: function() {
        if (!this.canvas) return;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    _drawBlob: function(cx, cy, rx, ry, time, color, alpha) {
        var ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);

        // Organic shape using quadratic bezier curves
        var points = 8;
        ctx.beginPath();

        for (var i = 0; i <= points; i++) {
            var angle = (i / points) * Math.PI * 2;
            var nextAngle = ((i + 1) / points) * Math.PI * 2;

            var wobble1 = 1 + 0.15 * Math.sin(time * 0.001 + i * 1.3);
            var wobble2 = 1 + 0.12 * Math.cos(time * 0.0008 + i * 0.9);

            var px = Math.cos(angle) * rx * wobble1;
            var py = Math.sin(angle) * ry * wobble2;

            var cpx = Math.cos((angle + nextAngle) / 2) * rx * 1.15 * wobble2;
            var cpy = Math.sin((angle + nextAngle) / 2) * ry * 1.15 * wobble1;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.quadraticCurveTo(cpx, cpy, px, py);
            }
        }

        ctx.closePath();

        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.6, color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        // Use blur proportional to viewport for soft organic look
        var blurSize = Math.min(window.innerWidth, window.innerHeight) * 0.06;
        ctx.filter = 'blur(' + blurSize + 'px)';
        ctx.fill();
        ctx.filter = 'none';
        ctx.restore();
    },

    _animate: function(timestamp) {
        if (this._paused) return;
        var ctx = this.ctx;
        if (!ctx) return;

        var w = window.innerWidth;
        var h = window.innerHeight;
        var dpr = window.devicePixelRatio || 1;

        // Reset transform for clearing
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // Background fill — dark or light base
        ctx.fillStyle = this._lightMode ? '#f8f7fc' : '#0f0e16';
        ctx.fillRect(0, 0, w, h);

        // Draw blobs — lower alpha in light mode for readability
        var baseAlpha = this._lightMode ? 0.85 : 0.55;
        var self = this;
        this.blobs.forEach(function(blob, i) {
            var cx = blob.x * w + Math.sin(timestamp * blob.speed + blob.phase) * w * blob.drift;
            var cy = blob.y * h + Math.cos(timestamp * blob.speed * 0.7 + blob.phase) * h * blob.drift;
            var rx = blob.rx * Math.min(w, h);
            var ry = blob.ry * Math.min(w, h);
            self._drawBlob(cx, cy, rx, ry, timestamp + blob.phase * 1000, self.colors[i], baseAlpha);
        });

        // Subtle wave overlay
        ctx.save();
        ctx.globalAlpha = this._lightMode ? 0.03 : 0.06;

        for (var j = 0; j < 5; j++) {
            ctx.beginPath();
            var waveY = h * (0.2 + j * 0.15);
            ctx.moveTo(0, waveY);

            for (var x = 0; x <= w; x += 4) {
                var y = waveY +
                    Math.sin(x * 0.003 + timestamp * 0.0004 + j * 0.8) * 40 +
                    Math.cos(x * 0.005 + timestamp * 0.0003 + j * 1.2) * 25;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();

            var waveGrad = ctx.createLinearGradient(0, waveY - 60, 0, waveY + 200);
            if (this._lightMode) {
                waveGrad.addColorStop(0, 'rgba(124, 92, 220, 0.15)');
                waveGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
            } else {
                waveGrad.addColorStop(0, 'rgba(108, 100, 220, 0.5)');
                waveGrad.addColorStop(1, 'rgba(80, 60, 180, 0)');
            }
            ctx.fillStyle = waveGrad;
            ctx.fill();
        }
        ctx.restore();

        // Vignette — softens edges
        ctx.save();
        var vignetteGrad = ctx.createRadialGradient(
            w / 2, h / 2, Math.min(w, h) * 0.3,
            w / 2, h / 2, Math.max(w, h) * 0.75
        );
        vignetteGrad.addColorStop(0, 'transparent');
        if (this._lightMode) {
            vignetteGrad.addColorStop(1, 'rgba(240, 238, 248, 0.35)');
        } else {
            vignetteGrad.addColorStop(1, 'rgba(5, 3, 12, 0.45)');
        }
        ctx.fillStyle = vignetteGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        // Continue animation loop (skip if reduced motion — single frame only)
        if (!this._reduced) {
            this.animationId = requestAnimationFrame(this._animate.bind(this));
        }
    },

    // Switch between dark and light mode palettes
    setMode: function(mode) {
        this._lightMode = (mode === 'light');
    },

    destroy: function() {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this._onResize);
    }
};

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { PurpleBackground.init(); });
} else {
    PurpleBackground.init();
}
