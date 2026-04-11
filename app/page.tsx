'use client';

import { useState } from 'react';

const GEMINI_KEY = 'AIzaSyBByGrTOl1dQ2cEjSi0nSOob-vXx4sacWs';

async function askGemini(prompt: string): Promise<string> {
  try {
    const res = await fetch(
      `/api/ai`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      }
    );
    const data = await res.json();
    return data.result || 'لا يوجد رد';
  } catch {
    return 'خطأ في الاتصال';
  }
}

const COLORS = {
  bg: '#0d0d1a',
  bg2: '#111128',
  bg3: '#1a1a35',
  card: '#161630',
  border: 'rgba(255,255,255,0.07)',
  green: '#00d68f',
  blue: '#4d9fff',
  red: '#ff5f6d',
  amber: '#ffb340',
  text: '#f0f4ff',
  text2: '#8899bb',
  text3: '#3d4a6a',
};

type Screen = 'onboard' | 'auth' | 'main';
type Tab = 'search' | 'ai' | 'doctors' | 'map' | 'subscription';

interface Med {
  name: string;
  dose: string;
}

interface Drug {
  name: string;
  generic: string;
  emoji: string;
  price: string;
  tags: string[];
}

interface Doctor {
  name: string;
  spec: string;
  rating: string;
  price: string;
  online: boolean;
  emoji: string;
  bg: string;
  role: string;
}

interface ChatMessage {
  role: 'user' | 'doc';
  text: string;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('onboard');
  const [tab, setTab] = useState<Tab>('search');
  const [authTab, setAuthTab] = useState<'login' | 'reg'>('login');

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", direction: 'rtl' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: inherit; }
        button { font-family: inherit; cursor: pointer; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg2}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.bg3}; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {screen === 'onboard' && <OnboardScreen onStart={() => setScreen('auth')} />}
      {screen === 'auth' && <AuthScreen authTab={authTab} setAuthTab={setAuthTab} onLogin={() => setScreen('main')} />}
      {screen === 'main' && (
        <MainLayout tab={tab} setTab={setTab} onLogout={() => setScreen('onboard')} />
      )}
    </div>
  );
}

function OnboardScreen({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: '🔍', title: 'بحث ذكي بالاسم أو الصورة', desc: 'قاعدة بيانات عالمية للأدوية' },
    { icon: '🤖', title: 'AI لكشف التضارب', desc: 'تحليل فوري حقيقي بالذكاء الاصطناعي' },
    { icon: '👨‍⚕️', title: 'استشارة طبية فورية', desc: 'شات، صوت، وفيديو مع متخصصين' },
    { icon: '🗺️', title: 'خريطة الصيدليات', desc: 'أقرب صيدلية تبيع ما تحتاجه' },
    { icon: '⭐', title: 'اشتراك الأمراض المزمنة', desc: 'تجديد تلقائي قبل نفاد دوائك' },
  ];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', animation: 'fadeIn .5s ease' }}>
      <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg,#00d68f,#4d9fff)', borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 32, boxShadow: '0 16px 40px rgba(0,214,143,0.3)' }}>💊</div>
      <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: COLORS.text, textAlign: 'center', marginBottom: 16, lineHeight: 1.2 }}>
        صيدلية العالم في <span style={{ background: 'linear-gradient(90deg,#00d68f,#4d9fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>جيبك</span>
      </h1>
      <p style={{ fontSize: 18, color: COLORS.text2, textAlign: 'center', maxWidth: 500, lineHeight: 1.7, marginBottom: 48 }}>
        ابحث عن أدويتك، تحقق من التضارب، واستشر أطباء متخصصين — كل ما تحتاجه في مكان واحد
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, width: '100%', maxWidth: 900, marginBottom: 48 }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20, transition: 'all .2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,214,143,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = COLORS.border)}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: COLORS.text2 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onStart} style={{ padding: '15px 40px', background: COLORS.green, border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 700, color: '#0a1a10', boxShadow: '0 0 30px rgba(0,214,143,0.3)', transition: 'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,214,143,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,214,143,0.3)'; }}>
          ابدأ مجاناً ←
        </button>
        <button onClick={onStart} style={{ padding: '14px 32px', background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 14, fontSize: 16, color: COLORS.text, transition: 'all .2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = COLORS.bg3)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
}

function AuthScreen({ authTab, setAuthTab, onLogin }: { authTab: 'login' | 'reg'; setAuthTab: (t: 'login' | 'reg') => void; onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn .4s ease' }}>
      <div style={{ width: '100%', maxWidth: 440, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 40 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>مرحباً 👋</div>
        <div style={{ fontSize: 14, color: COLORS.text2, marginBottom: 32 }}>ادخل لحسابك أو أنشئ حساباً جديداً</div>
        <div style={{ display: 'flex', background: COLORS.bg2, borderRadius: 12, padding: 4, marginBottom: 28, gap: 4 }}>
          {(['login', 'reg'] as const).map(t => (
            <button key={t} onClick={() => setAuthTab(t)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 9, background: authTab === t ? COLORS.bg3 : 'transparent', color: authTab === t ? COLORS.text : COLORS.text2, fontSize: 14, fontWeight: 600, transition: 'all .2s' }}>
              {t === 'login' ? 'دخول' : 'حساب جديد'}
            </button>
          ))}
        </div>
        {authTab === 'reg' && (
          <Field label="الاسم الكامل"><input value={name} onChange={e => setName(e.target.value)} placeholder="محمد أحمد" style={inputStyle} /></Field>
        )}
        <Field label="البريد الإلكتروني"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email" style={inputStyle} /></Field>
        <Field label="كلمة المرور"><input value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" style={inputStyle} /></Field>
        <button onClick={onLogin} style={{ width: '100%', padding: 15, background: COLORS.green, border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#0a1a10', marginTop: 8, transition: 'all .2s' }}>
          {authTab === 'login' ? 'دخول' : 'إنشاء الحساب'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: COLORS.text3, fontSize: 13 }}>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />أو<div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>
        <button onClick={onLogin} style={{ width: '100%', padding: 14, background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 14, fontSize: 14, fontWeight: 600, color: COLORS.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>G</span> الدخول عبر Google
        </button>
      </div>
    </div>
  );
}

function MainLayout({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'search', icon: '🔍', label: 'بحث' },
    { id: 'ai', icon: '🤖', label: 'AI Agent' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'أطباء' },
    { id: 'map', icon: '🗺️', label: 'خريطة' },
    { id: 'subscription', icon: '⭐', label: 'اشتراك' },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: COLORS.bg2, borderLeft: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#00d68f,#4d9fff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💊</div>
            <span style={{ fontSize: 18, fontWeight: 700, background: 'linear-gradient(90deg,#00d68f,#4d9fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PharmaLink</span>
          </div>
        </div>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', border: 'none', background: tab === item.id ? 'rgba(0,214,143,0.1)' : 'transparent', color: tab === item.id ? COLORS.green : COLORS.text2, fontSize: 14, fontWeight: 500, borderRight: tab === item.id ? `3px solid ${COLORS.green}` : '3px solid transparent', textAlign: 'right', transition: 'all .2s' }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '0 20px' }}>
          <div style={{ fontSize: 13, color: COLORS.text3, marginBottom: 8 }}>أهلاً، خميس 👋</div>
          <button onClick={onLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text2, fontSize: 13 }}>
            🚪 خروج
          </button>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, marginRight: 220, padding: '32px', minHeight: '100vh', animation: 'fadeIn .3s ease' }}>
        {tab === 'search' && <SearchTab />}
        {tab === 'ai' && <AITab />}
        {tab === 'doctors' && <DoctorsTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'subscription' && <SubscriptionTab />}
      </div>
    </div>
  );
}

function SearchTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);

  const localDrugs: Drug[] = [
    { name: 'Panadol Extra', generic: 'باراسيتامول + كافيين 500/65 ملجم', emoji: '💊', price: '3.50 د.أ', tags: ['متوفر', 'مسكنات'] },
    { name: 'Amlodipine 5mg', generic: 'أملوديبين — ضغط الدم', emoji: '❤️', price: '8.20 د.أ', tags: ['متوفر', 'وصفة طبية'] },
    { name: 'Metformin 500mg', generic: 'ميتفورمين — السكري', emoji: '🩺', price: '5.00 د.أ', tags: ['متوفر', 'وصفة طبية'] },
    { name: 'Aspirin 100mg', generic: 'أسبرين — مضاد تخثر', emoji: '🫀', price: '2.10 د.أ', tags: ['متوفر', 'قلب'] },
    { name: 'Amoxicillin 500mg', generic: 'أموكسيسيلين — مضاد حيوي', emoji: '🧬', price: '6.00 د.أ', tags: ['متوفر', 'وصفة طبية'] },
    { name: 'Omeprazole 20mg', generic: 'أوميبرازول — حموضة المعدة', emoji: '🫁', price: '4.50 د.أ', tags: ['متوفر', 'معدة'] },
    { name: 'Atorvastatin 20mg', generic: 'أتورفاستاتين — الكوليسترول', emoji: '💙', price: '9.00 د.أ', tags: ['متوفر', 'وصفة طبية'] },
    { name: 'Lisinopril 10mg', generic: 'ليسينوبريل — ضغط الدم', emoji: '🩸', price: '7.50 د.أ', tags: ['متوفر', 'وصفة طبية'] },
  ];

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const filtered = localDrugs.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) || d.generic.includes(query)
    );
    if (filtered.length > 0) {
      setResults(filtered);
      setLoading(false);
    } else {
      const reply = await askGemini(`أنا أبحث عن دواء اسمه "${query}". أعطني معلومات عنه باختصار: الاسم التجاري، الاستخدام، والجرعة الشائعة. رد بالعربي في 3 أسطر فقط.`);
      setResults([{ name: query, generic: reply, emoji: '💊', price: 'اسأل الصيدلي', tags: ['معلومات AI'] }]);
      setLoading(false);
    }
  };

  const display = results.length > 0 ? results : localDrugs;

  return (
    <div>
      <PageHeader title="🔍 البحث عن دواء" subtitle="ابحث عن أي دواء في العالم" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔎</span>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="اكتب اسم الدواء أو المادة الفعالة..." style={{ ...inputStyle, width: '100%', paddingRight: 48 }} />
        </div>
        <button style={{ padding: '0 20px', background: 'rgba(77,159,255,0.1)', border: `1px solid ${COLORS.blue}`, borderRadius: 12, color: COLORS.blue, fontSize: 14, fontWeight: 600 }}>📷 صورة</button>
        <button onClick={search} style={{ padding: '0 28px', background: COLORS.green, border: 'none', borderRadius: 12, color: '#0a1a10', fontSize: 15, fontWeight: 700 }}>بحث</button>
      </div>
      {loading && <Loader />}
      {!loading && (
        <>
          <SectionTitle>{results.length > 0 ? 'نتائج البحث' : 'أدوية شائعة'}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {display.map((d, i) => (
              <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,214,143,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 52, height: 52, background: COLORS.bg2, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{d.emoji}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.text2, marginTop: 3 }}>{d.generic}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {d.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(0,214,143,0.12)', color: COLORS.green, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.green }}>{d.price}</span>
                  <button style={{ padding: '7px 16px', background: COLORS.green, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#0a1a10' }}>طلب توصيل</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AITab() {
  const [meds, setMeds] = useState<Med[]>([
    { name: 'Amlodipine 5mg', dose: 'مرة يومياً صباحاً' },
    { name: 'Metformin 500mg', dose: 'مرتان يومياً مع الأكل' },
    { name: 'Aspirin 100mg', dose: 'مرة يومياً ليلاً' },
    { name: 'Ibuprofen 400mg', dose: 'عند الحاجة' },
  ]);
  const [newMed, setNewMed] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult('');
    const list = meds.map(m => `- ${m.name} (${m.dose})`).join('\n');
    const prompt = `أنت صيدلاني متخصص. المريض يأخذ:\n${list}\n\nحلل التضارب بين هذه الأدوية:\n1. هل يوجد تضارب خطير؟\n2. ما هو التضارب تحديداً؟\n3. التوصية؟\nرد بالعربي بشكل واضح ومختصر.`;
    const reply = await askGemini(prompt);
    setResult(reply);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="🤖 AI Agent" subtitle="تحليل حقيقي بالذكاء الاصطناعي لتضارب الأدوية" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.green, boxShadow: `0 0 10px ${COLORS.green}`, animation: 'pulse 2s infinite' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>AI جاهز للتحليل</div>
              <div style={{ fontSize: 13, color: COLORS.text2 }}>أضف أدويتك واضغط تحليل</div>
            </div>
          </div>
          <SectionTitle>أدويتك الحالية</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {meds.map((m, i) => (
              <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.green, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.text2 }}>{m.dose}</div>
                </div>
                <button onClick={() => setMeds(meds.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: COLORS.red, fontSize: 18, padding: '0 4px' }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input value={newMed} onChange={e => setNewMed(e.target.value)} onKeyDown={e => e.key === 'Enter' && newMed.trim() && (setMeds([...meds, { name: newMed, dose: 'حسب وصف الطبيب' }]), setNewMed(''))} placeholder="أضف دواء..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => { if (newMed.trim()) { setMeds([...meds, { name: newMed, dose: 'حسب وصف الطبيب' }]); setNewMed(''); } }} style={{ width: 46, background: COLORS.green, border: 'none', borderRadius: 12, fontSize: 22, color: '#0a1a10', fontWeight: 700 }}>+</button>
          </div>
          <button onClick={analyze} style={{ width: '100%', padding: 15, background: COLORS.green, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#0a1a10' }}>
            تحليل التضارب بالذكاء الاصطناعي
          </button>
        </div>
        <div>
          <SectionTitle>نتيجة التحليل</SectionTitle>
          {loading && <Loader />}
          {!loading && result === '' && (
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 40, textAlign: 'center', color: COLORS.text3 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <div>اضغط تحليل لرؤية النتيجة</div>
            </div>
          )}
          {!loading && result !== '' && (
            <div style={{ background: 'rgba(255,179,64,0.06)', border: '1px solid rgba(255,179,64,0.2)', borderRadius: 16, padding: 24, animation: 'fadeIn .4s ease' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.amber, marginBottom: 12 }}>نتيجة التحليل</div>
              <div style={{ fontSize: 14, color: COLORS.text2, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{result}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorsTab() {
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const docs: Doctor[] = [
    { name: 'د. محمد الشرفاء', spec: 'قلب وأوعية دموية', rating: '4.9', price: '25', online: true, emoji: '👨‍⚕️', bg: 'rgba(77,159,255,0.12)', role: 'طبيب قلب متخصص' },
    { name: 'د. سارة الأحمد', spec: 'طب عام وعائلي', rating: '4.8', price: '18', online: true, emoji: '👩‍⚕️', bg: 'rgba(0,214,143,0.12)', role: 'طبيبة عامة' },
    { name: 'د. يوسف العمر', spec: 'جهاز هضمي', rating: '4.7', price: '22', online: false, emoji: '👨‍⚕️', bg: 'rgba(167,139,250,0.12)', role: 'متخصص هضمي' },
    { name: 'د. منى الزهراني', spec: 'أمراض جلدية', rating: '4.8', price: '20', online: true, emoji: '👩‍⚕️', bg: 'rgba(255,95,109,0.12)', role: 'طبيبة جلدية' },
  ];

  const sendMsg = async () => {
    if (!msg.trim() || selected === null) return;
    const userMsg = msg;
    setMsg('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const doc = docs[selected];
    const prompt = `أنت ${doc.name}، ${doc.role}. أجب على سؤال المريض بشكل طبي مهني ومختصر باللغة العربية. لا تتجاوز 4 أسطر. السؤال: ${userMsg}`;
    const reply = await askGemini(prompt);
    setChat(prev => [...prev, { role: 'doc', text: reply }]);
    setLoading(false);
  };

  if (selected !== null) {
    const doc = docs[selected];
    return (
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
          <button onClick={() => { setSelected(null); setChat([]); }} style={{ background: 'none', border: 'none', color: COLORS.green, fontSize: 16, padding: '8px 16px', borderRadius: 10, border: `1px solid ${COLORS.green}` }}>← رجوع</button>
          <div style={{ width: 44, height: 44, background: doc.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{doc.emoji}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>{doc.name}</div>
            <div style={{ fontSize: 13, color: COLORS.green }}>● متاح الآن</div>
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', gap: 10 }}>
            <button style={{ padding: '8px 16px', background: COLORS.bg3, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text2, fontSize: 14 }}>📞 صوت</button>
            <button style={{ padding: '8px 16px', background: COLORS.blue, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14 }}>📹 فيديو</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}>
          <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: COLORS.bg3, borderRadius: '4px 16px 16px 16px', padding: '12px 16px', fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
            مرحباً! أنا {doc.name}، {doc.spec}. كيف يمكنني مساعدتك اليوم؟
          </div>
          {chat.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%', background: m.role === 'user' ? COLORS.green : COLORS.bg3, borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', fontSize: 14, color: m.role === 'user' ? '#0a1a10' : COLORS.text, lineHeight: 1.6 }}>
              {m.text}
            </div>
          ))}
          {loading && <div style={{ alignSelf: 'flex-start', background: COLORS.bg3, borderRadius: '4px 16px 16px 16px', padding: '14px 20px' }}><Loader /></div>}
        </div>
        <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="اكتب سؤالك للطبيب..." style={{ ...inputStyle, flex: 1 }} />
          <button onClick={sendMsg} style={{ padding: '0 20px', background: COLORS.green, border: 'none', borderRadius: 12, fontSize: 20, color: '#0a1a10' }}>➤</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="👨‍⚕️ استشارة طبية" subtitle="أطباء متخصصون متاحون الآن" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {docs.map((d, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 22, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(77,159,255,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 56, height: 56, background: d.bg, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{d.emoji}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{d.name}</div>
                <div style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600 }}>{d.spec}</div>
                <div style={{ fontSize: 12, color: COLORS.text2 }}>⭐ {d.rating}</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: d.online ? 'rgba(0,214,143,0.12)' : 'rgba(255,255,255,0.05)', marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.online ? COLORS.green : COLORS.text3 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: d.online ? COLORS.green : COLORS.text3 }}>{d.online ? 'متاح الآن' : 'غير متاح'}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{d.price} د.أ <span style={{ fontSize: 13, color: COLORS.text2, fontWeight: 400 }}>/ 30 دقيقة</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => d.online && setSelected(i)} style={{ flex: 1, padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: 10, background: COLORS.bg2, color: COLORS.text2, fontSize: 13, fontWeight: 600 }}>💬 شات</button>
              <button style={{ flex: 1, padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: 10, background: COLORS.bg2, color: COLORS.text2, fontSize: 13, fontWeight: 600 }}>📞 صوت</button>
              <button style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, background: COLORS.blue, color: '#fff', fontSize: 13, fontWeight: 600 }}>📹 فيديو</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapTab() {
  const pharmacies = [
    { name: 'صيدلية الشفاء الدولية', dist: '0.3 كم', area: 'حي النزهة', open: true, icon: '💊' },
    { name: 'صيدلية البتول', dist: '0.7 كم', area: 'شارع الملك عبدالله', open: true, icon: '🏥' },
    { name: 'صيدلية النهدي', dist: '1.2 كم', area: 'داخل المول', open: false, icon: '💊' },
    { name: 'صيدلية الراشد', dist: '1.8 كم', area: 'حي الربوة', delivery: true, icon: '🏪' },
    { name: 'صيدلية المتحدة', dist: '2.1 كم', area: 'الطريق الرئيسي', open: true, icon: '💊' },
    { name: 'صيدلية دواء', dist: '2.4 كم', area: 'مركز التسوق', open: true, icon: '🏪' },
  ];
  return (
    <div>
      <PageHeader title="🗺️ الصيدليات القريبة" subtitle="أقرب صيدلية تبيع ما تحتاجه مع خيار التوصيل" />
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, height: 300, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />
        <span style={{ fontSize: 52, position: 'relative' }}>📍</span>
        <p style={{ color: COLORS.text2, fontSize: 15, position: 'relative' }}>فعّل موقعك لعرض الخريطة التفاعلية</p>
        <button style={{ padding: '10px 24px', background: COLORS.green, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#0a1a10', position: 'relative' }}>
          📍 تفعيل الموقع
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {pharmacies.map((p, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bg3}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.card}>
            <div style={{ width: 44, height: 44, background: COLORS.bg2, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.name}</div>
              <div style={{ fontSize: 12, color: COLORS.text2 }}>{p.dist} — {p.area}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: (p as any).open ? 'rgba(0,214,143,0.12)' : (p as any).delivery ? 'rgba(77,159,255,0.12)' : 'rgba(255,95,109,0.1)', color: (p as any).open ? COLORS.green : (p as any).delivery ? COLORS.blue : COLORS.red }}>
              {(p as any).open ? 'مفتوح' : (p as any).delivery ? 'توصيل' : 'مغلق'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionTab() {
  const plans = [
    { name: 'الأساسي', price: 'مجاناً', period: '', features: ['بحث عن الأدوية', 'خريطة الصيدليات', 'تحليل التضارب (3 مرات/شهر)'], featured: false },
    { name: 'Premium', price: '29', period: 'د.أ/شهر', features: ['كل ميزات الأساسي', 'تجديد تلقائي للأدوية', 'تحليل AI بلا حدود', 'استشارة طبيب مرة شهرياً', 'توصيل مجاني', 'تنبيهات انتهاء الوصفة'], featured: true },
    { name: 'المؤسسات', price: '99', period: 'د.أ/شهر', features: ['كل ميزات Premium', 'حتى 10 أفراد', 'تقارير صحية شهرية', 'مدير حساب مخصص', 'API للتكامل مع الأنظمة'], featured: false },
  ];
  return (
    <div>
      <PageHeader title="⭐ اشتراك الأمراض المزمنة" subtitle="لا تنفد أدويتك أبداً — نوصلها لك تلقائياً قبل النفاد" />
      <div style={{ background: 'linear-gradient(135deg,rgba(0,214,143,0.08),rgba(77,159,255,0.08))', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 18, padding: 32, textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>كيف يعمل الاشتراك؟</div>
        <div style={{ fontSize: 15, color: COLORS.text2, maxWidth: 600, margin: '0 auto' }}>أضف أدويتك المزمنة مرة واحدة — سنراقب مخزونك ونوصل لك الجديد تلقائياً قبل 3 أيام من النفاد</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
        {plans.map((plan, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${plan.featured ? 'rgba(0,214,143,0.5)' : COLORS.border}`, borderRadius: 18, padding: 28, position: 'relative', boxShadow: plan.featured ? '0 0 30px rgba(0,214,143,0.1)' : 'none' }}>
            {plan.featured && <div style={{ position: 'absolute', top: -12, right: 24, background: COLORS.green, color: '#0a1a10', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 100 }}>الأشهر</div>}
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{plan.name}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.green, margin: '16px 0 6px' }}>{plan.price} <span style={{ fontSize: 15, color: COLORS.text2, fontWeight: 400 }}>{plan.period}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0 24px' }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: COLORS.text2 }}>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button style={{ width: '100%', padding: 13, borderRadius: 12, border: plan.featured ? 'none' : `1px solid ${COLORS.border}`, background: plan.featured ? COLORS.green : 'transparent', color: plan.featured ? '#0a1a10' : COLORS.text, fontSize: 15, fontWeight: 600 }}>
              {i === 0 ? 'خطتك الحالية' : 'اشترك الآن'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== HELPERS =====
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{title}</h1>
      <p style={{ fontSize: 15, color: COLORS.text2 }}>{subtitle}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, color: COLORS.text2, marginBottom: 8, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
      <div style={{ width: 20, height: 20, border: `2px solid ${COLORS.green}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 14, color: COLORS.text2 }}>AI يعمل على طلبك...</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111128',
  border: '1.5px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '13px 16px',
  color: '#f0f4ff',
  fontSize: 15,
  outline: 'none',
};
