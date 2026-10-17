export type Dx={name:string;score:number;why:string[];action:string};
export function diagnose(f:any):Dx[]{
 const m:Record<string,Dx>={};
 const add=(n:string,p:number,w:string,a:string)=>{if(!p)return;m[n]=m[n]||{name:n,score:0,why:[],action:a};m[n].score+=p;m[n].why.push(w)};
 const broad=f.qrs==="broad",reg=f.reg==="regular",r=+f.rate||0;
 if(!broad&&reg){
  if(f.p==="before"&&f.onset==="gradual"&&r<=170)add("Sinus tachycardia",5,"P before every QRS, gradual onset","Treat the cause (sepsis, pain, thyroid, drugs, hypovolaemia).");
  if(f.p==="before"&&f.onset==="abrupt"&&r>=100&&r<=150)add("Sinus node re-entry tachycardia",3,"Sinus-like P, abrupt onset, rate ~130-140","Beta blocker if symptomatic; ablation rarely needed.");
  add("AVNRT",(f.onset==="abrupt"?2:0)+(f.p==="retro"||f.p==="unclear"?2:0)+(f.rp==="short"?2:0)+(f.adeno==="terminates"?2:0)+(r>=140&&r<=250?1:0),"Abrupt, retrograde P hidden in/after QRS, short RP, adenosine-responsive (~60% of narrow regular SVT)","Vagal manoeuvres (Valsalva) → IV adenosine 6-18 mg rapid + flush → verapamil/beta blocker; ablation curative (~1% AV block risk).");
  add("Orthodromic AVRT (accessory pathway)",(f.onset==="abrupt"?2:0)+(f.rp==="long"?3:0)+(f.adeno==="terminates"?2:0)+(f.delta?3:0)+(f.p==="retro"?1:0),"Retrograde P midway between QRS (long RP) and/or delta wave in sinus rhythm","Vagal/adenosine; flecainide/propafenone if structurally normal; DCCV if unstable; refer EP for ablation (>95% success).");
  add("Atrial tachycardia (focal)",(f.p==="before"?1:0)+(f.rp==="long"?1:0)+(f.adeno==="reveals"||f.adeno==="noeffect"?2:0)+(f.onset==="gradual"?1:0),"P before QRS of different morphology; persists with AV block on adenosine","Rate control (BB/CCB/digoxin) or class IC/III; unifocal AT → ablation. Untreated can cause tachycardia cardiomyopathy.");
  add("Atrial flutter (typical)",(f.p==="saw"?4:0)+(r>=125&&r<=170?2:0)+(f.adeno==="reveals"?3:0),"Saw-tooth flutter waves (−ve inferior, +ve V1), ventricular rate ~150 (2:1), adenosine unmasks waves","Rate control + anticoagulation; offer cavotricuspid isthmus ablation (~95% cure); 1:1 conduction → urgent.");
 }
 if(!broad&&!reg){
  add("Atrial fibrillation",(f.p==="none"?5:0)+(f.adeno==="reveals"?0:0),"Irregularly irregular, no discrete P waves","Rate vs rhythm control; stroke-risk scoring & anticoagulation; if >48 h or unknown onset → anticoagulate / TOE before cardioversion.");
  add("Multifocal atrial tachycardia",(f.p==="varied"?5:0)+(f.copd?1:0),"≥3 P morphologies with variable PR (COPD/elderly)","Treat underlying lung disease/electrolytes; CCB or beta blocker as tolerated.");
  add("Atrial flutter with variable AV block",(f.p==="saw"?5:0),"Flutter waves with irregular conduction ratio","Rate control + anticoagulation; ablation.");
 }
 if(broad&&reg){
  const vt=2+(f.struct?2:0)+(f.p==="dissoc"?3:0)+(f.fusion?3:0)+(f.conc?2:0)+(+f.qrsMs>140?2:0)+(f.adeno==="noeffect"?1:0)-(f.priorBBB?3:0)-(f.adeno==="terminates"?2:0);
  add("Monomorphic ventricular tachycardia",Math.max(vt,1),"Default assumption in any broad regular tachycardia; features: structural heart disease, AV dissociation, fusion/capture beats, concordance, QRS >140 ms","Unstable → synchronised DCCV. Stable → IV amiodarone (lignocaine alternative). NEVER verapamil. ICD evaluation.");
  add("SVT with aberrant conduction",(f.priorBBB?4:0)+(f.adeno==="terminates"?3:0)+(!f.struct?1:0),"Same BBB pattern in prior sinus ECG / rate-related BBB / adenosine terminates","Treat as underlying SVT; diagnose by exclusion only.");
  add("Antidromic AVRT",(f.delta?4:0)+(f.adeno==="terminates"?2:0),"Delta wave in sinus rhythm; maximally pre-excited broad tachycardia","Adenosine may work; avoid AV-nodal blockers if AF suspected; flecainide/amiodarone; EP referral.");
  add("Atrial tachycardia conducted via accessory pathway",(f.delta?2:0)+(f.adeno==="noeffect"?2:0),"Pre-excitation, adenosine does not terminate","Treat as atrial tachycardia; EP referral.");
 }
 if(broad&&!reg){
  add("Pre-excited atrial fibrillation",(f.delta?4:0)+(r>200?2:0)+(f.p==="none"?1:0),"Chaotic broad irregular rhythm, rate may exceed 200, known pre-excitation","Unstable → DCCV. Stable (min RR >250 ms) → IV flecainide/procainamide/amiodarone. AVOID beta blockers, CCB, digoxin, adenosine. Urgent EP ablation.");
  add("Polymorphic VT / Torsades de pointes",(f.morph==="poly"?4:0)+(f.qt?3:0),"Varying QRS morphology (twisting axis), long QT/electrolyte/drug trigger","DCCV if unstable; correct K+/Mg2+, IV magnesium; stop QT-prolonging drugs; temporary pacing/isoprenaline if bradycardia-dependent.");
  add("AF with aberrant conduction",(f.priorBBB?3:0)+(f.p==="none"?2:0)+(!f.delta?1:0),"Irregular, BBB pattern also present in sinus rhythm","Manage as AF; exclude pre-excitation first.");
  add("Irregular / polymorphic VT",(f.struct?2:0)+(f.morph==="poly"?2:0)+1,"Structural disease or ischaemia","Treat as VT: DCCV if unstable, IV amiodarone, beta blocker, revascularise if ischaemic.");
 }
 const l=Object.values(m).sort((a,b)=>b.score-a.score);const t=l.reduce((s,x)=>s+x.score,0)||1;
 return l.slice(0,3).map(x=>({...x,score:Math.round(100*x.score/t)}));
}
export function alerts(f:any):string[]{
 const a:string[]=[];
 if(f.unstable)a.push("HAEMODYNAMIC COMPROMISE / chest pain / heart failure → immediate synchronised electrical cardioversion.");
 if(f.qrs==="broad")a.push("Broad-complex tachycardia = ventricular tachycardia until proven otherwise, even if well tolerated. Avoid verapamil.");
 if(f.qrs==="broad"&&f.delta)a.push("Pre-excitation + broad tachycardia: avoid AV-nodal blockers (BB, CCB, digoxin, adenosine if AF).");
 if(f.reg==="irregular"&&f.qrs==="narrow")a.push("AF/flutter >48 h or unknown onset: no cardioversion without adequate anticoagulation or TOE-excluded thrombus.");
 a.push("Check K+, Mg2+, Ca2+ and obtain a prior sinus-rhythm ECG. Refer all patients to a cardiologist/EP.");
 return a;
}
