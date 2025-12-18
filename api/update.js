// api/update.js
// Bu dosya veritabanındaki verileri TCMB ve FRED'den çekerek günceller.

const axios = require('axios');
const { Pool } = require('pg');

// Vercel Serverless Fonksiyonu
export default async function handler(request, response) {
    // 1. Ortam Değişkenlerini Kontrol Et
    const DATABASE_URL = process.env.DATABASE_URL;
    const EVDS_API_KEY = process.env.EVDS_API_KEY;
    const FRED_API_KEY = process.env.FRED_API_KEY;

    
    if (!DATABASE_URL || !EVDS_API_KEY || !FRED_API_KEY) {
        return response.status(500).json({ 
            error: "Eksik Konfigürasyon", 
            details: "DATABASE_URL, EVDS_API_KEY veya FRED_API_KEY tanımlanmamış." 
        });
    }

    // 2. Veritabanı Bağlantısı (Havuz)
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false } // SSL Bağlantısı (Render/Vercel için gerekli)
    });

    try {
        // --- A) TCMB EVDS Verisi Çekme ---
        // Not: Tarihleri dinamik yapmak istersen burayı geliştirebilirsin.
        const END_DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
        const seriesCodeEvds = 'TP.ZK'; // Örnek seri
        const evdsUrl = `https://evds2.tcmb.gov.tr/service/evds/series=${seriesCodeEvds}&startDate=01-01-2024&endDate=${END_DATE}&type=json&key=${EVDS_API_KEY}`;

        console.log("TCMB EVDS'ye istek atılıyor...");
        const evdsResponse = await axios.get(evdsUrl);
        const evdsData = evdsResponse.data;
        
        // Veriyi güvenli bir şekilde alalım
        let evdsValue = null;
        if (evdsData.items && evdsData.items.length > 0) {
            evdsValue = evdsData.items[evdsData.items.length - 1].TP_ZK; // Son değeri al
        }

        if (evdsValue) {
             // Veritabanına Yazma
            await pool.query(
                'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                ['EVDS', evdsValue]
            );
        }

        // --- B) FRED Verisi Çekme ---
        const seriesCodeFred = 'GDP'; // Örnek seri
        const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesCodeFred}&api_key=${FRED_API_KEY}&file_type=json`;

        console.log("FRED'e istek atılıyor...");
        const fredResponse = await axios.get(fredUrl);
        const fredData = fredResponse.data;

        let fredValue = null;
        if (fredData.observations && fredData.observations.length > 0) {
            fredValue = fredData.observations[fredData.observations.length - 1].value;
        }

        if (fredValue) {
            // Veritabanına Yazma
            await pool.query(
                'INSERT INTO dashboard_data (source, value, date) VALUES ($1, $2, NOW()) ON CONFLICT (source) DO UPDATE SET value = $2, date = NOW()',
                ['FRED', fredValue]
            );
        }

        // --- C) Başarılı Yanıt ---
        return response.status(200).json({ 
            success: true, 
            message: "Veriler başarıyla güncellendi.",
            updates: { evds: evdsValue, fred: fredValue }
        });

    } catch (error) {
        console.error("Güncelleme Hatası:", error);
        return response.status(500).json({ error: error.message });
    } finally {
        // İşlem bitince havuzu kapatmaya gerek yok, Vercel yönetir ama
        // iyi bir pratik olarak burada bağlantıyı serbest bırakabiliriz.
        // Serverless ortamda pool.end() genelde kullanılmaz, connection timeout beklenir.
    }
}