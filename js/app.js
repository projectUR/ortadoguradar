// --- FIREBASE BAĞLANTI AYARLARI ---
const firebaseConfig = {
  apiKey: "AIzaSyDPYn1ozHB8kmP1QitOYjLzbJluAl08iwc",
  authDomain: "ortadoguradar.firebaseapp.com",
  projectId: "ortadoguradar",
  storageBucket: "ortadoguradar.firebasestorage.app",
  messagingSenderId: "274247395533",
  appId: "1:274247395533:web:ab475926090432803a6184",
  measurementId: "G-F6MTDXE43K"
};

// Firebase'i Başlat
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore(); // Bulut Veritabanı hazır

/* =========================================
   Orta Doğu Radar - Main App Logic
   ========================================= */

// State Management
const STATE = {
    news: [],
    filteredNews: [],
    categories: ['Tümü', 'Diplomatik', 'Ekonomik', 'Çatışma ve Güvenlik', 'Toplum ve İnsan Hakları', 'Enerji ve Altyapı', 'Çevre ve İklim'],
    activeCategory: 'Tümü',
    searchQuery: '',
    viewConfig: 'feed', // 'feed' or 'map'
    activeCountry: ''
};

// DOM Elements
const DOM = {
    logo: document.querySelector('.logo'),
    feedContainer: document.getElementById('newsFeed'),
    trendList: document.getElementById('trendList'),
    categoryList: document.getElementById('categoryList'),
    searchInput: document.getElementById('searchInput'),
    btnFeed: document.getElementById('btn-feed'),
    btnMap: document.getElementById('btn-map'),
    secFeed: document.getElementById('feedContainer'),
    secMap: document.getElementById('mapContainer'),
    btnShowCountries: document.getElementById('btnShowCountries'),
    countryList: document.getElementById('countryList'),
    btnCloseCountries: document.getElementById('btnCloseCountries'),
    categoriesTitleText: document.getElementById('categoriesTitleText')
};

// Middle East Countries
const MIDDLE_EAST_COUNTRIES = [
    "TÜRKİYE", "SURİYE", "LÜBNAN", "FİLİSTİN", "İSRAİL", "ÜRDÜN", 
    "IRAK", "İRAN", "KUVEYT", "KATAR", "BAE", "UMMAN", "YEMEN", 
    "SUUDİ ARABİSTAN", "AFGANİSTAN", "PAKİSTAN"
];

// Icons Mapping for Categories
const CAT_ICONS = {
    'Diplomatik': 'fa-handshake',
    'Ekonomik': 'fa-chart-line',
    'Çatışma ve Güvenlik': 'fa-shield-halved',
    'Toplum ve İnsan Hakları': 'fa-users',
    'Enerji ve Altyapı': 'fa-bolt',
    'Çevre ve İklim': 'fa-leaf',
    'Tümü': 'fa-layer-group'
};

// =========================================
// INIT & FETCH DATA
// =========================================
async function initApp() {
    setupEventListeners();
    await fetchNewsData();
    updateUI();
}

async function fetchNewsData() {
    try {
        const response = await fetch('data/mock_news.json');
        let data = await response.json();

        // --- 48 SAAT FİLTRESİ BAŞLANGICI ---
        const now = new Date();
        const limit = 48 * 60 * 60 * 1000; // 48 saat (ms cinsinden)

        data = data.filter(item => {
            const newsDate = new Date(item.timestamp);
            return (now - newsDate) <= limit; 
        });
        // --- 48 SAAT FİLTRESİ SONU ---

        // Yeniden eskiye sırala
        data = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // En yeni 2 habere "Son Dakika" etiketi ver
        data = data.map((item, index) => {
            item.isBreaking = (index < 2);
            return item;
        });

        STATE.news = data;
        STATE.filteredNews = [...data];

    } catch (err) {
        console.error("Haberler çekilirken bir hata oluştu:", err);
    }
}

// =========================================
// UI RENDERERS
// =========================================
function updateUI() {
    renderNewsCards();
    renderTrends();
    renderCategories(); // updates counts
    renderCountries();

    // If Map is initialize-able (and window.initMap is in scope from map.js)
    if (typeof window.initMap === 'function') {
        window.initMap(STATE.filteredNews);
    }
}

function renderNewsCards() {
    DOM.feedContainer.innerHTML = '';

    if (STATE.filteredNews.length === 0) {
        DOM.feedContainer.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-secondary);">Aradığınız kriterlere uygun haber bulunamadı.</div>`;
        return;
    }

    STATE.filteredNews.forEach(item => {
        const timeAgo = formatTimeAgo(new Date(item.timestamp));
        const catIcon = CAT_ICONS[item.category] || 'fa-tag';

        const cardClass = item.isBreaking ? 'news-card breaking' : 'news-card';
        const breakingBadge = item.isBreaking ? `<span class="breaking-tag"><i class="fa-solid fa-bolt"></i> Son Dakika</span>` : '';
        const imageHTML = (item.imageUrl && item.imageUrl.includes('pexels')) ? `<img src="${item.imageUrl}" alt="Haber Görseli" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0; display: block; border-bottom: 1px solid #333;">` : '';
        
        // DİKKAT: Etkileşim (beğeni, yorum, alıntı) butonları tamamen temizlendi
        const cardHTML = `
            <article class="${cardClass}">
                ${imageHTML}
                <div class="card-header">
                    <div class="card-meta-left">
                        ${breakingBadge}
                        <span class="category-tag"><i class="fa-solid ${catIcon}"></i> ${item.category}</span>
                    </div>
                    <div class="card-time"><i class="fa-regular fa-clock"></i> ${timeAgo}</div>
                </div>
                
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                </div>
                <div class="card-footer">
                    <a href="${item.source}" target="_blank" class="source-link" rel="nofollow">
                        <i class="fa-solid fa-link"></i> Kaynak Taramasını Gör
                    </a>
                    <div class="card-actions">
                        <button class="action-btn" title="Yerini Göster (Rasathane)"
                        onclick="if(window.focusMapOnItem) window.focusMapOnItem('${item.id}')"><i class="fa-solid fa-location-dot"></i></button>
                        
                        <!-- YENİ EKLENEN PAYLAŞ BUTONU -->
                        <button class="action-btn" title="Haberi Paylaş" onclick="shareNews('${item.id}')"><i class="fa-solid fa-share-nodes"></i></button>
                    </div>
                </div>
                </div>
            </article>
        `;
        DOM.feedContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function renderTrends() {
    DOM.trendList.innerHTML = '';

    // Sort by trend score, get top 5
    const topTrends = [...STATE.news]
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, 5);

    topTrends.forEach((item, index) => {
        const timeStr = formatTimeAgo(new Date(item.timestamp));
        const elementHTML = `
            <li class="trend-item" data-id="${item.id}">
                <div class="trend-meta">
                    <span>#${index + 1} • Gündem</span>
                    <span>${timeStr}</span>
                </div>
                <div class="trend-title">${item.title}</div>
            </li>
        `;
        DOM.trendList.insertAdjacentHTML('beforeend', elementHTML);
    });
}

function renderCategories() {
    const listItems = Array.from(DOM.categoryList.querySelectorAll('li'));
    listItems.forEach(li => {
        const cat = li.getAttribute('data-cat');

        // Update counts (only if not 'Tümü')
        const badge = li.querySelector('.badge');
        if (badge && cat !== 'Tümü' && badge.tagName) {
            const count = STATE.news.filter(n => n.category === cat).length;
            badge.textContent = count > 0 ? count : '';
        }
    });
}

function renderCountries() {
    if (!DOM.countryList) return;
    
    let listHTML = `<li class="${STATE.activeCountry === '' ? 'active' : ''}" data-country="">Tümü (Orta Doğu)</li>`;
    const trLower = (s) => s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
    
    MIDDLE_EAST_COUNTRIES.forEach(country => {
        const isActive = (STATE.activeCountry === country) ? 'active' : '';
        const countryQ = trLower(country);
        
        const count = STATE.news.filter(n => {
            const title = trLower(n.title || '');
            const summary = trLower(n.summary || '');
            const cat = trLower(n.category || '');
            return title.includes(countryQ) || summary.includes(countryQ) || cat.includes(countryQ);
        }).length;
        
        listHTML += `<li class="${isActive}" data-country="${country}">${country} <span class="badge">${count > 0 ? count : ''}</span></li>`;
    });
    
    DOM.countryList.innerHTML = listHTML;
}

// =========================================
// EVENT LISTENERS & FILTERING
// =========================================

function setupEventListeners() {

   // Logo Click (Akışı Tazele ve Üste Çık)
  // Logo Click (Akışı Tazele ve Üste Çık)
    const siteLogoBtn = document.getElementById('siteLogo') || DOM.logo;
    siteLogoBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Logonun link özelliğini ezip sayfa yenilemesini durdurur

        DOM.feedContainer.innerHTML = `<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i> Akış Yenileniyor...</div>`;
        STATE.activeCategory = 'Tümü';
        STATE.searchQuery = '';
        DOM.searchInput.value = '';
        await fetchNewsData();
        updateUI(); 
        switchView('feed');
        
        // --- EKLENEN KISIM: TV VE DİĞER EKRANLARI ZORLA GİZLE ---
        document.getElementById('tvContainer')?.classList.add('hidden');
        document.getElementById('arsenalContainer')?.classList.add('hidden');
        document.getElementById('quizContainer')?.classList.add('hidden');
        
        // Sağ barı (Kategoriler) görünür yap
        document.querySelector('.sidebar-right')?.classList.remove('hidden');

        // Menüdeki buton renklerini sıfırla ve "Akış" butonunu aktif yap
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-feed')?.classList.add('active');
        // --------------------------------------------------------

        document.querySelector('.feed-container').scrollTop = 0;
    });
    // Category Clicks
    DOM.categoryList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        if (li.id === 'btnShowCountries') {
            DOM.categoryList.classList.add('hidden');
            DOM.countryList.classList.remove('hidden');
            DOM.categoriesTitleText.innerHTML = 'Ülkeler';
            DOM.btnCloseCountries.classList.remove('hidden');
            STATE.activeCategory = 'Tümü';
            renderCategories();
            applyFilters();
            return;
        }

        STATE.activeCategory = li.getAttribute('data-cat');
        applyFilters();
    });

    // Close Countries List
    if (DOM.btnCloseCountries) {
        DOM.btnCloseCountries.addEventListener('click', () => {
            DOM.countryList.classList.add('hidden');
            DOM.categoryList.classList.remove('hidden');
            DOM.categoriesTitleText.innerHTML = '<i class="fa-solid fa-layer-group"></i> Kategoriler';
            DOM.btnCloseCountries.classList.add('hidden');
            
            STATE.activeCountry = '';
            applyFilters();
        });
    }

    // Country Clicks
    if (DOM.countryList) {
        DOM.countryList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            STATE.activeCountry = li.getAttribute('data-country') || '';
            renderCountries();
            applyFilters();
        });
    }

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
        STATE.searchQuery = e.target.value;
        applyFilters();
    });

    // View Toggles (Feed vs Map)
    DOM.btnFeed.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        DOM.btnFeed.classList.add('active');
        switchView('feed');
        renderNewsCards();
    });

    DOM.btnMap.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        DOM.btnMap.classList.add('active');
        switchView('map');
        renderNewsCards();
    });
}

function applyFilters() {
    let result = [...STATE.news];

    // Filter by Category
    if (STATE.activeCategory !== 'Tümü' && STATE.activeCategory !== null) {
        result = result.filter(n => n.category === STATE.activeCategory);
    }

    // Filter by Country
    if (STATE.activeCountry !== '') {
        const trLower = (s) => s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
        const countryQ = trLower(STATE.activeCountry);

        result = result.filter(n => {
            const title = trLower(n.title || '');
            const summary = trLower(n.summary || '');
            const cat = trLower(n.category || '');
            return title.includes(countryQ) || summary.includes(countryQ) || cat.includes(countryQ);
        });
    }

    // Filter by Search (GELİŞMİŞ TÜRKÇE VE "İ" DESTEĞİ)
    if (STATE.searchQuery.trim() !== '') {
        const trLower = (str) => {
            if (!str) return '';
            return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().trim();
        };
        const q = trLower(STATE.searchQuery);
        
        result = result.filter(n => {
            const title = trLower(n.title);
            const summary = trLower(n.summary);
            return title.includes(q) || summary.includes(q);
        });
    }
    STATE.filteredNews = result;
    updateUI();
}

function switchView(view) {
    STATE.viewConfig = view;
    const mainApp = document.querySelector('.app-main');
    const feedSec = document.getElementById('feedContainer');
    const mapSec = document.getElementById('mapContainer');
    const btnFeed = document.getElementById('btn-feed');
    const btnMap = document.getElementById('btn-map');

    if (view === 'map') {
        btnFeed.classList.remove('active');
        btnMap.classList.add('active');
        mainApp.classList.add('map-active');
        mapSec.classList.remove('hidden');
        feedSec.style.gridColumn = "2"; 
        feedSec.classList.remove('hidden');

        if (typeof window.invalidateMapSize === 'function') {
            window.invalidateMapSize();
        }
    } else {
        btnMap.classList.remove('active');
        btnFeed.classList.add('active');
        mainApp.classList.remove('map-active');
        mapSec.classList.add('hidden');
        feedSec.style.gridColumn = "1";
    }
}

// =========================================
// HELPERS
// =========================================
function formatTimeAgo(date) {
    const diff = Math.floor((new Date() - date) / 1000); // in seconds
    if (diff < 60) return `${diff} sn`;

    const min = Math.floor(diff / 60);
    if (min < 60) return `${min} dk`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} sa`;

    return `${Math.floor(hr / 24)} g`;
}

// =========================================
// MULTI-LANGUAGE (Google Translate)
// =========================================
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'tr',
        includedLanguages: 'tr,en,ar',
        autoDisplay: false
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('languageSelect');
    
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const targetLang = e.target.value;
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
                selectElement.value = targetLang;
                selectElement.dispatchEvent(new Event('change'));
            }
        });
    }
});

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);

// =========================================
// ENVANTER (ARSENAL) SAYFASI MANTIĞI
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const btnArsenal = document.getElementById('btn-arsenal');
    const secArsenal = document.getElementById('arsenalContainer');
    const secFeed = document.getElementById('feedContainer');
    const secMap = document.getElementById('mapContainer');
    const secQuiz = document.getElementById('quizContainer');
    const btnFeed = document.getElementById('btn-feed');
    const btnMap = document.getElementById('btn-map');
    const btnQuiz = document.getElementById('btn-quiz');
    const mainApp = document.querySelector('.app-main');
    const sidebar = document.querySelector('.sidebar-right');

    if(btnArsenal) {
        btnArsenal.addEventListener('click', () => {
            btnFeed.classList.remove('active');
            btnMap.classList.remove('active');
            if(btnQuiz) btnQuiz.classList.remove('active');
            btnArsenal.classList.add('active');

            secFeed.classList.add('hidden');
            secMap.classList.add('hidden');
            if(secQuiz) secQuiz.classList.add('hidden');
            if(sidebar) sidebar.classList.add('hidden');
            mainApp.classList.remove('map-active');

            secArsenal.classList.remove('hidden');
        });
    }

    const hideArsenal = () => {
        if(secArsenal) secArsenal.classList.add('hidden');
        if(btnArsenal) btnArsenal.classList.remove('active');
    };

    if(btnFeed) btnFeed.addEventListener('click', hideArsenal);
    if(btnMap) btnMap.addEventListener('click', hideArsenal);
    if(btnQuiz) btnQuiz.addEventListener('click', hideArsenal);
});

// =========================================
// ASKERİ ENVANTER (ARSENAL) VERİ İŞLEMLERİ
// =========================================
let arsenalData = [];

async function loadArsenal() {
    try {
        const response = await fetch('data/arsenal.json');
        arsenalData = await response.json();
        renderArsenal('Tümü'); // İlk açılışta hepsini göster
    } catch (err) {
        console.error("Envanter yüklenemedi:", err);
    }
}

function renderArsenal(filterCountry) {
    const grid = document.getElementById('arsenalGrid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Önceki kartları temizle

    const filtered = filterCountry === 'Tümü' 
        ? arsenalData 
        : arsenalData.filter(w => w.country === filterCountry);

    filtered.forEach(weapon => {
        const cardHTML = `
            <div style="background: #1e1e1e; border: 1px solid #333; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
                <div style="height: 180px; overflow: hidden; background: #000; position: relative;">
                    <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; border: 1px solid #555;">${weapon.country}</span>
                    <img src="${weapon.image}" alt="${weapon.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;">
                </div>
                <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
                    <h3 style="color: var(--accent-blue); margin: 0 0 5px 0; font-size: 1.3rem;">${weapon.name}</h3>
                    <span style="color: #aaa; font-size: 0.85rem; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 8px; display: block;"><i class="fa-solid fa-tag"></i> ${weapon.type}</span>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 0.85rem;">
                        <div><strong style="color: #ddd;">Maliyet:</strong> <br><span style="color: #999;">${weapon.cost}</span></div>
                        <div><strong style="color: #ddd;">Menzil:</strong> <br><span style="color: #999;">${weapon.range}</span></div>
                    </div>
                    
                    <div style="background: rgba(30, 60, 114, 0.2); border-left: 3px solid #1e3c72; padding: 10px; margin-bottom: 10px; font-size: 0.85rem;">
                        <strong style="color: #64b5f6; display: block; margin-bottom: 4px;"><i class="fa-solid fa-satellite-dish"></i> Radar Analizi</strong>
                        <span style="color: #ccc;">${weapon.radar_analysis}</span>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: #888; margin-top: auto;">
                        <strong><i class="fa-solid fa-fire"></i> Kullanıldığı Çatışmalar:</strong> ${weapon.conflicts}
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadArsenal(); 
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#2a2a2a';
                b.style.border = '1px solid #444';
            });
            e.target.classList.add('active');
            e.target.style.background = 'var(--accent-blue)';
            e.target.style.border = 'none';
            
            const country = e.target.getAttribute('data-country');
            renderArsenal(country);
        });
    });
});

// --- GİRİŞ/KAYIT SİSTEMİ (TEMEL KİMLİK DOĞRULAMA İÇİN BIRAKILDI) ---

let isLoginMode = true;
const btnSwitch = document.getElementById('btnSwitchAuth');
const authTitle = document.getElementById('authTitle');
const authPrimaryBtn = document.getElementById('authPrimaryBtn');
const authSwitchText = document.getElementById('authSwitchText');

window.openAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
};

if (btnSwitch) {
    btnSwitch.onclick = function() {
        isLoginMode = !isLoginMode;
        if (!isLoginMode) {
            authTitle.innerText = "Radar'a Kayıt Ol";
            authPrimaryBtn.innerText = "Kayıt Ol";
            authSwitchText.innerText = "Zaten hesabın var mı?";
            btnSwitch.innerText = "Giriş Yap";
        } else {
            authTitle.innerText = "Radar'a Katıl";
            authPrimaryBtn.innerText = "Giriş Yap";
            authSwitchText.innerText = "Hesabın yok mu?";
            btnSwitch.innerText = "Kayıt Ol";
        }
    };
}

if (authPrimaryBtn) {
    authPrimaryBtn.onclick = async function() {
        const username = document.getElementById('authUsername').value.trim().toLowerCase();
        const password = document.getElementById('authPassword').value.trim();

        if (username === "" || password === "") {
            alert("Alanları boş bırakma kral!");
            return;
        }

        const userRef = db.collection("users").doc(username);

        try {
            if (!isLoginMode) {
                const doc = await userRef.get();
                if (doc.exists) {
                    alert("Bu kullanıcı adı alınmış, başka bir tane dene.");
                } else {
                    await userRef.set({
                        username: username,
                        password: password,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    alert(`Hoş geldin ${username}!`);
                    loginUser(username);
                }
            } else {
                const doc = await userRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.password === password) {
                        alert(`Tekrar hoş geldin, ${username}!`);
                        loginUser(username);
                    } else {
                        alert("Şifre hatalı!");
                    }
                } else {
                    alert("Kullanıcı bulunamadı. Önce kayıt olmalısın.");
                }
            }
        } catch (error) {
            console.error("Giriş hatası:", error);
            alert("Sistemde bir sorun oluştu, tekrar dene.");
        }
    };
}

function loginUser(username) {
    localStorage.setItem('currentUser', username);
    closeAuthModal();
    const loginBtn = document.getElementById('btn-login-trigger');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span>${username}</span>`;
        loginBtn.onclick = null; 
    }
}

window.addEventListener('load', () => {
    const savedSession = localStorage.getItem('currentUser');
    if (savedSession) {
        loginUser(savedSession);
    }
});

// --- BÜLTEN AÇMA/KAPATMA MOTORU ---
window.openNewsletterModal = function() {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

window.closeNewsletterModal = function() {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

/* --- RADAR ASİSTAN MASTER AI PAKETİ --- */

const k1 = "AIzaSyBr"; 
const k2 = "27n23NtYhKW7G"; 
const k3 = "eWbe3yrl2FqrpDeGA0"; 
const GEMINI_API_KEY = (k1 + k2 + k3).trim();

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatMsgs = document.getElementById('chat-messages');
    if (!input || !chatMsgs) return;

    const msg = input.value.trim();
    if (msg === "" || input.disabled) return;

    chatMsgs.innerHTML += `<div style="background: #3498db; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; align-self: flex-end; max-width: 80%; font-size: 14px; margin-left: auto; margin-bottom: 10px;">${msg}</div>`;
    input.value = "";
    input.disabled = true;

    const loadingId = 'loading-' + Date.now();
    chatMsgs.innerHTML += `<div id="${loadingId}" class="bot-msg" style="background: #252525; color: #aaa; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; border-left: 3px solid #3498db; margin-bottom: 10px; font-style: italic;">Radar verileri taranıyor...</div>`;
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

 try {
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Sen Orta Doğu Radar asistanısın. Kısa ve profesyonel cevap ver. Konu: " + msg }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const aiResponse = data.candidates[0].content.parts[0].text;
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        chatMsgs.innerHTML += `<div class="bot-msg" style="background: #252525; color: #eee; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; border-left: 3px solid #3498db; margin-bottom: 10px;">${aiResponse}</div>`;
        
    } catch (error) {
        console.error("Hata Detayı:", error);
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        chatMsgs.innerHTML += `<div class="bot-msg" style="background: #c0392b; color: white; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; margin-bottom: 10px;">Hata: ${error.message}</div>`;
    } finally { 
        input.disabled = false;
        input.focus();
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }
} 

function toggleChat() {
    const win = document.getElementById('chat-window');
    if (win) win.classList.toggle('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'user-input') sendMessage();
});

window.addEventListener('DOMContentLoaded', () => {
    const assistant = document.getElementById('radar-assistant-container');
    if (assistant) assistant.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#send-btn') || e.target.closest('.fa-paper-plane')) sendMessage();
    const btn = e.target.closest('.nav-item') || e.target.closest('button');
    if (!btn) return;
    const text = btn.innerText.toLowerCase();
    const assistant = document.getElementById('radar-assistant-container');
    if (!assistant) return;
    if (text.includes('akış')) assistant.classList.remove('hidden');
    else if (['rasathane', 'oyun', 'envanter', 'radar akışı'].some(s => text.includes(s))) {
        assistant.classList.add('hidden');
        const chatWin = document.getElementById('chat-window');
        if (chatWin) chatWin.classList.add('hidden');
    }
});

// =========================================
// UR TV MANTIĞI VE BUTON KONTROLLERİ
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTv = document.getElementById('btn-tv');
    const secTv = document.getElementById('tvContainer');
    const mainApp = document.querySelector('.app-main');
    const sidebar = document.querySelector('.sidebar-right');
    
    // Sitedeki tüm ana sekmeler ve onlara ait butonlar
    const allSections = ['feedContainer', 'mapContainer', 'quizContainer', 'arsenalContainer', 'tvContainer'];
    const allBtns = ['btn-feed', 'btn-map', 'btn-quiz', 'btn-arsenal', 'btn-tv'];

    // UR TV Butonuna Tıklanınca
    if (btnTv) {
        btnTv.addEventListener('click', () => {
            // 1. Tüm butonların aktifliğini sil, sadece TV butonunu aktif (mavi) yap
            allBtns.forEach(id => {
                const b = document.getElementById(id);
                if (b) b.classList.remove('active');
            });
            btnTv.classList.add('active');

            // 2. Ekranda ne açıksa (haber, oyun, harita) hepsini gizle
            allSections.forEach(id => {
                const s = document.getElementById(id);
                if (s) s.classList.add('hidden');
            });
            
            // 3. Sağ taraftaki kategorileri gizle, harita modunu sıfırla ve TV'yi göster
            if (sidebar) sidebar.classList.add('hidden');
            mainApp.classList.remove('map-active');
            if (secTv) secTv.classList.remove('hidden');
        });
    }

    // Haberler veya Harita sekmelerine geri dönüldüğünde TV'yi gizle
    ['btn-feed', 'btn-map'].forEach(id => {
        const b = document.getElementById(id);
        if (b) {
            b.addEventListener('click', () => {
                if (secTv) secTv.classList.add('hidden');
                // Bu sayfalarda sağ barın (Kategoriler) görünmesi gerekiyor
                if (sidebar) sidebar.classList.remove('hidden'); 
            });
        }
    });

    // Oyun veya Envanter sekmelerine geçildiğinde TV'yi gizle
    ['btn-quiz', 'btn-arsenal'].forEach(id => {
        const b = document.getElementById(id);
        if (b) {
            b.addEventListener('click', () => {
                if (secTv) secTv.classList.add('hidden');
                // Bu sayfalarda zaten sağ bar gizleniyordu, ekstra işleme gerek yok
            });
        }
    });
});
// =========================================
// HABER PAYLAŞMA MANTIĞI (WEB SHARE API)
// =========================================
window.shareNews = async function(newsId) {
    // Paylaşılacak haberi bul
    const item = STATE.news.find(n => n.id === newsId);
    if (!item) return;

    // Paylaşım metnini hazırla
    const shareTitle = "Orta Doğu Radar | " + item.title;
    // Özeti biraz kırpalım ki çok uzun olmasın
    const shortSummary = item.summary.length > 150 ? item.summary.substring(0, 150) + "..." : item.summary;
    const shareText = `📌 ${item.title}\n\n${shortSummary}\n\n`;
    
    // Geçerli URL'yi al
    const shareUrl = window.location.href.split('#')[0];

    // Modern tarayıcıların paylaşım menüsünü tetikle
    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl
            });
            console.log('Başarıyla paylaşıldı');
        } catch (err) {
            console.log('Paylaşım iptal edildi veya desteklenmiyor.', err);
        }
    } else {
        // Eğer cihaz bunu desteklemiyorsa (eski masaüstü vs.) linki panoya kopyala
        const fallbackText = `${shareText}\nHaberi Oku: ${shareUrl}`;
        navigator.clipboard.writeText(fallbackText).then(() => {
            alert("Haber metni ve linki panoya kopyalandı! İstediğin yere yapıştırabilirsin.");
        }).catch(err => {
            alert("Kopyalama başarısız oldu.");
        });
    }
};
// =========================================
// MOBİL İÇİN OYUN KARTLARINI DÜZELTME
// =========================================
window.addEventListener('resize', fixMobileGames);
window.addEventListener('DOMContentLoaded', fixMobileGames);

function fixMobileGames() {
    const gameGrid = document.querySelector('.game-cards-grid');
    if (!gameGrid) return;

    if (window.innerWidth <= 900) {
        // Ekran darsa (Mobil), HTML içindeki o inatçı grid ayarını ez ve alt alta diz
        gameGrid.style.display = 'flex';
        gameGrid.style.flexDirection = 'column';
    } else {
        // Masaüstü ise orijinal o jilet gibi duran haline geri dön
        gameGrid.style.display = 'grid';
        gameGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    }
}
// Köşe Yazıları ve Canlı Akış Sekme Geçişi
document.addEventListener('DOMContentLoaded', () => {
    const tabLive = document.getElementById('tab-live-feed');
    const tabEditorials = document.getElementById('tab-editorials');
    const newsFeed = document.getElementById('newsFeed');
    const editorialFeed = document.getElementById('editorialFeed');
    const liveIndicator = document.getElementById('live-indicator-badge');

    if(tabLive && tabEditorials) {
        tabLive.addEventListener('click', () => {
            tabLive.classList.add('active');
            tabLive.style.color = 'var(--text-primary)';
            tabEditorials.classList.remove('active');
            tabEditorials.style.color = '#888';
            
            newsFeed.style.display = 'block';
            editorialFeed.style.display = 'none';
            liveIndicator.style.display = 'inline-block';
        });

        tabEditorials.addEventListener('click', () => {
            tabEditorials.classList.add('active');
            tabEditorials.style.color = 'var(--text-primary)';
            tabLive.classList.remove('active');
            tabLive.style.color = '#888';
            
            newsFeed.style.display = 'none';
            editorialFeed.style.display = 'flex';
            liveIndicator.style.display = 'none';
        });
    }
});
// Yazar Arşivi Modalını Aç/Kapat
function openAuthorArchive() {
    const modal = document.getElementById('authorArchiveModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Arka planın kaymasını engelle
    }
}

function closeAuthorArchive() {
    const modal = document.getElementById('authorArchiveModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Arka plan kaydırmasını geri aç
    }
}
