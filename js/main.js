// في ملف js/main.js أضف هذا الكود
$(document).ready(function() {
    // معالجة زر "احجز الآن"
    $('.book-btn').on('click', function(e) {
        e.preventDefault();
        
        // تأكد من أن المستخدم مسجل دخول
        if (!isLoggedIn()) {
            showMessage('يرجى تسجيل الدخول أولاً لحجز الموعد', 'info');
            
            // توجيه إلى صفحة تسجيل الدخول مع حفظ الصفحة الحالية
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }
        
        // تأكد من وجود البيانات المطلوبة
        const serviceId = $(this).data('service-id');
        const serviceName = $(this).data('service-name');
        const doctorId = $(this).data('doctor-id');
        const doctorName = $(this).data('doctor-name');
        
        // فتح نموذج الحجز
        openBookingModal(serviceId, serviceName, doctorId, doctorName);
    });
    
    // دالة التحقق من تسجيل الدخول
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true' || 
               sessionStorage.getItem('isLoggedIn') === 'true';
    }
    
    // دالة فتح نموذج الحجز
    function openBookingModal(serviceId, serviceName, doctorId, doctorName) {
        // إعداد البيانات في النموذج
        $('#serviceId').val(serviceId);
        $('#serviceName').val(serviceName);
        $('#doctorId').val(doctorId);
        $('#doctorName').val(doctorName);
        
        // إظهار النموذج
        $('#bookingModal').fadeIn();
        
        // إضافة تأثير
        $('body').addClass('modal-open');
    }
});
