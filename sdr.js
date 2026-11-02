// Curated public SDR discovery services. Links open operator-controlled listening interfaces.
// Directory links are not live receiver-status checks.
export const SDR_DIRECTORIES=Object.freeze([
  {id:'receiverbook',name:'Receiverbook',type:'Mixed',region:'Worldwide',description:'Explore KiwiSDR, WebSDR and OpenWebRX receivers on a searchable map.',url:'https://www.receiverbook.de/map'},
  {id:'kiwimap',name:'KiwiSDR World Map',type:'KiwiSDR',region:'Worldwide',description:'Find geographically distributed KiwiSDR shortwave receivers.',url:'https://rx.linkfanel.net/'},
  {id:'kiwilist',name:'KiwiSDR Public List',type:'KiwiSDR',region:'Worldwide',description:'Official public KiwiSDR directory with receiver information.',url:'https://rx.kiwisdr.com/'},
  {id:'websdr',name:'WebSDR.org',type:'WebSDR',region:'Worldwide',description:'Find independently operated WebSDR stations and their supported bands.',url:'http://www.websdr.org/'},
  {id:'openwebrx',name:'OpenWebRX Receivers',type:'OpenWebRX',region:'Worldwide',description:'Find public OpenWebRX receivers via Receiverbook.',url:'https://www.receiverbook.de/map?type=openwebrx&band='},
  {id:'rxtx',name:'RX-TX SDR Map',type:'Mixed',region:'Worldwide',description:'Explore public SDR receiver locations and available bands.',url:'https://rx-tx.info/map-sdr-points'},
  {id:'web888',name:'Web-888 Directory',type:'Web-888',region:'Worldwide',description:'Browse Web-888 receivers and their published locations.',url:'https://rx-888.com/'}
]);
export function searchSDR(items,{query='',type='All',favoritesOnly=false,favorites=[]}={}){
  const needle=String(query).trim().toLowerCase();
  const saved=new Set(favorites);
  return items.filter(item=>(type==='All'||item.type===type)&&(!favoritesOnly||saved.has(item.id))&&(!needle||[item.name,item.description,item.region,item.type].some(value=>value.toLowerCase().includes(needle))));
}
export function readSDRFavorites(storage){
  try{const saved=JSON.parse(storage.getItem('squawk-sdr-favorites-v1')||'[]');return Array.isArray(saved)?saved.filter(id=>SDR_DIRECTORIES.some(item=>item.id===id)):[];}catch{return [];}
}
export function toggleSDRFavorite(storage,id){
  if(!SDR_DIRECTORIES.some(item=>item.id===id))throw Error('Unknown SDR directory');
  const saved=new Set(readSDRFavorites(storage));
  if(saved.has(id))saved.delete(id);else saved.add(id);
  const result=[...saved];storage.setItem('squawk-sdr-favorites-v1',JSON.stringify(result));return result;
}
