import React from 'react';
import { MathFormula } from './MathFormula';

export const CurriculumInsights: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-3">
      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="flex items-center gap-1.5 text-slate-800 font-extrabold">
          <i className="fa-solid fa-lightbulb text-amber-500 text-sm"></i> ملاحق وقواعد منهج الفيزياء الثانوية (المنهج المصري)
        </span>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
          قوانين أساسية
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Horizontal Projectile Rule */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition">
          <h4 className="font-extrabold text-indigo-950 mb-2 flex items-center gap-1.5">
            <span className="text-base">➡️</span>
            <span>المقذوفات الأفقية</span>
            <MathFormula math="(\theta = 0^\circ)" className="text-indigo-600 font-bold" />
          </h4>
          <p className="text-slate-600 leading-relaxed space-y-1">
            <span className="block mb-1">
              السرعة الرأسية الابتدائية منعدمة: <MathFormula math="V_{y0} = 0" />، والسرعة الأفقية ثابتة:{' '}
              <MathFormula math="V_x = V_0" />.
            </span>
            <span className="block mb-1">
              • سرعة الهبوط اللحظية: <MathFormula math="V_y = g t" />
            </span>
            <span className="block">
              • المسافة الرأسية الساقطة: <MathFormula math="h = \frac{1}{2} g t^2" />
            </span>
          </p>
        </div>

        {/* Angled Projectile Rule */}
        <div className="bg-gradient-to-br from-slate-50 to-violet-50/40 p-3.5 rounded-xl border border-slate-200/80 hover:border-violet-200 transition">
          <h4 className="font-extrabold text-violet-950 mb-2 flex items-center gap-1.5">
            <span className="text-base">↗️</span>
            <span>المقذوفات بزاوية</span>
            <MathFormula math="(\theta > 0^\circ)" className="text-violet-600 font-bold" />
          </h4>
          <p className="text-slate-600 leading-relaxed space-y-1">
            <span className="block mb-1">
              تتحلل الحركة لمركبتين مستقلتين:
            </span>
            <span className="block mb-1">
              • أفقياً: <MathFormula math="V_x = V_0 \cos(\theta)" /> (حركة منتظمة السرعة بدون عجلة)
            </span>
            <span className="block mb-1">
              • رأسياً: <MathFormula math="V_{y0} = V_0 \sin(\theta)" /> (حركة بعجلة السقوط الحر <MathFormula math="g" />)
            </span>
            <span className="block text-[11px] text-violet-700 font-bold mt-1">
              • زمن الصعود = زمن الهبوط (في حال التماثل على نفس المستوى الأفقي).
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
