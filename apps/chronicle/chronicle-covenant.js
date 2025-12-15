// ===================================
// THE COVENANT - Sprint 2
// "The crucible for silver and the furnace for gold" - Proverbs 17:3
// Architectural Sanctuary for Story Structure
// ===================================

const ChronicleCovenantWorkspace = {
    currentView: 'beat-sheet',
    selectedScene: null,
    acts: [],
    chapters: [],
    scenes: [],
    
    // Initialize the Covenant workspace
    init() {
        console.log('🏛️ Covenant Workspace (Sprint 2) initializing...');
        
        // Load structure data
        this.loadStructureData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view (Beat Sheet)
        this.renderBeatSheet();
        
        console.log('✅ Covenant Workspace ready');
    },
    
    // Load Acts, Chapters, and Scenes from localStorage
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
        
        // Load Scenes
        const savedScenes = localStorage.getItem('chronicle_scenes');
        if (savedScenes) {
            try {
                this.scenes = JSON.parse(savedScenes);
            } catch (e) {
                console.error('Failed to load scenes:', e);
                this.scenes = [];
            }
        }
        
        console.log(`📊 Loaded: ${this.acts.length} acts, ${this.chapters.length} chapters, ${this.scenes.length} scenes`);
    },
    
    // Create default three-act structure
    createDefaultActs() {
        return [
            {
                id: 'act-1',
                number: 1,
                title: 'Act I: Setup',
                description: 'The ordinary world and inciting incident',
                color: '#C9A961' // Gold
            },
            {
                id: 'act-2',
                number: 2,
                title: 'Act II: Confrontation',
                description: 'Progressive complications and midpoint reversal',
                color: '#2C5F5F' // Teal
            },
            {
                id: 'act-3',
                number: 3,
                title: 'Act III: Resolution',
                description: 'Crisis, climax, and denouement',
                color: '#722F37' // Burgundy
            }
        ];
    },
    
    // Save data methods
    saveActs() {
        localStorage.setItem('chronicle_acts', JSON.stringify(this.acts));
    },
    
    saveChapters() {
        localStorage.setItem('chronicle_chapters', JSON.stringify(this.chapters));
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // View button switching (Beat Sheet, Structure, Timeline, Pacing)
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
        const closeBtn = document.getElementById('closeDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDetails();
            });
        }
        
        console.log('✅ Covenant event listeners attached');
    },
    
    // Switch between different views
    switchView(viewName) {
        console.log(`📊 Switching to view: ${viewName}`);
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
        switch(viewName) {
            case 'beat-sheet':
                this.renderBeatSheet();
                break;
            case 'structure':
                this.renderStructureAnalysis();
                break;
            case 'pacing':
                this.renderPacingGraph();
                break;
            case 'characters':
                this.renderCharacterArcs();
                break;
            case 'themes':
                this.renderThemeDistribution();
                break;
            default:
                this.renderBeatSheet();
        }
    },
    
    // ===================================
    // SPRINT 1: BEAT SHEET VIEW
    // ===================================
    
    renderBeatSheet() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        if (this.scenes.length === 0) {
            canvas.innerHTML = `
                <div class="covenant-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 80px; height: 80px; margin-bottom: 1.5rem; opacity: 0.5;">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                    </svg>
                    <h3>No Scenes Yet</h3>
                    <p>Begin your story at The Desk, and your scenes will appear here in their sacred architecture.</p>
                    <p style="margin-top: 1rem; font-style: italic; opacity: 0.7;">
                        "Unless the LORD builds the house, the builders labor in vain" - Psalm 127:1
                    </p>
                </div>
            `;
            return;
        }
        
        // Group scenes by Act
        const scenesByAct = this.groupScenesByAct();
        
        let html = '<div class="beat-sheet-container">';
        
        this.acts.forEach(act => {
            const actScenes = scenesByAct[act.id] || [];
            const totalWords = actScenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
            
            html += `
                <div class="act-section" style="border-left: 4px solid ${act.color};">
                    <div class="act-header">
                        <h3 style="color: ${act.color};">${act.title}</h3>
                        <div class="act-stats">
                            <span>${actScenes.length} scenes</span>
                            <span>${totalWords.toLocaleString()} words</span>
                        </div>
                    </div>
                    <div class="scene-cards">
            `;
            
            if (actScenes.length === 0) {
                html += `<div class="empty-act">No scenes in this act yet</div>`;
            } else {
                actScenes.forEach(scene => {
                    const mckeeColor = this.getMcKeeColor(scene.mckeeStructure);
                    const authorBadge = scene.author === 'tyrrel' ? '👤 T' : '👤 Tr';
                    
                    html += `
                        <div class="scene-card" data-scene-id="${scene.id}" style="border-left: 3px solid ${mckeeColor};">
                            <div class="scene-card-header">
                                <span class="scene-number">Scene ${scene.sceneNumber || '?'}</span>
                                <span class="scene-author" style="color: ${scene.author === 'tyrrel' ? '#C9A961' : '#2C5F5F'};">${authorBadge}</span>
                            </div>
                            <div class="scene-card-title">${scene.title || 'Untitled Scene'}</div>
                            <div class="scene-card-meta">
                                <span>${scene.wordCount || 0} words</span>
                                ${scene.mckeeStructure ? `<span class="mckee-badge" style="background: ${mckeeColor};">${scene.mckeeStructure}</span>` : ''}
                            </div>
                        </div>
                    `;
                });
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        canvas.innerHTML = html;
        
        // Attach click handlers to scene cards
        document.querySelectorAll('.scene-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const sceneId = e.currentTarget.getAttribute('data-scene-id');
                this.showSceneDetails(sceneId);
            });
        });
    },
    
    // ===================================
    // SPRINT 2: PACING GRAPH
    // ===================================
    
    renderPacingGraph() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        if (this.scenes.length === 0) {
            canvas.innerHTML = this.getEmptyStateHTML('Pacing Analysis', 'Create scenes to visualize your story\'s rhythm and flow.');
            return;
        }
        
        // Calculate pacing data
        const pacingData = this.calculatePacingData();
        
        let html = `
            <div class="pacing-graph-container">
                <div class="graph-header">
                    <h2>Pacing Analysis</h2>
                    <p>"The crucible for silver and the furnace for gold, but the LORD tests the heart" - Proverbs 17:3</p>
                </div>
                
                <div class="pacing-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.scenes.length}</div>
                        <div class="stat-label">Total Scenes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${pacingData.totalWords.toLocaleString()}</div>
                        <div class="stat-label">Total Words</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${pacingData.avgWordsPerScene}</div>
                        <div class="stat-label">Avg Words/Scene</div>
                    </div>
                </div>
                
                <div class="pacing-graph-canvas">
                    <svg id="pacingGraphSVG" viewBox="0 0 1000 400" style="width: 100%; height: 400px;">
                        ${this.renderPacingGraphSVG(pacingData)}
                    </svg>
                </div>
                
                <div class="pacing-insights">
                    <h3>Insights</h3>
                    ${this.generatePacingInsights(pacingData)}
                </div>
            </div>
        `;
        
        canvas.innerHTML = html;
    },
    
    calculatePacingData() {
        const totalWords = this.scenes.reduce((sum, scene) => sum + (scene.wordCount || 0), 0);
        const avgWordsPerScene = Math.round(totalWords / this.scenes.length);
        
        // Create data points for each scene
        const dataPoints = this.scenes.map((scene, index) => ({
            sceneNumber: index + 1,
            wordCount: scene.wordCount || 0,
            title: scene.title,
            actId: scene.actId,
            mckeeStructure: scene.mckeeStructure
        }));
        
        return {
            totalWords,
            avgWordsPerScene,
            dataPoints,
            maxWords: Math.max(...dataPoints.map(d => d.wordCount)),
            minWords: Math.min(...dataPoints.map(d => d.wordCount))
        };
    },
    
    renderPacingGraphSVG(data) {
        if (data.dataPoints.length === 0) return '';
        
        const padding = 50;
        const width = 1000 - (padding * 2);
        const height = 400 - (padding * 2);
        const maxY = data.maxWords * 1.1; // 10% headroom
        
        // Calculate points for the line graph
        const points = data.dataPoints.map((point, index) => {
            const x = padding + (index / (data.dataPoints.length - 1)) * width;
            const y = padding + height - (point.wordCount / maxY) * height;
            return { x, y, ...point };
        });
        
        // Create path for the line
        const linePath = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');
        
        // Create area fill path
        const areaPath = `M ${padding} ${padding + height} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${padding + width} ${padding + height} Z`;
        
        let svg = `
            <!-- Grid lines -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + height}" stroke="#8B7355" stroke-width="2"/>
            <line x1="${padding}" y1="${padding + height}" x2="${padding + width}" y2="${padding + height}" stroke="#8B7355" stroke-width="2"/>
            
            <!-- Average line -->
            ${(() => {
                const avgY = padding + height - (data.avgWordsPerScene / maxY) * height;
                return `
                    <line x1="${padding}" y1="${avgY}" x2="${padding + width}" y2="${avgY}" 
                          stroke="#C9A961" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>
                    <text x="${padding + width + 5}" y="${avgY + 5}" fill="#C9A961" font-size="12" font-family="Crimson Text">
                        Avg: ${data.avgWordsPerScene}
                    </text>
                `;
            })()}
            
            <!-- Area fill -->
            <path d="${areaPath}" fill="url(#pacingGradient)" opacity="0.3"/>
            
            <!-- Line graph -->
            <path d="${linePath}" fill="none" stroke="#C9A961" stroke-width="3"/>
            
            <!-- Data points -->
            ${points.map(p => {
                const color = this.getMcKeeColor(p.mckeeStructure);
                return `
                    <circle cx="${p.x}" cy="${p.y}" r="5" fill="${color}" stroke="#2a2822" stroke-width="2">
                        <title>${p.title || 'Untitled'} - ${p.wordCount} words</title>
                    </circle>
                `;
            }).join('')}
            
            <!-- Gradient definition -->
            <defs>
                <linearGradient id="pacingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#C9A961;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#C9A961;stop-opacity:0.1" />
                </linearGradient>
            </defs>
        `;
        
        return svg;
    },
    
    generatePacingInsights(data) {
        let insights = '<ul class="insight-list">';
        
        // Check for pacing issues
        const longestScene = Math.max(...data.dataPoints.map(d => d.wordCount));
        const shortestScene = Math.min(...data.dataPoints.map(d => d.wordCount));
        const variance = longestScene - shortestScene;
        
        if (variance > data.avgWordsPerScene * 3) {
            insights += '<li>⚠️ <strong>High variance detected</strong> - Some scenes are significantly longer than others. Consider balancing scene lengths for consistent pacing.</li>';
        }
        
        // Check Act II length
        const act2Scenes = data.dataPoints.filter(d => d.actId === 'act-2');
        const act2Words = act2Scenes.reduce((sum, s) => sum + s.wordCount, 0);
        const act2Percentage = (act2Words / data.totalWords) * 100;
        
        if (act2Percentage < 40) {
            insights += '<li>📖 <strong>Act II may be underdeveloped</strong> - The middle act should typically comprise 40-50% of your story.</li>';
        }
        
        // General praise
        if (data.dataPoints.length >= 20) {
            insights += '<li>✅ <strong>Good structural foundation</strong> - You have substantial material to work with.</li>';
        }
        
        insights += '</ul>';
        return insights;
    },
    
    // ===================================
    // SPRINT 2: CHARACTER ARC TRACKER
    // ===================================
    
    renderCharacterArcs() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Extract unique characters from scenes
        const characters = this.extractCharacters();
        
        if (characters.length === 0) {
            canvas.innerHTML = this.getEmptyStateHTML('Character Arc Tracker', 'Add character tags to your scenes to track their journeys.');
            return;
        }
        
        let html = `
            <div class="character-arc-container">
                <div class="graph-header">
                    <h2>Character Arc Tracker</h2>
                    <p>"See which scenes they appear in, track their emotional journey across the narrative"</p>
                </div>
                
                <div class="character-list">
        `;
        
        characters.forEach(char => {
            const appearances = this.getCharacterAppearances(char);
            const actDistribution = this.getCharacterActDistribution(char, appearances);
            
            html += `
                <div class="character-card">
                    <div class="character-header">
                        <h3>${char}</h3>
                        <span class="appearance-count">${appearances.length} scenes</span>
                    </div>
                    <div class="act-distribution">
                        <div class="act-bar">
                            <div class="act-segment" style="width: ${actDistribution.act1}%; background: #C9A961;" title="Act I: ${actDistribution.act1}%"></div>
                            <div class="act-segment" style="width: ${actDistribution.act2}%; background: #2C5F5F;" title="Act II: ${actDistribution.act2}%"></div>
                            <div class="act-segment" style="width: ${actDistribution.act3}%; background: #722F37;" title="Act III: ${actDistribution.act3}%"></div>
                        </div>
                        <div class="act-labels">
                            <span>Act I (${actDistribution.act1}%)</span>
                            <span>Act II (${actDistribution.act2}%)</span>
                            <span>Act III (${actDistribution.act3}%)</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        canvas.innerHTML = html;
    },
    
    extractCharacters() {
        const charSet = new Set();
        this.scenes.forEach(scene => {
            if (scene.characters && Array.isArray(scene.characters)) {
                scene.characters.forEach(char => charSet.add(char));
            }
        });
        return Array.from(charSet);
    },
    
    getCharacterAppearances(characterName) {
        return this.scenes.filter(scene => 
            scene.characters && scene.characters.includes(characterName)
        );
    },
    
    getCharacterActDistribution(characterName, appearances) {
        const act1 = appearances.filter(s => s.actId === 'act-1').length;
        const act2 = appearances.filter(s => s.actId === 'act-2').length;
        const act3 = appearances.filter(s => s.actId === 'act-3').length;
        const total = appearances.length;
        
        return {
            act1: total > 0 ? Math.round((act1 / total) * 100) : 0,
            act2: total > 0 ? Math.round((act2 / total) * 100) : 0,
            act3: total > 0 ? Math.round((act3 / total) * 100) : 0
        };
    },
    
    // ===================================
    // SPRINT 2: THEME DISTRIBUTION
    // ===================================
    
    renderThemeDistribution() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Extract themes
        const themes = this.extractThemes();
        
        if (themes.length === 0) {
            canvas.innerHTML = this.getEmptyStateHTML('Theme Distribution', 'Add themes to your scenes to visualize how they weave through your story.');
            return;
        }
        
        let html = `
            <div class="theme-distribution-container">
                <div class="graph-header">
                    <h2>Theme Distribution Map</h2>
                    <p>"Where your themes live across the narrative architecture"</p>
                </div>
                
                <div class="theme-heatmap">
        `;
        
        // Create heatmap grid: Themes (rows) × Acts (columns)
        themes.forEach(theme => {
            const distribution = this.getThemeActDistribution(theme);
            
            html += `
                <div class="theme-row">
                    <div class="theme-label">${theme}</div>
                    <div class="theme-cells">
                        <div class="theme-cell" style="opacity: ${distribution.act1 / 100};" title="Act I: ${distribution.act1}%">
                            <span class="cell-value">${distribution.act1}%</span>
                        </div>
                        <div class="theme-cell" style="opacity: ${distribution.act2 / 100};" title="Act II: ${distribution.act2}%">
                            <span class="cell-value">${distribution.act2}%</span>
                        </div>
                        <div class="theme-cell" style="opacity: ${distribution.act3 / 100};" title="Act III: ${distribution.act3}%">
                            <span class="cell-value">${distribution.act3}%</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                
                <div class="theme-legend">
                    <span>Lighter = Less emphasis</span>
                    <span>Darker = More emphasis</span>
                </div>
            </div>
        `;
        
        canvas.innerHTML = html;
    },
    
    extractThemes() {
        const themeSet = new Set();
        this.scenes.forEach(scene => {
            if (scene.themes && Array.isArray(scene.themes)) {
                scene.themes.forEach(theme => themeSet.add(theme));
            }
        });
        return Array.from(themeSet);
    },
    
    getThemeActDistribution(themeName) {
        const scenesWithTheme = this.scenes.filter(scene => 
            scene.themes && scene.themes.includes(themeName)
        );
        
        const act1 = scenesWithTheme.filter(s => s.actId === 'act-1').length;
        const act2 = scenesWithTheme.filter(s => s.actId === 'act-2').length;
        const act3 = scenesWithTheme.filter(s => s.actId === 'act-3').length;
        const total = scenesWithTheme.length;
        
        return {
            act1: total > 0 ? Math.round((act1 / total) * 100) : 0,
            act2: total > 0 ? Math.round((act2 / total) * 100) : 0,
            act3: total > 0 ? Math.round((act3 / total) * 100) : 0
        };
    },
    
    // ===================================
    // SPRINT 1: STRUCTURE ANALYSIS
    // ===================================
    
    renderStructureAnalysis() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Analyze McKee structure elements
        const analysis = this.analyzeStructure();
        
        let html = `
            <div class="structure-analysis-container">
                <div class="graph-header">
                    <h2>Structure Analysis</h2>
                    <p>"McKee's Essential Structural Elements"</p>
                </div>
                
                <div class="structure-checklist">
        `;
        
        const requiredElements = [
            { key: 'opening', label: 'Opening Image', act: 1 },
            { key: 'inciting', label: 'Inciting Incident', act: 1 },
            { key: 'firstPlot', label: 'First Plot Point', act: 1 },
            { key: 'midpoint', label: 'Midpoint Reversal', act: 2 },
            { key: 'crisis', label: 'Crisis', act: 2 },
            { key: 'climax', label: 'Climax', act: 3 },
            { key: 'resolution', label: 'Resolution', act: 3 }
        ];
        
        requiredElements.forEach(elem => {
            const found = analysis[elem.key];
            const status = found ? '✅' : '⚠️';
            const statusClass = found ? 'found' : 'missing';
            
            html += `
                <div class="structure-item ${statusClass}">
                    <span class="status-icon">${status}</span>
                    <span class="element-name">${elem.label}</span>
                    <span class="element-act">Act ${elem.act}</span>
                    ${found ? `<span class="element-scene">${found.title}</span>` : '<span class="element-warning">Not assigned</span>'}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        canvas.innerHTML = html;
    },
    
    analyzeStructure() {
        const analysis = {};
        
        this.scenes.forEach(scene => {
            if (scene.mckeeStructure) {
                const key = scene.mckeeStructure.toLowerCase().replace(/\s+/g, '');
                if (!analysis[key]) {
                    analysis[key] = scene;
                }
            }
        });
        
        return analysis;
    },
    
    // ===================================
    // HELPER METHODS
    // ===================================
    
    groupScenesByAct() {
        const groups = {
            'act-1': [],
            'act-2': [],
            'act-3': []
        };
        
        this.scenes.forEach(scene => {
            const actId = scene.actId || 'act-1';
            if (groups[actId]) {
                groups[actId].push(scene);
            }
        });
        
        return groups;
    },
    
    getMcKeeColor(mckeeStructure) {
        const colors = {
            'Opening': '#C9A961',
            'Inciting': '#ff9955',
            'First Plot Point': '#2C5F5F',
            'Midpoint': '#722F37',
            'Crisis': '#d4a574',
            'Climax': '#A89882',
            'Resolution': '#8B7355'
        };
        return colors[mckeeStructure] || '#8a8580';
    },
    
    getEmptyStateHTML(title, message) {
        return `
            <div class="covenant-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 80px; height: 80px; margin-bottom: 1.5rem; opacity: 0.5;">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    },
    
    showSceneDetails(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) return;
        
        const detailsPanel = document.getElementById('covenant-details');
        const detailsContent = document.getElementById('detailsContent');
        
        if (!detailsPanel || !detailsContent) return;
        
        detailsContent.innerHTML = `
            <div class="scene-details">
                <h4>${scene.title || 'Untitled Scene'}</h4>
                <div class="detail-row">
                    <span class="detail-label">Word Count:</span>
                    <span class="detail-value">${scene.wordCount || 0}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Author:</span>
                    <span class="detail-value">${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}</span>
                </div>
                ${scene.mckeeStructure ? `
                    <div class="detail-row">
                        <span class="detail-label">McKee Element:</span>
                        <span class="detail-value">${scene.mckeeStructure}</span>
                    </div>
                ` : ''}
                ${scene.characters && scene.characters.length > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Characters:</span>
                        <span class="detail-value">${scene.characters.join(', ')}</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        detailsPanel.classList.add('active');
    },
    
    hideDetails() {
        const detailsPanel = document.getElementById('covenant-details');
        if (detailsPanel) {
            detailsPanel.classList.remove('active');
        }
    }
};

// Make globally available
window.ChronicleCovenantWorkspace = ChronicleCovenantWorkspace;

console.log('📜 Covenant workspace module loaded (Sprint 2)');