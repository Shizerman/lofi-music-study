# Lofi Music Player Blueprint

## Overview

A simple, elegant, and modern lofi music player with a Pomodoro timer and dynamic backgrounds (vibes).

## Project Structure

*   `index.html`: The main HTML file.
*   `style.css`: The main stylesheet.
*   `js/main.js`: The main JavaScript file; loads the track/vibe list from `file-list.json` or (when using the dev server) from `/api/files`.
*   `file-list.json`: Generated list of music and vibe file paths. Create/update by running `npm run update-files` after adding files.
*   `scripts/generate-file-list.js`: Node script that scans `music/` and `vibes/` and writes `file-list.json`.
*   `music/`: A directory containing music files (.mp3).
*   `vibes/`: A directory containing video files for backgrounds (.mp4).

## Features

*   **Music Player:**
    *   Dynamically loads and plays music from the `music/` directory.
    *   Controls: Play/Pause, Next, Previous, Shuffle.
    *   Volume control.
    *   Song progress bar.
*   **Pomodoro Timer:**
    *   25-minute timer with start, reset, and time adjustment controls.
*   **Vibes:**
    *   Dynamically loads and displays background videos from the `vibes/` directory.
    *   "Change Vibe" button to cycle through backgrounds.

## Design

*   **Theme:** Dark, modern, and clean with cyan and purple accents.
*   **Layout:** A centered player card with a blurred, semi-transparent background.
*   **Effects:**
    *   Noise overlay for a textured feel.
    *   Glowing shadows on interactive elements.
    *   Smooth transitions for vibe changes.

## Dynamic File Loading

The app discovers music and vibes in two ways:

1. **Dev server (`npm start`):** The server reads `music/` and `vibes/` on each request to `/api/files`. Add new files to those folders and refresh the page—no script needed.
2. **Static (e.g. GitHub Pages, or opening `index.html`):** The app loads `file-list.json`. After adding or removing files in `music/` or `vibes/`, run **`npm run update-files`** to regenerate `file-list.json`, then commit it if you deploy.
