// Exact colors extracted from each Stitch-designed zip file

export const WEATHER_THEMES = {
  sunny: {
    // From stitch_golden_day_weather_app.zip
    label: "Sunny",
    gradient: "linear-gradient(180deg, #FFF176 0%, #FFB300 100%)",
    bodyBg: "#fff8f6",
    cardBg: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(255, 193, 7, 0.2)",
    textPrimary: "#2c160e",
    textSecondary: "#7a4a1e",
    accentColor: "#FFB300",
    animation: "sunny",
  },
  rainy: {
    // From stitch_minimalist_weather_dashboard__1_.zip
    label: "Rainy",
    gradient: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    bodyBg: "#0f172a",
    cardBg: "rgba(255, 255, 255, 0.1)",
    cardBorder: "rgba(255, 255, 255, 0.15)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.6)",
    accentColor: "#60a5fa",
    animation: "rain",
  },
  stormy: {
    // From stitch_minimalist_weather_dashboard__2_.zip
    label: "Thunderstorm",
    gradient: "radial-gradient(circle at top right, #1a0b2e 0%, #050505 100%)",
    bodyBg: "#050505",
    cardBg: "rgba(255, 255, 255, 0.05)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.5)",
    accentColor: "#a855f7",
    animation: "storm",
  },
  snowy: {
    // From stitch_minimalist_weather_dashboard__3_.zip
    label: "Snowy",
    gradient: "linear-gradient(180deg, #E0F2FE 0%, #F8FAFC 100%)",
    bodyBg: "#E0F2FE",
    cardBg: "rgba(255, 255, 255, 0.4)",
    cardBorder: "rgba(255, 255, 255, 0.5)",
    textPrimary: "#0b1c30",
    textSecondary: "#475569",
    accentColor: "#0ea5e9",
    animation: "snow",
  },
  cloudy: {
    // From stitch_minimalist_weather_dashboard__4_.zip
    label: "Cloudy",
    gradient: "linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)",
    bodyBg: "#E2E8F0",
    cardBg: "rgba(255, 255, 255, 0.4)",
    cardBorder: "rgba(255, 255, 255, 0.3)",
    textPrimary: "#334155",
    textSecondary: "#64748b",
    accentColor: "#475569",
    animation: "clouds",
  },
  foggy: {
    // From stitch_minimalist_weather_dashboard__5_.zip
    label: "Foggy",
    gradient: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)",
    bodyBg: "#F8FAFC",
    cardBg: "rgba(255, 255, 255, 0.4)",
    cardBorder: "rgba(255, 255, 255, 0.2)",
    textPrimary: "#414755",
    textSecondary: "#64748b",
    accentColor: "#94a3b8",
    animation: "fog",
  },
  night: {
    // From stitch_minimalist_weather_dashboard__6_.zip
    label: "Clear Night",
    gradient: "radial-gradient(circle at top right, #1a2a44 0%, #050a12 100%)",
    bodyBg: "#050a12",
    cardBg: "rgba(255, 255, 255, 0.03)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    textPrimary: "#ffffff",
    textSecondary: "#CBD5E1",
    accentColor: "#7986cb",
    animation: "stars",
  },
};

// Maps Open-Meteo weather codes → theme key
export function getThemeKey(weatherCode, isDay) {
  if (weatherCode === 0 || weatherCode === 1) return isDay ? "sunny" : "night";
  if (weatherCode === 2 || weatherCode === 3) return "cloudy";
  if (weatherCode >= 45 && weatherCode <= 48) return "foggy";
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy";
  if (weatherCode >= 71 && weatherCode <= 77) return "snowy";
  if (weatherCode >= 80 && weatherCode <= 82) return "rainy";
  if (weatherCode >= 95 && weatherCode <= 99) return "stormy";
  return isDay ? "sunny" : "night";
}
