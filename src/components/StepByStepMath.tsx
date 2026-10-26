import React from 'react';
import { CalculationStep } from '../types/physics';
import { MathFormula } from './MathFormula';

interface StepByStepMathProps {
  steps: CalculationStep[];
}

export const StepByStepMath: React.FC<StepByStepMathProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col max-h-[460px]">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <h2 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <i className="fa-solid fa-square-root-variable text-purple-600"></i> خطوات الحل التفصيلية والمعادلات
        </h2>
        <span className="text-xs bg-purple-50 text-purple-700 font-extrabold px-2.5 py-1 rounded-lg border border-purple-200">
          رموز رياضية أصيلة (LaTeX)
        </span>
      </div>

      <div className="custom-scroll overflow-y-auto space-y-3.5 text-xs pr-1">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-slate-50/80 hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition shadow-2xs"
          >
            <div className="font-bold text-slate-800 text-xs mb-2 flex items-center justify-between">
              <span className="text-slate-900 font-extrabold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                  {idx + 1}
                </span>
                {step.title}
              </span>
            </div>

            {/* Formula Block */}
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100 text-indigo-950 mb-2 shadow-2xs overflow-x-auto text-center">
              <span className="text-[10px] text-indigo-400 font-bold block text-right mb-0.5">القانون العام:</span>
              <MathFormula math={step.formulaKatex} block={true} className="text-indigo-900 font-medium py-1" />
            </div>

            {/* Substituted Calculation */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-2.5 rounded-lg border border-emerald-200/60 text-emerald-950 overflow-x-auto text-center">
              <span className="text-[10px] text-emerald-600 font-bold block text-right mb-0.5">التعويض وحساب الناتج:</span>
              <MathFormula math={step.calcKatex} block={true} className="text-emerald-900 font-semibold py-1" />
            </div>

            {step.explanation && (
              <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed bg-slate-100/60 p-2 rounded-lg">
                💡 <span className="text-slate-700 font-semibold">ملاحظة فيزيائية:</span> {step.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
