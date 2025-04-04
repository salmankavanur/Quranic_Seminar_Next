import type React from "react"
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mb-2 text-emerald-500">Numerical Quran Admin</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-white">Admin Login</h2>
        {children}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-400 hover:text-white">
            Return to public site
          </a>
        </div>
      </div>
    </div>
  )
}

