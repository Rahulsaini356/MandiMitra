import React from 'react';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Clock, 
  Store, 
  Banknote, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  ThermometerSun
} from 'lucide-react';

export default function LogisticsTimeline({
  t,
  lang,
  result,
  selectedBatch,
  selectedVehicle
}) {
  const rec = result.recommended;

  const timelineSteps = [
    {
      num: "01",
      title: t.logistics.step1,
      name: selectedBatch.farmLocation,
      time: "07:30 AM",
      desc: lang === 'hi' 
        ? `खेत पर माल तैयार: ${selectedBatch.quantityKg} कि.ग्रा. ${selectedBatch.hindiName}` 
        : `Farm dispatch ready: ${selectedBatch.quantityKg} kg ${selectedBatch.crop}`,
      status: "Dispatched",
      icon: MapPin,
      highlight: false
    },
    {
      num: "02",
      title: t.logistics.step2,
      name: selectedVehicle.name,
      time: "08:15 AM",
      desc: lang === 'hi'
        ? `वाहन में लोडिंग पूर्ण: ${selectedBatch.quantityKg} kg / ${selectedVehicle.capacityKg} kg क्षमता`
        : `Vehicle loading verified: ${selectedBatch.quantityKg} kg / ${selectedVehicle.capacityKg} kg cap`,
      status: "Secured",
      icon: Truck,
      highlight: false
    },
    {
      num: "03",
      title: t.logistics.step3,
      name: rec.highwayRoute,
      time: `08:30 AM → ${(8.5 + rec.travelTimeHours).toFixed(1)} hrs`,
      desc: lang === 'hi'
        ? `${rec.distanceKm} किमी की दूरी, अनुमानित समय ${rec.travelTimeHours} घंटे`
        : `${rec.distanceKm} km route haulage, est transit ${rec.travelTimeHours} hrs`,
      status: "In Transit",
      icon: Navigation,
      highlight: false
    },
    {
      num: "04",
      title: t.logistics.step4,
      name: lang === 'hi' ? rec.mandiHindiName : rec.mandiName,
      time: "11:45 AM",
      desc: lang === 'hi'
        ? `गेट प्रवेश व तौल, यार्ड प्रतीक्षा समय लगभग ${rec.queueWaitMin} मिनट`
        : `Gate weighment intake, yard queue wait est ~${rec.queueWaitMin} min`,
      status: "Gate Reserved",
      icon: Store,
      highlight: false
    },
    {
      num: "05",
      title: t.logistics.step5,
      name: "APMC Settlement Hall",
      time: "12:30 PM",
      desc: lang === 'hi'
        ? `नीलामी व तुरंत भुगतान: शुद्ध प्राप्ति ₹${rec.netReturn.toLocaleString('en-IN')}`
        : `Auction clearance & bank credit: net ₹${rec.netReturn.toLocaleString('en-IN')}`,
      status: "Final Settlement",
      icon: Banknote,
      highlight: true
    }
  ];

  return (
    <section id="logistics" className="py-16 md:py-24 bg-[#EEEDE7] border-b border-[#E3DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#173B2B] border border-[#E3DFD2] mb-2">
              <Truck className="w-3.5 h-3.5 text-[#B59658]" />
              {t.logistics.title}
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#173B2B]">
              {lang === 'hi' ? "खेत से मंडी नीलामी तक की सुरक्षित यात्रा" : "Farm-to-Gate Logistics & Schedule Visualizer"}
            </h3>
            <p className="text-sm text-[#68736C] mt-1">
              {t.logistics.subtitle}
            </p>
          </div>

          {/* Quick Route Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-[#E3DFD2] font-semibold text-[#173B2B]">
              {t.logistics.distance}: <strong>{rec.distanceKm} km</strong>
            </span>
            <span className="bg-white px-3 py-1.5 rounded-lg border border-[#E3DFD2] font-semibold text-[#173B2B]">
              {t.logistics.estTime}: <strong>{rec.travelTimeHours} hrs</strong>
            </span>
            <span className="bg-white px-3 py-1.5 rounded-lg border border-[#E3DFD2] font-semibold text-[#173B2B]">
              {t.logistics.freightCost}: <strong>₹{rec.transportCost.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {timelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition relative flex flex-col justify-between ${
                  step.highlight 
                    ? 'bg-[#173B2B] text-[#F7F5EF] border-[#173B2B] shadow-warm-md' 
                    : 'bg-white text-[#1D2420] border-[#E3DFD2] shadow-warm-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      step.highlight 
                        ? 'bg-[#B59658] text-[#173B2B]' 
                        : 'bg-[#EEEDE7] text-[#173B2B]'
                    }`}>
                      Stage {step.num}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      step.highlight ? 'text-[#D4BA7B]' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-[#F7F5EF] text-[#173B2B] border border-[#E3DFD2]">
                    <Icon className="w-5 h-5 text-[#315C43]" />
                  </div>

                  <div className={`text-xs uppercase font-bold tracking-wider ${
                    step.highlight ? 'text-[#D4BA7B]' : 'text-[#68736C]'
                  }`}>
                    {step.title}
                  </div>

                  <h4 className={`font-serif font-bold text-lg mt-0.5 ${
                    step.highlight ? 'text-white' : 'text-[#173B2B]'
                  }`}>
                    {step.name}
                  </h4>

                  <p className={`text-xs mt-2 leading-relaxed ${
                    step.highlight ? 'text-[#EBE8DE]' : 'text-[#68736C]'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                <div className={`mt-6 pt-3 border-t text-xs font-semibold flex items-center gap-1.5 ${
                  step.highlight ? 'border-white/10 text-[#D4BA7B]' : 'border-[#EEEDE7] text-[#173B2B]'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{step.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Freshness & Spoilage Advisory Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-white border border-[#E3DFD2] shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 flex-shrink-0">
              <ThermometerSun className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="font-serif font-bold text-base text-[#173B2B]">
                {lang === 'hi' ? "ताज़गी एवं तापमान नियंत्रण मार्गदर्शन" : "Produce Freshness & Spoilage Risk Mitigation"}
              </div>
              <p className="text-xs text-[#68736C]">
                {lang === 'hi' 
                  ? `फसल: ${selectedBatch.hindiName} (${selectedBatch.perishabilityHindi})। सुरक्षित तापमान: 20-25°C। 3.2 घंटे की यात्रा में ताज़गी सुरक्षित रहेगी।`
                  : `Crop: ${selectedBatch.crop} (${selectedBatch.perishability} perishability). Optimal dispatch window 08:00 AM avoids noon heat peak.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#173B2B]">
            <div className="text-right">
              <span className="text-[#68736C] block font-normal">Expected Spoilage Rate:</span>
              <span className="text-emerald-700 font-bold">&lt; 1.1% (~{rec.spoilageLossKg} kg)</span>
            </div>
            <div className="text-right border-l border-[#EEEDE7] pl-4">
              <span className="text-[#68736C] block font-normal">Shelf-Life Retained:</span>
              <span className="text-emerald-700 font-bold">&gt; 92%</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
