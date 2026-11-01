import {ConnectionManager} from './connection.js';
import {normaliseChannel,parseCSV,toCSV,parseBackup} from './channels.js';
import {readProfiles,saveProfile,deleteProfile} from './profiles.js';
import {MODELS,readModel,channelKey,modelStorage,migrateLegacyChannels} from './models.js';
const $=id=>document.getElementById(id);migrateLegacyChannels(localStorage);let model=readModel(localStorage),key=channelKey(model),channels=[];
const profileStore=()=>modelStorage(localStorage,model);
function readChannels(){try{const saved=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(saved)?saved.slice(0,1000).map(normaliseChannel):[];}catch{return [];}}

channels=readChannels();
function persist(){localStorage.setItem(key,JSON.stringify(channels));$('count').textContent='('+channels.length+')';}
function render(){const body=$('channels');body.replaceChildren();channels.forEach((channel,index)=>{const row=document.createElement('tr'),number=document.createElement('td');number.textContent=String(index+1);row.append(number);for(const field of ['name','rx','tx','mode','notes']){const cell=document.createElement('td');const input=field==='mode'?document.createElement('select'):document.createElement('input');if(field==='mode'){for(const mode of ['FM','NFM']){const option=document.createElement('option');option.value=mode;option.textContent=mode;input.append(option);}}else{input.type='text';input.setAttribute('aria-label',field+' for channel '+(index+1));}input.value=channel[field];input.addEventListener('change',()=>{try{channels[index]=normaliseChannel({...channel,[field]:input.value});persist();render();}catch(e){alert(e.message);render();}});cell.append(input);row.append(cell);}const advanced=document.createElement('td'),toggle=document.createElement('button');toggle.textContent='Settings';toggle.setAttribute('aria-label','Advanced settings for channel '+(index+1));toggle.onclick=()=>{const detail=document.getElementById('advanced-'+index);detail.hidden=!detail.hidden;};advanced.append(toggle);row.append(advanced);const cell=document.createElement('td'),remove=document.createElement('button');remove.textContent='Delete';remove.setAttribute('aria-label','Delete channel '+(index+1));remove.onclick=()=>{channels.splice(index,1);persist();render();};cell.append(remove);row.append(cell);body.append(row);const details=document.createElement('tr');details.id='advanced-'+index;details.hidden=true;const panel=document.createElement('td');panel.colSpan=8;const grid=document.createElement('div');grid.className='advanced-grid';const fields=[['power','Power',['Default','Low','Medium','High']],['tone','Tone',['None','CTCSS','DCS']],['toneValue','Tone value'],['direction','Repeater',['Simplex','Plus','Minus']],['offset','Offset MHz'],['scan','Include in scan'],['receiveOnly','Receive only']];for(const [field,label,options] of fields){const wrap=document.createElement('label');wrap.textContent=label+' ';const input=options?document.createElement('select'):document.createElement('input');if(options){for(const value of options){const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option);}}else input.type=['scan','receiveOnly'].includes(field)?'checkbox':'text';if(input.type==='checkbox')input.checked=channel[field];else input.value=channel[field];input.addEventListener('change',()=>{try{const value=input.type==='checkbox'?input.checked:input.value;channels[index]=normaliseChannel({...channels[index],[field]:value});persist();render();document.getElementById('advanced-'+index).hidden=false;}catch(e){alert(e.message);}});wrap.append(input);grid.append(wrap);}panel.append(grid);details.append(panel);body.append(details);});persist();}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('add').onclick=()=>{if(channels.length>=1000)return alert('Maximum 1000 channels');channels.push(normaliseChannel({name:'NEW',rx:'145.500',tx:'145.500',mode:'FM',notes:''}));render();};
$('export').onclick=()=>download('squawk-channels.csv',toCSV(channels),'text/csv');
$('backup').onclick=()=>download('squawk-backup.json',JSON.stringify({format:'squawk-channels-v1',channels},null,2),'application/json');
let importType='csv';$('import').onclick=()=>{importType='csv';$('file').accept='.csv';$('file').click();};$('restore').onclick=()=>{importType='json';$('file').accept='.json';$('file').click();};
$('file').onchange=async event=>{const file=event.target.files?.[0];if(!file)return;try{const incoming=importType==='csv'?parseCSV(await file.text()):parseBackup(await file.text());if(incoming.length>1000)throw Error('Maximum 1000 channels');if(confirm('Replace the current channel list with '+incoming.length+' imported channels?')){channels=incoming;render();}}catch(e){alert('Import failed: '+e.message);}event.target.value='';};
const diagnostics=$('diagnostic-log');
function addDiagnostic(message){
  const entry=document.createElement('li');
  entry.textContent=new Date().toLocaleTimeString()+' — '+message;
  diagnostics.prepend(entry);
  while(diagnostics.children.length>30)diagnostics.lastElementChild.remove();
}
const connectionManager=new ConnectionManager({
  serial:navigator.serial??null,
  onChange:({state,mode,info,baudRate})=>{
    const busy=state==='connecting'||state==='disconnecting';
    $('connect').disabled=busy||state==='connected';
    $('simulate').disabled=busy||state==='connected';
    $('disconnect').disabled=busy||state==='disconnected';
    $('connection-state').textContent=state==='connected'?(mode==='simulation'?'Simulator connected':'USB port connected'):state;
    $('connection').textContent=state==='connected'
      ?(mode==='simulation'?'Simulation only — no hardware connected.':'Serial transport open. Radio identity and programming protocol are unverified.')
      :'No radio connection. Hardware programming is not supported.';
    $('device-mode').textContent=mode==='usb'?'USB serial':mode==='simulation'?'Simulation':'None';
    $('device-vendor').textContent=mode==='usb'?info.vendorId:'Unavailable';
    $('device-product').textContent=mode==='usb'?info.productId:'Unavailable';
    $('device-baud').textContent=baudRate===null?'Unavailable':String(baudRate);
  },
  onLog:addDiagnostic
});
$('connect').onclick=async()=>{try{await connectionManager.connectUSB();}catch(e){alert('Connection failed: '+e.message);}};
$('simulate').onclick=()=>{try{connectionManager.connectSimulator();}catch(e){alert(e.message);}};
$('disconnect').onclick=async()=>{try{await connectionManager.disconnect();}catch(e){alert('Disconnect failed: '+e.message);}};
connectionManager.setState('disconnected');
addDiagnostic('Diagnostics ready. No radio read/write commands are available.');


function refreshProfiles(){
  const select=$('profiles'),previous=select.value;
  select.replaceChildren();
  const placeholder=document.createElement('option');
  placeholder.value='';
  placeholder.textContent='Select saved profile';
  select.append(placeholder);
  for(const name of Object.keys(readProfiles(profileStore())).sort()){
    const option=document.createElement('option');
    option.value=name;
    option.textContent=name;
    select.append(option);
  }
  if([...select.options].some(option=>option.value===previous))select.value=previous;
}
$('save-profile').onclick=()=>{
  const name=prompt('Profile name (up to 50 characters):',$('profiles').value||'');
  if(name===null)return;
  try{
    const key=name.trim(),existing=readProfiles(profileStore());
    if(Object.hasOwn(existing,key)&&!confirm('Overwrite saved profile "'+key+'"?'))return;
    saveProfile(profileStore(),key,channels);
    refreshProfiles();
    $('profiles').value=key;
  }catch(e){alert(e.message);}
};
$('load-profile').onclick=()=>{
  const name=$('profiles').value;
  if(!name)return alert('Select a saved profile');
  const saved=readProfiles(profileStore())[name];
  if(!saved)return alert('Profile unavailable');
  if(confirm('Replace current channels with profile "'+name+'"?')){channels=saved;render();}
};
$('delete-profile').onclick=()=>{
  const name=$('profiles').value;
  if(!name)return alert('Select a saved profile');
  if(confirm('Delete saved profile "'+name+'"?')){
    deleteProfile(profileStore(),name);
    refreshProfiles();
  }
};

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
  // Model selection changes the workspace, not the physical USB connection.
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
