"use client"
import React from 'react';
import { Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WebPlatform() {
  return (
    <div className="h-full w-full bg-gray-50" suppressHydrationWarning>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <Flame className="w-4 h-4 text-yellow-400" />
          <span>
            <strong>Create Online Store now!</strong> get started with SolStore, the best Web3 ecommerce platform for creators and developers.
          </span>
        </span>
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-700">
        <div className=" w-full mx-auto px-16 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
           <Image src={'https://sdmntprwestus3.oaiusercontent.com/files/00000000-8eec-61fd-97a8-d6529f12ef68/raw?se=2025-10-03T20%3A21%3A49Z&sp=r&sv=2024-08-04&sr=b&scid=5abd501d-d5a1-55af-812d-9deae88510ca&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-03T07%3A56%3A09Z&ske=2025-10-04T07%3A56%3A09Z&sks=b&skv=2024-08-04&sig=7XUcqGOMdXdVLEtPcv08me0nOjs0kfv4h/WNX6ivMRU%3D'}
           height={80}
           width={80}
           alt='SolStore_Logo'/>
           
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Explore
            </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Features
            </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              How it works?
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium hidden">
              Blog
            </a>
          </nav>

          {/* CTA Button */}
          <Link href='/onboard' className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <h1 className="text-xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Web3 ecommerce for sellers and creators 
            </h1>

            <p className="text-lg  lg:text-sm text-gray-600 leading-relaxed">
              SolStore is a secured and open-source ecommerce platform for web3 sellers , creators and developers to create, manage and sell digital products powered by blockchain technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Get Started
              </button>
              <button className="bg-white text-gray-900 px-8 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300">
                Explore
              </button>
            </div>

            {/* Blockchain Tags */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-purple-400 text-purple-600 font-bold text-sm bg-white">
                 <span className="text-lg"><Image src={'https://res.cloudinary.com/dgvnuwspr/image/upload/c_scale,w_128,h_128,f_auto/earn-sponsors/cfwlwsxdfxawnpw9jad8.jpg'} className='rounded-md' width={30} height={30} alt='superteam_logo'/></span>
                SUPERTEAM NIGERIA
              </span>

              <Image src={'https://earn.superteam.fun/assets/solana-powered.svg'} className='rounded-md' width={150} height={30} alt='superteam_logo'/>
             
            </div>
          </div>

          <div className="h-full flex items-center justify-center p-8">
  <div className="relative w-full max-w-4xl h-full">
    {/* First Box - Behind (Black card) - offset to the LEFT */}
    <div className="absolute top-8 right-8 bg-black rounded-lg h-full w-full max-w-3xl flex items-center justify-center z-10">
     
    </div>
    
    {/* Second Box - On Top (Image card) */}
    <div className="absolute top-0 right-0  overflow-hidden z-20 w-full  h-full">
      <Image
        src={'/solstoreDash.jpg'}
       fill
        alt='SolStore_Dashboard'
        className='w-full h-full border border-gray-700 rounded-lg'
      />
    </div>
  </div>
</div>
    
          <div className="relative w-full   rounded-lg overflow-hidden">
            <div className=' left-0 bg-black w-full h-full z-0'/>

</div>


        </div>
        
      </main>

      
    </div>
  );
}