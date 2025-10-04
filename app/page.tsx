"use client";
import Features from "@/components/section/features.section";
import Footer from "@/components/section/footer.section";
import WebPlatform from "@/components/section/home.section";
import CommunitySection from "@/components/section/joinus.section";
import WhatItDoes from "@/components/section/whatItDoes.section";


export default function Home() {
  return (
   <div className="flex min-h-screen flex-col items-center justify-between">
     <WebPlatform/>
     <Features/>
     <WhatItDoes/>
     <CommunitySection/>

     <Footer/>
    </div>
  );
}
