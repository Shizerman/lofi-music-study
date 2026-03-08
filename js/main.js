const musicFiles = [
    "music/123456.mp3",
    "music/15 min car ride to work.mp3",
    "music/2 for 1 for none.mp3",
    "music/80's montage.mp3",
    "music/Catnip.mp3",
    "music/Forgot my tie.mp3",
    "music/General Liability.mp3",
    "music/Going on.mp3",
    "music/Harpsidoodles.mp3",
    "music/Horns that shed a tear.mp3",
    "music/If I were a car horn.mp3",
    "music/Making a mixtape.mp3",
    "music/My main man Blorg.mp3",
    "music/Not time.mp3",
    "music/Ode to my last drop of coffee.mp3",
    "music/SRV + Anchorman.mp3",
    "music/Samurai stalker.mp3",
    "music/Snake bite.mp3",
    "music/Vitamin B3.mp3",
    "music/Wait one more time.mp3",
    "music/Walkie Talkie.mp3",
    "music/adjustable skyline.mp3",
    "music/anxious bus stop.mp3",
    "music/avant garde rails.mp3",
    "music/beam me up.mp3",
    "music/beep bop boop.mp3",
    "music/boombox instrumental.mp3",
    "music/city stroll.mp3",
    "music/classic.mp3",
    "music/coffee and tapas.mp3",
    "music/coffee turntable.mp3",
    "music/crackle snap pop.mp3",
    "music/dino shuffle.mp3",
    "music/dizzying rain.mp3",
    "music/edge of the solar system.mp3",
    "music/egg day.mp3",
    "music/event horizon.mp3",
    "music/everythings anew.mp3",
    "music/flowers in the window.mp3",
    "music/funk yeah.mp3",
    "music/i cant take me off the sand.mp3",
    "music/interlude.mp3",
    "music/jazz flute from the window.mp3",
    "music/jet ski thru your heart.mp3",
    "music/lamp love.mp3",
    "music/laser eye surgery.mp3",
    "music/last day of vacation goodbyes.mp3",
    "music/last song too.mp3",
    "music/layer cakes.mp3",
    "music/metamorphishize.mp3",
    "music/midivibes.mp3",
    "music/modem love.mp3",
    "music/never had a beer with you.mp3",
    "music/organicize.mp3",
    "music/our little beach shack.mp3",
    "music/piano horn.mp3",
    "music/piano vocals.mp3",
    "music/relatively relativity.mp3",
    "music/rhodeway.mp3",
    "music/slow fasting.mp3",
    "music/string instrument.mp3",
    "music/sunny rain.mp3",
    "music/the news waits for no one.mp3",
    "music/the party must go on, but not like this.mp3",
    "music/tuba fish sandwich.mp3",
    "music/vibin' and thrivin'.mp3",
    "music/we'll be right back after this break.mp3",
    "music/whet your whistle.mp3",
    "music/won't you come back.mp3",
    "music/your life in infrared.mp3"
];
const vibeFiles = ["vibes/Gen-4_Turbo_Can_you_0_5x.mp4","vibes/Lo_Fi_Ski_Game_Video_Generation.mp4","vibes/Lofi_Tokyo_Night_Walk_Video.mp4","vibes/Old_TV_News_Broadcast.mp4","vibes/Rainy_Day_Window_View_Video.mp4","vibes/Tropical_Beach_Paradise_Video_Generation.mp4","vibes/Urban_Coffee_Shop_Video_Generation.mp4"];

const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
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
const playerCard = document.querySelector('.player-card');

const audioPlayer = new Audio();

// 9-position player placement
const PLAYER_POSITIONS = {
    tl: { left: '1rem', top: '1rem', right: 'auto', bottom: 'auto', transform: 'none' },
    tc: { left: '50%', top: '1rem', right: 'auto', bottom: 'auto', transform: 'translateX(-50%)' },
    tr: { left: 'auto', top: '1rem', right: '1rem', bottom: 'auto', transform: 'none' },
    ml: { left: '1rem', top: '50%', right: 'auto', bottom: 'auto', transform: 'translateY(-50%)' },
    mc: { left: '50%', top: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' },
    mr: { left: 'auto', top: '50%', right: '1rem', bottom: 'auto', transform: 'translateY(-50%)' },
    bl: { left: '1rem', top: 'auto', right: 'auto', bottom: '1rem', transform: 'none' },
    bc: { left: '50%', top: 'auto', right: 'auto', bottom: '1rem', transform: 'translateX(-50%)' },
    br: { left: 'auto', top: 'auto', right: '1rem', bottom: '1rem', transform: 'none' }
};

function setPlayerPosition(key) {
    if (!playerCard || !PLAYER_POSITIONS[key]) return;
    const p = PLAYER_POSITIONS[key];
    playerCard.style.left = p.left;
    playerCard.style.top = p.top;
    playerCard.style.right = p.right;
    playerCard.style.bottom = p.bottom;
    playerCard.style.transform = p.transform;
    document.querySelectorAll('.position-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-position') === key);
    });
}

document.querySelectorAll('.position-btn').forEach((btn) => {
    btn.addEventListener('click', () => setPlayerPosition(btn.getAttribute('data-position')));
});

// Music
let originalTracks = [];
let tracks = [];
let currentTrackIndex = 0;

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

const PREV_RESTART_THRESHOLD_SEC = 5;

function prevTrack() {
    if (tracks.length === 0) return;
    if (audioPlayer.currentTime > PREV_RESTART_THRESHOLD_SEC) {
        audioPlayer.currentTime = 0;
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.querySelector('.material-icons').textContent = 'pause';
        }
        return;
    }
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

// Keyboard: Space = play/pause only; prevent default so page doesn't scroll
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseTrack();
    }
});

// Initial setup
function initialize() {
    loadPlaylist();
    loadVibes();
    setVolume();
    updateTimerDisplay();
}

initialize();
