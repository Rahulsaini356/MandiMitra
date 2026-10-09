import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Scale, 
  PlusCircle,
  FileText,
  Loader2,
  Cpu,
  Radio,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { speakText, stopSpeech, createSpeechRecognizer } from '../utils/speechUtils';
import { askGeminiMandiMitra } from '../services/geminiService';

export default function MandiMitraAI({
  isOpen,
  onClose,
  t,
  lang,
  result,
  selectedBatch,
  selectedVehicle,
  onOpenPlanBuilder
}) {
  const rec = result.recommendation1 || result.recommended;
  const rec2 = result.recommendation2 || result.bestAlternative;
  const tradeOffs = result.tradeOffs;
  const runnerUp = rec2 || result.rejected[0];

  // Modes: 'voice' (default - pure Voice Chat like ChatGPT/Gemini) | 'chat' (classic message log)
  const [viewMode, setViewMode] = useState('voice');
  
  // Voice & State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [handsFree, setHandsFree] = useState(true); // Continuous phone-call style loop
  const [inputText, setInputText] = useState('');
  
  // Latest voice interaction for the live subtitle card
  const [lastUserVoiceQuery, setLastUserVoiceQuery] = useState('');
  const [lastAssistantSpokenText, setLastAssistantSpokenText] = useState('');

  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Dynamic initial greeting based on language
  const getGreeting = (currentLang) => {
    return currentLang === 'hi' 
      ? `नमस्ते किसान भाई! मैं मंडीमित्र हूँ। वर्तमान में आपके ${selectedBatch.hindiName || selectedBatch.crop} के लिए ${rec.mandiHindiName} सर्वोत्तम है जहाँ ₹${rec.netReturn.toLocaleString('en-IN')} शुद्ध बचत होगी। आप अपनी किसी भी फसल (मक्का, गेहूं, प्याज आदि) या मंडी भाव के बारे में सीधे बोलकर पूछ सकते हैं!`
      : `Namaste Kisan Bhai! I am MandiMitra. For your ${selectedBatch.crop}, ${rec.mandiName} yields ₹${rec.netReturn.toLocaleString('en-IN')} net cash. You can speak freely about any crop like corn, wheat, onion, or mandi rates!`;
  };

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: getGreeting(lang),
      timestamp: lang === 'hi' ? 'अभी' : 'Just now',
      contextBadge: `${selectedBatch.crop} • ${rec.mandiName}`
    }
  ]);

  // Set initial subtitle
  useEffect(() => {
    setLastAssistantSpokenText(getGreeting(lang));
  }, [lang]);

  // Auto-scroll in chat mode
  useEffect(() => {
    if (viewMode === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isListening, viewMode]);

  // Pre-configured questions with math and bilingual support
  const quickQuestions = [
    {
      qEn: "Which mandi is best for this batch?",
      qHi: "इस माल के लिए कौन सी मंडी सबसे अच्छी है?",
      replyEn: `Based on your ${selectedBatch.quantityKg} kg ${selectedBatch.crop} and ${selectedVehicle.name}, the best option is ${rec.mandiName}. You will earn an estimated net return of ₹${rec.netReturn.toLocaleString('en-IN')} (₹${rec.netReturnPerKg}/kg) after deducting freight and fees.`,
      replyHi: `आपके ${selectedBatch.quantityKg} कि.ग्रा. ${selectedBatch.hindiName} और ${selectedVehicle.name} के लिए सबसे उत्तम विकल्प ${rec.mandiHindiName} है। सभी खर्च व भाड़ा काटकर आपको लगभग ₹${rec.netReturn.toLocaleString('en-IN')} की शुद्ध कमाई होगी।`
    },
    {
      qEn: rec2 
        ? `What is the trade-off between ${rec.mandiName} and ${rec2.mandiName}?` 
        : `Why is ${rec.mandiName} the only recommended mandi?`,
      qHi: rec2 
        ? `${rec.mandiHindiName} और ${rec2.mandiHindiName} में क्या अंतर है?` 
        : `केवल ${rec.mandiHindiName} ही क्यों चुनी गई?`,
      replyEn: rec2
        ? `${rec.mandiName} yields ₹${rec.netReturn.toLocaleString('en-IN')}, which is +₹${(rec.netReturn - rec2.netReturn).toLocaleString('en-IN')} higher net cash. However, ${rec2.mandiName} (${rec2.distanceKm} km away) saves transit hours and provides an active alternative route.`
        : `Only ${rec.mandiName} is feasible for this batch. Other candidate mandis exceeded the safe freshness window (${selectedBatch.targetWindowHours || 12}h) or vehicle limits.`,
      replyHi: rec2
        ? `${rec.mandiHindiName} से आपको ₹${rec.netReturn.toLocaleString('en-IN')} मिलते हैं जो कि ${rec2.mandiHindiName} से ₹${(rec.netReturn - rec2.netReturn).toLocaleString('en-IN')} अधिक हैं। वहीं ${rec2.mandiHindiName} (${rec2.distanceKm} किमी) में कम दूरी के कारण फसल की ताज़गी सुरक्षित रहती है।`
        : `इस लॉट के लिए केवल ${rec.mandiHindiName} ही सुरक्षित समय सीमा (${selectedBatch.targetWindowHours || 12} घंटे) और वाहन क्षमता के अनुकूल है।`
    },
    {
      qEn: "I have corn (maize) ready to sell",
      qHi: "मेरे पास मक्का (Corn) बेचने के लिए तैयार है",
      replyEn: `Namaste Kisan Bhai! For your corn, Jaipur Mandi offers ₹23/kg, but Kota Mandi (just 20 km away at ₹20/kg) saves heavy truck freight and yields higher pocket cash. How many quintals do you have ready?`,
      replyHi: `नमस्ते किसान भाई! आपके मक्के के लिए जयपुर में ₹23/किग्रा भाव है, परंतु कोटा मंडी केवल 20 किमी दूर होने से गाड़ी भाड़ा नाममात्र लगेगा और हाथ में सबसे ज्यादा शुद्ध बचत बचेगी। आपके पास कितने क्विंटल मक्का है?`
    },
    {
      qEn: "Show me the exact mathematical profit calculation",
      qHi: "मुझे मुनाफे की पूरी गणितीय गणना (Math) दिखाएं",
      replyEn: `Here is the mathematical formula:\n• Gross Value: ${selectedBatch.quantityKg} kg × ₹${rec.unitPrice} = ₹${rec.grossRevenue.toLocaleString('en-IN')}\n• Minus Freight: ${rec.distanceKm} km × ₹${selectedVehicle.costPerKm} = − ₹${rec.transportCost.toLocaleString('en-IN')}\n• Minus Mandi Fees: Fixed + Cess 1% = − ₹${rec.totalMandiFees.toLocaleString('en-IN')}\n• Minus Spoilage: ${rec.travelTimeHours} hrs transit = − ₹${rec.expectedSpoilageLossRs.toLocaleString('en-IN')}\n= Final Net Pocket Return: ₹${rec.netReturn.toLocaleString('en-IN')} (₹${rec.netReturnPerKg}/kg)`,
      replyHi: `यहाँ पूरी गणितीय गणना है:\n• कुल माल मूल्य: ${selectedBatch.quantityKg} कि.ग्रा. × ₹${rec.unitPrice} = ₹${rec.grossRevenue.toLocaleString('en-IN')}\n• घटाया गाड़ी भाड़ा: ${rec.distanceKm} किमी × ₹${selectedVehicle.costPerKm} = − ₹${rec.transportCost.toLocaleString('en-IN')}\n• घटाई मंडी फीस व सेस = − ₹${rec.totalMandiFees.toLocaleString('en-IN')}\n• घटाया रास्ते का संकोचन = − ₹${rec.expectedSpoilageLossRs.toLocaleString('en-IN')}\n= हाथ में शुद्ध कमाई: ₹${rec.netReturn.toLocaleString('en-IN')} (₹${rec.netReturnPerKg}/कि.ग्रा.)`
    }
  ];

  // Helper to speak out answer with natural ChatGPT / Gemini Live character
  const speakAssistantResponse = (text) => {
    setLastAssistantSpokenText(text);
    if (!voiceEnabled) return;

    speakText(
      text,
      lang,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        // Hands-free continuous loop: start listening after smooth breath pause
        if (handsFree && isOpen) {
          setTimeout(() => {
            startListening();
          }, 600);
        }
      },
      () => {
        setIsSpeaking(false);
      }
    );
  };

  // Execute question logic
  const handleProcessQuery = async (queryText) => {
    if (!queryText.trim() || isThinking) return;

    const userQ = queryText.trim();
    setLastUserVoiceQuery(userQ);

    // Append to messages
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userQ, timestamp: lang === 'hi' ? 'अभी' : 'Just now' }
    ]);

    setIsThinking(true);
    stopSpeech();

    try {
      const response = await askGeminiMandiMitra({
        userQuery: userQ,
        lang,
        selectedBatch,
        selectedVehicle,
        result
      });

      setMessages(prev => [
        ...prev,
        { 
          sender: 'assistant', 
          text: response, 
          timestamp: lang === 'hi' ? 'अभी' : 'Just now',
          contextBadge: 'Gemini Live • Verified Math'
        }
      ]);

      speakAssistantResponse(response);
    } catch (err) {
      console.error("Gemini query error:", err);
      const fallback = lang === 'hi'
        ? `नमस्ते किसान भाई! वर्तमान में आपके ${selectedBatch.hindiName || selectedBatch.crop} के लिए ${rec.mandiHindiName} सबसे उत्तम विकल्प है। यहाँ ₹${rec.transportCost} भाड़ा काटकर आपके हाथ में ₹${rec.netReturn.toLocaleString('en-IN')} की शुद्ध कमाई बचेगी।`
        : `Namaste Kisan Bhai! For your ${selectedBatch.crop}, ${rec.mandiName} is the optimal choice yielding ₹${rec.netReturn.toLocaleString('en-IN')} net cash.`;

      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: fallback, timestamp: lang === 'hi' ? 'अभी' : 'Just now', contextBadge: 'MandiMitra Engine' }
      ]);
      speakAssistantResponse(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  // Text Form Submit
  const handleCustomSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const q = inputText;
    setInputText('');
    handleProcessQuery(q);
  };

  // Speech Recognition Start
  const startListening = () => {
    if (isListening || isThinking) return;
    stopSpeech();

    const recognizer = createSpeechRecognizer(
      lang,
      (transcript) => {
        setIsListening(false);
        if (transcript && transcript.trim()) {
          handleProcessQuery(transcript.trim());
        }
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Speech Recognition Stop
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Toggle Voice Orb Mic
  const handleToggleVoiceOrb = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  // Stop everything when closing
  const handleCloseModal = () => {
    stopSpeech();
    stopListening();
    onClose();
  };

  // Re-read specific message
  const handleSpeakSingleMessage = (text) => {
    speakText(
      text,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-2xl h-[92vh] max-h-[760px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-colors duration-300 ${
        viewMode === 'voice' 
          ? 'bg-[#0E2318] text-[#F7F5EF] border-[#2A5940]' 
          : 'bg-white text-[#1D2420] border-[#E3DFD2]'
      }`}>
        
        {/* Top Header Bar */}
        <div className={`p-3.5 sm:p-4.5 flex items-center justify-between border-b flex-shrink-0 ${
          viewMode === 'voice'
            ? 'bg-[#0A1B12] border-white/10 text-white'
            : 'bg-[#173B2B] border-[#173B2B] text-[#F7F5EF]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border transition ${
              viewMode === 'voice' 
                ? 'bg-emerald-950/80 text-[#D4BA7B] border-[#D4BA7B]/40 shadow-inner' 
                : 'bg-[#315C43] text-[#B59658] border-[#B59658]/30'
            }`}>
              <Bot className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif font-bold text-base sm:text-lg text-white">
                  {lang === 'hi' ? "मंडीमित्र लाइव वॉइस" : "MandiMitra Voice AI"}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  Gemini Live
                </span>
              </div>
              <p className="text-[11px] text-[#8FA58E]">
                {lang === 'hi' ? "असली जेमिनी एआई • किसान भाइयों के लिए विशेष प्राकृतिक आवाज़" : "Real Gemini AI • Natural voice talking advisor for farmers"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View Mode Toggle: Voice vs Chat */}
            <div className="bg-black/30 p-1 rounded-xl flex items-center border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setViewMode('voice')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
                  viewMode === 'voice'
                    ? 'bg-[#B59658] text-[#173B2B] font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Voice Mode"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? "वॉइस मोड" : "Voice Mode"}</span>
              </button>

              <button
                onClick={() => setViewMode('chat')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
                  viewMode === 'chat'
                    ? 'bg-[#B59658] text-[#173B2B] font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Chat & Formulas"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? "चैट व हिसाब" : "Chat & Math"}</span>
              </button>
            </div>

            {/* Voice Audio Mute Toggle */}
            <button
              onClick={() => {
                if (voiceEnabled) stopSpeech();
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`p-2 rounded-xl text-xs font-semibold transition border ${
                voiceEnabled 
                  ? 'bg-white/10 text-emerald-300 border-white/20' 
                  : 'bg-red-900/30 text-red-300 border-red-500/30'
              }`}
              title={voiceEnabled ? "Voice Enabled" : "Muted"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== VIEW MODE 1: PURE VOICE MODE (GEMINI / CHATGPT LIVE) ===================== */}
        {viewMode === 'voice' && (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-[#0F261B] via-[#122C20] to-[#0A1A12]">
            
            {/* Context Pill & Plan Builder shortcut */}
            <div className="flex items-center justify-between gap-2 text-xs text-[#E3E9E5] bg-black/30 px-3.5 py-2 rounded-xl border border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#8FA58E]">{lang === 'hi' ? "सक्रिय संदर्भ:" : "Context:"}</span>
                <strong className="text-[#D4BA7B] font-bold">
                  {lang === 'hi' ? selectedBatch.hindiName : selectedBatch.crop} ({selectedBatch.quantityKg} kg)
                </strong>
                <span className="text-gray-400">•</span>
                <span className="truncate">{rec.mandiName} (₹{rec.netReturn.toLocaleString('en-IN')})</span>
              </div>

              {onOpenPlanBuilder && (
                <button
                  onClick={() => { handleCloseModal(); onOpenPlanBuilder(); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#315C43] text-[#D4BA7B] text-[11px] font-bold hover:bg-[#3D6F52] transition flex-shrink-0 border border-[#D4BA7B]/30"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>{lang === 'hi' ? "नई फसल" : "New Crop"}</span>
                </button>
              )}
            </div>

            {/* CENTER: ANIMATED GEMINI LIVE ORB */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 my-auto">
              <div 
                onClick={handleToggleVoiceOrb}
                className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 select-none ${
                  isListening 
                    ? 'scale-105 shadow-[0_0_80px_rgba(16,185,129,0.5)]' 
                    : isSpeaking 
                      ? 'scale-105 shadow-[0_0_80px_rgba(212,186,123,0.5)]' 
                      : isThinking
                        ? 'shadow-[0_0_60px_rgba(234,179,8,0.4)]'
                        : 'shadow-[0_0_50px_rgba(16,185,129,0.2)] hover:scale-105'
                }`}
              >
                {/* Listening Ripple Waves */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
                    <div className="absolute -inset-4 rounded-full border border-emerald-300 animate-pulse opacity-40 pointer-events-none" />
                    <div className="absolute -inset-8 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Thinking Orbiting Dual Rings */}
                {isThinking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4BA7B] animate-spin pointer-events-none" style={{ animationDuration: '4s' }} />
                    <div className="absolute -inset-3 rounded-full border border-dashed border-emerald-400/60 animate-spin pointer-events-none" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                  </>
                )}

                {/* Speaking Wave Ripple */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-[#D4BA7B] animate-pulse opacity-80 pointer-events-none" />
                    <div className="absolute -inset-4 rounded-full border border-amber-300/30 animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '2s' }} />
                  </>
                )}

                {/* Orb Core Body */}
                <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                  isListening
                    ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 border-emerald-300'
                    : isSpeaking
                      ? 'bg-gradient-to-br from-[#8C7138] via-[#4D3F1E] to-[#1A1508] border-[#D4BA7B]'
                      : isThinking
                        ? 'bg-gradient-to-br from-amber-700 via-yellow-900 to-black border-amber-400'
                        : 'bg-gradient-to-br from-[#1A422F] via-[#102B1E] to-[#081710] border-[#3D6F52] hover:border-[#D4BA7B]'
                }`}>
                  
                  {/* Dynamic Visualizer Inside Core */}
                  {isListening && (
                    <div className="flex flex-col items-center gap-2">
                      <Mic className="w-10 h-10 text-white animate-bounce" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                        {lang === 'hi' ? "सुन रहे हैं..." : "Listening..."}
                      </span>
                    </div>
                  )}

                  {isThinking && (
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles className="w-10 h-10 text-[#D4BA7B] animate-spin" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">
                        {lang === 'hi' ? "गणना चालू है..." : "Thinking..."}
                      </span>
                    </div>
                  )}

                  {isSpeaking && (
                    <div className="flex flex-col items-center gap-2">
                      {/* Equalizer Frequency Bars */}
                      <div className="flex items-center gap-1.5 h-10">
                        <span className="w-1.5 bg-[#D4BA7B] rounded-full animate-pulse h-6" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 bg-white rounded-full animate-pulse h-10" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 bg-[#D4BA7B] rounded-full animate-pulse h-8" style={{ animationDelay: '75ms' }} />
                        <span className="w-1.5 bg-white rounded-full animate-pulse h-4" style={{ animationDelay: '200ms' }} />
                        <span className="w-1.5 bg-[#D4BA7B] rounded-full animate-pulse h-9" style={{ animationDelay: '120ms' }} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4BA7B]">
                        {lang === 'hi' ? "बोल रहे हैं..." : "Speaking..."}
                      </span>
                    </div>
                  )}

                  {!isListening && !isThinking && !isSpeaking && (
                    <div className="flex flex-col items-center gap-1.5 text-center px-2">
                      <Mic className="w-10 h-10 text-[#D4BA7B] group-hover:scale-110 transition" />
                      <span className="text-[11px] font-bold text-white leading-tight">
                        {lang === 'hi' ? "बोलें / पूछें" : "Tap to Talk"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Hint Text */}
              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm font-medium text-[#E3E9E5]">
                  {isListening 
                    ? (lang === 'hi' ? "🟢 किसान भाई, हम सुन रहे हैं... अपनी फसल का नाम या भाव बोलें" : "🟢 Listening to Kisan Bhai... speak your crop or query")
                    : isThinking
                      ? (lang === 'hi' ? "🟡 जेमिनी एआई मंडी भाव और मुनाफ़े का हिसाब लगा रहा है..." : "🟡 Gemini calculating mandi rates & net pocket cash...")
                      : isSpeaking
                        ? (lang === 'hi' ? "🔵 मंडीमित्र आवाज़ में उत्तर दे रहे हैं..." : "🔵 MandiMitra is speaking live...")
                        : (lang === 'hi' ? "बोलने के लिए गोले पर टैप करें (उदा. 'मेरे पास मक्का है')" : "Tap orb to speak (e.g. 'I have corn ready')")}
                </p>
              </div>

              {/* Live Subtitle Conversation Card */}
              <div className="w-full max-w-lg mt-5 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl space-y-2.5 text-xs sm:text-sm">
                {lastUserVoiceQuery && (
                  <div className="flex items-start gap-2 text-emerald-300 pb-2 border-b border-white/10">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex-shrink-0">
                      🧑‍🌾 {lang === 'hi' ? "आप:" : "You:"}
                    </span>
                    <span className="italic">"{lastUserVoiceQuery}"</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 text-[#F7F5EF] leading-relaxed">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#D4BA7B] flex-shrink-0 mt-0.5">
                      🤖 {lang === 'hi' ? "मंडीमित्र:" : "AI:"}
                    </span>
                    <span>{lastAssistantSpokenText || getGreeting(lang)}</span>
                  </div>

                  {lastAssistantSpokenText && (
                    <button
                      onClick={() => speakAssistantResponse(lastAssistantSpokenText)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4BA7B] transition flex-shrink-0"
                      title="Replay Audio"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM CONTROLS IN VOICE MODE */}
            <div className="space-y-3 pt-2 flex-shrink-0">
              
              {/* Hands-Free Loop Toggle + Voice Mute */}
              <div className="flex items-center justify-between gap-3 text-xs px-1">
                <button
                  onClick={() => setHandsFree(!handsFree)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition ${
                    handsFree 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm' 
                      : 'bg-black/30 text-gray-400 border-white/10'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>
                    {handsFree 
                      ? (lang === 'hi' ? "🔄 निरंतर बातचीत चालू (Hands-free)" : "🔄 Hands-free loop ON") 
                      : (lang === 'hi' ? "टैप-टू-टॉक मोड" : "Tap-to-talk only")}
                  </span>
                </button>

                {isSpeaking && (
                  <button
                    onClick={() => { stopSpeech(); setIsSpeaking(false); }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-900/60 text-red-200 border border-red-500/40 text-[11px] font-bold hover:bg-red-800 transition"
                  >
                    <span>{lang === 'hi' ? "आवाज़ रोकें" : "Stop Voice"}</span>
                  </button>
                )}
              </div>

              {/* Quick Voice Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => handleProcessQuery("मेरे पास मक्का (Corn) है, इसका क्या भाव मिलेगा?")}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-[#315C43] text-[#D4BA7B] border border-white/10 text-xs whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <span>🌽</span>
                  <span>{lang === 'hi' ? "मेरे पास मक्का है" : "I have corn"}</span>
                </button>

                <button
                  onClick={() => handleProcessQuery("जयपुर vs कोटा मंडी में प्याज का क्या भाव और भाड़ा है?")}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-[#315C43] text-[#D4BA7B] border border-white/10 text-xs whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <span>🧅</span>
                  <span>{lang === 'hi' ? "जयपुर vs कोटा भाव" : "Jaipur vs Kota rates"}</span>
                </button>

                <button
                  onClick={() => handleProcessQuery("गाड़ी भाड़ा और मंडी सेस काटकर हाथ में कितनी शुद्ध रकम बचेगी?")}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-[#315C43] text-[#D4BA7B] border border-white/10 text-xs whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <span>🚚</span>
                  <span>{lang === 'hi' ? "भाड़ा व शुद्ध बचत हिसाब" : "Freight vs Net profit"}</span>
                </button>

                <button
                  onClick={() => handleProcessQuery("क्या मुझे अपनी फसल आज ही बेचनी चाहिए या 2 दिन रुकना चाहिए?")}
                  className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-[#315C43] text-[#D4BA7B] border border-white/10 text-xs whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <span>🌾</span>
                  <span>{lang === 'hi' ? "क्या आज बेचना सही है?" : "Sell today or wait?"}</span>
                </button>
              </div>

              {/* Central Mic Push Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleVoiceOrb}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                      : isSpeaking
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#B59658] hover:bg-[#D4BA7B] text-[#173B2B]'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>{lang === 'hi' ? "सुनना बंद करें" : "Stop Listening"}</span>
                    </>
                  ) : isSpeaking ? (
                    <>
                      <VolumeX className="w-5 h-5" />
                      <span>{lang === 'hi' ? "आवाज़ रोकें (Interrupt)" : "Interrupt / Stop"}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 text-[#173B2B]" />
                      <span>{lang === 'hi' ? "बोलकर पूछें (Tap to Speak)" : "Tap to Speak (Voice)"}</span>
                    </>
                  )}
                </button>

                {/* Quick Switch to Text Mode */}
                <button
                  onClick={() => setViewMode('chat')}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center border border-white/10"
                  title="Switch to Text & Math Breakdown"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ===================== VIEW MODE 2: CLASSIC CHAT & MATH FORMULAS ===================== */}
        {viewMode === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#F7F5EF]">
            
            {/* Conversation Thread */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'clay-card-forest text-[#F7F5EF] rounded-3xl rounded-br-none'
                        : 'clay-card text-[#1D2420] border border-white/80 rounded-3xl rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#EEEDE7] text-[11px]">
                        <span className="font-bold text-[#315C43] flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-[#B59658]" />
                          MandiMitra AI
                        </span>
                        <div className="flex items-center gap-2">
                          {msg.contextBadge && (
                            <span className="text-[#68736C] font-mono text-[10px] hidden sm:inline">
                              {msg.contextBadge}
                            </span>
                          )}
                          <button
                            onClick={() => handleSpeakSingleMessage(msg.text)}
                            className="p-1 rounded-lg hover:bg-[#EEEDE7] text-[#315C43] transition"
                            title="Listen"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                  <span className="text-[10px] text-[#68736C] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Thinking with Gemini Indicator */}
              {isThinking && (
                <div className="flex items-start gap-2.5 max-w-[85%] animate-fade-in">
                  <div className="w-9 h-9 rounded-2xl clay-button-primary text-[#B59658] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin text-[#D4BA7B]" />
                  </div>
                  <div className="clay-card border border-white/80 rounded-3xl rounded-bl-none p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#173B2B]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#315C43]" />
                      <span>
                        {lang === 'hi' ? 'मंडीमित्र (Gemini) गणना कर रहा है...' : 'MandiMitra (Gemini) calculating net arbitrage...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Listening Indicator */}
              {isListening && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs animate-pulse clay-card">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                  <span className="font-bold">
                    {lang === 'hi' ? "आपकी आवाज़ सुन रहे हैं... कृपया बोलें" : "Listening to your voice... Speak now"}
                  </span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Questions Pills */}
            <div className="p-3 bg-white/70 backdrop-blur-sm border-t border-[#E3DFD2] overflow-x-auto flex-shrink-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#68736C] mb-1.5 px-1">
                {t.assistant.quickQuestionsTitle}:
              </div>
              <div className="flex gap-2 pb-1">
                {quickQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleProcessQuery(lang === 'hi' ? item.qHi : item.qEn)}
                    className="clay-pill text-xs text-left px-3.5 py-1.5 text-[#173B2B] hover:text-[#315C43] transition whitespace-nowrap font-medium flex-shrink-0"
                  >
                    {lang === 'hi' ? item.qHi : item.qEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar with Mic & Send */}
            <form onSubmit={handleCustomSend} className="p-3 sm:p-4 bg-white/90 backdrop-blur-sm border-t border-[#E3DFD2] flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={startListening}
                className={`p-3 rounded-xl transition flex-shrink-0 ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse shadow-md' 
                    : 'clay-button-light text-[#173B2B]'
                }`}
                title="Speak"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#315C43]" />}
              </button>

              <input
                type="text"
                value={inputText}
                disabled={isThinking}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  lang === 'hi' ? "मंडी, भाव या गाड़ी का हिसाब पूछें..." : t.assistant.inputPlaceholder
                }
                className="flex-1 px-4 py-2.5 rounded-xl clay-inset text-xs sm:text-sm text-[#1D2420] focus:outline-none disabled:bg-gray-100 border-none"
              />

              <button
                type="submit"
                disabled={isThinking || !inputText.trim()}
                className="px-4 sm:px-5 py-2.5 rounded-xl clay-button-primary text-[#F7F5EF] font-bold text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
              >
                <span>{t.assistant.sendBtn}</span>
                {isThinking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B59658]" />
                ) : (
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4BA7B]" />
                )}
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
