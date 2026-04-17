"use client";

import { useEffect, useRef } from "react";

export default function PendulumAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let isRunning = true;

    const resizeCanvas = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);

      return { width, height };
    };

    let { width: W, height: H } = resizeCanvas();
    
    let OX = W / 2;
    let OY = H * 0.18;

    window.addEventListener("resize", () => {
      if (!isRunning) return;
      const dims = resizeCanvas();
      W = dims.width;
      H = dims.height;
      OX = W / 2;
      OY = H * 0.18;
    });

    const G = 9.81 * 60;
    const L = [130, 110, 90];
    const M = [2.2, 1.6, 1.0];

    // State: [th1, w1, th2, w2, th3, w3]
    let state = [
      Math.PI * 0.52, 0.3,
      Math.PI * 0.78, -0.2,
      Math.PI * 1.1, 0.1
    ];

    const MAX_TRAIL = 900;
    const trails: { x: number, y: number, a: number }[][] = [[], [], []];

    function solve3(A: number[][], b: number[]) {
      const a00=A[0][0],a01=A[0][1],a02=A[0][2];
      const a10=A[1][0],a11=A[1][1],a12=A[1][2];
      const a20=A[2][0],a21=A[2][1],a22=A[2][2];
      const b0=b[0],b1=b[1],b2=b[2];
      const det = a00*(a11*a22-a12*a21) - a01*(a10*a22-a12*a20) + a02*(a10*a21-a11*a20);
      if(Math.abs(det) < 1e-12) return [0,0,0];
      const x0 = (b0*(a11*a22-a12*a21) - a01*(b1*a22-a12*b2) + a02*(b1*a21-a11*b2)) / det;
      const x1 = (a00*(b1*a22-a12*b2) - b0*(a10*a22-a12*a20) + a02*(a10*b2-b1*a20)) / det;
      const x2 = (a00*(a11*b2-b1*a21) - a01*(a10*b2-b1*a20) + b0*(a10*a21-a11*a20)) / det;
      return [x0, x1, x2];
    }

    function derivatives(s: number[]) {
      const [t1, w1, t2, w2, t3, w3] = s;
      const m1 = M[0], m2 = M[1], m3 = M[2];
      const l1 = L[0], l2 = L[1], l3 = L[2];
      const g = G;

      const d12 = t1 - t2;
      const d13 = t1 - t3;
      const d23 = t2 - t3;

      const M11 = (m1 + m2 + m3) * l1 * l1;
      const M12 = (m2 + m3) * l1 * l2 * Math.cos(d12);
      const M13 = m3 * l1 * l3 * Math.cos(d13);
      const M22 = (m2 + m3) * l2 * l2;
      const M23 = m3 * l2 * l3 * Math.cos(d23);
      const M33 = m3 * l3 * l3;

      const R1 = -(m2 + m3) * l1 * l2 * w2 * w2 * Math.sin(d12)
                 - m3 * l1 * l3 * w3 * w3 * Math.sin(d13)
                 - (m1 + m2 + m3) * g * l1 * Math.sin(t1);

      const R2 = (m2 + m3) * l1 * l2 * w1 * w1 * Math.sin(d12)
                 - m3 * l2 * l3 * w3 * w3 * Math.sin(d23)
                 - (m2 + m3) * g * l2 * Math.sin(t2);

      const R3 = m3 * l1 * l3 * w1 * w1 * Math.sin(d13)
                 + m3 * l2 * l3 * w2 * w2 * Math.sin(d23)
                 - m3 * g * l3 * Math.sin(t3);

      const A = [[M11,M12,M13],[M12,M22,M23],[M13,M23,M33]];
      const [a1, a2, a3] = solve3(A, [R1, R2, R3]);

      return [w1, a1, w2, a2, w3, a3];
    }

    function rk4(s: number[], dt: number) {
      const k1 = derivatives(s);
      const s2 = s.map((v,i) => v + 0.5 * dt * k1[i]);
      const k2 = derivatives(s2);
      const s3 = s.map((v,i) => v + 0.5 * dt * k2[i]);
      const k3 = derivatives(s3);
      const s4 = s.map((v,i) => v + dt * k3[i]);
      const k4 = derivatives(s4);
      return s.map((v,i) => v + (dt/6)*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
    }

    function getPositions(s: number[]) {
      const [t1,,t2,,t3] = s;
      const x1 = OX + L[0] * Math.sin(t1);
      const y1 = OY + L[0] * Math.cos(t1);
      const x2 = x1 + L[1] * Math.sin(t2);
      const y2 = y1 + L[1] * Math.cos(t2);
      const x3 = x2 + L[2] * Math.sin(t3);
      const y3 = y2 + L[2] * Math.cos(t3);
      return [[x1,y1],[x2,y2],[x3,y3]];
    }

    function energyCheck(s: number[]) {
      const [t1,w1,t2,w2,t3,w3] = s;
      const KE = 0.5*M[0]*(L[0]*w1)**2
               + 0.5*M[1]*((L[0]*w1*Math.cos(t1)+L[1]*w2*Math.cos(t2))**2+(L[0]*w1*Math.sin(t1)+L[1]*w2*Math.sin(t2))**2)
               + 0.5*M[2]*((L[0]*w1*Math.cos(t1)+L[1]*w2*Math.cos(t2)+L[2]*w3*Math.cos(t3))**2+(L[0]*w1*Math.sin(t1)+L[1]*w2*Math.sin(t2)+L[2]*w3*Math.sin(t3))**2);
      return KE;
    }

    function resetState() {
      state = [
        Math.PI * (0.4 + Math.random() * 0.4), (Math.random()-0.5)*0.8,
        Math.PI * (0.6 + Math.random() * 0.6), (Math.random()-0.5)*0.6,
        Math.PI * (0.9 + Math.random() * 0.5), (Math.random()-0.5)*0.4
      ];
      trails[0].length = 0;
      trails[1].length = 0;
      trails[2].length = 0;
    }

    const TRAIL_COLORS = [
      { r: 160, g: 160, b: 180 },
      { r: 200, g: 200, b: 210 },
      { r: 80,  g: 200, b: 255 },
    ];

    let lastTime: number | null = null;
    let frameCount = 0;

    function drawBackground() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
    }

    function drawTrail(trail: {x:number, y:number, a:number}[], col: {r:number, g:number, b:number}) {
       if (!ctx) return;
       if (trail.length < 2) return;
       for (let i = 1; i < trail.length; i++) {
         const t = trail[i];
         const tp = trail[i-1];
         const progress = i / trail.length;
         const alpha = progress * progress * t.a * 0.85;
         ctx.beginPath();
         ctx.moveTo(tp.x, tp.y);
         ctx.lineTo(t.x, t.y);
         ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${alpha})`;
         ctx.lineWidth = progress * 1.6 + 0.2;
         ctx.lineCap = 'round';
         ctx.stroke();
       }
     }
     
     function drawRod(x1:number, y1:number, x2:number, y2:number, bright:number) {
       if (!ctx) return;
       ctx.beginPath();
       ctx.moveTo(x1, y1);
       ctx.lineTo(x2, y2);
       const grad = ctx.createLinearGradient(x1, y1, x2, y2);
       grad.addColorStop(0, `rgba(180,180,200,${bright * 0.5})`);
       grad.addColorStop(1, `rgba(220,220,240,${bright * 0.9})`);
       ctx.strokeStyle = grad;
       ctx.lineWidth = 1.5;
       ctx.lineCap = 'round';
       ctx.stroke();
     }
     
     function drawMass(x:number, y:number, r:number) {
       if (!ctx) return;
       const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
       glow.addColorStop(0, `rgba(180,200,255,0.12)`);
       glow.addColorStop(1, `rgba(0,0,0,0)`);
       ctx.beginPath();
       ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
       ctx.fillStyle = glow;
       ctx.fill();
     
       const sg = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.05, x, y, r);
       sg.addColorStop(0, '#ffffff');
       sg.addColorStop(0.25, '#d0d8e8');
       sg.addColorStop(0.7, '#505868');
       sg.addColorStop(1, '#1a1c22');
       ctx.beginPath();
       ctx.arc(x, y, r, 0, Math.PI * 2);
       ctx.fillStyle = sg;
       ctx.fill();
     
       ctx.beginPath();
       ctx.arc(x - r*0.28, y - r*0.28, r*0.28, 0, Math.PI * 2);
       ctx.fillStyle = 'rgba(255,255,255,0.55)';
       ctx.fill();
     }
     
     function drawPivot() {
       if (!ctx) return;
       const pg = ctx.createRadialGradient(OX - 2, OY - 2, 1, OX, OY, 8);
       pg.addColorStop(0, '#ffffff');
       pg.addColorStop(0.4, '#aaaabc');
       pg.addColorStop(1, '#222228');
       ctx.beginPath();
       ctx.arc(OX, OY, 7, 0, Math.PI * 2);
       ctx.fillStyle = pg;
       ctx.fill();
     
       ctx.beginPath();
       ctx.moveTo(OX - 18, OY - 4);
       ctx.lineTo(OX + 18, OY - 4);
       ctx.strokeStyle = 'rgba(160,160,180,0.3)';
       ctx.lineWidth = 2;
       ctx.stroke();
     }

    function frame(ts: number) {
      if (!isRunning) return;
      animFrame = requestAnimationFrame(frame);
      if (!lastTime) { lastTime = ts; return; }
      const dt = Math.min((ts - lastTime) / 1000, 0.025);
      lastTime = ts;
      frameCount++;

      const STEPS = 8;
      const subDt = dt / STEPS;
      for (let i = 0; i < STEPS; i++) {
        state = rk4(state, subDt);
      }

      for (let i = 0; i < 3; i++) state[i*2] = ((state[i*2] + Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI) - Math.PI;

      const ke = energyCheck(state);
      if (ke < 800 && frameCount > 120) {
        resetState();
        frameCount = 0;
        return;
      }

      const [[x1,y1],[x2,y2],[x3,y3]] = getPositions(state);

      const pts = [[x1,y1],[x2,y2],[x3,y3]];
      for (let i = 0; i < 3; i++) {
        trails[i].push({ x: pts[i][0], y: pts[i][1], a: 1.0 });
        if (trails[i].length > MAX_TRAIL) trails[i].shift();
        for (let j = 0; j < trails[i].length; j++) {
          trails[i][j].a *= 0.9985;
        }
      }

      drawBackground();
      for (let i = 0; i < 3; i++) drawTrail(trails[i], TRAIL_COLORS[i]);
      drawRod(OX, OY, x1, y1, 0.8);
      drawRod(x1, y1, x2, y2, 0.85);
      drawRod(x2, y2, x3, y3, 0.9);
      drawMass(x1, y1, 13);
      drawMass(x2, y2, 10);
      drawMass(x3, y3, 7.5);
      drawPivot();
    }

    animFrame = requestAnimationFrame(frame);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pendulum-bg"
    />
  );
}
