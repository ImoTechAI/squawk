import test from 'node:test';
import assert from 'node:assert/strict';
import {CHANNEL_DIRECTORY,channelsForRange,findDirectoryChannels,directoryChannelCandidate} from '../frequency-channels.js';
import {FREQUENCIES} from '../frequencies.js';
import {normaliseChannel} from '../channels.js';
test('PMR446 directory contains 16 unique consecutive channels at 12.5 kHz spacing',()=>{
 assert.ok(CHANNEL_DIRECTORY.length>100);
 assert.equal(CHANNEL_DIRECTORY[0].frequency,446.00625);
 assert.equal(channelsForRange('PMR446 analogue')[15].frequency,446.19375);
 assert.equal(new Set(CHANNEL_DIRECTORY.map(x=>x.id)).size,CHANNEL_DIRECTORY.length);
 for(let i=1;i<16;i++)assert.ok(Math.abs(CHANNEL_DIRECTORY[i].frequency-CHANNEL_DIRECTORY[i-1].frequency-0.0125)<1e-7);
});
test('only supported ranges have fixed channel entries',()=>{
 assert.equal(channelsForRange('PMR446 analogue').length,16);
 assert.equal(channelsForRange('70 cm amateur').length,2);
});
test('search by exact frequency, channel name and band/service filters',()=>{
 assert.equal(findDirectoryChannels('446.06875','UHF','All',FREQUENCIES)[0].number,6);
 assert.equal(findDirectoryChannels('channel 16','UHF','Licence-exempt',FREQUENCIES)[0].number,16);
 assert.equal(findDirectoryChannels('446.06875','VHF','All',FREQUENCIES).length,0);
 assert.equal(findDirectoryChannels('446.06875','UHF','Amateur',FREQUENCIES).length,0);
});
test('individual channels import receive-only through existing channel validator',()=>{
 const candidate=normaliseChannel(directoryChannelCandidate(CHANNEL_DIRECTORY[4]));
 assert.equal(candidate.receiveOnly,true);
 assert.equal(candidate.rx,'446.05625');
 assert.equal(candidate.tx,candidate.rx);
 assert.equal(candidate.mode,'NFM');
 assert.throws(()=>directoryChannelCandidate({id:'pmr446-5',frequency:145.5}));
});

test('UK and CEPT CB each contain 40 exact channel centres and cannot import',()=>{
 const uk=channelsForRange('UK CB 27/81'),cept=channelsForRange('CEPT CB');
 assert.equal(uk.length,40);assert.equal(cept.length,40);
 assert.equal(uk[0].frequency,27.60125);assert.equal(uk[39].frequency,27.99125);
 assert.equal(cept[22].frequency,27.255);assert.equal(cept[23].frequency,27.235);
 assert.throws(()=>directoryChannelCandidate(uk[0]));
});
test('selected amateur simplex and marine voice channels are receive-only; DSC is not importable',()=>{
 const calling=channelsForRange('2 m amateur').find(x=>x.frequency===145.5);
 assert.equal(directoryChannelCandidate(calling).receiveOnly,true);
 const marine=channelsForRange('Marine VHF');
 assert.equal(marine.find(x=>x.number===16).frequency,156.8);
 assert.throws(()=>directoryChannelCandidate(marine.find(x=>x.number===70)));
 assert.equal(directoryChannelCandidate(marine.find(x=>x.number===16)).receiveOnly,true);
});
