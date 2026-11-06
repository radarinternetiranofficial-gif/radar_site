export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==================== 1. API for Client IP & Location ====================
    if (url.pathname === '/api/myip') {
      const clientIP = request.headers.get('CF-Connecting-IP') || "نامشخص";
      const country = request.cf?.country || "نامشخص";
      const city = request.cf?.city || "نامشخص";
      return new Response(JSON.stringify({ ip: clientIP, country, city }), {
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    // ==================== 2. API for Ads Request Form ====================
    if (url.pathname === '/api/ads_request' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { fname, lname, business, phone, reqType, desc } = body;
        
        const msg = `📢 <b>درخواست جدید (${reqType}) از سایت</b>\n\n👤 نام و نام خانوادگی: <b>${fname} ${lname}</b>\n💼 حوزه کاری/برند: ${business}\n📞 شماره تماس: <code>${phone}</code>\n\n📝 <b>توضیحات:</b>\n<i>${desc || "توضیحی ارائه نشده است."}</i>\n\n⏰ زمان ثبت: ${new Date().toLocaleString('fa-IR')}`;
        
        const ADMIN_IDS = ["8344700031", "7652496428"];
        let sent = false;
        for (const adminId of ADMIN_IDS) {
          const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: adminId, text: msg, parse_mode: 'HTML' })
          });
          if (res.ok) sent = true;
        }
        
        if (sent) {
          return new Response(JSON.stringify({ ok: true, message: "درخواست با موفقیت ارسال شد" }), {
            headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
          });
        } else {
          throw new Error("خطا در ارتباط با تلگرام");
        }
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
          status: 500, headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // ==================== 3. Main HTML Dashboard ====================
    const today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta name="google-site-verification" content="Oskdq7_86up9xROsMJqIpKZ_cTczPZ5ZCNroOT-bnCc" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <title>رادار اینترنت ایران | داشبورد زنده وضعیت شبکه</title>
    <meta name="description" content="رادار اینترنت ایران، سامانه رسمی و هوشمند پایش آنلاین شبکه. مشاهده وضعیت قطعی، فیلترینگ، آی‌پی و درخواست اسپانسری.">
    
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #030712;
            --surface: rgba(17, 24, 39, 0.7);
            --text: #f9fafb;
            --muted: #9ca3af;
            --primary: #10b981;
            --blue: #3b82f6;
            --gold: #f59e0b;
            --border: rgba(255, 255, 255, 0.08);
            --sidebar-width: 260px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        body { background-color: var(--bg); color: var(--text); line-height: 1.8; overflow-x: hidden; display: flex; height: 100vh; background-image: radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.1), transparent 40%); background-attachment: fixed; }
        a { text-decoration: none; color: inherit; transition: 0.3s; }

        /* چراغ چشمک زن */
        .live-dot { display: inline-block; width: 10px; height: 10px; background-color: var(--primary); border-radius: 50%; margin-left: 8px; box-shadow: 0 0 10px var(--primary); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

        /* سایدبار */
        .sidebar { width: var(--sidebar-width); background: rgba(3, 7, 18, 0.95); backdrop-filter: blur(20px); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; position: fixed; top: 0; right: 0; height: 100vh; z-index: 1000; transition: 0.3s; }
        .logo { font-size: 1.3rem; font-weight: 900; display: flex; align-items: center; gap: 10px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .logo i { color: var(--primary); font-size: 1.6rem; }
        
        .nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 12px; color: var(--muted); font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .nav-item.active { background: rgba(16, 185, 129, 0.1); color: var(--primary); border-right: 3px solid var(--primary); }
        .nav-item i { width: 20px; text-align: center; font-size: 1.1rem; }

        .sidebar-footer { padding-top: 20px; border-top: 1px solid var(--border); text-align: center; }
        .btn-tg { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: var(--blue); color: #fff; border-radius: 10px; font-weight: bold; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); border: none; cursor: pointer; }
        .btn-tg:hover { background: #2563eb; transform: translateY(-2px); }

        /* محتوا */
        .main-content { flex: 1; margin-right: var(--sidebar-width); padding: 40px; overflow-y: auto; height: 100vh; display: flex; flex-direction: column; }
        .tab-content { display: none; animation: fadeIn 0.4s ease; flex: 1; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-header { margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 2rem; font-weight: 900; margin-bottom: 10px; }
        .page-header p { color: var(--muted); font-size: 1rem; display: flex; align-items: center; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: var(--surface); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 25px; transition: 0.3s; }
        .card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-3px); }

        /* فرم تبلیغات */
        .info-box { background: rgba(245, 158, 11, 0.05); border-right: 4px solid var(--gold); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: justify; }
        .info-box h3 { color: var(--gold); margin-bottom: 10px; font-size: 1.2rem; }
        .info-box p { color: var(--muted); font-size: 0.95rem; line-height: 1.9; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 0.9rem; font-weight: 600; }
        .form-control { width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: inherit; font-size: 1rem; transition: 0.3s; }
        .form-control:focus { outline: none; border-color: var(--primary); background: rgba(16, 185, 129, 0.05); }
        select.form-control { appearance: none; cursor: pointer; }
        textarea.form-control { resize: vertical; min-height: 100px; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .btn-submit { width: 100%; padding: 15px; background: var(--primary); color: #000; font-weight: bold; font-size: 1.1rem; border: none; border-radius: 10px; cursor: pointer; transition: 0.3s; margin-top: 10px; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-submit:hover { background: #059669; }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .alert { padding: 15px; border-radius: 10px; margin-bottom: 20px; display: none; font-weight: 600; text-align: center; }
        .alert-success { background: rgba(16, 185, 129, 0.1); color: var(--primary); border: 1px solid var(--primary); }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; }

        /* ابزار آی‌پی (طراحی جدید) */
        .ip-container { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 30px 15px; }
        .ip-icon { font-size: 3rem; color: var(--primary); margin-bottom: 15px; }
        
        .ip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; max-width: 600px; margin: 20px 0; }
        
        .ip-card {
            background: rgba(0,0,0,0.3); border: 1px dashed var(--border); border-radius: 12px;
            padding: 15px; cursor: pointer; transition: 0.3s; text-align: center; position: relative;
        }
        .ip-card:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); }
        .ip-card.copied { border-color: var(--primary); background: rgba(16, 185, 129, 0.1); }
        
        .ip-title { font-size: 0.85rem; color: var(--muted); margin-bottom: 5px; font-weight: bold; letter-spacing: 1px; }
        .ip-value { font-size: 1.1rem; font-weight: 800; color: var(--text); word-break: break-all; direction: ltr; }
        
        .ip-details { display: flex; gap: 15px; justify-content: center; margin-top: 15px; flex-wrap: wrap; }
        .ip-badge { background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 8px 15px; border-radius: 50px; font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 8px; }
        
        .spinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* فوتر */
        .main-footer { border-top: 1px solid var(--border); padding-top: 20px; margin-top: auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; color: var(--muted); font-size: 0.85rem; }
        .footer-socials { display: flex; gap: 10px; }
        .footer-socials a { width: 35px; height: 35px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .footer-socials a:hover { background: var(--primary); color: #000; }

        /* موبایل */
        @media (max-width: 900px) {
            body { flex-direction: column; }
            .sidebar { width: 100%; height: 70px; top: auto; bottom: 0; right: 0; flex-direction: row; border-left: none; border-top: 1px solid var(--border); padding: 0 10px; justify-content: space-around; align-items: center; }
            .logo, .sidebar-footer { display: none; }
            .nav-menu { flex-direction: row; justify-content: space-around; width: 100%; gap: 0; }
            .nav-item { flex-direction: column; padding: 8px; font-size: 0.75rem; gap: 4px; border-right: none; border-radius: 8px; }
            .nav-item.active { border-right: none; border-bottom: 3px solid var(--primary); border-radius: 8px 8px 0 0; }
            .nav-item i { font-size: 1.3rem; }
            .main-content { margin-right: 0; padding: 20px; height: calc(100vh - 70px); padding-bottom: 90px; }
            .grid-2, .form-row, .ip-grid { grid-template-columns: 1fr; }
            .page-header h1 { font-size: 1.6rem; }
            .page-header { flex-direction: column; align-items: flex-start; gap: 10px; }
            .main-footer { flex-direction: column; text-align: center; }
        }
    </style>
</head>
<body>

    <!-- منوی کناری -->
    <aside class="sidebar">
        <div class="logo"><i class="fa-solid fa-satellite-dish"></i> رادار ایران</div>
        <div class="nav-menu">
            <div class="nav-item active" onclick="switchTab('dashboard', this)"><i class="fa-solid fa-chart-pie"></i> داشبورد</div>
            <div class="nav-item" onclick="switchTab('ip-tool', this)"><i class="fa-solid fa-network-wired"></i> آی‌پی من</div>
            <div class="nav-item" onclick="switchTab('ads', this)"><i class="fa-solid fa-bullhorn"></i> درخواست اسپانسری</div>
            <div class="nav-item" onclick="switchTab('api', this)"><i class="fa-solid fa-code"></i> API</div>
        </div>
        <div class="sidebar-footer">
            <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn-tg"><i class="fa-brands fa-telegram"></i> ورود به ربات</a>
        </div>
    </aside>

    <!-- محتوای اصلی -->
    <main class="main-content">
        
        <!-- تب 1: داشبورد -->
        <div id="dashboard" class="tab-content active">
            <div class="page-header">
                <div>
                    <h1>داشبورد وضعیت شبکه</h1>
                    <p><span class="live-dot"></span> سیستم پایش زنده فعال است • بروزرسانی: ${today}</p>
                </div>
            </div>
            
            <div class="grid-2" style="margin-bottom: 20px;">
                <div class="card" style="text-align: center;">
                    <h3 style="color: var(--muted); font-size: 0.9rem; margin-bottom: 10px;"><i class="fa-solid fa-wifi"></i> وضعیت کلی شبکه</h3>
                    <div style="font-size: 1.8rem; font-weight: 900; color: var(--primary);">پایدار</div>
                </div>
                <div class="card" style="text-align: center;">
                    <h3 style="color: var(--muted); font-size: 0.9rem; margin-bottom: 10px;"><i class="fa-solid fa-shield-halved"></i> سطح فیلترینگ</h3>
                    <div style="font-size: 1.8rem; font-weight: 900; color: var(--gold);">متوسط</div>
                </div>
            </div>
            
            <div class="card" style="text-align: center; padding: 40px 20px;">
                <h2 style="font-size: 1.5rem; margin-bottom: 15px;">گزارش کامل در تلگرام</h2>
                <p style="color: var(--muted); margin-bottom: 25px;">برای مشاهده نمودارهای زنده، نقشه حرارتی و تست سرعت، وارد ربات شوید.</p>
                <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn-tg" style="display: inline-flex; width: auto; padding: 12px 30px;"><i class="fa-brands fa-telegram"></i> دریافت گزارش از ربات</a>
            </div>
        </div>

        <!-- تب 2: ابزار آی‌پی -->
        <div id="ip-tool" class="tab-content">
            <div class="page-header">
                <div>
                    <h1>ابزار تشخیص آی‌پی</h1>
                    <p>آی‌پی و موقعیت جغرافیایی شما بر اساس اتصال به شبکه.</p>
                </div>
            </div>
            <div class="card ip-container">
                <div class="ip-icon"><i class="fa-solid fa-globe"></i></div>
                <h3 style="color: var(--muted);">آی‌پی‌های فعلی شما</h3>
                <p style="color: var(--muted); font-size: 0.85rem; margin-top: 5px;">برای کپی، روی هر کدام کلیک کنید.</p>
                
                <div id="ip-loading">
                    <div class="spinner"></div>
                    <p style="color: var(--muted); font-size: 0.9rem;">در حال دریافت اطلاعات...</p>
                </div>
                
                <div id="ip-result" style="display: none; width: 100%;">
                    
                    <div class="ip-grid">
                        <!-- کارت IPv4 -->
                        <div class="ip-card" id="card-ipv4" onclick="copyText('ipv4-val', 'card-ipv4')">
                            <div class="ip-title">IPv4</div>
                            <div class="ip-value" id="ipv4-val">دریافت...</div>
                        </div>
                        
                        <!-- کارت IPv6 -->
                        <div class="ip-card" id="card-ipv6" onclick="copyText('ipv6-val', 'card-ipv6')">
                            <div class="ip-title">IPv6</div>
                            <div class="ip-value" id="ipv6-val">دریافت...</div>
                        </div>
                    </div>

                    <div class="ip-details">
                        <div class="ip-badge"><i class="fa-solid fa-flag"></i> کشور: <span id="user-country" style="color: var(--text); font-weight: bold; margin-right: 5px;">---</span></div>
                        <div class="ip-badge"><i class="fa-solid fa-location-dot"></i> شهر: <span id="user-city" style="color: var(--text); font-weight: bold; margin-right: 5px;">---</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- تب 3: درخواست اسپانسری -->
        <div id="ads" class="tab-content">
            <div class="page-header">
                <div>
                    <h1>فرصت‌های همکاری و اسپانسری</h1>
                    <p>برند خود را به هزاران کاربر فعال و متخصص در حوزه فناوری معرفی کنید.</p>
                </div>
            </div>
            
            <div class="card" style="max-width: 650px; margin: 0 auto;">
                
                <div class="info-box">
                    <h3><i class="fa-solid fa-handshake"></i> چرا با رادار اینترنت ایران همکاری کنیم؟</h3>
                    <p>پلتفرم «رادار اینترنت ایران» با ارائه داده‌های دقیق و لحظه‌ای از وضعیت شبکه، مخاطبان خاص و ارزشمندی را جذب کرده است. با همکاری با ما، می‌توانید برند خود را در معرض دید این جامعه هدف قرار دهید. ما دو نوع همکاری ارائه می‌دهیم: <b>تبلیغات (درج بنر/پست)</b> و <b>اسپانسری (همکاری داده‌ای و مالی)</b>.</p>
                </div>

                <div id="form-alert" class="alert"></div>
                
                <form id="ads-form" onsubmit="submitAds(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>نام</label>
                            <input type="text" id="fname" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>نام خانوادگی</label>
                            <input type="text" id="lname" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>حوزه کاری / نام برند</label>
                        <input type="text" id="business" class="form-control" placeholder="مثال: فروشگاه لوازم دیجیتال" required>
                    </div>
                    <div class="form-group">
                        <label>شماره تماس</label>
                        <input type="tel" id="phone" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label>نوع درخواست</label>
                        <select id="reqType" class="form-control" required>
                            <option value="تبلیغات (درج بنر/پست)">تبلیغات (درج بنر/پست)</option>
                            <option value="اسپانسری (همکاری داده‌ای/مالی)">اسپانسری (همکاری داده‌ای/مالی)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>توضیحات بیشتر (اختیاری)</label>
                        <textarea id="desc" class="form-control" placeholder="لطفاً در صورت نیاز، درباره کسب‌وکار و نوع همکاری مورد نظر خود توضیح دهید..."></textarea>
                    </div>
                    
                    <button type="submit" id="submit-btn" class="btn-submit">
                        <i class="fa-solid fa-paper-plane"></i> ارسال درخواست
                    </button>
                </form>
            </div>
        </div>

        <!-- تب 4: API -->
        <div id="api" class="tab-content">
            <div class="page-header">
                <div>
                    <h1>API اختصاصی</h1>
                    <p>دسترسی توسعه‌دهندگان به داده‌های خام رادار.</p>
                </div>
            </div>
            <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(245, 158, 11, 0.05)); border-color: rgba(245, 158, 11, 0.3);">
                <h3 style="color: var(--gold); margin-bottom: 15px;"><i class="fa-solid fa-handshake"></i> شرایط همکاری</h3>
                <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.8;">
                    داده‌های تحلیل‌شده رادار (JSON) در اختیار استارتاپ‌ها و محققان قرار می‌گیرد. 
                    <br><br>
                    <b>شرط استفاده:</b> دریافت‌کنندگان موظفند در سرویس خود، عبارت <b>«رادار اینترنت ایران»</b> را به عنوان اسپانسر داده و منبع رسمی معرفی کنند.
                </p>
                <a href="https://t.me/Adddddddm" target="_blank" class="btn-tg" style="background: var(--gold); color: #000; margin-top: 20px; display: inline-flex; width: auto;">
                    <i class="fa-solid fa-paper-plane"></i> درخواست کلید API
                </a>
            </div>
        </div>

        <!-- فوتر -->
        <footer class="main-footer">
            <div class="footer-socials">
                <a href="https://t.me/radarinternetiran" target="_blank" title="کانال تلگرام"><i class="fa-brands fa-telegram"></i></a>
                <a href="https://instagram.com/radar.internet.iran.official" target="_blank" title="اینستاگرام"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://t.me/radarinternetirangruop" target="_blank" title="گروه پشتیبانی"><i class="fa-solid fa-users"></i></a>
            </div>
            <div>
                © <span id="year"></span> رادار اینترنت ایران. تمامی حقوق محفوظ است.
            </div>
        </footer>

    </main>

    <script>
        // تنظیم سال فوتر
        document.getElementById('year').textContent = new Date().getFullYear();

        // تغییر تب‌ها
        function switchTab(tabId, element) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            element.classList.add('active');
            if (tabId === 'ip-tool') { fetchClientIPs(); }
        }

        // دریافت همزمان IPv4، IPv6 و موقعیت مکانی
        async function fetchClientIPs() {
            const loading = document.getElementById('ip-loading');
            const result = document.getElementById('ip-result');
            loading.style.display = 'block';
            result.style.display = 'none';

            // دریافت IPv4 از api.ipify.org
            const fetchIpv4 = fetch('https://api.ipify.org?format=json')
                .then(r => r.json()).then(d => d.ip)
                .catch(() => 'نامشخص');
            
            // دریافت IPv6 از api6.ipify.org
            const fetchIpv6 = fetch('https://api6.ipify.org?format=json')
                .then(r => r.json()).then(d => d.ip)
                .catch(() => 'نامشخص');
            
            // دریافت موقعیت مکانی از سرور خودمان
            const fetchGeo = fetch('/api/myip')
                .then(r => r.json())
                .catch(() => ({}));

            try {
                // اجرای همزمان هر سه درخواست
                const [ipv4, ipv6, geo] = await Promise.all([fetchIpv4, fetchIpv6, fetchGeo]);

                document.getElementById('ipv4-val').textContent = ipv4;
                document.getElementById('ipv6-val').textContent = ipv6;
                
                document.getElementById('user-country').textContent = geo.country || 'نامشخص';
                document.getElementById('user-city').textContent = geo.city || 'نامشخص';

                loading.style.display = 'none';
                result.style.display = 'block';
            } catch (error) {
                loading.innerHTML = '<p style="color: #ef4444;">خطا در دریافت اطلاعات.</p>';
            }
        }

        // کپی کردن متن (با گرفتن آیدی متن و آیدی کارت)
        function copyText(textId, cardId) {
            const textToCopy = document.getElementById(textId).innerText;
            const card = document.getElementById(cardId);
            
            if (textToCopy && textToCopy !== 'دریافت...' && textToCopy !== 'نامشخص') {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // افکت بصری
                    card.classList.add('copied');
                    const originalText = document.getElementById(textId).innerText;
                    document.getElementById(textId).innerText = 'کپی شد ✅';
                    
                    setTimeout(() => {
                        card.classList.remove('copied');
                        document.getElementById(textId).innerText = originalText;
                    }, 1500);
                });
            }
        }

        // ارسال فرم تبلیغات
        async function submitAds(e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const alertBox = document.getElementById('form-alert');
            
            const fname = document.getElementById('fname').value.trim();
            const lname = document.getElementById('lname').value.trim();
            const business = document.getElementById('business').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const reqType = document.getElementById('reqType').value;
            const desc = document.getElementById('desc').value.trim();

            if(!fname || !lname || !business || !phone) return;

            btn.disabled = true;
            btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;"></div> در حال ارسال...';
            alertBox.style.display = 'none';

            try {
                const response = await fetch('/api/ads_request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fname, lname, business, phone, reqType, desc })
                });
                
                const data = await response.json();

                if (data.ok) {
                    alertBox.className = 'alert alert-success';
                    alertBox.textContent = '✅ درخواست شما با موفقیت ثبت شد. تیم مدیریت به زودی با شما تماس خواهد گرفت.';
                    alertBox.style.display = 'block';
                    document.getElementById('ads-form').reset();
                } else {
                    throw new Error(data.error || 'خطای ناشناخته');
                }
            } catch (error) {
                alertBox.className = 'alert alert-error';
                alertBox.textContent = '❌ خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.';
                alertBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ارسال درخواست';
            }
        }
    </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
