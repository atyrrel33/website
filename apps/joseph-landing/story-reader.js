// ============================================
// THE STORY READER - PHASE 2 SPRINT 1
// Scripture made accessible through sacred interface
// ============================================

class StoryReader {
    constructor() {
        this.storyData = null;
        this.currentChapter = null;
        this.currentAuthor = 'trevor'; // Default to Trevor
        this.init();
        this.annotationSystem = null; // Will be initialized after DOM ready
    }

    async init() {
        await this.loadStoryData();
        this.renderChapterNavigator();
        this.attachEventListeners();
        
        // Check if there's a saved chapter to restore
        const savedChapter = localStorage.getItem('josephCurrentChapter');
        if (savedChapter) {
            const chapter = this.storyData.chapters.find(c => c.id === savedChapter);
            if (chapter) {
                this.openChapter(chapter);
            }
        }
        
        // Initialize annotation system once story is loaded
        if (typeof AnnotationSystem !== 'undefined') {
            this.annotationSystem = new AnnotationSystem(this);
            console.log('✍️ Annotation system connected');
        }
    }

    async loadStoryData() {
        try {
           const response = await fetch('story.json');
            if (!response.ok) {
                throw new Error('Failed to load story data');
            }
            const rawData = await response.json();
            
            // Transform the plot-point JSON into app-ready format
            this.storyData = this.transformData(rawData);
            console.log('✅ Story data loaded:', this.storyData);
        } catch (error) {
            console.error('❌ Error loading story data:', error);
            this.showError('Unable to load the story. Please refresh the page.');
        }
    }

    transformData(rawData) {
        // Flatten parts into chapters and enrich with metadata
        const chapters = [];
        
        if (rawData.parts) {
            rawData.parts.forEach(part => {
                if (part.chapters) {
                    part.chapters.forEach(chapter => {
                        // Extract Joseph's age from plot points
                        const josephAge = this.extractJosephAge(chapter);
                        
                        // Extract unique themes from all plot points
                        const themes = this.extractThemes(chapter);
                        
                        // Generate summary from first few plot points
                        const summary = this.generateSummary(chapter);
                        
                        // Transform to app format
                        const transformedChapter = {
                            id: `gen-${chapter.chapterNumber}`,
                            book: 'Genesis',
                            chapterNumber: chapter.chapterNumber.toString(),
                            title: chapter.chapterTitle,
                            summary: summary,
                            josephAge: josephAge,
                            themes: themes.slice(0, 5), // Top 5 themes
                            sections: chapter.sections.map(section => ({
                                sectionTitle: section.sectionTitle,
                                verseRange: section.verseRange,
                                plotPoints: section.plotPoints.map(point => ({
                                    id: point.id,
                                    text: point.text,
                                    verse: section.verseRange // Add verse reference to each point
                                }))
                            })),
                            reflectionQuestions: this.generateReflectionQuestions(chapter)
                        };
                        
                        chapters.push(transformedChapter);
                    });
                }
            });
        }
        
        return { chapters };
    }

    extractJosephAge(chapter) {
        // Look for age mentions in plot points
        for (const section of chapter.sections) {
            for (const point of section.plotPoints) {
                if (point.keyDetail && point.keyDetail.includes('years old')) {
                    const match = point.keyDetail.match(/(\d+)\s*years old/);
                    if (match) return match[1];
                }
                if (point.text.includes('age 17')) return '17';
                if (point.text.includes('Age 17')) return '17';
            }
        }
        // Default ages based on chapter number
        const chapterAges = {
            37: '17', 38: '17-18', 39: '17-28', 40: '28-30', 41: '30', 
            42: '39', 43: '39', 44: '39', 45: '39', 46: '39', 47: '39-56', 
            48: '56', 49: '56', 50: '56-110'
        };
        return chapterAges[chapter.chapterNumber] || 'Unknown';
    }

    extractThemes(chapter) {
        const themeSet = new Set();
        chapter.sections.forEach(section => {
            section.plotPoints.forEach(point => {
                if (point.themes) {
                    point.themes.forEach(theme => themeSet.add(theme));
                }
            });
        });
        return Array.from(themeSet);
    }

    generateSummary(chapter) {
        // Create summary from first section's key points
        const firstSection = chapter.sections[0];
        if (firstSection && firstSection.plotPoints.length > 0) {
            const keyPoints = firstSection.plotPoints
                .filter(p => p.keyDetail)
                .slice(0, 2);
            
            if (keyPoints.length > 0) {
                return keyPoints.map(p => p.keyDetail).join('. ');
            }
            
            // Fallback to first plot point
            return firstSection.plotPoints[0].text.substring(0, 120) + '...';
        }
        return chapter.chapterTitle;
    }

    generateReflectionQuestions(chapter) {
        // Generate 2-3 reflection questions based on themes
        const themes = this.extractThemes(chapter);
        const questions = [];
        
        if (themes.includes('dreams') || themes.includes('prophecy')) {
            questions.push('How do Joseph\'s dreams shape his identity and future?');
        }
        if (themes.includes('betrayal') || themes.includes('hatred')) {
            questions.push('What do the brothers\' actions reveal about jealousy and family conflict?');
        }
        if (themes.includes('providence') || themes.includes('God\'s presence')) {
            questions.push('Where do you see God\'s hand at work in this chapter?');
        }
        
        // Default question if none generated
        if (questions.length === 0) {
            questions.push('What stands out most to you in this chapter?');
            questions.push('How might this chapter connect to your own life?');
        }
        
        return questions.slice(0, 3);
    }

    renderChapterNavigator() {
        const grid = document.getElementById('chapterGrid');
        if (!grid || !this.storyData || !this.storyData.chapters) return;

        grid.innerHTML = '';

        this.storyData.chapters.forEach((chapter, index) => {
            const card = this.createChapterCard(chapter, index);
            grid.appendChild(card);
        });
    }

    createChapterCard(chapter, index) {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.dataset.chapterId = chapter.id;

        // Check if chapter has notes
        const hasNotes = this.chapterHasNotes(chapter.id);
        const noteCount = hasNotes ? this.getChapterNoteCount(chapter.id) : 0;

        card.innerHTML = `
            <div class="chapter-card-meta">
                <span>${chapter.book}</span>
                <span class="chapter-divider">•</span>
                <span>${chapter.chapterNumber}</span>
            </div>
            <h3 class="chapter-card-title">${chapter.title}</h3>
            <p class="chapter-card-summary">${chapter.summary}</p>
            <div class="chapter-card-footer">
                <span class="chapter-card-age">Joseph: Age ${chapter.josephAge}</span>
                ${hasNotes ? `
                    <span class="chapter-card-badge has-notes">
                        ✏️ ${noteCount} ${noteCount === 1 ? 'note' : 'notes'}
                    </span>
                ` : `
                    <span class="chapter-card-badge">
                        Unread
                    </span>
                `}
            </div>
        `;

        card.addEventListener('click', () => this.openChapter(chapter));

        return card;
    }

    openChapter(chapter) {
        this.currentChapter = chapter;
        
        // Save current chapter to localStorage
        localStorage.setItem('josephCurrentChapter', chapter.id);
        
        // Hide navigator, show reading view
        document.getElementById('chapterNavigator').style.display = 'none';
        document.getElementById('readingView').style.display = 'block';
        
        // Populate reading view
        this.renderChapterContent(chapter);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderChapterContent(chapter) {
        // Update header
        document.getElementById('currentChapterBook').textContent = chapter.book;
        document.getElementById('currentChapterNumber').textContent = chapter.chapterNumber;
        document.getElementById('currentChapterTitle').textContent = chapter.title;
        document.getElementById('currentChapterAge').textContent = chapter.josephAge;

        // Render themes
        this.renderThemes(chapter.themes);

        // Render narrative content (plot points)
        this.renderNarrative(chapter.sections);

        // Render reflection questions
        this.renderReflectionQuestions(chapter.reflectionQuestions);

        // Prepare annotation workspace
        this.prepareAnnotationWorkspace();
    }

    renderThemes(themes) {
        const themesContainer = document.getElementById('chapterThemes');
        themesContainer.innerHTML = `
            <div class="themes-title">Themes to Notice</div>
            <div class="themes-list">
                ${themes.map(theme => `
                    <span class="theme-tag">${theme}</span>
                `).join('')}
            </div>
        `;
    }

    renderNarrative(sections) {
        const narrativeContent = document.getElementById('narrativeContent');
        narrativeContent.innerHTML = '';

        sections.forEach(section => {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'narrative-section';

            let sectionHTML = `
                <h3 class="section-title">${section.sectionTitle}</h3>
                <div class="section-verse-range">${section.verseRange}</div>
            `;

            section.plotPoints.forEach(point => {
                const hasNote = this.plotPointHasNote(point.id);
                
                sectionHTML += `
                    <div class="plot-point ${hasNote ? 'has-note' : ''}" data-plot-id="${point.id}">
                        <div class="plot-point-text">
                            <span class="plot-point-bullet">•</span>
                            <span>${point.text}</span>
                        </div>
                        ${point.verse ? `<div class="plot-point-verse">${point.verse}</div>` : ''}
                    </div>
                `;
            });

            sectionElement.innerHTML = sectionHTML;
            narrativeContent.appendChild(sectionElement);
        });

        // Attach click handlers to plot points for annotation
        this.attachPlotPointHandlers();
    }

    renderReflectionQuestions(questions) {
        const questionsContainer = document.getElementById('reflectionQuestions');
        questionsContainer.innerHTML = `
            <h3 class="reflection-title">❓ Questions to Consider</h3>
            <ul class="reflection-list">
                ${questions.map(q => `
                    <li class="reflection-item">${q}</li>
                `).join('')}
            </ul>
        `;
    }

    prepareAnnotationWorkspace() {
            const workspace = document.getElementById('annotationWorkspace');
            workspace.innerHTML = `
                <div class="annotation-empty-state">
                    <div class="empty-icon">✍️</div>
                    <p>Click any plot point on the left to add your first note</p>
                    <small>Notes appear handwritten and stay anchored to their plot points</small>
                </div>
            `;
    }

    attachPlotPointHandlers() {
        const plotPoints = document.querySelectorAll('.plot-point');
        plotPoints.forEach(point => {
            point.addEventListener('click', (e) => {
                const plotId = point.dataset.plotId;
                this.handlePlotPointClick(plotId, point);
            });
        });
    }
    handlePlotPointClick(plotId, element) {
            // Delegate to annotation system if available
            if (this.annotationSystem) {
                this.annotationSystem.handlePlotPointClick(plotId, element);
            } else {
                // Fallback if annotation system not loaded
                document.querySelectorAll('.plot-point').forEach(p => p.classList.remove('selected'));
                element.classList.add('selected');
                this.showPlaceholderMessage('Loading annotation system...');
            }
    }

    showPlaceholderMessage(message) {
        const workspace = document.getElementById('annotationWorkspace');
        workspace.innerHTML = `
            <div class="annotation-empty-state">
                <div class="empty-icon">🔨</div>
                <p>${message}</p>
                <small>For now, you can explore the chapters and plot points</small>
            </div>
        `;
    }

    attachEventListeners() {
        // Back to chapters button
        const backBtn = document.getElementById('backToChapters');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.closeChapter());
        }

        // Author toggle buttons
        const trevorToggle = document.getElementById('trevorToggle');
        const tyrrelToggle = document.getElementById('tyrrelToggle');

        if (trevorToggle) {
            trevorToggle.addEventListener('click', () => this.switchAuthor('trevor'));
        }
        if (tyrrelToggle) {
            tyrrelToggle.addEventListener('click', () => this.switchAuthor('tyrrel'));
        }
    }

    closeChapter() {
        document.getElementById('chapterNavigator').style.display = 'block';
        document.getElementById('readingView').style.display = 'none';
        this.currentChapter = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchAuthor(author) {
        this.currentAuthor = author;
        
        // Update button states
        const trevorToggle = document.getElementById('trevorToggle');
        const tyrrelToggle = document.getElementById('tyrrelToggle');
        
        if (author === 'trevor') {
            trevorToggle.classList.add('active');
            tyrrelToggle.classList.remove('active');
        } else {
            tyrrelToggle.classList.add('active');
            trevorToggle.classList.remove('active');
        }

        console.log(`✏️ Switched to ${author}'s notebook`);
    }

    // ============================================
    // HELPER FUNCTIONS FOR NOTE CHECKING
    // These will be expanded in Sprint 2
    // ============================================
    
    chapterHasNotes(chapterId) {
            if (this.annotationSystem) {
                return this.annotationSystem.chapterHasNotes(chapterId);
            }
            return false;
        }
    
        getChapterNoteCount(chapterId) {
            if (this.annotationSystem) {
                return this.annotationSystem.getChapterNoteCount(chapterId);
            }
            return 0;
        }
    
        plotPointHasNote(plotPointId) {
            if (this.annotationSystem) {
                return this.annotationSystem.plotPointHasNote(plotPointId);
            }
            return false;
        }

    showError(message) {
        const grid = document.getElementById('chapterGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--burgundy-bright);">
                    <h3>⚠️ ${message}</h3>
                    <p style="margin-top: 1rem; color: var(--papyrus-aged);">
                        Make sure story.json is in the same directory
                    </p>
                </div>
            `;
        }
    }
}

// ============================================
// INITIALIZE WHEN DOM IS READY
// ============================================

// Check if we're on The Story tab before initializing
function initStoryReader() {
    const storyPanel = document.getElementById('panel-story');
    if (storyPanel) {
        // Initialize the story reader
        window.storyReader = new StoryReader();
        console.log('📖 Story Reader initialized');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStoryReader);
} else {
    initStoryReader();
}

// Add CSS for selected plot point
const style = document.createElement('style');
style.textContent = `
    .plot-point.selected {
        background: rgba(201, 169, 97, 0.15) !important;
        border-left-color: var(--gold-bright) !important;
        transform: translateX(6px);
        box-shadow: 0 4px 12px rgba(201, 169, 97, 0.2);
    }
`;
document.head.appendChild(style);
