/**
 * THE PATTERN SECTION - SACRED SCRIPT
 * "All Scripture is breathed out by God" (2 Timothy 3:16)
 * 
 * Sacred Architecture: This module reveals to Trevor the divine typology—
 * how Joseph's story was always pointing beyond itself to Jesus Christ.
 * 
 * Phase: The Pattern Section
 * Purpose: Interactive typological exploration showing Joseph as Christ's shadow
 * Features: Category navigation, parallel comparisons, scarlet thread timeline
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const PatternState = {
        patternData: null,
        currentCategory: 0,
        categories: [],
        
        // DOM elements (cached for performance)
        elements: {
            patternSection: null,
            container: null,
            navButtons: null,
            categoryDisplay: null
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('✨ Pattern Section initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadPatternData);
        } else {
            loadPatternData();
        }
    }

    async function loadPatternData() {
        try {
            const response = await fetch('pattern.json');
            PatternState.patternData = await response.json();
            PatternState.categories = PatternState.patternData.categories;
            
            console.log('✅ Pattern data loaded:', PatternState.patternData.title);
            
            buildPatternUI();
            
        } catch (error) {
            console.error('❌ Failed to load pattern.json:', error);
        }
    }

    // ============================================
    // UI CONSTRUCTION
    // ============================================
    
    function buildPatternUI() {
        const patternSection = document.getElementById('pattern');
        if (!patternSection) {
            console.error('❌ Pattern section not found in DOM');
            return;
        }

        const data = PatternState.patternData;
        
        const html = `
            <div class="pattern-container">
                <!-- Header -->
                <div class="pattern-header">
                    <h1 class="pattern-title">${data.title}</h1>
                    <h2 class="pattern-subtitle">${data.subtitle}</h2>
                    <p class="pattern-description">${data.description}</p>
                    <div class="pattern-intro">${data.intro}</div>
                </div>

                <!-- Category Navigation -->
                <nav class="pattern-nav" id="patternNav">
                    ${buildCategoryNav()}
                </nav>

                <!-- Category Content Area -->
                <div id="categoryDisplay"></div>

                <!-- Scarlet Thread Section -->
                ${buildScarletThread()}

                <!-- Practical Application -->
                ${buildPracticalSection()}

                <!-- Reflection Questions -->
                ${buildReflectionSection()}
            </div>
        `;

        patternSection.innerHTML = html;
        
        // Cache DOM elements
        PatternState.elements.container = patternSection.querySelector('.pattern-container');
        PatternState.elements.navButtons = patternSection.querySelectorAll('.pattern-nav-btn');
        PatternState.elements.categoryDisplay = patternSection.querySelector('#categoryDisplay');
        
        // Set up event listeners
        setupEventListeners();
        
        // Display first category
        displayCategory(0);
    }

    // ============================================
    // CATEGORY NAVIGATION
    // ============================================
    
    function buildCategoryNav() {
        return PatternState.categories.map((category, index) => `
            <button class="pattern-nav-btn ${index === 0 ? 'active' : ''}" 
                    data-category-index="${index}">
                <span>${category.categoryTitle}</span>
            </button>
        `).join('');
    }

    function setupEventListeners() {
        PatternState.elements.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Update active state
                PatternState.elements.navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Display selected category
                displayCategory(index);
            });
        });
    }

    function displayCategory(index) {
        const category = PatternState.categories[index];
        PatternState.currentCategory = index;
        
        const html = `
            <div class="category-section">
                <div class="category-header">
                    <h2 class="category-title">${category.categoryTitle}</h2>
                    <h3 class="category-subtitle">${category.categorySubtitle}</h3>
                    <p class="category-intro">${category.intro}</p>
                </div>

                <div class="parallels-grid">
                    ${buildParallels(category.parallels)}
                </div>
            </div>
        `;
        
        PatternState.elements.categoryDisplay.innerHTML = html;
        
        // Smooth scroll to category
        PatternState.elements.categoryDisplay.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // ============================================
    // PARALLEL COMPARISONS
    // ============================================
    
    function buildParallels(parallels) {
        return parallels.map(parallel => `
            <div class="parallel-card">
                <h3 class="parallel-title">${parallel.title}</h3>
                
                <div class="parallel-comparison">
                    <!-- Joseph Side -->
                    <div class="joseph-side">
                        <div class="side-label">Joseph (The Shadow)</div>
                        <p class="side-text">"${parallel.joseph.text}"</p>
                        <p class="side-verse">${parallel.joseph.verseRef}</p>
                    </div>
                    
                    <!-- Jesus Side -->
                    <div class="jesus-side">
                        <div class="side-label">Jesus (The Reality)</div>
                        <p class="side-text">"${parallel.jesus.text}"</p>
                        <p class="side-verse">${parallel.jesus.verseRef}</p>
                    </div>
                </div>
                
                <div class="parallel-connection">
                    <strong>The Connection:</strong> ${parallel.connection}
                </div>
                
                <div class="parallel-significance">
                    ${parallel.significance}
                </div>
                
                ${parallel.keyDetail ? `
                    <div class="parallel-detail">
                        <strong>Key Detail:</strong> ${parallel.keyDetail}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // ============================================
    // SCARLET THREAD TIMELINE
    // ============================================
    
    function buildScarletThread() {
        const thread = PatternState.patternData.scarletThread;
        
        return `
            <div class="scarlet-thread-section">
                <div class="scarlet-thread-header">
                    <h2 class="scarlet-thread-title">${thread.title}</h2>
                    <h3 class="scarlet-thread-subtitle">${thread.subtitle}</h3>
                    <p class="scarlet-thread-intro">${thread.intro}</p>
                </div>

                <div class="thread-timeline">
                    ${buildThreadNodes(thread.figures)}
                </div>

                <div class="pattern-intro" style="margin-top: var(--space-2xl);">
                    ${thread.visualConcept.description}
                </div>
            </div>
        `;
    }

    function buildThreadNodes(figures) {
        return figures.map(figure => `
            <div class="thread-node">
                <div class="thread-card">
                    <h4 class="thread-figure">${figure.figure}</h4>
                    <p class="thread-period">${figure.period}</p>
                    <p class="thread-promise">"${figure.promise}"</p>
                    <p class="thread-verse">${figure.verseRef}</p>
                    <p class="thread-connection">${figure.connectionToJoseph}</p>
                    ${figure.keyDetail ? `
                        <div class="parallel-detail" style="margin-top: var(--space-sm);">
                            ${figure.keyDetail}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // PRACTICAL APPLICATION
    // ============================================
    
    function buildPracticalSection() {
        const practical = PatternState.patternData.practicalApplication;
        
        return `
            <div class="practical-section">
                <div class="practical-header">
                    <h2 class="practical-title">${practical.title}</h2>
                    <h3 class="practical-subtitle">${practical.subtitle}</h3>
                    <p class="practical-intro">${practical.intro}</p>
                </div>

                <div class="principles-grid">
                    ${buildPrinciples(practical.principles)}
                </div>
            </div>
        `;
    }

    function buildPrinciples(principles) {
        return principles.map(principle => `
            <div class="principle-card">
                <h3 class="principle-title">${principle.title}</h3>
                
                <div class="principle-examples">
                    <p class="principle-example">
                        <strong>Joseph:</strong> ${principle.josephExample}
                    </p>
                    <p class="principle-example">
                        <strong>Jesus:</strong> ${principle.jesusExample}
                    </p>
                </div>
                
                <p class="principle-application">
                    <strong>For You:</strong> ${principle.yourApplication}
                </p>
                
                <p class="principle-verse">${principle.verseRef}</p>
            </div>
        `).join('');
    }

    // ============================================
    // REFLECTION QUESTIONS
    // ============================================
    
    function buildReflectionSection() {
        const reflection = PatternState.patternData.reflectionQuestions;
        
        return `
            <div class="reflection-section">
                <div class="reflection-header">
                    <h2 class="reflection-title">${reflection.title}</h2>
                    <p class="reflection-intro">${reflection.intro}</p>
                </div>

                <div class="questions-list">
                    ${buildQuestions(reflection.questions)}
                </div>
            </div>
        `;
    }

    function buildQuestions(questions) {
        return questions.map(q => `
            <div class="question-card">
                <p class="question-text">${q.question}</p>
                <p class="question-purpose">${q.purpose}</p>
            </div>
        `).join('');
    }

    // ============================================
    // START THE SACRED WORK
    // ============================================
    
    init();

})();
