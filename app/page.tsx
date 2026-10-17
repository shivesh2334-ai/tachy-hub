"use client";
import {useState} from "react";
import {KB,IMG,LESSONS,QUIZ,REFS} from "@/lib/data";
import {diagnose,alerts} from "@/lib/engine";
import {holter,D} from "@/lib/holter";
const Sel=({l,v,o,s}:any)=><label>{l}<select value={v} onChange={e=>s(e.target.value)}>{o.map((x:any)=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>;
const Num=({l,v,s}:any)=><label>{l}<input type="number" step="any" value={v} onChange={e=>s(e.target.value)}/></label>;
const Chk=({l,v,s}:any)=><label className="flex gap-2 items-center"><input type="checkbox" className="!w-auto" checked={v} onChange={e=>s(e.target.checked)}/>{l}</label>;
const col:any={critical:"bg-ecg text-white",urgent:"bg-orange-100 border-orange-500",review:"bg-amber-50 border-amber-400",info:"bg-slate-50 border-slate-300"};
function Ecg(){
 const [f,setF]=useState<any>({qrs:"narrow",reg:"regular",rate:"150",onset:"abrupt",p:"unclear",rp:"",adeno:"none",qrsMs:"",morph:"",delta:false,struct:false,fusion:false,conc:false,priorBBB:false,qt:false,copd:false,unstable:false});
 const u=(k:string)=>(v:any)=>setF({...f,[k]:v});const r=diagnose(f);
 return <div className="grid md:grid-cols-2 gap-4"><div className="card space-y-3"><h2 className="font-serif text-xl">ECG findings</h2>
 <Sel l="QRS" v={f.qrs} s={u("qrs")} o={[["narrow","Narrow (≤120 ms)"],["broad","Broad (>120 ms)"]]}/>
 <Sel l="Rhythm" v={f.reg} s={u("reg")} o={[["regular","Regular"],["irregular","Irregular"]]}/>
 <Num l="Ventricular rate (bpm)" v={f.rate} s={u("rate")}/>
 <Num l="QRS width (ms)" v={f.qrsMs} s={u("qrsMs")}/>
 <Sel l="Onset" v={f.onset} s={u("onset")} o={[["abrupt","Abrupt"],["gradual","Gradual"],["unknown","Unknown"]]}/>
 <Sel l="P waves" v={f.p} s={u("p")} o={[["unclear","Not visible / hidden"],["before","P before each QRS"],["retro","Retrograde P after QRS"],["saw","Saw-tooth flutter waves"],["varied","≥3 P morphologies"],["none","No P waves"],["dissoc","Independent P (AV dissociation)"]]}/>
 <Sel l="RP interval" v={f.rp} s={u("rp")} o={[["","Unknown"],["short","Short (hidden/<70 ms)"],["long","Long (>70 ms)"]]}/>
 <Sel l="Adenosine / vagal response" v={f.adeno} s={u("adeno")} o={[["none","Not given"],["terminates","Terminates"],["reveals","Unmasks atrial activity"],["noeffect","No effect"]]}/>
 <Sel l="QRS morphology" v={f.morph} s={u("morph")} o={[["","Constant"],["mono","Monomorphic"],["poly","Polymorphic / twisting"]]}/>
 <Chk l="Delta wave / short PR in sinus rhythm" v={f.delta} s={u("delta")}/><Chk l="Prior MI, CAD, structural disease, LV dysfunction" v={f.struct} s={u("struct")}/>
 <Chk l="Fusion or capture beats" v={f.fusion} s={u("fusion")}/><Chk l="Concordance V1–V6" v={f.conc} s={u("conc")}/>
 <Chk l="Same BBB pattern on prior sinus ECG" v={f.priorBBB} s={u("priorBBB")}/><Chk l="Long QT / QT-prolonging drug" v={f.qt} s={u("qt")}/>
 <Chk l="COPD / lung disease" v={f.copd} s={u("copd")}/><Chk l="Unstable: hypotension, chest pain, HF, reduced consciousness" v={f.unstable} s={u("unstable")}/></div>
 <div className="space-y-3"><div className="card border-ecg"><h3 className="font-semibold">Safety alerts</h3><ul className="list-disc pl-5 text-sm">{alerts(f).map(a=><li key={a}>{a}</li>)}</ul></div>
 {r.length?r.map((x,i)=><div key={x.name} className="card"><div className="flex justify-between"><h3 className="font-serif text-lg">{i+1}. {x.name}</h3><span className="font-mono">{x.score}%</span></div><p className="text-sm mt-1"><b>Why:</b> {x.why.join("; ")}</p><p className="text-sm mt-1"><b>Action:</b> {x.action}</p></div>):<div className="card">Adjust findings: no pattern matches.</div>}
 <p className="text-xs">Decision support from rule-based scoring (not a probability). Confirm on a 12-lead ECG and clinical context.</p></div></div>
}
function Holter(){
 const [h,setH]=useState<any>({...D});const u=(k:string)=>(v:any)=>setH({...h,[k]:v});const {w,rep}=holter(h);
 return <div className="grid md:grid-cols-2 gap-4"><div className="card space-y-3"><h2 className="font-serif text-xl">Holter findings</h2>
 <Sel l="Baseline rhythm" v={h.base} s={u("base")} o={[["SR","Sinus rhythm"],["AF","Atrial fibrillation"],["AFL","Atrial flutter"],["Paced","Paced"],["Other","Other"]]}/>
 <div className="grid grid-cols-3 gap-2"><Num l="Min HR" v={h.minHR} s={u("minHR")}/><Num l="Avg HR" v={h.avgHR} s={u("avgHR")}/><Num l="Max HR" v={h.maxHR} s={u("maxHR")}/></div>
 <div className="grid grid-cols-2 gap-2"><Num l="Longest pause (s)" v={h.pause} s={u("pause")}/><Sel l="Pause occurred in" v={h.pauseIn} s={u("pauseIn")} o={[["SR","Sinus rhythm"],["AF","AF"]]}/></div>
 <div className="grid grid-cols-2 gap-2"><Num l="Pause threshold SR (s)" v={h.thrSR} s={u("thrSR")}/><Num l="Pause threshold AF (s)" v={h.thrAF} s={u("thrAF")}/></div>
 <Sel l="Pause mechanism" v={h.pauseCause} s={u("pauseCause")} o={[["unknown","Not assessed"],["sinus","No P wave (sinus arrest/SA block)"],["av","P waves, no QRS (AV block)"]]}/>
 <Chk l="Symptomatic" v={h.symp} s={u("symp")}/><Chk l="Nocturnal" v={h.night} s={u("night")}/>
 <Sel l="AV block" v={h.avb} s={u("avb")} o={[["none","None"],["1","First-degree"],["m1","Mobitz I"],["m2","Mobitz II"],["2to1","2:1"],["high","High-grade"],["3","Complete"]]}/>
 <Sel l="Ventricular tachycardia" v={h.vt} s={u("vt")} o={[["none","None"],["nsvt","Non-sustained (<30 s)"],["sustained","Sustained"]]}/>
 {h.vt==="nsvt"&&<div className="grid grid-cols-4 gap-2"><Num l="Runs" v={h.vtRuns} s={u("vtRuns")}/><Num l="Beats" v={h.vtBeats} s={u("vtBeats")}/><Num l="Rate" v={h.vtRate} s={u("vtRate")}/><Sel l="Type" v={h.vtMorph} s={u("vtMorph")} o={[["mono","Mono"],["poly","Poly"]]}/></div>}
 <Chk l="Ventricular fibrillation" v={h.vf} s={u("vf")}/>
 <div className="grid grid-cols-2 gap-2"><Num l="AF burden (%)" v={h.afBurden} s={u("afBurden")}/><Num l="Longest AF episode (min)" v={h.afLong} s={u("afLong")}/></div>
 <Chk l="SVT runs present" v={h.svt} s={u("svt")}/>
 {h.svt&&<div className="grid grid-cols-3 gap-2"><Num l="Runs" v={h.svtRuns} s={u("svtRuns")}/><Num l="Beats" v={h.svtBeats} s={u("svtBeats")}/><Num l="Rate" v={h.svtRate} s={u("svtRate")}/></div>}
 <Sel l="Aberrancy" v={h.aberr} s={u("aberr")} o={[["none","None"],["prior","Matches baseline BBB"],["rate","Rate-related BBB"]]}/>
 <div className="grid grid-cols-2 gap-2"><Num l="PVC burden (%)" v={h.pvc} s={u("pvc")}/><Num l="PAC burden (%)" v={h.pac} s={u("pac")}/></div></div>
 <div className="space-y-3">{w.map((x,i)=><div key={i} className={`card text-sm ${col[x.lvl]}`}><b>{x.lvl.toUpperCase()}:</b> {x.t}</div>)}
 <div className="card"><h3 className="font-semibold">Draft report</h3><pre className="whitespace-pre-wrap text-sm">{rep}</pre><button className="btn mt-2" onClick={()=>navigator.clipboard.writeText(rep)}>Copy report</button></div>
 <p className="text-xs">Pause defaults (2.5 s SR / 5 s AF) are your editable lab thresholds. Published sources use ≥2 s as the listing minimum and ≥3 s for pacing consideration (symptomatic). See References.</p></div></div>
}
function Learn(){const [a,setA]=useState<any>({});return <div className="space-y-4"><div className="grid md:grid-cols-2 gap-3">{LESSONS.map(l=><div key={l[0]} className="card"><h3 className="font-serif text-lg">{l[0]}</h3><p className="text-sm">{l[1]}</p></div>)}</div>
 <div className="card"><h2 className="font-serif text-xl mb-2">Self-test</h2>{QUIZ.map((q:any,i)=><div key={i} className="mb-3"><p className="font-medium text-sm">{q[0]}</p><div className="flex flex-wrap gap-2 mt-1">{q[1].map((o:string,j:number)=><button key={j} className={`btn ${a[i]===j?(j===q[2]?"bg-green-100 border-green-600":"bg-red-100 border-red-600"):""}`} onClick={()=>setA({...a,[i]:j})}>{o}</button>)}</div></div>)}</div></div>}
export default function Page(){
 const T=["ECG diagnosis","Holter report","Image library","Learning hub","Knowledge base","References"];const [t,setT]=useState(0);const [q,setQ]=useState("");
 return <main className="max-w-6xl mx-auto p-4"><h1 className="font-serif text-3xl">TachyHub</h1><p className="text-sm mb-3">Tachyarrhythmia diagnosis and Holter reporting for clinicians. Educational decision support.</p>
 <nav className="flex flex-wrap gap-2 mb-4">{T.map((x,i)=><button key={x} className={`btn ${t===i?"on":""}`} onClick={()=>setT(i)}>{x}</button>)}</nav>
 {t===0&&<Ecg/>}{t===1&&<Holter/>}{t===3&&<Learn/>}
 {t===2&&<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{IMG.map(i=><figure key={i[0]} className="card"><img src={`/ecg/${i[0]}.jpg`} alt={i[1]} className="w-full"/><figcaption className="text-sm mt-1">{i[1]}</figcaption></figure>)}</div>}
 {t===4&&<div><input placeholder="Search knowledge base" value={q} onChange={e=>setQ(e.target.value)} className="mb-3"/><div className="grid md:grid-cols-2 gap-3">{KB.filter(k=>(k.name+k.g+k.ecg+k.rx).toLowerCase().includes(q.toLowerCase())).map(k=><article key={k.id} className="card"><h3 className="font-serif text-lg">{k.name}</h3><p className="text-xs mb-1">{k.g}</p><p className="text-sm"><b>ECG:</b> {k.ecg}</p><p className="text-sm"><b>Management:</b> {k.rx}</p><img src={`/ecg/${k.img}.jpg`} alt={k.name} className="mt-2 w-full"/></article>)}</div></div>}
 {t===5&&<ol className="card list-decimal pl-8 space-y-2 text-sm">{REFS.map(r=><li key={r[0]}>{r[0]} {r[1].startsWith("http")?<a className="underline text-ecg break-all" href={r[1]}>{r[1]}</a>:<i>({r[1]})</i>}</li>)}</ol>}
 <footer className="text-xs mt-6">Management notes in the source deck predate current AF guidance (e.g. CHADS₂ → CHA₂DS₂-VASc). Verify against current guidelines.</footer></main>}
