"use client";
import React, { useRef, useState, useEffect } from "react";
import ContactSaver from './ContactSaver';

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      setIsBrowser(true);
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Could not access rear camera.");
    }
  };

  const takePhoto = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imageData.data;

    // Grayscale + contrast boost
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const contrast = 1.5;
      const val = Math.min(255, avg * contrast);
      data[i] = data[i + 1] = data[i + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvasRef.current.toDataURL("image/png");
    setImage(dataURL);

    setLoading(true);
    setExtractedText(null);

    try {
      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image: dataURL }),
      });

      const result = await res.json();
      setExtractedText(result.text || "No text found.");
    } catch (err) {
      setExtractedText("Failed to extract text.");
    }

    setLoading(false);
  };

  if (!isBrowser) return <p className="text-center text-gray-600 mt-10">Loading camera...</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">📸 Contact Scanner</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg border shadow-sm"
      />
      <canvas ref={canvasRef} hidden />

      <div className="flex justify-between gap-2">
        <button
          onClick={startCamera}
          className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Start Camera
        </button>
        <button
          onClick={takePhoto}
          className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Capture
        </button>
      </div>

      {image && (
        <div>
          <h2 className="font-semibold mt-4 mb-2">Captured Image:</h2>
          <img src={image} alt="Captured" className="rounded-lg border shadow-md" />
        </div>
      )}

      {loading && <p className="text-center text-sm text-gray-500">🔍 Processing image...</p>}

      {extractedText && (
  <div>
    <h2 className="font-semibold mt-4 mb-2">Extracted Text:</h2>
    <pre className="bg-gray-800 text-white p-4 rounded-xl whitespace-pre-wrap">{extractedText}</pre>
    <ContactSaver text={extractedText} />
  </div>
)}
    </div>
  );
};

export default CameraCapture;