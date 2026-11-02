// Fixed analogue PMR446 channel centres, 12.5 kHz spacing, UK/EU reference.
// Listing a channel is not permission to transmit with non-compliant equipment.
const pmr=Array.from({length:16},(_,index)=>Object.freeze({
 id:'pmr446-'+(index+1),parent:'PMR446 analogue',name:'PMR446 channel '+(index+1),
 number:index+1,frequency:Number((446.00625+index*0.0125).toFixed(5)),
 mode:'NFM',note:'Receive-only reference. Licence-exempt transmission requires compliant PMR446 equipment.'
}));
const ukCb=Array.from({length:40},(_,index)=>({id:'uk-cb-'+(index+1),parent:'UK CB 27/81',name:'UK CB channel '+(index+1),number:index+1,frequency:Number((27.60125+index*.01).toFixed(5)),mode:'FM',note:'CB equipment required; not compatible with VHF/UHF handhelds.',importable:false}));
const ceptValues=[26.965,26.975,26.985,27.005,27.015,27.025,27.035,27.055,27.065,27.075,27.085,27.105,27.115,27.125,27.135,27.155,27.165,27.175,27.185,27.205,27.215,27.225,27.255,27.235,27.245,27.265,27.275,27.285,27.295,27.305,27.315,27.325,27.335,27.345,27.355,27.365,27.375,27.385,27.395,27.405];
const ceptCb=ceptValues.map((frequency,index)=>({id:'cept-cb-'+(index+1),parent:'CEPT CB',name:'CEPT CB channel '+(index+1),number:index+1,frequency,mode:'FM',note:'CB equipment required; not compatible with VHF/UHF handhelds.',importable:false}));
const amateur=[
 ['2 m amateur','2 m FM calling',145.5,'FM'],['2 m amateur','2 m FM simplex',145.525,'FM'],['2 m amateur','2 m FM simplex',145.55,'FM'],
 ['70 cm amateur','70 cm FM calling',433.5,'FM'],['70 cm amateur','70 cm FM simplex',433.525,'FM']
].map(([parent,name,frequency,mode],index)=>({id:'amateur-'+index,parent,name,number:index+1,frequency,mode,note:'Selected calling/simplex examples, not a full channel plan. Amateur licence required to transmit.',importable:true}));
const marineValues=[[6,156.3,'Intership safety'],[8,156.4,'Intership'],[9,156.45,'Working'],[10,156.5,'Working'],[11,156.55,'Port operations'],[12,156.6,'Port operations'],[13,156.65,'Navigation safety'],[14,156.7,'Port operations'],[16,156.8,'Distress, safety and calling'],[67,156.375,'UK Coastguard/safety'],[68,156.425,'Port operations'],[69,156.475,'Working'],[70,156.525,'DSC digital only'],[71,156.575,'Port operations'],[72,156.625,'Intership'],[73,156.675,'Working'],[74,156.725,'Port operations'],[77,156.875,'Intership']];
const marine=marineValues.map(([number,frequency,use])=>({id:'marine-'+number,parent:'Marine VHF',name:'Marine channel '+number,number,frequency,mode:number===70?'DSC':'FM',note:use+'. Marine transmission requires appropriate authorisation.',importable:number!==70}));
export const CHANNEL_DIRECTORY=Object.freeze([...pmr,...ukCb,...ceptCb,...amateur,...marine].map(channel=>Object.freeze(channel)));
export function channelsForRange(rangeName){return CHANNEL_DIRECTORY.filter(channel=>channel.parent===rangeName);}
export function findDirectoryChannels(query='',group='All',service='All',ranges=[]){
 const q=String(query).trim().toLowerCase(),n=q===''?NaN:Number(q);
 return CHANNEL_DIRECTORY.filter(channel=>{
  const parent=ranges.find(entry=>entry.name===channel.parent);
  if(!parent||(group!=='All'&&parent.group!==group)||(service!=='All'&&parent.service!==service))return false;
  return !q||[channel.name,channel.parent,channel.mode,String(channel.number)].some(value=>value.toLowerCase().includes(q))||(Number.isFinite(n)&&Math.abs(channel.frequency-n)<0.000005);
 });
}
export function directoryChannelCandidate(channel){
 if(!CHANNEL_DIRECTORY.some(entry=>entry.id===channel?.id&&entry.frequency===channel.frequency))throw Error('Unknown directory channel');
 if(channel.importable===false||!['FM','NFM'].includes(channel.mode))throw Error('Reference only: this channel cannot be imported into the handheld editor');
 return {name:channel.name.slice(0,32),rx:channel.frequency.toFixed(5),tx:channel.frequency.toFixed(5),mode:channel.mode,notes:channel.note+' Receive-only reference.',receiveOnly:true};
}
