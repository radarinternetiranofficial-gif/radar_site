export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==================== 1. سرو کردن فایل Manifest (شناسنامه اپلیکیشن) ====================
    if (url.pathname === '/manifest.json') {
      const manifest = {
        name: "رادار اینترنت ایران",
        short_name: "رادار",
        description: "زیرساخت هوشمند پایش داده‌های شبکه",
        start_url: "/",
        display: "standalone", // حالت اپلیکیشن (بدون نوار آدرس مرورگر)
        background_color: "#0b1120",
        theme_color: "#10b981", // رنگ سبز رادار
        icons: [
          {
            src: "https://cdn-icons-png.flaticon.com/512/2933/2933942.png", // آیکون موقت (پیشنهاد می‌کنم بعداً لوگوی خودت رو بذاری)
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      };
      return new Response(JSON.stringify(manifest), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ==================== 2. سرو کردن فایل Service Worker (موتور اپلیکیشن) ====================
    if (url.pathname === '/sw.js') {
      const swContent = `
        const CACHE_NAME = 'radar-cache-v1';
        self.addEventListener('install', (event) => {
          self.skipWaiting();
        });
        self.addEventListener('activate', (event) => {
          event.waitUntil(clients.claim());
        });
        self.addEventListener('fetch', (event) => {
          // استراتژی ساده: اگر اینترنت قطع بود، از کش بخون
          event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
          );
        });
      `;
      return new Response(swContent, {
        headers: { "Content-Type": "application/javascript" }
      });
    }

    // ==================== 3. کدهای HTML سایت ====================
    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <!-- ⚠️ تگ تایید گوگل را دقیقاً اینجا قرار دهید -->
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>رادار اینترنت ایران | زیرساخت هوشمند پایش داده‌های شبکه</title>
    <meta name="description" content="رادار اینترنت ایران، زیرساخت مستقل و رسمی برای تحلیل، پایش لحظه‌ای کیفیت، سانسور و اختلالات اینترنت بر پایه داده‌های OONI، RIPE و Cloudflare Radar.">
    
    <!-- 👇 تگ‌های لازم برای تبدیل شدن به اپلیکیشن (PWA) 👇 -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#10b981">
    <!-- پشتیبانی از سیستم عامل iOS (آیفون) -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="رادار">
    <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2933/2933942.png">
    <!-- 👆 --------------------------------------- 👆 -->

    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #0b1120;
            --card-bg: rgba(30, 41, 59, 0.4);
            --text: #f8fafc;
            --muted: #94a3b8;
            --green: #10b981;
            --blue: #3b82f6;
            --gold: #f59e0b;
            --insta: #e1306c;
            --border: rgba(255, 255, 255, 0.08);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            background-color: var(--bg); 
            color: var(--text); 
            line-height: 1.8; 
            overflow-x: hidden; 
            width: 100%;
            background-image: 
                radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.12) 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.12) 0%, transparent 40%);
            background-attachment: fixed;
        }

        a { text-decoration: none; color: inherit; }

        /* هدر */
        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 15px; background: rgba(11, 17, 32, 0.85);
            backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100;
            border-bottom: 1px solid var(--border);
        }
        .logo { font-size: 1.1rem; font-weight: 800; color: var(--green); display: flex; align-items: center; gap: 8px; }
        .header-btn { padding: 6px 12px; font-size: 0.8rem; }

        /* بخش معرفی */
        .hero { text-align: center; padding: 70px 15px 50px; display: flex; flex-direction: column; align-items: center; }
        
        .badge {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: var(--green);
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 0.85rem;
            margin-bottom: 25px;
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        }
        
        .hero p { color: #cbd5e1; font-size: 1.05rem; margin: 0 auto 30px; max-width: 650px; text-align: center; line-height: 1.9; }

        /* دکمه‌ها */
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px; 
            padding: 12px 25px; border-radius: 12px; font-weight: bold; font-size: 1rem; 
            transition: all 0.3s ease; cursor: pointer; border: none; width: 100%; margin-bottom: 10px;
        }
        .btn-telegram { background: var(--blue); color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .btn-telegram:active { background: #2563eb; transform: scale(0.98); }
        .btn-insta { background: var(--insta); color: #fff; box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3); }
        .btn-insta:active { background: #c13584; transform: scale(0.98); }
        .btn-outline { background: rgba(11, 17, 32, 0.5); border: 1px solid var(--green); color: var(--green); }
        .btn-outline:active { background: rgba(16, 185, 129, 0.1); }
        
        /* دکمه ویژه API */
        .btn-api { 
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05)); 
            border: 1px solid var(--gold); color: var(--gold); 
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.1);
        }
        .btn-api:active { background: rgba(245, 158, 11, 0.25); }

        /* بخش‌ها */
        .section-box { padding: 30px 15px; max-width: 800px; margin: 0 auto; }
        .section-title { text-align: center; margin-bottom: 10px; font-size: 1.5rem; color: var(--text); font-weight: 800; }
        .section-subtitle { text-align: center; color: var(--muted); margin-bottom: 30px; font-size: 0.9rem; }

        /* کارت‌ها */
        .card {
            background: var(--card-bg); backdrop-filter: blur(10px);
            padding: 24px; border-radius: 16px; border: 1px solid var(--border);
            margin-bottom: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transition: border-color 0.3s ease;
        }
        .card p { color: #cbd5e1; font-size: 0.95rem; text-align: justify; margin-bottom: 15px; }
        .card strong { color: var(--green); }

        /* منابع داده */
        .source-card {
            background: rgba(11, 17, 32, 0.6); padding: 15px; border-radius: 12px;
            border: 1px solid var(--border); border-right: 3px solid var(--blue);
            margin-bottom: 10px;
        }
        .source-card h4 { color: var(--blue); margin-bottom: 5px; font-size: 1rem; display: flex; align-items: center; gap: 8px;}
        .source-card p { font-size: 0.85rem; color: var(--muted); margin-bottom: 0; text-align: right; }

        /* راهنمای ربات */
        .guide-step {
            display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px;
            background: rgba(59, 130, 246, 0.08); padding: 14px; border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.15);
        }
        .step-num {
            background: var(--blue); color: white; width: 26px; height: 26px; 
            border-radius: 50%; display: flex; justify-content: center; align-items: center;
            font-size: 0.85rem; font-weight: bold; flex-shrink: 0;
        }
        .guide-step p { margin-bottom: 0; font-size: 0.9rem; text-align: justify; }

        /* فوتر و کپی‌رایت شیک */
        footer { text-align: center; padding: 40px 20px 30px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); background: rgba(11, 17, 32, 0.6); margin-top: 40px; }
        
        .footer-note { 
            color: #64748b; 
            font-size: 0.85rem; 
            margin: 20px auto 0; 
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            max-width: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            line-height: 1.6;
        }
        .footer-note i { color: var(--muted); font-size: 1rem; }

        /* ریسپانسیو */
        @media (min-width: 768px) {
            .hero { padding: 100px 20px 70px; }
            .section-box { padding: 50px 20px; }
            .btn { width: auto; min-width: 250px; }
            .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .sources-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        }
    </style>
</head>
<body>

    <!-- هدر -->
    <header>
        <div class="logo"><i class="fa-solid fa-satellite-dish"></i> رادار اینترنت ایران</div>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram header-btn">ورود به ربات</a>
    </header>

    <!-- معرفی -->
    <section class="hero">
        <div class="badge"><i class="fa-solid fa-circle-check"></i> اپلیکیشن رسمی و مستقل پایش داده</div>
        <p>پلتفرم «رادار اینترنت ایران» با پردازش لحظه‌ای داده‌های دریافتی از منابع معتبر جهانی، وضعیت کیفیت، اختلالات و سانسور شبکه را به صورت دقیق تحلیل و در اختیار شما قرار می‌دهد.</p>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-brands fa-telegram"></i> آغاز به کار در تلگرام</a>
    </section>

    <!-- راهنما -->
    <section class="section-box">
        <h2 class="section-title">راهنمای اتصال به ربات</h2>
        <p class="section-subtitle">برای دریافت گزارش‌های زنده، مراحل زیر را دنبال نمایید:</p>
        
        <div class="card">
            <div class="guide-step">
                <div class="step-num">۱</div>
                <p>در پیام‌رسان <b>تلگرام</b>، عبارت <code>@radarinternetiran</code> را جستجو کرده و به <b>کانال رسمی</b> بپیوندید.</p>
            </div>
            <div class="guide-step">
                <div class="step-num">۲</div>
                <p>در صفحه کانال، به <b>پیام‌های سنجاق شده (Pinned Message)</b> مراجعه کنید.</p>
            </div>
            <div class="guide-step">
                <div class="step-num">۳</div>
                <p>با کلیک روی لینک موجود، وارد ربات شوید و دستور <b>/start</b> را ارسال کنید.</p>
            </div>
            <p style="text-align:center; margin-top: 15px; font-size: 0.9rem;">
                <i class="fa-brands fa-instagram" style="color:var(--insta)"></i> 
                ما را در اینستاگرام با آیدی 
                <a href="https://instagram.com/radar.internet.iran.official" target="_blank" style="color:var(--insta); font-weight:bold;">radar.internet.iran.official</a> 
                دنبال کنید.
            </p>
        </div>
    </section>

    <!-- درباره ما -->
    <section class="section-box">
        <h2 class="section-title">منابع استخراج داده</h2>
        <div class="card">
            <p><strong>رادار اینترنت ایران</strong> با بهره‌گیری از الگوریتم‌های پردازش موازی و اتصال به منابع علمی، اطلاعات جامعی را بدون هیچ‌گونه سوگیری در اختیار کاربران قرار می‌دهد.</p>
            
            <div class="sources-grid">
                <div class="source-card">
                    <h4><i class="fa-solid fa-shield-halved"></i> پروژه OONI</h4>
                    <p>شناسایی دقیق سانسور، فیلترینگ و دستکاری بسته‌های شبکه.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-route"></i> شبکه RIPE</h4>
                    <p>پایش پایداری مسیریابی و بررسی وضعیت Visibility شبکه‌ها.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-cloud"></i> Cloudflare Radar</h4>
                    <p>تحلیل ترافیک، اندازه‌گیری تاخیر (Latency) و پهنای باند.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-satellite"></i> پینگ مستقیم</h4>
                    <p>ارسال لحظه‌ای بسته‌های داده برای سنجش دقیق دسترسی‌پذیری.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- امکانات -->
    <section class="section-box">
        <h2 class="section-title">قابلیت‌های کلیدی سامانه</h2>
        <div class="cards-grid">
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-chart-pie"></i> نمودارهای زنده</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">روند ۷ روزه، آمار ۲۴ ساعته و نقشه حرارتی استانی.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-magnifying-glass-chart"></i> تحلیل سانسور</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">شناسایی سایت‌های مسدود و تست تحریم سرویس‌ها.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-gamepad"></i> گیمیفیکیشن</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">کسب امتیاز، ارتقای سطح و رقابت در لیگ کاربران.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-trophy"></i> تالار افتخارات</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">رقابت هفتگی برای حضور در تالار افتخارات رادار.</p>
            </div>
        </div>
    </section>

    <!-- API خصوصی -->
    <section class="section-box">
        <h2 class="section-title" style="color: var(--gold);"><i class="fa-solid fa-code"></i> API اختصاصی</h2>
        <div class="card" style="border-color: rgba(245, 158, 11, 0.3); background: linear-gradient(180deg, rgba(30, 41, 59, 0.6), rgba(245, 158, 11, 0.05));">
            <p>داده‌های خام و تحلیل‌شده رادار از طریق یک <b>API اختصاصی</b> در اختیار توسعه‌دهندگان و کسب‌وکارها قرار می‌گیرد.</p>
            
            <div style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 8px; border-right: 3px solid var(--gold); margin-bottom: 15px;">
                <p style="margin:0; font-size:0.85rem; color: var(--gold);">
                    <i class="fa-solid fa-handshake"></i> <b>شرط استفاده:</b> دریافت‌کنندگان موظفند در سرویس خود، عبارت <b>«رادار اینترنت ایران»</b> را به عنوان <b>اسپانسر داده و منبع رسمی</b> معرفی کنند.
                </p>
            </div>
            <a href="https://t.me/Adddddddm" target="_blank" class="btn btn-api"><i class="fa-solid fa-paper-plane"></i> درخواست کلید API</a>
        </div>
    </section>

    <!-- ارتباط با ما -->
    <section class="section-box">
        <h2 class="section-title">ارتباط با ما</h2>
        <a href="https://t.me/radarinternetiran" target="_blank" class="btn btn-telegram" style="background: #229ED9;"><i class="fa-brands fa-telegram"></i> کانال رسمی تلگرام</a>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-solid fa-robot"></i> ربات تلگرام</a>
        <a href="https://instagram.com/radar.internet.iran.official" target="_blank" class="btn btn-insta"><i class="fa-brands fa-instagram"></i> صفحه رسمی اینستاگرام</a>
        <a href="https://t.me/radarinternetirangruop" target="_blank" class="btn btn-outline"><i class="fa-solid fa-users"></i> گروه پشتیبانی کاربران</a>
    </section>

    <!-- فوتر -->
    <footer>
        <p>© <span id="year">2026</span> رادار اینترنت ایران | تمامی حقوق محفوظ است.</p>
        <div class="footer-note">
            <i class="fa-solid fa-lock"></i>
            <span>هرگونه کپی‌برداری از داده‌ها، آمار و طراحی این سامانه بدون ذکر منبع ممنوع بوده و پیگرد قانونی دارد.</span>
        </div>
    </footer>

    <script>
        document.getElementById('year').textContent = new Date().getFullYear();
        
        // ثبت Service Worker برای فعال شدن قابلیت نصب
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed: ', err));
            });
        }
    </script>
</body>
</html>
    `;

    // ==================== Return HTML ====================
    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
