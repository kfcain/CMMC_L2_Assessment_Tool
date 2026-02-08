import { useEffect, useRef } from "react";

interface PurpleBackgroundProps {
  isDark: boolean;
}

export function PurpleBackground({ isDark }: PurpleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    // Blob definitions - organic flowing shapes
    const blobs = [
      { x: 0.15, y: 0.2, rx: 0.22, ry: 0.35, speed: 0.0003, phase: 0, drift: 0.04 },
      { x: 0.75, y: 0.15, rx: 0.18, ry: 0.28, speed: 0.00025, phase: 1.2, drift: 0.05 },
      { x: 0.5, y: 0.5, rx: 0.3, ry: 0.4, speed: 0.0002, phase: 2.4, drift: 0.03 },
      { x: 0.85, y: 0.7, rx: 0.2, ry: 0.32, speed: 0.00035, phase: 3.6, drift: 0.045 },
      { x: 0.3, y: 0.8, rx: 0.25, ry: 0.3, speed: 0.00028, phase: 4.8, drift: 0.035 },
      { x: 0.6, y: 0.3, rx: 0.15, ry: 0.25, speed: 0.0004, phase: 0.8, drift: 0.055 },
      { x: 0.1, y: 0.55, rx: 0.17, ry: 0.22, speed: 0.00032, phase: 2.0, drift: 0.04 },
    ];

    const drawBlob = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      time: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);

      // Create organic shape using bezier curves
      const points = 8;
      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const nextAngle = ((i + 1) / points) * Math.PI * 2;

        const wobble1 = 1 + 0.15 * Math.sin(time * 0.001 + i * 1.3);
        const wobble2 = 1 + 0.12 * Math.cos(time * 0.0008 + i * 0.9);

        const px = Math.cos(angle) * rx * wobble1;
        const py = Math.sin(angle) * ry * wobble2;

        const cpx = Math.cos((angle + nextAngle) / 2) * rx * 1.15 * wobble2;
        const cpy = Math.sin((angle + nextAngle) / 2) * ry * 1.15 * wobble1;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.quadraticCurveTo(cpx, cpy, px, py);
        }
      }

      ctx.closePath();

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.6, color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${Math.min(w(), h()) * 0.06}px)`;
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();
    };

    const animate = (timestamp: number) => {
      timeRef.current = timestamp;
      const width = w();
      const height = h();

      // Reset transform for clearing
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Background
      if (isDark) {
        ctx.fillStyle = "#08070f";
      } else {
        ctx.fillStyle = "#faf9ff";
      }
      ctx.fillRect(0, 0, width, height);

      // Purple palette
      const darkColors = [
        "rgba(120, 60, 200, 0.5)",
        "rgba(90, 40, 180, 0.45)",
        "rgba(140, 80, 220, 0.4)",
        "rgba(100, 50, 190, 0.5)",
        "rgba(160, 100, 240, 0.35)",
        "rgba(80, 30, 170, 0.45)",
        "rgba(130, 70, 210, 0.4)",
      ];

      const lightColors = [
        "rgba(180, 140, 240, 0.35)",
        "rgba(160, 120, 230, 0.3)",
        "rgba(200, 160, 250, 0.3)",
        "rgba(170, 130, 235, 0.35)",
        "rgba(210, 180, 255, 0.25)",
        "rgba(150, 110, 225, 0.3)",
        "rgba(190, 150, 245, 0.3)",
      ];

      const colors = isDark ? darkColors : lightColors;
      const baseAlpha = isDark ? 0.7 : 0.6;

      blobs.forEach((blob, i) => {
        const cx = blob.x * width + Math.sin(timestamp * blob.speed + blob.phase) * width * blob.drift;
        const cy = blob.y * height + Math.cos(timestamp * blob.speed * 0.7 + blob.phase) * height * blob.drift;
        const rx = blob.rx * Math.min(width, height);
        const ry = blob.ry * Math.min(width, height);

        drawBlob(cx, cy, rx, ry, timestamp + blob.phase * 1000, colors[i], baseAlpha);
      });

      // Subtle wave overlay
      ctx.save();
      ctx.globalAlpha = isDark ? 0.08 : 0.05;

      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        const waveY = height * (0.2 + j * 0.15);
        ctx.moveTo(0, waveY);

        for (let x = 0; x <= width; x += 4) {
          const y =
            waveY +
            Math.sin(x * 0.003 + timestamp * 0.0004 + j * 0.8) * 40 +
            Math.cos(x * 0.005 + timestamp * 0.0003 + j * 1.2) * 25;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, waveY - 60, 0, waveY + 200);
        if (isDark) {
          waveGrad.addColorStop(0, "rgba(130, 80, 220, 0.6)");
          waveGrad.addColorStop(1, "rgba(80, 40, 160, 0)");
        } else {
          waveGrad.addColorStop(0, "rgba(170, 130, 240, 0.5)");
          waveGrad.addColorStop(1, "rgba(200, 170, 255, 0)");
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      ctx.restore();

      // Subtle noise / grain texture overlay for depth
      ctx.save();
      ctx.globalAlpha = isDark ? 0.03 : 0.015;
      const imageData = ctx.getImageData(0, 0, 2, 2);
      // Just a very subtle vignette instead of actual noise for performance
      ctx.restore();

      // Vignette
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignetteGrad.addColorStop(0, "transparent");
      if (isDark) {
        vignetteGrad.addColorStop(1, "rgba(5, 3, 12, 0.4)");
      } else {
        vignetteGrad.addColorStop(1, "rgba(240, 235, 255, 0.3)");
      }
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
