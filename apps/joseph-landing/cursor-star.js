// ============================================
// SHOOTING STAR CURSOR SYSTEM
// "The stars will fall from heaven" - Matthew 24:29
// A celestial phenomenon trailing stardust please
// ============================================

(function() {
    'use strict';
    
    let star = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let lastY = 0;
    let frameCount = 0;
    let particlePool = [];
    let maxParticles = 80; // Limit for performance
    
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
        
        frameCount++;
        
        // Calculate movement distance for speed-based effects
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        lastX = mouseX;
        lastY = mouseY;
        
        // Smooth easing - star follows with slight delay
        const ease = 0.25; // Increased from 0.2 for snappier response
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        // Position the star (no rotation - it's circular now)
        star.style.left = currentX + 'px';
        star.style.top = currentY + 'px';
        
        // Generate more particles when moving
        if (speed > 0.5) {
            // Particle generation - more frequent, more abundant
            if (frameCount % 1 === 0) { // Every frame when moving
                createParticle(currentX, currentY);
            }
            
            // Residue - medium frequency
            if (frameCount % 3 === 0) {
                createResidue(currentX, currentY);
            }
            
            // Path illumination - creates the glowing trail
            if (frameCount % 2 === 0) {
                createPathGlow(currentX, currentY);
            }
        }
        
        // Clean up old particles for performance
        if (particlePool.length > maxParticles) {
            const oldParticle = particlePool.shift();
            if (oldParticle && oldParticle.parentNode) {
                oldParticle.remove();
            }
        }
        
        requestAnimationFrame(animateStar);
    }
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'star-particle';
        
        // Smaller, more numerous particles
        const size = Math.random() * 2.5 + 1.5; // 1.5-4px
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        const opacity = Math.random() * 0.4 + 0.5; // 0.5-0.9
        
        particle.style.cssText = `
            left: ${x + offsetX}px;
            top: ${y + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at center,
                rgba(226, 201, 144, ${opacity}) 0%,
                rgba(255, 251, 235, ${opacity * 0.6}) 50%,
                transparent 100%
            );
        `;
        
        document.body.appendChild(particle);
        particlePool.push(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 800);
    }
    
    function createResidue(x, y) {
        const residue = document.createElement('div');
        residue.className = 'star-residue';
        
        // Tighter clustering for more defined trail
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        
        residue.style.left = (x + offsetX) + 'px';
        residue.style.top = (y + offsetY) + 'px';
        
        document.body.appendChild(residue);
        
        // Remove after animation completes
        setTimeout(() => {
            if (residue.parentNode) {
                residue.remove();
            }
        }, 1500);
    }
    
    function createPathGlow(x, y) {
        const glow = document.createElement('div');
        glow.className = 'star-path-glow';
        
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        
        document.body.appendChild(glow);
        
        // Remove after animation completes
        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 2000);
    }
    
    // Enhanced glow effect on interactive elements
    function addInteractiveEffects() {
        const interactive = document.querySelectorAll('button, a, .plot-point, [role="button"], input, textarea');
        
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (star) {
                    const core = star.querySelector('.star-core');
                    if (core) {
                        core.style.width = '12px';
                        core.style.height = '12px';
                        core.style.boxShadow = `
                            0 0 12px rgba(255, 255, 255, 1),
                            0 0 24px rgba(226, 201, 144, 0.9),
                            0 0 36px rgba(201, 169, 97, 0.6)
                        `;
                    }
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (star) {
                    const core = star.querySelector('.star-core');
                    if (core) {
                        core.style.width = '8px';
                        core.style.height = '8px';
                        core.style.boxShadow = `
                            0 0 8px rgba(255, 255, 255, 0.9),
                            0 0 16px rgba(226, 201, 144, 0.7),
                            0 0 24px rgba(201, 169, 97, 0.4)
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
