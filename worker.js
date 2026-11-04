export default {
  async fetch(request, env, ctx) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <!-- ⚠️ تگ تایید گوگل را دقیقاً اینجا قرار دهید -->
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>رادار اینترنت ایران | زیرساخت هوشمند پایش داده‌های شبکه</title>
    <meta name="description" content="رادار اینترنت ایران، زیرساخت مستقل و رسمی برای تحلیل، پایش لحظه‌ای کیفیت، سانسور و اختلالات اینترنت بر پایه داده‌های OONI، RIPE و Cloudflare Radar.">
    <meta name="keywords" content="رادار اینترنت, اینترنت ایران, سانسور اینترنت, قطعی اینترنت, OONI, RIPE, کلادفلر, API شبکه">
    
    <!-- فونت فارسی وزیرمتن -->
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    
    <!-- آیکون‌ها -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #0b1120;
            --card-bg: rgba(15, 23, 42, 0.85);
            --text: #f8fafc;
            --muted: #94a3b8;
            --green: #10b981;
            --blue: #3b82f6;
            --gold: #f59e0b;
            --red: #ef4444;
            --insta: #e1306c;
            --border: rgba(255, 255, 255, 0.15);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            background-color: var(--bg); 
            color: var(--text); 
            line-height: 1.8; 
            overflow-x: hidden; 
            width: 100%;
            
            /* بک‌گراند مقبره کوروش با لایه تاریک ملایم (عکس از ویکی‌مدیا) */
            background-image: 
                linear-gradient(to bottom, rgba(11, 17, 32, 0.7), rgba(11, 17, 32, 0.95)),
                url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pasargad_Cyrus_Tomb.jpg/1280px-Pasargad_Cyrus_Tomb.jpg');
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
            /* حذف background-attachment: fixed برای جلوگیری از باگ در موبایل */
        }

        a { text-decoration: none; color: inherit; }

        /* هدر */
        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 15px; background: rgba(11, 17, 32, 0.95);
            backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100;
            border-bottom: 1px solid var(--border);
        }
        .logo { font-size: 1.1rem; font-weight: 800; color: var(--green); display: flex; align-items: center; gap: 8px; }
        .header-btn { padding: 6px 12px; font-size: 0.8rem; }

        /* بخش معرفی */
        .hero { text-align: center; padding: 60px 15px 40px; }
        .hero h1 { font-size: 1.8rem; margin-bottom: 15px; line-height: 1.4; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .hero p { color: #cbd5e1; font-size: 0.95rem; margin: 0 auto 25px; max-width: 100%; text-align: justify; text-align-last: center; text-shadow: 0 1px 5px rgba(0,0,0,0.8); }

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
        
        /* دکمه ویژه API */
        .btn-api { 
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2)); 
            border: 1px solid var(--gold); color: var(--gold); 
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
        }
        .btn-api:active { background: rgba(245, 158, 11, 0.3); }

        /* بخش‌ها */
        .section-box { padding: 30px 15px; max-width: 800px; margin: 0 auto; }
        .section-title { text-align: center; margin-bottom: 15px; font-size: 1.4rem; color: var(--text); font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .section-subtitle { text-align: center; color: #cbd5e1; margin-bottom: 25px; font-size: 0.9rem; text-shadow: 0 1px 5px rgba(0,0,0,0.8); }

        /* کارت‌ها */
        .card {
            background: var(--card-bg); backdrop-filter: blur(10px);
            padding: 20px; border-radius: 15px; border: 1px solid var(--border);
            margin-bottom: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
        .source-card p { font-size: 0.85rem; color: var(--muted); margin-bottom: 0; text-align: right; }

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
        .guide-step p { margin-bottom: 0; font-size: 0.9rem; text-align: justify; }

        /* فوتر */
        footer { text-align: center; padding: 30px 15px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--border); background: rgba(11, 17, 32, 0.95); }
        .copyright-text { 
            color: #ef4444; font-weight: bold; font-size: 0.8rem; 
            margin: 15px auto 0; padding: 10px;
            border: 1px dashed rgba(239, 68, 68, 0.4); border-radius: 8px;
            background: rgba(239, 68, 68, 0.05);
        }

        /* ریسپانسیو */
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
        <h1>زیرساخت هوشمند پایش داده‌های شبکه</h1>
        <p>سامانه رسمی «رادار اینترنت ایران» به عنوان یک پلتفرم مستقل و داده‌محور، با هدف ایجاد شفافیت در فضای شبکه کشور طراحی شده است. این سیستم با پردازش لحظه‌ای داده‌های دریافتی از منابع معتبر جهانی، وضعیت کیفیت، اختلالات و سانسور اینترنت را به صورت دقیق تحلیل و ارائه می‌کند.</p>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-brands fa-telegram"></i> آغاز به کار در تلگرام</a>
    </section>

    <!-- بخش راهنمای پیدا کردن ربات -->
    <section class="section-box">
        <h2 class="section-title">راهنمای اتصال به ربات</h2>
        <p class="section-subtitle">برای دریافت گزارش‌های زنده و لحظه‌ای، مراحل زیر را دنبال نمایید:</p>
        
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
                <p>با کلیک روی لینک موجود، مستقیماً وارد ربات رسمی شده و دستور <b>/start</b> را ارسال کنید.</p>
            </div>
            <p style="text-align:center; margin-top: 15px; font-size: 0.9rem;">
                <i class="fa-brands fa-instagram" style="color:var(--insta)"></i> 
                همچنین در اینستاگرام ما را با آیدی 
                <a href="https://instagram.com/radar.internet.iran.official" target="_blank" style="color:var(--insta); font-weight:bold;">radar.internet.iran.official</a> 
                دنبال کنید.
            </p>
        </div>
    </section>

    <!-- درباره ما و منابع -->
    <section class="section-box">
        <h2 class="section-title">درباره رادار و منابع استخراج داده</h2>
        <div class="card">
            <p><strong>رادار اینترنت ایران</strong> به عنوان یک نهاد داده‌محور، با بهره‌گیری از الگوریتم‌های پردازش موازی و اتصال به منابع علمی و بین‌المللی، اطلاعات جامعی را در اختیار کاربران، محققان و توسعه‌دهندگان قرار می‌دهد. تمامی داده‌ها بدون هیچ‌گونه سوگیری و صرفاً بر اساس مشاهدات واقعی شبکه پردازش می‌شوند.</p>
            
            <div class="sources-grid">
                <div class="source-card">
                    <h4><i class="fa-solid fa-shield-halved"></i> پروژه OONI</h4>
                    <p>برای شناسایی دقیق سانسور، فیلترینگ و دستکاری بسته‌های شبکه در سطح کشور.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-route"></i> شبکه RIPE</h4>
                    <p>برای پایش پایداری مسیریابی (Routing) و بررسی وضعیت Visibility شبکه‌های ایرانی.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-cloud"></i> Cloudflare Radar</h4>
                    <p>برای تحلیل ترافیک، اندازه‌گیری تاخیر (Latency)، جیتر و پهنای باند.</p>
                </div>
                <div class="source-card">
                    <h4><i class="fa-solid fa-satellite"></i> پینگ مستقیم (Direct Ping)</h4>
                    <p>ارسال لحظه‌ای بسته‌های داده به سایت‌های داخلی و خارجی برای سنجش دقیق دسترسی‌پذیری.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- امکانات -->
    <section class="section-box">
        <h2 class="section-title">قابلیت‌های کلیدی سامانه</h2>
        <div class="cards-grid">
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-chart-pie"></i> تحلیل و نمودارهای زنده</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">مشاهده روند ۷ روزه، آمار ۲۴ ساعته، نقشه حرارتی استانی و مقایسه دقیق اپراتورهای مخابراتی.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-magnifying-glass-chart"></i> تحلیل سانسور (OONI)</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">شناسایی دقیق سایت‌های مسدود شده، اختلالات شبکه و تست تحریم سرویس‌های خارجی.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-gamepad"></i> سیستم گیمیفیکیشن</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">با انجام تست‌های شبکه، امتیاز کسب کنید، سطح خود را ارتقا دهید و در لیگ کاربران رقابت کنید.</p>
            </div>
            <div class="card" style="margin-bottom:10px">
                <h4 style="color:var(--green); margin-bottom:8px; font-size:1.1rem;"><i class="fa-solid fa-trophy"></i> تالار افتخارات</h4>
                <p style="margin-bottom:0; font-size:0.85rem; color:var(--muted); text-align:right;">رقابت هفتگی کاربران برای کسب بالاترین امتیاز و حضور در تالار افتخارات رادار.</p>
            </div>
        </div>
    </section>

    <!-- بخش API خصوصی (توسعه‌دهندگان) -->
    <section class="section-box">
        <h2 class="section-title" style="color: var(--gold);"><i class="fa-solid fa-code"></i> API اختصاصی (توسعه‌دهندگان و تجاری)</h2>
        <div class="card" style="border-color: rgba(245, 158, 11, 0.3); background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(245, 158, 11, 0.05));">
            <p>سامانه رادار اینترنت ایران، داده‌های خام و تحلیل‌شده خود را از طریق یک <b>API اختصاصی (Private API)</b> در اختیار توسعه‌دهندگان، استارتاپ‌ها و کسب‌وکارها قرار می‌دهد.</p>
            <p>این داده‌ها برای مصارف شخصی و تجاری (نظیر ساخت داشبورد، اپلیکیشن‌های پایش، یا تحلیل‌های داده‌ای) قابل استفاده است.</p>
            
            <div style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 8px; border-right: 3px solid var(--gold); margin-bottom: 15px;">
                <p style="margin:0; font-size:0.85rem; color: var(--gold);">
                    <i class="fa-solid fa-handshake"></i> <b>شرط استفاده:</b> دریافت‌کنندگان API اختصاصی موظفند در سرویس یا وب‌سایت خود، عبارت <b>«رادار اینترنت ایران»</b> را به عنوان <b>اسپانسر داده و منبع رسمی</b> معرفی کنند.
                </p>
            </div>

            <a href="https://t.me/Adddddddm" target="_blank" class="btn btn-api"><i class="fa-solid fa-paper-plane"></i> درخواست کلید API اختصاصی</a>
        </div>
    </section>

    <!-- شبکه‌های اجتماعی -->
    <section class="section-box">
        <h2 class="section-title">ارتباط با ما</h2>
        <p class="section-subtitle">برای دریافت اخبار، گزارش‌ها و ارتباط مستقیم با تیم مدیریت از راه‌های زیر با ما در تماس باشید.</p>
        
        <a href="https://t.me/radarinternetiran" target="_blank" class="btn btn-telegram" style="background: #229ED9;"><i class="fa-brands fa-telegram"></i> کانال رسمی تلگرام</a>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-telegram"><i class="fa-solid fa-robot"></i> ربات تلگرام</a>
        <a href="https://instagram.com/radar.internet.iran.official" target="_blank" class="btn btn-insta"><i class="fa-brands fa-instagram"></i> صفحه رسمی اینستاگرام</a>
        <a href="https://t.me/radarinternetirangruop" target="_blank" class="btn btn-outline"><i class="fa-solid fa-users"></i> گروه پشتیبانی کاربران</a>
    </section>

    <!-- فوتر -->
    <footer>
        <p>© <span id="year">2026</span> رادار اینترنت ایران | تمامی حقوق محفوظ است.</p>
        <div class="copyright-text">
            <i class="fa-solid fa-triangle-exclamation"></i>
            رسمی: هرگونه کپی برداری از داده‌ها، آمار و طراحی این سایت بدون ذکر منبع ممنوع بوده و پیگرد قانونی به همراه دارد.
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
