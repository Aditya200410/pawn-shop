import React from "react";

const RikoCraftPoster = ({ qrSrc = "/qr.jpg" }) => (
  <div
    style={{
      background: "#7b3f3f",
      color: "#f7e7a6",
      fontFamily: "serif",
      minHeight: "100vh",
      padding: 0,
      margin: 0,
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {/* Logo */}
    <div style={{ marginTop: 32, marginBottom: 16 }}>
      {/* Replace with your logo if available */}
      <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'cursive', marginBottom: 8 }}>
        RikoCraft
      </div>
      <div style={{ textAlign: "center", fontSize: 18, fontWeight: 400 }}>
        Crafted by Hands, Inspired by Heritage
      </div>
    </div>

    {/* Headline */}
    <div style={{ textAlign: "center", margin: "24px 0 8px" }}>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 2 }}>
        SCAN. SHOP. SUPPORT.
      </div>
      <div style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>
        BUY HANDMADE TREASURES FROM INDIAN VILLAGES
      </div>
    </div>

    {/* QR Code */}
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "4px solid #444",
        width: "min(90vw, 320px)",
        height: "min(90vw, 320px)",
        margin: "32px auto 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        overflow: "hidden"
      }}
    >
      <img
        src={qrSrc}
        alt="Shop QR"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 20,
          background: "#fff"
        }}
      />
    </div>

    {/* Quote */}
    <div
      style={{
        fontFamily: "cursive",
        fontSize: 22,
        color: "#f7e7a6",
        textAlign: "center",
        margin: "24px 0 8px",
        fontWeight: 400,
      }}
    >
      “Every product you buy supports<br />
      a rural artisan family.”
    </div>

    {/* Heritage line */}
    <div
      style={{
        fontFamily: "cursive",
        fontSize: 20,
        color: "#fffbe7",
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      Preserve 4000+ years of heritage art.
    </div>

    {/* Support line */}
    <div
      style={{
        background: "none",
        color: "#f7e7a6",
        fontSize: 22,
        textAlign: "center",
        margin: "12px 0 24px",
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: 32, marginRight: 8 }}>🤝</span>
      Support Gaon ke Kalakar,<br />
      Sajaye Apna Ghar.
    </div>

    {/* Footer */}
    <div
      style={{
        borderTop: "3px solid #f7e7a6",
        width: "90%",
        margin: "auto",
        marginTop: 16,
        paddingTop: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 18,
        gap: 8,
      }}
    >
      <div>
        <span style={{ marginRight: 16 }}>📷 RIKO.CRAFT</span>
        <span style={{ marginRight: 16 }}>🌐 RIKOCRAFT.COM</span>
        <span>✉️ CARE@RIKOCRAFT.COM</span>
      </div>
    </div>
  </div>
);

export default RikoCraftPoster; 