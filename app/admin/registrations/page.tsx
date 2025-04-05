'use client';

import { Button } from "@/components/ui/button"
import { Download, FileDown } from "lucide-react"
import { CreateRegistrationDialog } from "./create-registration-dialog"
import { RegistrationsClient } from "./registrations-client"
import { exportToCSV, exportToPDF } from "./export-utils"
import { Registration } from "@/types/registration"
import { useEffect, useState } from "react"

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/registrations');
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const data: Registration[] = await response.json();
        setRegistrations(data);
        
        // Update counts
        setCounts({
          all: data.length,
          pending: data.filter((r) => r.status === "pending").length,
          confirmed: data.filter((r) => r.status === "confirmed").length,
          rejected: data.filter((r) => r.status === "rejected").length,
        });
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleExportCSV = () => {
    exportToCSV(registrations);
  };

  const handleExportPDF = () => {
    exportToPDF(registrations);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Registrations</h1>
        <div className="flex gap-2">
          <CreateRegistrationDialog />
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <RegistrationsClient registrations={registrations} counts={counts} />
    </div>
  )
}

