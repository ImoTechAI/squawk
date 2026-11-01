import test from 'node:test';import assert from 'node:assert/strict';import {normaliseChannel,parseCSV,toCSV,parseBackup} from '../channels.js';
const sample={name:'BASE',rx:'145.500',tx:'145.500',mode:'FM',notes:'HQ, "north"'};
test('valid channel',()=>assert.deepEqual(normaliseChannel(sample),sample));
test('reject invalid frequencies',()=>assert.throws(()=>normaliseChannel({...sample,rx:'bad'})));
test('CSV quote roundtrip',()=>assert.deepEqual(parseCSV(toCSV([sample])),[sample]));
test('reject invalid CSV header',()=>assert.throws(()=>parseCSV('a,b,c')));
test('JSON backup validation',()=>assert.deepEqual(parseBackup(JSON.stringify({format:'squawk-channels-v1',channels:[sample]})),[sample]));
test('reject arbitrary JSON',()=>assert.throws(()=>parseBackup('{}')));
