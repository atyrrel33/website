/**
 * WORLD TIMELINE - SPRINT 1: THE TIMELINE
 * "When Did Joseph Live?" - Interactive Historical Foundation
 * 
 * Sacred Architecture: This module grounds Trevor in the historical reality
 * that Joseph's story isn't mythology—it's history written in real soil.
 * 
 * Phase: The World Section
 * Purpose: Museum-quality timeline showing 12th Dynasty Egypt (2100-1700 BCE)
 * Features: Horizontal scrubber, 20-shekel smoking gun, Joseph's life journey
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const WorldTimeline = {
        worldData: null,
        timelineData: null,
        currentYear: 1876, // Joseph's arrival year
        isDragging: false,
        smokingGunExpanded: false,
        expandedPharaoh: null,
        
        // Timeline bounds
        minYear: 2100,
        maxYear: 1700,
        yearSpan: 400,
        
        // DOM elements (cached for performance)
        elements: {
            timeline: null,
            scrubber: null,
            yearMarker: null,
            yearLabel: null,
            eventsContainer: null,
            smokingGunCard: null,
            josephJourney: null,
            pharaohs: null
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🌍 World Timeline initializing...');
        
        // Wait for DOM and world.json to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadWorldData);
        } else {
            loadWorldData();
        }
    }

    async function loadWorldData() {
        try {
            const response = await fetch('world.json');
            WorldTimeline.worldData = await response.json();
            WorldTimeline.timelineData = WorldTimeline.worldData.sections[0]; // Timeline section
            
            console.log('✅ World data loaded:', WorldTimeline.timelineData.sectionTitle);
            
            // Build the timeline UI
            buildTimelineUI();
            
        } catch (error) {
            console.error('❌ Failed to load world.json:', error);
        }
    }

    // ============================================
    // UI CONSTRUCTION
    // ============================================
    
    function buildTimelineUI() {
        const worldSection = document.getElementById('world');
        if (!worldSection) {
            console.error('❌ World section not found in DOM');
            return;
        }

        // Create timeline container
        const timelineHTML = `
            <div class="world-timeline-container">
                <!-- Header -->
                <div class="world-timeline-header">
                    <h2 class="timeline-title">${WorldTimeline.timelineData.sectionTitle}</h2>
                    <p class="timeline-subtitle">${WorldTimeline.timelineData.sectionSubtitle}</p>
                    <p class="timeline-intro">${WorldTimeline.timelineData.intro}</p>
                </div>

                <!-- Interactive Timeline Scrubber -->
                <div class="timeline-scrubber-wrapper">
                    <div class="timeline-scrubber" id="timelineScrubber">
                        <div class="timeline-track">
                            <div class="timeline-progress" id="timelineProgress"></div>
                        </div>
                        
                        <!-- Year markers -->
                        <div class="timeline-markers" id="timelineMarkers"></div>
                        
                        <!-- Current year indicator -->
                        <div class="timeline-current-year" id="currentYearMarker">
                            <div class="year-indicator">
                                <span class="year-label" id="yearLabel">1876 BCE</span>
                                <div class="year-pointer"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-year-labels">
                        <span>2100 BCE</span>
                        <span>1900 BCE</span>
                        <span>1700 BCE</span>
                    </div>
                </div>

                <!-- Joseph's Life Journey -->
                <div class="joseph-journey" id="josephJourney"></div>

                <!-- The 20-Shekel Smoking Gun -->
                <div class="smoking-gun-section" id="smokingGun"></div>

                <!-- Pharaohs Timeline -->
                <div class="pharaohs-timeline" id="pharaohsTimeline"></div>
            </div>
        `;

        worldSection.innerHTML = timelineHTML;
        
        // Cache DOM elements
        cacheElements();
        
        // Build individual sections
        buildTimelineMarkers();
        buildJosephJourney();
        buildSmokingGunCard();
        buildPharaohsTimeline();
        
        // Setup interactions
        setupTimelineInteractions();
        
        // Initial animations
        animateTimelineEntrance();
        
        console.log('✅ Timeline UI built successfully');
    }

    function cacheElements() {
        WorldTimeline.elements.timeline = document.getElementById('timelineScrubber');
        WorldTimeline.elements.yearMarker = document.getElementById('currentYearMarker');
        WorldTimeline.elements.yearLabel = document.getElementById('yearLabel');
        WorldTimeline.elements.josephJourney = document.getElementById('josephJourney');
        WorldTimeline.elements.smokingGunCard = document.getElementById('smokingGun');
        WorldTimeline.elements.pharaohs = document.getElementById('pharaohsTimeline');
    }

    // ============================================
    // TIMELINE MARKERS
    // ============================================
    
    function buildTimelineMarkers() {
        const markersContainer = document.getElementById('timelineMarkers');
        if (!markersContainer) return;

        // Key historical markers
        const markers = [
            { year: 2100, label: 'Early Middle Kingdom', type: 'historical' },
            { year: 2000, label: '12th Dynasty Begins', type: 'dynasty' },
            { year: 1897, label: 'Senusret II', type: 'pharaoh' },
            { year: 1876, label: 'Joseph Arrives', type: 'joseph', highlight: true },
            { year: 1863, label: 'Joseph: Vizier', type: 'joseph', highlight: true },
            { year: 1856, label: 'Famine Begins', type: 'joseph' },
            { year: 1805, label: 'Joseph Dies', type: 'joseph' },
            { year: 1800, label: '13th Dynasty', type: 'dynasty' },
            { year: 1700, label: 'Hyksos Period', type: 'historical' }
        ];

        let markersHTML = '';
        markers.forEach(marker => {
            const position = yearToPosition(marker.year);
            const highlightClass = marker.highlight ? 'highlight' : '';
            const typeClass = `marker-${marker.type}`;
            
            markersHTML += `
                <div class="timeline-marker ${typeClass} ${highlightClass}" 
                     style="left: ${position}%"
                     data-year="${marker.year}"
                     data-label="${marker.label}">
                    <div class="marker-dot"></div>
                    <div class="marker-label">${marker.label}</div>
                    <div class="marker-year">${marker.year} BCE</div>
                </div>
            `;
        });

        markersContainer.innerHTML = markersHTML;
    }

    // ============================================
    // JOSEPH'S LIFE JOURNEY
    // ============================================
    
    function buildJosephJourney() {
        const journeyContainer = WorldTimeline.elements.josephJourney;
        if (!journeyContainer) return;

        // Get key dates from world.json
        const keyDates = WorldTimeline.timelineData.subsections
            .find(sub => sub.subsectionId === 'key-dates');
        
        if (!keyDates) return;

        let journeyHTML = '<div class="journey-header">';
        journeyHTML += '<h3 class="journey-title">Joseph\'s Life Journey</h3>';
        journeyHTML += '<p class="journey-subtitle">From Pit to Palace: 71 Years in Egypt</p>';
        journeyHTML += '</div>';
        
        journeyHTML += '<div class="journey-path">';
        
        keyDates.content.forEach((event, index) => {
            const year = extractYear(event.date);
            const position = yearToPosition(year);
            
            journeyHTML += `
                <div class="journey-event" 
                     style="left: ${position}%"
                     data-year="${year}"
                     data-index="${index}">
                    <div class="journey-marker">
                        <div class="marker-icon">${getEventIcon(event.themes)}</div>
                    </div>
                    <div class="journey-details">
                        <h4 class="event-title">${event.event}</h4>
                        <p class="event-date">${event.date}</p>
                        <p class="event-detail">${event.detail}</p>
                        <span class="event-verse">${event.verseRef}</span>
                    </div>
                </div>
            `;
        });
        
        journeyHTML += '</div>';
        journeyContainer.innerHTML = journeyHTML;
    }

    // ============================================
    // THE 20-SHEKEL SMOKING GUN
    // ============================================
    
    function buildSmokingGunCard() {
        const smokingGunContainer = WorldTimeline.elements.smokingGunCard;
        if (!smokingGunContainer) return;

        // Get smoking gun data from world.json
        const smokingGunData = WorldTimeline.timelineData.subsections[0].content
            .find(item => item.type === 'smoking-gun');
        
        if (!smokingGunData) return;

        let cardHTML = `
            <div class="smoking-gun-card">
                <div class="smoking-gun-header">
                    <div class="smoking-gun-icon">🔍</div>
                    <h3 class="smoking-gun-title">${smokingGunData.title}</h3>
                </div>
                
                <p class="smoking-gun-description">${smokingGunData.description}</p>
                
                <!-- Interactive Price Chart -->
                <div class="price-chart" id="priceChart">
                    <div class="chart-title">Slave Prices Across Egyptian History</div>
                    <div class="chart-bars">
        `;

        // Build price comparison bars
        smokingGunData.priceComparison.forEach((price, index) => {
            const maxPrice = 120; // Persian period max
            const heightPercent = (parseInt(price.price) / maxPrice) * 100;
            const matchClass = price.match ? 'price-match' : '';
            
            cardHTML += `
                <div class="price-bar-wrapper">
                    <div class="price-bar ${matchClass}" 
                         style="height: ${heightPercent}%"
                         data-period="${price.period}"
                         data-price="${price.price}">
                        <div class="price-value">${price.price}</div>
                        ${price.match ? '<div class="match-indicator">✓ EXACT MATCH</div>' : ''}
                    </div>
                    <div class="price-label">${price.period}</div>
                </div>
            `;
        });

        cardHTML += `
                    </div>
                </div>
                
                <div class="smoking-gun-conclusion">
                    <p>${smokingGunData.conclusion}</p>
                    <div class="scholar-credit">
                        <span>Research by:</span>
                        <strong>${smokingGunData.scholar}</strong>
                    </div>
                </div>
                
                <button class="expand-btn" id="expandSmokingGun">
                    Learn More About This Evidence
                </button>
            </div>
        `;

        smokingGunContainer.innerHTML = cardHTML;
        
        // Setup expand/collapse
        const expandBtn = document.getElementById('expandSmokingGun');
        if (expandBtn) {
            expandBtn.addEventListener('click', toggleSmokingGunExpanded);
        }
    }

    function toggleSmokingGunExpanded() {
        WorldTimeline.smokingGunExpanded = !WorldTimeline.smokingGunExpanded;
        const card = document.querySelector('.smoking-gun-card');
        const btn = document.getElementById('expandSmokingGun');
        
        if (WorldTimeline.smokingGunExpanded) {
            card.classList.add('expanded');
            btn.textContent = 'Show Less';
            
            // Animate price bars sequentially
            gsap.from('.price-bar', {
                scaleY: 0,
                transformOrigin: 'bottom',
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            });
        } else {
            card.classList.remove('expanded');
            btn.textContent = 'Learn More About This Evidence';
        }
    }

    // ============================================
    // PHARAOHS TIMELINE
    // ============================================
    
    function buildPharaohsTimeline() {
        const pharaohsContainer = WorldTimeline.elements.pharaohs;
        if (!pharaohsContainer) return;

        // Get pharaohs data
        const pharaohsData = WorldTimeline.timelineData.subsections
            .find(sub => sub.subsectionId === 'pharaohs');
        
        if (!pharaohsData) return;

        let pharaohsHTML = `
            <div class="pharaohs-header">
                <h3 class="pharaohs-title">${pharaohsData.subsectionTitle}</h3>
                <p class="pharaohs-intro">${pharaohsData.intro}</p>
            </div>
            <div class="pharaohs-list" id="pharaohsList">
        `;

        // Build pharaoh cards
        pharaohsData.rulers.forEach((pharaoh, index) => {
            const [startYear, endYear] = pharaoh.reign.split('-').map(y => parseInt(y.trim()));
            const startPos = yearToPosition(startYear);
            const endPos = yearToPosition(endYear);
            const width = endPos - startPos;
            
            pharaohsHTML += `
                <div class="pharaoh-card" 
                     data-pharaoh="${pharaoh.id}"
                     data-index="${index}"
                     data-reign-start="${startYear}"
                     data-reign-end="${endYear}"
                     style="left: ${startPos}%; width: ${width}%">
                    <div class="pharaoh-info">
                        <h4 class="pharaoh-name">${pharaoh.name}</h4>
                        <p class="pharaoh-reign">${pharaoh.reign}</p>
                        <button class="pharaoh-expand-btn">+</button>
                    </div>
                    <div class="pharaoh-details">
                        <p class="pharaoh-description">${pharaoh.description}</p>
                        <div class="pharaoh-significance">
                            <strong>Significance:</strong>
                            <p>${pharaoh.significance}</p>
                        </div>
                        ${pharaoh.keyDetail ? `<div class="pharaoh-key-detail">⭐ ${pharaoh.keyDetail}</div>` : ''}
                    </div>
                </div>
            `;
        });

        pharaohsHTML += '</div>';
        pharaohsContainer.innerHTML = pharaohsHTML;
        
        // Setup pharaoh card interactions
        setupPharaohCards();
    }

    function setupPharaohCards() {
        const pharaohCards = document.querySelectorAll('.pharaoh-card');
        
        pharaohCards.forEach(card => {
            const expandBtn = card.querySelector('.pharaoh-expand-btn');
            
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePharaohCard(card);
            });
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -5,
                    boxShadow: '0 8px 24px rgba(201, 169, 97, 0.3)',
                    duration: 0.3
                });
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('expanded')) {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        duration: 0.3
                    });
                }
            });
        });
    }

    function togglePharaohCard(card) {
        const isExpanded = card.classList.contains('expanded');
        const expandBtn = card.querySelector('.pharaoh-expand-btn');
        const details = card.querySelector('.pharaoh-details');
        
        if (isExpanded) {
            // Collapse
            card.classList.remove('expanded');
            expandBtn.textContent = '+';
            gsap.to(details, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        } else {
            // Expand - collapse others first
            const allCards = document.querySelectorAll('.pharaoh-card');
            allCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    togglePharaohCard(otherCard);
                }
            });
            
            card.classList.add('expanded');
            expandBtn.textContent = '−';
            gsap.fromTo(details, 
                { height: 0, opacity: 0 },
                { 
                    height: 'auto', 
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                }
            );
        }
    }

    // ============================================
    // TIMELINE INTERACTIONS
    // ============================================
    
    function setupTimelineInteractions() {
        const scrubber = WorldTimeline.elements.timeline;
        if (!scrubber) return;

        // Mouse/Touch drag on timeline
        scrubber.addEventListener('mousedown', handleDragStart);
        scrubber.addEventListener('touchstart', handleDragStart, { passive: false });
        
        // Click on timeline to jump
        scrubber.addEventListener('click', handleTimelineClick);
        
        // Hover effects on markers
        const markers = document.querySelectorAll('.timeline-marker');
        markers.forEach(marker => {
            marker.addEventListener('mouseenter', handleMarkerHover);
            marker.addEventListener('mouseleave', handleMarkerLeave);
        });
        
        // Journey event interactions
        const journeyEvents = document.querySelectorAll('.journey-event');
        journeyEvents.forEach(event => {
            event.addEventListener('click', handleJourneyEventClick);
        });
    }

    function handleDragStart(e) {
        e.preventDefault();
        WorldTimeline.isDragging = true;
        
        const scrubber = WorldTimeline.elements.timeline;
        scrubber.classList.add('dragging');
        
        // Global handlers for drag and release
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDrag, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
        
        // Initial position update
        handleDrag(e);
    }

    function handleDrag(e) {
        if (!WorldTimeline.isDragging) return;
        
        e.preventDefault();
        const scrubber = WorldTimeline.elements.timeline;
        const rect = scrubber.getBoundingClientRect();
        
        // Get x position (works for both mouse and touch)
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        // Update year
        const year = positionToYear(position);
        updateCurrentYear(year, position);
    }

    function handleDragEnd() {
        WorldTimeline.isDragging = false;
        
        const scrubber = WorldTimeline.elements.timeline;
        scrubber.classList.remove('dragging');
        
        // Remove global handlers
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleDragEnd);
    }

    function handleTimelineClick(e) {
        if (WorldTimeline.isDragging) return;
        
        const scrubber = WorldTimeline.elements.timeline;
        const rect = scrubber.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const position = (x / rect.width) * 100;
        const year = positionToYear(position);
        
        // Animate to clicked position
        gsap.to({ year: WorldTimeline.currentYear }, {
            year: year,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: function() {
                const currentYear = Math.round(this.targets()[0].year);
                const currentPosition = yearToPosition(currentYear);
                updateCurrentYear(currentYear, currentPosition);
            }
        });
    }

    function handleMarkerHover(e) {
        const marker = e.currentTarget;
        gsap.to(marker.querySelector('.marker-dot'), {
            scale: 1.5,
            duration: 0.2
        });
        gsap.to(marker.querySelector('.marker-label'), {
            opacity: 1,
            y: -5,
            duration: 0.2
        });
    }

    function handleMarkerLeave(e) {
        const marker = e.currentTarget;
        gsap.to(marker.querySelector('.marker-dot'), {
            scale: 1,
            duration: 0.2
        });
        gsap.to(marker.querySelector('.marker-label'), {
            opacity: 0.8,
            y: 0,
            duration: 0.2
        });
    }

    function handleJourneyEventClick(e) {
        const event = e.currentTarget;
        const year = parseInt(event.dataset.year);
        const position = yearToPosition(year);
        
        // Animate to event year
        gsap.to({ year: WorldTimeline.currentYear }, {
            year: year,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: function() {
                const currentYear = Math.round(this.targets()[0].year);
                const currentPosition = yearToPosition(currentYear);
                updateCurrentYear(currentYear, currentPosition);
            }
        });
        
        // Pulse the event
        gsap.fromTo(event, 
            { scale: 1 },
            { 
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            }
        );
    }

    function updateCurrentYear(year, position) {
        WorldTimeline.currentYear = year;
        
        // Update year label
        if (WorldTimeline.elements.yearLabel) {
            WorldTimeline.elements.yearLabel.textContent = `${year} BCE`;
        }
        
        // Update marker position
        if (WorldTimeline.elements.yearMarker) {
            WorldTimeline.elements.yearMarker.style.left = `${position}%`;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('timelineProgress');
        if (progressBar) {
            progressBar.style.width = `${position}%`;
        }
        
        // 🔥 NEW: Update contextual content based on year
        updateTimelineContext(year);
    }
    
    // ============================================
    // CONTEXTUAL HISTORY DISPLAY
    // ============================================
    
    function updateTimelineContext(year) {
        // Highlight active Joseph events
        highlightActiveEvents(year);
        
        // Highlight active pharaohs
        highlightActivePharaohs(year);
        
        // Update context panel
        updateContextPanel(year);
    }
    
    function highlightActiveEvents(year) {
        const journeyEvents = document.querySelectorAll('.journey-event');
        const tolerance = 5; // Years of tolerance for highlighting
        
        journeyEvents.forEach(event => {
            const eventYear = parseInt(event.dataset.year);
            const isActive = Math.abs(year - eventYear) <= tolerance;
            
            if (isActive) {
                event.classList.add('active-event');
                gsap.to(event, {
                    scale: 1.15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                event.classList.remove('active-event');
                gsap.to(event, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    function highlightActivePharaohs(year) {
        const pharaohCards = document.querySelectorAll('.pharaoh-card');
        
        pharaohCards.forEach(card => {
            const reignStart = parseInt(card.dataset.reignStart);
            const reignEnd = parseInt(card.dataset.reignEnd);
            const isReigning = year >= reignEnd && year <= reignStart; // BCE numbers are reversed
            
            if (isReigning) {
                card.classList.add('active-pharaoh');
            } else {
                card.classList.remove('active-pharaoh');
            }
        });
    }
    
    function updateContextPanel(year) {
        // Get or create context panel
        let contextPanel = document.getElementById('timelineContext');
        if (!contextPanel) {
            const container = document.querySelector('.world-timeline-container');
            if (!container) return;
            
            contextPanel = document.createElement('div');
            contextPanel.id = 'timelineContext';
            contextPanel.className = 'timeline-context-panel';
            
            // Insert after the scrubber
            const scrubberWrapper = document.querySelector('.timeline-scrubber-wrapper');
            scrubberWrapper.after(contextPanel);
        }
        
        // Find what's happening at this year
        const context = getYearContext(year);
        
        if (context.events.length > 0 || context.pharaoh) {
            contextPanel.innerHTML = buildContextHTML(context, year);
            contextPanel.style.display = 'block';
            
            // Animate in
            gsap.fromTo(contextPanel, 
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            // Show period overview
            contextPanel.innerHTML = buildPeriodHTML(year);
            contextPanel.style.display = 'block';
            
            gsap.fromTo(contextPanel, 
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }
    
    function getYearContext(year) {
        const context = {
            events: [],
            pharaoh: null
        };
        
        // Find Joseph events near this year (within 3 years)
        const keyDates = WorldTimeline.timelineData.subsections
            .find(sub => sub.subsectionId === 'key-dates');
        
        if (keyDates) {
            keyDates.content.forEach(event => {
                const eventYear = extractYear(event.date);
                if (Math.abs(year - eventYear) <= 3) {
                    context.events.push({
                        ...event,
                        year: eventYear
                    });
                }
            });
        }
        
        // Find ruling pharaoh
        const pharaohs = WorldTimeline.timelineData.subsections
            .find(sub => sub.subsectionId === 'pharaohs');
        
        if (pharaohs) {
            pharaohs.rulers.forEach(ruler => {
                const reignMatch = ruler.reign.match(/(\d{4})-(\d{4})/);
                if (reignMatch) {
                    const start = parseInt(reignMatch[1]);
                    const end = parseInt(reignMatch[2]);
                    // BCE years are reversed
                    if (year >= end && year <= start) {
                        context.pharaoh = ruler;
                    }
                }
            });
        }
        
        return context;
    }
    
    function buildContextHTML(context, year) {
        let html = '<div class="context-content">';
        
        // Show Joseph events
        if (context.events.length > 0) {
            html += '<div class="context-events">';
            context.events.forEach(event => {
                html += `
                    <div class="context-event">
                        <div class="context-event-icon">${getEventIcon(event.themes)}</div>
                        <div class="context-event-details">
                            <h4 class="context-event-title">${event.event}</h4>
                            <p class="context-event-detail">${event.detail}</p>
                            <span class="context-event-verse">${event.verseRef}</span>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Show ruling pharaoh
        if (context.pharaoh) {
            html += `
                <div class="context-pharaoh">
                    <div class="context-label">Ruling Pharaoh:</div>
                    <h4 class="context-pharaoh-name">${context.pharaoh.name}</h4>
                    <p class="context-pharaoh-reign">${context.pharaoh.reign}</p>
                    <p class="context-pharaoh-desc">${context.pharaoh.description}</p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    function buildPeriodHTML(year) {
        let period = '';
        let description = '';
        
        if (year >= 2050) {
            period = 'Early 12th Dynasty';
            description = 'Egypt is consolidating power after reunification. The Middle Kingdom is rising.';
        } else if (year >= 1900) {
            period = 'Middle 12th Dynasty';
            description = 'Egypt\'s Golden Age. Strong pharaohs, massive building projects, agricultural innovation.';
        } else if (year >= 1850) {
            period = 'Late 12th Dynasty';
            description = 'Joseph\'s era. Egypt at the height of its power, administered by a Hebrew vizier.';
        } else {
            period = 'End of 12th Dynasty';
            description = 'The dynasty is waning, but Egypt remains strong. The seeds of the Exodus are being planted.';
        }
        
        return `
            <div class="context-content period-overview">
                <div class="period-label">${period}</div>
                <p class="period-description">${description}</p>
            </div>
        `;
    }

    // ============================================
    // ANIMATIONS
    // ============================================
    
    function animateTimelineEntrance() {
        const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
        
        // Fade in header
        timeline.from('.world-timeline-header', {
            opacity: 0,
            y: -30,
            duration: 0.6
        });
        
        // Scrubber expands from center
        timeline.from('.timeline-scrubber', {
            scaleX: 0,
            transformOrigin: 'center',
            duration: 0.8
        }, '-=0.3');
        
        // Markers appear sequentially
        timeline.from('.timeline-marker', {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            stagger: 0.05
        }, '-=0.4');
        
        // Year indicator drops in
        timeline.from('.timeline-current-year', {
            opacity: 0,
            y: -50,
            duration: 0.4
        }, '-=0.2');
        
        // Journey events cascade
        timeline.from('.journey-event', {
            opacity: 0,
            x: -30,
            duration: 0.4,
            stagger: 0.1
        }, '-=0.3');
        
        // Smoking gun card rises
        timeline.from('.smoking-gun-card', {
            opacity: 0,
            y: 50,
            duration: 0.6
        }, '-=0.5');
        
        // Pharaoh cards slide in
        timeline.from('.pharaoh-card', {
            opacity: 0,
            x: -40,
            duration: 0.4,
            stagger: 0.1
        }, '-=0.4');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function yearToPosition(year) {
        // Convert BCE year to percentage position on timeline
        // 2100 BCE = 0%, 1700 BCE = 100%
        const position = ((WorldTimeline.minYear - year) / WorldTimeline.yearSpan) * 100;
        return Math.max(0, Math.min(100, position));
    }

    function positionToYear(position) {
        // Convert percentage position to BCE year
        const year = WorldTimeline.minYear - (position / 100) * WorldTimeline.yearSpan;
        return Math.round(year);
    }

    function extractYear(dateString) {
        // Extract year from strings like "Approximately 1876 BCE"
        const match = dateString.match(/(\d{4})/);
        return match ? parseInt(match[1]) : 1876;
    }

    function getEventIcon(themes) {
        // Return appropriate icon based on event themes
        if (themes.includes('arrival') || themes.includes('slavery')) return '⛓️';
        if (themes.includes('elevation') || themes.includes('power')) return '👑';
        if (themes.includes('prosperity') || themes.includes('abundance')) return '🌾';
        if (themes.includes('famine') || themes.includes('testing')) return '⚖️';
        if (themes.includes('reunion') || themes.includes('family')) return '🤝';
        if (themes.includes('death') || themes.includes('completion')) return '⚱️';
        return '📍';
    }

    // ============================================
    // RESPONSIVE HANDLING
    // ============================================
    
    function handleResize() {
        // Recalculate positions on window resize
        const currentPosition = yearToPosition(WorldTimeline.currentYear);
        updateCurrentYear(WorldTimeline.currentYear, currentPosition);
    }

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    // ============================================
    // PUBLIC API
    // ============================================
    
    window.WorldTimeline = {
        navigateToYear: function(year) {
            const position = yearToPosition(year);
            gsap.to({ year: WorldTimeline.currentYear }, {
                year: year,
                duration: 0.8,
                ease: 'power2.inOut',
                onUpdate: function() {
                    const currentYear = Math.round(this.targets()[0].year);
                    const currentPosition = yearToPosition(currentYear);
                    updateCurrentYear(currentYear, currentPosition);
                }
            });
        },
        
        getCurrentYear: function() {
            return WorldTimeline.currentYear;
        },
        
        expandSmokingGun: function() {
            if (!WorldTimeline.smokingGunExpanded) {
                toggleSmokingGunExpanded();
            }
        }
    };

    // ============================================
    // INITIALIZE ON LOAD
    // ============================================
    
    init();

})();
