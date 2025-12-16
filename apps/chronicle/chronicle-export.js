/* ========================================
   CHRONICLE EXPORT SYSTEM
   "Write down the revelation and make it plain on tablets"
   - Habakkuk 2:2
   
   Comprehensive export capabilities:
   - Plain text (TXT/MD)
   - Beautiful PDFs with annotations
   - Complete project backup (.chronicle)
   - Cross-browser data transfer
   ======================================== */

// Load jsPDF library dynamically
const loadJsPDF = () => {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve(window.jspdf);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve(window.jspdf);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const ChronicleExport = {
    // Export formats
    formats: {
        TXT: 'text/plain',
        MD: 'text/markdown',
        JSON: 'application/json',
        PDF: 'application/pdf'
    },
    
    // ===================================
    // MAIN EXPORT FUNCTION
    // ===================================
    
    async exportProject(options = {}) {
        const {
            format = 'TXT',
            includeAnalysis = false,
            includeMetadata = true,
            scenes = 'all', // 'all', 'current', or array of scene IDs
            sortBy = 'structure' // 'structure' (Act/Chapter), 'chronological', 'author'
        } = options;
        
        console.log(`📤 Exporting project as ${format}...`);
        
        try {
            let content, filename, mimeType;
            
            switch(format) {
                case 'TXT':
                    ({ content, filename } = this.exportAsText(scenes, includeMetadata, sortBy));
                    mimeType = this.formats.TXT;
                    break;
                    
                case 'MD':
                    ({ content, filename } = this.exportAsMarkdown(scenes, includeMetadata, sortBy));
                    mimeType = this.formats.MD;
                    break;
                    
                case 'PDF':
                    await this.exportAsPDF(scenes, includeAnalysis, includeMetadata, sortBy);
                    return; // PDF handles its own download
                    
                case 'BACKUP':
                    ({ content, filename } = this.exportFullBackup());
                    mimeType = this.formats.JSON;
                    break;
                    
                default:
                    throw new Error(`Unknown format: ${format}`);
            }
            
            this.downloadFile(content, filename, mimeType);
            console.log('✅ Export complete:', filename);
            
        } catch (error) {
            console.error('❌ Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    },
    
    // ===================================
    // TEXT EXPORT
    // ===================================
    
    exportAsText(sceneFilter, includeMetadata, sortBy) {
        const scenes = this.getFilteredScenes(sceneFilter, sortBy);
        const projectName = localStorage.getItem('chronicle_project_name') || 'Joseph: A Modern Story';
        
        let content = '';
        
        // Header
        content += `${projectName.toUpperCase()}\n`;
        content += '='.repeat(projectName.length) + '\n\n';
        
        if (includeMetadata) {
            const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
            content += `Total Scenes: ${scenes.length}\n`;
            content += `Total Words: ${totalWords.toLocaleString()}\n`;
            content += `Exported: ${new Date().toLocaleDateString()}\n`;
            content += `Authors: Tyrrel & Trevor\n`;
            content += '\n' + '-'.repeat(60) + '\n\n';
        }
        
        // Scenes organized by structure
        if (sortBy === 'structure') {
            const structure = this.organizeByStructure(scenes);
            
            Object.entries(structure).forEach(([actNum, actData]) => {
                content += `\n\n${'='.repeat(60)}\n`;
                content += `ACT ${actNum}\n`;
                content += `${'='.repeat(60)}\n\n`;
                
                // Chapters
                Object.entries(actData.chapters).forEach(([chapterId, chapterData]) => {
                    content += `\n--- ${chapterData.name} ---\n\n`;
                    chapterData.scenes.forEach(scene => {
                        content += this.formatSceneAsText(scene, includeMetadata);
                    });
                });
                
                // Unchaptered scenes
                if (actData.unchaptered.length > 0) {
                    content += `\n--- Unchaptered Scenes ---\n\n`;
                    actData.unchaptered.forEach(scene => {
                        content += this.formatSceneAsText(scene, includeMetadata);
                    });
                }
            });
        } else {
            // Simple chronological or by author
            scenes.forEach(scene => {
                content += this.formatSceneAsText(scene, includeMetadata);
            });
        }
        
        const filename = `${projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        
        return { content, filename };
    },
    
    formatSceneAsText(scene, includeMetadata) {
        let text = '';
        
        if (includeMetadata) {
            text += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            text += `${scene.title || 'Untitled Scene'}\n`;
            text += `Author: ${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'} | `;
            text += `Words: ${scene.wordCount || 0} | `;
            text += `Status: ${scene.status || 'draft'}\n`;
            text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        } else {
            text += `\n\n### ${scene.title || 'Untitled'}\n\n`;
        }
        
        // Strip HTML formatting
        const div = document.createElement('div');
        div.innerHTML = scene.content || '';
        text += div.textContent || div.innerText || '';
        text += '\n\n';
        
        return text;
    },
    
    // ===================================
    // MARKDOWN EXPORT
    // ===================================
    
    exportAsMarkdown(sceneFilter, includeMetadata, sortBy) {
        const scenes = this.getFilteredScenes(sceneFilter, sortBy);
        const projectName = localStorage.getItem('chronicle_project_name') || 'Joseph: A Modern Story';
        
        let content = `# ${projectName}\n\n`;
        
        if (includeMetadata) {
            const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
            content += `**Total Scenes:** ${scenes.length}  \n`;
            content += `**Total Words:** ${totalWords.toLocaleString()}  \n`;
            content += `**Exported:** ${new Date().toLocaleDateString()}  \n`;
            content += `**Authors:** Tyrrel & Trevor\n\n`;
            content += '---\n\n';
        }
        
        // Organize by structure
        if (sortBy === 'structure') {
            const structure = this.organizeByStructure(scenes);
            
            Object.entries(structure).forEach(([actNum, actData]) => {
                content += `\n## Act ${actNum}\n\n`;
                
                Object.entries(actData.chapters).forEach(([chapterId, chapterData]) => {
                    content += `\n### ${chapterData.name}\n\n`;
                    chapterData.scenes.forEach(scene => {
                        content += this.formatSceneAsMarkdown(scene, includeMetadata);
                    });
                });
                
                if (actData.unchaptered.length > 0) {
                    content += `\n### Unchaptered Scenes\n\n`;
                    actData.unchaptered.forEach(scene => {
                        content += this.formatSceneAsMarkdown(scene, includeMetadata);
                    });
                }
            });
        } else {
            scenes.forEach(scene => {
                content += this.formatSceneAsMarkdown(scene, includeMetadata);
            });
        }
        
        const filename = `${projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.md`;
        
        return { content, filename };
    },
    
    formatSceneAsMarkdown(scene, includeMetadata) {
        let md = '';
        
        if (includeMetadata) {
            md += `\n#### ${scene.title || 'Untitled Scene'}\n\n`;
            md += `> **Author:** ${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'} | `;
            md += `**Words:** ${scene.wordCount || 0} | `;
            md += `**Status:** ${scene.status || 'draft'}\n\n`;
        } else {
            md += `\n#### ${scene.title || 'Untitled'}\n\n`;
        }
        
        const div = document.createElement('div');
        div.innerHTML = scene.content || '';
        md += div.textContent || div.innerText || '';
        md += '\n\n';
        
        return md;
    },
    
    // ===================================
    // PDF EXPORT (WITH ANALYSIS)
    // ===================================
    
    async exportAsPDF(sceneFilter, includeAnalysis, includeMetadata, sortBy) {
        try {
            const { jsPDF } = await loadJsPDF();
            const doc = new jsPDF();
            
            const scenes = this.getFilteredScenes(sceneFilter, sortBy);
            const projectName = localStorage.getItem('chronicle_project_name') || 'Joseph: A Modern Story';
            
            let yPos = 20;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const lineHeight = 7;
            const maxWidth = doc.internal.pageSize.width - (margin * 2);
            
            // Helper: Check if we need a new page
            const checkPageBreak = (spaceNeeded = 20) => {
                if (yPos + spaceNeeded > pageHeight - margin) {
                    doc.addPage();
                    yPos = 20;
                    return true;
                }
                return false;
            };
            
            // Title Page
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text(projectName, doc.internal.pageSize.width / 2, yPos, { align: 'center' });
            
            yPos += 15;
            doc.setFontSize(12);
            doc.setFont(undefined, 'italic');
            doc.text('A Chronicle Export', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
            
            if (includeMetadata) {
                yPos += 20;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const totalWords = scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0);
                doc.text(`Total Scenes: ${scenes.length}`, margin, yPos);
                yPos += 6;
                doc.text(`Total Words: ${totalWords.toLocaleString()}`, margin, yPos);
                yPos += 6;
                doc.text(`Exported: ${new Date().toLocaleDateString()}`, margin, yPos);
                yPos += 6;
                doc.text(`Authors: Tyrrel & Trevor`, margin, yPos);
            }
            
            // New page for content
            doc.addPage();
            yPos = 20;
            
            // Content by structure
            if (sortBy === 'structure') {
                const structure = this.organizeByStructure(scenes);
                
                for (const [actNum, actData] of Object.entries(structure)) {
                    checkPageBreak(30);
                    
                    // Act Header
                    doc.setFontSize(18);
                    doc.setFont(undefined, 'bold');
                    doc.text(`ACT ${actNum}`, margin, yPos);
                    yPos += 12;
                    
                    // Chapters
                    for (const [chapterId, chapterData] of Object.entries(actData.chapters)) {
                        checkPageBreak(20);
                        
                        doc.setFontSize(14);
                        doc.setFont(undefined, 'bold');
                        doc.text(chapterData.name, margin, yPos);
                        yPos += 10;
                        
                        for (const scene of chapterData.scenes) {
                            yPos = await this.addSceneToPDF(doc, scene, yPos, margin, maxWidth, lineHeight, checkPageBreak, includeMetadata, includeAnalysis);
                        }
                    }
                    
                    // Unchaptered
                    if (actData.unchaptered.length > 0) {
                        checkPageBreak(20);
                        doc.setFontSize(14);
                        doc.setFont(undefined, 'bold');
                        doc.text('Unchaptered Scenes', margin, yPos);
                        yPos += 10;
                        
                        for (const scene of actData.unchaptered) {
                            yPos = await this.addSceneToPDF(doc, scene, yPos, margin, maxWidth, lineHeight, checkPageBreak, includeMetadata, includeAnalysis);
                        }
                    }
                }
            } else {
                for (const scene of scenes) {
                    yPos = await this.addSceneToPDF(doc, scene, yPos, margin, maxWidth, lineHeight, checkPageBreak, includeMetadata, includeAnalysis);
                }
            }
            
            // Save
            const filename = `${projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            console.log('✅ PDF exported:', filename);
            
        } catch (error) {
            console.error('❌ PDF export failed:', error);
            throw error;
        }
    },
    
    async addSceneToPDF(doc, scene, yPos, margin, maxWidth, lineHeight, checkPageBreak, includeMetadata, includeAnalysis) {
        checkPageBreak(40);
        
        // Scene title
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(scene.title || 'Untitled Scene', margin, yPos);
        yPos += 8;
        
        // Metadata
        if (includeMetadata) {
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            
            // Author color
            if (scene.author === 'tyrrel') {
                doc.setTextColor(201, 169, 97); // Gold
            } else {
                doc.setTextColor(58, 125, 125); // Teal
            }
            
            doc.text(`By ${scene.author === 'tyrrel' ? 'Tyrrel' : 'Trevor'}`, margin, yPos);
            yPos += 6;
            
            doc.setTextColor(0, 0, 0); // Reset to black
            doc.text(`${scene.wordCount || 0} words | Status: ${scene.status || 'draft'}`, margin, yPos);
            yPos += 8;
        }
        
        // Scene content
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        
        const div = document.createElement('div');
        div.innerHTML = scene.content || '';
        const text = div.textContent || div.innerText || '';
        
        const lines = doc.splitTextToSize(text, maxWidth);
        for (const line of lines) {
            checkPageBreak();
            doc.text(line, margin, yPos);
            yPos += lineHeight;
        }
        
        // Analysis section
        if (includeAnalysis && scene.mckeeData) {
            yPos += 5;
            checkPageBreak(30);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(114, 47, 55); // Burgundy
            doc.text('Story Analysis:', margin, yPos);
            yPos += 7;
            
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(9);
            
            if (scene.mckeeData.storyValue) {
                doc.text(`Value: ${scene.mckeeData.storyValue}`, margin + 5, yPos);
                yPos += 6;
            }
            
            if (scene.mckeeData.turningPoint) {
                doc.text(`Turning Point: ${scene.mckeeData.turningPoint}`, margin + 5, yPos);
                yPos += 6;
            }
            
            if (scene.mckeeData.conflict) {
                doc.text(`Conflict Level: ${scene.mckeeData.conflict}/10`, margin + 5, yPos);
                yPos += 6;
            }
        }
        
        yPos += 10; // Space before next scene
        return yPos;
    },
    
    // ===================================
    // FULL PROJECT BACKUP
    // ===================================
    
    exportFullBackup() {
        console.log('📦 Creating full project backup...');
        
        const backup = {
            version: '1.0',
            exported: new Date().toISOString(),
            projectName: localStorage.getItem('chronicle_project_name') || 'Joseph: A Modern Story',
            scenes: [],
            acts: [],
            chapters: [],
            characters: [],
            themes: [],
            settings: {}
        };
        
        // Get all scenes
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key.startsWith('scene_')) {
                backup.scenes.push(JSON.parse(localStorage.getItem(key)));
            } else if (key.startsWith('act_')) {
                backup.acts.push(JSON.parse(localStorage.getItem(key)));
            } else if (key.startsWith('chapter_')) {
                backup.chapters.push(JSON.parse(localStorage.getItem(key)));
            } else if (key.startsWith('character_')) {
                backup.characters.push(JSON.parse(localStorage.getItem(key)));
            } else if (key.startsWith('theme_')) {
                backup.themes.push(JSON.parse(localStorage.getItem(key)));
            } else if (key.startsWith('chronicle_')) {
                backup.settings[key] = localStorage.getItem(key);
            }
        }
        
        const content = JSON.stringify(backup, null, 2);
        const filename = `Chronicle_Backup_${new Date().toISOString().split('T')[0]}.chronicle`;
        
        console.log('✅ Backup created:', {
            scenes: backup.scenes.length,
            acts: backup.acts.length,
            chapters: backup.chapters.length,
            characters: backup.characters.length
        });
        
        return { content, filename };
    },
    
    // ===================================
    // IMPORT/RESTORE
    // ===================================
    
    async importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    if (!backup.version || !backup.scenes) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Confirm overwrite
                    const confirmMsg = `This will restore:\n` +
                        `- ${backup.scenes.length} scenes\n` +
                        `- ${backup.acts.length} acts\n` +
                        `- ${backup.chapters.length} chapters\n\n` +
                        `Current data will be overwritten. Continue?`;
                    
                    if (!confirm(confirmMsg)) {
                        reject(new Error('Import cancelled by user'));
                        return;
                    }
                    
                    // Clear existing data
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('scene_') || key.startsWith('act_') || 
                            key.startsWith('chapter_') || key.startsWith('character_') || 
                            key.startsWith('theme_')) {
                            keysToRemove.push(key);
                        }
                    }
                    keysToRemove.forEach(key => localStorage.removeItem(key));
                    
                    // Restore data
                    backup.scenes.forEach(scene => {
                        localStorage.setItem(`scene_${scene.id}`, JSON.stringify(scene));
                    });
                    
                    backup.acts.forEach(act => {
                        localStorage.setItem(`act_${act.id}`, JSON.stringify(act));
                    });
                    
                    backup.chapters.forEach(chapter => {
                        localStorage.setItem(`chapter_${chapter.id}`, JSON.stringify(chapter));
                    });
                    
                    backup.characters.forEach(char => {
                        localStorage.setItem(`character_${char.id}`, JSON.stringify(char));
                    });
                    
                    backup.themes.forEach(theme => {
                        localStorage.setItem(`theme_${theme.id}`, JSON.stringify(theme));
                    });
                    
                    Object.entries(backup.settings).forEach(([key, value]) => {
                        localStorage.setItem(key, value);
                    });
                    
                    console.log('✅ Backup restored successfully');
                    resolve(backup);
                    
                    // Reload page to refresh UI
                    alert('Backup restored successfully! The page will now reload.');
                    window.location.reload();
                    
                } catch (error) {
                    console.error('❌ Import failed:', error);
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },
    
    // ===================================
    // HELPER FUNCTIONS
    // ===================================
    
    getFilteredScenes(filter, sortBy) {
        let scenes = [];
        
        // Get all scenes from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('scene_')) {
                scenes.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        
        // Apply filter
        if (filter === 'current' && ChronicleDesk.currentSceneId) {
            scenes = scenes.filter(s => s.id === ChronicleDesk.currentSceneId);
        } else if (Array.isArray(filter)) {
            scenes = scenes.filter(s => filter.includes(s.id));
        }
        
        // Sort
        switch(sortBy) {
            case 'chronological':
                scenes.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
            case 'author':
                scenes.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'structure':
                // Will be organized later by organizeByStructure()
                scenes.sort((a, b) => {
                    if (a.act !== b.act) return (a.act || 999) - (b.act || 999);
                    if (a.chapterId !== b.chapterId) return (a.chapterId || '').localeCompare(b.chapterId || '');
                    return (a.order || 0) - (b.order || 0);
                });
                break;
        }
        
        return scenes;
    },
    
    organizeByStructure(scenes) {
        const structure = {};
        
        scenes.forEach(scene => {
            const act = scene.act || 1;
            const chapterId = scene.chapterId || null;
            const chapterName = scene.chapterName || 'Untitled Chapter';
            
            if (!structure[act]) {
                structure[act] = {
                    chapters: {},
                    unchaptered: []
                };
            }
            
            if (chapterId) {
                if (!structure[act].chapters[chapterId]) {
                    structure[act].chapters[chapterId] = {
                        name: chapterName,
                        scenes: []
                    };
                }
                structure[act].chapters[chapterId].scenes.push(scene);
            } else {
                structure[act].unchaptered.push(scene);
            }
        });
        
        return structure;
    },
    
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
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📤 Export system ready');
});
