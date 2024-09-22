import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function prompt(description: string) {
//   return `based on description given below return in json format the following information: formTitle, formSubheading, formFields which is an array of name, label and placeholder objects\ndescription: ${description}`;
// }

export function prompt(description: string) {
  return `Based on the description given below, return a JSON object with the following structure:
  {
    "title": string,
    "subheading": string,
    "fields": [
      {
        "name": string,
        "label": string,
        "type": "text" | "textarea" | "radio" | "checkbox" | "select",
        "placeholder": string (optional, applicable for text and textarea),
        "required": boolean,
        "options": [
          {
            "label": string,
            "value": string
          }
        ] (optional, applicable for radio, checkbox, and select types)
      }
    ]
  }

Please ensure that:
1. Each field has an appropriate type based on the context.
2. For radio, checkbox, or select fields, provide relevant options.
3. Indicate whether each field is required or optional.
4. Include placeholder text for text and textarea fields when appropriate.
5. The form title and subheading should be concise and reflect the purpose of the form.

Description: ${description}

Please generate a complete and valid JSON object based on this description, ensuring all necessary fields are included and formatted correctly.`;
}

export const themes = [
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

// export const gradientOptions = [
//   {
//     name: "Sunset",
//     tailwindClass: "bg-orange-500",
//   },
//   {
//     name: "Ocean",
//     tailwindClass: "bg-blue-500",
//   },
//   {
//     name: "Forest",
//     tailwindClass: "bg-green-600",
//   },
//   {
//     name: "Lavender",
//     tailwindClass: "bg-purple-400",
//   },
//   {
//     name: "Cherry",
//     tailwindClass: "bg-red-600",
//   },
//   {
//     name: "Midnight",
//     tailwindClass: "bg-indigo-900",
//   },
//   {
//     name: "Sunshine",
//     tailwindClass: "bg-yellow-400",
//   },
//   {
//     name: "Berry",
//     tailwindClass: "bg-pink-500",
//   },
//   {
//     name: "Mint",
//     tailwindClass: "bg-emerald-400",
//   },
//   {
//     name: "Twilight",
//     tailwindClass: "bg-purple-800",
//   },
//   {
//     name: "Flamingo",
//     tailwindClass: "bg-pink-500",
//   },
//   {
//     name: "Glacier",
//     tailwindClass: "bg-cyan-300",
//   },
// ];

export const gradientOptions = [
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
