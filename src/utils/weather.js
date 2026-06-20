// Maps Open-Meteo's numeric weather codes to a Material Symbols icon name + label.
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
export function getWeatherInfo(code, isDay = 1) {
  const map = {
    0: { icon: isDay ? "wb_sunny" : "nights_stay", label: "Clear Sky" },
    1: { icon: isDay ? "wb_sunny" : "nights_stay", label: "Mostly Clear" },
    2: { icon: "partly_cloudy_day", label: "Partly Cloudy" },
    3: { icon: "cloud", label: "Overcast" },
    45: { icon: "foggy", label: "Foggy" },
    48: { icon: "foggy", label: "Foggy" },
    51: { icon: "rainy", label: "Light Drizzle" },
    53: { icon: "rainy", label: "Drizzle" },
    55: { icon: "rainy", label: "Heavy Drizzle" },
    61: { icon: "rainy", label: "Light Rain" },
    63: { icon: "rainy", label: "Rain" },
    65: { icon: "rainy", label: "Heavy Rain" },
    71: { icon: "weather_snowy", label: "Light Snow" },
    73: { icon: "weather_snowy", label: "Snow" },
    75: { icon: "weather_snowy", label: "Heavy Snow" },
    80: { icon: "rainy", label: "Rain Showers" },
    81: { icon: "rainy", label: "Rain Showers" },
    82: { icon: "rainy", label: "Violent Showers" },
    95: { icon: "thunderstorm", label: "Thunderstorm" },
    96: { icon: "thunderstorm", label: "Thunderstorm" },
    99: { icon: "thunderstorm", label: "Thunderstorm" },
  };
  return map[code] || { icon: "cloud", label: "Unknown" };
}

export function formatHour(isoString, format = '12h') {
  const date = new Date(isoString);
  if (format === '24h') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return date.toLocaleTimeString("en-US", { hour: "numeric" }).replace(" ", "");
}

export function formatDay(isoString, index) {
  if (index === 0) return "Today";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}
