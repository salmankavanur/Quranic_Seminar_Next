"use client";

import { useState } from "react";
import { QRScanner } from "@/components/qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [lastScannedParticipant, setLastScannedParticipant] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const handleScan = async (qrData: string) => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Please enter a session ID first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrData,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to record attendance");
      }

      setLastScannedParticipant(data.participant);
      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });
    } catch (error) {
      console.error("Error recording attendance:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record attendance",
        variant: "destructive",
      });
    }
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sessionId" className="text-sm font-medium">
              Session ID
            </label>
            <Input
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID"
              className="max-w-md"
            />
          </div>

          <div className="space-y-4">
            <QRScanner
              onScan={handleScan}
              isScanning={isScanning}
              onToggleScanning={toggleScanning}
            />
          </div>

          {lastScannedParticipant && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-base">Last Scanned Participant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{lastScannedParticipant.name}</p>
                  <Badge>{lastScannedParticipant.type}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 