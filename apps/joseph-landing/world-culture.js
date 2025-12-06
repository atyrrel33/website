/**
 * WORLD CULTURE EXPLORER
 * Sprint 3: Joseph's Egypt - Daily Life, Power, and Providence
 * 
 * "It is the glory of God to conceal a matter; 
 *  to search out a matter is the glory of kings." - Proverbs 25:2
 */

class CultureExplorer {
  constructor() {
    this.cultureData = null;
    this.currentSubsection = 'golden-age';
    this.animations = {};
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      await this.loadCultureData();
      this.renderCultureHub();
      this.attachEventListeners();
      this.initAnimations();
      this.initialized = true;
      console.log('✨ Culture Explorer initialized');
    } catch (error) {
      console.error('Culture Explorer initialization failed:', error);
    }
  }

  async loadCultureData() {
    try {
      const response = await fetch('world.json');
      const data = await response.json();
      this.cultureData = data.sections[2]; // Culture section
    } catch (error) {
      console.error('Failed to load culture data:', error);
      // Fallback data structure
      this.cultureData = this.getFallbackData();
    }
  }

  renderCultureHub() {
    const container = document.getElementById('culture-explorer');
    if (!container) {
      console.error('Culture explorer container not found');
      return;
    }

    container.innerHTML = `
      <div class="culture-hub">
        <div class="culture-header">
          <h1 class="culture-title">The Culture</h1>
          <p class="culture-subtitle">Joseph's Egypt: Where History and Faith Meet</p>
        </div>

        <nav class="culture-nav">
          <button class="culture-nav-btn active" data-subsection="golden-age">
            <span class="nav-icon">👑</span>
            <span class="nav-label">The Golden Age</span>
          </button>
          <button class="culture-nav-btn" data-subsection="nile-cycle">
            <span class="nav-icon">🌊</span>
            <span class="nav-label">The Nile</span>
          </button>
          <button class="culture-nav-btn" data-subsection="power-hierarchy">
            <span class="nav-icon">⚖️</span>
            <span class="nav-label">Power Structure</span>
          </button>
          <button class="culture-nav-btn" data-subsection="semites">
            <span class="nav-icon">🗺️</span>
            <span class="nav-label">Foreigners</span>
          </button>
        </nav>

        <div class="culture-content-area">
          <div id="golden-age-content" class="culture-subsection active">
            ${this.renderGoldenAge()}
          </div>
          <div id="nile-cycle-content" class="culture-subsection">
            ${this.renderNileCycle()}
          </div>
          <div id="power-hierarchy-content" class="culture-subsection">
            ${this.renderPowerHierarchy()}
          </div>
          <div id="semites-content" class="culture-subsection">
            ${this.renderSemites()}
          </div>
        </div>

        <div class="culture-reflection">
          <button class="reflection-toggle">
            ✨ Why Does Egypt's Culture Matter?
          </button>
          <div class="reflection-content" style="display: none;">
            ${this.renderReflectionPrompts()}
          </div>
        </div>
      </div>
    `;
  }

  renderGoldenAge() {
    return `
      <div class="golden-age-container">
        <div class="section-hero">
          <h2>The Middle Kingdom (2040-1782 BCE)</h2>
          <p class="hero-subtitle">Egypt's Golden Age</p>
        </div>

        <div class="content-card annotatable" data-note-target="golden-age-intro">
          <p class="body-text">
            Joseph entered Egypt during its greatest era—a time of centralized power, 
            artistic brilliance, and relative peace. The Middle Kingdom pharaohs had 
            reunified Egypt after the chaos of the First Intermediate Period, establishing 
            strong governance and prosperity.
          </p>
        </div>

        <div class="characteristics-grid">
          <div class="characteristic-card">
            <div class="char-icon">🏛️</div>
            <h3>Strong Central Government</h3>
            <p>Unified administration from Memphis to the delta</p>
          </div>
          <div class="characteristic-card">
            <div class="char-icon">🎨</div>
            <h3>Flourishing Arts</h3>
            <p>Literature, sculpture, and architectural innovation</p>
          </div>
          <div class="characteristic-card">
            <div class="char-icon">⚒️</div>
            <h3>Major Building Projects</h3>
            <p>Pyramids, temples, and irrigation systems</p>
          </div>
          <div class="characteristic-card">
            <div class="char-icon">🌍</div>
            <h3>Open to Foreigners</h3>
            <p>Trade networks and cultural exchange thriving</p>
          </div>
        </div>

        <div class="content-card pharaohs-section">
          <h3>The Pharaohs of Joseph's Era</h3>
          <div class="pharaoh-carousel">
            <div class="pharaoh-card annotatable" data-note-target="senusret-ii">
              <div class="pharaoh-portrait">
                <div class="portrait-placeholder">S II</div>
              </div>
              <h4>Senusret II</h4>
              <p class="reign-dates">1897-1878 BCE</p>
              <ul class="achievements">
                <li>Pyramid at Lahun</li>
                <li>Faiyum irrigation projects</li>
              </ul>
            </div>
            <div class="pharaoh-card annotatable" data-note-target="senusret-iii">
              <div class="pharaoh-portrait">
                <div class="portrait-placeholder">S III</div>
              </div>
              <h4>Senusret III</h4>
              <p class="reign-dates">1878-1839 BCE</p>
              <ul class="achievements">
                <li>Military campaigns to Nubia</li>
                <li>Administrative reforms</li>
              </ul>
            </div>
            <div class="pharaoh-card highlight annotatable" data-note-target="amenemhat-iii">
              <div class="pharaoh-portrait">
                <div class="portrait-placeholder">A III</div>
              </div>
              <h4>Amenemhat III</h4>
              <p class="reign-dates">1860-1814 BCE</p>
              <p class="special-note">⭐ Likely Joseph's Pharaoh</p>
              <ul class="achievements">
                <li>Peak of Middle Kingdom prosperity</li>
                <li>Massive building projects</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4>Why This Era Mattered for Joseph</h4>
          <p>
            Egypt was confident enough to embrace talent from anywhere. This was the 
            PERFECT environment for a foreigner like Joseph to rise—not despite his 
            origins, but because his wisdom transcended ethnicity. God's providence 
            positioned Joseph in a culture ready to receive him.
          </p>
        </div>
      </div>
    `;
  }

  renderNileCycle() {
    return `
      <div class="nile-cycle-container">
        <div class="section-hero">
          <h2>The Nile: Egypt's Lifeline</h2>
          <p class="hero-subtitle">Understanding Joseph's Prophecy</p>
        </div>

        <div class="nile-animation-wrapper">
          <div id="nile-cycle-animation" class="nile-cycle-animation">
            <div class="nile-background"></div>
            <div class="nile-water" id="nile-water"></div>
            <div class="season-label" id="season-label">Akhet (Inundation)</div>
          </div>
        </div>

        <div class="seasons-grid">
          <div class="season-card akhet annotatable" data-note-target="season-akhet">
            <div class="season-icon">💧</div>
            <h3>Akhet (Inundation)</h3>
            <p class="season-months">June - September</p>
            <p class="season-desc">
              The Nile floods, depositing nutrient-rich silt across the floodplain. 
              Farmers wait as the waters recede, revealing fertile soil.
            </p>
          </div>
          <div class="season-card peret annotatable" data-note-target="season-peret">
            <div class="season-icon">🌱</div>
            <h3>Peret (Growing)</h3>
            <p class="season-months">October - February</p>
            <p class="season-desc">
              Planting and cultivation season. Crops grow in the rich soil left 
              by the flood. Irrigation channels distribute water carefully.
            </p>
          </div>
          <div class="season-card shemu annotatable" data-note-target="season-shemu">
            <div class="season-icon">🌾</div>
            <h3>Shemu (Harvest)</h3>
            <p class="season-months">March - May</p>
            <p class="season-desc">
              Reaping crops and storing grain in massive granaries. Tax collectors 
              measure yields. The cycle prepares to begin again.
            </p>
          </div>
        </div>

        <div class="content-card joseph-insight">
          <h3>Joseph's Insight</h3>
          <p>
            When Pharaoh dreamed of seven fat cows and seven lean cows emerging from 
            the Nile (Genesis 41:17-24), he was dreaming Egypt's deepest fear—the 
            Nile failing. Joseph's interpretation wasn't mysticism; it was agricultural 
            wisdom applied to divine revelation.
          </p>
        </div>

        <div class="grain-calculator-card annotatable" data-note-target="grain-calculator">
          <h3>The 20% Solution</h3>
          <p>
            Joseph's plan: Store 20% during abundance (Genesis 41:34). This wasn't 
            arbitrary—it was sophisticated economic forecasting.
          </p>
          <div class="calculator-visual">
            <div class="year-bar">
              <div class="stored-portion" style="width: 20%;">20% Stored</div>
              <div class="consumed-portion" style="width: 80%;">80% Used</div>
            </div>
            <ul class="solution-benefits">
              <li>✓ Build reserves without causing shortage</li>
              <li>✓ Stabilize prices during crisis</li>
              <li>✓ Position Egypt as regional grain supplier</li>
            </ul>
          </div>
        </div>

        <div class="cross-reference">
          <p>📖 Read the full account in <a href="#" class="story-link" data-chapter="41">Genesis 41</a></p>
        </div>
      </div>
    `;
  }

  renderPowerHierarchy() {
    return `
      <div class="power-hierarchy-container">
        <div class="section-hero">
          <h2>Egypt's Administrative Pyramid</h2>
          <p class="hero-subtitle">Joseph's Unprecedented Rise</p>
        </div>

        <div class="pyramid-diagram-wrapper">
          <svg id="power-pyramid" class="power-pyramid" viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
            <!-- Pharaoh Level -->
            <polygon 
              class="pyramid-level level-1" 
              points="200,20 160,80 240,80"
              data-level="pharaoh"
            />
            <text x="200" y="55" class="pyramid-text" text-anchor="middle">PHARAOH</text>
            
            <!-- Vizier Level (Joseph) -->
            <polygon 
              class="pyramid-level level-2 joseph-level" 
              points="160,80 120,140 280,140 240,80"
              data-level="vizier"
            />
            <text x="200" y="110" class="pyramid-text joseph-text" text-anchor="middle">VIZIER</text>
            <text x="200" y="125" class="pyramid-subtext" text-anchor="middle">← Joseph</text>
            
            <!-- Nomarchs Level -->
            <polygon 
              class="pyramid-level level-3" 
              points="120,140 80,200 320,200 280,140"
              data-level="nomarchs"
            />
            <text x="200" y="175" class="pyramid-text" text-anchor="middle">NOMARCHS</text>
            
            <!-- Scribes Level -->
            <polygon 
              class="pyramid-level level-4" 
              points="80,200 40,260 360,260 320,200"
              data-level="scribes"
            />
            <text x="200" y="235" class="pyramid-text" text-anchor="middle">SCRIBES</text>
            
            <!-- Common People Level -->
            <polygon 
              class="pyramid-level level-5" 
              points="40,260 20,320 380,320 360,260"
              data-level="people"
            />
            <text x="200" y="295" class="pyramid-text" text-anchor="middle">COMMON PEOPLE</text>
          </svg>
        </div>

        <div id="pyramid-details" class="pyramid-details">
          <div class="detail-card" data-level="pharaoh">
            <h3>Pharaoh (Per-aa - "Great House")</h3>
            <p><strong>Role:</strong> Divine king with absolute authority</p>
            <p><strong>Population:</strong> 1</p>
            <p>The living embodiment of the god Horus, responsible for maintaining ma'at (cosmic order).</p>
          </div>
          <div class="detail-card active" data-level="vizier">
            <h3>Vizier (Tjaty)</h3>
            <p><strong>Role:</strong> Chief minister, overseer of all Egypt</p>
            <p><strong>Population:</strong> 1 (sometimes 2 for Upper and Lower Egypt)</p>
            <p class="joseph-note">
              <strong>⭐ Joseph held this position</strong><br>
              Responsibilities included: grain distribution, taxation, treasury management, 
              public works, and administration of justice. Second only to Pharaoh.
            </p>
          </div>
          <div class="detail-card" data-level="nomarchs">
            <h3>Nomarchs (Heri-tep-aa)</h3>
            <p><strong>Role:</strong> Provincial governors</p>
            <p><strong>Population:</strong> 42 (one per nome/province)</p>
            <p>Managed local administration, collected taxes, maintained order in their regions.</p>
          </div>
          <div class="detail-card" data-level="scribes">
            <h3>Scribes (Sesh)</h3>
            <p><strong>Role:</strong> Record-keepers and administrators</p>
            <p><strong>Population:</strong> Thousands</p>
            <p>Literate elite who maintained Egypt's complex bureaucracy. Kept detailed records of everything.</p>
          </div>
          <div class="detail-card" data-level="people">
            <h3>Common People</h3>
            <p><strong>Role:</strong> Farmers, artisans, laborers</p>
            <p><strong>Population:</strong> Millions (estimated 1-2 million in Middle Kingdom)</p>
            <p>The foundation of Egyptian society. Their labor sustained the entire civilization.</p>
          </div>
        </div>

        <div class="content-card credentials annotatable" data-note-target="joseph-credentials">
          <h3>Joseph's Credentials</h3>
          <div class="credentials-grid">
            <div class="credential-item">
              <div class="cred-icon">💍</div>
              <p><strong>Pharaoh's Signet Ring</strong><br>Symbol of delegated authority</p>
            </div>
            <div class="credential-item">
              <div class="cred-icon">👔</div>
              <p><strong>Fine Linen Robes</strong><br>Mark of high status</p>
            </div>
            <div class="credential-item">
              <div class="cred-icon">🏅</div>
              <p><strong>Gold Chain</strong><br>Royal honor and recognition</p>
            </div>
            <div class="credential-item">
              <div class="cred-icon">🏛️</div>
              <p><strong>Second Chariot</strong><br>Public display of rank</p>
            </div>
            <div class="credential-item">
              <div class="cred-icon">✍️</div>
              <p><strong>Egyptian Name</strong><br>Zaphenath-Paneah</p>
            </div>
            <div class="credential-item">
              <div class="cred-icon">💑</div>
              <p><strong>Marriage to Asenath</strong><br>Political alliance with priesthood</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4>From Slave to Second</h4>
          <p>
            A foreigner rising to vizier was rare but not impossible. Egypt's meritocracy 
            during the Middle Kingdom valued competence over ethnicity. Still, Joseph's 
            ascent remains extraordinary—and providential. Only God could orchestrate 
            such a journey: from pit to prison to palace.
          </p>
        </div>
      </div>
    `;
  }

  renderSemites() {
    return `
      <div class="semites-container">
        <div class="section-hero">
          <h2>Foreigners in Egypt</h2>
          <p class="hero-subtitle">Joseph as Part of a Pattern</p>
        </div>

        <div class="content-card">
          <p class="body-text">
            Joseph wasn't an anomaly. Archaeological evidence shows Semitic peoples had 
            a long history in Egypt—as traders, servants, officials, and settlers. This 
            context makes Joseph's story more historically credible, not less miraculous.
          </p>
        </div>

        <div class="evidence-grid">
          <div class="evidence-card annotatable" data-note-target="beni-hasan">
            <div class="evidence-header">
              <h3>📜 Beni Hasan Tomb Paintings</h3>
              <p class="evidence-date">c. 1900 BCE</p>
            </div>
            <div class="evidence-image">
              <div class="image-placeholder">
                [Asiatic traders in multi-colored garments]
              </div>
            </div>
            <p class="evidence-desc">
              Famous tomb paintings show 37 Asiatic traders entering Egypt. Notice 
              their distinctive multi-colored garments—echoing Joseph's famous coat. 
              This proves Semites were common visitors and settlers in Egypt during 
              the Middle Kingdom.
            </p>
            <a href="#" class="evidence-link" data-evidence="beni-hasan">View in Evidence Section →</a>
          </div>

          <div class="evidence-card annotatable" data-note-target="brooklyn-papyrus">
            <div class="evidence-header">
              <h3>📜 Brooklyn Papyrus</h3>
              <p class="evidence-date">c. 1740 BCE</p>
            </div>
            <p class="evidence-desc">
              An Egyptian household document listing 77 servants. Remarkably, 48 have 
              Semitic names including:
            </p>
            <ul class="names-list">
              <li><strong>Menahem</strong> - Hebrew name meaning "comforter"</li>
              <li><strong>Issachar</strong> - One of Jacob's sons</li>
              <li><strong>Asher</strong> - Another of Jacob's sons</li>
            </ul>
            <p class="evidence-significance">
              This shows Semites were fully integrated into Egyptian households—not 
              as rare oddities, but as regular members of society.
            </p>
            <a href="#" class="evidence-link" data-evidence="brooklyn-papyrus">View in Evidence Section →</a>
          </div>
        </div>

        <div class="trade-routes-section">
          <h3>Trade Routes: Egypt and Canaan Connected</h3>
          <div class="trade-map-wrapper">
            <div class="trade-map">
              <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                <!-- Simplified trade route map -->
                <rect width="500" height="400" fill="#1a2634"/>
                
                <!-- Egypt -->
                <circle cx="120" cy="280" r="8" fill="#c9a961" class="city-marker"/>
                <text x="120" y="300" class="map-label" text-anchor="middle">Memphis</text>
                
                <!-- Delta -->
                <circle cx="150" cy="240" r="6" fill="#c9a961" class="city-marker"/>
                <text x="150" y="230" class="map-label" text-anchor="middle">Delta</text>
                
                <!-- Canaan -->
                <circle cx="250" cy="180" r="8" fill="#c9a961" class="city-marker"/>
                <text x="250" y="170" class="map-label" text-anchor="middle">Canaan</text>
                
                <!-- Damascus -->
                <circle cx="300" cy="140" r="6" fill="#c9a961" class="city-marker"/>
                <text x="300" y="130" class="map-label" text-anchor="middle">Damascus</text>
                
                <!-- Trade routes -->
                <path d="M 150,240 Q 200,210 250,180" stroke="#8b3a4a" stroke-width="2" fill="none" class="trade-route" stroke-dasharray="5,5"/>
                <path d="M 250,180 L 300,140" stroke="#8b3a4a" stroke-width="2" fill="none" class="trade-route" stroke-dasharray="5,5"/>
                
                <text x="250" y="30" class="map-title" text-anchor="middle">Egypt-Canaan Trade Network</text>
              </svg>
            </div>
          </div>
          <div class="routes-list">
            <div class="route-card">
              <h4>🛤️ Coastal Route</h4>
              <p><strong>From:</strong> Gaza → Memphis</p>
              <p><strong>Goods:</strong> Grain, spices, livestock</p>
            </div>
            <div class="route-card">
              <h4>🛤️ King's Highway</h4>
              <p><strong>From:</strong> Damascus → Red Sea</p>
              <p><strong>Goods:</strong> Incense, metals, textiles</p>
            </div>
          </div>
        </div>

        <div class="content-card conclusion">
          <h3>Joseph's Uniqueness</h3>
          <p>
            While Semites in Egypt wasn't unusual, a Semite becoming <strong>VIZIER</strong> 
            was extraordinary. This shows:
          </p>
          <ol class="conclusion-points">
            <li><strong>God's Sovereign Hand:</strong> Providence orchestrating history</li>
            <li><strong>Joseph's Character:</strong> Exceptional wisdom and integrity</li>
            <li><strong>Egypt's Openness:</strong> Middle Kingdom meritocracy at work</li>
          </ol>
          <p class="final-thought">
            Joseph succeeded not <em>despite</em> being foreign, but because God positioned 
            him in a culture ready to recognize divine wisdom wherever it appeared.
          </p>
        </div>
      </div>
    `;
  }

  renderReflectionPrompts() {
    return `
      <div class="reflection-prompts">
        <h3>Theological Reflection</h3>
        <div class="prompt-card">
          <h4>1. Historical Grounding</h4>
          <p class="prompt-question">
            How does knowing Egypt was a real, advanced civilization affect your view 
            of Joseph's story?
          </p>
          <textarea 
            class="reflection-input" 
            data-prompt="historical-grounding"
            placeholder="Your reflection..."
          ></textarea>
        </div>
        <div class="prompt-card">
          <h4>2. God's Sovereignty</h4>
          <p class="prompt-question">
            What does it mean that God worked through real political structures—not by 
            erasing them, but by positioning Joseph within them?
          </p>
          <textarea 
            class="reflection-input" 
            data-prompt="gods-sovereignty"
            placeholder="Your reflection..."
          ></textarea>
        </div>
        <div class="prompt-card">
          <h4>3. Character Over Ethnicity</h4>
          <p class="prompt-question">
            Joseph succeeded because of integrity and wisdom. How does this challenge 
            modern assumptions about power?
          </p>
          <textarea 
            class="reflection-input" 
            data-prompt="character-ethnicity"
            placeholder="Your reflection..."
          ></textarea>
        </div>
        <div class="prompt-card">
          <h4>4. Preparation Meets Opportunity</h4>
          <p class="prompt-question">
            Joseph's years in Potiphar's house and prison prepared him for this. Where 
            might God be preparing you today for tomorrow's opportunity?
          </p>
          <textarea 
            class="reflection-input" 
            data-prompt="preparation-opportunity"
            placeholder="Your reflection..."
          ></textarea>
        </div>
        <button class="save-reflections-btn">💾 Save Reflections</button>
      </div>
    `;
  }

  attachEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.culture-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subsection = e.currentTarget.dataset.subsection;
        this.switchSubsection(subsection);
      });
    });

    // Pyramid interaction
    document.querySelectorAll('.pyramid-level').forEach(level => {
      level.addEventListener('click', (e) => {
        const levelName = e.currentTarget.dataset.level;
        this.showPyramidDetail(levelName);
      });
    });

    // Reflection toggle
    const reflectionToggle = document.querySelector('.reflection-toggle');
    if (reflectionToggle) {
      reflectionToggle.addEventListener('click', () => {
        const content = document.querySelector('.reflection-content');
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        reflectionToggle.textContent = isHidden 
          ? '▼ Why Does Egypt\'s Culture Matter?' 
          : '✨ Why Does Egypt\'s Culture Matter?';
      });
    }

    // Save reflections
    const saveBtn = document.querySelector('.save-reflections-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveReflections());
    }

    // Cross-section links
    document.querySelectorAll('.story-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const chapter = e.currentTarget.dataset.chapter;
        this.navigateToStory(chapter);
      });
    });

    document.querySelectorAll('.evidence-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const evidence = e.currentTarget.dataset.evidence;
        this.navigateToEvidence(evidence);
      });
    });

    // Annotation system integration
    this.enableAnnotations();
  }

  switchSubsection(subsectionId) {
    // Update nav buttons
    document.querySelectorAll('.culture-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subsection === subsectionId);
    });

    // Update content visibility
    document.querySelectorAll('.culture-subsection').forEach(section => {
      section.classList.toggle('active', section.id === `${subsectionId}-content`);
    });

    this.currentSubsection = subsectionId;

    // Restart animations if needed
    if (subsectionId === 'nile-cycle') {
      this.restartNileAnimation();
    }
  }

  showPyramidDetail(levelName) {
    document.querySelectorAll('.pyramid-details .detail-card').forEach(card => {
      card.classList.toggle('active', card.dataset.level === levelName);
    });

    // Highlight pyramid level
    document.querySelectorAll('.pyramid-level').forEach(level => {
      level.classList.toggle('highlighted', level.dataset.level === levelName);
    });
  }

  initAnimations() {
    this.initNileAnimation();
  }

  initNileAnimation() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded, skipping Nile animation');
      return;
    }

    const water = document.getElementById('nile-water');
    const label = document.getElementById('season-label');
    
    if (!water || !label) return;

    const tl = gsap.timeline({ repeat: -1 });

    // Akhet (Inundation) - High water
    tl.to(water, {
      height: '70%',
      duration: 2,
      ease: 'power2.inOut',
      onStart: () => {
        label.textContent = 'Akhet (Inundation) • June-September';
      }
    });

    // Hold at flood level
    tl.to(water, { duration: 1.5 });

    // Peret (Growing) - Medium water
    tl.to(water, {
      height: '45%',
      duration: 2,
      ease: 'power2.inOut',
      onStart: () => {
        label.textContent = 'Peret (Growing) • October-February';
      }
    });

    // Hold at growing level
    tl.to(water, { duration: 1.5 });

    // Shemu (Harvest) - Low water
    tl.to(water, {
      height: '25%',
      duration: 2,
      ease: 'power2.inOut',
      onStart: () => {
        label.textContent = 'Shemu (Harvest) • March-May';
      }
    });

    // Hold at harvest level
    tl.to(water, { duration: 1.5 });

    this.animations.nileCycle = tl;
  }

  restartNileAnimation() {
    if (this.animations.nileCycle) {
      this.animations.nileCycle.restart();
    }
  }

  enableAnnotations() {
    // Integrate with existing annotation system if available
    if (typeof window.createNote === 'function') {
      document.querySelectorAll('.annotatable').forEach(element => {
        element.addEventListener('click', (e) => {
          if (e.ctrlKey || e.metaKey) {
            const noteTarget = element.dataset.noteTarget;
            window.createNote('culture', noteTarget);
          }
        });
      });
    }
  }

  saveReflections() {
    const reflections = {};
    document.querySelectorAll('.reflection-input').forEach(input => {
      const prompt = input.dataset.prompt;
      reflections[prompt] = input.value;
    });

    // Save to localStorage
    const author = localStorage.getItem('currentAuthor') || 'Trevor';
    const key = `culture-reflections-${author}`;
    localStorage.setItem(key, JSON.stringify(reflections));

    // Visual feedback
    const btn = document.querySelector('.save-reflections-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Saved!';
    btn.classList.add('saved');
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('saved');
    }, 2000);
  }

  navigateToStory(chapter) {
    // Save return point
    localStorage.setItem('returnTo', 'culture-explorer');
    
    // Navigate to Story section
    if (typeof window.showSection === 'function') {
      window.showSection('story');
      // Scroll to specific chapter if function exists
      if (typeof window.navigateToChapter === 'function') {
        window.navigateToChapter(parseInt(chapter));
      }
    }
  }

  navigateToEvidence(evidenceId) {
    // Save return point
    localStorage.setItem('returnTo', 'culture-explorer');
    
    // Navigate to Evidence section
    if (typeof window.showSection === 'function') {
      window.showSection('world');
      // Switch to evidence subsection
      if (typeof window.switchWorldTab === 'function') {
        window.switchWorldTab('evidence');
      }
    }
  }

  getFallbackData() {
    return {
      id: 2,
      title: "The Culture",
      subsections: []
    };
  }
}

// Initialize Culture Explorer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cultureExplorer = new CultureExplorer();
    // Don't auto-init; wait for World section to be shown
  });
} else {
  window.cultureExplorer = new CultureExplorer();
}
