// api/update.js
const axios = require('axios');
const { Pool } = require('pg');
const https = require('https');

// Terminalden çalıştırılırsa .env dosyasını yükle
if (require.main === module) {
    require('dotenv').config();
}

// 1. SSL/TLS Ayarları: TCMB'nin eski veya katı sertifika yapısını aşmak için
const httpsAgent = new https.Agent({  
    rejectUnauthorized: false,
    keepAlive: true
});

async function updateDataLogic() {
    const DATABASE_URL = process.env.DATABASE_URL;
    const EVDS_API_KEY = process.env.EVDS_API_KEY;
    const FRED_API_KEY = process.env.FRED_API_KEY;

    // --- DEBUG: Anahtar Kontrolü ---
    if (EVDS_API_KEY) {
        const maskedKey = EVDS_API_KEY.substring(0, 4) + "****" + EVDS_API_KEY.substring(EVDS_API_KEY.length - 4);
        console.log(`🔑 EVDS Anahtarı Yüklendi: ${maskedKey} (Uzunluk: ${EVDS_API_KEY.length})`);
    } else {
        console.error("❌ HATA: EVDS_API_KEY ortam değişkeni bulunamadı! .env dosyasını kontrol et.");
    }

    if (!DATABASE_URL) throw new Error("Veritabanı adresi (DATABASE_URL) eksik!");

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let statusReport = { database: "Beklemede", evds: "Atlandı", fred: "Atlandı", errors: [] };

    try {
        // --- Tablo Hazırlığı ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS dashboard_data (
                id SERIAL PRIMARY KEY,
                source VARCHAR(50) UNIQUE NOT NULL,
                value NUMERIC,
                date TIMESTAMP DEFAULT NOW(),
                meta VARCHAR(100)
            );
        `);
        statusReport.database = "Hazır";

        // --- EVDS VERİ ÇEKME ---
        if (EVDS_API_KEY) {
            try {
                // Tarih Formatı: GG-AA-YYYY
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const END_DATE = `${day}-${month}-${year}`;

                // URL (Key parametresi olmadan)
                const evdsUrl = `https://evds2.tcmb.gov.tr/service/evds/series=TP.ZK&startDate=01-01-2024&endDate=${END_DATE}&type=json`;
                
                console.log(`🌍 EVDS İsteği: ${evdsUrl}`);

                // İSTEK: Gerçek bir Chrome tarayıcısı taklidi yapıyoruz
                const evdsRes = await axios.get(evdsUrl, { 
                    headers: { 
                        'key': EVDS_API_KEY,  // API Anahtarı Header'da
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Connection': 'keep-alive',
                        'Referer': 'https://evds2.tcmb.gov.tr/'
                    },
                    httpsAgent: httpsAgent, // SSL hatasını yut
                    timeout: 10000 // 10 saniye zaman aşımı
                });

                // Yanıt Kontrolü
                if (evdsRes.data && typeof evdsRes.data === 'object') {
                    const items = evdsRes.data.items;
                    if (items && items.length > 0) {
                        const lastItem = items[items.length - 1];
                        // TP_ZK null olabilir, kontrol et
                        const val = lastItem.TP_ZK; 
                        
                        if (val) {
                            await pool.query(
                                'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                                ['EVDS', val]
                            );
                            statusReport.evds = `Başarılı (Değer: ${val})`;
                        } else {
                            statusReport.evds = "Veri boş geldi (Tatil günü veya veri yok)";
                        }
                    } else {
                        statusReport.evds = "API yanıt döndü ama liste boş.";
                    }
                } else {
                    console.log("EVDS Ham Yanıt:", evdsRes.data);
                    throw new Error("Beklenmeyen yanıt formatı (Muhtemelen HTML döndü)");
                }

            } catch (evdsErr) {
                const status = evdsErr.response ? evdsErr.response.status : 'Bilinmiyor';
                const msg = `EVDS Hatası (${status}): ${evdsErr.message}`;
                console.error(msg);
                
                if (status === 403) {
                    statusReport.evds = "HATA 403: Erişim Reddedildi. EVDS Profilindeki IP kısıtlamasını kontrol et!";
                } else {
                    statusReport.evds = msg;
                }
                statusReport.errors.push(msg);
            }
        }

        // --- FRED VERİ ÇEKME ---
        if (FRED_API_KEY) {
            // (Fred kodu aynı kalıyor, zaten çalışıyordu)
            try {
                const fredRes = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=${FRED_API_KEY}&file_type=json`);
                const item = fredRes.data.observations && fredRes.data.observations[fredRes.data.observations.length - 1];
                if (item && item.value) {
                    await pool.query('INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()', ['FRED', item.value]);
                    statusReport.fred = `Başarılı (${item.value})`;
                }
            } catch (e) { statusReport.errors.push("FRED: " + e.message); }
        }

        await pool.end();
        return statusReport;

    } catch (err) {
        if(pool) await pool.end();
        throw err;
    }
}

// Vercel Handler
module.exports = async (req, res) => {
    try {
        const report = await updateDataLogic();
        res.status(200).json({ success: true, report });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

// Local Script Handler
if (require.main === module) {
    updateDataLogic().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => console.error(e));
}