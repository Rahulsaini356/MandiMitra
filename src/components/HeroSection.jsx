import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Bot, 
  Sparkles, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  Heart,
  Shield,
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

// 4K Crop Showcase Data with Botanical Details and Nutritional Health Benefits
const CROP_SLIDES = [
  {
    crop: 'Tomato',
    hindiName: 'टमाटर',
    batchId: 'batch-1',
    botanical: 'Solanum lycopersicum',
    badgeEn: 'Perishable Superfood • High Mandi Velocity',
    badgeHi: 'अति-संवेदनशील • तीव्र मंडी मांग',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=2560&q=85',
    colorTint: '#E85A4F',
    benefitsEn: [
      { 
        icon: Heart, 
        title: 'Lycopene & Heart Health', 
        desc: 'Potent natural antioxidant protecting heart tissue and reducing vascular inflammation.' 
      },
      { 
        icon: Shield, 
        title: 'Immunity Vitamin C (28%)', 
        desc: 'One serving supplies 28% daily Vitamin C, building cellular resilience and natural defense.' 
      },
      { 
        icon: Clock, 
        title: '36h Freshness Window', 
        desc: 'Early morning haulage avoids noon heat, locking in firm Grade-A premium price.' 
      }
    ],
    benefitsHi: [
      { 
        icon: Heart, 
        title: 'लाइकोपीन व हृदय सुरक्षा', 
        desc: 'हृदय धमनियों और कोलेस्ट्रॉल नियंत्रण में सहायक शक्तिशाली प्राकृतिक एंटीऑक्सीडेंट।' 
      },
      { 
        icon: Shield, 
        title: 'विटामिन C रोग प्रतिरोधक (28%)', 
        desc: 'दैनिक आवश्यकता का 28% विटामिन C प्रदान करता है, प्राकृतिक रोग प्रतिरोधक क्षमता बढ़ाता है।' 
      },
      { 
        icon: Clock, 
        title: '36 घंटे ताज़गी विंडो', 
        desc: 'सुबह जल्दी रवानगी से दोपहर की तेज धूप से बचाव होता है और मंडी में ए-ग्रेड भाव मिलता है।' 
      }
    ]
  },
  {
    crop: 'Onion',
    hindiName: 'प्याज',
    batchId: 'batch-2',
    botanical: 'Allium cepa',
    badgeEn: 'Cured Interstate Freight • Stable Arbitrage',
    badgeHi: 'सूखी लंबी दूरी फसल • स्थिर मंडी अंतर',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=2560&q=85',
    colorTint: '#8E3B68',
    benefitsEn: [
      { 
        icon: Heart, 
        title: 'Quercetin Flavonoids', 
        desc: 'Natural flavonoids regulate blood pressure, calm arterial spasms, and reduce cholesterol.' 
      },
      { 
        icon: Shield, 
        title: 'Prebiotic Inulin Fiber', 
        desc: 'Abundant inulin fuels healthy gut microbiome, improving digestion and nutrient absorption.' 
      },
      { 
        icon: Clock, 
        title: '144h Long-Haul Transit', 
        desc: 'Cured skin allows safe transit over 250+ km without spoilage decay or weight shrinkage.' 
      }
    ],
    benefitsHi: [
      { 
        icon: Heart, 
        title: 'क्वेरसेटिन एंटी-इन्फ्लेमेटरी', 
        desc: 'रक्तचाप को नियंत्रित करने और सूजन कम करने में प्राकृतिक फ्लेवोनोइड्स सहायक हैं।' 
      },
      { 
        icon: Shield, 
        title: 'पाचन के लिए इनुलिन फाइबर', 
        desc: 'पेट के लाभदायक बैक्टीरिया को पोषण देता है और पाचन तंत्र को स्वस्थ व सुचारू रखता है।' 
      },
      { 
        icon: Clock, 
        title: '144 घंटे लंबी यात्रा सहिष्णुता', 
        desc: 'अच्छी तरह सुखाया हुआ प्याज 250+ किमी की लंबी दूरी में भी बिना नुकसान सुरक्षित रहता है।' 
      }
    ]
  },
  {
    crop: 'Potato',
    hindiName: 'आलू',
    batchId: 'batch-3',
    botanical: 'Solanum tuberosum',
    badgeEn: 'Bulk Logistics Anchor • High Caloric Stamina',
    badgeHi: 'भारी परिवहन अनुकूल • ऊर्जावान मुख्य खाद्य',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2560&q=85',
    colorTint: '#D4A373',
    benefitsEn: [
      { 
        icon: Heart, 
        title: 'Potassium Surpassing Bananas', 
        desc: 'More potassium per gram than bananas, vital for electrolyte balance and sustained stamina.' 
      },
      { 
        icon: Shield, 
        title: 'Resistant Complex Starch', 
        desc: 'Digestive resistant starch fuels stable energy with balanced glycemic metabolic control.' 
      },
      { 
        icon: Clock, 
        title: '360h Durability Window', 
        desc: 'High physical durability permits full truckload packing with lowest per-kg freight tariff.' 
      }
    ],
    benefitsHi: [
      { 
        icon: Heart, 
        title: 'केले से भी अधिक पोटैशियम', 
        desc: 'मांसपेशियों और प्राकृतिक ऊर्जा के लिए केले से भी अधिक पोटैशियम प्रदान करता है।' 
      },
      { 
        icon: Shield, 
        title: 'रेसिस्टेंट स्टार्च व ऊर्जा', 
        desc: 'जटिल कार्बोहाइड्रेट दिनभर स्थिर और संतुलित शारीरिक ऊर्जा बनाए रखते हैं।' 
      },
      { 
        icon: Clock, 
        title: '360 घंटे शेल्फ लाइफ', 
        desc: 'मजबूत छिलका होने से पूरी गाड़ी भरकर दूर की मंडियों में सबसे कम भाड़े पर भेजा जा सकता है।' 
      }
    ]
  },
  {
    crop: 'Chilli',
    hindiName: 'हरी मिर्च',
    batchId: 'batch-4',
    botanical: 'Capsicum annuum',
    badgeEn: 'High-Value Cash Crop • Express Logistics',
    badgeHi: 'उच्च मूल्य नकदी फसल • तीव्र एक्सप्रेस रवानगी',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=2560&q=85',
    colorTint: '#2D6A4F',
    benefitsEn: [
      { 
        icon: Flame, 
        title: 'Metabolic Capsaicin Boost', 
        desc: 'Capsaicin stimulates thermogenesis, improves circulation, and delivers natural pain relief.' 
      },
      { 
        icon: Shield, 
        title: 'Mega Vitamin C Powerhouse', 
        desc: 'Gram-for-gram higher Vitamin C than citrus fruit, guarding against infectious fatigue.' 
      },
      { 
        icon: Zap, 
        title: 'Express High-Value Margin', 
        desc: 'High ₹40+/kg value allows rapid small-vehicle delivery while easily covering fuel costs.' 
      }
    ],
    benefitsHi: [
      { 
        icon: Flame, 
        title: 'कैप्साइसिन व मेटाबॉलिज्म', 
        desc: 'रक्त संचार को तेज करता है और शरीर की ऊर्जा व प्राकृतिक मेटाबॉलिज्म को गति देता है।' 
      },
      { 
        icon: Shield, 
        title: 'विटामिन C का उच्च भंडार', 
        desc: 'संतरे से भी अधिक सघन विटामिन C, जो संक्रामक रोगों से प्राकृतिक सुरक्षा देता है।' 
      },
      { 
        icon: Zap, 
        title: 'उच्च मूल्य प्रति किलो', 
        desc: '₹40+/किग्रा होने के कारण छोटी गाड़ी से तुरंत भेजना बहुत मुनाफे का सौदा साबित होता है।' 
      }
    ]
  }
];

export default function HeroSection({
  t,
  lang,
  batches,
  selectedBatch,
  setSelectedBatch,
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
  onOpenMandiMitra,
  onOpenPlanBuilder,
  onScrollToPlan,
  result
}) {
  const rec1 = result.recommendation1 || result.recommended;
  const rec2 = result.recommendation2 || result.bestAlternative;
  const rec = rec1;
  const tradeOffs = result.tradeOffs;

  const [selectedRecTab, setSelectedRecTab] = useState('rec1'); // 'rec1' | 'rec2'

  // Active slideshow state
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync slide with selectedBatch when changed externally
  useEffect(() => {
    const idx = CROP_SLIDES.findIndex(s => s.crop === selectedBatch.crop);
    if (idx !== -1 && idx !== slideIdx) {
      setSlideIdx(idx);
    }
  }, [selectedBatch.crop]);

  // Slideshow auto-rotation timer (5.5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    // Don't auto-rotate and overwrite if farmer created a custom plan or set live GPS coordinates
    if (selectedBatch?.isCustomPlan || selectedBatch?.farmCoordinates) return;

    const interval = setInterval(() => {
      setSlideIdx((prev) => {
        const nextIdx = (prev + 1) % CROP_SLIDES.length;
        // Also sync batch to match the active slide
        const nextSlide = CROP_SLIDES[nextIdx];
        const matchingBatch = batches.find(b => b.crop === nextSlide.crop);
        if (matchingBatch) {
          setSelectedBatch(matchingBatch);
        }
        return nextIdx;
      });
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, batches, setSelectedBatch, selectedBatch?.isCustomPlan, selectedBatch?.farmCoordinates]);

  const currentSlide = CROP_SLIDES[slideIdx] || CROP_SLIDES[0];
  const benefits = lang === 'hi' ? currentSlide.benefitsHi : currentSlide.benefitsEn;

  // Handle direct crop click
  const handleSelectCrop = (cropName) => {
    const idx = CROP_SLIDES.findIndex(s => s.crop === cropName);
    if (idx !== -1) {
      setSlideIdx(idx);
      const matchingBatch = batches.find(b => b.crop === cropName);
      if (matchingBatch) setSelectedBatch(matchingBatch);
    }
  };

  const handlePrevSlide = () => {
    const nextIdx = (slideIdx - 1 + CROP_SLIDES.length) % CROP_SLIDES.length;
    setSlideIdx(nextIdx);
    const nextSlide = CROP_SLIDES[nextIdx];
    const matchingBatch = batches.find(b => b.crop === nextSlide.crop);
    if (matchingBatch) setSelectedBatch(matchingBatch);
  };

  const handleNextSlide = () => {
    const nextIdx = (slideIdx + 1) % CROP_SLIDES.length;
    setSlideIdx(nextIdx);
    const nextSlide = CROP_SLIDES[nextIdx];
    const matchingBatch = batches.find(b => b.crop === nextSlide.crop);
    if (matchingBatch) setSelectedBatch(matchingBatch);
  };

  return (
    <section id="hero" className="py-4 sm:py-6 lg:py-8 bg-[#F7F5EF]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* CINEMATIC 4K MAIN DASHBOARD BOARD */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#173B2B]/20 min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
          
          {/* Full-Screen 4K Background Slideshow Image with smooth Ken-Burns scale */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.crop}
              key={currentSlide.crop}
              className="w-full h-full object-cover object-center transition-all duration-1000 filter brightness-[0.85] scale-105"
            />
            {/* Multi-layered gradient overlay ensuring 100% text readability with ZERO overlap */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F261C] via-[#173B2B]/85 to-[#0F261C]/90 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>
          </div>

          {/* BOARD TOP BAR: One-Touch Crop & Vehicle Selectors */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-7 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
            
            {/* Quick 1-Touch Crop Switcher Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#D4BA7B] hidden sm:inline mr-1 flex-shrink-0">
                {lang === 'hi' ? "फसल चुनें:" : "Select Crop:"}
              </span>
              {CROP_SLIDES.map((slide) => {
                const isActive = slide.crop === selectedBatch.crop;
                const batch = batches.find(b => b.crop === slide.crop);
                const emoji = slide.crop === 'Tomato' ? '🍅' : slide.crop === 'Onion' ? '🧅' : slide.crop === 'Potato' ? '🥔' : '🌶️';
                return (
                  <button
                    key={slide.crop}
                    onClick={() => handleSelectCrop(slide.crop)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap border flex-shrink-0 ${
                      isActive 
                        ? 'bg-[#B59658] text-[#173B2B] border-[#B59658] shadow-md scale-105 font-bold' 
                        : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{lang === 'hi' ? slide.hindiName : slide.crop}</span>
                    {batch && (
                      <span className="text-[10px] opacity-80">({batch.quantityKg} kg)</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Vehicle Selector Pill & Create Plan Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-white">
                <span className="text-[11px] text-[#8FA58E] hidden md:inline">
                  {lang === 'hi' ? "वाहन:" : "Vehicle:"}
                </span>
                <select
                  value={selectedVehicle.id}
                  onChange={(e) => {
                    const v = vehicles.find(item => item.id === e.target.value);
                    if (v) setSelectedVehicle(v);
                  }}
                  className="bg-black/60 text-[#F4EEDF] border border-white/20 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id} className="bg-[#173B2B] text-white">
                      {v.name} ({v.capacityKg} kg)
                    </option>
                  ))}
                </select>
              </div>

              {onOpenPlanBuilder && (
                <button
                  onClick={onOpenPlanBuilder}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B59658] text-[#173B2B] text-xs font-bold hover:bg-[#D4BA7B] transition shadow-md whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? "नया प्लान बनाएं" : "Create Plan"}</span>
                </button>
              )}
            </div>
          </div>

          {/* BOARD MAIN BODY: Left Crop Benefits + Right Instant Winning Mandi */}
          <div className="relative z-10 p-5 sm:p-7 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center flex-1">
            
            {/* Left Column: 4K Vegetable Botanical Details & Health Benefits */}
            <div className="lg:col-span-7 space-y-5">
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B59658] text-[#173B2B] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>4K Crop Intelligence • {currentSlide.botanical}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#8FA58E] bg-black/40 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline">
                    {lang === 'hi' ? currentSlide.badgeHi : currentSlide.badgeEn}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight break-words">
                  {t.hero.titleLine1} <br className="hidden sm:block" />
                  <span className="italic font-normal text-[#D4BA7B]">
                    {t.hero.titleLine2}
                  </span>
                </h1>

                <p className="mt-3 text-sm sm:text-base text-[#EBE8DE] max-w-xl leading-relaxed">
                  {t.hero.subtitle}
                </p>
              </div>

              {/* 3 Clear Vegetable Nutritional Benefits Badges */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#8FA58E]">
                  {lang === 'hi' 
                    ? `इस फसल के मुख्य पोषण लाभ एवं ताज़गी विंडो:` 
                    : `Key Nutritional & Market Resilience Benefits:`}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {benefits.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={idx} 
                        className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/15 flex flex-col justify-between text-xs text-white hover:bg-black/60 transition"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-lg bg-[#B59658]/20 text-[#D4BA7B] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-[#D4BA7B] text-[11px] leading-snug line-clamp-1">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-[#EBE8DE] leading-snug opacity-90">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: DUAL RECOMMENDATION DECISION CARD */}
            <div className="lg:col-span-5">
              <div className="clay-card bg-white/95 backdrop-blur-md text-[#1D2420] rounded-3xl p-5 sm:p-7 border border-white/70">
                
                {/* Dual Option Switcher Tabs when both exist */}
                {rec2 ? (
                  <div className="flex items-center gap-2 p-1.5 clay-inset rounded-2xl mb-4">
                    <button
                      onClick={() => setSelectedRecTab('rec1')}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRecTab === 'rec1'
                          ? 'clay-button-primary text-[#D4BA7B]'
                          : 'text-[#68736C] hover:text-[#173B2B]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-[#D4BA7B]" />
                      <span>{lang === 'hi' ? "विकल्प 1: अधिकतम मुनाफा" : "Option 1: Max Profit"}</span>
                    </button>
                    <button
                      onClick={() => setSelectedRecTab('rec2')}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRecTab === 'rec2'
                          ? 'clay-button-primary text-[#D4BA7B]'
                          : 'text-[#68736C] hover:text-[#173B2B]'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'hi' ? "विकल्प 2: सर्वोत्तम विकल्प" : "Option 2: Best Alt"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pb-3 border-b border-[#EEEDE7]">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full clay-button-primary text-[#D4BA7B] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{t.recommendation.badge}</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {lang === 'hi' ? "एकमात्र सुरक्षित विकल्प" : "100% Feasible Choice"}
                    </span>
                  </div>
                )}

                {/* Mandi Title & Route */}
                {(() => {
                  const activeRec = (selectedRecTab === 'rec2' && rec2) ? rec2 : rec1;
                  const isOption1 = activeRec.mandiId === rec1.mandiId;

                  return (
                    <>
                      <div className="mt-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#B59658]">
                          {isOption1 
                            ? (lang === 'hi' ? "अनुशंसा 1 (अधिकतम शुद्ध मुनाफा)" : "Recommendation 1 (Highest Net Return)")
                            : (lang === 'hi' ? "अनुशंसा 2 (सर्वोत्तम वैकल्पिक मंडी)" : "Recommendation 2 (Best Distinct Alternative)")
                          }
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173B2B] leading-tight mt-0.5">
                          {lang === 'hi' ? activeRec.mandiHindiName : activeRec.mandiName}
                        </h2>
                        <div className="text-xs text-[#68736C] mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#315C43] flex-shrink-0" />
                          <span>{activeRec.distanceKm} km ({activeRec.travelTimeHours} hrs) via {activeRec.highwayRoute}</span>
                        </div>
                      </div>

                      {/* Big Net Return Callout */}
                      <div className="my-4 p-4.5 rounded-2xl clay-inset">
                        <div className="text-xs uppercase font-bold text-[#68736C]">
                          {t.recommendation.estimatedNetReturn}
                        </div>
                        <div className="font-serif text-4xl sm:text-5xl font-bold text-[#173B2B] mt-1 leading-none tracking-tight">
                          ₹{activeRec.netReturn.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-[#315C43] font-semibold mt-1.5">
                          (₹{activeRec.netReturnPerKg} net cash in hand / kg @ ₹{activeRec.unitPrice}/kg AGMARKNET)
                        </div>
                      </div>

                      {/* Trade-off Rationale Callout */}
                      <div className="space-y-2 text-xs text-[#1D2420] mb-5">
                        {tradeOffs && (
                          <div className="p-3 rounded-2xl clay-card-gold text-[11px] text-amber-950 leading-snug">
                            <span className="font-bold">⚖️ {lang === 'hi' ? "विकल्प तुलना:" : "Trade-off:"} </span>
                            <span>{lang === 'hi' ? tradeOffs.summaryHi : tradeOffs.summaryEn}</span>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>
                            {lang === 'hi'
                              ? `गाड़ी भाड़ा: ₹${activeRec.transportCost.toLocaleString('en-IN')} (${activeRec.distanceKm} किमी), मंडी शुल्क: ₹${activeRec.totalMandiFees}`
                              : `Transport Freight: ₹${activeRec.transportCost.toLocaleString('en-IN')} (${activeRec.distanceKm} km), Mandi Fees: ₹${activeRec.totalMandiFees}`}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>
                            {lang === 'hi'
                              ? `${activeRec.totalTransitHours} घंटे यात्रा समय में ताज़गी ग्रेड-ए सुरक्षित रहती है`
                              : `${activeRec.totalTransitHours}h total transit maintains Grade-A firmness window`}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Primary Actions */}
                <div className="space-y-2.5">
                  <button
                    onClick={onScrollToPlan}
                    className="w-full py-3.5 rounded-2xl clay-button-primary text-[#F7F5EF] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'hi' ? "पूरा हिसाब व रवानगी योजना" : "View Breakdown & Dispatch Plan"}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4BA7B]" />
                  </button>

                  {onOpenPlanBuilder && (
                    <button
                      onClick={onOpenPlanBuilder}
                      className="w-full py-3 rounded-2xl clay-button-brass text-[#173B2B] font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#173B2B]" />
                      <span>{lang === 'hi' ? "अपनी फसल व मात्रा का नया प्लान बनाएं" : "Create Custom Fasal Plan"}</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenMandiMitra}
                    className="w-full py-2.5 rounded-2xl clay-button-light text-[#173B2B] font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Bot className="w-4 h-4 text-[#315C43]" />
                    <span>{t.hero.ctaSecondary}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* BOARD FOOTER: Slideshow Controls & Real Data Timestamp */}
          <div className="relative z-10 px-4 sm:px-6 py-3 bg-black/70 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#EBE8DE] gap-3">
            
            {/* Live Data Feed Source */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AGMARKNET Official Rajasthan Feed • Updated {rec?.lastUpdated || "Live Feed"}</span>
            </div>

            {/* Slideshow Player Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 mr-2">
                {CROP_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideIdx(i);
                      const matchingBatch = batches.find(b => b.crop === CROP_SLIDES[i].crop);
                      if (matchingBatch) setSelectedBatch(matchingBatch);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slideIdx ? 'w-6 bg-[#B59658]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-[11px]"
                title={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#D4BA7B]" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={handlePrevSlide}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Previous crop slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleNextSlide}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Next crop slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
