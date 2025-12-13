// ===================================
// THE COVENANT - Analysis Tools
// "The crucible for silver and the furnace for gold, 
//  but the LORD tests the heart" - Proverbs 17:3
//
// Sprint 2: The Craftsman's Tools
// - Pacing Graph
// - Character Arc Tracker
// - Theme Distribution Map
// - Conflict Analysis
// ===================================

const CovenantAnalysis = {
    // Chart colors
    colors: {
        primary: '#C9A961',    // Gold
        secondary: '#2C5F5F',  // Teal
        tertiary: '#722F37',   // Burgundy
        neutral: '#8a8580',
        background: 'rgba(26, 20, 16, 0.6)',
        gridLine: 'rgba(139, 115, 85, 0.2)'
    },
    
    // Selected character for arc view
    selectedCharacter: null,
    
    // ===================================
    // PACING VIEW - Word Count & Tension
    // ===================================
    
    renderPacingView(container) {
        const scenes = ChronicleCovenant.getScenes();
        const acts = ChronicleCovenant.getActs();
        
        let html = `<div class="pacing-view active">`;
        
        html += `
            <div class="pacing-header">
                <h2 class="beat-sheet-title">Pacing Analysis</h2>
            </div>
        `;
        
        if (scenes.length === 0) {
            html += `
                <div class="beat-sheet-empty">
                    <h3>No Scenes to Analyze</h3>
                    <p>Begin writing scenes in The Desk. Once you have content, return here to analyze your story's pacing, word distribution, and tension curves.</p>
                </div>
            `;
        } else {
            // Chart container
            html += `
                <div class="pacing-chart-container">
                    <div class="pacing-chart" id="pacingChart">
                        ${this.generatePacingSVG(scenes, acts)}
                    </div>
                    <div class="pacing-legend">
                        <div class="pacing-legend-item">
                            <span class="pacing-legend-line words"></span>
                            <span>Word Count</span>
                        </div>
                        <div class="pacing-legend-item">
                            <span class="pacing-legend-line tension"></span>
                            <span>Estimated Tension</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Insights
            html += `
                <div class="pacing-insights">
                    ${this.generatePacingInsights(scenes, acts)}
                </div>
            `;
        }
        
        html += `</div>`;
        container.innerHTML = html;
    },
    
    generatePacingSVG(scenes, acts) {
        if (scenes.length === 0) return '';
        
        const width = 800;
        const height = 250;
        const padding = { top: 20, right: 30, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Sort scenes by act order, then by internal order
        const sortedScenes = this.sortScenesByStructure(scenes, acts);
        
        // Get max word count for scaling
        const maxWords = Math.max(...scenes.map(s => s.wordCount || 0), 100);
        
        // Generate data points
        const wordPoints = [];
        const tensionPoints = [];
        
        sortedScenes.forEach((scene, index) => {
            const x = padding.left + (index / (sortedScenes.length - 1 || 1)) * chartWidth;
            const wordY = padding.top + chartHeight - ((scene.wordCount || 0) / maxWords) * chartHeight;
            const tension = this.estimateTension(scene, index, sortedScenes.length);
            const tensionY = padding.top + chartHeight - tension * chartHeight;
            
            wordPoints.push(`${x},${wordY}`);
            tensionPoints.push(`${x},${tensionY}`);
        });
        
        // Generate act dividers
        let actDividers = '';
        let currentX = padding.left;
        let sceneCount = 0;
        
        acts.forEach((act, actIndex) => {
            const actScenes = sortedScenes.filter(s => s.actId === act.id);
            if (actScenes.length > 0) {
                sceneCount += actScenes.length;
                const dividerX = padding.left + (sceneCount / sortedScenes.length) * chartWidth;
                
                if (actIndex < acts.length - 1) {
                    actDividers += `
                        <line x1="${dividerX}" y1="${padding.top}" 
                            x2="${dividerX}" y2="${padding.top + chartHeight}"
                            stroke="${this.colors.gridLine}" stroke-width="2" stroke-dasharray="5,5"/>
                    `;
                }
                
                // Act label
                const labelX = (currentX + dividerX) / 2;
                actDividers += `
                    <text x="${labelX}" y="${height - 10}" 
                        text-anchor="middle" class="chart-axis-label"
                        fill="${this.colors.primary}">${act.name}</text>
                `;
                
                currentX = dividerX;
            }
        });
        
        return `
            <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
                <!-- Grid lines -->
                ${this.generateGridLines(width, height, padding, chartHeight)}
                
                <!-- Act dividers -->
                ${actDividers}
                
                <!-- Y-axis label -->
                <text x="15" y="${height/2}" transform="rotate(-90 15 ${height/2})" 
                    text-anchor="middle" class="chart-axis-label" fill="${this.colors.neutral}">
                    Words / Tension
                </text>
                
                <!-- Word count line (smooth curve) -->
                <path d="M ${wordPoints.join(' L ')}" 
                    fill="none" 
                    stroke="${this.colors.secondary}" 
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
                
                <!-- Tension line (smooth curve) -->
                <path d="M ${tensionPoints.join(' L ')}" 
                    fill="none" 
                    stroke="${this.colors.tertiary}" 
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-dasharray="8,4"/>
                
                <!-- Data points for words -->
                ${sortedScenes.map((scene, i) => {
                    const x = padding.left + (i / (sortedScenes.length - 1 || 1)) * chartWidth;
                    const y = padding.top + chartHeight - ((scene.wordCount || 0) / maxWords) * chartHeight;
                    return `<circle cx="${x}" cy="${y}" r="5" fill="${this.colors.secondary}" 
                                    style="cursor: pointer" onclick="CovenantAnalysis.showSceneTooltip('${scene.id}')"/>`;
                }).join('')}
            </svg>
        `;
    },
    
    generateGridLines(width, height, padding, chartHeight) {
        let lines = '';
        const steps = 5;
        
        for (let i = 0; i <= steps; i++) {
            const y = padding.top + (i / steps) * chartHeight;
            lines += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                        stroke="${this.colors.gridLine}" stroke-width="1"/>`;
        }
        
        return lines;
    },
    
    estimateTension(scene, index, totalScenes) {
        // Estimate tension based on McKee element and position
        let tension = 0.3; // baseline
        
        // Position-based tension (rising action)
        const position = index / totalScenes;
        tension += position * 0.3;
        
        // McKee element adjustments
        const mckee = scene.mckeeData?.structureElement;
        if (mckee) {
            const tensionBoosts = {
                opening: -0.2,
                inciting: 0.2,
                lockin: 0.15,
                complications: 0.1,
                midpoint: 0.25,
                crisis: 0.4,
                climax: 0.5,
                resolution: -0.3,
                closing: -0.4
            };
            tension += tensionBoosts[mckee] || 0;
        }
        
        // Forces adjustments
        const forces = scene.mckeeData?.forces || [];
        tension += forces.length * 0.05;
        
        return Math.max(0.1, Math.min(1, tension));
    },
    
    generatePacingInsights(scenes, acts) {
        const insights = [];
        
        // Word count analysis
        const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
        const avgWords = Math.round(totalWords / scenes.length);
        
        // Check for pacing issues
        const sortedByWords = [...scenes].sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
        const longest = sortedByWords[0];
        const shortest = sortedByWords[sortedByWords.length - 1];
        
        if (longest && shortest && (longest.wordCount || 0) > (shortest.wordCount || 1) * 5) {
            insights.push({
                type: 'warning',
                title: 'Uneven Scene Length',
                text: `"${longest.title}" is ${Math.round((longest.wordCount || 0) / (shortest.wordCount || 1))}x longer than your shortest scene. Consider balancing.`
            });
        }
        
        // Act balance
        acts.forEach(act => {
            const actWords = scenes.filter(s => s.actId === act.id)
                                .reduce((sum, s) => sum + (s.wordCount || 0), 0);
            const percentage = Math.round((actWords / totalWords) * 100);
            
            if (percentage < 15 && totalWords > 1000) {
                insights.push({
                    type: 'warning',
                    title: `${act.name} May Be Underdeveloped`,
                    text: `Only ${percentage}% of your total word count. Traditional structure suggests more balance.`
                });
            }
        });
        
        // Good patterns
        const midpointScene = scenes.find(s => s.mckeeData?.structureElement === 'midpoint');
        if (midpointScene) {
            const midpointIndex = scenes.indexOf(midpointScene);
            const expectedMid = scenes.length / 2;
            if (Math.abs(midpointIndex - expectedMid) <= 2) {
                insights.push({
                    type: 'good',
                    title: 'Well-Placed Midpoint',
                    text: 'Your midpoint reversal is positioned well within your narrative structure.'
                });
            }
        }
        
        // Summary insight
        insights.push({
            type: 'neutral',
            title: 'Overall Statistics',
            text: `${scenes.length} scenes • ${totalWords.toLocaleString()} total words • ~${avgWords.toLocaleString()} words per scene`
        });
        
        return insights.map(i => `
            <div class="pacing-insight-card ${i.type === 'warning' ? 'pacing-insight-warning' : i.type === 'good' ? 'pacing-insight-good' : ''}">
                <h4>${i.title}</h4>
                <p>${i.text}</p>
            </div>
        `).join('');
    },
    
    sortScenesByStructure(scenes, acts) {
        return [...scenes].sort((a, b) => {
            // First by act order
            const actA = acts.find(act => act.id === a.actId);
            const actB = acts.find(act => act.id === b.actId);
            const actOrderA = actA ? actA.order : 999;
            const actOrderB = actB ? actB.order : 999;
            
            if (actOrderA !== actOrderB) return actOrderA - actOrderB;
            
            // Then by scene order within act
            return (a.order || 0) - (b.order || 0);
        });
    },
    
    showSceneTooltip(sceneId) {
        ChronicleCovenant.selectScene(sceneId);
    },
    
    // ===================================
    // CHARACTER ARC VIEW
    // ===================================
    
    renderCharactersView(container) {
        const characters = this.getCharacters();
        const scenes = ChronicleCovenant.getScenes();
        
        let html = `<div class="characters-view active">`;
        
        html += `
            <div class="characters-header">
                <h2 class="beat-sheet-title">Character Arc Tracking</h2>
            </div>
        `;
        
        if (characters.length === 0) {
            html += `
                <div class="beat-sheet-empty">
                    <h3>No Characters Defined</h3>
                    <p>Characters are created in The Desk. Add characters to your story to track their arcs and appearances across scenes.</p>
                </div>
            `;
        } else {
            // Character selector chips
            html += `
                <div class="character-selector">
                    ${characters.map(char => `
                        <button class="character-chip ${this.selectedCharacter === char.id ? 'active' : ''}"
                                onclick="CovenantAnalysis.selectCharacter('${char.id}')">
                            ${char.name}
                        </button>
                    `).join('')}
                </div>
            `;
            
            // Character arc visualization
            if (this.selectedCharacter) {
                const character = characters.find(c => c.id === this.selectedCharacter);
                if (character) {
                    html += this.renderCharacterArc(character, scenes);
                }
            } else {
                html += `
                    <div class="character-arc-container">
                        <p style="text-align: center; color: #8a8580; padding: 2rem;">
                            Select a character above to view their arc and appearances.
                        </p>
                    </div>
                `;
            }
        }
        
        html += `</div>`;
        container.innerHTML = html;
    },
    
    selectCharacter(charId) {
        this.selectedCharacter = charId;
        const container = document.getElementById('covenantCanvasContent');
        if (container) {
            this.renderCharactersView(container);
        }
    },
    
    renderCharacterArc(character, scenes) {
        // Find scenes where this character appears (by name mention or explicit tagging)
        const appearances = scenes.filter(scene => {
            // Check if character is tagged in scene (future feature)
            if (scene.characters && scene.characters.includes(character.id)) return true;
            
            // Check if character name appears in content
            if (scene.content && scene.content.toLowerCase().includes(character.name.toLowerCase())) {
                return true;
            }
            
            return false;
        });
        
        let html = `
            <div class="character-arc-container">
                <h3 style="color: var(--gold); margin-bottom: 1rem; font-family: 'Cinzel', serif;">
                    ${character.name}
                </h3>
                <p style="color: #b8b3aa; margin-bottom: 1rem; font-style: italic;">
                    ${character.role || 'No role defined'} 
                    ${character.arc ? `— Arc: ${character.arc}` : ''}
                </p>
        `;
        
        if (appearances.length === 0) {
            html += `
                <p style="color: #8a8580; text-align: center; padding: 2rem;">
                    No appearances detected. Character appearances are tracked by name mentions in scene content or explicit tagging.
                </p>
            `;
        } else {
            // Appearance list
            html += `
                <h4 style="color: var(--teal); font-size: 0.85rem; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
                    APPEARANCES (${appearances.length} scenes)
                </h4>
                <div class="character-appearances">
                    ${appearances.map(scene => `
                        <div class="character-appearance-item" 
                            onclick="ChronicleCovenant.selectScene('${scene.id}')">
                            ${scene.title || 'Untitled'} 
                            <small style="color: #8a8580;">(${(scene.wordCount || 0).toLocaleString()} words)</small>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Arc summary
            if (character.arc) {
                html += `
                    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(139, 115, 85, 0.2);">
                        <h4 style="color: var(--teal); font-size: 0.85rem; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
                            CHARACTER ARC
                        </h4>
                        <p style="color: #e8e3da; line-height: 1.6;">${character.arc}</p>
                    </div>
                `;
            }
        }
        
        html += `</div>`;
        return html;
    },
    
    getCharacters() {
        return JSON.parse(localStorage.getItem('chronicle_characters') || '[]');
    },
    
    // ===================================
    // THEME DISTRIBUTION VIEW
    // ===================================
    
    renderThemesView(container) {
        const themes = this.getThemes();
        const scenes = ChronicleCovenant.getScenes();
        const acts = ChronicleCovenant.getActs();
        
        let html = `<div class="themes-view active">`;
        
        html += `
            <div class="themes-header">
                <h2 class="beat-sheet-title">Theme Distribution</h2>
            </div>
        `;
        
        if (themes.length === 0) {
            html += `
                <div class="beat-sheet-empty">
                    <h3>No Themes Defined</h3>
                    <p>Themes are created in The Desk. Add themes to your story to see how they distribute across your narrative structure.</p>
                </div>
            `;
        } else if (acts.length === 0) {
            html += `
                <div class="beat-sheet-empty">
                    <h3>No Acts Defined</h3>
                    <p>Create acts in the sidebar to see theme distribution across your story structure.</p>
                </div>
            `;
        } else {
            // Heat map
            html += `
                <div class="theme-heatmap-container">
                    ${this.renderThemeHeatmap(themes, scenes, acts)}
                </div>
            `;
            
            // Theme statistics
            html += `
                <div class="theme-stats">
                    ${this.renderThemeStats(themes, scenes)}
                </div>
            `;
        }
        
        html += `</div>`;
        container.innerHTML = html;
    },
    
    renderThemeHeatmap(themes, scenes, acts) {
        // Header row with act names
        let html = `
            <div class="theme-heatmap-header">
                ${acts.map(act => `<span class="theme-heatmap-act-label">${act.name}</span>`).join('')}
            </div>
            <div class="theme-heatmap">
        `;
        
        // Row for each theme
        themes.forEach(theme => {
            html += `
                <div class="theme-heatmap-row">
                    <span class="theme-heatmap-label">${theme.name}</span>
                    <div class="theme-heatmap-cells">
            `;
            
            // Cell for each act
            acts.forEach(act => {
                const actScenes = scenes.filter(s => s.actId === act.id);
                
                // Count theme mentions (by scene tags or content analysis)
                let themeCount = 0;
                actScenes.forEach(scene => {
                    // Check tagged themes
                    if (scene.themes && scene.themes.includes(theme.name)) {
                        themeCount++;
                    }
                    // Simple content check for theme name
                    else if (scene.content && scene.content.toLowerCase().includes(theme.name.toLowerCase())) {
                        themeCount++;
                    }
                });
                
                // Determine heat level (0-5)
                const maxPossible = actScenes.length || 1;
                const intensity = Math.min(5, Math.round((themeCount / maxPossible) * 5));
                
                html += `
                    <div class="theme-heatmap-cell theme-heat-${intensity}" 
                        title="${theme.name} in ${act.name}: ${themeCount}/${actScenes.length} scenes">
                    </div>
                `;
            });
            
            html += `</div></div>`;
        });
        
        html += `</div>`;
        return html;
    },
    
    renderThemeStats(themes, scenes) {
        return themes.map(theme => {
            // Count total appearances
            let count = 0;
            scenes.forEach(scene => {
                if (scene.themes && scene.themes.includes(theme.name)) {
                    count++;
                } else if (scene.content && scene.content.toLowerCase().includes(theme.name.toLowerCase())) {
                    count++;
                }
            });
            
            const percentage = scenes.length > 0 ? Math.round((count / scenes.length) * 100) : 0;
            
            return `
                <div class="theme-stat-card">
                    <div class="theme-stat-name">${theme.name}</div>
                    <div class="theme-stat-value">${count}</div>
                    <div class="theme-stat-label">scenes (${percentage}%)</div>
                </div>
            `;
        }).join('');
    },
    
    getThemes() {
        return JSON.parse(localStorage.getItem('chronicle_themes') || '[]');
    },
    
    // ===================================
    // CONFLICT ANALYSIS (McKee's 4 Forces)
    // ===================================
    
    renderConflictView(container) {
        const scenes = ChronicleCovenant.getScenes();
        const acts = ChronicleCovenant.getActs();
        
        // Count forces by act
        const forceData = this.analyzeConflictForces(scenes, acts);
        
        let html = `
            <div class="pacing-view active">
                <div class="pacing-header">
                    <h2 class="beat-sheet-title">Conflict Analysis</h2>
                    <p style="color: #8a8580; font-style: italic;">McKee's Four Forces of Antagonism</p>
                </div>
        `;
        
        if (scenes.length === 0) {
            html += `
                <div class="beat-sheet-empty">
                    <h3>No Scenes to Analyze</h3>
                    <p>Tag scenes with antagonistic forces in The Desk to see how conflict types distribute across your story.</p>
                </div>
            `;
        } else {
            // Force distribution chart (simplified bar representation)
            html += `
                <div class="pacing-chart-container">
                    ${this.renderForceDistribution(forceData, acts)}
                </div>
                
                <div class="pacing-insights">
                    ${this.generateConflictInsights(forceData)}
                </div>
            `;
        }
        
        html += `</div>`;
        container.innerHTML = html;
    },
    
    analyzeConflictForces(scenes, acts) {
        const forces = ['internal', 'personal', 'extrapersonal', 'environmental'];
        const data = {};
        
        acts.forEach(act => {
            data[act.id] = {
                name: act.name,
                forces: {}
            };
            
            forces.forEach(force => {
                data[act.id].forces[force] = 0;
            });
            
            // Count forces in act's scenes
            const actScenes = scenes.filter(s => s.actId === act.id);
            actScenes.forEach(scene => {
                const sceneForces = scene.mckeeData?.forces || [];
                sceneForces.forEach(force => {
                    if (data[act.id].forces[force] !== undefined) {
                        data[act.id].forces[force]++;
                    }
                });
            });
        });
        
        return data;
    },
    
    renderForceDistribution(forceData, acts) {
        const forceColors = {
            internal: '#9370DB',      // Purple - inner struggles
            personal: '#CD853F',      // Peru - relationships
            extrapersonal: '#2E8B57', // Sea green - society
            environmental: '#4682B4'  // Steel blue - world
        };
        
        const forceLabels = {
            internal: 'Internal',
            personal: 'Personal',
            extrapersonal: 'Extra-Personal',
            environmental: 'Environmental'
        };
        
        let html = '<div style="display: flex; flex-direction: column; gap: 1.5rem;">';
        
        acts.forEach(act => {
            const actData = forceData[act.id];
            if (!actData) return;
            
            const total = Object.values(actData.forces).reduce((sum, v) => sum + v, 0) || 1;
            
            html += `
                <div>
                    <div style="color: var(--gold); font-family: 'Cinzel', serif; margin-bottom: 0.5rem;">${act.name}</div>
                    <div style="display: flex; height: 30px; border-radius: 4px; overflow: hidden; background: rgba(26, 20, 16, 0.4);">
            `;
            
            Object.entries(actData.forces).forEach(([force, count]) => {
                const percentage = (count / total) * 100;
                if (percentage > 0) {
                    html += `
                        <div style="width: ${percentage}%; background: ${forceColors[force]}; 
                                    display: flex; align-items: center; justify-content: center;
                                    font-size: 0.7rem; color: white; font-weight: 600;">
                            ${count > 0 ? count : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div></div>`;
        });
        
        // Legend
        html += `
            <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                ${Object.entries(forceColors).map(([force, color]) => `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 16px; height: 16px; background: ${color}; border-radius: 3px;"></span>
                        <span style="font-size: 0.85rem; color: #b8b3aa;">${forceLabels[force]}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        html += '</div>';
        return html;
    },
    
    generateConflictInsights(forceData) {
        const insights = [];
        
        // Aggregate force counts
        const totalForces = {
            internal: 0,
            personal: 0,
            extrapersonal: 0,
            environmental: 0
        };
        
        Object.values(forceData).forEach(actData => {
            Object.entries(actData.forces).forEach(([force, count]) => {
                totalForces[force] += count;
            });
        });
        
        const total = Object.values(totalForces).reduce((sum, v) => sum + v, 0);
        
        if (total === 0) {
            insights.push({
                type: 'neutral',
                title: 'No Forces Tagged',
                text: 'Tag scenes with antagonistic forces in The Desk using the McKee panel to see conflict distribution.'
            });
        } else {
            // Find dominant force
            const dominant = Object.entries(totalForces).sort((a, b) => b[1] - a[1])[0];
            const dominantPercentage = Math.round((dominant[1] / total) * 100);
            
            const forceNames = {
                internal: 'Internal Forces (fears, doubts, flaws)',
                personal: 'Personal Forces (family, relationships)',
                extrapersonal: 'Extra-Personal Forces (society, institutions)',
                environmental: 'Environmental Forces (nature, fate)'
            };
            
            insights.push({
                type: 'neutral',
                title: 'Dominant Conflict Type',
                text: `${forceNames[dominant[0]]} dominates your story at ${dominantPercentage}% of tagged scenes.`
            });
            
            // Check for missing forces
            const missing = Object.entries(totalForces).filter(([_, count]) => count === 0);
            if (missing.length > 0 && total > 5) {
                insights.push({
                    type: 'warning',
                    title: 'Unexplored Forces',
                    text: `Consider adding ${missing.map(([f]) => f).join(', ')} conflict to create a richer antagonistic landscape.`
                });
            }
            
            // Balance check
            if (dominantPercentage > 60 && total > 5) {
                insights.push({
                    type: 'warning',
                    title: 'Force Imbalance',
                    text: 'Your story may benefit from more diverse conflict types. Great stories often weave multiple forces together.'
                });
            }
        }
        
        return insights.map(i => `
            <div class="pacing-insight-card ${i.type === 'warning' ? 'pacing-insight-warning' : i.type === 'good' ? 'pacing-insight-good' : ''}">
                <h4>${i.title}</h4>
                <p>${i.text}</p>
            </div>
        `).join('');
    }
};

// Override the stub methods in ChronicleCovenant with actual implementations
ChronicleCovenant.renderPacingView = function(container) {
    CovenantAnalysis.renderPacingView(container);
};

ChronicleCovenant.renderCharactersView = function(container) {
    CovenantAnalysis.renderCharactersView(container);
};

ChronicleCovenant.renderThemesView = function(container) {
    CovenantAnalysis.renderThemesView(container);
};

// Make globally available
window.CovenantAnalysis = CovenantAnalysis;

console.log('📊 Chronicle Covenant Analysis module loaded');
console.log('"The crucible for silver and the furnace for gold" - Proverbs 17:3');
