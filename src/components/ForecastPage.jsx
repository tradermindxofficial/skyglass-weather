export default function ForecastPage({ days, hours, cityName, theme, current, windUnit }) {
  // Common glassmorphic card styles
  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="w-full flex flex-col gap-4 fade-in pb-4">
      {/* 1. Header */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        <h2 
          className="font-body-lg font-bold tracking-tight text-center" 
          style={{ color: theme.textPrimary, fontSize: "clamp(22px, 6vw, 28px)" }}
        >
          {cityName}
        </h2>
        <span 
          className="font-label-sm text-sm uppercase tracking-widest mt-1 opacity-80" 
          style={{ color: theme.textPrimary }}
        >
          Forecast
        </span>
      </div>

      {/* 2. Hourly forecast card */}
      <div className="rounded-3xl overflow-hidden p-4" style={cardStyle}>
        <div className="flex items-center gap-1 mb-3 opacity-80">
          <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>schedule</span>
          <h3 className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            Hourly Forecast
          </h3>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-2 px-2">
          {hours?.map((hour, i) => {
            const isCurrent = i === 0;
            return (
              <div 
                key={hour.time}
                className="flex flex-col items-center justify-between py-2 px-3 rounded-full flex-shrink-0 min-w-[64px]"
                style={{
                  background: isCurrent ? theme.accentColor : "transparent",
                }}
              >
                <span className="font-body-md text-sm font-semibold" style={{ color: isCurrent ? "#fff" : theme.textPrimary }}>
                  {isCurrent ? "Now" : hour.time}
                </span>
                <span className="material-symbols-outlined text-2xl my-2" style={{ color: isCurrent ? "#fff" : theme.accentColor }}>
                  {hour.icon}
                </span>
                <span className="font-body-md text-lg font-bold" style={{ color: isCurrent ? "#fff" : theme.textPrimary }}>
                  {hour.temp}°
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 7-Day forecast card */}
      <div className="rounded-3xl overflow-hidden p-4" style={cardStyle}>
        <div className="flex items-center gap-1 mb-2 opacity-80">
          <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>calendar_month</span>
          <h3 className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            7-Day Forecast
          </h3>
        </div>
        
        <div className="flex flex-col">
          {days?.map((day, i) => {
            const isLast = i === days.length - 1;
            return (
              <div 
                key={day.label}
                className="flex items-center justify-between py-3"
                style={{ 
                  borderBottom: isLast ? "none" : `1px solid ${theme.textPrimary}1A` 
                }}
              >
                <span className="w-20 font-body-md font-semibold text-lg" style={{ color: theme.textPrimary }}>
                  {day.label}
                </span>
                
                <span className="material-symbols-outlined text-3xl shrink-0" style={{ color: theme.accentColor }}>
                  {day.icon}
                </span>

                <span className="flex-1 text-center font-body-md font-medium px-2 text-sm truncate" style={{ color: theme.textSecondary }}>
                  {day.condition}
                </span>
                
                <div className="w-20 flex items-center justify-end gap-2 shrink-0">
                  <span className="font-body-md font-semibold opacity-60 text-lg" style={{ color: theme.textSecondary }}>{day.low}°</span>
                  <span className="font-body-md font-bold text-lg" style={{ color: theme.textPrimary }}>{day.high}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Extra stats row (2x2 grid) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Humidity */}
        <div className="rounded-3xl p-4 flex flex-col justify-between h-36" style={cardStyle}>
          <div className="flex items-center gap-1 opacity-80">
            <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>water_drop</span>
            <span className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>Humidity</span>
          </div>
          <div className="text-4xl font-body-lg font-bold" style={{ color: theme.textPrimary }}>
            {current?.humidity}%
          </div>
          <div className="text-sm font-body-md" style={{ color: theme.textPrimary }}>
            The dew point is {current?.temp - 3}° right now.
          </div>
        </div>

        {/* Wind Speed */}
        <div className="rounded-3xl p-4 flex flex-col justify-between h-36" style={cardStyle}>
          <div className="flex items-center gap-1 opacity-80">
            <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>air</span>
            <span className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>Wind</span>
          </div>
          <div className="text-4xl font-body-lg font-bold" style={{ color: theme.textPrimary }}>
            {current?.wind} <span className="text-lg opacity-70">{windUnit.toUpperCase()}</span>
          </div>
          <div className="text-sm font-body-md" style={{ color: theme.textPrimary }}>
            Current wind speed.
          </div>
        </div>

        {/* Feels Like */}
        <div className="rounded-3xl p-4 flex flex-col justify-between h-36" style={cardStyle}>
          <div className="flex items-center gap-1 opacity-80">
            <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>thermostat</span>
            <span className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>Feels Like</span>
          </div>
          <div className="text-4xl font-body-lg font-bold" style={{ color: theme.textPrimary }}>
            {current?.temp}°
          </div>
          <div className="text-sm font-body-md" style={{ color: theme.textPrimary }}>
            Similar to the actual temperature.
          </div>
        </div>

        {/* Visibility */}
        <div className="rounded-3xl p-4 flex flex-col justify-between h-36" style={cardStyle}>
          <div className="flex items-center gap-1 opacity-80">
            <span className="material-symbols-outlined text-[16px]" style={{ color: theme.textSecondary }}>visibility</span>
            <span className="font-label-sm text-xs uppercase tracking-widest" style={{ color: theme.textSecondary }}>Visibility</span>
          </div>
          <div className="text-4xl font-body-lg font-bold" style={{ color: theme.textPrimary }}>
            16 <span className="text-lg opacity-70">km</span>
          </div>
          <div className="text-sm font-body-md" style={{ color: theme.textPrimary }}>
            Good
          </div>
        </div>
      </div>
    </div>
  );
}
