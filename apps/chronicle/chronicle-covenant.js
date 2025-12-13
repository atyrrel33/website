// ===================================
// THE COVENANT - Story Structure Sanctuary
// "Unless the LORD builds the house, the builders labor in vain"
// - Psalm 127:1
//
// Sprint 1: The Architect's View
// - Visual Beat Sheet
// - Act/Chapter Manager
// - Structure Validation
// ===================================

const ChronicleCovenant = {
    // Current state
    currentView: 'beatsheet', // beatsheet, timeline, pacing, characters, themes
    selectedSceneId: null,
    selectedActId: null,
    detailsPanelOpen: false,
    
    // Drag and drop state
    dragState: {
        isDragging: false,
        draggedSceneId: null,
        sourceActId: null,
        sourceChapterId: null
    },
    
    // Initialization flag
    initialized: false,
    
    // ===================================
    // INITIALIZATION
    // ===================================
    
    init() {
        if (this.initialized) return;
        
        console.log('📜 The Covenant awakens...');
        console.log('"First the natural, then the spiritual" - 1 Corinthians 15:46');
        
        // Build the UI
        this.buildCovenantUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderCurrentView();
        this.renderSidebar();
        this.validateStructure();
        
        this.initialized = true;
        console.log('✅ The Covenant stands ready to reveal structure');
    },
    
    // ===================================
    // UI BUILDING
    // ===================================
    
    buildCovenantUI() {
        const container = document.querySelector('#covenant .covenant-container');
        if (!container) {
            console.error('Covenant container not found');
            return;
        }
        
        // Clear placeholder
        container.innerHTML = '';
        
        // Build the three-panel layout
        container.innerHTML = `
            <!-- Top Bar with View Toggles -->
            <div class="covenant-topbar">
                <div class="covenant-view-tabs">
                    <button class="view-tab active" data-view="beatsheet">Beat Sheet</button>
                    <button class="view-tab" data-view="timeline">Timeline</button>
                    <button class="view-tab" data-view="pacing">Pacing</button>
                    <button class="view-tab" data-view="characters">Characters</button>
                    <button class="view-tab" data-view="themes">Themes</button>
                </div>
                <div class="covenant-topbar-actions">
                    <button class="topbar-btn" id="covenantValidateBtn" title="Validate Structure">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 11l3 3L22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        <span>Validate</span>
                    </button>
                    <button class="topbar-btn" id="covenantRefreshBtn" title="Refresh from Desk">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 4v6h-6"/>
                            <path d="M1 20v-6h6"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>
            
            <!-- Main Layout -->
            <div class="covenant-layout">
                <!-- Left Sidebar - Structure Tree -->
                <aside class="covenant-sidebar">
                    <div class="sidebar-header">
                        <h3>Structure</h3>
                        <p>Your narrative architecture</p>
                    </div>
                    <div class="structure-tree" id="structureTree">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="sidebar-actions">
                        <button class="sidebar-action-btn" id="addActBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add Act
                        </button>
                        <button class="sidebar-action-btn" id="addChapterBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add Chapter
                        </button>
                    </div>
                </aside>
                
                <!-- Main Canvas -->
                <main class="covenant-canvas">
                    <div class="canvas-content" id="covenantCanvasContent">
                        <!-- Views rendered here -->
                    </div>
                </main>
                
                <!-- Right Details Panel -->
                <aside class="covenant-details-panel" id="covenantDetailsPanel">
                    <div class="details-header">
                        <h3>Scene Details</h3>
                        <button class="close-details-btn" id="closeDetailsBtn">×</button>
                    </div>
                    <div class="details-content" id="detailsContent">
                        <!-- Populated dynamically -->
                    </div>
                </aside>
            </div>
            
            <!-- Modals -->
            <div class="covenant-modal" id="actModal">
                <div class="covenant-modal-content">
                    <div class="covenant-modal-header">
                        <h3 id="actModalTitle">Add New Act</h3>
                        <p>Define the boundaries of your narrative structure</p>
                    </div>
                    <div class="covenant-modal-body">
                        <div class="covenant-form-field">
                            <label for="actNameInput">Act Name</label>
                            <input type="text" id="actNameInput" placeholder="e.g., Act I: The Ordinary World">
                        </div>
                        <div class="covenant-form-field">
                            <label for="actDescInput">Description (optional)</label>
                            <textarea id="actDescInput" rows="3" placeholder="What happens in this act?"></textarea>
                        </div>
                    </div>
                    <div class="covenant-modal-footer">
                        <button class="covenant-modal-btn secondary" id="cancelActBtn">Cancel</button>
                        <button class="covenant-modal-btn primary" id="saveActBtn">Save Act</button>
                    </div>
                </div>
            </div>
            
            <div class="covenant-modal" id="chapterModal">
                <div class="covenant-modal-content">
                    <div class="covenant-modal-header">
                        <h3 id="chapterModalTitle">Add New Chapter</h3>
                        <p>Organize scenes within your act structure</p>
                    </div>
                    <div class="covenant-modal-body">
                        <div class="covenant-form-field">
                            <label for="chapterActSelect">Parent Act</label>
                            <select id="chapterActSelect">
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        <div class="covenant-form-field">
                            <label for="chapterNameInput">Chapter Name</label>
                            <input type="text" id="chapterNameInput" placeholder="e.g., Chapter 1: The Call">
                        </div>
                    </div>
                    <div class="covenant-modal-footer">
                        <button class="covenant-modal-btn secondary" id="cancelChapterBtn">Cancel</button>
                        <button class="covenant-modal-btn primary" id="saveChapterBtn">Save Chapter</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // ===================================
    // EVENT LISTENERS
    // ===================================
    
    setupEventListeners() {
        // View tab switching
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
        
        // Validate button
        const validateBtn = document.getElementById('covenantValidateBtn');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateStructure(true));
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('covenantRefreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshFromDesk());
        }
        
        // Add Act button
        const addActBtn = document.getElementById('addActBtn');
        if (addActBtn) {
            addActBtn.addEventListener('click', () => this.showActModal());
        }
        
        // Add Chapter button
        const addChapterBtn = document.getElementById('addChapterBtn');
        if (addChapterBtn) {
            addChapterBtn.addEventListener('click', () => this.showChapterModal());
        }
        
        // Close details panel
        const closeDetailsBtn = document.getElementById('closeDetailsBtn');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => this.closeDetailsPanel());
        }
        
        // Act Modal
        const cancelActBtn = document.getElementById('cancelActBtn');
        const saveActBtn = document.getElementById('saveActBtn');
        if (cancelActBtn) {
            cancelActBtn.addEventListener('click', () => this.closeModal('actModal'));
        }
        if (saveActBtn) {
            saveActBtn.addEventListener('click', () => this.saveAct());
        }
        
        // Chapter Modal
        const cancelChapterBtn = document.getElementById('cancelChapterBtn');
        const saveChapterBtn = document.getElementById('saveChapterBtn');
        if (cancelChapterBtn) {
            cancelChapterBtn.addEventListener('click', () => this.closeModal('chapterModal'));
        }
        if (saveChapterBtn) {
            saveChapterBtn.addEventListener('click', () => this.saveChapter());
        }
        
        // Close modals on backdrop click
        document.querySelectorAll('.covenant-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only handle if we're in Covenant view
            const covenantSection = document.getElementById('covenant');
            if (!covenantSection?.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                this.closeDetailsPanel();
                this.closeModal('actModal');
                this.closeModal('chapterModal');
            }
        });
    },
    
    // ===================================
    // VIEW SWITCHING
    // ===================================
    
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update tab states
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === viewName);
        });
        
        // Render the appropriate view
        this.renderCurrentView();
    },
    
    renderCurrentView() {
        const canvas = document.getElementById('covenantCanvasContent');
        if (!canvas) return;
        
        switch (this.currentView) {
            case 'beatsheet':
                this.renderBeatSheet(canvas);
                break;
            case 'timeline':
                this.renderTimeline(canvas);
                break;
            case 'pacing':
                this.renderPacingView(canvas);
                break;
            case 'characters':
                this.renderCharactersView(canvas);
                break;
            case 'themes':
                this.renderThemesView(canvas);
                break;
            default:
                this.renderBeatSheet(canvas);
        }
    },
    
    // ===================================
    // BEAT SHEET VIEW - Sprint 1 Core
    // ===================================
    
    renderBeatSheet(container) {
        const acts = this.getActs();
        const scenes = this.getScenes();
        const warnings = this.getStructureWarnings();
        
        let html = `<div class="beat-sheet-view active">`;
        
        // Validation warnings
        if (warnings.length > 0) {
            html += `
                <div class="validation-warnings">
                    <div class="validation-warning-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <h4>Structure Warnings</h4>
                    </div>
                    <ul class="validation-warning-list">
                        ${warnings.map(w => `<li class="validation-warning-item">${w}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Header with legend
        html += `
            <div class="beat-sheet-header">
                <h2 class="beat-sheet-title">Story Beat Sheet</h2>
                <div class="beat-sheet-legend">
                    ${this.renderMcKeeLegend()}
                </div>
            </div>
        `;
        
        // Check if we have content
        if (acts.length === 0 && scenes.length === 0) {
            html += this.renderEmptyBeatSheet();
        } else {
            html += `<div class="beat-sheet-grid">`;
            
            // Render each act as a column
            acts.forEach(act => {
                const actScenes = scenes.filter(s => s.actId === act.id);
                const wordCount = actScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
                
                html += `
                    <div class="act-column" data-act-id="${act.id}">
                        <div class="act-column-header">
                            <span class="act-column-title">${act.name}</span>
                            <span class="act-column-stats">${actScenes.length} scenes • ${wordCount.toLocaleString()} words</span>
                        </div>
                        <div class="act-column-content" 
                            data-act-id="${act.id}"
                            ondragover="ChronicleCovenant.handleDragOver(event)"
                            ondrop="ChronicleCovenant.handleDrop(event)">
                            ${actScenes.map(scene => this.renderSceneCard(scene)).join('')}
                            <div class="add-scene-card" onclick="ChronicleCovenant.createSceneInAct('${act.id}')">
                                + Add Scene
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // Column for unassigned scenes
            const orphanScenes = scenes.filter(s => !s.actId);
            if (orphanScenes.length > 0) {
                html += `
                    <div class="act-column" data-act-id="unassigned">
                        <div class="act-column-header">
                            <span class="act-column-title">Unassigned</span>
                            <span class="act-column-stats">${orphanScenes.length} scenes</span>
                        </div>
                        <div class="act-column-content" 
                            data-act-id="unassigned"
                            ondragover="ChronicleCovenant.handleDragOver(event)"
                            ondrop="ChronicleCovenant.handleDrop(event)">
                            ${orphanScenes.map(scene => this.renderSceneCard(scene)).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        html += `</div>`;
        container.innerHTML = html;
        
        // Setup drag and drop on scene cards
        this.setupDragAndDrop();
    },
    
    renderSceneCard(scene) {
        const mckeeElement = scene.mckeeData?.structureElement || '';
        const author = scene.author || 'unknown';
        
        return `
            <div class="scene-card" 
                data-scene-id="${scene.id}"
                data-mckee="${mckeeElement}"
                draggable="true"
                onclick="ChronicleCovenant.selectScene('${scene.id}')"
                ondragstart="ChronicleCovenant.handleDragStart(event)"
                ondragend="ChronicleCovenant.handleDragEnd(event)">
                <div class="scene-card-header">
                    <span class="scene-card-title">${scene.title || 'Untitled Scene'}</span>
                    ${mckeeElement ? `<span class="scene-card-badge">${this.getMcKeeLabel(mckeeElement)}</span>` : ''}
                </div>
                <div class="scene-card-meta">
                    <span class="scene-card-author">
                        <span class="author-dot ${author}"></span>
                        ${author}
                    </span>
                    <span>${(scene.wordCount || 0).toLocaleString()} words</span>
                </div>
            </div>
        `;
    },
    
    renderMcKeeLegend() {
        const elements = [
            { key: 'opening', label: 'Opening', color: '#6B8E23' },
            { key: 'inciting', label: 'Inciting', color: '#CD853F' },
            { key: 'lockin', label: 'Lock-In', color: '#B8860B' },
            { key: 'midpoint', label: 'Midpoint', color: '#9370DB' },
            { key: 'crisis', label: 'Crisis', color: '#DC143C' },
            { key: 'climax', label: 'Climax', color: '#FF4500' },
            { key: 'resolution', label: 'Resolution', color: '#2E8B57' }
        ];
        
        return elements.map(el => `
            <div class="legend-item">
                <span class="legend-color" style="background: ${el.color}"></span>
                <span>${el.label}</span>
            </div>
        `).join('');
    },
    
    renderEmptyBeatSheet() {
        return `
            <div class="beat-sheet-empty">
                <svg class="beat-sheet-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
                <h3>Your Story Structure Awaits</h3>
                <p>Begin writing scenes in The Desk, or create Acts using the sidebar to organize your narrative architecture. Each scene will appear here as a card you can arrange and analyze.</p>
            </div>
        `;
    },
    
    getMcKeeLabel(key) {
        const labels = {
            opening: 'Opening',
            inciting: 'Inciting',
            lockin: 'Lock-In',
            complications: 'Compl.',
            midpoint: 'Midpoint',
            crisis: 'Crisis',
            climax: 'Climax',
            resolution: 'Resolution',
            closing: 'Closing'
        };
        return labels[key] || key;
    },
    
    // ===================================
    // TIMELINE VIEW
    // ===================================
    
    renderTimeline(container) {
        const acts = this.getActs();
        const scenes = this.getScenes();
        
        let html = `<div class="timeline-view active">`;
        
        html += `
            <div class="timeline-header">
                <h2 class="beat-sheet-title">Story Timeline</h2>
                <div class="timeline-controls">
                    <!-- Future: Toggle chronological vs narrative order -->
                </div>
            </div>
        `;
        
        if (acts.length === 0 && scenes.length === 0) {
            html += this.renderEmptyBeatSheet();
        } else {
            html += `<div class="timeline-container"><div class="timeline-line"></div>`;
            
            let sceneNumber = 1;
            acts.forEach((act, actIndex) => {
                const actScenes = scenes.filter(s => s.actId === act.id);
                
                html += `
                    <div class="timeline-act-section">
                        <div class="timeline-act-marker">${this.toRoman(actIndex + 1)}</div>
                        <div class="timeline-act-label">${act.name}</div>
                        <div class="timeline-scenes">
                            ${actScenes.map(scene => {
                                const num = sceneNumber++;
                                return `
                                    <div class="timeline-scene-item" onclick="ChronicleCovenant.selectScene('${scene.id}')">
                                        <span class="timeline-scene-number">${num}</span>
                                        <div class="timeline-scene-info">
                                            <div class="timeline-scene-title">${scene.title || 'Untitled'}</div>
                                            <div class="timeline-scene-summary">${(scene.wordCount || 0).toLocaleString()} words</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        html += `</div>`;
        container.innerHTML = html;
    },
    
    toRoman(num) {
        const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    },
    
    // ===================================
    // SIDEBAR - Structure Tree
    // ===================================
    
    renderSidebar() {
        const treeContainer = document.getElementById('structureTree');
        if (!treeContainer) return;
        
        const acts = this.getActs();
        const chapters = this.getChapters();
        const scenes = this.getScenes();
        
        if (acts.length === 0 && scenes.length === 0) {
            treeContainer.innerHTML = `
                <div class="structure-tree-empty">
                    <p>No structure yet. Create an act to begin organizing your story.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        acts.forEach(act => {
            const actChapters = chapters.filter(c => c.actId === act.id);
            const actScenes = scenes.filter(s => s.actId === act.id);
            const wordCount = actScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
            
            html += `
                <div class="act-group" data-act-id="${act.id}">
                    <div class="act-header" onclick="ChronicleCovenant.toggleActGroup('${act.id}')">
                        <div>
                            <span class="act-title">${act.name}</span>
                            <span class="act-stats">${actScenes.length} scenes</span>
                        </div>
                        <button class="act-toggle">▼</button>
                    </div>
                    <div class="act-content">
            `;
            
            // Render chapters within act
            actChapters.forEach(chapter => {
                const chapterScenes = scenes.filter(s => s.chapterId === chapter.id);
                
                html += `
                    <div class="chapter-group" data-chapter-id="${chapter.id}">
                        <div class="chapter-header" onclick="ChronicleCovenant.toggleChapterGroup('${chapter.id}')">
                            <span class="chapter-title">${chapter.name}</span>
                        </div>
                        <div class="chapter-content">
                            ${chapterScenes.map(scene => this.renderSidebarScene(scene)).join('')}
                        </div>
                    </div>
                `;
            });
            
            // Scenes in act but not in chapter
            const directScenes = actScenes.filter(s => !s.chapterId);
            directScenes.forEach(scene => {
                html += this.renderSidebarScene(scene);
            });
            
            html += `</div></div>`;
        });
        
        // Unassigned scenes
        const orphanScenes = scenes.filter(s => !s.actId);
        if (orphanScenes.length > 0) {
            html += `
                <div class="act-group" data-act-id="unassigned">
                    <div class="act-header">
                        <span class="act-title">Unassigned</span>
                        <span class="act-stats">${orphanScenes.length} scenes</span>
                    </div>
                    <div class="act-content">
                        ${orphanScenes.map(scene => this.renderSidebarScene(scene)).join('')}
                    </div>
                </div>
            `;
        }
        
        treeContainer.innerHTML = html;
    },
    
    renderSidebarScene(scene) {
        const mckeeElement = scene.mckeeData?.structureElement || '';
        const isSelected = this.selectedSceneId === scene.id;
        
        return `
            <div class="scene-item ${isSelected ? 'selected' : ''}" 
                data-scene-id="${scene.id}"
                data-mckee="${mckeeElement}"
                onclick="ChronicleCovenant.selectScene('${scene.id}')">
                <span class="scene-title">${scene.title || 'Untitled'}</span>
                <span class="scene-words">${(scene.wordCount || 0).toLocaleString()}</span>
            </div>
        `;
    },
    
    toggleActGroup(actId) {
        const group = document.querySelector(`.act-group[data-act-id="${actId}"]`);
        if (group) {
            group.classList.toggle('collapsed');
        }
    },
    
    toggleChapterGroup(chapterId) {
        const group = document.querySelector(`.chapter-group[data-chapter-id="${chapterId}"]`);
        if (group) {
            group.classList.toggle('collapsed');
        }
    },
    
    // ===================================
    // SCENE SELECTION & DETAILS PANEL
    // ===================================
    
    selectScene(sceneId) {
        this.selectedSceneId = sceneId;
        
        // Update sidebar highlighting
        document.querySelectorAll('.scene-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.sceneId === sceneId);
        });
        
        // Update card highlighting
        document.querySelectorAll('.scene-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.sceneId === sceneId);
        });
        
        // Show details panel
        this.openDetailsPanel(sceneId);
    },
    
    openDetailsPanel(sceneId) {
        const panel = document.getElementById('covenantDetailsPanel');
        const content = document.getElementById('detailsContent');
        if (!panel || !content) return;
        
        const scene = this.getScenes().find(s => s.id === sceneId);
        if (!scene) return;
        
        const mckeeData = scene.mckeeData || {};
        const mckeeElement = mckeeData.structureElement ? this.getMcKeeLabel(mckeeData.structureElement) : 'Not assigned';
        const forces = mckeeData.forces || [];
        
        content.innerHTML = `
            <div class="detail-section">
                <h4>Basic Info</h4>
                <div class="detail-field">
                    <div class="detail-label">Title</div>
                    <div class="detail-value">${scene.title || 'Untitled Scene'}</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Word Count</div>
                    <div class="detail-value">${(scene.wordCount || 0).toLocaleString()} words</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Author</div>
                    <div class="detail-value">${scene.author || 'Unknown'}</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Story Structure</h4>
                <div class="detail-field">
                    <div class="detail-label">McKee Element</div>
                    <div class="detail-value">${mckeeElement}</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Purpose</div>
                    <div class="detail-value">${mckeeData.purpose || 'Not defined'}</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Active Forces</div>
                    <div class="detail-value">${forces.length > 0 ? forces.join(', ') : 'None assigned'}</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Organization</h4>
                <div class="detail-field">
                    <div class="detail-label">Act</div>
                    <div class="detail-value">${this.getActName(scene.actId) || 'Unassigned'}</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Chapter</div>
                    <div class="detail-value">${this.getChapterName(scene.chapterId) || 'Unassigned'}</div>
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="detail-action-btn primary" onclick="ChronicleCovenant.openSceneInDesk('${scene.id}')">
                    Edit in Desk
                </button>
                <button class="detail-action-btn" onclick="ChronicleCovenant.showMoveSceneOptions('${scene.id}')">
                    Move to...
                </button>
            </div>
        `;
        
        panel.classList.add('active');
        this.detailsPanelOpen = true;
    },
    
    closeDetailsPanel() {
        const panel = document.getElementById('covenantDetailsPanel');
        if (panel) {
            panel.classList.remove('active');
        }
        this.detailsPanelOpen = false;
        this.selectedSceneId = null;
        
        // Clear highlights
        document.querySelectorAll('.scene-item.selected, .scene-card.selected').forEach(el => {
            el.classList.remove('selected');
        });
    },
    
    openSceneInDesk(sceneId) {
        // Switch to Desk tab
        const deskTab = document.querySelector('.nav-tab[data-space="desk"]');
        if (deskTab) {
            deskTab.click();
        }
        
        // Load the scene in the desk
        if (window.ChronicleDesk) {
            ChronicleDesk.loadSceneById(sceneId);
        }
    },
    
    // ===================================
    // DRAG AND DROP
    // ===================================
    
    setupDragAndDrop() {
        // Drag and drop is set up via inline handlers in renderBeatSheet
        // This function can be used for additional setup if needed
    },
    
    handleDragStart(event) {
        const card = event.target.closest('.scene-card');
        if (!card) return;
        
        this.dragState.isDragging = true;
        this.dragState.draggedSceneId = card.dataset.sceneId;
        
        card.classList.add('dragging');
        event.dataTransfer.setData('text/plain', card.dataset.sceneId);
        event.dataTransfer.effectAllowed = 'move';
    },
    
    handleDragEnd(event) {
        const card = event.target.closest('.scene-card');
        if (card) {
            card.classList.remove('dragging');
        }
        
        this.dragState.isDragging = false;
        this.dragState.draggedSceneId = null;
        
        // Remove all drag-over states
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    },
    
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        const column = event.target.closest('.act-column-content');
        if (column) {
            // Visual feedback
            document.querySelectorAll('.act-column-content').forEach(c => {
                c.classList.remove('drag-over');
            });
            column.classList.add('drag-over');
        }
    },
    
    handleDrop(event) {
        event.preventDefault();
        
        const sceneId = event.dataTransfer.getData('text/plain');
        const column = event.target.closest('.act-column-content');
        
        if (!column || !sceneId) return;
        
        const newActId = column.dataset.actId;
        this.moveSceneToAct(sceneId, newActId === 'unassigned' ? null : newActId);
        
        // Clean up
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    },
    
    moveSceneToAct(sceneId, actId) {
        const scenes = this.getScenes();
        const sceneIndex = scenes.findIndex(s => s.id === sceneId);
        
        if (sceneIndex === -1) return;
        
        scenes[sceneIndex].actId = actId;
        scenes[sceneIndex].chapterId = null; // Clear chapter when moving to new act
        
        this.saveScenes(scenes);
        
        // Re-render
        this.renderCurrentView();
        this.renderSidebar();
        
        console.log(`📦 Scene moved to ${actId || 'Unassigned'}`);
    },
    
    // ===================================
    // ACT & CHAPTER MANAGEMENT
    // ===================================
    
    showActModal(actId = null) {
        const modal = document.getElementById('actModal');
        const title = document.getElementById('actModalTitle');
        const nameInput = document.getElementById('actNameInput');
        const descInput = document.getElementById('actDescInput');
        
        if (!modal) return;
        
        // Reset form
        nameInput.value = '';
        descInput.value = '';
        
        if (actId) {
            const act = this.getActs().find(a => a.id === actId);
            if (act) {
                title.textContent = 'Edit Act';
                nameInput.value = act.name;
                descInput.value = act.description || '';
                modal.dataset.editId = actId;
            }
        } else {
            title.textContent = 'Add New Act';
            delete modal.dataset.editId;
        }
        
        modal.classList.add('active');
        nameInput.focus();
    },
    
    saveAct() {
        const modal = document.getElementById('actModal');
        const nameInput = document.getElementById('actNameInput');
        const descInput = document.getElementById('actDescInput');
        
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter an act name');
            return;
        }
        
        const acts = this.getActs();
        const editId = modal.dataset.editId;
        
        if (editId) {
            // Update existing
            const actIndex = acts.findIndex(a => a.id === editId);
            if (actIndex !== -1) {
                acts[actIndex].name = name;
                acts[actIndex].description = descInput.value.trim();
            }
        } else {
            // Create new
            const newAct = {
                id: 'act-' + Date.now(),
                name: name,
                description: descInput.value.trim(),
                order: acts.length + 1
            };
            acts.push(newAct);
        }
        
        this.saveActs(acts);
        this.closeModal('actModal');
        this.renderCurrentView();
        this.renderSidebar();
        
        console.log('✅ Act saved:', name);
    },
    
    showChapterModal(chapterId = null) {
        const modal = document.getElementById('chapterModal');
        const title = document.getElementById('chapterModalTitle');
        const actSelect = document.getElementById('chapterActSelect');
        const nameInput = document.getElementById('chapterNameInput');
        
        if (!modal) return;
        
        // Populate act options
        const acts = this.getActs();
        actSelect.innerHTML = acts.map(a => 
            `<option value="${a.id}">${a.name}</option>`
        ).join('');
        
        // Reset form
        nameInput.value = '';
        
        if (chapterId) {
            const chapter = this.getChapters().find(c => c.id === chapterId);
            if (chapter) {
                title.textContent = 'Edit Chapter';
                nameInput.value = chapter.name;
                actSelect.value = chapter.actId;
                modal.dataset.editId = chapterId;
            }
        } else {
            title.textContent = 'Add New Chapter';
            delete modal.dataset.editId;
        }
        
        modal.classList.add('active');
        nameInput.focus();
    },
    
    saveChapter() {
        const modal = document.getElementById('chapterModal');
        const actSelect = document.getElementById('chapterActSelect');
        const nameInput = document.getElementById('chapterNameInput');
        
        const name = nameInput.value.trim();
        const actId = actSelect.value;
        
        if (!name) {
            alert('Please enter a chapter name');
            return;
        }
        
        const chapters = this.getChapters();
        const editId = modal.dataset.editId;
        
        if (editId) {
            // Update existing
            const chapterIndex = chapters.findIndex(c => c.id === editId);
            if (chapterIndex !== -1) {
                chapters[chapterIndex].name = name;
                chapters[chapterIndex].actId = actId;
            }
        } else {
            // Create new
            const newChapter = {
                id: 'chapter-' + Date.now(),
                name: name,
                actId: actId,
                order: chapters.filter(c => c.actId === actId).length + 1
            };
            chapters.push(newChapter);
        }
        
        this.saveChapters(chapters);
        this.closeModal('chapterModal');
        this.renderCurrentView();
        this.renderSidebar();
        
        console.log('✅ Chapter saved:', name);
    },
    
    createSceneInAct(actId) {
        // Redirect to Desk to create new scene, pre-assigned to this act
        const deskTab = document.querySelector('.nav-tab[data-space="desk"]');
        if (deskTab) {
            deskTab.click();
        }
        
        // Create new scene with act assignment
        if (window.ChronicleDesk) {
            ChronicleDesk.createNewScene({
                actId: actId === 'unassigned' ? null : actId
            });
        }
    },
    
    // ===================================
    // STRUCTURE VALIDATION - Sprint 1
    // ===================================
    
    validateStructure(showAlert = false) {
        const warnings = this.getStructureWarnings();
        
        if (showAlert) {
            if (warnings.length === 0) {
                alert('✅ Structure validation passed!\n\nYour story has all essential McKee elements assigned.');
            } else {
                alert('⚠️ Structure Warnings:\n\n' + warnings.join('\n'));
            }
        }
        
        return warnings;
    },
    
    getStructureWarnings() {
        const scenes = this.getScenes();
        const warnings = [];
        
        // Check for essential McKee elements
        const requiredElements = ['inciting', 'midpoint', 'climax'];
        const assignedElements = new Set();
        
        scenes.forEach(scene => {
            if (scene.mckeeData?.structureElement) {
                assignedElements.add(scene.mckeeData.structureElement);
            }
        });
        
        requiredElements.forEach(element => {
            if (!assignedElements.has(element)) {
                const labels = {
                    inciting: 'Inciting Incident',
                    midpoint: 'Midpoint Reversal',
                    climax: 'Climax'
                };
                warnings.push(`No ${labels[element]} assigned`);
            }
        });
        
        // Check for multiple climaxes
        const climaxCount = scenes.filter(s => s.mckeeData?.structureElement === 'climax').length;
        if (climaxCount > 1) {
            warnings.push(`Multiple climaxes detected (${climaxCount})`);
        }
        
        // Check act balance
        const acts = this.getActs();
        if (acts.length > 0) {
            const actWordCounts = {};
            scenes.forEach(scene => {
                if (scene.actId) {
                    actWordCounts[scene.actId] = (actWordCounts[scene.actId] || 0) + (scene.wordCount || 0);
                }
            });
            
            const counts = Object.values(actWordCounts);
            if (counts.length >= 2) {
                const max = Math.max(...counts);
                const min = Math.min(...counts);
                if (max > min * 3 && min > 0) {
                    warnings.push('Significant word count imbalance between acts');
                }
            }
        }
        
        // Check for orphan scenes
        const orphanCount = scenes.filter(s => !s.actId).length;
        if (orphanCount > 0) {
            warnings.push(`${orphanCount} scene(s) not assigned to any act`);
        }
        
        return warnings;
    },
    
    // ===================================
    // DATA ACCESS HELPERS
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
    
    saveActs(acts) {
        localStorage.setItem('chronicle_acts', JSON.stringify(acts));
    },
    
    getChapters() {
        return JSON.parse(localStorage.getItem('chronicle_chapters') || '[]');
    },
    
    saveChapters(chapters) {
        localStorage.setItem('chronicle_chapters', JSON.stringify(chapters));
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
    },
    
    // ===================================
    // UTILITY METHODS
    // ===================================
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            delete modal.dataset.editId;
        }
    },
    
    refreshFromDesk() {
        // Force reload data from localStorage (which Desk writes to)
        this.renderCurrentView();
        this.renderSidebar();
        this.validateStructure();
        
        console.log('🔄 Refreshed from Desk data');
    },
    
    showMoveSceneOptions(sceneId) {
        // Simple prompt for now - could be enhanced with a proper modal
        const acts = this.getActs();
        const options = acts.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
        
        const choice = prompt(`Move scene to which act?\n\n${options}\n\n0. Unassigned\n\nEnter number:`);
        
        if (choice === null) return;
        
        const index = parseInt(choice);
        if (index === 0) {
            this.moveSceneToAct(sceneId, null);
        } else if (index >= 1 && index <= acts.length) {
            this.moveSceneToAct(sceneId, acts[index - 1].id);
        }
    }
};

// Stub methods for Sprint 2 views (implemented in analysis file)
ChronicleCovenant.renderPacingView = function(container) {
    container.innerHTML = `
        <div class="pacing-view active">
            <div class="beat-sheet-empty">
                <h3>Pacing Analysis</h3>
                <p>This view will show word count and tension graphs across your story. Ensure chronicle-covenant-analysis.js is loaded for full functionality.</p>
            </div>
        </div>
    `;
};

ChronicleCovenant.renderCharactersView = function(container) {
    container.innerHTML = `
        <div class="characters-view active">
            <div class="beat-sheet-empty">
                <h3>Character Arc Tracking</h3>
                <p>This view will show character appearances and emotional arcs. Ensure chronicle-covenant-analysis.js is loaded for full functionality.</p>
            </div>
        </div>
    `;
};

ChronicleCovenant.renderThemesView = function(container) {
    container.innerHTML = `
        <div class="themes-view active">
            <div class="beat-sheet-empty">
                <h3>Theme Distribution</h3>
                <p>This view will show a heat map of themes across acts. Ensure chronicle-covenant-analysis.js is loaded for full functionality.</p>
            </div>
        </div>
    `;
};

// Make globally available
window.ChronicleCovenant = ChronicleCovenant;

console.log('📜 Chronicle Covenant module loaded');
console.log('"Unless the LORD builds the house, the builders labor in vain" - Psalm 127:1');
