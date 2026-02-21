// Music and vibe lists are loaded from file-list.json (or /api/files when using the dev server)
let musicFiles = [];
let vibeFiles = [];

const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const volumeSlider = document.getElementById('volume-slider');
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const increaseTimerBtn = document.getElementById('increase-timer-btn');
const decreaseTimerBtn = document.getElementById('decrease-timer-btn');
const changeVibeBtn = document.getElementById('change-vibe-btn');
const vibeVideoBackground = document.getElementById('vibe-video-background');
const songTitle = document.getElementById('song-title');
const songProgressBar = document.getElementById('song-progress-bar');

const audioPlayer = new Audio();

// Music
let originalTracks = [];
let tracks = [];
let currentTrackIndex = 0;
let isShuffleOn = true; // Shuffle by default

// Pomodoro
let timer;
let isTimerRunning = false;
let defaultTime = 1500; // 25 minutes in seconds
let timeLeft = defaultTime;
let audioCtx; // For the buzzer

// Vibes
let vibes = [];
let currentVibeIndex = -1;

vibeVideoBackground.addEventListener('error', function(e) {
    console.error("Error with video file:", vibeVideoBackground.src);
    console.error("Error details:", e);
});

// If a song fails to load, skip to the next one
audioPlayer.addEventListener('error', (e) => {
    console.error("Error playing audio, skipping to next track:", e);
    nextTrack();
});

function shuffleTracks() {
    tracks = [...originalTracks];
    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
}

function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle('shuffle-active', isShuffleOn);
    if (isShuffleOn) {
        shuffleTracks();
        loadTrack(0);
        if (!audioPlayer.paused) audioPlayer.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
    } else {
        const currentUrl = tracks[currentTrackIndex].url;
        tracks = [...originalTracks];
        const idx = tracks.findIndex(t => t.url === currentUrl);
        loadTrack(idx >= 0 ? idx : 0);
        if (!audioPlayer.paused) audioPlayer.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
    }
}

function loadPlaylist() {
    if (!musicFiles || musicFiles.length === 0) {
        console.error("No music files found.");
        return;
    }
    originalTracks = musicFiles.map(file => ({
        url: file,
        title: file.split('/').pop().replace('.mp3', '').replace(/_/g, ' ')
    }));

    shuffleTracks();
    shuffleBtn.classList.add('shuffle-active');
    const startingTrackIndex = Math.floor(Math.random() * tracks.length);
    loadTrack(startingTrackIndex);
}

function loadVibes() {
    if (!vibeFiles || vibeFiles.length === 0) {
        console.error("No vibe files found.");
        return;
    }
    vibes = vibeFiles.map(file => ({
        url: file,
        name: file.split('/').pop().replace('.mp4', '').replace(/_/g, ' ')
    }));

    currentVibeIndex = Math.floor(Math.random() * vibes.length);
    changeVibe(true);
}

function updateSongTitle() {
    if (tracks.length > 0) {
        songTitle.textContent = tracks[currentTrackIndex].title;
    }
}

function loadTrack(trackIndex) {
    if (tracks.length > 0) {
        currentTrackIndex = trackIndex;
        audioPlayer.src = tracks[currentTrackIndex].url;
        updateSongTitle();
    }
}

function playPauseTrack() {
    if (tracks.length === 0) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
    } else {
        audioPlayer.pause();
        playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
    }
}

function prevTrack() {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseBtn.querySelector('.material-icons').textContent = 'pause';
}

function nextTrack() {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseBtn.querySelector('.material-icons').textContent = 'pause';
}

function setVolume() {
    audioPlayer.volume = volumeSlider.value;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playBuzzer() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
            return;
        }
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function startTimer() {
    isTimerRunning = true;
    startTimerBtn.textContent = 'Pause';
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            isTimerRunning = false;
            startTimerBtn.textContent = 'Start';
            playBuzzer();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    startTimerBtn.textContent = 'Start';
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    startTimerBtn.textContent = 'Start';
    timeLeft = defaultTime;
    updateTimerDisplay();
}

function increaseTimer() {
    if (isTimerRunning) return; 
    defaultTime += 60;
    resetTimer();
}

function decreaseTimer() {
    if (isTimerRunning) return;
    if (defaultTime > 60) {
        defaultTime -= 60;
        resetTimer();
    }
}

function changeVibe(initialLoad = false) {
    if (vibes.length === 0) return;
    vibeVideoBackground.style.opacity = 0;
    setTimeout(() => {
        if (!initialLoad) {
            currentVibeIndex = (currentVibeIndex + 1) % vibes.length;
        }
        vibeVideoBackground.src = vibes[currentVibeIndex].url;
        vibeVideoBackground.playbackRate = 0.69;
        vibeVideoBackground.play();
        vibeVideoBackground.style.opacity = 1;
    }, 500);
}

function updateProgress() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        songProgressBar.style.width = `${progressPercent}%`;
    }
}

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextTrack);
playPauseBtn.addEventListener('click', playPauseTrack);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
volumeSlider.addEventListener('input', setVolume);
startTimerBtn.addEventListener('click', () => {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});
resetTimerBtn.addEventListener('click', resetTimer);
increaseTimerBtn.addEventListener('click', increaseTimer);
decreaseTimerBtn.addEventListener('click', decreaseTimer);
changeVibeBtn.addEventListener('click', () => changeVibe());

// Load file list from /api/files (dev server) or file-list.json (static), then initialize
async function fetchFileList() {
    try {
        const res = await fetch('/api/files');
        if (res.ok) {
            const data = await res.json();
            return { music: data.music || [], vibes: data.vibes || [] };
        }
    } catch (_) {}
    try {
        const res = await fetch('file-list.json');
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error('Could not load file-list.json. Run: npm run update-files', e);
    }
    return { music: [], vibes: [] };
}

function initialize(musicList, vibeList) {
    musicFiles = musicList || [];
    vibeFiles = vibeList || [];
    loadPlaylist();
    loadVibes();
    setVolume();
    updateTimerDisplay();
}

fetchFileList().then(({ music, vibes }) => initialize(music, vibes));
