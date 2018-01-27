export function precisionRound(num, precision) {
  let factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}