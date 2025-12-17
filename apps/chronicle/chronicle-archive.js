/* ========================================
   THE ARCHIVE - Scene Library & Structure Management
   Sprint 1: Integrated with ChronicleData for cross-workspace intelligence
   ======================================== */

const ChronicleArchive = {
    // State
    currentChamber: 'library',
    viewMode: 'grid', // 'grid' or 'list'
    selectedScene: null,
    filters: {
        search: '',
        author: 'all',
        status: 'all',
        character: 'all',
        location: 'all'
    },
    initialized: false,
    
    // Initialization
    init() {
        if (this.initialized) return;
        
        console.log('📚 Archive: Initializing...');
        
        // Register listener for ChronicleData changes
        ChronicleData.addListener((event, data) => {
            this.handleDataChange(event, data);
        });
        
        // Set up event listeners
        this.setupChamberNavigation();
        this.setupViewToggle();
        this.setupFilters();
        this.setupPreviewPanel();
        
        // Load initial view
        this.loadSceneLibrary();
        this.loadChapterStructure();
        this.updateStats();
        
        this.initialized = true;
        console.log('✅ Archive: Ready');
    },
    
    // Handle data changes from other workspaces
    handleDataChange(event, data) {
        console.log('📚 Archive: Data change detected:', event);
        
        switch(event) {
            case 'sceneCreated':
            case 'sceneUpdated':
            case 'sceneDeleted':
            case 'beatCreated':
            case 'beatUpdated':
            case 'beatDeleted':
                this.refreshCurrentView();
                break;
            case 'characterCreated':
            case 'characterUpdated':
            case 'characterDeleted':
                this.updateCharacterFilter();
                this.refreshCurrentView();
                break;
            case 'locationCreated':
            case 'locationUpdated':
            case 'locationDeleted':
                this.updateLocationFilter();
                this.refreshCurrentView();
                break;
        }
    },
    
    refreshCurrentView() {
        if (this.currentChamber === 'library') {
            this.loadSceneLibrary();
        } else if (this.currentChamber === 'structure') {
            this.loadChapterStructure();
        }
        this.updateStats();
    },
    
    // ===== CHAMBER NAVIGATION =====
    setupChamberNavigation() {
        const chamberTabs = document.querySelectorAll('.chamber-tab');
        
        chamberTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const chamber = tab.dataset.chamber;
                this.switchChamber(chamber);
            });
        });
    },
    
    switchChamber(chamber) {
        // Update tabs
        document.querySelectorAll('.chamber-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.chamber === chamber);
        });
        
        // Update chambers
        document.querySelectorAll('.archive-chamber').forEach(ch => {
            ch.classList.toggle('active', ch.id === `chamber-${chamber}`);
        });
        
        this.currentChamber = chamber;
        
        // Reload content
        if (chamber === 'library') {
            this.loadSceneLibrary();
        } else if (chamber === 'structure') {
            this.loadChapterStructure();
        }
    },
    
    // ===== VIEW TOGGLE (Grid/List) =====
    setupViewToggle() {
        const toggleBtn = document.getElementById('viewToggle');
        if (!toggleBtn) return;
        
        toggleBtn.addEventListener('click', () => {
            this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
            this.loadSceneLibrary();
            
            // Update icon
            toggleBtn.innerHTML = this.viewMode === 'grid' ? `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                </svg>
            ` : `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            `;
        });
    },
    
    // ===== FILTERS & SEARCH =====
    setupFilters() {
        const searchInput = document.getElementById('archiveSearch');
        const authorFilter = document.getElementById('authorFilter');
        const statusFilter = document.getElementById('statusFilter');
        const characterFilter = document.getElementById('characterFilter');
        const locationFilter = document.getElementById('locationFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.loadSceneLibrary();
            });
        }
        
        if (authorFilter) {
            authorFilter.addEventListener('change', (e) => {
                this.filters.author = e.target.value;
                this.loadSceneLibrary();
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.loadSceneLibrary();
            });
        }
        
        if (characterFilter) {
            this.populateCharacterFilter();
            characterFilter.addEventListener('change', (e) => {
                this.filters.character = e.target.value;
                this.loadSceneLibrary();
            });
        }
        
        if (locationFilter) {
            this.populateLocationFilter();
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.loadSceneLibrary();
            });
        }
    },
    
    populateCharacterFilter() {
        const filter = document.getElementById('characterFilter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="all">All Characters</option>';
        
        ChronicleData.characters.forEach(char => {
            const option = document.createElement('option');
            option.value = char.id;
            option.textContent = char.name;
            filter.appendChild(option);
        });
    },
    
    updateCharacterFilter() {
        this.populateCharacterFilter();
    },
    
    populateLocationFilter() {
        const filter = document.getElementById('locationFilter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="all">All Locations</option>';
        
        ChronicleData.locations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.id;
            option.textContent = loc.name;
            filter.appendChild(option);
        });
    },
    
    updateLocationFilter() {
        this.populateLocationFilter();
    },
    
    // ===== SCENE LIBRARY =====
    loadSceneLibrary() {
        const grid = document.getElementById('sceneLibraryGrid');
        if (!grid) return;
        
        // Get scenes from ChronicleData
        let scenes = ChronicleData.scenes;
        
        // Apply filters
        scenes = this.applyFilters(scenes);
        
        // Set view mode class
        grid.className = `scene-library-grid ${this.viewMode}-view`;
        
        // Clear existing
        grid.innerHTML = '';
        
        // Empty state
        if (scenes.length === 0) {
            const hasNoScenes = ChronicleData.scenes.length === 0;
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📚</div>
                    <h3 class="empty-state-title">${hasNoScenes ? 'No Scenes Yet' : 'No Scenes Match Your Filters'}</h3>
                    <p class="empty-state-text">${hasNoScenes ? 'Begin writing in The Desk to populate your treasury' : 'Try adjusting your search or filter criteria'}</p>
                </div>
            `;
            return;
        }
        
        // Sort by last modified (newest first)
        scenes.sort((a, b) => b.modified - a.modified);
        
        // Render scene cards
        scenes.forEach(scene => {
            const card = this.createSceneCard(scene);
            grid.appendChild(card);
        });
    },
    
    applyFilters(scenes) {
        return scenes.filter(scene => {
            // Search filter - search in title and beat content
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const titleMatch = scene.title.toLowerCase().includes(searchTerm);
                
                // Search in beat content
                const beats = ChronicleData.getBeatsForScene(scene.id);
                const contentMatch = beats.some(beat => 
                    beat.content.toLowerCase().includes(searchTerm)
                );
                
                if (!titleMatch && !contentMatch) return false;
            }
            
            // Author filter
            if (this.filters.author !== 'all' && scene.author !== this.filters.author) {
                return false;
            }
            
            // Status filter
            if (this.filters.status !== 'all' && scene.status !== this.filters.status) {
                return false;
            }
            
            // Character filter
            if (this.filters.character !== 'all') {
                if (!scene.characters || !scene.characters.includes(this.filters.character)) {
                    return false;
                }
            }
            
            // Location filter
            if (this.filters.location !== 'all' && scene.location !== this.filters.location) {
                return false;
            }
            
            return true;
        });
    },
    
    createSceneCard(scene) {
        const card = document.createElement('div');
        card.className = 'scene-card';
        card.dataset.sceneId = scene.id;
        
        // Get beats for this scene
        const beats = ChronicleData.getBeatsForScene(scene.id);
        const beatCount = beats.length;
        
        // Calculate word count from beats
        const wordCount = beats.reduce((total, beat) => {
            const text = beat.content.replace(/<[^>]*>/g, '');
            const words = text.split(/\s+/).filter(word => word.length > 0);
            return total + words.length;
        }, 0);
        
        // Format date
        const lastModified = new Date(scene.modified);
        const formattedDate = lastModified.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        // Status label
        const statusLabels = {
            'draft': 'Draft',
            'in-progress': 'In Progress',
            'polished': 'Polished'
        };
        
        // Get character names
        const characterNames = scene.characters
            .map(id => ChronicleData.getCharacter(id)?.name)
            .filter(name => name)
            .join(', ');
        
        // Get location name
        const locationName = scene.location ? 
            ChronicleData.getLocation(scene.location)?.name : null;
        
        card.innerHTML = `
            <div class="scene-card-header">
                <h3 class="scene-title-text">${scene.title || 'Untitled Scene'}</h3>
                <div class="author-badge ${scene.author}">
                    ${scene.author === 'tyrrel' ? 'T' : 'T'}
                </div>
            </div>
            <div class="scene-card-meta">
                <div class="meta-row">
                    <div class="meta-item">
                        <div class="status-indicator ${scene.status || 'draft'}"></div>
                        <span>${statusLabels[scene.status || 'draft']}</span>
                    </div>
                    <div class="meta-item word-count-badge">
                        ${wordCount} words
                    </div>
                </div>
                <div class="meta-row">
                    <div class="meta-item">
                        📅 ${formattedDate}
                    </div>
                    <div class="meta-item">
                        📝 ${beatCount} ${beatCount === 1 ? 'beat' : 'beats'}
                    </div>
                </div>
                ${characterNames ? `
                <div class="meta-row">
                    <div class="meta-item" title="Characters">
                        👥 ${characterNames}
                    </div>
                </div>
                ` : ''}
                ${locationName ? `
                <div class="meta-row">
                    <div class="meta-item" title="Location">
                        📍 ${locationName}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Click to preview
        card.addEventListener('click', () => {
            this.showPreview(scene);
            
            // Update selection
            document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
        
        // Double-click to open in Desk
        card.addEventListener('dblclick', () => {
            this.openSceneInDesk(scene.id);
        });
        
        return card;
    },
    
    // ===== PREVIEW PANEL =====
    setupPreviewPanel() {
        const closeBtn = document.getElementById('closePreview');
        const openInDeskBtn = document.getElementById('openInDesk');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hidePreview();
            });
        }
        
        if (openInDeskBtn) {
            openInDeskBtn.addEventListener('click', () => {
                if (this.selectedScene) {
                    this.openSceneInDesk(this.selectedScene.id);
                }
            });
        }
    },
    
    showPreview(scene) {
        const preview = document.getElementById('archivePreview');
        const content = document.getElementById('previewContent');
        const openBtn = document.getElementById('openInDesk');
        
        if (!preview || !content) return;
        
        this.selectedScene = scene;
        
        // Show preview panel
        preview.classList.add('active');
        
        // Get beats for this scene
        const beats = ChronicleData.getBeatsForScene(scene.id);
        
        // Combine beat content with separators
        let fullContent = beats.map((beat, index) => {
            const text = beat.content.replace(/<[^>]*>/g, '');
            return `[Beat ${index + 1}]\n${text}`;
        }).join('\n\n---\n\n');
        
        // Excerpt (first 500 characters)
        const excerpt = fullContent.substring(0, 500) + (fullContent.length > 500 ? '...' : '');
        
        // Calculate word count
        const wordCount = beats.reduce((total, beat) => {
            const text = beat.content.replace(/<[^>]*>/g, '');
            return total + text.split(/\s+/).filter(w => w.length > 0).length;
        }, 0);
        
        // Get character names
        const characterNames = scene.characters
            .map(id => ChronicleData.getCharacter(id)?.name)
            .filter(name => name);
        
        // Get location name
        const locationName = scene.location ? 
            ChronicleData.getLocation(scene.location)?.name : null;
        
        content.innerHTML = `
            <h4 style="font-family: 'Cinzel', serif; margin-top: 0; color: #3d2f1f;">
                ${scene.title || 'Untitled Scene'}
            </h4>
            <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #8b7355;">
                <strong>${wordCount}</strong> words • 
                <strong>${beats.length}</strong> ${beats.length === 1 ? 'beat' : 'beats'} •
                <strong>${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</strong> •
                ${scene.status ? scene.status.replace('-', ' ') : 'draft'}
            </div>
            ${characterNames.length > 0 ? `
            <div style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #8b7355;">
                <strong>Characters:</strong> ${characterNames.join(', ')}
            </div>
            ` : ''}
            ${locationName ? `
            <div style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #8b7355;">
                <strong>Location:</strong> ${locationName}
            </div>
            ` : ''}
            ${scene.mckeeElement ? `
            <div style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #8b7355;">
                <strong>McKee Element:</strong> ${scene.mckeeElement}
            </div>
            ` : ''}
            <div style="line-height: 1.8; white-space: pre-wrap; margin-top: 1rem;">
                ${excerpt}
            </div>
        `;
        
        // Enable open button
        if (openBtn) {
            openBtn.disabled = false;
        }
    },
    
    hidePreview() {
        const preview = document.getElementById('archivePreview');
        const openBtn = document.getElementById('openInDesk');
        
        if (preview) {
            preview.classList.remove('active');
        }
        
        if (openBtn) {
            openBtn.disabled = true;
        }
        
        this.selectedScene = null;
        
        // Clear selection
        document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('selected'));
    },
    
    openSceneInDesk(sceneId) {
        // Set current scene in ChronicleData
        ChronicleData.currentScene = sceneId;
        
        // Switch to Desk workspace
        const deskTab = document.querySelector('[data-space="desk"]');
        if (deskTab) {
            deskTab.click();
        }
        
        // Load the scene in Desk
        if (window.ChronicleDesk && window.ChronicleDesk.loadSceneById) {
            setTimeout(() => {
                ChronicleDesk.loadSceneById(sceneId);
            }, 100);
        }
        
        console.log('✅ Opened scene in Desk:', sceneId);
    },
    
    // ===== CHAPTER STRUCTURE =====
    loadChapterStructure() {
        const tree = document.getElementById('chapterStructureTree');
        if (!tree) return;
        
        tree.innerHTML = '';
        
        // Get scenes organized by acts and chapters
        const structure = this.buildStructure();
        
        // Render each act
        ChronicleData.acts.forEach(act => {
            const actData = structure[act.id] || { chapters: {}, unchaptered: [] };
            const actContainer = this.createActContainer(act, actData);
            tree.appendChild(actContainer);
        });
    },
    
    buildStructure() {
        const structure = {};
        
        // Initialize structure for each act
        ChronicleData.acts.forEach(act => {
            structure[act.id] = { chapters: {}, unchaptered: [] };
        });
        
        // Organize scenes
        ChronicleData.scenes.forEach(scene => {
            const actId = scene.actId || 'act-1';
            
            if (!structure[actId]) {
                structure[actId] = { chapters: {}, unchaptered: [] };
            }
            
            if (scene.chapterId) {
                if (!structure[actId].chapters[scene.chapterId]) {
                    const chapter = ChronicleData.chapters.find(ch => ch.id === scene.chapterId);
                    structure[actId].chapters[scene.chapterId] = {
                        name: chapter ? chapter.title : 'Untitled Chapter',
                        scenes: []
                    };
                }
                structure[actId].chapters[scene.chapterId].scenes.push(scene);
            } else {
                structure[actId].unchaptered.push(scene);
            }
        });
        
        return structure;
    },
    
    createActContainer(act, actData) {
        const container = document.createElement('div');
        container.className = 'act-container';
        container.dataset.actId = act.id;
        
        // Calculate stats
        const allScenes = [...Object.values(actData.chapters).flatMap(ch => ch.scenes), ...actData.unchaptered];
        
        // Calculate total words from beats
        const totalWords = allScenes.reduce((sum, scene) => {
            const beats = ChronicleData.getBeatsForScene(scene.id);
            const sceneWords = beats.reduce((beatSum, beat) => {
                const text = beat.content.replace(/<[^>]*>/g, '');
                return beatSum + text.split(/\s+/).filter(w => w.length > 0).length;
            }, 0);
            return sum + sceneWords;
        }, 0);
        
        const chapterCount = Object.keys(actData.chapters).length;
        
        // Header
        const header = document.createElement('div');
        header.className = 'act-header';
        header.innerHTML = `
            <h3 class="act-title">${act.title || `Act ${act.number}`}</h3>
            <div class="act-stats">
                <span>${chapterCount} ${chapterCount === 1 ? 'Chapter' : 'Chapters'}</span>
                <span>${allScenes.length} ${allScenes.length === 1 ? 'Scene' : 'Scenes'}</span>
                <span>${totalWords.toLocaleString()} words</span>
            </div>
            <span class="collapse-icon">▼</span>
        `;
        
        // Toggle collapse
        header.addEventListener('click', () => {
            container.classList.toggle('collapsed');
        });
        
        container.appendChild(header);
        
        // Content
        const content = document.createElement('div');
        content.className = 'act-content';
        
        // Render chapters
        Object.entries(actData.chapters).forEach(([chapterId, chapterData]) => {
            const chapterContainer = this.createChapterContainer(act.id, chapterId, chapterData);
            content.appendChild(chapterContainer);
        });
        
        // Render unchaptered scenes
        if (actData.unchaptered.length > 0) {
            const unchapteredContainer = this.createChapterContainer(act.id, null, {
                name: 'Unchaptered Scenes',
                scenes: actData.unchaptered
            });
            content.appendChild(unchapteredContainer);
        }
        
        // Add chapter button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-chapter-btn';
        addBtn.innerHTML = '+ Add Chapter';
        addBtn.addEventListener('click', () => {
            this.createNewChapter(act.id);
        });
        content.appendChild(addBtn);
        
        container.appendChild(content);
        
        return container;
    },
    
    createChapterContainer(actId, chapterId, chapterData) {
        const container = document.createElement('div');
        container.className = 'chapter-container';
        container.dataset.chapterId = chapterId || 'unchaptered';
        
        // Calculate total words from beats
        const totalWords = chapterData.scenes.reduce((sum, scene) => {
            const beats = ChronicleData.getBeatsForScene(scene.id);
            const sceneWords = beats.reduce((beatSum, beat) => {
                const text = beat.content.replace(/<[^>]*>/g, '');
                return beatSum + text.split(/\s+/).filter(w => w.length > 0).length;
            }, 0);
            return sum + sceneWords;
        }, 0);
        
        // Header
        const header = document.createElement('div');
        header.className = 'chapter-header';
        
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'chapter-title-edit';
        titleInput.value = chapterData.name;
        titleInput.disabled = !chapterId; // Disable for unchaptered
        
        if (chapterId) {
            titleInput.addEventListener('blur', () => {
                this.renameChapter(chapterId, titleInput.value);
            });
        }
        
        const wordCount = document.createElement('span');
        wordCount.className = 'chapter-word-count';
        wordCount.textContent = `${totalWords.toLocaleString()} words`;
        
        header.appendChild(titleInput);
        header.appendChild(wordCount);
        container.appendChild(header);
        
        // Scene list
        const sceneList = document.createElement('div');
        sceneList.className = 'chapter-scenes';
        
        chapterData.scenes.forEach(scene => {
            const sceneItem = this.createTreeSceneItem(scene);
            sceneList.appendChild(sceneItem);
        });
        
        container.appendChild(sceneList);
        
        return container;
    },
    
    createTreeSceneItem(scene) {
        const item = document.createElement('div');
        item.className = 'tree-scene-item';
        item.draggable = true;
        item.dataset.sceneId = scene.id;
        
        // Calculate word count from beats
        const beats = ChronicleData.getBeatsForScene(scene.id);
        const wordCount = beats.reduce((total, beat) => {
            const text = beat.content.replace(/<[^>]*>/g, '');
            return total + text.split(/\s+/).filter(w => w.length > 0).length;
        }, 0);
        
        item.innerHTML = `
            <span class="drag-handle">⋮⋮</span>
            <div class="tree-scene-info">
                <span class="tree-scene-title">${scene.title || 'Untitled'}</span>
                <div class="tree-scene-meta">
                    <span>${wordCount} words</span>
                    <span>•</span>
                    <span>${beats.length} ${beats.length === 1 ? 'beat' : 'beats'}</span>
                    <span>•</span>
                    <span>${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</span>
                    <div class="status-indicator ${scene.status || 'draft'}"></div>
                </div>
            </div>
        `;
        
        // Drag and drop
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('sceneId', scene.id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        
        // Click to open in Desk
        item.addEventListener('click', () => {
            this.openSceneInDesk(scene.id);
        });
        
        return item;
    },
    
    createNewChapter(actId) {
        const chapterName = prompt('Enter chapter name:');
        if (!chapterName) return;
        
        // Create chapter via ChronicleData
        const chapter = ChronicleData.createChapter(chapterName, actId);
        
        // Reload structure
        this.loadChapterStructure();
        
        console.log('✅ Created new chapter:', chapterName);
    },
    
    renameChapter(chapterId, newName) {
        // Update chapter via ChronicleData
        ChronicleData.updateChapter(chapterId, { title: newName });
        
        console.log('✅ Renamed chapter:', newName);
    },
    
    // ===== STATS =====
    updateStats() {
        const stats = ChronicleData.getStats();
        
        // Update display
        const totalScenesEl = document.getElementById('totalScenes');
        const totalWordsEl = document.getElementById('totalWords');
        const totalChaptersEl = document.getElementById('totalChapters');
        const totalBeatsEl = document.getElementById('totalBeats');
        
        if (totalScenesEl) totalScenesEl.textContent = stats.scenes.total;
        if (totalWordsEl) totalWordsEl.textContent = stats.wordCount.toLocaleString();
        if (totalChaptersEl) totalChaptersEl.textContent = ChronicleData.chapters.length;
        if (totalBeatsEl) totalBeatsEl.textContent = stats.beats.total;
    }
};

// Initialize when workspace becomes active
document.addEventListener('DOMContentLoaded', () => {
    const archiveTab = document.querySelector('[data-space="archive"]');
    if (archiveTab) {
        archiveTab.addEventListener('click', () => {
            setTimeout(() => {
                if (!ChronicleArchive.initialized) {
                    ChronicleArchive.init();
                }
            }, 100);
        });
    }
});

// Make globally available
window.ChronicleArchive = ChronicleArchive;