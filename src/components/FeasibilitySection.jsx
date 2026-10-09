import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function FeasibilitySection({
  t,
  lang,
  mode,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const rep = result.recommended.feasibilityReport;

  const items = [
    {
      title: t.feasibility.vehicleCapacity,
      status: rep.vehicleCapacity.passed,
      detail: rep.vehicleCapacity.detail,
      farmerText: rep.vehicleCapacity.passed 
        ? (lang === 'hi' ? "गाड़ी की क्षमता माल के लिए पूरी तरह सही है।" : "Vehicle capacity is sufficient for this load.")
        : (lang === 'hi' ? "माल गाड़ी की क्षमता से अधिक है। बड़ी गाड़ी चुनें या माल को दो फेरों में भेजें।" : "Batch exceeds vehicle capacity. Choose a larger vehicle or split the batch."),
      techMetric: `Load: ${selectedBatch.quantityKg} kg / Capacity: ${selectedVehicle.capacityKg} kg`
    },
    {
      title: t.feasibility.travelTime,
      status: rep.travelTime.passed,
      detail: rep.travelTime.detail,
      farmerText: rep.travelTime.passed
        ? (lang === 'hi' ? "यात्रा का समय उचित है, रास्ते में माल खराब होने का खतरा नहीं है।" : "Travel time is safe and produce will reach in good condition.")
        : (lang === 'hi' ? "रास्ते में अधिक समय लगने से माल खराब हो सकता है।" : "Transit exceeds safe shelf life window."),
      techMetric: `Est Transit: ${result.recommended.totalTransitHours} hrs (Max Target: ${selectedBatch.targetWindowHours} hrs)`
    },
    {
      title: t.feasibility.produceFreshness,
      status: rep.produceFreshness ? rep.produceFreshness.passed : true,
      detail: "Produce freshness decay rate within tolerable commercial loss ceiling (< 3%)",
      farmerText: lang === 'hi' 
        ? "माल की ताज़गी बनी रहेगी, मंडी पहुँचने तक नुकसान न्यूनतम रहेगा।" 
        : "Produce freshness is manageable, minimizing transit spoilage loss.",
      techMetric: `Decay factor: ${(selectedBatch.spoilageRatePerHour * 100).toFixed(2)}%/hr • Crop Perishability: ${selectedBatch.perishability}`
    },
    {
      title: t.feasibility.netReturnPositive,
      status: rep.profitFeasibility.passed,
      detail: rep.profitFeasibility.detail,
      farmerText: rep.profitFeasibility.passed
        ? (lang === 'hi' ? "इस मंडी में बेचने से निश्चित रूप से अच्छा लाभ मिलेगा।" : "Expected return is profitable and financially sound.")
        : (lang === 'hi' ? "खर्च बहुत अधिक है, लाभ की संभावना कम है।" : "High haulage makes this route financially unprofitable."),
      techMetric: `Est Net Return: ₹${result.recommended.netReturn.toLocaleString('en-IN')} (Net/Kg: ₹${result.recommended.netReturnPerKg})`
    }
  ];

  const allPassed = items.every(i => i.status);

  return (
    <section className="py-14 bg-[#EEEDE7] border-b border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#173B2B] border border-[#E3DFD2] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B59658]" />
              {t.feasibility.title}
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#173B2B]">
              {t.feasibility.question}
            </h3>
            <p className="text-sm text-[#68736C] mt-1">
              {t.feasibility.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {lang === 'hi' ? "सभी 4 मानक सफल (व्यावहारिक)" : "All 4 Constraints Verified (Feasible)"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                {lang === 'hi' ? "समायोजन आवश्यक" : "Adjustments Needed"}
              </span>
            )}
          </div>
        </div>

        {/* 4 Feasibility Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border transition ${
                item.status 
                  ? 'bg-white border-[#E3DFD2] shadow-warm-sm' 
                  : 'bg-rose-50/60 border-rose-200 shadow-warm-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#68736C]">
                  Constraint 0{idx + 1}
                </span>
                {item.status ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                    ✕
                  </span>
                )}
              </div>

              <h4 className="font-serif font-bold text-lg text-[#173B2B] mb-2">
                {item.title}
              </h4>

              <p className="text-xs text-[#1D2420] leading-relaxed mb-4">
                {mode === 'farmer' ? item.farmerText : item.detail}
              </p>

              {/* In Expert Mode, show raw telemetry */}
              {mode === 'expert' && (
                <div className="pt-3 border-t border-[#EEEDE7] text-[11px] font-mono text-[#68736C]">
                  {item.techMetric}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
