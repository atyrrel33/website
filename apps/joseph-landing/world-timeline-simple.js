gsap.registerPlugin(ScrollTrigger);
/**
 * WORLD TIMELINE - SIMPLE & INTERACTIVE
 * "There is a time for everything, and a season for every activity" (Ecclesiastes 3:1)
 * 
 * Design Philosophy:
 * - CLARITY: Vertical flow, natural reading
 * - BEAUTY: Sacred aesthetic with smooth animations
 * - INTERACTION: Cards expand, elements respond, scroll reveals
 * - PURPOSE: Trevor's chronological foundation for Joseph's story
 * 
 * For Trevor at 17: Like watching history unfold on an ancient scroll
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const TimelineState = {
        worldData: null,
        expandedCards: new Set(),
        initialized: false,
        scrollPosition: 0,
        smokingGunRevealed: false
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('⏰ Timeline initializing: "Making history come alive"');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAndBuild);
        } else {
            loadAndBuild();
        }
    }

    async function loadAndBuild() {
        try {
            const response = await fetch('world.json');
            TimelineState.worldData = await response.json();
            
            console.log('✅ World data loaded - Building timeline...');
            buildTimeline();
            setupInteractions();
            initializeAnimations();
            
        } catch (error) {
            console.error('❌ Failed to load world.json:', error);
        }
    }

    // ============================================
    // BUILD THE TIMELINE
    // ============================================
    
    function buildTimeline() {
        const worldSection = document.getElementById('worldContentContainer');
        if (!worldSection) {
            console.error('❌ World content container not found');
            return;
        }

        const timelineSection = TimelineState.worldData.sections[0]; // Timeline section
        const keyDates = timelineSection.subsections.find(s => s.subsectionId === 'key-dates');
        const pharaohs = timelineSection.subsections.find(s => s.subsectionId === 'pharaohs');
        const smokingGun = timelineSection.subsections[0].content.find(c => c.type === 'smoking-gun');

        const html = `
            <div class="timeline-simple-container">
                <!-- Header -->
                <header class="timeline-header" data-animate="fade-in">
                    <h2 class="timeline-main-title">${timelineSection.sectionTitle}</h2>
                    <p class="timeline-subtitle">${timelineSection.sectionSubtitle}</p>
                    <div class="timeline-intro">
                        <p>${timelineSection.intro}</p>
                    </div>
                </header>

                <!-- The Smoking Gun Card (Featured at top) -->
                ${buildSmokingGunCard(smokingGun)}

                <!-- Vertical Timeline -->
                <div class="timeline-vertical" data-animate="reveal">
                    <div class="timeline-spine"></div>
                    
                    <!-- Jacob's Context (before Joseph) -->
                    <div class="timeline-context-marker" data-year="1915" data-animate="slide-right">
                        <div class="context-dot"></div>
                        <div class="context-label">
                            <span class="context-year">~1915 BCE</span>
                            <span class="context-event">Jacob Born in Canaan</span>
                        </div>
                    </div>

                    <div class="timeline-context-marker" data-year="1893" data-animate="slide-right">
                        <div class="context-dot"></div>
                        <div class="context-label">
                            <span class="context-year">~1893 BCE</span>
                            <span class="context-event">Joseph Born</span>
                            <span class="context-detail">Jacob's beloved son, Rachel's firstborn</span>
                        </div>
                    </div>

                    <!-- Joseph's Life Events (from world.json) -->
                    ${buildJosephEvents(keyDates.content)}

                    <!-- Pharaohs Integrated -->
                    ${buildPharaohMarkers(pharaohs.rulers)}
                </div>

                <!-- Summary Footer -->
                <footer class="timeline-footer" data-animate="fade-in">
                    <div class="timeline-summary">
                        <h3>Joseph's Journey: 71 Years in Egypt</h3>
                        <p>From age 17 in chains to age 110 in honor—a lifetime demonstrating that God works through real people in real time to accomplish purposes that span generations.</p>
                        <div class="verse-reference">
                            <span class="verse-icon">✦</span>
                            <span class="verse-text">"You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives." — Genesis 50:20</span>
                        </div>
                    </div>
                </footer>
            </div>
        `;

        worldSection.innerHTML = html;
        TimelineState.initialized = true;
    }

    // ============================================
    // BUILD SMOKING GUN CARD
    // ============================================
    
    function buildSmokingGunCard(data) {
        if (!data) return '';

        return `
            <div class="smoking-gun-feature" data-animate="rise-up">
                <div class="feature-banner">
                    <span class="banner-icon">🔍</span>
                    <span class="banner-text">The Archaeological Smoking Gun</span>
                </div>
                
                <div class="smoking-gun-card" id="smokingGunCard">
                    <div class="gun-header">
                        <h3 class="gun-title">${data.title}</h3>
                        <p class="gun-description">${data.description}</p>
                    </div>

                    <div class="price-chart" id="priceChart">
                        <div class="chart-title">Slave Prices Across Egyptian History</div>
                        <div class="chart-bars">
                            ${data.priceComparison.map(period => `
                                <div class="price-bar-group ${period.match ? 'match' : ''}" 
                                     data-period="${period.period}">
                                    <div class="bar-wrapper">
                                        <div class="price-bar" style="height: ${getPriceHeight(period.price)}%">
                                            <span class="bar-value">${period.price}</span>
                                        </div>
                                    </div>
                                    <div class="bar-label">
                                        <div class="period-text">${period.period}</div>
                                        ${period.match ? '<div class="match-badge">✓ EXACT MATCH</div>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="chart-note">
                            <strong>The Evidence:</strong> ${data.conclusion}
                        </div>
                    </div>

                    <div class="scholar-credit">
                        <span class="credit-label">Research by:</span>
                        <span class="credit-name">${data.scholar}</span>
                        <span class="credit-desc">British Egyptologist</span>
                    </div>
                </div>
            </div>
        `;
    }

    function getPriceHeight(priceString) {
        // Extract number from price string
        const price = parseInt(priceString);
        const maxPrice = 120; // Maximum in the dataset
        return Math.min((price / maxPrice) * 100, 100);
    }

    // ============================================
    // BUILD JOSEPH'S EVENTS
    // ============================================
    
    function buildJosephEvents(events) {
        return events.map((event, index) => {
            const year = extractYear(event.date);
            const isExpanded = TimelineState.expandedCards.has(event.id);
            
            return `
                <div class="timeline-event joseph-event" 
                     data-event-id="${event.id}"
                     data-year="${year}"
                     data-animate="slide-right"
                     data-delay="${index * 0.1}">
                    
                    <!-- Date Marker -->
                    <div class="event-marker">
                        <div class="marker-dot ${getEventType(event.themes)}">
                            <span class="marker-icon">${getEventIcon(event.themes)}</span>
                        </div>
                        <div class="marker-line"></div>
                    </div>

                    <!-- Event Card -->
                    <div class="event-card ${isExpanded ? 'expanded' : ''}">
                        <div class="card-header" onclick="window.Timeline.toggleCard('${event.id}')">
                            <div class="card-year">${year} BCE</div>
                            <h3 class="card-title">${event.event}</h3>
                            <button class="expand-btn" aria-label="Expand details">
                                <span class="expand-icon">+</span>
                            </button>
                        </div>

                        <div class="card-body">
                            <div class="card-detail">
                                <span class="detail-icon">📜</span>
                                <span class="detail-text">${event.detail}</span>
                            </div>
                            
                            ${event.keyDetail ? `
                                <div class="key-detail">
                                    <span class="key-icon">⚡</span>
                                    <span class="key-text">${event.keyDetail}</span>
                                </div>
                            ` : ''}

                            <div class="verse-ref">
                                <span class="ref-icon">✦</span>
                                <span class="ref-text">${event.verseRef}</span>
                            </div>

                            <div class="themes">
                                ${event.themes.map(theme => 
                                    `<span class="theme-tag">${theme}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ============================================
    // BUILD PHARAOH MARKERS
    // ============================================
    
    function buildPharaohMarkers(pharaohs) {
        return pharaohs.map(pharaoh => {
            const startYear = parseInt(pharaoh.reign.split('-')[0]);
            
            return `
                <div class="timeline-pharaoh" 
                     data-pharaoh="${pharaoh.id}"
                     data-year="${startYear}"
                     data-animate="fade-left">
                    
                    <div class="pharaoh-marker">
                        <div class="pharaoh-crown">👑</div>
                    </div>

                    <div class="pharaoh-card" onclick="window.Timeline.togglePharaoh('${pharaoh.id}')">
                        <div class="pharaoh-header">
                            <h4 class="pharaoh-name">${pharaoh.name}</h4>
                            <span class="pharaoh-reign">${pharaoh.reign}</span>
                        </div>
                        
                        <div class="pharaoh-body">
                            <p class="pharaoh-description">${pharaoh.description}</p>
                            
                            ${pharaoh.significance ? `
                                <div class="pharaoh-significance">
                                    <strong>Why It Matters:</strong>
                                    <p>${pharaoh.significance}</p>
                                </div>
                            ` : ''}

                            ${pharaoh.keyDetail ? `
                                <div class="pharaoh-key-detail">
                                    <span class="detail-icon">⚡</span>
                                    <span>${pharaoh.keyDetail}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ============================================
    // SETUP INTERACTIONS
    // ============================================
    
    function setupInteractions() {
        // Scroll-triggered animations
        setupScrollAnimations();
        
        // Hover effects on cards
        setupHoverEffects();
        
        // Smoking gun chart interaction
        setupSmokingGunInteraction();
    }

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animate;
                    const delay = parseFloat(element.dataset.delay || 0);

                    setTimeout(() => {
                        animateElement(element, animationType);
                    }, delay * 1000);

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    function animateElement(element, type) {
        switch(type) {
            case 'fade-in':
                gsap.fromTo(element, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
                );
                break;
            
            case 'slide-right':
                gsap.fromTo(element,
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
                );
                break;
            
            case 'fade-left':
                gsap.fromTo(element,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
                );
                break;
            
            case 'rise-up':
                gsap.fromTo(element,
                    { opacity: 0, y: 50, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }
                );
                break;
            
            case 'reveal':
                gsap.fromTo(element,
                    { opacity: 0, scaleY: 0, transformOrigin: 'top' },
                    { opacity: 1, scaleY: 1, duration: 1, ease: 'power2.out' }
                );
                break;
        }
    }

    function setupHoverEffects() {
        // Event cards glow on hover
        document.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.event-card');
            if (card && !card.classList.contains('expanded')) {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.event-card');
            if (card && !card.classList.contains('expanded')) {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    }

    function setupSmokingGunInteraction() {
        const chart = document.getElementById('priceChart');
        if (!chart) return;

        const bars = chart.querySelectorAll('.price-bar-group');
        
        bars.forEach(bar => {
            bar.addEventListener('click', function() {
                // Remove previous highlights
                bars.forEach(b => b.classList.remove('highlighted'));
                
                // Add highlight to clicked bar
                this.classList.add('highlighted');
                
                // Animate the bar
                const barElement = this.querySelector('.price-bar');
                gsap.fromTo(barElement,
                    { scale: 1 },
                    { 
                        scale: 1.1,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    }
                );

                // Play sound of insight (visual feedback)
                gsap.to(this, {
                    boxShadow: '0 0 30px rgba(201, 169, 97, 0.6)',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            });
        });

        // Auto-highlight the match on first view
        setTimeout(() => {
            const matchBar = chart.querySelector('.price-bar-group.match');
            if (matchBar) {
                matchBar.classList.add('auto-highlighted');
                gsap.fromTo(matchBar.querySelector('.price-bar'),
                    { scale: 1 },
                    { 
                        scale: 1.05,
                        duration: 0.6,
                        yoyo: true,
                        repeat: 2,
                        ease: 'power2.inOut'
                    }
                );
            }
        }, 1500);
    }

    function initializeAnimations() {
        // Spine grows as you scroll
        const spine = document.querySelector('.timeline-spine');
        if (spine) {
            gsap.fromTo(spine,
                { scaleY: 0, transformOrigin: 'top' },
                { 
                    scaleY: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.timeline-vertical',
                        start: 'top center',
                        end: 'bottom bottom',
                        scrub: 1
                    }
                }
            );
        }
    }

    // ============================================
    // CARD INTERACTIONS
    // ============================================
    
    function toggleCard(eventId) {
        const card = document.querySelector(`[data-event-id="${eventId}"] .event-card`);
        if (!card) return;

        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            card.classList.remove('expanded');
            TimelineState.expandedCards.delete(eventId);
            
            gsap.to(card.querySelector('.card-body'), {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            });
            
            gsap.to(card.querySelector('.expand-icon'), {
                rotation: 0,
                duration: 0.3
            });
        } else {
            // Expand
            card.classList.add('expanded');
            TimelineState.expandedCards.add(eventId);
            
            const body = card.querySelector('.card-body');
            gsap.set(body, { height: 'auto' });
            gsap.from(body, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            gsap.to(body, {
                opacity: 1,
                duration: 0.5
            });
            
            gsap.to(card.querySelector('.expand-icon'), {
                rotation: 45,
                duration: 0.3
            });

            // Scroll into view smoothly
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function togglePharaoh(pharaohId) {
        const pharaohCard = document.querySelector(`[data-pharaoh="${pharaohId}"] .pharaoh-card`);
        if (!pharaohCard) return;

        const isExpanded = pharaohCard.classList.contains('expanded');
        
        if (isExpanded) {
            pharaohCard.classList.remove('expanded');
            gsap.to(pharaohCard.querySelector('.pharaoh-body'), {
                height: 0,
                opacity: 0,
                duration: 0.4
            });
        } else {
            // Close other pharaohs
            document.querySelectorAll('.pharaoh-card.expanded').forEach(p => {
                p.classList.remove('expanded');
            });
            
            pharaohCard.classList.add('expanded');
            const body = pharaohCard.querySelector('.pharaoh-body');
            gsap.set(body, { height: 'auto' });
            gsap.from(body, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function extractYear(dateString) {
        const match = dateString.match(/(\d{4})/);
        return match ? parseInt(match[1]) : 1876;
    }

    function getEventIcon(themes) {
        if (themes.includes('arrival') || themes.includes('slavery')) return '⛓️';
        if (themes.includes('elevation') || themes.includes('power')) return '👑';
        if (themes.includes('prosperity') || themes.includes('abundance')) return '🌾';
        if (themes.includes('famine') || themes.includes('testing')) return '⚖️';
        if (themes.includes('migration') || themes.includes('family')) return '🤝';
        if (themes.includes('death') || themes.includes('completion')) return '⚱️';
        return '📍';
    }

    function getEventType(themes) {
        if (themes.includes('elevation') || themes.includes('power')) return 'elevation';
        if (themes.includes('famine') || themes.includes('testing')) return 'trial';
        if (themes.includes('death')) return 'completion';
        return 'standard';
    }

    // ============================================
    // PUBLIC API
    // ============================================
    
    window.Timeline = {
        toggleCard: toggleCard,
        togglePharaoh: togglePharaoh,
        navigateToYear: function(year) {
            const element = document.querySelector(`[data-year="${year}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // ============================================
    // INITIALIZE
    // ============================================
    
    init();

})();
