import React from 'react';
import { Github, Twitter, Globe, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="w-full flex flex-col bg-gray-50">
      {/* Hero Section */}
      <main className="flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
           Start your web3 store today
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            A powerful, simple and free platform
            <br />
            to create, manage and sell digital products <span className="underline underline-offset-4">everyday.</span>
          </p>
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo Column */}
             <Image src={'https://sdmntprwestus3.oaiusercontent.com/files/00000000-8eec-61fd-97a8-d6529f12ef68/raw?se=2025-10-03T20%3A21%3A49Z&sp=r&sv=2024-08-04&sr=b&scid=5abd501d-d5a1-55af-812d-9deae88510ca&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-03T07%3A56%3A09Z&ske=2025-10-04T07%3A56%3A09Z&sks=b&skv=2024-08-04&sig=7XUcqGOMdXdVLEtPcv08me0nOjs0kfv4h/WNX6ivMRU%3D'}
                     height={80}
                     width={80}
                     alt='SolStore_Logo'/>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* More Column */}
            <div className=''>
              <h3 className="font-semibold text-gray-900 mb-4">More...</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Coming soon...
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                 Coming soon...
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                   Coming soon...
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Coming soon...
                  </a>
                </li>
              </ul>
            </div>

            {/* CTA Column */}
            <div className="flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg h-fit">
          Get started today
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 SolStore.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}