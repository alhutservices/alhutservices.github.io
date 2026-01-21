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
  
