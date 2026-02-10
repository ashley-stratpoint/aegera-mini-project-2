"use client";

import Image from "next/image";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer";
import FloatingImageBlob from '@/components/ui/blob'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FooterSection />
    </div>
  );
}
