import { useTheme } from "../ThemeContext";

export default function TopAppBar({ theme, cityName }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 w-full max-w-md mx-auto z-50 flex items-center justify-between h-14 px-4 gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-colors"
    >
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Animated weather icon */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 animate-[spin_10s_linear_infinite]"
          style={{
            background: `linear-gradient(135deg, ${theme.cardBg}, rgba(255,255,255,0.1))`,
            border: `1px solid ${theme.cardBorder}`
          }}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ color: theme.accentColor }}>
            wb_sunny
          </span>
        </div>
        
        {/* App Title */}
        <div className="flex items-baseline gap-1">
          <h1 
            className="text-base font-semibold tracking-tight"
            style={{
              color: theme.textPrimary,
              textShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            SkyGlass
          </h1>
          <span 
            className="text-base font-light tracking-tight" 
            style={{ 
              color: theme.textSecondary,
              textShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            Weather
          </span>
        </div>
      </div>

      <div className="flex-1 flex justify-center min-w-0 px-2">
        {cityName && (
          <div 
            className="rounded-full px-2 py-0.5 flex items-center gap-1 max-w-[120px] min-w-0"
            style={{
              background: theme.cardBg,
              backdropFilter: "blur(8px)",
              border: `1px solid ${theme.cardBorder}`
            }}
          >
            <span className="material-symbols-outlined text-[12px] flex-shrink-0" style={{ color: theme.accentColor }}>
              location_on
            </span>
            <span className="text-xs font-medium truncate overflow-hidden" style={{ color: theme.textSecondary }}>
              {cityName}
            </span>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <button 
          onClick={toggleTheme} 
          aria-label="Toggle dark mode" 
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ 
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: isDark ? `0 0 12px ${theme.accentColor}44` : "none"
          }}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ color: theme.accentColor }}>
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>
    </header>
  );
}
