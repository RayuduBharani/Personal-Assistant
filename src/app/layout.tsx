import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

export const metadata : Metadata = {
  title: "Bharani's Personal Assistante",
  description: "Bharani's AI-powered personal assistant for seamless task management and productivity.",
};


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100" , "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
