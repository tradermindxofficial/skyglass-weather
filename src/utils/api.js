// Open-Meteo is completely free and requires no API key.
// Docs: https://open-meteo.com/en/docs

export async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cityName
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to find that city");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }
  const place = data.results[0];
  return {
    name: place.name,
    region: place.admin1 || place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

export async function fetchWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day,uv_index` +
    `&hourly=temperature_2m,weather_code,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  return res.json();
}

// Wraps the browser Geolocation API in a Promise.
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => reject(new Error("Unable to retrieve your location")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Reverse geocodes coordinates into a readable city name using Open-Meteo's
// geocoding API (which supports reverse lookup via the same endpoint family).
export async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "SkyGlassWeatherApp/1.0" },
  });
  if (!res.ok) throw new Error("Failed to determine your city");
  const data = await res.json();
  const name =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    "Your Location";
  return { name };
}
