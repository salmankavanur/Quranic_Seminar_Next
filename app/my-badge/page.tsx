"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Download } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Simplified form schema without the type field
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address.").optional(),
  phone: z.string().min(10, "Please enter a valid phone number.").optional(),
}).superRefine((data, ctx) => {
  if (!data.email && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide either email or phone number",
      path: ["email"],
    });
  }
});

export default function MyBadgePage() {
  const [badge, setBadge] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [searchType, setSearchType] = useState<"email" | "phone">("email")
  const badgeRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  })

  // Handle search type change
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as "email" | "phone");
    form.reset({ email: "", phone: "" });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values); // Debug log
    
    // Validate that at least one field is filled based on search type
    if (searchType === "email" && !values.email) {
      console.log("Email required but not provided"); // Debug log
      form.setError("email", { message: "Email is required" });
      return;
    }
    if (searchType === "phone" && !values.phone) {
      console.log("Phone required but not provided"); // Debug log
      form.setError("phone", { message: "Phone number is required" });
      return;
    }

    setLoading(true);
    setBadge(null);

    try {
      const payload = {
        email: searchType === "email" ? values.email?.trim() : undefined,
        phone: searchType === "phone" ? values.phone?.trim() : undefined,
      };
      console.log("Sending request with payload:", payload); // Debug log

      // Log the full URL being called
      const url = new URL("/api/my-badge", window.location.origin);
      console.log("Calling API endpoint:", url.toString());

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(error => {
        console.error("Fetch error:", error);
        throw error;
      });

      console.log("Response received:", response.status, response.statusText); // Debug log
      
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType); // Debug log

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data); // Debug log
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        const text = await response.text();
        console.log("Raw response:", text);
        throw new Error("Failed to parse response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch badge");
      }

      if (!data.badge) {
        throw new Error("No badge data received");
      }

      console.log("Setting badge data:", data.badge); // Debug log
      setBadge(data.badge);
      
      // Show success message
      toast({
        title: "Success",
        description: "Badge found successfully!",
      });
    } catch (error) {
      console.error("Error in badge fetch:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch badge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async () => {
    if (!badge || !badgeRef.current) {
      return;
    }

    try {
      setDownloading(true);

      // Create a new jsPDF instance in portrait mode
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set up the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // margin in mm

      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      const title = "Digital Badge - Quranic Seminar";
      const titleWidth = pdf.getTextWidth(title);
      pdf.text(title, (pageWidth - titleWidth) / 2, margin + 10);

      // Add participant name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      const name = badge.participant_name;
      const nameWidth = pdf.getTextWidth(name);
      pdf.text(name, (pageWidth - nameWidth) / 2, margin + 40);

      // Add participant type
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      const type = badge.participant_type;
      const typeWidth = pdf.getTextWidth(type);
      pdf.text(type, (pageWidth - typeWidth) / 2, margin + 50);

      // Create a temporary div for QR code
      const tempDiv = document.createElement('div');
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.width = '400px';
      tempDiv.style.height = '400px';
      tempDiv.style.display = 'flex';
      tempDiv.style.alignItems = 'center';
      tempDiv.style.justifyContent = 'center';
      
      // Create image element for QR code
      const qrImg = document.createElement('img');
      qrImg.src = badge.qr_code;
      qrImg.style.width = '360px';
      qrImg.style.height = '360px';
      qrImg.style.objectFit = 'contain';
      
      tempDiv.appendChild(qrImg);
      document.body.appendChild(tempDiv);

      // Capture QR code with high quality
      const qrCanvas = await html2canvas(tempDiv, {
        backgroundColor: 'white',
        scale: 4,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Calculate QR code dimensions and position
      const qrWidth = 100; // Larger QR code
      const qrHeight = 100;
      const qrX = (pageWidth - qrWidth) / 2;
      const qrY = margin + 70;

      // Add the QR code image with high quality
      pdf.addImage(
        qrCanvas.toDataURL('image/png', 1.0),
        'PNG',
        qrX,
        qrY,
        qrWidth,
        qrHeight
      );

      // Add verification text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const verificationText = "Present this QR code at the seminar for attendance verification.";
      const verificationWidth = pdf.getTextWidth(verificationText);
      pdf.text(verificationText, (pageWidth - verificationWidth) / 2, qrY + qrHeight + 10);

      // Add badge ID
      const badgeIdText = `Badge ID: ${badge.id}`;
      const badgeIdWidth = pdf.getTextWidth(badgeIdText);
      pdf.text(badgeIdText, (pageWidth - badgeIdWidth) / 2, qrY + qrHeight + 20);

      // Add footer
      const footerText = "This is an official digital badge for the Quranic Seminar. The QR code can be used for attendance verification.";
      const footerWidth = pdf.getTextWidth(footerText);
      pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - margin);

      // Save the PDF
      pdf.save('digital-badge.pdf');

      toast({
        title: "Success",
        description: "Badge downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download badge",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Update the badge display section to include proper classes for PDF generation
  const BadgeDisplay = () => (
    <div className="mt-8 space-y-6" ref={badgeRef}>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Digital Badge - Quranic Seminar</h2>
        <h3 className="text-xl font-semibold">{badge?.participant_name}</h3>
        <Badge variant="outline" className="text-lg">
          {badge?.participant_type}
        </Badge>
        
        <div className="qr-code flex justify-center py-4">
          <div className="bg-white p-4 w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={badge?.qr_code || ''}
              alt="Badge QR Code"
              width={280}
              height={280}
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Present this QR code at the seminar for attendance verification.
        </p>
        <p className="text-xs text-muted-foreground">
          Badge ID: {badge?.id}
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="gap-2"
        >
          {downloading ? (
            "Downloading..."
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Badge
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>View Your Digital Badge</CardTitle>
          <CardDescription>
            Enter your registered email address or phone number to view your digital badge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submit event triggered");
                
                // Get the current values
                const values = form.getValues();
                console.log("Current form values:", values);
                
                // Validate based on search type
                if (searchType === "email") {
                  if (!values.email) {
                    console.log("Email is required");
                    form.setError("email", { message: "Email is required" });
                    return;
                  }
                } else {
                  if (!values.phone) {
                    console.log("Phone is required");
                    form.setError("phone", { message: "Phone is required" });
                    return;
                  }
                }
                
                // If validation passes, call onSubmit
                console.log("Validation passed, calling onSubmit");
                onSubmit(values);
              }} 
              className="space-y-6"
            >
              <Tabs 
                value={searchType} 
                onValueChange={handleSearchTypeChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Search by Email</TabsTrigger>
                  <TabsTrigger value="phone">Search by Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            autoComplete="email"
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              console.log("Email changed:", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="phone" className="mt-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            type="tel"
                            autoComplete="tel"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              console.log("Phone changed:", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <Button 
                type="submit" 
                disabled={loading}
                onClick={() => console.log("Button clicked")} 
                className="w-full"
              >
                {loading ? "Loading..." : "View Badge"}
              </Button>
            </form>
          </Form>

          {badge && (
            <BadgeDisplay />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 