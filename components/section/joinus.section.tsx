import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CommunitySection() {
  return (
    <section className="w-full bg-gray-100 pb-16" suppressHydrationWarning>
      <div className="w-full  grid grid-cols-1 lg:grid-cols-2 gap-8 border-y border-gray-700 max-h-[800px] overflow-hidden   ">
        {/* GitHub Card */}
        <div className="  flex flex-col p-8 lg:p-12">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Engage on Github
            </h2>
            <p className="text-gray-700 text-lg mb-2">
              Don&apos;t trust, verify.
            </p>
            <p className="text-gray-700 text-lg mb-8">
              SolStore is an open-source platform. You want to contribute to the development? Join us and give us a star!
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 rounded-md text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200">
              Go to Github
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* GitHub Interface Mockup */}
          <div className="mt-12">
            <div className="bg-gray-800 rounded-t-lg px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <div className="w-20 h-3 rounded bg-gray-600"></div>
                <div className="w-8 h-3 rounded bg-gray-600"></div>
                <div className="w-8 h-3 rounded bg-gray-600"></div>
                <div className="w-12 h-3 rounded bg-gray-600"></div>
                <div className="w-8 h-3 rounded bg-gray-600"></div>
              </div>
            </div>
            <div className="bg-white border-x border-b border-gray-300 rounded-b-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <div className="w-16 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
              </div>
              <div className="flex gap-2 mb-6">
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
                <div className="w-10 h-2 rounded bg-gray-400"></div>
              </div>

              {/* Table-like structure */}
              <div className="space-y-1">
                <div className="flex gap-4 pb-2 border-b border-gray-200">
                  <div className="w-12 h-2 rounded bg-gray-300"></div>
                  <div className="w-16 h-2 rounded bg-gray-300"></div>
                  <div className="w-16 h-2 rounded bg-gray-300"></div>
                  <div className="ml-auto flex gap-2">
                    <div className="w-12 h-2 rounded bg-gray-300"></div>
                    <div className="w-12 h-2 rounded bg-gray-300"></div>
                    <div className="w-12 h-2 rounded bg-gray-300"></div>
                  </div>
                </div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <div className="flex-1 flex gap-4">
                      <div className="w-24 h-2 rounded bg-gray-400"></div>
                      <div className="w-32 h-2 rounded bg-gray-400"></div>
                      <div className="ml-auto w-16 h-2 rounded bg-gray-400"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discord Card */}
        <div className="bg-white   border-l border-gray-700   flex flex-col p-8 lg:p-12">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Join us on Discord
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Have questions, need support, or want to connect with other users and developers? Our Discord community is here to help!
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 rounded-md text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200">
              Join the Discord
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Discord Interface Mockup */}
          <div className="mt-12">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Discord header */}
              <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                  <div className="w-24 h-3 rounded bg-gray-700"></div>
                  <div className="w-6 h-3 rounded-full bg-gray-700"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  </div>
                  <div className="w-32 h-6 rounded bg-gray-700"></div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="bg-gray-800 w-16 py-3 flex flex-col items-center gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
                  ))}
                </div>

                {/* Channels */}
                <div className="bg-gray-750 w-48 py-3 px-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700">
                      <span className="text-gray-500 text-xs">#</span>
                      <div className="w-24 h-2 rounded bg-gray-600"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600 ml-auto"></div>
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 bg-gray-700 p-4">
                  {/* Message thread */}
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-32 h-3 rounded bg-gray-600"></div>
                          <div className="w-full h-2 rounded bg-gray-600"></div>
                        </div>
                      </div>
                    ))}

                
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="bg-gray-750 w-48 py-3 px-3 space-y-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-600"></div>
                      <div className="w-28 h-2 rounded bg-gray-600"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}