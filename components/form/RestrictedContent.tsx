"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestriction } from "@/context/RestrictionContext";
import Image from "next/image";
import { Lock, LockOpen } from "lucide-react";

export default function RestrictedContent({ children }: { children?: React.ReactNode }) {
  const { isVerified, verify } = useRestriction();
  const [email, setEmail] = useState("");

  if (isVerified) return children || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(email);
  };

  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
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
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-lg border border-zinc-700 shadow-md space-y-4 text-center relative z-10">
        <h2 className="text-xl font-bold">Restricted Access</h2>
        <p className="text-sm text-zinc-300">
          This website content is restricted to legitimate visitors only. Enter a valid email address to access.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white"
            required
          />
          <button type="submit" className="neon-gold-btn">
            <Lock className="locked h-5 w-5 mr-2"/>
            <LockOpen className="unlocked h-5 w-5 mr-2"/>
            <span className="text-black">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}