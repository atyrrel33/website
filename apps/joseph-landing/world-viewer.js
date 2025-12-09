/**
 * WORLD VIEWER - SPRINT 4: THE INTEGRATION
 * Master orchestrator for The World section
 * 
 * "The heavens declare the glory of God; the skies proclaim the work of his hands.
 *  Day after day they pour forth speech; night after night they reveal knowledge."
 * — Psalm 19:1-2
 * 
 * Purpose: Coordinate Timeline, Evidence, and Culture into one seamless experience
 * Features: Section navigation, progress tracking, cross-references, mobile optimization
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const WorldViewer = {
        // Current active subsection
        activeSection: 'timeline', // 'timeline' | 'evidence' | 'culture'
        
        // Progress tracking
        progress: {
            timelineVisited: false,
            evidenceVisited: false,
            cultureVisited: false,
            evidenceCardsViewed: [],
            cultureSubsViewed: [],
            smokingGunExpanded: false,
            completionPercentage: 0
        },
        
        // Navigation state
        isTransitioning: false,
        
        // DOM elements
        elements: {
            worldContainer: null,
            sectionNav: null,
            progressBar: null,
            backToStory: null
        },
        
        // Sub-module references
        timeline: null,
        evidence: null,
        culture: null
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🌍 World Viewer initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupWorldViewer);
        } else {
            setupWorldViewer();
        }
    }

    function setupWorldViewer() {
        // Build the World section hub
        buildWorldHub();
        
        // Load saved progress
        loadProgress();
        
        // Setup navigation
        setupNavigation();
        
        // Setup cross-references
        setupCrossReferences();
        
        // Initialize subsections when World tab is clicked
        observeWorldActivation();
        
        console.log('✅ World Viewer ready');
    }

    // ============================================
    // WORLD HUB CONSTRUCTION
    // ============================================
    
    function buildWorldHub() {
        const worldSection = document.getElementById('world');
        if (!worldSection) {
            console.error('❌ World section not found');
            return;
        }

        const hubHTML = `
            <div class="world-viewer-container">
                <!-- World Section Header -->
                <div class="world-section-header">
                    <div class="section-breadcrumb">
                        <button class="breadcrumb-btn" id="backToStory">
                            ← Back to Story
                        </button>
                    </div>
                    
                    <h1 class="world-main-title">The World</h1>
                    <p class="world-main-subtitle">Joseph's Egypt: Where History and Faith Meet</p>
                    
                    <!-- Progress Indicator -->
                    <div class="world-progress-container">
                        <div class="progress-label">
                            <span>Exploration Progress</span>
                            <span id="progressPercent">0%</span>
                        </div>
                        <div class="progress-bar-track">
                            <div class="progress-bar-fill" id="worldProgressBar"></div>
                        </div>
                    </div>
                </div>

                <!-- Section Navigation -->
                <nav class="world-section-nav" id="worldSectionNav">
                    <button class="world-nav-btn active" data-section="timeline">
                        <div class="nav-icon">📅</div>
                        <div class="nav-content">
                            <div class="nav-title">The Timeline</div>
                            <div class="nav-desc">When Did Joseph Live?</div>
                        </div>
                    </button>
                    
                    <button class="world-nav-btn" data-section="evidence">
                        <div class="nav-icon">🏺</div>
                        <div class="nav-content">
                            <div class="nav-title">The Evidence</div>
                            <div class="nav-desc">Archaeological Proof</div>
                        </div>
                    </button>
                    
                    <button class="world-nav-btn" data-section="culture">
                        <div class="nav-icon">🏛️</div>
                        <div class="nav-content">
                            <div class="nav-title">The Culture</div>
                            <div class="nav-desc">Life in Middle Kingdom Egypt</div>
                        </div>
                    </button>
                </nav>

                <!-- Content Container (subsections render here) -->
                <div class="world-content-container" id="worldContentContainer">
                    <!-- Timeline, Evidence, and Culture modules will render here -->
                </div>

                <!-- Significance Reflection (always visible at bottom) -->
                <div class="world-significance-footer">
                    <div class="significance-card">
                        <h3 class="significance-title">💎 Why This Matters</h3>
                        <p class="significance-text">
                            Every archaeological discovery, every timeline marker, every cultural detail
                            serves a sacred purpose: to show that Joseph's story isn't mythology—it's
                            <strong>history</strong>. God works in real time, in real places, with real people.
                        </p>
                        <p class="significance-text">
                            The 20-shekel price tag, the Middle Kingdom dating, the Semitic settlements in
                            the Delta—these aren't just interesting facts. They're <strong>fingerprints</strong>.
                            Evidence that the story you're reading actually happened, that the God who
                            orchestrated Joseph's rise is the same God writing your story today.
                        </p>
                        <blockquote class="significance-quote">
                            "It is the glory of God to conceal a matter; to search out a matter is the 
                            glory of kings." <span class="verse-ref">— Proverbs 25:2</span>
                        </blockquote>
                        <p class="significance-final">
                            Faith and evidence aren't enemies—they're dance partners. The deeper you dig
                            into history, the more solid the foundation becomes.
                        </p>
                    </div>
                </div>
            </div>
        `;

        worldSection.innerHTML = hubHTML;
        
        // Cache DOM elements
        cacheElements();
    }

    function cacheElements() {
        WorldViewer.elements.worldContainer = document.querySelector('.world-viewer-container');
        WorldViewer.elements.sectionNav = document.getElementById('worldSectionNav');
        WorldViewer.elements.progressBar = document.getElementById('worldProgressBar');
        WorldViewer.elements.backToStory = document.getElementById('backToStory');
    }

    // ============================================
    // NAVIGATION SYSTEM
    // ============================================
    
    function setupNavigation() {
        const navButtons = document.querySelectorAll('.world-nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                navigateToSection(targetSection);
            });
        });

        // Back to Story button
        if (WorldViewer.elements.backToStory) {
            WorldViewer.elements.backToStory.addEventListener('click', () => {
                const storyTab = document.querySelector('[data-tab="story"]');
                if (storyTab) storyTab.click();
            });
        }
    }

    function navigateToSection(sectionName) {
        if (WorldViewer.isTransitioning) return;
        if (sectionName === WorldViewer.activeSection) return;
        
        WorldViewer.isTransitioning = true;
        
        // Update nav buttons
        const navButtons = document.querySelectorAll('.world-nav-btn');
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionName);
        });
        
        // Transition animation
        const contentContainer = document.getElementById('worldContentContainer');
        
        gsap.to(contentContainer, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                // Load the new section
                loadSection(sectionName);
                
                // Mark as visited
                markSectionVisited(sectionName);
                
                // Fade back in
                gsap.fromTo(contentContainer,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.4,
                        onComplete: () => {
                            WorldViewer.isTransitioning = false;
                        }
                    }
                );
            }
        });
        
        WorldViewer.activeSection = sectionName;
    }

    function loadSection(sectionName) {
        const contentContainer = document.getElementById('world');        
        switch(sectionName) {
            case 'timeline':
                contentContainer.innerHTML = '<div id="timeline-section"></div>';
                // Trigger timeline initialization after container exists
                if (window.TimelineModule) {
                    setTimeout(() => window.TimelineModule.init(), 50);
                }
                break;
                
            case 'evidence':
                // Evidence gallery builds itself via world-evidence.js
                contentContainer.innerHTML = '<div id="evidence-section"></div>';
                break;
                
            case 'culture':
                // Culture explorer builds itself via world-culture.js
                contentContainer.innerHTML = '<div id="culture-explorer"></div>';
                if (window.CultureExplorer) {
                    const explorer = new window.CultureExplorer();
                    explorer.init();
                }
                break;
        }
    }

    // ============================================
    // PROGRESS TRACKING
    // ============================================
    
    function loadProgress() {
        const saved = localStorage.getItem('josephApp_worldProgress');
        if (saved) {
            try {
                WorldViewer.progress = JSON.parse(saved);
                updateProgressDisplay();
            } catch (e) {
                console.error('Failed to load progress:', e);
            }
        }
    }

    function saveProgress() {
        localStorage.setItem('josephApp_worldProgress', JSON.stringify(WorldViewer.progress));
        updateProgressDisplay();
    }

    function markSectionVisited(sectionName) {
        const progressKey = `${sectionName}Visited`;
        if (WorldViewer.progress[progressKey] !== undefined) {
            WorldViewer.progress[progressKey] = true;
            calculateCompletionPercentage();
            saveProgress();
        }
    }

    function calculateCompletionPercentage() {
        let completedItems = 0;
        let totalItems = 0;
        
        // Section visits (3 sections × 20 points each = 60 points)
        totalItems += 3;
        if (WorldViewer.progress.timelineVisited) completedItems += 1;
        if (WorldViewer.progress.evidenceVisited) completedItems += 1;
        if (WorldViewer.progress.cultureVisited) completedItems += 1;
        
        // Evidence cards viewed (6 cards × 5 points each = 30 points)
        // Culture subsections viewed (4 subs × 2.5 points each = 10 points)
        // These would be tracked by the sub-modules
        
        // Base calculation on section visits for now
        WorldViewer.progress.completionPercentage = Math.round((completedItems / totalItems) * 100);
    }

    function updateProgressDisplay() {
        const progressBar = WorldViewer.elements.progressBar;
        const percentLabel = document.getElementById('progressPercent');
        
        if (progressBar) {
            gsap.to(progressBar, {
                width: `${WorldViewer.progress.completionPercentage}%`,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
        
        if (percentLabel) {
            percentLabel.textContent = `${WorldViewer.progress.completionPercentage}%`;
        }
    }

    // ============================================
    // CROSS-REFERENCES
    // ============================================
    
    function setupCrossReferences() {
        // Listen for events from Story section that reference World content
        document.addEventListener('josephApp:storyReference', (e) => {
            const { type, target } = e.detail;
            
            if (type === 'world') {
                // Switch to World tab
                const worldTab = document.querySelector('[data-tab="world"]');
                if (worldTab) worldTab.click();
                
                // Navigate to specific subsection
                setTimeout(() => {
                    if (target.section) {
                        navigateToSection(target.section);
                    }
                    
                    // Scroll to specific element if provided
                    if (target.elementId) {
                        const element = document.getElementById(target.elementId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Pulse highlight
                            gsap.fromTo(element,
                                { backgroundColor: 'rgba(201, 169, 97, 0.3)' },
                                { 
                                    backgroundColor: 'transparent',
                                    duration: 2,
                                    ease: 'power2.out'
                                }
                            );
                        }
                    }
                }, 500);
            }
        });
    }

    // ============================================
    // WORLD TAB ACTIVATION OBSERVER
    // ============================================
    
    function observeWorldActivation() {
        // When user clicks the World tab, ensure content is loaded
        const worldTab = document.querySelector('[data-tab="world"]');
        if (!worldTab) return;
        
        worldTab.addEventListener('click', () => {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (!WorldViewer.elements.worldContainer) {
                    setupWorldViewer();
                }
                
                // Load initial section
                if (!document.getElementById('timeline-section')) {
                    loadSection(WorldViewer.activeSection);
                }
            }, 100);
        });
    }

    // ============================================
    // MOBILE OPTIMIZATION
    // ============================================
    
    function setupMobileOptimizations() {
        // Detect mobile
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Stack navigation vertically on mobile
            const sectionNav = WorldViewer.elements.sectionNav;
            if (sectionNav) {
                sectionNav.classList.add('mobile-stack');
            }
            
            // Enable swipe gestures for section navigation
            setupSwipeNavigation();
        }
    }

    function setupSwipeNavigation() {
        const contentContainer = document.getElementById('worldContentContainer');
        if (!contentContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        contentContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        contentContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });
        
        function handleSwipeGesture() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) < swipeThreshold) return;
            
            const sections = ['timeline', 'evidence', 'culture'];
            const currentIndex = sections.indexOf(WorldViewer.activeSection);
            
            if (diff > 0 && currentIndex < sections.length - 1) {
                // Swipe left - next section
                navigateToSection(sections[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous section
                navigateToSection(sections[currentIndex - 1]);
            }
        }
    }

    // Setup mobile optimizations on load and resize
    window.addEventListener('resize', setupMobileOptimizations);
    setupMobileOptimizations();

    // ============================================
    // PUBLIC API
    // ============================================
    
    window.WorldViewer = {
        navigateToSection: navigateToSection,
        
        markEvidenceCardViewed: function(cardId) {
            if (!WorldViewer.progress.evidenceCardsViewed.includes(cardId)) {
                WorldViewer.progress.evidenceCardsViewed.push(cardId);
                saveProgress();
            }
        },
        
        markCultureSubViewed: function(subId) {
            if (!WorldViewer.progress.cultureSubsViewed.includes(subId)) {
                WorldViewer.progress.cultureSubsViewed.push(subId);
                saveProgress();
            }
        },
        
        markSmokingGunExpanded: function() {
            WorldViewer.progress.smokingGunExpanded = true;
            saveProgress();
        },
        
        getProgress: function() {
            return WorldViewer.progress;
        },
        
        resetProgress: function() {
            WorldViewer.progress = {
                timelineVisited: false,
                evidenceVisited: false,
                cultureVisited: false,
                evidenceCardsViewed: [],
                cultureSubsViewed: [],
                smokingGunExpanded: false,
                completionPercentage: 0
            };
            saveProgress();
        }
    };

    // ============================================
    // INITIALIZE
    // ============================================
    
    init();

})();
