import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapPage({ lat, lon, cityName, current, theme }) {
  const [layer, setLayer] = useState("rain");

  // Helper component to center map when lat/lon changes
  function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
  }

  const getUvInfo = (uv) => {
    if (uv <= 2) return { label: 'Low', color: '#4ade80' };
    if (uv <= 5) return { label: 'Moderate', color: '#facc15' };
    if (uv <= 7) return { label: 'High', color: '#fb923c' };
    if (uv <= 10) return { label: 'Very High', color: '#f87171' };
    return { label: 'Extreme', color: '#c084fc' };
  };
  const uvInfo = getUvInfo(current?.uvIndex || 0);

  // Overlay URLs
  const overlays = {
    rain: "https://tilecache.rainviewer.com/v2/coverage/0/256/{z}/{x}/{y}/2/1_1.png",
    wind: "https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png",
    uv: "https://tilecache.rainviewer.com/v2/coverage/0/256/{z}/{x}/{y}/2/1_1.png"
  };

  return (
    <div className="w-full flex flex-col fade-in relative" style={{ height: "calc(100vh - 140px)" }}>
      <style>{".uv-overlay-filter { filter: hue-rotate(30deg) saturate(2) brightness(1.2) !important; }"}</style>
      {/* Compact Header Row */}
      <div 
        className="w-full h-[60px] flex items-center justify-between px-4 z-50 absolute top-0 left-0"
        style={{ 
          background: theme.cardBg, 
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-body-lg font-bold leading-tight truncate max-w-[150px]" style={{ color: theme.textPrimary }}>
            {cityName}
          </h2>
          <span className="text-[10px] uppercase tracking-widest opacity-80" style={{ color: theme.textSecondary }}>
            Precipitation Map
          </span>
        </div>

        {/* Compact Toggle Buttons */}
        <div 
          className="flex p-0.5 rounded-xl" 
          style={{ 
            background: "transparent", 
            border: `1px solid ${theme.cardBorder}`
          }}
        >
          {["rain", "wind", "uv"].map((type) => (
            <button
              key={type}
              onClick={() => setLayer(type)}
              className="px-3 py-1 text-xs rounded-lg font-label-md transition-all duration-300 capitalize"
              style={{
                background: layer === type ? theme.accentColor : "transparent",
                color: layer === type ? "#fff" : theme.textSecondary,
              }}
            >
              {type === "uv" ? "UV Index" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div 
        className="w-full absolute top-[60px] left-0 bottom-0"
        style={{ background: '#000' }}
      >
        <MapContainer 
          center={[lat, lon]} 
          zoom={6} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
          zoomControl={false}
        >
          <ChangeView center={[lat, lon]} />
          
          {/* Base Map - OSM */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Weather Overlay */}
          <TileLayer
            key={layer} // Force re-render of layer when toggled
            url={overlays[layer]}
            opacity={layer === "uv" ? 0.5 : 0.6}
            className={layer === "uv" ? "uv-overlay-filter" : ""}
          />
        </MapContainer>

        {/* Floating Current Weather Card */}
        <div 
          className="absolute bottom-6 left-4 z-[400] rounded-2xl p-3 flex flex-col gap-2 shadow-lg"
          style={{ 
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            backdropFilter: "blur(12px)"
          }}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl" style={{ color: theme.accentColor }}>
              {current?.icon}
            </span>
            <div>
              <div className="font-body-lg font-bold text-xl leading-none mb-1" style={{ color: theme.textPrimary }}>
                {current?.temp}°
              </div>
              <div className="font-label-sm text-xs" style={{ color: theme.textSecondary }}>
                {current?.condition}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: `${theme.textPrimary}20` }}>
            <span className="font-label-sm text-xs opacity-80" style={{ color: theme.textSecondary }}>UV Index</span>
            <div className="flex items-center gap-2">
              <span className="font-body-sm font-bold" style={{ color: theme.textPrimary }}>{current?.uvIndex || 0}</span>
              <span className="font-label-sm text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-bold" style={{ background: `${uvInfo.color}20`, color: uvInfo.color }}>
                {uvInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
