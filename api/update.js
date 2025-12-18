// api/update.js
const axios = require('axios');
const { Pool } = require('pg');

module.exports = async (request, response) => {
    // 1. Ortam Değişkenleri
    const DATABASE_URL = process.env.DATABASE_URL;
    const EVDS_API_KEY = process.env.EVDS_API_KEY;
    const FRED_API_KEY = process.env.FRED_API_KEY;

    if (!DATABASE_URL) {
        return response.status(500).json({ error: "Veritabanı adresi (DATABASE_URL) eksik!" });
    }

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let statusReport = {
        database: "Beklemede",
        evds: "Atlandı",
        fred: "Atlandı",
        errors: []
    };

    try {
        // --- 2. Veritabanı Tablosu Kontrolü ---
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
            statusReport.database = "HATA: " + dbErr.message;
            throw new Error("Veritabanına bağlanılamadı: " + dbErr.message);
        }

        // --- 3. TCMB EVDS Verisi ---
        if (EVDS_API_KEY) {
            try {
                const END_DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
                // Header ekleyerek isteği güçlendirelim
                const evdsUrl = `https://evds2.tcmb.gov.tr/service/evds/series=TP.ZK&startDate=01-01-2024&endDate=${END_DATE}&type=json&key=${EVDS_API_KEY}`;
                
                const evdsRes = await axios.get(evdsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                const evdsItem = evdsRes.data.items && evdsRes.data.items[evdsRes.data.items.length - 1];
                
                if (evdsItem && evdsItem.TP_ZK) {
                    await pool.query(
                        'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                        ['EVDS', evdsItem.TP_ZK]
                    );
                    statusReport.evds = "Başarılı (" + evdsItem.TP_ZK + ")";
                } else {
                    statusReport.evds = "Veri Bulunamadı (Boş Yanıt)";
                }
            } catch (evdsErr) {
                console.error("EVDS Hatası:", evdsErr.message);
                statusReport.evds = "HATA (403 ise anahtar yanlış): " + evdsErr.message;
                statusReport.errors.push("EVDS: " + evdsErr.message);
            }
        } else {
            statusReport.evds = "API Anahtarı Eksik";
        }

        // --- 4. FRED Verisi ---
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
                    statusReport.fred = "Başarılı (" + fredItem.value + ")";
                } else {
                    statusReport.fred = "Veri Bulunamadı";
                }
            } catch (fredErr) {
                console.error("FRED Hatası:", fredErr.message);
                statusReport.fred = "HATA: " + fredErr.message;
                statusReport.errors.push("FRED: " + fredErr.message);
            }
        } else {
            statusReport.fred = "API Anahtarı Eksik";
        }

        // --- 5. Sonuç Dön ---
        return response.status(200).json({ 
            success: true, 
            report: statusReport 
        });

    } catch (mainError) {
        return response.status(500).json({ 
            fatal_error: mainError.message,
            report: statusReport
        });
    }
};