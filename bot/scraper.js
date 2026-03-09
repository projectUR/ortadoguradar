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
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const parser = new Parser();

const RSS_FEEDS = [
    { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" }
];
const OUTPUT_FILE = path.resolve('../data/mock_news.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAndProcessNews() {
    console.log("📡 Orta Doğu Radar Botu Başlatıldı...");
    let allNews = [];

    for (const feedConfig of RSS_FEEDS) {
        console.log(`\n⏳ Veri çekiliyor: ${feedConfig.source}...`);
        try {
            const feed = await parser.parseURL(feedConfig.url);
            const topItems = feed.items.slice(0, 5);

            for (const item of topItems) {
                console.log(`  - İşleniyor: ${item.title}`);
                const aiResult = await paraphraseWithAI(item, feedConfig.source);
                if (aiResult) allNews.push(aiResult);
                await delay(2000);
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
Aşağıda İngilizce veya Arapça olabilen bir Orta Doğu haberinin başlığı ve özeti var.
Bu haberi Türkçe olarak TARAfsız, yorumsuz (paraphrase edilmiş) bir şekilde özetle.

Ayrıca kategorilerden HANGİSİNE uygun seç (Birini seç):
[Diplomatik, Ekonomik, Çatışma ve Güvenlik, Toplum ve İnsan Hakları, Enerji ve Altyapı, Çevre ve İklim, Tümü]

Son olarak bu haber Orta Doğu'da veya dünyada hangi ülkede/şehirde geçiyor? Ana konumu belirle. Yaklaşık enlem ve boylamını bul.

HABER BAŞLIĞI: ${newsItem.title}
HABER İÇERİĞİ/ÖZETİ: ${newsItem.contentSnippet || newsItem.content || newsItem.summary || ''}

SADECE JSON ÇIKTISI VER (markdown tagi koyma!):
{
  "title": "Türkçe tarafsız başlık",
  "summary": "Türkçe tarafsız haber özeti (2-3 cümle)",
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

        let text = response.text().trim();
        if (text.startsWith("```json")) text = text.replace("```json", "");
        if (text.startsWith("```")) text = text.replace("```", "");
        if (text.endsWith("```")) text = text.substring(0, text.length - 3);

        const aiData = JSON.parse(text.trim());

        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            title: aiData.title,
            summary: aiData.summary,
            category: aiData.category,
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
