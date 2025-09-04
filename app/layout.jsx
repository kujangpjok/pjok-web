import "./globals.css";

export const metadata = {
  title: "Aplikasi PJOK",
  description: "PJOK Web App (Splash, Identitas, Menu)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
