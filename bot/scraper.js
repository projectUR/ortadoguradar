import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: GEMINI_API_KEY bulunamadı!");
    process.exit(1);
}

// YENİ SİSTEM
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
            ['image', 'image']
        ]
    }
});


const RSS_FEEDS = [
    { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { source: "BBC", url: "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml" },
    { source: "Anadolu Ajansı", url: "https://www.aa.com.tr/en/rss/default?cat=middle-east" },
{ source: "Middle East Eye", url: "https://www.middleeasteye.net/rss" }

];

const OUTPUT_FILE = path.resolve('../data/mock_news.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAndProcessNews() {
    console.log("📡 Orta Doğu Radar Botu Başlatıldı...");
        let allNews = [];
    let existingLinks = new Set();
    
    // Önceki haberleri oku ki kopya kontrolü yapabilelim
    if (fs.existsSync(OUTPUT_FILE)) {
        const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
        const existingData = JSON.parse(fileContent);
        existingData.forEach(item => existingLinks.add(item.source));
    }


    for (const feedConfig of RSS_FEEDS) {
        console.log(`\n⏳ Veri çekiliyor: ${feedConfig.source}...`);
        try {
            const feed = await parser.parseURL(feedConfig.url);
            const topItems = feed.items.slice(0, 5);

            for (const item of topItems) {            // Eğer link zaten varsa, atla!
            if (existingLinks.has(item.link)) {
                console.log(`  ⏩ Atlandı (Zaten var): ${item.title}`);
                continue; 
            }

                        console.log(`  - İşleniyor: ${item.title}`);
        
        let imageUrl = '';
        if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
        } else if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
            imageUrl = item.mediaContent.$.url;
        } else if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
            imageUrl = item.mediaThumbnail.$.url;
        } else if (item.image) {
            imageUrl = item.image;
        } else if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            imageUrl = imgMatch[1];
        }

        const aiResult = await paraphraseWithAI(item, feedConfig.source, imageUrl);

                if (aiResult) allNews.push(aiResult);
                await delay(15000);
            }
        } catch (error) {
            console.error(`❌ ${feedConfig.source} verisi çekilemedi:`, error.message);
        }
    }

    if (allNews.length > 0) saveToDatabase(allNews);
    else console.log("❌ Yeni haber bulunamadı veya işlenemedi.");
}

async function paraphraseWithAI(newsItem, sourceName) {
       const prompt = `
Aşağıda İngilizce veya Arapça olabilen bir haberin başlığı ve özeti var.
Bu haberin Orta Doğu coğrafyasına veya Orta Doğu siyasetine (örnek: ABD'nin İran açıklaması, Filistin olayları, Körfez ekonomisi vb.) doğrudan VEYA dolaylı yoldan ilgisi YOKSA (örneğin Şampiyonlar Ligi maçı, Haiti'deki bir olay, Orta Doğu ülkelerini ilgilendirmeyen başka kıtalardaki bir kaza vs. ise), LÜTFEN SADECE null DÖNDÜR. Başka hiçbir şey yazma.

Eğer haber Orta Doğu'yu ilgilendiriyorsa:
Bu haberi Türkçe olarak TARAfsız, yorumsuz (paraphrase edilmiş) bir şekilde özetle. Haber ajansı dili kullan.

Ayrıca bu haberin aşağıdaki kategorilerden HANGİSİNE en uygun olduğunu seç (Sadece birini seç):

[Diplomatik, Ekonomik, Çatışma ve Güvenlik, Toplum ve İnsan Hakları, Enerji ve Altyapı, Çevre ve İklim, Tümü]

Son olarak bu haber Orta Doğu'da veya dünyada hangi ülkede/şehirde geçiyor? Ana konumu belirle. Yaklaşık enlem ve boylamını bul.

HABER BAŞLIĞI: ${newsItem.title}
HABER İÇERİĞİ/ÖZETİ: ${newsItem.contentSnippet || newsItem.content || newsItem.summary || ''}

SADECE JSON ÇIKTISI VER (markdown tagi koyma!):
{
  "title": "Türkçe tarafsız başlık",
  "summary": "Türkçe tarafsız detaylı haber özeti, lütfen haberin önemli tüm detaylarını içeren daha uzun, 4-5 cümlelik zengin ve akıcı bir özet yaz.",

  "category": "Seçilen Kategori Adı",
  "location_name": "Şehir, Ülke",
  "lat": 33.0,
  "lng": 35.0,
  "trendScore": 85,
  "isBreaking": false
}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.2 }
        });

        let text = response.text.trim();
                if (text === 'null') {
            console.log(`  ⏭️ Atlandı (Orta Doğu ile ilgisiz): ${newsItem.title}`);
            return null;
        }


        if (text.startsWith("```json")) text = text.replace("```json", "");
        if (text.startsWith("```")) text = text.replace("```", "");
        if (text.endsWith("```")) text = text.substring(0, text.length - 3);

        const aiData = JSON.parse(text.trim());

        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            title: aiData.title,
            summary: aiData.summary,
            category: aiData.category,
                        imageUrl: imageUrl || 'https://via.placeholder.com/600x400?text=Orta+Dogu+Radar',

            timestamp: new Date().toISOString(),
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
        return null;
    }
}

function saveToDatabase(newItems) {
    try {
        let existingData = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
            existingData = JSON.parse(fileContent);
        }

        const combinedData = [...newItems, ...existingData];
        const trimmedData = combinedData.slice(0, 50);

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trimmedData, null, 4));
        console.log(`\n✅ Başarılı! Toplam ${newItems.length} haber kaydedildi.`);
    } catch (error) {
        console.error("❌ Dosya kaydetme hatası:", error.message);
    }
}

fetchAndProcessNews();
