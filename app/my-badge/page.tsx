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
    if (!badgeRef.current) return

    setDownloading(true)
    try {
      // Create a clone of the badge div without the download button
      const badgeDiv = badgeRef.current.cloneNode(true) as HTMLDivElement
      const downloadButton = badgeDiv.querySelector('.download-button')
      if (downloadButton) {
        downloadButton.remove()
      }
      
      // Set white background
      badgeDiv.style.backgroundColor = 'white'
      badgeDiv.style.padding = '20px'
      document.body.appendChild(badgeDiv)

      const canvas = await html2canvas(badgeDiv, {
        scale: 2,
        backgroundColor: 'white',
      })

      document.body.removeChild(badgeDiv)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30 // Add some top margin

      // Add title
      pdf.setFontSize(16)
      pdf.text('Digital Badge - Quranic Seminar', pdfWidth / 2, 20, { align: 'center' })

      // Add image
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Add footer
      pdf.setFontSize(10)
      const footerText = 'This is an official digital badge for the Quranic Seminar. The QR code can be used for attendance verification.'
      const splitFooter = pdf.splitTextToSize(footerText, pdfWidth - 40)
      pdf.text(splitFooter, pdfWidth / 2, pdfHeight - 20, { align: 'center' })

      pdf.save('digital-badge.pdf')

      toast({
        title: "Success",
        description: "Badge has been downloaded successfully.",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to download badge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

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
            <div className="mt-8 space-y-6" ref={badgeRef}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Digital Badge</h3>
                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="download-button gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {downloading ? "Downloading..." : "Download Badge"}
                  </Button>
                </div>
                <div className="grid gap-2">
                  <div>
                    <span className="text-sm font-medium">Name:</span>{" "}
                    <span className="text-sm">{badge.participant_name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Type:</span>{" "}
                    <Badge variant="secondary">{badge.participant_type}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Issued:</span>{" "}
                    <span className="text-sm">
                      {new Date(badge.issued_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status:</span>{" "}
                    <Badge
                      variant={badge.status === "issued" ? "default" : "destructive"}
                    >
                      {badge.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <Image
                    src={badge.qr_code}
                    alt="Badge QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Present this QR code at the seminar for attendance verification.</p>
                <p>Keep your badge ID safe: {badge.id}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 