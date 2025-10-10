"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Lock, LockOpen } from "lucide-react";

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
        setIsVerified(true);
        localStorage.setItem("emailVerified", "true");
        setSuccessMessage("✅ Verified!");
        await submitToCF7();
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
        setSuccessMessage("✅ Email submitted successfully!");
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
          className="fixed inset-0 z-[9999] text-white flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
        >
          <div className="max-w-md w-full bg-zinc-900 p-8 rounded-lg border border-zinc-700 shadow-md space-y-4 text-center relative z-10">
            <h2 className="text-xl font-bold">
              <Lock className="h-5 w-5 mr-2 inline" />
              {step === "email" ? "Restricted Access" : "Enter Email Verification Code"}
            </h2>
            <p className="text-sm text-zinc-300">
              {step === "email"
                ? "This website content is restricted to legitimate visitors only. Enter a valid email address to receive a verification code."
                : "Check your email and enter the 6-digit code to access the content."}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                step === "email" ? sendOtp() : verifyOtp();
              }}
              className="space-y-4"
            >
              {errorMessage && <div className="text-red-500 text-sm font-medium">{errorMessage}</div>} {/* <-- Show error */}

              {step === "email" && (
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-white"
                  required
                />
              )}
              {step === "otp" && (
                <Input
                  type="text"
                  placeholder="Email Verification Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-white"
                  required
                />
              )}
              <button type="submit" className="neon-gold-btn w-full" disabled={loading}>
                <div className="flex justify-center items-center gap-2">
                  {loading ? (
                    <>⏳ {step === "email" ? "Sending Email Verification Coe..." : "Verifying..."}</>
                  ) : (
                    <>
                      {isVerified ? (
                        <LockOpen className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                      <p className="text-black">
                        {step === "email" ? "Send Email Verification Code" : "Verify Email Code"}
                      </p>
                    </>
                  )}
                </div>
              </button>
              {successMessage && <div className="text-green-400 text-sm font-medium">{successMessage}</div>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
