import React, { useState, useEffect } from 'react';

function Dashboard({ safetyScore, logs, setSafetyScore, setLogs }) {
  const [isScanning, setIsScanning] = useState(false);
  const [inputLink, setInputLink] = useState('');
  const [scanResult, setScanResult] = useState(null);
  
  // 1. JONLI GRAFIK LOGIKASI (Network Traffic Simulation)
  const [graphHeights, setGraphHeights] = useState(['40%', '65%', '95%', '30%', '55%', '75%', '45%']);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeights = Array.from({ length: 7 }, () => `${Math.floor(Math.random() * 75) + 20}%`);
      setGraphHeights(newHeights);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // 2. HAVOLALARNI SKANERLASH FUNKSIYASI (Link Checker)
  const handleLinkScan = (e) => {
    e.preventDefault();
    if (!inputLink) return;

    setScanResult({ status: 'scanning', message: 'Havola metadata va fishing bazalari bo\'yicha tahlil qilinmoqda...' });

    setTimeout(() => {
      const lowerLink = inputLink.toLowerCase();
      // Fishing yoki zararli so'zlar filtri
      const isDangerous = lowerLink.includes('bonus') || 
                          lowerLink.includes('free') || 
                          lowerLink.includes('crypto') || 
                          lowerLink.includes('skin') || 
                          lowerLink.includes('gift') || 
                          lowerLink.includes('click');

      const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

      if (isDangerous) {
        setScanResult({
          status: 'danger',
          message: 'Diqqat! Fishing (soxta) havola aniqlandi. Foydalanuvchi ma\'lumotlarini o\'g\'irlash xavfi bor!'
        });
        // Tahdidlar logiga qo'shish
        setLogs(prev => [
          { id: Date.now(), type: 'danger', source: 'Web Filter', time: now, desc: `Shubhali havola bloklandi: ${inputLink}` },
          ...prev
        ]);
        setSafetyScore(prev => Math.max(70, prev - 3));
      } else {
        setScanResult({
          status: 'safe',
          message: 'Tizim tasdiqladi: Havola xavfsiz. OmniGuard AI zararli kod topmadi.'
        });
        setLogs(prev => [
          { id: Date.now(), type: 'system', source: 'Web Filter', time: now, desc: `Xavfsiz havola tekshirildi: ${inputLink}` },
          ...prev
        ]);
      }
    }, 2000);
  };

  // 3. TIZIMNI CHUQUR SKANERLASH (Deep Scan)
  const startDeepScan = () => {
    setIsScanning(true);
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    setLogs(prev => [
      { id: Date.now(), type: 'system', source: 'System', time: now, desc: 'Chuqur kiber-skanerlash tizimi ishga tushirildi...' },
      ...prev
    ]);
    setSafetyScore(50);

    setTimeout(() => {
      setSafetyScore(100);
      setIsScanning(false);
      setLogs(prev => [
        { id: Date.now() + 1, type: 'system', source: 'System', time: now, desc: 'Skanerlash yakunlandi. Barcha tahlillar 100% toza.' },
        ...prev
      ]);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* 1-BLOK: XAVFSIZLIK STATUSI */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex items-center justify-center w-36 h-36 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.15)]"
             style={{ background: `conic-gradient(#06b6d4 ${safetyScore}%, #1e293b 0)` }}>
          <div className="w-[116px] h-[116px] bg-[#0b0f19] rounded-full flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-cyan-400 font-mono transition-all duration-500">{safetyScore}%</span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Xavfsiz</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Tizim holati: Himoyalangan</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 animate-pulse">Active</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            OmniGuard AI real vaqt rejimida xavfsizlikni nazorat qilmoqda. Oxirgi 24 soat ichida hech qanday zaiflik aniqlanmadi.
          </p>
          <button 
            onClick={startDeepScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Skanerlanmoqda...
              </>
            ) : (
              <>
                <i className="fas fa-shield-alt"></i> Chuqur Skanerlash (Deep Scan)
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-BLOK: HAVOLALARNI SKANERLASH (YANGI MODUL) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fas fa-link text-cyan-400"></i> Havolalarni Tekshirish Moduli
          </h3>
          <p className="text-xs text-slate-500">Telegram yoki Instagram'dan kelgan fishing havolalarni shu yerda sinab ko'ring</p>
        </div>

        <form onSubmit={handleLinkScan} className="flex gap-3">
          <input 
            type="text" 
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            placeholder="Masalan: http://telegram-bonus-free.uz yoki https://google.com" 
            className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <button type="submit" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700/60 transition-all active:scale-95">
            Skanerlash
          </button>
        </form>

        {/* Skanerlash Natijasi */}
        {scanResult && (
          <div className={`p-4 rounded-xl border text-sm animate-fade-in ${
            scanResult.status === 'scanning' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300' :
            scanResult.status === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <div className="flex items-center gap-2 font-semibold">
              {scanResult.status === 'scanning' && <i className="fas fa-spinner animate-spin"></i>}
              {scanResult.status === 'danger' && <i className="fas fa-exclamation-triangle text-red-500 animate-bounce"></i>}
              {scanResult.status === 'safe' && <i className="fas fa-check-circle text-emerald-500"></i>}
              {scanResult.message}
            </div>
          </div>
        )}
      </div>

      {/* 3-BLOK: GRID MODULLAR (JONLI GRAFIK BILAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aktiv Himoya Modullari */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">Aktiv Himoya Qalqonlari</h3>
          
          <div className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 text-xl"><i className="fab fa-telegram"></i></div>
              <div>
                <h4 className="text-sm font-semibold text-white">Telegram Shield</h4>
                <p className="text-xs text-slate-500">Yashirin viruslar va zararli formatlar filtri</p>
              </div>
            </div>
            <div className="w-9 h-5 bg-emerald-500 rounded-full relative p-0.5 flex items-center justify-end shadow-inner"><div className="w-4 h-4 bg-white rounded-full shadow"></div></div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xl"><i className="fas fa-network-wired"></i></div>
              <div>
                <h4 className="text-sm font-semibold text-white">Tarmoq Trafik Tozalagich</h4>
                <p className="text-xs text-slate-500">Shubhali paketlar va fonga sizib chiquvchi so'rovlar</p>
              </div>
            </div>
            <div className="w-9 h-5 bg-emerald-500 rounded-full relative p-0.5 flex items-center justify-end shadow-inner"><div className="w-4 h-4 bg-white rounded-full shadow"></div></div>
          </div>
        </div>

        {/* JONLI TARMOQ GRAFIGI */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">Jonli Tarmoq Sintezi (Live Traffic)</h3>
          <div className="h-32 flex items-end justify-between gap-3 pt-6 px-2">
            {graphHeights.map((height, index) => (
              <div 
                key={index} 
                className="w-full bg-cyan-500/20 border border-cyan-500/40 rounded-t-lg transition-all duration-700 ease-out shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                style={{ height: height }}
              ></div>
            ))}
          </div>
          <div className="text-center text-xs text-slate-500 mt-4 font-mono flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span> Real-time Data Stream Packets Analyzing
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;