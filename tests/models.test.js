import test from 'node:test';import assert from 'node:assert/strict';import {MODELS,DEFAULT_MODEL,channelKey,modelStorage,readModel,migrateLegacyChannels} from '../models.js';
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('exact three radio models',()=>assert.deepEqual(MODELS.map(m=>m.id),['uv-5r','uv-16-pro-v2','uv-32']));
test('model channel keys isolated',()=>assert.notEqual(channelKey('uv-5r'),channelKey('uv-32')));
test('profile storage isolated',()=>{const s=store();modelStorage(s,'uv-5r').setItem('profiles','one');assert.equal(modelStorage(s,'uv-32').getItem('profiles'),null);});
test('legacy channels copied only once',()=>{const s=store();s.setItem('squawk-channels-v1','[1]');migrateLegacyChannels(s);assert.equal(s.getItem(channelKey(DEFAULT_MODEL)),'[1]');s.setItem('squawk-channels-v1','[2]');migrateLegacyChannels(s);assert.equal(s.getItem(channelKey(DEFAULT_MODEL)),'[1]');});
test('invalid model falls back',()=>{const s=store();s.setItem('squawk-selected-model-v1','unknown');assert.equal(readModel(s),DEFAULT_MODEL);assert.throws(()=>channelKey('unknown'));});
