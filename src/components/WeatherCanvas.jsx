import { useEffect, useRef } from "react";

// Generates random particles for use in rain/snow/stars
function makeParticles(count, factory) {
  return Array.from({ length: count }, factory);
}

export default function WeatherCanvas({ animation }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles = [];

    if (animation === "rain" || animation === "storm") {
      particles = makeParticles(animation === "storm" ? 200 : 120, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 8 + Math.random() * 8,
        length: 15 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.4,
      }));
    } else if (animation === "snow") {
      particles = makeParticles(80, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 1.5 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
        drift: (Math.random() - 0.5) * 0.5,
        opacity: 0.5 + Math.random() * 0.5,
      }));
    } else if (animation === "stars") {
      particles = makeParticles(120, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.7,
        radius: 0.5 + Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.03,
      }));
    }

    // Lightning state for storm
    let lightningTimer = 0;
    let lightningActive = false;
    let lightningOpacity = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animation === "rain") {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(147, 197, 253, ${p.opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > canvas.height) {
            p.y = -p.length;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      if (animation === "storm") {
        // Heavy rain
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(147, 197, 253, ${p.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 3, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > canvas.height) {
            p.y = -p.length;
            p.x = Math.random() * canvas.width;
          }
        });
        // Lightning flash
        lightningTimer++;
        if (lightningTimer > 120 + Math.random() * 180) {
          lightningActive = true;
          lightningOpacity = 0.7;
          lightningTimer = 0;
        }
        if (lightningActive) {
          ctx.fillStyle = `rgba(255, 255, 200, ${lightningOpacity})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          lightningOpacity -= 0.06;
          if (lightningOpacity <= 0) lightningActive = false;
        }
      }

      if (animation === "snow") {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
          ctx.fill();
          p.y += p.speed;
          p.x += p.drift;
          if (p.y > canvas.height) {
            p.y = -p.radius;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      if (animation === "stars") {
        particles.forEach((p) => {
          p.twinkle += p.speed;
          const opacity = 0.4 + Math.sin(p.twinkle) * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity})`;
          ctx.fill();
        });
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [animation]);

  if (!["rain", "snow", "stars", "storm"].includes(animation)) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: animation === "storm" ? "screen" : "normal" }}
    />
  );
}
