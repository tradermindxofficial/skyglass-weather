export default function DailyForecast({ days, theme }) {
  if (!days || days.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-label-sm text-label-sm uppercase tracking-widest" style={{ color: theme.textSecondary }}>
          7-Day Forecast
        </h3>
      </div>
      <div
        className="rounded-[24px] divide-y overflow-hidden"
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          backdropFilter: "blur(12px)",
          divideColor: theme.cardBorder,
        }}
      >
        {days.map((day) => (
          <div
            key={day.label}
            className="flex items-center justify-between p-4 px-6"
            style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
          >
            <span className="w-24 font-body-md text-body-md" style={{ color: theme.textPrimary }}>{day.label}</span>
            <span className="material-symbols-outlined" style={{ color: theme.accentColor }}>{day.icon}</span>
            <div className="w-24 flex justify-end gap-3">
              <span className="font-body-md text-body-md font-bold" style={{ color: theme.textPrimary }}>{day.high}°</span>
              <span className="font-body-md text-body-md opacity-50" style={{ color: theme.textSecondary }}>{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
