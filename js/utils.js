// ===== أدوات مساعدة لموقع تأجير السيارات الحوت =====

// ===== مكتبة الأدوات العامة =====
const Utils = {
    // ===== التعامل مع التواريخ =====
    dates: {
        /**
         * تنسيق التاريخ بصيغة عربية
         * @param {string|Date} date - التاريخ
         * @param {boolean} includeTime - تضمين الوقت
         * @returns {string} التاريخ المنسق
         */
        formatDate: function(date, includeTime = false) {
            if (!date) return '';
            
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Baghdad'
            };
            
            if (includeTime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
            }
            
            return d.toLocaleDateString('ar-IQ', options);
        },
        
        /**
         * تنسيق الوقت
         * @param {string} timeString - الوقت بصيغة HH:MM
         * @returns {string} الوقت المنسق
         */
        formatTime: function(timeString) {
            if (!timeString) return '';
            
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            
            if (hour < 12) {
                return `${hour}:${minutes} صباحاً`;
            } else if (hour === 12) {
                return `12:${minutes} ظهراً`;
            } else {
                return `${hour - 12}:${minutes} مساءً`;
            }
        },
        
        /**
         * حساب الفرق بين تاريخين بالأيام
         * @param {string|Date} startDate - تاريخ البداية
         * @param {string|Date} endDate - تاريخ النهاية
         * @returns {number} عدد الأيام
         */
        getDaysBetween: function(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        
        /**
         * التحقق من صحة التاريخ
         * @param {string} dateString - التاريخ بصيغة YYYY-MM-DD
         * @returns {boolean} صحيح/خطأ
         */
        isValidDate: function(dateString) {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regex)) return false;
            
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date.getTime());
        },
        
        /**
         * إضافة أيام لتاريخ
         * @param {string|Date} date - التاريخ
         * @param {number} days - عدد الأيام للإضافة
         * @returns {Date} التاريخ الجديد
         */
        addDays: function(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        
        /**
         * الحصول على تاريخ اليوم بصيغة YYYY-MM-DD
         * @returns {string} تاريخ اليوم
         */
        getToday: function() {
            return new Date().toISOString().split('T')[0];
        },
        
        /**
         * الحصول على التاريخ بعد أسبوع
         * @returns {string} تاريخ الأسبوع القادم
         */
        getNextWeek: function() {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            return nextWeek.toISOString().split('T')[0];
        },
        
        /**
         * حساب العمر من تاريخ الميلاد
         * @param {string} birthDate - تاريخ الميلاد
         * @returns {number} العمر
         */
        calculateAge: function(birthDate) {
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age;
        }
    },
    
    // ===== التعامل مع الأموال =====
    money: {
        /**
         * تنسيق المبلغ بعملة الدينار العراقي
         * @param {number} amount - المبلغ
         * @returns {string} المبلغ المنسق
         */
        formatCurrency: function(amount) {
            if (amount === null || amount === undefined) return '0 دينار';
            
            return new Intl.NumberFormat('ar-IQ', {
                style: 'currency',
                currency: 'IQD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        },
        
        /**
         * تنسيق المبلغ بدون رمز العملة
         * @param {number} amount - المبلغ
         * @returns {string} المبلغ المنسق
         */
        formatNumber: function(amount) {
            if (amount === null || amount === undefined) return '0';
            
            return new Intl.NumberFormat('ar-IQ').format(amount);
        },
        
        /**
         * تحويل المبلغ من نص إلى رقم
         * @param {string} amountString - المبلغ كنص
         * @returns {number} المبلغ كرقم
         */
        parseCurrency: function(amountString) {
            if (!amountString) return 0;
            
            // إزالة الفواصل والأحرف غير الرقمية
            const cleanString = amountString.replace(/[^\d.-]/g, '');
            return parseFloat(cleanString) || 0;
        },
        
        /**
         * حساب الضريبة (10%)
         * @param {number} amount - المبلغ
         * @returns {number} قيمة الضريبة
         */
        calculateTax: function(amount) {
            return amount * 0.10;
        },
        
        /**
         * حساب السعر بعد الخصم
         * @param {number} originalPrice - السعر الأصلي
         * @param {number} discountPercentage - نسبة الخصم
         * @returns {number} السعر بعد الخصم
         */
        calculateDiscount: function(originalPrice, discountPercentage) {
            const discountAmount = originalPrice * (discountPercentage / 100);
            return originalPrice - discountAmount;
        },
        
        /**
         * تقسيم المبلغ على أقساط
         * @param {number} totalAmount - المبلغ الكلي
         * @param {number} installments - عدد الأقساط
         * @returns {number} قيمة القسط
         */
        calculateInstallment: function(totalAmount, installments) {
            return totalAmount / installments;
        }
    },
    
    // ===== التعامل مع النصوص =====
    strings: {
        /**
         * تقليم النص وإضافة نقاط
         * @param {string} text - النص
         * @param {number} maxLength - الحد الأقصى
         * @returns {string} النص المقتطع
         */
        truncate: function(text, maxLength = 100) {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            
            return text.substring(0, maxLength) + '...';
        },
        
        /**
         * تحويل النص إلى حالة العنوان
         * @param {string} text - النص
         * @returns {string} النص بعد التحويل
         */
        toTitleCase: function(text) {
            if (!text) return '';
            
            return text.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        
        /**
         * إزالة المسافات الزائدة
         * @param {string} text - النص
         * @returns {string} النص بعد التنظيف
         */
        cleanSpaces: function(text) {
            if (!text) return '';
            
            return text.replace(/\s+/g, ' ').trim();
        },
        
        /**
         * استخراج الأرقام من النص
         * @param {string} text - النص
         * @returns {string} الأرقام فقط
         */
        extractNumbers: function(text) {
            if (!text) return '';
            
            return text.replace(/\D/g, '');
        },
        
        /**
         * فك تشفير HTML entities
         * @param {string} text - النص المشفر
         * @returns {string} النص العادي
         */
        decodeHtmlEntities: function(text) {
            if (!text) return '';
            
            const textarea = document.createElement('textarea');
            textarea.innerHTML = text;
            return textarea.value;
        },
        
        /**
         * حساب عدد الكلمات
         * @param {string} text - النص
         * @returns {number} عدد الكلمات
         */
        wordCount: function(text) {
            if (!text) return 0;
            
            return text.trim().split(/\s+/).length;
        },
        
        /**
         * إنشاء نص عشوائي
         * @param {number} length - الطول
         * @returns {string} النص العشوائي
         */
        generateRandomString: function(length = 10) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            return result;
        }
    },
    
    // ===== التعامل مع الملفات =====
    files: {
        /**
         * التحقق من حجم الملف
         * @param {File} file - ملف
         * @param {number} maxSizeMB - الحد الأقصى بالميجابايت
         * @returns {boolean} صحيح/خطأ
         */
        isValidSize: function(file, maxSizeMB = 5) {
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            return file.size <= maxSizeBytes;
        },
        
        /**
         * التحقق من نوع الملف
         * @param {File} file - ملف
         * @param {string[]} allowedTypes - الأنواع المسموحة
         * @returns {boolean} صحيح/خطأ
         */
        isValidType: function(file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) {
            return allowedTypes.includes(file.type);
        },
        
        /**
         * قراءة الملف كـ Data URL
         * @param {File} file - ملف
         * @returns {Promise<string>} Data URL
         */
        readAsDataURL: function(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },
        
        /**
         * قراءة الملف كنص
         * @param {File} file - ملف
         * @returns {Promise<string>} محتوى الملف
         */
        readAsText: function(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        },
        
        /**
         * تنزيل الملف
         * @param {string} data - بيانات الملف
         * @param {string} filename - اسم الملف
         * @param {string} type - نوع الملف
         */
        downloadFile: function(data, filename, type = 'application/octet-stream') {
            const blob = new Blob([data], { type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        },
        
        /**
         * استخراج امتداد الملف
         * @param {string} filename - اسم الملف
         * @returns {string} الامتداد
         */
        getFileExtension: function(filename) {
            return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        },
        
        /**
         * الحصول على اسم الملف بدون امتداد
         * @param {string} filename - اسم الملف
         * @returns {string} اسم الملف بدون امتداد
         */
        getFileNameWithoutExtension: function(filename) {
            return filename.replace(/\.[^/.]+$/, "");
        }
    },
    
    // ===== التعامل مع المصفوفات والكائنات =====
    arrays: {
        /**
         * ترتيب مصفوفة بشكل عشوائي
         * @param {Array} array - المصفوفة
         * @returns {Array} المصفوفة المرتبة عشوائياً
         */
        shuffle: function(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },
        
        /**
         * حذف القيم المكررة
         * @param {Array} array - المصفوفة
         * @returns {Array} المصفوفة بدون تكرار
         */
        unique: function(array) {
            return [...new Set(array)];
        },
        
        /**
         * تقسيم مصفوفة إلى مجموعات
         * @param {Array} array - المصفوفة
         * @param {number} size - حجم المجموعة
         * @returns {Array} مصفوفة المجموعات
         */
        chunk: function(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        },
        
        /**
         * دمج كائنين
         * @param {Object} obj1 - الكائن الأول
         * @param {Object} obj2 - الكائن الثاني
         * @returns {Object} الكائن المدمج
         */
        deepMerge: function(obj1, obj2) {
            const result = { ...obj1 };
            
            for (const key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    if (typeof obj2[key] === 'object' && obj2[key] !== null && 
                        typeof result[key] === 'object' && result[key] !== null) {
                        result[key] = this.deepMerge(result[key], obj2[key]);
                    } else {
                        result[key] = obj2[key];
                    }
                }
            }
            
            return result;
        },
        
        /**
         * تصفية الكائن (إزالة القيم الفارغة)
         * @param {Object} obj - الكائن
         * @returns {Object} الكائن المصفى
         */
        filterEmptyValues: function(obj) {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, v]) => 
                    v !== null && v !== undefined && v !== ''
                )
            );
        },
        
        /**
         * التحقق إذا كانت المصفوفة فارغة
         * @param {Array} array - المصفوفة
         * @returns {boolean} صحيح/خطأ
         */
        isEmpty: function(array) {
            return !array || array.length === 0;
        },
        
        /**
         * البحث في مصفوفة الكائنات
         * @param {Array} array - المصفوفة
         * @param {string} key - المفتاح
         * @param {*} value - القيمة
         * @returns {Object|null} العنصر الموجود أو null
         */
        findObject: function(array, key, value) {
            return array.find(item => item[key] === value) || null;
        }
    },
    
    // ===== التحقق من الصحة =====
    validation: {
        /**
         * التحقق من صحة البريد الإلكتروني
         * @param {string} email - البريد الإلكتروني
         * @returns {boolean} صحيح/خطأ
         */
        isValidEmail: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        /**
         * التحقق من صحة رقم الهاتف العراقي
         * @param {string} phone - رقم الهاتف
         * @returns {boolean} صحيح/خطأ
         */
        isValidIraqiPhone: function(phone) {
            const patterns = [
                /^07[3-9][0-9]{8}$/, // 073xxxxxxxx - 079xxxxxxxx
                /^\+9647[3-9][0-9]{8}$/, // +96473xxxxxxxx - +96479xxxxxxxx
                /^009647[3-9][0-9]{8}$/ // 0096473xxxxxxxx - 0096479xxxxxxxx
            ];
            
            return patterns.some(pattern => pattern.test(phone));
        },
        
        /**
         * التحقق من صحة الرقم الوطني العراقي
         * @param {string} nationalId - الرقم الوطني
         * @returns {boolean} صحيح/خطأ
         */
        isValidIraqiNationalId: function(nationalId) {
            // 10 أرقام تبدأ بـ 1 أو 2
            const regex = /^[1-2]\d{9}$/;
            return regex.test(nationalId);
        },
        
        /**
         * التحقق من صحة كلمة المرور
         * @param {string} password - كلمة المرور
         * @returns {Object} نتيجة التحقق
         */
        validatePassword: function(password) {
            const errors = [];
            
            if (password.length < 8) {
                errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            }
            
            if (!/[A-Z]/.test(password)) {
                errors.push('يجب أن تحتوي على حرف كبير على الأقل');
            }
            
            if (!/[a-z]/.test(password)) {
                errors.push('يجب أن تحتوي على حرف صغير على الأقل');
            }
            
            if (!/\d/.test(password)) {
                errors.push('يجب أن تحتوي على رقم على الأقل');
            }
            
            if (!/[!@#$%^&*]/.test(password)) {
                errors.push('يجب أن تحتوي على رمز خاص على الأقل (!@#$%^&*)');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * التحقق من صحة الاسم العربي
         * @param {string} name - الاسم
         * @returns {boolean} صحيح/خطأ
         */
        isValidArabicName: function(name) {
            const regex = /^[\u0600-\u06FF\s]+$/;
            return regex.test(name);
        },
        
        /**
         * التحقق من صحة العنوان البريدي
         * @param {string} postalCode - الرمز البريدي
         * @returns {boolean} صحيح/خطأ
         */
        isValidPostalCode: function(postalCode) {
            // 5 أرقام للعراق
            const regex = /^\d{5}$/;
            return regex.test(postalCode);
        }
    },
    
    // ===== التخزين المحلي =====
    storage: {
        /**
         * حفظ البيانات في localStorage
         * @param {string} key - المفتاح
         * @param {*} value - القيمة
         * @param {number} ttl - وقت الانتهاء بالثواني
         */
        setItem: function(key, value, ttl = null) {
            const item = {
                value: value,
                timestamp: Date.now(),
                ttl: ttl
            };
            
            localStorage.setItem(key, JSON.stringify(item));
        },
        
        /**
         * قراءة البيانات من localStorage
         * @param {string} key - المفتاح
         * @returns {*} القيمة أو null
         */
        getItem: function(key) {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;
            
            try {
                const item = JSON.parse(itemStr);
                
                // التحقق من انتهاء الصلاحية
                if (item.ttl && Date.now() - item.timestamp > item.ttl * 1000) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return item.value;
            } catch (error) {
                console.error('خطأ في قراءة البيانات:', error);
                return null;
            }
        },
        
        /**
         * حذف البيانات من localStorage
         * @param {string} key - المفتاح
         */
        removeItem: function(key) {
            localStorage.removeItem(key);
        },
        
        /**
         * مسح جميع البيانات
         * @param {boolean} excludeConfig - استث
