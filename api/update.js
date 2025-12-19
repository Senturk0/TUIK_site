// api/update.js
const axios = require('axios');
const { Pool } = require('pg');
const https = require('https');

// Eğer terminalden çalıştırılıyorsa .env dosyasını yükle
if (require.main === module) {
    require('dotenv').config();
}

// SSL Sertifika kontrolünü devre dışı bırakan ajan (EVDS bağlantı hataları için)
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

// Ana mantığı içeren fonksiyon (Hem API hem Script tarafından kullanılır)
async function updateDataLogic() {
    const DATABASE_URL = process.env.DATABASE_URL;
    const EVDS_API_KEY = process.env.EVDS_API_KEY;
    const FRED_API_KEY = process.env.FRED_API_KEY;

    let statusReport = {
        database: "Beklemede",
        evds: "Atlandı",
        fred: "Atlandı",
        errors: []
    };

    if (!DATABASE_URL) {
        throw new Error("Veritabanı adresi (DATABASE_URL) eksik! .env dosyasını kontrol et.");
    }

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // --- 1. Veritabanı Tablosu Kontrolü ---
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS dashboard_data (
                    id SERIAL PRIMARY KEY,
                    source VARCHAR(50) UNIQUE NOT NULL,
                    value NUMERIC,
                    date TIMESTAMP DEFAULT NOW(),
                    meta VARCHAR(100)
                );
            `);
            statusReport.database = "Bağlandı ve Tablo Hazır";
        } catch (dbErr) {
            throw new Error("Veritabanı bağlantı hatası: " + dbErr.message);
        }

        // --- 2. TCMB EVDS Verisi ---
        if (EVDS_API_KEY) {
            try {
                // Tarih formatı: GG-AA-YYYY (EVDS zorunluluğu)
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const END_DATE = `${day}-${month}-${year}`;

                // EVDS İsteği
                // Not: 'series=TP.ZK' Zorunlu Karşılık Oranlarıdır.
                // Eğer veri gelmezse, kodun doğru olup olmadığını EVDS web sitesinden kontrol et.
                const evdsUrl = `https://evds2.tcmb.gov.tr/service/evds/series=TP.ZK&startDate=01-01-2024&endDate=${END_DATE}&type=json`;
                
                console.log(`EVDS İsteği Atılıyor: ${evdsUrl}`); // Debug için log

                const evdsRes = await axios.get(evdsUrl, { 
                    headers: { 
                        'key': EVDS_API_KEY, // API Anahtarı Header'da olmalı
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': 'application/json'
                    },
                    httpsAgent: httpsAgent // SSL hatasını önlemek için
                });

                // EVDS bazen JSON yerine HTML hata sayfası dönebilir, onu kontrol edelim
                if (typeof evdsRes.data === 'string' && evdsRes.data.includes('<html>')) {
                    throw new Error("EVDS HTML hata sayfası döndü (API Key veya IP sorunu olabilir).");
                }

                const evdsItem = evdsRes.data.items && evdsRes.data.items[evdsRes.data.items.length - 1];
                
                if (evdsItem && evdsItem.TP_ZK) {
                    await pool.query(
                        'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                        ['EVDS', evdsItem.TP_ZK]
                    );
                    statusReport.evds = `Başarılı (Değer: ${evdsItem.TP_ZK})`;
                } else {
                    statusReport.evds = "Veri Bulunamadı (Boş Yanıt). Seri kodu veya tarih aralığını kontrol et.";
                    console.warn("EVDS Yanıtı:", JSON.stringify(evdsRes.data).substring(0, 200) + "...");
                }
            } catch (evdsErr) {
                console.error("EVDS Hatası Detay:", evdsErr.message);
                statusReport.evds = "HATA: " + evdsErr.message;
                statusReport.errors.push("EVDS: " + evdsErr.message);
            }
        } else {
            statusReport.evds = "API Anahtarı Eksik (EVDS_API_KEY)";
        }

        // --- 3. FRED Verisi ---
        if (FRED_API_KEY) {
            try {
                const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=${FRED_API_KEY}&file_type=json`;
                const fredRes = await axios.get(fredUrl);
                const fredItem = fredRes.data.observations && fredRes.data.observations[fredRes.data.observations.length - 1];
                
                if (fredItem && fredItem.value) {
                    await pool.query(
                        'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                        ['FRED', fredItem.value]
                    );
                    statusReport.fred = `Başarılı (Değer: ${fredItem.value})`;
                } else {
                    statusReport.fred = "Veri Bulunamadı";
                }
            } catch (fredErr) {
                console.error("FRED Hatası:", fredErr.message);
                statusReport.fred = "HATA: " + fredErr.message;
                statusReport.errors.push("FRED: " + fredErr.message);
            }
        }

        await pool.end(); // Havuzu kapat
        return statusReport;

    } catch (mainError) {
        if(pool) await pool.end();
        throw mainError;
    }
}

// --- Vercel API Handler (Web'den tetikleme için) ---
module.exports = async (request, response) => {
    try {
        const report = await updateDataLogic();
        response.status(200).json({ success: true, report });
    } catch (error) {
        console.error("API Handler Hatası:", error);
        response.status(500).json({ success: false, error: error.message });
    }
};

// --- Script Handler (Terminalden 'npm run update-data' için) ---
if (require.main === module) {
    console.log("Veri güncelleme işlemi başlatılıyor...");
    updateDataLogic()
        .then(report => {
            console.log("✅ İşlem Tamamlandı!");
            console.log(JSON.stringify(report, null, 2));
            process.exit(0);
        })
        .catch(error => {
            console.error("❌ Kritik Hata:", error.message);
            process.exit(1);
        });
}