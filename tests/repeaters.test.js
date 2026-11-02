import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRepeaterCSV,searchRepeaters,repeaterChannel} from '../repeaters.js';
const csv='Callsign,Output,Input,CTCSS,Location,Mode,Status\nGB3TEST,145.700,145.100,88.5,"Manchester, North",FM,Operational\nGB7DIG,439.500,430.500,,London,DMR,Operational\nGB3NONE,433.000,,,Hull,FM,Unknown\n';
test('parse CSV with quoted locations and analogue/digital modes',()=>{
  const r=parseRepeaterCSV(csv);
  assert.equal(r.length,3);
  assert.equal(r[0].location,'Manchester, North');
  assert.equal(r[0].rx,145.7);
  assert.equal(r[0].tx,145.1);
  assert.equal(r[0].tone,'88.5');
  assert.equal(r[1].analog,false);
});
test('search by callsign, location and band',()=>{
  const r=parseRepeaterCSV(csv);
  assert.equal(searchRepeaters(r,'manchester').length,1);
  assert.equal(searchRepeaters(r,'GB7').length,1);
  assert.equal(searchRepeaters(r,'','2m').length,1);
  assert.equal(searchRepeaters(r,'','70cm').length,2);
});
test('analogue repeater maps to receive-only channel with minus offset',()=>{
  const r=repeaterChannel(parseRepeaterCSV(csv)[0]);
  assert.equal(r.receiveOnly,true);
  assert.equal(r.direction,'Minus');
  assert.equal(r.offset,'0.60000');
  assert.equal(r.tone,'CTCSS');
  assert.equal(r.tx,'145.10000');
});
test('digital and incomplete repeaters are not imported',()=>{
  const r=parseRepeaterCSV(csv);
  assert.throws(()=>repeaterChannel(r[1]),/Digital-only/);
  assert.throws(()=>repeaterChannel(r[2]),/input frequency missing/);
});
test('reject malformed or unsupported CSV',()=>{
  assert.throws(()=>parseRepeaterCSV('Callsign,Location\nGB3A,Manchester'),/Output/);
  assert.throws(()=>parseRepeaterCSV('Output,Input\n145.6,145.0'),/Callsign/);
  assert.throws(()=>parseRepeaterCSV(''),/empty/);
});
test('offset-only CSV computes input from signed offset',()=>{
  const r=parseRepeaterCSV('Callsign,Frequency,Offset,Mode\nGB3A,145.700,-0.600,FM\n');
  assert.equal(r[0].tx,145.1);
});
