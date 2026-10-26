import React from 'react';
import { TargetMode, ProjectileObject, PhysicsState } from '../types/physics';
import { MathFormula } from './MathFormula';

interface ExperimentInputsProps {
  state: PhysicsState;
  onChangeField: <K extends keyof PhysicsState>(key: K, value: PhysicsState[K]) => void;
}

export const ExperimentInputs: React.FC<ExperimentInputsProps> = ({
  state,
  onChangeField,
}) => {
  const isV0Visible = state.targetMode !== 'FIND_V0_RANGE' && state.targetMode !== 'FIND_V0_HEIGHT';
  const isAngleVisible = state.targetMode !== 'FIND_ANGLE' && state.targetMode !== 'FIND_HEIGHT_TIME';
  const isHeightVisible = state.targetMode !== 'FIND_HEIGHT_TIME';
  const isRangeVisible = state.targetMode === 'FIND_V0_RANGE' || state.targetMode === 'FIND_ANGLE';
  const isMaxHeightVisible = state.targetMode === 'FIND_V0_HEIGHT';
  const isFallTimeVisible = state.targetMode === 'FIND_HEIGHT_TIME';

  const projectileOptions: { id: ProjectileObject; label: string; emoji: string }[] = [
    { id: 'ball', label: 'كرة قدم', emoji: '⚽' },
    { id: 'basketball', label: 'كرة سلة', emoji: '🏀' },
    { id: 'rocket', label: 'صاروخ', emoji: '🚀' },
    { id: 'cannonball', label: 'قذيفة', emoji: '💣' },
    { id: 'rock', label: 'صخرة', emoji: '🪨' },
    { id: 'coin', label: 'عملة ذهبية', emoji: '🪙' },
    { id: 'arrow', label: 'سهم', emoji: '🏹' },
    { id: 'ufo', label: 'صحن طائر', emoji: '🛸' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h2 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <i className="fa-solid fa-vial-circle-check text-emerald-600"></i> معطيات وركائز التجربة
        </h2>
        <span className="text-[11px] text-slate-400 font-semibold">تحكم متقدم وسريع</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* V0 Input */}
        {isV0Visible && (
          <div className="col-span-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>السرعة الابتدائية</span>
                <MathFormula math="V_0" className="text-indigo-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                m/s
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.v0Input}
                step="0.5"
                min="0"
                max="100"
                onChange={(e) => onChangeField('v0Input', parseFloat(e.target.value) || 0)}
                className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <input
                type="range"
                value={state.v0Input}
                min="1"
                max="80"
                step="1"
                onChange={(e) => onChangeField('v0Input', parseFloat(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Angle Input */}
        {isAngleVisible && (
          <div className="col-span-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>زاوية القذف</span>
                <MathFormula math="\theta" className="text-indigo-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                درجة (°)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.angleInput}
                min="0"
                max="90"
                step="1"
                onChange={(e) =>
                  onChangeField(
                    'angleInput',
                    Math.min(90, Math.max(0, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <input
                type="range"
                value={state.angleInput}
                min="0"
                max="90"
                step="1"
                onChange={(e) => onChangeField('angleInput', parseFloat(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Height Input */}
        {isHeightVisible && (
          <div className="col-span-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>ارتفاع منصة القذف</span>
                <MathFormula math="h_0" className="text-indigo-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                متر (m)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.heightInput}
                min="0"
                max="150"
                step="1"
                onChange={(e) =>
                  onChangeField('heightInput', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <input
                type="range"
                value={state.heightInput}
                min="0"
                max="100"
                step="1"
                onChange={(e) => onChangeField('heightInput', parseFloat(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Range Target Input (Conditional) */}
        {isRangeVisible && (
          <div className="col-span-1 bg-emerald-50/70 p-3 rounded-xl border border-emerald-300/80">
            <label className="block text-xs font-bold text-emerald-800 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>المدى الأفقي المطلوب</span>
                <MathFormula math="R" className="text-emerald-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
                متر (m)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.rangeInput}
                step="1"
                min="1"
                max="500"
                onChange={(e) =>
                  onChangeField('rangeInput', Math.max(1, parseFloat(e.target.value) || 1))
                }
                className="w-24 bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
              <input
                type="range"
                value={state.rangeInput}
                min="5"
                max="200"
                step="1"
                onChange={(e) => onChangeField('rangeInput', parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Max Height Target Input (Conditional) */}
        {isMaxHeightVisible && (
          <div className="col-span-1 bg-indigo-50/70 p-3 rounded-xl border border-indigo-300/80">
            <label className="block text-xs font-bold text-indigo-800 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>أقصى ارتفاع مطلوب</span>
                <MathFormula math="H_{\max}" className="text-indigo-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                متر (m)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.maxHeightInput}
                step="0.5"
                min="0.5"
                max="200"
                onChange={(e) =>
                  onChangeField('maxHeightInput', Math.max(0.5, parseFloat(e.target.value) || 0.5))
                }
                className="w-24 bg-white border border-indigo-400 rounded-lg px-2.5 py-1.5 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <input
                type="range"
                value={state.maxHeightInput}
                min="1"
                max="100"
                step="0.5"
                onChange={(e) => onChangeField('maxHeightInput', parseFloat(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Fall Time Target Input (Conditional) */}
        {isFallTimeVisible && (
          <div className="col-span-1 bg-purple-50/70 p-3 rounded-xl border border-purple-300/80">
            <label className="block text-xs font-bold text-purple-800 mb-1.5 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>زمن الهبوط المعلوم</span>
                <MathFormula math="t_{\text{fall}}" className="text-purple-700 font-bold" />
              </span>
              <span className="text-[11px] font-mono text-purple-600 bg-white px-2 py-0.5 rounded border border-purple-200">
                ثانية (s)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.fallTimeInput}
                step="0.1"
                min="0.1"
                max="20"
                onChange={(e) =>
                  onChangeField('fallTimeInput', Math.max(0.1, parseFloat(e.target.value) || 0.1))
                }
                className="w-24 bg-white border border-purple-400 rounded-lg px-2.5 py-1.5 text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
              />
              <input
                type="range"
                value={state.fallTimeInput}
                min="0.5"
                max="10"
                step="0.1"
                onChange={(e) => onChangeField('fallTimeInput', parseFloat(e.target.value))}
                className="flex-1 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Gravity Preset */}
        <div className="col-span-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <span>عجلة الجاذبية</span>
            <MathFormula math="g" className="text-indigo-700 font-bold" />
          </label>
          <select
            value={state.isCustomGravity ? 'CUSTOM' : state.gravity.toString()}
            onChange={(e) => {
              if (e.target.value === 'CUSTOM') {
                onChangeField('isCustomGravity', true);
              } else {
                onChangeField('isCustomGravity', false);
                onChangeField('gravity', parseFloat(e.target.value));
              }
            }}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
          >
            <option value="9.8">🌍 كوكب الأرض القياسي (9.8 m/s²)</option>
            <option value="10">🌍 كوكب الأرض تقريبي (10.0 m/s²)</option>
            <option value="1.62">🌕 سطح القمر (1.62 m/s²)</option>
            <option value="3.71">🔴 كوكب المريخ (3.71 m/s²)</option>
            <option value="24.79">🪐 كوكب المشتري العملاق (24.79 m/s²)</option>
            <option value="CUSTOM">⚙️ قيمة مخصصة يدويًا</option>
          </select>
        </div>

        {/* Custom Gravity Input */}
        {state.isCustomGravity && (
          <div className="col-span-1 bg-amber-50/70 p-3 rounded-xl border border-amber-300/80">
            <label className="block text-xs font-bold text-amber-900 mb-1.5 flex justify-between items-center">
              <span>جاذبية مخصصة</span>
              <span className="text-[11px] font-mono text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                m/s²
              </span>
            </label>
            <input
              type="number"
              value={state.customGravity}
              step="0.1"
              min="0.1"
              max="50"
              onChange={(e) =>
                onChangeField('customGravity', Math.max(0.1, parseFloat(e.target.value) || 9.8))
              }
              className="w-full bg-white border border-amber-400 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Projectile Object Selector as vibrant EMOJIS */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-3.5 rounded-xl border border-indigo-100/80">
          <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>اختر شكل المقذوف (إيموجيز واقعية):</span>
            </span>
            <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              تتحرك وتدور على الشاشة
            </span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {projectileOptions.map((obj) => {
              const isSelected =
                state.selectedObject === obj.id ||
                (obj.id === 'ball' && state.selectedObject === 'ball');
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => onChangeField('selectedObject', obj.id)}
                  className={`py-2 px-1 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition duration-150 active:scale-95 ${
                    isSelected
                      ? 'border-indigo-500 bg-white shadow-md ring-2 ring-indigo-400 text-indigo-900 scale-105'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl leading-none transition-transform group-hover:scale-110 drop-shadow-xs">
                    {obj.emoji}
                  </span>
                  <span className="text-[10px] whitespace-nowrap mt-0.5">{obj.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
