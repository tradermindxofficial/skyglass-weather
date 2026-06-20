export default function HourlyForecast({ hours, theme }) {
  if (!hours || hours.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-label-sm text-label-sm uppercase tracking-widest" style={{ color: theme.textSecondary }}>
          Hourly Forecast
        </h3>
        <button className="font-label-sm text-label-sm" style={{ color: theme.accentColor }}>Full Report</button>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-5 px-5">
        {hours.map((hour, i) => {
          const isActive = i === 0;
          return (
            <div
              key={hour.time}
              className="flex-shrink-0 w-20 rounded-2xl py-4 flex flex-col items-center gap-2"
              style={{
                background: isActive ? theme.accentColor : theme.cardBg,
                border: `1px solid ${isActive ? "transparent" : theme.cardBorder}`,
                backdropFilter: "blur(12px)",
                boxShadow: isActive ? `0 4px 16px ${theme.accentColor}55` : "none",
              }}
            >
              <span className="font-label-sm text-label-sm" style={{ color: isActive ? "#fff" : theme.textSecondary }}>
                {hour.time}
              </span>
              <span className="material-symbols-outlined" style={{ color: isActive ? "#fff" : theme.accentColor }}>
                {hour.icon}
              </span>
              <span className="font-body-md text-body-md font-semibold" style={{ color: isActive ? "#fff" : theme.textPrimary }}>
                {hour.temp}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
