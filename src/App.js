import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  ReferenceLine, ComposedChart, Area, AreaChart
} from 'recharts';
import { 
  Activity, TrendingUp, DollarSign, Percent, RefreshCw, 
  Info, HelpCircle, Briefcase, Factory, Globe, Database, 
  X, BarChart2, Home, Landmark, ShieldAlert, Zap, Layers, BarChart3, TrendingDown
} from 'lucide-react';

// --- MOCK VERİLER ---
const MOCK_DATA = {
  // TÜİK TÜFE Verisi
  inflation: [
    { date: '2024-12', value: 44.50, name: 'TÜFE' },
    { date: '2025-01', value: 41.20, name: 'TÜFE' },
    { date: '2025-02', value: 39.80, name: 'TÜFE' },
    { date: '2025-03', value: 38.50, name: 'TÜFE' },
    { date: '2025-04', value: 37.10, name: 'TÜFE' },
    { date: '2025-05', value: 35.80, name: 'TÜFE' },
    { date: '2025-06', value: 35.05, name: 'TÜFE' },
    { date: '2025-07', value: 33.52, name: 'TÜFE' },
    { date: '2025-08', value: 32.95, name: 'TÜFE' },
    { date: '2025-09', value: 33.29, name: 'TÜFE' },
    { date: '2025-10', value: 32.87, name: 'TÜFE' },
    { date: '2025-11', value: 32.50, name: 'TÜFE' },
    { date: '2025-12', value: 31.80, name: 'TÜFE' },
  ],
  interest: [
    { date: '2025-01', value: 45.0, name: 'Faiz' },
    { date: '2025-03', value: 42.5, name: 'Faiz' },
    { date: '2025-04', value: 46.0, name: 'Faiz' },
    { date: '2025-06', value: 46.0, name: 'Faiz' },
    { date: '2025-07', value: 43.0, name: 'Faiz' },
    { date: '2025-09', value: 40.5, name: 'Faiz' },
    { date: '2025-10', value: 39.5, name: 'Faiz' },
    { date: '2025-11', value: 39.5, name: 'Faiz' },
    { date: '2025-12', value: 39.0, name: 'Faiz' },
  ],
  exchange: [
    { date: '2025-11-01', usd: 41.95, eur: 44.80 },
    { date: '2025-11-10', usd: 42.15, eur: 45.10 },
    { date: '2025-11-15', usd: 42.30, eur: 45.25 },
    { date: '2025-11-20', usd: 42.42, eur: 45.40 },
    { date: '2025-11-24', usd: 42.48, eur: 45.55 },
    { date: '2025-11-26', usd: 42.45, eur: 45.50 }, 
    { date: '2025-12-01', usd: 42.60, eur: 45.75 },
  ],
  // Yurt İçi ÜFE (Yİ-ÜFE)
  producerPrice: [
    { date: '2024-12', value: 55.20, name: 'Yİ-ÜFE' },
    { date: '2025-01', value: 52.80, name: 'Yİ-ÜFE' },
    { date: '2025-02', value: 50.10, name: 'Yİ-ÜFE' },
    { date: '2025-03', value: 48.50, name: 'Yİ-ÜFE' },
    { date: '2025-04', value: 45.90, name: 'Yİ-ÜFE' },
    { date: '2025-05', value: 43.20, name: 'Yİ-ÜFE' },
    { date: '2025-06', value: 40.80, name: 'Yİ-ÜFE' },
    { date: '2025-07', value: 38.50, name: 'Yİ-ÜFE' },
    { date: '2025-08', value: 36.90, name: 'Yİ-ÜFE' },
    { date: '2025-09', value: 35.80, name: 'Yİ-ÜFE' },
    { date: '2025-10', value: 34.50, name: 'Yİ-ÜFE' },
    { date: '2025-11', value: 33.80, name: 'Yİ-ÜFE' },
    { date: '2025-12', value: 33.10, name: 'Yİ-ÜFE' }, 
  ],
  // İstanbul Ticaret Odası (İTO) TÜFE
  itoInflation: [
    { date: '2024-12', value: 46.10, name: 'İTO-TÜFE' },
    { date: '2025-01', value: 43.50, name: 'İTO-TÜFE' },
    { date: '2025-02', value: 42.10, name: 'İTO-TÜFE' },
    { date: '2025-03', value: 40.50, name: 'İTO-TÜFE' },
    { date: '2025-04', value: 38.80, name: 'İTO-TÜFE' },
    { date: '2025-05', value: 37.00, name: 'İTO-TÜFE' },
    { date: '2025-06', value: 36.20, name: 'İTO-TÜFE' },
    { date: '2025-07', value: 34.80, name: 'İTO-TÜFE' },
    { date: '2025-08', value: 34.10, name: 'İTO-TÜFE' },
    { date: '2025-09', value: 34.50, name: 'İTO-TÜFE' },
    { date: '2025-10', value: 33.90, name: 'İTO-TÜFE' },
    { date: '2025-11', value: 33.50, name: 'İTO-TÜFE' },
    { date: '2025-12', value: 32.80, name: 'İTO-TÜFE' }, 
  ],
};

const NEW_MOCK_DATA = {
  gdpGrowth: [
    { date: '2023-Q4', value: 3.4, name: 'GSYİH Büyüme' },
    { date: '2024-Q1', value: 4.8, name: 'GSYİH Büyüme' },
    { date: '2024-Q2', value: 5.2, name: 'GSYİH Büyüme' },
    { date: '2024-Q3', value: 4.5, name: 'GSYİH Büyüme' },
    { date: '2024-Q4', value: 3.8, name: 'GSYİH Büyüme' },
    { date: '2025-Q1', value: 2.1, name: 'GSYİH Büyüme' },
    { date: '2025-Q2', value: 0.9, name: 'GSYİH Büyüme' },
    { date: '2025-Q3', value: 1.2, name: 'GSYİH Büyüme' },
  ],
  balanceOfPayments: [
    { date: '2024-05', value: -2.8, desc: 'Mayıs: -2.8 Milyar $', name: 'Cari Denge' },
    { date: '2024-07', value: 0.5, desc: 'Temmuz: +0.5 Milyar $', name: 'Cari Denge' },
    { date: '2024-09', value: 1.2, desc: 'Eylül: +1.2 Milyar $', name: 'Cari Denge' },
    { date: '2024-11', value: 0.8, desc: 'Kasım: +0.8 Milyar $', name: 'Cari Denge' },
    { date: '2025-01', value: -1.5, desc: 'Ocak: -1.5 Milyar $', name: 'Cari Denge' },
    { date: '2025-03', value: 2.5, desc: 'Mart: +2.5 Milyar $', name: 'Cari Denge' },
    { date: '2025-05', value: 3.1, desc: 'Mayıs: +3.1 Milyar $', name: 'Cari Denge' },
    { date: '2025-07', value: 1.8, desc: 'Temmuz: +1.8 Milyar $', name: 'Cari Denge' },
    { date: '2025-09', value: 0.8, desc: 'Eylül: +0.8 Milyar $', name: 'Cari Denge' },
  ],
  foreignTrade: [
    { date: '2025-03', export: 25.4, import: 33.1, name: 'İhracat/İthalat' },
    { date: '2025-05', export: 23.8, import: 30.5, name: 'İhracat/İthalat' },
    { date: '2025-07', export: 24.9, import: 31.9, name: 'İhracat/İthalat' },
    { date: '2025-09', export: 26.1, import: 32.5, name: 'İhracat/İthalat' },
    { date: '2025-10', export: 25.5, import: 31.2, name: 'İhracat/İthalat' },
    { date: '2025-11', export: 25.8, import: 31.5, name: 'İhracat/İthalat' }, 
  ]
};

// --- KRİTİK VERİ SETLERİ ---
const ADDITIONAL_DATA = {
  // 1. TCMB Rezervleri
  reserves: [
    { date: '2024-01', gross: 125.0, net: 15.0 },
    { date: '2024-03', gross: 128.5, net: 18.5 },
    { date: '2024-05', gross: 130.2, net: 20.1 },
    { date: '2024-07', gross: 133.0, net: 23.5 },
    { date: '2024-09', gross: 135.2, net: 25.0 },
    { date: '2024-11', gross: 138.4, net: 28.5 },
    { date: '2025-01', gross: 140.1, net: 30.1 },
    { date: '2025-03', gross: 142.5, net: 33.5 },
    { date: '2025-05', gross: 145.8, net: 37.0 },
    { date: '2025-07', gross: 148.0, net: 39.4 },
    { date: '2025-09', gross: 151.5, net: 42.8 },
    { date: '2025-11', gross: 153.0, net: 45.0 },
  ],
  // 2. CDS Primi
  cds: [
    { date: '2025-01', value: 285 },
    { date: '2025-03', value: 270 },
    { date: '2025-05', value: 265 },
    { date: '2025-07', value: 255 },
    { date: '2025-09', value: 248 },
    { date: '2025-11', value: 242 },
  ],
  // 3. Kredi Hacmi Yıllık Büyümesi
  creditGrowth: [
    { date: '2025-01', value: 35.2 },
    { date: '2025-03', value: 32.1 },
    { date: '2025-05', value: 28.5 },
    { date: '2025-07', value: 25.4 },
    { date: '2025-09', value: 22.8 },
    { date: '2025-11', value: 20.5 },
  ],
  // 4. Sanayi Üretim Endeksi
  industrialProduction: [
    { date: '2025-01', value: 132.5 },
    { date: '2025-03', value: 134.2 },
    { date: '2025-05', value: 136.8 },
    { date: '2025-07', value: 135.4 },
    { date: '2025-09', value: 138.1 },
    { date: '2025-11', value: 139.5 },
  ],
  // 5. Kısa Vadeli Dış Borç (Kalan Vade)
  shortTermDebt: [
    { date: '2025-01', value: 185.2 },
    { date: '2025-03', value: 182.5 },
    { date: '2025-05', value: 179.8 },
    { date: '2025-07', value: 176.4 },
    { date: '2025-09', value: 174.2 },
    { date: '2025-11', value: 172.5 },
  ],
  // 6. TCMB Ağırlıklı Ortalama Fonlama Maliyeti (AOFM)
  weightedAverageFundingCost: [
    { date: '2025-01', value: 45.0 },
    { date: '2025-03', value: 42.6 },
    { date: '2025-05', value: 41.5 },
    { date: '2025-07', value: 40.0 },
    { date: '2025-09', value: 39.5 },
    { date: '2025-11', value: 39.0 },
  ],
  // 7. PMI (Satın Alma Yöneticileri Endeksi)
  pmiIndex: [
    { date: '2025-01', value: 50.8, name: 'PMI' },
    { date: '2025-03', value: 49.5, name: 'PMI' },
    { date: '2025-05', value: 48.9, name: 'PMI' },
    { date: '2025-07', value: 50.2, name: 'PMI' },
    { date: '2025-09', value: 51.5, name: 'PMI' },
    { date: '2025-11', value: 52.1, name: 'PMI' }, 
  ],
  // 8. Konut Piyasası
  housing: [
    { date: '2025-01', priceIndex: 1050, sales: 85 },
    { date: '2025-03', priceIndex: 1080, sales: 92 },
    { date: '2025-05', priceIndex: 1120, sales: 105 },
    { date: '2025-07', priceIndex: 1150, sales: 98 },
    { date: '2025-09', priceIndex: 1180, sales: 110 },
    { date: '2025-11', priceIndex: 1210, sales: 115 },
  ],
  // 9. Tüketici Güven Endeksi
  consumerConfidence: [
    { date: '2025-01', value: 72.5 },
    { date: '2025-03', value: 74.2 },
    { date: '2025-05', value: 76.8 },
    { date: '2025-07', value: 78.5 },
    { date: '2025-09', value: 80.1 },
    { date: '2025-11', value: 81.5 },
  ],
  // 10. Merkezi Yön. Bütçe Dengesi
  budgetBalance: [
    { date: '2025-01', value: -120.5 },
    { date: '2025-03', value: -95.2 },
    { date: '2025-05', value: 15.8 }, 
    { date: '2025-07', value: -45.6 },
    { date: '2025-09', value: -65.2 },
    { date: '2025-11', value: 25.4 },
  ],
  // 11. Turizm Verileri
  tourism: [
    { date: '2025-01', revenue: 2.1, visitors: 1.8 },
    { date: '2025-03', revenue: 2.8, visitors: 2.5 },
    { date: '2025-05', revenue: 4.5, visitors: 4.2 },
    { date: '2025-07', revenue: 6.8, visitors: 7.5 },
    { date: '2025-09', revenue: 5.9, visitors: 6.2 },
    { date: '2025-11', revenue: 3.2, visitors: 2.9 },
  ],
  // 12. Reel Efektif Döviz Kuru (REDK) Endeksi
  realEffectiveExchangeRate: [
    { date: '2025-01', value: 58.5 },
    { date: '2025-03', value: 57.1 },
    { date: '2025-05', value: 55.8 },
    { date: '2025-07', value: 56.5 },
    { date: '2025-09', value: 59.2 },
    { date: '2025-11', value: 60.1 }, 
  ],
  // 13. Mevduat Faizi ve Kredi Faizi Makası
  interestRateSpread: [
    { date: '2025-01', deposit: 38.0, credit: 43.5, value: 5.5 },
    { date: '2025-03', deposit: 35.5, credit: 40.8, value: 5.3 },
    { date: '2025-05', deposit: 33.0, credit: 37.0, value: 4.0 },
    { date: '2025-07', deposit: 32.5, credit: 36.5, value: 4.0 },
    { date: '2025-09', deposit: 31.0, credit: 35.0, value: 4.0 },
    { date: '2025-11', deposit: 30.5, credit: 34.3, value: 3.8 },
  ],
  // 14. Bankacılık Sektörü Takipteki Alacaklar Oranı (NPL)
  nplRatio: [
    { date: '2025-01', value: 1.8 },
    { date: '2025-03', value: 1.9 },
    { date: '2025-05', value: 2.1 },
    { date: '2025-07', value: 2.3 },
    { date: '2025-09', value: 2.5 },
    { date: '2025-11', value: 2.8 },
  ],
  // 15. Hizmet Üretici Fiyat Endeksi (HÜFE)
  serviceProducerPriceIndex: [
    { date: '2025-01', value: 98.5 },
    { date: '2025-03', value: 101.2 },
    { date: '2025-05', value: 103.4 },
    { date: '2025-07', value: 105.1 },
    { date: '2025-09', value: 107.0 },
    { date: '2025-11', value: 109.5 },
  ],
  // 16. Yabancı Ziyaretçi Başına Ortalama Turizm Geliri ($)
  avgTourismRevenuePerVisitor: [
    { date: '2025-Q1', value: 650 },
    { date: '2025-Q2', value: 710 },
    { date: '2025-Q3', value: 755 },
    { date: '2025-Q4', value: 690 },
  ],
  // 17. İhracatın İthalatı Karşılama Oranı (Altın Hariç)
  exportToImportRatio: [
    { date: '2025-01', value: 72.5 },
    { date: '2025-03', value: 75.8 },
    { date: '2025-05', value: 74.2 },
    { date: '2025-07', value: 76.1 },
    { date: '2025-09', value: 77.5 },
    { date: '2025-11', value: 78.0 },
  ],
  // 18. Reel Kesim Güven Endeksi (RKGE)
  realSectorConfidenceIndex: [
    { date: '2025-01', value: 105.2 },
    { date: '2025-03', value: 103.8 },
    { date: '2025-05', value: 102.1 },
    { date: '2025-07', value: 104.5 },
    { date: '2025-09', value: 106.3 },
    { date: '2025-11', value: 108.0 },
  ],
  // 19. Kapasite Kullanım Oranı (KKR) – İmalat Sanayi Alt Sektör Kırılımı
  kkrSubSector: [
    { date: '2025-01', highTech: 65.0, lowTech: 80.5 },
    { date: '2025-05', highTech: 66.5, lowTech: 79.8 },
    { date: '2025-09', highTech: 68.0, lowTech: 78.5 },
    { date: '2025-11', highTech: 69.5, lowTech: 77.0 },
  ],
  // 20. Tüketici Kredileri Oranı (DÜZELTİLDİ: Stacked Area Chart için)
  consumerVsNeedsCreditRatio: [
    { date: '2025-01', konut: 25, tasit: 5, ihtyac: 30, diger: 40 }, 
    { date: '2025-03', konut: 24, tasit: 6, ihtyac: 32, diger: 38 },
    { date: '2025-05', konut: 23, tasit: 7, ihtyac: 33, diger: 37 },
    { date: '2025-07', konut: 22, tasit: 8, ihtyac: 34, diger: 36 },
    { date: '2025-09', konut: 21, tasit: 9, ihtyac: 35, diger: 35 },
    { date: '2025-11', konut: 20, tasit: 10, ihtyac: 36, diger: 34 },
  ],
  // 21. Mevduat Kompozisyonu (TL/DTA/KKM Payı) - YENİ
  tlVsFxDeposits: [
    { date: '2025-01', TL: 50, DTA: 40, KKM: 10 }, 
    { date: '2025-03', TL: 52, DTA: 35, KKM: 13 },
    { date: '2025-05', TL: 55, DTA: 30, KKM: 15 },
    { date: '2025-07', TL: 58, DTA: 25, KKM: 17 },
    { date: '2025-09', TL: 60, DTA: 20, KKM: 20 },
    { date: '2025-11', TL: 65, DTA: 15, KKM: 20 },
  ],
  // YENİ EKLENEN PKA VE RİSK VERİLERİ (Beklenti & Risk Sekmesi için)
  pkaInflation12m: [
    { date: '2025-01', value: 30.5 },
    { date: '2025-05', value: 28.2 },
    { date: '2025-09', value: 26.5 },
    { date: '2025-12', value: 25.1 },
  ],
  pkaFxYearEnd: [
    { date: '2025-01', value: 48.5 },
    { date: '2025-05', value: 45.2 },
    { date: '2025-09', value: 43.8 },
    { date: '2025-12', value: 43.4 },
  ],
  pkaInterest24m: [
    { date: '2025-01', value: 25.0 },
    { date: '2025-05', value: 22.0 },
    { date: '2025-09', value: 18.5 },
    { date: '2025-12', value: 16.0 },
  ],
  fxOpenPosition: [
    { date: '2025-01', value: -140 },
    { date: '2025-03', value: -135 },
    { date: '2025-05', value: -130 },
    { date: '2025-07', value: -125 },
    { date: '2025-09', value: -120 },
    { date: '2025-11', value: -115 },
  ],
  householdDebtGdp: [
    { date: '2025-01', value: 12.8 },
    { date: '2025-03', value: 12.5 },
    { date: '2025-05', value: 12.3 },
    { date: '2025-07', value: 12.0 },
  ],
  syRatio: [
    { date: '2025-01', value: 17.8 },
    { date: '2025-03', value: 18.0 },
    { date: '2025-05', value: 17.9 },
    { date: '2025-07', value: 18.1 },
  ],
};


// --- TÜM VERİ AÇIKLAMALARI ---
const DEEP_ANALYSIS_INFO = {
    reserves: { title: 'TCMB Brüt ve Net Rezervleri (Milyar $)', icon: Landmark, desc: 'Merkez Bankası\'nın elindeki altın ve döviz varlıklarıdır. Net rezervler, swaplar ve zorunlu karşılıklar gibi yükümlülükler düşüldükten sonraki **kullanılabilir döviz varlığını** gösterir. Uzun vadede artması, ülkenin dış şoklara karşı dayanıklılığını artırır.' },
    cds: { title: 'CDS Primi (5 Yıllık, Baz Puan)', icon: ShieldAlert, desc: '**Credit Default Swap**, Türkiye Cumhuriyeti\'nin 5 yıllık borcunu sigortalamanın maliyetini gösteren bir **risk primi göstergesidir**. Düşmesi, risk algısının azaldığını ve borçlanma maliyetlerinin düştüğünü ifade eder.' },
    creditGrowth: { title: 'Kredi Hacmi Yıllık Büyümesi (%)', icon: DollarSign, desc: 'Bankacılık sektörünün toplam kredi hacmindeki yıllık değişim oranını gösterir. Hızlı kredi büyümesi ekonomik canlanmaya, ancak aynı zamanda **enflasyon ve cari açık riskine** işaret edebilir.' },
    industrialProduction: { title: 'Sanayi Üretim Endeksi (Yıllık Değişim)', icon: Factory, desc: 'Mevsim ve takvim etkilerinden arındırılmış sanayi üretimindeki aylık veya yıllık değişimi ifade eder. **GSYİH büyümesi için önemli bir öncü göstergedir**.' },
    shortTermDebt: { title: 'Kısa Vadeli Dış Borç (Kalan Vade, Milyar $)', icon: Briefcase, desc: 'Ülkenin bir yıl içinde ödemesi gereken toplam borç stoku. Döviz likidite riskini gösteren ana göstergedir.' },
    weightedAverageFundingCost: { title: 'TCMB Ağırlıklı Ort. Fonlama Maliyeti (%)', icon: Percent, desc: 'Merkez Bankası\'nın piyasayı fonladığı ağırlıklı ortalama faiz maliyetidir. Politika faizinin anlık uygulamasını gösterir.' },
    pmiIndex: { title: 'İmalat Sanayii PMI Endeksi', icon: BarChart3, desc: 'İmalat sektöründeki genel ekonomik sağlığı gösteren bir öncü göstergedir. **50\'nin üzerindeki değerler sektörde büyümeye**, altındaki değerler ise daralmaya işaret eder.' },
    realEffectiveExchangeRate: { title: 'Reel Efektif Döviz Kuru (REDK) Endeksi', icon: Layers, desc: 'TL\'nin diğer para birimlerine karşı **reel (enflasyondan arındırılmış)** değerini gösterir. Düşüş (100 altı), TL\'nin **rekabet gücünü** artırır.' },
    housing: { title: 'Konut Piyasası (Fiyat Endeksi & Satış Adedi)', icon: Home, desc: 'KFE (Konut Fiyat Endeksi) konutların reel değerindeki değişimi, Satış Adetleri ise piyasadaki işlem hacmini gösterir. Satışlardaki düşüş, parasal sıkılaşmanın etkisini işaret edebilir.' },
    consumerConfidence: { title: 'Tüketici Güven Endeksi', icon: Activity, desc: 'Tüketicilerin mevcut ve gelecekteki ekonomik duruma yönelik iyimserlik veya kötümserlik düzeyini ölçer. **100 seviyesi denge noktasıdır**.' },
    interestRateSpread: { title: 'Mevduat vs Kredi Faizi Makası (%)', icon: Percent, desc: 'Bankaların topladığı mevduata verdiği faiz ile kullandırdığı kredi faizi arasındaki farktır. Bankacılık sektörünün risk iştahını ve karlılığını gösterir.' },
    nplRatio: { title: 'Takipteki Alacaklar Oranı (NPL, %)', icon: ShieldAlert, desc: 'Bankacılık sektöründe tahsil edilemeyen (takipteki) kredilerin toplam kredilere oranıdır. Yüksek NPL, ekonomik durgunluk ve kredi riskinde artışa işaret eder.' },
    serviceProducerPriceIndex: { title: 'Hizmet ÜFE (Yıllık % Değişim)', icon: TrendingUp, desc: 'Hizmet sektöründeki (taşımacılık, konaklama vb.) maliyet artışlarını ölçer. **TÜFE enflasyonu için önemli bir öncü göstergedir**.' },
    avgTourismRevenuePerVisitor: { title: 'Ziyaretçi Başına Ortalama Gelir ($)', icon: Globe, desc: 'Gelen yabancı turistlerin kişi başına bıraktığı ortalama döviz miktarını gösterir. Ülke turizm sektörünün niteliksel gelişimini izlemek için önemlidir.' },
    exportToImportRatio: { title: 'İhracatın İthalatı Karşılama Oranı (Altın Hariç) (%)', icon: Briefcase, desc: 'İthalatın ne kadarının ihracatla karşılandığını gösteren kritik orandır. Altın hariç tutulması, daha yapısal bir dış ticaret performansını gösterir.' },
    realSectorConfidenceIndex: { title: 'Reel Kesim Güven Endeksi (RKGE)', icon: Factory, desc: 'İmalat sanayiindeki yöneticilerin üretim, talep, istihdam ve genel ekonomik duruma dair beklentilerini özetler. **100 üzeri iyimserliği** gösterir.' },
    kkrSubSector: { title: 'KKR: Yüksek vs Düşük Teknoloji (%)', icon: Zap, desc: 'İmalat sanayiinde alt sektörlerin (yüksek ve düşük teknoloji) Kapasite Kullanım Oranı farkını gösterir. Yüksek teknolojinin payının artması sanayi yapısının gelişimini işaret eder.' },
    tufeItoTefe: { title: 'TÜİK vs İTO TÜFE (Yıllık %)', icon: TrendingUp, desc: 'TÜİK verisi Türkiye genelindeki tüketici fiyatlarını, İTO verisi ise yalnızca İstanbul\'daki fiyat değişimlerini yansıtır. Her ikisinin karşılaştırılması, bölgesel enflasyon dinamiklerini ve resmi veri dışındaki eğilimleri anlamak için önemlidir.'},
    tufeUfe: { title: 'TÜFE vs Yİ-ÜFE (Yıllık %)', icon: TrendingDown, desc: 'TÜFE (Tüketici Fiyatları) ve Yİ-ÜFE (Üretici Fiyatları) arasındaki makas, nihai tüketiciye yansıyacak maliyet baskısını gösterir. Yİ-ÜFE\'nin TÜFE\'den yüksek olması, yakın dönemde Tüketici Enflasyonunda artış baskısı yaratır.'},
    budgetBalance: { title: 'Merkezi Yön. Bütçe Dengesi (Milyar TL)', icon: Landmark, desc: 'Devletin gelirleri ile giderleri arasındaki farktır. Pozitif değer **bütçe fazlasını** (yeşil), negatif değer ise **bütçe açığını** (kırmızı) gösterir.' },
    tourism: { title: 'Turizm Gelirleri ve Ziyaretçi Sayısı', icon: Globe, desc: 'Turizmden elde edilen döviz gelirleri ve ülkeye gelen ziyaretçi sayısı. **Cari işlemler dengesine doğrudan pozitif katkı sağlar**.' },
    consumerVsNeedsCreditRatio: { title: 'Tüketici Kredileri Oranı (Konut/Taşıt/İhtiyaç, %)', icon: DollarSign, desc: 'Toplam kredi hacmi içindeki Tüketici Kredileri paylarının dağılımını gösterir. İhtiyaç kredisi payındaki hızlı artış hanehalkı borçlanma riskini işaret edebilir.' },
    tlVsFxDeposits: { title: 'Mevduat Kompozisyonu (TL/DTA/KKM Payı, %)', icon: Landmark, desc: 'Toplam mevduat içindeki Türk Lirası, Döviz Tevdiat Hesapları (DTA) ve Kur Korumalı Mevduat (KKM) paylarının dağılımını gösterir. TL payının artması Liralaşma Stratejisi için olumludur.' },
    pkaInflation12m: { title: 'PKA 12 Ay Sonrası TÜFE Beklentisi (%)', icon: TrendingDown, desc: 'Piyasa Katılımcıları Anketinde belirlenen, bir yıl sonraki enflasyon beklentisidir. Enflasyonla mücadelede **beklentileri yönetmek** en kritik başarı göstergesidir.' },
    pkaFxYearEnd: { title: 'PKA Yıl Sonu USD/TRY Beklentisi (TL)', icon: DollarSign, desc: 'Piyasa katılımcılarının cari yıl sonu için öngördüğü döviz kuru seviyesidir. Kur risk algısını ve ithal girdi maliyet beklentilerini yansıtır.' },
    pkaInterest24m: { title: 'PKA 24 Ay Sonrası Politika Faizi Beklentisi (%)', icon: Percent, desc: 'Piyasaların, 2 yıl sonraki faiz seviyesine dair tahminidir. Para politikasının **orta vadeli duruşunun** algısını gösterir.' },
    fxOpenPosition: { title: 'Reel Sektör YP Açık Pozisyon (Milyar $)', icon: ShieldAlert, desc: 'Reel sektörün döviz cinsinden yükümlülüklerinin varlıklarından ne kadar fazla olduğunu gösterir. Yüksek açık pozisyon, kur artışlarında **finansal kırılganlığı** artırır.' },
    householdDebtGdp: { title: 'Hanehalkı Borcunun GSYİH\'ye Oranı (%)', icon: Home, desc: 'Hanehalkı toplam borcunun milli gelire oranını gösterir. Türkiye\'de düşük seyretmesi, sistemik risk açısından olumlu bir tampon oluşturur.' },
    syRatio: { title: 'Bankacılık Sermaye Yeterlilik Rasyosu (SYR, %)', icon: Landmark, desc: 'Bankaların yasal olarak belirlediği riskli varlıklara karşı ne kadar sermaye tuttuğunu gösterir. Yüksek SYR, sektörün şoklara karşı dayanıklılığını gösterir.' },
};


// --- YARDIMCI BİLEŞENLER ---
const ChartSection = ({ dataKey, info, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
    <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
      <h3 className="text-md font-semibold text-gray-800 flex items-center">
        <info.icon size={18} className={`mr-2 ${dataKey === 'cds' || dataKey === 'nplRatio' || dataKey === 'fxOpenPosition' ? 'text-red-700' : 'text-indigo-600'}`} />
        {info.title}
        
        {/* TOOLTIP EKLENDİ */}
        <div className="ml-2 text-gray-400 hover:text-blue-500 transition-colors cursor-help relative group/tooltip">
          <Info size={16} />
          {/* Tooltip Content */}
          <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 border border-gray-700 pointer-events-none">
            <div className="font-semibold mb-1 text-gray-300">Ne Anlama Gelir?</div>
            {info.desc}
            {/* Triangle pointer */}
            <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 transform rotate-45 border-t border-l border-gray-700"></div>
          </div>
        </div>
      </h3>
    </div>
    <div className="h-[250px]"> 
      {children}
    </div>
  </div>
);

const Card = ({ title, value, subValue, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'} flex items-center`}>
        {trend === 'up' ? '▲' : '▼'} {subValue}
      </span>
      <span className="text-gray-400 ml-2">Gecen doneme gore</span>
    </div>
  </div>
);

const GraphModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  
  const ChartComponent = data.type === 'bar' ? BarChart : LineChart;
  const DataComponent = data.type === 'bar' ? Bar : Line;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const unit = data.unit || (data.isRate ? '%' : '');

      return (
        <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-md text-sm">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color }}>
              {p.name}: 
              <span className="font-medium ml-1">
                {p.value} {unit}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-4xl h-5/6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900">{data.name} Detaylı Trend</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="h-[90%] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data.data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} tickFormatter={val => data.isRate ? `${val}%` : val} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              {/* PMI için özel ReferenceLine eklendi */}
              {data.dataKey === 'value' && data.name.includes('PMI') && (
                  <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: '50 (Eşik Değer)', fill: '#f59e0b' }} />
              )}
              <DataComponent 
                type={data.type === 'line' ? 'monotone' : data.type === 'step' ? 'stepAfter' : 'monotone'} 
                dataKey={data.dataKey} 
                name={data.name} 
                stroke={data.color} 
                fill={data.color} 
                strokeWidth={2}
              />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------
// --- ANA TAB BİLEŞENLERİ ---
// -----------------------------------------------------------

// Yeni Enflasyon Detay Sekmesi (TÜFE/ÜFE, TÜİK/İTO)
const InflationTab = () => (
    <div className="space-y-8">
        
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <TrendingUp className="mr-3 text-red-700" /> Enflasyon Dinamikleri
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Grafik 1: TÜFE vs. Yİ-ÜFE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜFE (Tüketici) vs. Yİ-ÜFE (Üretici) Yıllık Değişim (%)</h3>
                <p className="text-xs text-gray-500 mb-4">
                    **İpucu:** Yİ-ÜFE'nin TÜFE'den yüksek olması, üretim maliyetlerindeki artışın henüz tam olarak tüketiciye yansımadığını ve gelecekte enflasyon baskısının artabileceğini gösterir. Bu iki endeks arasındaki makas yakından izlenmelidir.
                </p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_DATA.inflation} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" tickFormatter={(val) => val.substring(5)} />
                            <YAxis domain={['auto', 'auto']} unit="%" />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="TÜFE (TÜİK)" stroke="#dc2626" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="value" data={MOCK_DATA.producerPrice} name="Yİ-ÜFE (TÜİK)" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grafik 2: TÜİK TÜFE vs. İTO TÜFE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜİK vs İTO Tüketici Fiyat Endeksi (Yıllık %)</h3>
                <p className="text-xs text-gray-500 mb-4">
                    **İpucu:** İstanbul (İTO) enflasyonu, Türkiye ekonomisinin büyük bir bölümünü temsil ettiği için, TCMB ve piyasa aktörleri tarafından TÜİK'in ulusal verisi ile birlikte dikkate alınır. Bu iki verinin seyri, bölgesel enflasyon dinamiklerini ve resmi veri dışındaki eğilimleri anlamak için önemlidir.
                </p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_DATA.inflation} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" tickFormatter={(val) => val.substring(5)} />
                            <YAxis domain={['auto', 'auto']} unit="%" />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="TÜFE (TÜİK)" stroke="#065f46" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="value" data={MOCK_DATA.itoInflation} name="TÜFE (İTO)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

    </div>
);

// Yeni Bankacılık Sekmesi
const BankingTab = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                <Landmark className="mr-3 text-indigo-700" /> Kredi & Mevduat Analizi
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Kredi Hacmi Yıllık Büyümesi */}
                <ChartSection dataKey="creditGrowth" info={DEEP_ANALYSIS_INFO.creditGrowth}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ADDITIONAL_DATA.creditGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{fontSize: 10}} />
                            <YAxis unit="%" />
                            <RechartsTooltip formatter={(value) => [`%${value.toFixed(1)}`, 'Yıllık Büyüme']} />
                            <Bar dataKey="value" name="Yıllık Büyüme %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartSection>

                {/* Takipteki Alacaklar Oranı (NPL) - Bankacılık Sekmesinde tutuldu */}
                <ChartSection dataKey="nplRatio" info={DEEP_ANALYSIS_INFO.nplRatio}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ADDITIONAL_DATA.nplRatio} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis unit="%" domain={['auto', 'auto']} />
                            <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, 'NPL Oranı']} />
                            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fecaca" strokeWidth={2} name="Takipteki Alacaklar" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartSection>

                {/* Tüketici Kredileri Oranı (DÜZELTİLDİ: Stacked Area Chart) */}
                <ChartSection dataKey="consumerVsNeedsCreditRatio" info={DEEP_ANALYSIS_INFO.consumerVsNeedsCreditRatio}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ADDITIONAL_DATA.consumerVsNeedsCreditRatio}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis unit=" %" domain={[0, 100]}/>
                            <RechartsTooltip />
                            <Legend />
                            <Area type="monotone" dataKey="konut" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Konut Kredisi (%)" />
                            <Area type="monotone" dataKey="tasit" stackId="1" stroke="#fb923c" fill="#fed7aa" name="Taşıt Kredisi (%)" />
                            <Area type="monotone" dataKey="ihtyac" stackId="1" stroke="#dc2626" fill="#fecaca" name="İhtiyaç Kredisi (%)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartSection>

                {/* Mevduat Kompozisyonu (YENİ: TL/DTA/KKM) */}
                <ChartSection dataKey="tlVsFxDeposits" info={DEEP_ANALYSIS_INFO.tlVsFxDeposits}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ADDITIONAL_DATA.tlVsFxDeposits}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis unit=" %" domain={[0, 100]}/>
                            <RechartsTooltip />
                            <Legend />
                            <Area type="monotone" dataKey="TL" stackId="1" stroke="#16a34a" fill="#bbf7d0" name="TL Mevduat Payı" />
                            <Area type="monotone" dataKey="KKM" stackId="1" stroke="#f59e0b" fill="#fcd34d" name="KKM Payı" />
                            <Area type="monotone" dataKey="DTA" stackId="1" stroke="#2563eb" fill="#93c5fd" name="DTA (YP) Payı" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartSection>
            </div>
        </div>
    );
};


const IndicatorsTab = () => {
  const gdpGrowthData = NEW_MOCK_DATA.gdpGrowth;
  const balanceData = NEW_MOCK_DATA.balanceOfPayments;
  const foreignTradeData = NEW_MOCK_DATA.foreignTrade;

  return (
    <div className="space-y-8">
      {/* GSYİH Reel Büyüme */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp size={20} className="text-red-700 mr-2" />
          Gayri Safi Yurtiçi Hasıla (GSYİH) Yıllık Reel Büyüme (%)
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={gdpGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name={gdpGrowthData[0].name} stroke={'#16a34a'} strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cari İşlemler Dengesi */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign size={20} className="text-blue-700 mr-2" />
            Cari İşlemler Dengesi (Milyar $)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <RechartsTooltip formatter={(value, name, props) => [props.payload.desc, name]} />
              <Legend />
              <Bar dataKey="value" fill={'#2563eb'} radius={[4, 4, 0, 0]} name={balanceData[0].name} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dış Ticaret */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Briefcase size={20} className="text-yellow-700 mr-2" />
            Dış Ticaret (Milyar $)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={foreignTradeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="export" name="İhracat (Milyar $)" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="import" name="İthalat (Milyar $)" stroke="#1f2937" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YENİ EKLENEN VERİLERİN GRAFİK GÖSTERİMİ */}
      <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
          <Database className="mr-3 text-red-700" /> Ek Makroekonomik Göstergeler
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Kısa Vadeli Dış Borç */}
            <ChartSection dataKey="shortTermDebt" info={DEEP_ANALYSIS_INFO.shortTermDebt}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ADDITIONAL_DATA.shortTermDebt}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 10}} />
                        <YAxis unit=" Mlr $" domain={['auto', 'auto']} />
                        <RechartsTooltip formatter={(value) => [`${value.toFixed(1)} Mlr $`, 'Borç Stoku']} />
                        <Line type="monotone" dataKey="value" name="Kısa Vadeli Dış Borç" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartSection>

            {/* TCMB AOFM */}
            <ChartSection dataKey="weightedAverageFundingCost" info={DEEP_ANALYSIS_INFO.weightedAverageFundingCost}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ADDITIONAL_DATA.weightedAverageFundingCost}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 10}} />
                        <YAxis unit="%" domain={['auto', 'auto']} />
                        <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, 'Fonlama Maliyeti']} />
                        <Line type="stepAfter" dataKey="value" name="AOFM (%)" stroke="#7e22ce" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartSection>
            
            {/* PMI Endeksi */}
            <ChartSection dataKey="pmiIndex" info={DEEP_ANALYSIS_INFO.pmiIndex}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ADDITIONAL_DATA.pmiIndex}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 10}} />
                        <YAxis domain={[45, 55]} />
                        <RechartsTooltip />
                        <ReferenceLine y={50} label="Eşik (50)" stroke="#16a34a" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="value" name="PMI Endeksi" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartSection>
        </div>
      </div>
    </div>
  );
};

// Derin Analiz Sekmesi (NPL Kaldırıldı)
const DeepAnalysisTab = () => {
    return (
      <div className="space-y-8">
        
        {/* 1. KATEGORİ: PARA POLİTİKASI & FİNANSAL İSTİKRAR */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Landmark className="mr-3 text-indigo-700" /> Finansal İstikrar Metrikleri
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* TCMB Rezervleri */}
            <ChartSection dataKey="reserves" info={DEEP_ANALYSIS_INFO.reserves}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.reserves}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} unit=" Mlr $" />
                  <RechartsTooltip formatter={(value) => [`${value.toFixed(1)} Mlr $`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="gross" name="Brüt Rezerv" stroke="#16a34a" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                  <Line type="monotone" dataKey="net" name="Net Rezerv" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
            
            {/* CDS ve Kredi Büyümesi */}
            <ChartSection dataKey="cds" info={DEEP_ANALYSIS_INFO.cds}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ADDITIONAL_DATA.cds}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis yAxisId="left" orientation="left" stroke="#ef4444" label={{ value: 'CDS (BP)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" label={{ value: 'Büyüme (%)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="value" name="CDS Primi (BP)" stroke="#ef4444" strokeWidth={2} />
                  <Bar yAxisId="right" data={ADDITIONAL_DATA.creditGrowth} dataKey="value" name="Kredi Büyümesi" fill="#f59e0b" barSize={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartSection>
  
            {/* Reel Efektif Döviz Kuru */}
            <ChartSection dataKey="realEffectiveExchangeRate" info={DEEP_ANALYSIS_INFO.realEffectiveExchangeRate}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.realEffectiveExchangeRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <ReferenceLine y={100} label="Denge (100)" stroke="#f59e0b" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="value" name="REDK Endeksi" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
  
            {/* Faiz Makası */}
            <ChartSection dataKey="interestRateSpread" info={DEEP_ANALYSIS_INFO.interestRateSpread}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ADDITIONAL_DATA.interestRateSpread}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis yAxisId="left" unit="%" label={{ value: 'Faiz (%)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" unit="%" stroke="#1e40af" label={{ value: 'Makas (%)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="credit" name="Kredi Faiz" stroke="#dc2626" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="deposit" name="Mevduat Faiz" stroke="#10b981" strokeWidth={2} />
                  <Bar yAxisId="right" dataKey="value" name="Makas Farkı" fill="#1e40af" barSize={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartSection>
          </div>
        </div>
  
        {/* 2. KATEGORİ: REEL SEKTÖR & GÜVEN ENDEKSLERİ */}
        <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Factory className="mr-3 text-orange-700" /> Reel Sektör & Güven Endeksleri
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sanayi Üretimi */}
            <ChartSection dataKey="industrialProduction" info={DEEP_ANALYSIS_INFO.industrialProduction}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.industrialProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="value" name="Endeks" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>

            {/* Reel Kesim Güven Endeksi (RKGE) */}
            <ChartSection dataKey="realSectorConfidenceIndex" info={DEEP_ANALYSIS_INFO.realSectorConfidenceIndex}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.realSectorConfidenceIndex}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <ReferenceLine y={100} label="Nötr" stroke="#a1a1aa" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="value" name="RKGE" stroke="#1d4ed8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>

            {/* KKR Alt Sektör Kırılımı */}
            <ChartSection dataKey="kkrSubSector" info={DEEP_ANALYSIS_INFO.kkrSubSector}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.kkrSubSector}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis unit="%" domain={['auto', 'auto']} />
                  <RechartsTooltip formatter={(value) => [`%${value.toFixed(1)}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="highTech" name="Yüksek Teknoloji KKR" stroke="#065f46" strokeWidth={2} />
                  <Line type="monotone" dataKey="lowTech" name="Düşük Teknoloji KKR" stroke="#65a30d" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>

            {/* Hizmet ÜFE (HÜFE) */}
            <ChartSection dataKey="serviceProducerPriceIndex" info={DEEP_ANALYSIS_INFO.serviceProducerPriceIndex}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.serviceProducerPriceIndex}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit="%" domain={['auto', 'auto']} />
                  <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, 'Yıllık Değişim']} />
                  <Line type="monotone" dataKey="value" name="HÜFE (%)" stroke="#f43f5e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
          </div>
        </div>
        
        {/* 3. KATEGORİ: HANEHALKI & SOSYAL GÖSTERGELER */}
        <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Home className="mr-3 text-cyan-700" /> Hanehalkı & Tüketim
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Konut Piyasası (Fiyat Endeksi & Satış Adedi) */}
            <ChartSection dataKey="housing" info={DEEP_ANALYSIS_INFO.housing}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ADDITIONAL_DATA.housing}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis yAxisId="left" label={{ value: 'Fiyat End.', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Satış (Bin)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="right" dataKey="sales" name="Satış Adedi (Bin)" fill="#cbd5e1" barSize={20} />
                  <Line yAxisId="left" type="monotone" dataKey="priceIndex" name="Fiyat Endeksi" stroke="#0f172a" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartSection>

            {/* Tüketici Güveni */}
            <ChartSection dataKey="consumerConfidence" info={DEEP_ANALYSIS_INFO.consumerConfidence}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.consumerConfidence}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="value" name="Güven Endeksi" stroke="#0891b2" strokeWidth={3} dot={{r:4}} />
                  <ReferenceLine y={100} label="Optimist (100)" stroke="green" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
          </div>
        </div>
        
        {/* 4. KATEGORİ: DIŞ TİCARET & KAMU MALİYESİ */}
        <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Globe className="mr-3 text-blue-700" /> Dış Ticaret & Kamu Maliyesi
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* İhracat/İthalat Karşılama Oranı (Altın Hariç) */}
            <ChartSection dataKey="exportToImportRatio" info={DEEP_ANALYSIS_INFO.exportToImportRatio}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADDITIONAL_DATA.exportToImportRatio}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit="%" domain={[60, 100]} />
                  <RechartsTooltip formatter={(value) => [`%${value.toFixed(1)}`, 'Karşılama Oranı']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Altın Hariç Karşılama (%)" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>

            {/* Turizm Gelirleri (Area + Bar) */}
            <ChartSection dataKey="tourism" info={DEEP_ANALYSIS_INFO.tourism}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ADDITIONAL_DATA.tourism}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis yAxisId="left" orientation="left" label={{ value: 'Gelir (Mlr $)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Turist (Milyon)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Gelir (Mlr $)" fill="#bfdbfe" stroke="#3b82f6" />
                  <Bar yAxisId="right" dataKey="visitors" name="Turist (Milyon)" fill="#1e40af" barSize={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartSection>
            
            {/* Bütçe Dengesi (Dinamik Renk Düzeltildi) */}
            <ChartSection dataKey="budgetBalance" info={DEEP_ANALYSIS_INFO.budgetBalance}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADDITIONAL_DATA.budgetBalance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis unit=" Mlr TL" />
                  <RechartsTooltip formatter={(value) => [`${value.toFixed(1)} Mlr TL`, 'Bütçe Dengesi']} />
                  <ReferenceLine y={0} stroke="#000" />
                  <Bar dataKey="value" name="Bütçe Dengesi">
                    {ADDITIONAL_DATA.budgetBalance.map((entry, index) => (
                      // Renk ataması: Pozitif Yeşil, Negatif Kırmızı
                      <cell key={`cell-${index}`} fill={entry.value > 0 ? "#16a34a" : "#dc2626"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartSection>
            
            {/* Ziyaretçi Başına Gelir */}
            <ChartSection dataKey="avgTourismRevenuePerVisitor" info={DEEP_ANALYSIS_INFO.avgTourismRevenuePerVisitor}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADDITIONAL_DATA.avgTourismRevenuePerVisitor}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis unit=" $" />
                  <RechartsTooltip formatter={(value) => [`${value.toFixed(0)} $`, 'Ort. Gelir']} />
                  <Bar dataKey="value" name="Ort. Turizm Geliri ($)" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartSection>
          </div>
        </div>
        
      </div>
    );
  };

// Beklenti ve Risk Sekmesi (Dolduruldu)
const ExpectationRiskTab = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                <ShieldAlert className="mr-3 text-red-700" /> Piyasa Beklentileri (PKA) ve Finansal Riskler
            </h2>
            
            {/* A. PİYASA BEKLENTİLERİ (PKA) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                   <BarChart3 className="mr-2 text-indigo-600" size={18} /> 1. Piyasa Katılımcıları Anketi (PKA) Verileri
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 12 Ay Sonrası TÜFE Beklentisi */}
                    <ChartSection dataKey="pkaInflation12m" info={DEEP_ANALYSIS_INFO.pkaInflation12m}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ADDITIONAL_DATA.pkaInflation12m}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit="%" domain={['auto', 'auto']} />
                                <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, '12 Ay Beklenti']} />
                                <Line type="monotone" dataKey="value" name="TÜFE Beklentisi (%)" stroke="#ef4444" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>

                    {/* Yıl Sonu USD/TRY Beklentisi */}
                    <ChartSection dataKey="pkaFxYearEnd" info={DEEP_ANALYSIS_INFO.pkaFxYearEnd}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ADDITIONAL_DATA.pkaFxYearEnd}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit=" TL" domain={['auto', 'auto']} />
                                <RechartsTooltip formatter={(value) => [`${value.toFixed(2)} TL`, 'Yıl Sonu Kur']} />
                                <Line type="monotone" dataKey="value" name="USD/TRY Beklentisi (TL)" stroke="#16a34a" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>

                    {/* 24 Ay Sonrası Politika Faizi Beklentisi */}
                    <ChartSection dataKey="pkaInterest24m" info={DEEP_ANALYSIS_INFO.pkaInterest24m}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ADDITIONAL_DATA.pkaInterest24m}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit="%" domain={['auto', 'auto']} />
                                <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, 'Faiz Beklentisi']} />
                                <Line type="stepAfter" dataKey="value" name="24 Ay Faiz Beklentisi (%)" stroke="#7e22ce" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>
                </div>
            </div>

            {/* B. FİNANSAL KIRILGANLIK */}
            <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                   <ShieldAlert className="mr-2 text-orange-700" size={18} /> 2. Temel Kırılganlık Göstergeleri
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Reel Sektör YP Açık Pozisyon */}
                    <ChartSection dataKey="fxOpenPosition" info={DEEP_ANALYSIS_INFO.fxOpenPosition}>
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={ADDITIONAL_DATA.fxOpenPosition}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit=" Mlr $" />
                                <RechartsTooltip formatter={(value) => [`${value.toFixed(0)} Mlr $`, 'Açık Pozisyon']} />
                                <ReferenceLine y={0} stroke="#000" />
                                <Bar dataKey="value" name="YP Açık Pozisyon (Mlr $)">
                                  {ADDITIONAL_DATA.fxOpenPosition.map((entry, index) => (
                                    <cell key={`cell-${index}`} fill={entry.value < 0 ? "#dc2626" : "#16a34a"} />
                                  ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartSection>

                    {/* Hanehalkı Borcunun GSYİH'ye Oranı */}
                    <ChartSection dataKey="householdDebtGdp" info={DEEP_ANALYSIS_INFO.householdDebtGdp}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ADDITIONAL_DATA.householdDebtGdp}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit="%" domain={['auto', 'auto']} />
                                <RechartsTooltip formatter={(value) => [`%${value.toFixed(1)}`, 'Oran']} />
                                <Line type="monotone" dataKey="value" name="Hanehalkı Borcu/GSYİH (%)" stroke="#0891b2" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>

                    {/* Sermaye Yeterlilik Rasyosu (SYR) */}
                    <ChartSection dataKey="syRatio" info={DEEP_ANALYSIS_INFO.syRatio}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ADDITIONAL_DATA.syRatio}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis unit="%" domain={[15, 20]} />
                                <RechartsTooltip formatter={(value) => [`%${value.toFixed(2)}`, 'SYR']} />
                                <ReferenceLine y={12} label="Yasal Sınır (Min %12)" stroke="#ef4444" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="value" name="SYR (%)" stroke="#10b981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>
                </div>
            </div>
        </div>
    );
};

// Mevcut haritalar ve sabitler
const DATA_MAP = {
    1: { data: MOCK_DATA.inflation, dataKey: 'value', name: 'Yıllık TÜFE', isRate: true, color: '#dc2626', type: 'line' },
    2: { data: MOCK_DATA.interest, dataKey: 'value', name: 'Politika Faizi', isRate: false, color: '#4b5563', type: 'step', unit: 'BP' }, 
    6: { data: NEW_MOCK_DATA.balanceOfPayments, dataKey: 'value', name: 'Cari İşlemler Dengesi', isRate: false, color: '#2563eb', type: 'bar', unit: 'Milyar $' }, 
    3: { data: NEW_MOCK_DATA.gdpGrowth, dataKey: 'value', name: 'GSYİH Reel Büyüme', isRate: true, color: '#16a34a', type: 'line' }, 
    4: { 
        data: [{ date: '2024-01', value: 79.5 }, { date: '2024-04', value: 78.8 }, { date: '2024-07', value: 78.0 }, { date: '2024-10', value: 77.5 }, { date: '2025-01', value: 77.0 }, { date: '2025-04', value: 76.8 }, { date: '2025-07', value: 76.2 }, { date: '2025-09', value: 76.0 }, { date: '2025-11', value: 75.9 }], 
        dataKey: 'value', 
        name: 'Kapasite Kullanım Oranı', 
        isRate: true, 
        color: '#f97316',
        type: 'line' 
    },
    5: { 
        data: [{ date: '2024-07', value: 8.8 }, { date: '2024-09', value: 9.0 }, { date: '2024-11', value: 9.1 }, { date: '2025-09', value: 9.4 }], 
        dataKey: 'value', 
        name: 'Mevsimsel İşsizlik Oranı', 
        isRate: true, 
        color: '#8b5cf6',
        type: 'line'
    }, 
};

const TABLE_DATA = [
  {
    id: 1,
    label: "Tüketici Fiyat Endeksi (Yıllık)",
    period: "Aralık 2025", 
    value: 31.80, 
    prev: 32.50,
    change: -0.70, 
    isRate: true,
    icon: TrendingUp,
    desc: "Hanehalkının tükettiği mal ve hizmetlerin fiyat artış oranıdır. Enflasyonun ana göstergesidir."
  },
  {
    id: 2,
    label: "1 Hafta Vadeli Repo Faizi",
    period: "Aralık 2025", 
    value: 39.00, 
    prev: 39.50,
    change: -50,
    unit: "BP",
    isRate: false,
    icon: Percent,
    desc: "TCMB'nin piyasayı fonladığı 'Politika Faizi'dir. Piyasa faizlerinin ana belirleyicisidir."
  },
  {
    id: 7, 
    label: DEEP_ANALYSIS_INFO.shortTermDebt.title,
    period: "Kasım 2025",
    value: 172.5,
    prev: 174.2,
    change: -1.7,
    unit: "Milyar $",
    icon: Briefcase,
    desc: DEEP_ANALYSIS_INFO.shortTermDebt.desc
  },
  {
    id: 8, 
    label: DEEP_ANALYSIS_INFO.weightedAverageFundingCost.title,
    period: "Kasım 2025",
    value: 39.0,
    prev: 39.5,
    change: -0.5,
    isRate: true,
    icon: Percent,
    desc: DEEP_ANALYSIS_INFO.weightedAverageFundingCost.desc
  },
  {
    id: 9, 
    label: DEEP_ANALYSIS_INFO.pmiIndex.title,
    period: "Kasım 2025",
    value: 52.1,
    prev: 51.5,
    change: 0.6,
    isRate: false,
    icon: BarChart3,
    desc: DEEP_ANALYSIS_INFO.pmiIndex.desc
  },
  {
    id: 6,
    label: "Cari İşlemler Dengesi (Milyar $)",
    period: "Eylül 2025",
    value: 0.8,
    prev: -0.2,
    change: 1.0,
    unit: "Milyar $",
    icon: Globe,
    desc: "Ülkenin dış dünyayla olan ekonomik işlemlerinin dengesidir. Pozitif değer (fazla), ülkeye giren dövizin çıkan dövizden fazla olduğunu gösterir."
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('03.12.2025 18:45:00'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('tr-TR'));
      setIsLoading(false);
    }, 1000);
  };

  const handleRowClick = (id) => {
    const data = TABLE_DATA.find(row => row.id === id);
    let chartConfig = DATA_MAP[id];
    
    // Yeni eklenen veriler için dinamik olarak chartConfig oluşturuluyor
    if (id === 7) { 
        chartConfig = { data: ADDITIONAL_DATA.shortTermDebt, dataKey: 'value', name: data.label, isRate: false, color: '#ef4444', type: 'line', unit: 'Mlr $' };
    } else if (id === 8) { 
        chartConfig = { data: ADDITIONAL_DATA.weightedAverageFundingCost, dataKey: 'value', name: data.label, isRate: true, color: '#7e22ce', type: 'step', unit: '%' };
    } else if (id === 9) { 
        chartConfig = { data: ADDITIONAL_DATA.pmiIndex, dataKey: 'value', name: data.label, isRate: false, color: '#f59e0b', type: 'line', unit: '' };
    }

    if (data && chartConfig) {
        setModalData({
            ...chartConfig,
            name: data.label,
            unit: data.unit,
            isRate: data.isRate,
        });
        setIsModalOpen(true);
    } else {
        alert(`Geçmiş dönem verisi bulunamadı: ${data.label}`);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-red-50 text-red-700 font-medium'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const latestExchangeData = MOCK_DATA.exchange[MOCK_DATA.exchange.length - 1];
  const latestInflation = MOCK_DATA.inflation[MOCK_DATA.inflation.length - 1];


  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* Grafik Modal (Tıklanabilir tablo satırları bu bileşeni açar) */}
      <GraphModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={modalData} />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-700 rounded-md flex items-center justify-center text-white font-bold">
              TC
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MB Veri</h1>
              <p className="text-xs text-gray-500">Akademik Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem id="dashboard" icon={Activity} label="Genel Görünüm" />
          <SidebarItem id="indicators" icon={Database} label="Ekonomik Göstergeler" />
          <SidebarItem id="deep_analysis" icon={BarChart2} label="Derin Analiz" />
          <SidebarItem id="expectation_risk" icon={ShieldAlert} label="Beklenti & Risk" />
          
          <div className="px-4 py-2 mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase">Sektörel Detaylar</p>
          </div>
          <SidebarItem id="inflation" icon={TrendingUp} label="Enflasyon (Detay)" />
          <SidebarItem id="banking" icon={Landmark} label="Bankacılık" />
          <SidebarItem id="exchange" icon={DollarSign} label="Döviz Kurları" />
          
          <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase">Sistem</p>
              </div>
              <SidebarItem id="about" icon={Info} label="Hakkında" />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs text-gray-500">EVDS Sunucusu Aktif</p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Top Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="font-bold text-red-700">TCMB Veri Paneli</div>
              <button onClick={() => setActiveTab('dashboard')} className="text-sm text-gray-600">Menü</button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Ekonomik Göstergeler Paneli'}
              {activeTab === 'indicators' && 'Genel Ekonomik Göstergeler'}
              {activeTab === 'deep_analysis' && 'Derinlemesine Piyasa Analizi'} 
              {activeTab === 'inflation' && 'Enflasyon Dinamikleri (TÜFE, ÜFE, İTO)'}
              {activeTab === 'banking' && 'Bankacılık Sektörü & Kredi Analizi'}
              {activeTab === 'exchange' && 'Döviz Kurları (Alış)'}
              {activeTab === 'expectation_risk' && 'Piyasa Beklentileri ve Finansal Riskler'}
              {activeTab === 'about' && 'Proje Hakkında'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Son Guncelleme: <span className="font-medium text-gray-700">{lastUpdated}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 transition-colors shadow-sm disabled:opacity-70"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>{isLoading ? 'Veriler Çekiliyor...' : 'Yenile'}</span>
              </button>
          </div>
        </div>

        {/* Content Switcher */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Güncel Verilerle Kartlar */}
              <Card
                title="TÜFE (Yıllık %)"
                value={`%${latestInflation.value.toFixed(2)}`}
                subValue="%0.70"
                trend="down"
                icon={TrendingUp}
              />
              <Card
                title="Kısa Vadeli Borç"
                value={`$${ADDITIONAL_DATA.shortTermDebt[ADDITIONAL_DATA.shortTermDebt.length-1].value} Mlr`}
                subValue={`$1.7 Mlr`}
                trend="down"
                icon={Briefcase}
              />
              <Card
                title="USD/TRY"
                value={latestExchangeData.usd}
                subValue={`EUR: ${latestExchangeData.eur}`}
                trend="up"
                icon={DollarSign}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inflation Chart Preview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜFE vs Yİ-ÜFE Trendi (Son 1 Yıl)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_DATA.inflation}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.substring(5)} />
                      <YAxis domain={[20, 60]} tick={{fontSize: 12}} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={false} name="TÜFE" />
                      <Line type="monotone" dataKey="value" data={MOCK_DATA.producerPrice} stroke="#1d4ed8" strokeWidth={2} dot={false} name="Yİ-ÜFE" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PPK Kararları (Taşındı) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Politika Faizi Kararları (PPK)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_DATA.interest}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 60]} />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="stepAfter" dataKey="value" name="Politika Faizi (%)" stroke="#4b5563" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Son Aciklanan Veriler (Aralik 2025 Raporu)</h3>
                  <div className="flex items-center text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                    <HelpCircle size={14} className="mr-1 text-blue-500" />
                    <span className="hidden sm:inline">Detay icin satirlara tiklayiniz</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Gosterge</th>
                          <th className="px-6 py-3">Donem</th>
                          <th className="px-6 py-3">Deger</th>
                          <th className="px-6 py-3">Onceki</th>
                          <th className="px-6 py-3">Degisim</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {TABLE_DATA.map((row) => (
                          <tr 
                            key={row.id} 
                            className="hover:bg-red-50 hover:cursor-pointer group relative"
                            onClick={() => handleRowClick(row.id)} 
                          >
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                              {row.icon && <row.icon size={16} className="text-gray-400 mr-2" />}
                              {row.label}
                              {/* Tooltip Icon */}
                              <div className="ml-2 text-gray-300 group-hover:text-blue-500 transition-colors cursor-help relative group/tooltip">
                                <Info size={16} />
                                <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 border border-gray-700 pointer-events-none">
                                  <div className="font-semibold mb-1 text-gray-300">Ne Anlama Gelir?</div>
                                  {row.desc}
                                  <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 transform rotate-45 border-t border-l border-gray-700"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{row.period}</td>
                            <td className="px-6 py-4 text-gray-900 font-bold">
                              {row.isRate ? '%' + row.value : row.value}
                              {row.id === 7 && ' Mlr'}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {row.isRate ? '%' + row.prev : row.prev}
                              {row.id === 7 && ' Mlr'}
                            </td>
                            <td className={`px-6 py-4 font-medium ${row.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {row.change > 0 ? '+' : ''}{row.change} {row.unit || ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* Yeni Eklenen Göstergeler Sekmesi */}
        {activeTab === 'indicators' && <IndicatorsTab />}

        {/* YENİ EKLENEN DERİN ANALİZ SEKME GÖRÜNÜMÜ */}
        {activeTab === 'deep_analysis' && <DeepAnalysisTab />}

        {/* Inflation Detail Tab - YENİLENDİ */}
        {activeTab === 'inflation' && <InflationTab />}
        
        {/* Banking Tab - YENİ */}
        {activeTab === 'banking' && <BankingTab />}

        {/* Exchange Detail Tab */}
          {activeTab === 'exchange' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Doviz Kurlari (Son 1 Ay)</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={MOCK_DATA.exchange} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tickFormatter={(val) => val.substring(5)} />
                  <YAxis domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usd" name="USD/TRY" stroke="#16a34a" strokeWidth={2} />
                  <Line type="monotone" dataKey="eur" name="EUR/TRY" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
        )}

          {/* Beklenti & Risk Tab - DOLDURULDU */}
          {activeTab === 'expectation_risk' && <ExpectationRiskTab />}

          {/* About Tab */}
          {activeTab === 'about' && (
           <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Proje Hakkinda</h3>
             <div className="prose text-gray-600">
               <p className="mb-4">
                 Bu web uygulamas, Iktisat Bolumu akademik Calismalari kapsaminda TCMB (Turkiye Cumhuriyet Merkez Bankasi) temel makroekonomik verilerini izlemek ve analiz etmek amaciyla tasarlanmistir.
               </p>
               <h4 className="font-bold text-gray-900 mb-2">Veri Kaynagi</h4>
               <p className="mb-4">
                 Veriler dogrudan TCMB EVDS (Elektronik Dagitim Sistemi) uzerinden alinmak uzere kurgulanmistir.
               </p>
               <h4 className="font-bold text-gray-900 mb-2">Kullanilan Teknolojiler</h4>
               <ul className="list-disc pl-5 space-y-1 mb-4">
                 <li>React.js & Tailwind CSS</li>
                 <li>Recharts Veri Gorsellestirme Kutuphanesi</li>
                 <li>EVDS API Entegrasyon Mimarisi</li>
               </ul>
             </div>
           </div>
          )}

      </main>
    </div>
  );
};

export default App;