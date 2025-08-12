import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athos Portfolio",
  description: "A minimalist portfolio showcasing web development and design projects with a focus on modern UI and user experience.",
  keywords: ["portfolio", "web developer", "designer", "frontend", "UI/UX", "React", "Next.js"],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
