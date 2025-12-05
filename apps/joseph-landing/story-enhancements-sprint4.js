// ============================================
// ANNOTATION SYSTEM - SPRINT 4 ENHANCEMENTS
// Export, Polish, & Quality of Life Improvements
// "Let all things be done decently and in order" - 1 Corinthians 14:40
// ============================================

(function() {
    const OriginalAnnotationSystem = window.AnnotationSystem;

    class Sprint4AnnotationSystem extends OriginalAnnotationSystem {
        constructor(storyReader) {
            super(storyReader);
            this.searchQuery = '';
            this.initSprint4Features();
        }

        initSprint4Features() {
            this.setupKeyboardShortcuts();
            this.addExportButton();
            console.log('✨ Sprint 4 enhancements initialized');
        }

        // ============================================
        // EXPORT FUNCTIONALITY - TXT & PDF
        // ============================================

        addExportButton() {
            // Add export button to sidebar footer
            const sidebarFooter = document.querySelector('.sidebar-footer');
            if (sidebarFooter) {
                const exportBtn = document.createElement('button');
                exportBtn.className = 'export-notes-btn';
                exportBtn.innerHTML = `
                    <span class="export-icon">📤</span>
                    Export Notes
                `;
                exportBtn.addEventListener('click', () => this.showExportMenu());
                
                // Insert before progress tracker
                const progressTracker = sidebarFooter.querySelector('.progress-tracker');
                sidebarFooter.insertBefore(exportBtn, progressTracker);
            }
        }

        showExportMenu() {
            const modal = document.createElement('div');
            modal.className = 'export-modal';
            modal.innerHTML = `
                <div class="export-modal-overlay"></div>
                <div class="export-modal-content">
                    <div class="export-modal-header">
                        <h3>Export Your Notes</h3>
                        <button class="export-modal-close">×</button>
                    </div>
                    <div class="export-modal-body">
                        <div class="export-option-group">
                            <label class="export-label">Author:</label>
                            <div class="export-radio-group">
                                <label>
                                    <input type="radio" name="exportAuthor" value="trevor" checked>
                                    Trevor's Notes
                                </label>
                                <label>
                                    <input type="radio" name="exportAuthor" value="tyrrel">
                                    Tyrrel's Notes
                                </label>
                                <label>
                                    <input type="radio" name="exportAuthor" value="both">
                                    Both
                                </label>
                            </div>
                        </div>

                        <div class="export-option-group">
                            <label class="export-label">Format:</label>
                            <div class="export-radio-group">
                                <label>
                                    <input type="radio" name="exportFormat" value="txt" checked>
                                    Plain Text (.txt)
                                </label>
                                <label>
                                    <input type="radio" name="exportFormat" value="pdf">
                                    PDF Document
                                </label>
                            </div>
                        </div>

                        <div class="export-option-group">
                            <label class="export-label">Include:</label>
                            <div class="export-checkbox-group">
                                <label>
                                    <input type="checkbox" name="includeTimestamps" checked>
                                    Timestamps
                                </label>
                                <label>
                                    <input type="checkbox" name="includeChapterHeadings" checked>
                                    Chapter Headings
                                </label>
                                <label>
                                    <input type="checkbox" name="includeNoteTypes" checked>
                                    Note Type Labels
                                </label>
                            </div>
                        </div>

                        <div class="export-preview">
                            <strong>Notes to export:</strong>
                            <span id="exportCount">Calculating...</span>
                        </div>
                    </div>
                    <div class="export-modal-footer">
                        <button class="btn-export-cancel">Cancel</button>
                        <button class="btn-export-download">📥 Download</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Update count when options change
            const updateCount = () => {
                const author = document.querySelector('input[name="exportAuthor"]:checked').value;
                const count = this.getExportCount(author);
                document.getElementById('exportCount').textContent = `${count} notes`;
            };
            updateCount();

            document.querySelectorAll('input[name="exportAuthor"]').forEach(radio => {
                radio.addEventListener('change', updateCount);
            });

            // Close handlers
            modal.querySelector('.export-modal-close').addEventListener('click', () => {
                modal.remove();
            });
            modal.querySelector('.export-modal-overlay').addEventListener('click', () => {
                modal.remove();
            });
            modal.querySelector('.btn-export-cancel').addEventListener('click', () => {
                modal.remove();
            });

            // Download handler
            modal.querySelector('.btn-export-download').addEventListener('click', () => {
                this.executeExport(modal);
            });
        }

        getExportCount(author) {
            if (author === 'both') {
                return this.notes.length;
            }
            return this.notes.filter(n => n.author === author).length;
        }

        executeExport(modal) {
            const author = document.querySelector('input[name="exportAuthor"]:checked').value;
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const includeTimestamps = document.querySelector('input[name="includeTimestamps"]').checked;
            const includeChapterHeadings = document.querySelector('input[name="includeChapterHeadings"]').checked;
            const includeNoteTypes = document.querySelector('input[name="includeNoteTypes"]').checked;

            const options = {
                author,
                format,
                includeTimestamps,
                includeChapterHeadings,
                includeNoteTypes
            };

            if (format === 'txt') {
                this.exportToTXT(options);
            } else {
                this.exportToPDF(options);
            }

            modal.remove();
        }

        exportToTXT(options) {
            let content = this.generateExportContent(options);
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const authorName = options.author === 'both' ? 'Both' : 
                              options.author === 'trevor' ? 'Trevor' : 'Tyrrel';
            const timestamp = new Date().toISOString().split('T')[0];
            a.download = `Joseph-Notes-${authorName}-${timestamp}.txt`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showExportSuccess();
        }

        exportToPDF(options) {
            // For PDF, we'll create a formatted HTML version and print it
            const content = this.generateExportContent(options, true);
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Joseph Study Notes</title>
                    <style>
                        @page { margin: 1in; }
                        body {
                            font-family: 'Georgia', serif;
                            line-height: 1.6;
                            color: #1a1a1a;
                            max-width: 8.5in;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h1 {
                            font-family: 'Cinzel', serif;
                            color: #c9a961;
                            border-bottom: 2px solid #c9a961;
                            padding-bottom: 10px;
                            margin-bottom: 30px;
                        }
                        h2 {
                            font-family: 'Cinzel', serif;
                            color: #722f37;
                            margin-top: 40px;
                            margin-bottom: 20px;
                            font-size: 1.5em;
                        }
                        .note {
                            margin-bottom: 30px;
                            padding: 15px;
                            background: #f5f0e6;
                            border-left: 4px solid #c9a961;
                            page-break-inside: avoid;
                        }
                        .note-header {
                            font-size: 0.9em;
                            color: #666;
                            margin-bottom: 10px;
                        }
                        .note-type {
                            font-weight: bold;
                            color: #722f37;
                        }
                        .note-content {
                            font-size: 1.1em;
                            line-height: 1.8;
                        }
                        .plot-reference {
                            font-size: 0.85em;
                            color: #666;
                            font-style: italic;
                            margin-top: 8px;
                        }
                        .timestamp {
                            font-size: 0.8em;
                            color: #999;
                        }
                        .footer {
                            margin-top: 50px;
                            padding-top: 20px;
                            border-top: 1px solid #ccc;
                            text-align: center;
                            font-size: 0.9em;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    ${content}
                    <div class="footer">
                        Exported from The Joseph Project<br>
                        ${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            // Wait for content to load, then trigger print dialog
            setTimeout(() => {
                printWindow.print();
            }, 500);

            this.showExportSuccess();
        }

        generateExportContent(options, isHTML = false) {
            let filteredNotes = this.notes;
            
            // Filter by author
            if (options.author !== 'both') {
                filteredNotes = filteredNotes.filter(n => n.author === options.author);
            }

            // Organize by chapter
            const notesByChapter = this.organizeNotesByChapter(filteredNotes);

            if (isHTML) {
                return this.generateHTMLContent(notesByChapter, options);
            } else {
                return this.generateTXTContent(notesByChapter, options);
            }
        }

        organizeNotesByChapter(notes) {
            const chapters = {};
            
            notes.forEach(note => {
                // Extract chapter from plotPointId (e.g., "gen-37-..." -> "Genesis 37")
                const match = note.plotPointId.match(/gen-(\d+)/);
                const chapterNum = match ? match[1] : 'Unknown';
                const chapterKey = `Genesis ${chapterNum}`;
                
                if (!chapters[chapterKey]) {
                    chapters[chapterKey] = [];
                }
                chapters[chapterKey].push(note);
            });

            return chapters;
        }

        generateTXTContent(notesByChapter, options) {
            let content = '';
            
            // Header
            const authorName = options.author === 'both' ? 'Trevor & Tyrrel' : 
                              options.author === 'trevor' ? 'Trevor' : 'Tyrrel';
            content += '═══════════════════════════════════════════════\n';
            content += `  JOSEPH STUDY NOTES - ${authorName.toUpperCase()}\n`;
            content += '═══════════════════════════════════════════════\n\n';
            content += `Exported: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            })}\n\n\n`;

            // Notes by chapter
            const sortedChapters = Object.keys(notesByChapter).sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            });

            sortedChapters.forEach(chapter => {
                if (options.includeChapterHeadings) {
                    content += '═══════════════════════════════════════════════\n';
                    content += `${chapter}\n`;
                    content += '═══════════════════════════════════════════════\n\n';
                }

                notesByChapter[chapter].forEach(note => {
                    // Note type
                    if (options.includeNoteTypes) {
                        const typeEmoji = this.getNoteTypeIcon(note.type);
                        const typeLabel = note.type.charAt(0).toUpperCase() + note.type.slice(1);
                        content += `${typeEmoji} ${typeLabel}\n`;
                    }

                    // Author for "both" option
                    if (options.author === 'both') {
                        const authorLabel = note.author === 'trevor' ? 'Trevor' : 'Tyrrel';
                        content += `Author: ${authorLabel}\n`;
                    }

                    // Timestamp
                    if (options.includeTimestamps) {
                        const date = new Date(note.createdAt);
                        content += `Date: ${date.toLocaleDateString('en-US')}\n`;
                    }

                    // The note content
                    content += '\n';
                    content += this.wrapText(note.text, 70);
                    content += '\n';

                    // Plot point reference
                    content += `\n[Plot Point: ${note.plotPointId}]\n`;
                    content += '\n---\n\n';
                });

                content += '\n';
            });

            return content;
        }

        generateHTMLContent(notesByChapter, options) {
            let html = '';
            
            // Header
            const authorName = options.author === 'both' ? 'Trevor & Tyrrel' : 
                              options.author === 'trevor' ? 'Trevor' : 'Tyrrel';
            html += `<h1>Joseph Study Notes - ${authorName}</h1>\n`;

            // Notes by chapter
            const sortedChapters = Object.keys(notesByChapter).sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            });

            sortedChapters.forEach(chapter => {
                if (options.includeChapterHeadings) {
                    html += `<h2>${chapter}</h2>\n`;
                }

                notesByChapter[chapter].forEach(note => {
                    html += '<div class="note">\n';
                    
                    // Header info
                    html += '<div class="note-header">\n';
                    
                    if (options.includeNoteTypes) {
                        const typeEmoji = this.getNoteTypeIcon(note.type);
                        const typeLabel = note.type.charAt(0).toUpperCase() + note.type.slice(1);
                        html += `<span class="note-type">${typeEmoji} ${typeLabel}</span> `;
                    }

                    if (options.author === 'both') {
                        const authorLabel = note.author === 'trevor' ? 'Trevor' : 'Tyrrel';
                        html += `• <span>${authorLabel}</span> `;
                    }

                    if (options.includeTimestamps) {
                        const date = new Date(note.createdAt);
                        html += `• <span class="timestamp">${date.toLocaleDateString('en-US')}</span>`;
                    }
                    
                    html += '</div>\n';

                    // Note content
                    html += `<div class="note-content">${this.escapeHtml(note.text)}</div>\n`;
                    
                    // Plot reference
                    html += `<div class="plot-reference">Plot Point: ${note.plotPointId}</div>\n`;
                    
                    html += '</div>\n\n';
                });
            });

            return html;
        }

        wrapText(text, maxLength) {
            const words = text.split(' ');
            let lines = [];
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxLength) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            
            if (currentLine.trim()) {
                lines.push(currentLine.trim());
            }

            return lines.join('\n');
        }

        showExportSuccess() {
            // Create success notification
            const notification = document.createElement('div');
            notification.className = 'export-success-notification';
            notification.innerHTML = `
                <div class="export-success-content">
                    <span class="export-success-icon">✓</span>
                    <span class="export-success-text">Notes exported successfully!</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ============================================
        // SEARCH WITHIN NOTES
        // ============================================

        renderNoteInterface(plotId) {
            const workspace = document.getElementById('annotationWorkspace');
            const notes = this.getNotes(plotId);
            
            workspace.innerHTML = `
                ${this.renderFilterControls(notes)}
                ${this.renderSearchBar()}
                <div class="annotation-body">
                    ${notes.length > 0 ? this.renderFilteredNotes(notes) : this.renderEmptyState()}
                    ${this.renderNewNoteForm()}
                </div>
            `;

            // Attach handlers
            this.attachAnnotationHandlers();
            this.attachFilterHandlers();
            this.attachSearchHandler();

            // Auto-expand on mobile when adding note
            if (window.innerWidth <= 768) {
                this.expandMobileAnnotations();
            }
        }

        renderSearchBar() {
            return `
                <div class="note-search-bar">
                    <input 
                        type="text" 
                        id="noteSearchInput" 
                        class="note-search-input" 
                        placeholder="🔍 Search your notes..."
                        value="${this.searchQuery}"
                    >
                    ${this.searchQuery ? '<button class="note-search-clear" id="noteSearchClear">×</button>' : ''}
                </div>
            `;
        }

        attachSearchHandler() {
            const searchInput = document.getElementById('noteSearchInput');
            const clearBtn = document.getElementById('noteSearchClear');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.renderNoteInterface(this.currentPlotId);
                });

                // Focus on Ctrl/Cmd + F
                document.addEventListener('keydown', (e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && 
                        document.activeElement.tagName !== 'INPUT' && 
                        document.activeElement.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        searchInput.focus();
                    }
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.searchQuery = '';
                    this.renderNoteInterface(this.currentPlotId);
                });
            }
        }

        renderFilteredNotes(notes) {
            // Apply existing filters
            let filteredNotes = notes;

            if (this.filterByAuthor !== 'both') {
                filteredNotes = filteredNotes.filter(n => n.author === this.filterByAuthor);
            }

            if (this.filterByType !== 'all') {
                filteredNotes = filteredNotes.filter(n => n.type === this.filterByType);
            }

            // Apply search filter
            if (this.searchQuery) {
                filteredNotes = filteredNotes.filter(n => 
                    n.text.toLowerCase().includes(this.searchQuery)
                );
            }

            // Update author context
            if (this.filterByAuthor === 'both') {
                // Show all
            } else {
                this.currentAuthor = this.filterByAuthor;
                this.updateAuthorBodyClass();
            }

            if (filteredNotes.length === 0) {
                return this.searchQuery ? 
                    this.renderEmptySearchState() : 
                    this.renderEmptyFilterState();
            }

            return `
                <div class="notes-list">
                    ${filteredNotes.map(note => this.renderNoteWithHighlight(note)).join('')}
                </div>
            `;
        }

        renderNoteWithHighlight(note) {
            let text = this.escapeHtml(note.text);
            
            // Highlight search term
            if (this.searchQuery) {
                const regex = new RegExp(`(${this.escapeRegex(this.searchQuery)})`, 'gi');
                text = text.replace(regex, '<mark>$1</mark>');
            }

            const typeColors = {
                insight: 'var(--gold-warm)',
                question: 'var(--burgundy-primary)',
                parallel: 'var(--night-soft)',
                general: 'var(--papyrus-aged)'
            };

            const color = typeColors[note.type] || typeColors.general;
            const timestamp = this.formatTimestamp(note.createdAt);
            const edited = note.editedAt ? ' (edited)' : '';

            return `
                <div class="note-card ${note.author}" data-note-id="${note.id}" data-type="${note.type}">
                    <div class="note-header">
                        <span class="note-type-badge" style="background: ${color}">
                            ${this.getNoteTypeIcon(note.type)} ${note.type}
                        </span>
                        <div class="note-actions">
                            <button class="note-action-btn edit-note" title="Edit">✏️</button>
                            <button class="note-action-btn delete-note" title="Delete">🗑️</button>
                        </div>
                    </div>
                    <div class="note-content">${text}</div>
                    <div class="note-footer">
                        <small>${timestamp}${edited}</small>
                    </div>
                </div>
            `;
        }

        renderEmptySearchState() {
            return `
                <div class="no-notes-message">
                    <div style="text-align: center; padding: var(--space-xl);">
                        <div style="font-size: 2rem; opacity: 0.3; margin-bottom: var(--space-md);">🔍</div>
                        <p style="color: var(--papyrus-aged); font-family: 'EB Garamond', serif;">
                            No notes found matching "${this.searchQuery}"
                        </p>
                        <p style="color: var(--gold-dim); font-size: 0.875rem; margin-top: var(--space-sm);">
                            Try a different search term
                        </p>
                    </div>
                </div>
            `;
        }

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // ============================================
        // KEYBOARD SHORTCUTS
        // ============================================

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Don't trigger if typing in input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }

                // 't' key - switch to Trevor
                if (e.key === 't') {
                    this.currentAuthor = 'trevor';
                    this.updateAuthorBodyClass();
                    if (this.currentPlotId) {
                        this.renderNoteInterface(this.currentPlotId);
                    }
                }

                // 'y' key - switch to Tyrrel
                if (e.key === 'y') {
                    this.currentAuthor = 'tyrrel';
                    this.updateAuthorBodyClass();
                    if (this.currentPlotId) {
                        this.renderNoteInterface(this.currentPlotId);
                    }
                }

                // 'e' key - toggle export menu
                if (e.key === 'e') {
                    this.showExportMenu();
                }
            });
        }
    }

    // Replace the global AnnotationSystem with Sprint 4 version
    window.AnnotationSystem = Sprint4AnnotationSystem;

    console.log('✨ Sprint 4 Enhancement System loaded');
})();
