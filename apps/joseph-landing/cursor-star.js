// ============================================
// SHOOTING STAR CURSOR SYSTEM
// "The stars will fall from heaven" - Matthew 24:29
// A celestial phenomenon trailing stardust
// ============================================

(function() {
    'use strict';
    
    let star = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let particleTimer = 0;
    let residueTimer = 0;
    
    // Initialize the shooting star
    function initShootingStar() {
        // Create the star container
        star = document.createElement('div');
        star.className = 'shooting-star-cursor';
        
        // Create the star core (the bright streak)
        const core = document.createElement('div');
        core.className = 'star-core';
        star.appendChild(core);
        
        document.body.appendChild(star);
        
        // Track mouse movement
        document.addEventListener('mousemove', trackMouse);
        
        // Start animation loop
        requestAnimationFrame(animateStar);
    }
    
    function trackMouse(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    function animateStar() {
        if (!star) return;
        
        // Calculate velocity for rotation
        velocityX = mouseX - lastX;
        velocityY = mouseY - lastY;
        lastX = mouseX;
        lastY = mouseY;
        
        // Smooth easing - star follows with slight delay
        const ease = 0.2;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        // Calculate angle based on movement direction
        const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
        
        // Position and rotate the star
        star.style.left = currentX + 'px';
        star.style.top = currentY + 'px';
        star.style.transform = `rotate(${angle}deg)`;
        
        // Generate particle trail
        particleTimer++;
        residueTimer++;
        
        if (particleTimer > 2) { // Every 2 frames
            createParticle(currentX, currentY);
            particleTimer = 0;
        }
        
        if (residueTimer > 5) { // Every 5 frames
            createResidue(currentX, currentY);
            residueTimer = 0;
        }
        
        requestAnimationFrame(animateStar);
    }
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'star-particle';
        
        // Random size and position variance
        const size = Math.random() * 3 + 2; // 2-5px
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        
        particle.style.cssText = `
            left: ${x + offsetX}px;
            top: ${y + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at center,
                rgba(226, 201, 144, ${Math.random() * 0.3 + 0.6}) 0%,
                rgba(255, 251, 235, ${Math.random() * 0.2 + 0.3}) 50%,
                transparent 100%
            );
        `;
        
        document.body.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
    
    function createResidue(x, y) {
        const residue = document.createElement('div');
        residue.className = 'star-residue';
        
        // Random offset for natural spread
        const offsetX = (Math.random() - 0.5) * 12;
        const offsetY = (Math.random() - 0.5) * 12;
        
        residue.style.left = (x + offsetX) + 'px';
        residue.style.top = (y + offsetY) + 'px';
        
        document.body.appendChild(residue);
        
        // Remove after animation completes
        setTimeout(() => {
            residue.remove();
        }, 1200);
    }
    
    // Enhanced glow effect on interactive elements
    function addInteractiveEffects() {
        const interactive = document.querySelectorAll('button, a, .plot-point, [role="button"], input, textarea');
        
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (star) {
                    const core = star.querySelector('.star-core');
                    if (core) {
                        core.style.width = '16px';
                        core.style.height = '4px';
                        core.style.boxShadow = `
                            0 0 6px rgba(226, 201, 144, 1),
                            0 0 12px rgba(255, 251, 235, 0.7)
                        `;
                    }
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (star) {
                    const core = star.querySelector('.star-core');
                    if (core) {
                        core.style.width = '12px';
                        core.style.height = '3px';
                        core.style.boxShadow = `
                            0 0 4px rgba(226, 201, 144, 0.8),
                            0 0 8px rgba(255, 251, 235, 0.5)
                        `;
                    }
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initShootingStar();
            setTimeout(addInteractiveEffects, 500);
        });
    } else {
        initShootingStar();
        setTimeout(addInteractiveEffects, 500);
    }
    
    // Re-apply interactive effects when content changes
    const observer = new MutationObserver(() => {
        addInteractiveEffects();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
