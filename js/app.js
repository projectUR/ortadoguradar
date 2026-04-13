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
                        <button onclick="handleLike(event, '${item.id}')" class="int-btn" title="Beğen" style="background:none; border:none; color:#888; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem; transition:0.2s;">
                            <i class="fa-regular fa-heart"></i> <span id="likes-${item.id}">0</span>
                        </button>
                        <button onclick="handleComment('${item.id}')" class="int-btn" title="Yorum Yap" style="background:none; border:none; color:#888; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:0.9rem; transition:0.2s;">
                            <i class="fa-regular fa-comment"></i> <span>0</span>
                        </button>
                        <button onclick="handleQuote('${item.id}')" class="int-btn" title="Alıntıla" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.9rem; transition:0.2s;">
                            <i class="fa-solid fa-retweet"></i>
                        </button>
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

// --- 3. SOSYAL AKIŞI RENDER ETME ---
function renderSocialFeed(posts) {
    DOM.feedContainer.innerHTML = '<h2 style="color:var(--accent-blue); margin-bottom:20px; padding:10px;"><i class="fa-solid fa-users-viewfinder"></i> Radar Akışı</h2>';
    
    posts.forEach(post => {
        let commentsHTML = "";
        if (post.comments && post.comments.length > 0) {
            commentsHTML = `<div class="post-comments" style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid #222;">`;
            post.comments.forEach(cmt => {
                commentsHTML += `
                    <div style="margin-bottom: 10px; border-bottom: 1px solid #1a1a1a; padding-bottom: 8px; font-size: 0.92rem;">
                        <strong style="color: var(--accent-blue);">@${cmt.author}:</strong> 
                        <span style="color: #ddd;">${cmt.text}</span>
                    </div>`;
            });
            commentsHTML += `</div>`;
        }

        let quoteBoxHTML = post.quotedPost ? `
            <div style="border: 1px dashed #444; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: rgba(255,255,255,0.03); border-left: 3px solid #555;">
                <strong style="color: var(--accent-blue); font-size: 0.85rem; display:block; margin-bottom:5px;">@${post.quotedPost.author} analizi:</strong>
                <p style="margin: 0; font-size: 0.95rem; color: #bbb; font-style: italic;">"${post.quotedPost.content}"</p>
            </div>` : "";

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
                        <i class="fa-regular fa-heart"></i> <span>${post.likes || 0}</span>
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
    fetchRadarPosts();
};

// --- 5. BULUTA YORUM KAYDETME ---
window.handleComment = async function(postId) {
    if (!checkAuthAction("Yorum Yapma")) return;
    const userComment = prompt("Yorumun nedir kral?");
    if (!userComment) return;

    const currentUser = localStorage.getItem('currentUser');
    const postRef = db.collection("posts").doc(postId);
    
    const doc = await postRef.get();
    if (doc.exists) {
        const comments = doc.data().comments || [];
        comments.push({
            id: 'cmt_' + Date.now(),
            author: currentUser,
            text: userComment,
            timestamp: new Date().toISOString()
        });
        await postRef.update({ comments: comments });
        fetchRadarPosts();
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
    const postRef = db.collection("posts").doc(postId);
    const icon = event.currentTarget.querySelector('i');
    const span = event.currentTarget.querySelector('span');
    try {
        const doc = await postRef.get();
        if (doc.exists) {
            let currentLikes = doc.data().likes || 0;
            let newLikes = currentLikes + 1;
            await postRef.update({ likes: newLikes });
            if (span) span.textContent = newLikes;
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.style.color = '#ff4757';
        }
    } catch (e) {
        console.error("Beğeni buluta işlenemedi:", e);
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
