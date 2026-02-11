#!/usr/bin/env node
// bump-cache.js — Update all ?v= cache-buster strings in index.html
// Run before committing to ensure browsers fetch fresh assets.
// Usage: node scripts/bump-cache.sh

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('Error: index.html not found at', indexPath);
    process.exit(1);
}

const now = new Date();
const version = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + 'a';

console.log(`Bumping cache busters in index.html to v=${version} ...`);

let html = fs.readFileSync(indexPath, 'utf8');
const matches = html.match(/\?v=[a-zA-Z0-9_.-]+/g) || [];
html = html.replace(/\?v=[a-zA-Z0-9_.-]+/g, `?v=${version}`);
fs.writeFileSync(indexPath, html, 'utf8');

console.log(`Updated ${matches.length} cache-buster strings to ?v=${version}`);
