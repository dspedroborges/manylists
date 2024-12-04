import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Many Lists",
  description: "Create as many lists as you want and save them in your browser or share them with people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-bl from-black to-gray-800`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex justify-around items-center">
            <li>
              <Link className="hover:underline" href="/">Home</Link>
            </li>
            <li>
              <Link className="hover:underline" href="/saved">Saved</Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
