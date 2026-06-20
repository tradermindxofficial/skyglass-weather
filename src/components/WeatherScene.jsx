export default function WeatherScene({ animation }) {
  if (animation === "sunny") {
    return (
      <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none z-0 opacity-80">
        {/* Rays */}
        <div className="sun-rays absolute inset-0 flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-yellow-300/40 rounded-full"
              style={{
                width: "3px",
                height: "90px",
                transform: `rotate(${i * 30}deg) translateY(-50px)`,
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </div>
        {/* Core */}
        <div className="sun-core absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full bg-gradient-to-br from-yellow-200 to-amber-400"
            style={{
              width: "80px",
              height: "80px",
              boxShadow: "0 0 40px 20px rgba(251,191,36,0.4)",
            }}
          />
        </div>
      </div>
    );
  }

  if (animation === "clouds") {
    return (
      <div className="fixed top-0 left-0 w-full h-48 pointer-events-none z-0 overflow-hidden">
        <div className="cloud-drift-left absolute top-8 left-[-60px]">
          <Cloud size={180} opacity={0.5} />
        </div>
        <div className="cloud-drift-right absolute top-4 right-[-40px]">
          <Cloud size={140} opacity={0.4} />
        </div>
        <div className="cloud-drift-left absolute top-20 left-[30%]">
          <Cloud size={120} opacity={0.3} />
        </div>
      </div>
    );
  }

  if (animation === "fog") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="fog-layer-1 absolute w-[120%] h-24 left-[-10%] top-[20%]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(176,190,197,0.5), transparent)" }}
        />
        <div
          className="fog-layer-2 absolute w-[130%] h-20 left-[-15%] top-[40%]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(176,190,197,0.4), transparent)" }}
        />
        <div
          className="fog-layer-3 absolute w-[120%] h-28 left-[-10%] top-[60%]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(176,190,197,0.35), transparent)" }}
        />
      </div>
    );
  }

  if (animation === "stars") {
    return (
      <div className="fixed top-6 right-6 pointer-events-none z-0">
        {/* Crescent moon */}
        <div
          className="moon-glow rounded-full"
          style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle at 35% 35%, #e8eaf6, #9fa8da)",
            boxShadow: "inset -12px -4px 0 0 #0d1b4b",
          }}
        />
      </div>
    );
  }

  // storm: canvas handles rain + lightning, nothing extra needed here
  // snow: canvas handles flakes
  return null;
}

function Cloud({ size, opacity }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 120"
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="80" rx="90" ry="40" fill="white" />
      <ellipse cx="70"  cy="65" rx="50" ry="40" fill="white" />
      <ellipse cx="130" cy="60" rx="45" ry="38" fill="white" />
      <ellipse cx="100" cy="50" rx="40" ry="35" fill="white" />
    </svg>
  );
}
