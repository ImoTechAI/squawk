import test from 'node:test';
import assert from 'node:assert/strict';
import {buildingHeight,parseBuildings,assessBuildings,overpassQuery} from '../building-los.js';
import {terrainProfile} from '../radio-math.js';
const a={lat:53.45,lon:-2.24},b={lat:53.45,lon:-2.235};
const polygon=[{lat:53.4499,lon:-2.238},{lat:53.4501,lon:-2.238},{lat:53.4501,lon:-2.2378},{lat:53.4499,lon:-2.2378},{lat:53.4499,lon:-2.238}];
const profile=terrainProfile(a,b,Array(31).fill(50),{heightA:2,heightB:2});
test('mapped heights and storeys are labelled; unknown stays unknown',()=>{
 assert.deepEqual(buildingHeight({height:'8 m'}),{metres:8,source:'mapped height'});
 assert.equal(buildingHeight({'building:levels':'3'}).metres,9);
 assert.equal(buildingHeight({height:'15 ft'}).metres,null);
 assert.equal(buildingHeight({}).metres,null);
});
test('OSM way nodes parse into footprint',()=>{
 const elements=polygon.map((p,i)=>({type:'node',id:i+1,...p}));
 elements.push({type:'way',id:7,nodes:[1,2,3,4,5],tags:{building:'terrace','building:levels':'2'}});
 const parsed=parseBuildings({elements});
 assert.equal(parsed.length,1);
 assert.equal(parsed[0].polygon.length,5);
});
test('crossing building with mapped height is potential obstruction',()=>{
 const result=assessBuildings(a,b,[{id:7,polygon,tags:{height:'8'}}],profile);
 assert.equal(result.count,1);assert.equal(result.obstructed,1);
 assert.equal(result.status,'Potential obstruction');
});
test('missing height is unknown, not clear',()=>{
 const result=assessBuildings(a,b,[{id:7,polygon,tags:{}}],profile);
 assert.equal(result.unknown,1);assert.equal(result.status,'Unknown heights');
});
test('building away from path is not counted',()=>{
 const shifted=polygon.map(p=>({...p,lat:p.lat+0.01}));
 assert.equal(assessBuildings(a,b,[{id:8,polygon:shifted,tags:{height:'8'}}],profile).count,0);
});
test('query uses local bounded OSM building search',()=>{
 const query=overpassQuery(a,b);
 assert.match(query,/way\["building"\]/);assert.match(query,/out body/);
});
