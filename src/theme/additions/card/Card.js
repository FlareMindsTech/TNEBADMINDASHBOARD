const Card = {
  baseStyle: (props) => ({
    p: "22px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxShadow: props.colorMode === "dark"
      ? "0px 10px 30px rgba(0, 0, 0, 0.4)"
      : "0px 10px 30px rgba(0, 0, 0, 0.05)",
    borderRadius: "24px",
    position: "relative",
    wordWrap: "break-word",
    backgroundClip: "border-box",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: props.colorMode === "dark"
        ? "0px 15px 35px rgba(0, 0, 0, 0.5)"
        : "0px 15px 35px rgba(0, 0, 0, 0.1)",
    }
  }),
  variants: {
    panel: (props) => ({
      bg: props.colorMode === "dark" ? "#111C44" : "white",
      border: "1px solid",
      borderColor: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    }),
    glass: (props) => ({
      bg: props.colorMode === "dark" ? "rgba(17, 25, 40, 0.75)" : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(12px) saturate(180%)",
      border: "1px solid",
      borderColor: "rgba(255, 255, 255, 0.125)",
    })
  },
  defaultProps: {
    variant: "panel",
  },
};

export const CardComponent = {
  components: {
    Card,
  },
};
