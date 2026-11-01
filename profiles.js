import {normaliseChannel} from './channels.js';
export const PROFILE_KEY='squawk-profiles-v1';
export function validProfileName(name){const value=String(name??'').trim();if(!value||value.length>50)throw Error('Profile name must contain 1–50 characters');return value;}
export function readProfiles(storage){try{const data=JSON.parse(storage.getItem(PROFILE_KEY)||'{}');if(!data||typeof data!=='object'||Array.isArray(data))return {};return Object.fromEntries(Object.entries(data).slice(0,30).map(([name,channels])=>[validProfileName(name),validateChannels(channels)]));}catch{return {};}}
export function validateChannels(channels){if(!Array.isArray(channels)||channels.length>1000)throw Error('Invalid channel list');return channels.map(normaliseChannel);}
export function saveProfile(storage,name,channels){const profiles=readProfiles(storage),key=validProfileName(name);if(!Object.hasOwn(profiles,key)&&Object.keys(profiles).length>=30)throw Error('Maximum 30 profiles');profiles[key]=validateChannels(channels);storage.setItem(PROFILE_KEY,JSON.stringify(profiles));return profiles;}
export function deleteProfile(storage,name){const profiles=readProfiles(storage);delete profiles[name];storage.setItem(PROFILE_KEY,JSON.stringify(profiles));return profiles;}
