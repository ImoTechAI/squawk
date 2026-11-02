import test from 'node:test';
import assert from 'node:assert/strict';
import {SDR_DIRECTORIES,searchSDR,readSDRFavorites,toggleSDRFavorite} from '../sdr.js';
function storage(){const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};}
test('directories have unique IDs and external URLs',()=>{assert.ok(SDR_DIRECTORIES.length>=5);assert.equal(new Set(SDR_DIRECTORIES.map(r=>r.id)).size,SDR_DIRECTORIES.length);for(const item of SDR_DIRECTORIES){assert.match(item.url,/^https?:\/\//);assert.ok(item.name&&item.type);}});
test('filter directories by platform and search text',()=>{assert.ok(searchSDR(SDR_DIRECTORIES,{type:'KiwiSDR'}).every(r=>r.type==='KiwiSDR'));assert.ok(searchSDR(SDR_DIRECTORIES,{query:'world'}).length>0);assert.equal(searchSDR(SDR_DIRECTORIES,{query:'not-a-real-directory-123'}).length,0);});
test('favourites persist, toggle and filter',()=>{const s=storage();assert.deepEqual(readSDRFavorites(s),[]);assert.deepEqual(toggleSDRFavorite(s,'receiverbook'),['receiverbook']);assert.equal(searchSDR(SDR_DIRECTORIES,{favoritesOnly:true,favorites:readSDRFavorites(s)}).length,1);assert.deepEqual(toggleSDRFavorite(s,'receiverbook'),[]);assert.throws(()=>toggleSDRFavorite(s,'invalid'),/Unknown/);});
test('invalid stored favourites do not break rendering',()=>{const s=storage();s.setItem('squawk-sdr-favorites-v1','not-json');assert.deepEqual(readSDRFavorites(s),[]);s.setItem('squawk-sdr-favorites-v1','["invalid","websdr"]');assert.deepEqual(readSDRFavorites(s),['websdr']);});
