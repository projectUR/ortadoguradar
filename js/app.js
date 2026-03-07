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
    viewConfig: 'feed' // 'feed' or 'map'
};

// DOM Elements
const DOM = {
    feedContainer: document.getElementById('newsFeed'),
    trendList: document.getElementById('trendList'),
    categoryList: document.getElementById('categoryList'),
    searchInput: document.getElementById('searchInput'),
    btnFeed: document.getElementById('btn-feed'),
    btnMap: document.getElementById('btn-map'),
    secFeed: document.getElementById('feedContainer'),
    secMap: document.getElementById('mapContainer')
};

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
        // In a real app, this would be an API endpoint hitting our Node.js backend
        const response = await fetch('data/mock_news.json');
        let data = await response.json();

        // Sort chronologically (newest first)
        data = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        STATE.news = data;
        STATE.filteredNews = [...data];
    } catch (err) {
        console.error("Haberler çekilemedi:", err);
        DOM.feedContainer.innerHTML = `<div class="loading-state text-orange"><i class="fa-solid fa-triangle-exclamation"></i> Veri yüklenemedi. Lütfen sayfayı yenileyin.</div>`;
    }
}

// =========================================
// UI RENDERERS
// =========================================
function updateUI() {
    renderNewsCards();
    renderTrends();
    renderCategories(); // updates counts

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

        const cardHTML = `
            <article class="${cardClass}">
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
                        <button class="action-btn" title="Yerini Göster (Rasathane)"><i class="fa-solid fa-location-dot"></i></button>
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

        // Update active robustly
        if (cat === STATE.activeCategory) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }

        // Update counts (only if not 'Tümü')
        const badge = li.querySelector('.badge');
        if (badge && cat !== 'Tümü') {
            const count = STATE.news.filter(n => n.category === cat).length;
            badge.textContent = count > 0 ? count : '';
        }
    });
}

// =========================================
// EVENT LISTENERS & FILTERING
// =========================================
function setupEventListeners() {

    // Category Clicks
    DOM.categoryList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        STATE.activeCategory = li.getAttribute('data-cat');
        applyFilters();
    });

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
        STATE.searchQuery = e.target.value.toLowerCase();
        applyFilters();
    });

    // View Toggles (Feed vs Map)
    DOM.btnFeed.addEventListener('click', () => switchView('feed'));
    DOM.btnMap.addEventListener('click', () => switchView('map'));
}

function applyFilters() {
    let result = [...STATE.news];

    // Filter by Category
    if (STATE.activeCategory !== 'Tümü') {
        result = result.filter(n => n.category === STATE.activeCategory);
    }

    // Filter by Search (combines title and summary relevance)
    if (STATE.searchQuery.trim() !== '') {
        const q = STATE.searchQuery.trim().toLocaleLowerCase('tr-TR');
        result = result.filter(n => {
            const title = n.title ? n.title.toLocaleLowerCase('tr-TR') : '';
            const summary = n.summary ? n.summary.toLocaleLowerCase('tr-TR') : '';
            return title.includes(q) || summary.includes(q);
        });
    }

    STATE.filteredNews = result;
    updateUI();
}

function switchView(view) {
    if (STATE.viewConfig === view) return;
    STATE.viewConfig = view;

    if (view === 'map') {
        DOM.btnFeed.classList.remove('active');
        DOM.btnMap.classList.add('active');

        DOM.secFeed.classList.add('hidden');
        DOM.secMap.classList.remove('hidden');

        // Recompute dimensions for Map
        if (typeof window.invalidateMapSize === 'function') {
            window.invalidateMapSize();
        }

    } else {
        DOM.btnMap.classList.remove('active');
        DOM.btnFeed.classList.add('active');

        DOM.secMap.classList.add('hidden');
        DOM.secFeed.classList.remove('hidden');
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

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);
