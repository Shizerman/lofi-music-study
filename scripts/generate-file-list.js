#!/usr/bin/env node
/**
 * Scans the music/ and vibes/ folders and writes file-list.json
 * so the player knows which tracks and videos are available.
 * Run after adding new files: npm run update-files
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MUSIC_DIR = path.join(ROOT, 'music');
const VIBES_DIR = path.join(ROOT, 'vibes');
const OUTPUT = path.join(ROOT, 'file-list.json');

function listMedia(dir, ext) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter((f) => path.extname(f).toLowerCase() === ext)
        .sort()
        .map((f) => path.join(path.basename(dir), f).replace(/\\/g, '/'));
}

const music = listMedia(MUSIC_DIR, '.mp3');
const vibes = listMedia(VIBES_DIR, '.mp4');

const data = { music, vibes };
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf8');
console.log(`Wrote ${OUTPUT}: ${music.length} music, ${vibes.length} vibes.`);
