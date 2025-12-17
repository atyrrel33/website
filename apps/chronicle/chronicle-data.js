/**
 * ════════════════════════════════════════════════════════════════════════════
 * CHRONICLE DATA: THE SACRED FOUNDATION
 * A Single Source of Truth for The Chronicle Application
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * "The plans of the diligent lead to profit as surely as haste leads to poverty."
 * — Proverbs 21:5
 * 
 * This module serves as the SOLE authority for all story data across Chronicle's
 * three workspaces: The Desk, The Archive, and The Covenant. All data flows
 * through these methods. No workspace shall write directly to localStorage.
 * 
 * ARCHITECTURE PRINCIPLES:
 * 1. Beats are the fundamental unit of storytelling
 * 2. Scenes are collections of beats with metadata
 * 3. Characters are sacred and tracked across all scenes
 * 4. All data changes persist immediately to localStorage
 * 5. All workspaces receive updates when data changes
 * 
 * @version 1.0.0
 * @date December 16, 2024
 * @authors Tyrrel & Trevor
 */

const ChronicleData = {
    // ═══════════════════════════════════════════════════════════════════════
    // DATA STRUCTURES
    // ═══════════════════════════════════════════════════════════════════════
    
    beats: [],          // Individual story beats (the atoms of narrative)
    scenes: [],         // Collections of beats with metadata
    characters: [],     // Character cards with full arc data
    locations: [],      // Story locations/settings
    chapters: [],       // Chapter organization
    acts: [],          // 3-act structure
    sessions: [],       // Writing sessions (for tracking authorship)
    
    // McKee's story elements (pre-populated framework)
    mckeeElements: [
        'Opening Image',
        'Inciting Incident',
        'First Plot Point',
        'Midpoint Reversal',
        'Crisis',
        'Climax',
        'Resolution',
        'Denouement'
    ],
    
    // Current state
    currentUser: 'tyrrel',
    currentBeat: null,
    currentScene: null,
    
    // Event listeners for cross-workspace communication
    listeners: [],
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize the data system
     * Loads all data from localStorage or creates fresh structure
     */
    init() {
        console.log('📜 Chronicle Data: Initializing...');
        
        // Load existing data or create fresh
        this.beats = this.loadFromStorage('chronicle_beats') || [];
        this.scenes = this.loadFromStorage('chronicle_scenes') || [];
        this.characters = this.loadFromStorage('chronicle_characters') || [];
        this.locations = this.loadFromStorage('chronicle_locations') || [];
        this.chapters = this.loadFromStorage('chronicle_chapters') || this.createDefaultChapters();
        this.acts = this.loadFromStorage('chronicle_acts') || this.createDefaultActs();
        this.sessions = this.loadFromStorage('chronicle_sessions') || [];
        this.currentUser = localStorage.getItem('chronicle_currentUser') || 'tyrrel';        
        // Migrate old scene data if it exists
        this.migrateOldScenes();
        
        console.log('✅ Chronicle Data: Initialized successfully');
        console.log(`   📖 Beats: ${this.beats.length}`);
        console.log(`   🎬 Scenes: ${this.scenes.length}`);
        console.log(`   👥 Characters: ${this.characters.length}`);
        console.log(`   📍 Locations: ${this.locations.length}`);
        
        return this;
    },
    
    /**
     * Create default 3-act structure
     */
    createDefaultActs() {
        return [
            {
                id: 'act-1',
                number: 1,
                title: 'Act I: Setup',
                description: 'Introduce world, characters, and conflict',
                targetBeats: 25,
                created: Date.now()
            },
            {
                id: 'act-2',
                number: 2,
                title: 'Act II: Confrontation',
                description: 'Rising action and complications',
                targetBeats: 50,
                created: Date.now()
            },
            {
                id: 'act-3',
                number: 3,
                title: 'Act III: Resolution',
                description: 'Climax and denouement',
                targetBeats: 25,
                created: Date.now()
            }
        ];
    },
    
    /**
     * Create default chapter structure
     */
    createDefaultChapters() {
        return []; // Empty - chapters created as needed
    },
    
    /**
     * Migrate old scene data from localStorage (if exists)
     * Preserves user's existing work
     */
    migrateOldScenes() {
        const oldScenes = [];
        
        // Check for old localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('scene_')) {
                try {
                    const sceneData = JSON.parse(localStorage.getItem(key));
                    oldScenes.push(sceneData);
                } catch (e) {
                    console.warn('⚠️ Could not migrate scene:', key);
                }
            }
        }
        
        // Convert old scenes to new format
        if (oldScenes.length > 0 && this.scenes.length === 0) {
            console.log(`📦 Migrating ${oldScenes.length} scenes from old format...`);
            
            oldScenes.forEach(oldScene => {
                // Create a single beat from the scene content
                const beat = {
                    id: this.generateId('beat'),
                    content: oldScene.content || '',
                    author: oldScene.author || 'tyrrel',
                    created: oldScene.created || Date.now(),
                    modified: oldScene.modified || Date.now()
                };
                
                this.beats.push(beat);
                
                // Create scene referencing this beat
                const newScene = {
                    id: oldScene.id || this.generateId('scene'),
                    title: oldScene.title || 'Untitled Scene',
                    beatIds: [beat.id],
                    actId: oldScene.actId || 'act-1',
                    chapterId: oldScene.chapterId || null,
                    author: oldScene.author || 'tyrrel',
                    mode: oldScene.mode || 'novelist',
                    status: oldScene.status || 'draft',
                    
                    // Metadata (may not exist in old format)
                    characters: [],
                    location: null,
                    mckeeElement: null,
                    conflictType: null,
                    purpose: '',
                    
                    created: oldScene.created || Date.now(),
                    modified: oldScene.modified || Date.now()
                };
                
                this.scenes.push(newScene);
            });
            
            // Save migrated data
            this.saveToStorage('chronicle_beats', this.beats);
            this.saveToStorage('chronicle_scenes', this.scenes);
            
            console.log('✅ Migration complete');
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // STORAGE METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Load data from localStorage
     */
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`❌ Error loading ${key}:`, e);
            return null;
        }
    },
    
    /**
     * Save data to localStorage
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`❌ Error saving ${key}:`, e);
            return false;
        }
    },
    
    /**
     * Persist all data to localStorage
     */
    persist() {
        this.saveToStorage('chronicle_beats', this.beats);
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.saveToStorage('chronicle_characters', this.characters);
        this.saveToStorage('chronicle_locations', this.locations);
        this.saveToStorage('chronicle_chapters', this.chapters);
        this.saveToStorage('chronicle_acts', this.acts);
        this.saveToStorage('chronicle_sessions', this.sessions);
        localStorage.setItem('chronicle_currentUser', this.currentUser);        
        // Notify all listeners of data change
        this.notifyListeners('persist');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENT SYSTEM (Cross-workspace communication)
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Register a listener for data changes
     */
    addListener(callback) {
        this.listeners.push(callback);
    },
    
    /**
     * Remove a listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    /**
     * Notify all listeners of a data change
     */
    notifyListeners(event, data = null) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (e) {
                console.error('❌ Error in listener:', e);
            }
        });
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // BEAT METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a new beat
     */
    createBeat(author = null) {
        const beat = {
            id: this.generateId('beat'),
            content: '',
            author: author || this.currentUser,
            created: Date.now(),
            modified: Date.now()
        };
        
        this.beats.push(beat);
        this.currentBeat = beat.id;
        
        this.saveToStorage('chronicle_beats', this.beats);
        this.notifyListeners('beatCreated', beat);
        
        return beat;
    },
    
    /**
     * Save/update a beat
     */
    saveBeat(beatId, content) {
        const beat = this.beats.find(b => b.id === beatId);
        if (!beat) {
            console.error('❌ Beat not found:', beatId);
            return null;
        }
        
        beat.content = content;
        beat.modified = Date.now();
        
        this.saveToStorage('chronicle_beats', this.beats);
        this.notifyListeners('beatUpdated', beat);
        
        return beat;
    },
    
    /**
     * Delete a beat
     */
    deleteBeat(beatId) {
        // Check if beat is in any scene
        const sceneWithBeat = this.scenes.find(s => s.beatIds.includes(beatId));
        if (sceneWithBeat) {
            console.warn('⚠️ Cannot delete beat - it belongs to a scene:', sceneWithBeat.title);
            return false;
        }
        
        this.beats = this.beats.filter(b => b.id !== beatId);
        
        this.saveToStorage('chronicle_beats', this.beats);
        this.notifyListeners('beatDeleted', beatId);
        
        return true;
    },
    
    /**
     * Get beat by ID
     */
    getBeat(beatId) {
        return this.beats.find(b => b.id === beatId);
    },
    
    /**
     * Get all orphaned beats (not in any scene)
     */
    getOrphanedBeats() {
        const sceneBeats = new Set();
        this.scenes.forEach(scene => {
            if (scene.beatIds && Array.isArray(scene.beatIds)) {
                scene.beatIds.forEach(beatId => sceneBeats.add(beatId));
            }
        });
        
        return this.beats.filter(beat => !sceneBeats.has(beat.id));
    },
    
    /**
     * Get beats by author
     */
    getBeatsByAuthor(author) {
        return this.beats.filter(b => b.author === author);
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCENE METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a scene from selected beats
     */
    createScene(title, beatIds, metadata = {}) {
        const scene = {
            id: this.generateId('scene'),
            title: title,
            beatIds: beatIds, // Array of beat IDs
            actId: metadata.actId || 'act-1',
            chapterId: metadata.chapterId || null,
            author: metadata.author || this.currentUser,
            mode: metadata.mode || 'novelist',
            status: metadata.status || 'draft',
            
            // Scene metadata
            characters: metadata.characters || [],      // Array of character IDs
            location: metadata.location || null,         // Location ID
            mckeeElement: metadata.mckeeElement || null, // McKee story beat
            conflictType: metadata.conflictType || null, // Type of conflict
            purpose: metadata.purpose || '',             // Scene purpose/function
            
            created: Date.now(),
            modified: Date.now()
        };
        
        this.scenes.push(scene);
        this.currentScene = scene.id;
        
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('sceneCreated', scene);
        
        return scene;
    },
    
    /**
     * Update a scene
     */
    updateScene(sceneId, updates) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) {
            console.error('❌ Scene not found:', sceneId);
            return null;
        }
        
        // Apply updates
        Object.assign(scene, updates);
        scene.modified = Date.now();
        
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('sceneUpdated', scene);
        
        return scene;
    },
    
    /**
     * Delete a scene
     */
    deleteScene(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) {
            console.error('❌ Scene not found:', sceneId);
            return false;
        }
        
        // Note: We do NOT delete the beats - they become orphaned
        // This allows user to reuse them in new scenes
        
        this.scenes = this.scenes.filter(s => s.id !== sceneId);
        
        if (this.currentScene === sceneId) {
            this.currentScene = this.scenes[0]?.id || null;
        }
        
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('sceneDeleted', sceneId);
        
        return true;
    },
    
    /**
     * Get scene by ID
     */
    getScene(sceneId) {
        return this.scenes.find(s => s.id === sceneId);
    },
    
    /**
     * Get all beats for a scene (in order)
     */
    getBeatsForScene(sceneId) {
        const scene = this.getScene(sceneId);
        if (!scene) return [];
        
        return scene.beatIds
            .map(beatId => this.getBeat(beatId))
            .filter(beat => beat !== undefined);
    },
    
    /**
     * Get scenes by act
     */
    getScenesByAct(actId) {
        return this.scenes.filter(s => s.actId === actId);
    },
    
    /**
     * Get scenes by chapter
     */
    getScenesByChapter(chapterId) {
        return this.scenes.filter(s => s.chapterId === chapterId);
    },
    
    /**
     * Get scenes by author
     */
    getScenesByAuthor(author) {
        return this.scenes.filter(s => s.author === author);
    },
    
    /**
     * Get scenes by character
     */
    getScenesByCharacter(characterId) {
        return this.scenes.filter(s => s.characters.includes(characterId));
    },
    
    /**
     * Get scenes by location
     */
    getScenesByLocation(locationId) {
        return this.scenes.filter(s => s.location === locationId);
    },
    
    /**
     * Get total word count for all scenes
     */
    getTotalWordCount() {
        let count = 0;
        this.scenes.forEach(scene => {
            const beats = this.getBeatsForScene(scene.id);
            beats.forEach(beat => {
                const text = beat.content.replace(/<[^>]*>/g, ''); // Strip HTML
                count += text.split(/\s+/).filter(word => word.length > 0).length;
            });
        });
        return count;
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // CHARACTER METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a character
     */
    createCharacter(name, data = {}) {
        const character = {
            id: this.generateId('char'),
            name: name,
            role: data.role || '',
            description: data.description || '',
            discoveries: data.discoveries || [],      // Array of discovery objects
            relationships: data.relationships || [],  // Array of relationship objects
            created: Date.now(),
            modified: Date.now()
        };
        
        this.characters.push(character);
        
        this.saveToStorage('chronicle_characters', this.characters);
        this.notifyListeners('characterCreated', character);
        
        return character;
    },
    
    /**
     * Update a character
     */
    updateCharacter(charId, updates) {
        const char = this.characters.find(c => c.id === charId);
        if (!char) {
            console.error('❌ Character not found:', charId);
            return null;
        }
        
        Object.assign(char, updates);
        char.modified = Date.now();
        
        this.saveToStorage('chronicle_characters', this.characters);
        this.notifyListeners('characterUpdated', char);
        
        return char;
    },
    
    /**
     * Delete a character
     */
    deleteCharacter(charId) {
        this.characters = this.characters.filter(c => c.id !== charId);
        
        // Remove character from all scenes
        this.scenes.forEach(scene => {
            scene.characters = scene.characters.filter(id => id !== charId);
        });
        
        this.saveToStorage('chronicle_characters', this.characters);
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('characterDeleted', charId);
        
        return true;
    },
    
    /**
     * Get character by ID
     */
    getCharacter(charId) {
        return this.characters.find(c => c.id === charId);
    },
    
    /**
     * Get character by name
     */
    getCharacterByName(name) {
        return this.characters.find(c => 
            c.name.toLowerCase() === name.toLowerCase()
        );
    },
    
    /**
     * Get all scenes featuring a character
     */
    getScenesForCharacter(charId) {
        return this.scenes.filter(s => s.characters.includes(charId));
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // LOCATION METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a location
     */
    createLocation(name, data = {}) {
        const location = {
            id: this.generateId('loc'),
            name: name,
            description: data.description || '',
            importance: data.importance || 'minor', // minor, major, critical
            created: Date.now(),
            modified: Date.now()
        };
        
        this.locations.push(location);
        
        this.saveToStorage('chronicle_locations', this.locations);
        this.notifyListeners('locationCreated', location);
        
        return location;
    },
    
    /**
     * Update a location
     */
    updateLocation(locId, updates) {
        const loc = this.locations.find(l => l.id === locId);
        if (!loc) {
            console.error('❌ Location not found:', locId);
            return null;
        }
        
        Object.assign(loc, updates);
        loc.modified = Date.now();
        
        this.saveToStorage('chronicle_locations', this.locations);
        this.notifyListeners('locationUpdated', loc);
        
        return loc;
    },
    
    /**
     * Delete a location
     */
    deleteLocation(locId) {
        this.locations = this.locations.filter(l => l.id !== locId);
        
        // Remove location from all scenes
        this.scenes.forEach(scene => {
            if (scene.location === locId) {
                scene.location = null;
            }
        });
        
        this.saveToStorage('chronicle_locations', this.locations);
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('locationDeleted', locId);
        
        return true;
    },
    
    /**
     * Get location by ID
     */
    getLocation(locId) {
        return this.locations.find(l => l.id === locId);
    },
    
    /**
     * Get location by name
     */
    getLocationByName(name) {
        return this.locations.find(l => 
            l.name.toLowerCase() === name.toLowerCase()
        );
    },
    
    /**
     * Get all scenes at a location
     */
    getScenesForLocation(locId) {
        return this.scenes.filter(s => s.location === locId);
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // CHAPTER & ACT METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a chapter
     */
    createChapter(title, actId, data = {}) {
        const chapter = {
            id: this.generateId('chapter'),
            title: title,
            actId: actId,
            number: data.number || this.getChaptersByAct(actId).length + 1,
            description: data.description || '',
            created: Date.now(),
            modified: Date.now()
        };
        
        this.chapters.push(chapter);
        
        this.saveToStorage('chronicle_chapters', this.chapters);
        this.notifyListeners('chapterCreated', chapter);
        
        return chapter;
    },
    
    /**
     * Update a chapter
     */
    updateChapter(chapterId, updates) {
        const chapter = this.chapters.find(c => c.id === chapterId);
        if (!chapter) {
            console.error('❌ Chapter not found:', chapterId);
            return null;
        }
        
        Object.assign(chapter, updates);
        chapter.modified = Date.now();
        
        this.saveToStorage('chronicle_chapters', this.chapters);
        this.notifyListeners('chapterUpdated', chapter);
        
        return chapter;
    },
    
    /**
     * Delete a chapter
     */
    deleteChapter(chapterId) {
        this.chapters = this.chapters.filter(c => c.id !== chapterId);
        
        // Remove chapter assignment from all scenes
        this.scenes.forEach(scene => {
            if (scene.chapterId === chapterId) {
                scene.chapterId = null;
            }
        });
        
        this.saveToStorage('chronicle_chapters', this.chapters);
        this.saveToStorage('chronicle_scenes', this.scenes);
        this.notifyListeners('chapterDeleted', chapterId);
        
        return true;
    },
    
    /**
     * Get chapters by act
     */
    getChaptersByAct(actId) {
        return this.chapters.filter(c => c.actId === actId);
    },
    
    /**
     * Get act by ID
     */
    getAct(actId) {
        return this.acts.find(a => a.id === actId);
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // USER & SESSION METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Set current user
     */
    setCurrentUser(userName) {
        this.currentUser = userName;
        this.saveToStorage('chronicle_currentUser', userName);
        this.notifyListeners('userChanged', userName);
    },
    
    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    },
    
    /**
     * Start a writing session
     */
    startSession(author = null) {
        const session = {
            id: this.generateId('session'),
            author: author || this.currentUser,
            startTime: Date.now(),
            endTime: null,
            beatsCreated: 0,
            scenesCreated: 0
        };
        
        this.sessions.push(session);
        this.saveToStorage('chronicle_sessions', this.sessions);
        
        return session;
    },
    
    /**
     * End a writing session
     */
    endSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.endTime = Date.now();
            this.saveToStorage('chronicle_sessions', this.sessions);
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Generate a unique ID
     */
    generateId(prefix = 'item') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Export all data (for backup)
     */
    exportAll() {
        return {
            version: '1.0.0',
            exported: Date.now(),
            beats: this.beats,
            scenes: this.scenes,
            characters: this.characters,
            locations: this.locations,
            chapters: this.chapters,
            acts: this.acts,
            sessions: this.sessions
        };
    },
    
    /**
     * Import all data (from backup)
     */
    importAll(data) {
        if (!data || data.version !== '1.0.0') {
            console.error('❌ Invalid backup data');
            return false;
        }
        
        this.beats = data.beats || [];
        this.scenes = data.scenes || [];
        this.characters = data.characters || [];
        this.locations = data.locations || [];
        this.chapters = data.chapters || [];
        this.acts = data.acts || [];
        this.sessions = data.sessions || [];
        
        this.persist();
        this.notifyListeners('dataImported');
        
        return true;
    },
    
    /**
     * Clear all data (use with caution!)
     */
    clearAll() {
        if (!confirm('⚠️ This will delete ALL data. Are you sure?')) {
            return false;
        }
        
        this.beats = [];
        this.scenes = [];
        this.characters = [];
        this.locations = [];
        this.chapters = [];
        this.acts = this.createDefaultActs();
        this.sessions = [];
        
        this.persist();
        this.notifyListeners('dataCleared');
        
        console.log('🗑️ All data cleared');
        return true;
    },
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            beats: {
                total: this.beats.length,
                orphaned: this.getOrphanedBeats().length,
                inScenes: this.beats.length - this.getOrphanedBeats().length
            },
            scenes: {
                total: this.scenes.length,
                draft: this.scenes.filter(s => s.status === 'draft').length,
                inProgress: this.scenes.filter(s => s.status === 'in-progress').length,
                polished: this.scenes.filter(s => s.status === 'polished').length
            },
            characters: {
                total: this.characters.length
            },
            locations: {
                total: this.locations.length
            },
            wordCount: this.getTotalWordCount()
        };
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.ChronicleData = ChronicleData;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ChronicleData.init();
        });
    } else {
        ChronicleData.init();
    }
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * END OF CHRONICLE DATA FOUNDATION
 * 
 * "For no one can lay any foundation other than the one already laid,
 * which is Jesus Christ." — 1 Corinthians 3:11
 * ════════════════════════════════════════════════════════════════════════════
 */
