// ===================================
// CHRONICLE DESK - Scene Management & Formatting
// "Write down the revelation and make it plain"
// - Habakkuk 2:2
// ===================================

const ChronicleDesk = {
    // Scene library with hierarchical structure
    scenes: [],
    acts: [],
    chapters: [],
    
    // Character profiles for reference
    characters: [],
    
    // Active themes
    themes: [],
    
    // Current scene being edited
    currentSceneId: null,
    
    // Initialization flag
    initialized: false,
    
    // Initialize
    init() {
        if (this.initialized) return;
        
        console.log('📖 The Desk awakens...');
        
        // Load all data
        this.loadScenes();
        this.loadActs();
        this.loadChapters();
        this.loadCharacters();
        this.loadThemes();
        
        // Setup UI
        this.setupDeskEventListeners();
        this.populateReferencePanel();
        this.populateSceneSwitcher();
        this.loadMostRecentScene();
        
        this.initialized = true;
        console.log('✅ The Desk stands ready for your labor');
    },
    
    // ===================================
    // EVENT LISTENERS
    // ===================================
    
    setupDeskEventListeners() {
        console.log('🎯 Setting up Desk event listeners...');
        
        // Scene management buttons
        const newSceneBtn = document.getElementById('newSceneBtn');
        const saveSceneBtn = document.getElementById('saveSceneBtn');
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        const exportBtn = document.getElementById('exportSceneBtn');
        
        if (newSceneBtn) {
            console.log('✓ New Scene button found');
            newSceneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🆕 New Scene clicked');
                this.showNewItemModal();
            });
        }
        
        if (saveSceneBtn) {
            console.log('✓ Save Scene button found');
            saveSceneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('💾 Save Scene clicked');
                this.saveCurrentSceneExplicitly();
            });
        }
        
        if (sceneSwitcher) {
            console.log('✓ Scene Switcher found');
            sceneSwitcher.addEventListener('change', (e) => {
                console.log('📄 Scene switched to:', e.target.value);
                this.loadSceneById(e.target.value);
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showExportModal();
            });
        }
        
        // Formatting buttons
        this.setupFormattingButtons();
        
        // Font controls
        const fontSelector = document.getElementById('fontSelector');
        const fontSizeSelector = document.getElementById('fontSizeSelector');
        
        if (fontSelector) {
            fontSelector.addEventListener('change', (e) => {
                const writingSurface = document.getElementById('writingSurface');
                if (writingSurface) {
                    writingSurface.style.fontFamily = e.target.value;
                }
            });
        }
        
        if (fontSizeSelector) {
            fontSizeSelector.addEventListener('change', (e) => this.changeFontSize(e.target.value));
        }
    },
    
    setupFormattingButtons() {
        // Bold, Italic, Underline
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');
        
        if (boldBtn) boldBtn.addEventListener('click', () => this.formatText('bold'));
        if (italicBtn) italicBtn.addEventListener('click', () => this.formatText('italic'));
        if (underlineBtn) underlineBtn.addEventListener('click', () => this.formatText('underline'));
        
        // Lists
        const bulletBtn = document.getElementById('bulletListBtn');
        const numberBtn = document.getElementById('numberedListBtn');
        
        if (bulletBtn) bulletBtn.addEventListener('click', () => this.formatText('insertUnorderedList'));
        if (numberBtn) numberBtn.addEventListener('click', () => this.formatText('insertOrderedList'));
        
        // Font size
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        
        if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => this.adjustFontSize(2));
        if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => this.adjustFontSize(-2));
        
        // Alignment
        const alignLeftBtn = document.getElementById('alignLeftBtn');
        const alignCenterBtn = document.getElementById('alignCenterBtn');
        const alignRightBtn = document.getElementById('alignRightBtn');
        
        if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => this.formatText('justifyLeft'));
        if (alignCenterBtn) alignCenterBtn.addEventListener('click', () => this.formatText('justifyCenter'));
        if (alignRightBtn) alignRightBtn.addEventListener('click', () => this.formatText('justifyRight'));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.formatText('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.formatText('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.formatText('underline');
                        break;
                }
            }
        });
    },
    
    formatText(command) {
        document.execCommand(command, false, null);
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.focus();
        }
    },
    
    changeFontSize(size) {
        const writingSurface = document.getElementById('writingSurface');
        if (writingSurface) {
            writingSurface.style.fontSize = size;
        }
    },
    
    adjustFontSize(delta) {
        const writingSurface = document.getElementById('writingSurface');
        if (!writingSurface) return;
        
        const currentSize = parseFloat(window.getComputedStyle(writingSurface).fontSize);
        const newSize = currentSize + delta;
        writingSurface.style.fontSize = newSize + 'px';
    },
    
    // ===================================
    // DATA LOADING
    // ===================================
    
    loadScenes() {
        this.scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
        console.log(`📚 Loaded ${this.scenes.length} scenes from the archive`);
    },
    
    loadActs() {
        this.acts = JSON.parse(localStorage.getItem('chronicle_acts') || '[]');
        if (this.acts.length === 0) {
            // Create default structure for Joseph story
            this.acts = [
                { id: 'act-1', name: 'Act I: The Dreamer', order: 1 },
                { id: 'act-2', name: 'Act II: The Pit', order: 2 },
                { id: 'act-3', name: 'Act III: The Palace', order: 3 }
            ];
            this.saveActs();
        }
    },
    
    loadChapters() {
        this.chapters = JSON.parse(localStorage.getItem('chronicle_chapters') || '[]');
    },
    
    saveScenes() {
        localStorage.setItem('chronicle_scenes', JSON.stringify(this.scenes));
        console.log('💾 Scenes saved to LocalStorage');
    },
    
    saveActs() {
        localStorage.setItem('chronicle_acts', JSON.stringify(this.acts));
    },
    
    saveChapters() {
        localStorage.setItem('chronicle_chapters', JSON.stringify(this.chapters));
    },
    
    // ===================================
    // NEW ITEM MODAL
    // ===================================
    
    showNewItemModal() {
        // Create modal if doesn't exist
        let modal = document.getElementById('newItemModal');
        if (!modal) {
            modal = this.createNewItemModal();
            document.body.appendChild(modal);
        }
        
        modal.classList.add('active');
    },
    
    createNewItemModal() {
        const modal = document.createElement('div');
        modal.id = 'newItemModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="document.getElementById('newItemModal').classList.remove('active')">×</button>
                <div class="modal-header">
                    <h2>Begin Something New</h2>
                    <p>What shall you create?</p>
                </div>
                <div class="modal-body">
                    <div class="new-item-options">
                        <button class="new-item-option" onclick="ChronicleDesk.createNewScene()">
                            <strong>New Scene</strong>
                            <small>A narrative moment or passage</small>
                        </button>
                        <button class="new-item-option" onclick="ChronicleDesk.createNewChapter()">
                            <strong>New Chapter</strong>
                            <small>Group multiple scenes together</small>
                        </button>
                        <button class="new-item-option" onclick="ChronicleDesk.createNewBeat()">
                            <strong>New Beat</strong>
                            <small>Quick note or story fragment</small>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    },
    
    // ===================================
    // SCENE CREATION
    // ===================================
    
    createNewScene() {
        console.log('🆕 Creating new scene...');
        
        // Close modal
        const modal = document.getElementById('newItemModal');
        if (modal) modal.classList.remove('active');
        
        // Save current scene first
        if (this.currentSceneId) {
            this.saveCurrentScene();
        }
        
        // Generate new scene
        const newScene = {
            id: `scene-${Date.now()}`,
            type: 'scene',
            title: `Untitled Scene ${this.scenes.filter(s => s.type === 'scene').length + 1}`,
            content: '',
            wordCount: 0,
            author: ChronicleApp.currentUser,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            actId: this.acts[0]?.id || null,
            chapterId: null,
            status: 'draft',
            notes: [],
            themes: []
        };
        
        this.scenes.push(newScene);
        this.currentSceneId = newScene.id;
        this.saveScenes();
        this.displayScene(newScene);
        this.populateSceneSwitcher();
        
        // Focus on title input
        const titleInput = document.getElementById('sceneTitle');
        if (titleInput) {
            titleInput.value = newScene.title;
            titleInput.select();
        }
        
        console.log('✨ New scene created:', newScene.title);
    },
    
    createNewChapter() {
        const chapterName = prompt('Chapter name:', `Chapter ${this.chapters.length + 1}`);
        if (!chapterName) return;
        
        const actId = this.acts[0]?.id || null;
        
        const newChapter = {
            id: `chapter-${Date.now()}`,
            name: chapterName,
            actId: actId,
            order: this.chapters.length + 1,
            createdAt: new Date().toISOString()
        };
        
        this.chapters.push(newChapter);
        this.saveChapters();
        
        console.log('📑 New chapter created:', chapterName);
        alert(`Chapter "${chapterName}" created! New scenes can now be assigned to this chapter.`);
        
        // Close modal
        const modal = document.getElementById('newItemModal');
        if (modal) modal.classList.remove('active');
    },
    
    createNewBeat() {
        const beatTitle = prompt('Beat title:', 'Quick Note');
        if (!beatTitle) return;
        
        const beatContent = prompt('Beat content:');
        if (!beatContent) return;
        
        const newBeat = {
            id: `beat-${Date.now()}`,
            type: 'beat',
            title: beatTitle,
            content: beatContent,
            wordCount: beatContent.split(/\s+/).length,
            author: ChronicleApp.currentUser,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            actId: this.acts[0]?.id || null,
            chapterId: null
        };
        
        this.scenes.push(newBeat);
        this.saveScenes();
        
        console.log('🎵 New beat created:', beatTitle);
        alert(`Beat "${beatTitle}" saved!`);
        
        // Close modal
        const modal = document.getElementById('newItemModal');
        if (modal) modal.classList.remove('active');
        
        this.populateSceneSwitcher();
    },
    
    // ===================================
    // SCENE MANAGEMENT
    // ===================================
    
    saveCurrentSceneExplicitly() {
        console.log('💾 Explicit save triggered');
        
        if (!this.currentSceneId) {
            console.log('⚠️ No current scene, creating new one');
            this.createNewScene();
            return;
        }
        
        this.saveCurrentScene();
        
        // Visual feedback
        const saveBtn = document.getElementById('saveSceneBtn');
        if (saveBtn) {
            const originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span style="color: var(--teal);">Saved</span>';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalHTML;
            }, 1500);
        }
        
        console.log('✅ Scene saved explicitly');
    },
    
    saveCurrentScene() {
        if (!this.currentSceneId) {
            console.log('⚠️ No current scene to save');
            return;
        }
        
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        
        if (!writingSurface) {
            console.log('⚠️ Writing surface not found');
            return;
        }
        
        const sceneIndex = this.scenes.findIndex(s => s.id === this.currentSceneId);
        if (sceneIndex === -1) {
            console.log('⚠️ Current scene not found in array');
            return;
        }
        
        // Update scene data
        this.scenes[sceneIndex].content = writingSurface.innerHTML;
        this.scenes[sceneIndex].title = sceneTitle ? sceneTitle.value : this.scenes[sceneIndex].title;
        this.scenes[sceneIndex].wordCount = ChronicleApp.countWords(writingSurface.innerText);
        this.scenes[sceneIndex].lastModified = new Date().toISOString();
        this.scenes[sceneIndex].author = ChronicleApp.currentUser;
        
        this.saveScenes();
        this.populateSceneSwitcher();
        
        // Update word count display
        ChronicleApp.currentScene = this.scenes[sceneIndex];
        ChronicleApp.updateWordCount();
        
        console.log('💾 Scene saved:', this.scenes[sceneIndex].title);
    },
    
    loadSceneById(sceneId) {
        if (!sceneId) return;
        
        console.log('📄 Loading scene:', sceneId);
        
        // Save current scene first
        if (this.currentSceneId) {
            this.saveCurrentScene();
        }
        
        const scene = this.scenes.find(s => s.id === sceneId);
        if (scene) {
            this.currentSceneId = sceneId;
            this.displayScene(scene);
            console.log('✅ Scene loaded:', scene.title);
        } else {
            console.log('⚠️ Scene not found:', sceneId);
        }
    },
    
    loadMostRecentScene() {
        if (this.scenes.length === 0) {
            console.log('📝 No scenes exist, creating first one');
            this.createNewScene();
            return;
        }
        
        // Load most recently modified scene
        const sorted = [...this.scenes].sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );
        
        this.currentSceneId = sorted[0].id;
        this.displayScene(sorted[0]);
        console.log('📖 Loaded most recent scene:', sorted[0].title);
    },
    
    displayScene(scene) {
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        
        if (writingSurface) {
            writingSurface.innerHTML = scene.content || '';
        }
        if (sceneTitle) {
            sceneTitle.value = scene.title || '';
        }
        if (sceneSwitcher) {
            sceneSwitcher.value = scene.id;
        }
        
        // Update global state
        ChronicleApp.currentScene = scene;
        ChronicleApp.currentScene.wordCount = ChronicleApp.countWords(writingSurface ? writingSurface.innerText : '');
        ChronicleApp.updateWordCount();
    },
    
    populateSceneSwitcher() {
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        if (!sceneSwitcher) return;
        
        sceneSwitcher.innerHTML = '';
        
        if (this.scenes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No scenes yet';
            sceneSwitcher.appendChild(option);
            return;
        }
        
        // Group by Act and Chapter
        this.acts.forEach(act => {
            const actGroup = document.createElement('optgroup');
            actGroup.label = `⚔ ${act.name}`;
            
            // Get chapters in this act
            const actChapters = this.chapters.filter(ch => ch.actId === act.id);
            
            if (actChapters.length > 0) {
                actChapters.forEach(chapter => {
                    const chapterScenes = this.scenes.filter(s => s.chapterId === chapter.id);
                    
                    if (chapterScenes.length > 0) {
                        const chapterGroup = document.createElement('optgroup');
                        chapterGroup.label = `  📖 ${chapter.name}`;
                        
                        chapterScenes.forEach(scene => {
                            const option = document.createElement('option');
                            option.value = scene.id;
                            option.textContent = `    ${scene.title}`;
                            chapterGroup.appendChild(option);
                        });
                        
                        sceneSwitcher.appendChild(chapterGroup);
                    }
                });
            }
            
            // Scenes without chapter in this act
            const actScenes = this.scenes.filter(s => s.actId === act.id && !s.chapterId);
            if (actScenes.length > 0) {
                actScenes.forEach(scene => {
                    const option = document.createElement('option');
                    option.value = scene.id;
                    option.textContent = `  ${scene.title}`;
                    actGroup.appendChild(option);
                });
                
                sceneSwitcher.appendChild(actGroup);
            }
        });
        
        // Scenes not in any act
        const orphanScenes = this.scenes.filter(s => !s.actId);
        if (orphanScenes.length > 0) {
            const orphanGroup = document.createElement('optgroup');
            orphanGroup.label = 'Unorganized';
            
            orphanScenes.forEach(scene => {
                const option = document.createElement('option');
                option.value = scene.id;
                option.textContent = scene.title;
                orphanGroup.appendChild(option);
            });
            
            sceneSwitcher.appendChild(orphanGroup);
        }
    },
    
    // ===================================
    // CHARACTER & THEME LOADING
    // ===================================
    
    loadCharacters() {
        this.characters = JSON.parse(localStorage.getItem('chronicle_characters') || '[]');
        
        if (this.characters.length === 0) {
            this.characters = [
                {
                    id: 'char-joseph',
                    name: 'Joseph',
                    role: 'Protagonist',
                    description: 'A young man of seventeen, favored by his father, gifted with prophetic dreams.',
                    arc: 'From arrogant dreamer to humble servant to wise administrator'
                },
                {
                    id: 'char-jacob',
                    name: 'Jacob',
                    role: 'Father',
                    description: 'Aging patriarch who repeats his own father\'s mistake of favoritism.',
                    arc: 'From blind favoritism to profound grief to redemptive reunion'
                },
                {
                    id: 'char-brothers',
                    name: 'The Brothers',
                    role: 'Antagonists/Redeemed',
                    description: 'Ten brothers consumed by jealousy, capable of terrible betrayal.',
                    arc: 'From murderous jealousy to guilt-ridden survival to humble repentance'
                }
            ];
            this.saveCharacters();
        }
    },
    
    saveCharacters() {
        localStorage.setItem('chronicle_characters', JSON.stringify(this.characters));
    },
    
    loadThemes() {
        this.themes = JSON.parse(localStorage.getItem('chronicle_themes') || '[]');
        
        if (this.themes.length === 0) {
            this.themes = [
                { name: 'Providence', color: '#C9A961' },
                { name: 'Betrayal', color: '#722F37' },
                { name: 'Forgiveness', color: '#2C5F5F' },
                { name: 'Identity', color: '#8B7355' },
                { name: 'Redemption', color: '#C9A961' }
            ];
            this.saveThemes();
        }
    },
    
    saveThemes() {
        localStorage.setItem('chronicle_themes', JSON.stringify(this.themes));
    },
    
    // ===================================
    // REFERENCE PANEL
    // ===================================
    
    populateReferencePanel() {
        const panelContent = document.querySelector('.panel-content');
        if (!panelContent) return;
        
        panelContent.innerHTML = '';
        
        const charSection = this.createCharactersSection();
        panelContent.appendChild(charSection);
        
        const themeSection = this.createThemesSection();
        panelContent.appendChild(themeSection);
        
        const plotSection = this.createPlotPointsSection();
        panelContent.appendChild(plotSection);
    },
    
    createCharactersSection() {
        const section = document.createElement('div');
        section.className = 'reference-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Characters';
        section.appendChild(title);
        
        this.characters.forEach(char => {
            const item = document.createElement('div');
            item.className = 'reference-item character-item';
            item.innerHTML = `
                <strong>${char.name}</strong>
                <em style="color: var(--teal); font-size: 0.9rem; display: block; margin: 0.2rem 0;">${char.role}</em>
                <p>${char.description}</p>
                ${char.arc ? `<p style="font-style: italic; opacity: 0.8; font-size: 0.9rem; margin-top: 0.5rem;">Arc: ${char.arc}</p>` : ''}
            `;
            section.appendChild(item);
        });
        
        return section;
    },
    
    createThemesSection() {
        const section = document.createElement('div');
        section.className = 'reference-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Themes';
        section.appendChild(title);
        
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 0.5rem;';
        
        this.themes.forEach(theme => {
            const tag = document.createElement('div');
            tag.className = 'theme-tag';
            tag.textContent = theme.name;
            tag.style.borderColor = theme.color;
            tag.style.color = theme.color;
            container.appendChild(tag);
        });
        
        section.appendChild(container);
        return section;
    },
    
    createPlotPointsSection() {
        const section = document.createElement('div');
        section.className = 'reference-section';
        
        const title = document.createElement('h4');
        title.textContent = 'Key Plot Points';
        section.appendChild(title);
        
        const plotPoints = [
            { title: 'The Favorite Son', text: 'Jacob favors Joseph, giving him the coat of many colors. Brothers grow jealous.' },
            { title: 'The Dreams', text: 'Joseph dreams of his family bowing to him. His brothers\' hatred intensifies.' },
            { title: 'The Betrayal', text: 'Brothers throw Joseph into the pit, then sell him to Midianite traders.' }
        ];
        
        plotPoints.forEach(point => {
            const item = document.createElement('div');
            item.className = 'reference-item plot-point-item';
            item.innerHTML = `
                <strong>${point.title}</strong>
                <p>${point.text}</p>
            `;
            section.appendChild(item);
        });
        
        return section;
    },
    
    // ===================================
    // EXPORT (SIMPLIFIED)
    // ===================================
    
    showExportModal() {
        alert('Export functionality coming soon!');
    }
};

// Don't auto-initialize - let chronicle-core.js call init()
console.log('✍️ Chronicle Desk module loaded');

// Make available globally
window.ChronicleDesk = ChronicleDesk;
