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
    
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg: #050810; /* پس‌زمینه تیره‌تر و عمیق‌تر */
            --surface: rgba(15, 23, 42, 0.6);
            --text: #f8fafc;
            --muted: #94a3b8;
            --primary: #10b981; /* سبز نئونی */
            --secondary: #3b82f6; /* آبی */
            --accent: #f59e0b; /* طلایی */
            --border: rgba(255, 255, 255, 0.08);
            --glow: rgba(16, 185, 129, 0.15);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            background-color: var(--bg); 
            color: var(--text); 
            line-height: 1.8; 
            overflow-x: hidden; 
            width: 100%;
            /* گرادیانت‌های نورپردازی مدرن */
            background-image: 
                radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
            background-attachment: fixed;
        }

        a { text-decoration: none; color: inherit; transition: color 0.3s ease; }

        /* هدر سایت */
        header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 5%; background: rgba(5, 8, 16, 0.8);
            backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 100;
            border-bottom: 1px solid var(--border);
        }
        .logo { font-size: 1.2rem; font-weight: 900; color: var(--text); display: flex; align-items: center; gap: 10px; letter-spacing: -0.5px; }
        .logo i { color: var(--primary); font-size: 1.4rem; }
        .nav-links { display: none; } /* در موبایل مخفی است */
        
        /* بخش Hero (بالای سایت) */
        .hero { 
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; padding: 100px 20px 80px; max-width: 900px; margin: 0 auto;
        }
        
        .badge {
            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);
            color: var(--primary); padding: 8px 20px; border-radius: 50px;
            font-size: 0.9rem; margin-bottom: 30px; font-weight: 600;
            display: inline-flex; align-items: center; gap: 8px;
            box-shadow: 0 0 30px var(--glow);
        }
        
        .hero h1 { font-size: 2.8rem; font-weight: 900; line-height: 1.3; margin-bottom: 24px; letter-spacing: -1px; }
        .hero h1 span { 
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero p { color: var(--muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px; }

        /* دکمه‌ها */
        .cta-group { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 300px; }
        .btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 10px; 
            padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 1rem; 
            transition: all 0.3s ease; cursor: pointer; border: none; width: 100%;
        }
        .btn-primary { background: var(--primary); color: #000; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3); }
        .btn-primary:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4); }
        .btn-outline { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border); color: var(--text); }
        .btn-outline:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

        /* کانتینر اصلی برای بخش‌ها */
        .container { max-width: 1200px; margin: 0 auto; padding: 80px 20px; }
        
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 15px; }
        .section-header p { color: var(--muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto; }

        /* شبکه (Grid) کارت‌ها */
        .grid { display: grid; grid-template-columns: 1fr; gap: 24px; }

        .card {
            background: var(--surface); backdrop-filter: blur(12px);
            padding: 32px; border-radius: 20px; border: 1px solid var(--border);
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            position: relative; overflow: hidden;
        }
        .card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
        
        .card-icon {
            width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
            font-size: 1.5rem; margin-bottom: 20px;
        }
        .icon-green { background: rgba(16, 185, 129, 0.1); color: var(--primary); }
        .icon-blue { background: rgba(59, 130, 246, 0.1); color: var(--secondary); }
        
        .card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--muted); font-size: 0.95rem; line-height: 1.7; text-align: justify; }

        /* بخش منابع داده */
        .sources-list { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-top: 30px; }
        .source-item {
            background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border);
            padding: 10px 20px; border-radius: 50px; font-size: 0.9rem; color: #cbd5e1;
            display: flex; align-items: center; gap: 8px;
        }
        .source-item i { color: var(--secondary); }

        /* بخش API (متمایز) */
        .api-box {
            background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
            border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 24px;
            padding: 40px; text-align: center; position: relative; overflow: hidden;
        }
        .api-box::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .api-box h2 { font-size: 1.8rem; color: var(--accent); margin-bottom: 15px; }
        .api-box p { color: #cbd5e1; max-width: 700px; margin: 0 auto 25px; font-size: 1.05rem; }
        
        .condition-box {
            background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.3);
            padding: 15px 20px; border-radius: 12px; display: inline-block;
            color: var(--accent); font-weight: 600; font-size: 0.95rem; margin-bottom: 30px;
        }

        /* فوتر */
        footer { border-top: 1px solid var(--border); background: rgba(5, 8, 16, 0.9); padding: 60px 20px 30px; text-align: center; }
        .footer-content { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 30px; }
        
        .social-icons { display: flex; gap: 20px; }
        .social-icons a { 
            width: 45px; height: 45px; border-radius: 50%; background: rgba(255, 255, 255, 0.05);
            display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
            border: 1px solid var(--border); transition: all 0.3s ease;
        }
        .social-icons a:hover { background: var(--primary); color: #000; border-color: var(--primary); transform: translateY(-3px); }

        .copyright { color: var(--muted); font-size: 0.85rem; display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .copyright-note { color: #64748b; font-size: 0.8rem; max-width: 600px; line-height: 1.6; }

        /* ریسپانسیو برای دسکتاپ و تبلت */
        @media (min-width: 768px) {
            .nav-links { display: flex; gap: 30px; font-size: 0.95rem; font-weight: 500; color: #cbd5e1; }
            .nav-links a:hover { color: var(--primary); }
            .cta-group { flex-direction: row; max-width: none; }
            .hero h1 { font-size: 3.5rem; }
            .hero p { font-size: 1.2rem; }
            .grid { grid-template-columns: repeat(2, 1fr); }
            .api-box { padding: 60px; }
            .footer-content { flex-direction: row; justify-content: space-between; text-align: right; }
            .copyright { align-items: flex-start; text-align: right; }
        }
        @media (min-width: 1024px) {
            .grid { grid-template-columns: repeat(4, 1fr); } /* 4 ستونه در مانیتور بزرگ */
        }
    </style>
</head>
<body>

    <!-- هدر -->
    <header>
        <div class="logo"><i class="fa-solid fa-satellite-dish"></i> رادار ایران</div>
        <div class="nav-links">
            <a href="#about">درباره ما</a>
            <a href="#features">امکانات</a>
            <a href="#api">API</a>
        </div>
        <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-outline" style="width: auto; padding: 10px 20px; font-size: 0.9rem;">ورود به ربات</a>
    </header>

    <!-- بخش Hero -->
    <section class="hero">
        <div class="badge"><i class="fa-solid fa-circle-check"></i> نسخه رسمی و پایدار</div>
        <h1>آینده <span>شفافیت</span> در شبکه ایران</h1>
        <p>زیرساخت مستقل پایش داده‌های شبکه. ما با تحلیل لحظه‌ای ترافیک و داده‌های جهانی، وضعیت کیفیت، اختلالات و سانسور اینترنت را دقیق به شما نشان می‌دهیم.</p>
        
        <div class="cta-group">
            <a href="https://t.me/Radarinternetiranbot" target="_blank" class="btn btn-primary"><i class="fa-brands fa-telegram"></i> شروع در تلگرام</a>
            <a href="#api" class="btn btn-outline"><i class="fa-solid fa-code"></i> مشاهده مستندات API</a>
        </div>
    </section>

    <!-- بخش امکانات (Grid) -->
    <section id="features" class="container">
        <div class="section-header">
            <h2>قابلیت‌های کلیدی سامانه</h2>
            <p>ما داده‌های خام شبکه را به اطلاعات کاربردی و قابل فهم تبدیل می‌کنیم.</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <div class="card-icon icon-green"><i class="fa-solid fa-chart-line"></i></div>
                <h3>نمودارهای زنده</h3>
                <p>مشاهده روند ۷ روزه، آمار ۲۴ ساعته، نقشه حرارتی استانی و مقایسه دقیق کیفیت اپراتورهای مخابراتی به صورت آنی.</p>
            </div>
            <div class="card">
                <div class="card-icon icon-green"><i class="fa-solid fa-shield-halved"></i></div>
                <h3>تحلیل سانسور (OONI)</h3>
                <p>شناسایی دقیق سایت‌های مسدود شده، اختلالات شبکه و تست تحریم سرویس‌های خارجی با تکیه بر داده‌های OONI.</p>
            </div>
            <div class="card">
                <div class="card-icon icon-green"><i class="fa-solid fa-gamepad"></i></div>
                <h3>سیستم گیمیفیکیشن</h3>
                <p>با انجام تست‌های شبکه، امتیاز کسب کنید، سطح خود را ارتقا دهید و در لیگ هفتگی کاربران رادار رقابت کنید.</p>
            </div>
            <div class="card">
                <div class="card-icon icon-green"><i class="fa-solid fa-satellite"></i></div>
                <h3>پینگ مستقیم و سریع</h3>
                <p>ارسال لحظه‌ای بسته‌های داده به سایت‌های داخلی و خارجی برای سنجش دقیق و واقعی دسترسی‌پذیری.</p>
            </div>
        </div>
    </section>

    <!-- بخش منابع داده -->
    <section id="about" class="container" style="padding-top: 0;">
        <div class="section-header">
            <h2>منابع استخراج داده</h2>
            <p>اطلاعات ما بدون هیچ‌گونه سوگیری، از معتبرترین منابع بین‌المللی پردازش می‌شود.</p>
        </div>
        <div class="sources-list">
            <div class="source-item"><i class="fa-solid fa-shield-halved"></i> پروژه OONI</div>
            <div class="source-item"><i class="fa-solid fa-route"></i> شبکه RIPE</div>
            <div class="source-item"><i class="fa-solid fa-cloud"></i> Cloudflare Radar</div>
            <div class="source-item"><i class="fa-solid fa-server"></i> Direct Ping</div>
        </div>
    </section>

    <!-- بخش API -->
    <section id="api" class="container">
        <div class="api-box">
            <h2><i class="fa-solid fa-code"></i> API اختصاصی توسعه‌دهندگان</h2>
            <p>داده‌های خام و تحلیل‌شده رادار از طریق یک API مدرن (JSON) در اختیار استارتاپ‌ها، محققان و کسب‌وکارها قرار می‌گیرد. شما می‌توانید از این داده‌ها برای ساخت داشبورد، اپلیکیشن‌های پایش یا تحلیل‌های داده‌ای استفاده کنید.</p>
            
            <div class="condition-box">
                <i class="fa-solid fa-handshake"></i> شرط استفاده: معرفی «رادار اینترنت ایران» به عنوان اسپانسر داده و منبع رسمی در سرویس شما.
            </div>
            <br>
            <a href="https://t.me/Adddddddm" target="_blank" class="btn btn-primary" style="background: var(--accent); color: #000; box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3); margin: 0 auto; display: inline-flex; max-width: 300px;"><i class="fa-solid fa-paper-plane"></i> درخواست کلید API</a>
        </div>
    </section>

    <!-- فوتر -->
    <footer>
        <div class="footer-content">
            <div class="social-icons">
                <a href="https://t.me/radarinternetiran" target="_blank" title="کانال تلگرام"><i class="fa-brands fa-telegram"></i></a>
                <a href="https://instagram.com/radar.internet.iran.official" target="_blank" title="اینستاگرام"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://t.me/radarinternetirangruop" target="_blank" title="گروه پشتیبانی"><i class="fa-solid fa-users"></i></a>
            </div>
            
            <div class="copyright">
                <p>© <span id="year">2026</span> رادار اینترنت ایران. تمامی حقوق محفوظ است.</p>
                <p class="copyright-note"><i class="fa-solid fa-lock"></i> هرگونه کپی‌برداری از داده‌ها، آمار و طراحی این سامانه بدون ذکر منبع ممنوع بوده و پیگرد قانونی دارد.</p>
            </div>
        </div>
    </footer>

    <script>
        // تنظیم سال به صورت خودکار
        document.getElementById('year').textContent = new Date().getFullYear();

        // اسکرول نرم برای لینک‌های منو
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
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
