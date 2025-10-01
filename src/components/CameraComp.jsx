import React, { useRef, useState, useEffect } from "react";
import localforage from "localforage";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

localforage.config({
  name: "PWA-Camera-App",
  storeName: "images",
});

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // Start the camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // rear camera on phones
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }

    startCamera();

    // Load existing images from storage
    const loadImages = async () => {
      const keys = await localforage.keys();
      const stored = [];
      for (const key of keys) {
        const img = await localforage.getItem(key);
        stored.push(img);
      }
      setImages(stored);
    };
    loadImages();
  }, []);
  async function takePicture() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
    });
    console.log(image);
  }
  // Capture photo from video stream
  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    // Save to localforage
    const id = Date.now().toString();
    await localforage.setItem(id, imageData);

    setImages((prev) => [...prev, imageData]);
  };

  // Clear storage
  const clearImages = async () => {
    await localforage.clear();
    setImages([]);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>PWA Camera Capture</h2>

      {/* Live Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
      ></video>

      <div style={{ marginTop: "10px" }}>
        <button onClick={capturePhoto}>📸 Capture</button>
        <button onClick={clearImages} style={{ marginLeft: "10px" }}>
          🗑️ Clear
        </button>
      </div>

      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Show stored images */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`capture-${i}`}
            style={{
              width: "120px",
              height: "120px",
              margin: "5px",
              borderRadius: "8px",
              objectFit: "cover",
              border: "2px solid #ddd",
            }}
          />
        ))}
      </div>
    </div>
  );
}
