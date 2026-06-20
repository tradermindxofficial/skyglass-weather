export default function CurrentWeatherCard({ data, onUseLocation, locating, theme, tempUnit, windUnit }) {
  if (!data) return null;
  const { cityName, condition, icon, temp, wind, humidity } = data;

  return (
    <div
      className="relative overflow-hidden rounded-[32px] p-8"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-headline-lg-mobile" style={{ color: theme.textPrimary, fontSize: "clamp(22px, 6vw, 28px)" }}>
              {cityName}
            </h2>
            <button
              onClick={onUseLocation}
              disabled={locating}
              className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all"
              style={{ background: `${theme.accentColor}22`, border: `1px solid ${theme.accentColor}44` }}
            >
              <span
                className={`material-symbols-outlined text-sm ${locating ? "animate-pulse" : ""}`}
                style={{ color: theme.accentColor }}
              >
                {locating ? "sync" : "location_on"}
              </span>
            </button>
          </div>
          <p className="font-body-md text-body-md" style={{ color: theme.textSecondary }}>{condition}</p>
        </div>
        <span className="material-symbols-outlined filled text-6xl" style={{ color: theme.accentColor }}>
          {icon}
        </span>
      </div>

      <div className="mt-8 flex items-baseline">
        <span className="font-display-temp" style={{ color: theme.textPrimary, fontSize: "clamp(64px, 18vw, 84px)", lineHeight: "1" }}>{temp}</span>
        <span className="text-4xl font-light -mt-8" style={{ color: theme.accentColor }}>°{tempUnit}</span>
      </div>

      <div className="mt-6 flex gap-4 font-label-sm text-label-sm uppercase tracking-wider" style={{ color: theme.textSecondary }}>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm" style={{ color: theme.accentColor }}>air</span>
          <span>{wind} {windUnit.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm" style={{ color: theme.accentColor }}>humidity_percentage</span>
          <span>{humidity}%</span>
        </div>
      </div>

      {/* Decorative glow orb */}
      <div
        className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-30"
        style={{ background: theme.accentColor }}
      />
    </div>
  );
}
