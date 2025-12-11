// ===================================
// CHRONICLE REFINED - PRE-SPRINT 2
// Corrected for Actual HTML Structure
// ===================================

// State Management - The Sacred Record
const ChronicleApp = {
    currentMode: 'novelist',
    currentUser: 'tyrrel',
    currentSpace: 'desk',
    
    currentScene: {
        id: 'scene-001',
        title: 'Opening Scene',
        content: '',
        mode: 'novelist',
        wordCount: 0,
        pageCount: 0,
        lastModified: new Date(),
        author: 'tyrrel'
    },
    
    scenes: [],
    
    currentSession: {
        id: null,
        startTime: null,
        mode: 'novelist',
        user: 'tyrrel',
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: false
    },
    
    settings: {
        novelistFont: 'Crimson Text',
        screenwriterFont: 'Courier Prime',
        autoSaveInterval: 3000
    },
    
    autoSaveTimer: null,
    sessionTimer: null,
    sessionStartTime: null,
    focusModeActive: false
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✝️ Chronicle Refined - Aligned with Truth', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Every good work perfectly joined together"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    
    initializeApp();
    setupEventListeners();
    detectSession();
    loadSavedData();
    startCustomCursor();
    enhancePlaceholders();
});

function initializeApp() {
    console.log('Initializing Chronicle...');
    
    const savedMode = localStorage.getItem('chronicle_current_mode') || 'novelist';
    const savedUser = localStorage.getItem('chronicle_current_user') || 'tyrrel';
    
    switchMode(savedMode, false);
    switchUser(savedUser, false);
    applyModeFont();
    startSessionTimer();
    updateWordCount();
    
    console.log('Chronicle initialized - Foundation is firm');
}

// ===================================
// ENHANCE PLACEHOLDERS
// ===================================

function enhancePlaceholders() {
    // Archive enhancement
    const archiveContainer = document.querySelector('#archive .archive-container');
    if (archiveContainer) {
        archiveContainer.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <h2 class="placeholder-title">The Archive</h2>
                <p class="placeholder-subtitle">Scene Library & Organization</p>
                <p class="placeholder-description">
                    Here you shall organize scenes, navigate between chapters, and manage your manuscript's structure. 
                    Scene lists, act organization, and version history will dwell in this space.
                </p>
                <div class="placeholder-scripture">
                    For everything there is a season, and a time for every matter under heaven
                    <span class="placeholder-reference">— Ecclesiastes 3:1</span>
                </div>
                <div class="placeholder-coming-soon">SPRINT 3: SCENE MANAGEMENT</div>
            </div>
        `;
    }
    
    // Covenant enhancement
    const covenantContainer = document.querySelector('#covenant .covenant-container');
    if (covenantContainer) {
        covenantContainer.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
                <h2 class="placeholder-title">The Covenant</h2>
                <p class="placeholder-subtitle">Structure & Craft Tools</p>
                <p class="placeholder-description">
                    In this space, you shall weave together character profiles, world-building notes, 
                    plot outlines, and thematic threads. The sacred architecture of Joseph's journey.
                </p>
                <div class="placeholder-scripture">
                    Make this tabernacle exactly like the pattern I will show you
                    <span class="placeholder-reference">— Exodus 25:9</span>
                </div>
                <div class="placeholder-coming-soon">SPRINT 4: CHARACTER INTEGRATION</div>
            </div>
        `;
    }
    
    // Altar enhancement
    const altarContainer = document.querySelector('#altar .altar-container');
    if (altarContainer) {
        altarContainer.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L12 7"/>
                    <path d="M12 7C10.5 7 9 8 9 9.5C9 11 10.5 12 12 12C13.5 12 15 11 15 9.5C15 8 13.5 7 12 7Z"/>
                    <path d="M12 12L12 22"/>
                    <path d="M8 22L16 22"/>
                    <circle cx="12" cy="7" r="8" opacity="0.2"/>
                </svg>
                <h2 class="placeholder-title">The Altar</h2>
                <p class="placeholder-subtitle">Prayer & Reflection</p>
                <p class="placeholder-description">
                    Here shall dwell your prayer history, session summaries, and spiritual reflections. 
                    Each writing session begins and ends with sacred intention.
                </p>
                <div class="placeholder-scripture">
                    Whatever you do, work at it with all your heart, as working for the Lord
                    <span class="placeholder-reference">— Colossians 3:23</span>
                </div>
                <div class="placeholder-coming-soon">SPRINT 9: SESSION SUMMARY</div>
            </div>
        `;
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Mode switching
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode, true));
    });
    
    // User switching
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => switchUser(btn.dataset.user, true));
    });
    
    // Space navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchSpace(tab.dataset.space));
    });
    
    // Font selector
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.addEventListener('change', (e) => changeFont(e.target.value));
    }
    
    // Focus mode button (use actual ID: focusModeBtn)
    const focusModeBtn = document.getElementById('focusModeBtn');
    if (focusModeBtn) {
        focusModeBtn.addEventListener('click', enterFocusMode);
    }
    
    // ESC to exit focus mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ChronicleApp.focusModeActive) {
            exitFocusMode();
        }
    });
    
    // Scene title input
    const sceneTitle = document.getElementById('sceneTitle');
    if (sceneTitle) {
        sceneTitle.addEventListener('input', (e) => {
            ChronicleApp.currentScene.title = e.target.value;
            scheduleAutoSave();
        });
    }
    
    // Writing surface input (use actual ID: writingSurface)
    const writingSurface = document.getElementById('writingSurface');
    if (writingSurface) {
        writingSurface.addEventListener('input', () => {
            updateWordCount();
            scheduleAutoSave();
        });
    }
    
    // Prayer modal
    document.getElementById('prayerBtn')?.addEventListener('click', showPrayerModal);
    document.getElementById('closePrayerModal')?.addEventListener('click', hidePrayerModal);
    document.getElementById('skipPrayer')?.addEventListener('click', () => {
        ChronicleApp.currentSession.prayerOffered = false;
        hidePrayerModal();
    });
    document.getElementById('offerPrayer')?.addEventListener('click', () => {
        ChronicleApp.currentSession.prayerOffered = true;
        savePrayer();
        hidePrayerModal();
    });
}

// ===================================
// MODE SWITCHING
// ===================================

function switchMode(mode, shouldSave = true) {
    console.log(`Switching to ${mode} mode`);
    
    ChronicleApp.currentMode = mode;
    
    document.body.classList.remove('mode-novelist', 'mode-screenwriter');
    document.body.classList.add(`mode-${mode}`);
    
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) btn.classList.add('active');
    });
    
    // Update mode banner
    const novelistBanner = document.querySelector('.novelist-banner');
    const screenwriterBanner = document.querySelector('.screenwriter-banner');
    if (novelistBanner && screenwriterBanner) {
        if (mode === 'novelist') {
            novelistBanner.style.display = 'flex';
            screenwriterBanner.style.display = 'none';
        } else {
            novelistBanner.style.display = 'none';
            screenwriterBanner.style.display = 'flex';
        }
    }
    
    applyModeFont();
    
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.value = mode === 'novelist' 
            ? ChronicleApp.settings.novelistFont 
            : ChronicleApp.settings.screenwriterFont;
    }
    
    if (shouldSave) {
        localStorage.setItem('chronicle_current_mode', mode);
    }
}

// ===================================
// USER SWITCHING
// ===================================

function switchUser(user, shouldSave = true) {
    console.log(`Switching to ${user}'s workspace`);
    
    ChronicleApp.currentUser = user;
    
    document.body.classList.remove('user-tyrrel', 'user-trevor');
    document.body.classList.add(`user-${user}`);
    
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === user) btn.classList.add('active');
    });
    
    ChronicleApp.currentScene.author = user;
    
    if (shouldSave) {
        localStorage.setItem('chronicle_current_user', user);
        updateLastActivity();
    }
}

// ===================================
// SPACE NAVIGATION
// ===================================

function switchSpace(space) {
    console.log(`Navigating to ${space}`);
    
    ChronicleApp.currentSpace = space;
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.space === space) tab.classList.add('active');
    });
    
    document.querySelectorAll('.workspace').forEach(workspace => {
        workspace.classList.remove('active');
        if (workspace.id === space) workspace.classList.add('active');
    });
}

// ===================================
// FONT MANAGEMENT
// ===================================

function applyModeFont() {
    const writingSurface = document.getElementById('writingSurface');
    if (!writingSurface) return;
    
    const font = ChronicleApp.currentMode === 'novelist'
        ? ChronicleApp.settings.novelistFont
        : ChronicleApp.settings.screenwriterFont;
    
    const fallback = ChronicleApp.currentMode === 'novelist'
        ? 'Georgia, serif'
        : "'Courier New', monospace";
    
    writingSurface.style.fontFamily = `'${font}', ${fallback}`;
}

function changeFont(fontName) {
    console.log(`Changing font to ${fontName}`);
    
    const writingSurface = document.getElementById('writingSurface');
    if (!writingSurface) return;
    
    if (ChronicleApp.currentMode === 'novelist') {
        ChronicleApp.settings.novelistFont = fontName;
    } else {
        ChronicleApp.settings.screenwriterFont = fontName;
    }
    
    applyModeFont();
    localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
}

// ===================================
// WORD COUNT
// ===================================

let wordCountDebounceTimer = null;

function updateWordCount() {
    clearTimeout(wordCountDebounceTimer);
    wordCountDebounceTimer = setTimeout(() => {
        const writingSurface = document.getElementById('writingSurface');
        if (!writingSurface) return;
        
        const text = writingSurface.innerText || writingSurface.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        ChronicleApp.currentScene.wordCount = wordCount;
        
        // Update display - use actual class: count-number
        const countNumber = document.querySelector('.count-number');
        if (countNumber) {
            countNumber.textContent = wordCount.toLocaleString();
        }
        
        if (ChronicleApp.currentSession.active) {
            ChronicleApp.currentSession.wordsWritten = wordCount;
        }
    }, 300);
}

// ===================================
// FOCUS MODE
// ===================================

function enterFocusMode() {
    console.log('Entering focus mode');
    
    ChronicleApp.focusModeActive = true;
    
    const writingSurface = document.getElementById('writingSurface');
    if (!writingSurface) return;
    
    const focusOverlay = document.createElement('div');
    focusOverlay.className = 'focus-mode-overlay active';
    focusOverlay.innerHTML = `
        <div class="focus-editor" contenteditable="true" id="focusEditor">${writingSurface.innerHTML}</div>
        <div class="focus-exit-hint">Press ESC to exit focus mode</div>
    `;
    
    document.body.appendChild(focusOverlay);
    
    const focusEditor = document.getElementById('focusEditor');
    focusEditor.focus();
    
    // Apply current font to focus editor
    const font = ChronicleApp.currentMode === 'novelist'
        ? ChronicleApp.settings.novelistFont
        : ChronicleApp.settings.screenwriterFont;
    const fallback = ChronicleApp.currentMode === 'novelist'
        ? 'Georgia, serif'
        : "'Courier New', monospace";
    focusEditor.style.fontFamily = `'${font}', ${fallback}`;
    
    focusEditor.addEventListener('input', () => {
        writingSurface.innerHTML = focusEditor.innerHTML;
        updateWordCount();
        scheduleAutoSave();
    });
}

function exitFocusMode() {
    console.log('Exiting focus mode');
    
    ChronicleApp.focusModeActive = false;
    
    const focusOverlay = document.querySelector('.focus-mode-overlay');
    if (focusOverlay) {
        const focusEditor = document.getElementById('focusEditor');
        const writingSurface = document.getElementById('writingSurface');
        if (focusEditor && writingSurface) {
            writingSurface.innerHTML = focusEditor.innerHTML;
        }
        focusOverlay.remove();
    }
}

// ===================================
// SCENE MANAGEMENT
// ===================================

function loadScenes() {
    const savedScenes = localStorage.getItem('chronicle_scenes');
    if (savedScenes) {
        ChronicleApp.scenes = JSON.parse(savedScenes);
    } else {
        ChronicleApp.scenes = [{
            id: 'scene-001',
            title: 'Opening Scene',
            content: '',
            mode: 'novelist',
            wordCount: 0,
            pageCount: 0,
            lastModified: new Date().toISOString(),
            author: 'tyrrel',
            act: 1
        }];
        saveScenes();
    }
}

function saveCurrentScene() {
    const writingSurface = document.getElementById('writingSurface');
    const sceneTitle = document.getElementById('sceneTitle');
    
    if (!writingSurface) return;
    
    ChronicleApp.currentScene.content = writingSurface.innerHTML;
    ChronicleApp.currentScene.title = sceneTitle?.value || 'Untitled Scene';
    ChronicleApp.currentScene.lastModified = new Date().toISOString();
    ChronicleApp.currentScene.author = ChronicleApp.currentUser;
    
    const sceneIndex = ChronicleApp.scenes.findIndex(s => s.id === ChronicleApp.currentScene.id);
    if (sceneIndex !== -1) {
        ChronicleApp.scenes[sceneIndex] = { ...ChronicleApp.currentScene };
    } else {
        ChronicleApp.scenes.push({ ...ChronicleApp.currentScene });
    }
    
    saveScenes();
}

function saveScenes() {
    localStorage.setItem('chronicle_scenes', JSON.stringify(ChronicleApp.scenes));
}

// ===================================
// AUTO-SAVE
// ===================================

function scheduleAutoSave() {
    clearTimeout(ChronicleApp.autoSaveTimer);
    ChronicleApp.autoSaveTimer = setTimeout(() => {
        autoSave();
    }, ChronicleApp.settings.autoSaveInterval);
}

function autoSave() {
    console.log('Auto-saving...');
    saveCurrentScene();
    updateLastActivity();
    
    // Show autosave indicator briefly
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) {
        indicator.classList.add('saving');
        setTimeout(() => {
            indicator.classList.remove('saving');
            indicator.classList.add('saved');
            setTimeout(() => {
                indicator.classList.remove('saved');
            }, 2000);
        }, 500);
    }
}

// ===================================
// SESSION MANAGEMENT
// ===================================

function detectSession() {
    const lastActivity = localStorage.getItem('chronicle_last_activity');
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    
    if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
        console.log('New session detected');
        startNewSession();
    } else {
        console.log('Continuing session');
        continueSession();
    }
}

function startNewSession() {
    ChronicleApp.currentSession = {
        id: `session-${Date.now()}`,
        startTime: Date.now(),
        mode: ChronicleApp.currentMode,
        user: ChronicleApp.currentUser,
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: true
    };
    
    setTimeout(() => showPrayerModal(), 500);
    updateLastActivity();
}

function continueSession() {
    ChronicleApp.currentSession.active = true;
    updateLastActivity();
}

function updateLastActivity() {
    localStorage.setItem('chronicle_last_activity', Date.now().toString());
}

// ===================================
// SESSION TIMER
// ===================================

function startSessionTimer() {
    ChronicleApp.sessionStartTime = Date.now();
    
    ChronicleApp.sessionTimer = setInterval(() => {
        updateSessionTime();
    }, 60000);
    
    updateSessionTime();
}

function updateSessionTime() {
    const now = Date.now();
    const elapsed = now - ChronicleApp.sessionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    
    const sessionTimeDisplay = document.getElementById('sessionTime');
    if (sessionTimeDisplay) {
        if (minutes < 60) {
            sessionTimeDisplay.textContent = `${minutes}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            sessionTimeDisplay.textContent = `${hours}h ${remainingMinutes}m`;
        }
    }
}

// ===================================
// PRAYER MODAL
// ===================================

function showPrayerModal() {
    const modal = document.getElementById('prayerModal');
    if (modal) modal.classList.add('active');
}

function hidePrayerModal() {
    const modal = document.getElementById('prayerModal');
    if (modal) modal.classList.remove('active');
}

function savePrayer() {
    const prayerText = document.getElementById('prayerText')?.value || '';
    
    if (prayerText.trim()) {
        const prayer = {
            text: prayerText,
            timestamp: new Date().toISOString(),
            user: ChronicleApp.currentUser,
            sessionId: ChronicleApp.currentSession.id
        };
        console.log('Prayer saved:', prayer);
    }
    
    document.getElementById('prayerText').value = '';
}

// ===================================
// DATA PERSISTENCE
// ===================================

function loadSavedData() {
    loadScenes();
    
    const savedSettings = localStorage.getItem('chronicle_settings');
    if (savedSettings) {
        ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(savedSettings) };
    }
    
    const currentSceneId = ChronicleApp.currentScene.id;
    const savedScene = ChronicleApp.scenes.find(s => s.id === currentSceneId);
    if (savedScene) {
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        if (writingSurface) writingSurface.innerHTML = savedScene.content || '';
        if (sceneTitle) sceneTitle.value = savedScene.title || 'Opening Scene';
    }
}

// ===================================
// CUSTOM CURSOR
// ===================================

function startCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        autoSave();
    }
    
    // Ctrl/Cmd + Shift + F for focus mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (ChronicleApp.focusModeActive) {
            exitFocusMode();
        } else {
            enterFocusMode();
        }
    }
});

// ===================================
// WINDOW LIFECYCLE
// ===================================

window.addEventListener('beforeunload', () => {
    autoSave();
});

setInterval(() => {
    if (ChronicleApp.currentSession.active) {
        autoSave();
    }
}, 30000);

// ===================================
// CONSOLE WISDOM
// ===================================

console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #C9A961;');
console.log('%cKeyboard Shortcuts:', 'color: #C9A961; font-weight: bold;');
console.log('%cCtrl/Cmd + S: Save', 'color: #b8b3aa;');
console.log('%cCtrl/Cmd + Shift + F: Focus Mode', 'color: #b8b3aa;');
console.log('%cESC: Exit Focus Mode', 'color: #b8b3aa;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #C9A961;');
