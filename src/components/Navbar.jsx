import React, { useState } from 'react';
import { 
  Sprout, 
  HelpCircle, 
  TrendingUp, 
  Bot,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  lang,
  setLang,
  mode,
  setMode,
  t,
  onOpenJudgeModal,
  onOpenMandiMitra,
  onOpenPlanBuilder,
  onScrollTo
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    onScrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5EF] border-b border-[#E3DFD2]">
      {/* Top micro banner for Cooperative context */}
      <div className="bg-[#173B2B] text-[#F7F5EF] text-xs px-3 sm:px-6 py-1.5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#B59658] animate-pulse flex-shrink-0"></span>
          <span className="font-medium text-[#EBE8DE] text-[11px] sm:text-xs truncate">
            {t.cooperativeLabel}: <strong className="text-white">Rampura FPO (Kota)</strong>
          </span>
          <span className="text-[#8FA58E] hidden md:inline">•</span>
          <span className="text-[#8FA58E] text-[11px] hidden md:inline">184 Members</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-emerald-300 text-[11px] hidden sm:inline-flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Data.gov.in AGMARKNET: <span className="text-white font-semibold">Live Feed (Today 09:45 AM)</span>
          </span>
          <button
            onClick={onOpenJudgeModal}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded bg-[#B59658]/20 text-[#D4BA7B] hover:bg-[#B59658]/30 border border-[#B59658]/40 transition whitespace-nowrap flex-shrink-0"
          >
            <HelpCircle className="w-3 h-3 flex-shrink-0" />
            <span>{t.judgeTourBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Wordmark (flex-shrink-0 guaranteed) */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-shrink-0" 
          onClick={() => handleNavClick('hero')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#173B2B] flex items-center justify-center text-[#F7F5EF] shadow-sm flex-shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#B59658]" />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#173B2B] leading-none">
                {t.brand}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#EEEDE7] text-[#315C43] font-bold border border-[#E3DFD2]">
                v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#68736C] tracking-tight font-medium mt-0.5 whitespace-nowrap hidden xs:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center Nav Links (Desktop >= 1280px for spacious layout with zero overlap) */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-sm font-medium text-[#1D2420] flex-shrink-0">
          <button 
            onClick={() => handleNavClick('hero')} 
            className="hover:text-[#173B2B] transition py-1 border-b-2 border-transparent hover:border-[#173B2B] whitespace-nowrap"
          >
            {lang === 'hi' ? "डैशबोर्ड" : "Dashboard"}
          </button>
          <button 
            onClick={() => handleNavClick('story')} 
            className="hover:text-[#173B2B] transition py-1 border-b-2 border-transparent hover:border-[#173B2B] whitespace-nowrap"
          >
            Price ≠ Profit
          </button>
          <button 
            onClick={() => handleNavClick('schedule')} 
            className="hover:text-[#173B2B] transition py-1 border-b-2 border-transparent hover:border-[#173B2B] whitespace-nowrap"
          >
            {lang === 'hi' ? "रवानगी व जाँच" : "Dispatch & Verification"}
          </button>
          <button 
            onClick={() => handleNavClick('markets')} 
            className="hover:text-[#173B2B] transition py-1 border-b-2 border-transparent hover:border-[#173B2B] whitespace-nowrap"
          >
            {lang === 'hi' ? "मंडी तुलना व टेस्ट" : "Markets & What-If"}
          </button>
          <button 
            onClick={onOpenMandiMitra} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#173B2B]/5 text-[#173B2B] hover:bg-[#173B2B]/10 transition font-semibold whitespace-nowrap border border-[#173B2B]/10"
          >
            <Bot className="w-4 h-4 text-[#315C43]" />
            <span>{t.nav.assistant}</span>
          </button>
        </nav>

        {/* Right Controls (Mode, Language, Actions) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Mode Switch (Farmer vs Expert) */}
          <div className="flex items-center clay-inset p-1 rounded-xl">
            <button
              onClick={() => setMode('farmer')}
              className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                mode === 'farmer' 
                  ? 'clay-button-light text-[#173B2B] font-bold' 
                  : 'text-[#68736C] hover:text-[#1D2420]'
              }`}
            >
              {lang === 'hi' ? "किसान" : "Farmer"}
            </button>
            <button
              onClick={() => setMode('expert')}
              className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                mode === 'expert' 
                  ? 'clay-button-primary text-white font-bold' 
                  : 'text-[#68736C] hover:text-[#1D2420]'
              }`}
            >
              {lang === 'hi' ? "विशेषज्ञ" : "Expert"}
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center clay-inset p-1 rounded-xl">
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                lang === 'en' 
                  ? 'clay-button-primary text-white font-bold' 
                  : 'text-[#68736C] hover:text-[#1D2420]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                lang === 'hi' 
                  ? 'clay-button-primary text-white font-bold' 
                  : 'text-[#68736C] hover:text-[#1D2420]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenPlanBuilder || (() => handleNavClick('schedule'))}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl clay-button-primary text-[#F7F5EF] font-bold text-xs sm:text-sm whitespace-nowrap"
          >
            <TrendingUp className="w-4 h-4 text-[#D4BA7B]" />
            <span>{t.nav.primaryCta}</span>
          </button>

          {/* Mobile Menu Toggle Button (< 1280px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#EEEDE7] text-[#173B2B] border border-[#E3DFD2] flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#E3DFD2] px-4 py-4 space-y-2 shadow-lg animate-fade-in">
          {onOpenPlanBuilder && (
            <button 
              onClick={() => { onOpenPlanBuilder(); setMobileMenuOpen(false); }} 
              className="w-full text-left py-2.5 px-3 rounded-lg bg-[#173B2B] text-white text-sm font-bold flex items-center justify-between"
            >
              <span>{lang === 'hi' ? "नई फसल योजना बनाएं" : "Create Custom Plan"}</span>
              <TrendingUp className="w-4 h-4 text-[#B59658]" />
            </button>
          )}
          <button 
            onClick={() => handleNavClick('hero')} 
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#F7F5EF] text-sm font-semibold text-[#173B2B]"
          >
            {lang === 'hi' ? "डैशबोर्ड" : "Dashboard"}
          </button>
          <button 
            onClick={() => handleNavClick('story')} 
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#F7F5EF] text-sm font-semibold text-[#173B2B]"
          >
            Price ≠ Profit Story
          </button>
          <button 
            onClick={() => handleNavClick('schedule')} 
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#F7F5EF] text-sm font-semibold text-[#173B2B]"
          >
            {lang === 'hi' ? "रवानगी व जाँच" : "Dispatch & Verification"}
          </button>
          <button 
            onClick={() => handleNavClick('markets')} 
            className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#F7F5EF] text-sm font-semibold text-[#173B2B]"
          >
            {lang === 'hi' ? "मंडी तुलना व टेस्ट" : "Markets & What-If"}
          </button>
          <button 
            onClick={() => { onOpenMandiMitra(); setMobileMenuOpen(false); }} 
            className="w-full text-left py-2.5 px-3 rounded-lg bg-[#173B2B]/5 text-sm font-bold text-[#173B2B] flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-[#315C43]" />
            <span>{t.nav.assistant}</span>
          </button>
        </div>
      )}
    </header>
  );
}
