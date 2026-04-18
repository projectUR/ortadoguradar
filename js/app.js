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
                    
                   <div class="card-interactions" style="display: flex; gap: 25px; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                        
                        <button onclick="handleNewsLike('${item.id}')" class="int-btn" id="news-like-btn-${item.id}" style="background:none; border:none; color:#888; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem;">
                            <i class="fa-regular fa-heart"></i> <span class="count">0</span>
                        </button>
                        
                        <button onclick="toggleNewsComments('${item.id}')" class="int-btn" id="news-comm-btn-${item.id}" style="background:none; border:none; color:#888; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem;">
                            <i class="fa-regular fa-comment"></i> <span class="count">0</span>
                        </button>
                        
                        <button onclick="handleQuote('${item.id}')" class="int-btn" id="news-quote-btn-${item.id}" style="background:none; border:none; color:#888; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem;">
                            <i class="fa-solid fa-retweet"></i> <span class="count">0</span>
                        </button>
                    </div>

                    <div id="comments-area-${item.id}" class="hidden" style="margin-top: 10px; background: #0c0c0c; border-radius: 8px; border: 1px solid #1a1a1a; overflow: hidden;">
                    </div>
                </div>
                
                <div class="card-footer">
                    <a href="${item.source}" target="_blank" class="source-link" rel="nofollow">
                        <i class="fa-solid fa-link"></i> Kaynak Taramasını Gör
                    </a>
                    <div class="card-actions">
                        <button class="action-btn" title="Yerini Göster (Rasathane)"
                        onclick="if(window.focusMapOnItem) window.focusMapOnItem('${item.id}')"><i class="fa-solid fa-location-dot"></i></button>
                        <button class="action-btn" title="Paylaş"><i class="fa-regular fa-share-from-square"></i></button>
                    </div>
                </div>
            </article>
        `;
        DOM.feedContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
  // 189. satırdaki }); işaretinden hemen sonra burayı yapıştır:
    STATE.filteredNews.forEach(item => updateNewsInteractionsUI(item.id));
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
    DOM.logo.addEventListener('click', async () => {
        DOM.feedContainer.innerHTML = `<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i> Akış Yenileniyor...</div>`;
        STATE.activeCategory = 'Tümü';
        STATE.searchQuery = '';
        DOM.searchInput.value = '';
        await fetchNewsData();
      await fetchRadarPosts();
        updateUI(); 
        switchView('feed');
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
          renderCategories(); // reset visual active class on categories
          applyFilters(); // Apply filter since category was reset
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
          renderCountries(); // to update active class
          applyFilters();
      });
  }


    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
        STATE.searchQuery = e.target.value; // Ham veriyi al
        applyFilters();
    });

    // View Toggles (Feed vs Map)
    // Akış (Haberler) Butonu
    DOM.btnFeed.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        DOM.btnFeed.classList.add('active');
        const socialBtn = document.getElementById('btn-social');
        if (socialBtn) socialBtn.classList.remove('active');
        
        switchView('feed');
        renderNewsCards(); // Haberleri geri getirir
    });

    // Rasathane (Harita) Butonu
    DOM.btnMap.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        DOM.btnMap.classList.add('active');
        const socialBtn = document.getElementById('btn-social');
        if (socialBtn) socialBtn.classList.remove('active');

        switchView('map');
        renderNewsCards(); // Yan taraftaki akışı geri getirir
    });
  // Radar Akışı (Sosyal Akış) Butonu
    const socialBtn = document.getElementById('btn-social');
    if (socialBtn) {
        socialBtn.addEventListener('click', () => {
            // Diğer butonların aktifliğini kaldır
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            // Bu butonu aktif yap
            socialBtn.classList.add('active');
            
            // Görünümü Radar Akışına çevir
            switchView('social'); 
            
            // İŞTE KRİTİK NOKTA: Google Bulut'tan verileri çek
            fetchRadarPosts(); 
        });
    }
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
        // Türkçe karakterleri (İ/I) manuel olarak güvenli hale getiren fonksiyon
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
        // Rasathane Aktif: Harita Merkeze, Canlı Akış Sağ Sütuna
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
        // Normal Mod: Akış Merkeze, Kategoriler Sağa
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
    // Dil değiştiğinde çalışacak kod
    const langSelect = document.getElementById('languageSelect');
    const langIcon = document.getElementById('langIcon'); // Bayrak ikonu için ekledik
    
    // Hangi dile hangi bayrak gelecek
    const flags = {
        'tr': '🇹🇷',
        'en': '🇬🇧',
        'ar': '🇸🇦'
    };

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const targetLang = e.target.value;
            
            // Menünün yanındaki bayrağı anında güncelle
            if (langIcon && flags[targetLang]) {
                langIcon.textContent = flags[targetLang];
            }

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

    // Butona Tıklanınca Envanter Sayfasını Aç
    if(btnArsenal) {
        btnArsenal.addEventListener('click', () => {
            // Buton aktiflik durumları
            btnFeed.classList.remove('active');
            btnMap.classList.remove('active');
            if(btnQuiz) btnQuiz.classList.remove('active');
            btnArsenal.classList.add('active');

            // Ekranları gizle
            secFeed.classList.add('hidden');
            secMap.classList.add('hidden');
            if(secQuiz) secQuiz.classList.add('hidden');
            if(sidebar) sidebar.classList.add('hidden');
            mainApp.classList.remove('map-active');

            // Envanteri Göster
            secArsenal.classList.remove('hidden');
        });
    }

    // Diğer sekmelere tıklandığında Envanteri Gizle
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

// Filtre Butonları Dinleyicisi
document.addEventListener('DOMContentLoaded', () => {
    loadArsenal(); // Sayfa yüklenince JSON'ı çek
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Aktif buton stilini değiştir
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#2a2a2a';
                b.style.border = '1px solid #444';
            });
            e.target.classList.add('active');
            e.target.style.background = 'var(--accent-blue)';
            e.target.style.border = 'none';
            
            // Tıklanan ülkeye göre filtrele
            const country = e.target.getAttribute('data-country');
            renderArsenal(country);
        });
    });
});

// --- GİRİŞ/KAYIT SİSTEMİ (TEK PARÇA VE HATASIZ) ---

let isLoginMode = true;
const btnSwitch = document.getElementById('btnSwitchAuth');
const authTitle = document.getElementById('authTitle');
const authPrimaryBtn = document.getElementById('authPrimaryBtn');
const authSwitchText = document.getElementById('authSwitchText');

// Modal Kontrolleri
window.openAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('hidden');
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
};

// Mod Değiştirme (Giriş <-> Kayıt)
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

// --- BULUT DESTEKLİ GİRİŞ/KAYIT SİSTEMİ ---
if (authPrimaryBtn) {
    authPrimaryBtn.onclick = async function() {
        // Kullanıcı adını küçük harfe çeviriyoruz ki giriş yaparken sorun çıkmasın
        const username = document.getElementById('authUsername').value.trim().toLowerCase();
        const password = document.getElementById('authPassword').value.trim();

        if (username === "" || password === "") {
            alert("Alanları boş bırakma kral!");
            return;
        }

        const userRef = db.collection("users").doc(username);

        try {
            if (!isLoginMode) {
                // --- KAYIT OLMA (BULUTA YAZMA) ---
                const doc = await userRef.get();
                if (doc.exists) {
                    alert("Bu kullanıcı adı alınmış, başka bir tane dene.");
                } else {
                    await userRef.set({
                        username: username,
                        password: password,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    alert(`Hoş geldin ${username}! Artık her yerden girebilirsin.`);
                    loginUser(username);
                }
            } else {
                // --- GİRİŞ YAPMA (BULUTTAN OKUMA) ---
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

// Kullanıcı Arayüzünü Güncelle
function loginUser(username) {
    localStorage.setItem('currentUser', username);
    closeAuthModal();
    const loginBtn = document.getElementById('btn-login-trigger');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span>${username}</span>`;
        loginBtn.onclick = null; 
    }
}

// Sayfa Yüklendiğinde Oturum Kontrolü
window.addEventListener('load', () => {
    const savedSession = localStorage.getItem('currentUser');
    if (savedSession) {
        loginUser(savedSession);
    }
});


// --- 1. KULLANICI KONTROLÜ (BU KALSIN) ---
function checkAuthAction(action) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert(`🚨 Dur bakalım kral! ${action} yapabilmek için önce giriş yapman lazım.`);
        window.openAuthModal();
        return false;
    }
    return true;
}

// --- 2. BULUTTAN VERİLERİ ÇEKME ---
async function fetchRadarPosts() {
    try {
        const snapshot = await db.collection("posts").orderBy("timestamp", "desc").get();
        const posts = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        renderSocialFeed(posts);
    } catch (error) {
        console.error("Bulut verileri çekilemedi:", error);
    }
}

// --- 3. SOSYAL AKIŞI RENDER ETME (GÜNCEL VERSİYON) ---
function renderSocialFeed(posts) {
    DOM.feedContainer.innerHTML = '<h2 style="color:var(--accent-blue); margin-bottom:20px; padding:10px;"><i class="fa-solid fa-users-viewfinder"></i> Radar Akışı</h2>';
    
    // Kimin giriş yaptığını kontrol et
    const currentUser = localStorage.getItem('currentUser');

    posts.forEach(post => {
        // --- POST BEĞENİ KONTROLÜ ---
        const isPostLiked = post.likedBy && post.likedBy.includes(currentUser);
        const postHeartClass = isPostLiked ? 'fa-solid' : 'fa-regular';
        const postHeartColor = isPostLiked ? '#ff4757' : '#555';

        let commentsHTML = "";
        if (post.comments && post.comments.length > 0) {
            commentsHTML = `<div class="post-comments" style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid #222;">`;
            
            post.comments.forEach(cmt => {
                // --- YORUM BEĞENİ KONTROLÜ ---
                const isCmtLiked = cmt.likedBy && cmt.likedBy.includes(currentUser);
                const cmtHeartClass = isCmtLiked ? 'fa-solid' : 'fa-regular';
                const cmtHeartColor = isCmtLiked ? '#ff4757' : '#555';

                commentsHTML += `
                    <div style="margin-bottom: 10px; border-bottom: 1px solid #1a1a1a; padding-bottom: 8px;">
                        <div style="font-size: 0.92rem;">
                            <strong style="color: var(--accent-blue);">@${cmt.author}:</strong> 
                            <span style="color: #ddd;">${cmt.text}</span>
                        </div>
                        <div style="display: flex; gap: 15px; margin-top: 5px; padding-left: 5px;">
                            <button onclick="handleCommentLike('${post.id}', '${cmt.id}')" style="background:none; border:none; color:#555; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:4px;">
                                <i class="${cmtHeartClass} fa-heart" style="color: ${cmtHeartColor}"></i> 
                                <span>${cmt.likes || 0}</span>
                            </button>
                            <button onclick="handleCommentReply('${post.id}', '${cmt.author}')" style="background:none; border:none; color:#555; cursor:pointer; font-size:0.8rem;">
                                <i class="fa-solid fa-reply"></i> Yanıtla
                            </button>
                        </div>
                    </div>`;
            });
            commentsHTML += `</div>`;
        }

        // --- ALINTI KUTUSU GÜNCELLEMESİ (Haber mi, Post mu?) ---
        let quoteBoxHTML = "";
        if (post.quotedPost) {
            // Başka bir kullanıcının analizini alıntıladıysa
            quoteBoxHTML = `
                <div onclick="scrollToPost('${post.quotedPost.id}')" style="border: 1px dashed #444; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: rgba(255,255,255,0.03); border-left: 3px solid #555; cursor: pointer;">
                    <strong style="color: var(--accent-blue); font-size: 0.85rem; display:block; margin-bottom:5px;">@${post.quotedPost.author} analizi:</strong>
                    <p style="margin: 0; font-size: 0.95rem; color: #bbb; font-style: italic;">"${post.quotedPost.content}"</p>
                </div>`;
        } else if (post.originalNews) {
            // Canlı Akış'tan bir haberi alıntıladıysa (Yeni Eklenen Kısım)
            quoteBoxHTML = `
                <div onclick="goToNews('${post.originalNews.id}')" style="border: 1px solid var(--accent-blue); border-radius: 8px; padding: 12px; margin-bottom: 12px; background: rgba(30, 60, 114, 0.1); border-left: 4px solid var(--accent-blue); cursor: pointer;">
                    <strong style="color: var(--accent-blue); font-size: 0.85rem; display:block; margin-bottom:5px;"><i class="fa-solid fa-newspaper"></i> Haber Alıntısı:</strong>
                    <p style="margin: 0; font-size: 0.95rem; color: #eee; font-weight: 500;">${post.originalNews.title}</p>
                    <span style="font-size: 0.75rem; color: var(--accent-blue); margin-top: 5px; display: block;">Habere gitmek için tıkla →</span>
                </div>`;
        }

        const postHTML = `
            <div id="${post.id}" class="social-post" style="background: #151515; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 20px; border-left: 4px solid var(--accent-blue);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <div style="width: 35px; height: 35px; background: #222; border: 1px solid var(--accent-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--accent-blue);">${post.author ? post.author[0].toUpperCase() : 'R'}</div>
                    <div><strong style="color: white;">@${post.author || "Anonim"}</strong></div>
                </div>
                <p style="color: #eee; font-size: 1.05rem; margin-bottom: 15px;">${post.content}</p>
                ${quoteBoxHTML}
                <div class="post-interactions" style="display: flex; gap: 30px; margin-top:15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <button onclick="handleLike(event, '${post.id}')" class="int-btn" style="background:none; border:none; color:#555; cursor:pointer; display: flex; align-items: center; gap: 5px;">
                        <i class="${postHeartClass} fa-heart" style="color: ${postHeartColor}"></i> 
                        <span>${post.likes || 0}</span>
                    </button>
                    <button onclick="handleComment('${post.id}')" class="int-btn" style="background:none; border:none; color:#555; cursor:pointer; display: flex; align-items: center; gap: 5px;">
                        <i class="fa-regular fa-comment"></i> <span>${post.comments ? post.comments.length : 0}</span>
                    </button>
                    <button onclick="handleQuote('${post.originalNews?.id || 'general'}', '${post.id}')" class="int-btn" style="background:none; border:none; color:#555; cursor:pointer;">
                        <i class="fa-solid fa-retweet"></i>
                    </button>
                </div>
                ${commentsHTML}
            </div>`;
        DOM.feedContainer.insertAdjacentHTML('beforeend', postHTML);
    });
}

// --- 4. BULUTA ANALİZ KAYDETME ---
window.handleQuote = async function(newsId, quotedId = null) {
    if (!checkAuthAction("Alıntıla")) return;
    const userComment = prompt("Bu analiz üzerine ne eklemek istersin kral?");
    if (!userComment) return;

    const currentUser = localStorage.getItem('currentUser');
    const newsItem = STATE.news.find(n => n.id === newsId) || { title: "Genel Analiz", id: "general" };
    let quotedData = null;

    if (quotedId) {
        const doc = await db.collection("posts").doc(quotedId).get();
        if (doc.exists) {
            quotedData = { id: quotedId, author: doc.data().author, content: doc.data().content };
        }
    }

    const newPost = {
        author: currentUser,
        content: userComment,
        originalNews: newsItem,
        quotedPost: quotedData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("posts").add(newPost);
  // Haberin alıntı sayısını 1 artır
        if (newsId && newsId !== 'general') {
            await db.collection("news_interactions").doc(newsId).set({
                quoteCount: firebase.firestore.FieldValue.increment(1)
            }, { merge: true });
            updateNewsInteractionsUI(newsId);
        }
    fetchRadarPosts();
};

// --- 5. BULUTA YORUM KAYDETME ---
window.handleComment = async function(postId, manualText = null) {
    if (!checkAuthAction("Yorum Yapma")) return;
    
    // Eğer dışarıdan metin gelmediyse (yanıtla değilse) prompt aç
    const userComment = manualText || prompt("Yorumun nedir kral?");
    if (!userComment || userComment.trim() === "") return;

    const currentUser = localStorage.getItem('currentUser');
    const postRef = db.collection("posts").doc(postId);
    
    try {
        const doc = await postRef.get();
        if (doc.exists) {
            const comments = doc.data().comments || [];
            comments.push({
                id: 'cmt_' + Date.now(),
                author: currentUser,
                text: userComment,
                likes: 0, // Yeni yorum sıfır beğeniyle başlar
                timestamp: new Date().toISOString()
            });
            await postRef.update({ comments: comments });
            fetchRadarPosts();
        }
    } catch (e) {
        console.error("Yorum kaydedilemedi:", e);
    }
};


// BU YENİ FONKSİYON: Alıntıya tıklayınca oraya kaydırır
window.scrollToPost = function(postId) {
    const target = document.getElementById(postId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.boxShadow = "0 0 20px var(--accent-blue)";
        setTimeout(() => target.style.boxShadow = "none", 2000);
    } else {
        alert("Bu post akışta çok geride kalmış olabilir kral!");
    }
};


// Sosyal akıştan ana habere yönlendirme
window.goToNews = function(newsId) {
    // 1. Ana Akış butonuna tıkla (Sayfayı haber moduna döndür)
    const btnFeed = document.getElementById('btn-feed');
    if (btnFeed) btnFeed.click();

    // 2. Küçük bir gecikmeyle haberi bul ve oraya kaydır
    setTimeout(() => {
        const targetCard = document.querySelector(`[onclick*="${newsId}"]`)?.closest('.news-card');
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.boxShadow = "0 0 20px var(--accent-blue)"; // Haberi parlat
            setTimeout(() => targetCard.style.boxShadow = "none", 2000); // 2 sn sonra ışığı kapat
        }
    }, 300);
};
// --- FIREBASE BEĞENİ FONKSİYONU ---
window.handleLike = async function(event, postId) {
    if (!checkAuthAction("Beğeni")) return;
    const currentUser = localStorage.getItem('currentUser');
    const postRef = db.collection("posts").doc(postId);

    try {
        const doc = await postRef.get();
        if (doc.exists) {
            let likedBy = doc.data().likedBy || [];
            
            if (likedBy.includes(currentUser)) {
                // Kullanıcı zaten beğenmiş, listeden çıkar (Unlike)
                likedBy = likedBy.filter(user => user !== currentUser);
            } else {
                // Kullanıcı ilk kez beğeniyor, listeye ekle (Like)
                likedBy.push(currentUser);
            }

            await postRef.update({ 
                likedBy: likedBy,
                likes: likedBy.length // Beğeni sayısı listenin uzunluğu olur
            });
            fetchRadarPosts(); // Görünümü güncellemek için akışı tazele
        }
    } catch (e) {
        console.error("Beğeni işlemi başarısız:", e);
    }
};

// Sayfa ilk açıldığında ne olacağını belirleyen kısım
document.addEventListener('DOMContentLoaded', () => {
    // Önce Haberleri (Ana Sayfayı) yükle
    switchView('feed'); 
    
    // Arka planda Google'a selam ver ama ekrana basma
    if (typeof db !== 'undefined') {
        db.collection("posts").orderBy("timestamp", "desc").limit(1).get().then(() => {
            console.log("Bulut bağlantısı hazır.");
        });
    }
});
// --- YORUM BEĞENİ FONKSİYONU ---
window.handleCommentLike = async function(postId, commentId) {
    if (!checkAuthAction("Yorum Beğeni")) return;
    const currentUser = localStorage.getItem('currentUser');
    const postRef = db.collection("posts").doc(postId);

    try {
        const doc = await postRef.get();
        if (doc.exists) {
            let comments = doc.data().comments || [];
            comments = comments.map(cmt => {
                if (cmt.id === commentId) {
                    let likedBy = cmt.likedBy || [];
                    if (likedBy.includes(currentUser)) {
                        likedBy = likedBy.filter(u => u !== currentUser);
                    } else {
                        likedBy.push(currentUser);
                    }
                    return { ...cmt, likedBy: likedBy, likes: likedBy.length };
                }
                return cmt;
            });

            await postRef.update({ comments: comments });
            fetchRadarPosts();
        }
    } catch (e) {
        console.error("Yorum beğenisi başarısız:", e);
    }
};

// --- YORUM YANITLAMA (ETİKETLEME) ---
window.handleCommentReply = function(postId, targetAuthor) {
    if (!checkAuthAction("Yanıt verme")) return;
    
    // Yanıt penceresini açarken @etiketini otomatik yazıyoruz
    const replyPrefix = `@${targetAuthor} `;
    const userComment = prompt(`@${targetAuthor} kullanıcısına yanıtın nedir kral?`, replyPrefix);
    
    // Eğer boşsa veya sadece @etiket duruyorsa iptal et
    if (!userComment || userComment.trim() === replyPrefix.trim()) return;

    // Güncellediğimiz handleComment'i hazır metinle çağır
    window.handleComment(postId, userComment);
};
// =========================================
// ANA AKIŞ (HABERLER) ETKİLEŞİM MANTIĞI
// =========================================

// --- HABER BEĞENİSİ ---
window.handleNewsLike = async function(newsId) {
    if (!checkAuthAction("Beğeni")) return;
    const currentUser = localStorage.getItem('currentUser');
    const newsRef = db.collection("news_interactions").doc(newsId);

    try {
        const doc = await newsRef.get();
        let likedBy = (doc.exists && doc.data().likedBy) ? doc.data().likedBy : [];

        if (likedBy.includes(currentUser)) {
            likedBy = likedBy.filter(u => u !== currentUser);
        } else {
            likedBy.push(currentUser);
        }

        await newsRef.set({ likedBy: likedBy }, { merge: true });
        updateNewsInteractionsUI(newsId); // Sayıyı ekranda hemen güncelle
    } catch (e) { console.error("Haber beğenilemedi:", e); }
};

// --- YORUM PANELİNİ AÇ/KAPAT ---
window.toggleNewsComments = async function(newsId) {
    const container = document.getElementById(`comments-area-${newsId}`);
    if (!container.classList.contains('hidden')) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = `<div style="padding:15px; color:#888; font-size:0.8rem;"><i class="fa-solid fa-spinner fa-spin"></i> Yorumlar yükleniyor...</div>`;

    const doc = await db.collection("news_interactions").doc(newsId).get();
    const comments = (doc.exists && doc.data().comments) ? doc.data().comments : [];
    renderNewsComments(newsId, comments);
};

// --- HABER YORUMLARINI EKRANA BASMA ---
function renderNewsComments(newsId, comments) {
    const container = document.getElementById(`comments-area-${newsId}`);
    const currentUser = localStorage.getItem('currentUser');
    
    let html = `
        <div style="padding: 15px; border-top: 1px solid #222; background: #0c0c0c;">
            <button onclick="handleNewsComment('${newsId}')" style="width:100%; padding:10px; background:var(--accent-blue); border:none; border-radius:6px; color:white; font-weight:bold; margin-bottom:15px; cursor:pointer; font-size:0.85rem;">
                <i class="fa-solid fa-pen-nib"></i> Analizini Ekle
            </button>
    `;

    if (!comments || comments.length === 0) {
        html += `<div style="color:#555; font-size:0.85rem; text-align:center; padding:10px;">Henüz analiz yapılmamış kral.</div>`;
    } else {
        comments.forEach(cmt => {
            const isLiked = cmt.likedBy && cmt.likedBy.includes(currentUser);
            html += `
                <div style="margin-bottom:15px; padding-bottom:12px; border-bottom:1px solid #1a1a1a;">
                    <div style="font-size:0.92rem; color: #eee; line-height: 1.4; margin-bottom: 8px;">
                        <strong style="color:var(--accent-blue);">@${cmt.author || 'anonim'}</strong>: 
                        <span>${cmt.text || cmt.content || '...'}</span>
                    </div>
                    <div style="display:flex; gap:18px; align-items:center;">
                        <button onclick="handleNewsCommentLike('${newsId}', '${cmt.id}')" style="background:none; border:none; color:${isLiked ? '#ff4757' : '#555'}; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:5px;">
                            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
                            <span>${cmt.likedBy ? cmt.likedBy.length : 0}</span>
                        </button>
                        <button onclick="handleNewsCommentReply('${newsId}', '${cmt.author}')" style="background:none; border:none; color:#555; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:5px;">
                            <i class="fa-solid fa-reply"></i> Yanıtla
                        </button>
                    </div>
                </div>`;
        });
    }

    html += `<button onclick="toggleNewsComments('${newsId}')" style="width:100%; background:none; border:none; color:#444; font-size:0.75rem; margin-top:5px; cursor:pointer;">Kapat ▲</button></div>`;
    container.innerHTML = html;
}

// --- HABER YORUMU BEĞENİ MOTORU ---
window.handleNewsCommentLike = async function(newsId, commentId) {
    if (!checkAuthAction("Yorum Beğeni")) return;
    const currentUser = localStorage.getItem('currentUser');
    const newsRef = db.collection("news_interactions").doc(newsId);
    const doc = await newsRef.get();
    if (doc.exists) {
        let comments = doc.data().comments || [];
        comments = comments.map(cmt => {
            if (cmt.id === commentId) {
                let likedBy = cmt.likedBy || [];
                if (likedBy.includes(currentUser)) likedBy = likedBy.filter(u => u !== currentUser);
                else likedBy.push(currentUser);
                return { ...cmt, likedBy: likedBy };
            }
            return cmt;
        });
        await newsRef.update({ comments: comments });
        renderNewsComments(newsId, comments);
    }
};

// --- HABER YORUMU KAYDETME ---
window.handleNewsComment = async function(newsId, manualText = null) {
    if (!checkAuthAction("Yorum Yapma")) return;
    const userComment = manualText || prompt("Haber hakkındaki analizin nedir kral?");
    if (!userComment) return;

    const currentUser = localStorage.getItem('currentUser');
    const newsRef = db.collection("news_interactions").doc(newsId);

    const doc = await newsRef.get();
    let comments = (doc.exists && doc.data().comments) ? doc.data().comments : [];

    comments.push({
        id: 'ncmt_' + Date.now(),
        author: currentUser,
        text: userComment,
        likedBy: [],
        timestamp: new Date().toISOString()
    });

    await newsRef.set({ comments: comments }, { merge: true });
    renderNewsComments(newsId, comments);
    updateNewsInteractionsUI(newsId);
};

// --- HABER YORUMU YANITLAMA ---
window.handleNewsCommentReply = function(newsId, targetAuthor) {
    if (!checkAuthAction("Yanıt verme")) return;
    const replyPrefix = `@${targetAuthor} `;
    const userComment = prompt(`@${targetAuthor} kullanıcısına yanıtın nedir kral?`, replyPrefix);
    if (!userComment || userComment.trim() === replyPrefix.trim()) return;
    window.handleNewsComment(newsId, userComment);
};

// --- EKRANDAKİ SAYILARI GÜNCELLEME (BEĞENİ, YORUM, ALINTI) ---
async function updateNewsInteractionsUI(newsId) {
    const doc = await db.collection("news_interactions").doc(newsId).get();
    if (doc.exists) {
        const data = doc.data();
        const currentUser = localStorage.getItem('currentUser');

        // 1. BEĞENİ GÜNCELLEME
        const likeBtn = document.querySelector(`#news-like-btn-${newsId}`);
        if (likeBtn) {
            const likedBy = data.likedBy || [];
            likeBtn.querySelector('.count').textContent = likedBy.length;
            const icon = likeBtn.querySelector('i');
            if (likedBy.includes(currentUser)) {
                icon.className = 'fa-solid fa-heart';
                icon.style.color = '#ff4757';
            } else {
                icon.className = 'fa-regular fa-heart';
                icon.style.color = '#888';
            }
        }

        // 2. YORUM SAYISI GÜNCELLEME
        const commBtn = document.querySelector(`#news-comm-btn-${newsId}`);
        if (commBtn) {
            commBtn.querySelector('.count').textContent = (data.comments || []).length;
        }

        // 3. ALINTI SAYISI GÜNCELLEME (YENİ)
        const quoteBtn = document.querySelector(`#news-quote-btn-${newsId}`);
        if (quoteBtn) {
            // Veritabanında quoteCount yoksa 0 yazdırıyoruz
            quoteBtn.querySelector('.count').textContent = data.quoteCount || 0;
        }
    }
}
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

const GEMINI_API_KEY = "AIzaSyBd_uiYA3ggl2o_ZNe7wre6C37oKeBEe-s"; 

async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (msg === "" || input.disabled) return;

    const chatMsgs = document.getElementById('chat-messages');
    chatMsgs.innerHTML += `<div style="background: #3498db; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; align-self: flex-end; max-width: 80%; font-size: 14px; margin-left: auto; margin-bottom: 10px;">${msg}</div>`;
    input.value = "";
    input.disabled = true;

    const loadingId = 'loading-' + Date.now();
    chatMsgs.innerHTML += `<div id="${loadingId}" class="bot-msg" style="background: #252525; color: #aaa; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; border-left: 3px solid #3498db; margin-bottom: 10px; font-style: italic;">Radar verileri taranıyor...</div>`;
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Sen Orta Doğu Radar asistanısın. Kısa ve profesyonel cevap ver. Konu: ${msg}` }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const aiResponse = data.candidates[0].content.parts[0].text;
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        chatMsgs.innerHTML += `<div class="bot-msg" style="background: #252525; color: #eee; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; border-left: 3px solid #3498db; margin-bottom: 10px;">${aiResponse}</div>`;
        
    } catch (error) {
        console.error("Hata:", error);
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        chatMsgs.innerHTML += `<div class="bot-msg" style="background: #c0392b; color: white; padding: 10px 15px; border-radius: 15px 15px 15px 0; align-self: flex-start; max-width: 80%; font-size: 14px; margin-bottom: 10px;">Bağlantı hatası: ${error.message}</div>`;
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

function handleChatKey(e) { 
    if (e.key === 'Enter') sendMessage(); 
}

window.addEventListener('DOMContentLoaded', () => {
    const assistant = document.getElementById('radar-assistant-container');
    if (assistant) assistant.classList.remove('hidden');
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.nav-item') || e.target.closest('button');
    if (!btn) return;
    const text = btn.innerText.toLowerCase();
    const assistant = document.getElementById('radar-assistant-container');
    if (!assistant) return;

    if (text.includes('akış')) {
        assistant.classList.remove('hidden');
    } else if (['rasathane', 'oyun', 'envanter', 'radar akışı'].some(s => text.includes(s))) {
        assistant.classList.add('hidden');
        const chatWin = document.getElementById('chat-window');
        if (chatWin) chatWin.classList.add('hidden');
    }
});
