/* ===================================================
   KİM BİR MİLYON VARİL İSTER? - OYUN MOTORU
   =================================================== */

// 1. Ödül Merdiveni (Aşağıdan yukarıya 1'den 12'ye)
const oilPrizeLadder = [
    { level: 1, val: "1.000", isMilestone: false },
    { level: 2, val: "2.000", isMilestone: true },   // 1. BARAJ
    { level: 3, val: "3.000", isMilestone: false },
    { level: 4, val: "5.000", isMilestone: false },
    { level: 5, val: "7.500", isMilestone: false },
    { level: 6, val: "10.000", isMilestone: false },
    { level: 7, val: "30.000", isMilestone: true },  // 2. BARAJ
    { level: 8, val: "50.000", isMilestone: false },
    { level: 9, val: "100.000", isMilestone: false },
    { level: 10, val: "200.000", isMilestone: false },
    { level: 11, val: "400.000", isMilestone: false },
    { level: 12, val: "1.000.000", isMilestone: true } // FİNAL
];

// 2. Çekirdek Soru Havuzu (Test İçin - Sonra büyüteceğiz)
const oilQuestionPool = {
    easy: [
        { q: "Hangi Orta Doğu ülkesinin bayrağında 'Sedir Ağacı' bulunur?", options: ["Suriye", "Ürdün", "Lübnan", "Filistin"], answer: "Lübnan" },
        { q: "Dünyanın en yüksek binası olan Burç Halife hangi şehirdedir?", options: ["Riyad", "Doha", "Abu Dabi", "Dubai"], answer: "Dubai" },
       { q: "Mısır'ın başkenti aşağıdakilerden hangisidir?", options: ["Kahire", "İskenderiye", "Lübnan", "Amman"], answer: "Kahire" },
        { q: "Dünyanın en büyük petrol ihracatçısı ülkelerinden biri olan Suudi Arabistan'ın başkenti neresidir?", options: ["Cidde", "Medine", "Riyad", "Dammam"], answer: "Riyad" },
        { q: "Bayrağında 'Hilal ve Yıldız' bulunan, kıtaları birbirine bağlayan Orta Doğu ülkesi hangisidir?", options: ["İran", "Türkiye", "Irak", "Suriye"], answer: "Türkiye" },
        { q: "Nil Nehri hangi ülkeden geçerek Akdeniz'e dökülür?", options: ["Libya", "Ürdün", "Mısır", "Kuveyt"], answer: "Mısır" },
        { q: "Orta Doğu'nun en popüler yiyeceklerinden biri olan, nohutla yapılan mezenin adı nedir?", options: ["Falafel", "Humus", "Tabule", "Kebap"], answer: "Humus" },
        { q: "Kutsal şehir Mekke hangi ülkenin sınırları içerisindedir?", options: ["Bae", "Katar", "Suudi Arabistan", "Umman"], answer: "Suudi Arabistan" },
        { q: "Dünyanın en yüksek binası 'Burç Halife' hangi emirlikte bulunur?", options: ["Abu Dabi", "Dubai", "Şarika", "Acman"], answer: "Dubai" },
        { q: "Petra Antik Kenti hangi Orta Doğu ülkesinin en önemli turizm merkezidir?", options: ["Lübnan", "Ürdün", "Suriye", "Yemen"], answer: "Ürdün" },
        { q: "Lübnan'ın başkenti neresidir?", options: ["Trablus", "Sayda", "Beyrut", "Baalbek"], answer: "Beyrut" },
        { q: "İran'ın resmi dili aşağıdakilerden hangisidir?", options: ["Arapça", "Farsça", "Türkçe", "Urduca"], answer: "Farsça" },
        { q: "Bağdat hangi ülkenin başkentidir?", options: ["Kuveyt", "Ürdün", "Suriye", "Irak"], answer: "Irak" },
        { q: "Hangisi Basra Körfezi'ne kıyısı olan bir ülkedir?", options: ["Lübnan", "Kuveyt", "Fas", "Tunus"], answer: "Kuveyt" },
        { q: "Orta Doğu'da hem Asya hem de Afrika kıtasında toprakları bulunan ülke hangisidir?", options: ["Türkiye", "Mısır", "İsrail", "Suudi Arabistan"], answer: "Mısır" },
        { q: "Hangi ülke tamamen bir ada devletidir?", options: ["Bahreyn", "Katar", "Umman", "Yemen"], answer: "Bahreyn" },
        { q: "Ölü Deniz (Lut Gölü) hangi iki ülke arasındadır?", options: ["Suriye-Irak", "İsrail-Ürdün", "Mısır-Libya", "Lübnan-Suriye"], answer: "İsrail-Ürdün" },
        { q: "Katar'ın başkenti neresidir?", options: ["Manama", "Maskat", "Doha", "Riyad"], answer: "Doha" },
        { q: "Şam (Damas) şehri hangi ülkenin başkentidir?", options: ["Lübnan", "Ürdün", "Suriye", "Irak"], answer: "Suriye" },
        { q: "Orta Doğu'nun 'Paris'i' olarak bilinen şehir hangisidir?", options: ["Bağdat", "Beyrut", "Tahran", "Dubai"], answer: "Beyrut" },
        { q: "Büyük Sahra Çölü hangi kıtada bulunur?", options: ["Asya", "Avrupa", "Afrika", "Avustralya"], answer: "Afrika" },
        { q: "Maskat şehri hangi ülkenin başkentidir?", options: ["Umman", "Yemen", "Kuveyt", "Bahreyn"], answer: "Umman" },
        { q: "Süveyş Kanalı'nı kontrol eden ülke hangisidir?", options: ["İsrail", "Mısır", "Suudi Arabistan", "Ürdün"], answer: "Mısır" },
        { q: "Hangisi Orta Doğu'da kullanılan yaygın bir para birimidir?", options: ["Euro", "Dinar", "Yen", "Peso"], answer: "Dinar" },
        { q: "Hazar Denizi'ne kıyısı olan büyük Orta Doğu ülkesi hangisidir?", options: ["İrak", "İran", "Kuveyt", "Suriye"], answer: "İran" },
        { q: "Kudüs şehri hangi bölge için kutsal kabul edilir?", options: ["Sadece Müslümanlar", "Sadece Hristiyanlar", "Sadece Yahudiler", "Semavi Dinlerin Tamamı"], answer: "Semavi Dinlerin Tamamı" },
        { q: "Ankara hangi ülkenin başkentidir?", options: ["Suriye", "Irak", "İran", "Türkiye"], answer: "Türkiye" },
{ q: "Umman Denizi ile Basra Körfezi'ni birbirine bağlayan stratejik boğazın adı nedir?", options: ["Süveyş", "Hürmüz", "Cebelitarık", "İstanbul"], answer: "Hürmüz" },
        { q: "Suudi Arabistan'da hangi önemli liman şehri Kızıldeniz kıyısında bulunur?", options: ["Riyad", "Cidde", "Dammam", "Tebük"], answer: "Cidde" },
        { q: "İran'ın para birimi nedir?", options: ["Dinar", "Riyal", "Lira", "Dirhem"], answer: "Riyal" },
        { q: "Filistin halkının bağımsızlık mücadelesinde sembolleşen bitki hangisidir?", options: ["Zeytin Dalı", "Gül", "Lale", "Çam"], answer: "Zeytin Dalı" },
        { q: "Hangisi Orta Doğu'daki zengin petrol ülkelerinden biridir?", options: ["Lübnan", "Kuveyt", "Ürdün", "Eritre"], answer: "Kuveyt" },
        { q: "Mısır'daki ünlü piramitlerin bulunduğu bölgenin adı nedir?", options: ["Giza", "İskenderiye", "Luksor", "Asvan"], answer: "Giza" },
        { q: "Lübnan bayrağındaki ağaç hangi türdür?", options: ["Meşe", "Sedir", "Zeytin", "Palmiye"], answer: "Sedir" },
        { q: "Ürdün'ün başkenti neresidir?", options: ["Akabe", "Amman", "Zarka", "İrbid"], answer: "Amman" },
        { q: "Basra Körfezi'nde bulunan küçük ada ülkesi hangisidir?", options: ["Kıbrıs", "Bahreyn", "Madagaskar", "Girit"], answer: "Bahreyn" },
        { q: "Birleşik Arap Emirlikleri'nin başkenti neresidir?", options: ["Dubai", "Şarika", "Abu Dabi", "Acman"], answer: "Abu Dabi" },
        { q: "Hangi Orta Doğu ülkesi Akdeniz'e kıyısı olan bir Arap ülkesidir?", options: ["İran", "Kuveyt", "Lübnan", "Umman"], answer: "Lübnan" },
        { q: "Tahran hangi ülkenin başkentidir?", options: ["Irak", "İran", "Afganistan", "Pakistan"], answer: "İran" },
        { q: "Orta Doğu'nun en uzun nehri hangisidir?", options: ["Dicle", "Fırat", "Nil", "Asi"], answer: "Nil" },
        { q: "Kuveyt'in para birimi olan 'Kuveyt Dinarı' dünyanın en değerli paralarından mıdır?", options: ["Evet", "Hayır", "Bilinmiyor", "Eskiden öyleydi"], answer: "Evet" },
        { q: "Yemen'in başkenti aşağıdakilerden hangisidir?", options: ["Aden", "Sana", "Taiz", "Hudeyde"], answer: "Sana" },
        { q: "Erbil şehri hangi ülkenin sınırları içerisindedir?", options: ["İran", "Suriye", "Irak", "Türkiye"], answer: "Irak" },
        { q: "Hangisi bir petrol türevidir?", options: ["Kömür", "Benzin", "Odun", "Uranyum"], answer: "Benzin" },
        { q: "Basra şehri hangi ülkenin önemli bir limanıdır?", options: ["İran", "Irak", "Katar", "Kuveyt"], answer: "Irak" },
        { q: "Orta Doğu'da çöl ikliminde ulaşım ve taşıma için tarih boyunca en çok kullanılan hayvan hangisidir?", options: ["At", "Fil", "Deve", "Eşek"], answer: "Deve" },
        { q: "Orta Doğu'da 'Siyah Altın' olarak adlandırılan doğal kaynak nedir?", options: ["Kömür", "Petrol", "Demir", "Bakır"], answer: "Petrol" },
        { q: "Balkanlar ile Orta Doğu arasında köprü görevi gören şehir hangisidir?", options: ["İstanbul", "Atina", "Sofya", "Bağdat"], answer: "İstanbul" },
        { q: "Dünyanın en tuzlu su kütlelerinden biri olan göl hangisidir?", options: ["Van Gölü", "Lut Gölü", "Hazar Denizi", "Aral Gölü"], answer: "Lut Gölü" },
        { q: "Birleşik Arap Emirlikleri'nin para birimi nedir?", options: ["Riyal", "Dinar", "Dirhem", "Lira"], answer: "Dirhem" },
        { q: "Gazze Şeridi hangi denizin kıyısındadır?", options: ["Kızıldeniz", "Akdeniz", "Ölü Deniz", "Basra Körfezi"], answer: "Akdeniz" },
        { q: "Büyük Gize Sfenksi hangi ülkededir?", options: ["Irak", "Mısır", "İran", "Ürdün"], answer: "Mısır" },
{ q: "Müslümanlar için kutsal olan Kabe hangi şehirdedir?", options: ["Medine", "Kudüs", "Mekke", "Bağdat"], answer: "Mekke" },
        { q: "Modern Türkiye Cumhuriyeti'nin kurucusu kimdir?", options: ["İsmet İnönü", "Mustafa Kemal Atatürk", "Fevzi Çakmak", "Adnan Menderes"], answer: "Mustafa Kemal Atatürk" },
        { q: "Orta Doğu mutfağında çok sevilen, kızarmış nohut köftesine ne ad verilir?", options: ["Kibbeh", "Falafel", "Lahmacun", "Şavurma"], answer: "Falafel" },
        { q: "Libya'nın başkenti aşağıdakilerden hangisidir?", options: ["Trablus", "Bingazi", "Tobruk", "Misrata"], answer: "Trablus" },
        { q: "Dünyanın en büyük kum çölü olan 'Rubülhali' hangi yarımadadadır?", options: ["Sinan Yarımadası", "Arap Yarımadası", "Anadolu", "Katar"], answer: "Arap Yarımadası" },
        { q: "Lübnanlı dünyaca ünlü şarkıcı hangisidir?", options: ["Fairuz", "Amr Diab", "Nancy Ajram", "Tarkan"], answer: "Fairuz" },
        { q: "Orta Doğu'da 'Mağrip' ülkeleri olarak bilinen bölge hangi yöndedir?", options: ["Doğu", "Batı", "Kuzey", "Güney"], answer: "Batı" },
        { q: "Mescid-i Aksa hangi şehirdedir?", options: ["Mekke", "Medine", "Kudüs", "Şam"], answer: "Kudüs" },
        { q: "Hangi ülke hem Akdeniz'e hem de Kızıldeniz'e kıyısı olan stratejik bir konumdadır?", options: ["Suudi Arabistan", "Mısır", "Ürdün", "İsrail"], answer: "Mısır" },
        { q: "Arapça'da 'Burç' kelimesi ne anlama gelir?", options: ["Saray", "Kule", "Kale", "Ev"], answer: "Kule" },
        { q: "Bahreyn'in başkenti neresidir?", options: ["Doha", "Manama", "Maskat", "Kuveyt City"], answer: "Manama" },
        { q: "Irak'ın resmi para birimi nedir?", options: ["Lira", "Dolar", "Irak Dinarı", "Riyal"], answer: "Irak Dinarı" },
        { q: "Halep şehri hangi Orta Doğu ülkesindedir?", options: ["Irak", "Lübnan", "Suriye", "Ürdün"], answer: "Suriye" },
        { q: "Orta Doğu'da geleneksel olarak giyilen beyaz erkek bornozuna/elbisesine ne denir?", options: ["Fistan", "Entari", "Kandura (Savb)", "Kaftan"], answer: "Kandura (Savb)" },
        { q: "Hangi körfez petrol taşımacılığında dünyanın en kritik noktalarından biridir?", options: ["Meksika Körfezi", "Basra Körfezi", "Bengal Körfezi", "Finlandiya Körfezi"], answer: "Basra Körfezi" },
        { q: "Kudüs'teki 'Ağlama Duvarı' hangi din için en kutsal mekanlardan biridir?", options: ["Müslümanlık", "Hristiyanlık", "Yahudilik", "Budizm"], answer: "Yahudilik" },
        { q: "Hurma üretimiyle ünlü, Suudi Arabistan'daki kutsal şehir hangisidir?", options: ["Riyad", "Cidde", "Medine", "Tebük"], answer: "Medine" },
        { q: "Türkiye'nin en kalabalık ve Orta Doğu'nun en önemli ticaret merkezlerinden olan şehri?", options: ["Ankara", "İzmir", "İstanbul", "Gaziantep"], answer: "İstanbul" },
        { q: "Sina Yarımadası hangi ülkeye aittir?", options: ["İsrail", "Mısır", "Ürdün", "Suudi Arabistan"], answer: "Mısır" },
        { q: "Hangi hayvan 'Çöl Gemisi' olarak adlandırılır?", options: ["At", "Eşek", "Deve", "Öküz"], answer: "Deve" },
        { q: "Ünlü 'Babil'in Asma Bahçeleri' hangi modern ülkenin sınırları içindeydi?", options: ["Suriye", "Irak", "İran", "Mısır"], answer: "Irak" },
        { q: "Orta Doğu'da en yaygın konuşulan dil ailesi hangisidir?", options: ["Türk dilleri", "Hint-Avrupa dilleri", "Sami dilleri (Arapça)", "Slav dilleri"], answer: "Sami dilleri (Arapça)" },
        { q: "Akabe Limanı hangi ülkenin denize açılan tek kapısıdır?", options: ["Irak", "Ürdün", "Suriye", "Lübnan"], answer: "Ürdün" },
        { q: "Hangisi bir Orta Doğu ülkesi değildir?", options: ["Umman", "Lübnan", "İtalya", "Katar"], answer: "İtalya" },
        { q: "Arap Yarımadası'nın en güneyinde bulunan ülke hangisidir?", options: ["Yemen", "Kuveyt", "Ürdün", "Suriye"], answer: "Yemen" },
{ q: "Hangi Orta Doğu şehri 'Binbir Gece Masalları' ile özdeşleşmiştir?", options: ["Bağdat", "Kahire", "Tahran", "Riyad"], answer: "Bağdat" },
        { q: "2022 Dünya Kupası'na ev sahipliği yapan Orta Doğu ülkesi hangisidir?", options: ["Suudi Arabistan", "Katar", "Birleşik Arap Emirlikleri", "Kuveyt"], answer: "Katar" },
        { q: "Arapça'da 'Selam' kelimesinin temel anlamı nedir?", options: ["Savaş", "Barış", "Yemek", "Yolculuk"], answer: "Barış" },
        { q: "Mısır'ın meşhur 'İskenderiye' şehri hangi denizin kıyısındadır?", options: ["Kızıldeniz", "Hazar Denizi", "Akdeniz", "Umman Denizi"], answer: "Akdeniz" },
        { q: "Orta Doğu'da misafirlere ikram edilen en yaygın sıcak içecek ikilisi hangisidir?", options: ["Çay ve Kahve", "Süt ve Bal", "Meyve Suyu ve Soda", "Kola ve Ayran"], answer: "Çay ve Kahve" },
        { q: "Suriye'nin en önemli liman şehri aşağıdakilerden hangisidir?", options: ["Lazkiye", "Humus", "Hama", "İdlib"], answer: "Lazkiye" },
        { q: "Basra Körfezi'ni Umman Denizi'ne bağlayan stratejik su yolu?", options: ["İstanbul Boğazı", "Hürmüz Boğazı", "Süveyş Kanalı", "Korint Kanalı"], answer: "Hürmüz Boğazı" },
        { q: "Orta Doğu'da 'Dicle' ve 'Fırat' nehirleri hangi ülkede birleşerek Şattülarap'ı oluşturur?", options: ["Suriye", "Türkiye", "Irak", "Kuveyt"], answer: "Irak" },
        { q: "İran'ın en büyük ve en kalabalık şehri neresidir?", options: ["İsfahan", "Şiraz", "Tahran", "Tebriz"], answer: "Tahran" },
        { q: "Dünyanın en tuzlu denizlerinden biri olan ve kıyısında Ürdün'ün bulunduğu yer?", options: ["Lut Gölü", "Van Gölü", "Eğirdir Gölü", "Baykal Gölü"], answer: "Lut Gölü" },
        { q: "Hangi ülke bayrağında 'Kılıç' sembolü bulunur?", options: ["Irak", "Suudi Arabistan", "Katar", "Umman"], answer: "Suudi Arabistan" },
        { q: "Lübnan'ın meşhur, bulgur ve maydanozla yapılan salatasının adı nedir?", options: ["Humus", "Tabule", "Müceddere", "Fettuş"], answer: "Tabule" },
        { q: "Birleşik Arap Emirlikleri'nde kaç tane emirlik bulunmaktadır?", options: ["5", "7", "9", "12"], answer: "7" },
        { q: "Mekke ve Medine şehirlerini içinde barındıran bölgeye ne ad verilir?", options: ["Hicaz", "Nejd", "Mezopotamya", "Mağrip"], answer: "Hicaz" },
        { q: "Bağdat'ın ortasından geçen ünlü nehir hangisidir?", options: ["Fırat", "Nil", "Dicle", "Asi"], answer: "Dicle" },
        { q: "Orta Doğu'nun en büyük petrol arama şirketlerinden olan 'Aramco' hangi ülkenindir?", options: ["Kuveyt", "Birleşik Arap Emirlikleri", "Suudi Arabistan", "İran"], answer: "Suudi Arabistan" },
        { q: "Arap Yarımadası'nın en doğusunda yer alan ülke hangisidir?", options: ["Umman", "Yemen", "Kuveyt", "Ürdün"], answer: "Umman" },
        { q: "Hangisi Orta Doğu ülkelerinin çoğunda hafta sonu tatilinin başladığı gündür?", options: ["Cuma", "Pazartesi", "Çarşamba", "Cumartesi"], answer: "Cuma" },
        { q: "Mısır'daki büyük barajın adı nedir?", options: ["Atatürk Barajı", "Asvan Barajı", "Hoover Barajı", "Kebap Barajı"], answer: "Asvan Barajı" },
        { q: "Orta Doğu'da kullanılan en yaygın alfabe hangisidir?", options: ["Latin Alfabesi", "Kiril Alfabesi", "Arap Alfabesi", "Çin Alfabesi"], answer: "Arap Alfabesi" },
        { q: "Suriye'nin para birimi nedir?", options: ["Suriye Lirası", "Suriye Dinarı", "Suriye Riyali", "Suriye Dirhemi"], answer: "Suriye Lirası" },
        { q: "Katar ve Bahreyn hangi körfezin kıyısındadır?", options: ["Aden Körfezi", "Basra Körfezi", "Akabe Körfezi", "İskenderun Körfezi"], answer: "Basra Körfezi" },
        { q: "Arapça'da 'Cezire' kelimesi ne anlama gelir?", options: ["Dağ", "Ada", "Çöl", "Şehir"], answer: "Ada" },
        { q: "Orta Doğu'da yer alan 'Bereketli Hilal' bölgesinin bir parçası olan ülke hangisidir?", options: ["Irak", "Fas", "Moritanya", "Cezayir"], answer: "Irak" },
        { q: "Filistin'in simgesi olan geleneksel siyah-beyaz işlemeli atkıya ne denir?", options: ["Fes", "Kefiye", "Sarık", "Abaya"], answer: "Kefiye" },
    ],

    medium: [
        { q: "1916'da Osmanlı'nın Orta Doğu topraklarını paylaşan gizli antlaşma hangisidir?", options: ["Sevr", "Balfour", "Sykes-Picot", "Lozan"], answer: "Sykes-Picot" },
        { q: "OPEC'in merkezi hangi Avrupa şehrindedir?", options: ["Cenevre", "Viyana", "Paris", "Brüksel"], answer: "Viyana" },
        { q: "Mısır ile İsrail arasında 1978'de imzalanan barış antlaşmasının adı nedir?", options: ["Camp David", "Oslo", "Madrid", "İbrahim"], answer: "Camp David" },
        { q: "Dünyanın en büyük sıvılaştırılmış doğal gaz (LNG) ihracatçılarından olan yarımada ülkesi?", options: ["Umman", "Bahreyn", "Katar", "Kuveyt"], answer: "Katar" },
        { q: "Kızıldeniz'i Akdeniz'e bağlayan stratejik su yolunun adı nedir?", options: ["Hürmüz Boğazı", "Süveyş Kanalı", "Cebelitarık", "Babulmendep"], answer: "Süveyş Kanalı" },
       { q: "1960 yılında kurulan OPEC'in (Petrol İhraç Eden Ülkeler Örgütü) kurucu üyelerinden olmayan ülke hangisidir?", options: ["Irak", "İran", "Kuveyt", "Mısır"], answer: "Mısır" },
        { q: "Mısır Cumhurbaşkanı Enver Sedat'ın İsrail ile barış yaptığı için suikasta uğramasına neden olan antlaşma hangisidir?", options: ["Oslo", "Camp David", "Londra", "Paris"], answer: "Camp David" },
        { q: "İran'da 1950'lerde petrolü millileştirdiği için darbe ile devrilen Başbakan kimdir?", options: ["Muhammed Musaddık", "Rıza Pehlevi", "Ayetullah Humeyni", "Ali Hameney"], answer: "Muhammed Musaddık" },
        { q: "1917 yılında Filistin'de bir Yahudi yurdu kurulmasını destekleyen İngiliz belgesinin adı nedir?", options: ["Balfour Deklarasyonu", "Magna Carta", "Sevr Antlaşması", "Balfour Doktrini"], answer: "Balfour Deklarasyonu" },
        { q: "Lübnan'da 1975 ile 1990 yılları arasında süren yıkıcı olayların genel adı nedir?", options: ["Lübnan İç Savaşı", "Lübnan Devrimi", "Ekim Savaşı", "Sedir İntifadası"], answer: "Lübnan İç Savaşı" },
        { q: "Süveyş Kanalı'nı 1956 yılında millileştirerek dünya krizine yol açan Mısır lideri kimdir?", options: ["Hüsnü Mübarek", "Enver Sedat", "Cemal Abdülhasır", "Muhammed Mursi"], answer: "Cemal Abdülhasır" },
        { q: "Muammer Kaddafi'nin kendi siyasi felsefesini anlattığı ünlü kitabın adı nedir?", options: ["Kızıl Kitap", "Yeşil Kitap", "Mavi Kitap", "Büyük Nutuk"], answer: "Yeşil Kitap" },
        { q: "1980-1988 yılları arasında süren ve 'Tanker Savaşları'na da sahne olan savaş hangi iki ülke arasındadır?", options: ["İran-Irak", "Irak-Kuveyt", "Mısır-İsrail", "Suriye-Lübnan"], answer: "İran-Irak" },
        { q: "Osmanlı İmparatorluğu'na karşı 'Büyük Arap İsyanı'nı başlatan Mekke Şerifi kimdir?", options: ["Şerif Hüseyin", "Kral Faysal", "Kral Abdullah", "Suud bin Abdülaziz"], answer: "Şerif Hüseyin" },
        { q: "Müslüman Kardeşler (İhvan-ı Müslimin) teşkilatı ilk olarak hangi ülkede kurulmuştur?", options: ["Ürdün", "Mısır", "Suriye", "Irak"], answer: "Mısır" },
        { q: "İran İslam Devrimi hangi yıl gerçekleşmiş ve Şah rejimi yıkılmıştır?", options: ["1973", "1979", "1982", "1990"], answer: "1979" },
        { q: "Orta Doğu'da hem İsrail hem de Lübnan ile sınırı olan, Golan Tepeleri davasıyla bilinen ülke hangisidir?", options: ["Ürdün", "Suriye", "Irak", "Mısır"], answer: "Suriye" },
        { q: "2010 yılında Tunus'ta başlayıp tüm Orta Doğu'yu etkileyen protesto dalgasına ne ad verilir?", options: ["Kadife Devrim", "Arap Baharı", "Lale Devri", "Siyah Ocak"], answer: "Arap Baharı" },
        { q: "İsrail Devleti hangi yıl kurulmuş ve ilk Arap-İsrail Savaşı başlamıştır?", options: ["1923", "1945", "1948", "1956"], answer: "1948" },
        { q: "Hangi şehir hem İsrail hem de Filistin tarafından başkent olarak talep edilmektedir?", options: ["Tel Aviv", "Gazze", "Kudüs", "Ramallah"], answer: "Kudüs" },
        { q: "Irak'ın 1990 yılında ilhak ederek Birinci Körfez Savaşı'na yol açtığı komşusu hangisidir?", options: ["Suudi Arabistan", "İran", "Ürdün", "Kuveyt"], answer: "Kuveyt" },
        { q: "Baas Partisi (Yeniden Doğuş) hangi iki ülkede uzun yıllar iktidarda kalmıştır?", options: ["Mısır-Libya", "Irak-Suriye", "Ürdün-Lübnan", "İran-Irak"], answer: "Irak-Suriye" },
        { q: "Modern Türkiye'de 1928 yılında gerçekleşen 'Harf Devrimi' ile hangi alfabeye geçilmiştir?", options: ["Arap", "Latin", "Kiril", "Yunan"], answer: "Latin" },
        { q: "Suudi Arabistan'ın resmi mezhebi olarak bilinen ve krallığın temelini oluşturan dini akım hangisidir?", options: ["Zeydiyye", "Vahhabilik", "İsmailiyye", "Caferilik"], answer: "Vahhabilik" },
        { q: "Filistin Kurtuluş Örgütü'nün (FKÖ) efsanevi lideri kimdir?", options: ["Yaser Arafat", "Mahmud Abbas", "İsmail Haniye", "Halid Meşal"], answer: "Yaser Arafat" },
        { q: "Katar merkezli, Orta Doğu'nun en etkili yayın organlarından biri olan haber kanalı hangisidir?", options: ["Al Arabiya", "Al Jazeera", "BBC Arabic", "TRT Arabi"], answer: "Al Jazeera" },
        { q: "Hangi Orta Doğu ülkesinde Cumhurbaşkanının Maruni Hristiyan, Başbakanın Sünni Müslüman olması anayasal bir zorunluluktur?", options: ["Suriye", "Irak", "Lübnan", "Mısır"], answer: "Lübnan" },
        { q: "2020 yılında Birleşik Arap Emirlikleri ve Bahreyn'in İsrail ile ilişkilerini normalleştirdiği anlaşmaların adı nedir?", options: ["Oslo Anlaşmaları", "Abraham (İbrahim) Anlaşmaları", "Madrid Protokolü", "Wye River Muhtırası"], answer: "Abraham (İbrahim) Anlaşmaları" },
        { q: "Saddam Hüseyin hangi yıl yakalanmış ve Irak'ta Baas rejimi resmen sona ermiştir?", options: ["1991", "2003", "2006", "2011"], answer: "2003" },
        { q: "Dünyanın en dar stratejik su yollarından olan ve Yemen ile Cibuti arasında kalan boğaz hangisidir?", options: ["Hürmüz Boğazı", "Babulmendep Boğazı", "Süveyş Kanalı", "Malakka Boğazı"], answer: "Babulmendep Boğazı" },
{ q: "1967 yılında gerçekleşen ve İsrail'in sınırlarını genişlettiği savaşın adı nedir?", options: ["Yom Kippur Savaşı", "Altı Gün Savaşı", "Süveyş Krizi", "Lübnan Savaşı"], answer: "Altı Gün Savaşı" },
        { q: "İsrail'i tanıyan ilk Arap ülkesi aşağıdakilerden hangisidir?", options: ["Ürdün", "Mısır", "Suriye", "Lübnan"], answer: "Mısır" },
        { q: "Körfez İşbirliği Konseyi'nin (KİK) merkezi hangi şehirdedir?", options: ["Kuveyt", "Doha", "Riyad", "Abu Dabi"], answer: "Riyad" },
        { q: "1990'lı yıllarda İsrail ve Filistin arasında imzalanan ve barış umudu yaratan antlaşmaların genel adı nedir?", options: ["Oslo Anlaşmaları", "Paris Protokolü", "Madrid Konferansı", "Londra Paktı"], answer: "Oslo Anlaşmaları" },
        { q: "Saddam Hüseyin'in iktidara geldiği ve 2003'e kadar yönettiği siyasi partinin adı nedir?", options: ["Hizbullah", "Hamas", "Baas Partisi", "İhvan"], answer: "Baas Partisi" },
        { q: "Suudi Arabistan'ın 'Vizyon 2030' projesinin mimarı olan Veliaht Prens kimdir?", options: ["Muhammed bin Selman", "Nayif bin Abdülaziz", "Faysal bin Suud", "Velid bin Talal"], answer: "Muhammed bin Selman" },
        { q: "Arapça'da 'Ayaklanma' anlamına gelen ve Filistinlilerin İsrail'e karşı başlattığı halk hareketlerine ne denir?", options: ["Cihad", "İntifada", "Fetih", "Dava"], answer: "İntifada" },
        { q: "Orta Doğu'da en büyük doğal gaz rezervlerine sahip olan ve 'Kuzey Sahası'nı İran ile paylaşan ülke?", options: ["Bahreyn", "Kuveyt", "Katar", "Umman"], answer: "Katar" },
        { q: "1920 yılında imzalanan ve Orta Doğu'daki Arap topraklarını İngiltere ve Fransa mandasına bırakan konferans hangisidir?", options: ["San Remo Konferansı", "Yalta Konferansı", "Berlin Konferansı", "Viyana Kongresi"], answer: "San Remo Konferansı" },
        { q: "İran ve Irak arasında 1975 yılında imzalanan ve Şattülarap su yolu sınırını belirleyen antlaşma hangisidir?", options: ["Cezayir Anlaşması", "Tahran Paktı", "Bağdat Paktı", "Şam Beyannamesi"], answer: "Cezayir Anlaşması" },
        { q: "Hangi Orta Doğu ülkesinde resmi olarak hem 'Arapça' hem de 'Kürtçe' devletin resmi dilleri arasındadır?", options: ["İran", "Türkiye", "Irak", "Suriye"], answer: "Irak" },
        { q: "Ürdün Kralı Abdullah'ın babası olan ve uzun yıllar Ürdün'ü yöneten efsanevi lider kimdir?", options: ["Kral Faysal", "Kral Hüseyin", "Kral Talal", "Kral Faruk"], answer: "Kral Hüseyin" },
        { q: "Lübnan'da Şii nüfusun temsilcisi olan ve 1980'lerde kurulan askeri-siyasi örgüt hangisidir?", options: ["El Fetih", "Hamas", "Hizbullah", "Amal Hareketi"], answer: "Hizbullah" },
        { q: "Orta Doğu'nun 'Aslanı' lakabıyla bilinen, 30 yıl boyunca Suriye'yi yöneten lider kimdir?", options: ["Beşşar Esed", "Hafız Esed", "Adnan Mendres", "Saddam Hüseyin"], answer: "Hafız Esed" },
        { q: "Petrol fiyatlarını dengelemek amacıyla OPEC üyelerine ek olarak Rusya gibi ülkelerin de katıldığı gruba ne denir?", options: ["OPEC+", "G20", "Petrol Konseyi", "Enerji Birliği"], answer: "OPEC+" },
        { q: "Kızıldeniz kıyısında inşa edilen ve 'Geleceğin Şehri' olarak pazarlanan Suudi Arabistan projesi?", options: ["Neom", "Lusail", "Masdar", "Palm Jumeirah"], answer: "Neom" },
        { q: "1973 yılında İsrail'e karşı başlatılan ve Petrol Krizi'ne yol açan savaşın adı nedir?", options: ["Altı Gün Savaşı", "Yom Kippur Savaşı", "Süveyş Krizi", "Körfez Savaşı"], answer: "Yom Kippur Savaşı" },
        { q: "Filistin bayrağındaki renkler (Siyah, Beyaz, Yeşil, Kırmızı) genel olarak neyi temsil eder?", options: ["İslamiyet'i", "Arap Birliğini (Pan-Arabizm)", "Osmanlı'yı", "Tarımı"], answer: "Arap Birliğini (Pan-Arabizm)" },
        { q: "Modern Orta Doğu'da sınırları çizen ancak Arapların 'İhanet' olarak gördüğü gizli plan hangisidir?", options: ["Sykes-Picot", "Balfour", "Lozan", "Mondros"], answer: "Sykes-Picot" },
        { q: "Hangi ülke 2017-2021 yılları arasında Suudi Arabistan, BAE ve Mısır tarafından ambargoya maruz kalmıştır?", options: ["Umman", "Kuveyt", "Katar", "Yemen"], answer: "Katar" },
        { q: "Orta Doğu'nun en büyük petrol sahası olan 'Gavar' (Ghawar) hangi ülkededir?", options: ["Irak", "Kuveyt", "Suudi Arabistan", "İran"], answer: "Suudi Arabistan" },
        { q: "2011'de NATO müdahalesi sonrası devrilen Libya lideri Muammer Kaddafi kaç yıl iktidarda kalmıştır?", options: ["22", "32", "42", "52"], answer: "42" },
        { q: "Yemen'de 2014'ten beri merkezi hükümete karşı savaşan ve İran tarafından desteklenen grup hangisidir?", options: ["Husiler", "Taliban", "Müslüman Kardeşler", "El Kaide"], answer: "Husiler" },
        { q: "İsrail'in 1967'de Suriye'den ele geçirdiği ve hala tartışmalı olan stratejik bölge neresidir?", options: ["Gazze Şeridi", "Golan Tepeleri", "Batı Şeria", "Sina Yarımadası"], answer: "Golan Tepeleri" },
        { q: "Dünyanın en büyük 3 petrol üreticisinden biri olan Orta Doğu ülkesi hangisidir?", options: ["Suudi Arabistan", "Ürdün", "Lübnan", "Türkiye"], answer: "Suudi Arabistan" },
{ q: "1928 yılında imzalanan ve Osmanlı'nın eski topraklarındaki petrol arama haklarını dev şirketler arasında paylaştıran ünlü anlaşmanın adı nedir?", options: ["Kırmızı Hat Anlaşması", "Mavi Hat Anlaşması", "Petrol Paktı", "Sınır Protokolü"], answer: "Kırmızı Hat Anlaşması" },
        { q: "Dünya petrol piyasasına uzun yıllar hükmeden dev şirketleri tanımlamak için kullanılan terim hangisidir?", options: ["Yedi Kız Kardeş", "Petrol Baronları", "Altın Beşli", "Enerji Kralları"], answer: "Yedi Kız Kardeş" },
        { q: "1955 yılında Orta Doğu'da Sovyet yayılmacılığına karşı kurulan ve merkezi Bağdat olan ittifakın adı nedir?", options: ["Bağdat Paktı", "Sadabat Paktı", "NATO", "Varşova Paktı"], answer: "Bağdat Paktı" },
        { q: "Irak petrolünü Türkiye üzerinden Akdeniz'e ulaştıran stratejik boru hattının adı nedir?", options: ["Kerkük-Yumurtalık", "Bakü-Ceyhan", "Trans-Arap Hattı", "Mavi Akım"], answer: "Kerkük-Yumurtalık" },
        { q: "1973 Petrol Ambargosu'nun en güçlü savunucusu olan ve bu krizin mimarı sayılan Suudi Arabistan Kralı kimdir?", options: ["Kral Faysal", "Kral Selman", "Kral Abdullah", "Kral Suud"], answer: "Kral Faysal" },
        { q: "Mısır'da 1952 yılında monarşiyi devirerek Cumhuriyet'i ilan eden grubun adı nedir?", options: ["Hür Subaylar", "Genç Araplar", "İhvan", "Mısır Fedaileri"], answer: "Hür Subaylar" },
        { q: "1991 yılında Irak'ın Kuveyt'ten çıkarılması için başlatılan askeri operasyonun adı nedir?", options: ["Çöl Fırtınası", "Körfez Ateşi", "Kum Kartalı", "Sondaj Harekatı"], answer: "Çöl Fırtınası" },
        { q: "Ürdün ve Filistinli örgütler arasında 1970 yılında yaşanan ve büyük çatışmalara sahne olan olayın adı nedir?", options: ["Kara Eylül", "Kanlı Ekim", "Siyah Bahar", "Zeytin İsyanı"], answer: "Kara Eylül" },
        { q: "İran Şahı Muhammed Rıza Pehlevi'nin muhalifleri bastırmak için kullandığı korkulan gizli polis teşkilatının adı nedir?", options: ["SAVAK", "Vevak", "Mossad", "Sepah"], answer: "SAVAK" },
        { q: "1952'de askeri darbeyle devrilen ve İtalya'ya sürgüne gönderilen son Mısır Kralı kimdir?", options: ["Kral Faruk", "Kral Fuad", "Kral Abbas", "Kral Hüseyin"], answer: "Kral Faruk" },
        { q: "Arap Birliği'nin (Arap Ligi) genel merkezi hangi şehirdedir?", options: ["Riyad", "Bağdat", "Kahire", "Şam"], answer: "Kahire" },
        { q: "Irak ve İran arasındaki savaşın temel çıkış noktalarından biri olan ve Basra Körfezi'ne dökülen su yolunun adı nedir?", options: ["Şattülarap", "Dicle Nehri", "Hürmüz Geçidi", "Asi Nehri"], answer: "Şattülarap" },
        { q: "Türkiye ile Irak arasındaki Musul meselesini çözen 1926 tarihli anlaşma hangisidir?", options: ["Ankara Anlaşması", "Lozan Anlaşması", "İstanbul Paktı", "Musul Protokolü"], answer: "Ankara Anlaşması" },
        { q: "1982'de İsrail'in Lübnan'ı işgali sonrası Filistin Kurtuluş Örgütü (FKÖ) merkezini hangi ülkeye taşımıştır?", options: ["Tunus", "Cezayir", "Mısır", "Ürdün"], answer: "Tunus" },
        { q: "İsrail'in dış istihbarat servisinin adı aşağıdakilerden hangisidir?", options: ["Aman", "Şin-Bet", "Mossad", "Lekem"], answer: "Mossad" },
        { q: "Bugünkü Suudi Arabistan Krallığı'nın temelini oluşturan ve 18. yüzyılda ortaya çıkan dini akımın kurucusu kimdir?", options: ["Muhammed bin Abdülvehhab", "İbn Suud", "Kral Faysal", "Şerif Hüseyin"], answer: "Muhammed bin Abdülvehhab" },
        { q: "Birleşik Arap Emirlikleri (BAE) hangi yıl bağımsızlığını kazanarak bir federasyon olarak kurulmuştur?", options: ["1961", "1971", "1981", "1991"], answer: "1971" },
        { q: "Libya'da petrolün keşfedilmesi ve ülkenin bir enerji devine dönüşmesi hangi yılda gerçekleşmiştir?", options: ["1949", "1959", "1969", "1979"], answer: "1959" },
        { q: "Suudi Arabistan'ın dev petrol şirketi ARAMCO'nun açılımı nedir?", options: ["Arabian American Oil Company", "Arabian Modern Company", "Arabian Monarch Oil", "Arabian Mining Corp"], answer: "Arabian American Oil Company" },
        { q: "Arap milliyetçiliğini savunan Baas Partisi'nin kelime anlamı nedir?", options: ["Yeniden Doğuş", "Büyük Birlik", "Özgürlük", "Zafere Doğru"], answer: "Yeniden Doğuş" },
        { q: "2011 yılında referandumla Sudan'dan ayrılarak bağımsızlığını ilan eden Orta Doğu'ya komşu ülke hangisidir?", options: ["Güney Sudan", "Eritre", "Somali", "Çad"], answer: "Güney Sudan" },
        { q: "Irak'ın kuzeyindeki bölgesel yönetimin merkezi olan şehir hangisidir?", options: ["Musul", "Kerkük", "Erbil", "Süleymaniye"], answer: "Erbil" },
        { q: "Suriye'de 1970'ten 2000 yılına kadar süren Hafız Esed dönemini başlatan darbe hareketine ne ad verilir?", options: ["Düzeltme Hareketi", "Beyaz Devrim", "Halkın Sesi", "Sedir Devrimi"], answer: "Düzeltme Hareketi" },
        { q: "Arap Dünyası'nın en büyük nüfusuna sahip ülkesi hangisidir?", options: ["Suudi Arabistan", "Mısır", "Irak", "Cezayir"], answer: "Mısır" },
        { q: "1950-1980 yılları arasında Suudi petrolünü Lübnan kıyılarına taşıyan dev boru hattının adı nedir?", options: ["Tapline", "Irapline", "Redline", "Medline"], answer: "Tapline" },
    ],
    hard: [
        { q: "1973 Petrol Krizi, hangi savaşın ardından Arap ülkelerinin ambargosuyla başlamıştır?", options: ["Altı Gün Savaşı", "Süveyş Krizi", "Birinci Körfez Savaşı", "Yom Kippur Savaşı"], answer: "Yom Kippur Savaşı" },
        { q: "Tarihte ticari amaçlı ilk petrol kuyusu nerede açılmıştır?", options: ["Teksas", "Suudi Arabistan", "Bakü", "İran"], answer: "Bakü" },
        { q: "Hürmüz Boğazı hangi iki su kütlesini birbirine bağlar?", options: ["Basra Körfezi - Umman Denizi", "Kızıldeniz - Akdeniz", "Aden Körfezi - Kızıldeniz", "Karadeniz - Hazar Denizi"], answer: "Basra Körfezi - Umman Denizi" },
        { q: "Suudi Arabistan'ın devlete ait devasa petrol ve doğalgaz şirketinin adı nedir?", options: ["Bapco", "Aramco", "KPC", "Sonatrach"], answer: "Aramco" },
        { q: "İran-Irak Savaşı hangi yıllar arasında gerçekleşmiştir?", options: ["1980-1988", "1990-1991", "1973-1979", "2003-2011"], answer: "1980-1988" },
       { q: "1973 Petrol Krizi sırasında 'Petrol Silahı'nın kullanılmasında kilit rol oynayan ve 'Petrolün Kralı' olarak bilinen efsanevi Suudi Petrol Bakanı kimdir?", options: ["Zeki Yamani", "Faysal bin Türki", "Ali el-Naimi", "Halid el-Falih"], answer: "Zeki Yamani" },
        { q: "Dünyanın en büyük kum taşı petrol sahası olarak bilinen ve Kuveyt'in toplam rezervlerinin yarısından fazlasını barındıran devasa saha hangisidir?", options: ["Burgan Sahası", "Gavar Sahası", "Rumaila Sahası", "Ahvaz Sahası"], answer: "Burgan Sahası" },
        { q: "1908 yılında İran'ın Mescid-i Süleyman bölgesinde Orta Doğu'nun ilk ticari petrol keşfini yapan İngiliz girişimci kimdir?", options: ["William Knox D'Arcy", "Calouste Gulbenkian", "John D. Rockefeller", "Henri Deterding"], answer: "William Knox D'Arcy" },
        { q: "1967 yılındaki Altı Gün Savaşı'nın fitilini ateşleyen olaylardan biri olan, Mısır'ın İsrail gemilerine kapattığı stratejik boğaz hangisidir?", options: ["Tiran Boğazı", "Hürmüz Boğazı", "Babulmendep Boğazı", "Cebelitarık Boğazı"], answer: "Tiran Boğazı" },
        { q: "Orta Doğu petrol piyasasında 'Yüzde Beş Bay' (Mr. Five Percent) lakabıyla tanınan, dev petrol şirketlerinin hisselerinden aldığı payla ünlü iş adamı kimdir?", options: ["Calouste Gulbenkian", "Aristoteles Onassis", "Adnan Kaşıkçı", "Mohamed Al-Fayed"], answer: "Calouste Gulbenkian" },
        { q: "Lübnan İç Savaşı'nı resmen sona erdiren ve Lübnan'daki mezhepsel güç paylaşımını yeniden düzenleyen 1989 tarihli antlaşma hangisidir?", options: ["Taif Antlaşması", "Doha Anlaşması", "Paris Protokolü", "Şam Paktı"], answer: "Taif Antlaşması" },
        { q: "1979 yılında Suudi Arabistan'da Kabe'nin silahlı bir grup tarafından işgal edilmesiyle sonuçlanan ve krallığı sarsan olayın lideri kimdir?", options: ["Cuheyman el-Uteybi", "Usame bin Ladin", "Ebu Musab el-Zerkavi", "Ayman el-Zevahiri"], answer: "Cuheyman el-Uteybi" },
        { q: "Hangi Orta Doğu ülkesi, 2019 yılında yaklaşık 60 yıldır üyesi olduğu OPEC'ten ayrılma kararı almıştır?", options: ["Katar", "Ekvador", "Angola", "Umman"], answer: "Katar" },
        { q: "İran ve BAE arasında egemenlik ihtilafı bulunan, Hürmüz Boğazı girişindeki stratejik üç adadan biri değildir?", options: ["Ebu Musa", "Büyük Tunb", "Küçük Tunb", "Failaka Adası"], answer: "Failaka Adası" },
        { q: "Osmanlı Devleti'nin 1. Dünya Savaşı sonrası Orta Doğu topraklarını tamamen kaybettiği ve bugün geçerliliği olmayan hukuki belge hangisidir?", options: ["Sevr Antlaşması", "Lozan Antlaşması", "Mondros Mütarekesi", "Mudanya Mütarekesi"], answer: "Sevr Antlaşması" },
        { q: "Suudi Arabistan'ın petrol devi ARAMCO'nun tüm hisselerinin krallık tarafından tamamen millileştirilmesi hangi yılda tamamlanmıştır?", options: ["1973", "1980", "1990", "1960"], answer: "1980" },
        { q: "1953 yılında İran'da Başbakan Musaddık'ı devirmek amacıyla CIA ve MI6 tarafından yürütülen gizli operasyonun kod adı nedir?", options: ["Ajax Operasyonu", "Çöl Tilkisi", "Kartal Pençesi", "Altın Yumruk"], answer: "Ajax Operasyonu" },
        { q: "Katar ve İran tarafından paylaşılan, dünyanın en büyük bağımsız doğal gaz sahası olan bölgeye İran tarafında ne ad verilir?", options: ["South Pars", "North Dome", "Kashagan", "Zohr"], answer: "South Pars" },
        { q: "Birinci Körfez Savaşı sırasında Saddam Hüseyin'in Kuveyt'ten çekilirken ateşe verdiği petrol kuyusu sayısı yaklaşık kaçtır?", options: ["100", "350", "600", "1200"], answer: "600" },
        { q: "Ürdün'ün Akabe şehri, 1. Dünya Savaşı sırasında hangi ünlü figürün liderliğindeki Arap güçleri tarafından Osmanlı'dan alınmıştır?", options: ["T.E. Lawrence", "Gertrude Bell", "General Allenby", "Winston Churchill"], answer: "T.E. Lawrence" },
        { q: "İsrail'in 1981 yılında Irak'ın nükleer kapasitesini yok etmek amacıyla Osirak reaktörüne düzenlediği hava saldırısının adı nedir?", options: ["Opera Operasyonu", "Musa Operasyonu", "Babil Baskını", "Demir Kubbe"], answer: "Opera Operasyonu" },
        { q: "Mısır'da Krallık rejimini yıkan 'Hür Subaylar' darbesinin ardından ülkenin sembolik olarak ilk Cumhurbaşkanı olan isim kimdir?", options: ["Muhammed Necib", "Cemal Abdülhasır", "Enver Sedat", "Ömer Süleyman"], answer: "Muhammed Necib" },
        { q: "Yemen'in kuzey ve güney olarak ikiye ayrıldığı dönemde, Güney Yemen hangi siyasi ideoloji ile yönetilmekteydi?", options: ["Marksizm-Leninizm", "Liberalizm", "Monarşi", "Teokrasi"], answer: "Marksizm-Leninizm" },
        { q: "Orta Doğu'da su sorununa yol açan ve Türkiye, Suriye, Irak arasında tartışma konusu olan devasa su projesinin adı nedir?", options: ["GAP", "LİTAP", "Mavi Akım", "Nil Projesi"], answer: "GAP" },
        { q: "İran-Irak Savaşı sırasında ABD'nin İran'a gizlice silah satıp gelirini Nikaragua'daki isyancılara aktardığı skandalın adı nedir?", options: ["İran-Contra", "Watergate", "Pentagon Belgeleri", "WikiLeaks"], answer: "İran-Contra" },
        { q: "1927 yılında Irak'ın Kerkük şehrinde petrolün fışkırdığı ve Orta Doğu'nun kaderini değiştiren ünlü kuyunun adı nedir?", options: ["Baba Gürgür No.1", "Dammam No.7", "Mescid-i Süleyman", "Burgan 1"], answer: "Baba Gürgür No.1" },
        { q: "Hangi Orta Doğu ülkesi, İsrail ile 1994 yılında barış antlaşması (Wadi Araba) imzalamıştır?", options: ["Ürdün", "Lübnan", "Suudi Arabistan", "Irak"], answer: "Ürdün" },
        { q: "Süveyş Kanalı'nın inşaatını başlatan ve 1869'da açılışını yapan Fransız diplomat ve mühendis kimdir?", options: ["Ferdinand de Lesseps", "Gustave Eiffel", "Napoleon Bonaparte", "Charles de Gaulle"], answer: "Ferdinand de Lesseps" },
        { q: "OPEC bünyesinde petrol fiyatlarının belirlenmesinde referans alınan, farklı petrol türlerinin ortalamasından oluşan sisteme ne denir?", options: ["OPEC Sepeti", "Brent Karışımı", "WTI Endeksi", "Varil Ortalaması"], answer: "OPEC Sepeti" },
        { q: "1973 Petrol Krizi'nde ambargo uygulanmayan tek Batılı ülke (stratejik nedenlerle) aşağıdakilerden hangisidir?", options: ["Fransa", "Hollanda", "ABD", "Portekiz"], answer: "Fransa" },
{ q: "Suudi Arabistan'da petrolün keşfedildiği ve bugün 'Refah Kuyusu' (Prosperity Well) olarak anılan meşhur kuyu hangisidir?", options: ["Dammam No. 7", "Baba Gürgür 1", "Burgan 1", "Gavar 4"], answer: "Dammam No. 7" },
        { q: "Dünyanın en büyük petrol şirketlerini tanımlayan 'Yedi Kız Kardeş' terimini ilk kez ortaya atan İtalyan enerji devi ENI'nin kurucusu kimdir?", options: ["Enrico Mattei", "Giovanni Agnelli", "Ferruccio Lamborghini", "Enzo Ferrari"], answer: "Enrico Mattei" },
        { q: "1927 tarihli Cidde Antlaşması ile İngiltere, Necid ve Hicaz Krallığı'nın (bugünkü Suudi Arabistan) bağımsızlığını resmen kime karşı tanımıştır?", options: ["İbn Suud", "Şerif Hüseyin", "Kral Faysal", "Sultan Vahdettin"], answer: "İbn Suud" },
        { q: "Irak ve Suudi Arabistan arasında 1922 yılında imzalanan ve iki ülke arasındaki sınırı ve 'Tarafsız Bölge'yi belirleyen protokol hangisidir?", options: ["Ukayr Protokolü", "Bağdat Paktı", "Sınır Beyannamesi", "Lozan Antlaşması"], answer: "Ukayr Protokolü" },
        { q: "1950'lerde Suudi petrolünü Akdeniz'e taşımak için inşa edilen ve Ürdün, Suriye, Lübnan'dan geçen Tapline (Trans-Arabian Pipeline) hangi limanda son buluyordu?", options: ["Sayda (Sidon)", "Trablus", "Hayfa", "İskenderiye"], answer: "Sayda (Sidon)" },
        { q: "1973 Petrol Krizi sırasında petrolü silah olarak kullanan asıl yapı, OPEC değil onun altındaki hangi Arap odaklı örgüttür?", options: ["OAPEC", "GCC", "Arap Ligi", "İhvan"], answer: "OAPEC" },
        { q: "Osmanlı İmparatorluğu'nun Orta Doğu'da İngiltere'ye karşı kazandığı, 13 bin İngiliz askerinin esir alındığı büyük zaferin adı nedir?", options: ["Kut'ül Amare", "Gazze Muharebesi", "Kanal Harekatı", "Megalopolis"], answer: "Kut'ül Amare" },
        { q: "1916 yılında imzalanan Sykes-Picot Antlaşması'na adını veren İngiliz diplomat Mark Sykes ve Fransız diplomat François Georges-Picot'nun tam ünvanları nedir?", options: ["Siyasetçi-Diplomat", "Asker-Vali", "Casus-Akademisyen", "Başbakan-Bakan"], answer: "Siyasetçi-Diplomat" },
        { q: "Suudi Arabistan'ın kurucusu İbn Suud ile ABD Başkanı Roosevelt arasında 1945'te yapılan ve ABD-Suudi ittifakının temelini atan görüşme hangi gemide yapılmıştır?", options: ["USS Quincy", "USS Missouri", "USS Enterprise", "USS Roosevelt"], answer: "USS Quincy" },
        { q: "Modern İran'ın temelini atan ve 'Pehlevi Hanedanı'nı başlatan Rıza Şah, 1921'de iktidara gelmeden önce hangi askeri birlikte komutandı?", options: ["Kazak Tugayı", "Şah Muhafızları", "Devrim Muhafızları", "Jandarma Birliği"], answer: "Kazak Tugayı" },
        { q: "Hürmüz Boğazı'nın güvenliğinde kilit rol oynayan 'Musandam Yarımadası' hangi ülkeye ait bir eksklav (toprağından ayrı parça) bölgesidir?", options: ["Umman", "BAE", "Katar", "İran"], answer: "Umman" },
        { q: "1981 yılında kurulan Körfez İşbirliği Konseyi'nin (KİK) kurucu üyeleri arasında hangi ülke YER ALMAZ?", options: ["Irak", "Kuveyt", "Bahreyn", "Katar"], answer: "Irak" },
        { q: "20. yüzyılın başında Osmanlı Devleti'nin Musul üzerindeki petrol haklarını korumak amacıyla kurduğu özel fonun adı nedir?", options: ["Hazine-i Hassa", "Düyun-u Umumiye", "İrad-ı Cedid", "Mecidiye Fonu"], answer: "Hazine-i Hassa" },
        { q: "İran-Irak Savaşı'nın dönüm noktalarından biri olan ve Irak'ın büyük kayıplar verdiği 1986 tarihli 'Şafak 8' (Dawn 8) operasyonunda İran nereyi ele geçirmiştir?", options: ["Fav Yarımadası", "Basra Şehri", "Bağdat Havalimanı", "Kuveyt Sınırı"], answer: "Fav Yarımadası" },
        { q: "1917 Balfour Deklarasyonu, hangi İngiliz Dışişleri Bakanı tarafından kime (Lord unvanlı bir şahıs) hitaben yazılmıştır?", options: ["Arthur Balfour - Walter Rothschild", "Winston Churchill - Chaim Weizmann", "Anthony Eden - David Ben-Gurion", "Mark Sykes - Herbert Samuel"], answer: "Arthur Balfour - Walter Rothschild" },
        { q: "Birleşik Arap Emirlikleri'nin ilk devlet başkanı olan ve 'Çölü Yeşerten Adam' olarak bilinen vizyoner lider kimdir?", options: ["Şeyh Zayed bin Sultan Al Nahyan", "Şeyh Raşid bin Said Al Maktum", "Şeyh Halife bin Zayed", "Şeyh Muhammed bin Raşid"], answer: "Şeyh Zayed bin Sultan Al Nahyan" },
        { q: "Suudi Arabistan'ın 'Gavar' petrol sahasından sonra dünyanın en büyük ikinci konvansiyonel petrol sahası hangisidir?", options: ["Kuveyt - Burgan", "Irak - Rumaila", "İran - Ahvaz", "BAE - Zakum"], answer: "Kuveyt - Burgan" },
        { q: "1940'larda Orta Doğu'daki İngiliz etkisine karşı Irak'ta çıkan ve 'Altın Kare' subayları tarafından yönetilen darbe girişiminin lideri kimdir?", options: ["Raşid Ali Geylani", "Nuri es-Said", "Abdülkerim Kasım", "Faysal bin Hüseyin"], answer: "Raşid Ali Geylani" },
        { q: "Lübnan'da Hizbullah'ın kurucularından kabul edilen ve 2008'de Şam'da bir suikastla öldürülen askeri lider kimdir?", options: ["İmad Mugniye", "Hasan Nasrallah", "Abbas Musavi", "Ragıp Harb"], answer: "İmad Mugniye" },
        { q: "Umman'da 1960 ve 70'lerde merkezi hükümete karşı başlatılan ve İngiliz-İran desteğiyle bastırılan Marksist ayaklanmanın adı nedir?", options: ["Zofar İsyanı", "Aden Kalkışması", "Maskat Devrimi", "İmamlık Savaşı"], answer: "Zofar İsyanı" },
        { q: "Katar'ın 19. yüzyılda Osmanlı Devleti ile bağlarını koparmadan İngiltere ile himaye anlaşması imzalayan kurucu lideri kimdir?", options: ["Şeyh Casim bin Muhammed Al Sani", "Şeyh Hamad bin Halife", "Şeyh Temim bin Hamad", "Şeyh Abdullah bin Sani"], answer: "Şeyh Casim bin Muhammed Al Sani" },
        { q: "Irak'ta 1958 yılında Kral II. Faysal'ın ve Başbakan Nuri es-Said'in öldürülmesiyle sonuçlanan darbenin lideri kimdir?", options: ["Abdülkerim Kasım", "Saddam Hüseyin", "Ahmet Hasan el-Bekir", "Celal Talabani"], answer: "Abdülkerim Kasım" },
        { q: "İran ve Batılı güçler arasında 2015 yılında imzalanan Nükleer Anlaşma'nın resmi (teknik) adı nedir?", options: ["JCPOA", "START I", "NATO-İran Paktı", "Viyana Protokolü"], answer: "JCPOA" },
        { q: "1930'larda Orta Doğu'da casusluk faaliyetleri yürüten ve 'Çölün Kraliçesi' olarak bilinen İngiliz kadın ajan/arkeolog kimdir?", options: ["Gertrude Bell", "Mata Hari", "Agatha Christie", "T.E. Lawrence'ın eşi"], answer: "Gertrude Bell" },
        { q: "OPEC'in merkezi 1960-1965 yılları arasında Viyana'ya taşınmadan önce hangi şehirde bulunuyordu?", options: ["Cenevre", "Londra", "Paris", "Zürih"], answer: "Cenevre" },
    ]
};

// 3. Oyun Değişkenleri
let currentQuestionIndex = 0; // 0'dan 11'e kadar (12 soru)
let guaranteedPrize = "0";
let activeQuestions = []; // O anki oyun için rastgele seçilen 12 soru
let isAnswerLocked = false; // Tıklama spamini önlemek için

// JOKER DURUMLARI (Global Değişkenler)
let used50 = false;
let usedPhone = false;
let usedAudience = false;
let usedDouble = false;
let isDoubleChanceActive = false;
let oilTimer; // Zamanlayıcıyı tutacak
let timeLeft; // Kalan süreyi tutacak
const questionTimes = [40, 50, 60, 70, 80, 90]; // İlk 6 sorunun süreleri

// 4. Oyunu Başlat
function startOilGame() {
    currentQuestionIndex = 0;
    guaranteedPrize = "0";
    isAnswerLocked = false;
    document.getElementById('oilCurrentPrize').innerText = "0 Varil";
    
    // YENİ EKLENEN: Jokerleri Sıfırla
    used50 = false;
    usedPhone = false;
    usedAudience = false;
    document.getElementById('ll-50').classList.remove('used');
    document.getElementById('ll-phone').classList.remove('used');
    document.getElementById('ll-audience').classList.remove('used');
   usedDouble = false;
    isDoubleChanceActive = false;
    const doubleBtn = document.getElementById('ll-double');
    doubleBtn.classList.remove('used');
    doubleBtn.classList.add('locked');

    // Rastgele 12 soru seç
    activeQuestions = [
        ...shuffleArray([...oilQuestionPool.easy]).slice(0, 2),
        ...shuffleArray([...oilQuestionPool.medium]).slice(0, 5),
        ...shuffleArray([...oilQuestionPool.hard]).slice(0, 5)
    ];

    renderLadder();
    loadQuestion();
}

// 5. Merdiveni Çiz
function renderLadder() {
    const ladderUl = document.getElementById('oilLadderList');
    ladderUl.innerHTML = '';
    
    // Array'i ters çevirip basıyoruz ki 1M en üstte görünsün
    [...oilPrizeLadder].reverse().forEach((item) => {
        const li = document.createElement('li');
        li.className = `ladder-step ${item.isMilestone ? 'milestone' : ''}`;
        
        // Aktif Soru veya Geçilmiş Soru stilleri
        if (item.level === currentQuestionIndex + 1) li.classList.add('active');
        else if (item.level <= currentQuestionIndex) li.classList.add('passed');

        li.innerHTML = `<span class="step-num">${item.level}</span> <span class="step-val">${item.val} 🛢️</span>`;
        ladderUl.appendChild(li);
    });
}

// 6. Soruyu Ekrana Yükle
function loadQuestion() {
    if (currentQuestionIndex >= 12) return; // Oyun bitti
   // --- ÇİFT CEVAP KİLİDİ KONTROLÜ ---
    const doubleBtn = document.getElementById('ll-double');
    if (currentQuestionIndex >= 6) { // 7. soru ve sonrası (30.000 varil barajı)
        doubleBtn.classList.remove('locked');
        doubleBtn.style.opacity = "1";
        doubleBtn.style.pointerEvents = "auto";
        doubleBtn.style.filter = "none";
    } else {
        doubleBtn.classList.add('locked');
        doubleBtn.style.opacity = "0.3";
        doubleBtn.style.pointerEvents = "none";
        doubleBtn.style.filter = "grayscale(1)";
    }
    // Her yeni soruda aktiflik durumunu sıfırla
    if (typeof isDoubleChanceActive !== 'undefined') isDoubleChanceActive = false;
   // --- SÜRE KONTROLÜ (İlk 6 Soru) ---
    const timerElement = document.getElementById('oil-timer-container');
    
    if (currentQuestionIndex < 6) {
        // İlk 6 soruda süreyi göster ve başlat
        if (timerElement) timerElement.style.display = "flex"; 
        startOilTimer(questionTimes[currentQuestionIndex]);
    } else {
        // 7. soru ve sonrasında süreyi durdur ve gizle
        clearInterval(oilTimer);
        if (timerElement) timerElement.style.display = "none";
    }

    isAnswerLocked = false;
    const qData = activeQuestions[currentQuestionIndex];
    document.getElementById('oilQuestionText').innerText = qData.q;

    // Şıkları karıştır
    const shuffledOptions = shuffleArray([...qData.options]);
    const letters = ["A", "B", "C", "D"];

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        btn.innerHTML = `<span class="opt-letter">${letters[i]}:</span> <span class="opt-text">${shuffledOptions[i]}</span>`;
        
        // Sınıfları ve satır içi stilleri tamamen sıfırla
        btn.className = "oil-option"; 
        
        // --- YENİ EKLENEN: Eski sorudan kalan renkleri temizle ---
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
        btn.style.visibility = "visible"; // İleride %50 jokeri için gerekecek
        // --------------------------------------------------------

        btn.disabled = false;
        
        // Tıklama olayı
        btn.onclick = () => checkOilAnswer(btn, shuffledOptions[i], qData.answer);
    }
}

// 7. Cevabı Kontrol Et
function checkOilAnswer(btn, selectedOption, correctAnswer) {
   clearInterval(oilTimer); // Oyuncu şıkka tıkladığı an zamanı durdur
    if (isAnswerLocked) return;
    isAnswerLocked = true; // Kilitliyoruz, art arda basılamasın

    // Seçilen şıkkı sarı yap (Son kararınız mı hissi)
    btn.style.background = "#e67e22"; 
    btn.style.borderColor = "#e67e22";
    btn.style.color = "#fff";

    setTimeout(() => {
        if (selectedOption === correctAnswer) {
            // DOĞRU CEVAP
            btn.className = "oil-option correct";
            const wonPrize = oilPrizeLadder[currentQuestionIndex];
            
            // Baraj kontrolü
            if (wonPrize.isMilestone) guaranteedPrize = wonPrize.val;
            
            document.getElementById('oilCurrentPrize').innerText = wonPrize.val + " Varil";

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < 12) {
                    renderLadder();
                    loadQuestion();
                } else {
                    oilGameOver(`Tebrikler! Orta Doğu'nun Yeni Petrol Baronu Sensin!\nTam 1.000.000 Varil Kazandın!`, true);
                }
            }, 1500);

        } else {
            // YANLIŞ CEVAP
           // --- ÇİFT CEVAP (KALKAN) KONTROLÜ ---
        if (isDoubleChanceActive) {
            isDoubleChanceActive = false; // Kalkanı kullandık
            btn.className = "oil-option wrong"; // Şıkkı kırmızı yap
            btn.disabled = true; // Bu yanlış şıkka bir daha basamasın
            isAnswerLocked = false; // Kilidi aç ki başka şık seçebilsin
            
            // Seçilen şıkkın içindeki metni sarıdan beyaza çekelim (opsiyonel ama şık durur)
            btn.style.color = "#fff"; 
            
            return; // FONKSİYONDAN ÇIK! (Aşağıdaki oyunu bitiren kodlar çalışmasın)
        }
            btn.className = "oil-option wrong";
            
            // Doğru cevabı bul ve yeşil yap
            for (let i = 0; i < 4; i++) {
                const optBtn = document.getElementById(`opt-${i}`);
                if (optBtn.innerText.includes(correctAnswer)) {
                    optBtn.className = "oil-option correct";
                }
            }

            setTimeout(() => {
                oilGameOver(`Yanlış Cevap!\nSondaj patladı. Garanti baraj ödülün ile dönüyorsun: ${guaranteedPrize} Varil.`, false);
            }, 2000);
        }
    }, 1500); // 1.5 saniye gerilim süresi
}

// Çekilme Butonu
document.getElementById('btnWithdraw')?.addEventListener('click', () => {
    if (currentQuestionIndex === 0) {
        oilGameOver("Henüz hiç petrol kazanamadın. Çekildin.", false);
    } else {
        const currentWon = oilPrizeLadder[currentQuestionIndex - 1].val;
        oilGameOver(`Çekilme kararı aldın.\nKasana giren net petrol: ${currentWon} Varil.`, true);
    }
});

// Oyun Bitiş Ekranı
function oilGameOver(message, isWin) {
    alert(message); // Şimdilik basit alert, sonra bunu çok şık bir Modal'a çevireceğiz
    // Oyunu kapat ana menüye dön
    document.getElementById('actualOilGame').classList.add('hidden');
    document.getElementById('quizMenu').classList.remove('hidden');
}

// Yardımcı Fonksiyon: Array Karıştırıcı
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/* ===================================================
   JOKER (İSTİHBARAT) SİSTEMLERİ
   =================================================== */

// Event Listeners
document.getElementById('ll-50').addEventListener('click', use5050);
document.getElementById('ll-phone').addEventListener('click', usePhone);
document.getElementById('ll-audience').addEventListener('click', useAudience);
document.getElementById('btnOilJokerClose').addEventListener('click', closeJokerModal);

// Modal Kontrolü
function showJokerModal(title, content) {
    document.getElementById('oilJokerTitle').innerText = title;
    document.getElementById('oilJokerContent').innerHTML = content;
    document.getElementById('oilJokerModal').classList.remove('hidden');
}

function closeJokerModal() {
    document.getElementById('oilJokerModal').classList.add('hidden');
}

// 1. YARI YARIYA JOKERİ (50:50)
function use5050() {
    if (used50 || isAnswerLocked) return;
    used50 = true;
    document.getElementById('ll-50').classList.add('used');

    const qData = activeQuestions[currentQuestionIndex];
    let hiddenCount = 0;
    const options = [0, 1, 2, 3];
    shuffleArray(options); // Şıkları karıştır ki hep aynı yerdekiler silinmesin

    for (let i of options) {
        const btn = document.getElementById(`opt-${i}`);
        const text = btn.querySelector('.opt-text').innerText;
        if (text !== qData.answer && hiddenCount < 2) {
            btn.style.visibility = 'hidden'; // 2 Yanlış şıkkı uçur
            hiddenCount++;
        }
    }
}

// 2. LİDERLER HATTI (Telefon Jokeri)
function usePhone() {
    if (usedPhone || isAnswerLocked) return;

    // Lider seçme ekranı
    const content = `
        <p style="margin-bottom: 15px;">Hangi liderin istihbarat ağına bağlanmak istiyorsun?</p>
        <div style="display:flex; gap:10px; justify-content:center;">
            <button onclick="callLeader('Saddam')" class="btn-primary" style="background:#444; color:#fff; border:1px solid #f1c40f;">Saddam</button>
            <button onclick="callLeader('Kaddafi')" class="btn-primary" style="background:#444; color:#fff; border:1px solid #f1c40f;">Kaddafi</button>
            <button onclick="callLeader('Nasır')" class="btn-primary" style="background:#444; color:#fff; border:1px solid #f1c40f;">Nasır</button>
        </div>
    `;
    showJokerModal("📞 Kırmızı Hat", content);
}

// Liderin Cevap Verme Mantığı (Zorluğa Göre Doğruluk)
window.callLeader = function(leaderName) {
    usedPhone = true;
    document.getElementById('ll-phone').classList.add('used');

    const qData = activeQuestions[currentQuestionIndex];
    let isCorrect = true;

    // Senin belirlediğin doğruluk oranları
    const rand = Math.random() * 100;
    if (currentQuestionIndex < 2) { isCorrect = true; } // 1 ve 2. soru: %100
    else if (currentQuestionIndex < 8) { if (rand > 80) isCorrect = false; } // 3-8 arası: %80
    else { if (rand > 50) isCorrect = false; } // 9-12 arası: %50 (Çok Riskli!)

    let suggestedAnswer = qData.answer;
    if (!isCorrect) {
        // Yanlış cevap verecekse, doğru şık dışındakilerden birini sallasın
        const wrongOptions = qData.options.filter(opt => opt !== qData.answer);
        suggestedAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }

    // Liderlere Özel Replikler
    let dialogue = "";
    if(leaderName === 'Saddam') dialogue = `"Kardeşim, Batı'nın oyunlarına gelme. Benim kaynaklarım bu sorunun cevabının kesinlikle <b style="color:#f1c40f;">${suggestedAnswer}</b> olduğunu söylüyor."`;
    if(leaderName === 'Kaddafi') dialogue = `"Çadırımdan bildiriyorum! Emperyalistler bilmeni istemez ama gerçek cevap <b style="color:#f1c40f;">${suggestedAnswer}</b>."`;
    if(leaderName === 'Nasır') dialogue = `"Arap milliyetçiliği adına söylüyorum, doğru yol <b style="color:#f1c40f;">${suggestedAnswer}</b> şıkkından geçer."`;

    const content = `
        <h4 style="color:#fff; margin-bottom:15px; text-transform:uppercase;">${leaderName} Hattayken...</h4>
        <p style="font-style:italic; font-size:1.2rem;">${dialogue}</p>
    `;
    showJokerModal("📞 İstihbarat Alındı", content);
}

// 3. HALKIN SESİ (Seyirci Jokeri)
function useAudience() {
    if (usedAudience || isAnswerLocked) return;
    usedAudience = true;
    document.getElementById('ll-audience').classList.add('used');

    const qData = activeQuestions[currentQuestionIndex];
    const correctOptText = qData.answer;

    // Zorluğa göre doğru bilme yüzdesi
    let correctPercent = 0;
    if (currentQuestionIndex < 2) correctPercent = Math.floor(Math.random() * 15) + 75; // %75-%90
    else if (currentQuestionIndex < 8) correctPercent = Math.floor(Math.random() * 20) + 50; // %50-%70
    else correctPercent = Math.floor(Math.random() * 20) + 30; // %30-%50

    let remaining = 100 - correctPercent;
    const w1 = Math.floor(Math.random() * remaining); remaining -= w1;
    const w2 = Math.floor(Math.random() * remaining);
    const w3 = remaining - w2;
    const wrongPercents = shuffleArray([w1, w2, w3]);

    let html = '<div style="display:flex; flex-direction:column; gap:12px; text-align:left; margin-top:10px;">';
    let wrongIndex = 0;

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        if (btn.style.visibility === 'hidden') continue; // 50:50 kullanıldıysa gizli şıkları atla

        const text = btn.querySelector('.opt-text').innerText;
        const letter = btn.querySelector('.opt-letter').innerText.replace(':', '');

        let percent = (text === correctOptText) ? correctPercent : wrongPercents[wrongIndex++];
        
        html += `
            <div style="display:flex; align-items:center;">
                <span style="width:30px; font-weight:bold; color:#f1c40f;">${letter}</span>
                <div style="flex-grow:1; background:#222; height:18px; border-radius:10px; overflow:hidden; border:1px solid #444;">
                    <div style="width:${percent}%; background:linear-gradient(90deg, #d35400, #f1c40f); height:100%;"></div>
                </div>
                <span style="width:45px; text-align:right; margin-left:10px; color:#ccc;">%${percent}</span>
            </div>
        `;
    }
    html += '</div>';

    showJokerModal("👥 İstihbarat Raporu", html);
}
// ÇİFT CEVAP JOKERİ AKTİF ETME
document.getElementById('ll-double').addEventListener('click', () => {
    // Eğer zaten kullanıldıysa, 7. sorudan küçükse veya cevap kilitliyse bir şey yapma
    if (usedDouble || currentQuestionIndex < 6 || isAnswerLocked) return;
    
    isDoubleChanceActive = true;
    usedDouble = true;
    
    // Butonu görsel olarak "kullanıldı" yap
    document.getElementById('ll-double').classList.add('used');
    
    // Oyuncuya moral verelim
    showJokerModal("🛡️ Çelik Zırh Aktif", "Bu soruda iki kez deneme hakkın var. İlk yanlışında kuyu patlamayacak, ikinci bir şık seçebileceksin!");
});

function startOilTimer(seconds) {
    // Eğer çalışan başka bir sayaç varsa durdur (üst üste binmesin)
    clearInterval(oilTimer);
    timeLeft = seconds;
    
    // Süreyi ekranda göreceğimiz sayı (birazdan HTML kısmında ekleyeceğiz)
    const timerDisplay = document.getElementById('oil-timer');
    if (timerDisplay) timerDisplay.innerText = timeLeft;

    oilTimer = setInterval(() => {
        timeLeft--;
        
        // Ekranda her saniye sayıyı güncelle
        if (timerDisplay) timerDisplay.innerText = timeLeft;

        // Süre bittiğinde kuleyi kilitle
        if (timeLeft <= 0) {
            clearInterval(oilTimer);
            oilGameOver("Süre Bitti! Sondaj kulesi zaman aşımından dolayı kilitlendi.", false);
        }
    }, 1000);
}
