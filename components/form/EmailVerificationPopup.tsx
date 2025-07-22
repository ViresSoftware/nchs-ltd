// components/EmailVerificationPopup.tsx
'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lock } from "lucide-react";

export default function EmailVerificationPopup() {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified === "true") {
      setIsVerified(true);
      setShowDialog(false);
    }
  }, []);

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      localStorage.setItem("emailVerified", "true");
      setIsVerified(true);
      setShowDialog(false);
    } else {
      alert("❌ Please enter a valid email address.");
    }
  };

  return (
    <Dialog open={showDialog}>
      <DialogContent className="max-w-sm text-center space-y-6">
        <h2 className="text-2xl font-semibold">Email Verification Required</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            placeholder="your@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            <Lock className="mr-2 h-4 w-4" /> Submit
          </Button>
        </form>
        <p className="text-xs text-gray-500">We verify visitors before granting access.</p>
      </DialogContent>
    </Dialog>
  );
}
