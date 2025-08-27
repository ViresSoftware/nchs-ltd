"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import logo from "@/public/logo-horizontal.png";
import { Menu, X, Lock } from "lucide-react";
import LoginForm from "../form/Login";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

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

  const navItems = [
    { href: "/about", label: "About" },
    { href: "/#commodities", label: "Offerings" },
    { href: "/#privacy", label: "Protocols" },
    { href: "/#contact", label: "Inquiry" },
    { href: "/client-information-sheet", label: "Client Information Sheet" },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 w-full z-50 text-white py-4 ${
        scrolled || menuOpen ? "bg-black" : "bg-transparent"
      }`}
      style={{ transition: 'all 500ms' }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-0">
        {/* Logo */}
        <Link href="/#hero" scroll={true} className="flex items-center space-x-2">
          <Image src={logo} alt="NCHS LTD Logo" width={192} height={40} priority />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} scroll={true} className="font-playfair hover:text-[#b28f3f]">
              {label}
            </Link>
          ))}
        </nav>

        {/* Secure Login (Desktop) */}
        <Button
          variant="outline"
          size="sm"
          className="bg-black ml-4 hidden lg:inline-flex flex-row items-center justify-between"
          onClick={() => setLoginDialogOpen(true)}
        >
          <Lock size={18} className="mr-1" />
          <span>Secure Login</span>
        </Button>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden text-white px-6 pb-4 space-y-4 font-medium">
          {/* <Link href="#hero" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Home</Link> */}
          <Link href="/about" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/#commodities" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Offerings</Link>
          <Link href="/#privacy" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Protocols</Link>
          <Link href="/#contact" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Inquiry</Link>
          <Link href="/client-information-sheet" scroll={true} className="block hover:text-[#b28f3f]" onClick={() => setMenuOpen(false)}>Client Information Sheet</Link>
          <Button
            variant="outline"
            size="lg"
            className="bg-black w-full justify-center"
            onClick={() => setLoginDialogOpen(true)}
          >
            <Lock size={18} className="mr-1" />
            <span className="text-center">Secure Login</span>
          </Button>
        </div>
      )}

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="bg-black text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Secure Login</DialogTitle>
            <DialogDescription>Enter your credentials to access your account.</DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </header>
  );
}
