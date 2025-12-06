/**
 * TYRREL'S STUDY
 * Mentor's observation and guidance workspace
 * For shepherding Trevor through the Joseph learning journey
 * Preparing notes and insights for the Exodus work ahead
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTyrrelStudy);
    } else {
        initTyrrelStudy();
    }

    function initTyrrelStudy() {
        console.log('Initializing Tyrrel\'s Study...');
        
        // Wait for panel to exist
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('panel-tyrrel');
            if (panel) {
                clearInterval(checkPanel);
                buildStudyWorkspace();
            }
        }, 100);
    }

    function buildStudyWorkspace() {
        const panel = document.getElementById('panel-tyrrel');
        if (!panel) return;

        panel.innerHTML = `
            <!-- Welcome Banner -->
            <div class="study-welcome">
                <div class="study-welcome-icon">✧</div>
                <h2 class="study-welcome-title">Tyrrel's Study</h2>
                <p class="study-welcome-subtitle">Shepherding Trevor's journey, preparing for Exodus</p>
            </div>

            <!-- Study Dashboard -->
            <div class="study-dashboard">
                <!-- Progress Overview -->
                <div class="study-card study-progress">
                    <h3 class="study-card-title">Trevor's Progress</h3>
                    <div class="progress-stats">
                        <div class="progress-stat">
                            <span class="progress-label">Your Story Notes</span>
                            <span class="progress-value" id="tyrrelStoryCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">Trevor's Story Notes</span>
                            <span class="progress-value" id="trevorStoryCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">Your Observations</span>
                            <span class="progress-value" id="observationCount">0</span>
                        </div>
                        <div class="progress-stat">
                            <span class="progress-label">Trevor's Journal</span>
                            <span class="progress-value" id="trevorJournalCount">0</span>
                        </div>
                    </div>
                </div>

                <!-- Mentorship Journal -->
                <div class="study-card study-journal">
                    <h3 class="study-card-title">Mentor's Observations</h3>
                    <p class="study-card-desc">Record your insights, guidance notes, and observations about Trevor's journey</p>
                    <textarea 
                        id="journalEntry" 
                        class="journal-textarea" 
                        placeholder="What patterns do you see in Trevor's engagement?

What guidance does he need at this stage?

How is he connecting Joseph's story to his own life?

What preparation for the Exodus App is needed?"></textarea>
                    <div class="journal-actions">
                        <button class="journal-btn journal-save" id="saveJournalBtn">
                            Save Observation
                        </button>
                        <span class="journal-status" id="journalStatus"></span>
                    </div>
                </div>
            </div>

            <!-- Recent Observations -->
            <div class="study-card study-entries">
                <div class="study-entries-header">
                    <h3 class="study-card-title">Your Observations</h3>
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
                    <h3 class="exodus-title">Preparing for the Exodus</h3>
                    <p class="exodus-text">The Joseph App grounds Trevor in the story, the history, the patterns, and the principles. Your role here is observation and guidanceâ€"shepherding him through comprehension. When he's ready, the <strong>Exodus App</strong> becomes your shared workspace for creation.</p>
                    <p class="exodus-subtext">As Joseph prepared the way for Moses, this learning ground prepares both of you for the adaptation work ahead.</p>
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
                showStatus(status, 'Observation saved ✓', 'success');
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
        localStorage.setItem('josephTyrrelJournal', JSON.stringify(entries));
    }

    function getJournalEntries() {
        const stored = localStorage.getItem('josephTyrrelJournal');
        return stored ? JSON.parse(stored) : [];
    }

    function loadJournalEntries() {
        const list = document.getElementById('journalList');
        if (!list) return;

        const entries = getJournalEntries();

        if (entries.length === 0) {
            list.innerHTML = `
                <div class="journal-empty">
                    <p>No observations yet. Begin recording your mentorship insights above.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = entries.map(entry => `
            <div class="journal-entry" data-id="${entry.id}">
                <div class="journal-entry-header">
                    <span class="journal-entry-date">${entry.date}</span>
                    <button class="journal-entry-delete" onclick="window.deleteTyrrelJournalEntry(${entry.id})">×</button>
                </div>
                <div class="journal-entry-text">${escapeHtml(entry.text)}</div>
            </div>
        `).join('');
    }

    function loadStudyStats() {
        // Count Story annotations (from localStorage)
        const storyNotes = JSON.parse(localStorage.getItem('josephAnnotations') || '[]');
        const tyrrelStoryNotes = storyNotes.filter(note => note.author === 'tyrrel');
        const trevorStoryNotes = storyNotes.filter(note => note.author === 'trevor');
        
        // Count Tyrrel's observations
        const tyrrelObservations = getJournalEntries();
        
        // Count Trevor's journal
        const trevorJournal = JSON.parse(localStorage.getItem('josephTrevorJournal') || '[]');

        // Update UI
        updateStatCount('tyrrelStoryCount', tyrrelStoryNotes.length);
        updateStatCount('trevorStoryCount', trevorStoryNotes.length);
        updateStatCount('observationCount', tyrrelObservations.length);
        updateStatCount('trevorJournalCount', trevorJournal.length);
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
        const tyrrelStoryNotes = storyNotes.filter(note => note.author === 'tyrrel');
        const trevorStoryNotes = storyNotes.filter(note => note.author === 'trevor');
        const tyrrelObservations = getJournalEntries();
        const trevorJournal = JSON.parse(localStorage.getItem('josephTrevorJournal') || '[]');

        const exportData = {
            exportDate: new Date().toISOString(),
            mentor: {
                storyNotes: tyrrelStoryNotes.length,
                observations: tyrrelObservations.length,
                storyAnnotations: tyrrelStoryNotes,
                journalEntries: tyrrelObservations
            },
            student: {
                storyNotes: trevorStoryNotes.length,
                journalEntries: trevorJournal.length,
                storyAnnotations: trevorStoryNotes,
                journal: trevorJournal
            }
        };

        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tyrrel-joseph-mentorship-${Date.now()}.json`;
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
    window.deleteTyrrelJournalEntry = function(id) {
        if (!confirm('Delete this observation?')) return;

        const entries = getJournalEntries();
        const filtered = entries.filter(entry => entry.id !== id);
        localStorage.setItem('josephTyrrelJournal', JSON.stringify(filtered));
        
        loadJournalEntries();
        loadStudyStats();
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

})();
