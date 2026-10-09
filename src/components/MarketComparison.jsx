import React from 'react';
import { Store, TrendingUp, Clock, MapPin, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export default function MarketComparison({
  t,
  lang,
  mode,
  result,
  selectedBatch,
  onSelectMandi
}) {
  const allMandis = result.all;

  return (
    <section id="markets" className="py-16 md:py-24 bg-[#F7F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEEDE7] text-[#173B2B] border border-[#E3DFD2] mb-2">
              <Store className="w-3.5 h-3.5 text-[#B59658]" />
              {t.markets.title}
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#173B2B]">
              {lang === 'hi' ? "सभी सुलभ मंडियों का प्रत्यक्ष मूल्यांकन" : "Reachable Mandi Arbitrage Matrix"}
            </h3>
            <p className="text-sm text-[#68736C] mt-1">
              {t.markets.subtitle}
            </p>
          </div>

          <div className="text-xs text-[#68736C]">
            Batch Size: <strong>{selectedBatch.quantityKg} kg {selectedBatch.crop}</strong>
          </div>
        </div>

        {/* Editorial Market Comparison Table */}
        <div className="bg-white rounded-2xl border border-[#E3DFD2] shadow-warm-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left border-collapse">
              <thead>
                <tr className="bg-[#EEEDE7] text-[#1D2420] text-xs uppercase tracking-wider font-bold border-b border-[#E3DFD2]">
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
                  const isWinning = m.rank === 1;
                  return (
                    <tr 
                      key={m.mandiId}
                      className={`transition ${
                        isWinning 
                          ? 'bg-[#173B2B]/5 font-medium' 
                          : 'hover:bg-[#F7F5EF]'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6">
                        {isWinning ? (
                          <span className="w-7 h-7 rounded-full bg-[#173B2B] text-[#D4BA7B] flex items-center justify-center font-serif font-bold text-xs shadow-sm">
                            #1
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-[#EEEDE7] text-[#68736C] flex items-center justify-center font-bold text-xs">
                            #{m.rank}
                          </span>
                        )}
                      </td>

                      {/* Mandi Name */}
                      <td className="py-4 px-6">
                        <div className="font-serif font-bold text-base text-[#173B2B]">
                          {lang === 'hi' ? m.mandiHindiName : m.mandiName}
                        </div>
                        <div className="text-xs text-[#68736C] flex items-center gap-1.5 mt-0.5">
                          <span>{m.hubName}</span>
                          {isWinning && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#B59658] text-[#173B2B]">
                              {t.common.recommendedPill}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Headline Price */}
                      <td className="py-4 px-6">
                        <div className="font-serif font-bold text-lg text-[#173B2B]">
                          ₹{m.unitPrice}
                          <span className="text-xs font-sans font-normal text-[#68736C]"> / kg</span>
                        </div>
                        <div className="text-[11px] text-[#68736C]">
                          Gross: ₹{m.grossRevenue.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Distance & Time */}
                      <td className="py-4 px-6 text-xs text-[#1D2420]">
                        <div className="font-semibold">{m.distanceKm} km</div>
                        <div className="text-[#68736C]">{m.travelTimeHours} hrs transit</div>
                      </td>

                      {/* Transport Cost */}
                      <td className="py-4 px-6 text-xs">
                        <div className="font-bold text-[#A84242]">
                          − ₹{m.transportCost.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[#68736C] text-[11px]">
                          + Fees: ₹{m.totalMandiFees}
                        </div>
                      </td>

                      {/* Final Net Return */}
                      <td className="py-4 px-6">
                        <div className={`font-serif text-xl font-bold ${
                          isWinning ? 'text-[#173B2B]' : 'text-[#68736C]'
                        }`}>
                          ₹{m.netReturn.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-[#68736C]">
                          ₹{m.netReturnPerKg} net / kg
                        </div>
                      </td>

                      {/* Real Data Honesty Source & Timestamp */}
                      <td className="py-4 px-6 text-xs">
                        <div className="font-semibold text-[#173B2B]">
                          {m.dataSource}
                        </div>
                        <div className="text-[#68736C] flex items-center gap-1 text-[11px] mt-0.5">
                          <Clock className="w-3 h-3 text-[#8FA58E]" />
                          <span>{t.common.updated} {m.lastUpdated}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
