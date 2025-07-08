"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <motion.section
      id="privacy"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-10 lg:py-20 px-4 bg-card relative bg-[url('/dot-grid-pattern.png')] bg-repeat"
      style={{ backgroundSize: '64px' }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <h2 className="text-3xl font-playfair mb-4">Privacy Protocols & Disclaimers</h2>
        <p className="text-sm mb-4">
          Your trust is protected under institutional-grade security and legal compliance.
        </p>
        <div className="grid gap-4 lg:gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          <Card className="bg-[url('/confidential-notice.jpg')] bg-cover bg-center bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm py-0">
            <CardContent className="p-6 space-y-2 text-white bg-black/70 py-2  lg:py-8 rounded-xl h-full">
              <h3 className="font-semibold text-base font-playfair">CONFIDENTIALITY NOTICE</h3>
              <p className="text-sm">
                This site and all communications are monitored. Unauthorized access or misrepresentation is strictly prohibited.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[url('/security.jpg')] bg-cover bg-center bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm py-0">
            <CardContent className="p-6 space-y-2 text-white bg-black/70 py-2 lg:py-8 rounded-xl h-full">
              <h3 className="font-semibold text-base font-playfair">COMPLIANCE & SECURITY</h3>
              <p className="text-sm">
                We follow strict global compliance protocols (AML/KYC/Asset verification).
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[url('/legal-notice.jpg')] bg-cover bg-center bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm py-0">
            <CardContent className="p-6 space-y-2 text-white bg-black/70 py-2  lg:py-8 rounded-xl h-full">
              <h3 className="font-semibold text-base font-playfair">LEGAL NOTICE</h3>
              <p className="text-sm">
                Fraudulent activity will be reported to the FBI, SEC, INTERPOL, and relevant authorities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
