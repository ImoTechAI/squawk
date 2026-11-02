// Fixed analogue PMR446 channel centres, 12.5 kHz spacing, UK/EU reference.
// Listing a channel is not permission to transmit with non-compliant equipment.
export const CHANNEL_DIRECTORY=Object.freeze(Array.from({length:16},(_,index)=>Object.freeze({
 id:'pmr446-'+(index+1),parent:'PMR446 analogue',name:'PMR446 channel '+(index+1),
 number:index+1,frequency:Number((446.00625+index*0.0125).toFixed(5)),
 mode:'NFM',note:'Receive-only reference. Licence-exempt transmission requires compliant PMR446 equipment.'
})));
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
 return {name:channel.name.slice(0,32),rx:channel.frequency.toFixed(5),tx:channel.frequency.toFixed(5),mode:channel.mode,notes:'PMR446 reference only. Receive-only; compliant equipment required for transmission.',receiveOnly:true};
}
