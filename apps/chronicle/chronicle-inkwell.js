// ===================================
// THE INKWELL - Sacred Fragment Capture
// "Pour out your heart like water before the presence of the Lord"
// - Lamentations 2:19
// ===================================

const InkwellApp = {
    // State
    isOpen: false,
    currentView: 'start', // 'start', 'writing', 'history'
    selectedTimer: 300, // seconds (5 minutes default)
    remainingTime: 0,
    timerInterval: null,
    currentFragment: '',
    
    // Storage key
    fragmentsKey: 'chronicle_inkwell_fragments',
    
    // Initialize
    init() {
        console.log('🖋️ Initializing The Inkwell...');
        this.setupEventListeners();
        this.loadFragments();
        console.log('The Inkwell is ready to receive prophetic outpourings');
    },
    
    // Setup Event Listeners
    setupEventListeners() {
        // Toggle panel
        const inkwellTab = document.getElementById('inkwellTab');
        const closeInkwell = document.getElementById('closeInkwell');
        
        if (inkwellTab) {
            inkwellTab.addEventListener('click', () => this.toggle());
        }
        if (closeInkwell) {
            closeInkwell.addEventListener('click', () => this.close());
        }
        
        // View tabs
        const viewTabs = document.querySelectorAll('.inkwell-view-tab');
        viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
        
        // Timer options
        const timerOptions = document.querySelectorAll('.timer-option');
        timerOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectTimer(parseInt(option.dataset.seconds));
            });
        });
        
        // Start outpouring
        const startBtn = document.getElementById('startOutpouring');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startOutpouring());
        }
        
        // Writing actions
        const extendBtn = document.getElementById('extendTime');
        const finishBtn = document.getElementById('finishOutpouring');
        
        if (extendBtn) {
            extendBtn.addEventListener('click', () => this.extendTime());
        }
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.finishOutpouring());
        }
        
        // Save fragment modal
        const cancelSave = document.getElementById('cancelSaveFragment');
        const confirmSave = document.getElementById('confirmSaveFragment');
        
        if (cancelSave) {
            cancelSave.addEventListener('click', () => this.closeSaveModal());
        }
        if (confirmSave) {
            confirmSave.addEventListener('click', () => this.saveFragment());
        }
        
        // Export/Import
        const exportBtn = document.getElementById('exportFragments');
        const importBtn = document.getElementById('importFragments');
        const importInput = document.getElementById('importFragmentsInput');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAllFragments());
        }
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                if (importInput) importInput.click();
            });
        }
        if (importInput) {
            importInput.addEventListener('change', (e) => this.importFragments(e));
        }
        
        // Search fragments
        const searchInput = document.getElementById('fragmentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchFragments(e.target.value));
        }
        
        // Keyboard shortcut: Cmd/Ctrl + I
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.toggle();
            }
        });
    },
    
    // Toggle Panel
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },
    
    // Open Panel
    open() {
        const panel = document.getElementById('inkwellPanel');
        const tab = document.getElementById('inkwellTab');
        
        if (panel) {
            panel.classList.add('active');
            if (tab) tab.classList.add('active');
            this.isOpen = true;
            
            // Load fragments if in history view
            if (this.currentView === 'history') {
                this.renderFragments();
            }
        }
    },
    
    // Close Panel
    close() {
        const panel = document.getElementById('inkwellPanel');
        const tab = document.getElementById('inkwellTab');
        
        if (panel) {
            panel.classList.remove('active');
            if (tab) tab.classList.remove('active');
            this.isOpen = false;
            
            // Stop timer if running
            if (this.timerInterval) {
                this.stopTimer();
            }
        }
    },
    
    // Switch View
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update tabs
        document.querySelectorAll('.inkwell-view-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === viewName) {
                tab.classList.add('active');
            }
        });
        
        // Update view visibility
        document.querySelectorAll('[id$="View"]').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            
            // If switching to history, render fragments
            if (viewName === 'history') {
                this.renderFragments();
            }
        }
    },
    
    // Select Timer Duration
    selectTimer(seconds) {
        this.selectedTimer = seconds;
        
        document.querySelectorAll('.timer-option').forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.dataset.seconds) === seconds) {
                option.classList.add('selected');
            }
        });
    },
    
    // Start Outpouring
    startOutpouring() {
        this.switchView('writing');
        this.remainingTime = this.selectedTimer;
        this.currentFragment = '';
        
        // Clear textarea
        const textarea = document.getElementById('inkwellTextarea');
        if (textarea) {
            textarea.value = '';
            textarea.focus();
        }
        
        // Start timer if not unlimited
        if (this.selectedTimer > 0) {
            this.startTimer();
        } else {
            this.updateTimerDisplay('∞', 'No time limit');
        }
    },
    
    // Start Timer
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                this.stopTimer();
                this.finishOutpouring();
            } else {
                const minutes = Math.floor(this.remainingTime / 60);
                const seconds = this.remainingTime % 60;
                this.updateTimerDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`, 'Time remaining');
            }
        }, 1000);
        
        // Initial display
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.updateTimerDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`, 'Time remaining');
    },
    
    // Stop Timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    // Update Timer Display
    updateTimerDisplay(timeText, labelText) {
        const timerText = document.querySelector('.timer-text');
        const timerLabel = document.querySelector('.timer-label');
        
        if (timerText) timerText.textContent = timeText;
        if (timerLabel) timerLabel.textContent = labelText;
    },
    
    // Extend Time
    extendTime() {
        // Add 2 more minutes
        this.remainingTime += 120;
        console.log('⏱️ Extended by 2 minutes');
    },
    
    // Finish Outpouring
    finishOutpouring() {
        this.stopTimer();
        
        // Get text from textarea
        const textarea = document.getElementById('inkwellTextarea');
        if (textarea && textarea.value.trim()) {
            this.currentFragment = textarea.value.trim();
            this.showSaveModal();
        } else {
            // No content, just return to start
            this.switchView('start');
        }
    },
    
    // Show Save Modal
    showSaveModal() {
        const modal = document.getElementById('saveFragmentModal');
        if (modal) {
            modal.classList.add('active');
            
            // Focus title input
            const titleInput = document.getElementById('fragmentTitleInput');
            if (titleInput) {
                titleInput.focus();
            }
        }
    },
    
    // Close Save Modal
    closeSaveModal() {
        const modal = document.getElementById('saveFragmentModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Return to start view
        this.switchView('start');
    },
    
    // Save Fragment
    saveFragment() {
        const titleInput = document.getElementById('fragmentTitleInput');
        const destinationRadios = document.querySelectorAll('input[name="fragmentDestination"]');
        
        let title = titleInput ? titleInput.value.trim() : '';
        let destination = 'inkwell';
        
        // Get selected destination
        destinationRadios.forEach(radio => {
            if (radio.checked) {
                destination = radio.value;
            }
        });
        
        // Generate title if empty
        if (!title) {
            title = `Fragment ${new Date().toLocaleString()}`;
        }
        
        // Create fragment object
        const fragment = {
            id: `fragment-${Date.now()}`,
            title: title,
            content: this.currentFragment,
            createdAt: new Date().toISOString(),
            duration: this.selectedTimer,
            author: ChronicleApp.currentUser,
            destination: destination,
            wordCount: this.countWords(this.currentFragment)
        };
        
        // Save to storage
        const fragments = this.loadFragments();
        fragments.unshift(fragment); // Add to beginning
        localStorage.setItem(this.fragmentsKey, JSON.stringify(fragments));
        
        console.log('✅ Fragment saved:', title);
        
        // Close modal and switch to history
        this.closeSaveModal();
        this.switchView('history');
    },
    
    // Load Fragments from Storage
    loadFragments() {
        const stored = localStorage.getItem(this.fragmentsKey);
        return stored ? JSON.parse(stored) : [];
    },
    
    // Render Fragments
    renderFragments(searchTerm = '') {
        const fragments = this.loadFragments();
        const container = document.getElementById('fragmentsList');
        
        if (!container) return;
        
        // Filter if search term
        const filtered = searchTerm
            ? fragments.filter(f => 
                f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.content.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : fragments;
        
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="no-fragments">
                    <p>${searchTerm ? 'No fragments match your search' : 'No fragments yet. Begin your first outpouring!'}</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filtered.map(fragment => `
            <div class="fragment-card" data-id="${fragment.id}">
                <div class="fragment-header">
                    <h4 class="fragment-title">${this.escapeHtml(fragment.title)}</h4>
                    <div class="fragment-meta">
                        <span>${this.formatDate(fragment.createdAt)}</span>
                        <span>•</span>
                        <span>${fragment.wordCount} words</span>
                    </div>
                </div>
                <div class="fragment-preview">${this.escapeHtml(fragment.content)}</div>
                <div class="fragment-actions">
                    <button class="fragment-action-btn view" data-id="${fragment.id}">View</button>
                    <button class="fragment-action-btn export" data-id="${fragment.id}">Export</button>
                    <button class="fragment-action-btn delete" data-id="${fragment.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Attach event listeners to action buttons
        this.attachFragmentActions();
    },
    
    // Attach Fragment Action Listeners
    attachFragmentActions() {
        // View
        document.querySelectorAll('.fragment-action-btn.view').forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewFragment(btn.dataset.id);
            });
        });
        
        // Export
        document.querySelectorAll('.fragment-action-btn.export').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportSingleFragment(btn.dataset.id);
            });
        });
        
        // Delete
        document.querySelectorAll('.fragment-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this fragment? This cannot be undone.')) {
                    this.deleteFragment(btn.dataset.id);
                }
            });
        });
    },
    
    // View Fragment
    viewFragment(fragmentId) {
        const fragments = this.loadFragments();
        const fragment = fragments.find(f => f.id === fragmentId);
        
        if (!fragment) return;
        
        const modal = document.getElementById('viewFragmentModal');
        if (!modal) return;
        
        // Populate modal
        const title = modal.querySelector('.view-fragment-header h3');
        const body = modal.querySelector('.view-fragment-body');
        const metadata = modal.querySelector('.fragment-metadata');
        
        if (title) title.textContent = fragment.title;
        if (body) body.textContent = fragment.content;
        if (metadata) {
            metadata.textContent = `${this.formatDate(fragment.createdAt)} • ${fragment.wordCount} words • By ${fragment.author}`;
        }
        
        // Show modal
        modal.classList.add('active');
        
        // Close button
        const closeBtn = modal.querySelector('.close-view-fragment');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }
        
        // Export button in modal
        const exportBtn = modal.querySelector('.export-single-btn');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportSingleFragment(fragmentId);
        }
    },
    
    // Delete Fragment
    deleteFragment(fragmentId) {
        let fragments = this.loadFragments();
        fragments = fragments.filter(f => f.id !== fragmentId);
        localStorage.setItem(this.fragmentsKey, JSON.stringify(fragments));
        
        console.log('🗑️ Fragment deleted');
        this.renderFragments();
    },
    
    // Search Fragments
    searchFragments(searchTerm) {
        this.renderFragments(searchTerm);
    },
    
    // Export Single Fragment
    exportSingleFragment(fragmentId) {
        const fragments = this.loadFragments();
        const fragment = fragments.find(f => f.id === fragmentId);
        
        if (!fragment) return;
        
        // Show format selector
        const format = prompt('Export as:\n1. TXT (plain text)\n2. PDF\n\nEnter 1 or 2:', '1');
        
        if (format === '1') {
            this.exportAsTXT([fragment], fragment.title);
        } else if (format === '2') {
            this.exportAsPDF([fragment], fragment.title);
        }
    },
    
    // Export All Fragments
    exportAllFragments() {
        const fragments = this.loadFragments();
        
        if (fragments.length === 0) {
            alert('No fragments to export');
            return;
        }
        
        const format = prompt('Export all as:\n1. TXT (plain text)\n2. PDF\n3. JSON (for import)\n\nEnter 1, 2, or 3:', '1');
        
        if (format === '1') {
            this.exportAsTXT(fragments, 'All_Inkwell_Fragments');
        } else if (format === '2') {
            this.exportAsPDF(fragments, 'All_Inkwell_Fragments');
        } else if (format === '3') {
            this.exportAsJSON(fragments);
        }
    },
    
    // Export as TXT
    exportAsTXT(fragments, filename) {
        let content = '';
        
        fragments.forEach((fragment, index) => {
            content += '='.repeat(60) + '\n';
            content += fragment.title.toUpperCase() + '\n';
            content += '='.repeat(60) + '\n';
            content += `Date: ${this.formatDate(fragment.createdAt)}\n`;
            content += `Author: ${fragment.author}\n`;
            content += `Words: ${fragment.wordCount}\n`;
            content += '\n' + fragment.content + '\n\n';
            
            if (index < fragments.length - 1) {
                content += '\n\n';
            }
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        this.downloadFile(blob, `${filename}.txt`);
        
        console.log('📄 Exported as TXT');
    },
    
    // Export as PDF (simple text-based)
    exportAsPDF(fragments, filename) {
        // For now, we'll create a simple HTML version and let browser print to PDF
        // In a full implementation, you'd use a library like jsPDF
        
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${filename}</title>
                <style>
                    body {
                        font-family: 'Crimson Text', Georgia, serif;
                        max-width: 8.5in;
                        margin: 0 auto;
                        padding: 1in;
                        line-height: 1.8;
                    }
                    h1 {
                        font-family: 'Cinzel', serif;
                        color: #C9A961;
                        text-align: center;
                        margin-bottom: 2rem;
                        page-break-before: always;
                    }
                    h1:first-of-type {
                        page-break-before: avoid;
                    }
                    .meta {
                        color: #666;
                        font-size: 0.9rem;
                        margin-bottom: 1.5rem;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 0.5rem;
                    }
                    .content {
                        white-space: pre-wrap;
                        margin-bottom: 3rem;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                </style>
            </head>
            <body>
        `;
        
        fragments.forEach((fragment, index) => {
            html += `
                <h1>${this.escapeHtml(fragment.title)}</h1>
                <div class="meta">
                    ${this.formatDate(fragment.createdAt)} • 
                    ${fragment.author} • 
                    ${fragment.wordCount} words
                </div>
                <div class="content">${this.escapeHtml(fragment.content)}</div>
                ${index < fragments.length - 1 ? '<div class="page-break"></div>' : ''}
            `;
        });
        
        html += `
            </body>
            </html>
        `;
        
        // Open in new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Wait for content to load then trigger print
        printWindow.onload = () => {
            printWindow.print();
        };
        
        console.log('📄 PDF print dialog opened');
    },
    
    // Export as JSON
    exportAsJSON(fragments) {
        const json = JSON.stringify(fragments, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadFile(blob, 'inkwell_fragments.json');
        
        console.log('📦 Exported as JSON');
    },
    
    // Import Fragments
    importFragments(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format');
                }
                
                // Merge with existing fragments
                const existing = this.loadFragments();
                const merged = [...imported, ...existing];
                
                localStorage.setItem(this.fragmentsKey, JSON.stringify(merged));
                
                console.log(`✅ Imported ${imported.length} fragments`);
                alert(`Successfully imported ${imported.length} fragments`);
                
                // Refresh view
                this.renderFragments();
                
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing file. Please ensure it\'s a valid JSON file exported from Chronicle.');
            }
        };
        
        reader.readAsText(file);
        
        // Reset input
        event.target.value = '';
    },
    
    // Utility: Download File
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Utility: Count Words
    countWords(text) {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).length;
    },
    
    // Utility: Format Date
    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Utility: Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InkwellApp.init());
} else {
    InkwellApp.init();
}

// Make available globally
window.InkwellApp = InkwellApp;

console.log('%c🖋️ The Inkwell', 'font-size: 16px; font-weight: bold; color: #C9A961;');
console.log('%c"Capture now, structure later"', 'font-size: 11px; font-style: italic; color: #b8b3aa;');
