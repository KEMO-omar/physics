export type TargetMode =
  | 'FORWARD'
  | 'FIND_V0_RANGE'
  | 'FIND_V0_HEIGHT'
  | 'FIND_HEIGHT_TIME'
  | 'FIND_ANGLE'
  | 'FIND_TIME_FALL';

export type ProjectileObject =
  | 'ball'
  | 'football'
  | 'basketball'
  | 'rocket'
  | 'cannonball'
  | 'rock'
  | 'coin'
  | 'arrow'
  | 'ufo';

export interface ProjectileMeta {
  id: ProjectileObject;
  label: string;
  emoji: string;
  category: string;
}

export interface CalculationStep {
  title: string;
  formulaKatex: string;
  calcKatex: string;
  explanation?: string;
}

export interface PhysicsState {
  targetMode: TargetMode;
  selectedObject: ProjectileObject;
  gravity: number;
  customGravity: number;
  isCustomGravity: boolean;
  
  // Raw inputs
  v0Input: number;
  angleInput: number;
  heightInput: number;
  rangeInput: number;
  maxHeightInput: number;
  fallTimeInput: number;

  // Options
  showVectors: boolean;
  isSlowMotion: boolean;
  soundEnabled: boolean;
  showTrailParticles: boolean;
}

export interface ComputedPhysics {
  v0: number;
  angleDeg: number;
  h0: number;
  vx: number;
  vy0: number;
  totalFlightTime: number;
  maxReachHeight: number;
  totalHorizontalRange: number;
  tPeak: number;
  steps: CalculationStep[];
}
