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
    console.log('%c✍️ Chronicle - The Novel Sanctuary', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Pour out your heart like water"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    
    initializeApp();
});

function initializeApp() {
    console.log('🔥 Initializing Chronicle...');
    
    try {
        // Critical: Make app visible immediately
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.opacity = '1';
            appContainer.style.visibility = 'visible';
            console.log('✅ App container made visible');
        } else {
            console.error('❌ App container not found!');
        }
        
        // Load saved user preference
        const savedUser = localStorage.getItem('chronicle_current_user') || 'tyrrel';
        console.log(`👤 Loading saved user: ${savedUser}`);
        switchUser(savedUser);
        
        // Apply saved settings
        console.log('⚙️ Loading settings...');
        loadSettings();
        
        // Load saved scene
        console.log('📄 Loading last scene...');
        loadLastScene();
        
        // Setup all event listeners
        console.log('🔌 Setting up event listeners...');
        setupEventListeners();
        
        // Detect and handle session
        console.log('🕊️ Detecting session...');
        detectSession();
        
        // Start session timer
        console.log('⏱️ Starting session timer...');
        startSessionTimer();
        
        // Initialize custom cursor
        console.log('🎯 Initializing custom cursor...');
        startCustomCursor();
        
        // Ensure Desk is visible
        console.log('✍️ Ensuring Desk is visible...');
        ensureDeskVisible();
        
        // Module verification
        console.log('📦 Verifying modules...');
        verifyModules();
        
        console.log('✅ Chronicle initialized successfully');
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
        console.error('   Stack trace:', error.stack);
        alert('Chronicle failed to initialize.\n\nError: ' + error.message + '\n\nPlease refresh the page.');
    }
}

function verifyModules() {
    const modules = {
        'ChronicleDesk': window.ChronicleDesk,
        'McKeeSystem': window.McKeeSystem,
        'ChronicleInkwell': window.ChronicleInkwell,
        'ChronicleCovenantWorkspace': window.ChronicleCovenantWorkspace
    };
    
    let allLoaded = true;
    
    for (const [name, module] of Object.entries(modules)) {
        if (module) {
            console.log(`✅ ${name} module loaded`);
        } else {
            console.warn(`⚠️ ${name} module not found (may be optional)`);
            if (name === 'ChronicleDesk' || name === 'McKeeSystem') {
                allLoaded = false;
                console.error(`❌ Critical module ${name} is missing!`);
            }
        }
    }
    
    if (!allLoaded) {
        console.error('❌ Critical modules are missing. Some features may not work.');
    }
}

function ensureDeskVisible() {
    try {
        // Force the Desk workspace to be visible
        const deskWorkspace = document.getElementById('desk');
        if (deskWorkspace) {
            deskWorkspace.classList.add('active');
            deskWorkspace.style.display = 'block';
            deskWorkspace.style.opacity = '1';
            deskWorkspace.style.transform = 'translateY(0)';
            console.log('✅ Desk workspace is now visible');
        } else {
            console.error('❌ Desk workspace element not found!');
        }
        
        // Ensure Desk nav tab is active
        const deskTab = document.querySelector('[data-space="desk"]');
        if (deskTab) {
            deskTab.classList.add('active');
            console.log('✅ Desk nav tab activated');
        } else {
            console.warn('⚠️ Desk nav tab not found');
        }
        
        ChronicleApp.currentSpace = 'desk';
        
    } catch (error) {
        console.error('❌ Error in ensureDeskVisible:', error);
        console.error('   Stack trace:', error.stack);
    }
}

// ===================================
// USER SWITCHING
// ===================================

function switchUser(userName) {
    try {
        console.log(`👤 Switching to user: ${userName}`);
        
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
        
        console.log(`✅ User switched to: ${userName === 'tyrrel' ? 'Tyrrel (Gold)' : 'Trevor (Teal)'}`);
        
    } catch (error) {
        console.error('❌ Error switching user:', error);
        console.error('   Stack trace:', error.stack);
    }
}

// ===================================
// SESSION MANAGEMENT
// ===================================

function detectSession() {
    try {
        const lastActivity = localStorage.getItem('chronicle_last_activity');
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        
        if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
            console.log('🕊️ New session detected');
            startNewSession();
        } else {
            console.log('📖 Continuing previous session');
            continueSession();
        }
    } catch (error) {
        console.error('❌ Error detecting session:', error);
        startNewSession();
    }
}

function startNewSession() {
    try {
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
        console.log(`✅ New session started: ${sessionId}`);
        
    } catch (error) {
        console.error('❌ Error starting new session:', error);
    }
}

function continueSession() {
    try {
        const savedSession = localStorage.getItem('chronicle_current_session');
        if (savedSession) {
            ChronicleApp.currentSession = JSON.parse(savedSession);
            ChronicleApp.currentSession.active = true;
            console.log(`✅ Continuing session: ${ChronicleApp.currentSession.id}`);
        } else {
            console.log('⚠️ No saved session found, starting new');
            startNewSession();
        }
        updateSessionIndicator();
    } catch (error) {
        console.error('❌ Error continuing session:', error);
        startNewSession();
    }
}

function saveCurrentSession() {
    try {
        localStorage.setItem('chronicle_last_activity', Date.now().toString());
        localStorage.setItem('chronicle_current_session', JSON.stringify(ChronicleApp.currentSession));
    } catch (error) {
        console.error('❌ Error saving session:', error);
    }
}

function startSessionTimer() {
    try {
        ChronicleApp.sessionStartTime = Date.now();
        
        ChronicleApp.sessionTimer = setInterval(() => {
            updateSessionIndicator();
        }, 60000); // Update every minute
        
        console.log('✅ Session timer started');
    } catch (error) {
        console.error('❌ Error starting session timer:', error);
    }
}

function updateSessionIndicator() {
    try {
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
    } catch (error) {
        console.error('❌ Error updating session indicator:', error);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    try {
        console.log('🔌 Setting up core event listeners...');
        
        // User switcher
        const tyrrelBtn = document.getElementById('switchTyrrel');
        const trevorBtn = document.getElementById('switchTrevor');
        
        if (tyrrelBtn) {
            tyrrelBtn.addEventListener('click', () => switchUser('tyrrel'));
            console.log('✅ Tyrrel button listener added');
        } else {
            console.warn('⚠️ Tyrrel button not found');
        }
        
        if (trevorBtn) {
            trevorBtn.addEventListener('click', () => switchUser('trevor'));
            console.log('✅ Trevor button listener added');
        } else {
            console.warn('⚠️ Trevor button not found');
        }
        
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        console.log(`📍 Found ${navTabs.length} navigation tabs`);
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const space = tab.dataset.space;
                if (space) {
                    console.log(`🔘 Nav tab clicked: ${space}`);
                    switchSpace(space);
                } else {
                    console.warn('⚠️ Nav tab missing data-space attribute');
                }
            });
        });
        
        // Prayer button
        const prayerBtn = document.getElementById('prayerBtn');
        if (prayerBtn) {
            prayerBtn.addEventListener('click', openPrayerModal);
            console.log('✅ Prayer button listener added');
        } else {
            console.warn('⚠️ Prayer button not found');
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
            console.log('✅ Writing surface listeners added');
        } else {
            console.warn('⚠️ Writing surface not found');
        }
        
        // Scene title
        const sceneTitle = document.getElementById('sceneTitle');
        if (sceneTitle) {
            sceneTitle.addEventListener('input', updateSceneTitle);
            console.log('✅ Scene title listener added');
        } else {
            console.warn('⚠️ Scene title input not found');
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
        
        // Reference panel toggle
        const refToggle = document.getElementById('referencePanelToggle');
        if (refToggle) {
            refToggle.addEventListener('click', toggleReferencePanel);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        console.log('✅ Keyboard shortcuts listener added');
        
        console.log('✅ All core event listeners set up successfully');
        
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
        console.error('   Stack trace:', error.stack);
    }
}

function handleKeyboardShortcuts(e) {
    try {
        // Ctrl+S or Cmd+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentScene();
            console.log('💾 Manual save triggered (Ctrl+S)');
        }
        
        // Ctrl+N or Cmd+N for new scene (if in Desk)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n' && ChronicleApp.currentSpace === 'desk') {
            e.preventDefault();
            if (window.ChronicleDesk && window.ChronicleDesk.createNewScene) {
                window.ChronicleDesk.createNewScene();
                console.log('📄 New scene triggered (Ctrl+N)');
            }
        }
    } catch (error) {
        console.error('❌ Error in keyboard shortcut handler:', error);
    }
}

// ===================================
// SPACE NAVIGATION
// ===================================

function switchSpace(spaceName) {
    console.log(`📖 Switching to workspace: ${spaceName}`);
    
    try {
        // Update app state
        ChronicleApp.currentSpace = spaceName;
        
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.space === spaceName) {
                tab.classList.add('active');
            }
        });
        console.log(`✅ Nav tabs updated for: ${spaceName}`);
        
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
            console.log(`✅ Workspace ${spaceName} is now visible`);
        } else {
            console.error(`❌ Workspace element not found: ${spaceName}`);
            alert(`The ${spaceName} workspace could not be found.\n\nPlease refresh the page.`);
            return;
        }
        
        // INITIALIZE COVENANT WORKSPACE
        if (spaceName === 'covenant') {
            console.log('🏛️ Covenant workspace requested');
            
            if (!window.ChronicleCovenantWorkspace) {
                console.error('❌ ChronicleCovenantWorkspace module not loaded!');
                console.error('   Expected: window.ChronicleCovenantWorkspace');
                console.error('   Check that chronicle-covenant.js is included in HTML');
                console.error('   Check that the script loaded without errors');
                alert('The Covenant workspace module could not be found.\n\nPlease ensure:\n1. chronicle-covenant.js is in your files\n2. It is linked in chronicle-app.html\n3. There are no JavaScript errors\n\nCheck the console for details.');
                return;
            }
            
            setTimeout(() => {
                try {
                    console.log('📐 Initializing Covenant workspace...');
                    window.ChronicleCovenantWorkspace.init();
                    console.log('✅ Covenant workspace initialized successfully');
                } catch (error) {
                    console.error('❌ Covenant initialization failed:', error);
                    console.error('   Stack trace:', error.stack);
                    alert('The Covenant could not be opened.\n\nError: ' + error.message + '\n\nCheck the console for details.');
                }
            }, 150);
        }
        
        // INITIALIZE DESK WORKSPACE
        if (spaceName === 'desk') {
            console.log('✍️ Desk workspace requested');
            
            if (!window.ChronicleDesk) {
                console.error('❌ ChronicleDesk module not loaded!');
                console.error('   Check that chronicle-desk.js is included in HTML');
                return;
            }
            
            if (!window.ChronicleDesk.initialized) {
                setTimeout(() => {
                    try {
                        console.log('📖 Initializing Desk workspace...');
                        window.ChronicleDesk.init();
                        console.log('✅ Desk workspace initialized successfully');
                    } catch (error) {
                        console.error('❌ Desk initialization failed:', error);
                        console.error('   Stack trace:', error.stack);
                        alert('The Desk could not be opened.\n\nError: ' + error.message + '\n\nCheck the console for details.');
                    }
                }, 150);
            } else {
                console.log('ℹ️ Desk already initialized');
            }
        }
        
        // ARCHIVE (placeholder)
        if (spaceName === 'archive') {
            console.log('📚 Archive workspace - Coming in future phase');
        }
        
        // ALTAR (placeholder)
        if (spaceName === 'altar') {
            console.log('🕊️ Altar workspace - Coming in future phase');
        }
        
        // Save workspace preference
        localStorage.setItem('chronicle_current_space', spaceName);
        console.log(`💾 Saved current workspace: ${spaceName}`);
        
    } catch (error) {
        console.error('❌ Critical error in switchSpace:', error);
        console.error('   Stack trace:', error.stack);
        alert('A critical error occurred while switching workspaces.\n\nError: ' + error.message + '\n\nPlease refresh the page.');
    }
}

// ===================================
// WRITING FUNCTIONALITY
// ===================================

function handleWritingInput(e) {
    try {
        const content = e.target.innerText;
        ChronicleApp.currentScene.content = content;
        ChronicleApp.currentScene.wordCount = countWords(content);
        ChronicleApp.currentScene.lastModified = new Date();
        
        updateWordCount();
        triggerAutoSave();
    } catch (error) {
        console.error('❌ Error in writing input handler:', error);
    }
}

function handlePaste(e) {
    try {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    } catch (error) {
        console.error('❌ Error handling paste:', error);
    }
}

function countWords(text) {
    try {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).length;
    } catch (error) {
        console.error('❌ Error counting words:', error);
        return 0;
    }
}

function updateWordCount() {
    try {
        const countNumber = document.querySelector('.count-number');
        if (countNumber) {
            countNumber.textContent = ChronicleApp.currentScene.wordCount;
        }
    } catch (error) {
        console.error('❌ Error updating word count:', error);
    }
}

function updateSceneTitle(e) {
    try {
        ChronicleApp.currentScene.title = e.target.value;
        triggerAutoSave();
    } catch (error) {
        console.error('❌ Error updating scene title:', error);
    }
}

function changeFontFamily(e) {
    try {
        ChronicleApp.settings.writingFont = e.target.value;
        applyWritingFont();
        saveSettings();
        console.log(`✅ Font changed to: ${e.target.value}`);
    } catch (error) {
        console.error('❌ Error changing font:', error);
    }
}

function applyWritingFont() {
    try {
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.style.fontFamily = ChronicleApp.settings.writingFont;
        }
    } catch (error) {
        console.error('❌ Error applying font:', error);
    }
}

function toggleFocusMode() {
    try {
        document.body.classList.toggle('focus-mode');
        console.log('🎯 Focus mode toggled');
    } catch (error) {
        console.error('❌ Error toggling focus mode:', error);
    }
}

function toggleReferencePanel() {
    try {
        const panel = document.getElementById('referencePanel');
        const editor = document.querySelector('.writing-editor');
        
        if (panel && editor) {
            panel.classList.toggle('active');
            editor.classList.toggle('with-reference');
            console.log('📚 Reference panel toggled');
        }
    } catch (error) {
        console.error('❌ Error toggling reference panel:', error);
    }
}

// ===================================
// PRAYER MODAL
// ===================================

function openPrayerModal() {
    try {
        const modal = document.getElementById('prayerModal');
        if (modal) {
            modal.classList.add('active');
            const prayerText = document.getElementById('prayerText');
            if (prayerText) prayerText.focus();
            console.log('🕊️ Prayer modal opened');
        }
    } catch (error) {
        console.error('❌ Error opening prayer modal:', error);
    }
}

function closePrayerModal() {
    try {
        const modal = document.getElementById('prayerModal');
        if (modal) {
            modal.classList.remove('active');
            console.log('🕊️ Prayer modal closed');
        }
    } catch (error) {
        console.error('❌ Error closing prayer modal:', error);
    }
}

function handlePrayerSubmit() {
    try {
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
            
            console.log('🕊️ Prayer saved');
            prayerText.value = '';
        }
        closePrayerModal();
    } catch (error) {
        console.error('❌ Error handling prayer submit:', error);
    }
}

// ===================================
// AUTO-SAVE
// ===================================

function triggerAutoSave() {
    try {
        showSavingIndicator();
        
        if (ChronicleApp.autoSaveTimer) {
            clearTimeout(ChronicleApp.autoSaveTimer);
        }
        
        ChronicleApp.autoSaveTimer = setTimeout(() => {
            saveCurrentScene();
            hideSavingIndicator();
        }, 1000);
    } catch (error) {
        console.error('❌ Error triggering auto-save:', error);
    }
}

function showSavingIndicator() {
    try {
        const indicator = document.getElementById('autosaveIndicator');
        if (indicator) indicator.classList.add('saving');
    } catch (error) {
        console.error('❌ Error showing save indicator:', error);
    }
}

function hideSavingIndicator() {
    try {
        const indicator = document.getElementById('autosaveIndicator');
        if (indicator) indicator.classList.remove('saving');
    } catch (error) {
        console.error('❌ Error hiding save indicator:', error);
    }
}

function saveCurrentScene() {
    try {
        const scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
        const existingIndex = scenes.findIndex(s => s.id === ChronicleApp.currentScene.id);
        
        if (existingIndex >= 0) {
            scenes[existingIndex] = { ...ChronicleApp.currentScene };
        } else {
            scenes.push({ ...ChronicleApp.currentScene });
        }
        
        localStorage.setItem('chronicle_scenes', JSON.stringify(scenes));
        saveCurrentSession();
        console.log('💾 Scene saved');
    } catch (error) {
        console.error('❌ Error saving scene:', error);
        alert('Failed to save your work!\n\nError: ' + error.message);
    }
}

// ===================================
// SETTINGS & DATA LOADING
// ===================================

function loadSettings() {
    try {
        const saved = localStorage.getItem('chronicle_settings');
        if (saved) {
            ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(saved) };
        }
        applyWritingFont();
        console.log('✅ Settings loaded');
    } catch (error) {
        console.error('❌ Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
        console.log('💾 Settings saved');
    } catch (error) {
        console.error('❌ Error saving settings:', error);
    }
}

function loadLastScene() {
    try {
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
            console.log(`✅ Loaded last scene: ${ChronicleApp.currentScene.title}`);
        } else {
            console.log('ℹ️ No saved scenes found');
        }
    } catch (error) {
        console.error('❌ Error loading last scene:', error);
    }
}

// ===================================
// CUSTOM CURSOR
// ===================================

function startCustomCursor() {
    try {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) {
            console.warn('⚠️ Custom cursor element not found');
            return;
        }
        
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
        
        console.log('✅ Custom cursor initialized');
    } catch (error) {
        console.error('❌ Error initializing custom cursor:', error);
    }
}

function createCursorTrail(x, y) {
    try {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1500);
    } catch (error) {
        console.error('❌ Error creating cursor trail:', error);
    }
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