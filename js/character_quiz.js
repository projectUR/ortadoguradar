// 1. KARAKTER HAVUZU
const quizCharacters = {
    A: [
        { name: "Saddam Hüseyin", image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Saddam_Hussein_in_1998.png", desc: "Tavizsiz, sert ve güce dayalı bir stratejistsin. Masada diplomasiyi sadece sahada kazandıktan sonra bir araç olarak kullanırsın." },
        { name: "Hafız Esad", image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Hafez_al-Assad_official_portrait.jpg", desc: "Sabırlı, acımasız ve uzun vadeli düşünen bir yapıya sahipsin. Beklemeyi ve rakiplerini birbirine düşürmeyi çok iyi biliyorsun." },
        { name: "Muammer Kaddafi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Muammar_al-Gaddafi_at_the_AU_summit.jpg/960px-Muammar_al-Gaddafi_at_the_AU_summit.jpg", desc: "Öngörülemez, ezber bozan ve tamamen kendine has bir lidersin. Kimsenin kurallarına uymadan kendi oyununu kurarsın." }
    ],
    B: [
        { name: "Cemal Abdünnasır", image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Nasser_in_1969.jpg", desc: "Kitleleri peşinden sürükleyen, karizmatik bir vizyonersin. Hitabetin ve birleştirici gücün senin en büyük silahın." },
        { name: "Yaser Arafat", image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Leader_of_the_PLO%2C_Yasser_Arafat%2C_1996_Dan_Hadani_Archive.jpg", desc: "Mücadeleden asla vazgeçmeyen, direnişin sembolüsün. En zor şartlarda bile hayatta kalmayı ve masada olmayı başarırsın." },
        { name: "Kral Hüseyin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/HusseinJordanien.jpg/960px-HusseinJordanien.jpg?utm_source=tr.wikipedia.org&utm_campaign=index&utm_content=thumbnail", desc: "Krizlerin ortasında dengede kalmayı başaran, kurnaz ve diplomatik bir lidersin. Fırtınaları yönetmekte üstüne yok." }
    ],
    C: [
        { name: "Şah Muhammed Rıza Pehlevi", image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Shah_Mohammad_Reza_Pahlavi%2C_1973.jpg", desc: "Batı vizyonlu, modernist ama bir o kadar da mesafeli bir stratejistsin. Gücünü küresel ittifaklardan ve ekonomiden alırsın." },
        { name: "Kral Faysal", image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/King_Faisal_bin_Abdulaziz.jpg", desc: "Sessiz, derinden ilerleyen ve elindeki kaynakları (petrol/ekonomi) ölümcül bir siyasi silaha dönüştüren zeki bir lidersin." }
    ],
    D: [
        { name: "Trenci Jack", image: "TrenciJack.png", desc: "Sahadaki kaosu uzaktan izleyen, görünmez ipleri elinde tutan bağımsız bir analistsin. Bilgi ve veri senin en büyük gücün." },
        { name: "Turgut Karahan", image: "TurgutKarahan.png", desc: "Bugünün ateşini dünün külleriyle okuyan, tarihin bilgeliğine sahip derin bir araştırmacısın. Stratejilerin asırlık." }
    ]
};

// 2. 10 SORULUK TEST VERİSİ (Linkler temizlendi, direkt isimleri yazıyor)
const quizData = [
    {
        q: "1. Sınırında beklenmedik bir kriz patlak verdi. İlk hamlen ne olur?",
        gif: "soru1.gif",
        opts: { A: "Ordumu derhal alarma geçirir, sınıra yığarım.", B: "Halka seslenir, kitleleri arkama alacak bir konuşma yaparım.", C: "Küresel müttefiklerimi arar, ekonomik kozlarımı masaya sürerim.", D: "Tüm istihbarat kanallarını açar, arka planı analiz ederim." }
    },
    {
        q: "2. Masada sana dayatılan adaletsiz bir antlaşma var. Ne yaparsın?",
        gif: "soru2.gif",
        opts: { A: "Masayı fiziksel olarak devirir, müzakereyi bitiririm.", B: "Basının önünde antlaşmayı yırtıp atarım.", C: "Kabul etmiş gibi görünüp arka planda kendi şartlarımı uygularım.", D: "Antlaşmanın yasal boşluklarını bulur, oradan vururum." }
    },
    {
        q: "3. Ülkenin ekonomisi darboğazda, acil nakit lazım. Çözümün nedir?",
        gif: "soru3.gif",
        opts: { A: "Zengin komşuların kaynaklarına göz dikerim.", B: "Halktan fedakarlık ister, milli bir seferberlik ilan ederim.", C: "Petrol/doğalgaz vanalarını silah olarak kullanıp piyasayı manipüle ederim.", D: "Yeni ticaret rotaları ve alternatif ekonomik paktlar geliştiririm." }
    },
    {
        q: "4. En güvendiğin komutanın/bakanın sana ihanet ettiğini öğrendin...",
        gif: "soru4.gif",
        opts: { A: "İbreti alem için en sert şekilde anında cezalandırırım.", B: "Onu halkın gözünde itibarsızlaştırır, sürgüne yollarım.", C: "Onu hala kullanabileceğim bir pozisyonda, şantajla kontrol altında tutarım.", D: "İhanetin arkasındaki asıl yabancı gücü bulmak için onu yem olarak kullanırım." }
    },
    {
        q: "5. Medyada senin hakkında çok büyük bir karalama kampanyası başladı.",
        gif: "soru5.gif",
        opts: { A: "Kampanyayı başlatan yayın organlarını derhal kapatırım.", B: "Daha coşkulu ve etkili bir karşı propaganda kampanyası başlatırım.", C: "Sermaye gücümle o medya kuruluşlarını dolaylı yoldan satın alırım.", D: "İddiaları çürütecek sızdırılmış belgelerle sessizce karşılık veririm." }
    },
    {
        q: "6. Eski bir düşmanın sana aniden zeytin dalı uzattı.",
        gif: "soru6.gif",
        opts: { A: "Zayıfladığını düşünür, tam da bu anı fırsat bilip saldırırım.", B: "Meydanlarda 'barışı biz dikte ettik' diyerek prestij toplarım.", C: "Barışı kabul ederim ama çok ağır ticari imtiyazlar kopararak.", D: "Niyetini test etmek için onu küçük bir diplomatik krize sokarım." }
    },
    {
        q: "7. Ülkenin gençliği sokaklarda protesto yapıyor. Yaklaşımın ne olur?",
        gif: "soru7.gif",
        opts: { A: "Taviz yok. Demir yumrukla sokakları anında temizlerim.", B: "Balkona çıkar, onları anladığımı söyleyen efsanevi bir konuşma yaparım.", C: "Protesto liderlerine perde arkasında pozisyon teklif edip hareketi bölerim.", D: "Sosyal medyadaki algıyı yönetir, ateşin kendi kendine sönmesini beklerim." }
    },
    {
        q: "8. Askeri bir geçit töreni düzenliyorsun. Odak noktasında ne var?",
        gif: "soru8.gif",
        opts: { A: "Devasa balistik füzeler ve ağır tank birlikleri.", B: "Milyonluk coşkulu halk kitleleri ve dev bayraklar.", C: "Son teknoloji hava savunma sistemleri ve lüks teçhizat.", D: "Siber savaş birimleri, İHA'lar ve özel kuvvetler." }
    },
    {
        q: "9. Küresel bir süper güç, iç işlerine müdahale etmeye kalkıştı.",
        gif: "soru9.gif",
        opts: { A: "Sert bir rest çeker, doğrudan tehdit ederim.", B: "Bölgesel bir ittifak kurup anti-emperyalist bir cephe oluştururum.", C: "Kapalı kapılar ardında tavizler vererek denge politikası güderim.", D: "Sessiz kalıp onların bölgedeki zayıf noktasını bulana kadar beklerim." }
    },
    {
        q: "10. Senin için nihai başarı nedir?",
        gif: "soru10.gif",
        opts: { A: "Tüm düşmanların diz çöktüğü mutlak ve sarsılmaz bir güç.", B: "Tarihe geçmiş, nesiller boyu hatırlanacak efsanevi bir isim olmak.", C: "Bölgenin en zengin, en refah ve dokunulmaz ülkesi olmak.", D: "Herkesin kendi oyununu oynadığını sandığı masada kuralları benim yazmam." }
    }
];

// 3. OYUN MOTORU
let currentQuizStep = 0;
let quizScores = { A: 0, B: 0, C: 0, D: 0 };

function startCharacterQuiz() {
    // HATA BURADAYDI! Artık arkadaki butonları GİZLEMİYORUZ. Sadece pop-up'ı açıyoruz.
    document.getElementById('characterQuizContainer').style.display = 'flex';
    document.getElementById('quiz-card').style.display = 'block';
    document.getElementById('quiz-result').classList.add('hidden');

    currentQuizStep = 0;
    quizScores = { A: 0, B: 0, C: 0, D: 0 };
    loadQuestion();
}

function loadQuestion() {
    if (currentQuizStep >= quizData.length) {
        showQuizResult();
        return;
    }

    const qData = quizData[currentQuizStep];
    document.getElementById('quiz-progress').innerText = `Soru: ${currentQuizStep + 1} / 10`;
    document.getElementById('quiz-question').innerText = qData.q;
    document.getElementById('quiz-gif').src = qData.gif;

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    optionsDiv.style.display = 'grid';
    optionsDiv.style.gridTemplateColumns = '1fr 1fr';
    optionsDiv.style.gap = '10px';

    for (const [key, text] of Object.entries(qData.opts)) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.cssText = "background: #1a1a1a; border: 1px solid #333; color: #ccc; padding: 12px; border-radius: 8px; text-align: left; font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease; min-height: 65px; display: flex; align-items: center;";
        btn.onmouseover = () => { btn.style.borderColor = '#ff9f43'; btn.style.color = '#fff'; btn.style.transform = 'translateY(-2px)'; };
        btn.onmouseout = () => { btn.style.borderColor = '#333'; btn.style.color = '#ccc'; btn.style.transform = 'translateY(0)'; };
        btn.onclick = () => selectQuizOption(key);
        optionsDiv.appendChild(btn);
    }
}

function selectQuizOption(optKey) {
    quizScores[optKey]++;
    currentQuizStep++;
    loadQuestion();
}

function showQuizResult() {
    document.getElementById('quiz-card').style.display = 'none';
    document.getElementById('quiz-result').classList.remove('hidden');

    let topChoice = 'A';
    let maxScore = 0;
    for (const [key, score] of Object.entries(quizScores)) {
        if (score > maxScore) {
            maxScore = score;
            topChoice = key;
        }
    }

    const pool = quizCharacters[topChoice];
    const finalCharacter = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById('result-character').innerText = finalCharacter.name;
    document.getElementById('result-image').src = finalCharacter.image;
    document.getElementById('result-desc').innerText = finalCharacter.desc;
}

function closeQuiz() {
    // Sadece pop-up'ı gizle, arkadaki grid sistemine hiç dokunma
    document.getElementById('characterQuizContainer').style.display = 'none';
}

function restartQuiz() {
    startCharacterQuiz();
}
