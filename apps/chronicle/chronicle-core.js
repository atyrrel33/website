// ===================================
// CHRONICLE - THE NOVEL SANCTUARY
// A Sacred Space for Exploratory Writing
// ===================================

const ChronicleApp = {
    // Current user: 'tyrrel' or 'trevor'
    currentUser: 'tyrrel',
    
    // Current space
    currentSpace: 'desk',
    
    // Current scene being worked on
    currentScene: {
        id: 'scene-001',
        title: 'Opening Scene',
        content: '',
        wordCount: 0,
        lastModified: new Date(),
        author: 'tyrrel'
    },
    
    // Current session
    currentSession: {
        id: null,
        startTime: null,
        user: 'tyrrel',
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: false
    },
    
    // Settings
    settings: {
        writingFont: 'Crimson Text',
        autoSaveInterval: 3000
    },
    
    // Timers
    autoSaveTimer: null,
    sessionTimer: null,
    sessionStartTime: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✍️ Chronicle - The Novel Sanctuary', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Pour out your heart like water"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    
    initializeApp();
    setupEventListeners();
    detectSession();
    loadSavedData();
    startCustomCursor();
});

function initializeApp() {
    console.log('Initializing Chronicle...');
    
    // Apply writing font
    applyWritingFont();
    
    // Start session timer
    startSessionTimer();
    
    console.log('Chronicle initialized - May your words flow with divine grace');
}

// ===================================
// SESSION DETECTION
// ===================================

function detectSession() {
    const lastActivity = localStorage.getItem('chronicle_last_activity');
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    
    if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
        console.log('New session detected - Inviting prayer...');
        startNewSession();
    } else {
        console.log('Continuing previous session...');
        continueSession();
    }
}

function startNewSession() {
    const sessionId = `session-${Date.now()}`;
    
    ChronicleApp.currentSession = {
        id: sessionId,
        startTime: new Date().toISOString(),
        user: ChronicleApp.currentUser,
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: true
    };
    
    saveCurrentSession();
    updateSessionIndicator();
    
    console.log('New session started:', sessionId);
}

function continueSession() {
    const savedSession = localStorage.getItem('chronicle_current_session');
    if (savedSession) {
        ChronicleApp.currentSession = JSON.parse(savedSession);
        ChronicleApp.currentSession.active = true;
    }
    
    updateSessionIndicator();
    console.log('Session continued');
}

function saveCurrentSession() {
    localStorage.setItem('chronicle_last_activity', Date.now().toString());
    localStorage.setItem('chronicle_current_session', JSON.stringify(ChronicleApp.currentSession));
}

// ===================================
// SESSION TIMER
// ===================================

function startSessionTimer() {
    ChronicleApp.sessionStartTime = Date.now();
    
    ChronicleApp.sessionTimer = setInterval(() => {
        updateSessionIndicator();
    }, 60000);
}

function updateSessionIndicator() {
    const indicator = document.getElementById('sessionTime');
    if (!indicator) return;
    
    const elapsed = Date.now() - ChronicleApp.sessionStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
        indicator.textContent = `${hours}h ${remainingMinutes}m`;
    } else {
        indicator.textContent = `${minutes}m`;
    }
}

// ===================================
// USER SWITCHING
// ===================================

function switchUser(userName) {
    ChronicleApp.currentUser = userName;
    
    document.body.classList.remove('user-tyrrel', 'user-trevor');
    document.body.classList.add(`user-${userName}`);
    
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === userName) {
            btn.classList.add('active');
        }
    });
    
    if (ChronicleApp.currentScene.content === '') {
        ChronicleApp.currentScene.author = userName;
    }
    
    ChronicleApp.currentSession.user = userName;
    saveCurrentSession();
    
    localStorage.setItem('chronicle_current_user', userName);
    
    console.log(`Workspace inscribed by: ${userName === 'tyrrel' ? 'Tyrrel (Gold)' : 'Trevor (Teal)'}`);
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // User switcher
    const switchTyrrel = document.getElementById('switchTyrrel');
    const switchTrevor = document.getElementById('switchTrevor');
    
    if (switchTyrrel) switchTyrrel.addEventListener('click', () => switchUser('tyrrel'));
    if (switchTrevor) switchTrevor.addEventListener('click', () => switchUser('trevor'));
    
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchSpace(tab.dataset.space));
    });
    
    // Prayer button
    const prayerBtn = document.getElementById('prayerBtn');
    if (prayerBtn) prayerBtn.addEventListener('click', openPrayerModal);
    
    // Prayer modal controls
    const closePrayerModal = document.getElementById('closePrayerModal');
    const skipPrayer = document.getElementById('skipPrayer');
    const offerPrayer = document.getElementById('offerPrayer');
    
    if (closePrayerModal) closePrayerModal.addEventListener('click', closePrayerModalFunc);
    if (skipPrayer) skipPrayer.addEventListener('click', closePrayerModalFunc);
    if (offerPrayer) offerPrayer.addEventListener('click', handlePrayerSubmit);
    
    // Writing tools
    const fontSelector = document.getElementById('fontSelector');
    const focusModeBtn = document.getElementById('focusModeBtn');
    const referenceBtn = document.getElementById('referenceBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    
    if (fontSelector) fontSelector.addEventListener('change', changeFontFamily);
    if (focusModeBtn) focusModeBtn.addEventListener('click', toggleFocusMode);
    if (referenceBtn) referenceBtn.addEventListener('click', toggleReferencePanel);
    if (closePanelBtn) closePanelBtn.addEventListener('click', toggleReferencePanel);
    
    // Writing surface
    const writingSurface = document.getElementById('writingSurface');
    if (writingSurface) {
        writingSurface.addEventListener('input', handleWritingInput);
        writingSurface.addEventListener('paste', handlePaste);
    }
    
    // Scene title
    const sceneTitle = document.getElementById('sceneTitle');
    if (sceneTitle) sceneTitle.addEventListener('input', updateSceneTitle);
    
    setupKeyboardShortcuts();
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentScene();
            showSavingIndicator();
            setTimeout(hideSavingIndicator, 1000);
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            openPrayerModal();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            toggleFocusMode();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            toggleReferencePanel();
        }
        
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
            
            if (document.body.classList.contains('focus-mode')) {
                toggleFocusMode();
            }
        }
    });
}

// ===================================
// WRITING FUNCTIONALITY
// ===================================

function handleWritingInput(e) {
    const content = e.target.innerText;
    ChronicleApp.currentScene.content = content;
    ChronicleApp.currentScene.wordCount = countWords(content);
    ChronicleApp.currentScene.lastModified = new Date();
    
    updateWordCount();
    
    const sessionStartWords = ChronicleApp.currentSession.sessionStartWords || 0;
    ChronicleApp.currentSession.wordsWritten = ChronicleApp.currentScene.wordCount - sessionStartWords;
    
    triggerAutoSave();
}

function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}

function countWords(text) {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
}

function updateWordCount() {
    const countNumber = document.querySelector('.count-number');
    if (countNumber) {
        countNumber.textContent = ChronicleApp.currentScene.wordCount;
    }
}

function updateSceneTitle(e) {
    ChronicleApp.currentScene.title = e.target.value;
    triggerAutoSave();
}

function changeFontFamily(e) {
    ChronicleApp.settings.writingFont = e.target.value;
    applyWritingFont();
    saveSettings();
}

function applyWritingFont() {
    const writingSurface = document.getElementById('writingSurface');
    if (writingSurface) {
        writingSurface.style.fontFamily = ChronicleApp.settings.writingFont;
    }
}

// ===================================
// NAVIGATION
// ===================================

function switchSpace(spaceName) {
    ChronicleApp.currentSpace = spaceName;
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.space === spaceName) {
            tab.classList.add('active');
        }
    });
    
    document.querySelectorAll('.workspace').forEach(workspace => {
        workspace.classList.remove('active');
    });
    
    const targetWorkspace = document.getElementById(spaceName);
    if (targetWorkspace) {
        targetWorkspace.classList.add('active');
    }
    
    localStorage.setItem('chronicle_current_space', spaceName);
}

// ===================================
// TOOLBAR ACTIONS
// ===================================

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    const isActive = document.body.classList.contains('focus-mode');
    const displayValue = isActive ? 'none' : 'flex';
    
    document.querySelector('.app-header').style.display = displayValue;
    document.querySelector('.main-nav').style.display = displayValue;
    document.querySelector('.writing-toolbar').style.display = displayValue;
    
    if (isActive) {
        document.getElementById('referencePanel')?.classList.remove('active');
    }
}

function toggleReferencePanel() {
    const panel = document.getElementById('referencePanel');
    const editor = document.querySelector('.writing-editor');
    
    if (panel && editor) {
        panel.classList.toggle('active');
        editor.classList.toggle('with-reference');
    }
}

// ===================================
// PRAYER MODAL
// ===================================

function openPrayerModal() {
    const modal = document.getElementById('prayerModal');
    if (modal) {
        modal.classList.add('active');
        const prayerText = document.getElementById('prayerText');
        if (prayerText) prayerText.focus();
    }
}

function closePrayerModalFunc() {
    const modal = document.getElementById('prayerModal');
    if (modal) modal.classList.remove('active');
}

function handlePrayerSubmit() {
    const prayerText = document.getElementById('prayerText');
    if (prayerText && prayerText.value.trim()) {
        const prayers = JSON.parse(localStorage.getItem('chronicle_prayers') || '[]');
        prayers.unshift({
            date: new Date().toISOString(),
            text: prayerText.value.trim(),
            answered: false
        });
        localStorage.setItem('chronicle_prayers', JSON.stringify(prayers));
        
        ChronicleApp.currentSession.prayerOffered = true;
        saveCurrentSession();
        
        prayerText.value = '';
    }
    closePrayerModalFunc();
}

// ===================================
// AUTO-SAVE
// ===================================

function triggerAutoSave() {
    showSavingIndicator();
    
    setTimeout(() => {
        saveCurrentScene();
        hideSavingIndicator();
    }, 500);
}

function showSavingIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) indicator.classList.add('saving');
}

function hideSavingIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) indicator.classList.remove('saving');
}

function saveCurrentScene() {
    const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    
    const existingIndex = scenes.findIndex(s => s.id === ChronicleApp.currentScene.id);
    
    if (existingIndex >= 0) {
        scenes[existingIndex] = { ...ChronicleApp.currentScene };
    } else {
        scenes.push({ ...ChronicleApp.currentScene });
    }
    
    localStorage.setItem('chronicle_scenes', JSON.stringify(scenes));
    saveCurrentSession();
    
    console.log('Scene saved:', ChronicleApp.currentScene.title);
}

function saveSettings() {
    localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
}

// ===================================
// DATA LOADING
// ===================================

function loadSavedData() {
    const savedUser = localStorage.getItem('chronicle_current_user');
    if (savedUser) {
        switchUser(savedUser);
    } else {
        switchUser('tyrrel');
    }
    
    const savedSettings = localStorage.getItem('chronicle_settings');
    if (savedSettings) {
        ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(savedSettings) };
    }
    
    const savedSpace = localStorage.getItem('chronicle_current_space');
    if (savedSpace) {
        switchSpace(savedSpace);
    }
    
    const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    if (scenes.length > 0) {
        const sortedScenes = scenes.sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );
        ChronicleApp.currentScene = sortedScenes[0];
        
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        
        if (writingSurface) {
            writingSurface.innerText = ChronicleApp.currentScene.content || '';
        }
        if (sceneTitle) {
            sceneTitle.value = ChronicleApp.currentScene.title || '';
        }
        
        updateWordCount();
        ChronicleApp.currentSession.sessionStartWords = ChronicleApp.currentScene.wordCount;
    }
    
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.value = ChronicleApp.settings.writingFont;
    }
}

// ===================================
// CUSTOM CURSOR
// ===================================

function startCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    let lastTrailTime = 0;
    const trailInterval = 25;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        const now = Date.now();
        if (now - lastTrailTime > trailInterval) {
            createCursorTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });
    
    const interactiveElements = document.querySelectorAll(
        'button, input, textarea, select, .nav-tab'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 1500);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c"Write down the revelation and make it plain on tablets"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
console.log('%cHabakkuk 2:2', 'font-size: 10px; color: #8B7355;');

window.ChronicleApp = ChronicleApp;
window.switchUser = switchUser;
window.saveCurrentScene = saveCurrentScene;
