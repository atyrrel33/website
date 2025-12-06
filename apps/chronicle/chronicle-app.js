// ===================================
// CHRONICLE - A SACRED WORKSPACE
// JavaScript Application Logic
// ===================================

// State Management
const ChronicleApp = {
    currentUser: 'tyrrel', // Default to Tyrrel
    currentSpace: 'desk',
    currentScene: {
        id: 'scene-001',
        title: 'Opening Scene',
        content: '',
        wordCount: 0,
        lastModified: new Date(),
        author: 'tyrrel' // Track who wrote this
    },
    settings: {
        font: 'Crimson Text',
        format: 'novel',
        autoSaveInterval: 3000 // 3 seconds
    },
    autoSaveTimer: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSavedData();
    startCustomCursor();
});

function initializeApp() {
    console.log('Chronicle initialized - May your words flow with divine grace');
    
    // Set initial font
    const writingSurface = document.getElementById('writingSurface');
    if (writingSurface) {
        writingSurface.style.fontFamily = ChronicleApp.settings.font;
    }
    
    // Start auto-save
    startAutoSave();
}

// ===================================
// CUSTOM CURSOR WITH FLAME TRAILS
// ===================================

function startCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    let lastTrailTime = 0;
    const trailInterval = 25;
    
    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Create trail particles
        const now = Date.now();
        if (now - lastTrailTime > trailInterval) {
            createCursorTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });
    
    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll(
        'button, input, textarea, select, .scene-card, .character-card, .nav-tab, .structure-item'
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
// NAVIGATION BETWEEN SACRED SPACES
// ===================================

function setupEventListeners() {
    // User switcher - The Sacred Distinction
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
    
    if (closePrayerModal) closePrayerModal.addEventListener('click', () => closePrayerModalFunc());
    if (skipPrayer) skipPrayer.addEventListener('click', () => closePrayerModalFunc());
    if (offerPrayer) offerPrayer.addEventListener('click', handlePrayerSubmit);
    
    // Writing tools
    const fontSelector = document.getElementById('fontSelector');
    const formatSelector = document.getElementById('formatSelector');
    const focusModeBtn = document.getElementById('focusModeBtn');
    const referenceBtn = document.getElementById('referenceBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    
    if (fontSelector) fontSelector.addEventListener('change', changeFontFamily);
    if (formatSelector) formatSelector.addEventListener('change', changeFormat);
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
    
    // Release button (Altar)
    const releaseBtn = document.getElementById('releaseBtn');
    if (releaseBtn) {
        releaseBtn.addEventListener('click', handleRelease);
    }
    
    // Structure tree expand/collapse
    setupStructureTree();
}

function switchSpace(spaceName) {
    // Update current space
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
// USER SWITCHING - IRON SHARPENS IRON
// "As iron sharpens iron, so one person sharpens another" - Proverbs 27:17
// Each scribe must have their own distinct mark, their own color, their own voice
// ===================================

function switchUser(userName) {
    // Update current user
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
    
    // Save user preference
    localStorage.setItem('chronicle_current_user', userName);
    
    console.log(`Workspace now inscribed by: ${userName === 'tyrrel' ? 'Tyrrel' : 'Trevor'}`);
    console.log(`Color: ${userName === 'tyrrel' ? 'Gold - The wisdom of the mentor' : 'Teal - The vision of the student'}`);
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
        
        // Clear and close
        prayerText.value = '';
    }
    closePrayerModalFunc();
}

// ===================================
// WRITING FUNCTIONALITY
// ===================================

function handleWritingInput(e) {
    const content = e.target.innerText;
    ChronicleApp.currentScene.content = content;
    ChronicleApp.currentScene.wordCount = countWords(content);
    ChronicleApp.currentScene.lastModified = new Date();
    
    // Update word count display
    updateWordCount();
    
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

function updateWordCount() {
    const wordCountEl = document.getElementById('wordCount');
    if (wordCountEl) {
        const count = ChronicleApp.currentScene.wordCount;
        wordCountEl.textContent = `${count} word${count !== 1 ? 's' : ''}`;
    }
}

function updateSceneTitle(e) {
    ChronicleApp.currentScene.title = e.target.value;
    triggerAutoSave();
}

function changeFontFamily(e) {
    const font = e.target.value;
    ChronicleApp.settings.font = font;
    
    const writingSurface = document.getElementById('writingSurface');
    if (writingSurface) {
        writingSurface.style.fontFamily = font;
    }
    
    saveSettings();
}

function changeFormat(e) {
    const format = e.target.value;
    ChronicleApp.settings.format = format;
    
    // Could apply different formatting rules based on screenplay vs novel
    // For now, just save the preference
    saveSettings();
}

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    // In focus mode, hide everything except writing surface
    if (document.body.classList.contains('focus-mode')) {
        document.querySelector('.app-header').style.display = 'none';
        document.querySelector('.main-nav').style.display = 'none';
        document.querySelector('.writing-toolbar').style.display = 'none';
        document.querySelector('.reference-panel').classList.remove('active');
    } else {
        document.querySelector('.app-header').style.display = 'flex';
        document.querySelector('.main-nav').style.display = 'flex';
        document.querySelector('.writing-toolbar').style.display = 'flex';
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
// AUTO-SAVE FUNCTIONALITY
// ===================================

function startAutoSave() {
    ChronicleApp.autoSaveTimer = setInterval(() => {
        saveCurrentScene();
    }, ChronicleApp.settings.autoSaveInterval);
}

function triggerAutoSave() {
    // Clear existing timer
    if (ChronicleApp.autoSaveTimer) {
        clearInterval(ChronicleApp.autoSaveTimer);
    }
    
    // Show saving indicator
    showSavingIndicator();
    
    // Save after a short delay
    setTimeout(() => {
        saveCurrentScene();
        hideSavingIndicator();
    }, 500);
    
    // Restart auto-save timer
    startAutoSave();
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
    
    console.log('Scene saved:', ChronicleApp.currentScene.title);
}

function saveSettings() {
    localStorage.setItem('chronicle_settings', JSON.stringify(ChronicleApp.settings));
}

// ===================================
// DATA LOADING
// ===================================

function loadSavedData() {
    // Load current user - The identity of the scribe
    const savedUser = localStorage.getItem('chronicle_current_user');
    if (savedUser) {
        switchUser(savedUser);
    } else {
        // Default to Tyrrel, but mark it clearly
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
        // Load the most recently modified scene
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
    }
    
    // Apply saved font
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.value = ChronicleApp.settings.font;
    }
    
    const formatSelector = document.getElementById('formatSelector');
    if (formatSelector) {
        formatSelector.value = ChronicleApp.settings.format;
    }
}

// ===================================
// ARCHIVE FUNCTIONALITY
// ===================================

function setupStructureTree() {
    const structureItems = document.querySelectorAll('.structure-item');
    
    structureItems.forEach(item => {
        const expandIcon = item.querySelector('.expand-icon');
        if (expandIcon) {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
                
                // Toggle children visibility
                const children = item.nextElementSibling;
                if (children && children.classList.contains('structure-children')) {
                    children.style.display = children.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    });
}

// ===================================
// ALTAR FUNCTIONALITY
// ===================================

function handleRelease() {
    const releaseText = document.getElementById('releaseText');
    if (!releaseText || !releaseText.value.trim()) return;
    
    const text = releaseText.value.trim();
    
    // Create release animation
    createReleaseAnimation(text);
    
    // Save to release history
    const releases = JSON.parse(localStorage.getItem('chronicle_releases') || '[]');
    releases.unshift({
        date: new Date().toISOString(),
        text: text
    });
    localStorage.setItem('chronicle_releases', JSON.stringify(releases));
    
    // Clear textarea
    releaseText.value = '';
    
    // Show confirmation
    setTimeout(() => {
        alert('Released to God. It is no longer yours to carry.');
    }, 3000);
}

function createReleaseAnimation(text) {
    const container = document.getElementById('releaseAnimation');
    if (!container) return;
    
    // Split text into words
    const words = text.split(' ');
    
    words.forEach((word, index) => {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'release-particle';
            particle.textContent = word;
            
            // Random starting position near center
            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
            const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            container.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => particle.remove(), 3000);
        }, index * 150);
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

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
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save manually
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
    
    // Ctrl/Cmd + F to toggle focus mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
    }
    
    // Ctrl/Cmd + R to toggle reference panel
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        toggleReferencePanel();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        
        // Exit focus mode
        if (document.body.classList.contains('focus-mode')) {
            toggleFocusMode();
        }
    }
});

// ===================================
// EXPORT FUNCTIONALITY
// ===================================

function exportProject() {
    const project = {
        meta: {
            name: 'Joseph: A Modern Story',
            exportedAt: new Date().toISOString(),
            version: '1.0'
        },
        scenes: JSON.parse(localStorage.getItem('chronicle_scenes') || '[]'),
        prayers: JSON.parse(localStorage.getItem('chronicle_prayers') || '[]'),
        releases: JSON.parse(localStorage.getItem('chronicle_releases') || '[]'),
        settings: ChronicleApp.settings
    };
    
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chronicle_export_' + Date.now() + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importProject(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const project = JSON.parse(e.target.result);
            
            // Import data
            if (project.scenes) {
                localStorage.setItem('chronicle_scenes', JSON.stringify(project.scenes));
            }
            if (project.prayers) {
                localStorage.setItem('chronicle_prayers', JSON.stringify(project.prayers));
            }
            if (project.releases) {
                localStorage.setItem('chronicle_releases', JSON.stringify(project.releases));
            }
            if (project.settings) {
                localStorage.setItem('chronicle_settings', JSON.stringify(project.settings));
            }
            
            // Reload app
            location.reload();
        } catch (error) {
            console.error('Error importing project:', error);
            alert('Error importing project file');
        }
    };
    reader.readAsText(file);
}

// ===================================
// CONSOLE MESSAGE - THE INSCRIPTION
// ===================================

console.log('%c✍️ Chronicle - A Sacred Workspace', 'font-size: 20px; font-weight: bold; color: #C9A961;');
console.log('%c"Write the vision and make it plain on tablets, so that a herald may run with it." - Habakkuk 2:2', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
console.log('%c"As iron sharpens iron, so one person sharpens another." - Proverbs 27:17', 'font-size: 12px; font-style: italic; color: #2C5F5F;');
console.log('%cTwo scribes, one calling. Tyrrel (Gold) and Trevor (Teal).', 'font-size: 12px; color: #8B7355;');
console.log('%cMay your words flow with divine inspiration.', 'font-size: 12px; color: #b8b3aa;');

// Make some functions available globally for debugging
window.ChronicleApp = ChronicleApp;
window.exportProject = exportProject;
window.importProject = importProject;
