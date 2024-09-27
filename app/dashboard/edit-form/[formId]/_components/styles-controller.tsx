"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormType } from "@/db/schema";
import { themes } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { authenticateSubmission } from "../actions";

export default function StylesController({
  selectTheme,
  changeBackground,
  form,
}: {
  selectTheme: (value: string) => void;
  changeBackground: (value: string) => void;
  form: FormType;
}) {
  console.log(form);
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  console.log(form?.auth);
  const gradientOptions = [
    {
      name: "Sunset",
      tailwindClass: "bg-gradient-to-r from-orange-500 to-pink-500",
    },
    {
      name: "Ocean",
      tailwindClass: "bg-gradient-to-r from-blue-400 to-emerald-400",
    },
    {
      name: "Forest",
      tailwindClass: "bg-gradient-to-r from-green-500 to-emerald-700",
    },
    {
      name: "Lavender",
      tailwindClass: "bg-gradient-to-r from-indigo-300 to-purple-400",
    },
    {
      name: "Cherry",
      tailwindClass: "bg-gradient-to-r from-red-500 to-pink-600",
    },
    {
      name: "Midnight",
      tailwindClass: "bg-gradient-to-r from-blue-700 to-indigo-900",
    },
    {
      name: "Sunshine",
      tailwindClass: "bg-gradient-to-r from-yellow-300 to-orange-500",
    },
    {
      name: "Berry",
      tailwindClass: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Mint",
      tailwindClass: "bg-gradient-to-r from-green-400 to-cyan-500",
    },
    {
      name: "Twilight",
      tailwindClass: "bg-gradient-to-r from-purple-600 to-indigo-600",
    },
    {
      name: "Flamingo",
      tailwindClass: "bg-gradient-to-r from-pink-400 to-red-400",
    },
    {
      name: "Glacier",
      tailwindClass: "bg-gradient-to-r from-blue-300 to-cyan-200",
    },
  ];

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    selectTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Theme Controller */}
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
      {/* Background Color Controller */}
      <div className="w-full max-w-xs mx-auto mt-8">
        <div className="p-2">
          <h2 className="text-lg font-semibold mb-2">Choose a Gradient</h2>
          <div className="grid grid-cols-4 gap-1">
            {gradientOptions.map((gradient) => (
              <button
                key={gradient.name}
                className={`w-12 h-6 md:w-16 md:h-8 mb-2 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 hover:border ${gradient.tailwindClass}`}
                onClick={() => changeBackground(gradient.tailwindClass)}
                aria-label={`Select ${gradient.name} gradient`}
              >
                <span className="sr-only">{gradient.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Checkbox
            defaultChecked={form.auth!}
            onCheckedChange={async () => {
              await authenticateSubmission(form.id, form.auth!);
            }}
          />
          <Label>Sign in before submission</Label>
        </div>
      </div>
    </div>
  );
}
