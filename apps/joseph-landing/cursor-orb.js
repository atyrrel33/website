// ============================================
// DREAMY ORB CURSOR SYSTEM
// "The heavens declare the glory of God" - Psalm 19:1
// ============================================

(function() {
    'use strict';
    
    let orb = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Initialize the orb when story panel is active
    function initDreamOrb() {
        const storyPanel = document.getElementById('panel-story');
        if (!storyPanel) return;
        
        // Create the orb element
        orb = document.createElement('div');
        orb.className = 'dream-orb-cursor';
        orb.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle at center,
                rgba(226, 201, 144, 0.95) 0%,
                rgba(201, 169, 97, 0.75) 35%,
                rgba(201, 169, 97, 0.45) 65%,
                transparent 100%
            );
            box-shadow: 
                0 0 12px rgba(226, 201, 144, 0.9),
                0 0 24px rgba(201, 169, 97, 0.6),
                0 0 36px rgba(201, 169, 97, 0.3);
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transform: translate(-50%, -50%);
            transition: width 0.2s ease, height 0.2s ease;
        `;
        
        document.body.appendChild(orb);
        
        // Track mouse movement
        document.addEventListener('mousemove', trackMouse);
        
        // Animate the orb position with smooth following
        requestAnimationFrame(animateOrb);
        
        // Enhanced glow on interactive elements
        addInteractiveGlow();
    }
    
    function trackMouse(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    function animateOrb() {
        if (!orb) return;
        
        // Smooth easing - like the Spirit moving over waters
        const ease = 0.15;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        orb.style.left = currentX + 'px';
        orb.style.top = currentY + 'px';
        
        requestAnimationFrame(animateOrb);
    }
    
    function addInteractiveGlow() {
        const storyPanel = document.getElementById('panel-story');
        if (!storyPanel) return;
        
        const interactive = storyPanel.querySelectorAll('button, a, .plot-point, [role="button"]');
        
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (orb) {
                    orb.style.width = '28px';
                    orb.style.height = '28px';
                    orb.style.boxShadow = `
                        0 0 16px rgba(226, 201, 144, 1),
                        0 0 32px rgba(201, 169, 97, 0.8),
                        0 0 48px rgba(201, 169, 97, 0.5)
                    `;
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (orb) {
                    orb.style.width = '20px';
                    orb.style.height = '20px';
                    orb.style.boxShadow = `
                        0 0 12px rgba(226, 201, 144, 0.9),
                        0 0 24px rgba(201, 169, 97, 0.6),
                        0 0 36px rgba(201, 169, 97, 0.3)
                    `;
                }
            });
        });
    }
    
    // Clean up when leaving story panel
    function removeDreamOrb() {
        if (orb) {
            document.removeEventListener('mousemove', trackMouse);
            orb.remove();
            orb = null;
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDreamOrb);
    } else {
        initDreamOrb();
    }
    
    // Reinitialize when switching to story tab
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-tab]');
        if (tab) {
            const targetTab = tab.dataset.tab;
            if (targetTab === 'story') {
                setTimeout(initDreamOrb, 100);
            } else {
                removeDreamOrb();
            }
        }
    });
})();
