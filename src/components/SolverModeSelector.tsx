import React from 'react';
import { TargetMode } from '../types/physics';
import { MathFormula } from './MathFormula';

interface SolverModeSelectorProps {
  targetMode: TargetMode;
  onChangeMode: (mode: TargetMode) => void;
}

export const SolverModeSelector: React.FC<SolverModeSelectorProps> = ({
  targetMode,
  onChangeMode,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <h2 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <i className="fa-solid fa-sliders text-indigo-600"></i> تحديد مجهول المسألة (نمط الحل)
        </h2>
        <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
          تفاعلي
        </span>
      </div>

      <label className="block text-xs font-bold text-slate-600 mb-2">
        ما هو المجهول أو المطلوب حسابه في مسألتك؟
      </label>
      <select
        value={targetMode}
        onChange={(e) => onChangeMode(e.target.value as TargetMode)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs md:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
      >
        <option value="FORWARD">
          1. مسألة مباشرة (معلوم: السرعة الابتدائية V₀ والزاوية θ والارتفاع h₀ ← حساب المدى والزمن والارتفاع)
        </option>
        <option value="FIND_V0_RANGE">
          2. مسألة عكسية: حساب السرعة الابتدائية (V₀) من المدى الأفقي المعلوم (R)
        </option>
        <option value="FIND_V0_HEIGHT">
          3. مسألة عكسية: حساب السرعة الابتدائية (V₀) من أقصى ارتفاع (H_max)
        </option>
        <option value="FIND_HEIGHT_TIME">
          4. حساب ارتفاع المبنى (h₀) من زمن الهبوط للقذف الأفقي (θ = 0°)
        </option>
        <option value="FIND_ANGLE">
          5. حساب زاوية القذف (θ) من المدى الأفقي والسرعة الابتدائية
        </option>
        <option value="FIND_TIME_FALL">
          6. حساب زمن الهبوط الكلي (t_flight) ومسار السقوط الحر
        </option>
      </select>

      {/* Dynamic formula-rich contextual explanation */}
      <div className="mt-3 bg-gradient-to-r from-indigo-50/90 to-violet-50/90 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950">
        <span className="text-base">📌</span>
        <div>
          {targetMode === 'FORWARD' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">المسألة المباشرة:</strong> أدخل السرعة الابتدائية{' '}
              <MathFormula math="V_0" /> وزاوية القذف <MathFormula math="\theta" /> وارتفاع المنصة{' '}
              <MathFormula math="h_0" /> ليقوم المعمل باستنتاج المدى <MathFormula math="R" /> وزمن الطيران{' '}
              <MathFormula math="t_{\text{flight}}" /> وأقصى ارتفاع <MathFormula math="H_{\max}" /> بدقة متناهية.
            </p>
          )}
          {targetMode === 'FIND_V0_RANGE' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">مسألة عكسية (إيجاد السرعة من المدى):</strong> بمعرفة المدى الأفقي المطلوب{' '}
              <MathFormula math="R" /> والزاوية <MathFormula math="\theta" />، نستنتج السرعة الابتدائية المطلوبة{' '}
              <MathFormula math="V_0 = \sqrt{\frac{R \cdot g}{\sin(2\theta)}}" />.
            </p>
          )}
          {targetMode === 'FIND_V0_HEIGHT' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">مسألة عكسية (إيجاد السرعة من أقصى ارتفاع):</strong> بمعرفة أقصى ارتفاع{' '}
              <MathFormula math="H_{\max}" />، نحسب السرعة الرأسية <MathFormula math="V_{y0}" /> ومنها السرعة الكلية{' '}
              <MathFormula math="V_0 = \frac{V_{y0}}{\sin(\theta)}" />.
            </p>
          )}
          {targetMode === 'FIND_HEIGHT_TIME' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">حساب ارتفاع المبنى (قذف أفقي):</strong> عندما يكون القذف أفقياً (
              <MathFormula math="\theta = 0^\circ" />) وتعرف زمن الهبوط <MathFormula math="t_{\text{fall}}" />، نحسب الارتفاع من{' '}
              <MathFormula math="h_0 = \frac{1}{2} g t^2" />.
            </p>
          )}
          {targetMode === 'FIND_ANGLE' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">حساب زاوية القذف:</strong> بمعرفة المدى <MathFormula math="R" /> والسرعة{' '}
              <MathFormula math="V_0" />، نحسب الزاوية من <MathFormula math="\sin(2\theta) = \frac{R \cdot g}{V_0^2}" />.
            </p>
          )}
          {targetMode === 'FIND_TIME_FALL' && (
            <p className="leading-relaxed">
              <strong className="text-indigo-900 font-extrabold">زمن الهبوط الكلي:</strong> حساب زمن رحلة المقذوف كاملة من نقطة الانطلاق حتى الارتطام بالأرض.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
