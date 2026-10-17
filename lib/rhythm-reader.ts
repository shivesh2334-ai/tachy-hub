export const rhythmExamples = [
  'In a 12 lead ECG tracing, P is absent with atrial ectopics. What is the rhythm?',
  'In Holter tracing baseline ECG is normal sinus rhythm. There is a run of 12 beats of wide QRS beats at HR of 60 bpm, REGULAR. The rhythm before and after is normal sinus.'
];
export type RhythmReading = { title: string; explanation: string; points: string[]; differentials: string[]; missing: string[]; urgent: boolean };
export const rhythmSources = [
  {title:'ECG Diagnosis: Accelerated Idioventricular Rhythm',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5882183/'},
  {title:'Clinical characteristics of frequent AIVR',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8427942/'},
  {title:'2023 ACC/AHA/ACCP/HRS atrial fibrillation guideline',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC11104284/'}
];
// Deliberately bounded description parser: unrecognized findings remain unknown.
// This module interprets text, not ECG waveforms, and never supplies probabilities.
export function readRhythm(input: string): RhythmReading {
  const t=input.toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
  const positive=t.replace(/\b(?:no|not|without|denies)\s+(?:\w+\s+){0,2}(?:syncope|hypotension|chest pain|unstable|hemodynamic compromise|haemodynamic compromise)\b/g,'');
  const urgent=/\b(syncope|hypotension|chest pain|unstable|haemodynamic compromise|hemodynamic compromise)\b/.test(positive);
  const irregular=/\birregular(?:ly)?\b/.test(t);
  const regular=/\bregular\b/.test(t)&&!irregular&&!/\bnot regular\b/.test(t);
  const wide=/\b(wide|broad)[ -]+(?:qrs|complex)/.test(t)&&!/\b(?:no|not) (?:wide|broad)/.test(t);
  const absent=/\b(?:p(?:[ -]?waves?)?)\s+(?:is |are )?(?:absent|not (?:seen|visible)|missing)\b|\b(?:absent|no) p(?:[ -]?waves?)?\b/.test(t);
  const present=/\bp(?:[ -]?waves?)?\s+(?:is |are )?(?:present|visible)\b/.test(t);
  const rates=[...t.matchAll(/\b(?:hr|heart rate|rate)\s*(?:of|is|at|=|:)?\s*(\d+(?:\.\d+)?)\s*(?:bpm|beats?\/?min(?:ute)?)?\b/g)].map(m=>+m[1]);
  if(!rates.length) rates.push(...[...t.matchAll(/\b(\d+(?:\.\d+)?)\s*bpm\b/g)].map(m=>+m[1]));
  const rate=rates.length===1?rates[0]:undefined;
  const beats=+(t.match(/\b(?:run of\s+)?(\d+)\s+(?:consecutive\s+)?beats?\b/)?.[1]||0);
  const missing:string[]=[];
  if(!regular&&!irregular) missing.push('Is the ventricular rhythm regular or irregularly irregular?');
  if(rate===undefined) missing.push(rates.length>1?'Specify the rate of the abnormal run separately from the baseline rate.':'What is the ventricular rate (bpm)?');
  const result:RhythmReading={title:'Insufficient information to identify the rhythm',explanation:'Provide the abnormal segment’s QRS width, rate, regularity, P-wave activity and relation to QRS complexes. This rule-based reader supports absent-P-wave patterns and regular wide-QRS runs.',points:[],differentials:[],missing,urgent};
  if(absent&&present){result.explanation='The description says P waves are both present and absent. Clarify which finding belongs to the abnormal segment.';return result;}
  if(wide&&regular&&rate!==undefined&&rate>=50&&rate<=110&&beats>=3){
    result.title='Likely accelerated idioventricular rhythm (AIVR), conditional on ventricular origin';
    result.explanation=`A regular ${beats}-beat wide-QRS run at ${rate} bpm is compatible with AIVR, assuming its morphology differs from the narrow sinus QRS and ventricular origin is confirmed. Sinus rhythm before and after supports a transient episode but does not prove AIVR.`;
    result.points=['Rate: commonly 50–110 bpm; rate ranges overlap with slow VT, so rate alone is insufficient.','Mechanism: enhanced ventricular/Purkinje automaticity or an ectopic ventricular focus overtaking the sinus rate.','Often transient and well tolerated; significance depends on symptoms, ischaemia/reperfusion, medication or electrolyte effects, structural disease and burden.'];
    result.differentials=['Sinus or atrial rhythm with bundle branch block: look for P waves consistently conducting to the wide QRS.','Junctional rhythm with aberrancy: assess retrograde P waves and QRS morphology.','Slow VT or ventricular escape rhythm: review onset, rate trend, AV dissociation and clinical context.'];
    result.missing.push('Compare abnormal and sinus QRS morphology; inspect AV dissociation, capture/fusion beats and onset/termination.');return result;
  }
  if(wide){result.title='Wide-QRS rhythm: further characterization required';result.explanation=rate!==undefined&&rate>110?'Ventricular tachycardia is an important possibility. A wide-complex rhythm cannot be identified from rate alone.':'Do not label this VT or AIVR from QRS width alone. Confirm the abnormal segment’s regularity, rate and ventricular origin.';result.missing.push('Document consecutive beat count, duration, P–QRS relationship, morphology and symptoms.');return result;}
  if(absent){
    result.title=irregular?'Atrial fibrillation is likely if the rhythm is irregularly irregular':regular?'Consider a junctional rhythm; absent P waves alone do not establish AF':'Atrial fibrillation is possible; regularity must be confirmed';
    result.explanation=irregular?'Absent discrete P waves with an irregularly irregular ventricular rhythm supports AF. Confirm visually on the tracing and exclude artefact.':'Absent P waves with “atrial ectopics” is insufficient to diagnose AF. True atrial ectopic beats usually have premature P waves, sometimes buried in a preceding T wave. Clarify whether “ectopics” means premature atrial beats or fibrillatory activity.';
    result.points=['AF: no discrete repeating P waves and typically irregularly irregular RR intervals.','Regular rhythms with hidden or retrograde P waves can be junctional; rapid regular rhythms may be AVNRT/AVRT.'];
    result.differentials=['Atrial flutter: organized flutter (F) waves, often sawtooth; ventricular response may be regular or irregular.','Multifocal atrial tachycardia: at least three distinct P-wave morphologies, irregular rhythm and rate over 100 bpm; P waves are present.','Junctional rhythm: absent or retrograde P waves, usually with a regular ventricular rhythm.','Sinus rhythm with premature atrial complexes or artefact: inspect premature P waves and the underlying sinus rhythm.'];
    result.missing.push('Confirm QRS width, a clean multi-lead tracing, and whether premature P waves or fibrillatory waves are present.');return result;
  }
  result.missing.push('Describe P waves in the abnormal segment, not only the baseline rhythm.');return result;
}
