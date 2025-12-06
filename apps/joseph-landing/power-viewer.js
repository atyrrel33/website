// ============================================
// POWER VIEWER - Main Controller
// The sacred architecture of timeless principles
// ============================================

class PowerViewer {
    constructor() {
        this.data = null;
        this.currentPrinciple = null;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('power.json');
            this.data = await response.json();
            this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to load Power data:', error);
            this.showError();
        }
    }

    render() {
        const panel = document.getElementById('panel-power');
        if (!panel) return;

        panel.innerHTML = `
            <div class="power-container">
                <!-- Header Section -->
                <div class="power-header">
                    <div class="power-header-content">
                        <div class="power-icon-large">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                <circle cx="12" cy="12" r="4"/>
                            </svg>
                        </div>
                        <h1 class="power-title">${this.data.meta.title}</h1>
                        <p class="power-subtitle">${this.data.meta.subtitle}</p>
                        <div class="power-tagline">${this.data.meta.tagline}</div>
                        <blockquote class="power-verse">
                            <p>"${this.data.meta.verse}"</p>
                            <cite>— ${this.data.meta.verseRef}</cite>
                        </blockquote>
                    </div>
                </div>

                <!-- Introduction Section -->
                <div class="power-introduction">
                    <h2 class="section-title">${this.data.introduction.title}</h2>
                    <div class="intro-grid">
                        ${this.data.introduction.sections.map(section => `
                            <div class="intro-card" data-theme="${section.theme}">
                                <h3>${section.title}</h3>
                                <p>${section.content}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Navigation Pills -->
                <div class="principles-nav">
                    <div class="principles-nav-label">Seven Timeless Principles:</div>
                    <div class="principles-pills">
                        ${this.data.principles.map((p, i) => `
                            <button class="principle-pill ${i === 0 ? 'active' : ''}" 
                                    data-principle-id="${p.id}"
                                    data-principle-index="${i}">
                                <span class="pill-number">${p.number}</span>
                                <span class="pill-title">${this.getTruncatedTitle(p.title)}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Principle Content Area -->
                <div class="principle-content" id="principleContent">
                    ${this.renderPrinciple(this.data.principles[0])}
                </div>

                <!-- Conclusion Section -->
                <div class="power-conclusion" id="powerConclusion">
                    <div class="conclusion-header">
                        <div class="conclusion-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h2>${this.data.conclusion.title}</h2>
                    </div>
                    <p class="conclusion-opening">${this.data.conclusion.opening}</p>
                    
                    <div class="impossibilities-list">
                        ${this.data.conclusion.impossibilities.map(item => `
                            <div class="impossibility-item">${item}</div>
                        `).join('')}
                    </div>

                    <div class="promises-grid">
                        ${this.data.conclusion.promises.map(promise => `
                            <div class="promise-card">
                                <div class="promise-icon">✦</div>
                                <p>${promise}</p>
                            </div>
                        `).join('')}
                    </div>

                    <div class="invitation">
                        <p>${this.data.conclusion.invitation}</p>
                    </div>

                    <blockquote class="closing-verse">
                        <p>"${this.data.conclusion.closingVerse}"</p>
                        <cite>— ${this.data.conclusion.closingVerseRef}</cite>
                    </blockquote>
                </div>
            </div>
        `;
    }

    renderPrinciple(principle) {
        return `
            <div class="principle-card" data-principle-id="${principle.id}">
                <!-- Principle Header -->
                <div class="principle-header">
                    <div class="principle-number-badge">${principle.number}</div>
                    <div class="principle-header-text">
                        <h2 class="principle-title">${principle.title}</h2>
                        <p class="principle-subtitle">${principle.subtitle}</p>
                    </div>
                </div>

                <!-- Core Scripture -->
                <blockquote class="principle-verse">
                    <p>"${principle.verse}"</p>
                    <cite>— ${principle.verseRef}</cite>
                </blockquote>

                <!-- Core Message -->
                <div class="core-message">
                    <div class="message-icon">
                        ${this.getIconSVG(principle.icon)}
                    </div>
                    <p>${principle.coreMessage}</p>
                </div>

                <!-- Modern Context -->
                <div class="modern-context">
                    <h3 class="context-title">${principle.modernContext.title}</h3>
                    <div class="context-points">
                        ${principle.modernContext.points.map(point => `
                            <div class="context-card">
                                <h4>${point.category}</h4>
                                <p class="context-description">${point.description}</p>
                                <p class="context-impact"><strong>Impact:</strong> ${point.impact}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Joseph's Response -->
                <div class="josephs-response">
                    <h3 class="response-title">${principle.josephsResponse.title}</h3>
                    <div class="key-phrase">${principle.josephsResponse.keyPhrase}</div>
                    <ul class="manifestations-list">
                        ${principle.josephsResponse.manifestations.map(item => `
                            <li>${item}</li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Application -->
                <div class="principle-application">
                    <h3 class="application-title">${principle.application.title}</h3>
                    <div class="application-content">
                        <p class="application-insight"><strong>The Reality:</strong> ${principle.application.insight}</p>
                        <p class="application-truth"><strong>The Truth:</strong> ${principle.application.truth}</p>
                        <p class="application-question"><strong>The Question:</strong> ${principle.application.question}</p>
                    </div>
                </div>

                <!-- Practical Action -->
                <div class="practical-action">
                    <div class="action-icon">⚡</div>
                    <div class="action-content">
                        <h4>Take Action</h4>
                        <p>${principle.practicalAction}</p>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="principle-nav-buttons">
                    ${principle.number > 1 ? `
                        <button class="nav-btn prev-btn" data-direction="prev">
                            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                            Previous Principle
                        </button>
                    ` : '<div></div>'}
                    ${principle.number < 7 ? `
                        <button class="nav-btn next-btn" data-direction="next">
                            Next Principle
                            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    ` : '<div></div>'}
                </div>
            </div>
        `;
    }

    getTruncatedTitle(title) {
        // Shorten long titles for pills
        const words = title.split(' ');
        if (words.length > 4) {
            return words.slice(0, 4).join(' ') + '...';
        }
        return title;
    }

    getIconSVG(iconType) {
        const icons = {
            pit: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            shield: '<svg viewBox="0 0 24 24"><path d="M12 2l-8 3v7c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z"/></svg>',
            hourglass: '<svg viewBox="0 0 24 24"><path d="M6 2h12v6l-6 6 6 6v2H6v-2l6-6-6-6V2z"/></svg>',
            threads: '<svg viewBox="0 0 24 24"><path d="M2 12h20M12 2v20M7 7l10 10M7 17l10-10"/></svg>',
            embrace: '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
            anchor: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><path d="M12 8v13M5 21c0-3.87 3.13-7 7-7s7 3.13 7 7"/></svg>',
            compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>'
        };
        return icons[iconType] || icons.compass;
    }

    attachEventListeners() {
        // Principle pill navigation
        document.querySelectorAll('.principle-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const index = parseInt(pill.dataset.principleIndex);
                this.showPrinciple(index);
            });
        });

        // Next/Previous buttons (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const direction = btn.dataset.direction;
                const currentIndex = this.getCurrentPrincipleIndex();
                
                if (direction === 'next' && currentIndex < 6) {
                    this.showPrinciple(currentIndex + 1);
                } else if (direction === 'prev' && currentIndex > 0) {
                    this.showPrinciple(currentIndex - 1);
                }
                
                // Scroll to top of principle
                document.querySelector('.principle-content').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    showPrinciple(index) {
        const principle = this.data.principles[index];
        const content = document.getElementById('principleContent');
        
        // Fade out
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.innerHTML = this.renderPrinciple(principle);
            
            // Update pills
            document.querySelectorAll('.principle-pill').forEach((pill, i) => {
                pill.classList.toggle('active', i === index);
            });
            
            // Fade in
            setTimeout(() => {
                content.style.opacity = '1';
            }, 50);
        }, 300);
    }

    getCurrentPrincipleIndex() {
        const activePill = document.querySelector('.principle-pill.active');
        return activePill ? parseInt(activePill.dataset.principleIndex) : 0;
    }

    showError() {
        const panel = document.getElementById('panel-power');
        if (panel) {
            panel.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠</div>
                    <h3>Unable to load The Power section</h3>
                    <p>Please check your connection and try again.</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PowerViewer();
    });
} else {
    new PowerViewer();
}
