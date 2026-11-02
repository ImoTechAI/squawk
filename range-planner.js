import {parseBuildings,assessBuildings,overpassQuery} from './building-los.js';
import {validatePoint,interpolate,terrainProfile,distanceKm} from './radio-math.js';
const $=id=>document.getElementById(id);
const root=$('range-planner');if(!root)throw Error('Range planner workspace missing');
root.innerHTML=`<div class="tool-intro"><span class="eyebrow">TERRAIN & LINE OF SIGHT</span><h2>Radio Range Planner</h2><p>Choose two map points or enter coordinates. Elevation is retrieved from Open-Meteo. For local routes, basic building estimates use OpenStreetMap. Results are estimates, not guaranteed radio coverage.</p></div>
<div class="range-layout"><div class="tool-card"><h3>Locations & antennas</h3><p class="tool-muted">Click the map to set point A, then B. Further clicks replace A and B in turn.</p><div class="tool-form">
<label>Point A latitude<input id="range-a-lat" type="number" step="any" min="-90" max="90" placeholder="Latitude"></label><label>Point A longitude<input id="range-a-lon" type="number" step="any" min="-180" max="180" placeholder="Longitude"></label>
<label>Point B latitude<input id="range-b-lat" type="number" step="any" min="-90" max="90" placeholder="Latitude"></label><label>Point B longitude<input id="range-b-lon" type="number" step="any" min="-180" max="180" placeholder="Longitude"></label>
<label>A antenna above ground (m)<input id="range-height-a" type="number" min="0" step="0.5" value="2"></label><label>B antenna above ground (m)<input id="range-height-b" type="number" min="0" step="0.5" value="2"></label>
<label>Frequency (MHz)<input id="range-frequency" type="number" min="0.01" step="any" value="145.5"></label>
</div><div class="actions"><button id="range-calculate" type="button">Calculate terrain path</button><button id="range-reset" type="button">Clear points</button></div><p class="tool-muted" id="range-status" role="status">Select two locations to begin.</p></div>
<div class="tool-card"><h3>Map</h3><div id="range-map" class="range-map" aria-label="Interactive map for selecting two points"></div><p class="tool-muted">Map tiles: OpenStreetMap contributors. Map requires internet access. Coordinates can be entered manually if the map is unavailable.</p></div></div>
<div id="range-results" class="tool-card" hidden aria-live="polite"><h3>Terrain path analysis</h3><div id="range-summary" class="range-summary"></div><div id="range-explanation" class="range-explanation" role="status"></div><div id="range-buildings" class="range-explanation" role="status"></div><div id="range-profile" class="range-profile"></div><p class="tool-muted">Terrain elevations: Open-Meteo elevation API (sampled). Uses an effective Earth-radius factor of 4/3, straight interpolated path and 60% of the first Fresnel zone. Elevation samples and refraction assumptions may miss obstacles, buildings and local terrain; vegetation, interference and radio performance are not modelled. Do not use for safety-critical coverage decisions.</p></div>`;
let map=null,markers=[],line=null,buildingLayer=null,next=0;
const ids=['range-a-lat','range-a-lon','range-b-lat','range-b-lon'];
function setPoint(lat,lon){const offset=next===0?0:2;$(ids[offset]).value=lat.toFixed(6);$(ids[offset+1]).value=lon.toFixed(6);next=1-next;updateMarkers();}
function coordinates(){const values=ids.map(id=>$(id).value.trim());if(values.some(value=>value===''))throw Error('Enter both latitude and longitude for points A and B');return [{lat:Number(values[0]),lon:Number(values[1])},{lat:Number(values[2]),lon:Number(values[3])}].map(validatePoint);}
function updateMarkers(){if(!map)return;markers.forEach(marker=>marker.remove());markers=[];if(line){line.remove();line=null;}if(buildingLayer){buildingLayer.remove();buildingLayer=null;}const pts=[];for(let i=0;i<2;i++){const lat=$(ids[i*2]).value,lon=$(ids[i*2+1]).value;if(lat!==''&&lon!==''){try{const p=validatePoint({lat:Number(lat),lon:Number(lon)});pts.push([p.lat,p.lon]);markers.push(L.marker([p.lat,p.lon]).addTo(map).bindPopup('Point '+(i?'B':'A')));}catch{}}}if(pts.length===2)line=L.polyline(pts,{color:'#e4bf73',weight:3}).addTo(map);}
function initMap(){if(typeof L==='undefined'){$('range-map').textContent='Map library unavailable. Enter coordinates manually.';return;}map=L.map('range-map').setView([20,0],2);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);map.on('click',event=>setPoint(event.latlng.lat,event.latlng.lng));}
initMap();
const mapElement=$('range-map');
function resizeMap(){if(!map||mapElement.offsetWidth===0||mapElement.offsetHeight===0)return;requestAnimationFrame(()=>requestAnimationFrame(()=>map.invalidateSize({pan:false})));}
mapElement.addEventListener('squawk-map-visible',resizeMap);
if(typeof ResizeObserver!=='undefined'){new ResizeObserver(resizeMap).observe(mapElement);}
window.addEventListener('resize',resizeMap);
if(!mapElement.closest('[hidden]'))resizeMap();
ids.forEach(id=>$(id).addEventListener('change',updateMarkers));
$('range-reset').onclick=()=>{ids.forEach(id=>$(id).value='');next=0;updateMarkers();$('range-results').hidden=true;$('range-status').textContent='Points cleared.';};
const fmt=(n,d=1)=>n.toFixed(d);
function drawProfile(result){
 const el=$('range-profile');el.replaceChildren();const width=760,height=260,pad=40,pts=result.points;const vals=pts.flatMap(p=>[p.elevation,p.effectiveTerrain,p.line,p.line-0.6*p.fresnel]);const min=Math.min(...vals)-5,max=Math.max(...vals)+5,scaleY=v=>height-pad-(v-min)/(max-min)*(height-pad*2),scaleX=i=>pad+i/(pts.length-1)*(width-pad*2);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+width+' '+height);svg.setAttribute('role','img');svg.setAttribute('aria-label','Terrain elevation profile with radio line and 60 percent Fresnel boundary');
 const path=(selector,color,stroke=3)=>{const p=document.createElementNS(svg.namespaceURI,'polyline');p.setAttribute('points',pts.map((v,i)=>scaleX(i)+','+scaleY(selector(v))).join(' '));p.setAttribute('fill','none');p.setAttribute('stroke',color);p.setAttribute('stroke-width',stroke);svg.append(p);};
 path(p=>p.elevation,'#83b485',3);path(p=>p.effectiveTerrain,'#7e9acb',2);path(p=>p.line,'#e4bf73');path(p=>p.line-0.6*p.fresnel,'#ec8c74',2);
 el.append(svg);const legend=document.createElement('p');legend.className='tool-muted';legend.textContent='Green: sampled terrain · Blue: terrain including Earth curvature · Gold: straight radio path · Orange: lower 60% Fresnel boundary';el.append(legend);
}
$('range-calculate').onclick=async()=>{
 const button=$('range-calculate'),status=$('range-status');let a,b;
 try{[a,b]=coordinates();if(distanceKm(a,b)<0.01||distanceKm(a,b)>500)throw Error('Select points between 10 metres and 500 km apart');}catch(error){status.textContent=error.message;return;}
 button.disabled=true;status.textContent='Retrieving terrain elevations…';$('range-results').hidden=true;
 try{
  const sampleCount=Math.min(100,Math.max(31,Math.ceil(distanceKm(a,b)*1000/100)+1));
  const samples=interpolate(a,b,sampleCount),lat=samples.map(p=>p.lat.toFixed(5)).join(','),lon=samples.map(p=>p.lon.toFixed(5)).join(',');
  const response=await fetch('https://api.open-meteo.com/v1/elevation?latitude='+encodeURIComponent(lat)+'&longitude='+encodeURIComponent(lon),{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Elevation service returned '+response.status);
  const data=await response.json();if(!Array.isArray(data.elevation)||data.elevation.length!==samples.length)throw Error('Elevation response was incomplete');
  const result=terrainProfile(a,b,data.elevation,{heightA:Number($('range-height-a').value),heightB:Number($('range-height-b').value),frequencyMHz:Number($('range-frequency').value)});
  const summary=$('range-summary');summary.replaceChildren();
  for(const [label,value] of [['Distance',fmt(result.distanceKm,2)+' km'],['Terrain line of sight',result.obstructed?'Obstructed':'Clear at sampled points'],['60% Fresnel clearance',result.fresnelClear?'Clear at sampled points':'Obstructed'],['Worst 60% clearance',fmt(result.minimumClearanceM)+' m'],['Radio horizon (estimated)',fmt(result.radioHorizonKm,1)+' km'],['Terrain alone',result.terrainObstructed?'Obstructed':'Clear at samples'],['Curvature alone',result.curvatureObstructed?'Obstructed':'Clear at samples']]){
   const card=document.createElement('div');const name=document.createElement('span');name.textContent=label;const strong=document.createElement('strong');strong.textContent=value;card.append(name,strong);summary.append(card);
  }
  const explanations={combined:'Both Earth curvature and terrain contribute to blocking the sampled path.',curvature:'Earth curvature is sufficient to block this path, even without hills. Over-water routes are not exempt from the radio horizon.',terrain:'The sampled terrain rises into the straight radio path. Higher antenna positions or a different route may help.',fresnel:'The direct path is clear at sampled points, but the first Fresnel zone does not have 60% clearance.',clear:'The sampled terrain and 60% Fresnel zone are clear under the selected assumptions.'};
  const explanation=$('range-explanation');explanation.replaceChildren();
  const cause=document.createElement('strong');cause.textContent='Assessment: '+({combined:'Terrain and Earth curvature',curvature:'Earth curvature',terrain:'Terrain obstruction',fresnel:'Fresnel-zone obstruction',clear:'Clear at sampled points'}[result.primaryCause]);
  const reason=document.createElement('p');reason.textContent=explanations[result.primaryCause];
  const height=document.createElement('p');height.textContent='Equal antenna-height increase to reach sampled 60% clearance: '+fmt(result.requiredEqualHeightIncreaseM,1)+' m at each end (approximate). Resulting heights: A '+fmt(result.suggestedHeightA,1)+' m, B '+fmt(result.suggestedHeightB,1)+' m above local ground. This is not a practical installation recommendation.';
  const caution=document.createElement('p');caution.textContent='The radio horizon uses antenna heights above local ground and assumes a smooth Earth; elevated terrain and sea-level altitude can extend or reduce actual visibility. The curvature and terrain indicators are diagnostic approximations, not independent guarantees.';
  explanation.append(cause,reason,height,caution);
  drawProfile(result);$('range-results').hidden=false;status.textContent='Terrain profile calculated using '+samples.length+' elevation samples. Checking mapped buildings…';
  const buildingPanel=$('range-buildings');buildingPanel.replaceChildren();
  const heading=document.createElement('strong');heading.textContent='Basic building assessment';
  const detail=document.createElement('p');buildingPanel.append(heading,detail);
  const routeKm=distanceKm(a,b);
  if(routeKm>3){detail.textContent='Not assessed: building footprints are checked only for routes up to 3 km. Terrain results remain available.';}
  else{
   try{
    const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(overpassQuery(a,b)),signal:AbortSignal.timeout(16000)});
    if(!response.ok)throw Error('OpenStreetMap building service returned '+response.status);
    const buildings=parseBuildings(await response.json());
    const assessment=assessBuildings(a,b,buildings,result);
    detail.textContent=assessment.status+'. '+assessment.count+' mapped building footprint(s) cross the route; '+assessment.obstructed+' estimated obstruction(s), '+assessment.unknown+' with unknown heights. Mapped heights are used when available; storeys are estimated at 3 m each. Missing buildings and heights are possible.';
    if(map&&assessment.hits.length){
     buildingLayer=L.layerGroup(assessment.hits.map(hit=>L.polygon(hit.polygon.map(p=>[p.lat,p.lon]),{color:hit.status==='potential obstruction'?'#f28b73':'#e4bf73',weight:2,fillOpacity:0.18}).bindPopup('Building '+hit.id+': '+hit.heightSource+(hit.heightM===null?'':', '+fmt(hit.heightM)+' m')))).addTo(map);
    }
   }catch(error){detail.textContent='Building assessment unavailable ('+error.message+'). Building line of sight is unknown; terrain results remain available.';}
  }
  status.textContent='Terrain profile calculated using '+samples.length+' elevation samples. Building check finished (estimates only).';
 }catch(error){status.textContent='Unable to calculate: '+error.message+'. Check coordinates, connection and elevation service availability.';}
 finally{button.disabled=false;}
};
