import { PublicNav } from "@/components/public-nav"
import { Footer } from "@/components/footer"
import { ContactForm } from "./contact-form"

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12">
            Have questions about the seminar? We're here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <span className="text-emerald-500 text-xs">✉️</span>
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">quraniclearningfestival@gmail.com</div>
                      <div className="text-sm text-muted-foreground">islamiccentre.akod@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <span className="text-emerald-500 text-xs">📞</span>
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">+91 70345 46331</div>
                      <div className="text-sm text-muted-foreground">+91 62352 04207</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <span className="text-emerald-500 text-xs">📍</span>
                    </div>
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">Abode Islamic Centre</div>
                      <div className="text-sm text-muted-foreground">Virippadam, Akode</div>
                      <div className="text-sm text-muted-foreground">Vazhakkad via, Malappuram</div>
                      <div className="text-sm text-muted-foreground">Kerala, India - 673640</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Seminar Organizing Committee</h2>
                <p className="text-sm text-muted-foreground">For specific inquiries related to:</p>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Abstract submissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Registration process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Accommodation arrangements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Media inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Sponsorship opportunities</span>
                  </li>
                </ul>

                <p className="text-sm text-muted-foreground">Please specify in your message for faster assistance.</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

