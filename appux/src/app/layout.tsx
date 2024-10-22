// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from '../components/Nav';
import { ToastContainer } from 'react-toastify';


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
  title: "EvalUX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <section className="min-h-screen flex flex-col">
          <Providers>
            <Nav />
            <ToastContainer />
            {children}
          </Providers>
        </section>
        <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 mt-10" aria-labelledby="footer-heading">
          <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
            <p className="text-sm/6 text-gray-600 max-md:text-center">
              ©
              2024
              <a> EvalUX</a>.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm/6 text-gray-500 md:justify-end">
              <a href="">Politicas de Privacidad</a>
              <div className="h-4 w-px bg-gray-200"></div>
              <a href="">Terminos y Condiciones</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}