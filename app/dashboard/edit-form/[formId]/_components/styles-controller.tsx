"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function StylesController({
  selectTheme,
}: {
  selectTheme: (value: string) => void;
}) {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: "light", colors: ["#ffffff", "#d1d5db", "#9ca3af", "#6b7280"] },
    { name: "dark", colors: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af"] },
    { name: "cupcake", colors: ["#faf7f5", "#eee0d7", "#dca54c", "#b56e46"] },
    { name: "bumblebee", colors: ["#ffffff", "#fbbf24", "#eab308", "#d97706"] },
    { name: "emerald", colors: ["#ffffff", "#6ee7b7", "#34d399", "#10b981"] },
    { name: "corporate", colors: ["#ffffff", "#9ca3af", "#6b7280", "#4b5563"] },
    { name: "synthwave", colors: ["#2d1b69", "#e779c1", "#58c7f3", "#f9c80e"] },
    { name: "retro", colors: ["#e4d8b4", "#c6a477", "#d8b365", "#a47148"] },
    { name: "cyberpunk", colors: ["#ffee00", "#ff00a0", "#00fff9", "#ff9900"] },
    { name: "valentine", colors: ["#f0c6f5", "#e681d8", "#d61c8b", "#8c0327"] },
    { name: "halloween", colors: ["#ffb01f", "#f28c18", "#ab6616", "#7a4210"] },
    { name: "garden", colors: ["#e9f4e9", "#83bd75", "#4f772d", "#31572c"] },
    { name: "forest", colors: ["#f1f8e9", "#85c34a", "#4caf50", "#2e7d32"] },
    { name: "aqua", colors: ["#e0f7fa", "#80deea", "#26c6da", "#00acc1"] },
    { name: "lofi", colors: ["#ffffff", "#e0e0e0", "#bdbdbd", "#9e9e9e"] },
    { name: "pastel", colors: ["#fff5f7", "#fce7f3", "#fbcfe8", "#f9a8d4"] },
    { name: "fantasy", colors: ["#fff8e1", "#ffecb3", "#ffd54f", "#ffca28"] },
    { name: "wireframe", colors: ["#ffffff", "#ebebeb", "#b8b8b8", "#9e9e9e"] },
    { name: "black", colors: ["#000000", "#1a1a1a", "#2b2b2b", "#414141"] },
    { name: "luxury", colors: ["#ffffff", "#e6e6e6", "#b3b3b3", "#808080"] },
    { name: "dracula", colors: ["#282a36", "#44475a", "#6272a4", "#8be9fd"] },
    { name: "cmyk", colors: ["#ffffff", "#00ffff", "#ff00ff", "#ffff00"] },
    { name: "autumn", colors: ["#fbf1c7", "#fe8019", "#d65d0e", "#af3a03"] },
    { name: "business", colors: ["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db"] },
    { name: "acid", colors: ["#fafa37", "#d4d41a", "#b9b91e", "#a6a60a"] },
    { name: "lemonade", colors: ["#fff9c4", "#fff59d", "#fff176", "#ffee58"] },
    { name: "night", colors: ["#1e293b", "#334155", "#475569", "#64748b"] },
    { name: "coffee", colors: ["#ece0d1", "#dbc1ac", "#967259", "#634832"] },
    { name: "winter", colors: ["#ffffff", "#e3f2fd", "#bbdefb", "#90caf9"] },
    { name: "dim", colors: ["#2d3748", "#4a5568", "#718096", "#a0aec0"] },
    { name: "nord", colors: ["#2e3440", "#3b4252", "#434c5e", "#4c566a"] },
    { name: "sunset", colors: ["#fed7aa", "#fdba74", "#fb923c", "#f97316"] },
  ];

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    selectTheme(selectedTheme);
    setIsOpen(false);
  };
  return (
    <div>
      <div className="w-full max-w-xs mx-auto">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span className="flex items-center">
              <span className="w-16 h-4 flex mr-2 rounded overflow-hidden">
                {themes
                  .find((t) => t.name === theme)
                  ?.colors.map((color, index) => (
                    <span
                      key={index}
                      style={{ backgroundColor: color, width: "25%" }}
                    ></span>
                  ))}
              </span>
              <span className="flex-grow">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </span>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {themes.map((t) => (
                <button
                  key={t.name}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  onClick={() => handleThemeChange(t.name)}
                >
                  <span className="flex items-center">
                    <span className="w-16 h-4 flex mr-2 rounded overflow-hidden">
                      {t.colors.map((color, index) => (
                        <span
                          key={index}
                          style={{ backgroundColor: color, width: "25%" }}
                        ></span>
                      ))}
                    </span>
                    <span>
                      {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Selected theme: <span className="font-semibold">{theme}</span>
        </p>
      </div>
    </div>
  );
}
