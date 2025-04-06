"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ChevronLeft, Download, Mail, Phone, Calendar, User, QrCode, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { motion, AnimatePresence } from "framer-motion"

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
  const [mounted, setMounted] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    // Validate that at least one field is filled based on search type
    if (searchType === "email" && !values.email) {
      form.setError("email", { message: "Email is required" });
      return;
    }
    if (searchType === "phone" && !values.phone) {
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

      const url = new URL("/api/my-badge", window.location.origin);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(error => {
        throw error;
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        throw new Error("Failed to parse response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch badge");
      }

      if (!data.badge) {
        throw new Error("No badge data received");
      }

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

  return (
    <div className="container max-w-3xl py-8 md:py-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="group gap-2 transition-all">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>View Your Digital Badge</CardTitle>
                <CardDescription>
                  Enter your registered email address or phone number to view your digital badge.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {!badge ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form {...form}>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const values = form.getValues();
                        
                        // Validate based on search type
                        if (searchType === "email") {
                          if (!values.email) {
                            form.setError("email", { message: "Email is required" });
                            return;
                          }
                        } else {
                          if (!values.phone) {
                            form.setError("phone", { message: "Phone is required" });
                            return;
                          }
                        }
                        
                        onSubmit(values);
                      }} 
                      className="space-y-6"
                    >
                      <Tabs 
                        value={searchType} 
                        onValueChange={handleSearchTypeChange}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 p-1">
                          <TabsTrigger 
                            value="email"
                            className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="phone"
                            className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Phone</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email" className="mt-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Email Address</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your registered email" 
                                      type="email"
                                      autoComplete="email"
                                      className="bg-background"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="phone" className="mt-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Phone Number</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your registered phone number" 
                                      type="tel"
                                      autoComplete="tel"
                                      className="bg-background"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 group"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            <span>Searching...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>View Badge</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground px-8">
                        Enter the same email or phone number that you used during registration
                      </p>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div 
                  key="badge"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="pb-4"
                  ref={badgeRef}
                >
                  <div className="relative bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background rounded-lg p-6 border border-emerald-100 dark:border-emerald-900/30 mb-6">
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs rounded-full">
                        {badge?.status || 'Valid'}
                      </Badge>
                    </div>
                    
                    <div className="text-center space-y-5 mt-4">
                      <h2 className="text-2xl font-bold">Digital Badge</h2>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{badge?.participant_name}</h3>
                        <Badge variant="secondary" className="text-sm font-normal">
                          {badge?.participant_type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-center py-4">
                        <div className="bg-white p-4 rounded-lg shadow-md w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-900/30">
                          <Image
                            src={badge?.qr_code || ''}
                            alt="Badge QR Code"
                            width={220}
                            height={220}
                            className="object-contain"
                            priority
                            quality={100}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-center gap-4 py-3 px-4 rounded-lg bg-background border border-border">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Issued On</p>
                            <p className="text-sm font-medium">
                              {new Date(badge?.issued_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center border-l border-border pl-4">
                            <p className="text-xs text-muted-foreground">Badge ID</p>
                            <p className="text-sm font-medium">{badge?.id?.substring(0, 8)}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-1.5">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>Present this QR code at the seminar for verification</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setBadge(null)}
                      className="px-3"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Search
                    </Button>
                    
                    <Button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {downloading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="border-t bg-muted/20 p-4">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Quranic Seminar - April 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Keep your badge ID safe</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}