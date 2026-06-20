import { useState, useRef } from "react";

export default function SearchBar({ onSearch, theme }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  function handleKey(e) {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
      setValue("");
    }
  }

  function handleFocus() {
    setFocused(true);
    // Smoothly scroll the search bar to the center of the viewport to keep it visible above keyboard
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  return (
    <div
      ref={containerRef}
      className={`flex items-center rounded-xl px-4 py-3 gap-3 transition-all ${focused ? "ring-2" : ""}`}
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        backdropFilter: "blur(12px)",
        ringColor: theme.accentColor,
      }}
    >
      <span 
        className="material-symbols-outlined opacity-60 cursor-pointer" 
        style={{ color: theme.textSecondary }}
        onClick={() => document.querySelector('input[type=text]')?.focus()}
      >
        search
      </span>
      <input
        type="text"
        className="bg-transparent border-none focus:ring-0 w-full font-body-md text-body-md outline-none placeholder:opacity-50"
        style={{ color: theme.textPrimary }}
        placeholder="Search for a city..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKey}
      />
    </div>
  );
}

