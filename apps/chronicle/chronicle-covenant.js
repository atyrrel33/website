// ═══════════════════════════════════════════════════════════════════════════
// THE COVENANT - Story Structure & McKee Analysis
// "Write the vision; make it plain on tablets" - Habakkuk 2:2
// ═══════════════════════════════════════════════════════════════════════════
//
// Sprint 1: Integrated with ChronicleData for beat-aware structural analysis
// - Beat Sheet view (shows all beats across all scenes)
// - Structure Analysis (Act distribution, McKee coverage, warnings)
// - Real-time cross-workspace synchronization
// - McKee element validation and warnings
//
// @version 2.0.0 (Sprint 1)
// @date December 16, 2024
// @authors Tyrrel & Trevor
//
// ═══════════════════════════════════════════════════════════════════════════

const ChronicleCovenantWorkspace = {
    // ═══════════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    currentView: 'beat-sheet',      // 'beat-sheet', 'structure', or 'pacing'
    selectedSceneId: null,           // Currently selected scene for details
    initialized: false,
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    init() {
        if (this.initialized) return;
        
        console.log('🛡️ The Covenant awakens...');
        
        // Register listener for ChronicleData changes
        ChronicleData.addListener((event, data) => {
            this.handleDataChange(event, data);
        });
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        this.renderCurrentView();
        
        this.initialized = true;
        console.log('✅ The Covenant stands ready for analysis');
    },
    
    /**
     * Handle data changes from ChronicleData
     */
    handleDataChange(event, data) {
        console.log('🛡️ Covenant: Data change detected:', event);
        
        switch(event) {
            case 'sceneCreated':
            case 'sceneUpdated':
            case 'sceneDeleted':
            case 'beatCreated':
            case 'beatUpdated':
            case 'beatDeleted':
                // Refresh current view when story data changes
                this.renderCurrentView();
                break;
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════
    
    setupEventListeners() {
        console.log('🎯 Setting up Covenant event listeners...');
        
        // View switching buttons
        const viewBtns = document.querySelectorAll('.covenant-view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                if (view) {
                    this.switchView(view);
                }
            });
        });
        
        // Close details panel
        const closeBtn = document.getElementById('closeCovenantDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDetails();
            });
        }
        
        console.log('✅ Covenant event listeners configured');
    },
    
    /**
     * Switch between different views
     */
    switchView(viewName) {
        console.log('📊 Switching to view:', viewName);
        this.currentView = viewName;
        
        // Update active button
        document.querySelectorAll('.covenant-view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Render appropriate view
        this.renderCurrentView();
    },
    
    /**
     * Render the current view
     */
    renderCurrentView() {
        switch(this.currentView) {
            case 'beat-sheet':
                this.renderBeatSheet();
                break;
            case 'structure':
                this.renderStructureAnalysis();
                break;
            case 'pacing':
                this.renderPacingGraph();
                break;
            default:
                this.renderBeatSheet();
        }
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // BEAT SHEET VIEW
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Render beat sheet - visual cards of ALL beats across ALL scenes
     */
    renderBeatSheet() {
        console.log('📋 Rendering Beat Sheet...');
        
        const canvas = document.getElementById('covenantCanvas');
        if (!canvas) return;
        
        canvas.innerHTML = '';
        
        // Get all scenes
        const scenes = ChronicleData.scenes;
        
        if (scenes.length === 0) {
            this.renderEmptyState(canvas, 'No scenes yet', 'Create scenes in The Desk to see your story structure');
            return;
        }
        
        // Create beat grid container
        const beatGrid = document.createElement('div');
        beatGrid.className = 'beat-sheet-grid';
        
        // Group beats by act for visual organization
        ChronicleData.acts.forEach(act => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            if (actScenes.length > 0) {
                // Act header
                const actHeader = this.createActHeader(act, actScenes);
                beatGrid.appendChild(actHeader);
                
                // Beats within this act's scenes
                actScenes.forEach(scene => {
                    const beats = ChronicleData.getBeatsForScene(scene.id);
                    
                    beats.forEach((beat, index) => {
                        const beatCard = this.createBeatCard(beat, scene, index);
                        beatGrid.appendChild(beatCard);
                    });
                });
            }
        });
        
        // Show orphaned beats (not in any scene)
        const orphanedBeats = ChronicleData.getOrphanedBeats();
        if (orphanedBeats.length > 0) {
            const orphanSection = this.createOrphanedBeatsSection(orphanedBeats);
            beatGrid.appendChild(orphanSection);
        }
        
        canvas.appendChild(beatGrid);
        
        console.log('✅ Beat Sheet rendered with', this.getTotalBeatsCount(), 'beats');
    },
    
    /**
     * Create act header for beat sheet
     */
    createActHeader(act, scenes) {
        const header = document.createElement('div');
        header.className = 'beat-sheet-act-header';
        header.dataset.actId = act.id;
        
        // Calculate stats
        const totalBeats = scenes.reduce((sum, scene) => {
            return sum + ChronicleData.getBeatsForScene(scene.id).length;
        }, 0);
        
        const totalWords = scenes.reduce((sum, scene) => {
            const beats = ChronicleData.getBeatsForScene(scene.id);
            return sum + beats.reduce((beatSum, beat) => {
                const text = beat.content.replace(/<[^>]*>/g, '');
                return beatSum + text.split(/\s+/).filter(w => w.length > 0).length;
            }, 0);
        }, 0);
        
        header.innerHTML = `
            <div class="act-header-title">
                <span class="act-number">Act ${act.number}</span>
                <span class="act-name">${act.title}</span>
            </div>
            <div class="act-header-stats">
                <span>${scenes.length} ${scenes.length === 1 ? 'scene' : 'scenes'}</span>
                <span>•</span>
                <span>${totalBeats} ${totalBeats === 1 ? 'beat' : 'beats'}</span>
                <span>•</span>
                <span>${totalWords.toLocaleString()} words</span>
            </div>
        `;
        
        header.style.borderLeftColor = act.color || '#C9A961';
        
        return header;
    },
    
    /**
     * Create beat card for display
     */
    createBeatCard(beat, scene, beatIndex) {
        const card = document.createElement('div');
        card.className = 'beat-card';
        card.dataset.beatId = beat.id;
        card.dataset.sceneId = scene.id;
        
        // Get preview text
        const preview = this.getPreviewText(beat.content, 120);
        
        // Get character names
        const characterNames = this.getCharacterNames(scene.characters);
        
        // Word count
        const wordCount = this.getWordCount(beat.content);
        
        // Format date
        const date = new Date(beat.created);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        card.innerHTML = `
            <div class="beat-card-header">
                <div class="beat-card-title">
                    <span class="scene-title">${scene.title}</span>
                    <span class="beat-number">Beat ${beatIndex + 1}</span>
                </div>
                <div class="beat-author-badge ${beat.author}">
                    ${beat.author === 'tyrrel' ? 'T' : 'T'}
                </div>
            </div>
            <div class="beat-card-preview">
                ${preview}
            </div>
            <div class="beat-card-meta">
                <div class="meta-row">
                    <span class="word-count">${wordCount} words</span>
                    <span class="beat-date">${dateStr}</span>
                </div>
                ${scene.mckeeElement ? `
                <div class="meta-row">
                    <span class="mckee-badge">${scene.mckeeElement}</span>
                </div>
                ` : ''}
                ${characterNames.length > 0 ? `
                <div class="meta-row characters">
                    <span class="character-icon">👥</span>
                    <span class="character-list">${characterNames.join(', ')}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        // Click to show scene details
        card.addEventListener('click', () => {
            this.showSceneDetails(scene.id);
        });
        
        return card;
    },
    
    /**
     * Create orphaned beats section
     */
    createOrphanedBeatsSection(orphanedBeats) {
        const section = document.createElement('div');
        section.className = 'orphaned-beats-section';
        
        const header = document.createElement('div');
        header.className = 'orphaned-beats-header';
        header.innerHTML = `
            <h3>📦 Orphaned Beats</h3>
            <p>These beats are not part of any scene yet. Organize them in The Desk.</p>
        `;
        section.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'orphaned-beats-grid';
        
        orphanedBeats.forEach((beat, index) => {
            const card = document.createElement('div');
            card.className = 'beat-card orphaned';
            card.dataset.beatId = beat.id;
            
            const preview = this.getPreviewText(beat.content, 100);
            const wordCount = this.getWordCount(beat.content);
            const date = new Date(beat.created);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            card.innerHTML = `
                <div class="beat-card-header">
                    <div class="beat-card-title">
                        <span class="beat-number">Orphan ${index + 1}</span>
                    </div>
                    <div class="beat-author-badge ${beat.author}">
                        ${beat.author === 'tyrrel' ? 'T' : 'T'}
                    </div>
                </div>
                <div class="beat-card-preview">
                    ${preview}
                </div>
                <div class="beat-card-meta">
                    <span class="word-count">${wordCount} words</span>
                    <span class="beat-date">${dateStr}</span>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        return section;
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRUCTURE ANALYSIS VIEW
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Render structure analysis - act distribution, McKee coverage, warnings
     */
    renderStructureAnalysis() {
        console.log('📊 Rendering Structure Analysis...');
        
        const canvas = document.getElementById('covenantCanvas');
        if (!canvas) return;
        
        canvas.innerHTML = '';
        
        // Get stats
        const stats = ChronicleData.getStats();
        
        // Create structure container
        const structureContainer = document.createElement('div');
        structureContainer.className = 'structure-analysis-container';
        
        // Overall stats section
        const overallStats = this.createOverallStats(stats);
        structureContainer.appendChild(overallStats);
        
        // Act distribution section
        const actDistribution = this.createActDistribution();
        structureContainer.appendChild(actDistribution);
        
        // McKee coverage section
        const mckeeCoverage = this.createMckeeCoverage();
        structureContainer.appendChild(mckeeCoverage);
        
        // Warnings section
        const warnings = this.createStructuralWarnings();
        structureContainer.appendChild(warnings);
        
        canvas.appendChild(structureContainer);
        
        console.log('✅ Structure Analysis rendered');
    },
    
    /**
     * Create overall stats card
     */
    createOverallStats(stats) {
        const section = document.createElement('div');
        section.className = 'structure-section overall-stats';
        
        section.innerHTML = `
            <h3 class="structure-section-title">📊 Overall Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.scenes.total}</div>
                    <div class="stat-label">Total Scenes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.beats.total}</div>
                    <div class="stat-label">Total Beats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.beats.orphaned}</div>
                    <div class="stat-label">Orphaned Beats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.wordCount.toLocaleString()}</div>
                    <div class="stat-label">Total Words</div>
                </div>
                <div class="stat-card status-card draft">
                    <div class="stat-value">${stats.scenes.draft}</div>
                    <div class="stat-label">Draft</div>
                </div>
                <div class="stat-card status-card in-progress">
                    <div class="stat-value">${stats.scenes.inProgress}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card status-card polished">
                    <div class="stat-value">${stats.scenes.polished}</div>
                    <div class="stat-label">Polished</div>
                </div>
            </div>
        `;
        
        return section;
    },
    
    /**
     * Create act distribution breakdown
     */
    createActDistribution() {
        const section = document.createElement('div');
        section.className = 'structure-section act-distribution';
        
        const title = document.createElement('h3');
        title.className = 'structure-section-title';
        title.textContent = '⚔️ Act Distribution';
        section.appendChild(title);
        
        const actGrid = document.createElement('div');
        actGrid.className = 'act-distribution-grid';
        
        ChronicleData.acts.forEach(act => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            // Calculate beats and words
            let totalBeats = 0;
            let totalWords = 0;
            
            actScenes.forEach(scene => {
                const beats = ChronicleData.getBeatsForScene(scene.id);
                totalBeats += beats.length;
                
                beats.forEach(beat => {
                    const text = beat.content.replace(/<[^>]*>/g, '');
                    totalWords += text.split(/\s+/).filter(w => w.length > 0).length;
                });
            });
            
            // Calculate percentage of total story
            const stats = ChronicleData.getStats();
            const beatPercentage = stats.beats.inScenes > 0 
                ? Math.round((totalBeats / stats.beats.inScenes) * 100) 
                : 0;
            
            const actCard = document.createElement('div');
            actCard.className = 'act-card';
            actCard.innerHTML = `
                <div class="act-card-header" style="border-left-color: ${act.color};">
                    <h4>Act ${act.number}</h4>
                    <span class="act-title">${act.title}</span>
                </div>
                <div class="act-card-stats">
                    <div class="act-stat">
                        <span class="stat-value">${actScenes.length}</span>
                        <span class="stat-label">Scenes</span>
                    </div>
                    <div class="act-stat">
                        <span class="stat-value">${totalBeats}</span>
                        <span class="stat-label">Beats</span>
                    </div>
                    <div class="act-stat">
                        <span class="stat-value">${totalWords.toLocaleString()}</span>
                        <span class="stat-label">Words</span>
                    </div>
                    <div class="act-stat">
                        <span class="stat-value">${beatPercentage}%</span>
                        <span class="stat-label">of Story</span>
                    </div>
                </div>
                <div class="act-progress-bar">
                    <div class="act-progress-fill" style="width: ${beatPercentage}%; background: ${act.color};"></div>
                </div>
            `;
            
            actGrid.appendChild(actCard);
        });
        
        section.appendChild(actGrid);
        return section;
    },
    
// ═══════════════════════════════════════════════════════════════════════
    /**
    /**
     * Create McKee coverage visualization
     */
    createMckeeCoverage() {
        const section = document.createElement('div');
        section.className = 'structure-section mckee-coverage';
        
        const title = document.createElement('h3');
        title.className = 'structure-section-title';
        title.textContent = '🎭 McKee Story Elements';
        section.appendChild(title);
        
        // Get all used McKee elements from scenes
        const usedElements = new Set();
        ChronicleData.scenes.forEach(scene => {
            if (scene.mckeeElement) {
                usedElements.add(scene.mckeeElement);
            }
        });
        
        // Create grid of all McKee elements
        const elementGrid = document.createElement('div');
        elementGrid.className = 'mckee-element-grid';
        
        ChronicleData.mckeeElements.forEach(element => {
            const isUsed = usedElements.has(element);
            const scenes = ChronicleData.scenes.filter(s => s.mckeeElement === element);
            
            const elementCard = document.createElement('div');
            elementCard.className = `mckee-element-card ${isUsed ? 'used' : 'missing'}`;
            elementCard.innerHTML = `
                <div class="element-name">${element}</div>
                <div class="element-status">
                    ${isUsed ? `
                        <span class="status-badge used">✓ Used</span>
                        <span class="scene-count">${scenes.length} ${scenes.length === 1 ? 'scene' : 'scenes'}</span>
                    ` : `
                        <span class="status-badge missing">✗ Missing</span>
                    `}
                </div>
            `;
            
            // Click to filter beat sheet by this element
            if (isUsed) {
                elementCard.style.cursor = 'pointer';
                elementCard.addEventListener('click', () => {
                    this.filterByMckeeElement(element);
                });
            }
            
            elementGrid.appendChild(elementCard);
        });
        
        section.appendChild(elementGrid);
        
        // Summary stats
        const summary = document.createElement('div');
        summary.className = 'mckee-summary';
        const usedCount = usedElements.size;
        const totalCount = ChronicleData.mckeeElements.length;
        const percentage = Math.round((usedCount / totalCount) * 100);
        
        summary.innerHTML = `
            <div class="summary-stat">
                <span class="summary-value">${usedCount} / ${totalCount}</span>
                <span class="summary-label">Elements Covered (${percentage}%)</span>
            </div>
        `;
        section.appendChild(summary);
        
        return section;
    },
    
    /**
     * Create structural warnings
     */
    createStructuralWarnings() {
        const section = document.createElement('div');
        section.className = 'structure-section warnings-section';
        
        const title = document.createElement('h3');
        title.className = 'structure-section-title';
        title.textContent = '⚠️ Structural Analysis';
        section.appendChild(title);
        
        const warnings = this.analyzeStructure();
        
        if (warnings.length === 0) {
            section.innerHTML += `
                <div class="no-warnings">
                    <span class="success-icon">✓</span>
                    <p>Your story structure looks solid! All major McKee elements are covered.</p>
                </div>
            `;
            return section;
        }
        
        const warningList = document.createElement('div');
        warningList.className = 'warning-list';
        
        warnings.forEach(warning => {
            const warningItem = document.createElement('div');
            warningItem.className = `warning-item ${warning.severity}`;
            warningItem.innerHTML = `
                <div class="warning-icon">${warning.severity === 'critical' ? '🔴' : warning.severity === 'warning' ? '🟡' : 'ℹ️'}</div>
                <div class="warning-content">
                    <div class="warning-title">${warning.title}</div>
                    <div class="warning-description">${warning.description}</div>
                    ${warning.suggestion ? `<div class="warning-suggestion">💡 ${warning.suggestion}</div>` : ''}
                </div>
            `;
            warningList.appendChild(warningItem);
        });
        
        section.appendChild(warningList);
        return section;
    },
    
    /**
     * Analyze structure and return warnings
     */
    analyzeStructure() {
        const warnings = [];
        const stats = ChronicleData.getStats();
        
        // Check if story exists at all
        if (stats.scenes.total === 0) {
            warnings.push({
                severity: 'info',
                title: 'No scenes yet',
                description: 'Begin writing in The Desk to build your story structure.',
                suggestion: null
            });
            return warnings;
        }
        
        // Check for missing McKee elements
        const usedElements = new Set();
        ChronicleData.scenes.forEach(scene => {
            if (scene.mckeeElement) {
                usedElements.add(scene.mckeeElement);
            }
        });
        
        const missingElements = ChronicleData.mckeeElements.filter(el => !usedElements.has(el));
        
        if (missingElements.length > 0) {
            warnings.push({
                severity: missingElements.length > 4 ? 'critical' : 'warning',
                title: `Missing ${missingElements.length} McKee Elements`,
                description: `Your story is missing: ${missingElements.join(', ')}`,
                suggestion: 'Tag existing scenes with McKee elements or create new scenes to cover these story beats.'
            });
        }
        
        // Check act balance
        const act1Beats = this.getActBeatCount('act-1');
        const act2Beats = this.getActBeatCount('act-2');
        const act3Beats = this.getActBeatCount('act-3');
        const totalBeats = act1Beats + act2Beats + act3Beats;
        
        if (totalBeats > 0) {
            const act2Percentage = (act2Beats / totalBeats) * 100;
            
            // Act 2 should ideally be ~50% of the story
            if (act2Percentage < 35) {
                warnings.push({
                    severity: 'warning',
                    title: 'Act II might be too short',
                    description: `Act II contains only ${Math.round(act2Percentage)}% of your story. McKee recommends ~50%.`,
                    suggestion: 'Consider developing more confrontation and complication in Act II.'
                });
            } else if (act2Percentage > 65) {
                warnings.push({
                    severity: 'warning',
                    title: 'Act II might be too long',
                    description: `Act II contains ${Math.round(act2Percentage)}% of your story. Consider tightening.`,
                    suggestion: 'Some confrontation beats might work better in Act III.'
                });
            }
            
            // Check Act I and III balance
            const act1Percentage = (act1Beats / totalBeats) * 100;
            const act3Percentage = (act3Beats / totalBeats) * 100;
            
            if (act1Percentage > 35) {
                warnings.push({
                    severity: 'info',
                    title: 'Act I setup is extensive',
                    description: `Act I contains ${Math.round(act1Percentage)}% of your story.`,
                    suggestion: 'Ensure you reach the first plot point efficiently.'
                });
            }
            
            if (act3Percentage < 15 && totalBeats > 10) {
                warnings.push({
                    severity: 'warning',
                    title: 'Act III resolution might be rushed',
                    description: `Act III contains only ${Math.round(act3Percentage)}% of your story.`,
                    suggestion: 'Give your climax and resolution adequate space to breathe.'
                });
            }
        }
        
        // Check for orphaned beats
        if (stats.beats.orphaned > 5) {
            warnings.push({
                severity: 'info',
                title: `${stats.beats.orphaned} orphaned beats`,
                description: 'You have many beats not organized into scenes.',
                suggestion: 'Review orphaned beats in The Desk and organize them into scenes.'
            });
        }
        
        // Check draft vs polished ratio
        if (stats.scenes.total > 5 && stats.scenes.polished === 0) {
            warnings.push({
                severity: 'info',
                title: 'No polished scenes yet',
                description: 'All scenes are still in draft or in-progress status.',
                suggestion: 'Consider polishing your strongest scenes as reference points.'
            });
        }
        
        return warnings;
    },
    
    /**
     * Get beat count for an act
     */
    getActBeatCount(actId) {
        const scenes = ChronicleData.getScenesByAct(actId);
        return scenes.reduce((sum, scene) => {
            return sum + ChronicleData.getBeatsForScene(scene.id).length;
        }, 0);
    },
    
    /**
     * Filter beat sheet by McKee element
     */
    filterByMckeeElement(element) {
        // Switch to beat sheet view
        this.currentView = 'beat-sheet';
        this.renderBeatSheet();
        
        // Show notification
        this.showNotification(`Showing scenes with: ${element}`, 'info');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // PACING GRAPH VIEW
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Render pacing graph - visual representation of story progression
     */
    renderPacingGraph() {
        console.log('📈 Rendering Pacing Graph...');
        
        const canvas = document.getElementById('covenantCanvas');
        if (!canvas) return;
        
        canvas.innerHTML = '';
        
        const scenes = ChronicleData.scenes;
        
        if (scenes.length === 0) {
            this.renderEmptyState(canvas, 'No scenes to visualize', 'Create scenes in The Desk to see pacing analysis');
            return;
        }
        
        // Create pacing container
        const pacingContainer = document.createElement('div');
        pacingContainer.className = 'pacing-graph-container';
        
        // Title
        const title = document.createElement('h3');
        title.className = 'pacing-title';
        title.textContent = '📈 Story Pacing Visualization';
        pacingContainer.appendChild(title);
        
        // Placeholder for future implementation
        const placeholder = document.createElement('div');
        placeholder.className = 'pacing-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-icon">📊</div>
            <h4>Pacing Graph - Coming Soon</h4>
            <p>This view will visualize story tension, stakes, and emotional intensity across your narrative arc.</p>
            <p>Features in development:</p>
            <ul>
                <li>Visual tension curve based on conflict types</li>
                <li>Stakes progression mapping</li>
                <li>Character arc intersection points</li>
                <li>McKee beat timing analysis</li>
            </ul>
        `;
        pacingContainer.appendChild(placeholder);
        
        canvas.appendChild(pacingContainer);
        
        console.log('ℹ️ Pacing Graph placeholder rendered');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCENE DETAILS PANEL
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Show scene details panel
     */
    showSceneDetails(sceneId) {
        const scene = ChronicleData.getScene(sceneId);
        if (!scene) return;
        
        this.selectedSceneId = sceneId;
        
        const detailsPanel = document.getElementById('covenantDetails');
        const detailsContent = document.getElementById('covenantDetailsContent');
        
        if (!detailsPanel || !detailsContent) return;
        
        // Get beats for this scene
        const beats = ChronicleData.getBeatsForScene(sceneId);
        
        // Calculate total word count
        const totalWords = beats.reduce((sum, beat) => {
            return sum + this.getWordCount(beat.content);
        }, 0);
        
        // Get character names
        const characterNames = this.getCharacterNames(scene.characters);
        
        // Get location name
        const locationName = scene.location ? 
            ChronicleData.getLocation(scene.location)?.name : null;
        
        // Format date
        const date = new Date(scene.modified);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        detailsContent.innerHTML = `
            <div class="scene-details-header">
                <h3>${scene.title}</h3>
                <div class="scene-meta-badges">
                    <span class="author-badge ${scene.author}">${scene.author}</span>
                    <span class="status-badge ${scene.status}">${scene.status.replace('-', ' ')}</span>
                </div>
            </div>
            
            <div class="scene-details-stats">
                <div class="detail-stat">
                    <span class="stat-label">Beats:</span>
                    <span class="stat-value">${beats.length}</span>
                </div>
                <div class="detail-stat">
                    <span class="stat-label">Words:</span>
                    <span class="stat-value">${totalWords.toLocaleString()}</span>
                </div>
                <div class="detail-stat">
                    <span class="stat-label">Last Modified:</span>
                    <span class="stat-value">${dateStr}</span>
                </div>
            </div>
            
            ${scene.mckeeElement ? `
            <div class="scene-details-section">
                <h4>McKee Element</h4>
                <div class="mckee-badge large">${scene.mckeeElement}</div>
            </div>
            ` : ''}
            
            ${characterNames.length > 0 ? `
            <div class="scene-details-section">
                <h4>Characters</h4>
                <div class="character-tags">
                    ${characterNames.map(name => `<span class="character-tag">${name}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${locationName ? `
            <div class="scene-details-section">
                <h4>Location</h4>
                <div class="location-name">📍 ${locationName}</div>
            </div>
            ` : ''}
            
            ${scene.purpose ? `
            <div class="scene-details-section">
                <h4>Scene Purpose</h4>
                <p class="scene-purpose">${scene.purpose}</p>
            </div>
            ` : ''}
            
            <div class="scene-details-section beats-list">
                <h4>Beats in This Scene (${beats.length})</h4>
                ${beats.map((beat, index) => `
                    <div class="beat-detail-item">
                        <div class="beat-detail-header">
                            <span class="beat-detail-number">Beat ${index + 1}</span>
                            <span class="beat-detail-author ${beat.author}">${beat.author}</span>
                        </div>
                        <div class="beat-detail-preview">
                            ${this.getPreviewText(beat.content, 200)}
                        </div>
                        <div class="beat-detail-meta">
                            ${this.getWordCount(beat.content)} words
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="scene-details-actions">
                <button class="action-btn primary" onclick="ChronicleCovenantWorkspace.openInDesk('${sceneId}')">
                    Open in Desk
                </button>
            </div>
        `;
        
        // Show panel
        detailsPanel.classList.add('active');
    },
    
    /**
     * Hide scene details panel
     */
    hideDetails() {
        const detailsPanel = document.getElementById('covenantDetails');
        if (detailsPanel) {
            detailsPanel.classList.remove('active');
        }
        this.selectedSceneId = null;
    },
    
    /**
     * Open scene in Desk
     */
    openInDesk(sceneId) {
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
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY HELPERS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Get preview text from HTML content
     */
    getPreviewText(htmlContent, maxLength = 100) {
        const text = htmlContent.replace(/<[^>]*>/g, '').trim();
        if (text.length <= maxLength) return text || '<empty>';
        return text.substring(0, maxLength) + '...';
    },
    
    /**
     * Get word count from HTML content
     */
    getWordCount(htmlContent) {
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(word => word.length > 0);
        return words.length;
    },
    
    /**
     * Get character names from IDs
     */
    getCharacterNames(characterIds) {
        if (!characterIds || characterIds.length === 0) return [];
        
        return characterIds
            .map(id => ChronicleData.getCharacter(id)?.name)
            .filter(name => name);
    },
    
    /**
     * Get total beats count across all scenes
     */
    getTotalBeatsCount() {
        return ChronicleData.scenes.reduce((sum, scene) => {
            return sum + ChronicleData.getBeatsForScene(scene.id).length;
        }, 0);
    },
    
    /**
     * Render empty state
     */
    renderEmptyState(container, title, message) {
        container.innerHTML = `
            <div class="covenant-empty-state">
                <div class="empty-state-icon">🛡️</div>
                <h3 class="empty-state-title">${title}</h3>
                <p class="empty-state-message">${message}</p>
            </div>
        `;
    },
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `covenant-notification ${type}`;
        notification.textContent = message;
        
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
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// ═══════════════════════════════════════════════════════════════════════
// MODULE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

// Make available globally
window.ChronicleCovenantWorkspace = ChronicleCovenantWorkspace;

// Initialize when Covenant workspace becomes active
document.addEventListener('DOMContentLoaded', () => {
    const covenantTab = document.querySelector('[data-space="covenant"]');
    if (covenantTab) {
        covenantTab.addEventListener('click', () => {
            setTimeout(() => {
                if (!ChronicleCovenantWorkspace.initialized) {
                    ChronicleCovenantWorkspace.init();
                }
            }, 100);
        });
    }
});

console.log('🛡️ Chronicle Covenant module loaded');

// ═══════════════════════════════════════════════════════════════════════
// END OF CHRONICLE COVENANT
// 
// "The LORD is my strength and my shield; my heart trusts in him,
// and he helps me." — Psalm 28:7
// ═══════════════════════════════════════════════════════════════════════