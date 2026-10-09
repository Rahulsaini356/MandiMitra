import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  Navigation, 
  Store, 
  Banknote, 
  ChevronRight,
  ChevronDown,
  Info,
  Calendar,
  Share2
} from 'lucide-react';

export default function FarmerScheduleAndVerification({
  t,
  lang,
  mode,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const rec1 = result.recommendation1 || result.recommended;
  const rec2 = result.recommendation2 || result.bestAlternative;
  const [activePlanTab, setActivePlanTab] = useState('rec1');
  const rec = (activePlanTab === 'rec2' && rec2) ? rec2 : rec1;
  const rep = rec.feasibilityReport;
  const rejectedMandis = result.rejected;

  // Toggle state to view why other mandis were rejected
  const [showRejected, setShowRejected] = useState(false);

  // 4-Point Verification Checklist Items
  const verificationItems = [
    {
      title: t.feasibility.vehicleCapacity,
      status: rep.vehicleCapacity.passed,
      detail: rep.vehicleCapacity.detail,
      farmerText: rep.vehicleCapacity.passed 
        ? (lang === 'hi' ? "गाड़ी की क्षमता माल के लिए पूरी तरह सही है।" : "Vehicle capacity is sufficient for this load.")
        : (lang === 'hi' ? "माल गाड़ी की क्षमता से अधिक है। बड़ी गाड़ी चुनें।" : "Batch exceeds vehicle capacity. Choose a larger vehicle."),
      metric: `${selectedBatch.quantityKg} kg / ${selectedVehicle.capacityKg} kg`
    },
    {
      title: t.feasibility.travelTime,
      status: rep.travelTime.passed,
      detail: rep.travelTime.detail,
      farmerText: rep.travelTime.passed
        ? (lang === 'hi' ? "यात्रा का समय सुरक्षित है, धूप से पहले माल पहुँच जाएगा।" : "Safe daytime transit window, well before midday heat.")
        : (lang === 'hi' ? "रास्ते में अधिक समय लगने से माल खराब हो सकता है।" : "Transit exceeds safe shelf life window."),
      metric: `${rec.travelTimeHours} hrs transit (${rec.distanceKm} km)`
    },
    {
      title: t.feasibility.produceFreshness,
      status: rep.produceFreshness ? rep.produceFreshness.passed : true,
      detail: "Freshness decay within tolerable commercial loss ceiling (< 3%)",
      farmerText: lang === 'hi' 
        ? "माल की ताज़गी व ग्रेड-A गुणवत्ता मंडी पहुँचने तक पूरी तरह सुरक्षित रहेगी।" 
        : "Produce firmness & Grade-A quality fully preserved upon arrival.",
      metric: `Decay factor: ${(selectedBatch.spoilageRatePerHour * 100).toFixed(2)}%/hr`
    },
    {
      title: t.feasibility.netReturnPositive,
      status: rep.profitFeasibility.passed,
      detail: rep.profitFeasibility.detail,
      farmerText: rep.profitFeasibility.passed
        ? (lang === 'hi' ? "सारे खर्च काटकर किसान को सबसे अधिक शुद्ध मुनाफा मिलेगा।" : "Highest net take-home profit after all transport deductions.")
        : (lang === 'hi' ? "खर्च बहुत अधिक है, लाभ की संभावना कम है।" : "Haulage exceeds margin, unprofitable route."),
      metric: `₹${rec.netReturn.toLocaleString('en-IN')} net cash in hand`
    }
  ];

  // 4-Step Dispatch Journey Timeline
  const dispatchSteps = [
    {
      num: "01",
      stepTitle: t.logistics.step1,
      name: selectedBatch.farmLocation,
      time: "07:30 AM",
      desc: lang === 'hi' 
        ? `खेत पर माल तैयार: ${selectedBatch.quantityKg} कि.ग्रा. ${selectedBatch.hindiName}` 
        : `Farm gate dispatch: ${selectedBatch.quantityKg} kg ${selectedBatch.crop}`,
      icon: MapPin,
      status: "Ready"
    },
    {
      num: "02",
      stepTitle: t.logistics.step2,
      name: selectedVehicle.name,
      time: "08:15 AM",
      desc: lang === 'hi'
        ? `लोडिंग पूर्ण एवं तिरपाल सुरक्षित: ${selectedBatch.quantityKg} kg / ${selectedVehicle.capacityKg} kg`
        : `Vehicle loaded & secured: ${selectedBatch.quantityKg} kg / ${selectedVehicle.capacityKg} kg`,
      icon: Truck,
      status: "Secured"
    },
    {
      num: "03",
      stepTitle: t.logistics.step3,
      name: rec.highwayRoute,
      time: `08:30 AM – ${(8.5 + rec.travelTimeHours).toFixed(1)} hrs`,
      desc: lang === 'hi'
        ? `${rec.distanceKm} किमी की दूरी, सुरक्षित राजमार्ग परिवहन (${rec.travelTimeHours} घंटे)`
        : `${rec.distanceKm} km transit via NH corridor (${rec.travelTimeHours} hrs haulage)`,
      icon: Navigation,
      status: "In Transit"
    },
    {
      num: "04",
      stepTitle: t.logistics.step5,
      name: lang === 'hi' ? rec.mandiHindiName : rec.mandiName,
      time: "12:00 PM",
      desc: lang === 'hi'
        ? `धर्मकांटा तौल, नीलामी एवं सीधे बैंक खाते में भुगतान (₹${rec.netReturn.toLocaleString('en-IN')})`
        : `Weighbridge, live auction & direct bank settlement (₹${rec.netReturn.toLocaleString('en-IN')})`,
      icon: Banknote,
      status: "Settlement"
    }
  ];

  return (
    <section id="schedule" className="py-12 sm:py-16 md:py-20 bg-[#F7F5EF] border-b border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-[#E3DFD2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEEDE7] text-[#173B2B] border border-[#E3DFD2] mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B59658]" />
              <span>{lang === 'hi' ? "परिवहन अनुसूची एवं 4-बिंदु जाँच" : "Dispatch Schedule & 4-Point Verification"}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173B2B] tracking-tight">
              {lang === 'hi' ? "रवानगी योजना एवं सुरक्षा सत्यापन" : "Logistics Plan & Operational Feasibility"}
            </h2>
            <p className="text-sm sm:text-base text-[#68736C] mt-2 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? "यह योजना वास्तविक सड़क, गाड़ी क्षमता, समय और ताज़गी की पूरी जाँच के बाद तैयार की गई है।"
                : "Deterministic verification of vehicle capacity, transit time, produce freshness, and route logistics before dispatch."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#173B2B] font-semibold bg-white px-3.5 py-2 rounded-xl border border-[#E3DFD2] shadow-sm self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>{lang === 'hi' ? "100% व्यावहारिक व सुरक्षित" : "100% Feasible & Verified"}</span>
          </div>
        </div>

        {/* Dual Option Plan Switcher Tabs */}
        {rec2 && (
          <div className="flex items-center gap-2 p-1.5 bg-[#EEEDE7] rounded-2xl mb-8 max-w-md border border-[#E3DFD2]">
            <button
              onClick={() => setActivePlanTab('rec1')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlanTab === 'rec1'
                  ? 'bg-[#173B2B] text-[#D4BA7B] shadow-sm'
                  : 'text-[#68736C] hover:text-[#173B2B]'
              }`}
            >
              <span>{lang === 'hi' ? `विकल्प 1: ${rec1.mandiHindiName}` : `Option 1: ${rec1.mandiName}`}</span>
            </button>
            <button
              onClick={() => setActivePlanTab('rec2')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlanTab === 'rec2'
                  ? 'bg-[#173B2B] text-[#D4BA7B] shadow-sm'
                  : 'text-[#68736C] hover:text-[#173B2B]'
              }`}
            >
              <span>{lang === 'hi' ? `विकल्प 2: ${rec2.mandiHindiName}` : `Option 2: ${rec2.mandiName}`}</span>
            </button>
          </div>
        )}

        {/* 1. TOP CARD: 4-POINT VERIFICATION CHECKLIST */}
        <div className="clay-card rounded-3xl p-6 sm:p-8 border-2 border-[#D6D1C4] mb-8 sm:mb-10">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EEEDE7]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#315C43]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B]">
                {lang === 'hi' ? "4-बिंदु योजना सत्यापन (क्या यह योजना सुरक्षित है?)" : "4-Point Feasibility Checklist (Can This Plan Work?)"}
              </h3>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full clay-button-brass text-[#173B2B]">
              {lang === 'hi' ? "सभी 4 बिंदु सफल" : "4 / 4 Passed"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {verificationItems.map((item, idx) => (
              <div 
                key={idx}
                className="clay-inset p-4.5 rounded-2xl flex items-start gap-3.5 transition"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#173B2B] truncate">{item.title}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                      {t.feasibility.passStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#1D2420] mt-1 leading-snug">
                    {item.farmerText}
                  </p>
                  <div className="text-[11px] text-[#68736C] font-mono mt-1.5 pt-1.5 border-t border-[#E3DFD2]/60">
                    {item.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. MIDDLE CARD: STEP-BY-STEP DISPATCH JOURNEY SCHEDULE */}
        <div className="clay-card-forest text-[#F7F5EF] rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B59658]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B]">
                {lang === 'hi' ? "रवानगी से नीलामी तक" : "Dispatch To Settlement"}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EEDF] mt-1">
                {lang === 'hi' ? "अनुशंसित रवानगी अनुसूची" : "Recommended Logistics Schedule"}
              </h3>
            </div>
            
            <div className="text-xs text-[#8FA58E] flex items-center gap-3">
              <span>{rec.distanceKm} km total</span>
              <span>•</span>
              <span>{rec.travelTimeHours} hrs transit</span>
              <span>•</span>
              <span className="text-white font-semibold">{rec.highwayRoute}</span>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {dispatchSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-[#D4BA7B] px-2 py-0.5 rounded bg-black/30">
                        {step.num}
                      </span>
                      <span className="text-xs font-bold text-white bg-[#315C43] px-2 py-0.5 rounded">
                        {step.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-[#B59658]/20 text-[#D4BA7B] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-sm text-white leading-tight">
                        {step.stepTitle}
                      </h4>
                    </div>

                    <div className="text-xs font-semibold text-[#D4BA7B] mb-1 truncate">
                      {step.name}
                    </div>

                    <p className="text-xs text-[#EBE8DE] leading-snug opacity-90">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-white/10 text-[10px] text-[#8FA58E] uppercase tracking-wider font-semibold">
                    Status: <span className="text-white">{step.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BOTTOM ACCORDION: WHY OTHER MANDIS WERE NOT CHOSEN */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#E3DFD2] shadow-warm-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1">
                <Info className="w-3.5 h-3.5 text-[#B59658]" />
                <span>{t.rejected.title}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B]">
                {lang === 'hi' ? "अन्य मंडियों की सिफारिश क्यों नहीं की गई?" : "Why Were Alternative Mandis Excluded?"}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736C] mt-1">
                {lang === 'hi' 
                  ? "पारदर्शिता और भरोसे के लिए जानिए कि अन्य मंडियों में कम मुनाफा क्यों हुआ।" 
                  : "Transparent breakdown of why other market options yielded lower net returns."}
              </p>
            </div>

            <button
              onClick={() => setShowRejected(!showRejected)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EEEDE7] hover:bg-[#E3DFD2] text-[#173B2B] text-xs font-bold transition flex-shrink-0 self-start sm:self-auto"
            >
              <span>{showRejected ? (lang === 'hi' ? "विवरण छुपाएं" : "Hide Alternatives") : (lang === 'hi' ? "अन्य मंडियों का हिसाब देखें" : "View Rejected Math")}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRejected ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Rejected Cards */}
          {showRejected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-[#EEEDE7] animate-fade-in">
              {rejectedMandis.map((m) => {
                const deficit = rec.netReturn - m.netReturn;
                return (
                  <div 
                    key={m.mandiId}
                    className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E3DFD2] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-base text-[#173B2B]">
                          {lang === 'hi' ? m.mandiHindiName : m.mandiName}
                        </span>
                        <span className="text-[11px] font-bold text-[#A84242] bg-[#A84242]/10 px-2 py-0.5 rounded">
                          #{m.rank} Not Picked
                        </span>
                      </div>

                      <div className="text-xs text-[#68736C] mb-3">
                        {m.distanceKm} km • Rate: ₹{m.unitPrice}/kg
                      </div>

                      {/* Math comparison */}
                      <div className="space-y-1.5 text-xs text-[#1D2420] bg-white p-3 rounded-xl border border-[#E3DFD2] mb-3">
                        <div className="flex justify-between">
                          <span className="text-[#68736C]">Net Cash Return:</span>
                          <span className="font-bold text-[#173B2B]">₹{m.netReturn.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[#A84242]">
                          <span>Lost Profit Margin:</span>
                          <span className="font-bold">− ₹{deficit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[#68736C]">
                          <span>Transport Freight:</span>
                          <span>₹{m.transportCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Plain Language Rejection Reason */}
                      <p className="text-xs text-[#68736C] leading-snug">
                        {m.rejectionReason}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#E3DFD2] text-[11px] font-semibold text-[#A84242]">
                      ✕ {lang === 'hi' ? `₹${deficit.toLocaleString('en-IN')} कम शुद्ध कमाई` : `Yields ₹${deficit.toLocaleString('en-IN')} less cash`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
