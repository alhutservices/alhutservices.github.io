$(document).ready(function() {
    // تعيين سنة حقوق النشر
    $('#currentYear').text(new Date().getFullYear());

    // إدارة عرض/إخفاء رسائل التنبيه
    window.showMessage = function(message, type = 'error') {
        const messageDiv = $('#loginMessage');
        messageDiv.removeClass('success error info').addClass(type);
        messageDiv.html(`
            <span>${message}</span>
            <button class="close-btn" onclick="$(this).parent().fadeOut()">
                <i class="fas fa-times"></i>
            </button>
        `);
        messageDiv.fadeIn();
        
        // إخفاء الرسالة تلقائياً بعد 5 ثوانٍ
        setTimeout(() => {
            messageDiv.fadeOut();
        }, 5000);
    };

    // التحقق من صحة البيانات
    function validateForm() {
        let isValid = true;
        
        // إعادة تعيين أخطاء سابقة
        $('.input-error').text('');
        $('.form-group input').removeClass('error');

        const username = $('#username').val().trim();
        const password = $('#password').val();

        // التحقق من اسم المستخدم
        if (!username) {
            $('#usernameError').text('يرجى إدخال اسم المستخدم');
            $('#username').addClass('error');
            isValid = false;
        } else if (username.length < 3) {
            $('#usernameError').text('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
            $('#username').addClass('error');
            isValid = false;
        }

        // التحقق من كلمة المرور
        if (!password) {
            $('#passwordError').text('يرجى إدخال كلمة المرور');
            $('#password').addClass('error');
            isValid = false;
        } else if (password.length < 6) {
            $('#passwordError').text('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            $('#password').addClass('error');
            isValid = false;
        }

        return isValid;
    }

    // معالجة تسجيل الدخول
    $('#adminLoginForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // عرض حالة التحميل
        const loginBtn = $('#loginBtn');
        const loginText = $('#loginText');
        const loginLoading = $('#loginLoading');
        
        loginBtn.prop('disabled', true);
        loginText.hide();
        loginLoading.show();

        // جمع بيانات النموذج
        const formData = {
            username: $('#username').val().trim(),
            password: $('#password').val(),
            remember: $('#remember').is(':checked')
        };

        // محاكاة اتصال API (استبدل هذا بالاتصال الفعلي)
        setTimeout(() => {
            // هذا مثال، استبدله بطلب AJAX حقيقي
            $.ajax({
                url: 'api/admin-login.php',
                method: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...', 'success');
                        
                        // حفظ بيانات الجلسة إذا تم اختيار "تذكرني"
                        if (formData.remember) {
                            localStorage.setItem('adminRemember', 'true');
                            localStorage.setItem('adminUsername', formData.username);
                        } else {
                            sessionStorage.setItem('adminLoggedIn', 'true');
                        }
                        
                        // التوجيه إلى لوحة التحكم بعد تأخير قصير
                        setTimeout(() => {
                            window.location.href = 'admin-dashboard.html';
                        }, 1500);
                    } else {
                        showMessage(response.message || 'بيانات الدخول غير صحيحة');
                    }
                },
                error: function(xhr, status, error) {
                    showMessage('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
                    console.error('Login error:', error);
                },
                complete: function() {
                    // إعادة تعيين حالة الزر
                    loginBtn.prop('disabled', false);
                    loginText.show();
                    loginLoading.hide();
                }
            });

            // مثال بسيط للاختبار (احذفه عند التنفيذ الفعلي)
            /*
            if (formData.username === 'admin' && formData.password === '123456') {
                showMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
            } else {
                showMessage('اسم المستخدم أو كلمة المرور غير صحيحة');
                loginBtn.prop('disabled', false);
                loginText.show();
                loginLoading.hide();
            }
            */
        }, 1000);
    });

    // استعادة بيانات "تذكرني" إذا كانت موجودة
    if (localStorage.getItem('adminRemember') === 'true') {
        const savedUsername = localStorage.getItem('adminUsername');
        if (savedUsername) {
            $('#username').val(savedUsername);
            $('#remember').prop('checked', true);
        }
    }

    // إضافة تأثيرات للتركيز
    $('input').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });

    // السماح بتسجيل الدخول باستخدام Enter
    $(document).on('keypress', function(e) {
        if (e.which === 13 && !$('#loginBtn').prop('disabled')) {
            $('#adminLoginForm').submit();
        }
    });

    // التحقق من حالة المصادقة الحالية
    if (sessionStorage.getItem('adminLoggedIn') === 'true' || 
        localStorage.getItem('adminRemember') === 'true') {
        // يمكن توجيه المستخدم مباشرة إلى لوحة التحكم
        // window.location.href = 'admin-dashboard.html';
    }

    // إضافة فئة focused عند التركيز على الحقول
    $('input').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });
});
