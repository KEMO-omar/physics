import React from 'react';
import { ComputedPhysics } from '../types/physics';
import { MathFormula } from './MathFormula';

interface MetricsCardsProps {
  computed: ComputedPhysics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ computed }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Vx Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between hover:border-indigo-300 transition group">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
          <span>السرعة الأفقية</span>
          <MathFormula math="V_x" className="text-indigo-600 font-bold" />
        </div>
        <div className="text-lg md:text-xl font-black text-indigo-700 tracking-tight" dir="ltr">
          {computed.vx.toFixed(2)} <span className="text-xs font-bold text-slate-400">m/s</span>
        </div>
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            ثابتة المقدار
          </span>
        </div>
      </div>

      {/* Vy0 Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between hover:border-teal-300 transition group">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
          <span>السرعة الرأسية</span>
          <MathFormula math="V_{y0}" className="text-teal-600 font-bold" />
        </div>
        <div className="text-lg md:text-xl font-black text-teal-700 tracking-tight" dir="ltr">
          {computed.vy0.toFixed(2)} <span className="text-xs font-bold text-slate-400">m/s</span>
        </div>
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
            تتأثر بالجاذبية
          </span>
        </div>
      </div>

      {/* Hmax Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between hover:border-purple-300 transition group">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
          <span>أقصى ارتفاع</span>
          <MathFormula math="H_{\max}" className="text-purple-600 font-bold" />
        </div>
        <div className="text-lg md:text-xl font-black text-purple-700 tracking-tight" dir="ltr">
          {computed.maxReachHeight.toFixed(2)} <span className="text-xs font-bold text-slate-400">m</span>
        </div>
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
            من سطح الأرض
          </span>
        </div>
      </div>

      {/* Range Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between hover:border-rose-300 transition group">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
          <span>المدى الأفقي</span>
          <MathFormula math="R" className="text-rose-600 font-bold" />
        </div>
        <div className="text-lg md:text-xl font-black text-rose-700 tracking-tight" dir="ltr">
          {computed.totalHorizontalRange.toFixed(2)} <span className="text-xs font-bold text-slate-400">m</span>
        </div>
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            أقصى مسافة سينية
          </span>
        </div>
      </div>
    </div>
  );
};
