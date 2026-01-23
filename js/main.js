// ===== الملف الرئيسي للتصميم الحديث =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الموقع
    initModernSite();
    
    // تحميل السيارات المميزة
    loadModernCars();
    
    // تهيئة السلايدر
    initHeroSlider();
    
    // تهيئة الإحصائيات
    initStatsCounter();
    
    // تهيئة التنقل
    initModernNavigation();
    
    // تهيئة النماذج
    initModernForms();
    
    // تهيئة التأثيرات
    initModernEffects();
});

// ===== تهيئة الموقع الحديث =====
function initModernSite() {
    console.log('موقع الحوت - النسخة الحديثة');
    
    // إضافة السنة الحالية
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // تعيين تاريخ اليوم في حقول التاريخ
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').value = today;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    document.getElementById('returnDate').value = tomorrow.toISOString().split('T')[0];
    
    // إضافة مستمعات للغة
    initLanguageSystem();
    
    // التحقق من الاتصال
    initConnectionCheck();
}

// ===== تهيئة سلايدر الهيرو =====
function initHeroSlider() {
    const swiper = new Swiper('.hero-slider', {
        direction: 'horizontal',
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
    });
}

// ===== تحميل السيارات المميزة =====
async function loadModernCars() {
    try {
        const response = await fetch('data/cars.json');
        const data = await response.json();
        
        // الحصول على 6 سيارات مميزة
        const featuredCars = data.cars
            .filter(car => car.featured)
            .slice(0, 6);
        
        displayModernCars(featuredCars);
        
    } catch (error) {
        console.error('خطأ في تحميل السيارات:', error);
        showModernError('تعذر تحميل السيارات المميزة');
    }
}

// ===== عرض السيارات بطريقة حديثة =====
function displayModernCars(cars) {
    const container = document.getElementById('featuredCars');
    if (!container) return;
    
    container.innerHTML = '';
    
    cars.forEach(car => {
        const carCard = createModernCarCard(car);
        container.appendChild(carCard);
    });
}

// ===== إنشاء كارت سيارة حديث =====
function createModernCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    const price = new Intl.NumberFormat('ar-IQ').format(car.price);
    const transmission = car.transmission === 'automatic' ? 'أوتوماتيك' : 'عادي';
    
    card.innerHTML = `
        <div class="car-image">
            <img src="images/cars/${car.image}" alt="${car.name}" loading="lazy">
            ${car.popular ? '<span class="car-badge">الأكثر طلباً</span>' : ''}
        </div>
        <div class="car-content">
            <div class="car-header">
                <div class="car-title">
                    <h3>${car.name}</h3>
                </div>
                <div class="car-price">
                    <span class="price">${price}</span>
                    <span class="period">دينار/يوم</span>
                </div>
            </div>
            <div class="car-specs">
                <span><i class="fas fa-user-friends"></i> ${car.capacity} أشخاص</span>
                <span><i class="fas fa-cogs"></i> ${transmission}</span>
                <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
            </div>
            <div class="car-actions">
                <button class="btn btn-outline btn-sm view-car" data-id="${car.id}">
                    <i class="fas fa-eye"></i>
                    التفاصيل
                </button>
                <button class="btn btn-primary btn-sm book-car" data-id="${car.id}">
                    <i class="fas fa-calendar-check"></i>
                    احجز الآن
                </button>
            </div>
        </div>
    `;
    
    // إضافة مستمعات الأحداث
    const viewBtn = card.querySelector('.view-car');
    const bookBtn = card.querySelector('.book-car');
    
    viewBtn.addEventListener('click', () => {
        window.location.href = `car-details.html?id=${car.id}`;
    });
    
    bookBtn.addEventListener('click', () => {
        localStorage.setItem('selectedCar', JSON.stringify(car));
        window.location.href = 'booking.html';
    });
    
    return card;
}

// ===== تهيئة عداد الإحصائيات =====
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 ثانية
        const step = target / (duration / 16); // 60 إطار في الثانية
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString('ar-IQ');
        }, 16);
    });
}

// ===== تهيئة نظام اللغة =====
function initLanguageSystem() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // تحديث الأزرار
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // تغيير اللغة
            changeLanguage(lang);
        });
    });
}

// ===== تغيير اللغة =====
function changeLanguage(lang) {
    // يمكن إضافة نظام ترجمة كامل هنا
    localStorage.setItem('siteLanguage', lang);
    
    // تغيير اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // إظهار رسالة
    showModernToast(`تم تغيير اللغة إلى ${lang === 'ar' ? 'العربية' : 'الإنجليزية'}`, 'success');
}

// ===== تهيئة التنقل الحديث =====
function initModernNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // زر التمرير للأعلى
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== تهيئة النماذج =====
function initModernForms() {
    // البحث عن سيارة
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // التحقق من تواريخ الحجز
    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    
    if (pickupDate && returnDate) {
        pickupDate.addEventListener('change', validateDates);
        returnDate.addEventListener('change', validateDates);
    }
}

// ===== معالجة البحث =====
function handleSearch() {
    const location = document.querySelector('[name="location"]').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const carType = document.querySelector('[name="carType"]').value;
    
    if (!location) {
        showModernError('يرجى اختيار مكان الاستلام', 'warning');
        return;
    }
    
    if (!pickupDate || !returnDate) {
        showModernError('يرجى اختيار تاريخي الاستلام والإرجاع', 'warning');
        return;
    }
    
    // حفظ معايير البحث
    const searchCriteria = {
        location,
        pickupDate,
        returnDate,
        carType
    };
    
    localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
    window.location.href = `cars.html?location=${location}&pickup=${pickupDate}&return=${returnDate}&type=${carType}`;
}

// ===== التحقق من صحة التواريخ =====
function validateDates() {
    const pickupDate = new Date(document.getElementById('pickupDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    
    if (returnDate <= pickupDate) {
        showModernError('تاريخ الإرجاع يجب أن يكون بعد تاريخ الاستلام', 'warning');
        document.getElementById('returnDate').value = '';
    }
}

// ===== تهيئة التأثيرات =====
function initModernEffects() {
    // تأثيرات عند التمرير
    initScrollEffects();
    
    // تأثيرات عند تحميل الصفحة
    initPageLoadEffects();
}

// ===== تأثيرات التمرير =====
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثيرات
    document.querySelectorAll('.feature-card, .step-item, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== تأثيرات تحميل الصفحة =====
function initPageLoadEffects() {
    // إضافة فئة للتحميل الأولي
    document.body.classList.add('page-loaded');
    
    // تأثيرات للعناصر الرئيسية
    setTimeout(() => {
        document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }, 100);
}

// ===== التحقق من الاتصال =====
function initConnectionCheck() {
    window.addEventListener('online', () => {
        showModernToast('تم استعادة الاتصال بالإنترنت', 'success');
    });
    
    window.addEventListener('offline', () => {
        showModernError('فقدت الاتصال بالإنترنت', 'warning');
    });
}

// ===== عرض رسائل الخطأ الحديثة =====
function showModernError(message, type = 'error') {
    const types = {
        error: { icon: 'exclamation-circle', color: '#E53E3E' },
        warning: { icon: 'exclamation-triangle', color: '#DD6B20' },
        success: { icon: 'check-circle', color: '#38A169' },
        info: { icon: 'info-circle', color: '#3182CE' }
    };
    
    const config = types[type] || types.error;
    
    const toast = document.createElement('div');
    toast.className = 'modern-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        border-right: 4px solid ${config.color};
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-${config.icon}" style="color: ${config.color}; font-size: 1.25rem;"></i>
        <span style="flex: 1; color: #333;">${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 0.25rem;
        ">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
    
    // إضافة أنماط الرسوم المتحركة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== عرض رسائل التوست =====
function showModernToast(message, type = 'success') {
    showModernError(message, type);
}

// ===== تصدير الوظائف للاستخدام العام =====
window.ModernSite = {
    loadModernCars,
    showModernToast,
    showModernError,
    initStatsCounter
};

// ===== تهيئة إضافية بعد تحميل الصفحة =====
window.addEventListener('load', function() {
    // إضافة تأثيرات نهائية
    document.body.classList.add('fully-loaded');
    
    // تهيئة تحميل الصور
    initLazyLoading();
});

// ===== تحميل الصور الكسول =====
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // المتصفح يدعم lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // استخدام Intersection Observer للدعم القديم
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }
}
