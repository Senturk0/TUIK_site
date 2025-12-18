import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  ReferenceLine, ComposedChart, Area, AreaChart
} from 'recharts';
import { 
  Activity, TrendingUp, DollarSign, Percent, RefreshCw, 
  Info, HelpCircle, Briefcase, Factory, Globe, Database, 
  X, BarChart2, Home, Landmark, ShieldAlert, Zap, Layers, 
  BarChart3, TrendingDown, CreditCard, Wallet, ShoppingCart, 
  Car, Hammer, Scale, Building2, Users
} from 'lucide-react';

// --- SABİT ANALİZ VE AÇIKLAMA METİNLERİ (Bunlar kodda kalmalı) ---
const DEEP_ANALYSIS_INFO = {
    reserves: { title: 'TCMB Brüt ve Net Rezervleri (Milyar $)', icon: Landmark, desc: 'Merkez Bankası rezerv verileri...' },
    cds: { title: 'CDS Primi', icon: ShieldAlert, desc: 'Risk primi göstergesi...' },
    creditGrowth: { title: 'Kredi Hacmi Yıllık Büyümesi (%)', icon: DollarSign, desc: 'Kredi büyüme hızı...' },
    industrialProduction: { title: 'Sanayi Üretim Endeksi', icon: Factory, desc: 'Sanayi üretimi değişimi...' },
    shortTermDebt: { title: 'Kısa Vadeli Dış Borç', icon: Briefcase, desc: 'Kısa vadeli borç stoku.' },
    weightedAverageFundingCost: { title: 'AOFM', icon: Percent, desc: 'Ortalama fonlama maliyeti.' },
    pmiIndex: { title: 'PMI Endeksi', icon: BarChart3, desc: 'Satınalma Yöneticileri Endeksi.' },
    housing: { title: 'Konut Piyasası', icon: Home, desc: 'Konut fiyat ve satış verileri.' },
    consumerConfidence: { title: 'Tüketici Güven Endeksi', icon: Activity, desc: 'Tüketici güven seviyesi.' },
    interestRateSpread: { title: 'Mevduat vs Kredi Faizi Makası', icon: Percent, desc: 'Bankacılık faiz makası.' },
    nplRatio: { title: 'Takipteki Alacaklar (NPL)', icon: ShieldAlert, desc: 'Batık kredi oranı.' },
    serviceProducerPriceIndex: { title: 'Hizmet ÜFE', icon: TrendingUp, desc: 'Hizmet sektörü enflasyonu.' },
    avgTourismRevenuePerVisitor: { title: 'Turist Başına Gelir', icon: Globe, desc: 'Turizm verimliliği.' },
    exportToImportRatio: { title: 'İhracatın İthalatı Karşılama Oranı', icon: Briefcase, desc: 'Dış ticaret dengesi.' },
    realSectorConfidenceIndex: { title: 'Reel Kesim Güven Endeksi', icon: Factory, desc: 'Reel sektör güveni.' },
    kkrSubSector: { title: 'KKR: Yüksek vs Düşük Tekno', icon: Zap, desc: 'Kapasite kullanım detayları.' },
    budgetBalance: { title: 'Bütçe Dengesi', icon: Landmark, desc: 'Merkezi yönetim bütçesi.' },
    tourism: { title: 'Turizm Gelirleri', icon: Globe, desc: 'Turizm gelir ve ziyaretçi sayısı.' },
    consumerVsNeedsCreditRatio: { title: 'Tüketici Kredileri Dağılımı', icon: DollarSign, desc: 'Kredi türlerine göre dağılım.' },
    tlVsFxDeposits: { title: 'Mevduat Kompozisyonu', icon: Landmark, desc: 'TL ve YP mevduat dağılımı.' },
    pkaInflation12m: { title: '12 Ay Sonrası Enflasyon Beklentisi', icon: TrendingDown, desc: 'Piyasa katılımcıları anketi.' },
    pkaFxYearEnd: { title: 'Yıl Sonu Dolar Beklentisi', icon: DollarSign, desc: 'Piyasa kur beklentisi.' },
    pkaInterest24m: { title: '24 Ay Sonrası Faiz Beklentisi', icon: Percent, desc: 'Uzun vadeli faiz beklentisi.' },
    fxOpenPosition: { title: 'Reel Sektör YP Açık Pozisyon', icon: ShieldAlert, desc: 'Döviz riski.' },
    householdDebtGdp: { title: 'Hanehalkı Borcu / GSYH', icon: Home, desc: 'Hanehalkı borçluluk oranı.' },
    syRatio: { title: 'Sermaye Yeterlilik Rasyosu', icon: Landmark, desc: 'Bankacılık sermaye gücü.' },
    weeklyCreditCardSpending: { title: 'Haftalık Kart Harcamaları', icon: CreditCard, desc: 'Haftalık harcama verisi.' },
    commercialLoanInterest: { title: 'Ticari Kredi Faizleri', icon: Percent, desc: 'Ticari kredi maliyetleri.' },
    moneySupply: { title: 'Para Arzı (M1, M2, M3)', icon: Wallet, desc: 'Ekonomideki toplam para.' },
    retailSalesIndex: { title: 'Perakende Satış Hacmi', icon: ShoppingCart, desc: 'Perakende ciro endeksi.' },
    kkmStock: { title: 'KKM Stoku', icon: Layers, desc: 'Kur Korumalı Mevduat toplamı.' },
    automotiveSales: { title: 'Otomotiv Satışları', icon: Car, desc: 'Otomobil ve hafif ticari satışları.' },
    whiteGoodsSales: { title: 'Beyaz Eşya Satışları', icon: ShoppingCart, desc: 'Beyaz eşya satış adetleri.' },
    constructionCostIndex: { title: 'İnşaat Maliyet Endeksi', icon: Hammer, desc: 'İnşaat maliyet artışı.' },
    termsOfTrade: { title: 'Dış Ticaret Hadleri', icon: Scale, desc: 'İhraç/İthal fiyat oranı.' },
    companyStatistics: { title: 'Kurulan/Kapanan Şirket', icon: Building2, desc: 'Şirket istatistikleri.' },
    centralGovDebtStock: { title: 'Merkezi Yönetim Borç Stoku', icon: Landmark, desc: 'Kamu borç stoku.' },
    laborForceParticipation: { title: 'İşgücüne Katılım Oranı', icon: Users, desc: 'İşgücü verileri.' },
    tr_10y_bond: { title: '10 Yıllık Tahvil Faizi', icon: Percent, desc: 'Uzun vadeli borçlanma faizi.' },
    tr_2y_bond: { title: '2 Yıllık Tahvil Faizi', icon: Percent, desc: 'Kısa vadeli borçlanma faizi.' },
};

const FRED_ANALYSIS_INFO = {
    GDPC1: { title: 'ABD Reel GSYİH', icon: Factory, unit: '%' },
    GDI: { title: 'ABD GDI', icon: Landmark, unit: '%' },
    IPHA: { title: 'ABD Sanayi Üretimi', icon: Factory, unit: 'Endeks' },
    UMCSENT: { title: 'Michigan Tüketici Güven', icon: Home, unit: 'Endeks' },
    PERMIT: { title: 'Konut İzinleri', icon: Building2, unit: 'Bin' },
    PCEPI: { title: 'PCE Enflasyon', icon: TrendingUp, unit: '%' },
    PCEPILFE: { title: 'Çekirdek PCE', icon: TrendingUp, unit: '%' },
    CPIAUCSL: { title: 'ABD TÜFE', icon: TrendingUp, unit: '%' },
    PPIFIS: { title: 'ABD ÜFE', icon: TrendingUp, unit: '%' },
    UNRATE: { title: 'ABD İşsizlik', icon: Users, unit: '%' },
    NFP: { title: 'Tarım Dışı İstihdam', icon: Briefcase, unit: 'Bin' },
    JTSJOL: { title: 'JOLTS Açık İş', icon: Briefcase, unit: 'Milyon' },
    AHE: { title: 'Saatlik Kazançlar', icon: DollarSign, unit: '%' },
    DFF: { title: 'Fed Faiz Oranı', icon: Percent, unit: '%' },
    T10Y2Y: { title: '10Y-2Y Makası', icon: ShieldAlert, unit: 'BP' },
    TEDRATE: { title: 'TED Spread', icon: ShieldAlert, unit: 'BP' },
    BAMLH0A0CM: { title: 'High Yield Spread', icon: ShieldAlert, unit: 'BP' },
    MORTGAGE30US: { title: '30Y Mortgage', icon: Home, unit: '%' },
    WM2NS: { title: 'ABD M2 Para Arzı', icon: Wallet, unit: 'Trilyon $' },
    DGS10: { title: 'ABD 10Y Tahvil', icon: Percent, unit: '%' },
    DGS2: { title: 'ABD 2Y Tahvil', icon: Percent, unit: '%' },
    ECBDFR: { title: 'ECB Faiz Oranı', icon: Percent, unit: '%' },
    GLOBAL_POLICY_UNCERT_INDEX: { title: 'Küresel Belirsizlik', icon: ShieldAlert, unit: 'Endeks' },
    HOUST: { title: 'Konut Başlangıçları', icon: Home, unit: 'Bin' },
    NAPM: { title: 'ISM İmalat PMI', icon: Factory, unit: 'Endeks' },
    RRPFNL: { title: 'Repo İşlemleri', icon: ShoppingCart, unit: 'Milyar $' },
    NFCI: { title: 'Finansal Koşullar', icon: ShieldAlert, unit: 'Endeks' },
    GFDEBTN: { title: 'ABD Kamu Borcu', icon: Landmark, unit: 'Milyar $' },
    USGOODS: { title: 'Mal Ticaret Dengesi', icon: Globe, unit: 'Milyar $' },
};

const MARKET_ANALYSIS_INFO = {
    BIST100: { title: 'BIST 100', icon: Activity, unit: 'Puan' },
    SP500: { title: 'S&P 500', icon: Globe, unit: 'Puan' },
    GOLD: { title: 'Altın (Ons)', icon: DollarSign, unit: '$' },
    VIX: { title: 'VIX Endeksi', icon: ShieldAlert, unit: 'Puan' },
};

// --- YARDIMCI BİLEŞENLER ---
const ChartSection = ({ dataKey, info, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
    <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
      <h3 className="text-md font-semibold text-gray-800 flex items-center">
        {info?.icon && <info.icon size={18} className="mr-2 text-indigo-600" />}
        {info?.title || dataKey}
        <div className="ml-2 text-gray-400 hover:text-blue-500 transition-colors cursor-help relative group/tooltip">
          <Info size={16} />
          <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 border border-gray-700 pointer-events-none">
            <div className="font-semibold mb-1 text-gray-300">Ne Anlama Gelir?</div>
            {info?.desc || 'Açıklama yükleniyor...'}
            <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 transform rotate-45 border-t border-l border-gray-700"></div>
          </div>
        </div>
      </h3>
    </div>
    <div className="h-[250px]">{children}</div>
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
      <span className="text-gray-400 ml-2">Son veriye göre</span>
    </div>
  </div>
);

const GraphModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  const ChartComponent = data.type === 'bar' ? BarChart : LineChart;
  const DataComponent = data.type === 'bar' ? Bar : Line;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-4xl h-5/6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900">{data.name} Detaylı Trend</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <div className="h-[90%] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data.data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <RechartsTooltip />
              <Legend />
              <DataComponent type="monotone" dataKey={data.dataKey} name={data.name} stroke={data.color} fill={data.color} />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- TAB BİLEŞENLERİ (VERİLERİ PROP OLARAK ALIR) ---

const InflationTab = ({ data }) => (
    <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <TrendingUp className="mr-3 text-red-700" /> Enflasyon Dinamikleri
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜFE vs. Yİ-ÜFE Yıllık Değişim (%)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.inflation}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="TÜFE" stroke="#dc2626" />
                            <Line type="monotone" data={data.producerPrice} dataKey="value" name="Yİ-ÜFE" stroke="#1d4ed8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜİK vs İTO Enflasyon</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.inflation}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="TÜİK TÜFE" stroke="#065f46" />
                            <Line type="monotone" data={data.itoInflation} dataKey="value" name="İTO TÜFE" stroke="#f59e0b" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="h-[300px]">
                <ChartSection dataKey="constructionCostIndex" info={DEEP_ANALYSIS_INFO.constructionCostIndex}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.constructionCostIndex}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="value" stroke="#b91c1c" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartSection>
            </div>
        </div>
    </div>
);

const BankingTab = ({ data }) => (
    <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Landmark className="mr-3 text-indigo-700" /> Kredi & Mevduat Analizi
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <ChartSection dataKey="creditGrowth" info={DEEP_ANALYSIS_INFO.creditGrowth}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.creditGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="commercialLoanInterest" info={DEEP_ANALYSIS_INFO.commercialLoanInterest}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.commercialLoanInterest}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="nplRatio" info={DEEP_ANALYSIS_INFO.nplRatio}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.nplRatio}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fecaca" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="tlVsFxDeposits" info={DEEP_ANALYSIS_INFO.tlVsFxDeposits}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.tlVsFxDeposits}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="TL" stackId="1" stroke="#16a34a" fill="#bbf7d0" />
                        <Area type="monotone" dataKey="KKM" stackId="1" stroke="#f59e0b" fill="#fcd34d" />
                        <Area type="monotone" dataKey="DTA" stackId="1" stroke="#2563eb" fill="#93c5fd" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartSection>
        </div>
        <div className="pt-6 mt-6 border-t border-gray-200">
             <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Tüketici Kredileri Dağılımı</h3>
             <div className="h-[300px]">
                <ChartSection dataKey="consumerVsNeedsCreditRatio" info={DEEP_ANALYSIS_INFO.consumerVsNeedsCreditRatio}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.consumerVsNeedsCreditRatio}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Area type="monotone" dataKey="konut" stackId="1" stroke="#3b82f6" fill="#bfdbfe" />
                            <Area type="monotone" dataKey="tasit" stackId="1" stroke="#fb923c" fill="#fed7aa" />
                            <Area type="monotone" dataKey="ihtyac" stackId="1" stroke="#dc2626" fill="#fecaca" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartSection>
             </div>
        </div>
    </div>
);

const IndicatorsTab = ({ data }) => (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp size={20} className="text-red-700 mr-2" /> GSYİH Reel Büyüme
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data.gdpGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign size={20} className="text-blue-700 mr-2" /> Cari Denge
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.balanceOfPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[450px]">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Briefcase size={20} className="text-yellow-700 mr-2" /> Dış Ticaret
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.foreignTrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="export" stroke="#f59e0b" />
              <Line type="monotone" dataKey="import" stroke="#1f2937" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartSection dataKey="shortTermDebt" info={DEEP_ANALYSIS_INFO.shortTermDebt}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.shortTermDebt}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#ef4444" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="retailSalesIndex" info={DEEP_ANALYSIS_INFO.retailSalesIndex}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.retailSalesIndex}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#16a34a" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="automotiveSales" info={DEEP_ANALYSIS_INFO.automotiveSales}>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={data.automotiveSales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Bar dataKey="value" fill="#f97316" /></BarChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="pmiIndex" info={DEEP_ANALYSIS_INFO.pmiIndex}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.pmiIndex}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[40,60]}/><RechartsTooltip /><ReferenceLine y={50} stroke="green"/><Line type="monotone" dataKey="value" stroke="#f59e0b" /></LineChart></ResponsiveContainer>
            </ChartSection>
        </div>
    </div>
);

const DeepAnalysisTab = ({ data }) => (
    <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Landmark className="mr-3 text-indigo-700" /> Finansal İstikrar Metrikleri
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection dataKey="moneySupply" info={DEEP_ANALYSIS_INFO.moneySupply}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.moneySupply}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="m3" stroke="#1e3a8a" /><Line type="monotone" dataKey="m2" stroke="#3b82f6" /><Line type="monotone" dataKey="m1" stroke="#93c5fd" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="kkmStock" info={DEEP_ANALYSIS_INFO.kkmStock}>
                 <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.kkmStock}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Area type="monotone" dataKey="value" stroke="#7c3aed" fill="#ddd6fe" /></AreaChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="centralGovDebtStock" info={DEEP_ANALYSIS_INFO.centralGovDebtStock}>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={data.centralGovDebtStock}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Bar dataKey="domestic" stackId="a" fill="#0f766e" /><Bar dataKey="external" stackId="a" fill="#06b6d4" /></BarChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="reserves" info={DEEP_ANALYSIS_INFO.reserves}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.reserves}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="gross" stroke="#16a34a" /><Line type="monotone" dataKey="net" stroke="#22c55e" strokeDasharray="5 5" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="realEffectiveExchangeRate" info={DEEP_ANALYSIS_INFO.realEffectiveExchangeRate}>
                 <ResponsiveContainer width="100%" height="100%"><LineChart data={data.realEffectiveExchangeRate}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" /></LineChart></ResponsiveContainer>
            </ChartSection>
             <ChartSection dataKey="tr_10y_bond" info={DEEP_ANALYSIS_INFO.tr_10y_bond}>
                 <ResponsiveContainer width="100%" height="100%"><LineChart data={data.tr_10y_bond}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#ef4444" /></LineChart></ResponsiveContainer>
            </ChartSection>
        </div>
    </div>
);

const ExpectationRiskTab = ({ data }) => (
    <div className="space-y-8">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <ShieldAlert className="mr-3 text-red-700" /> Piyasa Beklentileri & Riskler
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <ChartSection dataKey="pkaInflation12m" info={DEEP_ANALYSIS_INFO.pkaInflation12m}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.pkaInflation12m}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#ef4444" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="pkaFxYearEnd" info={DEEP_ANALYSIS_INFO.pkaFxYearEnd}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.pkaFxYearEnd}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#16a34a" /></LineChart></ResponsiveContainer>
            </ChartSection>
            <ChartSection dataKey="cds" info={DEEP_ANALYSIS_INFO.cds}>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.cds}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#ef4444" /></LineChart></ResponsiveContainer>
            </ChartSection>
             <ChartSection dataKey="fxOpenPosition" info={DEEP_ANALYSIS_INFO.fxOpenPosition}>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={data.fxOpenPosition}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Bar dataKey="value" fill="#dc2626" /></BarChart></ResponsiveContainer>
            </ChartSection>
        </div>
    </div>
);

const USDataTab = ({ data }) => (
    <div className="space-y-10">
         <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Globe className="mr-3 text-red-700" /> ABD / Küresel Veriler (FRED)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(FRED_ANALYSIS_INFO).map(key => {
                const info = FRED_ANALYSIS_INFO[key];
                const chartData = data[key] || [];
                return (
                    <ChartSection key={key} dataKey={key} info={info}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="value" stroke="#2563eb" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>
                );
            })}
        </div>
    </div>
);

const MarketTab = ({ data }) => (
    <div className="space-y-10">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
            <Activity className="mr-3 text-red-700" /> Piyasa Endeksleri
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(MARKET_ANALYSIS_INFO).map(key => {
                const info = MARKET_ANALYSIS_INFO[key];
                const chartData = data[key] || [];
                return (
                     <ChartSection key={key} dataKey={key} info={info}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="value" stroke={key === 'VIX' ? '#dc2626' : '#16a34a'} dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartSection>
                );
            })}
        </div>
    </div>
);

// --- ANA UYGULAMA ---

const INITIAL_STATE = {
    inflation: [], interest: [], exchange: [], producerPrice: [], itoInflation: [],
    gdpGrowth: [], balanceOfPayments: [], foreignTrade: [], reserves: [], cds: [],
    creditGrowth: [], industrialProduction: [], shortTermDebt: [], weightedAverageFundingCost: [],
    pmiIndex: [], housing: [], consumerConfidence: [], budgetBalance: [], tourism: [],
    realEffectiveExchangeRate: [], interestRateSpread: [], nplRatio: [], serviceProducerPriceIndex: [],
    BIST100: [], SP500: [], GOLD: [], VIX: [],
    // FRED keys...
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('-'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState(INITIAL_STATE);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      if (result.success && result.data) {
        processData(result.data);
        setLastUpdated(new Date().toLocaleString('tr-TR'));
      }
    } catch (error) {
      console.error("Veri hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (dbRows) => {
    const newChartData = { ...INITIAL_STATE };
    dbRows.forEach(row => {
      if (!newChartData[row.source]) newChartData[row.source] = [];
      newChartData[row.source].push({
        date: row.date,
        value: Number(row.value),
        name: row.meta || 'Değer'
      });
    });
    // Sıralama
    Object.keys(newChartData).forEach(key => {
       if(Array.isArray(newChartData[key])) {
         newChartData[key].sort((a, b) => new Date(a.date) - new Date(b.date));
       }
    });
    setChartData(newChartData);
  };

  useEffect(() => { fetchData(); }, []);

  const getLatestValue = (key) => {
    const series = chartData[key];
    return (series && series.length > 0) ? series[series.length - 1] : { value: 0, date: '-' };
  };

  const TABLE_DATA = [
    { id: 1, label: "Tüketici Fiyat Endeksi", value: getLatestValue('inflation').value, date: getLatestValue('inflation').date, icon: TrendingUp, isRate: true },
    { id: 2, label: "Politika Faizi", value: getLatestValue('interest').value, date: getLatestValue('interest').date, icon: Percent, isRate: true },
    { id: 3, label: "Dolar Kuru", value: getLatestValue('exchange').value, date: getLatestValue('exchange').date, icon: DollarSign, isRate: false },
    { id: 4, label: "BIST 100", value: getLatestValue('BIST100').value, date: getLatestValue('BIST100').date, icon: Activity, isRate: false },
    { id: 5, label: "CDS Primi", value: getLatestValue('cds').value, date: getLatestValue('cds').date, icon: ShieldAlert, isRate: false },
  ];

  const filteredTableData = TABLE_DATA.filter(row => row.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
      <Icon size={20} /><span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <GraphModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={modalData} />
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-700 rounded-md flex items-center justify-center text-white font-bold">TC</div>
            <div><h1 className="text-lg font-bold text-gray-900">MB Veri</h1><p className="text-xs text-gray-500">Akademik Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem id="dashboard" icon={Activity} label="Genel Görünüm" />
          <SidebarItem id="indicators" icon={Database} label="Göstergeler" />
          <SidebarItem id="inflation" icon={TrendingUp} label="Enflasyon" />
          <SidebarItem id="banking" icon={Landmark} label="Bankacılık" />
          <SidebarItem id="deep_analysis" icon={BarChart2} label="Derin Analiz" />
          <SidebarItem id="expectation_risk" icon={ShieldAlert} label="Beklenti & Risk" />
          <SidebarItem id="market" icon={Activity} label="Piyasalar" />
          <SidebarItem id="usa_data" icon={Globe} label="ABD / FRED" />
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div><h2 className="text-2xl font-bold text-gray-900">Ekonomik Göstergeler</h2><p className="text-gray-500 text-sm mt-1">Son Güncelleme: <span className="font-medium text-gray-700">{lastUpdated}</span></p></div>
          <button onClick={fetchData} disabled={isLoading} className="flex items-center space-x-2 bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-70"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /><span>{isLoading ? 'Yükleniyor...' : 'Yenile'}</span></button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card title="TÜFE (Yıllık)" value={`%${getLatestValue('inflation').value}`} subValue={getLatestValue('inflation').date} trend="down" icon={TrendingUp} />
               <Card title="Politika Faizi" value={`%${getLatestValue('interest').value}`} subValue={getLatestValue('interest').date} trend="up" icon={Percent} />
               <Card title="BIST 100" value={getLatestValue('BIST100').value} subValue={getLatestValue('BIST100').date} trend="up" icon={Activity} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">TÜFE Enflasyonu</h3>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData.inflation}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><RechartsTooltip /><Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} /></LineChart></ResponsiveContainer>
            </div>
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <input type="text" placeholder="Tabloda Ara..." className="w-full border p-2 rounded mb-4" onChange={(e) => setSearchTerm(e.target.value)} />
                {filteredTableData.map(row => (
                    <div key={row.id} className="flex justify-between border-b py-2 hover:bg-gray-50">
                        <div className="flex items-center"><row.icon size={16} className="mr-2 text-gray-500"/>{row.label}</div>
                        <div className="text-right"><div className="font-bold">{row.isRate ? `%${row.value}` : row.value}</div><div className="text-xs text-gray-400">{row.date}</div></div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'indicators' && <IndicatorsTab data={chartData} />}
        {activeTab === 'inflation' && <InflationTab data={chartData} />}
        {activeTab === 'banking' && <BankingTab data={chartData} />}
        {activeTab === 'deep_analysis' && <DeepAnalysisTab data={chartData} />}
        {activeTab === 'expectation_risk' && <ExpectationRiskTab data={chartData} />}
        {activeTab === 'usa_data' && <USDataTab data={chartData} />}
        {activeTab === 'market' && <MarketTab data={chartData} />}

      </main>
    </div>
  );
};

export default App;