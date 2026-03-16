export function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: "#fffdf8",
          borderRadius: 20,
          padding: "16px 20px 14px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          minWidth: 260,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "999px",
            border: "3px solid #ffe0b2",
            borderTopColor: "#ff8a65",
            animation: "vp-spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          お待ちください...
        </div>
      </div>
      <style jsx global>{`
        @keyframes vp-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

