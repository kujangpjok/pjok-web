import "./globals.css";

export const metadata = {
  title: "Aplikasi PJOK",
  description: "PJOK Web App (PWA)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* setara status/nav bar terang di Android */}
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
