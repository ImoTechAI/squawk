import test from 'node:test';import assert from 'node:assert/strict';import {normaliseChannel} from '../channels.js';import {readProfiles,saveProfile,deleteProfile,validProfileName} from '../profiles.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
const sample=[{name:'BASE',rx:'145.500',tx:'145.500',mode:'FM',notes:''}];
test('save and load separate profiles',()=>{const s=storage();saveProfile(s,'Patrol',sample);saveProfile(s,'HQ',[]);assert.deepEqual(readProfiles(s).Patrol,sample.map(normaliseChannel));assert.deepEqual(readProfiles(s).HQ,[]);});
test('profiles are snapshots',()=>{const s=storage();saveProfile(s,'Patrol',sample);sample[0].name='CHANGED';assert.equal(readProfiles(s).Patrol[0].name,'BASE');sample[0].name='BASE';});
test('delete profile',()=>{const s=storage();saveProfile(s,'Patrol',sample);deleteProfile(s,'Patrol');assert.deepEqual(readProfiles(s),{});});
test('reject invalid profile names and channels',()=>{const s=storage();assert.throws(()=>validProfileName(' '));assert.throws(()=>saveProfile(s,'Bad',[{name:'BAD',rx:'no',tx:'145',mode:'FM'}]));});
test('invalid storage is safely ignored',()=>{const s=storage();s.setItem('squawk-profiles-v1','{broken');assert.deepEqual(readProfiles(s),{});});
