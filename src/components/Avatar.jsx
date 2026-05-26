function Avatar({ letter = "I", size = 50 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "#38bdf8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: `${size / 2.2}px`,
        color: "white",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

export default Avatar;
