import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-card py-10 px-4 text-sm">
      <div className="max-w-6xl grid gap-4 sm:flex mx-auto sm:justify-between mb-10 items-center">
        <div className="space-y-2 flex flex-col items-center md:items-start">
          <Link href="/#hero" scroll={true}>
            <Image src={logo} alt="NCHS LTD Logo" width={130} height={40} priority />
          </Link>
          <p className="font-playfair text-muted-foreground text-xs mt-[-10px] mx-auto">Established 2020</p>
        </div>
        <nav className="text-md font-medium text-muted-foreground flex flex-col sm:flex-row sm:gap-6 sm:items-center">
          <Link href="/#hero" scroll={true} className="block hover:text-[#b28f3f]">Home</Link>
          <Link href="/about" scroll={true} className="block hover:text-[#b28f3f]">About</Link>
          <Link href="/#commodities" scroll={true} className="block hover:text-[#b28f3f]">Offerings</Link>
          <Link href="/#privacy" scroll={true} className="block hover:text-[#b28f3f]">Protocols</Link>
          <Link href="/#contact" scroll={true} className="block hover:text-[#b28f3f]">Inquiry</Link>
          <Link href="/client-information-sheet" scroll={true} className="block hover:text-[#b28f3f]">Client Information sheet</Link>
        </nav>
        <div className="text-md text-muted-foreground leading-relaxed flex items-center gap-2">
          <Building2 size={18} />
          <p>Cayman Islands</p>
        </div>
      </div>
      <div className="mt-6 text-center space-y-1 text-xs">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} NCHS LTD. All rights reserved.
        </p>
        <p className="text-[#b28f3f]">
          This site is confidential and monitored. Unauthorized use is prohibited.
        </p>
        <a
          href="/privacy-policy"
          className="underline opacity-50 hover:opacity-100"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
