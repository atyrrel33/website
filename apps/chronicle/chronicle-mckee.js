// ===================================
// CHRONICLE McKEE INTEGRATION
// Story Structure According to Eternal Principles
// "The fear of the LORD is the beginning of wisdom"
// ===================================

const McKeeSystem = {
    // McKee Story Structure Elements
    structureElements: {
        opening: {
            name: 'Opening Image',
            description: 'Protagonist in ordinary world, before the story begins',
            position: 'Act One - Setup',
            duration: '1-3 minutes'
        },
        inciting: {
            name: 'Inciting Incident',
            description: 'Event that radically upsets the balance of forces',
            position: 'Act One - Setup',
            duration: '10-15 minutes in'
        },
        lockin: {
            name: 'Lock-In / First Act Climax',
            description: 'Point of no return - irrevocable commitment',
            position: 'Act One - End',
            duration: '20-30 minutes in'
        },
        complications: {
            name: 'Progressive Complications',
            description: 'Escalating obstacles and resistance',
            position: 'Act Two - Development',
            duration: '30-60 minutes'
        },
        midpoint: {
            name: 'Midpoint Reversal',
            description: 'Major revelation that changes everything',
            position: 'Act Two - Center',
            duration: '55-65 minutes in'
        },
        crisis: {
            name: 'Crisis / Dark Night',
            description: 'Impossible dilemma - choice between irreconcilable goods',
            position: 'Act Three - Setup',
            duration: 'Final 20-30 minutes'
        },
        climax: {
            name: 'Climax',
            description: 'Final confrontation - central dramatic question answered',
            position: 'Act Three - Peak',
            duration: 'Final 10-15 minutes'
        },
        resolution: {
            name: 'Resolution',
            description: 'New equilibrium - consequences of climax',
            position: 'Act Three - Denouement',
            duration: 'Final 5-10 minutes'
        },
        closing: {
            name: 'Closing Image',
            description: 'Visual transformation - contrast with opening',
            position: 'Act Three - Final Beat',
            duration: 'Final 1-3 minutes'
        }
    },

    // The Four Forces of Antagonism
    forces: {
        internal: {
            name: 'Internal Forces',
            description: 'Fears, doubts, wounds, flaws, contradictory desires',
            examples: ['Guilt', 'Self-doubt', 'Repressed anger', 'Addiction', 'Pride']
        },
        personal: {
            name: 'Personal Forces',
            description: 'Conflicts with family, friends, lovers, direct antagonists',
            examples: ['Betrayal', 'Family conflict', 'Romantic tension', 'Rivalry']
        },
        extrapersonal: {
            name: 'Extra-Personal Forces',
            description: 'Social institutions, class, politics, economics, culture',
            examples: ['Class inequality', 'Systemic oppression', 'Legal system', 'Corporate power']
        },
        environmental: {
            name: 'Environmental Forces',
            description: 'Physical world, nature, time, fate, accidents',
            examples: ['Natural disaster', 'Time running out', 'Physics', 'Fate/luck']
        }
    },

    // Drag state
    dragState: {
        isDragging: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    },

    // Initialize McKee system
    init() {
            console.log('📖 McKee System initializing...');
            this.setupMetadataPanel();
            this.setupDraggable();  // ADD THIS LINE
            this.loadSceneMetadata();
            console.log('✅ McKee System ready');
        },
    // Setup metadata panel interactions
    setupMetadataPanel() {
        const panel = document.getElementById('sceneMetadataPanel');
        const collapseBtn = document.getElementById('collapseMetadata');
        const structureSelect = document.getElementById('sceneStructureElement');
        const purposeInput = document.getElementById('scenePurpose');
        const forceChecks = document.querySelectorAll('.force-check');

        // Collapse/expand panel
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                panel.classList.toggle('collapsed');
                collapseBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
            });
        }

        // Save metadata on change
        if (structureSelect) {
            structureSelect.addEventListener('change', () => this.saveSceneMetadata());
        }

        if (purposeInput) {
            purposeInput.addEventListener('input', () => {
                clearTimeout(this.purposeTimeout);
                this.purposeTimeout = setTimeout(() => this.saveSceneMetadata(), 500);
            });
        }

        forceChecks.forEach(check => {
            check.addEventListener('change', () => this.saveSceneMetadata());
        });
    },

    
    // Setup draggable functionality
    setupDraggable() {
        const panel = document.getElementById('sceneMetadataPanel');
        const header = panel?.querySelector('.metadata-header');
        
        if (!panel || !header) return;

        header.addEventListener('mousedown', (e) => {
            // Don't drag if clicking the collapse button
            if (e.target.closest('.collapse-metadata')) return;

            this.dragState.isDragging = true;
            this.dragState.startX = e.clientX;
            this.dragState.startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            this.dragState.offsetX = this.dragState.startX - rect.left;
            this.dragState.offsetY = this.dragState.startY - rect.top;

            panel.classList.add('dragging');
            document.body.style.userSelect = 'none';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.dragState.isDragging) return;

            const newX = e.clientX - this.dragState.offsetX;
            const newY = e.clientY - this.dragState.offsetY;

            // Get viewport dimensions
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            // Constrain to viewport
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));

            panel.style.left = constrainedX + 'px';
            panel.style.top = constrainedY + 'px';
            panel.style.right = 'auto'; // Remove right positioning when dragging

            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            if (!this.dragState.isDragging) return;

            this.dragState.isDragging = false;
            panel.classList.remove('dragging');
            document.body.style.userSelect = '';

            // Save position to localStorage
            const rect = panel.getBoundingClientRect();
            localStorage.setItem('mckee-panel-position', JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
        });

        // Load saved position
        this.loadPanelPosition(panel);
    },

    // Load saved panel position
    loadPanelPosition(panel) {
        const savedPosition = localStorage.getItem('mckee-panel-position');
        if (savedPosition) {
            try {
                const { left, top } = JSON.parse(savedPosition);
                panel.style.left = left + 'px';
                panel.style.top = top + 'px';
                panel.style.right = 'auto';
            } catch (e) {
                console.error('Failed to load panel position:', e);
            }
        }
    },

    // Load metadata for current scene
    loadSceneMetadata() {
        if (!ChronicleDesk.currentSceneId) return;

        const scene = ChronicleDesk.scenes.find(s => s.id === ChronicleDesk.currentSceneId);
        if (!scene || !scene.mckeeData) return;

        const structureSelect = document.getElementById('sceneStructureElement');
        const purposeInput = document.getElementById('scenePurpose');
        const forceChecks = document.querySelectorAll('.force-check');

        if (structureSelect && scene.mckeeData.structureElement) {
            structureSelect.value = scene.mckeeData.structureElement;
        }

        if (purposeInput && scene.mckeeData.purpose) {
            purposeInput.value = scene.mckeeData.purpose;
        }

        if (scene.mckeeData.forces && Array.isArray(scene.mckeeData.forces)) {
            forceChecks.forEach(check => {
                check.checked = scene.mckeeData.forces.includes(check.value);
            });
        }
    },

    // Save metadata to current scene
    saveSceneMetadata() {
        if (!ChronicleDesk.currentSceneId) return;

        const sceneIndex = ChronicleDesk.scenes.findIndex(s => s.id === ChronicleDesk.currentSceneId);
        if (sceneIndex === -1) return;

        const structureSelect = document.getElementById('sceneStructureElement');
        const purposeInput = document.getElementById('scenePurpose');
        const forceChecks = document.querySelectorAll('.force-check');

        const selectedForces = Array.from(forceChecks)
            .filter(check => check.checked)
            .map(check => check.value);

        ChronicleDesk.scenes[sceneIndex].mckeeData = {
            structureElement: structureSelect ? structureSelect.value : '',
            purpose: purposeInput ? purposeInput.value : '',
            forces: selectedForces,
            lastUpdated: new Date().toISOString()
        };

        ChronicleDesk.saveScenes();
        console.log('📋 McKee metadata saved');
    },

    // Get structure element info
    getElementInfo(elementKey) {
        return this.structureElements[elementKey] || null;
    },

    // Get force info
    getForceInfo(forceKey) {
        return this.forces[forceKey] || null;
    },

    // Analyze story structure across all scenes
    analyzeStoryStructure() {
        const analysis = {
            total: ChronicleDesk.scenes.length,
            byElement: {},
            byForce: {},
            missing: []
        };

        // Count scenes by structure element
        Object.keys(this.structureElements).forEach(key => {
            analysis.byElement[key] = {
                count: 0,
                scenes: []
            };
        });

        // Count scenes by force
        Object.keys(this.forces).forEach(key => {
            analysis.byForce[key] = {
                count: 0,
                scenes: []
            };
        });

        ChronicleDesk.scenes.forEach(scene => {
            if (!scene.mckeeData || !scene.mckeeData.structureElement) {
                analysis.missing.push(scene.id);
            } else {
                const element = scene.mckeeData.structureElement;
                if (analysis.byElement[element]) {
                    analysis.byElement[element].count++;
                    analysis.byElement[element].scenes.push(scene.id);
                }

                if (scene.mckeeData.forces && Array.isArray(scene.mckeeData.forces)) {
                    scene.mckeeData.forces.forEach(force => {
                        if (analysis.byForce[force]) {
                            analysis.byForce[force].count++;
                            analysis.byForce[force].scenes.push(scene.id);
                        }
                    });
                }
            }
        });

        return analysis;
    }
};

// Make globally available
window.McKeeSystem = McKeeSystem;

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => McKeeSystem.init());
} else {
    McKeeSystem.init();
}

console.log('📚 McKee Story Structure module loaded');