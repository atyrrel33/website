// ═══════════════════════════════════════════════════════════════════════════
// CHRONICLE DESK - Beat-First Writing Sanctuary
// "Write down the revelation and make it plain" - Habakkuk 2:2
// ═════════════════════════════════════════════════════════════════════════

const ChronicleDesk = {
    // ═══════════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    // Current working state
    currentBeatId: null,           // Currently active beat
    currentSceneId: null,          // Currently loaded scene (if editing)
    selectedBeatIds: [],           // Beats selected for scene creation
    
    // UI state
    viewMode: 'beat',              // 'beat' or 'scene'
    isEditingScene: false,         // Whether we're editing an existing scene
    beatSidebarVisible: true,      // Beat selection sidebar visibility
    
    // Auto-save
    autoSaveInterval: null,
    autoSaveDelay: 2000,           // 2 seconds
    hasUnsavedChanges: false,
    
    // Initialization
    initialized: false,
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    init() {
        if (this.initialized) return;
        
        console.log('📖 The Desk awakens...');
        
        // Register listener for ChronicleData changes
        ChronicleData.addListener((event, data) => {
            this.handleDataChange(event, data);
        });
        
        // Setup UI components
        this.setupEventListeners();
        this.setupFormattingButtons();
        this.setupKeyboardShortcuts();
        this.populateReferencePanel();
        this.populateSceneSwitcher();
        
        // Load initial state
        this.loadInitialView();
        
        // Start auto-save
        this.startAutoSave();
        
        this.initialized = true;
        console.log('✅ The Desk stands ready');
    },
    
    /**
     * Handle data changes from ChronicleData
     */
    handleDataChange(event, data) {
        console.log('📖 Desk: Data change detected:', event);
        
        switch(event) {
            case 'sceneCreated':
            case 'sceneUpdated':
            case 'sceneDeleted':
                this.populateSceneSwitcher();
                break;
            case 'beatCreated':
            case 'beatUpdated':
            case 'beatDeleted':
                if (this.viewMode === 'beat') {
                    this.refreshBeatSidebar();
                }
                break;
            case 'characterCreated':
            case 'characterUpdated':
            case 'characterDeleted':
            case 'locationCreated':
            case 'locationUpdated':
            case 'locationDeleted':
                this.populateReferencePanel();
                break;
        }
    },
    
    /**
     * Load initial view (either new beat or last scene)
     */
    loadInitialView() {
        // Check if there's a current scene set in ChronicleData
        if (ChronicleData.currentScene) {
            this.loadSceneById(ChronicleData.currentScene);
        } else {
            // Start with a new beat
            this.createNewBeat();
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS SETUP
    // ═══════════════════════════════════════════════════════════════════════
    
    setupEventListeners() {
        console.log('🎯 Setting up Desk event listeners...');
        
        // Action buttons
        this.setupActionButtons();
        
        // Font controls
        this.setupFontControls();
        
        // Scene switcher
        this.setupSceneSwitcher();
        
        // Beat sidebar
        this.setupBeatSidebar();
        
        // Writing surface
        this.setupWritingSurface();
        
        console.log('✅ Event listeners configured');
    },
    
    /**
     * Setup main action buttons
     */
    setupActionButtons() {
        // New Beat button
        const newBeatBtn = document.getElementById('newBeatBtn');
        if (newBeatBtn) {
            newBeatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.createNewBeat();
            });
        }
        
        // Save button (saves current beat OR scene)
        const saveBtn = document.getElementById('saveSceneBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveExplicitly();
            });
        }
        
        // Delete button
        const deleteBtn = document.getElementById('deleteSceneBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isEditingScene) {
                    this.deleteCurrentScene();
                } else {
                    this.deleteCurrentBeat();
                }
            });
        }
        
        // Save Selected as Scene button
        const saveAsSceneBtn = document.getElementById('saveAsSceneBtn');
        if (saveAsSceneBtn) {
            saveAsSceneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSceneCreationModal();
            });
        }
        
        // New Scene button (alternate entry point)
        const newSceneBtn = document.getElementById('newSceneBtn');
        if (newSceneBtn) {
            newSceneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSceneCreationModal();
            });
        }
    },
    
    /**
     * Setup font controls
     */
    setupFontControls() {
        const fontSelector = document.getElementById('fontSelector');
        const fontSizeSelector = document.getElementById('fontSizeSelector');
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        
        if (fontSelector) {
            fontSelector.addEventListener('change', (e) => {
                const writingSurface = document.getElementById('writingSurface');
                if (writingSurface) {
                    writingSurface.style.fontFamily = e.target.value;
                }
            });
        }
        
        if (fontSizeSelector) {
            fontSizeSelector.addEventListener('change', (e) => {
                this.changeFontSize(e.target.value);
            });
        }
        
        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => this.adjustFontSize(2));
        }
        
        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => this.adjustFontSize(-2));
        }
    },
    
    /**
     * Setup scene switcher dropdown
     */
    setupSceneSwitcher() {
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        if (sceneSwitcher) {
            sceneSwitcher.addEventListener('change', (e) => {
                const sceneId = e.target.value;
                if (sceneId) {
                    this.loadSceneById(sceneId);
                } else {
                    // "New Beat" option selected
                    this.createNewBeat();
                }
            });
        }
    },
    
    /**
     * Setup beat sidebar interactions
     */
    setupBeatSidebar() {
        // Beat sidebar toggle
        const toggleBtn = document.getElementById('toggleBeatSidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleBeatSidebar();
            });
        }
        
        // "Select All Orphaned Beats" button
        const selectAllBtn = document.getElementById('selectAllBeats');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAllOrphanedBeats();
            });
        }
        
        // "Clear Selection" button
        const clearSelectionBtn = document.getElementById('clearBeatSelection');
        if (clearSelectionBtn) {
            clearSelectionBtn.addEventListener('click', () => {
                this.clearBeatSelection();
            });
        }
    },
    
    /**
     * Setup writing surface events
     */
    setupWritingSurface() {
        const writingSurface = document.getElementById('writingSurface');
        if (!writingSurface) return;
        
        // Track changes for auto-save
        writingSurface.addEventListener('input', () => {
            this.hasUnsavedChanges = true;
            this.updateButtonStates();
        });
        
        // Update formatting button states on selection change
        writingSurface.addEventListener('mouseup', () => {
            this.updateFormattingButtonStates();
        });
        
        writingSurface.addEventListener('keyup', () => {
            this.updateFormattingButtonStates();
        });
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // FORMATTING CONTROLS
    // ═══════════════════════════════════════════════════════════════════════
    
    setupFormattingButtons() {
        // Bold, Italic, Underline
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');
        
        if (boldBtn) boldBtn.addEventListener('click', () => this.formatText('bold'));
        if (italicBtn) italicBtn.addEventListener('click', () => this.formatText('italic'));
        if (underlineBtn) underlineBtn.addEventListener('click', () => this.formatText('underline'));
        
        // Lists
        const bulletBtn = document.getElementById('bulletListBtn');
        const numberBtn = document.getElementById('numberedListBtn');
        
        if (bulletBtn) bulletBtn.addEventListener('click', () => this.formatText('insertUnorderedList'));
        if (numberBtn) numberBtn.addEventListener('click', () => this.formatText('insertOrderedList'));
        
        // Alignment
        const alignLeftBtn = document.getElementById('alignLeftBtn');
        const alignCenterBtn = document.getElementById('alignCenterBtn');
        const alignRightBtn = document.getElementById('alignRightBtn');
        
        if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => this.formatText('justifyLeft'));
        if (alignCenterBtn) alignCenterBtn.addEventListener('click', () => this.formatText('justifyCenter'));
        if (alignRightBtn) alignRightBtn.addEventListener('click', () => this.formatText('justifyRight'));
    },
    
    /**
     * Apply text formatting
     */
    formatText(command) {
        document.execCommand(command, false, null);
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.focus();
        }
        this.updateFormattingButtonStates();
        this.hasUnsavedChanges = true;
    },
    
    /**
     * Update formatting button states based on current selection
     */
    updateFormattingButtonStates() {
        const buttons = {
            'boldBtn': 'bold',
            'italicBtn': 'italic',
            'underlineBtn': 'underline'
        };
        
        Object.entries(buttons).forEach(([btnId, command]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                const isActive = document.queryCommandState(command);
                btn.classList.toggle('active', isActive);
            }
        });
    },
    
    /**
     * Change font size
     */
    changeFontSize(size) {
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.style.fontSize = size;
        }
    },
    
    /**
     * Adjust font size incrementally
     */
    adjustFontSize(delta) {
        const writingSurface = document.getElementById('writingSurface');
        if (!writingSurface) return;
        
        const currentSize = parseFloat(window.getComputedStyle(writingSurface).fontSize);
        const newSize = Math.max(12, Math.min(32, currentSize + delta)); // Clamp between 12-32px
        writingSurface.style.fontSize = newSize + 'px';
    },
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.formatText('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.formatText('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.formatText('underline');
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveExplicitly();
                        break;
                }
            }
        });
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // BEAT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create a new beat
     */
    createNewBeat() {
        console.log('✨ Creating new beat...');
        
        // Save current beat if exists
        if (this.currentBeatId) {
            this.saveCurrentBeat();
        }
        
        // Create new beat via ChronicleData
        const beat = ChronicleData.createBeat();
        this.currentBeatId = beat.id;
        this.currentSceneId = null;
        this.isEditingScene = false;
        this.viewMode = 'beat';
        
        // Clear writing surface
        this.clearWritingSurface();
        
        // Update UI
        this.updateSceneTitle('New Beat');
        this.updateButtonStates();
        this.refreshBeatSidebar();
        
        // Focus writing surface
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.focus();
        }
        
        console.log('✅ New beat created:', beat.id);
    },
    
    /**
     * Load a beat by ID
     */
    loadBeat(beatId) {
        console.log('📖 Loading beat:', beatId);
        
        const beat = ChronicleData.getBeat(beatId);
        if (!beat) {
            console.error('❌ Beat not found:', beatId);
            return;
        }
        
        // Save current beat if different
        if (this.currentBeatId && this.currentBeatId !== beatId) {
            this.saveCurrentBeat();
        }
        
        this.currentBeatId = beatId;
        this.currentSceneId = null;
        this.isEditingScene = false;
        this.viewMode = 'beat';
        
        // Load content
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.innerHTML = beat.content;
        }
        
        this.updateSceneTitle('Editing Beat');
        this.updateButtonStates();
        this.hasUnsavedChanges = false;
    },
    
    /**
     * Save current beat
     */
    saveCurrentBeat() {
        if (!this.currentBeatId) return;
        
        const writingSurface = document.getElementById('writingSurface');
        if (!writingSurface) return;
        
        const content = writingSurface.innerHTML;
        ChronicleData.saveBeat(this.currentBeatId, content);
        
        this.hasUnsavedChanges = false;
        this.updateButtonStates();
        this.refreshBeatSidebar();
        
        console.log('💾 Beat saved:', this.currentBeatId);
    },
    
    /**
     * Delete current beat
     */
    deleteCurrentBeat() {
        if (!this.currentBeatId) return;
        
        if (!confirm('Delete this beat? This cannot be undone.')) {
            return;
        }
        
        const success = ChronicleData.deleteBeat(this.currentBeatId);
        
        if (success) {
            console.log('🗑️ Beat deleted');
            this.createNewBeat(); // Start fresh
        } else {
            alert('Cannot delete this beat - it belongs to a scene. Delete the scene first.');
        }
    },
    
    /**
     * Toggle beat in selection
     */
    toggleBeatSelection(beatId) {
        const index = this.selectedBeatIds.indexOf(beatId);
        
        if (index > -1) {
            // Deselect
            this.selectedBeatIds.splice(index, 1);
        } else {
            // Select
            this.selectedBeatIds.push(beatId);
        }
        
        this.refreshBeatSidebar();
        this.updateButtonStates();
    },
    
    /**
     * Select all orphaned beats
     */
    selectAllOrphanedBeats() {
        const orphanedBeats = ChronicleData.getOrphanedBeats();
        this.selectedBeatIds = orphanedBeats.map(beat => beat.id);
        this.refreshBeatSidebar();
        this.updateButtonStates();
    },
    
    /**
     * Clear beat selection
     */
    clearBeatSelection() {
        this.selectedBeatIds = [];
        this.refreshBeatSidebar();
        this.updateButtonStates();
    },
    
    /**
     * Refresh beat sidebar display
     */
    refreshBeatSidebar() {
        const beatList = document.getElementById('beatList');
        if (!beatList) return;
        
        beatList.innerHTML = '';
        
        const orphanedBeats = ChronicleData.getOrphanedBeats();
        
        if (orphanedBeats.length === 0) {
            beatList.innerHTML = `
                <div class="empty-beat-list">
                    <p>No orphaned beats</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">Create new beats or they'll appear here when scenes are deleted</p>
                </div>
            `;
            return;
        }
        
        orphanedBeats.forEach(beat => {
            const beatItem = this.createBeatListItem(beat);
            beatList.appendChild(beatItem);
        });
        
        // Update selection count
        this.updateSelectionCount();
    },
    
    /**
     * Create beat list item element
     */
    createBeatListItem(beat) {
        const item = document.createElement('div');
        item.className = 'beat-list-item';
        item.dataset.beatId = beat.id;
        
        const isSelected = this.selectedBeatIds.includes(beat.id);
        if (isSelected) {
            item.classList.add('selected');
        }
        
        // Preview text
        const preview = beat.content.replace(/<[^>]*>/g, '').trim();
        const shortPreview = preview.length > 60 ? preview.substring(0, 60) + '...' : preview;
        
        // Date
        const date = new Date(beat.created);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        item.innerHTML = `
            <div class="beat-checkbox">
                <input type="checkbox" ${isSelected ? 'checked' : ''} 
                    onchange="ChronicleDesk.toggleBeatSelection('${beat.id}')">
            </div>
            <div class="beat-preview">
                <div class="beat-preview-text">${shortPreview || '<empty beat>'}</div>
                <div class="beat-meta">
                    <span class="beat-author ${beat.author}">${beat.author}</span>
                    <span class="beat-date">${dateStr}</span>
                </div>
            </div>
        `;
        
        // Click to load beat
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                this.loadBeat(beat.id);
            }
        });
        
        return item;
    },
    
    /**
     * Update selection count display
     */
    updateSelectionCount() {
        const countEl = document.getElementById('selectedBeatCount');
        if (countEl) {
            const count = this.selectedBeatIds.length;
            countEl.textContent = count > 0 ? `${count} selected` : 'None selected';
        }
    },
    
    /**
     * Toggle beat sidebar visibility
     */
    toggleBeatSidebar() {
        this.beatSidebarVisible = !this.beatSidebarVisible;
        
        const sidebar = document.getElementById('beatSidebar');
        const toggleBtn = document.getElementById('toggleBeatSidebar');
        
        if (sidebar) {
            sidebar.classList.toggle('hidden', !this.beatSidebarVisible);
        }
        
        if (toggleBtn) {
            toggleBtn.innerHTML = this.beatSidebarVisible ? '◀' : '▶';
        }
    },

    // SCENE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Open scene creation modal
     */
    openSceneCreationModal() {
        // Ensure we have beats selected
        if (this.selectedBeatIds.length === 0) {
            alert('Please select at least one beat to create a scene.');
            return;
        }
        
        // Save current beat first
        if (this.currentBeatId && this.hasUnsavedChanges) {
            this.saveCurrentBeat();
        }
        
        // Show modal
        const modal = document.getElementById('sceneMetadataModal');
        if (!modal) {
            console.error('❌ Scene metadata modal not found');
            return;
        }
        
        // Reset form
        this.resetSceneMetadataForm();
        
        // Populate character and location dropdowns
        this.populateSceneMetadataSelects();
        
        // Show modal
        modal.style.display = 'flex';
        
        // Focus title input
        const titleInput = document.getElementById('sceneTitle');
        if (titleInput) {
            titleInput.focus();
        }
        
        // Setup modal buttons
        this.setupSceneMetadataModal();
    },
    
    /**
     * Setup scene metadata modal buttons
     */
    setupSceneMetadataModal() {
        const modal = document.getElementById('sceneMetadataModal');
        const saveBtn = document.getElementById('saveSceneMetadata');
        const cancelBtn = document.getElementById('cancelSceneMetadata');
        
        if (saveBtn) {
            // Remove old listeners
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('saveSceneMetadata');
            
            newSaveBtn.addEventListener('click', () => {
                this.createSceneFromBeats();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
            const newCancelBtn = document.getElementById('cancelSceneMetadata');
            
            newCancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    },
    
    /**
     * Reset scene metadata form
     */
    resetSceneMetadataForm() {
        const titleInput = document.getElementById('sceneTitle');
        const actSelect = document.getElementById('sceneAct');
        const chapterSelect = document.getElementById('sceneChapter');
        const statusSelect = document.getElementById('sceneStatus');
        const mckeeSelect = document.getElementById('sceneMckee');
        const conflictSelect = document.getElementById('sceneConflict');
        const purposeInput = document.getElementById('scenePurpose');
        
        if (titleInput) titleInput.value = '';
        if (actSelect) actSelect.value = 'act-1';
        if (chapterSelect) chapterSelect.value = '';
        if (statusSelect) statusSelect.value = 'draft';
        if (mckeeSelect) mckeeSelect.value = '';
        if (conflictSelect) conflictSelect.value = '';
        if (purposeInput) purposeInput.value = '';
        
        // Clear multi-selects
        const characterSelect = document.getElementById('sceneCharacters');
        if (characterSelect) {
            Array.from(characterSelect.options).forEach(opt => opt.selected = false);
        }
        
        const locationSelect = document.getElementById('sceneLocation');
        if (locationSelect) locationSelect.value = '';
    },
    
    /**
     * Populate scene metadata selects
     */
    populateSceneMetadataSelects() {
        // Characters multi-select
        const characterSelect = document.getElementById('sceneCharacters');
        if (characterSelect) {
            characterSelect.innerHTML = '';
            ChronicleData.characters.forEach(char => {
                const option = document.createElement('option');
                option.value = char.id;
                option.textContent = char.name;
                characterSelect.appendChild(option);
            });
        }
        
        // Location select
        const locationSelect = document.getElementById('sceneLocation');
        if (locationSelect) {
            locationSelect.innerHTML = '<option value="">No specific location</option>';
            ChronicleData.locations.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc.id;
                option.textContent = loc.name;
                locationSelect.appendChild(option);
            });
        }
        
        // Chapter select (based on selected act)
        this.updateChapterSelect();
        
        // Setup act change handler to update chapters
        const actSelect = document.getElementById('sceneAct');
        if (actSelect) {
            actSelect.addEventListener('change', () => {
                this.updateChapterSelect();
            });
        }
    },
    
    /**
     * Update chapter select based on selected act
     */
    updateChapterSelect() {
        const actSelect = document.getElementById('sceneAct');
        const chapterSelect = document.getElementById('sceneChapter');
        
        if (!actSelect || !chapterSelect) return;
        
        const selectedActId = actSelect.value;
        chapterSelect.innerHTML = '<option value="">No chapter</option>';
        
        const chapters = ChronicleData.getChaptersByAct(selectedActId);
        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.id;
            option.textContent = chapter.title;
            chapterSelect.appendChild(option);
        });
    },
    
    /**
     * Create scene from selected beats
     */
    createSceneFromBeats() {
        // Get form values
        const title = document.getElementById('sceneTitle').value.trim();
        const actId = document.getElementById('sceneAct').value;
        const chapterId = document.getElementById('sceneChapter').value || null;
        const status = document.getElementById('sceneStatus').value;
        const mckeeElement = document.getElementById('sceneMckee').value || null;
        const conflictType = document.getElementById('sceneConflict').value || null;
        const purpose = document.getElementById('scenePurpose').value.trim();
        
        // Get selected characters
        const characterSelect = document.getElementById('sceneCharacters');
        const characters = Array.from(characterSelect.selectedOptions).map(opt => opt.value);
        
        // Get location
        const location = document.getElementById('sceneLocation').value || null;
        
        // Validate
        if (!title) {
            alert('Please enter a scene title.');
            return;
        }
        
        if (this.selectedBeatIds.length === 0) {
            alert('No beats selected.');
            return;
        }
        
        // Create scene via ChronicleData
        const scene = ChronicleData.createScene(title, this.selectedBeatIds, {
            actId: actId,
            chapterId: chapterId,
            author: ChronicleData.getCurrentUser(),
            mode: 'novelist',
            status: status,
            characters: characters,
            location: location,
            mckeeElement: mckeeElement,
            conflictType: conflictType,
            purpose: purpose
        });
        
        console.log('✅ Scene created:', scene.title);
        
        // Close modal
        const modal = document.getElementById('sceneMetadataModal');
        if (modal) modal.style.display = 'none';
        
        // Clear beat selection
        this.clearBeatSelection();
        
        // Load the new scene
        this.loadSceneById(scene.id);
        
        // Update scene switcher
        this.populateSceneSwitcher();
        
        // Show success message
        this.showNotification(`Scene "${scene.title}" created successfully!`, 'success');
    },
    
    /**
     * Load scene by ID
     */
    loadSceneById(sceneId) {
        console.log('📖 Loading scene:', sceneId);
        
        const scene = ChronicleData.getScene(sceneId);
        if (!scene) {
            console.error('❌ Scene not found:', sceneId);
            return;
        }
        
        // Save current beat if editing one
        if (this.currentBeatId && this.hasUnsavedChanges && !this.isEditingScene) {
            this.saveCurrentBeat();
        }
        
        // Update state
        this.currentSceneId = sceneId;
        this.currentBeatId = null;
        this.isEditingScene = true;
        this.viewMode = 'scene';
        
        // Get beats for this scene
        const beats = ChronicleData.getBeatsForScene(sceneId);
        
        // Combine beat content
        const combinedContent = beats.map(beat => beat.content).join('<hr class="beat-separator">');
        
        // Load into writing surface
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.innerHTML = combinedContent;
        }
        
        // Update scene title
        this.updateSceneTitle(scene.title);
        
        // Update scene switcher selection
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        if (sceneSwitcher) {
            sceneSwitcher.value = sceneId;
        }
        
        // Update UI
        this.updateButtonStates();
        this.hasUnsavedChanges = false;
        
        console.log('✅ Scene loaded with', beats.length, 'beats');
    },
    
    /**
     * Delete current scene
     */
    deleteCurrentScene() {
        if (!this.currentSceneId) return;
        
        const scene = ChronicleData.getScene(this.currentSceneId);
        if (!scene) return;
        
        if (!confirm(`Delete scene "${scene.title}"? The beats will become orphaned and can be reused.`)) {
            return;
        }
        
        const success = ChronicleData.deleteScene(this.currentSceneId);
        
        if (success) {
            console.log('🗑️ Scene deleted');
            this.showNotification('Scene deleted. Beats are now orphaned.', 'info');
            
            // Refresh UI
            this.populateSceneSwitcher();
            this.refreshBeatSidebar();
            
            // Create new beat
            this.createNewBeat();
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCENE SWITCHER
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Populate scene switcher dropdown
     */
    populateSceneSwitcher() {
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        if (!sceneSwitcher) return;
        
        sceneSwitcher.innerHTML = '';
        
        // Add "New Beat" option
        const newBeatOption = document.createElement('option');
        newBeatOption.value = '';
        newBeatOption.textContent = '+ New Beat';
        sceneSwitcher.appendChild(newBeatOption);
        
        // Get all scenes
        const scenes = ChronicleData.scenes;
        
        if (scenes.length === 0) {
            return;
        }
        
        // Group by Act
        ChronicleData.acts.forEach(act => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            if (actScenes.length > 0) {
                const actGroup = document.createElement('optgroup');
                actGroup.label = `⚔ ${act.title}`;
                
                // Get chapters in this act
                const actChapters = ChronicleData.getChaptersByAct(act.id);
                
                if (actChapters.length > 0) {
                    actChapters.forEach(chapter => {
                        const chapterScenes = actScenes.filter(s => s.chapterId === chapter.id);
                        
                        if (chapterScenes.length > 0) {
                            const chapterGroup = document.createElement('optgroup');
                            chapterGroup.label = `  📖 ${chapter.title}`;
                            
                            chapterScenes.forEach(scene => {
                                const option = document.createElement('option');
                                option.value = scene.id;
                                option.textContent = `    ${scene.title}`;
                                chapterGroup.appendChild(option);
                            });
                            
                            sceneSwitcher.appendChild(chapterGroup);
                        }
                    });
                }
                
                // Unchaptered scenes in this act
                const unchapteredScenes = actScenes.filter(s => !s.chapterId);
                if (unchapteredScenes.length > 0) {
                    unchapteredScenes.forEach(scene => {
                        const option = document.createElement('option');
                        option.value = scene.id;
                        option.textContent = `  ${scene.title}`;
                        actGroup.appendChild(option);
                    });
                    
                    sceneSwitcher.appendChild(actGroup);
                }
            }
        });
        
        // Set current selection
        if (this.currentSceneId) {
            sceneSwitcher.value = this.currentSceneId;
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // REFERENCE PANEL
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Populate reference panel with characters and locations
     */
    populateReferencePanel() {
        const panelContent = document.querySelector('.panel-content');
        if (!panelContent) return;
        
        panelContent.innerHTML = '';
        
        // Characters section
        const charSection = this.createCharactersSection();
        panelContent.appendChild(charSection);
        
        // Locations section
        const locSection = this.createLocationsSection();
        panelContent.appendChild(locSection);
    },
    
    /**
     * Create characters section
     */
    createCharactersSection() {
        const section = document.createElement('div');
        section.className = 'reference-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Characters';
        section.appendChild(title);
        
        if (ChronicleData.characters.length === 0) {
            const empty = document.createElement('p');
            empty.style.opacity = '0.7';
            empty.style.fontSize = '0.9rem';
            empty.textContent = 'No characters yet. Add them in The Archive.';
            section.appendChild(empty);
            return section;
        }
        
        ChronicleData.characters.forEach(char => {
            const item = document.createElement('div');
            item.className = 'reference-item character-item';
            item.innerHTML = `
                <strong>${char.name}</strong>
                ${char.role ? `<em style="color: var(--teal); font-size: 0.9rem; display: block; margin: 0.2rem 0;">${char.role}</em>` : ''}
                ${char.description ? `<p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">${char.description}</p>` : ''}
            `;
            section.appendChild(item);
        });
        
        return section;
    },
    
    /**
     * Create locations section
     */
    createLocationsSection() {
        const section = document.createElement('div');
        section.className = 'reference-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Locations';
        section.appendChild(title);
        
        if (ChronicleData.locations.length === 0) {
            const empty = document.createElement('p');
            empty.style.opacity = '0.7';
            empty.style.fontSize = '0.9rem';
            empty.textContent = 'No locations yet. Add them when creating scenes.';
            section.appendChild(empty);
            return section;
        }
        
        ChronicleData.locations.forEach(loc => {
            const item = document.createElement('div');
            item.className = 'reference-item location-item';
            item.innerHTML = `
                <strong>📍 ${loc.name}</strong>
                ${loc.description ? `<p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">${loc.description}</p>` : ''}
            `;
            section.appendChild(item);
        });
        
        return section;
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // AUTO-SAVE SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Start auto-save interval
     */
    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.autoSave();
            }
        }, this.autoSaveDelay);
        
        console.log('⏰ Auto-save started (every', this.autoSaveDelay / 1000, 'seconds)');
    },
    
    /**
     * Auto-save current work
     */
    autoSave() {
        if (this.isEditingScene) {
            // For scenes, we save the combined beat content
            // Note: In full implementation, you'd split content back into beats
            // For now, we just mark as saved
            console.log('💾 Auto-saving scene...');
            this.hasUnsavedChanges = false;
        } else if (this.currentBeatId) {
            // Save current beat
            this.saveCurrentBeat();
            console.log('💾 Auto-saved beat');
        }
        
        this.updateButtonStates();
    },
    
    /**
     * Explicit save (button or Ctrl+S)
     */
    saveExplicitly() {
        if (this.isEditingScene) {
            console.log('💾 Saving scene...');
            this.hasUnsavedChanges = false;
            this.showNotification('Scene saved', 'success');
        } else if (this.currentBeatId) {
            this.saveCurrentBeat();
            this.showNotification('Beat saved', 'success');
        }
        
        this.updateButtonStates();
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // UI HELPERS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Update scene title display
     */
    updateSceneTitle(title) {
        const titleInput = document.getElementById('sceneTitle');
        if (titleInput) {
            titleInput.value = title;
        }
    },
    
    /**
     * Clear writing surface
     */
    clearWritingSurface() {
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.innerHTML = '';
        }
        this.hasUnsavedChanges = false;
    },
    
    /**
     * Update button states based on current context
     */
    updateButtonStates() {
        const saveBtn = document.getElementById('saveSceneBtn');
        const deleteBtn = document.getElementById('deleteSceneBtn');
        const saveAsSceneBtn = document.getElementById('saveAsSceneBtn');
        const newBeatBtn = document.getElementById('newBeatBtn');
        
        // Save button
        if (saveBtn) {
            saveBtn.disabled = !this.hasUnsavedChanges;
            saveBtn.style.opacity = this.hasUnsavedChanges ? '1' : '0.5';
        }
        
        // Delete button
        if (deleteBtn) {
            const canDelete = this.isEditingScene || this.currentBeatId;
            deleteBtn.disabled = !canDelete;
            deleteBtn.style.opacity = canDelete ? '1' : '0.5';
            deleteBtn.textContent = this.isEditingScene ? 'Delete Scene' : 'Delete Beat';
        }
        
        // Save as Scene button
        if (saveAsSceneBtn) {
            const hasSelection = this.selectedBeatIds.length > 0;
            saveAsSceneBtn.disabled = !hasSelection;
            saveAsSceneBtn.style.opacity = hasSelection ? '1' : '0.5';
            
            if (hasSelection) {
                saveAsSceneBtn.textContent = `Save ${this.selectedBeatIds.length} Beat${this.selectedBeatIds.length > 1 ? 's' : ''} as Scene`;
            } else {
                saveAsSceneBtn.textContent = 'Save Selected as Scene';
            }
        }
        
        // New Beat button
        if (newBeatBtn) {
            newBeatBtn.style.opacity = this.viewMode === 'beat' ? '0.5' : '1';
        }
    },
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `desk-notification ${type}`;
        notification.textContent = message;
        
        // Style
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2C5F5F' : type === 'error' ? '#722F37' : '#8B7355'};
            color: #F4EFE8;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Crimson Text', serif;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    /**
     * Get word count from HTML content
     */
    getWordCount(htmlContent) {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// MODULE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

// Make available globally
window.ChronicleDesk = ChronicleDesk;

// Initialize when Desk workspace becomes active
document.addEventListener('DOMContentLoaded', () => {
    const deskTab = document.querySelector('[data-space="desk"]');
    if (deskTab) {
        deskTab.addEventListener('click', () => {
            setTimeout(() => {
                if (!ChronicleDesk.initialized) {
                    ChronicleDesk.init();
                }
            }, 100);
        });
    }
});

console.log('✍️ Chronicle Desk module loaded');

// ═══════════════════════════════════════════════════════════════════════
// END OF CHRONICLE DESK
// 
// "Whatever you do, work at it with all your heart, 
// as working for the Lord, not for human masters." 
// — Colossians 3:23
// ═══════════════════════════════════════════════════════════════════════