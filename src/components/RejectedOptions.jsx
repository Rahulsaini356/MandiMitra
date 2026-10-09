import React from 'react';
import { XCircle, TrendingDown, ArrowDownRight, Info } from 'lucide-react';

export default function RejectedOptions({ t, lang, result }) {
  const rejected = result.rejected;
  const recommended = result.recommended;

  return (
    <section className="py-14 bg-[#F7F5EF] border-b border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEEDE7] text-[#173B2B] border border-[#E3DFD2] mb-2">
              <Info className="w-3.5 h-3.5 text-[#B59658]" />
              {t.rejected.title}
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#173B2B]">
              {lang === 'hi' ? "अन्य विकल्प क्यों नहीं चुने गए?" : "Why Did the Solver Reject Other Mandis?"}
            </h3>
            <p className="text-sm text-[#68736C] mt-1">
              {t.rejected.subtitle}
            </p>
          </div>

          <div className="text-xs text-[#68736C] italic hidden sm:block max-w-sm">
            {t.rejected.trustQuote}
          </div>
        </div>

        {/* Compact Grid of Rejected Alternatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rejected.map((alt) => {
            const delta = recommended.netReturn - alt.netReturn;
            return (
              <div
                key={alt.mandiId}
                className="bg-white rounded-2xl p-6 border border-[#E3DFD2] shadow-warm-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#68736C]">
                      Rank #{alt.rank}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                      {t.rejected.notRecommended}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xl text-[#173B2B]">
                    {lang === 'hi' ? alt.mandiHindiName : alt.mandiName}
                  </h4>
                  <div className="text-xs text-[#68736C] mt-0.5">
                    {alt.distanceKm} km • {alt.travelTimeHours} hrs transit
                  </div>

                  {/* Headline price vs Net Return */}
                  <div className="my-4 p-3 bg-[#F7F5EF] rounded-xl border border-[#E3DFD2] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#68736C] block">Mandi Price:</span>
                      <span className="font-serif font-bold text-base text-[#173B2B]">
                        ₹{alt.unitPrice}/kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[#68736C] block">Net Return:</span>
                      <span className="font-serif font-bold text-base text-[#68736C]">
                        ₹{alt.netReturn.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Why Rejected Explanation */}
                  <div className="space-y-1.5 text-xs text-[#1D2420] mt-3">
                    <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                      <span>{lang === 'hi' ? "अस्वीकृति का कारण:" : "Why not recommended:"}</span>
                    </div>
                    <p className="text-[#68736C] leading-relaxed pl-5">
                      {alt.rejectionReason}
                    </p>
                  </div>
                </div>

                {/* Deficit Callout */}
                <div className="mt-5 pt-4 border-t border-[#EEEDE7] flex items-center justify-between text-xs">
                  <span className="text-[#68736C]">{t.rejected.deficit}:</span>
                  <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                    − ₹{delta.toLocaleString('en-IN')} vs {recommended.mandiName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
