import React from 'react';
import { AlertCircle, TrendingDown, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PriceVsProfitStory({ t, lang, result }) {
  // Deterministic candidates from planning engine (Zero hardcoded names)
  const mandiWinning = result.recommendation1 || result.recommended;
  
  // Find a contrasting candidate: either the highest headline price candidate that lost on transport,
  // or the best alternative / runner up
  const otherCandidates = (result.all || []).filter(m => m.mandiId !== mandiWinning.mandiId);
  const higherHeadlineCandidate = otherCandidates.find(m => m.unitPrice > mandiWinning.unitPrice);
  const mandiContrast = higherHeadlineCandidate || result.recommendation2 || result.bestAlternative || otherCandidates[0] || mandiWinning;

  const returnDelta = Math.max(0, mandiWinning.netReturn - mandiContrast.netReturn);
  const transportDiff = mandiContrast.transportCost - mandiWinning.transportCost;
  const priceDiff = mandiContrast.unitPrice - mandiWinning.unitPrice;

  return (
    <section id="story" className="py-16 md:py-24 bg-[#EEEDE7] border-y border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#173B2B] border border-[#E3DFD2] mb-4">
            <AlertCircle className="w-3.5 h-3.5 text-[#B59658]" />
            <span>{t.story.badge}</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#173B2B] tracking-tight">
            {t.story.headline}
          </h2>
          <p className="mt-4 text-lg text-[#68736C]">
            {t.story.subheadline}
          </p>
        </div>

        {/* The Direct Side-by-Side Dynamic Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* CONTRASTING MANDI: High Price or Long Haul Comparison Card */}
          <div className="bg-white rounded-2xl p-8 border border-[#E3DFD2] shadow-warm-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#A84242]/5 rounded-full pointer-events-none"></div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-[#68736C]">
                  {lang === 'hi' ? mandiContrast.mandiHindiName : mandiContrast.mandiName}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                  {priceDiff > 0 ? (lang === 'hi' ? "ऊँचा भाव लेकिन कम बचत" : "Higher Rate Trap") : (lang === 'hi' ? "वैकल्पिक विकल्प" : "Alternative Option")}
                </span>
              </div>

              {/* Price Callout */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-[#68736C]">
                  {lang === 'hi' ? "मंडी बोली भाव (Headline Price)" : "Headline Mandi Price"}
                </div>
                <div className="font-serif text-5xl font-bold text-[#173B2B] mt-1">
                  ₹{mandiContrast.unitPrice}
                  <span className="text-xl font-sans font-normal text-[#68736C]"> / kg</span>
                </div>
                <div className="text-xs text-[#A84242] font-semibold mt-1 flex items-center gap-1">
                  <span>
                    {priceDiff > 0 
                      ? `+₹${priceDiff}/kg headline price vs ${mandiWinning.mandiName}`
                      : `${mandiContrast.highwayRoute}`}
                  </span>
                </div>
              </div>

              {/* Cost Deductions */}
              <div className="bg-[#F7F5EF] p-4 rounded-xl space-y-2.5 text-xs text-[#68736C] mb-6 border border-[#E3DFD2]">
                <div className="flex justify-between">
                  <span>{lang === 'hi' ? "सड़क दूरी:" : "Road Distance:"}</span>
                  <span className="font-semibold text-[#1D2420]">{mandiContrast.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'hi' ? "यात्रा समय:" : "Transit Time:"}</span>
                  <span className="font-semibold text-[#1D2420]">{mandiContrast.travelTimeHours} hrs</span>
                </div>
                <div className="flex justify-between text-[#A84242]">
                  <span>{lang === 'hi' ? "गाड़ी भाड़ा:" : "Transport Freight:"}</span>
                  <span className="font-bold">− ₹{mandiContrast.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#A84242]">
                  <span>{lang === 'hi' ? "मंडी शुल्क + संकोचन:" : "Mandi Fees + Spoilage:"}</span>
                  <span className="font-bold">− ₹{(mandiContrast.totalMandiFees + mandiContrast.expectedSpoilageLossRs).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Net Return Result */}
            <div className="pt-6 border-t border-[#EEEDE7]">
              <div className="text-xs uppercase tracking-wider text-[#68736C]">
                {lang === 'hi' ? "किसान के हाथ में शुद्ध आय:" : "Final Net Return to Cooperative:"}
              </div>
              <div className="font-serif text-4xl font-bold text-[#68736C] mt-1 line-through decoration-[#A84242]/50">
                ₹{mandiContrast.netReturn.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#68736C] mt-2 leading-relaxed">
                {mandiContrast.rejectionReason || (lang === 'hi' 
                  ? "लंबी दूरी और अधिक गाड़ी भाड़ा ऊंचे भाव के फायदे को पूरी तरह खत्म कर देता है।" 
                  : "Long haul distance and heavy haulage expenses erode headline margins.")}
              </p>
            </div>
          </div>

          {/* RECOMMENDED MANDI: Optimal Real Profit Card */}
          <div className="bg-[#173B2B] text-[#F7F5EF] rounded-2xl p-8 border-2 border-[#B59658] shadow-warm-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#B59658]/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D4BA7B]">
                  {lang === 'hi' ? mandiWinning.mandiHindiName : mandiWinning.mandiName}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#B59658] text-[#173B2B]">
                  ★ {t.recommendation.badge}
                </span>
              </div>

              {/* Price Callout */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-[#8FA58E]">
                  {lang === 'hi' ? "मंडी बोली भाव (Headline Price)" : "Headline Mandi Price"}
                </div>
                <div className="font-serif text-5xl font-bold text-[#F7F5EF] mt-1">
                  ₹{mandiWinning.unitPrice}
                  <span className="text-xl font-sans font-normal text-[#8FA58E]"> / kg</span>
                </div>
                <div className="text-xs text-[#8FA58E] font-medium mt-1">
                  {priceDiff > 0 
                    ? `(₹${priceDiff}/kg lower headline rate, BUT...)`
                    : `(Optimal freight-adjusted market rate)`}
                </div>
              </div>

              {/* Cost Deductions */}
              <div className="bg-white/5 p-4 rounded-xl space-y-2.5 text-xs text-[#EBE8DE] mb-6 border border-white/10">
                <div className="flex justify-between">
                  <span>{lang === 'hi' ? "सड़क दूरी:" : "Road Distance:"}</span>
                  <span className="font-semibold text-white">{mandiWinning.distanceKm} km (Optimal route)</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'hi' ? "यात्रा समय:" : "Transit Time:"}</span>
                  <span className="font-semibold text-white">{mandiWinning.travelTimeHours} hrs (Fresh safe window)</span>
                </div>
                <div className="flex justify-between text-[#D4BA7B]">
                  <span>{lang === 'hi' ? "गाड़ी भाड़ा:" : "Transport Freight:"}</span>
                  <span className="font-bold">
                    − ₹{mandiWinning.transportCost.toLocaleString('en-IN')} 
                    {transportDiff > 0 && ` (Saves ₹${transportDiff.toLocaleString('en-IN')})`}
                  </span>
                </div>
                <div className="flex justify-between text-[#D4BA7B]">
                  <span>{lang === 'hi' ? "मंडी शुल्क + संकोचन:" : "Mandi Fees + Spoilage:"}</span>
                  <span className="font-bold">− ₹{(mandiWinning.totalMandiFees + mandiWinning.expectedSpoilageLossRs).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Net Return Result */}
            <div className="pt-6 border-t border-white/10">
              <div className="text-xs uppercase tracking-wider text-[#D4BA7B] font-bold">
                {lang === 'hi' ? "किसान के हाथ में शुद्ध आय:" : "Final Net Return to Cooperative:"}
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-serif text-5xl font-bold text-[#F4EEDF]">
                  ₹{mandiWinning.netReturn.toLocaleString('en-IN')}
                </span>
                {returnDelta > 0 && (
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    +₹{returnDelta.toLocaleString('en-IN')} HIGHER
                  </span>
                )}
              </div>
              <p className="text-xs text-[#EBE8DE] mt-2 leading-relaxed">
                {lang === 'hi'
                  ? `सड़क भाड़ा कम होने से शुद्ध जेब कमाई ₹${returnDelta.toLocaleString('en-IN')} अधिक मिलती है।`
                  : `Superior transport economics deliver +₹${returnDelta.toLocaleString('en-IN')} higher net cash directly into farmer's pocket.`}
              </p>
            </div>
          </div>

        </div>

        {/* Big Editorial Quote */}
        <div className="mt-12 text-center max-w-3xl mx-auto p-6 bg-white rounded-xl border border-[#E3DFD2]">
          <p className="font-serif italic text-lg sm:text-xl text-[#173B2B] leading-snug">
            {t.story.insightQuote}
          </p>
        </div>

      </div>
    </section>
  );
}
