/**
 * auth.js - إدارة المصادقة والصلاحيات
 */

const auth = {
    // تسجيل الدخول
    login: async function(email, password) {
        try {
            // التحقق من المدخلات
            if (!validator.isEmail(email)) {
                throw new Error('البريد الإلكتروني غير صحيح');
            }
            
            if (!validator.isNotEmpty(password)) {
                throw new Error('كلمة المرور مطلوبة');
            }
            
            // جلب المستخدمين
            const users = storage.get('users') || [];
            
            // البحث عن المستخدم
            const user = users.find(u => 
                u.email === email && u.password === password
            );
            
            if (!user) {
                throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            
            // حفظ بيانات المستخدم (بدون كلمة المرور)
            const userData = { ...user };
            delete userData.password;
            
            storage.set('currentUser', userData);
            storage.set('token', this.generateToken(userData));
            
            // تسجيل نشاط الدخول
            this.logActivity(userData.id, 'تسجيل الدخول');
            
            return {
                success: true,
                user: userData,
                message: 'تم تسجيل الدخول بنجاح'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // تسجيل الخروج
    logout: function() {
        const user = storage.get('currentUser');
        
        if (user) {
            // تسجيل نشاط الخروج
            this.logActivity(user.id, 'تسجيل الخروج');
        }
        
        // مسح بيانات المستخدم
        storage.remove('currentUser');
        storage.remove('token');
        
        // توجيه إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
    },
    
    // التحقق من حالة تسجيل الدخول
    isAuthenticated: function() {
        const token = storage.get('token');
        const user = storage.get('currentUser');
        
        return !!(token && user);
    },
    
    // التحقق من الصلاحيات
    hasRole: function(requiredRole) {
        const user = storage.get('currentUser');
        
        if (!user) return false;
        
        // إذا كان المستخدم مديراً، فلديه جميع الصلاحيات
        if (user.role === 'admin') return true;
        
        // التحقق من الصلاحية المطلوبة
        return user.role === requiredRole;
    },
    
    // التحقق من الصلاحيات المتعددة
    hasAnyRole: function(roles) {
        const user = storage.get('currentUser');
        
        if (!user) return false;
        
        if (user.role === 'admin') return true;
        
        return roles.includes(user.role);
    },
    
    // توليد رمز مميز
    generateToken: function(userData) {
        const timestamp = Date.now();
        const data = `${userData.id}-${userData.email}-${timestamp}`;
        
        // توليد رمز بسيط (في التطبيق الحقيقي، استخدم مكتبة مثل jwt)
        return btoa(data);
    },
    
    // تسجيل النشاط
    logActivity: function(userId, action, details = {}) {
        const activity = {
            id: `ACT_${Date.now()}`,
            userId,
            action,
            details,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP()
        };
        
        // حفظ النشاط
        const activities = storage.get('activities') || [];
        activities.unshift(activity);
        storage.set('activities', activities.slice(0, 100)); // حفظ آخر 100 نشاط فقط
    },
    
    // الحصول على IP العميل (محاكاة)
    getClientIP: function() {
        return '192.168.1.1'; // في التطبيق الحقيقي، احصل على IP من الخادم
    },
    
    // تغيير كلمة المرور
    changePassword: function(currentPassword, newPassword, confirmPassword) {
        const user = storage.get('currentUser');
        
        if (!user) {
            return {
                success: false,
                error: 'يجب تسجيل الدخول أولاً'
            };
        }
        
        // التحقق من كلمة المرور الحالية
        const users = storage.get('users');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (users[userIndex].password !== currentPassword) {
            return {
                success: false,
                error: 'كلمة المرور الحالية غير صحيحة'
            };
        }
        
        // التحقق من تطابق كلمتي المرور الجديدتين
        if (newPassword !== confirmPassword) {
            return {
                success: false,
                error: 'كلمات المرور غير متطابقة'
            };
        }
        
        // التحقق من قوة كلمة المرور
        if (newPassword.length < 6) {
            return {
                success: false,
                error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            };
        }
        
        // تحديث كلمة المرور
        users[userIndex].password = newPassword;
        storage.set('users', users);
        
        // تسجيل النشاط
        this.logActivity(user.id, 'تغيير كلمة المرور');
        
        return {
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح'
        };
    },
    
    // تحديث الملف الشخصي
    updateProfile: function(profileData) {
        const user = storage.get('currentUser');
        
        if (!user) {
            return {
                success: false,
                error: 'يجب تسجيل الدخول أولاً'
            };
        }
        
        // التحقق من البيانات
        if (profileData.email && !validator.isEmail(profileData.email)) {
            return {
                success: false,
                error: 'البريد الإلكتروني غير صحيح'
            };
        }
        
        if (profileData.phone && !validator.isIraqiPhone(profileData.phone)) {
            return {
                success: false,
                error: 'رقم الهاتف غير صحيح'
            };
        }
        
        // تحديث بيانات المستخدم
        const users = storage.get('users');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        // تحديث البيانات
        users[userIndex] = {
            ...users[userIndex],
            ...profileData
        };
        
        // حفظ المستخدمين المحدثين
        storage.set('users', users);
        
        // تحديث بيانات المستخدم الحالي
        const updatedUser = { ...user, ...profileData };
        storage.set('currentUser', updatedUser);
        
        // تسجيل النشاط
        this.logActivity(user.id, 'تحديث الملف الشخصي', { fields: Object.keys(profileData) });
        
        return {
            success: true,
            user: updatedUser,
            message: 'تم تحديث الملف الشخصي بنجاح'
        };
    },
    
    // حماية المسارات
    protectRoute: function(requiredRole = null) {
        return function(req, res, next) {
            if (!auth.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            
            if (requiredRole && !auth.hasRole(requiredRole)) {
                notificationManager.show('ليس لديك صلاحية للوصول إلى هذه الصفحة', 'error');
                window.history.back();
                return;
            }
            
            next();
        };
    },
    
    // تهيئة حماية الصفحات
    initPageProtection: function() {
        // صفحات تحتاج تسجيل دخول
        const protectedPages = [
            'admin-dashboard.html',
            'admin-add-car.html',
            'admin-cars-list.html',
            'admin-bookings.html',
            'admin-users.html',
            'admin-reports.html',
            'admin-settings.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            if (!this.isAuthenticated()) {
                window.location.href = '../login.html';
                return;
            }
            
            // للصفحات الإدارية، التحقق من كون المستخدم مديراً
            if (currentPage.startsWith('admin-') && !this.hasRole('admin')) {
                notificationManager.show('يجب أن تكون مديراً للوصول إلى هذه الصفحة', 'error');
                window.location.href = '../index.html';
                return;
            }
        }
    }
};

// جعل الوظائف متاحة عالمياً
window.auth = auth;

// تهيئة حماية الصفحات عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    auth.initPageProtection();
});
