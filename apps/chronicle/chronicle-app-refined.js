// ===================================
// CHRONICLE REFINED - PRE-SPRINT 2
// Foundation Polish & Functionality
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
        mode: 'novelist',
        wordCount: 0,
        pageCount: 0,
        lastModified: new Date(),
        author: 'tyrrel'
    },
    
    // All scenes in the project
    scenes: [],
    
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
    sessionStartTime: null,
    
    // Focus mode state
    focusModeActive: false
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✝️ Chronicle Refined - Pre-Sprint 2', 'font-size: 20px; font-weight: bold; color: #C9A961;');
    console.log('%c"Foundation strengthened, ready for screenplay"', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
    
    initializeApp();
    setupEventListeners();
    detectSession();
    loadSavedData();
    startCustomCursor();
    initializePlaceholders();
});

function initializeApp() {
    console.log('Initializing Chronicle...');
    
    // Set initial mode based on saved state or default
    const savedMode = localStorage.getItem('chronicle_current_mode') || 'novelist';
    const savedUser = localStorage.getItem('chronicle_current_user') || 'tyrrel';
    
    switchMode(savedMode, false);
    switchUser(savedUser, false);
    
    // Set initial font based on mode
    applyModeFont();
    
    // Start session timer
    startSessionTimer();
    
    // Initialize word count
    updateWordCount();
    
    console.log('Chronicle initialized - Foundation is firm');
}

// ===================================
// PLACEHOLDER CONTENT INITIALIZATION
// ===================================

function initializePlaceholders() {
    // The Archive placeholder
    const archiveWorkspace = document.querySelector('#archive');
    if (archiveWorkspace && !archiveWorkspace.querySelector('.placeholder-content')) {
        archiveWorkspace.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <h2 class="placeholder-title">The Archive</h2>
                <p class="placeholder-subtitle">Where Completed Works Dwell</p>
                <p class="placeholder-description">
                    Here you shall organize your scenes, manage your acts, and navigate the growing manuscript. 
                    Scene lists, chapter organization, and version history will reside in this sacred space.
                </p>
                <div class="placeholder-scripture">
                    For everything there is a season, and a time for every matter under heaven
                    <span class="placeholder-reference">— Ecclesiastes 3:1</span>
                </div>
                <div class="placeholder-coming-soon">COMING IN SPRINT 3: SCENE MANAGEMENT</div>
            </div>
        `;
    }
    
    // The Covenant placeholder
    const covenantWorkspace = document.querySelector('#covenant');
    if (covenantWorkspace && !covenantWorkspace.querySelector('.placeholder-content')) {
        covenantWorkspace.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
                <h2 class="placeholder-title">The Covenant</h2>
                <p class="placeholder-subtitle">Structure and Craft Tools</p>
                <p class="placeholder-description">
                    In this space, you shall define your story's architecture. Character profiles, world-building notes, 
                    plot outlines, and thematic threads will be woven together. The blueprint of Joseph's journey.
                </p>
                <div class="placeholder-scripture">
                    Make this tabernacle and all its furnishings exactly like the pattern I will show you
                    <span class="placeholder-reference">— Exodus 25:9</span>
                </div>
                <div class="placeholder-coming-soon">COMING IN SPRINT 4: CHARACTER INTEGRATION</div>
            </div>
        `;
    }
    
    // The Altar placeholder
    const altarWorkspace = document.querySelector('#altar');
    if (altarWorkspace && !altarWorkspace.querySelector('.placeholder-content')) {
        altarWorkspace.innerHTML = `
            <div class="placeholder-content">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L12 7"/>
                    <path d="M12 7C10.5 7 9 8 9 9.5C9 11 10.5 12 12 12C13.5 12 15 11 15 9.5C15 8 13.5 7 12 7Z"/>
                    <path d="M12 12L12 22"/>
                    <path d="M8 22L16 22"/>
                    <circle cx="12" cy="7" r="8" opacity="0.2"/>
                </svg>
                <h2 class="placeholder-title">The Altar</h2>
                <p class="placeholder-subtitle">Prayer and Reflection</p>
                <p class="placeholder-description">
                    Here shall dwell your prayer history, session summaries, and moments of spiritual reflection. 
                    Each writing session begins and ends with intention. This space honors that sacred rhythm.
                </p>
                <div class="placeholder-scripture">
                    Whatever you do, work at it with all your heart, as working for the Lord
                    <span class="placeholder-reference">— Colossians 3:23</span>
                </div>
                <div class="placeholder-coming-soon">COMING IN SPRINT 9: SESSION SUMMARY</div>
            </div>
        `;
    }
}

// ===================================
// EVENT LISTENERS SETUP
// ===================================

function setupEventListeners() {
    // Mode switching
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode, true);
        });
    });
    
    // User switching
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const user = btn.dataset.user;
            switchUser(user, true);
        });
    });
    
    // Space navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const space = tab.dataset.space;
            switchSpace(space);
        });
    });
    
    // Toolbar formatting buttons
    document.getElementById('boldBtn')?.addEventListener('click', () => formatText('bold'));
    document.getElementById('italicBtn')?.addEventListener('click', () => formatText('italic'));
    document.getElementById('underlineBtn')?.addEventListener('click', () => formatText('underline'));
    
    // Font selector
    document.getElementById('fontSelector')?.addEventListener('change', (e) => {
        changeFont(e.target.value);
    });
    
    // Focus mode toggle
    document.getElementById('focusMode')?.addEventListener('click', enterFocusMode);
    
    // Focus mode exit (ESC key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ChronicleApp.focusModeActive) {
            exitFocusMode();
        }
    });
    
    // Scene selector
    document.getElementById('sceneSelector')?.addEventListener('change', (e) => {
        const sceneId = e.target.value;
        switchScene(sceneId);
    });
    
    // New scene button
    document.getElementById('newSceneBtn')?.addEventListener('click', createNewScene);
    
    // Editor content changes (for word count and auto-save)
    const editorContent = document.getElementById('editorContent');
    if (editorContent) {
        editorContent.addEventListener('input', () => {
            updateWordCount();
            scheduleAutoSave();
        });
    }
    
    // Prayer modal
    document.getElementById('prayerBtn')?.addEventListener('click', () => {
        showPrayerModal();
    });
    
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
    
    // Inkwell tab
    document.getElementById('inkwellTab')?.addEventListener('click', () => {
        // This functionality is in chronicle-inkwell.js
        console.log('Inkwell tab clicked - handled by inkwell script');
    });
}

// ===================================
// MODE SWITCHING - The Two Chambers
// ===================================

function switchMode(mode, shouldSave = true) {
    console.log(`Switching to ${mode} mode`);
    
    ChronicleApp.currentMode = mode;
    
    // Update body class
    document.body.classList.remove('mode-novelist', 'mode-screenwriter');
    document.body.classList.add(`mode-${mode}`);
    
    // Update mode buttons
    document.querySelectorAll('.mode-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Update mode banner
    const novelistBanner = document.querySelector('.novelist-banner');
    const screenwriterBanner = document.querySelector('.screenwriter-banner');
    
    if (mode === 'novelist') {
        novelistBanner.style.display = 'flex';
        screenwriterBanner.style.display = 'none';
    } else {
        novelistBanner.style.display = 'none';
        screenwriterBanner.style.display = 'flex';
    }
    
    // Apply mode-specific font
    applyModeFont();
    
    // Update font selector to show appropriate font
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        if (mode === 'novelist') {
            fontSelector.value = ChronicleApp.settings.novelistFont;
        } else {
            fontSelector.value = ChronicleApp.settings.screenwriterFont;
        }
    }
    
    // Save to localStorage if requested
    if (shouldSave) {
        localStorage.setItem('chronicle_current_mode', mode);
    }
}

// ===================================
// USER SWITCHING - Iron Sharpens Iron
// ===================================

function switchUser(user, shouldSave = true) {
    console.log(`Switching to ${user}'s workspace`);
    
    ChronicleApp.currentUser = user;
    
    // Update body class for user-specific accents
    document.body.classList.remove('user-tyrrel', 'user-trevor');
    document.body.classList.add(`user-${user}`);
    
    // Update user buttons
    document.querySelectorAll('.user-switch-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.user === user) {
            btn.classList.add('active');
        }
    });
    
    // Update current scene author if creating new content
    ChronicleApp.currentScene.author = user;
    
    // Save to localStorage if requested
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
    
    // Update navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.space === space) {
            tab.classList.add('active');
        }
    });
    
    // Update workspace visibility
    document.querySelectorAll('.workspace').forEach(workspace => {
        workspace.classList.remove('active');
        if (workspace.id === space) {
            workspace.classList.add('active');
        }
    });
}

// ===================================
// FONT MANAGEMENT
// ===================================

function applyModeFont() {
    const editorContent = document.getElementById('editorContent');
    if (!editorContent) return;
    
    if (ChronicleApp.currentMode === 'novelist') {
        editorContent.style.fontFamily = `'${ChronicleApp.settings.novelistFont}', Georgia, serif`;
    } else {
        editorContent.style.fontFamily = `'${ChronicleApp.settings.screenwriterFont}', 'Courier New', monospace`;
    }
}

function changeFont(fontName) {
    console.log(`Changing font to ${fontName}`);
    
    const editorContent = document.getElementById('editorContent');
    if (!editorContent) return;
    
    // Update current mode's font setting
    if (ChronicleApp.currentMode === 'novelist') {
        ChronicleApp.settings.novelistFont = fontName;
    } else {
        ChronicleApp.settings.screenwriterFont = fontName;
    }
    
    // Apply the font
    editorContent.style.fontFamily = `'${fontName}', ${ChronicleApp.currentMode === 'novelist' ? 'Georgia, serif' : "'Courier New', monospace"}`;
    
    // Save settings
    localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
}

// ===================================
// TEXT FORMATTING
// ===================================

function formatText(command) {
    document.execCommand(command, false, null);
    
    // Update button active state
    const button = document.getElementById(`${command}Btn`);
    if (button) {
        if (document.queryCommandState(command)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
}

// Check formatting state on selection change
document.addEventListener('selectionchange', () => {
    const commands = ['bold', 'italic', 'underline'];
    commands.forEach(command => {
        const button = document.getElementById(`${command}Btn`);
        if (button) {
            if (document.queryCommandState(command)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });
});

// ===================================
// WORD COUNT
// ===================================

let wordCountDebounceTimer = null;

function updateWordCount() {
    // Debounce to avoid excessive calculations
    clearTimeout(wordCountDebounceTimer);
    wordCountDebounceTimer = setTimeout(() => {
        const editorContent = document.getElementById('editorContent');
        if (!editorContent) return;
        
        const text = editorContent.innerText || editorContent.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        // Update scene word count
        ChronicleApp.currentScene.wordCount = wordCount;
        
        // Update display
        const wordCountDisplay = document.querySelector('.count-value');
        if (wordCountDisplay) {
            wordCountDisplay.textContent = wordCount.toLocaleString();
        }
        
        // Update session word count
        if (ChronicleApp.currentSession.active) {
            // This would need more sophisticated tracking in a full implementation
            ChronicleApp.currentSession.wordsWritten = wordCount;
        }
    }, 300); // 300ms debounce
}

// ===================================
// FOCUS MODE
// ===================================

function enterFocusMode() {
    console.log('Entering focus mode');
    
    ChronicleApp.focusModeActive = true;
    
    // Get current editor content
    const editorContent = document.getElementById('editorContent');
    if (!editorContent) return;
    
    // Create focus mode overlay
    const focusOverlay = document.createElement('div');
    focusOverlay.className = 'focus-mode-overlay active';
    focusOverlay.innerHTML = `
        <div class="focus-editor" contenteditable="true" id="focusEditor">${editorContent.innerHTML}</div>
        <div class="focus-exit-hint">Press ESC to exit focus mode</div>
    `;
    
    document.body.appendChild(focusOverlay);
    
    // Focus the editor
    const focusEditor = document.getElementById('focusEditor');
    focusEditor.focus();
    
    // Apply current font
    if (ChronicleApp.currentMode === 'novelist') {
        focusEditor.style.fontFamily = `'${ChronicleApp.settings.novelistFont}', Georgia, serif`;
    } else {
        focusEditor.style.fontFamily = `'${ChronicleApp.settings.screenwriterFont}', 'Courier New', monospace`;
    }
    
    // Update content on input
    focusEditor.addEventListener('input', () => {
        editorContent.innerHTML = focusEditor.innerHTML;
        updateWordCount();
        scheduleAutoSave();
    });
}

function exitFocusMode() {
    console.log('Exiting focus mode');
    
    ChronicleApp.focusModeActive = false;
    
    // Remove focus overlay
    const focusOverlay = document.querySelector('.focus-mode-overlay');
    if (focusOverlay) {
        // Sync content back to main editor
        const focusEditor = document.getElementById('focusEditor');
        const editorContent = document.getElementById('editorContent');
        if (focusEditor && editorContent) {
            editorContent.innerHTML = focusEditor.innerHTML;
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
        // Initialize with opening scene
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
    
    // Populate scene selector
    populateSceneSelector();
}

function populateSceneSelector() {
    const sceneSelector = document.getElementById('sceneSelector');
    if (!sceneSelector) return;
    
    sceneSelector.innerHTML = '';
    
    ChronicleApp.scenes.forEach(scene => {
        const option = document.createElement('option');
        option.value = scene.id;
        option.textContent = scene.title;
        if (scene.id === ChronicleApp.currentScene.id) {
            option.selected = true;
        }
        sceneSelector.appendChild(option);
    });
}

function switchScene(sceneId) {
    console.log(`Switching to scene: ${sceneId}`);
    
    // Save current scene first
    saveCurrentScene();
    
    // Find and load the new scene
    const scene = ChronicleApp.scenes.find(s => s.id === sceneId);
    if (scene) {
        ChronicleApp.currentScene = { ...scene };
        
        // Load content into editor
        const editorContent = document.getElementById('editorContent');
        if (editorContent) {
            editorContent.innerHTML = scene.content || '';
        }
        
        // Update word count
        updateWordCount();
        
        // Update mode if scene was created in different mode
        if (scene.mode !== ChronicleApp.currentMode) {
            switchMode(scene.mode, true);
        }
    }
}

function createNewScene() {
    const sceneCount = ChronicleApp.scenes.length;
    const newSceneId = `scene-${String(sceneCount + 1).padStart(3, '0')}`;
    
    const newScene = {
        id: newSceneId,
        title: `Scene ${sceneCount + 1}`,
        content: '',
        mode: ChronicleApp.currentMode,
        wordCount: 0,
        pageCount: 0,
        lastModified: new Date().toISOString(),
        author: ChronicleApp.currentUser,
        act: 1 // Default to Act 1, will be configurable in Sprint 3
    };
    
    // Save current scene
    saveCurrentScene();
    
    // Add new scene
    ChronicleApp.scenes.push(newScene);
    saveScenes();
    
    // Switch to new scene
    ChronicleApp.currentScene = { ...newScene };
    
    // Clear editor
    const editorContent = document.getElementById('editorContent');
    if (editorContent) {
        editorContent.innerHTML = '';
        editorContent.focus();
    }
    
    // Update scene selector
    populateSceneSelector();
    
    console.log(`Created new scene: ${newScene.title}`);
}

function saveCurrentScene() {
    const editorContent = document.getElementById('editorContent');
    if (!editorContent) return;
    
    // Update current scene content
    ChronicleApp.currentScene.content = editorContent.innerHTML;
    ChronicleApp.currentScene.lastModified = new Date().toISOString();
    ChronicleApp.currentScene.author = ChronicleApp.currentUser;
    
    // Update scene in scenes array
    const sceneIndex = ChronicleApp.scenes.findIndex(s => s.id === ChronicleApp.currentScene.id);
    if (sceneIndex !== -1) {
        ChronicleApp.scenes[sceneIndex] = { ...ChronicleApp.currentScene };
    } else {
        // If scene doesn't exist in array, add it
        ChronicleApp.scenes.push({ ...ChronicleApp.currentScene });
    }
    
    saveScenes();
}

function saveScenes() {
    localStorage.setItem('chronicle_scenes', JSON.stringify(ChronicleApp.scenes));
}

// ===================================
// AUTO-SAVE SYSTEM
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
}

// ===================================
// SESSION DETECTION & MANAGEMENT
// ===================================

function detectSession() {
    const lastActivity = localStorage.getItem('chronicle_last_activity');
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    
    if (!lastActivity || parseInt(lastActivity) < twoHoursAgo) {
        console.log('New session detected - Inviting prayer...');
        startNewSession();
    } else {
        console.log('Continuing existing session');
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
    
    // Show prayer modal automatically
    setTimeout(() => {
        showPrayerModal();
    }, 500);
    
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
    }, 60000); // Update every minute
    
    // Initial update
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
    if (modal) {
        modal.classList.add('active');
    }
}

function hidePrayerModal() {
    const modal = document.getElementById('prayerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function savePrayer() {
    const prayerText = document.getElementById('prayerText')?.value || '';
    
    if (prayerText.trim()) {
        // Save prayer to history (will be implemented in Sprint 9)
        const prayer = {
            text: prayerText,
            timestamp: new Date().toISOString(),
            user: ChronicleApp.currentUser,
            sessionId: ChronicleApp.currentSession.id
        };
        
        console.log('Prayer saved:', prayer);
        
        // In future, this will go to The Altar
        // For now, just log it
    }
    
    // Clear prayer text
    document.getElementById('prayerText').value = '';
}

// ===================================
// DATA PERSISTENCE
// ===================================

function loadSavedData() {
    // Load scenes
    loadScenes();
    
    // Load settings
    const savedSettings = localStorage.getItem('chronicle_settings');
    if (savedSettings) {
        ChronicleApp.settings = { ...ChronicleApp.settings, ...JSON.parse(savedSettings) };
    }
    
    // Load current scene content
    const currentSceneId = ChronicleApp.currentScene.id;
    const savedScene = ChronicleApp.scenes.find(s => s.id === currentSceneId);
    if (savedScene) {
        const editorContent = document.getElementById('editorContent');
        if (editorContent) {
            editorContent.innerHTML = savedScene.content || '';
        }
    }
}

// ===================================
// CUSTOM CURSOR
// ===================================

function startCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        // Smooth following with easing
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
        console.log('Manual save triggered');
    }
    
    // Ctrl/Cmd + B for bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        formatText('bold');
    }
    
    // Ctrl/Cmd + I for italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        formatText('italic');
    }
    
    // Ctrl/Cmd + U for underline
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        formatText('underline');
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

// Save before unload
window.addEventListener('beforeunload', (e) => {
    autoSave();
    
    // If there's unsaved work, warn user
    const editorContent = document.getElementById('editorContent');
    if (editorContent && editorContent.innerHTML.trim()) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Periodic auto-save
setInterval(() => {
    if (ChronicleApp.currentSession.active) {
        autoSave();
    }
}, 30000); // Every 30 seconds

// ===================================
// CONSOLE MESSAGES
// ===================================

console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #C9A961;');
console.log('%cKeyboard Shortcuts:', 'color: #C9A961; font-weight: bold;');
console.log('%cCtrl/Cmd + S: Save', 'color: #b8b3aa;');
console.log('%cCtrl/Cmd + B: Bold', 'color: #b8b3aa;');
console.log('%cCtrl/Cmd + I: Italic', 'color: #b8b3aa;');
console.log('%cCtrl/Cmd + U: Underline', 'color: #b8b3aa;');
console.log('%cCtrl/Cmd + Shift + F: Focus Mode', 'color: #b8b3aa;');
console.log('%cESC: Exit Focus Mode', 'color: #b8b3aa;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #C9A961;');
console.log('%c"Write with excellence, for the glory of God"', 'color: #8B7355; font-style: italic;');
