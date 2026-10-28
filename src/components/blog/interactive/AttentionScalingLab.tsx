import { useMemo, useState } from 'react';
import './explorer.css';
import { normal, palette, prng } from './plot';
function softmax(xs: number[]) { const mx=Math.max(...xs); const es=xs.map(x=>Math.exp(x-mx)); const z=es.reduce((a,b)=>a+b,0); return es.map(x=>x/z); }
export default function AttentionScalingLab() {
 const [d,setD]=useState(64),[scale,setScale]=useState(true),[seed,setSeed]=useState(17);
 const data=useMemo(()=>{const rng=prng(seed);const q=Array.from({length:d},()=>normal(rng));const scores=Array.from({length:8},()=>{let s=0;for(let i=0;i<d;i++)s+=q[i]*normal(rng);return s/(scale?Math.sqrt(d):1)});const probs=softmax(scores);return {scores,probs,entropy:-probs.reduce((a,p)=>a+(p>0?p*Math.log(p):0),0),max:Math.max(...probs)};},[d,scale,seed]);
 return <section className="math-lab" aria-label="Scaled dot product attention experiment"><h3>What does dividing by √d change?</h3><p className="lab-muted">One randomly generated query and eight keys, with independent standard-normal coordinates. Scores are dot products; softmax converts them to attention weights.</p>
 <div className="lab-controls"><label><span>Key dimension d: <b>{d}</b></span><input type="range" min="4" max="256" step="4" value={d} onChange={e=>setD(+e.target.value)}/></label><label><span>Scaling</span><select value={scale?'scaled':'raw'} onChange={e=>setScale(e.target.value==='scaled')}><option value="scaled">q·k / √d</option><option value="raw">q·k (unscaled)</option></select></label><button onClick={()=>setSeed(x=>x+1)}>New random sample</button></div>
 <svg className="lab-plot" viewBox="0 0 440 210" role="img" aria-label="Eight softmax attention weights"><path d="M35 175H425" className="lab-axis"/>{data.probs.map((p,i)=><g key={i}><rect x={45+i*47} y={175-145*p} width="30" height={145*p} fill={palette[1]}/><text x={60+i*47} y="192" textAnchor="middle" className="lab-caption">k{i+1}</text></g>)}<text x="4" y="20" className="lab-caption">weight</text><text x="8" y="34" className="lab-caption">1.0</text><text x="8" y="176" className="lab-caption">0</text></svg>
 <div className="lab-legend"><span>Maximum attention weight: <b className="lab-stat">{data.max.toFixed(3)}</b></span><span>Entropy: <b className="lab-stat">{data.entropy.toFixed(3)} nats</b></span><span>Maximum possible entropy: <b className="lab-stat">{Math.log(8).toFixed(3)}</b></span></div>
 <p className="lab-muted">Try d=256 without scaling, then switch scaling on. One sample can be atypical; regenerate several times. The variance argument is statistical, not a guarantee about any particular draw.</p></section>;
}
