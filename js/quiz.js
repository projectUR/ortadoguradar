/* =========================================
   Orta Doğu Radar - Quiz Game Logic
   ========================================= */

const QSTATE = {
    allCharacters: [],
    targetChar: null,
    guessesCount: 0,
    maxGuesses: 6,
    gameOver: false,
    suggestionsOpen: false
};

const QDOM = {
    btnQuiz: document.getElementById('btn-quiz'),
    secQuiz: document.getElementById('quizContainer'),
    secFeed: document.getElementById('feedContainer'),
    secMap: document.getElementById('mapContainer'),
    btnFeed: document.getElementById('btn-feed'),
    btnMap: document.getElementById('btn-map'),

    searchInput: document.getElementById('quizSearchInput'),
    suggestions: document.getElementById('quizSuggestions'),
    guessesList: document.getElementById('quizGuesses'),
    attemptDots: document.getElementById('attemptDots'),
    attemptsText: document.getElementById('quiz-attempts'),
    tableHeader: document.getElementById('quizTableHeader'),

    modal: document.getElementById('quizModal'),
    modalTitle: document.getElementById('quizResultTitle'),
    modalMsg: document.getElementById('quizResultMessage'),
    btnRestart: document.getElementById('btnRestartQuiz')
};

// =========================================
// INIT
// =========================================
async function initQuiz() {
    await fetchCharacters();
    setupQuizUI();
    setupQuizListeners();
    startNewGame();
}

async function fetchCharacters() {
    try {
        const response = await fetch('data/characters.json');
        QSTATE.allCharacters = await response.json();
    } catch (err) {
        console.error("Karakterler yüklenemedi:", err);
    }
}

function setupQuizUI() {
    // Generate Attempt Dots
    QDOM.attemptDots.innerHTML = '';
    for (let i = 0; i < QSTATE.maxGuesses; i++) {
        QDOM.attemptDots.innerHTML += `<div class="attempt-dot"></div>`;
    }
}

function startNewGame() {
    // Reset State
    QSTATE.guessesCount = 0;
    QSTATE.gameOver = false;
    QSTATE.targetChar = selectRandomTarget();
    QDOM.searchInput.value = '';
    QDOM.searchInput.disabled = false;
    QDOM.guessesList.innerHTML = '';
    QDOM.tableHeader.classList.add('hidden');
    QDOM.modal.classList.add('hidden');
    updateAttemptsUI();
    
    // (Geliştirme aşaması için konsola hile yazdırıyoruz)
    console.log("Hedef karakter (Hile):", QSTATE.targetChar.name);
}

function selectRandomTarget() {
    const chars = QSTATE.allCharacters;
    return chars[Math.floor(Math.random() * chars.length)];
}

// =========================================
// LISTENERS & VIEW TOGGLE (Integration)
// =========================================
function setupQuizListeners() {
    QDOM.btnQuiz.addEventListener('click', () => {
            // Deactivate others
    QDOM.btnFeed.classList.remove('active');
    QDOM.btnMap.classList.remove('active');
    QDOM.btnQuiz.classList.add('active');

    // Layout handling
    const mainApp = document.querySelector('.app-main');
    const sidebar = document.querySelector('.sidebar-right');
    
    mainApp.classList.remove('map-active'); 
    
    QDOM.secFeed.classList.add('hidden');
    QDOM.secMap.classList.add('hidden');
    if(sidebar) sidebar.classList.add('hidden'); // hide sidebar for quiz
    QDOM.secQuiz.classList.remove('hidden');

    // Span full width
    QDOM.secQuiz.style.gridColumn = "1 / -1"; 
});
    QDOM.btnFeed.addEventListener('click', () => {
        QDOM.secQuiz.classList.add('hidden');
        QDOM.secFeed.classList.remove('hidden');
        QDOM.btnQuiz.classList.remove('active');
        
        const sidebar = document.querySelector('.sidebar-right');
        if(sidebar) sidebar.classList.remove('hidden');

        // Let app.js handle the rest of its layout if fn exists
        if(typeof window.switchView === 'function') {
            window.switchView('feed');
        }
    });

    QDOM.btnMap.addEventListener('click', () => {
        QDOM.secQuiz.classList.add('hidden');
        QDOM.btnQuiz.classList.remove('active');
        
        const sidebar = document.querySelector('.sidebar-right');
        if(sidebar) sidebar.classList.remove('hidden');

        // Most important: let app.js trigger the Leaflet map resize and grid adjustments
        if(typeof window.switchView === 'function') {
            window.switchView('map');
        }
    });


// Game Inputs
QDOM.searchInput.addEventListener('input', handleSearchInput);
QDOM.searchInput.addEventListener('click', handleSearchInput); 

document.addEventListener('click', (e) => {
    // Close suggestions if clicked outside
    if (!e.target.closest('.quiz-search-area')) {
        hideSuggestions();
    }
});


    // Game Inputs
    QDOM.searchInput.addEventListener('input', handleSearchInput);
    QDOM.searchInput.addEventListener('click', handleSearchInput); 
    
    document.addEventListener('click', (e) => {
        // Close suggestions if clicked outside
        if (!e.target.closest('.quiz-search-area')) {
            hideSuggestions();
        }
    });

    QDOM.btnRestart.addEventListener('click', startNewGame);
}

// =========================================
// SEARCH & AUTOCOMPLETE
// =========================================
function handleSearchInput(e) {
    if (QSTATE.gameOver) return;

    const query = e.target.value.toLowerCase().replace(/i̇/g, 'i').replace(/ı/g, 'i').trim();
    
    if (query.length === 0) {
        // Show all characters as options if they click empty input
        renderSuggestions(QSTATE.allCharacters);
        return;
    }

    const filtered = QSTATE.allCharacters.filter(c => 
        c.name.toLowerCase().replace(/i̇/g, 'i').replace(/ı/g, 'i').includes(query)
    );

    renderSuggestions(filtered);
}

function renderSuggestions(list) {
    if (list.length === 0) {
        hideSuggestions();
        return;
    }

    QDOM.suggestions.innerHTML = '';
    
    // Sort alphabetically
    const sorted = [...list].sort((a,b) => a.name.localeCompare(b.name));

    sorted.forEach(char => {
        const li = document.createElement('li');
        li.textContent = char.name;
        li.addEventListener('click', () => handleGuess(char));
        QDOM.suggestions.appendChild(li);
    });

    QDOM.suggestions.classList.remove('hidden');
    QSTATE.suggestionsOpen = true;
}

function hideSuggestions() {
    QDOM.suggestions.classList.add('hidden');
    QSTATE.suggestionsOpen = false;
}

// =========================================
// GAME MECHANICS
// =========================================
function handleGuess(guessedChar) {
    hideSuggestions();
    QDOM.searchInput.value = '';
    QDOM.searchInput.focus();

    if (QSTATE.gameOver) return;

    // Reveal table header on first guess
    if (QSTATE.guessesCount === 0) {
        QDOM.tableHeader.classList.remove('hidden');
    }

    QSTATE.guessesCount++;
    const target = QSTATE.targetChar;
    const isWin = (guessedChar.id === target.id);

        // Compare Attributes
    const natMatch = (guessedChar.nationality === target.nationality);
    const roleMatch = (guessedChar.role === target.role);
    const statusMatch = (guessedChar.status === target.status);

    renderGuessRow(guessedChar, [
        { val: guessedChar.name, valid: isWin },
        { val: guessedChar.nationality, valid: natMatch },
        { val: guessedChar.role, valid: roleMatch },
        { val: guessedChar.status, valid: statusMatch }
    ]);


    updateAttemptsUI();

    if (isWin) {
        endGame(true);
    } else if (QSTATE.guessesCount >= QSTATE.maxGuesses) {
        endGame(false);
    }
}

function renderGuessRow(char, attributes) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    attributes.forEach((attr, idx) => {
        const box = document.createElement('div');
        box.className = 'guess-box';
        // Add animation delay for stagger effect
        box.style.animationDelay = `${idx * 0.15}s`;
        
        box.textContent = attr.val;
        
        // Give time for animation to start, then apply color
        setTimeout(() => {
            if (attr.valid) {
                box.classList.add('correct');
            } else {
                box.classList.add('wrong');
            }
        }, idx * 150 + 100);

        row.appendChild(box);
    });

    // Add to top of list
    QDOM.guessesList.insertBefore(row, QDOM.guessesList.firstChild);
}

function updateAttemptsUI() {
    QDOM.attemptsText.textContent = `Kalan Hak: ${QSTATE.maxGuesses - QSTATE.guessesCount}`;

    const dots = Array.from(QDOM.attemptDots.children);
    dots.forEach((dot, index) => {
        if (index < QSTATE.guessesCount) {
            dot.classList.add('used');
        } else {
            dot.classList.remove('used');
        }
    });
}

function endGame(isWin) {
    QSTATE.gameOver = true;
    QDOM.searchInput.disabled = true;

    setTimeout(() => {
        QDOM.modal.classList.remove('hidden');
        
        // Karakterin bilgilerini JSON'dan çekiyoruz
        const target = QSTATE.targetChar;
        const profile = target.profile;

        // Başlık kısmı (Kazandı/Kaybetti rengi)
        if (isWin) {
            QDOM.modalTitle.textContent = "HEDEF TESPİT EDİLDİ!";
            QDOM.modalTitle.style.color = "var(--accent-green)";
        } else {
            QDOM.modalTitle.textContent = "GÖREV BAŞARISIZ";
            QDOM.modalTitle.style.color = "var(--accent-red)";
        }

        // İstihbarat Dosyası (Radar Profili) HTML Yapısı
        // NOT: CSS'e ekstra kod eklememek için style takılarını satır içine (inline) yazdım.
        const dossierHTML = `
            <div style="text-align: left; margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;">
                <h3 style="margin: 0 0 5px 0; color: var(--text-primary); font-size: 1.2rem;">${target.name}</h3>
                <span style="display: inline-block; background: #2a2a2a; color: #aaa; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; margin-bottom: 10px;">${target.nationality} | ${target.role}</span>
                
                <p style="font-size: 0.9rem; color: #ccc; font-style: italic; margin-bottom: 15px;">
                    "${profile.bio_summary}"
                </p>

                <div style="background: rgba(30, 60, 114, 0.2); border-left: 3px solid #1e3c72; padding: 10px; margin-bottom: 15px; border-radius: 0 4px 4px 0;">
                    <strong style="color: #64b5f6; font-size: 0.85rem; display: block; margin-bottom: 5px;"><i class="fa-solid fa-satellite-dish"></i> RADAR ANALİZİ</strong>
                    <span style="font-size: 0.85rem; color: #ddd;">${profile.regional_impact}</span>
                </div>

                <div style="background: rgba(255, 193, 7, 0.1); border: 1px dashed #ffc107; padding: 10px; border-radius: 4px;">
                    <strong style="color: #ffc107; font-size: 0.85rem; display: block; margin-bottom: 5px;"><i class="fa-solid fa-lightbulb"></i> GİZLİ DOSYA</strong>
                    <span style="font-size: 0.85rem; color: #eee;">${profile.trivia}</span>
                </div>
            </div>
        `;

        // Yeni tasarımı modala basıyoruz
        QDOM.modalMsg.innerHTML = dossierHTML;
        
        // Modalın genişliğini içeriğe göre biraz büyütelim ki şık dursun
        const modalContent = document.querySelector('.quiz-modal-content');
        if(modalContent) {
            modalContent.style.maxWidth = '450px';
            modalContent.style.width = '90%';
        }

    }, 1500); // Wait for boxes to animate
}

// Bootstrap
document.addEventListener('DOMContentLoaded', initQuiz);
// Operasyon Merkezi Seçim Mantığı
document.addEventListener('click', function(e) {
    // "Gizli Figür" kartına tıklandı mı kontrol et
    const card = e.target.closest('#startGuessGame');
    
    if (card) {
        const menu = document.getElementById('quizMenu');
        const game = document.getElementById('actualGuessGame');
        
        if (menu && game) {
            menu.classList.add('hidden');    // Menüyü sakla
            game.classList.remove('hidden'); // Oyunu göster
            
            // Eğer oyun başlatma fonksiyonu varsa çalıştır
            if (typeof startNewGame === "function") {
                startNewGame();
            }
        }
    }
});
