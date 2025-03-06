import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        altBackground: "var(--altBackground)",
        LvlupBlue: {
          light: '#4c9de5',
          DEFAULT: '#3889d1',
          dark: '#2475bd',
          dark2: '#1062a9',
        },
      },
      spacing: {
        '120': '30rem',
        '140': '35rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
