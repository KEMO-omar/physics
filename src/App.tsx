import React, { useState, useMemo, useCallback } from 'react';
import { TargetMode, ProjectileObject, PhysicsState } from './types/physics';
import { computePhysics } from './utils/physicsEngine';
import { Header } from './components/Header';
import { SolverModeSelector } from './components/SolverModeSelector';
import { ExperimentInputs } from './components/ExperimentInputs';
import { StepByStepMath } from './components/StepByStepMath';
import { SimulationCanvas } from './components/SimulationCanvas';
import { MetricsCards } from './components/MetricsCards';
import { CurriculumInsights } from './components/CurriculumInsights';
import { Footer } from './components/Footer';

const defaultState: PhysicsState = {
  targetMode: 'FORWARD',
  selectedObject: 'rocket',
  gravity: 9.8,
  customGravity: 9.8,
  isCustomGravity: false,
  v0Input: 25,
  angleInput: 45,
  heightInput: 0,
  rangeInput: 60,
  maxHeightInput: 15,
  fallTimeInput: 3.5,
  showVectors: true,
  isSlowMotion: false,
  soundEnabled: true,
  showTrailParticles: true,
};

export const App: React.FC = () => {
  const [state, setState] = useState<PhysicsState>(defaultState);

  const effectiveGravity = state.isCustomGravity ? state.customGravity : state.gravity;

  const handleFieldChange = useCallback(
    <K extends keyof PhysicsState>(key: K, value: PhysicsState[K]) => {
      setState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleModeChange = useCallback((mode: TargetMode) => {
    setState((prev) => {
      const next = { ...prev, targetMode: mode };
      if (mode === 'FIND_HEIGHT_TIME') {
        next.angleInput = 0; // Horizontal launch
      }
      return next;
    });
  }, []);

  const handleResetLab = useCallback(() => {
    setState({ ...defaultState });
  }, []);

  // Quick curriculum presets
  const applyPreset = (preset: {
    targetMode: TargetMode;
    v0: number;
    angle: number;
    h0: number;
    object: ProjectileObject;
    g?: number;
  }) => {
    setState((prev) => ({
      ...prev,
      targetMode: preset.targetMode,
      v0Input: preset.v0,
      angleInput: preset.angle,
      heightInput: preset.h0,
      selectedObject: preset.object,
      gravity: preset.g ?? 9.8,
      isCustomGravity: false,
    }));
  };

  const computed = useMemo(() => {
    return computePhysics({
      targetMode: state.targetMode,
      gravity: effectiveGravity,
      rawV0: state.v0Input,
      rawAngle: state.angleInput,
      rawH0: state.heightInput,
      rawRange: state.rangeInput,
      rawMaxH: state.maxHeightInput,
      rawFallTime: state.fallTimeInput,
    });
  }, [
    state.targetMode,
    effectiveGravity,
    state.v0Input,
    state.angleInput,
    state.heightInput,
    state.rangeInput,
    state.maxHeightInput,
    state.fallTimeInput,
  ]);

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-slate-100 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header onResetLab={handleResetLab} />

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto w-full p-3 md:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & Derivations (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Quick Curriculum Presets Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
              <span>⚡ مسائل امتحانات سريعة جاهزة للتجربة:</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    targetMode: 'FORWARD',
                    v0: 30,
                    angle: 45,
                    h0: 0,
                    object: 'rocket',
                  })
                }
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-xl border border-indigo-200 text-right transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>أقصى مدى (45° | 30m/s)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    targetMode: 'FORWARD',
                    v0: 20,
                    angle: 0,
                    h0: 45,
                    object: 'cannonball',
                  })
                }
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 p-2 rounded-xl border border-emerald-200 text-right transition active:scale-95 flex items-center gap-1.5"
              >
                <span>💣</span>
                <span>قذف أفقي من مبنى 45m</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    targetMode: 'FORWARD',
                    v0: 22,
                    angle: 30,
                    h0: 0,
                    object: 'football',
                  })
                }
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 p-2 rounded-xl border border-amber-200 text-right transition active:scale-95 flex items-center gap-1.5"
              >
                <span>⚽</span>
                <span>ركلة بزاوية 30°</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    targetMode: 'FORWARD',
                    v0: 18,
                    angle: 60,
                    h0: 10,
                    object: 'basketball',
                  })
                }
                className="bg-purple-50 hover:bg-purple-100 text-purple-800 p-2 rounded-xl border border-purple-200 text-right transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🏀</span>
                <span>قوس مرتفع 60° من 10m</span>
              </button>
            </div>
          </div>

          <SolverModeSelector
            targetMode={state.targetMode}
            onChangeMode={handleModeChange}
          />

          <ExperimentInputs
            state={state}
            onChangeField={handleFieldChange}
          />

          <StepByStepMath steps={computed.steps} />
        </section>

        {/* Right Column: Simulation & Dashboard (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          <SimulationCanvas
            computed={computed}
            gravity={effectiveGravity}
            selectedObject={state.selectedObject}
            showVectors={state.showVectors}
            isSlowMotion={state.isSlowMotion}
            soundEnabled={state.soundEnabled}
            onToggleVectors={(val) => handleFieldChange('showVectors', val)}
            onToggleSlowMotion={(val) => handleFieldChange('isSlowMotion', val)}
            onToggleSound={(val) => handleFieldChange('soundEnabled', val)}
          />

          <MetricsCards computed={computed} />

          <CurriculumInsights />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
