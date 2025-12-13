// ===================================
// THE ARCHIVE - The Sacred Treasury
// "Store up for yourselves treasures in heaven,
// where moths and vermin do not destroy"
// - Matthew 6:20
//
// Sprint 1: The Scene Library (Foundation)
// "First lay the foundation, then build the house"
// ===================================

const ChronicleArchive = {
    // Current state
    currentChamber: 'library', // library, structure, export
    currentView: 'grid', // grid, list
    selectedSceneId: null,
    detailsPanelOpen: false,
    
    // Filter state
    filters: {
        search: '',
        author: 'all', // all, tyrrel, trevor
        status: 'all' // all, draft, in-progress, polished
    },
    
    // Initialization flag
    initialized: false,
    
    // ===================================
    // INITIALIZATION
    // ===================================
    
    init() {
        if (this.initialized) return;
        
        console.log('📚 The Archive awakens...');
        console.log('"Store up for yourselves treasures in heaven" - Matthew 6:20');
        
        // Build the UI
        this.buildArchiveUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderCurrentChamber();
        this.updateStats();
        
        this.initialized = true;
        console.log('✅ The Archive stands ready to preserve your works');
    },
    
    // ===================================
    // UI BUILDING
    // ===================================
    
    buildArchiveUI() {
        const container = document.querySelector('#archive .archive-container');
        if (!container) {
            console.error('Archive container not found');
            return;
        }
        
        // Clear placeholder
        container.innerHTML = '';
        
        // Build the three-panel layout
        container.innerHTML = `
            <!-- Top Bar -->
            <div class="archive-topbar">
                <div class="archive-search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" id="archiveSearch" placeholder="Search scenes by title...">
                </div>
                
                <div class="archive-view-toggles">
                    <button class="view-toggle-btn active" data-view="grid" title="Grid View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                        </svg>
                    </button>
                    <button class="view-toggle-btn" data-view="list" title="List View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="6" x2="21" y2="6"/>
                            <line x1="8" y1="12" x2="21" y2="12"/>
                            <line x1="8" y1="18" x2="21" y2="18"/>
                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                            <line x1="3" y1="12" x2="3.01" y2="12"/>
                            <line x1="3" y1="18" x2="3.01" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <div class="archive-filters">
                    <button class="filter-btn" id="authorFilterBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span id="authorFilterLabel">All Authors</span>
                    </button>
                    <button class="filter-btn" id="statusFilterBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        <span id="statusFilterLabel">All Status</span>
                    </button>
                </div>
            </div>
            
            <!-- Main Layout -->
            <div class="archive-layout">
                <!-- Left Sidebar - Chamber Navigation -->
                <aside class="archive-sidebar">
                    <div class="sidebar-nav-header">
                        <h3>Chambers</h3>
                    </div>
                    
                    <div class="archive-chamber-tabs">
                        <button class="chamber-tab active" data-chamber="library">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                            </svg>
                            Scene Library
                            <span class="tab-count" id="sceneCount">0</span>
                        </button>
                        <button class="chamber-tab" data-chamber="structure">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            Chapter Structure
                        </button>
                        <button class="chamber-tab" data-chamber="export">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export Sanctuary
                        </button>
                    </div>
                    
                    <div class="archive-stats">
                        <div class="stats-header">Treasury Summary</div>
                        <div class="stat-row">
                            <span class="stat-label">Total Words</span>
                            <span class="stat-value" id="totalWords">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Tyrrel's Words</span>
                            <span class="stat-value" id="tyrrelWords">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Trevor's Words</span>
                            <span class="stat-value" id="trevorWords">0</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Polished Scenes</span>
                            <span class="stat-value" id="polishedCount">0</span>
                        </div>
                    </div>
                </aside>
                
                <!-- Main Canvas -->
                <main class="archive-canvas">
                    <div class="archive-canvas-header">
                        <div>
                            <span class="canvas-title" id="canvasTitle">Scene Library</span>
                            <span class="canvas-subtitle" id="canvasSubtitle">Your gathered works</span>
                        </div>
                        <div class="canvas-actions">
                            <button class="canvas-action-btn" id="refreshArchiveBtn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"/>
                                    <path d="M1 20v-6h6"/>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                                    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div class="canvas-content" id="archiveCanvasContent">
                        <!-- Content rendered here -->
                    </div>
                </main>
                
                <!-- Right Details Panel -->
                <aside class="archive-details-panel" id="archiveDetailsPanel">
                    <div class="details-panel-header">
                        <h3>Scene Details</h3>
                        <button class="close-details-btn" id="closeArchiveDetails">×</button>
                    </div>
                    <div class="details-panel-content" id="archiveDetailsContent">
                        <!-- Populated dynamically -->
                    </div>
                </aside>
            </div>
        `;
    },
    
    // ===================================
    // EVENT LISTENERS
    // ===================================
    
    setupEventListeners() {
        // Chamber tab switching
        document.querySelectorAll('.chamber-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const chamber = tab.dataset.chamber;
                if (chamber) this.switchChamber(chamber);
            });
        });
        
        // View toggle (grid/list)
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                if (view) this.switchView(view);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('archiveSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderCurrentChamber();
            });
        }
        
        // Author filter
        const authorFilterBtn = document.getElementById('authorFilterBtn');
        if (authorFilterBtn) {
            authorFilterBtn.addEventListener('click', () => this.cycleAuthorFilter());
        }
        
        // Status filter
        const statusFilterBtn = document.getElementById('statusFilterBtn');
        if (statusFilterBtn) {
            statusFilterBtn.addEventListener('click', () => this.cycleStatusFilter());
        }
        
        // Close details panel
        const closeDetailsBtn = document.getElementById('closeArchiveDetails');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => this.closeDetailsPanel());
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshArchiveBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
    },
    
    // ===================================
    // CHAMBER SWITCHING
    // ===================================
    
    switchChamber(chamberName) {
        this.currentChamber = chamberName;
        
        // Update tab states
        document.querySelectorAll('.chamber-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.chamber === chamberName) {
                tab.classList.add('active');
            }
        });
        
        // Update header
        const titles = {
            library: { title: 'Scene Library', subtitle: 'Your gathered works' },
            structure: { title: 'Chapter Structure', subtitle: 'The ordered progression' },
            export: { title: 'Export Sanctuary', subtitle: 'Bridge to the world' }
        };
        
        const canvasTitle = document.getElementById('canvasTitle');
        const canvasSubtitle = document.getElementById('canvasSubtitle');
        if (canvasTitle) canvasTitle.textContent = titles[chamberName].title;
        if (canvasSubtitle) canvasSubtitle.textContent = titles[chamberName].subtitle;
        
        // Render new content
        this.renderCurrentChamber();
    },
    
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update toggle states
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });
        
        // Re-render if in library
        if (this.currentChamber === 'library') {
            this.renderCurrentChamber();
        }
    },
    
    // ===================================
    // FILTERING
    // ===================================
    
    cycleAuthorFilter() {
        const options = ['all', 'tyrrel', 'trevor'];
        const currentIndex = options.indexOf(this.filters.author);
        this.filters.author = options[(currentIndex + 1) % options.length];
        
        // Update button label
        const label = document.getElementById('authorFilterLabel');
        const btn = document.getElementById('authorFilterBtn');
        if (label) {
            const labels = { all: 'All Authors', tyrrel: 'Tyrrel', trevor: 'Trevor' };
            label.textContent = labels[this.filters.author];
        }
        if (btn) {
            btn.classList.toggle('has-filter', this.filters.author !== 'all');
        }
        
        this.renderCurrentChamber();
    },
    
    cycleStatusFilter() {
        const options = ['all', 'draft', 'in-progress', 'polished'];
        const currentIndex = options.indexOf(this.filters.status);
        this.filters.status = options[(currentIndex + 1) % options.length];
        
        // Update button label
        const label = document.getElementById('statusFilterLabel');
        const btn = document.getElementById('statusFilterBtn');
        if (label) {
            const labels = { all: 'All Status', draft: 'Draft', 'in-progress': 'In Progress', polished: 'Polished' };
            label.textContent = labels[this.filters.status];
        }
        if (btn) {
            btn.classList.toggle('has-filter', this.filters.status !== 'all');
        }
        
        this.renderCurrentChamber();
    },
    
    getFilteredScenes() {
        let scenes = this.getScenes();
        
        // Apply search filter
        if (this.filters.search) {
            scenes = scenes.filter(s => 
                (s.title || '').toLowerCase().includes(this.filters.search) ||
                (s.content || '').toLowerCase().includes(this.filters.search)
            );
        }
        
        // Apply author filter
        if (this.filters.author !== 'all') {
            scenes = scenes.filter(s => s.author === this.filters.author);
        }
        
        // Apply status filter
        if (this.filters.status !== 'all') {
            scenes = scenes.filter(s => s.status === this.filters.status);
        }
        
        return scenes;
    },
    
    // ===================================
    // RENDER METHODS
    // ===================================
    
    renderCurrentChamber() {
        const container = document.getElementById('archiveCanvasContent');
        if (!container) return;
        
        switch (this.currentChamber) {
            case 'library':
                this.renderLibraryView(container);
                break;
            case 'structure':
                this.renderStructureView(container);
                break;
            case 'export':
                this.renderExportView(container);
                break;
        }
    },
    
    renderLibraryView(container) {
        const scenes = this.getFilteredScenes();
        
        if (scenes.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        if (this.currentView === 'grid') {
            container.innerHTML = `<div class="scenes-grid">${scenes.map(s => this.renderSceneCard(s)).join('')}</div>`;
        } else {
            container.innerHTML = `<div class="scenes-list">${scenes.map(s => this.renderSceneListItem(s)).join('')}</div>`;
        }
        
        // Add click handlers
        container.querySelectorAll('.scene-card, .scene-list-item').forEach(card => {
            card.addEventListener('click', (e) => {
                const sceneId = card.dataset.sceneId;
                this.selectScene(sceneId);
            });
            
            card.addEventListener('dblclick', (e) => {
                const sceneId = card.dataset.sceneId;
                this.openInDesk(sceneId);
            });
        });
    },
    
    renderSceneCard(scene) {
        const status = scene.status || 'draft';
        const author = scene.author || 'tyrrel';
        const wordCount = scene.wordCount || 0;
        const lastModified = scene.lastModified ? new Date(scene.lastModified).toLocaleDateString() : 'Unknown';
        const actName = this.getActName(scene.actId);
        const chapterName = this.getChapterName(scene.chapterId);
        
        let locationTag = '';
        if (actName || chapterName) {
            const location = chapterName ? `${actName} › ${chapterName}` : actName;
            locationTag = `<div class="scene-location-tag">${location}</div>`;
        }
        
        return `
            <div class="scene-card ${this.selectedSceneId === scene.id ? 'selected' : ''}" data-scene-id="${scene.id}">
                <div class="scene-card-header">
                    <div class="scene-card-title">${scene.title || 'Untitled Scene'}</div>
                    <div class="author-badge ${author}">${author.charAt(0).toUpperCase()}</div>
                </div>
                <div class="status-indicator">
                    <span class="status-dot ${status}"></span>
                    <span class="status-label">${status.replace('-', ' ')}</span>
                </div>
                <div class="scene-card-meta">
                    <span class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        ${wordCount.toLocaleString()} words
                    </span>
                    <span class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${lastModified}
                    </span>
                </div>
                ${locationTag}
            </div>
        `;
    },
    
    renderSceneListItem(scene) {
        const status = scene.status || 'draft';
        const author = scene.author || 'tyrrel';
        const wordCount = scene.wordCount || 0;
        const lastModified = scene.lastModified ? new Date(scene.lastModified).toLocaleDateString() : 'Unknown';
        
        return `
            <div class="scene-list-item ${this.selectedSceneId === scene.id ? 'selected' : ''}" data-scene-id="${scene.id}">
                <span class="status-dot ${status}"></span>
                <span class="scene-title">${scene.title || 'Untitled Scene'}</span>
                <div class="scene-meta">
                    <span class="author-badge ${author}">${author.charAt(0).toUpperCase()}</span>
                    <span>${wordCount.toLocaleString()} words</span>
                    <span>${lastModified}</span>
                </div>
            </div>
        `;
    },
    
    renderEmptyState() {
        if (this.filters.search || this.filters.author !== 'all' || this.filters.status !== 'all') {
            return `
                <div class="archive-empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <h3 class="empty-state-title">No Matching Scenes</h3>
                    <p class="empty-state-message">No scenes match your current filters. Try adjusting your search or filter criteria.</p>
                    <button class="empty-state-action" onclick="ChronicleArchive.clearFilters()">Clear Filters</button>
                </div>
            `;
        }
        
        return `
            <div class="archive-empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <h3 class="empty-state-title">The Treasury Awaits</h3>
                <p class="empty-state-message">"A good name is more desirable than great riches; to be esteemed is better than silver or gold." — Proverbs 22:1<br><br>Begin writing in The Desk, and your scenes will appear here for preservation and organization.</p>
                <button class="empty-state-action" onclick="ChronicleArchive.goToDesk()">Go to The Desk</button>
            </div>
        `;
    },
    
    renderStructureView(container) {
        const acts = this.getActs();
        const chapters = this.getChapters();
        const scenes = this.getScenes();
        
        if (acts.length === 0 && scenes.length === 0) {
            container.innerHTML = `
                <div class="archive-empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <h3 class="empty-state-title">No Structure Yet</h3>
                    <p class="empty-state-message">Create Acts and Chapters in The Covenant to organize your scenes.</p>
                    <button class="empty-state-action" onclick="ChronicleArchive.goToCovenant()">Go to The Covenant</button>
                </div>
            `;
            return;
        }
        
        let html = '<div class="chapter-structure-view">';
        
        // Render each act
        acts.forEach(act => {
            const actChapters = chapters.filter(c => c.actId === act.id);
            const actScenes = scenes.filter(s => s.actId === act.id);
            const actWords = actScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
            
            html += `
                <div class="structure-act" data-act-id="${act.id}">
                    <div class="structure-act-header">
                        <div class="act-title-group">
                            <svg class="act-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                            <span class="structure-act-title">${act.name || 'Untitled Act'}</span>
                        </div>
                        <div class="act-stats">
                            <span>${actScenes.length} scenes</span>
                            <span>•</span>
                            <span>${actWords.toLocaleString()} words</span>
                        </div>
                    </div>
                    <div class="structure-act-content">
            `;
            
            // Render chapters within this act
            actChapters.forEach(chapter => {
                const chapterScenes = scenes.filter(s => s.chapterId === chapter.id);
                const chapterWords = chapterScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
                
                html += `
                    <div class="structure-chapter" data-chapter-id="${chapter.id}">
                        <div class="structure-chapter-header">
                            <div class="chapter-title-group">
                                <svg class="chapter-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                                <span class="structure-chapter-title">${chapter.name || 'Untitled Chapter'}</span>
                            </div>
                            <span class="chapter-stats">${chapterScenes.length} scenes • ${chapterWords.toLocaleString()} words</span>
                        </div>
                        <div class="structure-chapter-content">
                            ${chapterScenes.map((s, i) => `
                                <div class="structure-scene-item" data-scene-id="${s.id}">
                                    <span class="scene-position">${i + 1}.</span>
                                    <span class="scene-title">${s.title || 'Untitled'}</span>
                                    <span class="scene-words">${(s.wordCount || 0).toLocaleString()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            
            // Scenes directly in act (not in chapters)
            const directScenes = actScenes.filter(s => !s.chapterId);
            if (directScenes.length > 0) {
                html += `
                    <div class="structure-chapter">
                        <div class="structure-chapter-header">
                            <span class="structure-chapter-title" style="color: #8a8580; font-style: italic;">Unassigned to Chapter</span>
                        </div>
                        <div class="structure-chapter-content">
                            ${directScenes.map((s, i) => `
                                <div class="structure-scene-item" data-scene-id="${s.id}">
                                    <span class="scene-position">${i + 1}.</span>
                                    <span class="scene-title">${s.title || 'Untitled'}</span>
                                    <span class="scene-words">${(s.wordCount || 0).toLocaleString()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += `</div></div>`;
        });
        
        // Unassigned scenes (no act)
        const unassigned = scenes.filter(s => !s.actId);
        if (unassigned.length > 0) {
            html += `
                <div class="unassigned-section">
                    <div class="unassigned-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        Unassigned Scenes (${unassigned.length})
                    </div>
                    ${unassigned.map((s, i) => `
                        <div class="structure-scene-item" data-scene-id="${s.id}">
                            <span class="scene-position">${i + 1}.</span>
                            <span class="scene-title">${s.title || 'Untitled'}</span>
                            <span class="scene-words">${(s.wordCount || 0).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Add toggle handlers
        container.querySelectorAll('.structure-act-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('collapsed');
            });
        });
        
        container.querySelectorAll('.structure-chapter-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                header.parentElement.classList.toggle('collapsed');
            });
        });
        
        // Add scene click handlers
        container.querySelectorAll('.structure-scene-item').forEach(item => {
            item.addEventListener('click', () => {
                const sceneId = item.dataset.sceneId;
                this.selectScene(sceneId);
            });
            item.addEventListener('dblclick', () => {
                const sceneId = item.dataset.sceneId;
                this.openInDesk(sceneId);
            });
        });
    },
    
    renderExportView(container) {
        const scenes = this.getScenes();
        const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        
        container.innerHTML = `
            <div class="export-view">
                <div class="export-section">
                    <div class="export-section-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <h3>Full Manuscript Export</h3>
                    </div>
                    <p style="color: #b8b3aa; margin-bottom: var(--spacing-md);">
                        Export your complete work (${scenes.length} scenes, ${totalWords.toLocaleString()} words) as a formatted document.
                    </p>
                    <div class="export-options">
                        <div class="export-option selected" data-format="txt">
                            <div class="export-option-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                </svg>
                            </div>
                            <div class="export-option-info">
                                <div class="export-option-title">Plain Text (.txt)</div>
                                <div class="export-option-desc">Universal compatibility, simple formatting</div>
                            </div>
                        </div>
                    </div>
                    <div class="export-settings">
                        <div class="export-setting">
                            <input type="checkbox" id="includeSceneTitles" checked>
                            <label for="includeSceneTitles">Include scene titles</label>
                        </div>
                        <div class="export-setting">
                            <input type="checkbox" id="includeAuthorBadges">
                            <label for="includeAuthorBadges">Include author names</label>
                        </div>
                        <div class="export-setting">
                            <input type="checkbox" id="includeWordCounts">
                            <label for="includeWordCounts">Include word counts</label>
                        </div>
                        <div class="export-setting">
                            <input type="checkbox" id="separateScenes" checked>
                            <label for="separateScenes">Page breaks between scenes</label>
                        </div>
                    </div>
                    <button class="export-btn" onclick="ChronicleArchive.exportFullManuscript()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export Manuscript
                    </button>
                </div>
                
                <div class="export-section">
                    <div class="export-section-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                        </svg>
                        <h3>Single Scene Export</h3>
                    </div>
                    <p style="color: #b8b3aa;">
                        Select a scene from the Scene Library to export it individually.
                    </p>
                </div>
            </div>
        `;
    },
    
    // ===================================
    // SCENE SELECTION & DETAILS
    // ===================================
    
    selectScene(sceneId) {
        this.selectedSceneId = sceneId;
        
        // Update selected state in UI
        document.querySelectorAll('.scene-card, .scene-list-item, .structure-scene-item').forEach(el => {
            el.classList.remove('selected');
            if (el.dataset.sceneId === sceneId) {
                el.classList.add('selected');
            }
        });
        
        // Open details panel
        this.openDetailsPanel(sceneId);
    },
    
    openDetailsPanel(sceneId) {
        const scene = this.getScenes().find(s => s.id === sceneId);
        if (!scene) return;
        
        const panel = document.getElementById('archiveDetailsPanel');
        const content = document.getElementById('archiveDetailsContent');
        
        if (!panel || !content) return;
        
        const status = scene.status || 'draft';
        const author = scene.author || 'tyrrel';
        const wordCount = scene.wordCount || 0;
        const lastModified = scene.lastModified ? new Date(scene.lastModified).toLocaleString() : 'Unknown';
        const createdDate = scene.createdDate ? new Date(scene.createdDate).toLocaleDateString() : 'Unknown';
        const excerpt = (scene.content || '').substring(0, 500) + ((scene.content || '').length > 500 ? '...' : '');
        
        content.innerHTML = `
            <div class="scene-preview">
                <div class="scene-preview-title">${scene.title || 'Untitled Scene'}</div>
                <div class="scene-preview-excerpt">${excerpt || '<em>No content yet</em>'}</div>
            </div>
            
            <div class="detail-field">
                <div class="detail-field-label">Author</div>
                <div class="detail-field-value">
                    <span class="author-badge ${author}" style="display: inline-flex; margin-right: 8px;">${author.charAt(0).toUpperCase()}</span>
                    ${author.charAt(0).toUpperCase() + author.slice(1)}
                </div>
            </div>
            
            <div class="detail-field">
                <div class="detail-field-label">Status</div>
                <div class="detail-field-value">
                    <span class="status-dot ${status}" style="display: inline-block; margin-right: 8px;"></span>
                    ${status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
            </div>
            
            <div class="detail-field">
                <div class="detail-field-label">Word Count</div>
                <div class="detail-field-value">${wordCount.toLocaleString()} words</div>
            </div>
            
            <div class="detail-field">
                <div class="detail-field-label">Last Modified</div>
                <div class="detail-field-value">${lastModified}</div>
            </div>
            
            <div class="detail-field">
                <div class="detail-field-label">Created</div>
                <div class="detail-field-value">${createdDate}</div>
            </div>
            
            <div class="detail-actions">
                <button class="detail-action-btn primary" onclick="ChronicleArchive.openInDesk('${scene.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Open in Desk
                </button>
                <button class="detail-action-btn" onclick="ChronicleArchive.exportScene('${scene.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export Scene
                </button>
                <button class="detail-action-btn" onclick="ChronicleArchive.cycleSceneStatus('${scene.id}')" style="font-size: 0.8rem;">
                    Cycle Status →
                </button>
            </div>
        `;
        
        panel.classList.add('open');
        this.detailsPanelOpen = true;
    },
    
    closeDetailsPanel() {
        const panel = document.getElementById('archiveDetailsPanel');
        if (panel) {
            panel.classList.remove('open');
        }
        this.detailsPanelOpen = false;
        this.selectedSceneId = null;
        
        // Remove selected state
        document.querySelectorAll('.scene-card, .scene-list-item, .structure-scene-item').forEach(el => {
            el.classList.remove('selected');
        });
    },
    
    // ===================================
    // ACTIONS
    // ===================================
    
    openInDesk(sceneId) {
        // Switch to Desk and load scene
        if (typeof switchSpace === 'function') {
            switchSpace('desk');
        }
        
        // Load the scene in Desk
        if (typeof ChronicleDesk !== 'undefined' && ChronicleDesk.loadScene) {
            ChronicleDesk.loadScene(sceneId);
        }
        
        console.log(`📝 Opening scene ${sceneId} in The Desk`);
    },
    
    cycleSceneStatus(sceneId) {
        const scenes = this.getScenes();
        const scene = scenes.find(s => s.id === sceneId);
        if (!scene) return;
        
        const statusOrder = ['draft', 'in-progress', 'polished'];
        const currentIndex = statusOrder.indexOf(scene.status || 'draft');
        scene.status = statusOrder[(currentIndex + 1) % statusOrder.length];
        
        this.saveScenes(scenes);
        this.renderCurrentChamber();
        this.updateStats();
        
        // Refresh details panel if open
        if (this.selectedSceneId === sceneId) {
            this.openDetailsPanel(sceneId);
        }
        
        console.log(`✨ Scene status changed to: ${scene.status}`);
    },
    
    exportScene(sceneId) {
        const scene = this.getScenes().find(s => s.id === sceneId);
        if (!scene) return;
        
        const content = `${scene.title || 'Untitled Scene'}\n${'='.repeat(40)}\n\n${scene.content || ''}\n\n---\nWords: ${scene.wordCount || 0}\nAuthor: ${scene.author || 'Unknown'}\nExported: ${new Date().toLocaleString()}`;
        
        this.downloadFile(`${scene.title || 'scene'}.txt`, content);
    },
    
    exportFullManuscript() {
        const scenes = this.getScenes();
        const acts = this.getActs();
        const chapters = this.getChapters();
        
        const includeSceneTitles = document.getElementById('includeSceneTitles')?.checked ?? true;
        const includeAuthors = document.getElementById('includeAuthorBadges')?.checked ?? false;
        const includeWordCounts = document.getElementById('includeWordCounts')?.checked ?? false;
        const separateScenes = document.getElementById('separateScenes')?.checked ?? true;
        
        let manuscript = 'JOSEPH: A MODERN STORY\n';
        manuscript += 'A Chronicle Manuscript\n';
        manuscript += `${'='.repeat(50)}\n\n`;
        
        // Organized by act/chapter if available
        if (acts.length > 0) {
            acts.forEach(act => {
                manuscript += `\n${'='.repeat(50)}\n`;
                manuscript += `${act.name || 'Untitled Act'}\n`;
                manuscript += `${'='.repeat(50)}\n\n`;
                
                const actChapters = chapters.filter(c => c.actId === act.id);
                
                actChapters.forEach(chapter => {
                    manuscript += `\n--- ${chapter.name || 'Untitled Chapter'} ---\n\n`;
                    
                    const chapterScenes = scenes.filter(s => s.chapterId === chapter.id);
                    chapterScenes.forEach(scene => {
                        manuscript += this.formatSceneForExport(scene, { includeSceneTitles, includeAuthors, includeWordCounts });
                        if (separateScenes) manuscript += '\n\n---\n\n';
                    });
                });
                
                // Direct scenes in act
                const directScenes = scenes.filter(s => s.actId === act.id && !s.chapterId);
                directScenes.forEach(scene => {
                    manuscript += this.formatSceneForExport(scene, { includeSceneTitles, includeAuthors, includeWordCounts });
                    if (separateScenes) manuscript += '\n\n---\n\n';
                });
            });
        }
        
        // Unassigned scenes
        const unassigned = scenes.filter(s => !s.actId);
        if (unassigned.length > 0) {
            manuscript += `\n${'='.repeat(50)}\n`;
            manuscript += `UNASSIGNED SCENES\n`;
            manuscript += `${'='.repeat(50)}\n\n`;
            
            unassigned.forEach(scene => {
                manuscript += this.formatSceneForExport(scene, { includeSceneTitles, includeAuthors, includeWordCounts });
                if (separateScenes) manuscript += '\n\n---\n\n';
            });
        }
        
        // Footer
        const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        manuscript += `\n${'='.repeat(50)}\n`;
        manuscript += `Total Words: ${totalWords.toLocaleString()}\n`;
        manuscript += `Total Scenes: ${scenes.length}\n`;
        manuscript += `Exported: ${new Date().toLocaleString()}\n`;
        manuscript += `${'='.repeat(50)}\n`;
        
        this.downloadFile('Joseph_Manuscript.txt', manuscript);
    },
    
    formatSceneForExport(scene, options) {
        let output = '';
        
        if (options.includeSceneTitles) {
            output += `## ${scene.title || 'Untitled Scene'}\n`;
        }
        
        if (options.includeAuthors || options.includeWordCounts) {
            const meta = [];
            if (options.includeAuthors) meta.push(`Author: ${scene.author || 'Unknown'}`);
            if (options.includeWordCounts) meta.push(`Words: ${scene.wordCount || 0}`);
            output += `[${meta.join(' | ')}]\n`;
        }
        
        output += '\n' + (scene.content || '') + '\n';
        
        return output;
    },
    
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`📥 Downloaded: ${filename}`);
    },
    
    clearFilters() {
        this.filters = { search: '', author: 'all', status: 'all' };
        
        const searchInput = document.getElementById('archiveSearch');
        if (searchInput) searchInput.value = '';
        
        const authorLabel = document.getElementById('authorFilterLabel');
        const statusLabel = document.getElementById('statusFilterLabel');
        if (authorLabel) authorLabel.textContent = 'All Authors';
        if (statusLabel) statusLabel.textContent = 'All Status';
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('has-filter'));
        
        this.renderCurrentChamber();
    },
    
    goToDesk() {
        if (typeof switchSpace === 'function') {
            switchSpace('desk');
        }
    },
    
    goToCovenant() {
        if (typeof switchSpace === 'function') {
            switchSpace('covenant');
        }
    },
    
    refresh() {
        this.renderCurrentChamber();
        this.updateStats();
        console.log('🔄 Archive refreshed');
    },
    
    // ===================================
    // STATISTICS
    // ===================================
    
    updateStats() {
        const scenes = this.getScenes();
        
        const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        const tyrrelWords = scenes.filter(s => s.author === 'tyrrel').reduce((sum, s) => sum + (s.wordCount || 0), 0);
        const trevorWords = scenes.filter(s => s.author === 'trevor').reduce((sum, s) => sum + (s.wordCount || 0), 0);
        const polishedCount = scenes.filter(s => s.status === 'polished').length;
        
        const updateEl = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value.toLocaleString();
        };
        
        updateEl('sceneCount', scenes.length);
        updateEl('totalWords', totalWords);
        updateEl('tyrrelWords', tyrrelWords);
        updateEl('trevorWords', trevorWords);
        updateEl('polishedCount', polishedCount);
    },
    
    // ===================================
    // DATA ACCESS
    // ===================================
    
    getScenes() {
        return JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
    },
    
    saveScenes(scenes) {
        localStorage.setItem('chronicle_scenes', JSON.stringify(scenes));
    },
    
    getActs() {
        return JSON.parse(localStorage.getItem('chronicle_acts') || '[]');
    },
    
    getChapters() {
        return JSON.parse(localStorage.getItem('chronicle_chapters') || '[]');
    },
    
    getActName(actId) {
        if (!actId) return null;
        const act = this.getActs().find(a => a.id === actId);
        return act ? act.name : null;
    },
    
    getChapterName(chapterId) {
        if (!chapterId) return null;
        const chapter = this.getChapters().find(c => c.id === chapterId);
        return chapter ? chapter.name : null;
    }
};

// Make globally available
window.ChronicleArchive = ChronicleArchive;

// Initialize when DOM ready and when Archive tab is clicked
document.addEventListener('DOMContentLoaded', () => {
    // Initialize when switching to Archive
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Use 'tab' from closure, not e.target
            if (tab.dataset.space === 'archive') {
                setTimeout(() => {
                    try {
                        ChronicleArchive.init();
                    } catch (error) {
                        console.error('❌ Archive failed to initialize:', error);
                    }
                }, 100);
            }
        });
    });
});

console.log('📚 Chronicle Archive module loaded');
console.log('"Store up for yourselves treasures in heaven" - Matthew 6:20');
