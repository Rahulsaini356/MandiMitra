import React from 'react';
import { X, CheckCircle2, Award, Sparkles, Sprout, ArrowRight } from 'lucide-react';

export default function JudgeModal({ isOpen, onClose, t, lang }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-[#E3DFD2] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#173B2B] text-[#F7F5EF] p-6 flex items-center justify-between border-b border-[#173B2B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B59658] flex items-center justify-center text-[#173B2B]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-white">
                  {t.judge.title}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-[#D4BA7B]">
                  10-Sec Pitch
                </span>
              </div>
              <p className="text-xs text-[#8FA58E]">
                {t.judge.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Structured Cards */}
        <div className="p-6 overflow-y-auto space-y-4 bg-[#F7F5EF]">
          
          {/* 1. WHAT */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B59658] block mb-1">
              1. {t.judge.what.title}
            </span>
            <p className="text-sm font-serif font-bold text-[#173B2B]">
              {t.judge.what.desc}
            </p>
          </div>

          {/* 2. FOR WHOM */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B59658] block mb-1">
              2. {t.judge.who.title}
            </span>
            <p className="text-sm font-semibold text-[#173B2B]">
              {t.judge.who.desc}
            </p>
          </div>

          {/* 3. WHY */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
              3. {t.judge.why.title} (THE INSIGHT)
            </span>
            <p className="text-sm font-serif font-bold text-amber-950 leading-snug">
              {t.judge.why.desc}
            </p>
          </div>

          {/* 4. HOW */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B59658] block mb-1">
              4. {t.judge.how.title} (THE FORMULA)
            </span>
            <p className="text-sm text-[#1D2420]">
              {t.judge.how.desc}
            </p>
          </div>

          {/* 5. OUTPUT */}
          <div className="p-4 bg-[#173B2B] text-[#F7F5EF] rounded-2xl border border-[#173B2B] shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B] block mb-1">
              5. {t.judge.output.title}
            </span>
            <p className="text-sm font-serif font-bold text-white">
              {t.judge.output.desc}
            </p>
          </div>

          {/* 6. AI SUPPORT */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3DFD2] shadow-warm-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#315C43] block mb-1">
              6. {t.judge.ai.title}
            </span>
            <p className="text-sm text-[#1D2420]">
              {t.judge.ai.desc}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E3DFD2] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#173B2B] text-white font-semibold text-sm hover:bg-[#224D39] transition"
          >
            {t.judge.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
