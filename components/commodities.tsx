"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function Commodities() {
  const commodities = [
    {
      image: "/oil-refined-fuels.jpg",
      alt: "Oil & Refined Fuels",
      title: "Oil & Refined Fuels",
      description: "Crude Oil, Jet A1, D2/D6, LNG, LPG — verified allocations only.",
    },
    {
      image: "/ai-data-center.jpg",
      alt: "AI & Data Center Infrastructure",
      title: "AI & Data Center Infrastructure",
      description: "Strategic partnerships for energy-integrated AI optimization in oil logistics.",
    },
    {
      image: "/solar-energy.jpg",
      alt: "Solar Energy",
      title: "Solar Energy",
      description: "Grid-scale solar investments for institutional and sovereign-level players.",
    },
    {
      image: "/gold-asset-backed-instruments.jpg",
      alt: "Gold & Asset-Backed Instruments",
      title: "Gold & Asset-Backed Instruments",
      description: "Bullion, Dore Bars, and structured private gold-backed financial vehicles.",
    },
    {
      image: "/cryptocurrency.jpg",
      alt: "Cryptocurrency",
      title: "Cryptocurrency",
      description: "BTC block trades, USDT/USDC transactions via private execution desks.",
    },
    {
      image: "/fine-arts.jpg",
      alt: "Fine Art",
      title: "Fine Art",
      description: "Discreet acquisition/sale of investment-grade Tier 1 global artworks.",
    },
  ];

  return (
    <motion.section
      id="commodities"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-10 lg:py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-playfair text-center mb-10">Our Commodities</h2>
        <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {commodities.map(({ image, alt, title, description }) => (
            <Card key={title} className="bg-zinc-900 text-white rounded-xl border shadow-sm overflow-hidden border-none p-0 gap-0">
              <Image
                src={image}
                alt={alt}
                width={400}
                height={250}
                className="w-full object-cover h-52"
              />
              <CardContent className="p-6">
                <h3 className="text-md md:text-xl font-semibold font-playfair mb-2">{title}</h3>
                <p className="text-sm text-zinc-300">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
