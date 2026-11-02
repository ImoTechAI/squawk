import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../range-planner.js',import.meta.url),'utf8');
test('map viewport clips absolutely positioned Leaflet tiles',()=>{assert.match(css,/#range-map\s*\{[^}]*position:relative;overflow:hidden/);assert.match(css,/#range-map \.leaflet-tile[\s\S]*?position:absolute/);});
test('map invalidates size after workspace visibility and resize',()=>{assert.match(js,/squawk-map-visible/);assert.match(js,/ResizeObserver/);assert.match(js,/invalidateSize\(\{pan:false\}\)/);});
