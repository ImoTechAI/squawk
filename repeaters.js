// Local search of a user-supplied UK repeater CSV. No background collection or API key.
function csvRows(text){
  const rows=[];let row=[],value='',quoted=false;
  text=String(text).replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){
    const char=text[i];
    if(char==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
    else if(char===','&&!quoted){row.push(value.trim());value='';}
    else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(value.trim());if(row.some(Boolean))rows.push(row);row=[];value='';}
    else value+=char;
  }
  if(quoted)throw Error('Unclosed CSV quote');
  row.push(value.trim());if(row.some(Boolean))rows.push(row);
  return rows;
}
const clean=s=>String(s??'').toLowerCase().replace(/[^a-z0-9]/g,'');
function field(row,headers,names){for(const name of names){const i=headers.indexOf(clean(name));if(i>=0)return row[i]??'';}return '';}
function mhz(value){const match=String(value??'').match(/\d{2,3}(?:\.\d+)?/);const n=match?Number(match[0]):NaN;return Number.isFinite(n)&&n>=30&&n<=999?n:null;}
function toneValue(value){const m=String(value??'').match(/\d{2,3}(?:\.\d+)?/);const n=m?Number(m[0]):NaN;return Number.isFinite(n)&&n>=60&&n<=260?String(n):'';}
export function parseRepeaterCSV(text){
  const rows=csvRows(text);if(!rows.length)throw Error('CSV is empty');
  const headers=rows.shift().map(clean);
  if(!headers.some(h=>['callsign','call','repeater','rptcallsign'].includes(h)))throw Error('CSV must include a Callsign column');
  if(!headers.some(h=>['output','outputfreq','outputfrequency','txmhz','frequency','freq','rxfrequency','rxfreq','downlink'].includes(h)))throw Error('CSV must include an Output/Frequency column');
  const results=[];
  for(const row of rows.slice(0,10000)){
    const callsign=field(row,headers,['callsign','call','repeater','rptcallsign']).trim();
    const output=mhz(field(row,headers,['output','output freq','output frequency','tx mhz','frequency','freq','rx frequency','rx freq','downlink']));
    const input=mhz(field(row,headers,['input','input freq','input frequency','rx mhz','tx frequency','tx freq','uplink']));
    const rawOffset=field(row,headers,['offset','shift']);
    const signedOffset=Number(String(rawOffset).replace(/[^0-9+.-]/g,''));
    const tx=input??(output!==null&&rawOffset.trim()!==''&&Number.isFinite(signedOffset)?output+signedOffset:null);
    const mode=field(row,headers,['mode','modes','type','system type']);
    const location=field(row,headers,['location','town','city','site','area','county','qth']);
    const status=field(row,headers,['status','operational status']);
    const tone=toneValue(field(row,headers,['ctcss','ctcss hz','tone','access tone','pl']));
    if(!callsign||output===null)continue;
    const analog=/\banalog(?:ue)?\b|\bfm\b/i.test(mode)||mode.trim()==='';
    results.push({callsign,rx:output,tx:tx!==null&&tx>=30&&tx<=999?tx:null,location,mode:mode||'Not specified',status,tone,analog});
  }
  if(!results.length)throw Error('No repeater records found. Check the CSV headings and frequency values.');
  return results;
}
export function searchRepeaters(rows,query='',band='all'){
  const q=query.trim().toLowerCase();
  return rows.filter(r=>(!q||[r.callsign,r.location,r.mode,r.status,String(r.rx)].some(v=>String(v).toLowerCase().includes(q)))&&(band==='all'||(band==='2m'&&r.rx>=144&&r.rx<148)||(band==='70cm'&&r.rx>=430&&r.rx<440)));
}
export function repeaterChannel(r){
  if(!r.analog)throw Error('Digital-only repeaters cannot be imported as analogue FM channels');
  if(r.tx===null)throw Error('Repeater input frequency missing; verify it before importing');
  const offset=Math.abs(r.tx-r.rx);
  return {name:r.callsign.slice(0,32),rx:r.rx.toFixed(5),tx:r.tx.toFixed(5),mode:'FM',notes:['UK repeater',r.location,r.status].filter(Boolean).join(' · ').slice(0,200),tone:r.tone?'CTCSS':'None',toneValue:r.tone,offset:offset.toFixed(5),direction:offset<0.000001?'Simplex':r.tx>r.rx?'Plus':'Minus',receiveOnly:true};
}
