// ===================================
// THE COVENANT - Complete (Sprints 1-3)
// "Write them on the tablet of your heart" - Proverbs 7:3
// Architectural Sanctuary for Story Structure
// ===================================

const ChronicleCovenantWorkspace = {
    currentView: 'beat-sheet',
    selectedScene: null,
    acts: [],
    chapters: [],
    scenes: [],
    
    // Sprint 3 Data Structures
    characters: [],
    locations: [],
    researchNotes: [],
    symbols: [],
    
    // Initialize the Covenant workspace
    init() {
        console.log('🏛️ Covenant Workspace (Sprints 1-3) initializing...');
        
        // Load all data structures
        this.loadStructureData();
        this.loadDeepMetadata();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view (Beat Sheet)
        this.renderBeatSheet();
        
        console.log('✅ Covenant Workspace ready with full depth');
    },
    
    // Load Acts, Chapters, and Scenes
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
    
    // Load Sprint 3 Deep Metadata
    loadDeepMetadata() {
        // Load Character Registry
        const savedCharacters = localStorage.getItem('chronicle_character_registry');
        if (savedCharacters) {
            try {
                this.characters = JSON.parse(savedCharacters);
            } catch (e) {
                console.error('Failed to load character registry:', e);
                this.characters = this.createDefaultCharacters();
            }
        } else {
            this.characters = this.createDefaultCharacters();
            this.saveCharacters();
        }
        
        // Load Location Catalog
        const savedLocations = localStorage.getItem('chronicle_location_catalog');
        if (savedLocations) {
            try {
                this.locations = JSON.parse(savedLocations);
            } catch (e) {
                console.error('Failed to load locations:', e);
                this.locations = this.createDefaultLocations();
            }
        } else {
            this.locations = this.createDefaultLocations();
            this.saveLocations();
        }
        
        // Load Research Notes
        const savedResearch = localStorage.getItem('chronicle_research_notes');
        if (savedResearch) {
            try {
                this.researchNotes = JSON.parse(savedResearch);
            } catch (e) {
                console.error('Failed to load research:', e);
                this.researchNotes = this.createDefaultResearch();
            }
        } else {
            this.researchNotes = this.createDefaultResearch();
            this.saveResearch();
        }
        
        // Load Symbolic Elements
        const savedSymbols = localStorage.getItem('chronicle_symbolic_elements');
        if (savedSymbols) {
            try {
                this.symbols = JSON.parse(savedSymbols);
            } catch (e) {
                console.error('Failed to load symbols:', e);
                this.symbols = this.createDefaultSymbols();
            }
        } else {
            this.symbols = this.createDefaultSymbols();
            this.saveSymbols();
        }
        
        console.log(`📚 Deep metadata loaded: ${this.characters.length} characters, ${this.locations.length} locations, ${this.symbols.length} symbols`);
    },
    
    // Create default three-act structure
    createDefaultActs() {
        return [
            {
                id: 'act-1',
                number: 1,
                title: 'Act I: Setup',
                description: 'The ordinary world and inciting incident',
                color: '#C9A961'
            },
            {
                id: 'act-2',
                number: 2,
                title: 'Act II: Confrontation',
                description: 'Progressive complications and midpoint reversal',
                color: '#2C5F5F'
            },
            {
                id: 'act-3',
                number: 3,
                title: 'Act III: Resolution',
                description: 'Crisis, climax, and denouement',
                color: '#722F37'
            }
        ];
    },
    
    // Create default character registry for Joseph story
    createDefaultCharacters() {
        return [
            {
                id: 'char-joseph',
                name: 'Joseph',
                role: 'Protagonist',
                description: 'The dreamer who rises from pit to palace',
                appearances: 0,
                relationships: [
                    { to: 'Jacob', nature: 'Beloved son' },
                    { to: 'Brothers', nature: 'Betrayed → Reconciled' }
                ]
            },
            {
                id: 'char-jacob',
                name: 'Jacob',
                role: 'Father Figure',
                description: 'Patriarch who favors Joseph',
                appearances: 0,
                relationships: [
                    { to: 'Joseph', nature: 'Favored son' }
                ]
            },
            {
                id: 'char-brothers',
                name: 'The Brothers',
                role: 'Antagonists → Transformed',
                description: 'Envious siblings who sell Joseph into slavery',
                appearances: 0,
                relationships: [
                    { to: 'Joseph', nature: 'Jealousy → Repentance' }
                ]
            }
        ];
    },
    
    // Create default location catalog
    createDefaultLocations() {
        return [
            {
                id: 'loc-canaan',
                name: 'Canaan',
                subtitle: 'The Land of Promise',
                description: 'The ancestral home where Joseph begins his journey as the favored son.',
                significance: 'Represents the ordinary world and established order before the call to adventure.',
                sceneCount: 0
            },
            {
                id: 'loc-pit',
                name: 'The Pit',
                subtitle: 'Descent into Darkness',
                description: 'The dry cistern where Joseph is thrown by his brothers.',
                significance: 'Symbol of death, betrayal, and the lowest point before transformation.',
                sceneCount: 0
            },
            {
                id: 'loc-egypt',
                name: 'Egypt',
                subtitle: 'Land of Trial and Elevation',
                description: 'The foreign land where Joseph experiences slavery, prison, and eventual exaltation.',
                significance: 'Represents the crucible of refinement and God\'s larger plan unfolding.',
                sceneCount: 0
            },
            {
                id: 'loc-palace',
                name: 'Pharaoh\'s Palace',
                subtitle: 'Seat of Power',
                description: 'Where Joseph interprets dreams and becomes second-in-command.',
                significance: 'The culmination of Joseph\'s rise - from pit to palace, demonstrating divine providence.',
                sceneCount: 0
            }
        ];
    },
    
    // Create default research notes
    createDefaultResearch() {
        return [
            {
                id: 'research-genesis-overview',
                title: 'Genesis 37-50: The Joseph Narrative',
                scripture: 'Genesis 37:3 - "Now Israel loved Joseph more than any of his other sons, because he had been born to him in his old age; and he made an ornate robe for him."',
                citation: 'Genesis 37:3 (NIV)',
                notes: 'The story of Joseph spans Genesis chapters 37-50, making it one of the longest continuous narratives in Genesis. It bridges the patriarchal narratives and the Exodus story.'
            },
            {
                id: 'research-coat-symbolism',
                title: 'The Coat of Many Colors',
                scripture: 'Genesis 37:3',
                citation: 'Genesis 37:3',
                notes: 'The Hebrew term suggests a long-sleeved robe worn by royalty and the wealthy. It symbolized Jacob\'s favoritism and Joseph\'s special status, provoking his brothers\' jealousy.'
            },
            {
                id: 'research-providence-theme',
                title: 'Divine Providence Theme',
                scripture: 'Genesis 50:20 - "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives."',
                citation: 'Genesis 50:20 (NIV)',
                notes: 'The central theological theme: God\'s sovereignty working through human choices, both good and evil, to accomplish His purposes.'
            }
        ];
    },
    
    // Create default symbolic elements
    createDefaultSymbols() {
        return [
            {
                id: 'symbol-coat',
                icon: '👑',
                name: 'The Coat',
                meaning: 'Symbol of favor, identity, and the cost of being set apart. Stripped away in betrayal, representing loss of status and innocence.',
                appearances: []
            },
            {
                id: 'symbol-dreams',
                icon: '✨',
                name: 'The Dreams',
                meaning: 'Divine revelation and prophetic insight. Joseph\'s gift becomes both his curse and his salvation.',
                appearances: []
            },
            {
                id: 'symbol-pit',
                icon: '🕳️',
                name: 'The Pit',
                meaning: 'Death and rebirth. The descent that precedes elevation. Every hero must face the pit before the palace.',
                appearances: []
            },
            {
                id: 'symbol-cup',
                icon: '🏆',
                name: 'The Silver Cup',
                meaning: 'Test of character and instrument of revelation. Used to bring Joseph\'s brothers to repentance.',
                appearances: []
            },
            {
                id: 'symbol-famine',
                icon: '🌾',
                name: 'Bread & Famine',
                meaning: 'Physical and spiritual hunger. God\'s provision in the midst of scarcity. The means of reconciliation.',
                appearances: []
            }
        ];
    },
    
    // Save methods
    saveActs() {
        localStorage.setItem('chronicle_acts', JSON.stringify(this.acts));
    },
    
    saveChapters() {
        localStorage.setItem('chronicle_chapters', JSON.stringify(this.chapters));
    },
    
    saveCharacters() {
        localStorage.setItem('chronicle_character_registry', JSON.stringify(this.characters));
    },
    
    saveLocations() {
        localStorage.setItem('chronicle_location_catalog', JSON.stringify(this.locations));
    },
    
    saveResearch() {
        localStorage.setItem('chronicle_research_notes', JSON.stringify(this.researchNotes));
    },
    
    saveSymbols() {
        localStorage.setItem('chronicle_symbolic_elements', JSON.stringify(this.symbols));
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // View button switching
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
            case 'registry':
                this.renderCharacterRegistry();
                break;
            case 'locations':
                this.renderLocationCatalog();
                break;
            case 'research':
                this.renderResearch();
                break;
            case 'symbols':
                this.renderSymbolicTracker();
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
        
        // Attach click handlers
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
        const maxY = data.maxWords * 1.1;
        
        const points = data.dataPoints.map((point, index) => {
            const x = padding + (index / (data.dataPoints.length - 1)) * width;
            const y = padding + height - (point.wordCount / maxY) * height;
            return { x, y, ...point };
        });
        
        const linePath = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');
        
        const areaPath = `M ${padding} ${padding + height} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${padding + width} ${padding + height} Z`;
        
        let svg = `
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + height}" stroke="#8B7355" stroke-width="2"/>
            <line x1="${padding}" y1="${padding + height}" x2="${padding + width}" y2="${padding + height}" stroke="#8B7355" stroke-width="2"/>
            
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
            
            <path d="${areaPath}" fill="url(#pacingGradient)" opacity="0.3"/>
            <path d="${linePath}" fill="none" stroke="#C9A961" stroke-width="3"/>
            
            ${points.map(p => {
                const color = this.getMcKeeColor(p.mckeeStructure);
                return `
                    <circle cx="${p.x}" cy="${p.y}" r="5" fill="${color}" stroke="#2a2822" stroke-width="2">
                        <title>${p.title || 'Untitled'} - ${p.wordCount} words</title>
                    </circle>
                `;
            }).join('')}
            
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
        
        const longestScene = Math.max(...data.dataPoints.map(d => d.wordCount));
        const shortestScene = Math.min(...data.dataPoints.map(d => d.wordCount));
        const variance = longestScene - shortestScene;
        
        if (variance > data.avgWordsPerScene * 3) {
            insights += '<li>⚠️ <strong>High variance detected</strong> - Some scenes are significantly longer than others. Consider balancing scene lengths for consistent pacing.</li>';
        }
        
        const act2Scenes = data.dataPoints.filter(d => d.actId === 'act-2');
        const act2Words = act2Scenes.reduce((sum, s) => sum + s.wordCount, 0);
        const act2Percentage = (act2Words / data.totalWords) * 100;
        
        if (act2Percentage < 40) {
            insights += '<li>📖 <strong>Act II may be underdeveloped</strong> - The middle act should typically comprise 40-50% of your story.</li>';
        }
        
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
        
        const characters = this.extractCharacters();
        
        if (characters.length === 0) {
            canvas.innerHTML = this.getEmptyStateHTML('Character Arc Tracker', 'Add character tags to your scenes to track their journeys.');
            return;
        }
        
        let html = `
            <div class="character-arc-container">
                <div class="graph-header">
                    <h2>Character Arc Tracker</h2>
                    <p>"Track each soul's journey across the narrative tapestry"</p>
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
            { key: 'firstplot', label: 'First Plot Point', act: 1 },
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
    // SPRINT 3: CHARACTER REGISTRY
    // ===================================
    
    renderCharacterRegistry() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Update appearance counts
        this.updateCharacterAppearances();
        
        let html = `
            <div class="character-registry-container">
                <div class="graph-header">
                    <h2>Character Registry</h2>
                    <p>"Deep profiles and relationship webs"</p>
                </div>
                
                <div class="registry-grid">
        `;
        
        this.characters.forEach(char => {
            html += `
                <div class="registry-character-card">
                    <h3 class="character-name">${char.name}</h3>
                    <div class="character-role">${char.role}</div>
                    <p style="color: #b8b3aa; font-family: 'Crimson Text', serif; line-height: 1.6; margin-bottom: 1.5rem;">${char.description}</p>
                    
                    <div class="character-stats-grid">
                        <div class="character-stat">
                            <div class="stat-value-large">${char.appearances}</div>
                            <div class="stat-label-small">Appearances</div>
                        </div>
                        <div class="character-stat">
                            <div class="stat-value-large">${char.relationships.length}</div>
                            <div class="stat-label-small">Relationships</div>
                        </div>
                    </div>
                    
                    <div class="character-relationships">
                        <h4 style="font-family: 'Cinzel', serif; color: #C9A961; font-size: 1rem; margin-bottom: 0.75rem; letter-spacing: 0.05em;">RELATIONSHIPS</h4>
                        ${char.relationships.map(rel => `
                            <div class="relationship-item">
                                <span class="relationship-arrow">→</span>
                                <span class="relationship-text"><strong>${rel.to}</strong>: ${rel.nature}</span>
                            </div>
                        `).join('')}
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
    
    updateCharacterAppearances() {
        this.characters.forEach(char => {
            const appearances = this.scenes.filter(scene => 
                scene.characters && scene.characters.includes(char.name)
            );
            char.appearances = appearances.length;
        });
    },
    
    // ===================================
    // SPRINT 3: LOCATION CATALOG
    // ===================================
    
    renderLocationCatalog() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Update scene counts
        this.updateLocationSceneCounts();
        
        let html = `
            <div class="location-catalog-container">
                <div class="graph-header">
                    <h2>Location Catalog</h2>
                    <p>"Settings and their sacred significance"</p>
                </div>
                
                <div class="location-grid">
        `;
        
        this.locations.forEach(loc => {
            html += `
                <div class="location-card">
                    <div class="location-header">
                        <h3 class="location-name">${loc.name}</h3>
                        <div class="location-subtitle">${loc.subtitle}</div>
                    </div>
                    <div class="location-body">
                        <p class="location-description">${loc.description}</p>
                        <div class="location-significance">
                            <strong>Significance:</strong> ${loc.significance}
                        </div>
                        <div class="location-scenes">
                            📍 ${loc.sceneCount} scene${loc.sceneCount !== 1 ? 's' : ''} set here
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
    
    updateLocationSceneCounts() {
        this.locations.forEach(loc => {
            const count = this.scenes.filter(scene => 
                scene.location && scene.location === loc.name
            ).length;
            loc.sceneCount = count;
        });
    },
    
    // ===================================
    // SPRINT 3: RESEARCH & PARALLELS
    // ===================================
    
    renderResearch() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        let html = `
            <div class="research-container">
                <div class="graph-header">
                    <h2>Research & Biblical Parallels</h2>
                    <p>"Scripture references and theological grounding"</p>
                </div>
                
                <div class="research-grid">
        `;
        
        this.researchNotes.forEach(note => {
            html += `
                <div class="research-section">
                    <div class="research-section-header">
                        <h3 class="research-section-title">${note.title}</h3>
                    </div>
                    <div class="research-section-body">
                        <div class="scripture-ref">
                            <div class="scripture-verse">${note.scripture}</div>
                            <div class="scripture-citation">— ${note.citation}</div>
                        </div>
                        <div class="research-note">
                            ${note.notes}
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
    
    // ===================================
    // SPRINT 3: SYMBOLIC TRACKER
    // ===================================
    
    renderSymbolicTracker() {
        const canvas = document.getElementById('canvas-content');
        if (!canvas) return;
        
        // Update appearances
        this.updateSymbolAppearances();
        
        let html = `
            <div class="symbolic-tracker-container">
                <div class="graph-header">
                    <h2>Symbolic Elements Tracker</h2>
                    <p>"Motifs that weave through the narrative tapestry"</p>
                </div>
                
                <div class="symbol-grid">
        `;
        
        this.symbols.forEach(symbol => {
            html += `
                <div class="symbol-card">
                    <div class="symbol-icon">${symbol.icon}</div>
                    <h3 class="symbol-name">${symbol.name}</h3>
                    <p class="symbol-meaning">${symbol.meaning}</p>
                    <div class="symbol-appearances">
                        <div class="appearances-title">Appears In:</div>
                        ${symbol.appearances.length > 0 
                            ? symbol.appearances.map(app => `<span class="appearance-tag">${app}</span>`).join('')
                            : '<span style="font-style: italic; color: #8a8580;">Not yet tracked in scenes</span>'
                        }
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
    
    updateSymbolAppearances() {
        this.symbols.forEach(symbol => {
            // This would ideally track which scenes reference each symbol
            // For now, we'll initialize with empty arrays
            // In a full implementation, scenes would have a 'symbols' array property
            symbol.appearances = [];
        });
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

console.log('📜 Covenant workspace module loaded (Complete: Sprints 1-3)');