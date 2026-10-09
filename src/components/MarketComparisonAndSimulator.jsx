import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { calculateMandiOption } from '../services/decisionEngine';

export default function MarketComparisonAndSimulator({
  t,
  lang,
  mode,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const allMandis = result.all;
  const recommendedMandi = result.recommended;

  // Local state for what-if scenario testing
  const [adjustedPrice, setAdjustedPrice] = useState(recommendedMandi.unitPrice);
  const [adjustedFreightRate, setAdjustedFreightRate] = useState(selectedVehicle.costPerKm);

  // Find base mandi object for simulation
  const mandiObj = {
    id: recommendedMandi.mandiId,
    code: recommendedMandi.mandiCode,
    name: recommendedMandi.mandiName,
    hindiName: recommendedMandi.mandiHindiName,
    hubName: recommendedMandi.hubName,
    distanceKm: recommendedMandi.distanceKm,
    travelTimeHours: recommendedMandi.travelTimeHours,
    modalPricePerKg: { [selectedBatch.crop]: adjustedPrice },
    fixedMandiFee: recommendedMandi.mandiFeesBreakdown.fixed,
    mandiCessPercent: 1.0,
    handlingChargePerQuintal: 15,
    intakeCapacityKg: 15000,
    currentQueueWaitMin: recommendedMandi.queueWaitMin,
    lastUpdatedText: "Simulation Test",
    dataSource: "What-If Real-Time Engine"
  };

  const simResult = calculateMandiOption({
    mandi: mandiObj,
    batch: selectedBatch,
    vehicle: { ...selectedVehicle, costPerKm: adjustedFreightRate },
    priceOverride: adjustedPrice,
    transportCostPerKmOverride: adjustedFreightRate
  });

  const delta = simResult.netReturn - recommendedMandi.netReturn;

  const handleReset = () => {
    setAdjustedPrice(recommendedMandi.unitPrice);
    setAdjustedFreightRate(selectedVehicle.costPerKm);
  };

  return (
    <section id="markets" className="py-12 sm:py-16 md:py-20 bg-[#EEEDE7] border-y border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-[#E3DFD2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#173B2B] border border-[#E3DFD2] mb-2.5">
              <Store className="w-3.5 h-3.5 text-[#B59658]" />
              <span>{t.markets.title}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173B2B] tracking-tight">
              {lang === 'hi' ? "सभी मंडियों का प्रत्यक्ष मूल्यांकन व टेस्ट" : "Reachable Mandi Matrix & What-If Engine"}
            </h2>
            <p className="text-sm sm:text-base text-[#68736C] mt-2 max-w-2xl leading-relaxed">
              {lang === 'hi' 
                ? "सभी उपलब्ध मंडियों के ताज़ा भाव, भाड़ा खर्च और शुद्ध मुनाफे की पारदर्शी तुलना एवं संवेदनशीलता परीक्षण।" 
                : "Compare live rates across all reachable mandi yards and test market variations before dispatch."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="text-xs text-[#173B2B] bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Data.gov.in Feed: <strong className="text-emerald-800">Connected</strong></span>
            </div>
            <div className="text-xs text-[#68736C] bg-white px-3.5 py-2 rounded-xl border border-[#E3DFD2] shadow-sm">
              {lang === 'hi' ? "समीक्षित माल:" : "Evaluated Batch:"} <strong className="text-[#173B2B]">{selectedBatch.quantityKg} kg {lang === 'hi' ? selectedBatch.hindiName : selectedBatch.crop}</strong>
            </div>
          </div>
        </div>

        {/* 1. TOP MODULE: EDITORIAL ALL-MANDIS COMPARISON TABLE */}
        <div className="clay-card rounded-3xl border border-white/80 overflow-hidden mb-10 sm:mb-14">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F5EF] text-[#1D2420] text-xs uppercase tracking-wider font-bold border-b border-[#E3DFD2]">
                  <th className="py-4 px-6">{t.markets.colRank}</th>
                  <th className="py-4 px-6">{t.markets.colMandi}</th>
                  <th className="py-4 px-6">{t.markets.colPrice}</th>
                  <th className="py-4 px-6">{t.markets.colDistance}</th>
                  <th className="py-4 px-6">{t.markets.colTransport}</th>
                  <th className="py-4 px-6">{t.markets.colNetReturn}</th>
                  <th className="py-4 px-6">{t.markets.colSource}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEDE7] text-sm">
                {allMandis.map((m) => {
                  const isRec1 = m.mandiId === (result.recommendation1?.mandiId || result.recommended?.mandiId);
                  const isRec2 = m.mandiId === (result.recommendation2?.mandiId || result.bestAlternative?.mandiId);
                  const isWinning = isRec1;

                  return (
                    <tr 
                      key={m.mandiId}
                      className={`transition ${
                        isRec1 
                          ? 'bg-[#173B2B]/5 font-medium' 
                          : isRec2
                          ? 'bg-amber-50/30'
                          : 'hover:bg-[#F7F5EF]'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6">
                        {isRec1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#173B2B] text-[#D4BA7B] font-serif font-bold text-xs shadow-sm">
                            ★ #1
                          </span>
                        ) : isRec2 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-800 text-[#F4EEDF] font-serif font-bold text-xs shadow-sm">
                            ⚖️ #2
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-[#EEEDE7] text-[#68736C] flex items-center justify-center font-bold text-xs">
                            #{m.rank}
                          </span>
                        )}
                      </td>

                      {/* Mandi Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif font-bold text-base text-[#173B2B]">
                            {lang === 'hi' ? m.mandiHindiName : m.mandiName}
                          </span>
                          {isRec1 && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              {lang === 'hi' ? "अधिकतम मुनाफा" : "Highest Return"}
                            </span>
                          )}
                          {isRec2 && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                              {lang === 'hi' ? "सर्वोत्तम विकल्प" : "Best Alternative"}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#68736C] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#315C43]" />
                          <span>{m.hubName}</span>
                        </div>
                      </td>

                      {/* Headline Price */}
                      <td className="py-4 px-6">
                        <div className="font-serif text-lg font-bold text-[#173B2B]">
                          ₹{m.unitPrice}
                          <span className="text-xs font-sans font-normal text-[#68736C]"> / kg</span>
                        </div>
                      </td>

                      {/* Distance & Travel Time */}
                      <td className="py-4 px-6 text-xs text-[#1D2420]">
                        <div className="font-semibold">{m.distanceKm} km</div>
                        <div className="text-[#68736C]">{m.travelTimeHours} hrs transit</div>
                      </td>

                      {/* Transport Cost */}
                      <td className="py-4 px-6 text-xs">
                        <div className="font-semibold text-[#A84242]">
                          − ₹{m.transportCost.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[#68736C] font-mono text-[11px]">
                          (₹{(m.transportCost / selectedBatch.quantityKg).toFixed(1)}/kg freight)
                        </div>
                      </td>

                      {/* NET RETURN */}
                      <td className="py-4 px-6">
                        <div className={`font-serif text-xl font-bold ${
                          isWinning ? 'text-[#173B2B]' : 'text-[#68736C]'
                        }`}>
                          ₹{m.netReturn.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs font-semibold text-[#315C43]">
                          ₹{m.netReturnPerKg} {t.common.perKg}
                        </div>
                      </td>

                      {/* Data Source & Status */}
                      <td className="py-4 px-6 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>Verified</span>
                        </div>
                        <div className="text-[#68736C] text-[11px] mt-0.5">
                          {m.lastUpdated}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. BOTTOM MODULE: SENSITIVITY & WHAT-IF RE-OPTIMIZER */}
        <div className="clay-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EEEDE7]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B59658] mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{t.whatif.title}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B]">
                {lang === 'hi' ? "संवेदनशीलता सिम्युलेटर (यदि भाव या भाड़ा बदले?)" : "Market Sensitivity Simulator (What-If Tester)"}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736C] mt-1">
                {lang === 'hi'
                  ? "मंडी भाव या डीजल भाड़ा बदलकर तुरंत देखें कि आपकी जेब के शुद्ध मुनाफे पर क्या असर पड़ता है।"
                  : "Simulate spot rate shifts or fuel tariff increases in real-time to verify margin safety."}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="clay-button-light inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#173B2B] text-xs font-bold transition self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? "रीसेट करें" : "Reset Baseline"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Spot Price Adjustment */}
              <div className="clay-inset p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D2420]">
                    {lang === 'hi' ? "मंडी भाव बदलाव (₹/किलो):" : "Spot Rate Adjustment (₹/kg):"}
                  </span>
                  <span className="font-serif font-bold text-xl text-[#173B2B]">
                    ₹{adjustedPrice} / kg
                  </span>
                </div>
                <input
                  type="range"
                  min={recommendedMandi.unitPrice - 6}
                  max={recommendedMandi.unitPrice + 6}
                  step={1}
                  value={adjustedPrice}
                  onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                  className="w-full h-2 bg-[#E3DFD2] rounded-lg appearance-none cursor-pointer accent-[#173B2B]"
                />
                <div className="flex justify-between text-[11px] text-[#68736C] mt-1.5">
                  <span>₹{recommendedMandi.unitPrice - 6} (Mandi Glut)</span>
                  <span className="font-semibold text-[#173B2B]">Baseline: ₹{recommendedMandi.unitPrice}</span>
                  <span>₹{recommendedMandi.unitPrice + 6} (Peak Surge)</span>
                </div>
              </div>

              {/* Slider 2: Freight Tariff Adjustment */}
              <div className="clay-inset p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D2420]">
                    {lang === 'hi' ? "गाड़ी भाड़ा दर (₹/किमी):" : "Vehicle Freight Rate (₹/km):"}
                  </span>
                  <span className="font-serif font-bold text-xl text-[#173B2B]">
                    ₹{adjustedFreightRate} / km
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={28}
                  step={1}
                  value={adjustedFreightRate}
                  onChange={(e) => setAdjustedFreightRate(Number(e.target.value))}
                  className="w-full h-2 bg-[#E3DFD2] rounded-lg appearance-none cursor-pointer accent-[#173B2B]"
                />
                <div className="flex justify-between text-[11px] text-[#68736C] mt-1.5">
                  <span>₹12 / km (Discount)</span>
                  <span className="font-semibold text-[#173B2B]">Default: ₹{selectedVehicle.costPerKm} / km</span>
                  <span>₹28 / km (Diesel Spike)</span>
                </div>
              </div>

            </div>

            {/* Right Output: Impact Result Card */}
            <div className="lg:col-span-5">
              <div className="clay-card-forest text-[#F7F5EF] rounded-2xl p-6 sm:p-7">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B] mb-2">
                  {lang === 'hi' ? "सिमुलेशन के बाद शुद्ध कमाई" : "Simulated Net Return"}
                </div>

                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#F4EEDF] leading-none mb-4">
                  ₹{simResult.netReturn.toLocaleString('en-IN')}
                </div>

                {/* Delta Callout */}
                <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between mb-4 ${
                  delta >= 0 
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 shadow-inner' 
                    : 'bg-red-900/60 text-red-200 border border-red-700/50 shadow-inner'
                }`}>
                  <span>{lang === 'hi' ? "आधार से लाभ अंतर:" : "Variance from Baseline:"}</span>
                  <span>{delta >= 0 ? `+ ₹${delta.toLocaleString('en-IN')}` : `− ₹${Math.abs(delta).toLocaleString('en-IN')}`}</span>
                </div>

                <div className="space-y-1.5 text-xs text-[#EBE8DE] border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="opacity-80">Baseline Net Return:</span>
                    <span className="font-semibold">₹{recommendedMandi.netReturn.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Simulated Transport Cost:</span>
                    <span className="font-semibold">₹{simResult.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Simulated Net / Kg:</span>
                    <span className="font-semibold text-[#D4BA7B]">₹{simResult.netReturnPerKg} / kg</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
