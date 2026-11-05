export default {
  async fetch(request, env, ctx) {
    const today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <!-- ✅ تگ تایید گوگل (دست نزنید) -->
    <meta name="google-site-verification" content="Oskdq7_86up9xROsMJqIpKZ_cTczPZ5ZCNroOT-bnCc" />
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <title>رادار اینترنت ایران | داشبورد زنده وضعیت شبکه و اختلالات</title>
    <meta name="description" content="رادار اینترنت ایران، زیرساخت داده‌محور برای پایش آنلاین اختلالات، سانسور و کیفیت اینترنت. مشاهده وضعیت زنده اپراتورها و ترافیک شبکه.">
    
    <!-- داده‌های ساختاریافته برای سئو -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "رادار اینترنت ایران",
      "url": "https://radar-site-1.radar-internet-iran-official.workers.dev/",
      "description": "زیرساخت داده‌محور پایش زنده اینترنت ایران."
    }
    </script>

    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #030712; /* پس زمینه بسیار تیره و عمیق */
            --panel: rgba(17, 24, 39, 0.7);
            --text: #f9fafb;
            --muted: #9ca3af;
            --primary: #10b981;
            --primary-glow: rgba(16, 185, 129, 0.2);
            --blue: #3b82f6;
            --gold: #f59e0b;
            --border: rgba(255, 255, 255, 0.08);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            background-color: var(--bg); color: var(--text); line-height: 1.8; overflow-x: hidden;
            /* نورپردازی پس زمینه */
            background-image: radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.15), transparent 40%);
            background-attachment: fixed;
        }

        a { text-decoration: none; color: inherit; transition: 0.3s; }

        /* هدر */
        header {
            position: fixed; top: 0; width: 100%; z-index: 1000;
            display: flex; justify-content: space-between; align-items: center;
            padding: 15px 5%; background: rgba(3, 7, 18, 0.8);
            backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
        }
        .logo { font-size: 1.2rem; font-weight: 900; display: flex; align-items: center; gap: 10px; }
        .logo i { color: var(--primary); font-size: 1.5rem; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        
        .nav-links { display: none; font-size: 0.9rem; color: var(--muted); font-weight: 500; gap: 25px; }
        .nav-links a:hover { color: var(--primary); }

        /* دکمه‌ها */
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.95rem;
            transition: 0.3s; cursor: pointer; border: none;
        }
        .btn-primary { background: var(--primary); color: #000; box-shadow: 0 4px 15px var(--primary-glow); }
        .btn-primary:hover { background: #059669; transform: translateY(-2px); }
        .btn-glass { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--text); }
        .btn-glass:hover { background: rgba(255,255,255,0.1); }

        /* بخش Hero و داشبورد */
        .hero { padding: 130px 20px 60px; text-align: center; max-width: 1000px; margin: 0 auto; }
        
        .status-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
            color: var(--primary); padding: 6px 16px; border-radius: 50px;
            font-size: 0.85rem; font-weight: 700; margin-bottom: 25px;
        }
        .status-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }

        .hero h1 { font-size: 2.5rem; font-weight: 900; line-height: 1.3; margin-bottom: 20px; }
        .hero h1 span { color: var(--primary); }
        .hero p { color: var(--muted); font-size: 1.05rem; max-width: 650px; margin: 0 auto 40px; }

        /* داشبورد زنده (Bento Grid) */
        .dashboard-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 900px; margin: 0 auto 60px;
        }
        @media(min-width: 768px) { .dashboard-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .dash-card {
            background: var(--panel); backdrop-filter: blur(10px);
            border: 1px solid var(--border); border-radius: 16px;
            padding: 20px; text-align: right; position: relative; overflow: hidden;
        }
        .dash-card::before {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .dash-card h4 { color: var(--muted); font-size: 0.85rem; font-weight: 500; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }
        .dash-card .value { font-size: 1.6rem; font-weight: 900; display: flex; align-items: baseline; gap: 5px; }
        .dash-card .unit { font-size: 0.8rem; color: var(--muted); font-weight: normal; }
        
        .val-green { color: var(--primary); }
        .val-red { color: #ef4444; }
        .val-blue { color: var(--blue); }

        /* بخش‌بندی محتوا */
        .container { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }
        .section-title { text-align: center; margin-bottom: 40px; }
        .section-title h2 { font-size: 1.8rem; font-weight: 900; margin-bottom: 10px; }
        .section-title p { color: var(--muted); font-size: 0.95rem; }

        /* کارت‌های امکانات */
        .features-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media(min-width: 768px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .feature-card {
            background: var(--panel); border: 1px solid var(--border); border-radius: 16px;
            padding: 30px; transition: 0.3s;
        }
        .feature-card:hover { border-color: rgba(16, 185, 129, 0.4); transform: translateY(-3px); }
        .feature-icon {
            width: 45px; height: 45px; border-radius: 12px; background: rgba(16, 185, 129, 0.1);
            color: var(--primary); display: flex; align-items: center; justify-content: center;
            font-size: 1.3rem; margin-bottom: 20px;
        }
        .feature-card h3 { font-size: 1.1rem; margin-bottom: 10px; font-weight: 700; }
        .feature-card p { color: var(--muted); font-size: 0.9rem; text-align: justify; }

        /* راهنما */
        .steps-container { display: flex; flex-direction: column; gap: 15px; max-width: 700px; margin: 0 auto; }
        .step-item {
            display: flex; align-items: center; gap: 15px; background: var(--panel);
            border: 1px solid var(--border); padding: 20px; border-radius: 16px;
        }
        .step-num { background: var(--primary); color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
        .step-text h4 { font-size: 1rem; margin-bottom: 5px; }
        .step-text p { font-size: 0.9rem; color: var(--muted); }

        /* API */
        .api-section {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(245, 158, 11, 0.05));
            border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 20px;
            padding: 40px 30px; text-align: center; margin-top: 40px;
        }
        .api-section h2 { color: var(--gold); font-size: 1.5rem; margin-bottom: 15px; }
        .api-section p { color: var(--muted); font-size: 0.95rem; margin-bottom: 25px; max-width: 600px; margin-left: auto; margin-right: auto; }

        /* فوتر */
        footer { border-top: 1px solid var(--border); padding: 40px 20px; text-align: center; background: rgba(3, 7, 18, 0.8); }
        .footer-socials { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
        .footer-socials a { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid var(--border); }
        .footer-socials a:hover { background: var(--primary); color: #000; }
        .footer-text { color: var(--muted); font-size: 0.85rem; }
        .footer-text span { color: #ef4444; font-weight: bold; }

        @media (min-width: 768px) {
            .nav-links { display: flex; }
            .hero h1 { font-size: 3.5rem; }
            .hero { padding-top: 160px; }
            .dash-card .value { font-size: 2rem; }
        }
    </style>
</head>
<body>

    <header>
        <div class="logo"><i class="fa-solid fa-satellite-dish"></i> رادار ایران</div>
        <div class="nav-links">
            <a href="#dashboard">داشبورد زنده</a>
            <a href="#features">امکانات</a>
            <a href="#how-to">راهنمای اتصال</a>
            <a href="#api">API</a>
        </div>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">ورود به ربات</a>
    </header>

    <!-- بخش اصلی -->
    <section class="hero">
        <div class="status-badge">
            <div class="status-dot"></div>
            سیستم آنلاین است • بروزرسانی: ${today}
        </div>
        <h1>شفافیت در <span>شبکه</span>، بدون واسطه</h1>
        <p>رادار اینترنت ایران، زیرساخت داده‌محور برای پایش آنلاین اختلالات، سانسور و کیفیت اینترنت. داده‌های واقعی از منابع جهانی، مستقیماً در اختیار شما.</p>
        
        <div class="dashboard-grid" id="dashboard">
            <div class="dash-card">
                <h4><i class="fa-solid fa-wifi"></i> وضعیت کلی</h4>
                <div class="value val-green">پایدار</div>
            </div>
            <div class="dash-card">
                <h4><i class="fa-solid fa-gauge-high"></i> پینگ میانگین</h4>
                <div class="value val-blue">--- <span class="unit">ms</span></div>
            </div>
            <div class="dash-card">
                <h4><i class="fa-solid fa-ban"></i> سانسور / مسدودی</h4>
                <div class="value val-red">--- <span class="unit">%</span></div>
            </div>
            <div class="dash-card">
                <h4><i class="fa-solid fa-users"></i> کاربران فعال</h4>
                <div class="value">---</div>
            </div>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-primary"><i class="fa-brands fa-telegram"></i> دریافت گزارش کامل</a>
            <a href="#features" class="btn btn-glass"><i class="fa-solid fa-arrow-down"></i> مشاهده امکانات</a>
        </div>
    </section>

    <!-- امکانات -->
    <section class="container" id="features">
        <div class="section-title">
            <h2>زیرساخت پایش ما</h2>
            <p>ما داده‌های خام را به اطلاعات کاربردی تبدیل می‌کنیم.</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div>
                <h3>نمودارهای زنده</h3>
                <p>روند ۷ روزه، آمار ۲۴ ساعته و نقشه حرارتی استانی برای بررسی دقیق کیفیت شبکه در هر ساعت از شبانه‌روز.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
                <h3>تحلیل سانسور (OONI)</h3>
                <p>شناسایی دقیق سایت‌های مسدود شده و دستکاری بسته‌های شبکه با تکیه بر داده‌های پروژه جهانی OONI.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fa-solid fa-satellite"></i></div>
                <h3>پینگ مستقیم</h3>
                <p>ارسال لحظه‌ای بسته‌های داده به سایت‌های داخلی و خارجی برای سنجش دقیق دسترسی‌پذیری.</p>
            </div>
        </div>
    </section>

    <!-- راهنما -->
    <section class="container" id="how-to">
        <div class="section-title">
            <h2>چگونه شروع کنیم؟</h2>
            <p>در کمتر از ۱ دقیقه به سیستم متصل شوید.</p>
        </div>
        <div class="steps-container">
            <div class="step-item">
                <div class="step-num">۱</div>
                <div class="step-text">
                    <h4>ورود به کانال رسمی</h4>
                    <p>در تلگرام عبارت <code>@radarinternetiran</code> را جستجو کرده و وارد کانال شوید.</p>
                </div>
            </div>
            <div class="step-item">
                <div class="step-num">۲</div>
                <div class="step-text">
                    <h4>یافتن لینک ربات</h4>
                    <p>در کانال، به پیام‌های سنجاق شده (Pinned) مراجعه کرده و روی لینک ربات کلیک کنید.</p>
                </div>
            </div>
            <div class="step-item">
                <div class="step-num">۳</div>
                <div class="step-text">
                    <h4>شروع پایش</h4>
                    <p>دستور <code>/start</code> را ارسال کنید و از داشبورد اختصاصی خود استفاده کنید.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- بخش API -->
    <section class="container" id="api">
        <div class="api-section">
            <h2><i class="fa-solid fa-code"></i> دسترسی به داده‌های خام</h2>
            <p>توسعه‌دهندگان و کسب‌وکارها می‌توانند از طریق API اختصاصی، به داده‌های JSON رادار متصل شوند و سرویس‌های خود را بسازند.</p>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(245, 158, 11, 0.2); padding: 10px; border-radius: 10px; display: inline-block; color: var(--gold); font-size: 0.85rem; margin-bottom: 20px;">
                <i class="fa-solid fa-handshake"></i> شرط استفاده: ذکر «رادار اینترنت ایران» به عنوان اسپانسر رسمی
            </div>
            <br>
            <a href="https://t.me/Adddddddm" target="_blank" class="btn btn-glass" style="border-color: var(--gold); color: var(--gold);"><i class="fa-solid fa-paper-plane"></i> درخواست کلید API</a>
        </div>
    </section>

    <!-- فوتر -->
    <footer>
        <div class="footer-socials">
            <a href="https://t.me/radarinternetiran" target="_blank"><i class="fa-brands fa-telegram"></i></a>
            <a href="https://instagram.com/radar.internet.iran.official" target="_blank"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://t.me/radarinternetirangruop" target="_blank"><i class="fa-solid fa-users"></i></a>
        </div>
        <div class="footer-text">
            <p>© <span id="year"></span> رادار اینترنت ایران. تمامی حقوق محفوظ است.</p>
            <p style="margin-top: 10px; font-size: 0.8rem;">هرگونه کپی‌برداری از داده‌ها و طراحی این سامانه بدون ذکر منبع <span>ممنوع</span> است.</p>
        </div>
    </footer>

    <script>
        document.getElementById('year').textContent = new Date().getFullYear();
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
