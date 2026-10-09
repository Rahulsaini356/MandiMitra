import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ t, lang, onScrollTo }) {
  return (
    <footer className="bg-[#173B2B] text-[#F7F5EF] py-14 border-t border-[#173B2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#315C43] flex items-center justify-center text-[#B59658]">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {t.brand}
              </span>
            </div>
            <p className="text-xs text-[#8FA58E] max-w-md leading-relaxed">
              {t.subtagline}. Empowering farmer producer cooperatives with real-time mandi arbitrage intelligence and transparent logistics planning.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#D4BA7B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in verified AGMARKNET auction feeds & deterministic freight calculations.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F4EEDF] mb-3 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#EBE8DE]">
              <li>
                <button onClick={() => onScrollTo('hero')} className="hover:text-[#B59658] transition">
                  {lang === 'hi' ? "डैशबोर्ड" : "Dashboard"}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('story')} className="hover:text-[#B59658] transition">
                  Price ≠ Profit Story
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('schedule')} className="hover:text-[#B59658] transition">
                  {lang === 'hi' ? "रवानगी व जाँच" : "Dispatch & Verification"}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollTo('markets')} className="hover:text-[#B59658] transition">
                  {lang === 'hi' ? "मंडी तुलना व टेस्ट" : "Markets & What-If"}
                </button>
              </li>
            </ul>
          </div>

          {/* Cooperative Details */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#F4EEDF] mb-3 uppercase tracking-wider">
              Cooperative Deployment
            </h4>
            <div className="text-xs text-[#EBE8DE] space-y-1.5">
              <div className="font-semibold text-white">Rampura FPO Co-op</div>
              <div>Kota District, Rajasthan</div>
              <div>184 Registered Farmers</div>
              <div className="text-[#8FA58E] pt-2">System Version 2.4.0 (Hackathon Edition)</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8FA58E]">
          <div>
            © 2026 WayEzee & MandiMitra. All calculations deterministic and verified.
          </div>
          <div>
            Built with dedication for Indian Agriculture.
          </div>
        </div>

      </div>
    </footer>
  );
}
