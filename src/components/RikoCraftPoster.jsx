import React from "react";

const RikoCraftPoster = ({ qrSrc = "/qr.jpg" }) => (
  <div
    style={{
      background: `url('/qr.jpg') center center / cover no-repeat`,
      width: "1080px",
      height: "1920px",
      position: "relative",
      overflow: "hidden"
    }}
  >
    {/* QR code overlay - adjust top/left/width/height as needed for perfect placement */}
    <div
      style={{
        position: "absolute",
        top: "600px", // visually estimated for 1080x1920
        left: "calc(50% - 240px)", // center horizontally, width 480px
        width: "480px",
        height: "480px",
        background: "#fff",
        borderRadius: "32px",
        border: "8px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
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
          borderRadius: "24px",
          background: "#fff"
        }}
      />
    </div>
  </div>
);

export default RikoCraftPoster; 