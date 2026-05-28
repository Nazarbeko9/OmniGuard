import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import Threats from './components/Threats';

function App() {
  // Tizim holatlari: 'register' (Ro'yxatdan o'tish) yoki 'app' (Asosiy dastur)
  const [appStage, setAppStage] = useState('register'); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('child'); 

  // Ro'yxatdan o'tish form ma'lumotlari
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '' });
  const [regStep, setRegStep] = useState(1); // 1: Ma'lumotlar, 2: Face ID ro'yxatga olish
  const [regFaceStatus, setRegFaceStatus] = useState('idle'); // 'idle', 'scanning', 'success'

  // Ota-ona bo'limi Face ID Sozlamalari
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceScanStatus, setFaceScanStatus] = useState('idle'); 
  
  const videoRef = useRef(null);
  const regVideoRef = useRef(null);

  const [safetyScore, setSafetyScore] = useState(92);
  const [logs, setLogs] = useState([
    { id: 1, type: 'system', source: 'Core', time: '12:00', desc: 'OmniGuard AI Multi-Device monitoring ishga tushdi.' }
  ]);

  const [childData, setChildData] = useState({
    location: "Toshkent, Chilonzor 9-kvartal (Maktab yonida)",
    battery: "68%",
    currentApp: "YouTube (O'quv darsliklari)",
    lastVideo: "Python dasturlash asoslari - 12-dars",
    chats: [
      { id: 1, app: 'Telegram', contact: 'Do\'stim Asilbek', lastMsg: 'Ertaga soat 14:00 da kutubxonada ko\'rishamiz.', status: 'safe' },
      { id: 2, app: 'Instagram', contact: 'Noma\'lum Profil', lastMsg: 'Senga tekin CS2 skinlari kerakmi? Mana bu ssilkaga bos...', status: 'danger' }
    ]
  });

  // Kamera yoqish funksiyasi (Mobil va Desktop uchun)
  const startCamera = async (targetRef) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } // Smartfonning old kamerasini yoqadi
      });
      if (targetRef.current) {
        targetRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Kameraga ruxsat berilmadi:", err);
    }
  };

  // Kamerani o'chirish
  const stopCamera = (targetRef) => {
    if (targetRef.current && targetRef.current.srcObject) {
      const tracks = targetRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  // 1. RO'YXATDAN O'TISHDAGI FACE ID SKANERASH
  const handleRegFaceScan = () => {
    setRegFaceStatus('scanning');
    setTimeout(() => {
      setRegFaceStatus('success');
      setTimeout(() => {
        stopCamera(regVideoRef);
        setAppStage('app'); // Ro'yxatdan o'tdi, endi dastur ochiladi!
      }, 1500);
    }, 3000);
  };

  // Formani topshirish (Step 1 -> Step 2)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (regForm.firstName && regForm.lastName && regForm.email) {
      setRegStep(2);
      setTimeout(() => startCamera(regVideoRef), 300);
    }
  };

  // Ota-ona bo'limiga kirishda yuzni tekshirish
  const handleRoleChange = (role) => {
    if (role === 'parent') {
      setIsFaceModalOpen(true);
      setFaceScanStatus('idle');
      setTimeout(() => startCamera(videoRef), 300);
    } else {
      setUserRole('child');
      setActiveTab('dashboard');
    }
  };

  const triggerFaceScan = () => {
    setFaceScanStatus('scanning');
    setTimeout(() => {
      setFaceScanStatus('success');
      setTimeout(() => {
        setUserRole('parent');
        setIsFaceModalOpen(false);
        setActiveTab('parent_control');
        stopCamera(videoRef);
      }, 1000);
    }, 3000);
  };

  const closeModal = () => {
    setIsFaceModalOpen(false);
    stopCamera(videoRef);
  };

  // --- 1. RO'YXATDAN O'TISH BOSQICHI (ONBOARDING) ---
  if (appStage === 'register') {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-200 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
          
          {/* Logo */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-[0_0_20px_rgba(6,182,212,0.4)]">Ω</div>
            <h2 className="text-2xl font-extrabold text-white tracking-wider">OmniGuard AI</h2>
            <p className="text-xs text-slate-400">Kiberxavfsizlik va Ota-ona nazorati tizimi</p>
          </div>

          {/* STEP 1: MATNLARNI KIRITISH */}
          {regStep === 1 && (
            <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Tizimda ro'yxatdan o'tish</h3>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ismingiz</label>
                <input 
                  type="text" 
                  required
                  value={regForm.firstName}
                  onChange={(e) => setRegForm({...regForm, firstName: e.target.value})}
                  placeholder="Masalan: Nazarbek" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Familiyangiz</label>
                <input 
                  type="text" 
                  required
                  value={regForm.lastName}
                  onChange={(e) => setRegForm({...regForm, lastName: e.target.value})}
                  placeholder="Masalan: Xudoyberdiyev" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">E-pochta (Email)</label>
                <input 
                  type="email" 
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  placeholder="example@gmail.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                Davom etish <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </form>
          )}

          {/* STEP 2: BIOMETRIK YUZNI RO'YXATGA OLISH */}
          {regStep === 2 && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Biometrik Face ID sozlash</h3>
                <p className="text-xs text-slate-400">Assalomu alaykum, {regForm.firstName}! Endi yuzingizni skanerlab tizim mudofaasini faollashtiring.</p>
              </div>

              {/* Kamera Dumaloq Oynasi */}
              <div className="w-56 h-56 mx-auto bg-slate-950 rounded-full border-2 border-dashed border-cyan-500/40 relative overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <video ref={regVideoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                
                {regFaceStatus === 'scanning' && (
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full">
                    <div className="w-full h-1 bg-cyan-400 absolute top-0 left-0 shadow-[0_0_12px_#06b6d4] animate-[bounce_2s_infinite]"></div>
                  </div>
                )}

                {regFaceStatus === 'success' && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-400">
                    <i className="fas fa-user-check text-4xl animate-pulse"></i>
                    <span className="text-xs font-bold mt-2 uppercase font-mono tracking-wider">Yuzingiz Saqlandi</span>
                  </div>
                )}
              </div>

              <div>
                {regFaceStatus === 'idle' && (
                  <button 
                    onClick={handleRegFaceScan}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <i className="fas fa-camera mr-1"></i> Yuzni Skanerlash va Kirish
                  </button>
                )}
                {regFaceStatus === 'scanning' && (
                  <div className="text-cyan-400 font-mono text-xs animate-pulse">AI yuz geometriyasini tahlil qilmoqda...</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // --- 2. ASOSIY DASTUR BOSQICHI (RO'YXATDAN O'TGANDAN KEYIN) ---
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-200 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#0b0f19] border-b md:border-b-0 md:border-r border-slate-800/80 p-4 md:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6 md:space-y-8">
          {/* Logo & Profil */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">Ω</div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-wider">OmniGuard AI</h2>
                <span className="text-[10px] text-slate-500 block font-mono">User: {regForm.firstName}</span>
              </div>
            </div>
          </div>

          {/* REJIM ALMASHTIRISH */}
          <div className="bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 flex gap-2">
            <button 
              onClick={() => handleRoleChange('child')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${userRole === 'child' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500'}`}
            >
              <i className="fas fa-child mr-1"></i> Bola Rejimi
            </button>
            <button 
              onClick={() => handleRoleChange('parent')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${userRole === 'parent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-slate-500'}`}
            >
              <i className="fas fa-face-smile mr-1"></i> Ota-ona (AI)
            </button>
          </div>
          
          {/* NAVIGATSIYA */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border-l-4 border-cyan-500 pl-3' : 'text-slate-400 hover:bg-slate-800/40'}`}
            >
              <i className="fas fa-chart-pie text-base w-5 text-center"></i> {userRole === 'parent' ? 'Ota-ona Paneli' : 'Asosiy Oyna'}
            </button>

            {userRole === 'parent' && (
              <>
                <button 
                  onClick={() => setActiveTab('parent_control')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'parent_control' ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-400 border-l-4 border-purple-500 pl-3' : 'text-slate-400 hover:bg-slate-800/40'}`}
                >
                  <i className="fas fa-eye text-base w-5 text-center"></i> Bolani Nazorat Qilish
                </button>
                <button 
                  onClick={() => setActiveTab('location')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'location' ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/40'}`}
                >
                  <i className="fas fa-map-marker-alt text-base w-5 text-center"></i> Jonli Lokatsiya
                </button>
              </>
            )}

            <button 
              onClick={() => setActiveTab('threats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'threats' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border-l-4 border-cyan-500 pl-3' : 'text-slate-400 hover:bg-slate-800/40'}`}
            >
              <i className="fas fa-biohazard text-base w-5 text-center"></i> Tizim Tahdidlari ({logs.length})
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard safetyScore={safetyScore} logs={logs} setSafetyScore={setSafetyScore} setLogs={setLogs} />
        )}
        
        {activeTab === 'threats' && (
          <Threats logs={logs} />
        )}

        {/* OTA-ONA NAZORATI */}
        {activeTab === 'parent_control' && userRole === 'parent' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white"><i className="fas fa-user-shield text-purple-400 mr-2"></i> Farzandning Smartfon Faoliyati</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Hozirgi Faollik</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500 block">Aktiv Ilova</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono"><i className="fab fa-youtube text-red-500 mr-1"></i> {childData.currentApp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 🔐 OTA-ONA BO'LIMIGA O'TISH FACE ID MODALI */}
      {isFaceModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 w-full max-w-sm space-y-6 shadow-2xl relative overflow-hidden">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <i className="fas fa-face-viewfinder text-cyan-400 animate-pulse"></i> OmniGuard Face ID
              </h3>
              <p className="text-xs text-slate-400">Faqat ota-onaning yuzi tekshiruvdan o'tsagina ruxsat beriladi.</p>
            </div>

            <div className="w-52 h-52 mx-auto bg-slate-950 rounded-full border-2 border-slate-800 relative overflow-hidden flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              {faceScanStatus === 'scanning' && (
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full">
                  <div className="w-full h-1 bg-cyan-400 absolute top-0 left-0 shadow-[0_0_10px_#06b6d4] animate-[bounce_2s_infinite]"></div>
                </div>
              )}
              {faceScanStatus === 'success' && (
                <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-400">
                  <i className="fas fa-check-circle text-4xl animate-bounce"></i>
                  <span className="text-xs font-bold mt-2 uppercase font-mono">Tasdiqlandi</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {faceScanStatus === 'idle' && (
                <button onClick={triggerFaceScan} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm rounded-xl transition-all">
                  Skanerlashni boshlash
                </button>
              )}
              <button onClick={closeModal} className="w-full py-2 bg-slate-900 text-slate-400 text-xs font-bold rounded-xl transition-all">
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;