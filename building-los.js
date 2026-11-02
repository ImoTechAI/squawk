// Basic OSM building-footprint assessment. Geometry and heights are approximate, not RF predictions.
const RAD=Math.PI/180, EARTH=6371000;
export function projected(point,origin){
 const latitude=origin.lat*RAD;
 return {x:(point.lon-origin.lon)*RAD*EARTH*Math.cos(latitude),y:(point.lat-origin.lat)*RAD*EARTH};
}
function cross(a,b){return a.x*b.y-a.y*b.x;}
function subtract(a,b){return {x:a.x-b.x,y:a.y-b.y};}
function segmentIntersection(a,b,c,d){
 const r=subtract(b,a),s=subtract(d,c),den=cross(r,s),q=subtract(c,a);
 if(Math.abs(den)<1e-10)return null;
 const t=cross(q,s)/den,u=cross(q,r)/den;
 return t>=0&&t<=1&&u>=0&&u<=1?t:null;
}
function inside(p,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }
 return inside;
}
export function buildingHeight(tags={}){
 const raw=tags.height;
 if(typeof raw==='string'||typeof raw==='number'){
  const value=String(raw).trim();
  const match=value.match(/^(\d+(?:\.\d+)?)\s*(m|metres?|meters?)?$/i);
  if(match&&Number(match[1])>0&&Number(match[1])<=500)return {metres:Number(match[1]),source:'mapped height'};
 }
 const levels=Number(tags['building:levels']);
 if(Number.isFinite(levels)&&levels>0&&levels<=100)return {metres:levels*3,source:'estimated from '+levels+' storeys (3 m/storey)'};
 return {metres:null,source:'height unknown'};
}
export function parseBuildings(data){
 if(!data||!Array.isArray(data.elements))throw Error('Invalid OpenStreetMap building response');
 const nodes=new Map(data.elements.filter(e=>e.type==='node'&&Number.isFinite(e.lat)&&Number.isFinite(e.lon)).map(n=>[n.id,{lat:n.lat,lon:n.lon}]));
 return data.elements.filter(e=>e.type==='way'&&e.tags?.building&&Array.isArray(e.nodes)).map(way=>{
  const polygon=way.nodes.map(id=>nodes.get(id)).filter(Boolean);
  return polygon.length>=4&&polygon.length===way.nodes.length?{id:way.id,polygon,tags:way.tags}:null;
 }).filter(Boolean);
}
export function assessBuildings(a,b,buildings,terrain,{heightA=2,heightB=2}={}){
 if(!Array.isArray(buildings)||!terrain?.points?.length)throw Error('Missing buildings or terrain profile');
 const start=projected(a,a),end=projected(b,a),distance=Math.hypot(end.x,end.y);
 if(distance<1)throw Error('Points too close');
 const hits=[];
 for(const building of buildings){
  if(!Array.isArray(building.polygon)||building.polygon.length<3)continue;
  const poly=building.polygon.map(p=>projected(p,a)),ts=[];
  if(inside(start,poly))ts.push(0);
  if(inside(end,poly))ts.push(1);
  for(let i=0;i<poly.length;i++){
   const t=segmentIntersection(start,end,poly[i],poly[(i+1)%poly.length]);
   if(t!==null)ts.push(t);
  }
  if(!ts.length)continue;
  const t=ts.reduce((sum,x)=>sum+x,0)/ts.length;
  const idx=t*(terrain.points.length-1),lo=Math.floor(idx),hi=Math.min(lo+1,terrain.points.length-1),fraction=idx-lo;
  const ground=terrain.points[lo].elevation*(1-fraction)+terrain.points[hi].elevation*fraction;
  const line=terrain.points[lo].line*(1-fraction)+terrain.points[hi].line*fraction;
  const curvature=terrain.points[lo].curvature*(1-fraction)+terrain.points[hi].curvature*fraction;
  const height=buildingHeight(building.tags);
  const clearance=height.metres===null?null:line-(ground+curvature+height.metres);
  hits.push({id:building.id,km:t*distance/1000,polygon:building.polygon,heightM:height.metres,heightSource:height.source,clearanceM:clearance,status:clearance===null?'unknown':clearance<0?'potential obstruction':'estimated clear'});
 }
 hits.sort((x,y)=>x.km-y.km);
 return {count:hits.length,hits,unknown:hits.filter(h=>h.status==='unknown').length,obstructed:hits.filter(h=>h.status==='potential obstruction').length,
  status:hits.some(h=>h.status==='potential obstruction')?'Potential obstruction':hits.some(h=>h.status==='unknown')?'Unknown heights':hits.length?'No mapped building-height obstruction':'No intersecting mapped buildings'};
}
export function overpassQuery(a,b){
 const south=Math.max(-90,Math.min(a.lat,b.lat)-0.001),north=Math.min(90,Math.max(a.lat,b.lat)+0.001);
 const west=Math.max(-180,Math.min(a.lon,b.lon)-0.001),east=Math.min(180,Math.max(a.lon,b.lon)+0.001);
 return '[out:json][timeout:12];way["building"]('+[south,west,north,east].map(n=>n.toFixed(6)).join(',')+');(._;>;);out body;';
}
