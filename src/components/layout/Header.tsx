"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="fixed top-[35px] inset-x-0 z-50 px-4 md:px-8 flex flex-col items-center w-full">
      <div 
        className="relative w-full max-w-6xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Main Hover Pill */}
        <div className="bg-[#2a2a2a]/95 backdrop-blur-md rounded-full shadow-2xl border border-white/10 px-6 py-3 flex items-center justify-between relative z-20">
          <Link href="/" className="flex items-center">
            <Image src="/assets/logo/cmn8bhfz-logo-white.png" alt="theWalk Logo" width={100} height={32} className="object-contain" />
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/about" className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide">About</Link>
            
            {/* Mega Menu Trigger Area */}
            <div className="relative group flex items-center h-full cursor-pointer py-1">
              <span className={`text-sm font-medium transition-colors tracking-wide ${isHovered ? 'text-white' : 'text-white/80'}`}>
                Pathway
              </span>
            </div>

            <Link href="/teachings" className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide">Teachings</Link>
            <Link href="/shop" className="text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide">Shop</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-white/80 hover:text-white hidden md:block">Login</Link>
            <Link href="/get-involved" className="bg-[#fb5e32] hover:bg-[#fb5e32]/90 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-orange-500/20">
              Join theWalk
            </Link>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <div 
          className={`absolute top-[4.5rem] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top z-10 ${
            isHovered ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }`}
        >
          <div className="p-4 flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Left Featured Block */}
            <div className="relative w-full md:w-[35%] min-h-[340px] rounded-2xl overflow-hidden bg-earth-900 text-white p-8 flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <Image 
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop" 
                alt="Journey"
                fill
                className="object-cover"
              />
              <div className="relative z-20">
                <p className="text-[10px] font-medium uppercase tracking-widest text-white/80 mb-2">Learn more about your faith</p>
                <h3 className="text-2xl lg:text-3xl font-medium leading-tight">Begin your spiritual<br/>transformation<br/>today</h3>
              </div>
            </div>

            {/* Middle Product Links */}
            <div className="flex-1 py-6">
              <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Pathways</h4>
              <div className="flex flex-col gap-6">
                <Link href="/journey/cross-over" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fb5e32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-gray-400 font-bold text-lg group-hover:text-[#fb5e32] transition-colors relative z-10">1</span>
                  </div>
                  <div>
                    <h5 className="text-gray-900 font-medium group-hover:text-[#fb5e32] transition-colors">Cross Over</h5>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">Enter a place of restoration, support, and profound transformation.</p>
                  </div>
                </Link>
                <Link href="/journey/cross-roads" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fb5e32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-gray-400 font-bold text-lg group-hover:text-[#fb5e32] transition-colors relative z-10">2</span>
                  </div>
                  <div>
                    <h5 className="text-gray-900 font-medium group-hover:text-[#fb5e32] transition-colors">Cross Roads</h5>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">Grow deeply in your identity, absolute truth, and spiritual direction.</p>
                  </div>
                </Link>
                <Link href="/journey/cross-connect" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fb5e32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-gray-400 font-bold text-lg group-hover:text-[#fb5e32] transition-colors relative z-10">3</span>
                  </div>
                  <div>
                    <h5 className="text-gray-900 font-medium group-hover:text-[#fb5e32] transition-colors">Cross Connect</h5>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">Build enduring community, fellowship, and expand into Kingdom impact.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Links */}
            <div className="w-full md:w-[25%] py-6 flex flex-col gap-10">
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Learn More</h4>
                  <div className="flex flex-col gap-4">
                    <Link href="/teachings" className="text-sm font-medium text-gray-900 hover:text-[#fb5e32] transition-colors">Teachings & Media</Link>
                    <Link href="/about" className="text-sm font-medium text-gray-900 hover:text-[#fb5e32] transition-colors">Our Why</Link>
                    <Link href="/donations" className="text-sm font-medium text-gray-900 hover:text-[#fb5e32] transition-colors flex items-center gap-2">
                      Give <span className="text-[10px] text-[#fb5e32] uppercase tracking-wider font-bold">[Impact]</span>
                    </Link>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Other</h4>
                  <div className="flex flex-col gap-4">
                    <Link href="/shop" className="text-sm font-medium text-gray-900 hover:text-[#fb5e32] transition-colors">Shop Resources</Link>
                    <Link href="/contact" className="text-sm font-medium text-gray-900 hover:text-[#fb5e32] transition-colors">Contact Us</Link>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
