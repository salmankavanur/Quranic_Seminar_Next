import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-8 bg-muted/40">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Numerical Quran Seminar</h3>
          <p className="text-sm text-muted-foreground">
            A national seminar exploring the numerical patterns in the Holy Quran, highlighting their role as evidence
            of divine precision and authenticity.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
                Register
              </Link>
            </li>
            <li>
              <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground">
                Submit Abstract
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <address className="not-italic">
            <p className="text-sm text-muted-foreground">Abode Islamic Centre</p>
            <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
            <p className="text-sm text-muted-foreground">contact@numericalquran.org</p>
          </address>
        </div>
      </div>

      <div className="container mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
        © {currentYear} National Seminar on Numerical Inimitability in the Holy Quran. All rights reserved.
      </div>
    </footer>
  )
}

