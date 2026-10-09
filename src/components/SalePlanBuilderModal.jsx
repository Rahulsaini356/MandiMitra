import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Truck, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Bot, 
  Zap, 
  Award, 
  Layers, 
  Scale, 
  Search, 
  PlusCircle, 
  Filter,
  Navigation,
  Compass
} from 'lucide-react';
import { evaluateAllMandis } from '../services/decisionEngine';
import { MANDI_DIRECTORY, MASTER_CROPS_DIRECTORY } from '../data/mandisData';
import { speakText, stopSpeech } from '../utils/speechUtils';
import { getLiveGPSCoordinates, reverseGeocode } from '../services/locationService';

const FARM_LOCATIONS = [
  { nameEn: "Kota Rampura Central Yard", nameHi: "कोटा रामपुरा केंद्रीय यार्ड (हाड़ौती)", district: "Kota" },
  { nameEn: "Bundi Farm Depot", nameHi: "बूंदी कृषि डिपो", district: "Bundi" },
  { nameEn: "Baran Krishi Upaj Yard", nameHi: "बारां कृषि उपज यार्ड", district: "Baran" },
  { nameEn: "Jhalawar Sunel Farm Gate", nameHi: "झालावाड़ सुनेल फार्म गेट", district: "Jhalawar" },
  { nameEn: "Chomu Farm Sub-Center", nameHi: "चोमू उप-केंद्र (जयपुर उत्तर)", district: "Jaipur" },
  { nameEn: "Amer Farm Outpost", nameHi: "आमेर आउटपोस्ट (जयपुर पूर्व)", district: "Jaipur" },
  { nameEn: "Tonk Farm Gate", nameHi: "टोंक फार्म गेट", district: "Tonk" }
];

export default function SalePlanBuilderModal({
  isOpen,
  onClose,
  lang,
  vehicles,
  onApplyPlan
}) {
  if (!isOpen) return null;

  // Plan State
  const [selectedCrop, setSelectedCrop] = useState(MASTER_CROPS_DIRECTORY[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'vegetables' | 'grains' | 'spices'
  const [isCustomCropMode, setIsCustomCropMode] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [customCropPrice, setCustomCropPrice] = useState(25);

  const [quantityKg, setQuantityKg] = useState(1000);
  const [farmLocation, setFarmLocation] = useState(FARM_LOCATIONS[0].nameEn);
  const [liveGPSCoords, setLiveGPSCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [vehicleChoice, setVehicleChoice] = useState('auto'); // 'auto' or vehicle.id
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('rec1'); // 'rec1' | 'rec2'

  // Filtered crops list based on search and category
  const filteredCrops = useMemo(() => {
    return MASTER_CROPS_DIRECTORY.filter((c) => {
      const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        c.crop.toLowerCase().includes(q) || 
        c.hindiName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Active crop object
  const activeCrop = useMemo(() => {
    if (isCustomCropMode && customCropName.trim()) {
      return {
        id: 'custom',
        crop: customCropName.trim(),
        hindiName: customCropName.trim(),
        category: 'custom',
        emoji: '🌱',
        perishability: 'Medium',
        shelfLife: 72,
        decayRate: 0.0015,
        basePrice: Number(customCropPrice) || 25
      };
    }
    return selectedCrop;
  }, [isCustomCropMode, customCropName, customCropPrice, selectedCrop]);

  // Auto-allocate vehicle if 'auto'
  const effectiveVehicle = useMemo(() => {
    if (vehicleChoice !== 'auto') {
      return vehicles.find(v => v.id === vehicleChoice) || vehicles[0];
    }
    const fitting = vehicles
      .filter(v => v.capacityKg >= quantityKg)
      .sort((a, b) => a.costPerKm - b.costPerKm);
    return fitting.length > 0 ? fitting[0] : vehicles[1];
  }, [vehicleChoice, vehicles, quantityKg]);

  // GPS Location Detection Handler
  const handleDetectGPSLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const coords = await getLiveGPSCoordinates();
      const geocoded = await reverseGeocode(coords.lat, coords.lng);
      setLiveGPSCoords({ lat: coords.lat, lng: coords.lng });
      setFarmLocation(geocoded.displayName);
      setLocationSuccessMsg(`${geocoded.displayName} (±${coords.accuracyMeters}m)`);
      setIsCalculated(false);
    } catch (err) {
      console.warn("GPS detection error:", err);
      setLocationError(err.message || (lang === 'hi' ? "जीपीएस लोकेशन प्राप्त नहीं हो सकी।" : "Could not detect GPS location."));
    } finally {
      setIsLocating(false);
    }
  };

  // Construct Batch Object
  const currentBatch = useMemo(() => {
    return {
      id: `custom-batch-${Date.now()}`,
      crop: activeCrop.crop,
      hindiName: activeCrop.hindiName,
      variety: `Grade A (${activeCrop.crop})`,
      quantityKg: Number(quantityKg) || 1000,
      maxBatchKg: Number(quantityKg) * 1.5,
      farmLocation: farmLocation,
      farmCoordinates: liveGPSCoords,
      harvestDate: "Today 06:00 AM",
      perishability: activeCrop.perishability,
      perishabilityHindi: activeCrop.perishability === 'High' ? 'अति-संवेदनशील' : activeCrop.perishability === 'Medium' ? 'मध्यम' : 'कम',
      shelfLifeHours: activeCrop.shelfLife,
      spoilageRatePerHour: activeCrop.decayRate,
      targetWindowHours: activeCrop.shelfLife > 48 ? 24 : 8,
      status: "Ready for Dispatch",
      isCustomPlan: true
    };
  }, [activeCrop, quantityKg, farmLocation, liveGPSCoords]);

  // Evaluate All Candidate Mandis with Deterministic Decision Engine
  const planResult = useMemo(() => {
    return evaluateAllMandis({
      mandis: MANDI_DIRECTORY,
      batch: currentBatch,
      vehicle: effectiveVehicle
    });
  }, [currentBatch, effectiveVehicle]);

  const rec1 = planResult.recommendation1 || planResult.recommended;
  const rec2 = planResult.recommendation2 || planResult.bestAlternative;
  const tradeOffs = planResult.tradeOffs;

  // Handle Calculate & Speak
  const handleCalculate = () => {
    setIsCalculated(true);
    setActiveTab('rec1');

    const speechText = lang === 'hi'
      ? (rec2
          ? `योजना तैयार हो गई है! आपके स्थान से विकल्प 1 ${rec1.mandiHindiName} है जहाँ ₹${rec1.transportCost} भाड़ा काटकर ₹${rec1.netReturn.toLocaleString('en-IN')} का सबसे अधिक शुद्ध मुनाफा मिलेगा। दूसरा बेहतरीन विकल्प ${rec2.mandiHindiName} है जिससे ₹${rec2.netReturn.toLocaleString('en-IN')} मिलेंगे।`
          : `योजना तैयार हो गई है! आपके स्थान से सर्वोत्तम मंडी ${rec1.mandiHindiName} है जहाँ ₹${rec1.transportCost} भाड़ा काटकर हाथ में ₹${rec1.netReturn.toLocaleString('en-IN')} की शुद्ध कमाई बचेगी।`)
      : (rec2
          ? `Plan ready! From your location, Option 1 is ${rec1.mandiName} with maximum net return of ₹${rec1.netReturn.toLocaleString('en-IN')}. Option 2 is ${rec2.mandiName} yielding ₹${rec2.netReturn.toLocaleString('en-IN')}.`
          : `Plan ready! The optimal mandi from your location is ${rec1.mandiName} yielding ₹${rec1.netReturn.toLocaleString('en-IN')} net cash in hand.`);

    speakText(
      speechText, 
      lang, 
      () => setIsSpeaking(true), 
      () => setIsSpeaking(false), 
      () => setIsSpeaking(false)
    );
  };

  // Toggle voice playback of recommendation
  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const speechText = lang === 'hi'
        ? (rec2
            ? `विकल्प 1 ${rec1.mandiHindiName} से शुद्ध कमाई ₹${rec1.netReturn} है। विकल्प 2 ${rec2.mandiHindiName} से ₹${rec2.netReturn} मिलेंगे। ${tradeOffs ? tradeOffs.summaryHi : ''}`
            : `सर्वोत्तम विकल्प ${rec1.mandiHindiName} है जहाँ ₹${rec1.netReturn} की शुद्ध कमाई होगी।`)
        : (rec2
            ? `Option 1 ${rec1.mandiName} yields ₹${rec1.netReturn} net cash. Option 2 ${rec2.mandiName} yields ₹${rec2.netReturn}. ${tradeOffs ? tradeOffs.summaryEn : ''}`
            : `Optimal choice is ${rec1.mandiName} with ₹${rec1.netReturn} net cash.`);

      speakText(
        speechText,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  // Apply Plan to App
  const handleApply = () => {
    stopSpeech();
    onApplyPlan(currentBatch, effectiveVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#F7F5EF] text-[#1D2420] w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#173B2B]/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#173B2B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#315C43] flex items-center justify-center text-[#B59658] shadow-sm flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#F4EEDF]">
                  {lang === 'hi' ? "अपनी फसल बिक्री योजना बनाएं" : "Create Fasal Sale Plan"}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B59658] text-[#173B2B]">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-[#8FA58E] mt-0.5">
                {lang === 'hi'
                  ? "स्थान के अनुसार 2 सर्वोत्तम मंडियों की खोज व अधिकतम मुनाफे का हिसाब"
                  : "Location-aware 2-mandi discovery & net profit arbitrage engine"}
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopSpeech(); onClose(); }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: CROP & QUANTITY */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEEDE7] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173B2B] text-[#D4BA7B] flex items-center justify-center text-xs font-bold font-mono">1</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#173B2B]">
                  {lang === 'hi' ? "फसल व मात्रा चुनें (Crop & Quantity)" : "Select Crop & Quantity"}
                </h4>
              </div>

              {/* Custom Crop Toggle */}
              <button
                type="button"
                onClick={() => setIsCustomCropMode(!isCustomCropMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition border ${
                  isCustomCropMode 
                    ? 'bg-[#173B2B] text-[#D4BA7B] border-[#173B2B]' 
                    : 'bg-[#EEEDE7] text-[#173B2B] border-[#E3DFD2] hover:bg-[#E3DFD2]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? (isCustomCropMode ? "सूची से चुनें" : "+ अन्य फसल लिखें") : (isCustomCropMode ? "Choose from Directory" : "+ Custom Crop")}</span>
              </button>
            </div>

            {/* Custom Crop Input Mode */}
            {isCustomCropMode ? (
              <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#E3DFD2] mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1">
                    {lang === 'hi' ? "फसल का नाम:" : "Crop Name:"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? "उदा. सौंफ, इसबगोल, मैथी..." : "e.g., Fennel, Groundnut..."}
                    value={customCropName}
                    onChange={(e) => { setCustomCropName(e.target.value); setIsCalculated(false); }}
                    className="w-full bg-white border border-[#E3DFD2] rounded-xl px-3 py-2 text-xs font-semibold text-[#173B2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1">
                    {lang === 'hi' ? "अनुमानित मंडी भाव (₹/किलो):" : "Estimated Market Rate (₹/kg):"}
                  </label>
                  <input
                    type="number"
                    value={customCropPrice}
                    onChange={(e) => { setCustomCropPrice(Number(e.target.value)); setIsCalculated(false); }}
                    className="w-full bg-white border border-[#E3DFD2] rounded-xl px-3 py-2 text-xs font-semibold text-[#173B2B] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#68736C] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? "24+ फसलों में खोजें (उदा. मक्का, लहसुन, टमाटर, सरसों)..." : "Search 24+ crops (e.g. Maize, Garlic, Tomato, Mustard)..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F7F5EF] border border-[#E3DFD2] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#173B2B] focus:outline-none focus:border-[#173B2B]"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', labelEn: 'All (24)', labelHi: 'सभी (24)' },
                      { id: 'vegetables', labelEn: 'Vegetables', labelHi: 'सब्जियां' },
                      { id: 'grains', labelEn: 'Grains & Pulses', labelHi: 'अनाज/दलहन' },
                      { id: 'spices', labelEn: 'Spices/Cash', labelHi: 'मसाले' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                          categoryFilter === cat.id
                            ? 'bg-[#173B2B] text-[#D4BA7B] border-[#173B2B]'
                            : 'bg-[#F7F5EF] text-[#68736C] border-[#E3DFD2] hover:bg-[#EEEDE7]'
                        }`}
                      >
                        {lang === 'hi' ? cat.labelHi : cat.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crops Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-[#EEEDE7] rounded-xl bg-[#F7F5EF]/60">
                  {filteredCrops.map((c) => {
                    const isSelected = selectedCrop.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setSelectedCrop(c); setIsCalculated(false); }}
                        className={`p-2 rounded-xl text-left transition flex flex-col justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-[#173B2B] text-white border-[#B59658] shadow-md scale-102'
                            : 'bg-white hover:bg-[#F7F5EF] text-[#1D2420] border-[#E3DFD2]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xl">{c.emoji}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${
                            isSelected ? 'bg-white/20 text-[#D4BA7B]' : 'bg-[#EEEDE7] text-[#68736C]'
                          }`}>
                            ₹{c.basePrice}/kg
                          </span>
                        </div>
                        <div className="font-bold text-xs truncate">
                          {lang === 'hi' ? c.hindiName : c.crop}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Selected Crop Banner */}
            <div className="mt-3 bg-[#173B2B]/5 p-2.5 rounded-xl border border-[#173B2B]/10 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeCrop.emoji}</span>
                <span className="font-semibold text-[#173B2B]">
                  {lang === 'hi' ? "चयनित फसल:" : "Selected Produce:"} <strong>{lang === 'hi' ? activeCrop.hindiName : activeCrop.crop}</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#68736C]">
                {activeCrop.perishability} Perishability • {activeCrop.shelfLife}h Shelf Life
              </span>
            </div>

            {/* Quantity Input & Quick Presets */}
            <div className="mt-4 pt-3 border-t border-[#EEEDE7] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1">
                  {lang === 'hi' ? "कुल मात्रा (किलोग्राम में):" : "Total Batch Quantity (kg):"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="20000"
                    step="50"
                    value={quantityKg}
                    onChange={(e) => { setQuantityKg(Number(e.target.value)); setIsCalculated(false); }}
                    className="w-full bg-[#F7F5EF] border border-[#E3DFD2] rounded-xl px-4 py-2.5 text-base font-bold text-[#173B2B] focus:outline-none focus:border-[#173B2B]"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#68736C]">
                    kg ({(quantityKg / 100).toFixed(1)} Qtl)
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="sm:col-span-6">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1">
                  {lang === 'hi' ? "त्वरित मात्रा विकल्प:" : "Quick Preset Sizes:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[500, 1000, 1200, 1500, 2000, 3000, 5000].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { setQuantityKg(q); setIsCalculated(false); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        quantityKg === q 
                          ? 'bg-[#B59658] text-[#173B2B] border-[#B59658] font-bold' 
                          : 'bg-[#F7F5EF] text-[#68736C] border-[#E3DFD2] hover:bg-[#EEEDE7]'
                      }`}
                    >
                      {q} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: LOCATION & LOGISTICS ALLOCATION */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EEEDE7] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173B2B] text-[#D4BA7B] flex items-center justify-center text-xs font-bold font-mono">2</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#173B2B]">
                  {lang === 'hi' ? "स्थान एवं वाहन आवंटन (Location & Logistics)" : "Location & Logistics Allocation"}
                </h4>
              </div>

              {/* ONE-TAP LIVE GPS LOCATION BUTTON */}
              <button
                type="button"
                onClick={handleDetectGPSLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>
                  {isLocating 
                    ? (lang === 'hi' ? "जीपीएस खोज रहे हैं..." : "Detecting GPS...") 
                    : (lang === 'hi' ? "📍 मेरी लाइव जीपीएस लोकेशन लें" : "📍 Use My Live GPS Location")
                  }
                </span>
              </button>
            </div>

            {/* GPS Feedback Banners */}
            {locationSuccessMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>{lang === 'hi' ? "लाइव जीपीएस सेट हुआ:" : "Live GPS Detected:"}</strong> {locationSuccessMsg}</span>
              </div>
            )}
            {locationError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                ⚠️ {locationError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Farm Location Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#315C43]" />
                  <span>{lang === 'hi' ? "खेत / यार्ड का स्थान:" : "Farm / Dispatch Location:"}</span>
                </label>
                <select
                  value={farmLocation}
                  onChange={(e) => { 
                    setFarmLocation(e.target.value); 
                    setLiveGPSCoords(null); 
                    setLocationSuccessMsg(null); 
                    setIsCalculated(false); 
                  }}
                  className="w-full bg-[#F7F5EF] border border-[#E3DFD2] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#173B2B] focus:outline-none cursor-pointer"
                >
                  {liveGPSCoords && (
                    <option value={farmLocation}>
                      📍 {farmLocation} (Live GPS)
                    </option>
                  )}
                  {FARM_LOCATIONS.map(loc => (
                    <option key={loc.nameEn} value={loc.nameEn}>
                      {lang === 'hi' ? loc.nameHi : loc.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Preference Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68736C] mb-1 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#315C43]" />
                  <span>{lang === 'hi' ? "उपलब्ध वाहन आवंटन:" : "Vehicle Allocation:"}</span>
                </label>
                <select
                  value={vehicleChoice}
                  onChange={(e) => { setVehicleChoice(e.target.value); setIsCalculated(false); }}
                  className="w-full bg-[#F7F5EF] border border-[#E3DFD2] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#173B2B] focus:outline-none cursor-pointer"
                >
                  <option value="auto">
                    🤖 {lang === 'hi' ? "एजेंटिक एआई स्वतः सबसे उपयुक्त गाड़ी चुने (सिफारिश)" : "AI Auto-Match Optimal Vehicle (Recommended)"}
                  </option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Cap: {v.capacityKg} kg • ₹{v.costPerKm}/km)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assigned Vehicle Callout */}
            <div className="mt-3 bg-[#EEEDE7] p-2.5 rounded-xl border border-[#E3DFD2] flex items-center justify-between text-xs">
              <span className="text-[#68736C]">
                {lang === 'hi' ? "वर्तमान चयनित गाड़ी:" : "Currently Assigned Vehicle:"}
              </span>
              <span className="font-bold text-[#173B2B]">
                {effectiveVehicle.name} ({effectiveVehicle.capacityKg} kg cap @ ₹{effectiveVehicle.costPerKm}/km)
              </span>
            </div>
          </div>

          {/* GENERATE PLAN CTA BUTTON */}
          <div className="text-center pt-1">
            <button
              onClick={handleCalculate}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#173B2B] text-[#F7F5EF] font-bold text-sm uppercase tracking-wider hover:bg-[#224D39] transition shadow-lg flex items-center justify-center gap-2 mx-auto border-2 border-[#B59658] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#B59658]" />
              <span>
                {lang === 'hi' 
                  ? `एजेंटिक एआई से ${activeCrop.hindiName} की 2-मंडी योजना खोजें` 
                  : `Discover 2-Mandi Arbitrage Plan for ${activeCrop.crop}`}
              </span>
            </button>
          </div>

          {/* STEP 3: AGENTIC MATHEMATICAL CALCULATION RESULTS (2 MANDIS SUGGESTED) */}
          {isCalculated && (
            <div className="bg-[#173B2B] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#B59658] shadow-2xl relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#B59658]/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Title & Speech Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#B59658] text-[#173B2B] mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? "स्थान के अनुसार 2 अनुशंसित मंडियां" : "Agentic AI 2-Mandi Recommendations"}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F4EEDF]">
                    {lang === 'hi' ? `${farmLocation} से वास्तविक सड़क दूरी व मुनाफा` : `Real Highway Routes from ${farmLocation}`}
                  </h3>
                </div>

                <button
                  onClick={toggleVoice}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border self-start sm:self-auto cursor-pointer ${
                    isSpeaking 
                      ? 'bg-[#B59658] text-[#173B2B] border-[#B59658] animate-pulse' 
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4BA7B]" />}
                  <span>{isSpeaking ? (lang === 'hi' ? "आवाज़ रोकें" : "Stop Voice") : (lang === 'hi' ? "🔊 बोलकर सुनें" : "🔊 Listen to AI Voice")}</span>
                </button>
              </div>

              {/* DUAL RECOMMENDATION CARDS (SIDE-BY-SIDE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                
                {/* OPTION 1: HIGHEST ESTIMATED NET RETURN */}
                <div className={`p-4 rounded-2xl border transition ${
                  activeTab === 'rec1' 
                    ? 'bg-black/50 border-[#B59658] ring-2 ring-[#B59658]/50' 
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B59658] text-[#173B2B]">
                      ★ {lang === 'hi' ? "विकल्प 1: अधिकतम मुनाफा" : "Option 1: Max Profit"}
                    </span>
                    <span className="text-xs font-mono text-[#D4BA7B]">₹{rec1.unitPrice}/kg rate</span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-[#F4EEDF]">
                    {lang === 'hi' ? rec1.mandiHindiName : rec1.mandiName}
                  </h4>
                  <div className="text-xs text-[#8FA58E] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B59658]" />
                    <span>{rec1.distanceKm} km ({rec1.travelTimeHours} hrs) via {rec1.highwayRoute}</span>
                  </div>

                  {/* Net Return Highlight */}
                  <div className="my-3 p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[11px] text-[#8FA58E] uppercase font-bold">
                      {lang === 'hi' ? "हाथ में शुद्ध मुनाफा:" : "Net Take-Home Cash:"}
                    </div>
                    <div className="font-serif text-3xl font-bold text-white mt-0.5">
                      ₹{rec1.netReturn.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      ₹{rec1.netReturnPerKg}/kg net • Freight: −₹{rec1.transportCost.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('rec1')}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === 'rec1' 
                        ? 'bg-[#B59658] text-[#173B2B]' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {lang === 'hi' ? "विकल्प 1 का पूरा विवरण देखें" : "View Breakdown (Option 1)"}
                  </button>
                </div>

                {/* OPTION 2: BEST DISTINCT ALTERNATIVE */}
                {rec2 ? (
                  <div className={`p-4 rounded-2xl border transition ${
                    activeTab === 'rec2' 
                      ? 'bg-black/50 border-emerald-400 ring-2 ring-emerald-400/50' 
                      : 'bg-black/30 border-white/10 hover:border-white/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                        ⚖️ {lang === 'hi' ? "विकल्प 2: सर्वोत्तम विकल्प" : "Option 2: Best Alt"}
                      </span>
                      <span className="text-xs font-mono text-emerald-300">₹{rec2.unitPrice}/kg rate</span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-[#F4EEDF]">
                      {lang === 'hi' ? rec2.mandiHindiName : rec2.mandiName}
                    </h4>
                    <div className="text-xs text-[#8FA58E] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{rec2.distanceKm} km ({rec2.travelTimeHours} hrs) via {rec2.highwayRoute}</span>
                    </div>

                    {/* Net Return Highlight */}
                    <div className="my-3 p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[11px] text-[#8FA58E] uppercase font-bold">
                        {lang === 'hi' ? "हाथ में शुद्ध मुनाफा:" : "Net Take-Home Cash:"}
                      </div>
                      <div className="font-serif text-3xl font-bold text-white mt-0.5">
                        ₹{rec2.netReturn.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        ₹{rec2.netReturnPerKg}/kg net • Freight: −₹{rec2.transportCost.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('rec2')}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                        activeTab === 'rec2' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {lang === 'hi' ? "विकल्प 2 का पूरा विवरण देखें" : "View Breakdown (Option 2)"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/10 bg-black/20 flex flex-col justify-center text-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h5 className="font-bold text-sm text-[#F4EEDF]">
                      {lang === 'hi' ? "एकमात्र सुरक्षित मंडी" : "Single Feasible Market"}
                    </h5>
                    <p className="text-xs text-[#8FA58E] mt-1">
                      {planResult.noAlternativeReasonHi || planResult.noAlternativeReasonEn}
                    </p>
                  </div>
                )}

              </div>

              {/* TRADE-OFF ANALYSIS CALLOUT */}
              {tradeOffs && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-[#F4EEDF] flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0">⚖️</span>
                  <div>
                    <span className="font-bold text-[#D4BA7B]">
                      {lang === 'hi' ? "एजेंटिक एआई तुलना विश्लेषण (Trade-off Analysis): " : "Agentic AI Trade-off Analysis: "}
                    </span>
                    <span>{lang === 'hi' ? tradeOffs.summaryHi : tradeOffs.summaryEn}</span>
                  </div>
                </div>
              )}

              {/* ACTIVE MANDI TRANSPARENT MATHEMATICAL BREAKDOWN */}
              {(() => {
                const activeMandi = (activeTab === 'rec2' && rec2) ? rec2 : rec1;
                return (
                  <div className="bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 mb-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-4 h-4" />
                        <span>{lang === 'hi' ? `${activeMandi.mandiHindiName} का पूरा हिसाब:` : `Financial Breakdown for ${activeMandi.mandiName}:`}</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#8FA58E]">
                        Geoapify Highway Distance: {activeMandi.distanceKm} km
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between items-center py-1 border-b border-white/10">
                        <span className="text-[#EBE8DE]">
                          [1] {lang === 'hi' ? "कुल माल मूल्य" : "Gross Produce Value"}: ({quantityKg} kg × ₹{activeMandi.unitPrice}/kg)
                        </span>
                        <span className="font-bold text-white font-mono">₹{activeMandi.grossRevenue.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-white/10 text-red-300">
                        <span>
                          [2] {lang === 'hi' ? "गाड़ी भाड़ा" : "Logistics Haulage Cost"}: ({activeMandi.distanceKm} km × ₹{effectiveVehicle.costPerKm}/km)
                        </span>
                        <span className="font-bold font-mono">− ₹{activeMandi.transportCost.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-white/10 text-red-300">
                        <span>
                          [3] {lang === 'hi' ? "मंडी शुल्क एवं सेस" : "Mandi APMC Fees & Cess"}:
                        </span>
                        <span className="font-bold font-mono">− ₹{activeMandi.totalMandiFees.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-white/10 text-red-300">
                        <span>
                          [4] {lang === 'hi' ? "रास्ते में अनुमानित नुकसान" : "Estimated Transit Spoilage Factor"}:
                        </span>
                        <span className="font-bold font-mono">− ₹{activeMandi.expectedSpoilageLossRs.toLocaleString('en-IN')}</span>
                      </div>

                      {/* FINAL NET IN HAND */}
                      <div className="flex justify-between items-center pt-2 text-[#D4BA7B]">
                        <span className="font-bold uppercase tracking-wider text-sm sm:text-base">
                          [5] {lang === 'hi' ? "किसान की शुद्ध कमाई (Final Pocket Profit)" : "Net Take-Home Cash in Hand"}:
                        </span>
                        <div className="text-right">
                          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EEDF] leading-none">
                            ₹{activeMandi.netReturn.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-[#8FA58E] font-mono mt-0.5">
                            (₹{activeMandi.netReturnPerKg} / kg net in pocket)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ACTION: APPLY THIS 2-MANDI PLAN */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleApply}
                  className="flex-1 py-3.5 rounded-xl bg-[#B59658] text-[#173B2B] font-bold text-xs uppercase tracking-wider hover:bg-[#D4BA7B] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {lang === 'hi' 
                      ? `यह 2-मंडी योजना मुख्य डैशबोर्ड पर लागू करें` 
                      : `Apply 2-Mandi Plan to Main Dashboard`}
                  </span>
                </button>

                <button
                  onClick={() => { stopSpeech(); onClose(); }}
                  className="py-3.5 px-6 rounded-xl bg-white/15 text-white font-semibold text-xs hover:bg-white/25 transition cursor-pointer"
                >
                  {lang === 'hi' ? "बंद करें" : "Close"}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
