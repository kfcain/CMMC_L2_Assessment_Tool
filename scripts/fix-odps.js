#!/usr/bin/env node
// Phase 2: Fix formatting after ODP removal
// Fix lines where "objectives: [" got merged with first entry

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const files = [
    'families-r3-ac-at-au.js',
    'families-r3-cm-ia.js',
    'families-r3-ir-ma-mp-ps-pe.js',
    'families-r3-ra-ca-sc-si.js',
    'families-r3-sr-pl.js'
];

let fixCount = 0;

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix: "objectives: [                    { id:" → "objectives: [\n                    { id:"
    const before = content;
    content = content.replace(/objectives: \[\s+(\{ id:)/g, 'objectives: [\n                    $1');
    
    // Also fix any trailing whitespace on objectives lines
    content = content.replace(/objectives: \[\s*\n\s*\n/g, 'objectives: [\n');
    
    if (content !== before) {
        fs.writeFileSync(filePath, content, 'utf8');
        const fixes = (before.match(/objectives: \[\s+\{ id:/g) || []).length;
        fixCount += fixes;
        console.log(`${file}: fixed ${fixes} formatting issues`);
    } else {
        console.log(`${file}: no formatting issues`);
    }
});

// Final count verification
let total = 0;
files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const count = (content.match(/\{\s*id:\s*"[^"]+",\s*text:\s*"/g) || []).length;
    const odps = (content.match(/ODP\[/g) || []).length;
    console.log(`  ${file}: ${count} objectives, ${odps} ODPs remaining`);
    total += count;
});
console.log(`\nTotal objectives: ${total}`);
