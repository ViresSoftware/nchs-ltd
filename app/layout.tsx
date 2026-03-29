import Script from "next/script";
import Header from "@/components/layout/header";
import "./globals.css";
import Footer from "@/components/layout/footer";
import { Inter, Playfair_Display } from "next/font/google";
// import { RestrictionProvider } from "@/context/RestrictionContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional for CSS variables
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "NCHS LTD",
  description: "Private access to the world’s most valuable assets — secured, verified, confidential.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-VCKJB3J6F0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VCKJB3J6F0');
          `}
        </Script>
        {/* <RestrictionProvider> */}
          <Header />
          <main className="font-inter">{children}</main>
          <Footer />
        {/* </RestrictionProvider> */}
      </body>
    </html>
  );
}
