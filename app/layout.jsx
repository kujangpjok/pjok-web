import "./globals.css"; // sekarang valid karena filenya ada di /app

export const metadata = {
  title: "Aplikasi PJOK",
  description: "PJOK Web App (PWA)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
