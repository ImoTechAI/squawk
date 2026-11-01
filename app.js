import {normaliseChannel,parseCSV,toCSV,parseBackup} from './channels.js';
import {readProfiles,saveProfile,deleteProfile} from './profiles.js';
import {MODELS,readModel,channelKey,modelStorage,migrateLegacyChannels} from './models.js';
const $=id=>document.getElementById(id);migrateLegacyChannels(localStorage);let model=readModel(localStorage),key=channelKey(model),channels=[];
const profileStore=()=>modelStorage(localStorage,model);
function readChannels(){try{const saved=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(saved)?saved.slice(0,1000).map(normaliseChannel):[];}catch{return [];}}

channels=readChannels();
function persist(){localStorage.setItem(key,JSON.stringify(channels));$('count').textContent='('+channels.length+')';}
function render(){const body=$('channels');body.replaceChildren();channels.forEach((channel,index)=>{const row=document.createElement('tr'),number=document.createElement('td');number.textContent=String(index+1);row.append(number);for(const field of ['name','rx','tx','mode','notes']){const cell=document.createElement('td');const input=field==='mode'?document.createElement('select'):document.createElement('input');if(field==='mode'){for(const mode of ['FM','NFM']){const option=document.createElement('option');option.value=mode;option.textContent=mode;input.append(option);}}else{input.type='text';input.setAttribute('aria-label',field+' for channel '+(index+1));}input.value=channel[field];input.addEventListener('change',()=>{try{channels[index]=normaliseChannel({...channel,[field]:input.value});persist();render();}catch(e){alert(e.message);render();}});cell.append(input);row.append(cell);}const cell=document.createElement('td'),remove=document.createElement('button');remove.textContent='Delete';remove.setAttribute('aria-label','Delete channel '+(index+1));remove.onclick=()=>{channels.splice(index,1);persist();render();};cell.append(remove);row.append(cell);body.append(row);});persist();}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('add').onclick=()=>{if(channels.length>=1000)return alert('Maximum 1000 channels');channels.push({name:'NEW',rx:'145.500',tx:'145.500',mode:'FM',notes:''});render();};
$('export').onclick=()=>download('squawk-channels.csv',toCSV(channels),'text/csv');
$('backup').onclick=()=>download('squawk-backup.json',JSON.stringify({format:'squawk-channels-v1',channels},null,2),'application/json');
let importType='csv';$('import').onclick=()=>{importType='csv';$('file').accept='.csv';$('file').click();};$('restore').onclick=()=>{importType='json';$('file').accept='.json';$('file').click();};
$('file').onchange=async event=>{const file=event.target.files?.[0];if(!file)return;try{const incoming=importType==='csv'?parseCSV(await file.text()):parseBackup(await file.text());if(incoming.length>1000)throw Error('Maximum 1000 channels');if(confirm('Replace the current channel list with '+incoming.length+' imported channels?')){channels=incoming;render();}}catch(e){alert('Import failed: '+e.message);}event.target.value='';};
$('connect').onclick=async()=>{if(!('serial' in navigator)){alert('Web Serial is unavailable. Use a supported desktop Chromium browser on HTTPS or localhost.');return;}try{const port=await navigator.serial.requestPort();$('connection').textContent='USB port selected. No radio handshake or read/write capability is implemented yet.';await port.close().catch(()=>{});}catch(e){if(e.name!=='NotFoundError')alert('Port selection failed: '+e.message);}};

const selector=$('radio-model');
for(const item of MODELS){
  const option=document.createElement('option');
  option.value=item.id;
  option.textContent=item.name;
  selector.append(option);
}
selector.value=model;
function displayModel(){
  const selected=MODELS.find(item=>item.id===model);
  $('model-name').textContent=selected.name;
  $('programming-model').textContent=selected.name;
  $('connection').textContent='No serial connection. Hardware programming is not yet supported.';
}
selector.addEventListener('change',()=>{
  model=selector.value;
  localStorage.setItem('squawk-selected-model-v1',model);
  key=channelKey(model);
  channels=readChannels();
  displayModel();
  refreshProfiles();
  $('profiles').value='';
  render();
});
displayModel();
refreshProfiles();
render();
