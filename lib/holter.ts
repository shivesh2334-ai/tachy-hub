export type W={lvl:"critical"|"urgent"|"review"|"info";t:string};
export const D={base:"SR",minHR:"",avgHR:"",maxHR:"",pause:"",pauseIn:"SR",pauseCause:"unknown",symp:false,night:false,avb:"none",vt:"none",vtRuns:"",vtBeats:"",vtRate:"",vtMorph:"mono",vf:false,afBurden:"",afLong:"",svt:false,svtRuns:"",svtBeats:"",svtRate:"",aberr:"none",pvc:"",pac:"",thrSR:"2.5",thrAF:"5"};
const AV:any={none:"no AV block","1":"first-degree AV block",m1:"Mobitz I (Wenckebach) second-degree AV block",m2:"Mobitz II second-degree AV block","2to1":"2:1 AV block",high:"high-grade (advanced) AV block",["3"]:"complete (third-degree) AV block"};
export function holter(h:any){
 const w:W[]=[],n=(x:any)=>x===""||x==null?NaN:+x;
 const mn=n(h.minHR),av=n(h.avgHR),mx=n(h.maxHR),p=n(h.pause),thr=h.pauseIn==="AF"?n(h.thrAF)||5:n(h.thrSR)||2.5;
 if(mn>av||av>mx||mn>mx)w.push({lvl:"review",t:"Inconsistent rates: need min ≤ average ≤ max. Re-check entries."});
 if(mx>300||mn<15)w.push({lvl:"review",t:"Implausible heart rate – likely artefact; verify on raw ECG."});
 if(h.base==="AF"&&h.pauseIn==="SR"&&p>0)w.push({lvl:"info",t:"Baseline is AF: pause is judged against the AF threshold unless it followed conversion to sinus rhythm."});
 if(mn<40)w.push({lvl:"review",t:`Minimum HR ${mn} bpm (<40): correlate with sleep/symptoms; consider sinus node disease, drugs, athlete physiology.`});
 if(h.base==="SR"&&av<60)w.push({lvl:"info",t:"Average HR <60 in sinus rhythm (bradycardia pattern)."});
 if(mx>100&&h.base==="SR")w.push({lvl:"info",t:"Maximum sinus HR >100: sinus tachycardia episodes – compare with diary/activity."});
 if(h.base==="AF"&&av>=110)w.push({lvl:"urgent",t:`AF average ventricular rate ${av} bpm: rate control inadequate (lenient target <110 bpm, RACE II; stricter <80 at rest in older guidance).`});
 if(p>=thr){
  const long=p>=3;
  w.push({lvl:h.symp&&long?"urgent":"review",t:`Pause ${p} s exceeds your reporting threshold (${thr} s in ${h.pauseIn==="AF"?"AF":"sinus rhythm"}). ${h.pauseCause==="av"?"P waves present without QRS → AV block.":h.pauseCause==="sinus"?"No P wave → sinus arrest / SA exit block.":"Determine whether P waves are present (sinus arrest vs AV block)."} ${h.symp&&long?"Symptomatic pause ≥3 s: consider permanent pacing (2018 ACC/AHA/HRS; ESC 2021).":h.night&&!h.symp?"Asymptomatic nocturnal pause: usually vagal and not itself a pacing indication.":"Correlate with symptoms (syncope, dizziness)."} ${h.pauseIn==="AF"?"Also check for post-conversion pause at AF termination.":""}`});
 } else if(p>=2)w.push({lvl:"info",t:`Pause ${p} s is below your threshold but ≥2 s (lab minimum for pause listing); report in count only.`});
 if(h.avb==="m2"||h.avb==="high"||h.avb==="3")w.push({lvl:"urgent",t:`${AV[h.avb]}: infranodal-type block carries syncope/asystole risk – urgent cardiology review, pacing evaluation (2018 ACC/AHA/HRS).`});
 if(h.avb==="3"&&h.base==="AF")w.push({lvl:"info",t:"Regularised ventricular rhythm in AF = complete heart block with junctional/ventricular escape."});
 if(h.avb==="2to1")w.push({lvl:"review",t:"2:1 block cannot be typed as Mobitz I/II from RR alone: look at QRS width, PR, and behaviour with HR change."});
 if(h.avb==="m1"&&h.night)w.push({lvl:"info",t:"Nocturnal Mobitz I is common and benign in the absence of symptoms."});
 if(h.avb==="1")w.push({lvl:"info",t:"First-degree AV block alone: no action; note PR interval."});
 if(h.vf)w.push({lvl:"critical",t:"VF recorded: verify it is not artefact, notify the clinician immediately, urgent admission/ICD work-up."});
 if(h.vt==="sustained")w.push({lvl:"critical",t:"Sustained VT (≥30 s or haemodynamic compromise): notify immediately; admission, ICD/ablation evaluation."});
 if(h.vt==="nsvt"){const b=n(h.vtBeats),r=n(h.vtRate);w.push({lvl:h.vtMorph==="poly"||b>=10||r>=200?"urgent":"review",t:`NSVT (≥3 consecutive ventricular beats, <30 s): ${h.vtRuns||"?"} run(s), longest ${h.vtBeats||"?"} beats at ${h.vtRate||"?"} bpm, ${h.vtMorph==="poly"?"polymorphic (check QT, ischaemia, CPVT)":"monomorphic"}. Assess LVEF, ischaemia, electrolytes.`});}
 const ab=n(h.afBurden);
 if(ab>0||h.base==="AF"||h.base==="AFL")w.push({lvl:"review",t:`AF/flutter ${h.base==="AF"?"is the baseline rhythm":"burden "+h.afBurden+"%"}${h.afLong?`, longest episode ${h.afLong} min`:""}. Paroxysm is reported only if ≥30 s. Document CHA₂DS₂-VASc and anticoagulation status.`});
 if(h.svt)w.push({lvl:"review",t:`SVT: ${h.svtRuns||"?"} run(s), longest ${h.svtBeats||"?"} beats, rate up to ${h.svtRate||"?"} bpm. Report ≥3 consecutive supraventricular beats >100 bpm; abrupt onset/offset suggests re-entry; compare with symptoms.`});
 if(h.aberr!=="none")w.push({lvl:"review",t:`Aberrancy: ${h.aberr==="prior"?"wide beats match a BBB pattern present in sinus rhythm":"rate-related (tachycardia/bradycardia-dependent) bundle branch block"}. Wide-complex runs must still be checked against VT criteria (AV dissociation, fusion/capture, concordance, QRS >140 ms) before labelling as aberrancy.`});
 if(n(h.pvc)>=10)w.push({lvl:"urgent",t:`Ventricular ectopic burden ${h.pvc}% (≥10%): risk of PVC-induced cardiomyopathy – check LVEF, consider suppression/ablation.`});
 else if(n(h.pvc)>=1)w.push({lvl:"info",t:`Ventricular ectopic burden ${h.pvc}%.`});
 const rank={critical:0,urgent:1,review:2,info:3};w.sort((a,b)=>rank[a.lvl]-rank[b.lvl]);
 const rep=`HOLTER SUMMARY\nBaseline rhythm: ${h.base}. Heart rate: min ${h.minHR||"–"}, average ${h.avgHR||"–"}, maximum ${h.maxHR||"–"} bpm.\nPauses: ${p>=2?`longest ${p} s in ${h.pauseIn==="AF"?"AF":"sinus rhythm"}${h.symp?" (symptomatic)":""}`:"none ≥2 s"}.\nAV conduction: ${AV[h.avb]}.\nVentricular: ${h.vf?"VF recorded. ":""}${h.vt==="none"?"no VT":h.vt==="sustained"?"sustained VT":`NSVT ${h.vtRuns||"?"} run(s), longest ${h.vtBeats||"?"} beats`}; PVC burden ${h.pvc||"–"}%.\nSupraventricular: ${h.svt?`SVT ${h.svtRuns||"?"} run(s), longest ${h.svtBeats||"?"} beats`:"no SVT"}; AF burden ${h.base==="AF"?"persistent":h.afBurden||"0"}%; PAC burden ${h.pac||"–"}%.\nAberrancy: ${h.aberr==="none"?"none":h.aberr==="prior"?"present, matches baseline BBB":"rate-related"}.\nThis is a decision-support draft; final interpretation requires clinician review of raw ECG.`;
 return {w,rep};
}
