const musicFiles = ["music/123456.mp3","music/Catnip.mp3","music/Forgot my tie.mp3","music/General Liability.mp3","music/Harpsidoodles.mp3","music/Horns that shed a tear.mp3","music/Making a mixtape.mp3","music/Not time.mp3","music/Ode to my last drop of coffee.mp3","music/SRV + Anchorman.mp3","music/Snake bite.mp3","music/Vitamin B3.mp3","music/Wait one more time.mp3","music/Walkie Talkie.mp3","music/adjustable skyline.mp3","music/anxious bus stop.mp3","music/beam me up.mp3","music/beep bop boop.mp3","music/boombox instrumental.mp3","music/city stroll.mp3","music/dizzying rain.mp3","music/everythings anew.mp3","music/flowers in the window.mp3","music/i cant take me off the sand.mp3","music/jazz flute from the window.mp3","music/lamp love.mp3","music/metamorphishize.mp3","music/modem love.mp3","music/never had a beer with you.mp3","music/organicize.mp3","music/piano horn.mp3","music/piano vocals.mp3"];
const vibeFiles = ["vibes/Gen-4_Turbo_Can_you_0_5x.mp4","vibes/Lo_Fi_Ski_Game_Video_Generation.mp4","vibes/Lofi_Tokyo_Night_Walk_Video.mp4","vibes/Rainy_Day_Window_View_Video.mp4","vibes/Urban_Coffee_Shop_Video_Generation.mp4"];

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
let isShuffling = false;

// Pomodoro
let timer;
let defaultTime = 1500; // 25 minutes in seconds
let timeLeft = defaultTime;

// Vibes
let vibes = [];
let currentVibeIndex = -1;

vibeVideoBackground.addEventListener('error', function(e) {
    console.error("Error with video file:", vibeVideoBackground.src);
    console.error("Error details:", e);
});

function loadPlaylist() {
    if (!musicFiles || musicFiles.length === 0) {
        console.error("No music files found.");
        return;
    }
    originalTracks = musicFiles.map(file => ({
        url: file,
        title: file.split('/').pop().replace('.mp3', '').replace(/_/g, ' ')
    }));
    tracks = [...originalTracks];
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

    // Start with a random vibe
    currentVibeIndex = Math.floor(Math.random() * vibes.length);
    changeVibe(true); // Pass true to indicate initial load
}

function shuffleTracks() {
    let shuffled = [...originalTracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    tracks = shuffled;
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    shuffleBtn.classList.toggle('shuffle-active', isShuffling);

    const currentSong = tracks[currentTrackIndex];

    if (isShuffling) {
        shuffleTracks();
        const newIndex = tracks.findIndex(track => track.title === currentSong.title);
        if (newIndex !== -1) {
            [tracks[currentTrackIndex], tracks[newIndex]] = [tracks[newIndex], tracks[currentTrackIndex]];
        }
    } else {
        tracks = [...originalTracks];
        currentTrackIndex = tracks.findIndex(track => track.title === currentSong.title);
    }
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

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            alert("Pomodoro session finished!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = defaultTime;
    updateTimerDisplay();
}

function increaseTimer() {
    defaultTime += 60;
    resetTimer();
}

function decreaseTimer() {
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
shuffleBtn.addEventListener('click', toggleShuffle);
playPauseBtn.addEventListener('click', playPauseTrack);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
volumeSlider.addEventListener('input', setVolume);
startTimerBtn.addEventListener('click', startTimer);
resetTimerBtn.addEventListener('click', resetTimer);
increaseTimerBtn.addEventListener('click', increaseTimer);
decreaseTimerBtn.addEventListener('click', decreaseTimer);
changeVibeBtn.addEventListener('click', () => changeVibe());

// Initial setup
function initialize() {
    loadPlaylist();
    loadVibes();
    setVolume();
    updateTimerDisplay();
}

initialize();
