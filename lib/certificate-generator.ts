import { jsPDF } from "jspdf"

// Function to load an image as a data URL
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)
      resolve(canvas.toDataURL("image/jpeg"))
    }
    img.onerror = reject
    img.src = url
  })
}

export async function generateCertificate(data: {
  name: string
  title: string
  date: string
  certificateNumber: string
  templateUrl?: string
}) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Set background color
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 297, 210, "F")

  // Add certificate template if provided
  if (data.templateUrl) {
    try {
      const templateDataUrl = await loadImage(data.templateUrl)
      doc.addImage(templateDataUrl, "JPEG", 0, 0, 297, 210)
    } catch (error) {
      console.error("Error loading template image:", error)
      // If template fails to load, add a border as fallback
      doc.setDrawColor(218, 165, 32) // Gold color
      doc.setLineWidth(5)
      doc.rect(10, 10, 277, 190)
    }
  } else {
    // Add border if no template
    doc.setDrawColor(218, 165, 32) // Gold color
    doc.setLineWidth(5)
    doc.rect(10, 10, 277, 190)
  }

  // Add header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(30)
  doc.setTextColor(218, 165, 32) // Gold color
  doc.text("PAPER PRESENTATION CERTIFICATE", 148.5, 50, { align: "center" })

  // Add content
  doc.setFont("helvetica", "normal")
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("This is to certify that", 148.5, 80, { align: "center" })

  // Add name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.text(data.name, 148.5, 100, { align: "center" })

  // Add description
  doc.setFont("helvetica", "normal")
  doc.setFontSize(16)
  doc.text("has successfully presented a research paper titled", 148.5, 120, { align: "center" })

  // Add paper title
  doc.setFont("helvetica", "italic")
  doc.setFontSize(18)
  doc.text(`"${data.title}"`, 148.5, 135, { align: "center" })

  // Add event details
  doc.setFont("helvetica", "normal")
  doc.setFontSize(16)
  doc.text("at the National Seminar on Numerical Inimitability in the Holy Quran", 148.5, 155, { align: "center" })
  doc.text(`held on ${data.date}`, 148.5, 170, { align: "center" })

  // Add certificate number
  doc.setFontSize(10)
  doc.text(`Certificate No: ${data.certificateNumber}`, 20, 195)

  // Return the PDF as a blob
  return doc.output("blob")
}

