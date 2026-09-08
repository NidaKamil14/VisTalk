import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useSignRecognition Hook
 * 
 * Manages the live webcam video feed and performs real-time ISL alphabet prediction
 * using the trained MobileNetV3-Small neural network backend.
 */
export function useSignRecognition(targetSign = null) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);

  // Real-Time ML Prediction State
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [matchStreak, setMatchStreak] = useState(0);

  // Check Backend Server Health
  const checkServerHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health").catch(() => fetch("http://localhost:5001/health"));
      if (res && res.ok) {
        setIsServerOnline(true);
        return true;
      }
    } catch {
      setIsServerOnline(false);
    }
    return false;
  }, []);

  // Check health on mount and periodically
  useEffect(() => {
    checkServerHealth();
    const healthInterval = setInterval(checkServerHealth, 8000);
    return () => clearInterval(healthInterval);
  }, [checkServerHealth]);

  // CRITICAL FIX FOR WEBCAM RENDERING:
  // Synchronize videoRef.current with active mediaStream whenever video element mounts or stream changes
  useEffect(() => {
    let playPromise = null;
    const video = videoRef.current;

    if (isCameraActive && stream && video) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.muted = true;
        video.setAttribute("playsinline", "true");
        video.setAttribute("autoplay", "true");
      }

      playPromise = video.play().catch((err) => {
        // AbortError can happen if play() is interrupted by a pause/unmount
        if (err.name !== "AbortError") {
          console.warn("Webcam video play warning:", err);
        }
      });
    }

    return () => {
      if (playPromise) {
        playPromise.catch(() => {});
      }
    };
  }, [isCameraActive, stream]);

  // Track latest targetSign and prediction concurrency with refs to avoid timer thrashing
  const targetSignRef = useRef(targetSign);
  useEffect(() => {
    targetSignRef.current = targetSign;
  }, [targetSign]);

  const isPredictingRef = useRef(false);

  // Capture a single frame from video and send to prediction API
  const captureAndPredict = useCallback(async () => {
    if (!videoRef.current || !isCameraActive || isPredictingRef.current) return null;
    
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) return null;

    try {
      isPredictingRef.current = true;
      setIsPredicting(true);

      // Create off-screen canvas if not present
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      // Draw current video frame scaled to 128x128
      ctx.drawImage(video, 0, 0, 128, 128);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

      // Send to inference API
      let response;
      try {
        response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
      } catch {
        response = await fetch("http://localhost:5001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsServerOnline(true);
          const currentTarget = targetSignRef.current;
          const targetChar = (currentTarget?.symbol || currentTarget?.title || currentTarget?.id || "").replace(/Letter\s*/i, "").trim().toUpperCase();
          const predChar = data.prediction.toUpperCase();
          const isTargetMatch = Boolean(targetChar && predChar === targetChar);

          const result = {
            letter: data.prediction,
            confidence: data.confidence,
            topPredictions: data.top_predictions || [],
            isMatch: isTargetMatch,
            timestamp: Date.now(),
          };

          setPrediction(result);

          if (isTargetMatch && data.confidence > 70) {
            setMatchStreak((prev) => Math.min(prev + 1, 5));
          } else {
            setMatchStreak((prev) => Math.max(0, prev - 1));
          }

          return result;
        }
      }
    } catch (err) {
      console.warn("Prediction frame error:", err);
    } finally {
      isPredictingRef.current = false;
      setIsPredicting(false);
    }
    return null;
  }, [isCameraActive]);

  // Continuous Recognition Loop when Camera is Active
  useEffect(() => {
    let intervalId = null;
    if (isCameraActive) {
      // Run prediction every 500ms
      intervalId = setInterval(() => {
        captureAndPredict();
      }, 500);
    } else {
      setPrediction(null);
      setMatchStreak(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive, captureAndPredict]);

  // Camera Controls
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access is not supported by your browser environment.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      // Try immediate attachment if video element is already available
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play().catch(() => {});
      }
      checkServerHealth();
    } catch (err) {
      console.warn("Camera access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please enable webcam permissions in your browser.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No connected webcam was detected on this device.");
      } else {
        setCameraError(err.message || "Failed to initialize webcam.");
      }
      setIsCameraActive(false);
    }
  }, [checkServerHealth]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
    setPrediction(null);
    setMatchStreak(0);
  }, [stream]);

  const toggleCamera = useCallback(() => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    isCameraActive,
    isMirrored,
    setIsMirrored,
    cameraError,
    isModelLoading,
    setIsModelLoading,
    isServerOnline,
    prediction,
    isPredicting,
    matchStreak,
    startCamera,
    stopCamera,
    toggleCamera,
    captureAndPredict,
  };
}

export default useSignRecognition;
