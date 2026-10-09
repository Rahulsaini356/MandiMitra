import React, { useState } from 'react';
import { Sliders, RefreshCw, TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';
import { calculateMandiOption } from '../services/decisionEngine';

export default function WhatIfSimulator({
  t,
  lang,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const recommendedMandi = result.recommended;
  
  // Local state for what-if scenario testing
  const [adjustedPrice, setAdjustedPrice] = useState(recommendedMandi.unitPrice);
  const [adjustedFreightRate, setAdjustedFreightRate] = useState(selectedVehicle.costPerKm);

  // Find base mandi object
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
    <section className="py-16 md:py-20 bg-[#EEEDE7] border-y border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#173B2B] border border-[#E3DFD2] mb-2">
              <Zap className="w-3.5 h-3.5 text-[#B59658]" />
              {t.whatif.title}
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#173B2B]">
              {lang === 'hi' ? "संवेदनशीलता एवं क्या-अगर परीक्षण" : "Market Sensitivity & What-If Re-Optimizer"}
            </h3>
            <p className="text-sm text-[#68736C] mt-1">
              {t.whatif.subtitle}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#173B2B] text-xs font-semibold border border-[#E3DFD2] hover:bg-[#F7F5EF] transition shadow-warm-sm self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-[#E3DFD2] shadow-warm-md">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Control 1: Mandi Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173B2B]">
                  {t.whatif.priceAdjustment}
                </label>
                <span className="font-serif font-bold text-lg text-[#173B2B]">
                  ₹{adjustedPrice} / kg
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={adjustedPrice}
                onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                className="w-full accent-[#173B2B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#68736C] mt-1">
                <span>₹10/kg (Bear Market)</span>
                <span>Baseline: ₹{recommendedMandi.unitPrice}/kg</span>
                <span>₹40/kg (Peak Surge)</span>
              </div>
            </div>

            {/* Control 2: Diesel / Freight Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173B2B]">
                  {t.whatif.dieselRate}
                </label>
                <span className="font-serif font-bold text-lg text-[#173B2B]">
                  ₹{adjustedFreightRate} / km
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="30"
                step="1"
                value={adjustedFreightRate}
                onChange={(e) => setAdjustedFreightRate(Number(e.target.value))}
                className="w-full accent-[#173B2B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#68736C] mt-1">
                <span>₹12/km (Backhaul discount)</span>
                <span>Baseline: ₹{selectedVehicle.costPerKm}/km</span>
                <span>₹30/km (Peak Fuel Price)</span>
              </div>
            </div>

            <p className="text-xs text-[#68736C] leading-relaxed italic bg-[#F7F5EF] p-3 rounded-xl border border-[#E3DFD2]">
              {t.whatif.scenarioInsight}
            </p>
          </div>

          {/* Results Comparison Column */}
          <div className="lg:col-span-7 bg-[#F7F5EF] p-6 rounded-2xl border border-[#E3DFD2]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              
              {/* Baseline Box */}
              <div className="p-4 bg-white rounded-xl border border-[#E3DFD2]">
                <div className="text-xs uppercase font-semibold text-[#68736C]">
                  {t.whatif.before}
                </div>
                <div className="font-serif text-3xl font-bold text-[#68736C] mt-1">
                  ₹{recommendedMandi.netReturn.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#68736C] mt-1">
                  @ ₹{recommendedMandi.unitPrice}/kg & ₹{selectedVehicle.costPerKm}/km
                </div>
              </div>

              {/* Simulated Box */}
              <div className="p-4 bg-[#173B2B] text-[#F7F5EF] rounded-xl border border-[#173B2B]">
                <div className="text-xs uppercase font-bold text-[#D4BA7B]">
                  {t.whatif.after}
                </div>
                <div className="font-serif text-3xl font-bold text-[#F4EEDF] mt-1">
                  ₹{simResult.netReturn.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#8FA58E] mt-1">
                  @ ₹{adjustedPrice}/kg & ₹{adjustedFreightRate}/km
                </div>
              </div>

            </div>

            {/* Impact Banner */}
            <div className="p-4 bg-white rounded-xl border border-[#E3DFD2] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#68736C]">
                  {t.whatif.impact}:
                </span>
                <div className="text-xs text-[#68736C] mt-0.5">
                  {delta > 0 ? t.whatif.returnIncreased : delta < 0 ? t.whatif.returnDecreased : t.whatif.noChange}
                </div>
              </div>
              
              <div className={`font-serif text-2xl font-bold flex items-center gap-1.5 ${
                delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-[#A84242]' : 'text-[#68736C]'
              }`}>
                {delta > 0 ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : delta < 0 ? <TrendingDown className="w-5 h-5 text-[#A84242]" /> : null}
                <span>{delta >= 0 ? `+₹${delta.toLocaleString('en-IN')}` : `−₹${Math.abs(delta).toLocaleString('en-IN')}`}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
