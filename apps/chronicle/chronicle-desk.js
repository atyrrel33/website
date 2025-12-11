// ===================================
// CHRONICLE DESK - Scene Management & Export
// "Write down the revelation and make it plain"
// - Habakkuk 2:2
// ===================================

const ChronicleDesk = {
    // Scene library
    scenes: [],
    
    // Character profiles for reference
    characters: [],
    
    // Active themes
    themes: [],
    
    // Export settings
    exportSettings: {
        format: 'docx',
        includeMetadata: true,
        fontSize: 12,
        lineSpacing: 2
    },
    
    // Initialize
    init() {
        console.log('📖 The Desk awakens...');
        this.loadScenes();
        this.loadCharacters();
        this.loadThemes();
        this.setupDeskEventListeners();
        this.populateReferencePanel();
        console.log('The Desk stands ready for your labor');
    },
    
    // Setup Desk-specific event listeners
    setupDeskEventListeners() {
        // Export button (we'll add this to the toolbar)
        const exportBtn = document.getElementById('exportSceneBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }
        
        // Scene switcher (we'll add this to toolbar)
        const sceneSwitcher = document.getElementById('sceneSwitcher');
        if (sceneSwitcher) {
            sceneSwitcher.addEventListener('change', (e) => this.loadSceneById(e.target.value));
        }
        
        // New scene button
        const newSceneBtn = document.getElementById('newSceneBtn');
        if (newSceneBtn) {
            newSceneBtn.addEventListener('click', () => this.createNewScene());
        }
    },
    
    // ===================================
    // SCENE MANAGEMENT
    // ===================================
    
    loadScenes() {
        this.scenes = JSON.parse(localStorage.getItem('chronicle_scenes') || '[]');
        console.log(`Loaded ${this.scenes.length} scenes from the archive`);
    },
    
    saveScenes() {
        localStorage.setItem('chronicle_scenes', JSON.stringify(this.scenes));
    },
    
    createNewScene() {
        // Save current scene first
        ChronicleApp.saveCurrentScene();
        
        // Create new scene
        const newScene = {
            id: `scene-${Date.now()}`,
            title: 'Untitled Scene',
            content: '',
            wordCount: 0,
            author: ChronicleApp.currentUser,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            act: 1,
            status: 'draft',
            notes: [],
            themes: []
        };
        
        this.scenes.push(newScene);
        this.saveScenes();
        
        // Load the new scene
        ChronicleApp.currentScene = newScene;
        this.displayScene(newScene);
        
        // Focus on title input
        const titleInput = document.getElementById('sceneTitle');
        if (titleInput) {
            titleInput.select();
        }
        
        console.log('✨ New scene created:', newScene.id);
    },
    
    loadSceneById(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (scene) {
            // Save current scene first
            ChronicleApp.saveCurrentScene();
            
            // Load requested scene
            ChronicleApp.currentScene = scene;
            this.displayScene(scene);
            
            console.log('📄 Scene loaded:', scene.title);
        }
    },
    
    displayScene(scene) {
        const writingSurface = document.getElementById('writingSurface');
        const sceneTitle = document.getElementById('sceneTitle');
        
        if (writingSurface) {
            writingSurface.innerText = scene.content || '';
        }
        if (sceneTitle) {
            sceneTitle.value = scene.title || '';
        }
        
        ChronicleApp.currentScene.wordCount = ChronicleApp.countWords(scene.content);
        ChronicleApp.updateWordCount();
        
        // Update session tracking
        ChronicleApp.currentSession.sessionStartWords = scene.wordCount;
    },
    
    deleteScene(sceneId) {
        if (confirm('Are you certain you wish to commit this scene to the void? This cannot be undone.')) {
            this.scenes = this.scenes.filter(s => s.id !== sceneId);
            this.saveScenes();
            
            // If we deleted the current scene, create a new one
            if (ChronicleApp.currentScene.id === sceneId) {
                this.createNewScene();
            }
            
            console.log('🗑️ Scene deleted:', sceneId);
        }
    },
    
    // ===================================
    // CHARACTER PROFILES
    // ===================================
    
    loadCharacters() {
        this.characters = JSON.parse(localStorage.getItem('chronicle_characters') || '[]');
        
        // Default characters for Joseph adaptation
        if (this.characters.length === 0) {
            this.characters = [
                {
                    id: 'char-joseph',
                    name: 'Joseph',
                    role: 'Protagonist',
                    description: 'A young man of seventeen, favored by his father, gifted with prophetic dreams.',
                    arc: 'From arrogant dreamer to humble servant to wise administrator',
                    notes: ''
                },
                {
                    id: 'char-jacob',
                    name: 'Jacob',
                    role: 'Father',
                    description: 'Aging patriarch who repeats his own father\'s mistake of favoritism.',
                    arc: 'From blind favoritism to profound grief to redemptive reunion',
                    notes: ''
                },
                {
                    id: 'char-brothers',
                    name: 'The Brothers',
                    role: 'Antagonists/Redeemed',
                    description: 'Ten brothers consumed by jealousy, capable of terrible betrayal.',
                    arc: 'From murderous jealousy to guilt-ridden survival to humble repentance',
                    notes: ''
                }
            ];
            this.saveCharacters();
        }
    },
    
    saveCharacters() {
        localStorage.setItem('chronicle_characters', JSON.stringify(this.characters));
    },
    
    addCharacter(characterData) {
        const newChar = {
            id: `char-${Date.now()}`,
            name: characterData.name || 'Unnamed Character',
            role: characterData.role || '',
            description: characterData.description || '',
            arc: characterData.arc || '',
            notes: characterData.notes || '',
            createdAt: new Date().toISOString()
        };
        
        this.characters.push(newChar);
        this.saveCharacters();
        this.populateReferencePanel();
        
        console.log('👤 Character added:', newChar.name);
    },
    
    // ===================================
    // THEME TRACKING
    // ===================================
    
    loadThemes() {
        this.themes = JSON.parse(localStorage.getItem('chronicle_themes') || '[]');
        
        // Default themes for Joseph adaptation
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
    // REFERENCE PANEL POPULATION
    // ===================================
    
    populateReferencePanel() {
        const panelContent = document.querySelector('.panel-content');
        if (!panelContent) return;
        
        // Clear existing content
        panelContent.innerHTML = '';
        
        // Add Characters section
        const charSection = this.createCharactersSection();
        panelContent.appendChild(charSection);
        
        // Add Themes section
        const themeSection = this.createThemesSection();
        panelContent.appendChild(themeSection);
        
        // Add Plot Points section (static for now, could be dynamic)
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
            {
                title: 'The Favorite Son',
                text: 'Jacob favors Joseph, giving him the coat of many colors. Brothers grow jealous.'
            },
            {
                title: 'The Dreams',
                text: 'Joseph dreams of his family bowing to him. His brothers\' hatred intensifies.'
            },
            {
                title: 'The Betrayal',
                text: 'Brothers throw Joseph into the pit, then sell him to Midianite traders.'
            },
            {
                title: 'Egypt\'s Service',
                text: 'Joseph serves in Potiphar\'s house, rises to prominence, faces false accusation.'
            },
            {
                title: 'Prison & Prophecy',
                text: 'Joseph interprets dreams in prison, forgotten by those he helps.'
            },
            {
                title: 'Pharaoh\'s Dream',
                text: 'Called to interpret Pharaoh\'s dreams. Joseph reveals seven years of plenty, seven of famine.'
            },
            {
                title: 'Second in Command',
                text: 'Joseph becomes vizier of Egypt, administers grain storage program.'
            },
            {
                title: 'The Brothers Return',
                text: 'Famine drives brothers to Egypt. They bow before Joseph without recognizing him.'
            },
            {
                title: 'Testing & Revelation',
                text: 'Joseph tests his brothers, reveals himself, demonstrates forgiveness.'
            },
            {
                title: 'Reunion & Redemption',
                text: 'Jacob\'s family reunites in Egypt. Joseph reveals God\'s providence in all things.'
            }
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
    // EXPORT FUNCTIONALITY
    // ===================================
    
    showExportModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('exportModal');
        if (!modal) {
            modal = this.createExportModal();
            document.body.appendChild(modal);
        }
        
        modal.classList.add('active');
    },
    
    createExportModal() {
        const modal = document.createElement('div');
        modal.id = 'exportModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content export-modal">
                <button class="modal-close" onclick="document.getElementById('exportModal').classList.remove('active')">×</button>
                <div class="modal-header">
                    <h2>Export Your Work</h2>
                    <p>Preserve your words in the format of your choosing</p>
                </div>
                <div class="modal-body">
                    <div class="export-option">
                        <input type="radio" name="exportFormat" id="exportDocx" value="docx" checked>
                        <label for="exportDocx">
                            <strong>.DOCX</strong> - Microsoft Word Document
                            <small>Formatted prose, ready for editing</small>
                        </label>
                    </div>
                    <div class="export-option">
                        <input type="radio" name="exportFormat" id="exportTxt" value="txt">
                        <label for="exportTxt">
                            <strong>.TXT</strong> - Plain Text
                            <small>Raw words, no formatting</small>
                        </label>
                    </div>
                    <div class="export-option">
                        <input type="radio" name="exportFormat" id="exportPdf" value="pdf">
                        <label for="exportPdf">
                            <strong>.PDF</strong> - Portable Document
                            <small>Formatted for reading, not editing</small>
                        </label>
                    </div>
                    
                    <div class="export-settings">
                        <h4>Export Options</h4>
                        <label class="checkbox-label">
                            <input type="checkbox" id="exportCurrentOnly">
                            Current scene only (otherwise exports all scenes)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="exportMetadata" checked>
                            Include metadata (author, dates, word counts)
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary" onclick="document.getElementById('exportModal').classList.remove('active')">Cancel</button>
                    <button class="modal-btn primary" onclick="ChronicleDesk.executeExport()">Export</button>
                </div>
            </div>
        `;
        
        return modal;
    },
    
    executeExport() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const currentOnly = document.getElementById('exportCurrentOnly').checked;
        const includeMetadata = document.getElementById('exportMetadata').checked;
        
        const scenesToExport = currentOnly ? [ChronicleApp.currentScene] : this.scenes;
        
        switch(format) {
            case 'docx':
                this.exportAsDocx(scenesToExport, includeMetadata);
                break;
            case 'txt':
                this.exportAsTxt(scenesToExport, includeMetadata);
                break;
            case 'pdf':
                this.exportAsPdf(scenesToExport, includeMetadata);
                break;
        }
        
        document.getElementById('exportModal').classList.remove('active');
    },
    
    exportAsTxt(scenes, includeMetadata) {
        let content = '';
        
        if (includeMetadata) {
            content += '='.repeat(60) + '\n';
            content += 'CHRONICLE EXPORT\n';
            content += 'Joseph: A Modern Adaptation\n';
            content += `Exported: ${new Date().toLocaleString()}\n`;
            content += `Author: ${ChronicleApp.currentUser === 'tyrrel' ? 'Tyrrel' : 'Trevor'}\n`;
            content += `Total Scenes: ${scenes.length}\n`;
            content += `Total Words: ${scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0)}\n`;
            content += '='.repeat(60) + '\n\n';
        }
        
        scenes.forEach((scene, index) => {
            if (includeMetadata) {
                content += `\n\n${'—'.repeat(30)}\n`;
                content += `SCENE ${index + 1}: ${scene.title}\n`;
                content += `Author: ${scene.author}\n`;
                content += `Words: ${scene.wordCount}\n`;
                content += `Last Modified: ${new Date(scene.lastModified).toLocaleString()}\n`;
                content += `${'—'.repeat(30)}\n\n`;
            } else {
                content += `\n\n### ${scene.title} ###\n\n`;
            }
            
            content += scene.content + '\n';
        });
        
        this.downloadFile(content, 'chronicle-export.txt', 'text/plain');
        console.log('📄 Exported as TXT');
    },
    
    exportAsDocx(scenes, includeMetadata) {
        // For now, we'll create a simple HTML version that can be saved as .doc
        // True .docx generation would require a library like docx.js
        
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Chronicle Export</title>
                <style>
                    body {
                        font-family: 'Crimson Text', Georgia, serif;
                        max-width: 8.5in;
                        margin: 1in auto;
                        line-height: 2;
                        font-size: 12pt;
                    }
                    h1 {
                        font-family: 'Cinzel', serif;
                        color: #C9A961;
                        text-align: center;
                        margin-bottom: 2rem;
                        page-break-after: avoid;
                    }
                    h2 {
                        font-family: 'Cinzel', serif;
                        color: #722F37;
                        margin-top: 2rem;
                        page-break-before: always;
                    }
                    .metadata {
                        color: #666;
                        font-size: 10pt;
                        margin-bottom: 1rem;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 0.5rem;
                    }
                    p {
                        text-indent: 0.5in;
                        margin-bottom: 0;
                        text-align: justify;
                    }
                    .scene-break {
                        text-align: center;
                        margin: 2rem 0;
                        color: #C9A961;
                    }
                </style>
            </head>
            <body>
                <h1>Chronicle Export</h1>
                ${includeMetadata ? `
                    <div class="metadata">
                        <strong>Project:</strong> Joseph: A Modern Adaptation<br>
                        <strong>Exported:</strong> ${new Date().toLocaleString()}<br>
                        <strong>Author:</strong> ${ChronicleApp.currentUser === 'tyrrel' ? 'Tyrrel' : 'Trevor'}<br>
                        <strong>Total Scenes:</strong> ${scenes.length}<br>
                        <strong>Total Words:</strong> ${scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0)}
                    </div>
                ` : ''}
        `;
        
        scenes.forEach((scene, index) => {
            html += `<h2>${scene.title}</h2>`;
            
            if (includeMetadata) {
                html += `
                    <div class="metadata">
                        Author: ${scene.author} | 
                        Words: ${scene.wordCount} | 
                        Modified: ${new Date(scene.lastModified).toLocaleDateString()}
                    </div>
                `;
            }
            
            // Convert content to paragraphs
            const paragraphs = scene.content.split('\n').filter(p => p.trim());
            paragraphs.forEach(para => {
                html += `<p>${this.escapeHtml(para)}</p>`;
            });
            
            if (index < scenes.length - 1) {
                html += '<div class="scene-break">✦ ✦ ✦</div>';
            }
        });
        
        html += `
            </body>
            </html>
        `;
        
        // Download as .doc (HTML-based, opens in Word)
        this.downloadFile(html, 'chronicle-export.doc', 'application/msword');
        console.log('📝 Exported as DOCX-compatible format');
    },
    
    exportAsPdf(scenes, includeMetadata) {
        // Similar to DOCX, but trigger print dialog for PDF save
        const html = this.exportAsDocx(scenes, includeMetadata);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
        
        console.log('📄 PDF print dialog opened');
    },
    
    // ===================================
    // UTILITIES
    // ===================================
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ChronicleDesk.init());
} else {
    ChronicleDesk.init();
}

// Make available globally
window.ChronicleDesk = ChronicleDesk;

console.log('%c✍️ The Desk Module', 'font-size: 14px; font-weight: bold; color: #C9A961;');
console.log('%c"Make it plain on tablets"', 'font-size: 10px; font-style: italic; color: #b8b3aa;');
