/* ============================================================================
   CHRONICLE - THE SCRIBE'S DESK
   JavaScript for Screenplay Formatting Engine (Sprint 1.5: Chamber Transformation)
   
   "My tongue is the pen of a skillful writer" - Psalm 45:1
   "To everything there is a season, and a time to every purpose" - Ecclesiastes 3:1
   ============================================================================ */

// ============================================================================
// THE MODE TRANSFORMER - Structural Metamorphosis Between Chambers
// ============================================================================

class ModeTransformer {
    constructor() {
        this.currentMode = 'novelist'; // Default mode
        this.novelistContent = ''; // Stored novelist content
        this.screenplayContent = []; // Stored screenplay lines
        this.writingArea = null;
        
        this.init();
    }
    
    init() {
        console.log('[Mode Transformer] Initializing chamber transformation system...');
        this.writingArea = document.getElementById('writingArea');
        
        if (!this.writingArea) {
            console.error('[Mode Transformer] Writing area not found');
            return;
        }
        
        // Detect initial mode from body class
        if (document.body.classList.contains('mode-screenwriter')) {
            this.currentMode = 'screenwriter';
        }
        
        this.attachModeListeners();
        console.log('[Mode Transformer] Initialized successfully');
    }
    
    attachModeListeners() {
        // Listen for mode switch button clicks
        const novelistBtn = document.getElementById('switchNovelist');
        const screenwriterBtn = document.getElementById('switchScreenwriter');
        
        if (novelistBtn) {
            novelistBtn.addEventListener('click', () => {
                console.log('[Mode Transformer] Switching to Novelist mode...');
                this.transformToNovelist();
            });
        }
        
        if (screenwriterBtn) {
            screenwriterBtn.addEventListener('click', () => {
                console.log('[Mode Transformer] Switching to Screenwriter mode...');
                this.transformToScreenwriter();
            });
        }
    }
    
    // Transform to Novelist mode
    transformToNovelist() {
        if (this.currentMode === 'novelist') {
            console.log('[Mode Transformer] Already in Novelist mode');
            return;
        }
        
        // 1. Store current screenplay content
        this.saveScreenplayContent();
        
        // 2. Clear the writing area
        this.writingArea.innerHTML = '';
        
        // 3. Restore novelist content (simple text)
        if (this.novelistContent) {
            this.writingArea.innerHTML = this.novelistContent;
        } else {
            // Initialize with placeholder
            this.writingArea.innerHTML = '<p><br></p>';
        }
        
        // 4. Update mode
        this.currentMode = 'novelist';
        
        // 5. Disable screenplay-specific features
        this.disableScreenplayFeatures();
        
        console.log('[Mode Transformer] Transformed to Novelist chamber');
    }
    
    // Transform to Screenwriter mode
    transformToScreenwriter() {
        if (this.currentMode === 'screenwriter') {
            console.log('[Mode Transformer] Already in Screenwriter mode');
            return;
        }
        
        // 1. Store current novelist content
        this.novelistContent = this.writingArea.innerHTML;
        
        // 2. Clear the writing area
        this.writingArea.innerHTML = '';
        
        // 3. Build screenplay structure
        if (this.screenplayContent.length > 0) {
            // Restore previous screenplay content
            this.restoreScreenplayContent();
        } else {
            // Initialize fresh screenplay structure
            this.initializeScreenplayStructure();
        }
        
        // 4. Update mode
        this.currentMode = 'screenwriter';
        
        // 5. Enable screenplay-specific features
        this.enableScreenplayFeatures();
        
        console.log('[Mode Transformer] Transformed to Screenwriter chamber');
    }
    
    // Initialize screenplay structure for first time
    initializeScreenplayStructure() {
        // Create the first line - always starts with The Decree (scene heading)
        const firstLine = document.createElement('div');
        firstLine.className = 'screenplay-line element-decree';
        firstLine.contentEditable = 'true';
        firstLine.innerHTML = '<br>'; // Empty but formatted line
        
        this.writingArea.appendChild(firstLine);
        
        // Focus on the first line
        setTimeout(() => {
            firstLine.focus();
            
            // Initialize the scribe engine for this line
            if (window.scribeEngine) {
                window.scribeEngine.setCurrentElement('decree');
                window.scribeEngine.showElementIndicator();
            }
        }, 50);
        
        console.log('[Mode Transformer] Initialized screenplay structure with opening Decree');
    }
    
    // Save screenplay content to memory
    saveScreenplayContent() {
        this.screenplayContent = [];
        
        const lines = this.writingArea.querySelectorAll('.screenplay-line');
        lines.forEach(line => {
            const elementClass = Array.from(line.classList).find(cls => cls.startsWith('element-'));
            const elementType = elementClass ? elementClass.replace('element-', '') : 'vision';
            
            this.screenplayContent.push({
                type: elementType,
                content: line.innerHTML
            });
        });
        
        console.log(`[Mode Transformer] Saved ${this.screenplayContent.length} screenplay lines`);
    }
    
    // Restore screenplay content from memory
    restoreScreenplayContent() {
        this.screenplayContent.forEach(lineData => {
            const line = document.createElement('div');
            line.className = `screenplay-line element-${lineData.type}`;
            line.contentEditable = 'true';
            line.innerHTML = lineData.content;
            
            this.writingArea.appendChild(line);
        });
        
        console.log(`[Mode Transformer] Restored ${this.screenplayContent.length} screenplay lines`);
        
        // Focus on the last line
        const lines = this.writingArea.querySelectorAll('.screenplay-line');
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1];
            setTimeout(() => {
                lastLine.focus();
                
                // Move cursor to end
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(lastLine);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 50);
        }
    }
    
    // Enable screenplay-specific features
    enableScreenplayFeatures() {
        if (window.scribeEngine) {
            window.scribeEngine.enable();
        }
    }
    
    // Disable screenplay-specific features
    disableScreenplayFeatures() {
        if (window.scribeEngine) {
            window.scribeEngine.disable();
        }
    }
    
    // Get current mode
    getCurrentMode() {
        return this.currentMode;
    }
}

// ============================================================================
// THE SCRIBE ENGINE - Core Screenplay Formatting System (UPDATED)
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
        
        this.currentElement = 'decree'; // Start with scene heading
        this.characterMemory = new Set(); // Remembered character names
        this.sceneLocations = new Set(); // Remembered locations
        this.writingArea = null; // Reference to contenteditable div
        this.elementIndicator = null; // Visual indicator
        this.shortcutsVisible = false;
        this.enabled = false; // Only active in screenwriter mode
        this.boundHandlers = {}; // Store bound event handlers for cleanup
        
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
        this.loadCharacterMemory();
        
        // Check if we're starting in screenwriter mode
        if (document.body.classList.contains('mode-screenwriter')) {
            this.enable();
        }
        
        console.log('[Scribe Engine] Initialized successfully');
    }
    
    // Enable screenplay features (called when entering screenwriter mode)
    enable() {
        if (this.enabled) return;
        
        console.log('[Scribe Engine] Enabling screenplay features...');
        this.attachEventListeners();
        this.showElementIndicator();
        this.enabled = true;
    }
    
    // Disable screenplay features (called when leaving screenwriter mode)
    disable() {
        if (!this.enabled) return;
        
        console.log('[Scribe Engine] Disabling screenplay features...');
        this.detachEventListeners();
        this.hideElementIndicator();
        this.enabled = false;
    }
    
    // Create the screenplay toolbar
    createToolbar() {
        const existingToolbar = document.querySelector('.writing-toolbar');
        if (!existingToolbar) return;
        
        const scribeToolbar = document.createElement('div');
        scribeToolbar.className = 'scribe-toolbar screenwriter-only';
        scribeToolbar.innerHTML = `
            <select class="element-selector" id="elementSelector">
                <option value="decree" selected>The Decree (Scene Heading)</option>
                <option value="vision">The Vision (Action)</option>
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
                <div class="element-name">The Decree</div>
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
    
    // Attach event listeners (only when enabled)
    attachEventListeners() {
        if (!this.writingArea) return;
        
        // Create bound handlers (so we can remove them later)
        this.boundHandlers.keydown = this.handleKeyDown.bind(this);
        this.boundHandlers.input = this.handleInput.bind(this);
        this.boundHandlers.focus = this.handleFocus.bind(this);
        this.boundHandlers.blur = this.handleBlur.bind(this);
        
        // Attach to writing area
        this.writingArea.addEventListener('keydown', this.boundHandlers.keydown);
        this.writingArea.addEventListener('input', this.boundHandlers.input);
        this.writingArea.addEventListener('focus', this.boundHandlers.focus);
        this.writingArea.addEventListener('blur', this.boundHandlers.blur);
        
        console.log('[Scribe Engine] Event listeners attached');
    }
    
    // Detach event listeners (when disabled)
    detachEventListeners() {
        if (!this.writingArea || !this.boundHandlers.keydown) return;
        
        this.writingArea.removeEventListener('keydown', this.boundHandlers.keydown);
        this.writingArea.removeEventListener('input', this.boundHandlers.input);
        this.writingArea.removeEventListener('focus', this.boundHandlers.focus);
        this.writingArea.removeEventListener('blur', this.boundHandlers.blur);
        
        console.log('[Scribe Engine] Event listeners detached');
    }
    
    // Handle keydown events
    handleKeyDown(e) {
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
    }
    
    // Handle input events
    handleInput() {
        this.detectElementFromContent();
    }
    
    // Handle focus events
    handleFocus() {
        this.showElementIndicator();
    }
    
    // Handle blur events
    handleBlur() {
        setTimeout(() => this.hideElementIndicator(), 500);
    }
    
    // Get current screenplay line
    getCurrentLine() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        
        const range = selection.getRangeAt(0);
        let currentNode = range.startContainer;
        
        // Traverse up to find the screenplay-line element
        while (currentNode && currentNode !== this.writingArea) {
            if (currentNode.nodeType === Node.ELEMENT_NODE && 
                currentNode.classList && 
                currentNode.classList.contains('screenplay-line')) {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        
        return null;
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
        const currentLine = this.getCurrentLine();
        if (currentLine) {
            this.formatLineAsElement(currentLine, elementId);
        }
        
        console.log(`[Scribe Engine] Element changed to: ${elementId}`);
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
        const text = lineElement.textContent.trim();
        
        // Don't transform empty lines
        if (!text || text === '') return;
        
        let transformedText = text;
        
        switch(elementId) {
            case 'decree':
                // Uppercase for scene headings
                transformedText = text.toUpperCase();
                break;
                
            case 'voice':
                // Uppercase for character names
                transformedText = text.toUpperCase();
                // Remember this character
                this.rememberCharacter(text);
                break;
                
            case 'whisper':
                // Lowercase for parentheticals
                transformedText = text.toLowerCase();
                break;
                
            case 'transition':
                // Uppercase for transitions
                transformedText = text.toUpperCase();
                break;
        }
        
        // Only update if text changed
        if (transformedText !== text) {
            const cursorPosition = this.getCursorPosition(lineElement);
            lineElement.textContent = transformedText;
            this.setCursorPosition(lineElement, cursorPosition);
        }
    }
    
    // Get cursor position within element
    getCursorPosition(element) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return 0;
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        
        return preCaretRange.toString().length;
    }
    
    // Set cursor position within element
    setCursorPosition(element, position) {
        const range = document.createRange();
        const selection = window.getSelection();
        
        let charCount = 0;
        let nodeStack = [element];
        let node, foundStart = false;
        
        while (!foundStart && (node = nodeStack.pop())) {
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + node.length;
                if (position <= nextCharCount) {
                    range.setStart(node, position - charCount);
                    range.collapse(true);
                    foundStart = true;
                }
                charCount = nextCharCount;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // Detect element type from content
    detectElementFromContent() {
        const currentLine = this.getCurrentLine();
        if (!currentLine) return;
        
        const text = currentLine.textContent.trim();
        const detectedElement = this.detectElementType(text);
        
        if (detectedElement && detectedElement !== this.currentElement) {
            // Auto-detect changed element type
            this.setCurrentElement(detectedElement);
        }
    }
    
    // Detect element type from text content
    detectElementType(text) {
        if (!text) return null;
        
        // Scene heading detection
        if (/^(INT\.|EXT\.|INT\/EXT\.)/.test(text.toUpperCase())) {
            return 'decree';
        }
        
        // Character name detection (all caps, 2-30 chars)
        if (/^[A-Z\s]{2,30}$/.test(text) && text.length <= 30) {
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
        const currentLine = this.getCurrentLine();
        
        // Create new line
        const newLine = document.createElement('div');
        newLine.className = 'screenplay-line';
        newLine.contentEditable = 'true';
        
        // Determine next logical element
        const nextElement = this.getNextLogicalElement();
        newLine.classList.add(`element-${nextElement}`);
        
        // Add line break for spacing
        newLine.innerHTML = '<br>';
        
        // Insert after current line
        if (currentLine) {
            currentLine.parentNode.insertBefore(newLine, currentLine.nextSibling);
        } else {
            this.writingArea.appendChild(newLine);
        }
        
        // Focus new line
        setTimeout(() => {
            newLine.focus();
            
            // Update current element
            this.setCurrentElement(nextElement);
        }, 10);
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
        if (this.elementIndicator && this.enabled) {
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
        console.log('[Scribe Engine] Character picker - Coming in Sprint 2');
        
        if (this.characterMemory.size === 0) {
            alert('No characters remembered yet. Type character names in VOICE element to remember them.');
            return;
        }
        
        const characters = Array.from(this.characterMemory).join(', ');
        alert(`Remembered Characters:\n\n${characters}\n\n(Full character profiles coming in Sprint 2)`);
    }
}

// ============================================================================
// INITIALIZATION - "In the beginning..."
// ============================================================================

// Global instances
let modeTransformer = null;
let scribeEngine = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Chronicle Scribe] DOM loaded, initializing systems...');
    
    // Wait for writing area to be available
    const checkWritingArea = setInterval(() => {
        const writingArea = document.getElementById('writingArea');
        if (writingArea) {
            clearInterval(checkWritingArea);
            console.log('[Chronicle Scribe] Writing area found, initializing...');
            
            // Initialize Mode Transformer first (foundation)
            modeTransformer = new ModeTransformer();
            
            // Then initialize Scribe Engine (builds on transformer)
            scribeEngine = new ScribeEngine();
            
            console.log('[Chronicle Scribe] All systems initialized');
        }
    }, 100);
});

// Make scribeEngine globally accessible
window.scribeEngine = scribeEngine;
window.modeTransformer = modeTransformer;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScribeEngine, ModeTransformer };
}
