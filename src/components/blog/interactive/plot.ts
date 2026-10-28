export const palette = ["#b46a48", "#3878a6", "#78915a", "#a26caa"];
export const linspace = (n: number) => Array.from({ length: n }, (_, i) => i / Math.max(1, n - 1));
export function linePath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}
export function prng(seed: number) {
  let x = seed >>> 0;
  return () => { x = (1664525 * x + 1013904223) >>> 0; return x / 4294967296; };
}
export function normal(rng: () => number): number {
  return Math.sqrt(-2 * Math.log(Math.max(1e-10, rng()))) * Math.cos(2 * Math.PI * rng());
}
