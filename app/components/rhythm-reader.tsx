"use client";
import {useState} from 'react';
import {readRhythm,rhythmExamples,rhythmSources} from '@/lib/rhythm-reader';
export default function RhythmReader(){
 const [text,setText]=useState('');const [submitted,setSubmitted]=useState('');const [copied,setCopied]=useState('');
 const result=submitted?readRhythm(submitted):null;
 function change(value:string){setText(value);setSubmitted('');setCopied('');}
 return <section className="card mb-4 space-y-3">
  <h2 className="font-serif text-xl">Describe a rhythm</h2>
  <p className="text-sm">Type ECG or Holter findings. This local rule-based reader explains supported patterns and alternatives without an API key. It does not read uploaded tracings.</p>
  <div className="flex flex-wrap gap-2">{rhythmExamples.map((s,i)=><button type="button" className="btn" key={s} onClick={()=>change(s)}>Load example {i+1}</button>)}</div>
  <form onSubmit={e=>{e.preventDefault();setSubmitted(text.trim());setCopied('');}} className="space-y-2">
   <label htmlFor="rhythm-description" className="block">ECG / Holter description</label>
   <textarea id="rhythm-description" rows={5} maxLength={4000} value={text} onChange={e=>change(e.target.value)} className="w-full border rounded p-3" placeholder="Describe the abnormal segment: rate, QRS width, regularity, P waves, beat count and symptoms." required/>
   <button className="btn" type="submit" disabled={!text.trim()}>Interpret description</button>
  </form>
  {result?<div aria-live="polite" className="space-y-2 border-t pt-3">
   {result.urgent?<p role="alert" className="bg-red-100 p-3">Potential clinical instability described: arrange immediate clinical assessment; do not delay care for this interpretation.</p>:null}
   <h3 className="font-semibold">{result.title}</h3><p>{result.explanation}</p>
   {result.points.length?<ul className="list-disc pl-5">{result.points.map(p=><li key={p}>{p}</li>)}</ul>:null}
   {result.differentials.length?<><h4 className="font-semibold">Differential diagnosis</h4><ul className="list-disc pl-5">{result.differentials.map(p=><li key={p}>{p}</li>)}</ul></>:null}
   <h4 className="font-semibold">Confirm on the tracing</h4><ul className="list-disc pl-5">{result.missing.map(p=><li key={p}>{p}</li>)}</ul>
   <button type="button" className="btn" onClick={async()=>{try{await navigator.clipboard.writeText([result.title,result.explanation,...result.points,...result.differentials,'Confirm: '+result.missing.join(' '),'Description-based educational interpretation; clinician review of the tracing required.'].join('\n'));setCopied('Copied');}catch{setCopied('Copy unavailable. Select and copy the answer manually.');}}}>Copy interpretation</button><span role="status" className="ml-2 text-sm">{copied}</span>
  </div>:null}
  <p className="text-xs">Educational interpretation of your description; confirm on the original tracing. Unsupported or ambiguous descriptions require clinician review. Text stays in this browser session and is not saved or sent to an AI service.</p>
  <details><summary>Sources and supported patterns</summary><p className="text-sm">Supported: absent P waves with regularity-based differential; regular wide-QRS runs with rate and beat count. Other patterns return a request for more information.</p><ul>{rhythmSources.map(s=><li key={s.url}><a className="underline text-sm" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul></details>
 </section>;
}
