// api/data.js
// Bu dosya veritabanındaki verileri okuyup (SELECT) frontend'e gönderir.

const { Pool } = require('pg');

// Veritabanı bağlantı havuzu (Pool)
// Not: Serverless ortamda pool her istekte yeniden oluşabilir veya
// Vercel bunu optimize eder. Dışarıda tanımlamak best practice'dir.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(request, response) {
    // Sadece GET isteklerine izin verelim (İsteğe bağlı güvenlik)
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Veritabanından verileri çek
        const result = await pool.query('SELECT source, value, date FROM dashboard_data');
        
        // Başarılı yanıt döndür
        return response.status(200).json({
            success: true,
            data: result.rows 
        });

    } catch (error) {
        console.error("Veri Çekme Hatası:", error);
        return response.status(500).json({ 
            success: false, 
            message: "Veritabanı hatası",
            error: error.message 
        });
    }
}