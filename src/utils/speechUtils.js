// Cached best voice lookup
let cachedVoices = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
  updateVoices();
  window.speechSynthesis.onvoiceschanged = updateVoices;
}

/**
 * Find the most natural, human-sounding neural voice (ChatGPT / Gemini style)
 */
export function getBestNaturalVoice(lang = 'hi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
  if (!voices || voices.length === 0) return null;

  if (lang === 'hi') {
    const hindiVoices = voices.filter(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith('hi') || 
      v.name.toLowerCase().includes('hindi')
    );
    // Prioritize high-quality natural/neural voices
    const neural = hindiVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('online') || 
      v.name.toLowerCase().includes('google') ||
      v.name.toLowerCase().includes('swara') ||
      v.name.toLowerCase().includes('madhur')
    );
    if (neural) return neural;
    if (hindiVoices.length > 0) return hindiVoices[0];
  } else {
    const engVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    // Prioritize warm, natural Indian/UK/US English neural voices
    const neural = engVoices.find(v => 
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('google')) &&
      (v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('prabhat') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('aria') || v.name.toLowerCase().includes('uk'))
    ) || engVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('online') || 
      v.name.toLowerCase().includes('google')
    );
    if (neural) return neural;
    if (engVoices.length > 0) return engVoices[0];
  }
  return null;
}

/**
 * Format raw text into smooth speech-friendly audio text
 * Adds natural pauses, strips markdown, expands currency & units
 */
export function formatTextForSpeech(text, lang = 'hi') {
  if (!text) return '';
  
  let formatted = text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Currency formatting with natural word grouping
    .replace(/₹\s?([0-9,]+)/g, (match, p1) => {
      const num = parseInt(p1.replace(/,/g, ''), 10);
      if (isNaN(num)) return match;
      if (lang === 'hi') {
        if (num >= 100000) return `${(num / 100000).toFixed(1)} लाख रुपये`;
        if (num >= 1000) return `${Math.round(num / 1000)} हजार ${num % 1000 > 0 ? num % 1000 : ''} रुपये`;
        return `${num} रुपये`;
      } else {
        if (num >= 100000) return `${(num / 100000).toFixed(1)} lakh rupees`;
        if (num >= 1000) return `${Math.round(num / 1000)} thousand ${num % 1000 > 0 ? num % 1000 : ''} rupees`;
        return `${num} rupees`;
      }
    })
    .replace(/₹/g, lang === 'hi' ? 'रुपये ' : 'rupees ')
    // Abbreviations
    .replace(/\bkg\b/gi, lang === 'hi' ? 'किलो' : 'kilograms')
    .replace(/कि\.ग्रा\./g, 'किलो')
    .replace(/\bkm\b/gi, lang === 'hi' ? 'किलोमीटर' : 'kilometers')
    .replace(/किमी\b/g, 'किलोमीटर')
    .replace(/\bhrs?\b/gi, lang === 'hi' ? 'घंटे' : 'hours')
    .replace(/\bmin\b/gi, lang === 'hi' ? 'मिनट' : 'minutes')
    .replace(/\//g, ' प्रति ')
    // Add gentle comma pauses after greetings for natural human breath cadence
    .replace(/Namaste Kisan Bhai!?/gi, 'Namaste Kisan Bhai,')
    .replace(/नमस्ते किसान भाई!?/g, 'नमस्ते किसान भाई,')
    .trim();

  return formatted;
}

/**
 * Speak text aloud using Web Speech API with smooth ChatGPT / Gemini Live character
 */
export function speakText(text, lang = 'hi', onStart, onEnd, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser environment.");
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any active speech

    const spokenText = formatTextForSpeech(text, lang);
    if (!spokenText) return false;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    
    // Natural human conversational pitch and steady pace
    utterance.rate = 0.98; // Balanced natural cadence
    utterance.pitch = 1.03; // Smooth, warm, approachable pitch

    // Assign best neural/natural voice
    const voice = getBestNaturalVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("Error invoking speech synthesis:", err);
    if (onError) onError(err);
    return false;
  }
}

/**
 * Stop any active speech synthesis
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Create Speech Recognition instance for voice-to-text
 */
export function createSpeechRecognizer(lang = 'hi', onResult, onError, onEnd) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported in this browser.");
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      }
    };

    if (onError) recognition.onerror = onError;
    if (onEnd) recognition.onend = onEnd;

    return recognition;
  } catch (err) {
    console.error("Failed to initialize speech recognition:", err);
    return null;
  }
}
