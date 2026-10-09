// WayEzee / MandiMitra Bilingual System
// Supports full English & Hindi UI with 100% strict single-language purity (no hybrid mixing)

export const translations = {
  en: {
    brand: "WayEzee",
    assistantBrand: "MandiMitra",
    tagline: "Better Mandi. Better Returns.",
    subtagline: "Agricultural Market Price Arbitrage & Logistics Decision Platform",
    cooperativeLabel: "Farmer Cooperative",
    judgeTourBtn: "Judge Quick Tour (10s)",
    nav: {
      plan: "Plan My Sale",
      markets: "Markets & Mandis",
      logistics: "Logistics & Journey",
      assistant: "MandiMitra AI",
      farmerMode: "Farmer Mode",
      expertMode: "Expert Mode",
      language: "Language",
      primaryCta: "Plan My Sale"
    },
    hero: {
      eyebrow: "MANDI INTELLIGENCE & FREIGHT OPTIMIZATION",
      titleLine1: "Find the better mandi.",
      titleLine2: "Not just the higher price.",
      subtitle: "WayEzee compares mandi prices, transport costs, vehicle capacity, travel time and produce freshness to help farmer cooperatives choose the most practical selling option.",
      ctaPrimary: "Plan My Sale",
      ctaSecondary: "Ask MandiMitra",
      pipelineStep1: "PRODUCE",
      pipelineStep2: "MANDI OPTIONS",
      pipelineStep3: "LOGISTICS",
      pipelineStep4: "NET RETURN",
      pipelineStep5: "RECOMMENDATION",
      batchSelectorTitle: "Select Batch to Optimize",
      quantity: "Quantity",
      location: "Farm Location",
      perishability: "Perishability",
      harvested: "Harvested",
      shelfLife: "Shelf Life",
      selectedVehicle: "Assigned Vehicle",
      recalculateBtn: "Run Optimizer"
    },
    story: {
      badge: "THE CORE PROBLEM",
      headline: "Price ≠ Profit",
      subheadline: "Why the highest mandi headline price frequently yields a lower final return.",
      mandiAHigherPrice: "Higher Mandi Price",
      mandiALabel: "Mandi A (Jaipur)",
      mandiAPrice: "₹24 / kg",
      mandiANetReturn: "₹17,200 Net Return",
      mandiANote: "Looks attractive at first glance, but 250 km haulage and 4.5h heat loss burn farmer margin.",
      mandiBLowerPrice: "Lower Mandi Price",
      mandiBLabel: "Mandi B (Ajmer — Recommended)",
      mandiBPrice: "₹22 / kg",
      mandiBNetReturn: "₹18,280 Net Return",
      mandiBNote: "₹2/kg lower rate, but 180 km distance and lower freight produce +₹1,080 higher net return.",
      insightQuote: "“Higher mandi price does not always mean higher final return. Real profitability is Mandi Price minus Haulage, Yard Fees, and Spoilage.”"
    },
    recommendation: {
      badge: "RECOMMENDED PLAN",
      winningMandi: "Winning Mandi",
      estimatedNetReturn: "Estimated Net Return",
      netReturnPerKg: "Net Return Per KG",
      vsHeadline: "vs Alternative Mandis",
      whyWinsTitle: "Why This Plan Wins",
      reasons: [
        "Better transport economics (saves ₹2,120 in haulage cost)",
        "Lower expected transit loss (3.2h vs 4.5h travel)",
        "Guaranteed vehicle capacity & quick 30-min gate queue",
        "Higher net take-home cash for the cooperative"
      ],
      farmerSummary: "This option is more profitable. Vehicle capacity is sufficient, risk of transit damage is low, and your final return is higher.",
      usePlanBtn: "Accept & Dispatch Plan",
      sharePlanBtn: "Share with Truck Driver",
      dataSourceNote: "Prices sourced from AGMARKNET official market feed"
    },
    financials: {
      title: "Net Return Financial Summary",
      subtitle: "Deterministic breakdown of produce value and logistics deductions",
      grossRevenue: "Gross Revenue",
      transportCost: "Transport Cost",
      mandiFees: "Mandi Fees & Cess",
      estimatedLoss: "Estimated Spoilage Loss",
      netReturn: "NET RETURN",
      formulaExplanation: "Net Return = (Quantity × Mandi Price) − Transport Cost − Yard Fees − Spoilage",
      formulaFarmer: "Final Money in Hand = Total Sale Value − Truck Cost − Mandi Charges − Spoilage"
    },
    feasibility: {
      title: "Feasibility Verification",
      question: "Can this plan work in real life?",
      subtitle: "The planner automatically verifies physical and operational constraints before recommending.",
      vehicleCapacity: "Vehicle Capacity",
      vehicleCapacityDesc: "Vehicle capacity is sufficient for loaded batch",
      travelTime: "Travel Time & Shelf Life",
      travelTimeDesc: "Travel time is within acceptable freshness range",
      produceFreshness: "Produce Freshness & Spoilage",
      produceFreshnessDesc: "Perishability risk is well managed",
      netReturnPositive: "Financial Feasibility",
      netReturnPositiveDesc: "Expected net return is positive and viable",
      passStatus: "Passed",
      failStatus: "Failed",
      adviceIfFail: "Choose a larger vehicle or split the batch into two trips."
    },
    rejected: {
      title: "Rejected Alternatives",
      subtitle: "Why other mandis were not recommended (Transparency & Trust)",
      notRecommended: "Not Recommended",
      distance: "Distance",
      price: "Price",
      netReturn: "Net Return",
      deficit: "Return Deficit",
      trustQuote: "Farmers build trust when they see the math behind why other markets were excluded."
    },
    logistics: {
      title: "Logistics & Journey Visualizer",
      subtitle: "Step-by-step route from farm gate to auction yard",
      step1: "Farm Gate",
      step2: "Vehicle Loading",
      step3: "Highway Transit",
      step4: "Mandi Yard Intake",
      step5: "Auction & Settlement",
      distance: "Total Route Distance",
      estTime: "Estimated Travel Time",
      vehicleType: "Vehicle Type",
      loadedQty: "Loaded Quantity",
      freightCost: "Haulage Freight",
      queueTime: "Yard Gate Wait",
      eta: "Expected Yard Arrival"
    },
    markets: {
      title: "Mandi Market Comparison",
      subtitle: "Real-time rates, transport costs, and net return rankings across all reachable yards",
      colRank: "Rank",
      colMandi: "Mandi Yard",
      colPrice: "Headline Price",
      colDistance: "Distance",
      colTransit: "Transit Time",
      colTransport: "Transport Cost",
      colNetReturn: "Net Return",
      colSource: "Data Source & Timestamp",
      colAction: "Action",
      inspectBtn: "Inspect Math"
    },
    whatif: {
      title: "What-If Decision Simulator",
      subtitle: "Simulate price spikes, fuel cost changes, or road delays to test plan sensitivity",
      priceAdjustment: "Adjust Mandi Price (₹/kg)",
      dieselRate: "Transport Freight Rate (₹/km)",
      recalculate: "Recalculate Sensitivity",
      before: "Baseline Net Return",
      after: "Simulated Net Return",
      impact: "Net Difference",
      scenarioInsight: "See how small price or diesel variations alter optimal mandi choice."
    },
    assistant: {
      title: "MandiMitra AI",
      badge: "DECISION ASSISTANT",
      subtitle: "Conversational layer over the WayEzee planning engine",
      greeting: "Namaste! I am MandiMitra, your Mandi Decision Assistant. I analyze real mandi prices, transport costs, and crop freshness to protect your cooperative's profits. How can I help you with this batch?",
      quickQuestionsTitle: "Quick Farmer Questions",
      quickQuestions: [
        "Which mandi is the best choice for this batch?",
        "Why recommend Mandi B when Mandi A offers a higher price?",
        "Which vehicle should I send?",
        "How far is Mandi B and what is the travel time?",
        "Will my produce spoil during this transit?",
        "What is the exact transport cost breakdown?"
      ],
      inputPlaceholder: "Ask MandiMitra in English or Hindi...",
      sendBtn: "Ask Assistant",
      connectedDataNote: "Answers are grounded strictly in real batch quantities, verified AGMARKNET prices, and calculated logistics.",
      badgeContext: "Current Context"
    },
    expert: {
      toggleFarmer: "Farmer Mode (Simple)",
      toggleExpert: "Expert Mode (Detailed)",
      badge: "EXPERT AUDIT PANEL",
      title: "Algorithm & Constraint Solver Inspection",
      mandiPriceSource: "Price Source",
      timestamp: "Bulletin Timestamp",
      transportFormula: "Freight Calculation",
      capacityUtilization: "Vehicle Capacity Utilization",
      spoilageAssumption: "Spoilage Rate Assumption",
      mathBreakdown: "Algorithmic Score & Formula",
      optimizationScore: "Optimization Confidence",
      toolCallLog: "Agent Tool Calls Executed",
      verificationStatus: "Verification Engine Status"
    },
    judge: {
      title: "WayEzee MandiMitra — Executive Briefing",
      subtitle: "10-Second Hackathon Judge Orientation",
      what: {
        title: "WHAT",
        desc: "Agricultural market price arbitrage and logistics optimization platform for farmer cooperatives."
      },
      who: {
        title: "FOR WHOM",
        desc: "Farmer Producer Organizations (FPOs), cooperative unions, and mandi aggregators."
      },
      why: {
        title: "WHY",
        desc: "The highest mandi price is frequently NOT the highest final profit once freight, time, and spoilage are deducted."
      },
      how: {
        title: "HOW",
        desc: "Deterministic solver combines AGMARKNET market rates + route distance matrix + vehicle capacity + crop perishability models."
      },
      output: {
        title: "OUTPUT",
        desc: "Single actionable plan: best practical mandi, allocated vehicle, haulage schedule, and net revenue."
      },
      ai: {
        title: "AI DECISION SUPPORT",
        desc: "MandiMitra explains recommendations conversationally without hallucination, strictly grounded in engine data."
      },
      closeBtn: "Close Briefing"
    },
    common: {
      kg: "kg",
      rs: "₹",
      perKg: "/kg",
      km: "km",
      hrs: "hrs",
      min: "min",
      liveVerified: "Verified Feed",
      updated: "Updated",
      active: "Active",
      recommendedPill: "Recommended",
      alternativePill: "Alternative"
    }
  },

  hi: {
    brand: "वेईज़ी",
    assistantBrand: "मंडीमित्र",
    tagline: "बेहतर मंडी। बेहतर मुनाफा।",
    subtagline: "किसान उत्पादक संघों के लिए मंडी भाव मध्यस्थता एवं लॉजिस्टिक्स निर्णय मंच",
    cooperativeLabel: "किसान सहकारी समिति",
    judgeTourBtn: "निर्णायक त्वरित विवरण (10 सेकंड)",
    nav: {
      plan: "बिक्री योजना बनाएँ",
      markets: "मंडी भाव",
      logistics: "लॉजिस्टिक्स यात्रा",
      assistant: "मंडीमित्र AI",
      farmerMode: "किसान मोड",
      expertMode: "विशेषज्ञ मोड",
      language: "भाषा",
      primaryCta: "योजना बनाएँ"
    },
    hero: {
      eyebrow: "मंडी आसूचना एवं परिवहन अनुकूलन",
      titleLine1: "सिर्फ ऊँचा भाव नहीं,",
      titleLine2: "सही और बेहतर मंडी चुनें।",
      subtitle: "वेईज़ी विभिन्न मंडियों के भाव, गाड़ी का किराया, वाहन की क्षमता, यात्रा का समय और माल की ताज़गी का विश्लेषण करके आपको सबसे अधिक मुनाफे वाला विकल्प बताता है।",
      ctaPrimary: "मेरी बिक्री योजना बनाएँ",
      ctaSecondary: "मंडीमित्र से पूछें",
      pipelineStep1: "फसल माल",
      pipelineStep2: "मंडी विकल्प",
      pipelineStep3: "लॉजिस्टिक्स",
      pipelineStep4: "शुद्ध कमाई",
      pipelineStep5: "सर्वोत्तम योजना",
      batchSelectorTitle: "विश्लेषण के लिए फसल चुनें",
      quantity: "मात्रा",
      location: "खेत का स्थान",
      perishability: "खराब होने की संभावना",
      harvested: "कटाई समय",
      shelfLife: "सुरक्षित समय",
      selectedVehicle: "चयनित गाड़ी",
      recalculateBtn: "गणना करें"
    },
    story: {
      badge: "मुख्य समस्या",
      headline: "भाव ≠ शुद्ध मुनाफा",
      subheadline: "जानिए क्यों मंडी का सबसे ऊँचा भाव हमेशा किसान को सबसे ज़्यादा कमाई नहीं देता।",
      mandiAHigherPrice: "ऊँचा मंडी भाव",
      mandiALabel: "मंडी A (जयपुर)",
      mandiAPrice: "₹24 / किलो",
      mandiANetReturn: "₹17,200 शुद्ध कमाई",
      mandiANote: "पहली नज़र में भाव अच्छा लगता है, लेकिन 250 किमी की दूरी और 4.5 घंटे की धूप में माल का नुकसान किसान का मुनाफा घटा देता है।",
      mandiBLowerPrice: "कम मंडी भाव",
      mandiBLabel: "मंडी B (अजमेर — अनुशंसित)",
      mandiBPrice: "₹22 / किलो",
      mandiBNetReturn: "₹18,280 शुद्ध कमाई",
      mandiBNote: "भाव ₹2 प्रति किलो कम है, लेकिन 180 किमी की कम दूरी और कम किराए की वजह से किसान को ₹1,080 ज़्यादा शुद्ध कमाई मिलती है।",
      insightQuote: "“मंडी में सिर्फ ऊँचा भाव देखना काफी नहीं है। असली मुनाफा वही है जो गाड़ी का भाड़ा, मंडी शुल्क और रास्ते का नुकसान काटकर किसान की जेब में बचे।”"
    },
    recommendation: {
      badge: "अनुशंसित योजना",
      winningMandi: "सर्वश्रेष्ठ मंडी",
      estimatedNetReturn: "अपेक्षित शुद्ध कमाई",
      netReturnPerKg: "प्रति किलो शुद्ध कमाई",
      vsHeadline: "अन्य मंडियों की तुलना में",
      whyWinsTitle: "यह योजना क्यों सबसे बेहतर है?",
      reasons: [
        "किफायती परिवहन खर्च (गाड़ी के भाड़े में ₹2,120 की सीधी बचत)",
        "रास्ते में माल खराब होने का कम जोखिम (3.2 घंटे बनाम 4.5 घंटे)",
        "गाड़ी की क्षमता के अनुकूल एवं मंडी में केवल 30 मिनट का गेट इंतजार",
        "सहकारी समिति के किसानों के हाथ में सबसे अधिक शुद्ध राशि"
      ],
      farmerSummary: "यह विकल्प सबसे अधिक फायदेमंद है। गाड़ी की क्षमता पूरी है, रास्ते में माल खराब होने का खतरा कम है, और आपकी शुद्ध कमाई सबसे ज्यादा है।",
      usePlanBtn: "यह योजना स्वीकार करें",
      sharePlanBtn: "ड्राइवर को विवरण भेजें",
      dataSourceNote: "भाव AGMARKNET के आधिकारिक पोर्टल से लिए गए हैं"
    },
    financials: {
      title: "शुद्ध कमाई वित्तीय विवरण",
      subtitle: "कुल बिक्री और परिवहन कटौतियों का स्पष्ट हिसाब",
      grossRevenue: "कुल बिक्री मूल्य",
      transportCost: "गाड़ी का भाड़ा",
      mandiFees: "मंडी शुल्क एवं सेस",
      estimatedLoss: "रास्ते में अनुमानित नुकसान",
      netReturn: "शुद्ध कमाई (हाथ में रकम)",
      formulaExplanation: "शुद्ध कमाई = (मात्रा × मंडी भाव) − परिवहन भाड़ा − मंडी खर्च − संभावित नुकसान",
      formulaFarmer: "हाथ में शुद्ध रकम = कुल माल का दाम − गाड़ी का भाड़ा − मंडी का खर्च − माल का नुकसान"
    },
    feasibility: {
      title: "योजना की व्यावहारिक जाँच",
      question: "क्या यह योजना वास्तव में काम कर सकती है?",
      subtitle: "सिफारिश करने से पहले प्रणाली वाहन क्षमता, यात्रा समय और मंडी क्षमता की स्वचालित जाँच करती है।",
      vehicleCapacity: "गाड़ी की क्षमता",
      vehicleCapacityDesc: "गाड़ी की क्षमता आपके माल के लिए पूरी तरह पर्याप्त है",
      travelTime: "यात्रा समय व शेल्फ लाइफ",
      travelTimeDesc: "यात्रा का समय माल के ताज़ा रहने की सीमा के भीतर है",
      produceFreshness: "माल की ताज़गी",
      produceFreshnessDesc: "सब्जी खराब होने का जोखिम नियंत्रित सीमा में है",
      netReturnPositive: "वित्तीय लाभ",
      netReturnPositiveDesc: "अपेक्षित शुद्ध कमाई सकारात्मक और लाभकारी है",
      passStatus: "उत्तीर्ण",
      failStatus: "अनुत्तीर्ण",
      adviceIfFail: "बड़ी गाड़ी चुनें या माल को दो फेरों में भेजें।"
    },
    rejected: {
      title: "अस्वीकृत अन्य विकल्प",
      subtitle: "अन्य मंडियों की सिफारिश क्यों नहीं की गई? (पारदर्शिता एवं भरोसा)",
      notRecommended: "अनुशंसित नहीं",
      distance: "दूरी",
      price: "भाव",
      netReturn: "शुद्ध कमाई",
      deficit: "कमाई में कमी",
      trustQuote: "जब किसान यह समझता है कि बाकी विकल्प क्यों हटाए गए, तो उसका भरोसा व्यवस्था पर और मजबूत होता है।"
    },
    logistics: {
      title: "लॉजिस्टिक्स एवं यात्रा दृश्य",
      subtitle: "खेत से लेकर मंडी के नीलामी यार्ड तक का स्पष्ट मार्ग",
      step1: "खेत का द्वार",
      step2: "गाड़ी में लदाई",
      step3: "राजमार्ग यात्रा",
      step4: "मंडी यार्ड प्रवेश",
      step5: "नीलामी व भुगतान",
      distance: "कुल यात्रा दूरी",
      estTime: "अनुमानित यात्रा समय",
      vehicleType: "गाड़ी का प्रकार",
      loadedQty: "लदा हुआ माल",
      freightCost: "परिवहन खर्च",
      queueTime: "मंडी गेट पर प्रतीक्षा",
      eta: "पहुँचने का समय"
    },
    markets: {
      title: "मंडी भाव तुलना",
      subtitle: "सभी उपलब्ध मंडियों के ताज़ा भाव, दूरी, भाड़ा और शुद्ध मुनाफे की सूची",
      colRank: "रैंक",
      colMandi: "मंडी यार्ड",
      colPrice: "मंडी भाव",
      colDistance: "दूरी",
      colTransit: "यात्रा समय",
      colTransport: "भाड़ा खर्च",
      colNetReturn: "शुद्ध कमाई",
      colSource: "डेटा स्रोत व समय",
      colAction: "कार्रवाई",
      inspectBtn: "हिसाब देखें"
    },
    whatif: {
      title: "क्या-अगर निर्णय सिम्युलेटर",
      subtitle: "भाव में बदलाव या डीजल दर बदलकर तुरंत देखें कि मुनाफे पर क्या असर पड़ता है",
      priceAdjustment: "मंडी भाव में बदलाव (₹/किलो)",
      dieselRate: "गाड़ी का भाड़ा दर (₹/किमी)",
      recalculate: "पुनः गणना करें",
      before: "वर्तमान शुद्ध कमाई",
      after: "बदलाव के बाद शुद्ध कमाई",
      impact: "मुनाफे में अंतर",
      scenarioInsight: "देखें कि भाव या डीजल में थोड़ा सा बदलाव सबसे अच्छी मंडी के चयन को कैसे बदल सकता है।"
    },
    assistant: {
      title: "मंडीमित्र AI",
      badge: "निर्णय सहायक",
      subtitle: "वेईज़ी योजना इंजन का संवादपरक सहायक",
      greeting: "नमस्ते किसान भाई! मैं मंडीमित्र हूँ, आपका मंडी निर्णय सहायक। मैं वास्तविक मंडी भाव, गाड़ी के भाड़े और माल की ताज़गी का हिसाब लगाकर आपके मुनाफे की सुरक्षा करता हूँ। इस माल के बारे में आप क्या जानना चाहते हैं?",
      quickQuestionsTitle: "अक्सर पूछे जाने वाले सवाल",
      quickQuestions: [
        "इस माल के लिए कौन सी मंडी सबसे अच्छी है?",
        "मंडी A का भाव ज़्यादा है, फिर मंडी B क्यों चुनी गई?",
        "कौन सी गाड़ी भेजना सही रहेगा?",
        "मंडी B कितनी दूर है और कितना समय लगेगा?",
        "क्या रास्ते में मेरा माल खराब तो नहीं होगा?",
        "गाड़ी का कुल खर्च कितना आएगा?"
      ],
      inputPlaceholder: "मंडीमित्र से हिंदी या अंग्रेजी में पूछें...",
      sendBtn: "सहायक से पूछें",
      connectedDataNote: "सभी उत्तर आपके वास्तविक माल, आधिकारिक AGMARKNET भाव और सटीक गणना पर आधारित हैं।",
      badgeContext: "वर्तमान संदर्भ"
    },
    expert: {
      toggleFarmer: "किसान मोड (सरल)",
      toggleExpert: "विशेषज्ञ मोड (विस्तृत)",
      badge: "विशेषज्ञ ऑडिट पैनल",
      title: "एल्गोरिदम एवं बाधा समाधान निरीक्षण",
      mandiPriceSource: "भाव का आधिकारिक स्रोत",
      timestamp: "बुलेटिन का समय",
      transportFormula: "भाड़ा गणना सूत्र",
      capacityUtilization: "वाहन क्षमता उपयोग",
      spoilageAssumption: "ताज़गी गिरावट की दर",
      mathBreakdown: "गणितीय स्कोर व सूत्र",
      optimizationScore: "अनुकूलन स्कोर",
      toolCallLog: "एजेंट टूल कॉल्स की सूची",
      verificationStatus: "सत्यापन इंजन की स्थिति"
    },
    judge: {
      title: "वेईज़ी मंडीमित्र — मुख्य कार्यकारी सारांश",
      subtitle: "हैकथॉन निर्णायकों के लिए 10 सेकंड का संक्षिप्त विवरण",
      what: {
        title: "क्या है?",
        desc: "किसान सहकारी समितियों के लिए कृषि मंडी भाव मध्यस्थता एवं परिवहन अनुकूलन मंच।"
      },
      who: {
        title: "किसके लिए?",
        desc: "किसान उत्पादक संगठन (FPOs), सहकारी समितियाँ और सामूहिक कृषि संघ।"
      },
      why: {
        title: "क्यों आवश्यक है?",
        desc: "मंडी का सबसे ऊँचा भाव अक्सर सबसे ज़्यादा मुनाफा नहीं देता, जब भाड़ा, समय और माल का नुकसान घट जाता है।"
      },
      how: {
        title: "कैसे काम करता है?",
        desc: "AGMARKNET मंडी भाव + सड़क दूरी मैट्रिक्स + वाहन क्षमता + फसल के खराब होने की दर को जोड़कर पारदर्शी गणित लगाता है।"
      },
      output: {
        title: "अंतिम परिणाम",
        desc: "एक स्पष्ट कार्ययोजना: सबसे अच्छी मंडी, सही गाड़ी, रवानगी समय और कुल शुद्ध कमाई।"
      },
      ai: {
        title: "AI निर्णय सहायता",
        desc: "मंडीमित्र बिना किसी काल्पनिक अनुमान के, वास्तविक डेटा के आधार पर किसान को सरल भाषा में समझाता है।"
      },
      closeBtn: "विवरण बंद करें"
    },
    common: {
      kg: "किलो",
      rs: "₹",
      perKg: "/किलो",
      km: "किमी",
      hrs: "घंटे",
      min: "मिनट",
      liveVerified: "सत्यापित डेटा",
      updated: "अपडेट हुआ",
      active: "सक्रिय",
      recommendedPill: "अनुशंसित",
      alternativePill: "वैकल्पिक"
    }
  }
};
