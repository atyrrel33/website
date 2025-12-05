// ============================================
// ANNOTATION SYSTEM - SPRINT 2
// Where Word becomes Dialogue
// ============================================

class AnnotationSystem {
    constructor(storyReader) {
        this.storyReader = storyReader;
        this.currentPlotId = null;
        this.currentAuthor = 'trevor';
        this.notes = this.loadNotes();
        this.init();
    }

    init() {
        this.attachEventListeners();
        console.log('✍️ Annotation System initialized');
    }

    // ============================================
    // LOCALSTORAGE OPERATIONS
    // ============================================

    loadNotes() {
        try {
            const stored = localStorage.getItem('josephNotes');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notes:', error);
            return [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('josephNotes', JSON.stringify(this.notes));
            console.log('💾 Notes saved:', this.notes.length, 'total');
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    }

    // ============================================
    // CRUD OPERATIONS
    // ============================================

    createNote(plotPointId, author, type, text) {
        const note = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            plotPointId: plotPointId,
            author: author,
            type: type || 'general',
            text: text,
            createdAt: new Date().toISOString(),
            editedAt: null
        };

        this.notes.push(note);
        this.saveNotes();
        
        // Update UI
        this.updatePlotPointIndicator(plotPointId);
        this.renderNotesForPlotPoint(plotPointId);
        
        return note;
    }

    getNotes(plotPointId) {
        return this.notes.filter(note => note.plotPointId === plotPointId);
    }

    getNote(noteId) {
        return this.notes.find(note => note.id === noteId);
    }

    updateNote(noteId, newText) {
        const note = this.getNote(noteId);
        if (note) {
            note.text = newText;
            note.editedAt = new Date().toISOString();
            this.saveNotes();
            return true;
        }
        return false;
    }

    deleteNote(noteId) {
        const index = this.notes.findIndex(note => note.id === noteId);
        if (index > -1) {
            const note = this.notes[index];
            this.notes.splice(index, 1);
            this.saveNotes();
            
            // Update UI
            this.updatePlotPointIndicator(note.plotPointId);
            this.renderNotesForPlotPoint(note.plotPointId);
            
            return true;
        }
        return false;
    }

    // ============================================
    // UI RENDERING
    // ============================================

    handlePlotPointClick(plotId, element) {
        this.currentPlotId = plotId;
        
        // Highlight selected plot point
        document.querySelectorAll('.plot-point').forEach(p => p.classList.remove('selected'));
        element.classList.add('selected');

        // Render note interface
        this.renderNoteInterface(plotId);
    }

    renderNoteInterface(plotId) {
        const workspace = document.getElementById('annotationWorkspace');
        const notes = this.getNotes(plotId);
        
        workspace.innerHTML = `
            <div class="annotation-header">
                <div class="author-toggle">
                    <button class="author-btn ${this.currentAuthor === 'trevor' ? 'active' : ''}" 
                            data-author="trevor">
                        Trevor's Notes
                    </button>
                    <button class="author-btn ${this.currentAuthor === 'tyrrel' ? 'active' : ''}" 
                            data-author="tyrrel">
                        Tyrrel's Notes
                    </button>
                </div>
            </div>

            <div class="annotation-body">
                ${notes.length > 0 ? this.renderExistingNotes(notes) : ''}
                ${this.renderNewNoteForm()}
            </div>
        `;

        // Attach handlers
        this.attachAnnotationHandlers();
    }

    renderExistingNotes(notes) {
        // Filter by current author
        const authorNotes = notes.filter(n => n.author === this.currentAuthor);
        
        if (authorNotes.length === 0) {
            return `
                <div class="no-notes-message">
                    <p>No notes yet from ${this.currentAuthor}. Add your first thought below!</p>
                </div>
            `;
        }

        return `
            <div class="notes-list">
                ${authorNotes.map(note => this.renderNote(note)).join('')}
            </div>
        `;
    }

    renderNote(note) {
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
                <div class="note-content">${this.escapeHtml(note.text)}</div>
                <div class="note-footer">
                    <small>${timestamp}${edited}</small>
                </div>
            </div>
        `;
    }

    renderNewNoteForm() {
        return `
            <div class="note-form">
                <div class="note-form-header">
                    <span class="form-label">Add New Note</span>
                    <select class="note-type-select" id="noteTypeSelect">
                        <option value="general">📖 General</option>
                        <option value="insight">💡 Insight</option>
                        <option value="question">❓ Question</option>
                        <option value="parallel">🔗 Modern Parallel</option>
                    </select>
                </div>
                <textarea 
                    class="note-input" 
                    id="noteInput" 
                    placeholder="Type your note here... it will appear in handwritten style"
                    rows="6"
                ></textarea>
                <div class="note-form-actions">
                    <button class="btn-save-note" id="saveNoteBtn">Save Note</button>
                    <button class="btn-cancel-note" id="cancelNoteBtn">Clear</button>
                </div>
            </div>
        `;
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    attachEventListeners() {
        // Override story reader's plot point handler
        if (this.storyReader) {
            this.storyReader.handlePlotPointClick = (plotId, element) => {
                this.handlePlotPointClick(plotId, element);
            };
        }
    }

    attachAnnotationHandlers() {
        // Author toggle buttons
        const authorBtns = document.querySelectorAll('.author-btn');
        authorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentAuthor = btn.dataset.author;
                this.renderNoteInterface(this.currentPlotId);
            });
        });

        // Save note button
        const saveBtn = document.getElementById('saveNoteBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveNewNote());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelNoteBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('noteInput').value = '';
                document.getElementById('noteTypeSelect').selectedIndex = 0;
            });
        }

        // Edit note buttons
        const editBtns = document.querySelectorAll('.edit-note');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteCard = e.target.closest('.note-card');
                const noteId = noteCard.dataset.noteId;
                this.editNote(noteId);
            });
        });

        // Delete note buttons
        const deleteBtns = document.querySelectorAll('.delete-note');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteCard = e.target.closest('.note-card');
                const noteId = noteCard.dataset.noteId;
                this.confirmDeleteNote(noteId);
            });
        });

        // Enter key to save (Ctrl/Cmd + Enter)
        const noteInput = document.getElementById('noteInput');
        if (noteInput) {
            noteInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    this.saveNewNote();
                }
            });
        }
    }

    saveNewNote() {
        const input = document.getElementById('noteInput');
        const typeSelect = document.getElementById('noteTypeSelect');
        
        const text = input.value.trim();
        const type = typeSelect.value;

        if (!text) {
            alert('Please enter some text for your note');
            return;
        }

        // Create the note
        this.createNote(this.currentPlotId, this.currentAuthor, type, text);

        // Clear form
        input.value = '';
        typeSelect.selectedIndex = 0;

        // Show success feedback
        this.showSaveSuccess();
    }

    editNote(noteId) {
        const note = this.getNote(noteId);
        if (!note) return;

        const noteCard = document.querySelector(`[data-note-id="${noteId}"]`);
        const content = noteCard.querySelector('.note-content');
        
        // Replace content with editable textarea
        const originalText = note.text;
        content.innerHTML = `
            <textarea class="note-edit-input">${this.escapeHtml(originalText)}</textarea>
            <div class="note-edit-actions">
                <button class="btn-save-edit">Save</button>
                <button class="btn-cancel-edit">Cancel</button>
            </div>
        `;

        // Focus textarea
        const textarea = content.querySelector('.note-edit-input');
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

        // Save edit
        content.querySelector('.btn-save-edit').addEventListener('click', () => {
            const newText = textarea.value.trim();
            if (newText && newText !== originalText) {
                this.updateNote(noteId, newText);
            }
            this.renderNoteInterface(this.currentPlotId);
        });

        // Cancel edit
        content.querySelector('.btn-cancel-edit').addEventListener('click', () => {
            this.renderNoteInterface(this.currentPlotId);
        });
    }

    confirmDeleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.deleteNote(noteId);
        }
    }

    // ============================================
    // UI UPDATES
    // ============================================

    updatePlotPointIndicator(plotId) {
        const plotPoint = document.querySelector(`[data-plot-id="${plotId}"]`);
        if (!plotPoint) return;

        const hasNotes = this.getNotes(plotId).length > 0;
        
        if (hasNotes) {
            plotPoint.classList.add('has-note');
        } else {
            plotPoint.classList.remove('has-note');
        }
    }

    renderNotesForPlotPoint(plotId) {
        if (this.currentPlotId === plotId) {
            this.renderNoteInterface(plotId);
        }
    }

    showSaveSuccess() {
        const saveBtn = document.getElementById('saveNoteBtn');
        if (!saveBtn) return;

        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = 'var(--gold-warm)';

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    getNoteTypeIcon(type) {
        const icons = {
            insight: '💡',
            question: '❓',
            parallel: '🔗',
            general: '📖'
        };
        return icons[type] || '📝';
    }

    formatTimestamp(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // PUBLIC API FOR STORY READER
    // ============================================

    chapterHasNotes(chapterId) {
        // Get all plot points for this chapter and check if any have notes
        const chapterNotes = this.notes.filter(note => 
            note.plotPointId.startsWith(chapterId)
        );
        return chapterNotes.length > 0;
    }

    getChapterNoteCount(chapterId) {
        const chapterNotes = this.notes.filter(note => 
            note.plotPointId.startsWith(chapterId)
        );
        return chapterNotes.length;
    }

    plotPointHasNote(plotPointId) {
        return this.getNotes(plotPointId).length > 0;
    }
}

// Export for use in story-reader.js
window.AnnotationSystem = AnnotationSystem;
