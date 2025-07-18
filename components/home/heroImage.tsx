"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, LockOpen } from 'lucide-react';
import Image from "next/image";
import './hero.css';

export default function Hero() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-[500px] lg:min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <Image
          src="/bank-vault-door-open-gold-cash.jpg"
          alt="Secure Vault"
          fill
          className="object-cover z-0"
          priority
        />
      </div>
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      {/* Overlay Content */}
      <div className="text-white relative z-10 px-6 max-w-xl lg:max-w-2xl text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-semibold mb-4">NCHS LTD</h1>
        <p className="md:text-lg md:text-xl mb-6">
          Private Access to the World’s Most Valuable Assets — Secured, Verified, Confidential.
        </p>
        <Link href="#contact" className="neon-gold-btn">
          <Lock className="locked h-5 w-5 mr-2"/>
          <LockOpen className="unlocked h-5 w-5 mr-2"/>
          <span>Private Inquiry</span>
        </Link>
      </div>

    </motion.section>
  );
}
