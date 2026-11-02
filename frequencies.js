// Curated UK-oriented reference ranges; not a live allocation database or permission to transmit.
export const FREQUENCIES=Object.freeze([
 {name:'UK CB 27/81',start:27.60125,end:27.99125,group:'HF',service:'CB',use:'UK 40-channel Citizens Band plan',mode:'FM',note:'Reference only. Licence-exempt transmission requires compliant CB equipment; not suitable for typical VHF/UHF handhelds.'},
 {name:'CEPT CB',start:26.965,end:27.405,group:'HF',service:'CB',use:'European 40-channel Citizens Band plan',mode:'FM',note:'Reference only. Licence-exempt transmission requires compliant CB equipment; not suitable for typical VHF/UHF handhelds.'},
 {name:'80 m amateur',start:3.5,end:3.8,group:'HF',service:'Amateur',use:'Amateur HF communications',mode:'Various',note:'Licence and band-plan conditions apply.'},
 {name:'40 m amateur',start:7,end:7.2,group:'HF',service:'Amateur',use:'Amateur HF communications',mode:'Various',note:'Licence and band-plan conditions apply.'},
 {name:'20 m amateur',start:14,end:14.35,group:'HF',service:'Amateur',use:'Long-distance amateur communications',mode:'Various',note:'Licence and band-plan conditions apply.'},
 {name:'10 m amateur',start:28,end:29.7,group:'HF',service:'Amateur',use:'Amateur HF communications',mode:'Various',note:'Licence and band-plan conditions apply.'},
 {name:'6 m amateur',start:50,end:52,group:'VHF',service:'Amateur',use:'Amateur communications',mode:'Various',note:'UK amateur licence and band-plan restrictions apply.'},
 {name:'FM broadcast',start:87.5,end:108,group:'VHF',service:'Broadcast',use:'Public FM broadcast reception',mode:'FM',note:'Broadcast reception reference; not a transmit allocation for users.'},
 {name:'Airband voice',start:118,end:136.975,group:'VHF',service:'Aviation',use:'Civil aviation voice communications',mode:'AM',note:'Receive-only reference. Aircraft and ground transmissions require specific authorisation.'},
 {name:'2 m amateur',start:144,end:146,group:'VHF',service:'Amateur',use:'Amateur VHF communications',mode:'FM / SSB / Digital',note:'Amateur licence and current band plan required; not all frequencies are FM.'},
 {name:'Marine VHF',start:156,end:162.025,group:'VHF',service:'Marine',use:'Maritime communications',mode:'FM',note:'Marine radio use requires relevant licensing and operating qualifications.'},
 {name:'70 cm amateur',start:430,end:440,group:'UHF',service:'Amateur',use:'Amateur UHF communications',mode:'FM / Digital / Other',note:'UK amateur licence and band-plan restrictions apply; sharing and local restrictions exist.'},
 {name:'PMR446 analogue',start:446.00625,end:446.19375,group:'UHF',service:'Licence-exempt',use:'Short-range handheld voice',mode:'NFM',note:'Only compliant PMR446 equipment qualifies for licence exemption. A programmable amateur handheld is not automatically compliant.'}
]);
export function findFrequencies(query='',group='All',service='All'){
 const q=String(query).trim().toLowerCase(),number=q===''?NaN:Number(q);
 return FREQUENCIES.filter(entry=>(group==='All'||entry.group===group)&&(service==='All'||entry.service===service)&&(!q||[entry.name,entry.service,entry.use,entry.mode].some(v=>v.toLowerCase().includes(q))||(Number.isFinite(number)&&number>=entry.start&&number<=entry.end)));
}
export function frequencyLabel(entry){return entry.start===entry.end?entry.start.toFixed(5)+' MHz':entry.start.toFixed(5)+'–'+entry.end.toFixed(5)+' MHz';}
export function receiveOnlyCandidate(entry,frequency){
 const n=Number(frequency);
 if(!Number.isFinite(n)||n<entry.start||n>entry.end||n<1||n>999.999999)throw Error('Frequency is outside this range or channel editor limits');
 if(!['FM','NFM'].includes(entry.mode))throw Error('This reference does not have a single supported FM/NFM channel mode');
 return {name:entry.name.slice(0,32),rx:n.toFixed(5),tx:n.toFixed(5),mode:entry.mode,notes:'Reference only: '+entry.service+'; check legal reception and equipment rules.',receiveOnly:true};
}
