// Static, offline-ready educational material; not legal advice or a transmitting licence.
export const LESSONS=Object.freeze([
 {id:'basics',title:'Radio Basics',summary:'HF, VHF, UHF, simplex and repeaters',sections:[
  ['Frequency bands','HF generally travels farther via ionospheric propagation under suitable conditions. VHF and UHF are commonly used for local line-of-sight communications. Terrain, buildings and antennas matter.'],
  ['Simplex and repeaters','Simplex is direct radio-to-radio communication. A repeater receives on one frequency and retransmits on another; offset and access tones must match the repeater configuration.'],
  ['Channels','A memory channel stores settings such as receive frequency, optional transmit frequency, bandwidth and tones. A stored frequency is not permission to transmit.']]},
 {id:'controls',title:'Using Your Radio',summary:'Squelch, scan, tones and bandwidth',sections:[
  ['Squelch','Squelch mutes background noise until a signal meets the configured threshold. Too much squelch can hide weak transmissions.'],
  ['CTCSS and DCS','These are access or selective-squelch tones/codes, not encryption. They do not make a frequency private.'],
  ['FM and NFM','Wide and narrow FM settings affect occupied bandwidth and audio. Match the authorised channel plan and radio capabilities.'],
  ['Scanning','Scanning checks stored channels in sequence. A programming cable alone does not provide a live spectrum analyser or guarantee scanning access.']]},
 {id:'rules',title:'UK Radio Rules',summary:'Licences, equipment compliance and receive-only',sections:[
  ['Amateur radio','Transmitting on amateur bands requires the appropriate UK amateur radio licence and compliance with its conditions and the applicable band plan.'],
  ['PMR446','Licence-exempt PMR446 operation requires compliant PMR446 equipment. A general programmable amateur handheld is not automatically compliant.'],
  ['Marine, aviation and business','These services have their own licensing, operator and equipment requirements. Listening rules and privacy restrictions also apply. Never transmit on safety or distress channels without proper authorisation.'],
  ['Receive-only references','SQUAWK reference channels do not authorise transmitting. Its hardware Read/Write functions remain disabled until the actual radio protocol is verified.']]}
]);
export const QUESTIONS=Object.freeze([
 {id:'q1',lesson:'basics',prompt:'What does simplex mean?',choices:['Direct radio-to-radio communication','Communication through a repeater','Encrypted communication'],answer:0,explanation:'Simplex is direct communication between radios without a repeater.'},
 {id:'q2',lesson:'basics',prompt:'What does a repeater normally do?',choices:['Convert all signals to digital','Receive and retransmit a signal','Guarantee global coverage'],answer:1,explanation:'Repeaters receive on an input frequency and retransmit on an output frequency.'},
 {id:'q3',lesson:'controls',prompt:'What can excessive squelch do?',choices:['Increase range','Hide weak signals','Change the transmit licence'],answer:1,explanation:'High squelch thresholds can prevent weak signals from opening the speaker.'},
 {id:'q4',lesson:'controls',prompt:'Does a CTCSS tone encrypt speech?',choices:['Yes','Only on UHF','No'],answer:2,explanation:'CTCSS is selective squelch, not encryption.'},
 {id:'q5',lesson:'rules',prompt:'Does saving a frequency in SQUAWK grant permission to transmit?',choices:['Yes','No','Only if it is UHF'],answer:1,explanation:'Authorisation depends on licensing, service rules and compliant equipment.'},
 {id:'q6',lesson:'rules',prompt:'Is a general programmable handheld automatically licence-exempt on PMR446?',choices:['Yes','No','Only with a headset'],answer:1,explanation:'PMR446 licence exemption requires compliant equipment, not merely the correct frequency.'}
]);
export function gradeAnswers(answers){
 let correct=0;const results=QUESTIONS.map(q=>{const choice=answers?.[q.id];const valid=Number.isInteger(choice)&&choice>=0&&choice<q.choices.length;const right=valid&&choice===q.answer;if(right)correct++;return {id:q.id,answered:valid,correct:right,explanation:q.explanation};});
 return {correct,total:QUESTIONS.length,complete:results.every(r=>r.answered),results};
}
