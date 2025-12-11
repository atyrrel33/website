// ===================================
// CHRONICLE RENEWED - SPRINT 1
// The Foundation: Two Chambers & Sacred Sessions
// ===================================

// State Management - The Sacred Record
const ChronicleApp = {
    // Current mode: 'novelist' or 'screenwriter'
    currentMode: 'novelist',
    
    // Current user: 'tyrrel' or 'trevor'
    currentUser: 'tyrrel',
    
    // Current space
    currentSpace: 'desk',
    
    // Current scene being worked on
    currentScene: {
        id: 'scene-001',
        title: 'Opening Scene',
        content: '',
        mode: 'novelist', // Which mode this scene was created in
        wordCount: 0,
        pageCount: 0,
        lastModified: new Date(),
        author: 'tyrrel'
    },
    
    // Current session
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
    
    // Settings
    settings: {
        novelistFont: 'Crimson Text',
        screenwriterFont: 'Courier Prime',
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
    console.log('%c✒️ Chronicle Renewed - Sprint 1', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Two chambers, one sacred purpose"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    console.log('%cNovelist (Warm) • Screenwriter (Structured)', 'font-size: 12px; color: #8B7355;');
    
    initializeApp();
    setupEventListeners();
    detectSession();
    loadSavedData();
    startCustomCursor();
});

function initializeApp() {
    console.log('Initializing Chronicle...');
    
    // Set initial mode based on saved state or default
    const savedMode = localStorage.getItem('chronicle_current_mode') || 'novelist';
    switchMode(savedMode, false); // false = don't save (we just loaded it)
    
    // Set initial font based on mode
    applyModeFont();
    
    // Start session timer
    startSessionTimer();
    
    console.log('Chronicle initialized - May your words flow with divine grace');
}

// ===================================
// SESSION DETECTION - The Threshold
// "There is a time for everything, and a season for every activity under the heavens"
// - Ecclesiastes 3:1
// ===================================

function detectSession() {
    const lastActivity = localStorage.getItem('chronicle_last_activity');
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000); // 2 hours in milliseconds
    
    if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
        // NEW SESSION - More than 2 hours since last activity
        console.log('New session detected - Inviting prayer...');
        startNewSession();
    } else {
        // CONTINUING SESSION
        console.log('Continuing previous session...');
        continueSession();
    }
}

function startNewSession() {
    const sessionId = `session-${Date.now()}`;
    
    ChronicleApp.currentSession = {
        id: sessionId,
        startTime: new Date().toISOString(),
        mode: ChronicleApp.currentMode,
        user: ChronicleApp.currentUser,
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: true
    };
    
    // Save session start
    saveCurrentSession();
    
    // Update session indicator
    updateSessionIndicator();
    
    // Note: Prayer modal will be implemented in Sprint 4
    // For now, we just mark the session as started
    console.log('New session started:', sessionId);
}

function continueSession() {
    // Load previous session if exists
    const savedSession = localStorage.getItem('chronicle_current_session');
    if (savedSession) {
        ChronicleApp.currentSession = JSON.parse(savedSession);
        ChronicleApp.currentSession.active = true;
    }
    
    // Update session indicator
    updateSessionIndicator();
    
    console.log('Session continued');
}

function saveCurrentSession() {
    // Update last activity timestamp
    localStorage.setItem('chronicle_last_activity', Date.now().toString());
    
    // Save current session
    localStorage.setItem('chronicle_current_session', JSON.stringify(ChronicleApp.currentSession));
}

// ===================================
// SESSION TIMER - Tracking Sacred Time
// ===================================

function startSessionTimer() {
    ChronicleApp.sessionStartTime = Date.now();
    
    ChronicleApp.sessionTimer = setInterval(() => {
        updateSessionIndicator();
    }, 60000); // Update every minute
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
// MODE SWITCHING - The Two Chambers
// "There are different kinds of gifts, but the same Spirit distributes them"
// - 1 Corinthians 12:4
// ===================================

function switchMode(modeName, shouldSave = true) {
    console.log(`Switching to ${modeName} mode...`);
    
    // Update app state
    ChronicleApp.currentMode = modeName;
    
    // Update body class for CSS styling
    document.body.classList.remove('mode-novelist', 'mode-screenwriter');
    document.body.classList.add(`mode-${modeName}`);
    
    // Update mode switcher buttons
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === modeName) {
            btn.classList.add('active');
        }
    });
    
    // Update banner visibility
    updateModeBanner(modeName);
    
    // Update font selector options
    updateFontOptions(modeName);
    
    // Apply appropriate font
    applyModeFont();
    
    // Update placeholder text
    updatePlaceholder(modeName);
    
    // Update word count label
    updateWordCountLabel(modeName);
    
    // Save if requested
    if (shouldSave) {
        localStorage.setItem('chronicle_current_mode', modeName);
        
        // Update current session mode
        ChronicleApp.currentSession.mode = modeName;
        saveCurrentSession();
    }
    
    console.log(`${modeName} chamber activated`);
}

function updateModeBanner(modeName) {
    const novelistBanner = document.querySelector('.novelist-banner');
    const screenwriterBanner = document.querySelector('.screenwriter-banner');
    
    if (modeName === 'novelist') {
        if (novelistBanner) novelistBanner.style.display = 'flex';
        if (screenwriterBanner) screenwriterBanner.style.display = 'none';
    } else {
        if (novelistBanner) novelistBanner.style.display = 'none';
        if (screenwriterBanner) screenwriterBanner.style.display = 'flex';
    }
}

function updateFontOptions(modeName) {
    const novelistFonts = document.querySelector('.novelist-fonts');
    const screenwriterFonts = document.querySelector('.screenwriter-fonts');
    const fontSelector = document.getElementById('fontSelector');
    
    if (modeName === 'novelist') {
        if (novelistFonts) novelistFonts.style.display = '';
        if (screenwriterFonts) screenwriterFonts.style.display = 'none';
        if (fontSelector) fontSelector.value = ChronicleApp.settings.novelistFont;
    } else {
        if (novelistFonts) novelistFonts.style.display = 'none';
        if (screenwriterFonts) screenwriterFonts.style.display = '';
        if (fontSelector) fontSelector.value = ChronicleApp.settings.screenwriterFont;
    }
}

function applyModeFont() {
    const writingSurface = document.getElementById('writingSurface');
    if (!writingSurface) return;
    
    const font = ChronicleApp.currentMode === 'novelist' 
        ? ChronicleApp.settings.novelistFont 
        : ChronicleApp.settings.screenwriterFont;
    
    writingSurface.style.fontFamily = font;
}

function updatePlaceholder(modeName) {
    const writingSurface = document.getElementById('writingSurface');
    if (!writingSurface) return;
    
    // CSS handles this via :empty::before pseudo-element
    // Just trigger a reflow
    writingSurface.classList.remove('novelist-surface', 'screenwriter-surface');
    writingSurface.classList.add(`${modeName}-surface`);
}

function updateWordCountLabel(modeName) {
    const novelistLabel = document.querySelector('.novelist-label');
    const screenwriterLabel = document.querySelector('.screenwriter-label');
    
    if (modeName === 'novelist') {
        if (novelistLabel) novelistLabel.style.display = '';
        if (screenwriterLabel) screenwriterLabel.style.display = 'none';
    } else {
        if (novelistLabel) novelistLabel.style.display = 'none';
        if (screenwriterLabel) screenwriterLabel.style.display = '';
    }
}

// ===================================
// USER SWITCHING - Iron Sharpens Iron
// "As iron sharpens iron, so one person sharpens another"
// - Proverbs 27:17
// ===================================

function switchUser(userName) {
    ChronicleApp.currentUser = userName;
    
    // Update body class for user-specific styling
    document.body.classList.remove('user-tyrrel', 'user-trevor');
    document.body.classList.add(`user-${userName}`);
    
    // Update button states
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === userName) {
            btn.classList.add('active');
        }
    });
    
    // Update current scene author if creating new content
    if (ChronicleApp.currentScene.content === '') {
        ChronicleApp.currentScene.author = userName;
    }
    
    // Update session user
    ChronicleApp.currentSession.user = userName;
    saveCurrentSession();
    
    // Save user preference
    localStorage.setItem('chronicle_current_user', userName);
    
    console.log(`Workspace inscribed by: ${userName === 'tyrrel' ? 'Tyrrel (Gold)' : 'Trevor (Teal)'}`);
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Mode switcher buttons
    const switchNovelist = document.getElementById('switchNovelist');
    const switchScreenwriter = document.getElementById('switchScreenwriter');
    
    if (switchNovelist) {
        switchNovelist.addEventListener('click', () => switchMode('novelist'));
    }
    if (switchScreenwriter) {
        switchScreenwriter.addEventListener('click', () => switchMode('screenwriter'));
    }
    
    // User switcher buttons
    const switchTyrrel = document.getElementById('switchTyrrel');
    const switchTrevor = document.getElementById('switchTrevor');
    
    if (switchTyrrel) {
        switchTyrrel.addEventListener('click', () => switchUser('tyrrel'));
    }
    if (switchTrevor) {
        switchTrevor.addEventListener('click', () => switchUser('trevor'));
    }
    
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const space = tab.dataset.space;
            switchSpace(space);
        });
    });
    
    // Prayer button
    const prayerBtn = document.getElementById('prayerBtn');
    if (prayerBtn) {
        prayerBtn.addEventListener('click', openPrayerModal);
    }
    
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
    if (sceneTitle) {
        sceneTitle.addEventListener('input', updateSceneTitle);
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentScene();
            showSavingIndicator();
            setTimeout(hideSavingIndicator, 1000);
        }
        
        // Ctrl/Cmd + P to open prayer modal
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            openPrayerModal();
        }
        
        // Ctrl/Cmd + Shift + F to toggle focus mode
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            toggleFocusMode();
        }
        
        // Ctrl/Cmd + R to toggle reference panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            toggleReferencePanel();
        }
        
        // Escape to close modals/panels
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
    
    // Calculate word count (novelist) or page count (screenwriter)
    if (ChronicleApp.currentMode === 'novelist') {
        ChronicleApp.currentScene.wordCount = countWords(content);
    } else {
        ChronicleApp.currentScene.pageCount = calculatePages(content);
    }
    
    ChronicleApp.currentScene.lastModified = new Date();
    
    // Update display
    updateWordCount();
    
    // Track words written in session
    const sessionStartWords = ChronicleApp.currentSession.sessionStartWords || 0;
    ChronicleApp.currentSession.wordsWritten = ChronicleApp.currentScene.wordCount - sessionStartWords;
    
    // Trigger auto-save
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

function calculatePages(text) {
    // Rough screenplay calculation: ~55 lines per page, ~5 words per line
    if (!text || text.trim() === '') return 0;
    const words = countWords(text);
    const approxLines = words / 5;
    const pages = Math.ceil(approxLines / 55);
    return pages;
}

function updateWordCount() {
    const countNumber = document.querySelector('.count-number');
    if (!countNumber) return;
    
    if (ChronicleApp.currentMode === 'novelist') {
        countNumber.textContent = ChronicleApp.currentScene.wordCount;
    } else {
        countNumber.textContent = ChronicleApp.currentScene.pageCount;
    }
}

function updateSceneTitle(e) {
    ChronicleApp.currentScene.title = e.target.value;
    triggerAutoSave();
}

function changeFontFamily(e) {
    const font = e.target.value;
    
    if (ChronicleApp.currentMode === 'novelist') {
        ChronicleApp.settings.novelistFont = font;
    } else {
        ChronicleApp.settings.screenwriterFont = font;
    }
    
    applyModeFont();
    saveSettings();
}

// ===================================
// NAVIGATION
// ===================================

function switchSpace(spaceName) {
    ChronicleApp.currentSpace = spaceName;
    
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.space === spaceName) {
            tab.classList.add('active');
        }
    });
    
    // Update workspaces
    document.querySelectorAll('.workspace').forEach(workspace => {
        workspace.classList.remove('active');
    });
    
    const targetWorkspace = document.getElementById(spaceName);
    if (targetWorkspace) {
        targetWorkspace.classList.add('active');
    }
    
    // Save navigation state
    localStorage.setItem('chronicle_current_space', spaceName);
}

// ===================================
// TOOLBAR ACTIONS
// ===================================

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    if (document.body.classList.contains('focus-mode')) {
        document.querySelector('.app-header').style.display = 'none';
        document.querySelector('.main-nav').style.display = 'none';
        document.querySelector('.writing-toolbar').style.display = 'none';
        document.querySelector('.mode-banner').style.display = 'none';
        document.getElementById('referencePanel')?.classList.remove('active');
    } else {
        document.querySelector('.app-header').style.display = 'flex';
        document.querySelector('.main-nav').style.display = 'flex';
        document.querySelector('.writing-toolbar').style.display = 'flex';
        document.querySelector('.mode-banner').style.display = 'block';
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
        if (prayerText) {
            prayerText.focus();
        }
    }
}

function closePrayerModalFunc() {
    const modal = document.getElementById('prayerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handlePrayerSubmit() {
    const prayerText = document.getElementById('prayerText');
    if (prayerText && prayerText.value.trim()) {
        // Save prayer to localStorage
        const prayers = JSON.parse(localStorage.getItem('chronicle_prayers') || '[]');
        prayers.unshift({
            date: new Date().toISOString(),
            text: prayerText.value.trim(),
            answered: false
        });
        localStorage.setItem('chronicle_prayers', JSON.stringify(prayers));
        
        // Mark session as having offered prayer
        ChronicleApp.currentSession.prayerOffered = true;
        saveCurrentSession();
        
        // Clear and close
        prayerText.value = '';
    }
    closePrayerModalFunc();
}

// ===================================
// AUTO-SAVE FUNCTIONALITY
// ===================================

function triggerAutoSave() {
    // Show saving indicator
    showSavingIndicator();
    
    // Save after a short delay
    setTimeout(() => {
        saveCurrentScene();
        hideSavingIndicator();
    }, 500);
}

function showSavingIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) {
        indicator.classList.add('saving');
    }
}

function hideSavingIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) {
        indicator.classList.remove('saving');
    }
}

function saveCurrentScene() {
    // Get all scenes from storage
    const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    
    // Update or add current scene
    const existingIndex = scenes.findIndex(s => s.id === ChronicleApp.currentScene.id);
    
    if (existingIndex >= 0) {
        scenes[existingIndex] = { ...ChronicleApp.currentScene };
    } else {
        scenes.push({ ...ChronicleApp.currentScene });
    }
    
    // Save back to storage
    localStorage.setItem('chronicle_scenes', JSON.stringify(scenes));
    
    // Update last activity
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
    // Load current user
    const savedUser = localStorage.getItem('chronicle_current_user');
    if (savedUser) {
        switchUser(savedUser);
    } else {
        switchUser('tyrrel');
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('chronicle_settings');
    if (savedSettings) {
        ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(savedSettings) };
    }
    
    // Load current space
    const savedSpace = localStorage.getItem('chronicle_current_space');
    if (savedSpace) {
        switchSpace(savedSpace);
    }
    
    // Load current scene
    const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    if (scenes.length > 0) {
        const sortedScenes = scenes.sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );
        ChronicleApp.currentScene = sortedScenes[0];
        
        // Populate writing surface
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        
        if (writingSurface) {
            writingSurface.innerText = ChronicleApp.currentScene.content || '';
        }
        if (sceneTitle) {
            sceneTitle.value = ChronicleApp.currentScene.title || '';
        }
        
        updateWordCount();
        
        // Set session start words for tracking
        ChronicleApp.currentSession.sessionStartWords = ChronicleApp.currentScene.wordCount;
    }
    
    // Apply saved fonts
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        if (ChronicleApp.currentMode === 'novelist') {
            fontSelector.value = ChronicleApp.settings.novelistFont;
        } else {
            fontSelector.value = ChronicleApp.settings.screenwriterFont;
        }
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
    
    // Scale cursor on interactive elements
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
// UTILITY FUNCTIONS
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// CONSOLE MESSAGE - The Inscription
// ===================================

console.log('%c"Write down the revelation and make it plain on tablets"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
console.log('%cHabakkuk 2:2', 'font-size: 10px; color: #8B7355;');

// Make app available globally for debugging
window.ChronicleApp = ChronicleApp;
window.switchMode = switchMode;
window.switchUser = switchUser;
window.saveCurrentScene = saveCurrentScene;
