import { TargetMode, CalculationStep, ComputedPhysics } from '../types/physics';

export interface ComputeParams {
  targetMode: TargetMode;
  gravity: number;
  rawV0: number;
  rawAngle: number;
  rawH0: number;
  rawRange: number;
  rawMaxH: number;
  rawFallTime: number;
}

export function computePhysics(params: ComputeParams): ComputedPhysics {
  const {
    targetMode,
    gravity,
    rawV0,
    rawAngle,
    rawH0,
    rawRange,
    rawMaxH,
    rawFallTime,
  } = params;

  const steps: CalculationStep[] = [];
  let v0 = Math.max(0, rawV0);
  let angleDeg = Math.min(90, Math.max(0, rawAngle));
  let h0 = Math.max(0, rawH0);

  let rad = (angleDeg * Math.PI) / 180;

  if (targetMode === 'FORWARD') {
    v0 = rawV0;
    angleDeg = rawAngle;
    h0 = rawH0;
    rad = (angleDeg * Math.PI) / 180;

    const vxCalc = v0 * Math.cos(rad);
    const vy0Calc = v0 * Math.sin(rad);

    steps.push({
      title: '1. تحليل متجه السرعة الابتدائية إلى المركبتين الأفقية والرأسية',
      formulaKatex: 'V_x = V_0 \\cos(\\theta), \\quad V_{y0} = V_0 \\sin(\\theta)',
      calcKatex: `V_x = ${v0} \\times \\cos(${angleDeg}^\\circ) = ${vxCalc.toFixed(2)} \\text{ m/s} \\\\[6pt] V_{y0} = ${v0} \\times \\sin(${angleDeg}^\\circ) = ${vy0Calc.toFixed(2)} \\text{ m/s}`,
      explanation: 'المركبة الأفقية Vx تظل ثابتة طوال الحركة لإنعدام العجلة الأفقية، بينما المركبة الرأسية Vy0 تتأثر بعجلة الجاذبية الأرضية g.',
    });
  } else if (targetMode === 'FIND_V0_RANGE') {
    angleDeg = rawAngle;
    h0 = rawH0;
    rad = (angleDeg * Math.PI) / 180;

    if (h0 === 0 && angleDeg > 0) {
      const sin2t = Math.sin(2 * rad);
      if (sin2t > 0) {
        v0 = Math.sqrt((rawRange * gravity) / sin2t);
      } else {
        v0 = 0;
      }
      steps.push({
        title: 'حساب السرعة الابتدائية المطلوبة V₀ من المدى الأفقي المعلوم R',
        formulaKatex: 'R = \\frac{V_0^2 \\sin(2\\theta)}{g} \\implies V_0 = \\sqrt{\\frac{R \\cdot g}{\\sin(2\\theta)}}',
        calcKatex: `V_0 = \\sqrt{\\frac{${rawRange} \\times ${gravity}}{\\sin(${2 * angleDeg}^\\circ)}} = \\sqrt{\\frac{${(rawRange * gravity).toFixed(2)}}{${sin2t.toFixed(4)}}} = ${v0.toFixed(2)} \\text{ m/s}`,
        explanation: 'عند القذف من مستوى الأرض والعودة لنفس المستوى، نستخدم قانون المدى الأفقي الكلاسيكي.',
      });
    } else {
      v0 = Math.sqrt((rawRange * gravity) / Math.max(0.1, Math.sin(2 * rad) + 0.1));
      steps.push({
        title: 'حساب السرعة الابتدائية V₀ بالارتفاع الابتدائي h₀',
        formulaKatex: 'R = V_0 \\cos(\\theta) \\cdot t_{\\text{flight}}',
        calcKatex: `V_0 \\approx ${v0.toFixed(2)} \\text{ m/s}`,
        explanation: 'تم إيجاد السرعة المناسبة للوصول إلى المدى المطلوب مع الأخذ في الاعتبار ارتفاع منصة القذف.',
      });
    }
  } else if (targetMode === 'FIND_V0_HEIGHT') {
    angleDeg = rawAngle;
    h0 = rawH0;
    rad = (angleDeg * Math.PI) / 180;
    const neededPeak = Math.max(0.1, rawMaxH - h0);

    const vy0_req = Math.sqrt(2 * gravity * neededPeak);
    if (Math.sin(rad) > 0) {
      v0 = vy0_req / Math.sin(rad);
    } else {
      v0 = vy0_req;
    }

    steps.push({
      title: 'حساب السرعة الابتدائية V₀ للوصول لأقصى ارتفاع H_max',
      formulaKatex: 'V_{y0} = \\sqrt{2g (H_{\\max} - h_0)}, \\quad V_0 = \\frac{V_{y0}}{\\sin(\\theta)}',
      calcKatex: `V_{y0} = \\sqrt{2 \\times ${gravity} \\times ${neededPeak.toFixed(1)}} = ${vy0_req.toFixed(2)} \\text{ m/s} \\\\[6pt] V_0 = \\frac{${vy0_req.toFixed(2)}}{\\sin(${angleDeg}^\\circ)} = ${v0.toFixed(2)} \\text{ m/s}`,
      explanation: 'عند أقصى ارتفاع تصبح السرعة الرأسية Vy = 0، فنعوض في معادلة الحركة الثالثة.',
    });
  } else if (targetMode === 'FIND_HEIGHT_TIME') {
    v0 = rawV0;
    angleDeg = 0; // Horizontal launch
    rad = 0;
    h0 = 0.5 * gravity * Math.pow(rawFallTime, 2);

    steps.push({
      title: 'حساب ارتفاع المبنى h₀ من زمن الهبوط لقذف أفقي',
      formulaKatex: 'h_0 = \\frac{1}{2} g t_{\\text{fall}}^2 \\quad (\\because V_{y0} = 0)',
      calcKatex: `h_0 = \\frac{1}{2} \\times ${gravity} \\times (${rawFallTime})^2 = ${h0.toFixed(2)} \\text{ m}`,
      explanation: 'في القذف الأفقي (الزاوية 0°)، تكون السرعة الرأسية الابتدائية منعدمة تماماً وحركة الهبوط سقوطاً حراً.',
    });
  } else if (targetMode === 'FIND_ANGLE') {
    v0 = rawV0;
    h0 = rawH0;
    let sin2t = (rawRange * gravity) / Math.max(0.1, Math.pow(v0, 2));
    if (sin2t > 1) sin2t = 1;
    angleDeg = (Math.asin(sin2t) * 180 / Math.PI) / 2;
    rad = (angleDeg * Math.PI) / 180;

    steps.push({
      title: 'حساب زاوية القذف θ لتحقيق مدى أفقي معلوم بالسرعة المعلومة',
      formulaKatex: '\\sin(2\\theta) = \\frac{R \\cdot g}{V_0^2} \\implies \\theta = \\frac{1}{2} \\arcsin\\left(\\frac{R \\cdot g}{V_0^2}\\right)',
      calcKatex: `\\sin(2\\theta) = \\frac{${rawRange} \\times ${gravity}}{${v0}^2} = ${sin2t.toFixed(4)} \\implies \\theta = ${angleDeg.toFixed(1)}^\\circ`,
      explanation: 'لأي مدى أقل من المدى الأقصى توجد زاويتان متتامتان تحققان نفس المدى (مجموعهما 90°).',
    });
  } else if (targetMode === 'FIND_TIME_FALL') {
    v0 = rawV0;
    angleDeg = rawAngle;
    h0 = rawH0;
    rad = (angleDeg * Math.PI) / 180;
  }

  // Kinematics derivations
  const vx = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);

  const tPeak = gravity > 0 ? vy0 / gravity : 0;
  const peakH = h0 + (gravity > 0 ? Math.pow(vy0, 2) / (2 * gravity) : 0);

  // Total flight time solving quadratic: h(t) = h0 + vy0*t - 0.5*g*t^2 = 0
  const a = 0.5 * gravity;
  const b = -vy0;
  const c = -h0;
  const discriminant = b * b - 4 * a * c;

  let totalFlightTime = 0;
  if (discriminant >= 0 && a > 0) {
    totalFlightTime = (-b + Math.sqrt(discriminant)) / (2 * a);
  }

  const totalHorizontalRange = vx * totalFlightTime;
  const maxReachHeight = peakH;

  // Append time step
  steps.push({
    title: '2. حساب زمن الوصول لأقصى ارتفاع وزمن الطيران الكلي',
    formulaKatex: 't_{\\text{peak}} = \\frac{V_{y0}}{g}, \\quad y(t) = h_0 + V_{y0}t - \\frac{1}{2}gt^2 = 0',
    calcKatex: `t_{\\text{peak}} = \\frac{${vy0.toFixed(2)}}{${gravity}} = ${tPeak.toFixed(2)} \\text{ s} \\\\[6pt] t_{\\text{flight}} = ${totalFlightTime.toFixed(2)} \\text{ s}`,
    explanation: 'زمن التحليق الكلي هو الزمن اللازم لقطع المسار بأكمله حتى الاصطدام بسطح الأرض.',
  });

  // Append results step
  steps.push({
    title: '3. حساب المدى الأفقي الكلي وأقصى ارتفاع يبلغه المقذوف',
    formulaKatex: 'R = V_x \\cdot t_{\\text{flight}}, \\quad H_{\\max} = h_0 + \\frac{V_{y0}^2}{2g}',
    calcKatex: `R = ${vx.toFixed(2)} \\times ${totalFlightTime.toFixed(2)} = ${totalHorizontalRange.toFixed(2)} \\text{ m} \\\\[6pt] H_{\\max} = ${h0.toFixed(1)} + \\frac{(${vy0.toFixed(2)})^2}{2 \\times ${gravity}} = ${maxReachHeight.toFixed(2)} \\text{ m}`,
    explanation: 'أقصى مدى أفقي يتحقق نظرياً عند زاوية 45° إذا كان القذف من سطح الأرض.',
  });

  return {
    v0,
    angleDeg,
    h0,
    vx,
    vy0,
    totalFlightTime,
    maxReachHeight,
    totalHorizontalRange,
    tPeak,
    steps,
  };
}
