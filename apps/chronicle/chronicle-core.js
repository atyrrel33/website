// ===================================
// CHRONICLE CORE - The Foundation
// "In the beginning, God created..."
// - Genesis 1:1
// ===================================

const ChronicleApp = {
    currentUser: 'tyrrel',
    currentSpace: 'desk',
    
    currentScene: {
        id: 'scene-001',
        title: 'Opening Scene',
        content: '',
        wordCount: 0,
        lastModified: new Date(),
        author: 'tyrrel'
    },
    
    currentSession: {
        id: null,
        startTime: null,
        user: 'tyrrel',
        prayerOffered: false,
        wordsWritten: 0,
        scenesWorked: [],
        active: false
    },
    
    settings: {
        writingFont: 'Crimson Text',
        autoSaveInterval: 3000
    },
    
    autoSaveTimer: null,
    sessionTimer: null,
    sessionStartTime: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✏️ Chronicle - The Novel Sanctuary', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Pour out your heart like water"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    
    initializeApp();
});

function initializeApp() {
    console.log('🔥 Initializing Chronicle...');
    
    // Critical: Make app visible immediately
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.opacity = '1';
        appContainer.style.visibility = 'visible';
    }
    
    // Load saved user preference
    const savedUser = localStorage.getItem('chronicle_current_user') || 'tyrrel';
    switchUser(savedUser);
    
    // Apply saved settings
    loadSettings();
    
    // Load saved scene
    loadLastScene();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Detect and handle session
    detectSession();
    
    // Start session timer
    startSessionTimer();
    
    // Initialize custom cursor
    startCustomCursor();
    
    // Ensure Desk is visible
    ensureDeskVisible();
    
    console.log('✅ Chronicle initialized successfully');
}

function ensureDeskVisible() {
    // Force the Desk workspace to be visible
    const deskWorkspace = document.getElementById('desk');
    if (deskWorkspace) {
        deskWorkspace.classList.add('active');
        deskWorkspace.style.display = 'block';
        deskWorkspace.style.opacity = '1';
        deskWorkspace.style.transform = 'translateY(0)';
    }
    
    // Ensure Desk nav tab is active
    const deskTab = document.querySelector('[data-space="desk"]');
    if (deskTab) {
        deskTab.classList.add('active');
    }
    
    ChronicleApp.currentSpace = 'desk';
}

// ===================================
// USER SWITCHING
// ===================================

function switchUser(userName) {
    ChronicleApp.currentUser = userName;
    
    // Update body class
    document.body.classList.remove('user-tyrrel', 'user-trevor');
    document.body.classList.add(`user-${userName}`);
    
    // Update button states
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === userName) {
            btn.classList.add('active');
        }
    });
    
    // Save preference
    localStorage.setItem('chronicle_current_user', userName);
    
    console.log(`👤 Workspace: ${userName === 'tyrrel' ? 'Tyrrel (Gold)' : 'Trevor (Teal)'}`);
}

// ===================================
// SESSION MANAGEMENT
// ===================================

function detectSession() {
    const lastActivity = localStorage.getItem('chronicle_last_activity');
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    
    if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
        console.log('🕊️ New session detected');
        startNewSession();
    } else {
        console.log('📖 Continuing previous session');
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
}

function continueSession() {
    const savedSession = localStorage.getItem('chronicle_current_session');
    if (savedSession) {
        ChronicleApp.currentSession = JSON.parse(savedSession);
        ChronicleApp.currentSession.active = true;
    } else {
        startNewSession();
    }
    updateSessionIndicator();
}

function saveCurrentSession() {
    localStorage.setItem('chronicle_last_activity', Date.now().toString());
    localStorage.setItem('chronicle_current_session', JSON.stringify(ChronicleApp.currentSession));
}

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
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // User switcher
    const tyrrelBtn = document.getElementById('switchTyrrel');
    const trevorBtn = document.getElementById('switchTrevor');
    
    if (tyrrelBtn) tyrrelBtn.addEventListener('click', () => switchUser('tyrrel'));
    if (trevorBtn) trevorBtn.addEventListener('click', () => switchUser('trevor'));
    
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const space = tab.dataset.space;
            if (space) switchSpace(space);
        });
    });
    
    // Prayer button
    const prayerBtn = document.getElementById('prayerBtn');
    if (prayerBtn) {
        prayerBtn.addEventListener('click', openPrayerModal);
    }
    
    // Prayer modal controls
    const closePrayer = document.getElementById('closePrayerModal');
    const skipPrayer = document.getElementById('skipPrayer');
    const offerPrayer = document.getElementById('offerPrayer');
    
    if (closePrayer) closePrayer.addEventListener('click', closePrayerModal);
    if (skipPrayer) skipPrayer.addEventListener('click', closePrayerModal);
    if (offerPrayer) offerPrayer.addEventListener('click', handlePrayerSubmit);
    
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
    
    // Font selector
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.addEventListener('change', changeFontFamily);
    }
    
    // Focus mode button
    const focusBtn = document.getElementById('focusModeBtn');
    if (focusBtn) {
        focusBtn.addEventListener('click', toggleFocusMode);
    }
    
    // Reference panel button
    const referenceBtn = document.getElementById('referenceBtn');
    if (referenceBtn) {
        referenceBtn.addEventListener('click', toggleReferencePanel);
    }
    
    const closePanel = document.getElementById('closePanelBtn');
    if (closePanel) {
        closePanel.addEventListener('click', toggleReferencePanel);
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentScene();
            showSavingIndicator();
            setTimeout(hideSavingIndicator, 1000);
        }
        
        // Cmd/Ctrl + P: Prayer
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            openPrayerModal();
        }
        
        // Cmd/Ctrl + Shift + F: Focus mode
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            toggleFocusMode();
        }
        
        // Cmd/Ctrl + R: Reference panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            toggleReferencePanel();
        }
        
        // Escape: Close modals/exit focus mode
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
// SPACE NAVIGATION
// ===================================

function switchSpace(spaceName) {
    console.log(`🏛️ Switching to: ${spaceName}`);
    
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
        // Force visibility
        targetWorkspace.style.display = 'block';
        targetWorkspace.style.opacity = '1';
        targetWorkspace.style.transform = 'translateY(0)';
    }
    
    // INITIALIZE SECTIONS ON FIRST VISIT - WITH ERROR PROTECTION
    if (spaceName === 'archive' && window.ChronicleArchive && !window.ChronicleArchive.initialized) {
        setTimeout(() => {
            try {
                console.log('📚 Initializing Archive...');
                window.ChronicleArchive.init();
            } catch (error) {
                console.error('❌ Archive initialization failed:', error);
                alert('The Archive could not be opened. Please refresh the page.\n\nError: ' + error.message);
            }
        }, 100);
    }
    
    if (spaceName === 'covenant' && window.ChronicleCovenant && !window.ChronicleCovenant.initialized) {
        setTimeout(() => {
            try {
                console.log('📜 Initializing Covenant...');
                window.ChronicleCovenant.init();
            } catch (error) {
                console.error('❌ Covenant initialization failed:', error);
                alert('The Covenant could not be opened. Please refresh the page.\n\nError: ' + error.message);
            }
        }, 100);
    }
    
    // Desk doesn't need special handling here since it auto-initializes
    if (spaceName === 'desk' && window.ChronicleDesk && !window.ChronicleDesk.initialized) {
        setTimeout(() => {
            try {
                console.log('📖 Initializing Desk...');
                window.ChronicleDesk.init();
            } catch (error) {
                console.error('❌ Desk initialization failed:', error);
                alert('The Desk could not be opened. Please refresh the page.\n\nError: ' + error.message);
            }
        }, 100);
    }
    
    localStorage.setItem('chronicle_current_space', spaceName);
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

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
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

function closePrayerModal() {
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
    closePrayerModal();
}

// ===================================
// AUTO-SAVE
// ===================================

function triggerAutoSave() {
    showSavingIndicator();
    
    if (ChronicleApp.autoSaveTimer) {
        clearTimeout(ChronicleApp.autoSaveTimer);
    }
    
    ChronicleApp.autoSaveTimer = setTimeout(() => {
        saveCurrentScene();
        hideSavingIndicator();
    }, 1000);
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
}

// ===================================
// SETTINGS & DATA LOADING
// ===================================

function loadSettings() {
    const saved = localStorage.getItem('chronicle_settings');
    if (saved) {
        ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(saved) };
    }
    applyWritingFont();
}

function saveSettings() {
    localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
}

function loadLastScene() {
    const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    if (scenes.length > 0) {
        const sorted = scenes.sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );
        ChronicleApp.currentScene = sorted[0];
        
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        
        if (writingSurface) {
            writingSurface.innerText = ChronicleApp.currentScene.content || '';
        }
        if (sceneTitle) {
            sceneTitle.value = ChronicleApp.currentScene.title || '';
        }
        
        updateWordCount();
    }
}

// ===================================
// CUSTOM CURSOR
// ===================================

function startCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
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
    
    // Cursor interactions
    const interactives = document.querySelectorAll('button, input, textarea, select, .nav-tab, .tool-btn');
    interactives.forEach(el => {
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
// GLOBAL EXPORTS
// ===================================

window.ChronicleApp = ChronicleApp;
window.switchUser = switchUser;
window.switchSpace = switchSpace;
window.saveCurrentScene = saveCurrentScene;
window.countWords = countWords;
window.updateWordCount = updateWordCount;

console.log('%c"Write down the revelation and make it plain on tablets"', 'font-size: 11px; font-style: italic; color: #b8b3aa;');
console.log('%cHabakkuk 2:2', 'font-size: 10px; color: #8B7355;');