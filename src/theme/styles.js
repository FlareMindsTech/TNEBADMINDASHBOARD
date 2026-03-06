import { mode } from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    gray: {
      700: "#1f2733",
    },
    tneb: {
      50: "#e0f2fe",
      100: "#bae6fd",
      200: "#7dd3fc",
      300: "#38bdf8",
      400: "#0ea5e9",
      500: "#0284c7",
      600: "#0369a1",
      700: "#075985",
      800: "#0c4a6e",
      900: "#082f49",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1b254b",
      800: "#111c44",
      900: "#0b1437",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: "hidden",
        bg: mode("gray.50", "#0b1437")(props),
        fontFamily: "'Inter', sans-serif",
        backgroundImage: mode(
          "radial-gradient(#CBD5E0 0.5px, transparent 0.5px)",
          "radial-gradient(#1B254B 0.5px, transparent 0.5px)"
        )(props),
        backgroundSize: "30px 30px",
      },
      html: {
        fontFamily: "'Inter', sans-serif",
      },
      "h1, h2, h3, h4, h5, h6": {
        fontFamily: "'Outfit', sans-serif !important",
      },
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: props.colorMode === "dark" ? "rgba(255,255,255,0.1)" : "#CBD5E0",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: props.colorMode === "dark" ? "rgba(255,255,255,0.2)" : "#A0AEC0",
      },
      ":root": {
        "--primary-color": "#1b5baf",
        "--primary-dark": "#15458a",
        "--primary-light": "#2a6cc7",
        "--primary-lighter": "#3a7ddf",
        "--primary-gradient": "linear-gradient(90deg, #1b5baf 0%, #15458a 50%, #2a6cc7 100%)",
        "--hover-gradient": "linear-gradient(90deg, #2a6cc7 0%, #3a7ddf 50%, #1b5baf 100%)",
        "--text-color": "#ffffff",
        "--dropdown-bg": "rgba(255, 255, 255, 0.98)",
        "--shadow-color": "rgba(27, 91, 175, 0.2)",
      },
      ".glass": {
        backdropFilter: "blur(20px) saturate(180%)",
        backgroundColor: mode("rgba(255, 255, 255, 0.7)", "rgba(10, 61, 145, 0.15)")(props),
        border: "1px solid",
        borderColor: mode("rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.1)")(props),
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }
    }),
  },
};
