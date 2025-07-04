import Header from "@/components/layout/header";
import "./globals.css";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "next-themes";
import { Inter, Playfair_Display } from "next/font/google";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="font-inter">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
