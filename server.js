const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ROOT = __dirname;

function listMedia(dir, ext) {
    const fullPath = path.join(ROOT, dir);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath)
        .filter((f) => path.extname(f).toLowerCase() === ext)
        .sort()
        .map((f) => `${dir}/${f}`);
}

app.get('/api/files', (req, res) => {
    res.json({
        music: listMedia('music', '.mp3'),
        vibes: listMedia('vibes', '.mp4')
    });
});

app.use(express.static(ROOT));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lofi player at http://localhost:${port}`));
