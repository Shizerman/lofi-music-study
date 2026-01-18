# Lofi Music Player Blueprint

## Overview

A simple, elegant, and modern lofi music player with a Pomodoro timer and dynamic backgrounds (vibes).

## Project Structure

*   `index.html`: The main HTML file.
*   `style.css`: The main stylesheet.
*   `js/main.js`: The main JavaScript file, which now includes the file lists for music and vibes.
*   `music/`: A directory containing music files.
*   `vibes/`: A directory containing video files for backgrounds.

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

## Current Task: Dynamic File Loading

**Objective:** Modify the application to dynamically load music and vibes from their respective folders, removing the need for hardcoded file lists.

**Steps:**

1.  **Consolidate File Lists:** The `musicFiles` and `vibeFiles` arrays, previously in a separate `js/file-lists.js` file, have been embedded directly into `js/main.js`.
2.  **Update `index.html`:** The `<script>` tag for `js/file-lists.js` has been removed.
3.  **Update `js/main.js`:** The hardcoded file lists are now at the top of the file, and the rest of the code uses these arrays to load the music and vibes.
