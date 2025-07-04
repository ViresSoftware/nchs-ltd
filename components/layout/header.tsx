"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
import { Menu, X, Lock } from "lucide-react"; // for toggle icons

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      console.log('handleSmoothScroll')
      const anchor = (e.target as HTMLElement).closest("a[href^='/#'], a[href^='#']") as HTMLAnchorElement;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || (!href.startsWith("#") && !href.startsWith("/#"))) return;

      const targetId = href.replace(/^\/?#/, "");
      const targetElement = document.getElementById(targetId);
      const header = document.getElementById("main-header");

      if (targetElement && header) {
        e.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 w-full z-50 text-white ${
        scrolled || menuOpen ? "bg-black" : "bg-transparent"
      }`}
      style={{ transition: 'all 500ms' }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-0">
        {/* Logo */}
        <Link href="/#hero" scroll={true} className="flex items-center space-x-2">
          <Image src={logo} alt="NCHS LTD Logo" width={100} height={40} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* <Link href="#hero" scroll={true} className="hover:text-[#b28f3f]">Home</Link> */}
          <Link href="/about" scroll={true} className="hover:text-[#b28f3f]">About</Link>
          <Link href="#commodities" scroll={true} className="hover:text-[#b28f3f]">Offerings</Link>
          <Link href="#privacy" scroll={true} className="hover:text-[#b28f3f]">Protocols</Link>
          <Link href="#contact" scroll={true} className="hover:text-[#b28f3f]">Inquiry</Link>
        </nav>

        {/* Secure Login (Desktop) */}
        <Button variant="outline" size="sm" asChild className="bg-black">
          <Link href="/login" className="ml-4 hidden md:inline-flex flex-row">
            <span>Secure Login</span>
            <Lock size={18} className="ml-2" />
          </Link>
        </Button>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden text-white px-6 pb-4 space-y-4 font-medium">
          {/* <Link href="#hero" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Home</Link> */}
          <Link href="/about" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="#commodities" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Offerings</Link>
          <Link href="#privacy" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Protocols</Link>
          <Link href="#contact" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Inquiry</Link>
          <Button variant="outline" size="lg" className="w-full justify-between bg-black" asChild>
            <Link href="/login" className="flex justify-between w-full items-center">
              <span>Secure Login</span>
              <Lock size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
