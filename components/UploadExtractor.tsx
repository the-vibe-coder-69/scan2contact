"use client";
import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const UploadExtractor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setLoading(true);
        setExtractedText(null);
        try {
          const { data: { text } } = await Tesseract.recognize(reader.result, "eng");
          setExtractedText(text.trim());
        } catch (err) {
          setExtractedText("Failed to extract text.");
        }
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          Select Image
        </button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
      {image && (
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt="Uploaded"
            className="max-w-xs rounded-lg border shadow-md mb-4"
          />
        </div>
      )}
      {loading && <p className="text-center text-blue-600 font-medium">🔍 Processing image...</p>}
      {extractedText && (
        <div>
          <h2 className="font-semibold mt-4 mb-2">Extracted Text:</h2>
          <pre className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg whitespace-pre-wrap text-sm">{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadExtractor;