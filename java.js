const audioPlayer = document.getElementById('audio-player');
const masterPlay = document.getElementById('master-play');
const progressBar = document.getElementById('progress-bar');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentArt = document.querySelector('.current-art');
const currentTimeSpan = document.getElementById('current-time');
const totalDurationSpan = document.getElementById('total-duration');

// Song Data
const songs = [
    {
        title: "Don't Even Text",
        artist: "Tsumyoki x Gini",
        path: "Tsumyoki_X_Gini don t Even Text.mp4",
        coverPath: "cover1.png"
    },
    {
        title: "See You Again",
        artist: "Wiz Khalifa",
        path: "Wiz_Khalifa_-_See_You_Again_.webm",
        coverPath: "cover2.png"
    },
    {
        title: "Sapphire",
        artist: "Ed Sheeran",
        path: "Ed_Sheeran_-_Sapphire_.webm",
        coverPath: "cover3.png"
    },
    {
        title: "Perfect",
        artist: "Ed Sheeran",
        path: "Ed_sheeran_.mp4",
        coverPath: "cover4.png"
    }
];

let songIndex = 0;
let isPlaying = false;

// Playlist Data
let userPlaylists = [
    { name: "My Playlist #1", songs: [] },
    { name: "Driving Mix", songs: [] },
    { name: "Relaxation", songs: [] }
];

// Load initial song
loadSong(songs[songIndex]);

// Dynamic Rendering Engine
function createSongCard(song, index, originalIndex) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-index', originalIndex);
    if (isPlaying && songIndex === originalIndex) {
        card.classList.add('active-card');
    }

    card.onclick = () => playSong(originalIndex);

    const playIconClass = (isPlaying && songIndex === originalIndex) ? 'fa-pause' : 'fa-play';

    card.innerHTML = `
        <div class="album-art" style="background-image: url('${song.coverPath}');">
            <i class="fas ${playIconClass} play-btn"></i>
            <i class="fas fa-plus add-to-playlist-btn" onclick="event.stopPropagation(); showPlaylistMenu(${originalIndex})" title="Add to Playlist"></i>
        </div>
        <div class="card-text">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        </div>
    `;
    return card;
}

function renderContent(filterText = "") {
    const featuredContainer = document.getElementById('featured-cards-container');
    const searchResultsSection = document.getElementById('search-results-section');
    const searchResultsContainer = document.getElementById('search-results-container');
    const defaultSections = document.getElementById('default-sections');


    if (filterText.trim() === "") {
        searchResultsSection.style.display = 'none';
        defaultSections.style.display = 'block';

        featuredContainer.innerHTML = '';


        songs.forEach((song, index) => {
            featuredContainer.appendChild(createSongCard(song, index, index));
        });

    } else {
        searchResultsSection.style.display = 'block';
        defaultSections.style.display = 'none';
        searchResultsContainer.innerHTML = '';

        const filtered = songs.map((s, i) => ({ ...s, originalIndex: i }))
            .filter(s => s.title.toLowerCase().includes(filterText.toLowerCase()) ||
                s.artist.toLowerCase().includes(filterText.toLowerCase()));

        if (filtered.length === 0) {
            searchResultsContainer.innerHTML = '<p style="padding: 20px; color: #b3b3b3;">No results found for "' + filterText + '"</p>';
        } else {
            filtered.forEach(song => {
                searchResultsContainer.appendChild(createSongCard(song, null, song.originalIndex));
            });
        }
    }
}

// Search Input Listener
document.getElementById('search-input').addEventListener('input', (e) => {
    renderContent(e.target.value);
});

// Initial Render
renderContent();
updatePlayIcons();

function loadSong(song) {
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    audioPlayer.src = song.path;

    // Update current art
    currentArt.style.backgroundImage = `url('${song.coverPath}')`;

    // Reset progress bar visually
    progressBar.value = 0;
    progressBar.style.background = `linear-gradient(to right, #00d4ff 0%, #535353 0%)`;
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        resumeSong();
    }
}

// Event-driven UI Updates
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayIcons();
});

audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayIcons();
});

function updatePlayIcons() {
    const isAudioPlaying = !audioPlayer.paused;
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        const index = parseInt(card.getAttribute('data-index'));
        const icon = card.querySelector('.play-btn');
        if (!icon) return;

        const oldClass = icon.className;
        let newClass = 'fas play-btn';

        if (index === songIndex) {
            card.classList.add('active-card');
            newClass += isAudioPlaying ? ' fa-pause' : ' fa-play';
        } else {
            card.classList.remove('active-card');
            newClass += ' fa-play';
        }

        // Only re-trigger if the icon actually changes
        if (oldClass !== newClass) {
            icon.className = newClass;
            // Force re-trigger animation
            icon.style.animation = 'none';
            icon.offsetHeight; /* trigger reflow */
            icon.style.animation = '';
        }
    });

    const oldMasterClass = masterPlay.className;
    const newMasterClass = isAudioPlaying ? 'fas fa-pause-circle' : 'fas fa-play-circle';

    if (oldMasterClass !== newMasterClass) {
        masterPlay.className = newMasterClass;
        masterPlay.style.animation = 'none';
        masterPlay.offsetHeight; /* trigger reflow */
        masterPlay.style.animation = '';
    }
}

function resumeSong() {
    audioPlayer.play();
}

function pauseSong() {
    audioPlayer.pause();
}

// Play specific song from card
function playSong(index) {
    if (songIndex === index) {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    } else {
        songIndex = index;
        loadSong(songs[songIndex]);
        audioPlayer.play();
    }
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) resumeSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) resumeSong();
}

const volumeBar = document.getElementById('volume-bar');

// Set initial volume
audioPlayer.volume = 0.5;
volumeBar.value = 0.5;

// Volume Control logic
volumeBar.addEventListener('input', (e) => {
    const val = e.target.value;
    audioPlayer.volume = val;
    volumeBar.style.background = `linear-gradient(to right, #00d4ff ${val * 100}%, #535353 ${val * 100}%)`;
});

// Set initial visual for volume bar
volumeBar.style.background = `linear-gradient(to right, #00d4ff 50%, #535353 50%)`;

// Update Progress Bar
audioPlayer.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    // Time formatting
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    totalDurationSpan.textContent = formatTime(duration);
    currentTimeSpan.textContent = formatTime(currentTime);

    // Update progress bar background for Spotify look
    const val = progressBar.value;
    progressBar.style.background = `linear-gradient(to right, #00d4ff ${val}%, #535353 ${val}%)`;
});

// Set Progress
progressBar.addEventListener('input', (e) => {
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (e.target.value / 100) * duration;
});

// Auto next song
audioPlayer.addEventListener('ended', nextSong);

// Feature states
let isLiked = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let previousVolume = 0.5;

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Navigation Logic
function showSection(sectionName) {
    const sections = ['default-sections', 'search-results-section', 'library-section', 'liked-section', 'playlist-detail-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Reset active nav items (Sidebar & Mobile)
    document.querySelectorAll('.nav-menu li, .mobile-nav-item').forEach(el => el.classList.remove('active'));

    if (sectionName === 'home') {
        document.getElementById('default-sections').style.display = 'block';
        // Highlight in Sidebar
        const homeSidebar = document.querySelector('.nav-menu li:nth-child(1)');
        if (homeSidebar) homeSidebar.classList.add('active');
        // Highlight in Mobile
        const homeMobile = document.querySelector('.mobile-nav-item:nth-child(1)');
        if (homeMobile) homeMobile.classList.add('active');

    } else if (sectionName === 'search') {
        document.getElementById('search-input').focus();
        const searchSidebar = document.querySelector('.nav-menu li:nth-child(2)');
        if (searchSidebar) searchSidebar.classList.add('active');
        const searchMobile = document.querySelector('.mobile-nav-item:nth-child(2)');
        if (searchMobile) searchMobile.classList.add('active');

        if (document.getElementById('search-input').value.trim() !== "") {
            document.getElementById('search-results-section').style.display = 'block';
        } else {
            document.getElementById('default-sections').style.display = 'block';
        }

    } else if (sectionName === 'library') {
        document.getElementById('library-section').style.display = 'block';
        const libSidebar = document.querySelector('.nav-menu li:nth-child(3)');
        if (libSidebar) libSidebar.classList.add('active');
        const libMobile = document.querySelector('.mobile-nav-item:nth-child(3)');
        if (libMobile) libMobile.classList.add('active');
        renderLibrary();

    } else if (sectionName === 'liked') {
        document.getElementById('liked-section').style.display = 'block';
        const likedLi = Array.from(document.querySelectorAll('.nav-menu li')).find(li => li.innerText.includes('Liked Songs'));
        if (likedLi) likedLi.classList.add('active');
        renderLikedSongs();
    } else if (sectionName === 'playlist-detail') {
        document.getElementById('playlist-detail-section').style.display = 'block';
        // Keep Library tab active
        const libSidebar = document.querySelector('.nav-menu li:nth-child(3)');
        if (libSidebar) libSidebar.classList.add('active');
        const libMobile = document.querySelector('.mobile-nav-item:nth-child(3)');
        if (libMobile) libMobile.classList.add('active');
    }

    // Close sidebar on mobile navigation
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        if (overlay) overlay.style.display = 'none';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('active');
        if (overlay) {
            overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
        }
    }
}

// Data Handling for Likes
let likedSongsIndices = new Set(); // Store indices of liked songs

function toggleLike() {
    // Current song index is 'songIndex'
    if (likedSongsIndices.has(songIndex)) {
        likedSongsIndices.delete(songIndex);
        showToast('Removed from Liked Songs');
    } else {
        likedSongsIndices.add(songIndex);
        showToast('Added to Liked Songs');
    }
    updateLikeButtonVisual();

    // If we are on Liked page, re-render
    if (document.getElementById('liked-section').style.display === 'block') {
        renderLikedSongs();
    }
}

function updateLikeButtonVisual() {
    const likeBtn = document.getElementById('like-btn');
    if (likedSongsIndices.has(songIndex)) {
        likeBtn.classList.remove('far');
        likeBtn.classList.add('fas', 'liked');
    } else {
        likeBtn.classList.remove('fas', 'liked');
        likeBtn.classList.add('far');
    }
}

// Hook into loadSong to update like button status
const originalLoadSong = loadSong;
loadSong = function (song) {
    originalLoadSong(song);
    updateLikeButtonVisual();
}

function renderLikedSongs() {
    const container = document.getElementById('liked-container');
    container.innerHTML = '';

    if (likedSongsIndices.size === 0) {
        container.innerHTML = '<p style="color: #b3b3b3; font-size: 14px;">No liked songs yet.</p>';
        return;
    }

    likedSongsIndices.forEach(index => {
        const song = songs[index];
        container.appendChild(createSongCard(song, index, index));
    });
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    const shuffleBtn = document.getElementById('shuffle-btn');
    shuffleBtn.classList.toggle('active-icon', isShuffle);
    showToast(isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    const repeatBtn = document.getElementById('repeat-btn');
    repeatBtn.classList.toggle('active-icon', isRepeat);
    audioPlayer.loop = isRepeat;
    showToast(isRepeat ? 'Repeat ON' : 'Repeat OFF');
}

function toggleMute() {
    isMuted = !isMuted;
    const volumeIcon = document.getElementById('volume-icon');
    if (isMuted) {
        previousVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        volumeBar.value = 0;
        volumeIcon.className = 'fas fa-volume-mute';
        showToast('Muted');
    } else {
        audioPlayer.volume = previousVolume || 0.5;
        volumeBar.value = audioPlayer.volume;
        volumeIcon.className = 'fas fa-volume-up';
        showToast('Unmuted');
    }
    // Update visual track
    const val = volumeBar.value;
    volumeBar.style.background = `linear-gradient(to right, #00d4ff ${val * 100}%, #535353 ${val * 100}%)`;
}
function renderLibrary() {
    const container = document.getElementById('library-container');
    container.innerHTML = ''; // Clear to re-render

    userPlaylists.forEach((pl, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
             <div class="album-art" style="background-color: #333; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-music" style="font-size: 40px; color: #7f7f7f;"></i>
            </div>
            <h3>${pl.name}</h3>
            <p>By You • ${pl.songs.length} songs</p>
        `;
        card.onclick = () => showPlaylistView(index);
        container.appendChild(card);
    });
}

function showPlaylistView(plIndex) {
    const playlist = userPlaylists[plIndex];
    showSection('playlist-detail');

    document.getElementById('playlist-detail-title').textContent = playlist.name;
    document.getElementById('playlist-detail-stats').textContent = `${playlist.songs.length} songs`;

    const container = document.getElementById('playlist-songs-container');
    container.innerHTML = '';

    if (playlist.songs.length === 0) {
        container.innerHTML = '<p style="color: #b3b3b3; font-size: 14px; padding: 20px;">This playlist is empty. Add some songs!</p>';
        return;
    }

    playlist.songs.forEach(songIdx => {
        const song = songs[songIdx];
        container.appendChild(createSongCard(song, songIdx, songIdx));
    });
}

function createNewPlaylist() {
    const name = prompt("Enter playlist name:", `My Playlist #${userPlaylists.length + 1}`);
    if (name && name.trim() !== "") {
        userPlaylists.unshift({ name: name, songs: [] });
        showSection('library');
        showToast(`Created playlist: ${name}`);
    }
}

let pendingSongIndex = null;

function showPlaylistMenu(index) {
    pendingSongIndex = index;
    const modal = document.getElementById('playlist-modal');
    const choices = document.getElementById('playlist-choices');
    choices.innerHTML = '';

    userPlaylists.forEach((pl, plIndex) => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 12px;
            background: #282828;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
        `;
        item.innerHTML = `<span>${pl.name}</span> <span style="color: #b3b3b3; font-size: 12px;">${pl.songs.length} songs</span>`;
        item.onmouseover = () => item.style.background = '#3e3e3e';
        item.onmouseout = () => item.style.background = '#282828';
        item.onclick = () => addToPlaylist(plIndex);
        choices.appendChild(item);
    });

    // Option to create new
    const createBtn = document.createElement('div');
    createBtn.style.cssText = `
        padding: 12px;
        background: #00d4ff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        margin-top: 10px;
    `;
    createBtn.innerText = "+ Create New Playlist";
    createBtn.onclick = () => {
        closePlaylistModal();
        createNewPlaylist();
    };
    choices.appendChild(createBtn);

    modal.style.display = 'flex';
}

function closePlaylistModal() {
    document.getElementById('playlist-modal').style.display = 'none';
}

function addToPlaylist(plIndex) {
    const playlist = userPlaylists[plIndex];
    if (playlist.songs.includes(pendingSongIndex)) {
        showToast(`"${songs[pendingSongIndex].title}" is already in ${playlist.name}`);
    } else {
        playlist.songs.push(pendingSongIndex);
        showToast(`Added to ${playlist.name}`);
    }
    closePlaylistModal();
}

// Generate Background Bubbles
function createBubbles() {
    const container = document.querySelector('.bubble-container');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.animationDuration = `${duration}s`;

        container.appendChild(bubble);
    }
}

// Update Initial setup to include bubbles
const oldOnload = window.onload;
window.onload = function () {
    if (oldOnload) oldOnload();
    createBubbles();
};

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    showToast(`Logged in as ${email}`);
    closeLoginModal();

    // Update login button to show "Profile"
    const loginBtn = document.querySelector('.user-menu .login');
    if (loginBtn) {
        loginBtn.textContent = 'Profile';
        loginBtn.onclick = () => showToast('Profile settings coming soon!');
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('login-modal');
    if (event.target == modal) {
        closeLoginModal();
    }
};

function showAlert() {
    showToast("Feature coming soon!");
}

function addCurrentToPlaylist() {
    showPlaylistMenu(songIndex);
}
