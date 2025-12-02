"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Lock, LockOpen } from "lucide-react";
import logo from "/logo-horizontal.png";
import Image from "next/image";

export default function RestrictedContent({ children }: { children?: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // <-- Added for errors

  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified === "true") setIsVerified(true);
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    setErrorMessage(""); // clear previous errors
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("https://nchsltdadmin.com/wp-json/nchsltd/v1/email-verification", { email });
      if (res.data.success) {
        setStep("otp");
        setSuccessMessage("✅ OTP sent to your email!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(`${res.data.message}`);
      }
    } catch {
      setErrorMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setErrorMessage(""); 
    if (otp.length !== 6) {
      setErrorMessage("Enter 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://nchsltdadmin.com/wp-json/nchsltd/v1/verify-otp",
        { email, otp }
      );
      console.log("OTP Verification Response:", res.data);

      if (res.data.success) {
        setSuccessMessage("✅ Verified!");
        await submitToCF7();
        setTimeout(() => {
          setIsVerified(true)
          localStorage.setItem("emailVerified", "true");
        }, 3000);
      } else {
        setErrorMessage(res.data.message);
      }
    } catch (err: unknown) {
      // Narrow the type to AxiosError
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data) {
          setErrorMessage(
            (err.response.data as { message?: string }).message || "Something went wrong."
          );
          console.log("Error Response Data:", err.response.data);
        } else {
          setErrorMessage("Network error.");
          console.log("Axios Error:", err.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
        console.log("Unknown Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitToCF7 = async () => {
    try {
      const formData = new FormData();
      formData.append("_wpcf7", "14");
      formData.append("_wpcf7_version", "5.9.3"); // adjust to match your CF7 version
      formData.append("_wpcf7_locale", "en_US");
      formData.append("_wpcf7_unit_tag", "wpcf7-f14-o1");
      formData.append("_wpcf7_container_post", "0");
      formData.append("user-email", email); // CF7 field
      const res = await axios.post(
        "https://nchsltdadmin.com/wp-json/contact-form-7/v1/contact-forms/55/feedback",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status === "mail_sent") {
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Network Error");
      }
    } catch {
      setErrorMessage("Network Error");
    }
  };

  return (
    <>
      <div className={isVerified ? "" : "blur-sm pointer-events-none select-none"}>{children}</div>
      {!isVerified && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", pointerEvents: "auto" }}
        >
          <div className="bg-[#111]/90 backdrop-blur-xl text-white max-w-lg w-full mx-4 rounded-xl border border-[#222] p-10 shadow-2xl space-y-6 animate-[fadeIn_.4s_ease]">
            <Image className="mx-auto mb-2" src='/logo.png' alt="logo" width={120} height={30}/>
            {step === "email" && (
              <>
                <h2 className="text-xl font-semibold mb-2">Restricted Access</h2>
                <p className="text-gray-300 font-light leading-relaxed">
                  This website content is restricted to legitimate visitors only. Enter a valid email
                  address to receive a verification code.
                </p>
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  Enter Email Verification Code
                </h2>
                <p className="text-gray-300 font-light leading-relaxed">
                  Check your email and enter the 6-digit code to access the content.
                </p>
              </>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                step === "email" ? sendOtp() : verifyOtp();
              }}
              className="space-y-6 mt-6"
            >
              {step === "email" && (
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-white bg-black/40 border border-[#2e2e2e] py-3 rounded-lg focus:ring-[#20B2AA] focus:border-[#20B2AA]"
                  required
                />
              )}
              {step === "otp" && (
                <div className="border border-[#fcd770]/40 rounded-lg py-2 px-4 text-center text-4xl font-bold tracking-[0.25em] bg-black/40">
                  <Input
                    type="text"
                    placeholder="______"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-transparent text-center border-none focus-visible:ring-0 text-4xl"
                  />
                </div>
              )}

              {errorMessage && <div className="text-red-400 text-center">{errorMessage}</div>}
              {successMessage && <div className="text-green-400 text-center">{successMessage}</div>}

              <button
                type="submit"
                className="w-full py-3 neon-gold-btn text-black font-semibold
                hover:neon-gold-btn hover:text-black transition duration-300 shadow-lg 
                hover:shadow-[0_0_15px_#20B2AA] !flex items-center justify-center gap-2"
              >
                {isVerified ? (
                  <LockOpen className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
                {step === "email" ? "Send Verification Code" : "Verify Code"}
              </button>
            </form>

            <p className="text-center text-gray-300 text-sm">This code will expire in 5 minutes.</p>
            <div className="pt-6 border-t border-[#222] text-center text-gray-500 text-xs">
              © 2025 NCHS LTD. All rights reserved. <br />
              This is an automated message, please do not reply.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
