/**
 * WORLD EVIDENCE - SPRINT 2: THE EVIDENCE GALLERY
 * "The Cool Stuff" - Museum-Quality Archaeological Evidence
 * 
 * Sacred Architecture: These aren't just artifacts—they're fingerprints
 * of God working in real history. Trevor learns that faith rests on facts.
 * 
 * Phase: The World Section
 * Purpose: Card-based gallery of 6 major archaeological discoveries
 * Features: Filters, zoom, evidence ratings, annotations
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    const WorldEvidence = {
        worldData: null,
        evidenceData: null,
        currentFilter: 'all', // 'all', 'strongest', 'sites', 'documents'
        zoomedCard: null,
        
        // Evidence card metadata (strength ratings 1-5)
        cardMetadata: {
            'tell-el-daba': { type: 'site', strength: 5, image: 'tell-el-daba.jpg' },
            'brooklyn-papyrus': { type: 'document', strength: 4, image: 'brooklyn-papyrus.jpg' },
            'beni-hasan': { type: 'site', strength: 4, image: 'beni-hasan.jpg' },
            'aper-el-tomb': { type: 'site', strength: 3, image: 'aper-el.jpg' },
            'dream-interpretation': { type: 'document', strength: 3, image: 'dream-book.jpg' },
            'nile-records': { type: 'document', strength: 4, image: 'nilometer.jpg' }
        },
        
        // DOM elements
        elements: {
            gallery: null,
            filterTabs: null,
            cards: []
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🏺 World Evidence Gallery initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadWorldData);
        } else {
            loadWorldData();
        }
    }

    async function loadWorldData() {
        try {
            const response = await fetch('world.json');
            WorldEvidence.worldData = await response.json();
            WorldEvidence.evidenceData = WorldEvidence.worldData.sections[1]; // Evidence section
            
            console.log('✅ Evidence data loaded:', WorldEvidence.evidenceData.sectionTitle);
            
            buildEvidenceGallery();
            
        } catch (error) {
            console.error('❌ Failed to load world.json:', error);
        }
    }

    // ============================================
    // UI CONSTRUCTION
    // ============================================
    
    function buildEvidenceGallery() {
        const worldSection = document.getElementById('world');
        if (!worldSection) {
            console.error('❌ World section not found');
            return;
        }

        // Create gallery container
        const galleryHTML = `
            <div class="world-evidence-container">
                <!-- Header -->
                <div class="world-evidence-header">
                    <h2 class="evidence-title">${WorldEvidence.evidenceData.sectionTitle}</h2>
                    <p class="evidence-subtitle">${WorldEvidence.evidenceData.sectionSubtitle}</p>
                    <p class="evidence-intro">${WorldEvidence.evidenceData.intro}</p>
                </div>

                <!-- Filter Tabs -->
                <div class="evidence-filters" id="evidenceFilters">
                    <button class="filter-tab active" data-filter="all">All Evidence</button>
                    <button class="filter-tab" data-filter="strongest">Strongest</button>
                    <button class="filter-tab" data-filter="sites">Archaeological Sites</button>
                    <button class="filter-tab" data-filter="documents">Documents</button>
                </div>

                <!-- Evidence Card Gallery -->
                <div class="evidence-gallery" id="evidenceGallery">
                    ${buildEvidenceCards()}
                </div>
            </div>
        `;

        // Insert into World section (append after timeline if exists)
        const existingContent = worldSection.querySelector('.world-timeline-container');
        if (existingContent) {
            existingContent.insertAdjacentHTML('afterend', galleryHTML);
        } else {
            worldSection.innerHTML = galleryHTML;
        }

        // Cache DOM elements
        cacheElements();
        
        // Attach event listeners
        attachEventListeners();
    }

    function buildEvidenceCards() {
        const subsections = WorldEvidence.evidenceData.subsections;
        let cardsHTML = '';

        subsections.forEach((subsection, index) => {
            const cardId = subsection.subsectionId;
            const metadata = WorldEvidence.cardMetadata[cardId];
            
            if (!metadata) return; // Skip if no metadata

            cardsHTML += `
                <div class="evidence-card" 
                     data-card-id="${cardId}" 
                     data-type="${metadata.type}"
                     data-strength="${metadata.strength}">
                    
                    <!-- Card Header -->
                    <div class="card-header">
                        <h3 class="card-title">📍 ${subsection.subsectionTitle}</h3>
                    </div>

                    <!-- Card Image (zoomable) -->
                    <div class="card-image-wrapper" data-zoomable>
                        <img src="images/evidence/${metadata.image}" 
                             alt="${subsection.subsectionTitle}"
                             class="card-image"
                             loading="lazy">
                        <div class="zoom-hint">Click to enlarge</div>
                    </div>

                    <!-- Card Metadata -->
                    <div class="card-metadata">
                        ${buildCardMetadata(subsection, cardId)}
                    </div>

                    <!-- Card Content -->
                    <div class="card-content">
                        ${buildCardContent(subsection)}
                    </div>

                    <!-- Evidence Strength Rating -->
                    <div class="evidence-rating">
                        <span class="rating-label">EVIDENCE STRENGTH:</span>
                        <div class="rating-circles">
                            ${buildRatingCircles(metadata.strength)}
                        </div>
                        <span class="rating-text">${getRatingText(metadata.strength)}</span>
                    </div>

                    <!-- Card Actions -->
                    <div class="card-actions">
                        <button class="btn-add-note" data-card="${cardId}">
                            ✏️ Add Note
                        </button>
                        <button class="btn-view-sources" data-card="${cardId}">
                            📚 View Sources
                        </button>
                    </div>
                </div>
            `;
        });

        return cardsHTML;
    }

    function buildCardMetadata(subsection, cardId) {
        let metaHTML = '';

        // Location (if available)
        if (subsection.location) {
            metaHTML += `
                <div class="meta-item">
                    <span class="meta-label">LOCATION:</span>
                    <span class="meta-value">${subsection.location}</span>
                </div>
            `;
        }

        // Excavator/Discoverer
        if (subsection.excavator) {
            metaHTML += `
                <div class="meta-item">
                    <span class="meta-label">EXCAVATED BY:</span>
                    <span class="meta-value">${subsection.excavator}</span>
                </div>
            `;
        } else if (subsection.discoverer) {
            metaHTML += `
                <div class="meta-item">
                    <span class="meta-label">DISCOVERED BY:</span>
                    <span class="meta-value">${subsection.discoverer}</span>
                </div>
            `;
        }

        // Dating/Period
        if (subsection.dating) {
            metaHTML += `
                <div class="meta-item">
                    <span class="meta-label">PERIOD:</span>
                    <span class="meta-value">${subsection.dating}</span>
                </div>
            `;
        } else if (subsection.period) {
            metaHTML += `
                <div class="meta-item">
                    <span class="meta-label">EXCAVATED:</span>
                    <span class="meta-value">${subsection.period}</span>
                </div>
            `;
        }

        return metaHTML;
    }

    function buildCardContent(subsection) {
        let contentHTML = '';
        
        subsection.content.forEach(item => {
            if (item.type === 'overview') {
                contentHTML += `
                    <div class="content-section">
                        <p class="content-text">${item.text}</p>
                    </div>
                `;
            }
            
            if (item.type === 'finding' && item.findings) {
                contentHTML += `
                    <div class="content-section">
                        <h4 class="content-heading">🔍 ${item.title || 'What They Found'}</h4>
                        <ul class="findings-list">
                            ${item.findings.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        ${item.significance ? `
                            <div class="significance-box">
                                <strong>💬 Why It Matters:</strong> ${item.significance}
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            if (item.type === 'list' && item.examples) {
                contentHTML += `
                    <div class="content-section">
                        <h4 class="content-heading">📜 ${item.title}</h4>
                        <ul class="findings-list">
                            ${item.examples.map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                        ${item.significance ? `
                            <div class="significance-box">
                                <strong>💬 Why It Matters:</strong> ${item.significance}
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            if (item.type === 'visual-evidence' && item.details) {
                contentHTML += `
                    <div class="content-section">
                        <h4 class="content-heading">🎨 ${item.title}</h4>
                        <p class="content-text">${item.description}</p>
                        <ul class="findings-list">
                            ${item.details.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                        ${item.significance ? `
                            <div class="significance-box">
                                <strong>💬 Why It Matters:</strong> ${item.significance}
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            if (item.type === 'document') {
                contentHTML += `
                    <div class="content-section">
                        <h4 class="content-heading">📄 ${item.title}</h4>
                        ${item.dating ? `<p class="dating-info">Dating: ${item.dating}</p>` : ''}
                        <p class="content-text">${item.description}</p>
                        ${item.significance ? `
                            <div class="significance-box">
                                <strong>💬 Why It Matters:</strong> ${item.significance}
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });

        return contentHTML;
    }

    function buildRatingCircles(strength) {
        let circles = '';
        for (let i = 1; i <= 5; i++) {
            circles += `<span class="rating-circle ${i <= strength ? 'filled' : ''}">●</span>`;
        }
        return circles;
    }

    function getRatingText(strength) {
        const ratings = {
            5: 'Very Strong',
            4: 'Strong',
            3: 'Moderate',
            2: 'Circumstantial',
            1: 'Weak'
        };
        return ratings[strength] || 'Moderate';
    }

    // ============================================
    // DOM CACHING
    // ============================================
    
    function cacheElements() {
        WorldEvidence.elements.gallery = document.getElementById('evidenceGallery');
        WorldEvidence.elements.filterTabs = document.getElementById('evidenceFilters');
        WorldEvidence.elements.cards = Array.from(document.querySelectorAll('.evidence-card'));
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function attachEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', handleFilterChange);
        });

        // Zoomable images
        const zoomableImages = document.querySelectorAll('[data-zoomable]');
        zoomableImages.forEach(wrapper => {
            wrapper.addEventListener('click', handleImageZoom);
        });

        // Add note buttons
        const noteButtons = document.querySelectorAll('.btn-add-note');
        noteButtons.forEach(btn => {
            btn.addEventListener('click', handleAddNote);
        });

        // View sources buttons
        const sourceButtons = document.querySelectorAll('.btn-view-sources');
        sourceButtons.forEach(btn => {
            btn.addEventListener('click', handleViewSources);
        });
    }

    // ============================================
    // FILTER HANDLING
    // ============================================
    
    function handleFilterChange(e) {
        const filterValue = e.target.dataset.filter;
        WorldEvidence.currentFilter = filterValue;

        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter cards
        filterCards(filterValue);
    }

    function filterCards(filter) {
        const cards = WorldEvidence.elements.cards;

        cards.forEach(card => {
            let show = false;

            switch(filter) {
                case 'all':
                    show = true;
                    break;
                case 'strongest':
                    show = parseInt(card.dataset.strength) >= 4;
                    break;
                case 'sites':
                    show = card.dataset.type === 'site';
                    break;
                case 'documents':
                    show = card.dataset.type === 'document';
                    break;
            }

            if (show) {
                card.style.display = 'block';
                // Animate in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // ============================================
    // IMAGE ZOOM
    // ============================================
    
    function handleImageZoom(e) {
        const imageWrapper = e.currentTarget;
        const image = imageWrapper.querySelector('.card-image');
        
        if (!image) return;

        // Create zoom modal
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <div class="zoom-backdrop"></div>
            <div class="zoom-content">
                <img src="${image.src}" alt="${image.alt}">
                <button class="zoom-close">✕</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop or button click
        modal.querySelector('.zoom-backdrop').addEventListener('click', closeZoom);
        modal.querySelector('.zoom-close').addEventListener('click', closeZoom);
        
        // Close on ESC key
        document.addEventListener('keydown', handleEscapeKey);

        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        function closeZoom() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.removeEventListener('keydown', handleEscapeKey);
            }, 300);
        }

        function handleEscapeKey(e) {
            if (e.key === 'Escape') {
                closeZoom();
            }
        }
    }

    // ============================================
    // ANNOTATION INTEGRATION
    // ============================================
    
    function handleAddNote(e) {
        const cardId = e.target.dataset.card;
        
        // This will integrate with the existing annotation system
        // For now, show a placeholder
        console.log('📝 Add note to:', cardId);
        
        // TODO: Integrate with annotation-system-sprint3.js
        // Similar to how Story section handles annotations
        alert('Note-taking feature coming soon! This will integrate with the existing annotation system.');
    }

    // ============================================
    // SOURCES
    // ============================================
    
    function handleViewSources(e) {
        const cardId = e.target.dataset.card;
        
        // Scholar links and research papers
        const sources = {
            'tell-el-daba': [
                { title: 'Manfred Bietak - Avaris Excavation Reports', url: '#' },
                { title: 'Tell el-Dab\'a Research', url: '#' }
            ],
            'brooklyn-papyrus': [
                { title: 'Brooklyn Museum - Papyrus 35.1446', url: '#' }
            ],
            'beni-hasan': [
                { title: 'Beni Hasan Tomb Paintings Study', url: '#' }
            ],
            'aper-el-tomb': [
                { title: 'Alain Zivie - Aper-El Discovery', url: '#' }
            ],
            'dream-interpretation': [
                { title: 'Chester Beatty Papyrus III', url: '#' }
            ],
            'nile-records': [
                { title: 'Nilometer Records - Middle Kingdom', url: '#' }
            ]
        };

        const cardSources = sources[cardId] || [];
        
        // Create sources modal
        const modal = document.createElement('div');
        modal.className = 'sources-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <h3>📚 Research Sources</h3>
                <ul class="sources-list">
                    ${cardSources.map(source => `
                        <li>
                            <a href="${source.url}" target="_blank" rel="noopener">
                                ${source.title}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <button class="modal-close">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

        setTimeout(() => modal.classList.add('active'), 10);
    }

    // ============================================
    // PUBLIC API
    // ============================================
    
    window.WorldEvidence = {
        init,
        filterCards,
        currentFilter: () => WorldEvidence.currentFilter
    };

    // Auto-initialize
    init();

})();
