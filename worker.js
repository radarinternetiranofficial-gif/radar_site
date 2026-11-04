export default {
  async fetch(request, env, ctx) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <!-- ⚠️ تگ تایید گوگل را دقیقاً اینجا قرار دهید -->
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>رادار اینترنت ایران | سامانه رسمی پایش شبکه و سانسور</title>
    <meta name="description" content="سامانه رسمی رادار اینترنت ایران، پایش لحظه‌ای کیفیت، سانسور و اختلالات اینترنت با استفاده از داده‌های OONI، RIPE و Cloudflare Radar.">
    <meta name="keywords" content="رادار اینترنت, اینترنت ایران, سانسور اینترنت, قطعی اینترنت, OONI, RIPE, کلادفلر, تست سرعت">
    
    <!-- فونت فارسی وزیرمتن -->
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    
    <!-- آیکون‌ها -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #0b1120;
            --card-bg: rgba(15, 23, 42, 0.85); /* شفافیت برای دیده شدن بک‌گراند */
            --text: #f8fafc;
            --muted: #94a3b8;
            --green: #10b981;
            --blue: #3b82f6;
            --red: #ef4444;
            --insta: #e1306c;
            --border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            background-color: var(--bg); 
            color: var(--text); 
            line-height: 1.8; 
            overflow-x: hidden; 
            width: 100%;
            /* بک‌گراند مقبره کوروش با لایه تاریک */
            background-image: linear-gradient(rgba(11, 17, 32, 0.92), rgba(11, 17, 32, 0.95)), url('https://images.unsplash.com/photo-1590075865069-46231681d2f2?q=80&w=2070&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
        }

        a { text-decoration: none; color: inherit; }

        /* هدر موبایل */
        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 15px; background: rgba(11, 17, 32, 0.9);
            backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100;
            border-bottom: 1px solid var(--border);
        }
        .logo { font-size: 1.1rem; font-weight: 800; color: var(--green); display: flex; align-items: center; gap: 8px; }
        .header-btn { padding: 6px 12px; font-size: 0.8rem; }

        /* بخش معرفی */
        .hero { text-align: center; padding: 50px 15px 40px; }
        .hero h1 { font-size: 1.8rem; margin-bottom: 15px; line-height: 1.4; }
        .hero p { color: var(--muted); font-size: 0.95rem; margin: 0 auto 25px; max-width: 100%; }

        /* دکمه‌ها */
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px; 
            padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 0.95rem; 
            transition: all 0.3s ease; cursor: pointer; border: none; width: 100%; margin-bottom: 10px;
        }
        .btn-telegram { background: var(--blue); color: #fff; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .btn-telegram:active { background: #2563eb; transform: scale(0.98); }
        .btn-insta { background: var(--insta); color: #fff; box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3); }
        .btn-insta:active { background: #c13584; transform: scale(0.98); }
        .btn-outline { background: rgba(11, 17, 32, 0.8); border: 1px solid var(--green); color: var(--green); }

        /* بخش‌ها */
        .section-box { padding: 30px 15px; max-width: 800px; margin: 0 auto; }
        .section-title { text-align: center; margin-bottom: 15px; font-size: 1.4rem; color: var(--text); }
        .section-subtitle { text-align: center; color: var(--muted); margin-bottom: 25px; font-size: 0.9rem; }

        /* کارت‌ها */
        .card {
            background: var(--card-bg); backdrop-filter: blur(10px);
            padding: 20px; border-radius: 15px; border: 1px solid var(--border);
            margin-bottom: 15px;
        }
        .card p { color: var(--text); font-size: 0.95rem; text-align: justify; margin-bottom: 15px; }
        .card strong { color: var(--green); }

        /* منابع داده */
        .source-card {
            background: rgba(11, 17, 32, 0.8); padding: 15px; border-radius: 10px;
            border: 1px solid var(--border); border-right: 3px solid var(--blue);
            margin-bottom: 10px;
        }
        .source-card h4 { color: var(--blue); margin-bottom: 5px; font-size: 1rem; display: flex; align-items: center; gap: 8px;}
        .source-card p { font-size: 0.85rem; color: var(--muted); margin-bottom: 0; }

        /* راهنمای ربات */
        .guide-step {
            display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px;
            background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 10px;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .step-num {
            background: var(--blue); color: white; width: 25px; height: 25px; 
            border-radius: 50%; display: flex; justify-content: center; align-items: center;
            font-size: 0.8rem; font-weight: bold; flex-shrink: 0;
        }
        .guide-step p { margin-bottom: 0; font-size: 0.9rem; }

        /* فوتر */
        footer { text-align: center; padding: 30px 15px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); background: rgba(11, 17, 32, 0.95); }
        .copyright-text { 
            color: #ef4444; font-weight: bold; font-size: 0.8rem; 
            margin: 15px auto 0; padding: 10px;
            border: 1px dashed rgba(239, 68, 68, 0.4); border-radius: 8px;
            background: rgba(239, 68, 68, 0.05);
        }

        /* ریسپانسیو برای دسکتاپ (اگر با لپ‌تاپ باز شد) */
        @media (min-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
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

    <!-- معرفی اصلی -->
    <section class="hero">
        <h1>چشم‌انداز زنده اینترنت ایران</h1>
        <p>سامانه رسمی پایش لحظه‌ای اختلالات، سانسور و کیفیت اینترنت. وضعیت شبکه را با استفاده از داده‌های معتبر جهانی به صورت دقیق و شفاف دنبال کنید.</p>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-brands fa-telegram"></i> شروع در تلگرام</a>
    </section>

    <!-- بخش راهنمای پیدا کردن ربات -->
    <section class="section-box">
        <h2 class="section-title">چگونه به ربات متصل شویم؟</h2>
        <p class="section-subtitle">برای دریافت گزارش‌های زنده و لحظه‌ای، طبق مراحل زیر عمل کنید:</p>
        
        <div class="card">
            <div class="guide-step">
                <div class="step-num">۱</div>
                <p>در پیام‌رسان <b>تلگرام</b>، عبارت <code>@radarinternetiran</code> را جستجو کنید و وارد <b>کانال رسمی</b> شوید.</p>
            </div>
            <div class="guide-step">
                <div class="step-num">۲</div>
                <p>در داخل کانال، به <b>پیام‌های سنجاق شده (Pinned Message)</b> مراجعه کنید.</p>
            </div>
            <div class="guide-step">
                <div class="step-num">۳</div>
                <p>با کلیک روی لینک موجود در پیام سنجاق شده، مستقیماً وارد ربات شوید و دکمه <b>/start</b> را بزنید.</p>
            </div>
            <p style="text-align:center; margin-top: 15px; font-size: 0.9rem;">
                <i class="fa-brands fa-instagram" style="color:var(--insta)"></i> 
                در اینستاگرام هم ما را با آیدی 
                <a href="https://instagram.com/radar.internet.iran.official" target="_blank" style="color:var(--insta); font-weight:bold;">radar.internet.iran.official</a> 
                دنبال کنید.
            </p>
        </div>
    </section>

    <!-- درباره ما و منابع -->
    <section class="section-box">
        <h2 class="section-title">درباره رادار و منابع داده</h2>
        <div class="card">
            <p><strong>رادار اینترنت ایران</strong> یک زیرساخت مستقل برای تحلیل و پایش وضعیت شبکه اینترنت کشور است. این سامانه با بهره‌گیری از الگوریتم‌های پیشرفته و اتصال به منابع معتبر بین‌المللی، اطلاعات جامعی را در اختیار کاربران قرار می‌دهد. هدف ما ایجاد شفافیت حداکثری در فضای شبکه است.</p>
            
            <div class="sources-grid">
                <div class="source-card">
                    <h4><i class="fa-solid fa-shield-halved"></i> پروژه OONI</h4>
                    <p>برای شناسایی دقیق سانسور، فیلترینگ و دستکاری بسته‌های شبکه.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-route"></i> شبکه RIPE</h4>
                    <p>برای پایش پایداری مسیریابی (Routing) و بررسی وضعیت Visibility شبکه‌ها.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-cloud"></i> Cloudflare Radar</h4>
                    <p>برای تحلیل ترافیک، اندازه‌گیری تاخیر (Latency) و پهنای باند.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-satellite"></i> پینگ مستقیم</h4>
                    <p>ارسال لحظه‌ای بسته‌های داده به سایت‌های داخلی و خارجی برای سنجش دسترسی‌پذیری.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- امکانات -->
    <section class="section-box">
        <h2 class="section-title">امکانات رادار</h2>
        <div class="cards-grid">
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-chart-pie"></i> نمودارهای زنده</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted);">روند ۷ روزه، آمار ۲۴ ساعته، نقشه حرارتی استانی و مقایسه اپراتورها.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-magnifying-glass-chart"></i> تحلیل سانسور</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted);">شناسایی سایت‌های مسدود و تست تحریم سرویس‌های خارجی (403/451).</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-gamepad"></i> سیستم گیمیفیکیشن</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted);">کسب امتیاز، ارتقای سطح و رقابت در لیگ کاربران رادار.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-code"></i> API عمومی</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted);">دسترسی توسعه‌دهندگان به داده‌های خام JSON برای ساخت سرویس‌های جدید.</p>
            </div>
        </div>
    </section>

    <!-- شبکه‌های اجتماعی -->
    <section class="section-box">
        <h2 class="section-title">ارتباط با ما</h2>
        <p class="section-subtitle">از طریق لینک‌های زیر با تیم ما در ارتباط باشید.</p>
        
        <a href="https://t.me/radarinternetiran" target="_blank" class="btn btn-telegram" style="background: #229ED9;"><i class="fa-brands fa-telegram"></i> کانال رسمی تلگرام</a>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-solid fa-robot"></i> ربات تلگرام</a>
        <a href="https://instagram.com/radar.internet.iran.official" target="_blank" class="btn btn-insta"><i class="fa-brands fa-instagram"></i> صفحه اینستاگرام</a>
        <a href="https://t.me/radarinternetirangruop" target="_blank" class="btn btn-outline"><i class="fa-solid fa-users"></i> گروه پشتیبانی</a>
    </section>

    <!-- فوتر -->
    <footer>
        <p>© <span id="year">2026</span> رادار اینترنت ایران | تمامی حقوق محفوظ است.</p>
        <div class="copyright-text">
            <i class="fa-solid fa-triangle-exclamation"></i>
            رسمی: هرگونه کپی برداری از سایت و داده‌ها بدون ذکر منبع ممنوع و پیگرد قانونی به همراه دارد.
        </div>
    </footer>

    <!-- اسکریپت تنظیم تاریخ -->
    <script>
        document.getElementById('year').textContent = new Date().getFullYear();
    </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
