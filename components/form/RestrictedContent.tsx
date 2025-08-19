"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
// import Image from "next/image";
import { Lock, LockOpen } from "lucide-react";

export default function RestrictedContent({ children }: { children?: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified == "true") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, []);

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("_wpcf7", "14");
    formData.append("_wpcf7_version", "5.9.3"); // Adjust to match your Contact Form 7 version
    formData.append("_wpcf7_locale", "en_US");
    formData.append("_wpcf7_unit_tag", "wpcf7-f14-o1"); // Inspect form source to get the correct unit tag
    formData.append("_wpcf7_container_post", "0");
    formData.append("user-email", email); // ✅ Correct field name based on CF7 shortcode

    try {
      const res = await axios.post(
        "https://nchsltdadmin.com/wp-json/contact-form-7/v1/contact-forms/55/feedback",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = res.data;

      if (result.status === "mail_sent") {
        localStorage.setItem("emailVerified", "true");
        setIsVerified(true);
        setSuccessMessage("✅ Email submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 seconds
      } else {
        alert("❌ Submission failed: " + result.message);
      }
    } catch (error) {
      alert("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Always render children (content behind overlay) */}
      <div className={isVerified ? "" : "blur-sm pointer-events-none select-none"}>{children}</div>
      {/* Overlay on top (only shown if not verified) */}
      {!isVerified && (
        <div
          className="fixed inset-0 z-[9999] text-white flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
        >
          <div className="max-w-md w-full bg-zinc-900 p-8 rounded-lg border border-zinc-700 shadow-md space-y-4 text-center relative z-10">
            <h2 className="text-xl font-bold"><Lock className="h-5 w-5 mr-2 inline" /> Restricted Access</h2>
            <p className="text-sm text-zinc-300">
              This website content is restricted to legitimate visitors only. Enter a valid email address to access.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-white"
                required
              />
              <button type="submit" className="neon-gold-btn w-full" disabled={loading}>
                {loading ? (
                  <>⏳ Verifying...</>
                ) : (
                  <>
                    {!isVerified ? (
                      <Lock className="locked h-5 w-5 mr-2 inline" />
                    ) : (
                      <LockOpen className="unlocked h-5 w-5 mr-2 inline" />
                    )}
                    <span className="text-black">Submit</span>
                  </>
                )}
              </button>
              {successMessage && (
                <div className="text-green-400 text-sm font-medium">{successMessage}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
