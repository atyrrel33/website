/* ========================================
   THE ARCHIVE - Sacred Treasury Logic
   "Store up treasures where moths do not destroy"
   Sprint 1: Scene Library (Grid/List View, Search, Filters, Preview)
   Sprint 2: Chapter Structure (Tree View, Drag-Drop, Chapter Management)
   ======================================== */

const ChronicleArchive = {
    // State
    currentChamber: 'library',
    viewMode: 'grid', // 'grid' or 'list'
    selectedScene: null,
    filters: {
        search: '',
        author: 'all',
        status: 'all'
    },
    
    // Initialization
    init() {
        console.log('✅ Archive: Initializing treasury...');
        
        // Set up event listeners
        this.setupChamberNavigation();
        this.setupViewToggle();
        this.setupFilters();
        this.setupPreviewPanel();
        
        // Load initial view
        this.loadSceneLibrary();
        this.loadChapterStructure();
        this.updateStats();
        
        console.log('✅ Archive: Initialization complete');
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
    },
    
    // ===== SPRINT 1: SCENE LIBRARY =====
    loadSceneLibrary() {
        const grid = document.getElementById('sceneLibraryGrid');
        if (!grid) return;
        
        // Get all scenes
        let scenes = this.getAllScenes();
        
        // Apply filters
        scenes = this.applyFilters(scenes);
        
        // Set view mode class
        grid.className = `scene-library-grid ${this.viewMode}-view`;
        
        // Clear existing
        grid.innerHTML = '';
        
        // Empty state
        if (scenes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📚</div>
                    <h3 class="empty-state-title">No Scenes Found</h3>
                    <p class="empty-state-text">Begin writing in The Desk to populate your treasury</p>
                </div>
            `;
            return;
        }
        
        // Render scene cards
        scenes.forEach(scene => {
            const card = this.createSceneCard(scene);
            grid.appendChild(card);
        });
    },
    
    getAllScenes() {
        const scenes = [];
        const sceneKeys = Object.keys(localStorage).filter(key => key.startsWith('scene_'));
        
        sceneKeys.forEach(key => {
            try {
                const scene = JSON.parse(localStorage.getItem(key));
                scenes.push(scene);
            } catch (e) {
                console.warn('⚠️ Failed to parse scene:', key);
            }
        });
        
        // Sort by last modified (newest first)
        scenes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        return scenes;
    },
    
    applyFilters(scenes) {
        return scenes.filter(scene => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const titleMatch = scene.title.toLowerCase().includes(searchTerm);
                const contentMatch = scene.content.toLowerCase().includes(searchTerm);
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
            
            return true;
        });
    },
    
    createSceneCard(scene) {
        const card = document.createElement('div');
        card.className = 'scene-card';
        card.dataset.sceneId = scene.id;
        
        // Format date
        const lastModified = new Date(scene.lastModified);
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
                        ${scene.wordCount || 0} words
                    </div>
                </div>
                <div class="meta-row">
                    <div class="meta-item">
                        📅 ${formattedDate}
                    </div>
                    ${scene.act ? `<div class="meta-item">Act ${scene.act}</div>` : ''}
                    ${scene.chapterName ? `<div class="meta-item">${scene.chapterName}</div>` : ''}
                </div>
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
        
        // Excerpt (first 500 characters)
        const excerpt = scene.content.substring(0, 500) + (scene.content.length > 500 ? '...' : '');
        
        content.innerHTML = `
            <h4 style="font-family: 'Cinzel', serif; margin-top: 0; color: #3d2f1f;">
                ${scene.title || 'Untitled Scene'}
            </h4>
            <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #8b7355;">
                <strong>${scene.wordCount || 0}</strong> words • 
                <strong>${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</strong> •
                ${scene.status ? scene.status.replace('-', ' ') : 'draft'}
            </div>
            <div style="line-height: 1.8; white-space: pre-wrap;">
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
        // Switch to Desk workspace
        const deskTab = document.querySelector('[data-space="desk"]');
        if (deskTab) {
            deskTab.click();
        }
        
        // Load the scene in Desk
        if (window.ChronicleDesk) {
            ChronicleDesk.loadScene(sceneId);
        }
        
        console.log('✅ Opened scene in Desk:', sceneId);
    },
    
    // ===== SPRINT 2: CHAPTER STRUCTURE =====
    loadChapterStructure() {
        const tree = document.getElementById('chapterStructureTree');
        if (!tree) return;
        
        tree.innerHTML = '';
        
        // Get scenes organized by acts and chapters
        const structure = this.buildStructure();
        
        // Render each act
        for (let actNum = 1; actNum <= 3; actNum++) {
            const actData = structure[actNum] || { chapters: {}, unchaptered: [] };
            const actContainer = this.createActContainer(actNum, actData);
            tree.appendChild(actContainer);
        }
    },
    
    buildStructure() {
        const structure = {
            1: { chapters: {}, unchaptered: [] },
            2: { chapters: {}, unchaptered: [] },
            3: { chapters: {}, unchaptered: [] }
        };
        
        const scenes = this.getAllScenes();
        
        scenes.forEach(scene => {
            const act = scene.act || 1;
            
            if (!structure[act]) {
                structure[act] = { chapters: {}, unchaptered: [] };
            }
            
            if (scene.chapterId) {
                if (!structure[act].chapters[scene.chapterId]) {
                    structure[act].chapters[scene.chapterId] = {
                        name: scene.chapterName || 'Untitled Chapter',
                        scenes: []
                    };
                }
                structure[act].chapters[scene.chapterId].scenes.push(scene);
            } else {
                structure[act].unchaptered.push(scene);
            }
        });
        
        return structure;
    },
    
    createActContainer(actNum, actData) {
        const container = document.createElement('div');
        container.className = 'act-container';
        container.dataset.act = actNum;
        
        // Calculate stats
        const allScenes = [...Object.values(actData.chapters).flatMap(ch => ch.scenes), ...actData.unchaptered];
        const totalWords = allScenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        const chapterCount = Object.keys(actData.chapters).length;
        
        // Header
        const header = document.createElement('div');
        header.className = 'act-header';
        header.innerHTML = `
            <h3 class="act-title">Act ${actNum}</h3>
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
            const chapterContainer = this.createChapterContainer(actNum, chapterId, chapterData);
            content.appendChild(chapterContainer);
        });
        
        // Render unchaptered scenes
        if (actData.unchaptered.length > 0) {
            const unchapteredContainer = this.createChapterContainer(actNum, null, {
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
            this.createNewChapter(actNum);
        });
        content.appendChild(addBtn);
        
        container.appendChild(content);
        
        return container;
    },
    
    createChapterContainer(actNum, chapterId, chapterData) {
        const container = document.createElement('div');
        container.className = 'chapter-container';
        container.dataset.chapterId = chapterId || 'unchaptered';
        
        // Calculate total words
        const totalWords = chapterData.scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        
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
        
        item.innerHTML = `
            <span class="drag-handle">⋮⋮</span>
            <div class="tree-scene-info">
                <span class="tree-scene-title">${scene.title || 'Untitled'}</span>
                <div class="tree-scene-meta">
                    <span>${scene.wordCount || 0} words</span>
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
    
    createNewChapter(actNum) {
        const chapterId = 'chapter_' + Date.now();
        const chapterName = prompt('Enter chapter name:');
        
        if (!chapterName) return;
        
        // Store chapter metadata
        localStorage.setItem(`chapter_${chapterId}`, JSON.stringify({
            id: chapterId,
            name: chapterName,
            act: actNum,
            created: new Date().toISOString()
        }));
        
        // Reload structure
        this.loadChapterStructure();
        
        console.log('✅ Created new chapter:', chapterName);
    },
    
    renameChapter(chapterId, newName) {
        const chapter = JSON.parse(localStorage.getItem(`chapter_${chapterId}`));
        if (!chapter) return;
        
        chapter.name = newName;
        localStorage.setItem(`chapter_${chapterId}`, JSON.stringify(chapter));
        
        // Update all scenes with this chapter
        const scenes = this.getAllScenes();
        scenes.forEach(scene => {
            if (scene.chapterId === chapterId) {
                scene.chapterName = newName;
                localStorage.setItem(`scene_${scene.id}`, JSON.stringify(scene));
            }
        });
        
        console.log('✅ Renamed chapter:', newName);
    },
    
    // ===== STATS =====
    updateStats() {
        const scenes = this.getAllScenes();
        
        const totalScenes = scenes.length;
        const totalWords = scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        
        // Count unique chapters
        const chapters = new Set();
        scenes.forEach(scene => {
            if (scene.chapterId) chapters.add(scene.chapterId);
        });
        
        // Update display
        const totalScenesEl = document.getElementById('totalScenes');
        const totalWordsEl = document.getElementById('totalWords');
        const totalChaptersEl = document.getElementById('totalChapters');
        
        if (totalScenesEl) totalScenesEl.textContent = totalScenes;
        if (totalWordsEl) totalWordsEl.textContent = totalWords.toLocaleString();
        if (totalChaptersEl) totalChaptersEl.textContent = chapters.size;
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
                    ChronicleArchive.initialized = true;
                }
            }, 100);
        });
    }
});