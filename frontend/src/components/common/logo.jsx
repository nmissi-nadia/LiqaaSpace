const logo = ({ size = "large", white = false, className = "" }) => {
  const sizes = {
    small: { width: "120px", height: "40px", fontSize: "16px" },
    medium: { width: "160px", height: "50px", fontSize: "20px" },
    large: { width: "200px", height: "60px", fontSize: "24px" },
    xlarge: { width: "240px", height: "70px", fontSize: "28px" },
  }

  const currentSize = sizes[size] || sizes.large

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: currentSize.width,
        height: currentSize.height,
        background: white ? "rgba(255, 255, 255, 0.15)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        borderRadius: "16px",
        padding: "8px 16px",
        backdropFilter: white ? "blur(10px)" : "none",
        border: white ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
        boxShadow: white ? "none" : "0 8px 32px rgba(16, 185, 129, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Icône OCP */}
        <div
          style={{
            width: "32px",
            height: "32px",
            background: white ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            color: white ? "#10b981" : "white",
          }}
        >
          OCP
        </div>

        {/* Texte du logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span
            style={{
              color: white ? "rgba(255, 255, 255, 0.95)" : "white",
              fontSize: currentSize.fontSize,
              fontWeight: "bold",
              lineHeight: "1",
              letterSpacing: "-0.5px",
            }}
          >
            Liqaa
          </span>
          <span
            style={{
              color: white ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)",
              fontSize: `${Number.parseInt(currentSize.fontSize) * 0.6}px`,
              fontWeight: "500",
              lineHeight: "1",
              letterSpacing: "1px",
            }}
          >
            SPACE
          </span>
        </div>
      </div>
    </div>
  )
}

export default logo
