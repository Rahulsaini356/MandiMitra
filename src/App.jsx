import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PriceVsProfitStory from './components/PriceVsProfitStory';
import FarmerScheduleAndVerification from './components/FarmerScheduleAndVerification';
import LiveRouteMapCard from './components/LiveRouteMapCard';
import MarketComparisonAndSimulator from './components/MarketComparisonAndSimulator';
import MandiMitraAI from './components/MandiMitraAI';
import SalePlanBuilderModal from './components/SalePlanBuilderModal';
import JudgeModal from './components/JudgeModal';
import Footer from './components/Footer';

import { translations } from './i18n/translations';
import { 
  DEFAULT_BATCHES, 
  DEFAULT_VEHICLES, 
  MANDI_DIRECTORY, 
  COOPERATIVE_PROFILE 
} from './data/mandisData';
import { evaluateAllMandis } from './services/decisionEngine';
import { Bot, HelpCircle } from 'lucide-react';

export default function App() {
  // Application State
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [mode, setMode] = useState('farmer'); // 'farmer' | 'expert'
  const [selectedBatch, setSelectedBatch] = useState(DEFAULT_BATCHES[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(DEFAULT_VEHICLES[0]);
  
  // Modals & Panels State
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isMandiMitraOpen, setIsMandiMitraOpen] = useState(false);
  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);

  // Active translation dictionary
  const t = translations[lang] || translations.en;

  // Real Decision Evaluation Memo (Deterministic Optimizer)
  const result = useMemo(() => {
    return evaluateAllMandis({
      mandis: MANDI_DIRECTORY,
      batch: selectedBatch,
      vehicle: selectedVehicle
    });
  }, [selectedBatch, selectedVehicle]);

  // Smooth scroll helper
  const handleScrollTo = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler when farmer creates a custom plan in SalePlanBuilderModal
  const handleApplyCustomPlan = (newBatch, newVehicle) => {
    setSelectedBatch(newBatch);
    if (newVehicle) {
      setSelectedVehicle(newVehicle);
    }
    // Scroll smoothly to see the newly evaluated plan
    handleScrollTo('hero');
  };

  return (
    <div className={`min-h-screen bg-[#F7F5EF] text-[#1D2420] flex flex-col font-sans selection:bg-[#B59658]/20 selection:text-[#173B2B] ${lang === 'hi' ? 'lang-hi' : ''}`}>
      
      {/* 1. Minimal Editorial Navigation (Guaranteed zero text overlap across 360px-4K) */}
      <Navbar
        lang={lang}
        setLang={setLang}
        mode={mode}
        setMode={setMode}
        t={t}
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        onOpenMandiMitra={() => setIsMandiMitraOpen(true)}
        onOpenPlanBuilder={() => setIsPlanBuilderOpen(true)}
        onScrollTo={handleScrollTo}
      />

      <main className="flex-1">
        {/* 2. SECTION 1: Full-Screen 4K Cinematic Dashboard Main Board with Vegetable Benefits & Instant Decision */}
        <HeroSection
          t={t}
          lang={lang}
          batches={DEFAULT_BATCHES}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
          vehicles={DEFAULT_VEHICLES}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          onOpenMandiMitra={() => setIsMandiMitraOpen(true)}
          onOpenPlanBuilder={() => setIsPlanBuilderOpen(true)}
          onScrollToPlan={() => handleScrollTo('schedule')}
          result={result}
        />

        {/* 3. SECTION 2: The Core Rule: Price != Profit (Side-by-Side Arbitrage Story) */}
        <PriceVsProfitStory
          t={t}
          lang={lang}
          result={result}
        />

        {/* 4. SECTION 3: Farmer Dispatch Center (Unified 4-Point Verification + Logistics Journey + Alternative Reasons) */}
        <FarmerScheduleAndVerification
          t={t}
          lang={lang}
          mode={mode}
          result={result}
          selectedBatch={selectedBatch}
          selectedVehicle={selectedVehicle}
        />

        {/* 4.5 SECTION: Live Road Haulage & Driver GPS Routing (OpenStreetMap / OSRM API) */}
        <section id="route-map" className="py-8 sm:py-10 bg-[#F4F1E8] border-t border-b border-[#E3DFD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LiveRouteMapCard
              lang={lang}
              selectedBatch={selectedBatch}
              selectedVehicle={selectedVehicle}
              recommendedMandi={result.recommended}
            />
          </div>
        </section>

        {/* 5. SECTION 4: Reachable Mandi Matrix & What-If Sensitivity Simulator */}
        <MarketComparisonAndSimulator
          t={t}
          lang={lang}
          mode={mode}
          result={result}
          selectedBatch={selectedBatch}
          selectedVehicle={selectedVehicle}
        />
      </main>

      {/* 6. Editorial Trust Footer */}
      <Footer
        t={t}
        lang={lang}
        onScrollTo={handleScrollTo}
      />

      {/* Persistent Floating MandiMitra Trigger with Audio Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMandiMitraOpen(true)}
          className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#173B2B] text-[#F7F5EF] shadow-2xl border-2 border-[#B59658] hover:bg-[#224D39] transition transform hover:scale-105 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#315C43] flex items-center justify-center text-[#B59658] group-hover:rotate-12 transition flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
              <span>{t.assistantBrand}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-[10px] text-[#D4BA7B]">
              {lang === 'hi' ? "🔊 बोलकर पूछें / उत्तर सुनें" : "🔊 Voice Talking Assistant"}
            </div>
          </div>
        </button>
      </div>

      {/* MandiMitra AI Assistant Side Panel with Voice & Speech Recognition */}
      <MandiMitraAI
        isOpen={isMandiMitraOpen}
        onClose={() => setIsMandiMitraOpen(false)}
        t={t}
        lang={lang}
        result={result}
        selectedBatch={selectedBatch}
        selectedVehicle={selectedVehicle}
        onOpenPlanBuilder={() => setIsPlanBuilderOpen(true)}
      />

      {/* Custom Fasal Sale Plan Builder Modal with Agentic Math */}
      <SalePlanBuilderModal
        isOpen={isPlanBuilderOpen}
        onClose={() => setIsPlanBuilderOpen(false)}
        lang={lang}
        vehicles={DEFAULT_VEHICLES}
        onApplyPlan={handleApplyCustomPlan}
      />

      {/* Hackathon Problem 04 Judge Walkthrough & Compliance Modal */}
      <JudgeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        t={t}
        lang={lang}
      />

    </div>
  );
}
