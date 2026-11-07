export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" };

    // ==================== API برای دریافت آی‌پی و اپراتور ====================
    if (url.pathname === '/api/myip') {
      const clientIP = request.headers.get('CF-Connecting-IP') || "نامشخص";
      const country = request.cf?.country || "نامشخص";
      const city = request.cf?.city || "نامشخص";
      const asn = request.cf?.asn || 0;
      
      const ISP_MAP = {
        "44244": "ایرانسل", "197207": "همراه اول", "58224": "مخابرات (TCI)",
        "31549": "شاتل", "42337": "پارس آنلاین", "43754": "آسیاتک",
        "57218": "رایتل", "16322": "پارس پک", "48159": "پیشگامان",
        "25184": "افرانت", "56402": "صبانت", "21478": "مبین نت",
        "12880": "زیرساخت (DCI)", "57497": "شاتل موبایل", "48434": "پارس آنلاین"
      };
      
      let ispName = ISP_MAP[String(asn)] || "سایر اپراتورها";
      if (asn === 0) ispName = "شبکه محلی";

      return new Response(JSON.stringify({ ip: clientIP, country, city, asn, isp: ispName }), { headers: corsHeaders });
    }

    // ==================== API برای ذخیره داده‌های تست ====================
    if (url.pathname === '/api/save_test' && request.method === 'POST') {
      try {
        const body = await request.json(); // { isp: "ایرانسل", score: 45 }
        if (env.RADAR_KV) {
          let recent = await env.RADAR_KV.get('recent_tests') || '[]';
          let list = JSON.parse(recent);
          const now = Date.now();
          list.push({ t: now, i: body.isp, s: body.score });
          // نگهداری فقط داده‌های ۱ ساعت اخیر برای جلوگیری از پر شدن حجم
          list = list.filter(x => now - x.t < 3600000);
          await env.RADAR_KV.put('recent_tests', JSON.stringify(list));
        }
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      } catch (e) { return new Response(JSON.stringify({ ok: false }), { status: 500, headers: corsHeaders }); }
    }

    // ==================== API برای دریافت داده‌های نمودار جمعی ====================
    if (url.pathname === '/api/get_charts') {
      let list = [];
      if (env.RADAR_KV) {
        let recent = await env.RADAR_KV.get('recent_tests') || '[]';
        list = JSON.parse(recent);
      }

      const now = Date.now();
      const labels = [];
      const buckets = {}; 
      
      // ساخت ۶۰ دقیقه اخیر
      for (let i = 59; i >= 0; i--) {
        const time = new Date(now - i * 60000);
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        labels.push(timeStr);
        buckets[timeStr] = { total: [], mci: [], irancell: [], tci: [], other: [] };
      }

      // پر کردن داده‌ها
      list.forEach(item => {
        const time = new Date(item.t);
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
        if (buckets[timeStr]) {
          buckets[timeStr].total.push(item.s);
          if (item.i.includes('همراه اول')) buckets[timeStr].mci.push(item.s);
          else if (item.i.includes('ایرانسل')) buckets[timeStr].irancell.push(item.s);
          else if (item.i.includes('مخابرات')) buckets[timeStr].tci.push(item.s);
          else buckets[timeStr].other.push(item.s);
        }
      });

      const getAvg = (arr) => arr.length ? Math.round(arr.reduce((a,b)=>a+b, 0) / arr.length) : null;

      return new Response(JSON.stringify({ 
        labels, 
        dataTotal: labels.map(l => getAvg(buckets[l].total)),
        dataMci: labels.map(l => getAvg(buckets[l].mci)),
        dataIrancell: labels.map(l => getAvg(buckets[l].irancell)),
        dataTci: labels.map(l => getAvg(buckets[l].tci)),
        dataOther: labels.map(l => getAvg(buckets[l].other))
      }), { headers: corsHeaders });
    }

    const BOT_API_URL = "https://radar-bot.royal-trust-ir-official.workers.dev/api/report_test";

    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta name="google-site-verification" content="Oskdq7_86up9xROsMJqIpKZ_cTczPZ5ZCNroOT-bnCc" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>رادار اینترنت ایران | تست هوشمند آزادی اینترنت</title>
    
    <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/2933/2933942.png">
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- کتابخانه Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        :root { --bg: #030712; --surface: rgba(17, 24, 39, 0.7); --text: #f9fafb; --muted: #9ca3af; --primary: #10b981; --blue: #3b82f6; --gold: #f59e0b; --red: #ef4444; --border: rgba(255, 255, 255, 0.08); --sidebar-width: 260px; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        body { background-color: var(--bg); color: var(--text); line-height: 1.8; overflow-x: hidden; display: flex; height: 100vh; background-image: radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.1), transparent 40%); background-attachment: fixed; }
        a { text-decoration: none; color: inherit; transition: 0.3s; }
        
        .sidebar { width: var(--sidebar-width); background: rgba(3, 7, 18, 0.95); backdrop-filter: blur(20px); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; position: fixed; top: 0; right: 0; height: 100vh; z-index: 1000; }
        .logo { font-size: 1.3rem; font-weight: 900; display: flex; align-items: center; gap: 10px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .logo i { color: var(--primary); font-size: 1.6rem; }
        .nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 12px; color: var(--muted); font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .nav-item.active { background: rgba(16, 185, 129, 0.1); color: var(--primary); border-right: 3px solid var(--primary); }
        .nav-item i { width: 20px; text-align: center; }
        .sidebar-footer { padding-top: 20px; border-top: 1px solid var(--border); text-align: center; }
        .btn-tg { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: var(--blue); color: #fff; border-radius: 10px; font-weight: bold; font-size: 0.9rem; border: none; cursor: pointer; }
        
        .main-content { flex: 1; margin-right: var(--sidebar-width); padding: 40px; overflow-y: auto; height: 100vh; display: flex; flex-direction: column; }
        .tab-content { display: none; animation: fadeIn 0.4s ease; flex: 1; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 2rem; font-weight: 900; margin-bottom: 10px; }
        
        .notice-box {
            background: rgba(245, 158, 11, 0.08); border-right: 4px solid var(--gold);
            padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;
            display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; color: var(--text); line-height: 1.7;
        }
        .notice-box i { color: var(--gold); font-size: 1.3rem; margin-top: 3px; }
        .notice-box b { color: var(--gold); }
        
        .card { background: var(--surface); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 25px; margin-bottom: 20px; }
        
        .chart-container { width: 100%; height: 350px; margin: 20px 0; position: relative; }
        
        .test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
        .isp-info { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: bold; color: var(--blue); }
        .freedom-score { font-size: 2rem; font-weight: 900; color: var(--primary); }
        
        .sites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-top: 15px; }
        .site-card { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; padding: 15px 10px; text-align: center; transition: 0.3s; }
        .site-card.testing { border-color: var(--gold); }
        .site-card.success { border-color: var(--primary); background: rgba(16, 185, 129, 0.1); }
        .site-card.fail { border-color: var(--red); background: rgba(239, 68, 68, 0.1); }
        .site-card i { font-size: 1.8rem; margin-bottom: 8px; color: var(--muted); }
        .site-card.success i { color: var(--primary); }
        .site-card.fail i { color: var(--red); }
        .site-name { font-size: 0.85rem; font-weight: bold; margin-bottom: 5px; }
        .site-ping { font-size: 0.75rem; color: var(--muted); direction: ltr; }
        
        .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid var(--gold); border-radius: 50%; width: 18px; height: 18px; animation: spin 1s linear infinite; margin: 5px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .ip-container { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .ip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; max-width: 600px; margin: 20px 0; }
        .ip-card { background: rgba(0,0,0,0.3); border: 1px dashed var(--border); border-radius: 12px; padding: 15px; cursor: pointer; }
        .ip-badge { background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 8px 15px; border-radius: 50px; font-size: 0.85rem; margin: 5px; display: inline-flex; align-items: center; gap: 8px; }
        
        .info-box { background: rgba(245, 158, 11, 0.05); border-right: none; border-left: 4px solid var(--gold); padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: right; }
        .info-box h3 { color: var(--gold); margin-bottom: 10px; font-size: 1.3rem; }
        .info-box p { color: var(--muted); font-size: 0.95rem; line-height: 1.9; margin-bottom: 15px; }
        
        .main-footer { border-top: 1px solid var(--border); padding-top: 20px; margin-top: auto; text-align: center; color: var(--muted); font-size: 0.85rem; }
        
        @media (max-width: 900px) {
            body { flex-direction: column; }
            .sidebar { width: 100%; height: 70px; top: auto; bottom: 0; right: 0; flex-direction: row; border-left: none; border-top: 1px solid var(--border); padding: 0 10px; justify-content: space-around; }
            .logo, .sidebar-footer { display: none; }
            .nav-menu { flex-direction: row; justify-content: space-around; width: 100%; }
            .nav-item { flex-direction: column; padding: 8px; font-size: 0.75rem; border-right: none; }
            .nav-item.active { border-right: none; border-bottom: 3px solid var(--primary); }
            .main-content { margin-right: 0; padding: 20px; height: calc(100vh - 70px); padding-bottom: 90px; }
            .ip-grid { grid-template-columns: 1fr; }
            .sites-grid { grid-template-columns: repeat(3, 1fr); }
            .chart-container { height: 250px; }
        }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="logo"><i class="fa-solid fa-satellite-dish"></i> رادار ایران</div>
        <div class="nav-menu">
            <div class="nav-item active" onclick="switchTab('dashboard', this)"><i class="fa-solid fa-tower-broadcast"></i> وضعیت زنده</div>
            <div class="nav-item" onclick="switchTab('ip-tool', this)"><i class="fa-solid fa-network-wired"></i> آی‌پی من</div>
            <div class="nav-item" onclick="switchTab('ads', this)"><i class="fa-solid fa-bullhorn"></i> اسپانسری</div>
        </div>
        <div class="sidebar-footer">
            <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn-tg"><i class="fa-brands fa-telegram"></i> ورود به ربات</a>
        </div>
    </aside>

    <main class="main-content">
        <div id="dashboard" class="tab-content active">
            <div class="page-header">
                <div>
                    <h1>داشبورد آزادی اینترنت</h1>
                    <p>وضعیت تجمیعی کاربران در ۱ ساعت گذشته و تست زنده سیستم شما.</p>
                </div>
            </div>

            <div class="notice-box">
                <i class="fa-solid fa-circle-exclamation"></i>
                <div>
                    <b>توجه مهم:</b> جهت دریافت داده‌های دقیق، از <b>غیرفعال بودن سرویس‌های تغییردهندهٔ DNS</b> (مانند شکن، ۴۰۳) و نرم‌افزارهای فیلترشکن اطمینان حاصل فرمایید.
                </div>
            </div>

            <!-- نمودار جمعی (Multi-line) -->
            <div class="card">
                <h3 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--blue);"><i class="fa-solid fa-chart-line"></i> نمودار آزادی اینترنت (۱ ساعت گذشته)</h3>
                <div class="chart-container">
                    <canvas id="aggregateChart"></canvas>
                </div>
            </div>

            <!-- تست اختصاصی کاربر -->
            <div class="card" id="summary-card">
                <div class="test-header">
                    <div class="isp-info">
                        <i class="fa-solid fa-wifi"></i> اپراتور شما: <span id="isp-name" style="color: var(--gold);">در حال شناسایی...</span>
                    </div>
                    <div style="text-align: left;">
                        <div style="font-size: 0.8rem; color: var(--muted);">شاخص آزادی شما</div>
                        <div class="freedom-score" id="freedom-score">--%</div>
                    </div>
                </div>
                
                <p id="summary-text" style="font-size: 0.95rem; color: var(--muted); text-align: center;">
                    در حال انجام تست...
                </p>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--blue);"><i class="fa-solid fa-globe"></i> سرویس‌های خارجی</h3>
                <div class="sites-grid" id="foreign-sites"></div>

                <h3 style="margin: 30px 0 15px; font-size: 1.1rem; color: var(--primary);"><i class="fa-solid fa-house"></i> سرویس‌های داخلی</h3>
                <div class="sites-grid" id="domestic-sites"></div>
            </div>
        </div>

        <!-- سایر تب‌ها (آی‌پی و اسپانسری) -->
        <div id="ip-tool" class="tab-content">
            <div class="page-header"><div><h1>ابزار تشخیص آی‌پی</h1></div></div>
            <div class="card ip-container">
                <div class="ip-grid">
                    <div class="ip-card"><div style="font-size:0.8rem;color:var(--muted)">IPv4</div><div id="ipv4-val" style="font-weight:bold; direction:ltr;">...</div></div>
                    <div class="ip-card"><div style="font-size:0.8rem;color:var(--muted)">IPv6</div><div id="ipv6-val" style="font-weight:bold; direction:ltr;">...</div></div>
                </div>
                <div><span class="ip-badge"><i class="fa-solid fa-flag"></i> <span id="user-country">...</span></span><span class="ip-badge"><i class="fa-solid fa-location-dot"></i> <span id="user-city">...</span></span></div>
            </div>
        </div>

        <div id="ads" class="tab-content">
            <div class="page-header"><div><h1>درخواست اسپانسری</h1></div></div>
            <div class="card" style="max-width: 700px; margin: 0 auto; text-align: center; padding: 40px 25px;">
                <div class="info-box">
                    <h3><i class="fa-solid fa-handshake"></i> همکاری با ما</h3>
                    <p>پلتفرم رادار با جذب مخاطبان متخصص، بستر مناسبی برای معرفی برند شماست. جهت ثبت درخواست تبلیغات یا اسپانسری، وارد ربات شوید.</p>
                </div>
                <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn-tg" style="display: inline-flex; width: auto; padding: 15px 40px; font-size: 1.1rem; background: var(--gold); color: #000;">
                    <i class="fa-brands fa-telegram"></i> ورود به ربات
                </a>
            </div>
        </div>

        <footer class="main-footer">
            © <span id="year"></span> رادار اینترنت ایران. تمامی حقوق محفوظ است.
        </footer>
    </main>

    <script>
        document.getElementById('year').textContent = new Date().getFullYear();
        const BOT_API_URL = "${BOT_API_URL}";
        let aggChart = null;

        function switchTab(tabId, element) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            element.classList.add('active');
            if(tabId === 'ip-tool') fetchIPs();
        }

        // تابع تست سایت‌ها
        async function testSite(domain) {
            const start = performance.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            try {
                await fetch('https://' + domain, { method: 'GET', mode: 'no-cors', signal: controller.signal, cache: 'no-store' });
                clearTimeout(timeoutId);
                return { success: true, time: Math.round(performance.now() - start) };
            } catch (error) {
                clearTimeout(timeoutId);
                return new Promise((resolve) => {
                    const img = new Image();
                    const imgTimeout = setTimeout(() => { img.src = ''; resolve({ success: false, time: 0 }); }, 2000);
                    img.onload = () => { clearTimeout(imgTimeout); resolve({ success: true, time: Math.round(performance.now() - start) }); };
                    img.onerror = () => { clearTimeout(imgTimeout); resolve({ success: false, time: 0 }); };
                    img.src = 'https://' + domain + '/favicon.ico?t=' + Date.now();
                });
            }
        }

        const foreignSites = [
            { name: 'Instagram', domain: 'instagram.com', icon: 'fa-brands fa-instagram' },
            { name: 'Telegram', domain: 'telegram.org', icon: 'fa-brands fa-telegram' },
            { name: 'Twitter / X', domain: 'x.com', icon: 'fa-brands fa-x-twitter' },
            { name: 'Facebook', domain: 'facebook.com', icon: 'fa-brands fa-facebook' },
            { name: 'YouTube', domain: 'youtube.com', icon: 'fa-brands fa-youtube' },
            { name: 'WhatsApp', domain: 'whatsapp.com', icon: 'fa-brands fa-whatsapp' },
            { name: 'Google', domain: 'google.com', icon: 'fa-brands fa-google' },
            { name: 'Google Play', domain: 'play.google.com', icon: 'fa-brands fa-google-play' },
            { name: 'GitHub', domain: 'github.com', icon: 'fa-brands fa-github' },
            { name: 'Wikipedia', domain: 'wikipedia.org', icon: 'fa-brands fa-wikipedia-w' },
            { name: 'Discord', domain: 'discord.com', icon: 'fa-brands fa-discord' },
            { name: 'ChatGPT', domain: 'chatgpt.com', icon: 'fa-solid fa-robot' },
            { name: 'Reddit', domain: 'reddit.com', icon: 'fa-brands fa-reddit' },
            { name: 'Netflix', domain: 'netflix.com', icon: 'fa-solid fa-film' },
            { name: 'Spotify', domain: 'spotify.com', icon: 'fa-brands fa-spotify' }
        ];

        const domesticSites = [
            { name: 'دیجی‌کالا', domain: 'digikala.com', icon: 'fa-solid fa-cart-shopping' },
            { name: 'دیوار', domain: 'divar.ir', icon: 'fa-solid fa-building' },
            { name: 'کافه‌بازار', domain: 'cafebazaar.ir', icon: 'fa-brands fa-google-play' },
            { name: 'شاپرک', domain: 'shaparak.ir', icon: 'fa-solid fa-credit-card' },
            { name: 'آپارات', domain: 'aparat.com', icon: 'fa-solid fa-video' },
            { name: 'علی‌بابا', domain: 'alibaba.ir', icon: 'fa-solid fa-plane' },
            { name: 'اسنپ', domain: 'snapp.ir', icon: 'fa-solid fa-car' },
            { name: 'بله', domain: 'bale.ai', icon: 'fa-solid fa-comment-dots' },
            { name: 'ایتا', domain: 'eitaa.com', icon: 'fa-solid fa-comments' },
            { name: 'شاد', domain: 'shad.ir', icon: 'fa-solid fa-school' }
        ];

        async function runTests() {
            document.getElementById('foreign-sites').innerHTML = '';
            document.getElementById('domestic-sites').innerHTML = '';

            const fContainer = document.getElementById('foreign-sites');
            const dContainer = document.getElementById('domestic-sites');
            
            let allSites = [];
            foreignSites.forEach(s => { fContainer.innerHTML += \`<div class="site-card testing" id="card-\${s.domain}"><i class="\${s.icon}"></i><div class="site-name">\${s.name}</div><div class="site-ping" id="ping-\${s.domain}"><div class="spinner"></div></div></div>\`; allSites.push({...s, type: 'foreign'}); });
            domesticSites.forEach(s => { dContainer.innerHTML += \`<div class="site-card testing" id="card-\${s.domain}"><i class="\${s.icon}"></i><div class="site-name">\${s.name}</div><div class="site-ping" id="ping-\${s.domain}"><div class="spinner"></div></div></div>\`; allSites.push({...s, type: 'domestic'}); });

            const results = await Promise.all(allSites.map(async (site) => {
                const res = await testSite(site.domain);
                const card = document.getElementById('card-' + site.domain);
                const pingBox = document.getElementById('ping-' + site.domain);
                if (res.success) {
                    card.className = 'site-card success';
                    pingBox.innerHTML = res.time + ' ms';
                } else {
                    card.className = 'site-card fail';
                    pingBox.innerHTML = 'مسدود';
                }
                return { name: site.name, domain: site.domain, type: site.type, success: res.success, ping: res.time };
            }));

            const foreignResults = results.filter(r => r.type === 'foreign');
            const successCount = foreignResults.filter(r => r.success).length;
            const freedomPercent = Math.round((successCount / foreignResults.length) * 100);
            
            const scoreEl = document.getElementById('freedom-score');
            scoreEl.textContent = freedomPercent + '%';
            if(freedomPercent > 70) scoreEl.style.color = 'var(--primary)';
            else if(freedomPercent > 30) scoreEl.style.color = 'var(--gold)';
            else scoreEl.style.color = 'var(--red)';

            document.getElementById('summary-text').textContent = freedomPercent >= 50 ? "اینترنت شما در وضعیت نسبتاً آزادی قرار دارد." : "دسترسی شما به سرویس‌های خارجی با محدودیت جدی مواجه است.";

            // ذخیره در دیتابیس سایت و ارسال به ربات
            saveToSiteDB(freedomPercent);
            sendDataToBot(freedomPercent, results);
        }

        // ذخیره در دیتابیس مرکزی سایت (برای نمودار جمعی)
        async function saveToSiteDB(score) {
            try {
                const geoRes = await fetch('/api/myip');
                const geo = await geoRes.json();
                document.getElementById('isp-name').textContent = geo.isp;
                
                // ارسال به API سایت برای ذخیره در KV
                await fetch('/api/save_test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isp: geo.isp, score: score })
                });
                
                // آپدیت نمودار جمعی
                fetchAndDrawAggregateChart();
            } catch (e) { console.log("Error saving to DB:", e); }
        }

        // دریافت داده‌های جمعی و رسم نمودار
        async function fetchAndDrawAggregateChart() {
            try {
                const res = await fetch('/api/get_charts');
                const data = await res.json();
                
                if (aggChart) aggChart.destroy();
                
                const ctx = document.getElementById('aggregateChart').getContext('2d');
                aggChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [
                            { label: 'کل کاربران', data: data.dataTotal, borderColor: '#10b981', borderWidth: 3, tension: 0.4, spanGaps: true },
                            { label: 'همراه اول', data: data.dataMci, borderColor: '#3b82f6', borderWidth: 1.5, tension: 0.4, spanGaps: true },
                            { label: 'ایرانسل', data: data.dataIrancell, borderColor: '#f59e0b', borderWidth: 1.5, tension: 0.4, spanGaps: true },
                            { label: 'مخابرات', data: data.dataTci, borderColor: '#8b5cf6', borderWidth: 1.5, tension: 0.4, spanGaps: true },
                            { label: 'سایر', data: data.dataOther, borderColor: '#64748b', borderWidth: 1, tension: 0.4, spanGaps: true }
                        ]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { family: 'Vazirmatn' } } } },
                        scales: {
                            x: { ticks: { color: '#9ca3af', maxTicksLimit: 8 }, grid: { display: false } },
                            y: { min: 0, max: 100, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                        }
                    }
                });
            } catch (e) { console.log("Error drawing chart:", e); }
        }

        async function sendDataToBot(score, results) {
            try {
                const geoRes = await fetch('/api/myip');
                const geo = await geoRes.json();
                await fetch(BOT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isp: geo.isp, freedomScore: score, results: results })
                });
            } catch (e) {}
        }

        async function fetchIPs() {
            const fetch4 = fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>d.ip).catch(()=>'نامشخص');
            const fetch6 = fetch('https://api6.ipify.org?format=json').then(r=>r.json()).then(d=>d.ip).catch(()=>'نامشخص');
            const fetchGeo = fetch('/api/myip').then(r=>r.json()).catch(()=>({}));
            
            const [ip4, ip6, geo] = await Promise.all([fetch4, fetch6, fetchGeo]);
            document.getElementById('ipv4-val').textContent = ip4;
            document.getElementById('ipv6-val').textContent = ip6;
            document.getElementById('user-country').textContent = geo.country || 'نامشخص';
            document.getElementById('user-city').textContent = geo.city || 'نامشخص';
        }

        window.onload = () => { 
            fetchAndDrawAggregateChart();
            runTests(); 
            setInterval(() => {
                runTests();
                fetchAndDrawAggregateChart();
            }, 120000);
        };
    </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
