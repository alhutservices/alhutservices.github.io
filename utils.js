/**
 * utils.js - وظائف مساعدة لنظام تأجير السيارات
 */

// تخزين البيانات محلياً
const storage = {
    // حفظ البيانات
    set: function(key, data) {
        try {
            localStorage.setItem(`carRental_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('خطأ في حفظ البيانات:', e);
            return false;
        }
    },
    
    // جلب البيانات
    get: function(key) {
        try {
            const data = localStorage.getItem(`carRental_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('خطأ في جلب البيانات:', e);
            return null;
        }
    },
    
    // حذف البيانات
    remove: function(key) {
        try {
            localStorage.removeItem(`carRental_${key}`);
            return true;
        } catch (e) {
            console.error('خطأ في حذف البيانات:', e);
            return false;
        }
    },
    
    // مسح جميع البيانات
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('خطأ في مسح البيانات:', e);
            return false;
        }
    }
};

// تنسيق التواريخ
const dateFormatter = {
    format: function(dateString, format = 'long') {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString('ar-IQ', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } else {
            return date.toLocaleDateString('ar-IQ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        }
    },
    
    formatTime: function(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-IQ', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    getDaysBetween: function(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// تنسيق العملة
const currencyFormatter = {
    format: function(amount) {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }
        
        return new Intl.NumberFormat('ar-IQ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' دينار';
    },
    
    parse: function(currencyString) {
        if (!currencyString) return 0;
        
        const numberString = currencyString.replace(/[^0-9.-]+/g, '');
        return parseFloat(numberString) || 0;
    }
};

// التحقق من المدخلات
const validator = {
    // التحقق من البريد الإلكتروني
    isEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // التحقق من رقم الهاتف العراقي
    isIraqiPhone: function(phone) {
        const re = /^(07[3-9][0-9]{8}|\\+9647[3-9][0-9]{8})$/;
        return re.test(phone.replace(/\s+/g, ''));
    },
    
    // التحقق من رقم اللوحة العراقية
    isIraqiPlate: function(plate) {
        const re = /^[\u0621-\u064A\s]{2,}\s\d{1,4}\s[\u0621-\u064A\s]{1,2}$/;
        return re.test(plate);
    },
    
    // التحقق من النص العربي
    isArabicText: function(text) {
        const re = /^[\u0600-\u06FF\s]+$/;
        return re.test(text);
    },
    
    // التحقق من أن الحقل غير فارغ
    isNotEmpty: function(value) {
        return value && value.toString().trim().length > 0;
    },
    
    // التحقق من طول النص
    isValidLength: function(text, min, max) {
        return text.length >= min && text.length <= max;
    },
    
    // التحقق من أن الرقم ضمن النطاق
    isInRange: function(number, min, max) {
        return number >= min && number <= max;
    }
};

// إدارة النوافذ المنبثقة
const modalManager = {
    currentModal: null,
    
    show: function(content, options = {}) {
        // إغلاق أي نافذة مفتوحة
        this.close();
        
        // إعداد الخيارات
        const {
            title = '',
            size = 'md',
            onClose = null,
            onConfirm = null,
            showFooter = true,
            confirmText = 'موافق',
            cancelText = 'إلغاء'
        } = options;
        
        // إنشاء النافذة المنبثقة
        const modal = document.createElement('div');
        modal.className = 'modal fade-in';
        modal.id = 'dynamicModal';
        
        // تحديد الحجم
        const sizeClass = {
            sm: 'modal-sm',
            md: 'modal-md',
            lg: 'modal-lg',
            xl: 'modal-xl'
        }[size] || 'modal-md';
        
        modal.innerHTML = `
            <div class="modal-overlay" onclick="modalManager.close()"></div>
            <div class="modal-content ${sizeClass}">
                ${title ? `
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button type="button" class="modal-close" onclick="modalManager.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ` : ''}
                
                <div class="modal-body">
                    ${content}
                </div>
                
                ${showFooter ? `
                <div class="modal-footer">
                    ${onConfirm ? `
                    <button type="button" class="btn btn-secondary" onclick="modalManager.close()">
                        ${cancelText}
                    </button>
                    <button type="button" class="btn btn-primary" onclick="modalManager.confirm()">
                        ${confirmText}
                    </button>
                    ` : `
                    <button type="button" class="btn btn-primary" onclick="modalManager.close()">
                        إغلاق
                    </button>
                    `}
                </div>
                ` : ''}
            </div>
        `;
        
        // إضافة النافذة إلى الجسم
        document.body.appendChild(modal);
        
        // منع التمرير
        document.body.style.overflow = 'hidden';
        
        // تخزين المرجع
        this.currentModal = {
            element: modal,
            onClose,
            onConfirm
        };
        
        // إضافة أنيميشن
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        return modal;
    },
    
    close: function() {
        if (this.currentModal) {
            const modal = this.currentModal.element;
            
            // إضافة أنيميشن الخروج
            modal.classList.remove('show');
            
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.parentElement.removeChild(modal);
                }
                
                // استعادة التمرير
                document.body.style.overflow = 'auto';
                
                // استدعاء دالة الإغلاق
                if (this.currentModal.onClose) {
                    this.currentModal.onClose();
                }
                
                this.currentModal = null;
            }, 300);
        }
    },
    
    confirm: function() {
        if (this.currentModal && this.currentModal.onConfirm) {
            this.currentModal.onConfirm();
        }
        this.close();
    },
    
    alert: function(message, type = 'info') {
        const icon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        const color = {
            success: 'text-success',
            error: 'text-danger',
            warning: 'text-warning',
            info: 'text-info'
        }[type] || 'text-info';
        
        const content = `
            <div class="alert-modal">
                <i class="fas ${icon} ${color}" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <div style="font-size: 1.1rem;">${message}</div>
            </div>
        `;
        
        return this.show(content, {
            title: '',
            showFooter: true,
            confirmText: 'موافق'
        });
    },
    
    confirmDialog: function(message, onConfirm) {
        const content = `
            <div class="confirm-modal">
                <i class="fas fa-question-circle text-warning" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <div style="font-size: 1.1rem; margin-bottom: 1.5rem;">${message}</div>
            </div>
        `;
        
        return this.show(content, {
            title: 'تأكيد',
            onConfirm,
            confirmText: 'نعم',
            cancelText: 'لا'
        });
    }
};

// إدارة الإشعارات
const notificationManager = {
    show: function(message, type = 'info', duration = 5000) {
        // إعداد الألوان والرموز
        const config = {
            success: {
                icon: 'fa-check-circle',
                bgColor: 'var(--success)',
                title: 'نجاح'
            },
            error: {
                icon: 'fa-exclamation-circle',
                bgColor: 'var(--danger)',
                title: 'خطأ'
            },
            warning: {
                icon: 'fa-exclamation-triangle',
                bgColor: 'var(--warning)',
                title: 'تحذير'
            },
            info: {
                icon: 'fa-info-circle',
                bgColor: 'var(--info)',
                title: 'معلومة'
            }
        }[type] || config.info;
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification slide-in-right';
        notification.style.backgroundColor = config.bgColor;
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${config.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${config.title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // إضافة الإشعار إلى الجسم
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد المدة المحددة
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('slide-out-right');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
        
        return notification;
    }
};

// تحميل القوالب
const templateLoader = {
    load: async function(templateName, containerSelector) {
        try {
            const response = await fetch(`templates/${templateName}.html`);
            
            if (!response.ok) {
                throw new Error(`خطأ في تحميل القالب: ${templateName}`);
            }
            
            const html = await response.text();
            
            if (containerSelector) {
                const container = document.querySelector(containerSelector);
                if (container) {
                    container.innerHTML = html;
                    return container;
                }
            }
            
            return html;
        } catch (error) {
            console.error('خطأ في تحميل القالب:', error);
            notificationManager.show('حدث خطأ في تحميل المحتوى', 'error');
            return null;
        }
    }
};

// جلب البيانات من API
const api = {
    baseURL: 'http://localhost:3000', // أو المسار المحلي
    
    async request(endpoint, options = {}) {
        try {
            const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}/${endpoint}`;
            
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storage.get('token')}`
                }
            };
            
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`خطأ في الطلب: ${response.status}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('خطأ في الاتصال بالخادم:', error);
            return { 
                success: false, 
                error: error.message,
                // في حالة عدم الاتصال، نستخدم البيانات المحلية
                data: this.getLocalData(endpoint)
            };
        }
    },
    
    getLocalData(endpoint) {
        // تحويل endpoint إلى key للتخزين المحلي
        const key = endpoint.replace(/\//g, '_');
        return storage.get(key) || [];
    },
    
    // وظائف خاصة بالنظام
    async getCars() {
        return this.request('api/cars');
    },
    
    async getBookings() {
        return this.request('api/bookings');
    },
    
    async getUsers() {
        return this.request('api/users');
    },
    
    async createBooking(bookingData) {
        return this.request('api/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },
    
    async updateCar(carId, carData) {
        return this.request(`api/cars/${carId}`, {
            method: 'PUT',
            body: JSON.stringify(carData)
        });
    }
};

// التهيئة العامة
const app = {
    init: function() {
        console.log('تطبيق تأجير السيارات يعمل...');
        
        // تهيئة البيانات الأساسية إذا لم تكن موجودة
        this.initializeData();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
        
        // تحميل بيانات المستخدم
        this.loadUserData();
    },
    
    initializeData: function() {
        // البيانات الأولية للسيارات
        if (!storage.get('cars')) {
            const initialCars = [
                {
                    id: 'CAR001',
                    brand: 'تويوتا',
                    model: 'كامري 2023',
                    plateNumber: 'كركوك 1234 أ ب',
                    color: 'أبيض',
                    year: 2023,
                    fuelType: 'بنزين',
                    transmission: 'أوتوماتيك',
                    seats: 5,
                    dailyRate: 50000,
                    status: 'متاحة',
                    features: ['تكييف', 'بلوتوث', 'كاميرا خلفية'],
                    images: [],
                    description: 'سيارة مريحة ومناسبة للعائلة'
                },
                // ... سيارات أخرى
            ];
            storage.set('cars', initialCars);
        }
        
        // البيانات الأولية للحجوزات
        if (!storage.get('bookings')) {
            storage.set('bookings', []);
        }
        
        // البيانات الأولية للمستخدمين
        if (!storage.get('users')) {
            const initialUsers = [
                {
                    id: 'USR001',
                    name: 'مدير النظام',
                    email: 'admin@kirkukcars.com',
                    phone: '07701234567',
                    role: 'admin',
                    password: 'admin123' // في التطبيق الحقيقي، يجب تشفير كلمات المرور
                }
            ];
            storage.set('users', initialUsers);
        }
    },
    
    setupEventListeners: function() {
        // إضافة مستمعي الأحداث العامة
        document.addEventListener('click', this.handleGlobalClicks.bind(this));
        
        // مستمع للنسخ الاحتياطي التلقائي
        window.addEventListener('beforeunload', this.autoBackup.bind(this));
    },
    
    handleGlobalClicks: function(e) {
        // معالجة النقر على الروابط الداخلية
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },
    
    autoBackup: function() {
        // إنشاء نسخة احتياطية قبل إغلاق الصفحة
        const backup = {
            cars: storage.get('cars'),
            bookings: storage.get('bookings'),
            users: storage.get('users'),
            timestamp: new Date().toISOString()
        };
        
        storage.set('backup_' + Date.now(), backup);
    },
    
    loadUserData: function() {
        const user = storage.get('currentUser');
        
        if (user) {
            // تحديث واجهة المستخدم بناءً على بيانات المستخدم
            this.updateUIForUser(user);
        }
    },
    
    updateUIForUser: function(user) {
        // تحديث اسم المستخدم في الشريط العلوي
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(el => {
            el.textContent = user.name;
        });
        
        // إظهار/إخفاء العناصر بناءً على الصلاحيات
        if (user.role === 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        }
    },
    
    // وظائف للملاحة
    navigateTo: function(page) {
        window.location.href = `pages/${page}.html`;
    },
    
    // وظائف للطباعة
    printDocument: function(elementId) {
        const printContent = document.getElementById(elementId);
        
        if (!printContent) {
            notificationManager.show('عنصر الطباعة غير موجود', 'error');
            return;
        }
        
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        location.reload(); // إعادة تحميل الصفحة لاستعادة المحتوى
    },
    
    // تصدير البيانات
    exportData: function(dataType) {
        const data = storage.get(dataType) || [];
        
        if (data.length === 0) {
            notificationManager.show('لا توجد بيانات للتصدير', 'warning');
            return;
        }
        
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        notificationManager.show('تم تصدير البيانات بنجاح', 'success');
    },
    
    // استيراد البيانات
    importData: function(dataType, file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (Array.isArray(data)) {
                    storage.set(dataType, data);
                    notificationManager.show('تم استيراد البيانات بنجاح', 'success');
                    
                    // إعادة تحميل الصفحة إذا كانت البيانات تتعلق بالصفحة الحالية
                    if (window.location.pathname.includes(dataType)) {
                        setTime
