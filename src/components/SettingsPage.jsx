import React, { useState } from 'react';

export default function SettingsPage({
  tempUnit, setTempUnit,
  windUnit, setWindUnit,
  timeFormat, setTimeFormat,
  theme,
  isDark,
  toggleTheme,
  animationsEnabled,
  setAnimationsEnabled
}) {

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 
        className="font-label-sm text-xs uppercase tracking-widest mb-2 px-4" 
        style={{ color: theme.textSecondary }}
      >
        {title}
      </h3>
      <div 
        className="rounded-3xl overflow-hidden"
        style={{ 
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          backdropFilter: "blur(12px)"
        }}
      >
        {children}
      </div>
    </div>
  );

  const Row = ({ label, children, isLast }) => (
    <div 
      className="flex items-center justify-between py-4 px-5"
      style={{ borderBottom: isLast ? 'none' : `1px solid ${theme.cardBorder}` }}
    >
      <span className="font-body-md font-medium text-lg" style={{ color: theme.textPrimary }}>
        {label}
      </span>
      {children}
    </div>
  );

  const ToggleSwitch = ({ active, onClick }) => (
    <div 
      onClick={onClick}
      className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${active ? 'justify-end' : 'justify-start'}`}
      style={{ background: active ? theme.accentColor : theme.cardBorder }}
    >
      <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300" />
    </div>
  );

  const PillToggle = ({ options, active, onChange }) => (
    <div className="flex rounded-full p-1" style={{ background: theme.cardBorder }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-1 rounded-full font-label-md text-sm transition-all duration-300"
          style={{
            background: active === opt ? theme.accentColor : 'transparent',
            color: active === opt ? '#fff' : theme.textPrimary
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col items-start gap-1 mb-8 pt-2">
        <h2 className="text-4xl font-body-lg font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Settings
        </h2>
        <span className="font-label-sm text-sm" style={{ color: theme.textSecondary }}>
          Customize your experience
        </span>
      </div>

      <Section title="Units">
        <Row label="Temperature">
          <PillToggle options={['F', 'C']} active={tempUnit} onChange={setTempUnit} />
        </Row>
        <Row label="Wind Speed">
          <PillToggle options={['mph', 'kmh']} active={windUnit} onChange={setWindUnit} />
        </Row>
        <Row label="Time Format" isLast>
          <PillToggle options={['12h', '24h']} active={timeFormat} onChange={setTimeFormat} />
        </Row>
      </Section>

      <Section title="Appearance">
        <Row label="Dark Mode">
          <ToggleSwitch active={isDark} onClick={toggleTheme} />
        </Row>
        <Row label="Animations">
          <ToggleSwitch active={animationsEnabled} onClick={() => setAnimationsEnabled(!animationsEnabled)} />
        </Row>
        <Row label="Theme Preview" isLast>
          <div 
            className="px-3 py-1 rounded-lg text-sm font-bold shadow-sm" 
            style={{ 
              background: `${theme.accentColor}20`, 
              color: theme.accentColor 
            }}
          >
            Active
          </div>
        </Row>
      </Section>



      <Section title="About">
        <Row label="App">
          <span style={{ color: theme.textSecondary }}>SkyGlass Weather</span>
        </Row>
        <Row label="Version">
          <span style={{ color: theme.textSecondary }}>1.0.0</span>
        </Row>
        <Row label="Weather Data">
          <span style={{ color: theme.textSecondary }}>Open-Meteo </span>
        </Row>
        <Row label="Built with">
          <span style={{ color: theme.textSecondary }}>Built with Love ❤️</span>
        </Row>
        <Row label="Developer" isLast>
          <span style={{ color: theme.textSecondary }}>Tradermindx</span>
        </Row>
      </Section>

      <div className="flex flex-col items-center justify-center mt-6 gap-2 opacity-60">
        <span className="material-symbols-outlined text-lg" style={{ color: theme.textPrimary }}>favorite</span>
        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textPrimary }}>Made with love</span>
      </div>
    </div>
  );
}
