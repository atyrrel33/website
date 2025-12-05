// ============================================
// ANNOTATION SYSTEM - SPRINT 3 ENHANCEMENTS
// Enhanced filtering, mobile UX, and polish
// "As iron sharpens iron, so one person sharpens another" - Proverbs 27:17
// ============================================

// Extend the existing AnnotationSystem class
(function() {
    const OriginalAnnotationSystem = window.AnnotationSystem;

    class EnhancedAnnotationSystem extends OriginalAnnotationSystem {
        constructor(storyReader) {
            super(storyReader);
            this.filterByAuthor = 'both'; // 'trevor', 'tyrrel', or 'both'
            this.filterByType = 'all'; // 'all', 'insight', 'question', 'parallel', 'general'
            this.mobileExpanded = false;
            this.initEnhancements();
        }

        initEnhancements() {
            this.setupMobileHandlers();
            this.updateAuthorBodyClass();
            console.log('✨ Sprint 3 enhancements initialized');
        }

        // ============================================
        // MOBILE SUPPORT
        // ============================================

        setupMobileHandlers() {
            // Only on mobile devices
            if (window.innerWidth <= 768) {
                const annotationColumn = document.getElementById('annotationColumn');
                const stickyHeader = document.querySelector('.annotation-sticky-header');
                
                if (stickyHeader) {
                    stickyHeader.addEventListener('click', () => {
                        this.toggleMobileAnnotations();
                    });
                }

                // Close when clicking outside
                document.addEventListener('click', (e) => {
                    if (this.mobileExpanded && 
                        !annotationColumn.contains(e.target) && 
                        !e.target.closest('.plot-point')) {
                        this.collapseMobileAnnotations();
                    }
                });
            }

            // Handle resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.mobileExpanded = false;
                    const annotationColumn = document.getElementById('annotationColumn');
                    if (annotationColumn) {
                        annotationColumn.classList.remove('expanded');
                    }
                }
            });
        }

        toggleMobileAnnotations() {
            this.mobileExpanded = !this.mobileExpanded;
            const annotationColumn = document.getElementById('annotationColumn');
            
            if (this.mobileExpanded) {
                annotationColumn.classList.add('expanded');
            } else {
                annotationColumn.classList.remove('expanded');
            }
        }

        collapseMobileAnnotations() {
            this.mobileExpanded = false;
            const annotationColumn = document.getElementById('annotationColumn');
            if (annotationColumn) {
                annotationColumn.classList.remove('expanded');
            }
        }

        expandMobileAnnotations() {
            this.mobileExpanded = true;
            const annotationColumn = document.getElementById('annotationColumn');
            if (annotationColumn) {
                annotationColumn.classList.add('expanded');
            }
        }

        // ============================================
        // ENHANCED FILTERING
        // ============================================

        setAuthorFilter(author) {
            this.filterByAuthor = author;
            this.updateAuthorBodyClass();
            if (this.currentPlotId) {
                this.renderNoteInterface(this.currentPlotId);
            }
        }

        setTypeFilter(type) {
            this.filterByType = type;
            if (this.currentPlotId) {
                this.renderNoteInterface(this.currentPlotId);
            }
        }

        updateAuthorBodyClass() {
            document.body.classList.remove('author-trevor', 'author-tyrrel', 'author-both');
            document.body.classList.add(`author-${this.currentAuthor}`);
        }

        // ============================================
        // ENHANCED UI RENDERING
        // ============================================

        renderNoteInterface(plotId) {
            const workspace = document.getElementById('annotationWorkspace');
            const notes = this.getNotes(plotId);
            
            workspace.innerHTML = `
                ${this.renderFilterControls(notes)}
                <div class="annotation-body">
                    ${notes.length > 0 ? this.renderFilteredNotes(notes) : this.renderEmptyState()}
                    ${this.renderNewNoteForm()}
                </div>
            `;

            // Attach handlers
            this.attachAnnotationHandlers();
            this.attachFilterHandlers();

            // Auto-expand on mobile when adding note
            if (window.innerWidth <= 768) {
                this.expandMobileAnnotations();
            }
        }

        renderFilterControls(notes) {
            const trevorCount = notes.filter(n => n.author === 'trevor').length;
            const tyrrelCount = notes.filter(n => n.author === 'tyrrel').length;
            const totalCount = notes.length;

            // Count by type
            const insightCount = notes.filter(n => n.type === 'insight').length;
            const questionCount = notes.filter(n => n.type === 'question').length;
            const parallelCount = notes.filter(n => n.type === 'parallel').length;
            const generalCount = notes.filter(n => n.type === 'general').length;

            return `
                <div class="annotation-header">
                    <!-- Author Toggle -->
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

                    <!-- Filter Controls -->
                    <div class="filter-controls">
                        <button class="filter-btn ${this.filterByAuthor === 'both' ? 'active' : ''}" 
                                data-filter="both">
                            Both <span class="note-count">${totalCount}</span>
                        </button>
                        <button class="filter-btn ${this.filterByAuthor === 'trevor' ? 'active' : ''}" 
                                data-filter="trevor">
                            Trevor <span class="note-count">${trevorCount}</span>
                        </button>
                        <button class="filter-btn ${this.filterByAuthor === 'tyrrel' ? 'active' : ''}" 
                                data-filter="tyrrel">
                            Tyrrel <span class="note-count">${tyrrelCount}</span>
                        </button>
                    </div>

                    <!-- Type Filters -->
                    ${totalCount > 0 ? `
                        <div class="type-filters">
                            <button class="type-filter-chip ${this.filterByType === 'all' ? 'active' : ''}" 
                                    data-type="all">
                                All (${totalCount})
                            </button>
                            ${insightCount > 0 ? `
                                <button class="type-filter-chip ${this.filterByType === 'insight' ? 'active' : ''}" 
                                        data-type="insight">
                                    💡 Insights (${insightCount})
                                </button>
                            ` : ''}
                            ${questionCount > 0 ? `
                                <button class="type-filter-chip ${this.filterByType === 'question' ? 'active' : ''}" 
                                        data-type="question">
                                    ❓ Questions (${questionCount})
                                </button>
                            ` : ''}
                            ${parallelCount > 0 ? `
                                <button class="type-filter-chip ${this.filterByType === 'parallel' ? 'active' : ''}" 
                                        data-type="parallel">
                                    🔗 Parallels (${parallelCount})
                                </button>
                            ` : ''}
                            ${generalCount > 0 ? `
                                <button class="type-filter-chip ${this.filterByType === 'general' ? 'active' : ''}" 
                                        data-type="general">
                                    📖 General (${generalCount})
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        renderFilteredNotes(notes) {
            // Apply filters
            let filteredNotes = notes;

            // Filter by author
            if (this.filterByAuthor !== 'both') {
                filteredNotes = filteredNotes.filter(n => n.author === this.filterByAuthor);
            }

            // Filter by type
            if (this.filterByType !== 'all') {
                filteredNotes = filteredNotes.filter(n => n.type === this.filterByType);
            }

            // Also filter by current author when adding new note
            if (this.filterByAuthor === 'both') {
                // Show all, but keep current author context
            } else {
                // Override current author to match filter
                this.currentAuthor = this.filterByAuthor;
                this.updateAuthorBodyClass();
            }

            if (filteredNotes.length === 0) {
                return this.renderEmptyFilterState();
            }

            return `
                <div class="notes-list">
                    ${filteredNotes.map(note => this.renderNote(note)).join('')}
                </div>
            `;
        }

        renderEmptyState() {
            return `
                <div class="no-notes-message">
                    <div style="text-align: center; padding: var(--space-2xl);">
                        <div style="font-size: 3rem; opacity: 0.3; margin-bottom: var(--space-md);">✍️</div>
                        <p style="color: var(--papyrus-aged); font-family: 'EB Garamond', serif; font-size: 1.125rem;">
                            No notes yet on this plot point.
                        </p>
                        <p style="color: var(--gold-dim); font-size: 0.95rem; margin-top: var(--space-sm);">
                            Add your first thought below!
                        </p>
                    </div>
                </div>
            `;
        }

        renderEmptyFilterState() {
            return `
                <div class="no-notes-message">
                    <div style="text-align: center; padding: var(--space-xl);">
                        <div style="font-size: 2rem; opacity: 0.3; margin-bottom: var(--space-md);">🔍</div>
                        <p style="color: var(--papyrus-aged); font-family: 'EB Garamond', serif;">
                            No notes match this filter.
                        </p>
                        <p style="color: var(--gold-dim); font-size: 0.875rem; margin-top: var(--space-sm);">
                            Try changing the filter or add a new note!
                        </p>
                    </div>
                </div>
            `;
        }

        // ============================================
        // ENHANCED EVENT HANDLERS
        // ============================================

        attachFilterHandlers() {
            // Author filter buttons
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    this.setAuthorFilter(filter);
                });
            });

            // Type filter chips
            const typeChips = document.querySelectorAll('.type-filter-chip');
            typeChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const type = chip.dataset.type;
                    this.setTypeFilter(type);
                });
            });
        }

        // Override the parent's attachAnnotationHandlers to maintain compatibility
        attachAnnotationHandlers() {
            super.attachAnnotationHandlers();
            // Additional handlers are attached via attachFilterHandlers
        }

        // ============================================
        // ENHANCED PLOT POINT INTERACTION
        // ============================================

        handlePlotPointClick(plotId, element) {
            super.handlePlotPointClick(plotId, element);

            // Auto-expand on mobile
            if (window.innerWidth <= 768) {
                this.expandMobileAnnotations();
            }

            // Smooth scroll to annotation column on desktop
            if (window.innerWidth > 768) {
                const annotationColumn = document.getElementById('annotationColumn');
                if (annotationColumn) {
                    annotationColumn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
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

                // 'f' key - toggle filter
                if (e.key === 'f') {
                    const nextFilter = this.filterByAuthor === 'both' ? 'trevor' : 
                                      this.filterByAuthor === 'trevor' ? 'tyrrel' : 'both';
                    this.setAuthorFilter(nextFilter);
                }
            });
        }
    }

    // Replace the global AnnotationSystem with our enhanced version
    window.AnnotationSystem = EnhancedAnnotationSystem;

    console.log('✨ Sprint 3 Enhanced Annotation System loaded');
})();
