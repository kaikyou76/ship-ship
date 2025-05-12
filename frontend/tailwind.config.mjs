/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // 他のファイルパスがあれば追加
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
