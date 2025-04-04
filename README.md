# Quranic Seminar Platform

A modern web application built with Next.js for managing and participating in Quranic seminars.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive admin interface for managing seminars and users
- **Certificate Management**: System for generating and managing certificates
- **Abstract/Paper Submission**: Platform for submitting and managing research papers and abstracts
- **Contact System**: Built-in contact form for user inquiries
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern UI Components**: Built with Radix UI and other modern component libraries

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Storage**: Supabase (for file storage and management)
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context
- **PDF Generation**: jsPDF
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/salmankavanur/Quranic_Seminar_Next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add the necessary environment variables:
```env
# Add your environment variables here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
├── app/                 # Next.js app directory
│   ├── about/          # About page
│   ├── actions/        # Server actions
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── certificates/   # Certificate management
│   ├── contact/        # Contact page
│   ├── register/       # Registration page
│   └── submit/         # Submission page
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── public/            # Static assets
└── styles/            # Global styles
```

## 🚀 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Add your environment variables here
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for the accessible components
- All contributors and maintainers 