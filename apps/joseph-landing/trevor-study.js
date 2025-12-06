/**
 * TREVOR'S STUDY
 * Personal reflection workspace for the Joseph learning journey
 * Connects to Story, World, and Power sections
 * Gateway to the Exodus App
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrevorStudy);
    } else {
        initTrevorStudy();
    }

    function initTrevorStudy() {
        console.log('Initializing Trevor\'s Study...');
        
        // Wait for panel to exist
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('panel-trevor');
            if (panel) {
                clearInterval(checkPanel);
                buildStudyWorkspace();
            }
        }, 100);
    }

    function buildStudyWorkspace() {
        const panel = document.getElementById('panel-trevor');
        if (!panel) return;

        panel.innerHTML = `
            <!-- Welcome Banner -->
            <div class="study-welcome">
                <div class="study-welcome-icon">✦</div>
                <h2 class="study-welcome-title">Welcome to Your Study, Trevor</h2>
                <p class="study-welcome-subtitle">Your personal space for reflection and growth</p>
            </div>

            <!-- Study Dashboard -->
            <div class="study-dashboard">
                <!-- Progress Overview -->
                <div class="study-card study-progress">
                    <h3 class="study-card-title">Your Journey</h3>
                    <div class="progress-stats">
                        <div class="progress-stat">
                            <span class="progress-label">Story Annotations</span>
                            <span class="progress-value" id="storyNoteCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">World Notes</span>
                            <span class="progress-value" id="worldNoteCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">Power Reflections</span>
                            <span class="progress-value" id="powerNoteCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">Journal Entries</span>
                            <span class="progress-value" id="journalCount">0</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Journal -->
                <div class="study-card study-journal">
                    <h3 class="study-card-title">Journal Entry</h3>
                    <p class="study-card-desc">Capture your thoughts as you explore Joseph's story</p>
                    <textarea 
                        id="journalEntry" 
                        class="journal-textarea" 
                        placeholder="What is God teaching you through Joseph's journey?

What patterns do you see in your own life?

How does this story change how you see your circumstances?"></textarea>
                    <div class="journal-actions">
                        <button class="journal-btn journal-save" id="saveJournalBtn">
                            Save Entry
                        </button>
                        <span class="journal-status" id="journalStatus"></span>
                    </div>
                </div>
            </div>

            <!-- Recent Journal Entries -->
            <div class="study-card study-entries">
                <div class="study-entries-header">
                    <h3 class="study-card-title">Your Journal</h3>
                    <button class="entries-export" id="exportBtn">Export All Notes</button>
                </div>
                <div id="journalList" class="journal-list">
                    <!-- Journal entries will be inserted here -->
                </div>
            </div>

            <!-- Exodus Gateway -->
            <div class="exodus-gateway">
                <div class="exodus-icon">→</div>
                <div class="exodus-content">
                    <h3 class="exodus-title">Ready for the Next Chapter?</h3>
                    <p class="exodus-text">The Joseph App is your learning ground—understanding the story, the world, the patterns, and the principles. When you're ready to begin the real work of adaptation, the <strong>Exodus App</strong> awaits.</p>
                    <p class="exodus-subtext">Just as Joseph's story prepared the way for Moses and the great deliverance, your time here prepares you for the work of creation.</p>
                    <button class="exodus-btn" disabled>
                        Coming Soon: The Exodus App
                    </button>
                </div>
            </div>
        `;

        // Initialize functionality
        initJournalSystem();
        loadStudyStats();
        loadJournalEntries();
    }

    function initJournalSystem() {
        const saveBtn = document.getElementById('saveJournalBtn');
        const textarea = document.getElementById('journalEntry');
        const status = document.getElementById('journalStatus');
        const exportBtn = document.getElementById('exportBtn');

        if (saveBtn && textarea) {
            saveBtn.addEventListener('click', () => {
                const entry = textarea.value.trim();
                if (!entry) {
                    showStatus(status, 'Please write something first', 'error');
                    return;
                }

                saveJournalEntry(entry);
                textarea.value = '';
                showStatus(status, 'Entry saved ✓', 'success');
                loadJournalEntries();
                loadStudyStats();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', exportAllNotes);
        }
    }

    function saveJournalEntry(text) {
        const entries = getJournalEntries();
        const newEntry = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            })
        };

        entries.unshift(newEntry);
        localStorage.setItem('josephTrevorJournal', JSON.stringify(entries));
    }

    function getJournalEntries() {
        const stored = localStorage.getItem('josephTrevorJournal');
        return stored ? JSON.parse(stored) : [];
    }

    function loadJournalEntries() {
        const list = document.getElementById('journalList');
        if (!list) return;

        const entries = getJournalEntries();

        if (entries.length === 0) {
            list.innerHTML = `
                <div class="journal-empty">
                    <p>No journal entries yet. Start reflecting on Joseph's story above.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = entries.map(entry => `
            <div class="journal-entry" data-id="${entry.id}">
                <div class="journal-entry-header">
                    <span class="journal-entry-date">${entry.date}</span>
                    <button class="journal-entry-delete" onclick="window.deleteJournalEntry(${entry.id})">×</button>
                </div>
                <div class="journal-entry-text">${escapeHtml(entry.text)}</div>
            </div>
        `).join('');
    }

    function loadStudyStats() {
        // Count Story annotations (from localStorage)
        const storyNotes = JSON.parse(localStorage.getItem('josephAnnotations') || '[]');
        const trevorStoryNotes = storyNotes.filter(note => note.author === 'trevor');
        
        // Count journal entries
        const journalEntries = getJournalEntries();

        // Update UI
        updateStatCount('storyNoteCount', trevorStoryNotes.length);
        updateStatCount('worldNoteCount', 0); // Placeholder
        updateStatCount('powerNoteCount', 0); // Placeholder
        updateStatCount('journalCount', journalEntries.length);
    }

    function updateStatCount(id, count) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = count;
        }
    }

    function showStatus(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `journal-status ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'journal-status';
        }, 3000);
    }

    function exportAllNotes() {
        const storyNotes = JSON.parse(localStorage.getItem('josephAnnotations') || '[]');
        const trevorStoryNotes = storyNotes.filter(note => note.author === 'trevor');
        const journalEntries = getJournalEntries();

        const exportData = {
            exportDate: new Date().toISOString(),
            totalStoryNotes: trevorStoryNotes.length,
            totalJournalEntries: journalEntries.length,
            storyAnnotations: trevorStoryNotes,
            journalEntries: journalEntries
        };

        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trevor-joseph-study-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show confirmation
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = 'Exported! ✓';
            setTimeout(() => {
                exportBtn.textContent = originalText;
            }, 2000);
        }
    }

    // Global function for deleting journal entries
    window.deleteJournalEntry = function(id) {
        if (!confirm('Delete this journal entry?')) return;

        const entries = getJournalEntries();
        const filtered = entries.filter(entry => entry.id !== id);
        localStorage.setItem('josephTrevorJournal', JSON.stringify(filtered));
        
        loadJournalEntries();
        loadStudyStats();
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

})();
