import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ComputedPhysics, ProjectileObject } from '../types/physics';
import { sounds } from '../utils/soundEffects';

interface SimulationCanvasProps {
  computed: ComputedPhysics;
  gravity: number;
  selectedObject: ProjectileObject;
  showVectors: boolean;
  isSlowMotion: boolean;
  soundEnabled: boolean;
  onToggleVectors: (val: boolean) => void;
  onToggleSlowMotion: (val: boolean) => void;
  onToggleSound: (val: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  computed,
  gravity,
  selectedObject,
  showVectors,
  isSlowMotion,
  soundEnabled,
  onToggleVectors,
  onToggleSlowMotion,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // References for animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pathHistoryRef = useRef<{ x: number; y: number }[]>([]);
  const currentTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const impactRingsRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);

  const {
    h0,
    vx,
    vy0,
    totalFlightTime,
    maxReachHeight,
    totalHorizontalRange,
  } = computed;

  // Sync sound manager enabled state
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    });
  };

  // Coordinate transforms
  const getScale = useCallback(
    (w: number, h: number) => {
      const margin = 55;
      const availableW = w - margin * 2;
      const availableH = h - margin * 2;

      const maxW = Math.max(30, totalHorizontalRange * 1.25);
      const maxH = Math.max(20, maxReachHeight * 1.35, h0 * 1.2);

      const scaleX = availableW / maxW;
      const scaleY = availableH / maxH;

      return {
        scale: Math.min(scaleX, scaleY),
        ox: 45,
        oy: h - 40,
      };
    },
    [totalHorizontalRange, maxReachHeight, h0]
  );

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromx: number,
    fromy: number,
    tox: number,
    toy: number,
    color: string,
    width: number,
    label?: string
  ) => {
    const headlen = 8;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();

    if (label) {
      ctx.font = 'bold 12px "Cairo", sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(label, tox + 5, toy - 5);
    }
  };

  const getEmojiForObject = (obj: ProjectileObject): string => {
    switch (obj) {
      case 'ball':
      case 'football':
        return '⚽';
      case 'basketball':
        return '🏀';
      case 'rocket':
        return '🚀';
      case 'cannonball':
        return '💣';
      case 'rock':
        return '🪨';
      case 'coin':
        return '🪙';
      case 'arrow':
        return '🏹';
      case 'ufo':
        return '🛸';
      default:
        return '⚽';
    }
  };

  const renderCanvasFrame = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const { scale, ox, oy } = getScale(width, height);

      const worldToCanvas = (wx: number, wy: number) => ({
        cx: ox + wx * scale,
        cy: oy - wy * scale,
      });

      // 1. Sky Background with subtle clouds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, oy);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(0.6, '#F0F9FF');
      skyGrad.addColorStop(1, '#F8FAFC');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, oy);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(width * 0.25, 45, 22, 0, Math.PI * 2);
      ctx.arc(width * 0.25 + 20, 42, 28, 0, Math.PI * 2);
      ctx.arc(width * 0.25 + 45, 48, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.7, 60, 20, 0, Math.PI * 2);
      ctx.arc(width * 0.7 + 22, 55, 26, 0, Math.PI * 2);
      ctx.arc(width * 0.7 + 45, 62, 18, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ground Area (Grass / Earth layer)
      const groundGrad = ctx.createLinearGradient(0, oy, 0, height);
      groundGrad.addColorStop(0, '#10B981'); // Emerald grass top
      groundGrad.addColorStop(0.08, '#059669');
      groundGrad.addColorStop(1, '#064E3B');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, oy, width, height - oy);

      // Ground Top Line
      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(width, oy);
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hash patterns on ground
      ctx.beginPath();
      for (let x = 0; x < width; x += 18) {
        ctx.moveTo(x, oy);
        ctx.lineTo(x - 8, oy + 12);
      }
      ctx.strokeStyle = '#065F46';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Platform / Building if h0 > 0
      if (h0 > 0) {
        const bTop = worldToCanvas(0, h0);
        const bWidth = 42;

        // Building shadow
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(ox - bWidth - 4, bTop.cy, bWidth + 8, oy - bTop.cy);

        // Building brick
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(ox - bWidth, bTop.cy, bWidth, oy - bTop.cy);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox - bWidth, bTop.cy, bWidth, oy - bTop.cy);

        // Brick lines & Windows
        ctx.fillStyle = '#0284C7';
        for (let wy = bTop.cy + 12; wy < oy - 12; wy += 18) {
          ctx.fillRect(ox - bWidth + 8, wy, 10, 10);
          ctx.fillRect(ox - bWidth + 24, wy, 10, 10);
        }

        // Height indicator
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(ox - bWidth - 8, oy);
        ctx.lineTo(ox - bWidth - 8, bTop.cy);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 11px Cairo, sans-serif';
        ctx.fillText(`h₀ = ${h0.toFixed(1)}m`, ox - bWidth - 55, (oy + bTop.cy) / 2);
      }

      // Launch Pad / Cannon visualization at start point
      const startPos = worldToCanvas(0, h0);
      ctx.save();
      ctx.translate(startPos.cx, startPos.cy);
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Target Landing Flag 🏁 at range
      if (totalHorizontalRange > 0) {
        const flagPos = worldToCanvas(totalHorizontalRange, 0);
        ctx.font = '20px serif';
        ctx.fillText('🏁', flagPos.cx - 10, flagPos.cy - 6);
      }

      // 4. Parabolic Trajectory Guidance Arc (Dashed)
      if (totalFlightTime > 0) {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#A5B4FC';
        ctx.lineWidth = 2.5;
        const steps = 70;
        for (let i = 0; i <= steps; i++) {
          const tStep = (totalFlightTime / steps) * i;
          const px = vx * tStep;
          let py = h0 + vy0 * tStep - 0.5 * gravity * Math.pow(tStep, 2);
          if (py < 0) py = 0;
          const cPos = worldToCanvas(px, py);
          if (i === 0) ctx.moveTo(cPos.cx, cPos.cy);
          else ctx.lineTo(cPos.cx, cPos.cy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Draw Trajectory Trail so far (Solid Vibrant Line)
      const history = pathHistoryRef.current;
      if (history.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 3.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        history.forEach((pt, idx) => {
          const cPos = worldToCanvas(pt.x, pt.y);
          if (idx === 0) ctx.moveTo(cPos.cx, cPos.cy);
          else ctx.lineTo(cPos.cx, cPos.cy);
        });
        ctx.stroke();
      }

      // 6. Draw Particles (Smoke / Sparks)
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('ALPHA', p.alpha.toFixed(2));
        ctx.fill();
      }

      // 7. Impact Shockwaves
      const rings = impactRingsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += 1.8;
        r.alpha -= 0.035;
        if (r.alpha <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, r.r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${r.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 8. Current coordinates
      const curX = vx * t;
      let curY = h0 + vy0 * t - 0.5 * gravity * Math.pow(t, 2);
      if (curY < 0) curY = 0;

      const curVy = vy0 - gravity * t;
      const pos = worldToCanvas(curX, curY);

      // Add exhaust particles if rocket
      if (selectedObject === 'rocket' && t > 0 && t < totalFlightTime) {
        particlesRef.current.push({
          x: pos.cx,
          y: pos.cy,
          vx: (Math.random() - 0.5) * 1.5 - vx * 0.05,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 4 + 3,
          alpha: 0.8,
          color: Math.random() > 0.5 ? 'rgba(249, 115, 22, ALPHA)' : 'rgba(239, 68, 68, ALPHA)',
        });
      }

      // 9. Draw Range Arrow & Annotation
      if (totalHorizontalRange > 0) {
        const startGround = worldToCanvas(0, 0);
        const endGround = worldToCanvas(totalHorizontalRange, 0);

        ctx.beginPath();
        ctx.moveTo(startGround.cx, startGround.cy + 18);
        ctx.lineTo(endGround.cx, endGround.cy + 18);
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 2;
        ctx.stroke();

        // End ticks
        ctx.beginPath();
        ctx.moveTo(startGround.cx, startGround.cy + 12);
        ctx.lineTo(startGround.cx, startGround.cy + 24);
        ctx.moveTo(endGround.cx, endGround.cy + 12);
        ctx.lineTo(endGround.cx, endGround.cy + 24);
        ctx.stroke();

        ctx.fillStyle = '#BE123C';
        ctx.font = 'bold 12px Cairo, sans-serif';
        const labelText = `المدى R = ${totalHorizontalRange.toFixed(1)} m`;
        ctx.fillText(labelText, (startGround.cx + endGround.cx) / 2 - 35, startGround.cy + 33);
      }

      // Max Height Annotation Marker
      if (maxReachHeight > h0) {
        const peakT = vy0 / gravity;
        if (peakT >= 0 && peakT <= totalFlightTime) {
          const peakX = vx * peakT;
          const peakPos = worldToCanvas(peakX, maxReachHeight);
          const peakBase = worldToCanvas(peakX, 0);

          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(peakPos.cx, peakPos.cy);
          ctx.lineTo(peakBase.cx, peakBase.cy);
          ctx.strokeStyle = '#9333EA';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#7E22CE';
          ctx.font = 'bold 11px Cairo, sans-serif';
          ctx.fillText(`H_max = ${maxReachHeight.toFixed(1)}m`, peakPos.cx + 5, peakPos.cy - 8);
        }
      }

      // 10. Draw Velocity Vectors with True Mathematical Labels
      if (showVectors && (t < totalFlightTime || t === 0)) {
        const vecScale = 1.3;

        // Vx Vector (Horizontal - Indigo)
        drawArrow(ctx, pos.cx, pos.cy, pos.cx + vx * vecScale, pos.cy, '#4F46E5', 2.5, 'Vx');

        // Vy Vector (Vertical - Teal)
        drawArrow(ctx, pos.cx, pos.cy, pos.cx, pos.cy - curVy * vecScale, '#0D9488', 2.5, 'Vy');

        // Resultant Velocity V Vector (Purple)
        drawArrow(
          ctx,
          pos.cx,
          pos.cy,
          pos.cx + vx * vecScale,
          pos.cy - curVy * vecScale,
          '#9333EA',
          3,
          'V'
        );
      }

      // 11. Draw Projectile Emoji with Realistic Rotation
      ctx.save();
      ctx.translate(pos.cx, pos.cy);

      const emoji = getEmojiForObject(selectedObject);
      const flightAngle = Math.atan2(-curVy, vx); // tangent angle of flight

      if (selectedObject === 'rocket') {
        // Rocket emoji points upright-right (~45 deg) by default, adjust by -45 deg
        ctx.rotate(flightAngle - Math.PI / 4);
      } else if (selectedObject === 'arrow') {
        ctx.rotate(flightAngle);
      } else if (selectedObject === 'ufo') {
        // UFO wobbles gently
        ctx.rotate(Math.sin(t * 8) * 0.15);
      } else if (selectedObject === 'ball' || selectedObject === 'football' || selectedObject === 'basketball' || selectedObject === 'coin') {
        // Rolling / spinning animation in flight!
        ctx.rotate(t * 12);
      }

      ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 0, 0);
      ctx.restore();
    },
    [
      getScale,
      h0,
      totalFlightTime,
      vx,
      vy0,
      gravity,
      totalHorizontalRange,
      maxReachHeight,
      showVectors,
      selectedObject,
    ]
  );

  // Resize canvas when wrapper changes
  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    const { clientWidth, clientHeight } = wrapperRef.current;
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;
    renderCanvasFrame(currentTimeRef.current);
  }, [renderCanvasFrame]);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // When physics inputs change, reset current trajectory
  useEffect(() => {
    currentTimeRef.current = 0;
    pathHistoryRef.current = [];
    particlesRef.current = [];
    impactRingsRef.current = [];
    setCurrentTime(0);
    setIsSimulating(false);
    setIsFinished(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    renderCanvasFrame(0);
  }, [computed, gravity, selectedObject, renderCanvasFrame]);

  // Start simulation loop
  const startSimulation = () => {
    if (isFinished || currentTimeRef.current >= totalFlightTime) {
      currentTimeRef.current = 0;
      pathHistoryRef.current = [];
      particlesRef.current = [];
      impactRingsRef.current = [];
      setCurrentTime(0);
      setIsFinished(false);
    }

    sounds.playLaunch(selectedObject);
    setIsSimulating(true);
    lastTimeRef.current = performance.now();

    const animStep = (timestamp: number) => {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const speedFactor = isSlowMotion ? 0.3 : 1.0;
      currentTimeRef.current += delta * speedFactor;

      if (currentTimeRef.current >= totalFlightTime) {
        currentTimeRef.current = totalFlightTime;
        setCurrentTime(totalFlightTime);
        setIsSimulating(false);
        setIsFinished(true);

        const curX = vx * totalFlightTime;
        let curY = h0 + vy0 * totalFlightTime - 0.5 * gravity * Math.pow(totalFlightTime, 2);
        if (curY < 0) curY = 0;
        pathHistoryRef.current.push({ x: curX, y: curY });

        // Add impact ring at landing point
        if (canvasRef.current) {
          const { scale, ox, oy } = getScale(canvasRef.current.width, canvasRef.current.height);
          impactRingsRef.current.push({
            x: ox + curX * scale,
            y: oy - curY * scale,
            r: 8,
            alpha: 1.0,
          });
        }

        sounds.playImpact();
        renderCanvasFrame(totalFlightTime);
        triggerConfetti();
        return;
      }

      setCurrentTime(currentTimeRef.current);

      const curX = vx * currentTimeRef.current;
      let curY = h0 + vy0 * currentTimeRef.current - 0.5 * gravity * Math.pow(currentTimeRef.current, 2);
      if (curY < 0) curY = 0;
      pathHistoryRef.current.push({ x: curX, y: curY });

      renderCanvasFrame(currentTimeRef.current);

      animFrameRef.current = requestAnimationFrame(animStep);
    };

    animFrameRef.current = requestAnimationFrame(animStep);
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  const togglePlay = () => {
    if (isSimulating) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  };

  const resetSimulation = () => {
    pauseSimulation();
    currentTimeRef.current = 0;
    pathHistoryRef.current = [];
    particlesRef.current = [];
    impactRingsRef.current = [];
    setCurrentTime(0);
    setIsFinished(false);
    renderCanvasFrame(0);
  };

  // Telemetry values
  const currentX = vx * currentTime;
  const currentY = Math.max(0, h0 + vy0 * currentTime - 0.5 * gravity * Math.pow(currentTime, 2));
  const currentVy = vy0 - gravity * currentTime;
  const currentV = Math.sqrt(vx * vx + currentVy * currentVy);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col relative overflow-hidden">
      {/* Canvas Top Bar Controls */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition active:scale-95 text-white ${
              isSimulating
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isSimulating ? (
              <>
                <i className="fa-solid fa-pause"></i> إيقاف مؤقت
              </>
            ) : isFinished ? (
              <>
                <i className="fa-solid fa-play"></i> إعادة إطلاق {getEmojiForObject(selectedObject)}
              </>
            ) : currentTime > 0 ? (
              <>
                <i className="fa-solid fa-play"></i> استئناف الحركة
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i> إطلاق المقذوف {getEmojiForObject(selectedObject)}
              </>
            )}
          </button>

          <button
            onClick={resetSimulation}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
            title="مسح المسار والبدء من نقطة الانطلاق"
          >
            <i className="fa-solid fa-rotate-right"></i> إعادة المسار
          </button>
        </div>

        {/* Feature Overlay Toggles */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex-wrap">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showVectors}
              onChange={(e) => {
                onToggleVectors(e.target.checked);
                renderCanvasFrame(currentTimeRef.current);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="font-bold">متجهات السرعة (Vx, Vy)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSlowMotion}
              onChange={(e) => onToggleSlowMotion(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>عرض بطيء (0.3x)</span>
          </label>
          <button
            type="button"
            onClick={() => onToggleSound(!soundEnabled)}
            className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="تبديل مؤثرات الصوت"
          >
            {soundEnabled ? '🔊 صوت مفعل' : '🔇 صامت'}
          </button>
        </div>
      </div>

      {/* Canvas Box */}
      <div
        ref={wrapperRef}
        className="relative w-full h-[390px] bg-gradient-to-b from-sky-100 via-slate-50 to-emerald-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner"
      >
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Realtime Telemetry HUD with Authentic Math Notation */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-md text-xs font-bold text-slate-700 flex flex-col gap-1.5 min-w-[165px]">
          <div className="flex justify-between items-center text-indigo-700 border-b border-slate-100 pb-1">
            <span>الزمن المنقضي (t):</span>
            <span className="font-mono">{currentTime.toFixed(2)} s</span>
          </div>
          <div className="flex justify-between items-center">
            <span>الارتفاع الحالي (y):</span>
            <span className="text-emerald-700 font-mono">{currentY.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between items-center">
            <span>المسافة الأفقية (x):</span>
            <span className="text-blue-700 font-mono">{currentX.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
            <span>السرعة اللحظية (V):</span>
            <span className="text-purple-700 font-mono">{currentV.toFixed(2)} m/s</span>
          </div>
        </div>

        {/* Active Projectile Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-1.5 pointer-events-none">
          <span className="text-lg leading-none">{getEmojiForObject(selectedObject)}</span>
          <span>المقذوف النشط</span>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-2 left-2 text-[10px] font-extrabold text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-md pointer-events-none shadow-2xs">
          محاكاة 60 FPS • المنهج الثانوي للفيزياء المتجهية
        </div>
      </div>
    </div>
  );
};
