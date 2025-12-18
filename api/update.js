const axios = require('axios');
const { Pool } = require('pg');

module.exports = async (request, response) => {
    const DATABASE_URL = process.env.DATABASE_URL;
    const EVDS_API_KEY = process.env.EVDS_API_KEY;
    const FRED_API_KEY = process.env.FRED_API_KEY;

    if (!DATABASE_URL || !EVDS_API_KEY || !FRED_API_KEY) {
        return response.status(500).json({ error: "Eksik Anahtarlar (Env Variables)" });
    }

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // 1. Tablo Yoksa Oluştur (İlk Çalıştırma İçin)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS dashboard_data (
                id SERIAL PRIMARY KEY,
                source VARCHAR(50) UNIQUE NOT NULL,
                value NUMERIC,
                date TIMESTAMP DEFAULT NOW(),
                meta VARCHAR(100)
            );
        `);

        // 2. TCMB Verisi (TP.ZK - Zorunlu Karşılık Örneği)
        const END_DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
        const evdsUrl = `https://evds2.tcmb.gov.tr/service/evds/series=TP.ZK&startDate=01-01-2024&endDate=${END_DATE}&type=json&key=${EVDS_API_KEY}`;
        
        const evdsRes = await axios.get(evdsUrl);
        const evdsItem = evdsRes.data.items && evdsRes.data.items[evdsRes.data.items.length - 1];
        if (evdsItem && evdsItem.TP_ZK) {
            await pool.query(
                'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                ['EVDS', evdsItem.TP_ZK]
            );
        }

        // 3. FRED Verisi (GDP Örneği)
        const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=${FRED_API_KEY}&file_type=json`;
        const fredRes = await axios.get(fredUrl);
        const fredItem = fredRes.data.observations && fredRes.data.observations[fredRes.data.observations.length - 1];
        if (fredItem && fredItem.value) {
            await pool.query(
                'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                ['FRED', fredItem.value]
            );
        }

        return response.status(200).json({ success: true, message: "Veritabanı ve Tablo Hazır, Veriler Güncellendi!" });

    } catch (error) {
        console.error("Hata:", error);
        return response.status(500).json({ error: error.message });
    }
};