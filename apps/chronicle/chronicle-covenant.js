// ===================================
// THE COVENANT - JavaScript Module
// "Unless the LORD builds the house, the builders labor in vain" - Psalm 127:1
// Architectural Sanctuary for Story Structure
// ===================================

const ChronicleCovenantWorkspace = {
    currentView: 'beat-sheet',
    selectedScene: null,
    acts: [],
    chapters: [],
    
    // Initialize the Covenant workspace
    init() {
        console.log('📐 Covenant Workspace initializing...');
        
        // Load structure data
        this.loadStructureData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        this.renderBeatSheet();
        
        console.log('✅ Covenant Workspace ready');
    },
    
    // Load Acts and Chapters structure from localStorage
    loadStructureData() {
        // Load Acts
        const savedActs = localStorage.getItem('chronicle_acts');
        if (savedActs) {
            try {
                this.acts = JSON.parse(savedActs);
            } catch (e) {
                console.error('Failed to load acts:', e);
                this.acts = this.createDefaultActs();
            }
        } else {
            this.acts = this.createDefaultActs();
            this.saveActs();
        }
        
        // Load Chapters
        const savedChapters = localStorage.getItem('chronicle_chapters');
        if (savedChapters) {
            try {
                this.chapters = JSON.parse(savedChapters);
            } catch (e) {
                console.error('Failed to load chapters:', e);
                this.chapters = [];
            }
        }
    },
    
    // Create default three-act structure
    createDefaultActs() {
        return [
            {
                id: 'act-1',
                number: 1,
                title: 'Act I: Setup',
                description: 'The ordinary world and inciting incident',
                color: '#1976d2'
            },
            {
                id: 'act-2',
                number: 2,
                title: 'Act II: Confrontation',
                description: 'Progressive complications and midpoint reversal',
                color: '#388e3c'
            },
            {
                id: 'act-3',
                number: 3,
                title: 'Act III: Resolution',
                description: 'Crisis, climax, and denouement',
                color: '#d32f2f'
            }
        ];
    },
    
    // Save Acts to localStorage
    saveActs() {
        localStorage.setItem('chronicle_acts', JSON.stringify(this.acts));
    },
    
    // Save Chapters to localStorage
    saveChapters() {
        localStorage.setItem('chronicle_chapters', JSON.stringify(this.chapters));
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // View tab switching
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
            });
        });
        
        // Close details panel
        const closeBtn = document.getElementById('closeDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDetails();
            });
        }
        
        // Navigation items
        document.querySelectorAll('.covenant-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleNavAction(action);
            });
        });
    },
    
    // Switch between different views
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update active tab
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-view="${viewName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Render appropriate view
        switch(viewName) {
            case 'beat-sheet':
                this.renderBeatSheet();
                break;
            case 'structure':
                this.renderStructureAnalysis();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'pacing':
                this.renderPacing();
                break;
        }
    },
    
    // Handle sidebar navigation actions
    handleNavAction(action) {
        // Mark navigation item as active
        document.querySelectorAll('.covenant-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-action="${action}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Handle the action
        switch(action) {
            case 'all-scenes':
                this.renderBeatSheet();
                break;
            case 'act-1':
                this.renderActView(1);
                break;
            case 'act-2':
                this.renderActView(2);
                break;
            case 'act-3':
                this.renderActView(3);
                break;
            case 'uncategorized':
                this.renderUncategorizedScenes();
                break;
        }
    },
    
    // ===================================
    // BEAT SHEET VIEW
    // ===================================
    
    renderBeatSheet() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Get all scenes from ChronicleDesk
        const scenes = window.ChronicleDesk ? window.ChronicleDesk.scenes : [];
        
        // Run structure validation
        const warnings = this.validateStructure(scenes);
        
        let html = '';
        
        // Show validation warnings if any
        if (warnings.length > 0) {
            html += this.renderValidationWarnings(warnings);
        }
        
        // Beat sheet container
        html += '<div class="beat-sheet">';
        
        // Render each act
        this.acts.forEach(act => {
            html += this.renderAct(act, scenes);
        });
        
        html += '</div>';
        
        // Render uncategorized scenes
        const uncategorized = scenes.filter(s => !s.actId);
        if (uncategorized.length > 0) {
            html += this.renderUncategorizedContainer(uncategorized);
        }
        
        canvas.innerHTML = html;
        
        // Setup drag-and-drop after rendering
        this.setupDragAndDrop();
        
        // Setup scene card clicks
        this.setupSceneCardClicks();
    },
    
    // Render validation warnings
    renderValidationWarnings(warnings) {
        if (warnings.length === 0) return '';
        
        let html = `
        <div class="validation-warnings">
            <h3 class="validation-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Structure Observations
            </h3>
            <ul class="validation-list">
        `;
        
        warnings.forEach(warning => {
            html += `<li class="validation-item">${warning}</li>`;
        });
        
        html += `
            </ul>
        </div>
        `;
        
        return html;
    },
    
    // Render a single act
    renderAct(act, scenes) {
        const actScenes = scenes.filter(s => s.actId === act.id);
        const totalWords = actScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        
        let html = `
        <div class="act-container" data-act-id="${act.id}">
            <div class="act-header">
                <div>
                    <h2 class="act-title">${act.title}</h2>
                    <p class="act-meta">${actScenes.length} scenes • ${totalWords.toLocaleString()} words</p>
                </div>
                <div class="act-controls">
                    <button class="act-btn" onclick="ChronicleCovenantWorkspace.addChapterToAct('${act.id}')">+ Chapter</button>
                </div>
            </div>
        `;
        
        // Get chapters for this act
        const actChapters = this.chapters.filter(c => c.actId === act.id);
        
        if (actChapters.length > 0) {
            // Render chapters
            actChapters.forEach(chapter => {
                html += this.renderChapter(chapter, scenes);
            });
        }
        
        // Render unchaptered scenes in this act
        const unchapteredScenes = actScenes.filter(s => !s.chapterId);
        if (unchapteredScenes.length > 0) {
            html += `
            <div class="chapter-container">
                <div class="chapter-header">
                    <h3 class="chapter-title">Unchaptered Scenes</h3>
                    <span class="chapter-meta">${unchapteredScenes.length} scenes</span>
                </div>
                <div class="scenes-grid">
            `;
            
            unchapteredScenes.forEach(scene => {
                html += this.renderSceneCard(scene);
            });
            
            html += `
                </div>
            </div>
            `;
        }
        
        html += '</div>';
        
        return html;
    },
    
    // Render a single chapter
    renderChapter(chapter, scenes) {
        const chapterScenes = scenes.filter(s => s.chapterId === chapter.id);
        const totalWords = chapterScenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        
        let html = `
        <div class="chapter-container" data-chapter-id="${chapter.id}">
            <div class="chapter-header">
                <h3 class="chapter-title">${chapter.title}</h3>
                <span class="chapter-meta">${chapterScenes.length} scenes • ${totalWords.toLocaleString()} words</span>
            </div>
            <div class="scenes-grid">
        `;
        
        chapterScenes.forEach(scene => {
            html += this.renderSceneCard(scene);
        });
        
        html += `
            </div>
        </div>
        `;
        
        return html;
    },
    
    // Render a single scene card
    renderSceneCard(scene) {
        const structureElement = scene.mckeeData?.structureElement || '';
        const structureBadge = structureElement ? 
            `<span class="scene-structure-badge badge-${structureElement}">
                ${this.getStructureLabel(structureElement)}
            </span>` : '';
        
        const wordCount = scene.wordCount || 0;
        const authorClass = scene.author === 'tyrrel' ? 'author-tyrrel' : 'author-trevor';
        const authorName = scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor';
        
        return `
        <div class="scene-card" 
             data-scene-id="${scene.id}"
             draggable="true">
            <div class="scene-card-header">
                <h4 class="scene-title-text">${scene.title || 'Untitled Scene'}</h4>
                ${structureBadge}
            </div>
            <div class="scene-card-meta">
                <span class="scene-word-count">${wordCount} words</span>
                <span class="scene-author-badge ${authorClass}">${authorName}</span>
            </div>
        </div>
        `;
    },
    
    // Render uncategorized scenes container
    renderUncategorizedContainer(scenes) {
        let html = `
        <div class="uncategorized-container">
            <div class="uncategorized-header">
                <svg class="uncategorized-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h3 class="uncategorized-title">Uncategorized Scenes</h3>
            </div>
            <div class="scenes-grid">
        `;
        
        scenes.forEach(scene => {
            html += this.renderSceneCard(scene);
        });
        
        html += `
            </div>
        </div>
        `;
        
        return html;
    },
    
    // Get human-readable label for structure element
    getStructureLabel(element) {
        const labels = {
            'opening': 'Opening',
            'inciting': 'Inciting',
            'lockin': 'Lock-In',
            'complications': 'Complications',
            'midpoint': 'Midpoint',
            'crisis': 'Crisis',
            'climax': 'Climax',
            'resolution': 'Resolution',
            'closing': 'Closing'
        };
        return labels[element] || element;
    },
    
    // ===================================
    // STRUCTURE VALIDATION
    // ===================================
    
    validateStructure(scenes) {
        const warnings = [];
        
        // Check for essential McKee elements
        const hasOpening = scenes.some(s => s.mckeeData?.structureElement === 'opening');
        const hasInciting = scenes.some(s => s.mckeeData?.structureElement === 'inciting');
        const hasLockIn = scenes.some(s => s.mckeeData?.structureElement === 'lockin');
        const hasMidpoint = scenes.some(s => s.mckeeData?.structureElement === 'midpoint');
        const hasCrisis = scenes.some(s => s.mckeeData?.structureElement === 'crisis');
        const hasClimax = scenes.some(s => s.mckeeData?.structureElement === 'climax');
        const hasResolution = scenes.some(s => s.mckeeData?.structureElement === 'resolution');
        
        if (!hasOpening) warnings.push('No Opening Image scene assigned');
        if (!hasInciting) warnings.push('No Inciting Incident scene assigned');
        if (!hasLockIn) warnings.push('No Lock-In / First Act Climax scene assigned');
        if (!hasMidpoint) warnings.push('No Midpoint Reversal scene assigned');
        if (!hasCrisis) warnings.push('No Crisis / Dark Night scene assigned');
        if (!hasClimax) warnings.push('No Climax scene assigned');
        if (!hasResolution) warnings.push('No Resolution scene assigned');
        
        // Check for multiple instances of unique elements
        const climaxScenes = scenes.filter(s => s.mckeeData?.structureElement === 'climax');
        if (climaxScenes.length > 1) {
            warnings.push(`Multiple climax scenes detected (${climaxScenes.length})`);
        }
        
        // Check act distribution
        const act1Scenes = scenes.filter(s => s.actId === 'act-1');
        const act2Scenes = scenes.filter(s => s.actId === 'act-2');
        const act3Scenes = scenes.filter(s => s.actId === 'act-3');
        
        if (act2Scenes.length < act1Scenes.length) {
            warnings.push('Act II appears shorter than Act I (typically should be longer)');
        }
        
        if (act2Scenes.length < act3Scenes.length * 1.5) {
            warnings.push('Act II may be too short relative to Act III');
        }
        
        // Check for uncategorized scenes
        const uncategorized = scenes.filter(s => !s.actId);
        if (uncategorized.length > 0) {
            warnings.push(`${uncategorized.length} scene(s) not assigned to any act`);
        }
        
        return warnings;
    },
    
    // ===================================
    // DRAG AND DROP
    // ===================================
    
    setupDragAndDrop() {
        const sceneCards = document.querySelectorAll('.scene-card');
        
        sceneCards.forEach(card => {
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
        
        // Setup drop zones
        const dropZones = document.querySelectorAll('.scenes-grid, .act-container, .chapter-container');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    },
    
    handleDragStart(e) {
        const sceneId = e.currentTarget.getAttribute('data-scene-id');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', sceneId);
        e.currentTarget.classList.add('dragging');
    },
    
    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    },
    
    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    },
    
    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        
        const sceneId = e.dataTransfer.getData('text/html');
        
        // Determine drop target
        const dropTarget = e.currentTarget;
        let newActId = null;
        let newChapterId = null;
        
        // Check if dropped in an act container
        const actContainer = dropTarget.closest('.act-container');
        if (actContainer) {
            newActId = actContainer.getAttribute('data-act-id');
        }
        
        // Check if dropped in a chapter container
        const chapterContainer = dropTarget.closest('.chapter-container');
        if (chapterContainer) {
            newChapterId = chapterContainer.getAttribute('data-chapter-id');
        }
        
        // Update the scene
        this.moveScene(sceneId, newActId, newChapterId);
        
        return false;
    },
    
    moveScene(sceneId, newActId, newChapterId) {
        if (!window.ChronicleDesk) return;
        
        const sceneIndex = window.ChronicleDesk.scenes.findIndex(s => s.id === sceneId);
        if (sceneIndex === -1) return;
        
        // Update scene's act and chapter
        if (newActId !== null) {
            window.ChronicleDesk.scenes[sceneIndex].actId = newActId;
        }
        if (newChapterId !== null) {
            window.ChronicleDesk.scenes[sceneIndex].chapterId = newChapterId;
        }
        
        // Save changes
        window.ChronicleDesk.saveScenes();
        
        // Re-render beat sheet
        this.renderBeatSheet();
        
        console.log(`📐 Scene moved: ${sceneId} → Act: ${newActId}, Chapter: ${newChapterId}`);
    },
    
    // ===================================
    // SCENE DETAILS PANEL
    // ===================================
    
    setupSceneCardClicks() {
        const sceneCards = document.querySelectorAll('.scene-card');
        sceneCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if dragging
                if (card.classList.contains('dragging')) return;
                
                const sceneId = card.getAttribute('data-scene-id');
                this.showSceneDetails(sceneId);
            });
        });
    },
    
    showSceneDetails(sceneId) {
        if (!window.ChronicleDesk) return;
        
        const scene = window.ChronicleDesk.scenes.find(s => s.id === sceneId);
        if (!scene) return;
        
        this.selectedScene = sceneId;
        
        const detailsPanel = document.getElementById('covenant-details');
        const detailsContent = document.getElementById('detailsContent');
        
        if (!detailsPanel || !detailsContent) return;
        
        // Build details HTML
        let html = `
        <div class="detail-section">
            <h4>Scene Title</h4>
            <p class="detail-text">${scene.title || 'Untitled Scene'}</p>
        </div>
        
        <div class="detail-section">
            <h4>Word Count</h4>
            <p class="detail-text">${(scene.wordCount || 0).toLocaleString()} words</p>
        </div>
        
        <div class="detail-section">
            <h4>Author</h4>
            <p class="detail-text">${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</p>
        </div>
        `;
        
        if (scene.mckeeData) {
            if (scene.mckeeData.structureElement) {
                html += `
                <div class="detail-section">
                    <h4>Structure Element</h4>
                    <p class="detail-text">${this.getStructureLabel(scene.mckeeData.structureElement)}</p>
                </div>
                `;
            }
            
            if (scene.mckeeData.purpose) {
                html += `
                <div class="detail-section">
                    <h4>Scene Purpose</h4>
                    <p class="detail-text">${scene.mckeeData.purpose}</p>
                </div>
                `;
            }
            
            if (scene.mckeeData.forces && scene.mckeeData.forces.length > 0) {
                html += `
                <div class="detail-section">
                    <h4>Forces of Antagonism</h4>
                    <p class="detail-text">${scene.mckeeData.forces.map(f => this.getForceLabel(f)).join(', ')}</p>
                </div>
                `;
            }
        }
        
        html += `
        <div class="detail-section">
            <h4>Last Modified</h4>
            <p class="detail-text">${new Date(scene.lastModified).toLocaleDateString()}</p>
        </div>
        
        <div class="detail-section" style="margin-top: 2rem;">
            <button class="act-btn" onclick="ChronicleCovenantWorkspace.openInDesk('${sceneId}')" 
                    style="width: 100%; padding: 0.75rem;">
                Open in The Desk
            </button>
        </div>
        `;
        
        detailsContent.innerHTML = html;
        detailsPanel.classList.add('visible');
    },
    
    hideDetails() {
        const detailsPanel = document.getElementById('covenant-details');
        if (detailsPanel) {
            detailsPanel.classList.remove('visible');
        }
        this.selectedScene = null;
    },
    
    openInDesk(sceneId) {
        // Switch to The Desk workspace
        const deskTab = document.querySelector('[data-space="desk"]');
        if (deskTab) {
            deskTab.click();
        }
        
        // Load the scene in The Desk
        if (window.ChronicleDesk) {
            window.ChronicleDesk.loadScene(sceneId);
        }
    },
    
    getForceLabel(force) {
        const labels = {
            'internal': 'Internal',
            'personal': 'Personal',
            'extrapersonal': 'Extra-Personal',
            'environmental': 'Environmental'
        };
        return labels[force] || force;
    },
    
    // ===================================
    // STRUCTURE ANALYSIS VIEW
    // ===================================
    
    renderStructureAnalysis() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        const scenes = window.ChronicleDesk ? window.ChronicleDesk.scenes : [];
        const analysis = window.McKeeSystem ? window.McKeeSystem.analyzeStoryStructure() : null;
        
        if (!analysis) {
            canvas.innerHTML = '<div class="covenant-loading"><p>Structure analysis unavailable</p></div>';
            return;
        }
        
        let html = '<div class="structure-analysis">';
        html += '<h2 style="font-family: Cinzel, serif; color: #C9A961; margin-bottom: 2rem;">Story Structure Analysis</h2>';
        
        // Overview stats
        html += `
        <div class="detail-section">
            <h4>Overview</h4>
            <p class="detail-text">Total Scenes: ${analysis.total}</p>
            <p class="detail-text">Scenes with Structure Assignment: ${analysis.total - analysis.missing.length}</p>
            <p class="detail-text">Unassigned: ${analysis.missing.length}</p>
        </div>
        `;
        
        // Structure elements breakdown
        html += '<div class="detail-section"><h4>McKee Structure Elements</h4><ul class="validation-list">';
        Object.keys(analysis.byElement).forEach(key => {
            const element = analysis.byElement[key];
            html += `<li class="validation-item" style="border: none;">${this.getStructureLabel(key)}: ${element.count} scene(s)</li>`;
        });
        html += '</ul></div>';
        
        html += '</div>';
        
        canvas.innerHTML = html;
    },
    
    // ===================================
    // PLACEHOLDER VIEWS (Future Sprints)
    // ===================================
    
    renderTimeline() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        canvas.innerHTML = `
        <div class="covenant-loading">
            <p>✨ Timeline view coming in Sprint 2...</p>
            <p style="margin-top: 1rem; opacity: 0.7; font-size: 0.9rem;">"The crucible for silver and the furnace for gold"</p>
        </div>
        `;
    },
    
    renderPacing() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        canvas.innerHTML = `
        <div class="covenant-loading">
            <p>✨ Pacing analysis coming in Sprint 2...</p>
            <p style="margin-top: 1rem; opacity: 0.7; font-size: 0.9rem;">"The crucible for silver and the furnace for gold"</p>
        </div>
        `;
    },
    
    // ===================================
    // ACT & CHAPTER MANAGEMENT
    // ===================================
    
    addChapterToAct(actId) {
        const chapterTitle = prompt('Enter chapter title:');
        if (!chapterTitle) return;
        
        const newChapter = {
            id: `chapter-${Date.now()}`,
            actId: actId,
            title: chapterTitle,
            order: this.chapters.filter(c => c.actId === actId).length + 1
        };
        
        this.chapters.push(newChapter);
        this.saveChapters();
        this.renderBeatSheet();
        
        console.log('📐 Chapter created:', newChapter);
    },
    
    renderActView(actNumber) {
        const act = this.acts.find(a => a.number === actNumber);
        if (!act) return;
        
        // For now, just render the beat sheet filtered to this act
        // In future, could show act-specific analysis
        this.renderBeatSheet();
    },
    
    renderUncategorizedScenes() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        const scenes = window.ChronicleDesk ? window.ChronicleDesk.scenes : [];
        const uncategorized = scenes.filter(s => !s.actId);
        
        let html = '<h2 style="font-family: Cinzel, serif; color: #C9A961; margin-bottom: 2rem;">Uncategorized Scenes</h2>';
        
        if (uncategorized.length === 0) {
            html += '<div class="covenant-loading"><p>All scenes have been assigned to acts! ✨</p></div>';
        } else {
            html += '<div class="scenes-grid">';
            uncategorized.forEach(scene => {
                html += this.renderSceneCard(scene);
            });
            html += '</div>';
        }
        
        canvas.innerHTML = html;
        
        // Re-setup interactions
        this.setupDragAndDrop();
        this.setupSceneCardClicks();
    }
};

// Make globally available
window.ChronicleCovenantWorkspace = ChronicleCovenantWorkspace;

// Initialize when workspace becomes active
document.addEventListener('DOMContentLoaded', () => {
    // Listen for workspace switches
    const covenantTab = document.querySelector('[data-space="covenant"]');
    if (covenantTab) {
        covenantTab.addEventListener('click', () => {
            // Small delay to ensure workspace is visible
            setTimeout(() => {
                ChronicleCovenantWorkspace.init();
            }, 100);
        });
    }
});

console.log('📐 Covenant Workspace module loaded');
