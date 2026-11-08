"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import jsQR from "jsqr";
import { CameraOff } from "lucide-react";

type QrScannerProps = { onScan: (text: string) => void };

const QrScanner = ({ onScan }: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const handleScan = useEffectEvent(onScan);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let stream: MediaStream | null = null;
    let frame = 0;
    let isFound = false;

    const read = () => {
      if (video && context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(pixels.data, pixels.width, pixels.height);
        if (result?.data) {
          isFound = true;
          handleScan(result.data);
          return;
        }
      }
      frame = requestAnimationFrame(read);
    };

    const request = navigator.mediaDevices
      ? navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      : Promise.reject(new Error("No camera"));

    request
      .then((media) => {
        stream = media;
        if (!video || isFound) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        video.srcObject = media;
        return video.play().then(() => {
          frame = requestAnimationFrame(read);
        });
      })
      .catch(() => setIsBlocked(true));

    return () => {
      isFound = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (isBlocked) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl bg-subtle p-6 text-center text-sm text-muted">
        <CameraOff className="size-8" />
        Camera unavailable. Allow camera access, or type the code shown under the QR.
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} muted playsInline className="size-full object-cover" />
      <span className="absolute inset-[18%] rounded-2xl border-2 border-white/80" />
    </div>
  );
};

export default QrScanner;
