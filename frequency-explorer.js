import {channelsForRange,findDirectoryChannels,directoryChannelCandidate} from './frequency-channels.js';
import {FREQUENCIES,findFrequencies,frequencyLabel,receiveOnlyCandidate} from './frequencies.js';
const root=document.getElementById('frequency-explorer');
if(!root)throw Error('Frequency Explorer mount missing');
root.innerHTML=`<div class="tool-intro"><span class="eyebrow">RADIO REFERENCE</span><h2>Frequency Explorer</h2><p>Search common UK radio bands and services. Reference information only — not a live frequency database, receiver or permission to transmit.</p></div>
<div class="tool-card"><div class="frequency-filters"><label>Search frequency (MHz) or name<input id="frequency-query" type="search" placeholder="e.g. 145.5, amateur, aviation"></label><label>Band<select id="frequency-band"><option>All</option><option>HF</option><option>VHF</option><option>UHF</option></select></label><label>Service<select id="frequency-service"><option>All</option><option>Amateur</option><option>Broadcast</option><option>Aviation</option><option>Marine</option><option>Licence-exempt</option><option>CB</option></select></label></div><p class="tool-muted" id="frequency-count" role="status"></p><div id="frequency-results" class="frequency-grid"></div></div>
<p class="tool-muted">Band boundaries are simplified UK-oriented references, not an exhaustive Ofcom allocation table. Frequency availability, licence privileges, equipment compliance and operating restrictions must be checked against current official sources. Copying a receive-only entry does not enable transmission.</p>`;
const $=id=>document.getElementById(id);
function render(){
 const queryText=$('frequency-query').value;
 const found=findFrequencies(queryText,$('frequency-band').value,$('frequency-service').value);
 const channelMatches=findDirectoryChannels(queryText,$('frequency-band').value,$('frequency-service').value,FREQUENCIES);
 for(const channel of channelMatches){
  const parent=FREQUENCIES.find(entry=>entry.name===channel.parent);
  if(parent&&!found.includes(parent))found.push(parent);
 }
 $('frequency-count').textContent=found.length+' of '+FREQUENCIES.length+' reference ranges · '+channelMatches.length+' matching individual channels';
 const results=$('frequency-results');results.replaceChildren();
 const query=$('frequency-query').value.trim();
 for(const entry of found){
  const card=document.createElement('article');card.className='frequency-card';
  const title=document.createElement('h3');title.textContent=entry.name;
  const range=document.createElement('strong');range.textContent=frequencyLabel(entry);
  const meta=document.createElement('p');meta.textContent=entry.group+' · '+entry.service+' · '+entry.mode;
  const use=document.createElement('p');use.textContent=entry.use;
  const note=document.createElement('p');note.className='tool-muted';note.textContent=entry.note;
  const actions=document.createElement('div');actions.className='actions';
  const copy=document.createElement('button');copy.type='button';copy.textContent='Copy start frequency';copy.onclick=async()=>{try{await navigator.clipboard.writeText(entry.start.toFixed(5));copy.textContent='Copied';}catch{copy.textContent='Copy unavailable';}};
  actions.append(copy);
  if(['FM','NFM'].includes(entry.mode)&&!['CB','Marine','Broadcast'].includes(entry.service)){
   const add=document.createElement('button');add.type='button';add.textContent='Add receive-only';
   add.onclick=()=>{
    try{
     const candidate=receiveOnlyCandidate(entry,entry.start);
     if(!confirm('Add '+candidate.rx+' MHz as receive-only reference channel? Verify frequency and equipment restrictions before use.'))return;
     document.dispatchEvent(new CustomEvent('squawk-add-receive-only-channel',{detail:candidate}));
    }catch(error){alert(error.message);}
   };
   actions.append(add);
  }
  card.append(title,range,meta,use,note,actions);
  const allChannels=channelsForRange(entry.name);
  const matchingChannels=findDirectoryChannels(query,$('frequency-band').value,$('frequency-service').value,FREQUENCIES).filter(channel=>channel.parent===entry.name);
  if(allChannels.length){
   const details=document.createElement('details');details.className='frequency-directory';
   if(query&&matchingChannels.length)details.open=true;
   const summary=document.createElement('summary');summary.textContent='View '+allChannels.length+' individual channels';
   details.append(summary);
   const channelList=document.createElement('div');channelList.className='frequency-channel-list';
   for(const channel of (query?matchingChannels:allChannels)){
    const row=document.createElement('div');row.className='frequency-channel-row';
    const name=document.createElement('strong');name.textContent='CH '+channel.number;
    const freq=document.createElement('span');freq.textContent=channel.frequency.toFixed(5)+' MHz';
    const copyChannel=document.createElement('button');copyChannel.type='button';copyChannel.textContent='Copy';
    copyChannel.setAttribute('aria-label','Copy '+channel.name+' frequency');
    copyChannel.onclick=async()=>{try{await navigator.clipboard.writeText(channel.frequency.toFixed(5));copyChannel.textContent='Copied';}catch{copyChannel.textContent='Unavailable';}};
    const addChannel=document.createElement('button');addChannel.type='button';addChannel.textContent='Add receive-only';
    addChannel.setAttribute('aria-label','Add '+channel.name+' as receive-only');
    addChannel.onclick=()=>{
     const candidate=directoryChannelCandidate(channel);
     if(!confirm('Add '+channel.name+' ('+candidate.rx+' MHz) as receive-only? Verify licence and equipment restrictions before use.'))return;
     document.dispatchEvent(new CustomEvent('squawk-add-receive-only-channel',{detail:candidate}));
    };
    row.append(name,freq,copyChannel);
    if(channel.importable!==false&&['FM','NFM'].includes(channel.mode))row.append(addChannel);
    const description=document.createElement('small');description.textContent=channel.note;description.className='frequency-channel-note';row.append(description);
    channelList.append(row);
   }
   if(!channelList.children.length){const none=document.createElement('p');none.textContent='No individual channels match this search.';channelList.append(none);}
   details.append(channelList);card.append(details);
  }
  results.append(card);
 }
 if(!found.length){const empty=document.createElement('p');empty.textContent='No matching reference ranges. Try another frequency or service.';results.append(empty);}
}
for(const id of ['frequency-query','frequency-band','frequency-service'])$(id).addEventListener('input',render);
render();
