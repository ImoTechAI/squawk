export const WORKSPACES=Object.freeze([
 {id:'dashboard',title:'Dashboard',group:'Workspace',description:'Overview and quick access',ready:true},
 {id:'radios',title:'My Radios',group:'Workspace',description:'Radio selection and profiles',ready:true},
 {id:'channels',title:'Channel Editor',group:'Workspace',description:'Edit and back up channels',ready:true},
 {id:'repeaters',title:'Repeaters',group:'Discover',description:'UK CSV repeater search',ready:true},
 {id:'sdr',title:'Global SDR',group:'Discover',description:'Public online receiver directories',ready:true},
 {id:'frequencies',title:'Frequencies',group:'Discover',description:'UK band and service frequency reference',ready:true},
 {id:'operations',title:'Operations',group:'Plan',description:'Map and terrain radio range planner',ready:true},
 {id:'tools',title:'Radio Tools',group:'Plan',description:'Antenna and RF power calculators',ready:true},
 {id:'academy',title:'Radio Academy',group:'Plan',description:'Offline radio lessons and knowledge checks',ready:true},
 {id:'settings',title:'Settings',group:'System',description:'USB diagnostics and hardware status',ready:true}
]);
export const DEFAULT_WORKSPACE='dashboard';
export function validWorkspace(value){return WORKSPACES.some(item=>item.id===value)?value:DEFAULT_WORKSPACE;}
export function workspaceFromHash(hash){return validWorkspace(String(hash||'').replace(/^#\/?/,'').split('/')[0]);}
