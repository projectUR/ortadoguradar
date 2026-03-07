import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key Control
if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: GEMINI_API_KEY bulunamadı! Lütfen .env dosyanızı kontrol edin.");
    process.exit(1);
}

// Initialize AI and RSS Parser
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const parser = new Parser();

// Data Paths
const RSS_FEEDS = [
    { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { source: "Al Arabiya", url: "https://english.alarabiya.net/feed/news" }
];
const OUTPUT_FILE = path.resolve('../data/mock_news.json');

// Helper to delay (rate limiting AI)
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAndProcessNews() {
    console.log("📡 Orta Doğu Radar Botu Başlatıldı...");
    let allNews = [];

    // Step 1: Fetch News from RSS feeds
    for (const feedConfig of RSS_FEEDS) {
        console.log(`\n⏳ Veri çekiliyor: ${feedConfig.source}...`);
        try {
            const feed = await parser.parseURL(feedConfig.url);

            // Limit to Top 5 latest news per source to save API costs
            const topItems = feed.items.slice(0, 5);

            for (const item of topItems) {
                console.log(`  - İşleniyor: ${item.title}`);
                const aiResult = await paraphraseWithAI(item, feedConfig.source);

                if (aiResult) {
                    allNews.push(aiResult);
                }

                // Wait 2 seconds between AI calls to avoid rate limits
                await delay(2000);
            }
        } catch (error) {
            console.error(`❌ ${feedConfig.source} verisi çekilemedi:`, error.message);
        }
    }

    // Step 2: Save to Output File
    if (allNews.length > 0) {
        // Sort by recency (simulated by processing time or we can let AI extract real time. We'll use current date for simplicity)
        saveToDatabase(allNews);
    } else {
        console.log("❌ Yeni haber bulunamadı veya işlenemedi.");
    }
}

async function paraphraseWithAI(newsItem, sourceName) {
    const prompt = `
Aşağıda İngilizce veya Arapça olabilen bir Orta Doğu haberinin başlığı ve özeti var.
Bu haberi Türkçe olarak TARAfsız, yorumsuz (paraphrase edilmiş) bir şekilde özetle. Haber ajansı dili kullan.

Ayrıca bu haberin aşağıdaki kategorilerden HANGİSİNE en uygun olduğunu seç (Sadece birini seç):
[Diplomatik, Ekonomik, Çatışma ve Güvenlik, Toplum ve İnsan Hakları, Enerji ve Altyapı, Çevre ve İklim, Tümü]

Son olarak bu haber Orta Doğu'da veya dünyada hangi ülkede/şehirde geçiyor? Ana konumu belirle. Yaklaşık enlem ve boylamını bul.

HABER BAŞLIĞI: ${newsItem.title}
HABER İÇERİĞİ/ÖZETİ: ${newsItem.contentSnippet || newsItem.content || newsItem.summary || ''}

LÜTFEN SADECE AŞAĞIDAKİ GİBİ GEÇERLİ BİR KESİN JSON ÇIKTISI VER (Başka hiçbir açıklama yazma, markdown veya \`\`\`json tagi koyma!):
{
  "title": "Türkçe tarafsız başlık",
  "summary": "Türkçe tarafsız haber özeti (2-3 cümle)",
  "category": "Seçilen Kategori Adı",
  "location_name": "Şehir, Ülke",
  "lat": 33.0,
  "lng": 35.0,
  "trendScore": <rastgele 50 ile 99 arası bir sayı üret>,
  "isBreaking": <eğer haberde aciliyet, ölüm, saldırı, kriz varsa true, yoksa false>
}`;

    try {
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        let text = response.response.text().trim();
        // Temizleme: Eğer AI başına ve sonuna ```json koyarsa diye
        if (text.startsWith("```json")) text = text.replace("```json", "");
        if (text.startsWith("```")) text = text.replace("```", "");
        if (text.endsWith("```")) text = text.substring(0, text.length - 3);

        const aiData = JSON.parse(text.trim());

        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            title: aiData.title,
            summary: aiData.summary,
            category: aiData.category,
            timestamp: new Date().toISOString(), // Use current time of scraping
            location: {
                lat: parseFloat(aiData.lat),
                lng: parseFloat(aiData.lng),
                name: aiData.location_name
            },
            source: newsItem.link || '',
            trendScore: parseInt(aiData.trendScore) || 75,
            isBreaking: aiData.isBreaking || false
        };

    } catch (error) {
        console.error(`  ❌ AI Hatası (${newsItem.title}):`, error.message);
        return null; // AI failed parsing
    }
}

function saveToDatabase(newItems) {
    try {
        let existingData = [];
        // Eğer zaten JSON varsa, oku
        if (fs.existsSync(OUTPUT_FILE)) {
            const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
            existingData = JSON.parse(fileContent);
        }

        // Yeni verileri en başa (üst) ekle (Twitter Taym mantığı)
        const combinedData = [...newItems, ...existingData];

        // Kapasite limiti: Son 100 haberi tutalım ki JSON şişmesin
        const trimmedData = combinedData.slice(0, 100);

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trimmedData, null, 4));
        console.log(`\n✅ Başarılı! Toplam ${newItems.length} yeni haber "mock_news.json" dosyasına eklendi.`);

    } catch (error) {
        console.error("❌ Dosya kaydetme hatası:", error.message);
    }
}

// Botu Başlat
fetchAndProcessNews();
