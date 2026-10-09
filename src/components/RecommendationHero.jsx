import React from 'react';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Share2, 
  Download, 
  Layers, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck,
  Minus,
  Equal
} from 'lucide-react';

export default function RecommendationHero({
  t,
  lang,
  mode,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const rec = result.recommended;
  const runnerUp = result.rejected[0];

  return (
    <section id="plan" className="py-16 md:py-24 bg-[#F7F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Center Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E3DFD2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#173B2B] text-[#D4BA7B] mb-3">
              ★ {t.recommendation.badge}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#173B2B] tracking-tight">
              {lang === 'hi' ? rec.mandiHindiName : rec.mandiName}
            </h2>
            <p className="text-sm sm:text-base text-[#68736C] mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#315C43]" />
              <span>{rec.hubName}</span>
              <span>•</span>
              <span className="font-medium">{rec.distanceKm} km via {rec.highwayRoute}</span>
            </p>
          </div>

          {/* Real Data Honesty Timestamp Banner */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E3DFD2] shadow-warm-sm text-xs text-[#68736C] flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <div>
              <div className="font-semibold text-[#173B2B]">
                {rec.dataSource}
              </div>
              <div className="text-[11px] text-[#68736C]">
                {t.common.updated} {rec.lastUpdated} (Official Auction Bulletin)
              </div>
            </div>
          </div>
        </div>

        {/* DOMINANT RECOMMENDATION CARD */}
        <div className="bg-[#173B2B] text-[#F7F5EF] rounded-3xl p-8 sm:p-10 lg:p-12 shadow-warm-lg border border-[#173B2B] relative overflow-hidden mb-12">
          {/* Subtle Brass Accent Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B59658]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Dominant Net Return Number */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4BA7B]">
                <span>{t.recommendation.estimatedNetReturn}</span>
                <span>•</span>
                <span>100% Deterministic</span>
              </div>

              {/* THE STRONGEST NUMBER */}
              <div className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F4EEDF] mt-2 break-words leading-none">
                ₹{rec.netReturn.toLocaleString('en-IN')}
              </div>

              <div className="flex flex-wrap items-baseline gap-3 mt-2">
                <span className="text-lg text-[#D4BA7B] font-medium font-serif">
                  ₹{rec.netReturnPerKg} {t.common.perKg}
                </span>
                <span className="text-xs text-[#8FA58E]">
                  ({t.financials.grossRevenue}: ₹{rec.grossRevenue.toLocaleString('en-IN')} @ ₹{rec.unitPrice}/kg)
                </span>
                {runnerUp && (
                  <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded bg-white/10 text-emerald-300">
                    +₹{(rec.netReturn - runnerUp.netReturn).toLocaleString('en-IN')} higher than {runnerUp.mandiName}
                  </span>
                )}
              </div>

              {/* Farmer Mode: Simple, clear, human explanation */}
              {mode === 'farmer' ? (
                <div className="mt-8 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                  <div className="text-sm font-semibold text-[#D4BA7B] mb-2">
                    {lang === 'hi' ? "किसान मित्र सारांश" : "Farmer Plain-Language Insight"}
                  </div>
                  <p className="text-base text-white leading-relaxed">
                    {t.recommendation.farmerSummary}
                  </p>
                </div>
              ) : (
                /* Expert Mode: Deep Formula Breakdown */
                <div className="mt-8 bg-white/5 p-5 rounded-2xl border border-white/10 font-mono text-xs space-y-2 text-[#EBE8DE]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B] font-sans">
                    {t.expert.mathBreakdown}
                  </div>
                  <div className="text-emerald-300">
                    Net_Revenue = (Qty {rec.quantityKg}kg × ₹{rec.unitPrice}) − Freight(₹{rec.transportCost}) − Fees(₹{rec.totalMandiFees}) − Spoilage(₹{rec.expectedSpoilageLossRs})
                  </div>
                  <div className="text-[#8FA58E]">
                    Constraints: Vehicle({selectedVehicle.capacityKg}kg &gt;= {rec.quantityKg}kg) ✓ | Transit({rec.totalTransitHours}h &lt;= {selectedBatch.targetWindowHours}h) ✓
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button 
                  onClick={() => alert(lang === 'hi' ? "योजना स्वीकृत कर ली गई है! गाड़ी चालक को सूचना भेज दी गई है।" : "Plan accepted! Dispatch order transmitted to cooperative vehicle operator.")}
                  className="px-6 py-3.5 rounded-xl bg-[#B59658] text-[#173B2B] font-bold text-sm uppercase tracking-wider hover:bg-[#D4BA7B] transition shadow-warm-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#173B2B]" />
                  <span>{t.recommendation.usePlanBtn}</span>
                </button>

                <button 
                  onClick={() => alert(lang === 'hi' ? "ड्राइवर को एसएमएस और व्हाट्सएप लिंक भेजा गया।" : "Route coordinates and gate pass sent via SMS/WhatsApp to truck driver.")}
                  className="px-5 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition border border-white/20 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-[#D4BA7B]" />
                  <span>{t.recommendation.sharePlanBtn}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Why This Plan Wins Rationale List */}
            <div className="lg:col-span-5 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10">
              <h3 className="font-serif text-xl font-bold text-[#F4EEDF] mb-6 flex items-center gap-2">
                <span>{t.recommendation.whyWinsTitle}</span>
              </h3>
              
              <ul className="space-y-4 text-sm text-[#EBE8DE]">
                {result.whyRecommended.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#B59658]/20 text-[#D4BA7B] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{reason}</span>
                  </li>
                ))}
              </ul>

              {/* Quick Logistics Snapshot Inside Recommendation */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8FA58E] block">Route Transit:</span>
                  <span className="font-semibold text-white">{rec.travelTimeHours} hrs ({rec.distanceKm} km)</span>
                </div>
                <div>
                  <span className="text-[#8FA58E] block">Yard Gate Wait:</span>
                  <span className="font-semibold text-white">~{rec.queueWaitMin} mins</span>
                </div>
                <div>
                  <span className="text-[#8FA58E] block">Assigned Truck:</span>
                  <span className="font-semibold text-white">{selectedVehicle.name}</span>
                </div>
                <div>
                  <span className="text-[#8FA58E] block">Produce Batch:</span>
                  <span className="font-semibold text-white">{selectedBatch.crop} ({selectedBatch.quantityKg} kg)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 15. FINANCIAL SUMMARY STRIP: Gross - Transport - Fees - Spoilage = Net Return */}
        <div className="bg-white rounded-2xl border border-[#E3DFD2] p-6 sm:p-8 shadow-warm-sm">
          <div className="mb-6">
            <h3 className="font-serif text-2xl font-bold text-[#173B2B]">
              {t.financials.title}
            </h3>
            <p className="text-sm text-[#68736C]">
              {mode === 'farmer' ? t.financials.formulaFarmer : t.financials.formulaExplanation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* Step 1: Gross Revenue */}
            <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DFD2]">
              <div className="text-xs uppercase font-semibold text-[#68736C]">
                {t.financials.grossRevenue}
              </div>
              <div className="font-serif text-2xl font-bold text-[#173B2B] mt-1">
                ₹{rec.grossRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#68736C] mt-0.5">
                {rec.quantityKg} kg × ₹{rec.unitPrice}/kg
              </div>
            </div>

            {/* Minus Sign */}
            <div className="hidden lg:flex justify-center text-[#68736C]">
              <Minus className="w-5 h-5 text-[#8FA58E]" />
            </div>

            {/* Step 2: Transport Cost */}
            <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DFD2]">
              <div className="text-xs uppercase font-semibold text-[#68736C]">
                {t.financials.transportCost}
              </div>
              <div className="font-serif text-2xl font-bold text-[#A84242] mt-1">
                − ₹{rec.transportCost.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#68736C] mt-0.5">
                {rec.distanceKm} km × ₹{selectedVehicle.costPerKm}/km
              </div>
            </div>

            {/* Minus Sign */}
            <div className="hidden lg:flex justify-center text-[#68736C]">
              <Minus className="w-5 h-5 text-[#8FA58E]" />
            </div>

            {/* Step 3: Mandi Fees & Cess */}
            <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DFD2]">
              <div className="text-xs uppercase font-semibold text-[#68736C]">
                {t.financials.mandiFees}
              </div>
              <div className="font-serif text-2xl font-bold text-[#A84242] mt-1">
                − ₹{rec.totalMandiFees.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#68736C] mt-0.5">
                Fixed ₹{rec.mandiFeesBreakdown.fixed} + Cess + Labor
              </div>
            </div>

            {/* Minus Sign */}
            <div className="hidden lg:flex justify-center text-[#68736C]">
              <Minus className="w-5 h-5 text-[#8FA58E]" />
            </div>

            {/* Step 4: Spoilage Loss */}
            <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E3DFD2]">
              <div className="text-xs uppercase font-semibold text-[#68736C]">
                {t.financials.estimatedLoss}
              </div>
              <div className="font-serif text-2xl font-bold text-[#A84242] mt-1">
                − ₹{rec.expectedSpoilageLossRs.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#68736C] mt-0.5">
                ~{rec.spoilageLossKg} kg transit shrinkage
              </div>
            </div>

            {/* Equals Sign */}
            <div className="hidden lg:flex justify-center text-[#173B2B]">
              <Equal className="w-5 h-5 text-[#173B2B]" />
            </div>

            {/* Step 5: NET RETURN (Dominant) */}
            <div className="p-5 rounded-xl bg-[#173B2B] text-[#F7F5EF] border border-[#173B2B] sm:col-span-2 lg:col-span-1 shadow-warm-md">
              <div className="text-xs uppercase font-bold text-[#D4BA7B]">
                {t.financials.netReturn}
              </div>
              <div className="font-serif text-3xl font-bold text-[#F4EEDF] mt-1">
                ₹{rec.netReturn.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#8FA58E] mt-0.5 font-semibold">
                Final Cooperative Return
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
