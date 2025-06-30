"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Commodities() {
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
          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2 text-white">
              <h3 className="text-md md:text-xl font-semibold font-playfair">Oil & Refined Fuels</h3>
              <p className="text-sm">
                Crude Oil, Jet A1, D2/D6, LNG, LPG — verified allocations only.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2 text-white">
              <h3 className="text-md md:text-xl font-semibold font-playfair">AI & Data Center Infrastructure</h3>
              <p className="text-sm">
                Strategic partnerships for energy-integrated AI optimization in oil logistics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2 text-white">
              <h3 className="text-md md:text-xl font-semibold font-playfair">Solar Energy</h3>
              <p className="text-sm">
                Grid-scale solar investments for institutional and sovereign-level players.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-md md:text-xl font-semibold font-playfair">Gold & Asset-Backed Instruments</h3>
              <p className="text-sm">
                Bullion, Dore Bars, and structured private gold-backed financial vehicles.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-md md:text-xl font-semibold font-playfair">Cryptocurrency</h3>
              <p className="text-sm">
                BTC block trades, USDT/USDC transactions via private execution desks.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-2 lg:py-6 shadow-sm">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-md md:text-xl font-semibold font-playfair">Fine Art</h3>
              <p className="text-sm">
                Discreet acquisition/sale of investment-grade Tier 1 global artworks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
