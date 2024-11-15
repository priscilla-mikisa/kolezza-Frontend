import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue:'#A5DAF7', 
        customDarkBlue:'#052049',
        customGreen:'#8BC34A',
        lightGreen:'#90BD31',
      }, 
      screens: {
        'nh': {'min': '1000px', 'max': '1024px'},
      },
    },
  },
  plugins: [],
};
export default config;
