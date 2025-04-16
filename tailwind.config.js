module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        robotoCondensed: ["Roboto Condensed", "sans-serif"],
      },
      colors: {
        primary: "#1111", // Чёрный фон
        secondary: "#FFF", // Белый текст
        accent: "#FF3E30", // Красный акцент
        grayDark: "#222",
        grayLight: "#EAEAEA",
      },
    },
  },
  plugins: [],
};