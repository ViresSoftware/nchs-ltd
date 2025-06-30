"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const videos = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];

export default function Hero() {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * videos.length);
    setVideoSrc(videos[random]);
  }, []);

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-[500px] lg:min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Background Video */}
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

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
      <div className="absolute inset-0 bg-black/50" />
    </motion.section>
  );
}
