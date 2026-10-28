import { useMemo, useState } from 'react';
import './explorer.css';
import { linePath, palette } from './plot';

type Method = 'SGD' | 'Momentum' | 'RMSprop' | 'Adam';
const methods: Method[] = ['SGD', 'Momentum', 'RMSprop', 'Adam'];
const loss = (x: number, y: number) => .5 * (x * x + 18 * y * y);
function trajectory(method: Method, lr: number, steps: number) {
  let x = 2.5, y = 1.1, mx = 0, my = 0, vx = 0, vy = 0;
  const points: [number, number][] = [[x, y]];
  for (let t = 1; t <= steps; t++) {
    const gx = x, gy = 18 * y;
    if (method === 'SGD') { x -= lr * gx; y -= lr * gy; }
    else if (method === 'Momentum') { mx = .9 * mx + gx; my = .9 * my + gy; x -= lr * mx; y -= lr * my; }
    else if (method === 'RMSprop') { vx = .9 * vx + .1 * gx * gx; vy = .9 * vy + .1 * gy * gy; x -= lr * gx / (Math.sqrt(vx) + 1e-8); y -= lr * gy / (Math.sqrt(vy) + 1e-8); }
    else { mx = .9 * mx + .1 * gx; my = .9 * my + .1 * gy; vx = .999 * vx + .001 * gx * gx; vy = .999 * vy + .001 * gy * gy; x -= lr * (mx / (1 - .9 ** t)) / (Math.sqrt(vx / (1 - .999 ** t)) + 1e-8); y -= lr * (my / (1 - .9 ** t)) / (Math.sqrt(vy / (1 - .999 ** t)) + 1e-8); }
    if (!Number.isFinite(x + y) || Math.abs(x) + Math.abs(y) > 50) break;
    points.push([x, y]);
  }
  return points;
}
export default function OptimizerExplorer() {
  const [lr, setLr] = useState(.04), [steps, setSteps] = useState(45), [shown, setShown] = useState<Method[]>(methods);
  const runs = useMemo(() => methods.map(m => ({ method: m, points: trajectory(m, lr, steps) })), [lr, steps]);
  const sx = (x: number) => 210 + x * 58, sy = (y: number) => 150 - y * 94;
  return <section className="math-lab" aria-label="Optimizer comparison">
    <h3>Optimizer trajectories on the same loss</h3>
    <p className="lab-muted">All methods start at (2.5, 1.1). The objective is f(x,y) = ½(x² + 18y²). Learning rates are deliberately shared to expose different step-size behavior, not to optimize each method.</p>
    <div className="lab-controls"><label><span>Learning rate: <b>{lr.toFixed(3)}</b></span><input type="range" min=".005" max=".12" step=".005" value={lr} onChange={e=>setLr(+e.target.value)}/></label><label><span>Steps: <b>{steps}</b></span><input type="range" min="5" max="100" step="5" value={steps} onChange={e=>setSteps(+e.target.value)}/></label></div>
    <div className="lab-controls" role="group" aria-label="Show optimizers">{methods.map((m,i)=><button key={m} aria-pressed={shown.includes(m)} onClick={()=>setShown(s=>s.includes(m)?s.filter(x=>x!==m):[...s,m])} style={{borderColor:palette[i]}}>{m}</button>)}</div>
    <svg className="lab-plot" viewBox="0 0 430 305" role="img" aria-label="Contour plot of quadratic loss and optimizer paths">
      {Array.from({length:9},(_,i)=>{const r=Math.sqrt((i+1)*1.9);return <ellipse key={i} cx="210" cy="150" rx={r*58} ry={r/Math.sqrt(18)*94} fill="none" stroke="currentColor" strokeOpacity={.09+i*.015}/>})}
      <path d="M10 150 H420 M210 10 V290" className="lab-axis"/><circle cx="210" cy="150" r="3" fill="currentColor"/><text x="216" y="143" className="lab-caption">minimum</text>
      {runs.filter(r=>shown.includes(r.method)).map(r=>{const i=methods.indexOf(r.method);return <g key={r.method}><path d={linePath(r.points.map(([x,y])=>[sx(x),sy(y)]))} stroke={palette[i]} strokeWidth="2.4" strokeLinejoin="round" fill="none"/><circle cx={sx(r.points.at(-1)![0])} cy={sy(r.points.at(-1)![1])} r="4" fill={palette[i]}/></g>})}
      <text x="400" y="143" className="lab-caption">x</text><text x="217" y="17" className="lab-caption">y</text>
    </svg>
    <div className="lab-legend">{runs.filter(r=>shown.includes(r.method)).map(r=>{const p=r.points.at(-1)!;return <span key={r.method}><i className="lab-swatch" style={{background:palette[methods.indexOf(r.method)]}}/>{r.method}: <span className="lab-stat">loss {loss(...p).toFixed(3)}</span></span>})}</div>
    <p className="lab-muted">A large shared learning rate may cause some methods to diverge. Momentum uses β=0.9; RMSprop uses β=0.9; Adam uses β₁=0.9, β₂=0.999 and bias correction. This is a deterministic full-gradient illustration, not a noisy minibatch benchmark.</p>
  </section>;
}
