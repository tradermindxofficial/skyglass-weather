import { useEffect, useState, useRef } from "react";
import TopAppBar from "./components/TopAppBar";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import MapPreviewCard from "./components/MapPreviewCard";
import BottomNavBar from "./components/BottomNavBar";
import WeatherCanvas from "./components/WeatherCanvas";
import WeatherScene from "./components/WeatherScene";
import ForecastPage from "./components/ForecastPage";
import MapPage from "./components/MapPage";
import SettingsPage from "./components/SettingsPage";
import { useTheme } from "./ThemeContext";
import { WEATHER_THEMES, getThemeKey } from "./themes/weatherThemes";
import {
  geocodeCity,
  fetchWeather,
  getCurrentPosition,
  reverseGeocode,
} from "./utils/api";
import { getWeatherInfo, formatHour, formatDay } from "./utils/weather";

const DEFAULT_CITY = "San Francisco";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState(DEFAULT_CITY);
  const [current, setCurrent] = useState(null);
  const [hours, setHours] = useState([]);
  const [days, setDays] = useState([]);
  const [weatherCode, setWeatherCode] = useState(0);
  const [isDay, setIsDay] = useState(1);
  const [activePage, setActivePage] = useState("today");
  const [coords, setCoords] = useState(null);

  const [tempUnit, setTempUnit] = useState('F');
  const [windUnit, setWindUnit] = useState('mph');
  const [timeFormat, setTimeFormat] = useState('12h');
  const lastWeatherRef = useRef(null);
  const lastPlaceRef = useRef(null);

  function toTemp(f) {
    return tempUnit === 'C' ? Math.round((f - 32) * 5/9) : Math.round(f);
  }
  
  function toWind(mph) {
    return windUnit === 'kmh' ? Math.round(mph * 1.60934) : Math.round(mph);
  }

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  const [splashOpacity, setSplashOpacity] = useState(1);

  // PWA install banner state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartRef = useRef(0);
  const isPullingRef = useRef(false);

  // Transition state
  const [transitionPage, setTransitionPage] = useState("today");
  const [pageOpacity, setPageOpacity] = useState(1);

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem("skyglass_animations");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("skyglass_animations", JSON.stringify(animationsEnabled));
  }, [animationsEnabled]);

  // Derive active theme from live weather code
  const themeKey = getThemeKey(weatherCode, !isDark);
  const theme = WEATHER_THEMES[themeKey];

  // Handle Splash Screen fade out
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashOpacity(0);
    }, 1700);
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Handle page transitions
  useEffect(() => {
    if (activePage !== transitionPage) {
      setPageOpacity(0);
      const timer = setTimeout(() => {
        setTransitionPage(activePage);
        setPageOpacity(1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activePage, transitionPage]);

  function applyWeather(placeName, weather) {
    lastWeatherRef.current = weather;
    lastPlaceRef.current = placeName;
    const code = weather.current.weather_code;
    const day = weather.current.is_day;
    setWeatherCode(code);
    setIsDay(day);

    const currentInfo = getWeatherInfo(code, day);
    setCityName(placeName);
    setCurrent({
      cityName: placeName,
      condition: currentInfo.label,
      icon: currentInfo.icon,
      temp: toTemp(weather.current.temperature_2m),
      wind: toWind(weather.current.wind_speed_10m),
      humidity: Math.round(weather.current.relative_humidity_2m),
      uvIndex: Math.round(weather.current.uv_index || 0),
    });

    const nowIndex = weather.hourly.time.findIndex(
      (t) => new Date(t) >= new Date()
    );
    const startIndex = nowIndex === -1 ? 0 : nowIndex;
    setHours(
      weather.hourly.time.slice(startIndex, startIndex + 24).map((time, i) => {
        const idx = startIndex + i;
        const info = getWeatherInfo(
          weather.hourly.weather_code[idx],
          weather.hourly.is_day[idx]
        );
        return {
          time: formatHour(time, timeFormat),
          icon: info.icon,
          temp: toTemp(weather.hourly.temperature_2m[idx]),
        };
      })
    );
    setDays(
      weather.daily.time.slice(0, 7).map((time, i) => {
        const info = getWeatherInfo(weather.daily.weather_code[i], 1);
        return {
          label: formatDay(time, i),
          icon: info.icon,
          condition: info.label,
          high: toTemp(weather.daily.temperature_2m_max[i]),
          low: toTemp(weather.daily.temperature_2m_min[i]),
        };
      })
    );
  }

  useEffect(() => {
    if (lastWeatherRef.current && lastPlaceRef.current) {
      applyWeather(lastPlaceRef.current, lastWeatherRef.current);
    }
  }, [tempUnit, windUnit, timeFormat]);

  async function loadCity(city) {
    setLoading(true);
    setError(null);
    try {
      const place = await geocodeCity(city);
      setCoords({ lat: place.latitude, lon: place.longitude });
      const weather = await fetchWeather(place.latitude, place.longitude);
      applyWeather(place.name, weather);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function refreshCity() {
    setRefreshing(true);
    setError(null);
    try {
      if (coords) {
        const weather = await fetchWeather(coords.lat, coords.lon);
        applyWeather(cityName, weather);
      } else {
        await loadCity(cityName);
      }
    } catch (err) {
      setError(err.message || "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleUseLocation() {
    setLocating(true);
    setError(null);
    try {
      const position = await getCurrentPosition();
      setCoords({ lat: position.latitude, lon: position.longitude });
      const [weather, place] = await Promise.all([
        fetchWeather(position.latitude, position.longitude),
        reverseGeocode(position.latitude, position.longitude),
      ]);
      applyWeather(place.name, weather);
    } catch (err) {
      setError(err.message || "Couldn't get your location");
    } finally {
      setLocating(false);
    }
  }

  // Pull to refresh event handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0 && activePage === "today" && !loading && !refreshing) {
      touchStartRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPullingRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartRef.current;
    if (diff > 0) {
      const pull = Math.min(diff * 0.4, 80);
      setPullDistance(pull);
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    if (pullDistance > 45) {
      refreshCity();
    }
    setPullDistance(0);
  };

  // Apply body background color from active theme
  useEffect(() => {
    document.documentElement.style.background = theme.gradient;
    document.body.style.background = "transparent";
  }, [theme]);

  useEffect(() => {
    loadCity(DEFAULT_CITY);
  }, []);

  return (
    <div
      className="weather-bg min-h-screen relative overflow-x-hidden"
      style={{ background: theme.gradient, minHeight: "100dvh" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 2-second Splash Screen */}
      {showSplash && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-300"
          style={{
            background: theme.gradient,
            opacity: splashOpacity,
          }}
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <span className="material-symbols-outlined text-8xl animate-[spin_10s_linear_infinite]" style={{ color: theme.accentColor }}>
              wb_sunny
            </span>
            <h1 className="font-headline-lg text-4xl font-bold tracking-wider" style={{ color: theme.textPrimary }}>
              SkyGlass Weather
            </h1>
          </div>
        </div>
      )}

      {/* Fullscreen canvas particles (rain/snow/stars/storm) */}
      {animationsEnabled && <WeatherCanvas animation={theme.animation} />}

      {/* CSS decorations (sun/clouds/fog/moon) */}
      {animationsEnabled && <WeatherScene animation={theme.animation} />}

      {/* All UI sits above the weather layer */}
      <div className="relative z-10">
        <TopAppBar
          theme={theme}
          cityName={cityName}
        />

        {/* Custom Android PWA Install Banner */}
        {showInstallBanner && (
          <div className="max-w-md mx-auto px-5 pt-3">
            <div
              className="flex items-center justify-between p-3 rounded-2xl border"
              style={{
                background: theme.cardBg,
                borderColor: theme.cardBorder,
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="font-body-md text-sm font-semibold" style={{ color: theme.textPrimary }}>
                Add SkyGlass to your home screen
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-transform"
                  style={{
                    background: theme.accentColor,
                    color: "#fff",
                  }}
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="p-1 text-lg active:scale-95 transition-transform flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ color: theme.textSecondary }}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pull to refresh spinner indicator */}
        {(pullDistance > 0 || refreshing) && (
          <div
            className="flex justify-center items-center overflow-hidden transition-all duration-200"
            style={{ height: refreshing ? "50px" : `${pullDistance}px` }}
          >
            <span
              className={`material-symbols-outlined text-2xl ${refreshing ? "animate-spin" : ""}`}
              style={{
                color: theme.accentColor,
                transform: `rotate(${pullDistance * 5}deg)`,
              }}
            >
              autorenew
            </span>
          </div>
        )}

        <main 
          className={`mx-auto pb-28 ${transitionPage === "map" ? "w-full h-[calc(100vh-64px)]" : "max-w-md px-5 space-y-8 mt-4"}`}
          style={{
            opacity: pageOpacity,
            transition: "opacity 200ms ease-in-out",
          }}
        >
          {transitionPage === "today" && (
            <>
              <SearchBar onSearch={loadCity} theme={theme} />

              {loading && (
                <div
                  className="text-center py-12 font-body-md text-body-md"
                  style={{ color: theme.textSecondary }}
                >
                  Loading weather for {cityName}...
                </div>
              )}

              {!loading && error && (
                <div className="text-center py-12 font-body-md text-body-md text-red-400">
                  {error}. Try searching for another city.
                </div>
              )}

              {!loading && !error && current && (
                <>
                  <CurrentWeatherCard
                    data={current}
                    onUseLocation={handleUseLocation}
                    locating={locating}
                    theme={theme}
                    tempUnit={tempUnit}
                    windUnit={windUnit}
                  />
                  <HourlyForecast hours={hours.slice(0, 6)} theme={theme} />
                  <DailyForecast days={days} theme={theme} />
                  <MapPreviewCard theme={theme} />
                </>
              )}
            </>
          )}

          {transitionPage === "forecast" && !loading && !error && (
            <ForecastPage
              days={days}
              hours={hours}
              cityName={cityName}
              theme={theme}
              current={current}
              windUnit={windUnit}
            />
          )}

          {transitionPage === "map" && !loading && !error && coords && (
            <MapPage
              lat={coords.lat}
              lon={coords.lon}
              cityName={cityName}
              current={current}
              theme={theme}
            />
          )}

          {transitionPage === "settings" && (
            <SettingsPage
              tempUnit={tempUnit} setTempUnit={setTempUnit}
              windUnit={windUnit} setWindUnit={setWindUnit}
              timeFormat={timeFormat} setTimeFormat={setTimeFormat}
              theme={theme}
              isDark={isDark}
              toggleTheme={toggleTheme}
              animationsEnabled={animationsEnabled}
              setAnimationsEnabled={setAnimationsEnabled}
            />
          )}
        </main>
      </div>

      <BottomNavBar activePage={activePage} setActivePage={setActivePage} theme={theme} />
    </div>
  );
}
