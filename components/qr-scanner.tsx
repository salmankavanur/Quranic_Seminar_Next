"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface QRScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

export function QRScanner({ onScan, isScanning, onToggleScanning }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    let mounted = true;

    const startScanning = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        
        // Get video input devices
        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          throw new Error("No camera found");
        }

        // Start decoding from video device
        if (mounted && videoRef.current) {
          controlsRef.current = await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                onScan(result.getText());
              }
              if (error && error?.message !== "No MultiFormat Readers were able to detect the code.") {
                console.error("QR Scanner error:", error);
              }
            }
          );
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError("Failed to access camera");
        toast({
          title: "Error",
          description: "Failed to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    if (isScanning) {
      startScanning();
    }

    return () => {
      mounted = false;
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [isScanning, onScan]);

  if (!isScanning) {
    return (
      <Button onClick={onToggleScanning} className="w-full">
        Start Scanning
      </Button>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            className="w-full h-full"
          />
          <div className="absolute inset-0 border-2 border-primary opacity-50 pointer-events-none" />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button onClick={onToggleScanning} variant="outline" className="w-full">
          Stop Scanning
        </Button>
      </div>
    </Card>
  );
} 