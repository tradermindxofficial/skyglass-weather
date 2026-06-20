import { useState } from "react";

const NAV_ITEMS = [
  { id: "today", label: "Today", icon: "today" },
  { id: "forecast", label: "Forecast", icon: "calendar_month" },
  { id: "map", label: "Map", icon: "map" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function BottomNavBar({ theme, activePage, setActivePage }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-around items-center px-4 pt-2 z-50"
      style={{
        background: theme.cardBg,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${theme.cardBorder}`,
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className="flex flex-col items-center justify-center rounded-full px-4 py-2 cursor-pointer active:scale-90 transition-all duration-150 min-h-[44px] min-w-[44px]"
            style={{
              color: isActive ? theme.accentColor : theme.textSecondary,
              background: isActive ? `${theme.accentColor}18` : "transparent",
            }}
          >
            <span className={`material-symbols-outlined ${isActive ? "filled" : ""}`}>{item.icon}</span>
            <span className="font-label-sm text-label-sm mt-0.5">{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
