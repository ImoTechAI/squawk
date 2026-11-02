import test from 'node:test';
import assert from 'node:assert/strict';
import {antennaLengths,wavelength,wattsToDbm,dbmToWatts,coaxLoss,deliveredPower,distanceKm,interpolate,terrainProfile,validatePoint} from '../radio-math.js';
const near=(a,b,tolerance=0.001)=>assert.ok(Math.abs(a-b)<tolerance,`${a} differs from ${b}`);
test('wavelength and quarter/half-wave estimates',()=>{near(wavelength(100),2.99792458,1e-8);const a=antennaLengths(100,1);near(a.quarterM,a.wavelengthM/4);near(a.halfM,a.wavelengthM/2);assert.throws(()=>wavelength(0));assert.throws(()=>antennaLengths(145,1.1));});
test('watts and dBm conversions',()=>{near(wattsToDbm(1),30);near(dbmToWatts(30),1);near(wattsToDbm(0.001),0);assert.throws(()=>wattsToDbm(0));assert.throws(()=>dbmToWatts(Infinity));});
test('coax and connector attenuation',()=>{near(coaxLoss(50,10),5);const x=deliveredPower(10,100,3,1);near(x.lossDb,4);near(x.watts,10*10**(-0.4));assert.throws(()=>coaxLoss(-1,2));});
test('distance and sample interpolation',()=>{const a={lat:51,lon:-1},b={lat:51.1,lon:-1};const samples=interpolate(a,b,11);near(samples[5].lat,51.05);assert.equal(samples.length,11);assert.ok(distanceKm(a,b)>11);assert.throws(()=>interpolate(a,b,2));assert.throws(()=>validatePoint({lat:91,lon:0}));});
test('flat unobstructed terrain has LOS and Fresnel clearance with high antennas',()=>{const a={lat:0,lon:0},b={lat:0,lon:0.01};const p=terrainProfile(a,b,Array(31).fill(100),{heightA:30,heightB:30,frequencyMHz:145});assert.equal(p.obstructed,false);assert.equal(p.fresnelClear,true);assert.equal(p.points.length,31);});
test('terrain ridge obstructs line of sight',()=>{const a={lat:0,lon:0},b={lat:0,lon:0.01};const samples=Array(31).fill(100);samples[15]=250;const p=terrainProfile(a,b,samples,{heightA:2,heightB:2,frequencyMHz:145});assert.equal(p.obstructed,true);assert.equal(p.fresnelClear,false);assert.ok(p.minimumClearanceM<0);});
test('invalid elevation, coordinate, frequency and antenna inputs rejected',()=>{const a={lat:0,lon:0},b={lat:0,lon:0.01};assert.throws(()=>terrainProfile(a,b,[0,NaN,0]));assert.throws(()=>terrainProfile(a,b,[0,0,0],{heightA:-1}));assert.throws(()=>terrainProfile(a,b,[0,0,0],{frequencyMHz:0}));assert.throws(()=>terrainProfile(a,a,[0,0,0]));});

test('open-water long path is blocked by curvature with low antennas',()=>{
 const a={lat:0,lon:0},b={lat:0,lon:0.8};
 const p=terrainProfile(a,b,Array(31).fill(0),{heightA:2,heightB:2,frequencyMHz:145});
 assert.equal(p.terrainObstructed,false);
 assert.equal(p.curvatureObstructed,true);
 assert.equal(p.primaryCause,'curvature');
 assert.equal(p.obstructed,true);
 assert.ok(p.requiredEqualHeightIncreaseM>0);
 assert.ok(p.radioHorizonKm>10&&p.radioHorizonKm<20);
});
test('short sea path can clear Fresnel zone with adequate antenna heights',()=>{
 const a={lat:0,lon:0},b={lat:0,lon:0.005};
 const p=terrainProfile(a,b,Array(31).fill(0),{heightA:20,heightB:20,frequencyMHz:145});
 assert.equal(p.primaryCause,'clear');
 assert.equal(p.fresnelClear,true);
 near(p.requiredEqualHeightIncreaseM,0);
});
test('ridge blocks terrain alone on short route',()=>{
 const a={lat:0,lon:0},b={lat:0,lon:0.01};
 const samples=Array(31).fill(0);samples[15]=100;
 const p=terrainProfile(a,b,samples,{heightA:2,heightB:2});
 assert.equal(p.terrainObstructed,true);
 assert.equal(p.curvatureObstructed,false);
 assert.equal(p.primaryCause,'terrain');
});
test('equal antenna-height increase removes sampled Fresnel obstruction',()=>{
 const a={lat:0,lon:0},b={lat:0,lon:0.1},e=Array(31).fill(0);
 const p=terrainProfile(a,b,e,{heightA:2,heightB:2});
 const revised=terrainProfile(a,b,e,{heightA:p.suggestedHeightA+0.01,heightB:p.suggestedHeightB+0.01});
 assert.equal(revised.fresnelClear,true);
});
