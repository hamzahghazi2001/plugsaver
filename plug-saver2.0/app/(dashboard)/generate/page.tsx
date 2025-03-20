
// pages/generate.tsx

"use client"

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GeneratePage() {
  // Ref for the QR code canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // State for the smart plug ID input
  const [smartPlugId, setSmartPlugId] = useState("");
  // State for error message if the input is invalid
  const [error, setError] = useState("");

  // Validate the smart plug ID and clear error if valid
  const generateQRCode = () => {
    const regex = /^\d{4}$/; // Validates exactly 4 digits
    if (!regex.test(smartPlugId)) {
      setError("Please enter a valid 4-digit smart plug ID");
      return;
    }
    setError("");
    // QRCodeCanvas automatically regenerates when its value prop changes
  };

  // Function to download the generated QR code
  const downloadQR = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `SmartPlug-${smartPlugId}-QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>QR Code Generator</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={smartPlugId}
          onChange={(e) => setSmartPlugId(e.target.value)}
          placeholder="Enter 4-digit Smart Plug ID"
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
          }}
        />
        <button
          onClick={generateQRCode}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generate QR Code
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* If there is no error and smartPlugId is valid, display the QR code and download button */}
      {!error && smartPlugId && (
        <>
          <div style={{ margin: "2rem auto", width: "256px" }}>
            <QRCodeCanvas value={smartPlugId} size={256} ref={canvasRef} />
          </div>
          <p>
            The QR code for <strong>{smartPlugId}</strong> has been generated.
          </p>
          <button
            onClick={downloadQR}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Download QR Code
          </button>
        </>
      )}
    </div>
  );
}