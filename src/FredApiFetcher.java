import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class FredApiFetcher {

    // Lütfen API anahtarınızı buraya güvenli bir şekilde saklayın.
    // Gerçek bir uygulamada bu değeri ortam değişkenlerinden (Environment Variables) okumanız önerilir.
    private static final String API_KEY = "15b7329bd8d124d71a526e0e4ac0ab38";
    private static final String BASE_URL = "https://api.stlouisfed.org/fred/series/observations";

    /**
     * Belirtilen FRED serisi için gözlem verilerini çeker.
     *
     * @param seriesId Örneğin, "GDPC1" veya "UNRATE"
     * @param observationStart Veri çekilmeye başlanacak tarih (YYYY-MM-DD formatında)
     * @return FRED API'den gelen ham JSON yanıtı
     * @throws Exception Ağ bağlantısı veya API hatası durumunda
     */
    public String fetchSeriesData(String seriesId, String observationStart) throws Exception {
        // API isteği için URL oluşturuluyor.
        String urlString = String.format(
            "%s?series_id=%s&api_key=%s&file_type=json&sort_order=desc&observation_start=%s",
            BASE_URL, 
            seriesId, 
            API_KEY, 
            observationStart
        );
        
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("HTTP Hatası : " + conn.getResponseCode() + " - " + conn.getResponseMessage());
        }

        // Yanıt okuma
        BufferedReader br = new BufferedReader(new InputStreamReader(
            (conn.getInputStream())));

        String output;
        StringBuilder jsonResponse = new StringBuilder();
        while ((output = br.readLine()) != null) {
            jsonResponse.append(output);
        }

        conn.disconnect();
        return jsonResponse.toString();
    }

    public static void main(String[] args) {
        FredApiFetcher fetcher = new FredApiFetcher();
        String seriesId = "GDPC1"; // Reel GSYİH
        String startDate = "2020-01-01"; // 2020'den itibaren veri çek

        try {
            System.out.println("FRED API'den veri çekiliyor... Seri ID: " + seriesId);
            String jsonData = fetcher.fetchSeriesData(seriesId, startDate);
            // Burada JSON veriyi parse edip React uygulamasına uygun bir formata dönüştürmeniz gerekir.
            System.out.println("Çekilen Ham JSON Veri (İlk 500 karakter): \n" + jsonData.substring(0, Math.min(jsonData.length(), 500)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}