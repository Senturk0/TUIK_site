import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, DollarSign, Percent, RefreshCw, Info, HelpCircle, Briefcase, Factory, Globe } from 'lucide-react';

// --- VERİLER ---
const MOCK_DATA = {
  inflation: [
    { date: '2024-12', value: 44.50 },
    { date: '2025-01', value: 41.20 },
    { date: '2025-02', value: 39.80 },
    { date: '2025-03', value: 38.50 },
    { date: '2025-04', value: 37.10 },
    { date: '2025-05', value: 35.80 },
    { date: '2025-06', value: 35.05 },
    { date: '2025-07', value: 33.52 },
    { date: '2025-08', value: 32.95 },
    { date: '2025-09', value: 33.29 },
    { date: '2025-10', value: 32.87 },
  ],
  interest: [
    { date: '2025-01', value: 45.0 },
    { date: '2025-03', value: 42.5 },
    { date: '2025-04', value: 46.0 },
    { date: '2025-06', value: 46.0 },
    { date: '2025-07', value: 43.0 },
    { date: '2025-09', value: 40.5 },
    { date: '2025-10', value: 39.5 },
    { date: '2025-11', value: 39.5 },
  ],
  exchange: [
    { date: '2025-11-01', usd: 41.95, eur: 44.80 },
    { date: '2025-11-10', usd: 42.15, eur: 45.10 },
    { date: '2025-11-15', usd: 42.30, eur: 45.25 },
    { date: '2025-11-20', usd: 42.42, eur: 45.40 },
    { date: '2025-11-24', usd: 42.48, eur: 45.55 },
    { date: '2025-11-26', usd: 42.45, eur: 45.52 },
  ]
};

const TABLE_DATA = [
  {
    id: 1,
    label: "Tüketici Fiyat Endeksi (Yıllık)",
    period: "Ekim 2025",
    value: 32.87,
    prev: 33.29,
    change: -0.42,
    isRate: true,
    icon: TrendingUp,
    desc: "Hanehalkının tükettiği mal ve hizmetlerin fiyat artış oranıdır. Enflasyonun ana göstergesidir."
  },
  {
    id: 2,
    label: "1 Hafta Vadeli Repo Faizi",
    period: "Ekim 2025",
    value: 39.50,
    prev: 40.50,
    change: -100,
    unit: "BP",
    isRate: false,
    icon: Percent,
    desc: "TCMB'nin piyasayı fonladığı 'Politika Faizi'dir. Piyasa faizlerinin ana belirleyicisidir."
  },
  {
    id: 3,
    label: "Sanayi Üretim Endeksi (Yıllık)",
    period: "Eylül 2025",
    value: 2.4,
    prev: 1.8,
    change: 0.6,
    isRate: true,
    icon: Factory,
    desc: "DİKKAT: Bu veri parasal değil, MİKTAR bazlıdır. Sanayi üretimindeki reel hacim artışını gösterir. Enflasyondan arındırılmıştır."
  },
  {
    id: 4,
    label: "İmalat Sanayi Kapasite Kullanım Oranı",
    period: "Kasım 2025",
    value: 75.9,
    prev: 76.2,
    change: -0.3,
    isRate: true,
    icon: Activity,
    desc: "Sanayi işyerlerinin fiziki kapasitelerinin ne kadarının kullanıldığını gösterir. Düşüş, ekonomik soğumaya işarettir."
  },
  {
    id: 5,
    label: "Mevsim Etkisinden Arındırılmış İşsizlik",
    period: "Eylül 2025",
    value: 9.4,
    prev: 9.1,
    change: 0.3,
    isRate: true,
    icon: Briefcase,
    desc: "İşgücüne katılıp iş bulamayanların oranıdır. Sıkı para politikasının bir yan etkisi olarak hafif artış göstermektedir."
  },
  {
    id: 6,
    label: "Cari İşlemler Dengesi (Milyar $)",
    period: "Eylül 2025",
    value: 0.8,
    prev: -0.2,
    change: 1.0,
    unit: "Milyar $",
    isRate: false,
    icon: Globe,
    desc: "Ülkenin dış dünyayla olan ekonomik işlemlerinin dengesidir. Pozitif değer (fazla), ülkeye giren dövizin çıkan dövizden fazla olduğunu gösterir."
  }
];

// --- BİLEŞENLER ---
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

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('27.11.2025 08:30:00');

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('tr-TR'));
      setIsLoading(false);
    }, 1000);
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

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
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
          <SidebarItem id="inflation" icon={TrendingUp} label="Enflasyon (TÜFE)" />
          <SidebarItem id="interest" icon={Percent} label="Faiz Oranları" />
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
              {activeTab === 'inflation' && 'Tüketici Fiyat Endeksi (TÜFE)'}
              {activeTab === 'interest' && 'Para Politikası Kurulu Kararları'}
              {activeTab === 'exchange' && 'Döviz Kurları (Alış)'}
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
                value="%32.87"
                subValue="%0.42"
                trend="down"
                icon={TrendingUp}
              />
              <Card
                title="Politika Faizi"
                value="%39.50"
                subValue="100 BP"
                trend="down"
                icon={Percent}
              />
              <Card
                title="USD/TRY"
                value="42.45"
                subValue="%0.10"
                trend="up"
                icon={DollarSign}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inflation Chart Preview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Enflasyon Trendi (Son 1 Yıl)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_DATA.inflation}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.substring(5)} />
                      <YAxis domain={[20, 50]} tick={{fontSize: 12}} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="TÜFE" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Interest Chart Preview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Politika Faizi Seyri</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_DATA.interest}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.substring(5)} />
                        <YAxis domain={[0, 60]} tick={{fontSize: 12}} />
                        <RechartsTooltip cursor={{fill: '#fef2f2'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#4b5563" radius={[4, 4, 0, 0]} name="Faiz Oranı" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Son Aciklanan Veriler (Kasim 2025 Raporu)</h3>
                  <div className="flex items-center text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                    <HelpCircle size={14} className="mr-1 text-blue-500" />
                    <span className="hidden sm:inline">Detay icin satirlarin uzerine geliniz</span>
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
                          <tr key={row.id} className="hover:bg-gray-50 group relative">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                              {row.icon && <row.icon size={16} className="text-gray-400 mr-2" />}
                              {row.label}
                              {/* Tooltip Icon */}
                              <div className="ml-2 text-gray-300 group-hover:text-blue-500 transition-colors cursor-help relative group/tooltip">
                                <Info size={16} />
                                {/* Tooltip Content */}
                                <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 border border-gray-700 pointer-events-none">
                                  <div className="font-semibold mb-1 text-gray-300">Ne Anlama Gelir?</div>
                                  {row.desc}
                                  {/* Triangle pointer */}
                                  <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 transform rotate-45 border-t border-l border-gray-700"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{row.period}</td>
                            <td className="px-6 py-4 text-gray-900 font-bold">
                              {row.isRate ? '%' + row.value : row.value}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {row.isRate ? '%' + row.prev : row.prev}
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

        {/* Inflation Detail Tab */}
        {activeTab === 'inflation' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="text-xl font-bold text-gray-800 mb-6">TUFE Ayrintili Grafik (2024-2025)</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={MOCK_DATA.inflation} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Enflasyon Oranı (%)" stroke="#dc2626" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
        )}

        {/* Interest Detail Tab */}
        {activeTab === 'interest' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Politika Faizi Kararlari</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={MOCK_DATA.interest} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 60]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="stepAfter" dataKey="value" name="Politika Faizi (%)" stroke="#1f2937" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
        )}

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

          {/* About Tab */}
          {activeTab === 'about' && (
           <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Proje Hakkinda</h3>
             <div className="prose text-gray-600">
               <p className="mb-4">
                 Bu web uygulamasi, Iktisat Bolumu akademik Calismalari kapsaminda TCMB (Turkiye Cumhuriyet Merkez Bankasi) temel makroekonomik verilerini izlemek ve analiz etmek amaciyla tasarlanmistir.
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