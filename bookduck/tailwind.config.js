/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
      },
      animation: {
        slideUp: "slideUp 0.3s ease-in-out",
        slideDown: "slideDown 0.3s ease-in-out",
      },
      colors: {
        yellow: "#FFFAE6",
        white: "#FFF",
        black: "#000000",
        orange: {
          50: "#FFFAE6",
          300: "#FFBF68",
          400: "#FF9F1C",
          600: "#EA7120",
        },
        gray: {
          5: "#00000033",
          10: "#FBFBFB",
          20: "#DDDDDD",
          50: "#F7F7F7",
          100: "#EEEEEE",
          200: "#E2E2E2",
          300: "#DDDDDD",
          400: "#ABABAB",
          500: "#8A8A8A",
          600: "#636363",
          700: "#505050",
          800: "#323232",
          custom: "#DDD",
        },
        blue: {
          200: "#0066FF",
          400: "#6B7FF0",
          800: "#364390",
        },
        yellow: {
          50: "#FFFAE6",
          80: "#FFF0B9",
          100: "#FFECA4",
        },
        red: "#EA4520",
        "red-light": "#F6E5E1",
        special: "#FF9F1C",
      },
      backgroundImage: {
        "orange-gradation-level":
          "linear-gradient(180deg, #FFBF68 0%, #FF9F1C 100%)",
        "orange-gradation-mission":
          "linear-gradient(0deg, var(--Primary-300, #FFBF68) 0%, var(--Primary-300, #FFBF68) 100%), linear-gradient(110deg, #FFE16E 0%, #FFBF68 53.83%)",
        "white-gradiation":
          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFF 35.43%)",
        "yellow-gradation":
          "linear-gradient(199deg, #FFF 53.87%, #FFFAE6 87.72%)",
      },
      fontSize: {
        t1: ["1.375rem", { lineHeight: "1.875rem" }], //22px /30px
        t2: ["1.25rem", { lineHeight: "1.5rem" }], //20px /24px
        st: ["1.125rem", { lineHeight: "1.5rem" }], //18px / 24px
        b1: ["1rem", { lineHeight: "1.5rem" }], //16px / 24px
        b2: ["0.875rem", { lineHeight: "1.25rem" }], //14px /24px
        btn1: ["1.125rem", { lineHeight: "1.5rem" }],
        btn2: ["1rem", { lineHeight: "1.25rem" }], //16px / 20px
        btn3: ["0.875rem", { lineHeight: "1.25rem" }], //14px / 20px
        btn4: ["0.75rem", { lineHeight: "1rem" }], //12px / 16px
        c1: ["0.75rem", { lineHeight: "1rem" }], //12px / 16px
        c3: ["2rem", { lineHeight: "2.25rem" }], //32px / 36px
      },
      fontWeight: {
        semibold: 600,
        regular: 400,
      },
      fontFamily: {
        caprasimo: ["Caprasimo", "sans-serif"], // Caprasimo 폰트 추가
      },
      boxShadow: {
        custom: "0px 0px 3px 0px rgba(0, 0, 0, 0.10)",
        custom2: "0px 0px 10px 0px rgba(0, 0, 0, 0.10)",
      },
    },
  },
  plugins: [],
};
