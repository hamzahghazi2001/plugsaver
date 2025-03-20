// pages/generate.tsx
"use client"

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GeneratePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQR = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "PLUGSAVER-QR.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>QR Code Generator</h1>
      {/* The QR code is generated but hidden from view */}
      <div style={{ display: "none" }}>
        <QRCodeCanvas
          value="PLUGSAVER"
          size={256}
          ref={canvasRef}
        />
      </div>
      <p>
        The QR code for <strong>PLUGSAVER</strong> has been generated.
      </p>
      <button onClick={downloadQR} style={{ padding: "0.5rem 1rem" }}>
        Download QR Code
      </button>
    </div>
  );
}
