import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Sprout,
  Thermometer,
  Apple
} from 'lucide-react';

const SLIDES = [
  {
    id: 'tomato',
    cropEn: 'Hybrid Desi Tomato',
    cropHi: 'टमाटर (हाइब्रिड देसी)',
    botanical: 'Solanum lycopersicum',
    badgeEn: 'Perishable Superfood • High Mandi Velocity',
    badgeHi: 'उच्च ताज़गी फसल • तीव्र मंडी मांग',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=2000&q=85',
    colorTint: '#E85A4F',
    nutritionalBenefits: [
      {
        titleEn: 'Rich in Lycopene',
        titleHi: 'लाइकोपीन से भरपूर',
        descEn: 'Powerful antioxidant supporting heart health, lower LDL cholesterol, and cellular protection.',
        descHi: 'हृदय स्वास्थ्य और कोलेस्ट्रॉल नियंत्रण में सहायक शक्तिशाली एंटीऑक्सीडेंट।'
      },
      {
        titleEn: 'Vitamin C & Potassium',
        titleHi: 'विटामिन C एवं पोटैशियम',
        descEn: 'One medium tomato provides 28% of daily Vitamin C needs, boosting natural immunity and vascular elasticity.',
        descHi: 'दैनिक आवश्यकता का 28% विटामिन C प्रदान करता है, रोग प्रतिरोधक क्षमता बढ़ाता है।'
      },
      {
        titleEn: 'Skin Glow & Vision',
        titleHi: 'त्वचा एवं दृष्टि सुरक्षा',
        descEn: 'Beta-carotene, lutein, and zeaxanthin protect eyes from light damage and nourish skin tissue.',
        descHi: 'ल्यूटिन और बीटा-कैरोटीन आँखों की रोशनी और त्वचा की सुरक्षा करते हैं।'
      }
    ],
    mandiEconomics: {
      shelfLife: '36–48 hrs (High Perishability)',
      shelfLifeHi: '36–48 घंटे (अति-संवेदनशील)',
      optTemp: '12–15°C (Shaded Ventilation)',
      optTempHi: '12–15°C (छायादार व हवादार)',
      mandiStrategyEn: 'Early morning dispatch avoids noon heat peak, reducing weight shrinkage by up to 35% and preserving firm Grade-A premium price.',
      mandiStrategyHi: 'सुबह जल्दी रवानगी से दोपहर की धूप से बचाव होता है, जिससे माल का वजन 35% तक कम घटता है और ग्रेड-A भाव मिलता है।',
      targetPrice: '₹22 – ₹26 / kg'
    }
  },
  {
    id: 'onion',
    cropEn: 'Cured Nasik Red Onion',
    cropHi: 'प्याज (नासिक लाल ग्रेड-A)',
    botanical: 'Allium cepa',
    badgeEn: 'Essential Kitchen Staple • Interstate Arbitrage',
    badgeHi: 'सदाबहार मुख्य फसल • अंतरराज्यीय व्यापार',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=2000&q=85',
    colorTint: '#8E3B68',
    nutritionalBenefits: [
      {
        titleEn: 'Anti-Inflammatory Quercetin',
        titleHi: 'क्वेरसेटिन एंटी-इन्फ्लेमेटरी',
        descEn: 'Abundant natural flavonoids combat arterial inflammation, relieve allergies, and regulate blood pressure.',
        descHi: 'रक्तचाप को नियंत्रित करने और सूजन को कम करने में प्राकृतिक फ्लेवोनोइड्स सहायक हैं।'
      },
      {
        titleEn: 'Prebiotic Gut Fuel',
        titleHi: 'पाचन एवं गट स्वास्थ्य',
        descEn: 'Packed with inulin and fructooligosaccharides, nourishing healthy gut bacteria for optimal digestion.',
        descHi: 'इनुलिन और फाइबर से भरपूर, जो पाचन तंत्र और पेट के बैक्टीरिया को स्वस्थ रखते हैं।'
      },
      {
        titleEn: 'Organic Sulfur Compounds',
        titleHi: 'सल्फर एवं एंटीबैक्टीरियल',
        descEn: 'Natural sulfur agents help maintain balanced blood glucose and provide natural antibacterial action.',
        descHi: 'प्राकृतिक सल्फर यौगिक रक्त शर्करा को संतुलित रखने और कीटाणुओं से लड़ने में मदद करते हैं।'
      }
    ],
    mandiEconomics: {
      shelfLife: '120–180 hrs (Medium Cured)',
      shelfLifeHi: '120–180 घंटे (मध्यम शेल्फ लाइफ)',
      optTemp: 'Dry Ambient (<65% RH)',
      optTempHi: 'सूखा वातावरण (65% से कम नमी)',
      mandiStrategyEn: 'Properly cured outer skins allow long haulage over 200+ km without neck-rot, letting cooperatives target distant high-demand terminal hubs.',
      mandiStrategyHi: 'अच्छी तरह सुखाया हुआ प्याज 200+ किमी की लंबी दूरी में भी सुरक्षित रहता है, जिससे दूर की बड़ी मंडियों में ऊँचा भाव मिलता है।',
      targetPrice: '₹26 – ₹30 / kg'
    }
  },
  {
    id: 'potato',
    cropEn: 'Golden Kufri Pukhraj Potato',
    cropHi: 'आलू (कुफरी पुखराज)',
    botanical: 'Solanum tuberosum',
    badgeEn: 'Caloric Food Security • Bulk Logistics Anchor',
    badgeHi: 'स्थिर ऊर्जा स्रोत • भारी परिवहन अनुकूल',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2000&q=85',
    colorTint: '#D4A373',
    nutritionalBenefits: [
      {
        titleEn: 'Potassium Heavyweight',
        titleHi: 'पोटैशियम का समृद्ध स्रोत',
        descEn: 'Contains more potassium per serving than bananas, crucial for electrolyte balance and sustained muscle performance.',
        descHi: 'केले से भी अधिक पोटैशियम होता है, जो मांसपेशियों और इलेक्ट्रोलाइट संतुलन के लिए आवश्यक है।'
      },
      {
        titleEn: 'Resistant Starch',
        titleHi: 'रेसिस्टेंट स्टार्च व ऊर्जा',
        descEn: 'Healthy complex carbohydrates provide enduring stamina with a balanced glycemic response when cooled.',
        descHi: 'जटिल कार्बोहाइड्रेट दिनभर निरंतर ऊर्जा प्रदान करते हैं और वजन नियंत्रित रखते हैं।'
      },
      {
        titleEn: 'Vitamin B6 & Iron',
        titleHi: 'विटामिन B6 एवं आयरन',
        descEn: 'Essential for red blood cell formation, neurotransmitter synthesis, and cellular repair.',
        descHi: 'लाल रक्त कोशिकाओं के निर्माण और मस्तिष्क स्वास्थ्य के लिए अनिवार्य पोषक तत्व।'
      }
    ],
    mandiEconomics: {
      shelfLife: '240–360 hrs (Low Perishability)',
      shelfLifeHi: '240–360 घंटे (लंबी शेल्फ लाइफ)',
      optTemp: '10–14°C (Dark Shaded Dry)',
      optTempHi: '10–14°C (छायादार व सूखा)',
      mandiStrategyEn: 'Robust skin integrity permits full-truckload (FTL) bulk packing, reducing per-quintal freight tariff to its lowest operational baseline.',
      mandiStrategyHi: 'मजबूत छिलका होने के कारण पूरी गाड़ी भरकर परिवहन किया जा सकता है, जिससे प्रति क्विंटल भाड़ा सबसे कम आता है।',
      targetPrice: '₹16 – ₹20 / kg'
    }
  },
  {
    id: 'chilli',
    cropEn: 'Pungent Emerald Green Chilli',
    cropHi: 'हरी मिर्च (तीखी हरी किस्म)',
    botanical: 'Capsicum annuum',
    badgeEn: 'High-Value Cash Crop • Premium Daily Demand',
    badgeHi: 'उच्च मूल्य नकदी फसल • दैनिक मांग',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=2000&q=85',
    colorTint: '#2D6A4F',
    nutritionalBenefits: [
      {
        titleEn: 'Metabolic Capsaicin Boost',
        titleHi: 'मेटाबॉलिज्म एवं कैप्साइसिन',
        descEn: 'Capsaicin stimulates calorie expenditure, improves circulation, and acts as a natural pain alleviator.',
        descHi: 'कैप्साइसिन शरीर का मेटाबॉलिज्म बढ़ाता है और रक्त संचार में सुधार करता है।'
      },
      {
        titleEn: 'Zero-Calorie Vitamin C Dynamo',
        titleHi: 'विटामिन C का पावरहाउस',
        descEn: 'Green chillies contain higher Vitamin C concentration per gram than oranges, guarding against infections.',
        descHi: 'संतरे से भी अधिक विटामिन C होता है, जो संक्रामक बीमारियों से रक्षा करता है।'
      },
      {
        titleEn: 'Endorphin Stimulator',
        titleHi: 'प्राकृतिक मूड बूस्टर',
        descEn: 'Spicy sensory triggers release natural endorphins, creating feelings of alertness and vitality.',
        descHi: 'प्राकृतिक एंडोर्फिन का स्राव होता है, जो तनाव को कम करता है और सतर्कता बढ़ाता है।'
      }
    ],
    mandiEconomics: {
      shelfLife: '72–96 hrs (Moderate Window)',
      shelfLifeHi: '72–96 घंटे (संवेदनशील खिड़की)',
      optTemp: 'Aerated Plastic Crates',
      optTempHi: 'हवादार प्लास्टिक क्रेट्स',
      mandiStrategyEn: 'High price-to-weight ratio (₹35–60/kg) makes fast small-vehicle express delivery extremely profitable, overcoming fuel costs easily.',
      mandiStrategyHi: 'प्रति किलो ऊँचा दाम होने के कारण छोटी गाड़ी से तुरंत भेजना भी बहुत मुनाफे का सौदा साबित होता है।',
      targetPrice: '₹38 – ₹45 / kg'
    }
  },
  {
    id: 'wheat',
    cropEn: 'Sharbati Golden Wheat Grain',
    cropHi: 'गेहूँ (शरबती गोल्डन दाना)',
    botanical: 'Triticum aestivum',
    badgeEn: 'Food Sovereign Staple • MSP Backstop',
    badgeHi: 'अन्न सुरक्षा की रीढ़ • न्यूनतम समर्थन मूल्य',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2000&q=85',
    colorTint: '#B59658',
    nutritionalBenefits: [
      {
        titleEn: 'Whole Insoluble Fiber',
        titleHi: 'अघुलनशील आहार फाइबर',
        descEn: 'Promotes complete digestive motility, controls insulin spikes, and lowers incidence of metabolic syndrome.',
        descHi: 'पाचन क्रिया को सुचारू रखता है और मधुमेह के जोखिम को कम करता है।'
      },
      {
        titleEn: 'Zinc, Iron & Selenium',
        titleHi: 'जिंक, आयरन व सेलेनियम',
        descEn: 'Essential trace minerals vital for hemoglobin formation, immune defense, and antioxidant enzymes.',
        descHi: 'खून की कमी दूर करने और शरीर की रोग प्रतिरोधक शक्ति बढ़ाने वाले आवश्यक खनिज।'
      },
      {
        titleEn: 'Plant-Based Protein & B-Vitamins',
        titleHi: 'पादप प्रोटीन व विटामिन B',
        descEn: 'Provides plant protein, thiamine, and folate supporting muscular stamina and cognitive health.',
        descHi: 'मांसपेशियों की मजबूती और मस्तिष्क स्वास्थ्य के लिए आवश्यक पादप प्रोटीन व विटामिन।'
      }
    ],
    mandiEconomics: {
      shelfLife: '12+ Months (<12% Moisture)',
      shelfLifeHi: '12+ महीने (12% से कम नमी)',
      optTemp: 'Hermetic Bagged Storage',
      optTempHi: 'वायुरोधी बोरी भंडारण',
      mandiStrategyEn: 'Moisture testing prior to weighbridge entry guarantees zero dockage discounts. Cooperatives can hold for private flour mill premiums.',
      mandiStrategyHi: 'मंडी में तौल से पहले नमी की जाँच से कटौती नहीं होती, और रोलर फ्लोर मिलों से प्रीमियम भाव लिया जा सकता है।',
      targetPrice: '₹24 – ₹28 / kg'
    }
  }
];

export default function VegetableBenefitsSlideshow({ t, lang }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slide = SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx(prev => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="py-16 md:py-24 bg-[#F7F5EF] border-b border-[#E3DFD2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E3DFD2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEEDE7] text-[#173B2B] border border-[#E3DFD2] mb-3">
              <Apple className="w-3.5 h-3.5 text-[#B59658]" />
              <span>{lang === 'hi' ? "फसल गुणवत्ता व पोषण आसूचना" : "4K Crop Showcase & Nutritional Intelligence"}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173B2B] tracking-tight leading-snug">
              {lang === 'hi' ? "ताज़ा फसल के पोषण लाभ एवं मंडी मूल्य रणनीति" : "Produce Intelligence: Health Benefits & Market Strategy"}
            </h2>
            <p className="text-sm sm:text-base text-[#68736C] mt-2 max-w-2xl leading-relaxed">
              {lang === 'hi' 
                ? "प्रत्येक फसल की ताज़गी, पोषक तत्व और मंडी में सबसे ऊँचा दाम पाने की व्यावहारिक मार्गदर्शिका।" 
                : "Comprehensive breakdown of crop nutrition, post-harvest shelf resilience, and mandi trading economics for farmer cooperatives."}
            </p>
          </div>

          {/* Slideshow Controls Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white border border-[#E3DFD2] text-[#173B2B] hover:bg-[#EEEDE7] transition shadow-warm-sm flex items-center gap-1.5 text-xs font-semibold"
              title={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#B59658]" /> : <Play className="w-4 h-4 text-[#173B2B]" />}
              <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white border border-[#E3DFD2] text-[#173B2B] hover:bg-[#EEEDE7] transition shadow-warm-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white border border-[#E3DFD2] text-[#173B2B] hover:bg-[#EEEDE7] transition shadow-warm-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN SLIDESHOW CARD: 4K Image + Editorial Intelligence */}
        <div className="bg-white rounded-3xl border border-[#E3DFD2] shadow-warm-lg overflow-hidden transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left 4K Image Visual Window */}
            <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden bg-[#173B2B]">
              <img
                src={slide.imageUrl}
                alt={slide.cropEn}
                key={slide.id}
                className="w-full h-full object-cover object-center animate-kenburns transition-opacity duration-700"
                loading="eager"
              />
              {/* Subtle Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

              {/* Floating Image Micro-Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#B59658] text-[#173B2B] mb-2 shadow-sm">
                  {lang === 'hi' ? slide.badgeHi : slide.badgeEn}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {lang === 'hi' ? slide.cropHi : slide.cropEn}
                </h3>
                <p className="text-xs text-[#EBE8DE] italic mt-0.5 font-serif">
                  {slide.botanical}
                </p>
                
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-[#F4EEDF]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B59658]" />
                    <span>{lang === 'hi' ? slide.mandiEconomics.shelfLifeHi : slide.mandiEconomics.shelfLife}</span>
                  </span>
                  <span className="font-semibold text-[#D4BA7B]">
                    {slide.mandiEconomics.targetPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Editorial Intelligence Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
              
              <div>
                {/* Micro Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#EEEDE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#173B2B]"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#173B2B]">
                      {lang === 'hi' ? "वैज्ञानिक पोषण प्रोफ़ाइल" : "Nutritional Science & Biological Value"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EEEDE7] text-[#68736C]">
                    Slide {currentIdx + 1} of {SLIDES.length}
                  </span>
                </div>

                {/* 3 Nutritional Benefits Points */}
                <div className="space-y-4 mb-8">
                  {slide.nutritionalBenefits.map((item, bIdx) => (
                    <div 
                      key={bIdx}
                      className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E3DFD2] transition hover:border-[#8FA58E]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#E3DFD2] text-[#315C43] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          {bIdx === 0 ? <Heart className="w-4 h-4 text-[#A84242]" /> : bIdx === 1 ? <Shield className="w-4 h-4 text-[#315C43]" /> : <Sparkles className="w-4 h-4 text-[#B59658]" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-base text-[#173B2B] leading-snug">
                            {lang === 'hi' ? item.titleHi : item.titleEn}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#68736C] mt-1 leading-relaxed">
                            {lang === 'hi' ? item.descHi : item.descEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mandi & Economic Action Strategy */}
                <div className="p-5 rounded-2xl bg-[#173B2B] text-[#F7F5EF] border border-[#173B2B] shadow-warm-sm">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#D4BA7B]">
                    <TrendingUp className="w-4 h-4" />
                    <span>{lang === 'hi' ? "किसान मंडी मूल्य रणनीति" : "Farmer Economic & Mandi Price Strategy"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#EBE8DE] leading-relaxed">
                    {lang === 'hi' ? slide.mandiEconomics.mandiStrategyHi : slide.mandiEconomics.mandiStrategyEn}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#8FA58E] block text-[11px] font-medium">
                        {lang === 'hi' ? "अनुकूल भंडारण तापमान:" : "Optimal Storage Temp:"}
                      </span>
                      <span className="font-semibold text-white">
                        {lang === 'hi' ? slide.mandiEconomics.optTempHi : slide.mandiEconomics.optTemp}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8FA58E] block text-[11px] font-medium">
                        {lang === 'hi' ? "मंडी मूल्य सीमा:" : "Estimated Mandi Range:"}
                      </span>
                      <span className="font-bold text-[#D4BA7B]">
                        {slide.mandiEconomics.targetPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnails Navigation Row */}
              <div className="mt-8 pt-6 border-t border-[#EEEDE7] flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentIdx 
                          ? 'w-8 bg-[#173B2B]' 
                          : 'w-2.5 bg-[#C8C5B8] hover:bg-[#8FA58E]'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="text-xs text-[#68736C] font-medium">
                  {lang === 'hi' ? "स्वचालित परिवर्तन सक्रिय" : "Auto-advancing 4K crop showcase"}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
