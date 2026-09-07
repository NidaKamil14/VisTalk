import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useSignRecognition Hook (Phase 2 Ready Architecture)
 * 
 * Manages the live video feed and provides clean, modular slots for the upcoming
 * Phase 2 machine learning pipeline:
 * 
 *   WEBCAM → MEDIAPIPE (21 Hand Landmarks) → FEATURE EXTRACTION → 
 *   TRAINED CLASSIFIER → REAL-TIME PREDICTION → USER FEEDBACK
 * 
 * In this phase, it safely handles webcam hardware permissions, mirror rendering,
 * and lifecycle management without faking AI predictions.
 */
export function useSignRecognition() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Phase 2 Pipeline State Slots
  const [landmarks] = useState(null);
  const [prediction] = useState(null);

  // Pipeline architecture metadata
  const pipelineInfo = {
    architecture: "Webcam → MediaPipe Hands → Landmark Preprocessing → Classifier → Feedback",
    status: isCameraActive ? "Camera active (Phase 2 AI pipeline ready)" : "Camera inactive",
    isFakeAI: false,
    phase: "Phase 1 Scaffold (Awaiting Phase 2 MediaPipe Model)",
  };

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

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {
          // Handled if browser policies require explicit play call
        });
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera access permission was denied. Please allow camera permissions in your browser settings to use the practice mirror.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No connected webcam was detected on this device.");
      } else {
        setCameraError(err.message || "Failed to initialize webcam.");
      }
      setIsCameraActive(false);
    }
  }, []);

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
  }, [stream]);

  const toggleCamera = useCallback(() => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  // Clean up media tracks on unmount
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
    startCamera,
    stopCamera,
    toggleCamera,
    landmarks,
    prediction,
    pipelineInfo,
  };
}

export default useSignRecognition;
