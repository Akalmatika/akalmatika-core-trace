export function getVisualizationRoute(topicId: string, misconceptionCode: string | null): string {
  if (!misconceptionCode) {
    return `/student/visualizations/${topicId}`; // Fallback to topic catalog
  }

  // Integer
  if (misconceptionCode === 'MC-ADD-SIGN-CONF' || misconceptionCode === 'MC-ADD-ABS-SUM') {
    return '/student/visualizations/integer/zero-pair';
  }
  if (misconceptionCode === 'MC-SIGN-FIRST-NUM' || misconceptionCode === 'MC-SUB-IGNORE-NEG') {
    return '/student/visualizations/integer/number-line';
  }

  // Fractions
  if (misconceptionCode === 'MC-FRAC-DIFF-DENOM-IGNORE') {
    return '/student/visualizations/fractions/different-denominator';
  }
  if (misconceptionCode === 'MC-FRAC-ADD-NUM-DENOM') {
    return '/student/visualizations/fractions/area-model'; // Base concept
  }

  // Percent
  if (misconceptionCode === 'MC-PERC-NO-100' || misconceptionCode === 'MC-PERC-ADD-ZERO') {
    return '/student/visualizations/percent/grid-100'; // Visualization to show percent meaning
  }

  // Algebra
  if (misconceptionCode === 'MC-ALG-ADD-UNLIKE') {
    return '/student/visualizations/algebra/like-term-operations';
  }
  if (misconceptionCode === 'MC-ALG-IGNORE-VAR') {
    return '/student/visualizations/algebra/term-cards'; // Shows explicit '1'
  }

  // Mixed Operations
  if (misconceptionCode === 'MC-PEMDAS-LEFT-RIGHT') {
    return '/student/visualizations/algebra/order-of-operations';
  }

  // PLSV
  if (misconceptionCode === 'MC-PLSV-INV-OP-CONFUSION') {
    return '/student/visualizations/algebra/plsv-balance';
  }

  // Fallbacks
  if (topicId === 'mixed-operations') {
    return '/student/visualizations/operasi-campuran';
  }
  if (topicId === 'plsv') {
    return '/student/visualizations/plsv';
  }

  return `/student/visualizations/${topicId}`;
}

export function getBridgeRoute(topicId: string, misconceptionCode: string | null): string {
  if (!misconceptionCode) {
    return `/student/visualizations/${topicId}`; // Fallback ke visualisasi jika tidak ada miskonsepsi (nilai sempurna)
  }
  return `/student/bridge/${topicId}/${misconceptionCode}`;
}

