import test from 'node:test';import assert from 'node:assert/strict';import {normaliseChannel,parseCSV,toCSV,parseBackup} from '../channels.js';
const sample={name:'BASE',rx:'145.500',tx:'145.500',mode:'FM',notes:'HQ, "north"'};
test('valid channel',()=>assert.deepEqual(normaliseChannel(sample),{...sample,power:'Default',tone:'None',toneValue:'',offset:'0',direction:'Simplex',scan:true,receiveOnly:false}));
test('reject invalid frequencies',()=>assert.throws(()=>normaliseChannel({...sample,rx:'bad'})));
test('CSV quote roundtrip',()=>assert.deepEqual(parseCSV(toCSV([sample])),[normaliseChannel(sample)]));
test('reject invalid CSV header',()=>assert.throws(()=>parseCSV('a,b,c')));
test('JSON backup validation',()=>assert.deepEqual(parseBackup(JSON.stringify({format:'squawk-channels-v1',channels:[sample]})),[normaliseChannel(sample)]));
test('reject arbitrary JSON',()=>assert.throws(()=>parseBackup('{}')));

test('advanced settings survive normalisation',()=>{const channel=normaliseChannel({...sample,power:'High',tone:'CTCSS',toneValue:'88.5',offset:'0.6',direction:'Plus',scan:false,receiveOnly:true});assert.equal(channel.toneValue,'88.5');assert.equal(channel.scan,false);assert.equal(channel.receiveOnly,true);});
test('reject invalid advanced settings',()=>assert.throws(()=>normaliseChannel({...sample,tone:'CTCSS',toneValue:'bad'})));
test('JSON backup retains advanced settings',()=>{const channel=normaliseChannel({...sample,power:'Low',receiveOnly:true});assert.deepEqual(parseBackup(JSON.stringify({format:'squawk-channels-v1',channels:[channel]})),[channel]);});
