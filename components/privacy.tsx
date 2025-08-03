"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Privacy() {
  const privacy_items = [
    {
      image: "/signed-paperwork.jpg",
      alt: "Confidentiality Notice",
      title: "CONFIDENTIALITY NOTICE",
      description: "This site and all communications are monitored. Unauthorized access or misrepresentation is strictly prohibited.",
    },
    {
      image: "/security.jpg",
      alt: "Compliance & Security",
      title: "COMPLIANCE & SECURITY",
      description: "We follow strict global compliance protocols (AML/KYC/Asset verification).",
    },
    {
      image: "/legal-notice.jpg",
      alt: "Legal Notice",
      title: "LEGAL NOTICE",
      description: "Fraudulent activity will be reported to the FBI, SEC, INTERPOL, and relevant authorities.",
    },
  ];

  return (
    <motion.section
      id="privacy"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-16 lg:py-32 px-4 bg-card relative bg-[url('/dot-grid-pattern.png')] bg-repeat"
      style={{ backgroundSize: '64px' }}
    >
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-0" />
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <h2 className="text-3xl font-playfair mb-4">Privacy Protocols & Disclaimers</h2>
        <p className="text-sm mb-8">
          Your trust is protected under institutional-grade security and legal compliance.
        </p>
        <div className="grid gap-4 lg:gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {privacy_items.map(({ image, alt, title, description }) => (
            <Card key={title} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm overflow-hidde p-0 gap-0 border-none">
              <Image
                src={image}
                alt={alt}
                width={600}
                height={300}
                className="w-full object-cover h-48"
              />
              <CardContent className="p-6 space-y-2 text-white bg-black/70 lg:py-8 h-full">
                <h3 className="font-semibold text-base font-playfair">{title}</h3>
                <p className="text-sm">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
