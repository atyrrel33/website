// ===================================
// CHRONICLE COVENANT - Architectural Sanctuary
// "Unless the LORD builds the house, the builders labor in vain"
// - Psalm 127:1
// ===================================

const ChronicleCovenant = {
    // Data sources (loaded from Desk)
    scenes: [],
    acts: [],
    chapters: [],
    characters: [],
    themes: [],
    
    // Current view state
    currentView: 'beatsheet', // beatsheet, timeline, pacing, characters, themes
    selectedAct: null,
    selectedScene: null,
    draggedElement: null,
    
    // Initialization flag
    initialized: false,
    
    // Initialize The Covenant
    init() {
        if (this.initialized) {
            console.log('⚠️ Covenant already initialized');
            return;
        }
        
        console.log('📜 The Covenant awakens - architectural sanctuary opening...');
        
        try {
            // Load all data from storage
            this.loadCovenantData();
            
            // Build the interface
            this.buildCovenantInterface();
            
            // Setup event listeners
            this.setupCovenantEventListeners();
            
            // Render initial view (Beat Sheet)
            this.renderBeatSheet();
            
            // Setup drag-and-drop
            this.initializeDragAndDrop();
            
            this.initialized = true;
            console.log('✅ The Covenant stands ready - behold the architecture of your story');
            
        } catch (error) {
            console.error('❌ Covenant initialization failed:', error);
            this.showError('The Covenant could not be opened. Please refresh and try again.');
        }
    },
    
    // ===================================
    // DATA LOADING
    // ===================================
    
    loadCovenantData() {
        console.log('📖 Loading story data into Covenant...');
        
        // Load scenes
        const scenesData = localStorage.getItem('chronicle_scenes');
        this.scenes = scenesData ? JSON.parse(scenesData) : [];
        console.log(`  → ${this.scenes.length} scenes loaded`);
        
        // Load acts
        const actsData = localStorage.getItem('chronicle_acts');
        this.acts = actsData ? JSON.parse(actsData) : this.createDefaultActs();
        console.log(`  → ${this.acts.length} acts loaded`);
        
        // Load chapters
        const chaptersData = localStorage.getItem('chronicle_chapters');
        this.chapters = chaptersData ? JSON.parse(chaptersData) : [];
        console.log(`  → ${this.chapters.length} chapters loaded`);
        
        // Load characters
        const charactersData = localStorage.getItem('chronicle_characters');
        this.characters = charactersData ? JSON.parse(charactersData) : [];
        
        // Load themes
        const themesData = localStorage.getItem('chronicle_themes');
        this.themes = themesData ? JSON.parse(themesData) : [];
        
        console.log('✅ All data loaded into Covenant');
    },
    
    createDefaultActs() {
        // Create three-act structure if none exists
        return [
            {
                id: 'act-1',
                number: 1,
                title: 'Act I: The Opening',
                description: 'Setup - The world as it is',
                color: '#8B7355'
            },
            {
                id: 'act-2',
                number: 2,
                title: 'Act II: The Journey',
                description: 'Confrontation - The trials and transformations',
                color: '#C9A961'
            },
            {
                id: 'act-3',
                number: 3,
                title: 'Act III: The Resolution',
                description: 'Resolution - The world transformed',
                color: '#5A8B8A'
            }
        ];
    },
    
    // ===================================
    // INTERFACE BUILDING
    // ===================================
    
    buildCovenantInterface() {
        console.log('🏗️ Building Covenant interface...');
        
        const covenantWorkspace = document.getElementById('covenant');
        if (!covenantWorkspace) {
            throw new Error('Covenant workspace element not found');
        }
        
        // Build view selector
        this.buildViewSelector();
        
        // Build main canvas area
        this.buildMainCanvas();
        
        // Build details panel
        this.buildDetailsPanel();
        
        console.log('✅ Interface built');
    },
    
    buildViewSelector() {
        const viewSelector = document.getElementById('covenant-view-selector');
        if (!viewSelector) return;
        
        const views = [
            { id: 'beatsheet', label: 'Beat Sheet', icon: '📋' },
            { id: 'timeline', label: 'Timeline', icon: '⏱️' },
            { id: 'pacing', label: 'Pacing', icon: '📊' },
            { id: 'characters', label: 'Characters', icon: '👥' },
            { id: 'themes', label: 'Themes', icon: '🎨' }
        ];
        
        viewSelector.innerHTML = views.map(view => `
            <button class="view-tab ${view.id === 'beatsheet' ? 'active' : ''}" 
                    data-view="${view.id}">
                <span class="view-icon">${view.icon}</span>
                <span class="view-label">${view.label}</span>
            </button>
        `).join('');
    },
    
    buildMainCanvas() {
        const canvas = document.getElementById('covenant-canvas');
        if (!canvas) return;
        
        // Canvas will be populated based on current view
        canvas.innerHTML = `
            <div id="canvas-content" class="canvas-content">
                <!-- Content rendered by view-specific functions -->
            </div>
        `;
    },
    
    buildDetailsPanel() {
        const panel = document.getElementById('covenant-details');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="details-header">
                <h3>Details</h3>
                <button id="closeDetails" class="close-btn">✕</button>
            </div>
            <div class="details-content" id="detailsContent">
                <p class="details-empty">Select a scene to view details</p>
            </div>
        `;
    },
    
    // ===================================
    // EVENT LISTENERS
    // ===================================
    
    setupCovenantEventListeners() {
        console.log('🎯 Setting up Covenant event listeners...');
        
        // View selector tabs
        const viewTabs = document.querySelectorAll('.view-tab');
        viewTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
        
        // Act management buttons
        const addActBtn = document.getElementById('addActBtn');
        if (addActBtn) {
            addActBtn.addEventListener('click', () => this.showAddActModal());
        }
        
        // Scene creation buttons (will be added dynamically in beat sheet)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-scene-btn')) {
                const actId = e.target.dataset.actId;
                this.showAddSceneModal(actId);
            }
        });
        
        // Details panel close
        const closeDetails = document.getElementById('closeDetails');
        if (closeDetails) {
            closeDetails.addEventListener('click', () => this.closeDetailsPanel());
        }
        
        console.log('✅ Event listeners ready');
    },
    
    // ===================================
    // VIEW SWITCHING
    // ===================================
    
    switchView(viewName) {
        console.log(`🔄 Switching to ${viewName} view`);
        
        this.currentView = viewName;
        
        // Update active tab
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === viewName) {
                tab.classList.add('active');
            }
        });
        
        // Render appropriate view
        switch (viewName) {
            case 'beatsheet':
                this.renderBeatSheet();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'pacing':
                this.renderPacingGraph();
                break;
            case 'characters':
                this.renderCharacterView();
                break;
            case 'themes':
                this.renderThemeView();
                break;
            default:
                console.warn('Unknown view:', viewName);
        }
    },
    
    // ===================================
    // BEAT SHEET VIEW (Primary View)
    // ===================================
    
    renderBeatSheet() {
        console.log('📋 Rendering Beat Sheet...');
        
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Group scenes by act
        const scenesByAct = this.organizeScenesByAct();
        
        let html = '<div class="beat-sheet-container">';
        
        // Story structure summary
        html += this.renderStructureSummary();
        
        // Acts
        this.acts.forEach(act => {
            const actScenes = scenesByAct[act.id] || [];
            html += this.renderActSection(act, actScenes);
        });
        
        // Unassigned scenes
        const unassigned = scenesByAct['unassigned'] || [];
        if (unassigned.length > 0) {
            html += this.renderUnassignedSection(unassigned);
        }
        
        html += '</div>';
        
        canvas.innerHTML = html;
        
        // Attach scene card listeners
        this.attachSceneCardListeners();
    },
    
    renderStructureSummary() {
        const totalScenes = this.scenes.length;
        const totalWords = this.scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        const actsWithScenes = this.acts.filter(act => 
            this.scenes.some(scene => scene.actId === act.id)
        ).length;
        
        return `
            <div class="structure-summary">
                <h2>Story Architecture</h2>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-number">${totalScenes}</span>
                        <span class="stat-label">Total Scenes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${totalWords.toLocaleString()}</span>
                        <span class="stat-label">Total Words</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${this.acts.length}</span>
                        <span class="stat-label">Acts</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${this.chapters.length}</span>
                        <span class="stat-label">Chapters</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderActSection(act, scenes) {
        const actWords = scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        const chaptersInAct = this.chapters.filter(ch => ch.actId === act.id);
        
        return `
            <div class="act-section" data-act-id="${act.id}">
                <div class="act-header" style="border-left: 4px solid ${act.color}">
                    <div class="act-title-row">
                        <h3>${act.title}</h3>
                        <div class="act-stats">
                            <span class="act-scene-count">${scenes.length} scenes</span>
                            <span class="act-word-count">${actWords.toLocaleString()} words</span>
                        </div>
                    </div>
                    <p class="act-description">${act.description}</p>
                </div>
                
                <div class="act-scenes-container" data-act-id="${act.id}">
                    ${scenes.length === 0 ? 
                        `<div class="empty-act">
                            <p>No scenes in this act yet</p>
                            <button class="add-scene-btn" data-act-id="${act.id}">
                                + Add First Scene
                            </button>
                        </div>` :
                        scenes.map(scene => this.renderSceneCard(scene)).join('')
                    }
                </div>
                
                ${scenes.length > 0 ? 
                    `<button class="add-scene-btn" data-act-id="${act.id}">
                        + Add Scene to ${act.title}
                    </button>` : ''
                }
            </div>
        `;
    },
    
    renderSceneCard(scene) {
        const mckeeElement = scene.mckeeElement || 'unassigned';
        const author = scene.author || 'unknown';
        const authorBadge = author === 'tyrrel' ? '👤' : '🌟';
        
        return `
            <div class="scene-card" 
                 data-scene-id="${scene.id}"
                 draggable="true">
                <div class="scene-card-header">
                    <span class="scene-number">#${this.getSceneNumber(scene)}</span>
                    <span class="author-badge" title="${author}">${authorBadge}</span>
                    <span class="mckee-badge ${mckeeElement}">${this.getMckeeLabel(mckeeElement)}</span>
                </div>
                <h4 class="scene-title">${scene.title || 'Untitled Scene'}</h4>
                <div class="scene-card-meta">
                    <span class="scene-words">${(scene.wordCount || 0).toLocaleString()} words</span>
                    ${scene.beats ? `<span class="scene-beats">${scene.beats.length} beats</span>` : ''}
                </div>
                <div class="scene-card-actions">
                    <button class="scene-action-btn" data-action="edit" data-scene-id="${scene.id}" title="Edit in Desk">
                        ✏️
                    </button>
                    <button class="scene-action-btn" data-action="details" data-scene-id="${scene.id}" title="View Details">
                        ℹ️
                    </button>
                    <button class="scene-action-btn" data-action="delete" data-scene-id="${scene.id}" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    },
    
    renderUnassignedSection(scenes) {
        return `
            <div class="act-section unassigned-section">
                <div class="act-header">
                    <h3>📦 Unassigned Scenes</h3>
                    <p class="act-description">These scenes haven't been assigned to an act yet</p>
                </div>
                <div class="act-scenes-container" data-act-id="unassigned">
                    ${scenes.map(scene => this.renderSceneCard(scene)).join('')}
                </div>
            </div>
        `;
    },
    
    // ===================================
    // TIMELINE VIEW
    // ===================================
    
    renderTimeline() {
        console.log('⏱️ Rendering Timeline view...');
        
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div class="timeline-view">
                <h2>Story Timeline</h2>
                <p class="view-description">Chronological sequence of events</p>
                
                <div class="timeline-container">
                    ${this.scenes.length === 0 ? 
                        '<p class="empty-view">No scenes to display in timeline</p>' :
                        this.renderTimelineScenes()
                    }
                </div>
            </div>
        `;
    },
    
    renderTimelineScenes() {
        // Sort scenes by creation date or custom timeline order
        const sortedScenes = [...this.scenes].sort((a, b) => {
            if (a.timelineOrder && b.timelineOrder) {
                return a.timelineOrder - b.timelineOrder;
            }
            return new Date(a.created || a.lastModified) - new Date(b.created || b.lastModified);
        });
        
        return sortedScenes.map((scene, index) => `
            <div class="timeline-entry" data-scene-id="${scene.id}">
                <div class="timeline-marker">${index + 1}</div>
                <div class="timeline-content">
                    <h4>${scene.title || 'Untitled Scene'}</h4>
                    <p class="timeline-meta">
                        Act ${this.getActForScene(scene)?.number || '?'} • 
                        ${(scene.wordCount || 0).toLocaleString()} words
                    </p>
                </div>
            </div>
        `).join('');
    },
    
    // ===================================
    // PACING GRAPH VIEW
    // ===================================
    
    renderPacingGraph() {
        console.log('📊 Rendering Pacing Graph...');
        
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        if (this.scenes.length === 0) {
            canvas.innerHTML = `
                <div class="pacing-view">
                    <h2>Pacing Analysis</h2>
                    <p class="empty-view">No scenes available for pacing analysis</p>
                </div>
            `;
            return;
        }
        
        canvas.innerHTML = `
            <div class="pacing-view">
                <h2>Pacing Analysis</h2>
                <p class="view-description">Visualize word count and tension across your story</p>
                
                <div class="pacing-graph-container">
                    <svg id="pacingGraph" width="100%" height="400"></svg>
                </div>
                
                <div class="pacing-stats">
                    ${this.renderPacingStats()}
                </div>
            </div>
        `;
        
        // Draw the actual graph
        this.drawPacingGraph();
    },
    
    renderPacingStats() {
        const avgWords = Math.round(
            this.scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0) / this.scenes.length
        );
        
        const longest = this.scenes.reduce((max, s) => 
            (s.wordCount || 0) > max ? (s.wordCount || 0) : max, 0
        );
        
        const shortest = this.scenes.reduce((min, s) => 
            (s.wordCount || 0) < min || min === Infinity ? (s.wordCount || 0) : min, Infinity
        );
        
        return `
            <div class="stat-box">
                <span class="stat-value">${avgWords}</span>
                <span class="stat-label">Avg. Words/Scene</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${longest}</span>
                <span class="stat-label">Longest Scene</span>
            </div>
            <div class="stat-box">
                <span class="stat-value">${shortest === Infinity ? 0 : shortest}</span>
                <span class="stat-label">Shortest Scene</span>
            </div>
        `;
    },
    
    drawPacingGraph() {
        const svg = document.getElementById('pacingGraph');
        if (!svg) return;
        
        const width = svg.clientWidth;
        const height = 400;
        const padding = 40;
        
        // Clear existing content
        svg.innerHTML = '';
        
        // Prepare data
        const data = this.scenes.map((scene, index) => ({
            x: index,
            y: scene.wordCount || 0,
            title: scene.title
        }));
        
        if (data.length === 0) return;
        
        // Calculate scales
        const maxWords = Math.max(...data.map(d => d.y), 100);
        const scaleX = (width - 2 * padding) / Math.max(data.length - 1, 1);
        const scaleY = (height - 2 * padding) / maxWords;
        
        // Draw axes
        const axes = `
            <line x1="${padding}" y1="${height - padding}" 
                  x2="${width - padding}" y2="${height - padding}" 
                  stroke="#8B7355" stroke-width="2"/>
            <line x1="${padding}" y1="${padding}" 
                  x2="${padding}" y2="${height - padding}" 
                  stroke="#8B7355" stroke-width="2"/>
        `;
        svg.innerHTML += axes;
        
        // Draw line graph
        if (data.length > 1) {
            const points = data.map((d, i) => {
                const x = padding + i * scaleX;
                const y = height - padding - d.y * scaleY;
                return `${x},${y}`;
            }).join(' ');
            
            svg.innerHTML += `
                <polyline points="${points}" 
                          fill="none" 
                          stroke="#C9A961" 
                          stroke-width="3"/>
            `;
        }
        
        // Draw points
        data.forEach((d, i) => {
            const x = padding + i * scaleX;
            const y = height - padding - d.y * scaleY;
            
            svg.innerHTML += `
                <circle cx="${x}" cy="${y}" r="5" 
                        fill="#C9A961" 
                        stroke="#8B7355" 
                        stroke-width="2"
                        data-scene-index="${i}">
                    <title>${d.title}: ${d.y} words</title>
                </circle>
            `;
        });
        
        // Add axis labels
        svg.innerHTML += `
            <text x="${width / 2}" y="${height - 5}" 
                  text-anchor="middle" 
                  fill="#8B7355" 
                  font-size="12">Scene Progression</text>
            <text x="15" y="${height / 2}" 
                  text-anchor="middle" 
                  fill="#8B7355" 
                  font-size="12"
                  transform="rotate(-90, 15, ${height / 2})">Word Count</text>
        `;
    },
    
    // ===================================
    // CHARACTER VIEW
    // ===================================
    
    renderCharacterView() {
        console.log('👥 Rendering Character view...');
        
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div class="character-view">
                <h2>Character Tracker</h2>
                <p class="view-description">Track character appearances and development across acts</p>
                
                ${this.characters.length === 0 ? 
                    '<p class="empty-view">No characters defined yet. Create characters in The Desk.</p>' :
                    this.renderCharacterList()
                }
            </div>
        `;
    },
    
    renderCharacterList() {
        return `
            <div class="character-list">
                ${this.characters.map(char => this.renderCharacterCard(char)).join('')}
            </div>
        `;
    },
    
    renderCharacterCard(character) {
        const appearances = this.scenes.filter(scene => 
            scene.characters && scene.characters.includes(character.id)
        ).length;
        
        return `
            <div class="character-card" data-character-id="${character.id}">
                <h3>${character.name}</h3>
                <p class="character-role">${character.role || 'Character'}</p>
                <div class="character-stats">
                    <span>${appearances} scene${appearances !== 1 ? 's' : ''}</span>
                </div>
                <button class="character-detail-btn" data-character-id="${character.id}">
                    View Arc
                </button>
            </div>
        `;
    },
    
    // ===================================
    // THEME VIEW
    // ===================================
    
    renderThemeView() {
        console.log('🎨 Rendering Theme view...');
        
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div class="theme-view">
                <h2>Theme Distribution</h2>
                <p class="view-description">See how themes are woven throughout your narrative</p>
                
                ${this.themes.length === 0 ? 
                    '<p class="empty-view">No themes defined yet. Define themes in The Desk.</p>' :
                    this.renderThemeDistribution()
                }
            </div>
        `;
    },
    
    renderThemeDistribution() {
        return `
            <div class="theme-distribution">
                ${this.themes.map(theme => this.renderThemeCard(theme)).join('')}
            </div>
        `;
    },
    
    renderThemeCard(theme) {
        const themeScenes = this.scenes.filter(scene => 
            scene.themes && scene.themes.includes(theme.id)
        );
        
        const actDistribution = this.acts.map(act => {
            const count = themeScenes.filter(s => s.actId === act.id).length;
            return { act, count };
        });
        
        return `
            <div class="theme-card" data-theme-id="${theme.id}">
                <div class="theme-header">
                    <h3>${theme.name}</h3>
                    <span class="theme-count">${themeScenes.length} scenes</span>
                </div>
                <div class="theme-distribution-bars">
                    ${actDistribution.map(({ act, count }) => `
                        <div class="distribution-bar">
                            <span class="bar-label">${act.title}</span>
                            <div class="bar-container">
                                <div class="bar-fill" 
                                     style="width: ${(count / Math.max(themeScenes.length, 1) * 100)}%; 
                                            background: ${act.color}"></div>
                            </div>
                            <span class="bar-value">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // ===================================
    // DRAG AND DROP
    // ===================================
    
    initializeDragAndDrop() {
        console.log('🎯 Initializing drag-and-drop...');
        
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('scene-card')) {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('scene-card')) {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
            }
        });
        
        document.addEventListener('dragover', (e) => {
            if (this.draggedElement && e.target.closest('.act-scenes-container')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });
        
        document.addEventListener('drop', (e) => {
            if (this.draggedElement && e.target.closest('.act-scenes-container')) {
                e.preventDefault();
                const container = e.target.closest('.act-scenes-container');
                const newActId = container.dataset.actId;
                const sceneId = this.draggedElement.dataset.sceneId;
                
                this.moveSceneToAct(sceneId, newActId);
            }
        });
    },
    
    moveSceneToAct(sceneId, newActId) {
        console.log(`Moving scene ${sceneId} to act ${newActId}`);
        
        const sceneIndex = this.scenes.findIndex(s => s.id === sceneId);
        if (sceneIndex === -1) return;
        
        // Update scene's act
        this.scenes[sceneIndex].actId = newActId === 'unassigned' ? null : newActId;
        
        // Save to localStorage
        this.saveScenes();
        
        // Re-render beat sheet
        this.renderBeatSheet();
        
        console.log('✅ Scene moved successfully');
    },
    
    // ===================================
    // SCENE CARD INTERACTIONS
    // ===================================
    
    attachSceneCardListeners() {
        // Scene action buttons
        document.querySelectorAll('.scene-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const sceneId = btn.dataset.sceneId;
                
                switch (action) {
                    case 'edit':
                        this.editSceneInDesk(sceneId);
                        break;
                    case 'details':
                        this.showSceneDetails(sceneId);
                        break;
                    case 'delete':
                        this.deleteScene(sceneId);
                        break;
                }
            });
        });
        
        // Scene card click (select)
        document.querySelectorAll('.scene-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('scene-action-btn')) {
                    this.selectScene(card.dataset.sceneId);
                }
            });
        });
    },
    
    editSceneInDesk(sceneId) {
        console.log(`Opening scene ${sceneId} in The Desk`);
        
        // Switch to desk workspace
        if (window.switchSpace) {
            window.switchSpace('desk');
            
            // Load the specific scene in desk
            setTimeout(() => {
                if (window.ChronicleDesk && window.ChronicleDesk.loadSceneById) {
                    window.ChronicleDesk.loadSceneById(sceneId);
                }
            }, 300);
        }
    },
    
    showSceneDetails(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) return;
        
        const panel = document.getElementById('covenant-details');
        const content = document.getElementById('detailsContent');
        if (!panel || !content) return;
        
        const act = this.getActForScene(scene);
        const chapter = this.chapters.find(ch => ch.id === scene.chapterId);
        
        content.innerHTML = `
            <div class="scene-details">
                <h3>${scene.title || 'Untitled Scene'}</h3>
                
                <div class="detail-group">
                    <label>Act</label>
                    <p>${act ? act.title : 'Unassigned'}</p>
                </div>
                
                ${chapter ? `
                    <div class="detail-group">
                        <label>Chapter</label>
                        <p>${chapter.title}</p>
                    </div>
                ` : ''}
                
                <div class="detail-group">
                    <label>Word Count</label>
                    <p>${(scene.wordCount || 0).toLocaleString()} words</p>
                </div>
                
                <div class="detail-group">
                    <label>McKee Element</label>
                    <p>${this.getMckeeLabel(scene.mckeeElement || 'unassigned')}</p>
                </div>
                
                <div class="detail-group">
                    <label>Author</label>
                    <p>${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</p>
                </div>
                
                <div class="detail-group">
                    <label>Last Modified</label>
                    <p>${new Date(scene.lastModified).toLocaleDateString()}</p>
                </div>
                
                ${scene.beats && scene.beats.length > 0 ? `
                    <div class="detail-group">
                        <label>Beats</label>
                        <ul class="beat-list">
                            ${scene.beats.map(beat => `<li>${beat.description || beat.text}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="detail-action-btn" onclick="ChronicleCovenant.editSceneInDesk('${scene.id}')">
                        Edit in Desk
                    </button>
                </div>
            </div>
        `;
        
        panel.classList.add('active');
    },
    
    closeDetailsPanel() {
        const panel = document.getElementById('covenant-details');
        if (panel) panel.classList.remove('active');
    },
    
    selectScene(sceneId) {
        // Remove previous selection
        document.querySelectorAll('.scene-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const card = document.querySelector(`[data-scene-id="${sceneId}"]`);
        if (card) {
            card.classList.add('selected');
        }
        
        this.selectedScene = sceneId;
    },
    
    deleteScene(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) return;
        
        if (confirm(`Delete "${scene.title || 'Untitled Scene'}"?\n\nThis cannot be undone.`)) {
            this.scenes = this.scenes.filter(s => s.id !== sceneId);
            this.saveScenes();
            this.renderBeatSheet();
            console.log(`✅ Scene ${sceneId} deleted`);
        }
    },
    
    // ===================================
    // HELPER FUNCTIONS
    // ===================================
    
    organizeScenesByAct() {
        const organized = { unassigned: [] };
        
        this.acts.forEach(act => {
            organized[act.id] = [];
        });
        
        this.scenes.forEach(scene => {
            if (scene.actId && organized[scene.actId]) {
                organized[scene.actId].push(scene);
            } else {
                organized.unassigned.push(scene);
            }
        });
        
        return organized;
    },
    
    getActForScene(scene) {
        return this.acts.find(act => act.id === scene.actId);
    },
    
    getSceneNumber(scene) {
        const index = this.scenes.findIndex(s => s.id === scene.id);
        return index + 1;
    },
    
    getMckeeLabel(element) {
        const labels = {
            'opening': 'Opening',
            'inciting': 'Inciting Incident',
            'progressive': 'Progressive Complication',
            'crisis': 'Crisis',
            'climax': 'Climax',
            'resolution': 'Resolution',
            'unassigned': 'Unassigned'
        };
        return labels[element] || element;
    },
    
    // ===================================
    // MODAL DIALOGS
    // ===================================
    
    showAddActModal() {
        alert('Add Act functionality coming in next sprint');
    },
    
    showAddSceneModal(actId) {
        alert(`Add Scene to Act ${actId} - coming in next sprint`);
    },
    
    showError(message) {
        alert(`Error: ${message}`);
    },
    
    // ===================================
    // DATA PERSISTENCE
    // ===================================
    
    saveScenes() {
        localStorage.setItem('chronicle_scenes', JSON.stringify(this.scenes));
        console.log('💾 Scenes saved');
    },
    
    saveActs() {
        localStorage.setItem('chronicle_acts', JSON.stringify(this.acts));
        console.log('💾 Acts saved');
    },
    
    saveChapters() {
        localStorage.setItem('chronicle_chapters', JSON.stringify(this.chapters));
        console.log('💾 Chapters saved');
    }
};

// ===================================
// GLOBAL EXPORT
// ===================================

window.ChronicleCovenant = ChronicleCovenant;

console.log('%c📜 Covenant Module Loaded', 'color: #C9A961; font-weight: bold;');
console.log('%c"Unless the LORD builds the house, the builders labor in vain"', 'color: #8B7355; font-style: italic;');
