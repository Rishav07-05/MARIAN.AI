'use client';

import React, { useEffect, useRef } from 'react';

export const NeuralVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle nodes
    const particleCount = 45;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#F4F6A6' : '#C6283D',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render neural network connection links
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 110) * 0.25;
            ctx.strokeStyle = `rgba(244, 246, 166, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl bg-[#121214] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0B0C] via-transparent to-[#F4F6A6]/5 pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating telemetry overlay card */}
      <div className="relative z-10 p-6 rounded-xl bg-[#0B0B0C]/80 backdrop-blur-md border border-white/10 max-w-sm text-left space-y-3 shadow-2xl">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F4F6A6] animate-pulse" />
            MARIAN NEURAL ENGINE
          </span>
          <span className="text-[#F4F6A6]">99.98% ACCURACY</span>
        </div>
        <p className="text-xs text-[#F5F5F0] leading-relaxed font-mono">
          &gt; Initializing multi-head spatial reasoning matrix...
          <br />
          &gt; Stream latency: 18ms
          <br />
          &gt; Active context: 200,000 tokens
        </p>
      </div>
    </div>
  );
};
