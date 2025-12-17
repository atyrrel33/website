/**
 * ════════════════════════════════════════════════════════════════════════════
 * CHRONICLE CORE: THE SACRED ORCHESTRATOR
 * The Foundation That Unifies All Workspaces
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * "In the beginning, God created the heavens and the earth."
 * — Genesis 1:1
 * 
 * This module serves as the central orchestrator for The Chronicle application,
 * managing workspace transitions, user authentication, global settings, and
 * coordinating between the ChronicleData module and individual workspaces.
 * 
 * ARCHITECTURE PRINCIPLES:
 * 1. ChronicleData is the single source of truth for all story data
 * 2. ChronicleCore orchestrates workspace initialization and transitions
 * 3. Each workspace (Desk, Archive, Covenant) operates independently
 * 4. All cross-workspace communication flows through ChronicleData events
 * 5. Settings and user preferences persist globally
 * 
 * @version 2.0.0
 * @date December 17, 2024
 * @authors Tyrrel & Trevor
 */

const ChronicleCore = {
    // ═══════════════════════════════════════════════════════════════════════
    // APPLICATION STATE
    // ═══════════════════════════════════════════════════════════════════════
    
    currentUser: 'tyrrel',
    currentSpace: null,
    
    // Workspace modules (lazy loaded)
    workspaces: {
        desk: null,
        archive: null,
        covenant: null,
        inkwell: null
    },
    
    // Global settings
    settings: {
        writingFont: 'Crimson Text',
        autoSaveInterval: 3000,
        theme: 'dark',
        showWordCount: true,
        showCharacterCards: true
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize the entire Chronicle application
     * Called on DOMContentLoaded
     */
    init() {
        console.log('%c✝️ Chronicle - The Novel Sanctuary', 'font-size: 20px; font-weight: bold; color: #C9A961;');
        console.log('%c"Pour out your heart like water" — Lamentations 2:19', 'font-size: 12px; font-style: italic; color: #b8b3aa;');
        
        try {
            // Step 1: Make app visible immediately
            this.showAppContainer();
            
            // Step 2: Initialize the data layer (single source of truth)
            console.log('📜 Initializing ChronicleData...');
            ChronicleData.init();
            
            // Step 3: Load user preferences
            this.loadUserPreferences();
            
            // Step 4: Load global settings
            this.loadSettings();
            
            // Step 5: Setup global event listeners
            this.setupGlobalListeners();
            
            // Step 6: Initialize navigation
            this.initializeNavigation();
            
            // Step 7: Load the last active workspace (or default to Desk)
            const lastSpace = localStorage.getItem('chronicle_lastSpace') || 'desk';
            this.switchSpace(lastSpace);
            
            console.log('✅ Chronicle Core: Initialization complete');
            
        } catch (error) {
            console.error('❌ Chronicle Core: Initialization failed', error);
            this.showErrorState('Failed to initialize Chronicle. Please refresh the page.');
        }
    },
    
    /**
     * Make the app container visible
     */
    showAppContainer() {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.opacity = '1';
            appContainer.style.visibility = 'visible';
            console.log('✅ App container made visible');
        } else {
            console.error('❌ App container not found!');
        }
    },
    
    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        const savedUser = localStorage.getItem('chronicle_currentUser') || 'tyrrel';
        console.log(`👤 Loading user: ${savedUser}`);
        this.switchUser(savedUser);
    },
    
    /**
     * Load global settings
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('chronicle_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
            console.log('⚙️ Settings loaded:', this.settings);
        } catch (error) {
            console.warn('⚠️ Could not load settings:', error);
        }
    },
    
    /**
     * Save global settings
     */
    saveSettings() {
        try {
            localStorage.setItem('chronicle_settings', JSON.stringify(this.settings));
            console.log('💾 Settings saved');
        } catch (error) {
            console.error('❌ Could not save settings:', error);
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Switch between Tyrrel and Trevor
     */
    switchUser(user) {
        if (user !== 'tyrrel' && user !== 'trevor') {
            console.error('❌ Invalid user:', user);
            return;
        }
        
        this.currentUser = user;
        ChronicleData.currentUser = user;
        
        // Save preference
        localStorage.setItem('chronicle_currentUser', user);
        
        // Update UI
        this.updateUserUI();
        
        console.log(`✅ Switched to ${user}`);
    },
    
    /**
     * Update UI elements for current user
     */
    updateUserUI() {
        // Update toolbar buttons
        const tyrrelBtn = document.querySelector('[data-user="tyrrel"]');
        const trevorBtn = document.querySelector('[data-user="trevor"]');
        
        if (tyrrelBtn && trevorBtn) {
            tyrrelBtn.classList.toggle('active', this.currentUser === 'tyrrel');
            trevorBtn.classList.toggle('active', this.currentUser === 'trevor');
        }
        
        // Update body classes for theming
        document.body.classList.remove('user-tyrrel', 'user-trevor');
        document.body.classList.add(`user-${this.currentUser}`);
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WORKSPACE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Switch to a different workspace
     */
    switchSpace(spaceName) {
        console.log(`🚪 Switching to: ${spaceName}`);
        
        // Validate space name
        const validSpaces = ['desk', 'archive', 'covenant', 'inkwell'];
        if (!validSpaces.includes(spaceName)) {
            console.error('❌ Invalid space:', spaceName);
            return;
        }
        
        // Hide all workspace containers
       // Hide all workspace containers
        const workspaceContainers = document.querySelectorAll('.workspace');
        workspaceContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        // Update navigation UI
        this.updateNavigationUI(spaceName);
        
        // Show the target workspace container
// Show the target workspace container
        const targetContainer = document.getElementById(spaceName);
        if (targetContainer) {
            targetContainer.classList.add('active');
        } else {
            console.error(`❌ Container not found: ${spaceName}`);
            return;
        }
        
        // Update current space
        this.currentSpace = spaceName;
        localStorage.setItem('chronicle_lastSpace', spaceName);
        
        // Initialize workspace if not already loaded
        this.initializeWorkspace(spaceName);
    },
    
    /**
     * Initialize a specific workspace
     */
    initializeWorkspace(spaceName) {
        // Add slight delay to allow CSS transitions
        setTimeout(() => {
            try {
                switch(spaceName) {
                    case 'desk':
                        if (window.ChronicleDesk && !this.workspaces.desk) {
                            console.log('📖 Initializing The Desk...');
                            ChronicleDesk.init();
                            this.workspaces.desk = ChronicleDesk;
                        }
                        break;
                        
                    case 'archive':
                        if (window.ChronicleArchive && !this.workspaces.archive) {
                            console.log('📚 Initializing The Archive...');
                            ChronicleArchive.init();
                            this.workspaces.archive = ChronicleArchive;
                        }
                        break;
                        
                    case 'covenant':
                        if (window.ChronicleCovenenant && !this.workspaces.covenant) {
                            console.log('📜 Initializing The Covenant...');
                            ChronicleCovenenant.init();
                            this.workspaces.covenant = ChronicleCovenenant;
                        }
                        break;
                        
                    case 'inkwell':
                        if (window.ChronicleInkwell && !this.workspaces.inkwell) {
                            console.log('🖋️ Initializing The Inkwell...');
                            ChronicleInkwell.init();
                            this.workspaces.inkwell = ChronicleInkwell;
                        }
                        break;
                }
                
                console.log(`✅ ${spaceName} initialized`);
                
            } catch (error) {
                console.error(`❌ ${spaceName} initialization failed:`, error);
                console.error('   Stack trace:', error.stack);
            }
        }, 100); // Small delay for smooth transition
    },
    
    /**
     * Update navigation UI to reflect current workspace
     */
    updateNavigationUI(spaceName) {
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.space === spaceName) {
                btn.classList.add('active');
            }
        });
    },
    
    /**
     * Initialize navigation button listeners
     */
    initializeNavigation() {
        const navButtons = document.querySelectorAll('.nav-button[data-space]');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const space = button.dataset.space;
                if (space) {
                    this.switchSpace(space);
                }
            });
        });
        
        console.log('✅ Navigation initialized');
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Setup global event listeners that apply across all workspaces
     */
    setupGlobalListeners() {
        // User switcher buttons
        const userButtons = document.querySelectorAll('[data-user]');
        userButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const user = button.dataset.user;
                if (user) {
                    this.switchUser(user);
                    
                    // Notify all workspaces of user change
                    Object.values(this.workspaces).forEach(workspace => {
                        if (workspace && workspace.onUserChanged) {
                            workspace.onUserChanged(user);
                        }
                    });
                }
            });
        });
        
        // Settings changes
        document.addEventListener('settingChanged', (e) => {
            this.settings[e.detail.setting] = e.detail.value;
            this.saveSettings();
        });
        
        // Listen for data changes from ChronicleData
        ChronicleData.addListener((event, data) => {
            console.log(`📡 Core received data event: ${event}`, data);
            this.handleDataEvent(event, data);
        });
        
        console.log('✅ Global listeners setup complete');
    },
    
    /**
     * Handle data events from ChronicleData
     */
    handleDataEvent(event, data) {
        // Route data events to appropriate workspaces
        switch(event) {
            case 'beatCreated':
            case 'beatUpdated':
            case 'beatDeleted':
                // Notify Desk and Archive
                if (this.workspaces.desk && this.workspaces.desk.onDataChanged) {
                    this.workspaces.desk.onDataChanged(event, data);
                }
                if (this.workspaces.archive && this.workspaces.archive.onDataChanged) {
                    this.workspaces.archive.onDataChanged(event, data);
                }
                break;
                
            case 'sceneCreated':
            case 'sceneUpdated':
            case 'sceneDeleted':
                // Notify all workspaces
                Object.values(this.workspaces).forEach(workspace => {
                    if (workspace && workspace.onDataChanged) {
                        workspace.onDataChanged(event, data);
                    }
                });
                break;
                
            case 'characterCreated':
            case 'characterUpdated':
            case 'characterDeleted':
                // Notify Archive and Covenant
                if (this.workspaces.archive && this.workspaces.archive.onDataChanged) {
                    this.workspaces.archive.onDataChanged(event, data);
                }
                if (this.workspaces.covenant && this.workspaces.covenant.onDataChanged) {
                    this.workspaces.covenant.onDataChanged(event, data);
                }
                break;
        }
    },
    // ═══════════════════════════════════════════════════════════════════════
    // ERROR HANDLING & UTILITIES
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Display error state to user
     */
    showErrorState(message) {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #2C2620 0%, #1a1614 100%);
                    color: #C9A961;
                    font-family: 'Cinzel', serif;
                    text-align: center;
                    padding: 2rem;
                ">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">⚠️</h1>
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Chronicle Error</h2>
                    <p style="font-size: 1rem; color: #b8b3aa; max-width: 500px;">
                        ${message}
                    </p>
                    <button onclick="location.reload()" style="
                        margin-top: 2rem;
                        padding: 0.75rem 2rem;
                        background: linear-gradient(135deg, #C9A961 0%, #B4964F 100%);
                        color: #2C2620;
                        border: none;
                        border-radius: 4px;
                        font-family: 'Cinzel', serif;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    },
    
    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },
    
    /**
     * Format word count with commas
     */
    formatWordCount(count) {
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Calculate reading time in minutes
     */
    calculateReadingTime(wordCount) {
        const wordsPerMinute = 200;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return minutes === 1 ? '1 min' : `${minutes} min`;
    },
    
    /**
     * Generate unique ID with prefix
     */
    generateId(prefix = 'item') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL HELPER FUNCTIONS (for backwards compatibility)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Switch user (legacy support)
 */
function switchUser(user) {
    ChronicleCore.switchUser(user);
}

/**
 * Switch workspace (legacy support)
 */
function switchSpace(space) {
    ChronicleCore.switchSpace(space);
}

// ═══════════════════════════════════════════════════════════════════════
// APPLICATION BOOTSTRAP
// ═══════════════════════════════════════════════════════════════════════

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChronicleCore.init();
});

// Handle visibility changes (pause/resume auto-save when tab hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📴 Chronicle: Tab hidden, pausing activity');
        // Could pause auto-save timers here
    } else {
        console.log('📱 Chronicle: Tab visible, resuming activity');
        // Could resume auto-save timers here
    }
});

// Handle before unload (warn about unsaved changes if needed)
window.addEventListener('beforeunload', (e) => {
    // Check if any workspace has unsaved changes
    const hasUnsavedChanges = Object.values(ChronicleCore.workspaces).some(workspace => {
        return workspace && workspace.hasUnsavedChanges && workspace.hasUnsavedChanges();
    });
    
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Log application info to console
console.log('%c═══════════════════════════════════════════════', 'color: #C9A961');
console.log('%cChronicle - The Novel Sanctuary', 'color: #C9A961; font-weight: bold; font-size: 16px');
console.log('%cVersion 2.0.0 | December 2024', 'color: #b8b3aa; font-style: italic');
console.log('%cBy Tyrrel & Trevor', 'color: #b8b3aa; font-style: italic');
console.log('%c═══════════════════════════════════════════════', 'color: #C9A961');