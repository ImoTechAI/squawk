import test from 'node:test';
import assert from 'node:assert/strict';
import {FREQUENCIES,findFrequencies,frequencyLabel,receiveOnlyCandidate} from '../frequencies.js';
test('catalogue contains distinct, bounded UK reference ranges',()=>{assert.ok(FREQUENCIES.length>=10);assert.equal(new Set(FREQUENCIES.map(x=>x.name)).size,FREQUENCIES.length);for(const entry of FREQUENCIES)assert.ok(entry.start>0&&entry.end>=entry.start);});
test('find by frequency within range and by name',()=>{assert.ok(findFrequencies('145.5').some(x=>x.name==='2 m amateur'));assert.ok(findFrequencies('airband').some(x=>x.service==='Aviation'));assert.equal(findFrequencies('9999').length,0);});
test('filter by band and service',()=>{assert.ok(findFrequencies('','UHF','Amateur').every(x=>x.group==='UHF'&&x.service==='Amateur'));});
test('range labels are formatted',()=>{assert.match(frequencyLabel(FREQUENCIES[0]),/MHz$/);});
test('receive-only candidate is conservative and valid for channel editor',()=>{const pmr=FREQUENCIES.find(x=>x.name==='PMR446 analogue');const c=receiveOnlyCandidate(pmr,pmr.start);assert.equal(c.receiveOnly,true);assert.equal(c.rx,c.tx);assert.equal(c.mode,'NFM');assert.throws(()=>receiveOnlyCandidate(pmr,145.5));});
test('non-FM services cannot be imported as FM channels',()=>{const air=FREQUENCIES.find(x=>x.service==='Aviation');assert.throws(()=>receiveOnlyCandidate(air,120));});
