// ═══════════════════════════════════════════════════════════════════════════
// CHRONICLE EXPORT - Story Distribution & Preservation
// "Go therefore and make disciples of all nations" - Matthew 28:19
// ═══════════════════════════════════════════════════════════════════════════
//
// Export functionality for Chronicle stories
// - TXT export with beats included
// - Markdown export with structure
// - PDF export with formatting
// - Complete backup/restore
//
// @version 2.0.0 (Sprint 1)
// @date December 17, 2024
// @authors Tyrrel & Trevor
//
// ═══════════════════════════════════════════════════════════════════════════

const ChronicleExport = {
    // ═══════════════════════════════════════════════════════════════════════
    // CORE DATA RETRIEVAL
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Get all scenes from ChronicleData
     */
    getScenes() {
        return ChronicleData.scenes || [];
    },
    
    /**
     * Get beats for a specific scene
     */
    getBeatsForScene(sceneId) {
        return ChronicleData.getBeatsForScene(sceneId) || [];
    },
    
    /**
     * Get character name by ID
     */
    getCharacterName(characterId) {
        const character = ChronicleData.getCharacter(characterId);
        return character ? character.name : null;
    },
    
    /**
     * Get location name by ID
     */
    getLocationName(locationId) {
        const location = ChronicleData.getLocation(locationId);
        return location ? location.name : null;
    },
    
    /**
     * Strip HTML tags from content
     */
    stripHTML(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // TEXT EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Export entire story as plain text
     * "Let your words be few" - Ecclesiastes 5:2
     */
    exportToTXT() {
        console.log('📝 Exporting to TXT...');
        
        const scenes = this.getScenes();
        
        if (scenes.length === 0) {
            alert('No scenes to export. Create some scenes first!');
            return;
        }
        
        // Build content
        let content = '';
        
        // Header
        content += '═══════════════════════════════════════════════\n';
        content += '  CHRONICLE EXPORT - Plain Text\n';
        content += `  Exported: ${new Date().toLocaleString()}\n`;
        content += '═══════════════════════════════════════════════\n\n';
        
        // Group by Act
        ChronicleData.acts.forEach((act, actIndex) => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            if (actScenes.length > 0) {
                content += '\n';
                content += '═'.repeat(50) + '\n';
                content += `${act.title.toUpperCase()}\n`;
                content += '═'.repeat(50) + '\n\n';
                
                actScenes.forEach((scene, sceneIndex) => {
                    // Scene header
                    content += `SCENE ${actIndex + 1}.${sceneIndex + 1}: ${scene.title}\n`;
                    content += `Author: ${scene.author} | Status: ${scene.status}\n`;
                    
                    // Scene metadata
                    if (scene.characters && scene.characters.length > 0) {
                        const characterNames = scene.characters
                            .map(id => this.getCharacterName(id))
                            .filter(name => name)
                            .join(', ');
                        if (characterNames) {
                            content += `Characters: ${characterNames}\n`;
                        }
                    }
                    
                    if (scene.location) {
                        const locationName = this.getLocationName(scene.location);
                        if (locationName) {
                            content += `Location: ${locationName}\n`;
                        }
                    }
                    
                    if (scene.mckeeElement) {
                        content += `McKee Element: ${scene.mckeeElement}\n`;
                    }
                    
                    content += '-'.repeat(50) + '\n\n';
                    
                    // Beats
                    const beats = this.getBeatsForScene(scene.id);
                    
                    if (beats.length === 0) {
                        content += '[Empty scene - no beats]\n\n';
                    } else {
                        beats.forEach((beat, beatIndex) => {
                            if (beats.length > 1) {
                                content += `[Beat ${beatIndex + 1}]\n`;
                            }
                            content += this.stripHTML(beat.content) + '\n\n';
                        });
                    }
                    
                    content += '\n';
                });
            }
        });
        
        // Footer
        const stats = ChronicleData.getStats();
        content += '\n═'.repeat(50) + '\n';
        content += 'STORY STATISTICS\n';
        content += '═'.repeat(50) + '\n';
        content += `Total Scenes: ${stats.scenes.total}\n`;
        content += `Total Beats: ${stats.beats.total}\n`;
        content += `Total Words: ${stats.wordCount.toLocaleString()}\n`;
        content += `Draft: ${stats.scenes.draft} | In Progress: ${stats.scenes.inProgress} | Polished: ${stats.scenes.polished}\n`;
        
        // Download
        this.downloadFile(content, 'chronicle-export.txt', 'text/plain');
        
        console.log('✅ TXT export complete');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // MARKDOWN EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Export story as Markdown with structure
     * "Write the vision; make it plain on tablets" - Habakkuk 2:2
     */
    exportToMarkdown() {
        console.log('📝 Exporting to Markdown...');
        
        const scenes = this.getScenes();
        
        if (scenes.length === 0) {
            alert('No scenes to export. Create some scenes first!');
            return;
        }
        
        let content = '';
        
        // Header
        content += '# Chronicle Export\n\n';
        content += `**Exported:** ${new Date().toLocaleString()}\n\n`;
        content += '---\n\n';
        
        // Table of Contents
        content += '## Table of Contents\n\n';
        
        ChronicleData.acts.forEach((act, actIndex) => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            if (actScenes.length > 0) {
                content += `${actIndex + 1}. [${act.title}](#${this.slugify(act.title)})\n`;
                actScenes.forEach((scene, sceneIndex) => {
                    content += `   ${actIndex + 1}.${sceneIndex + 1}. [${scene.title}](#${this.slugify(scene.title)})\n`;
                });
            }
        });
        
        content += '\n---\n\n';
        
        // Acts and Scenes
        ChronicleData.acts.forEach((act, actIndex) => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            if (actScenes.length > 0) {
                content += `## ${act.title}\n\n`;
                
                actScenes.forEach((scene, sceneIndex) => {
                    content += `### ${actIndex + 1}.${sceneIndex + 1}. ${scene.title}\n\n`;
                    
                    // Metadata as quote
                    content += '> **Metadata**\n';
                    content += `> - Author: ${scene.author}\n`;
                    content += `> - Status: ${scene.status}\n`;
                    
                    if (scene.characters && scene.characters.length > 0) {
                        const characterNames = scene.characters
                            .map(id => this.getCharacterName(id))
                            .filter(name => name);
                        if (characterNames.length > 0) {
                            content += `> - Characters: ${characterNames.join(', ')}\n`;
                        }
                    }
                    
                    if (scene.location) {
                        const locationName = this.getLocationName(scene.location);
                        if (locationName) {
                            content += `> - Location: ${locationName}\n`;
                        }
                    }
                    
                    if (scene.mckeeElement) {
                        content += `> - McKee Element: ${scene.mckeeElement}\n`;
                    }
                    
                    content += '\n';
                    
                    // Beats
                    const beats = this.getBeatsForScene(scene.id);
                    
                    if (beats.length === 0) {
                        content += '*[Empty scene - no beats]*\n\n';
                    } else {
                        beats.forEach((beat, beatIndex) => {
                            if (beats.length > 1) {
                                content += `**Beat ${beatIndex + 1}:**\n\n`;
                            }
                            content += this.stripHTML(beat.content) + '\n\n';
                        });
                    }
                    
                    content += '---\n\n';
                });
            }
        });
        
        // Statistics
        const stats = ChronicleData.getStats();
        content += '## Story Statistics\n\n';
        content += `- **Total Scenes:** ${stats.scenes.total}\n`;
        content += `- **Total Beats:** ${stats.beats.total}\n`;
        content += `- **Total Words:** ${stats.wordCount.toLocaleString()}\n`;
        content += `- **Draft:** ${stats.scenes.draft} | **In Progress:** ${stats.scenes.inProgress} | **Polished:** ${stats.scenes.polished}\n`;
        
        // Download
        this.downloadFile(content, 'chronicle-export.md', 'text/markdown');
        
        console.log('✅ Markdown export complete');
    },
    
    /**
     * Create URL-friendly slug
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // PDF EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Export story as PDF
     * "The letter kills, but the Spirit gives life" - 2 Corinthians 3:6
     */
    exportToPDF() {
        console.log('📄 Exporting to PDF...');
        
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library not loaded. This feature requires jsPDF library.');
            return;
        }
        
        const scenes = this.getScenes();
        
        if (scenes.length === 0) {
            alert('No scenes to export. Create some scenes first!');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let y = 20;
        const lineHeight = 7;
        const pageHeight = 280;
        const margin = 20;
        const maxWidth = 170;
        
        // Helper to add new page if needed
        const checkPageBreak = (neededSpace = lineHeight) => {
            if (y + neededSpace > pageHeight) {
                doc.addPage();
                y = 20;
                return true;
            }
            return false;
        };
        
        // Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Chronicle Export', margin, y);
        y += lineHeight * 2;
        
        // Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y);
        y += lineHeight * 3;
        
        // Acts and Scenes
        ChronicleData.acts.forEach((act, actIndex) => {
            const actScenes = ChronicleData.getScenesByAct(act.id);
            
            if (actScenes.length > 0) {
                checkPageBreak(lineHeight * 3);
                
                // Act title
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(act.title, margin, y);
                y += lineHeight * 2;
                
                actScenes.forEach((scene, sceneIndex) => {
                    checkPageBreak(lineHeight * 3);
                    
                    // Scene title
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${actIndex + 1}.${sceneIndex + 1}. ${scene.title}`, margin, y);
                    y += lineHeight;
                    
                    // Metadata
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'italic');
                    doc.text(`${scene.author} | ${scene.status}`, margin, y);
                    y += lineHeight * 1.5;
                    
                    // Beats
                    const beats = this.getBeatsForScene(scene.id);
                    
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    
                    if (beats.length === 0) {
                        doc.text('[Empty scene]', margin, y);
                        y += lineHeight;
                    } else {
                        beats.forEach((beat, beatIndex) => {
                            const text = this.stripHTML(beat.content);
                            const lines = doc.splitTextToSize(text, maxWidth);
                            
                            lines.forEach(line => {
                                checkPageBreak();
                                doc.text(line, margin, y);
                                y += lineHeight;
                            });
                            
                            y += lineHeight * 0.5;
                        });
                    }
                    
                    y += lineHeight;
                });
            }
        });
        
        // Save
        doc.save('chronicle-export.pdf');
        
        console.log('✅ PDF export complete');
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // BACKUP & RESTORE
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Export complete backup
     * "Store up for yourselves treasures in heaven" - Matthew 6:20
     */
    exportBackup() {
        console.log('💾 Creating backup...');
        
        // Get complete backup from ChronicleData
        const backup = ChronicleData.exportAll();
        
        // Add export metadata
        backup.exported = new Date().toISOString();
        backup.version = '2.0.0';
        backup.application = 'Chronicle';
        
        // Create JSON string
        const json = JSON.stringify(backup, null, 2);
        
        // Download
        const filename = `chronicle-backup-${new Date().toISOString().slice(0, 10)}.json`;
        this.downloadFile(json, filename, 'application/json');
        
        console.log('✅ Backup created:', backup);
        
        // Show confirmation
        alert(`✅ Backup created successfully!\n\nScenes: ${backup.scenes.length}\nBeats: ${backup.beats.length}\nCharacters: ${backup.characters.length}\nLocations: ${backup.locations.length}`);
    },
    
    /**
     * Import backup and restore data
     * "I will restore to you the years that the swarming locust has eaten" - Joel 2:25
     */
    importBackup() {
        console.log('📂 Importing backup...');
        
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const backup = JSON.parse(event.target.result);
                    
                    // Validate backup
                    if (!backup.scenes || !backup.beats) {
                        alert('❌ Invalid backup file: Missing required data');
                        return;
                    }
                    
                    // Confirm restore
                    const confirm = window.confirm(
                        `⚠️ WARNING: This will replace all current data!\n\n` +
                        `Backup contains:\n` +
                        `- ${backup.scenes.length} scenes\n` +
                        `- ${backup.beats.length} beats\n` +
                        `- ${backup.characters?.length || 0} characters\n` +
                        `- ${backup.locations?.length || 0} locations\n\n` +
                        `Continue with restore?`
                    );
                    
                    if (!confirm) {
                        console.log('Restore cancelled by user');
                        return;
                    }
                    
                    // Import via ChronicleData
                    const success = ChronicleData.importAll(backup);
                    
                    if (success) {
                        alert('✅ Backup restored successfully!\n\nPage will reload to apply changes.');
                        location.reload();
                    } else {
                        alert('❌ Failed to restore backup. Please check the console for details.');
                    }
                    
                } catch (err) {
                    console.error('Import error:', err);
                    alert('❌ Failed to parse backup file. Make sure it\'s a valid Chronicle backup.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },
    
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Download file helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    /**
     * Setup export button listeners
     */
    setupExportButtons() {
        // Export TXT button
        const txtBtn = document.getElementById('exportTXT');
        if (txtBtn) {
            txtBtn.addEventListener('click', () => this.exportToTXT());
        }
        
        // Export Markdown button
        const mdBtn = document.getElementById('exportMarkdown');
        if (mdBtn) {
            mdBtn.addEventListener('click', () => this.exportToMarkdown());
        }
        
        // Export PDF button
        const pdfBtn = document.getElementById('exportPDF');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => this.exportToPDF());
        }
        
        // Backup button
        const backupBtn = document.getElementById('exportBackup');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.exportBackup());
        }
        
        // Restore button
        const restoreBtn = document.getElementById('importBackup');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => this.importBackup());
        }
        
        console.log('✅ Export buttons configured');
    }
};

// ═══════════════════════════════════════════════════════════════════════
// MODULE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

// Make available globally
window.ChronicleExport = ChronicleExport;

// Setup export functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChronicleExport.setupExportButtons();
});

console.log('📤 Chronicle Export module loaded');

// ═══════════════════════════════════════════════════════════════════════
// END OF CHRONICLE EXPORT
// 
// "Give, and it will be given to you. Good measure, pressed down,
// shaken together, running over, will be put into your lap."
// — Luke 6:38
// ═══════════════════════════════════════════════════════════════════════