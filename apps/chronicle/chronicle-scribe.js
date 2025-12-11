/* ============================================================================
   CHRONICLE - THE SCRIBE'S DESK
   JavaScript for Screenplay Formatting Engine (Sprint 1: Foundation)
   
   "My tongue is the pen of a skillful writer" - Psalm 45:1
   ============================================================================ */

// ============================================================================
// THE SCRIBE ENGINE - Core Screenplay Formatting System
// ============================================================================

class ScribeEngine {
    constructor() {
        // The Six Elements - Sacred screenplay structure
        this.elements = [
            { id: 'decree', name: 'The Decree', hint: 'Scene Heading' },
            { id: 'vision', name: 'The Vision', hint: 'Action/Description' },
            { id: 'voice', name: 'The Voice', hint: 'Character Name' },
            { id: 'whisper', name: 'The Whisper', hint: 'Parenthetical' },
            { id: 'word', name: 'The Word', hint: 'Dialogue' },
            { id: 'transition', name: 'The Transition', hint: 'Scene Ending' }
        ];
        
        this.currentElement = 'vision'; // Default starting element
        this.characterMemory = new Set(); // Remembered character names
        this.sceneLocations = new Set(); // Remembered locations
        this.currentLine = null; // Current line being edited
        this.writingArea = null; // Reference to contenteditable div
        this.elementIndicator = null; // Visual indicator
        this.shortcutsVisible = false;
        
        this.init();
    }
    
    // Initialize the Scribe Engine
    init() {
        console.log('[Scribe Engine] Initializing...');
        this.writingArea = document.getElementById('writingArea');
        
        if (!this.writingArea) {
            console.error('[Scribe Engine] Writing area not found');
            return;
        }
        
        this.createToolbar();
        this.createElementIndicator();
        this.createShortcutsOverlay();
        this.attachEventListeners();
        this.loadCharacterMemory();
        
        console.log('[Scribe Engine] Initialized successfully');
    }
    
    // Create the screenplay toolbar
    createToolbar() {
        const existingToolbar = document.querySelector('.writing-toolbar');
        if (!existingToolbar) return;
        
        const scribeToolbar = document.createElement('div');
        scribeToolbar.className = 'scribe-toolbar screenwriter-only';
        scribeToolbar.innerHTML = `
            <select class="element-selector" id="elementSelector">
                <option value="decree">The Decree (Scene Heading)</option>
                <option value="vision" selected>The Vision (Action)</option>
                <option value="voice">The Voice (Character)</option>
                <option value="whisper">The Whisper (Parenthetical)</option>
                <option value="word">The Word (Dialogue)</option>
                <option value="transition">The Transition</option>
            </select>
            
            <div class="toolbar-divider"></div>
            
            <button class="character-quick-insert" id="characterQuickInsert" title="Insert character from profiles">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                Character
            </button>
            
            <div class="page-count-display">
                Page <span class="page-number">1</span> of <span class="total-pages">1</span>
            </div>
        `;
        
        existingToolbar.parentNode.insertBefore(scribeToolbar, existingToolbar.nextSibling);
        
        // Element selector change handler
        const elementSelector = document.getElementById('elementSelector');
        if (elementSelector) {
            elementSelector.addEventListener('change', (e) => {
                this.setCurrentElement(e.target.value);
            });
        }
        
        // Character quick insert handler
        const characterBtn = document.getElementById('characterQuickInsert');
        if (characterBtn) {
            characterBtn.addEventListener('click', () => this.showCharacterPicker());
        }
    }
    
    // Create the current element indicator
    createElementIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'current-element-indicator';
        indicator.id = 'elementIndicator';
        indicator.innerHTML = `
            <div class="element-indicator-content">
                <div class="element-name">The Vision</div>
                <div class="element-hint">Press TAB to cycle</div>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.elementIndicator = indicator;
    }
    
    // Create keyboard shortcuts overlay
    createShortcutsOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'shortcuts-overlay';
        overlay.id = 'shortcutsOverlay';
        overlay.innerHTML = `
            <div class="shortcuts-header">The Scribe's Keys</div>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + 1</div>
                    <div class="shortcut-desc">The Decree</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + 2</div>
                    <div class="shortcut-desc">The Vision</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + 3</div>
                    <div class="shortcut-desc">The Voice</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + 4</div>
                    <div class="shortcut-desc">The Word</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + 5</div>
                    <div class="shortcut-desc">The Transition</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">TAB</div>
                    <div class="shortcut-desc">Cycle forward</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Shift + TAB</div>
                    <div class="shortcut-desc">Cycle backward</div>
                </div>
                <div class="shortcut-item">
                    <div class="shortcut-key">Cmd/Ctrl + /</div>
                    <div class="shortcut-desc">Show shortcuts</div>
                </div>
            </div>
            <div class="shortcuts-footer">
                "Whatever you do, work at it with all your heart" — Colossians 3:23
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideShortcuts();
            }
        });
    }
    
    // Attach event listeners
    attachEventListeners() {
        if (!this.writingArea) return;
        
        // TAB key cycling
        this.writingArea.addEventListener('keydown', (e) => {
            // Only handle in screenwriter mode
            if (!document.body.classList.contains('mode-screenwriter')) return;
            
            // TAB - cycle forward
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                this.cycleElementForward();
            }
            
            // Shift+TAB - cycle backward
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                this.cycleElementBackward();
            }
            
            // ENTER - smart line break
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleEnterKey();
            }
            
            // Keyboard shortcuts
            if ((e.metaKey || e.ctrlKey)) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.setCurrentElement('decree');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setCurrentElement('vision');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setCurrentElement('voice');
                        break;
                    case '4':
                        e.preventDefault();
                        this.setCurrentElement('word');
                        break;
                    case '5':
                        e.preventDefault();
                        this.setCurrentElement('transition');
                        break;
                    case '/':
                        e.preventDefault();
                        this.toggleShortcuts();
                        break;
                }
            }
        });
        
        // Input detection for auto-formatting
        this.writingArea.addEventListener('input', () => {
            if (!document.body.classList.contains('mode-screenwriter')) return;
            this.detectElementFromContent();
        });
        
        // Show indicator when focused in screenwriter mode
        this.writingArea.addEventListener('focus', () => {
            if (document.body.classList.contains('mode-screenwriter')) {
                this.showElementIndicator();
            }
        });
        
        // Hide indicator when unfocused
        this.writingArea.addEventListener('blur', () => {
            setTimeout(() => this.hideElementIndicator(), 500);
        });
    }
    
    // Cycle to next element
    cycleElementForward() {
        const currentIndex = this.elements.findIndex(el => el.id === this.currentElement);
        const nextIndex = (currentIndex + 1) % this.elements.length;
        this.setCurrentElement(this.elements[nextIndex].id);
    }
    
    // Cycle to previous element
    cycleElementBackward() {
        const currentIndex = this.elements.findIndex(el => el.id === this.currentElement);
        const prevIndex = currentIndex === 0 ? this.elements.length - 1 : currentIndex - 1;
        this.setCurrentElement(this.elements[prevIndex].id);
    }
    
    // Set the current element type
    setCurrentElement(elementId) {
        this.currentElement = elementId;
        
        // Update selector
        const selector = document.getElementById('elementSelector');
        if (selector) {
            selector.value = elementId;
        }
        
        // Update indicator
        this.updateElementIndicator();
        
        // Apply formatting to current line
        this.applyCurrentElementFormat();
        
        console.log(`[Scribe Engine] Element changed to: ${elementId}`);
    }
    
    // Apply current element formatting
    applyCurrentElementFormat() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        let currentNode = range.startContainer;
        
        // Find the line element
        while (currentNode && currentNode !== this.writingArea) {
            if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.classList) {
                if (currentNode.classList.contains('screenplay-line')) {
                    this.formatLineAsElement(currentNode, this.currentElement);
                    break;
                }
            }
            currentNode = currentNode.parentNode;
        }
    }
    
    // Format a line as a specific element
    formatLineAsElement(lineElement, elementId) {
        // Remove all element classes
        this.elements.forEach(el => {
            lineElement.classList.remove(`element-${el.id}`);
        });
        
        // Add new element class
        lineElement.classList.add(`element-${elementId}`);
        lineElement.classList.add('changing-element');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            lineElement.classList.remove('changing-element');
        }, 200);
        
        // Apply text transformations based on element
        this.applyElementTransformations(lineElement, elementId);
    }
    
    // Apply text transformations for element type
    applyElementTransformations(lineElement, elementId) {
        const text = lineElement.textContent;
        
        switch(elementId) {
            case 'decree':
                // Uppercase for scene headings
                lineElement.textContent = text.toUpperCase();
                break;
                
            case 'voice':
                // Uppercase for character names
                lineElement.textContent = text.toUpperCase();
                // Remember this character
                this.rememberCharacter(text);
                break;
                
            case 'whisper':
                // Lowercase for parentheticals (handled in CSS)
                lineElement.textContent = text.toLowerCase();
                break;
                
            case 'transition':
                // Uppercase for transitions
                lineElement.textContent = text.toUpperCase();
                break;
        }
        
        // Move cursor to end of line
        this.moveCursorToEndOfLine(lineElement);
    }
    
    // Detect element type from content
    detectElementFromContent() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        let currentNode = range.startContainer;
        
        // Find the line element
        while (currentNode && currentNode !== this.writingArea) {
            if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.classList) {
                if (currentNode.classList.contains('screenplay-line')) {
                    const text = currentNode.textContent.trim();
                    const detectedElement = this.detectElementType(text);
                    
                    if (detectedElement && detectedElement !== this.currentElement) {
                        this.setCurrentElement(detectedElement);
                    }
                    break;
                }
            }
            currentNode = currentNode.parentNode;
        }
    }
    
    // Detect element type from text content
    detectElementType(text) {
        if (!text) return null;
        
        // Scene heading detection
        if (/^(INT\.|EXT\.|INT\/EXT\.)/.test(text.toUpperCase())) {
            return 'decree';
        }
        
        // Character name detection (all caps, short)
        if (/^[A-Z\s]{2,30}$/.test(text) && text.length < 30) {
            return 'voice';
        }
        
        // Parenthetical detection
        if (/^\(.*\)$/.test(text)) {
            return 'whisper';
        }
        
        // Transition detection
        const transitions = ['FADE OUT', 'FADE IN', 'CUT TO', 'DISSOLVE TO', 'MATCH CUT', 'SMASH CUT'];
        const upperText = text.toUpperCase().replace(':', '');
        if (transitions.some(t => upperText.includes(t))) {
            return 'transition';
        }
        
        return null;
    }
    
    // Handle Enter key press
    handleEnterKey() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        // Create new line
        const newLine = document.createElement('div');
        newLine.className = 'screenplay-line';
        
        // Determine next logical element
        const nextElement = this.getNextLogicalElement();
        newLine.classList.add(`element-${nextElement}`);
        
        // Insert at cursor
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(newLine);
        
        // Add line break for spacing
        const br = document.createElement('br');
        newLine.appendChild(br);
        
        // Move cursor to new line
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update current element
        this.setCurrentElement(nextElement);
    }
    
    // Determine next logical element based on current
    getNextLogicalElement() {
        const flowPatterns = {
            'decree': 'vision',      // Scene heading → Action
            'vision': 'vision',      // Action → More action
            'voice': 'word',         // Character → Dialogue
            'whisper': 'word',       // Parenthetical → Dialogue
            'word': 'vision',        // Dialogue → Action (or could be another character)
            'transition': 'decree'   // Transition → Next scene
        };
        
        return flowPatterns[this.currentElement] || 'vision';
    }
    
    // Show element indicator
    showElementIndicator() {
        if (this.elementIndicator) {
            this.elementIndicator.classList.add('active');
        }
    }
    
    // Hide element indicator
    hideElementIndicator() {
        if (this.elementIndicator) {
            this.elementIndicator.classList.remove('active');
        }
    }
    
    // Update element indicator display
    updateElementIndicator() {
        if (!this.elementIndicator) return;
        
        const element = this.elements.find(el => el.id === this.currentElement);
        if (!element) return;
        
        const nameElement = this.elementIndicator.querySelector('.element-name');
        const hintElement = this.elementIndicator.querySelector('.element-hint');
        
        if (nameElement) {
            nameElement.textContent = element.name;
        }
        
        if (hintElement) {
            hintElement.textContent = `${element.hint} • Press TAB to cycle`;
        }
    }
    
    // Toggle shortcuts overlay
    toggleShortcuts() {
        this.shortcutsVisible = !this.shortcutsVisible;
        
        if (this.shortcutsVisible) {
            this.showShortcuts();
        } else {
            this.hideShortcuts();
        }
    }
    
    // Show shortcuts overlay
    showShortcuts() {
        const overlay = document.getElementById('shortcutsOverlay');
        if (overlay) {
            overlay.classList.add('visible');
            this.shortcutsVisible = true;
        }
    }
    
    // Hide shortcuts overlay
    hideShortcuts() {
        const overlay = document.getElementById('shortcutsOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            this.shortcutsVisible = false;
        }
    }
    
    // Remember a character name
    rememberCharacter(name) {
        if (!name || name.length < 2) return;
        
        const cleanName = name.trim().toUpperCase();
        this.characterMemory.add(cleanName);
        this.saveCharacterMemory();
        
        console.log(`[Scribe Engine] Remembered character: ${cleanName}`);
    }
    
    // Load character memory from localStorage
    loadCharacterMemory() {
        try {
            const saved = localStorage.getItem('chronicle_scribe_characters');
            if (saved) {
                const characters = JSON.parse(saved);
                this.characterMemory = new Set(characters);
                console.log(`[Scribe Engine] Loaded ${this.characterMemory.size} characters from memory`);
            }
        } catch (error) {
            console.error('[Scribe Engine] Error loading character memory:', error);
        }
    }
    
    // Save character memory to localStorage
    saveCharacterMemory() {
        try {
            const characters = Array.from(this.characterMemory);
            localStorage.setItem('chronicle_scribe_characters', JSON.stringify(characters));
        } catch (error) {
            console.error('[Scribe Engine] Error saving character memory:', error);
        }
    }
    
    // Show character picker modal
    showCharacterPicker() {
        // This will be expanded in Sprint 2 with full character profile integration
        console.log('[Scribe Engine] Character picker - Coming in Sprint 2');
        
        // For now, show remembered characters
        if (this.characterMemory.size === 0) {
            alert('No characters remembered yet. Type character names in VOICE element to remember them.');
            return;
        }
        
        const characters = Array.from(this.characterMemory).join(', ');
        alert(`Remembered Characters:\n\n${characters}\n\n(Full character profiles coming in Sprint 2)`);
    }
    
    // Move cursor to end of line
    moveCursorToEndOfLine(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // Calculate page count (1 page ≈ 55 lines or 1 minute of screen time)
    calculatePageCount() {
        const lines = this.writingArea.querySelectorAll('.screenplay-line');
        const lineCount = lines.length;
        const estimatedPages = Math.ceil(lineCount / 55);
        
        // Update page display
        const pageDisplay = document.querySelector('.page-number');
        const totalDisplay = document.querySelector('.total-pages');
        
        if (pageDisplay) pageDisplay.textContent = '1'; // Current page (would need scroll detection)
        if (totalDisplay) totalDisplay.textContent = estimatedPages.toString();
        
        return estimatedPages;
    }
}

// ============================================================================
// INITIALIZATION - Hook into Chronicle's existing system
// ============================================================================

// Global scribe engine instance
let scribeEngine = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Chronicle Scribe] DOM loaded, waiting for writing area...');
    
    // Wait for writing area to be available
    const checkWritingArea = setInterval(() => {
        const writingArea = document.getElementById('writingArea');
        if (writingArea) {
            clearInterval(checkWritingArea);
            console.log('[Chronicle Scribe] Writing area found, initializing engine...');
            scribeEngine = new ScribeEngine();
        }
    }, 100);
});

// Listen for mode switches
document.addEventListener('click', (e) => {
    // Mode switch buttons
    if (e.target.closest('.mode-switch-btn')) {
        const btn = e.target.closest('.mode-switch-btn');
        const mode = btn.dataset.mode;
        
        setTimeout(() => {
            if (mode === 'screenwriter' && scribeEngine) {
                scribeEngine.showElementIndicator();
                console.log('[Chronicle Scribe] Switched to screenwriter mode');
            } else if (scribeEngine) {
                scribeEngine.hideElementIndicator();
                console.log('[Chronicle Scribe] Switched to novelist mode');
            }
        }, 100);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScribeEngine };
}
