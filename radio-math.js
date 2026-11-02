// Pure radio planning calculations. SI units unless noted.
const C=299792458;
const R=6371000;
export function positive(value,label){const n=Number(value);if(!Number.isFinite(n)||n<=0)throw Error(label+' must be greater than zero');return n;}
export function nonnegative(value,label){const n=Number(value);if(!Number.isFinite(n)||n<0)throw Error(label+' must be zero or greater');return n;}
export function wavelength(frequencyMHz){return C/(positive(frequencyMHz,'Frequency')*1e6);}
export function antennaLengths(frequencyMHz,velocityFactor=0.95){const wave=wavelength(frequencyMHz),vf=positive(velocityFactor,'Velocity factor');if(vf>1)throw Error('Velocity factor must not exceed 1');return {wavelengthM:wave,quarterM:wave*vf/4,halfM:wave*vf/2};}
export function wattsToDbm(watts){return 10*Math.log10(positive(watts,'Power')*1000);}
export function dbmToWatts(dbm){const n=Number(dbm);if(!Number.isFinite(n))throw Error('dBm must be a finite number');return 10**((n-30)/10);}
export function coaxLoss(lengthM,lossDbPer100M){return nonnegative(lengthM,'Cable length')*nonnegative(lossDbPer100M,'Loss per 100 m')/100;}
export function deliveredPower(watts,lengthM,lossDbPer100M,connectorLossDb=0){const lossDb=coaxLoss(lengthM,lossDbPer100M)+nonnegative(connectorLossDb,'Connector loss');return {lossDb,watts:positive(watts,'Power')*10**(-lossDb/10)};}
export function distanceKm(a,b){const rad=Math.PI/180,lat1=a.lat*rad,lat2=b.lat*rad,dLat=(b.lat-a.lat)*rad,dLon=(b.lon-a.lon)*rad;const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(h)))/1000;}
export function interpolate(a,b,count=31){if(!Number.isInteger(count)||count<3||count>100)throw Error('Invalid sample count');return Array.from({length:count},(_,i)=>{const t=i/(count-1);return {lat:a.lat+(b.lat-a.lat)*t,lon:a.lon+(b.lon-a.lon)*t};});}
export function validatePoint(p){if(!p||!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||Math.abs(p.lat)>90||Math.abs(p.lon)>180)throw Error('Coordinates must be valid latitude and longitude');return p;}
export function terrainProfile(a,b,elevations,{heightA=2,heightB=2,frequencyMHz=145,earthFactor=4/3}={}){
 validatePoint(a);validatePoint(b);
 const hA=nonnegative(heightA,'Antenna A height'),hB=nonnegative(heightB,'Antenna B height'),freq=positive(frequencyMHz,'Frequency'),k=positive(earthFactor,'Earth factor');
 if(!Array.isArray(elevations)||elevations.length<3||elevations.some(n=>!Number.isFinite(n)))throw Error('Valid elevation samples required');
 const km=distanceKm(a,b);if(km<0.01)throw Error('Select points at least 10 metres apart');
 const d=km*1000,lambda=wavelength(freq),start=elevations[0]+hA,end=elevations.at(-1)+hB;
 const points=elevations.map((elevation,i)=>{const t=i/(elevations.length-1),d1=d*t,d2=d-d1;const curvature=d1*d2/(2*R*k);const line=start+(end-start)*t-curvature;const fresnel=Math.sqrt(lambda*d1*d2/d);return {km:km*t,elevation,line,fresnel,clearance:line-elevation,clearance60:line-elevation-0.6*fresnel};});
 const worst=points.reduce((acc,p)=>p.clearance60<acc.clearance60?p:acc,points[1]);const obstructed=points.slice(1,-1).some(p=>p.clearance<0);
 return {distanceKm:km,points,obstructed,fresnelClear:points.slice(1,-1).every(p=>p.clearance60>=0),minimumClearanceM:worst.clearance60,radioHorizonKm:3.57*(Math.sqrt(hA)+Math.sqrt(hB))};
}
