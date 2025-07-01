"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-[500px] lg:min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* YouTube Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
           <iframe
          className="absolute top-1/2 left-1/2"
          style={{
            width: "1905px",
            height: "1071.56px",
            transform: "translate(-50%, -50%)",
          }}
          src="https://www.youtube.com/embed/xLq5FH0gYb4?si=-en4RRM9HJRk2rpW&autoplay=1&mute=1&controls=0&loop=1&playlist=xLq5FH0gYb4&modestbranding=1&rel=0&showinfo=0&playsinline=1"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Integration Background Video"
        ></iframe>
        </div>
      </div>

      {/* Overlay Content */}
      <div className="text-white relative z-10 px-6 max-w-xl lg:max-w-2xl text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-semibold mb-4">NCHS LTD</h1>
        <p className="md:text-lg md:text-xl mb-6">
          Private Access to the World’s Most Valuable Assets — Secured, Verified, Confidential.
        </p>
        <a href="#contact">
          <Button variant="default" className="bg-[#b28f3f] hover:bg-[#b28f3f] text-black hover:opacity-90">
            Initiate Private Inquiry
          </Button>
        </a>
      </div>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />
    </motion.section>
  );
}
