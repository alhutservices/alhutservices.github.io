// utils.js – VIP++
// هذا الملف يحتوي على وظائف يمكن إعادة استخدامها في كل صفحات الموقع

// التحقق من رقم الهاتف العراقي
function validatePhone(phone){
    const regex = /^07\d{8}$/; // يبدأ بـ 07 ويليه 8 أرقام
    return regex.test(phone);
}

// التحقق من أن جميع الحقول ممتلئة
function validateForm(fields){
    for(let key in fields){
        if(fields[key].trim() === ""){
            return false;
        }
    }
    return true;
}

// إنشاء رسالة واتساب جاهزة
function createWhatsAppMessage(){
    const data = {
        car: localStorage.getItem("car"),
        extras: localStorage.getItem("extras") || "-",
        name: localStorage.getItem("name"),
        id: localStorage.getItem("id"),
        phone: localStorage.getItem("phone"),
        location: localStorage.getItem("location")
    };

    return `
🚗 حجز جديد – الحوت لتأجير السيارات

السيارة: ${data.car}
الميزات: ${data.extras}
الاسم: ${data.name}
الهوية: ${data.id}
الهاتف: ${data.phone}
موقع الاستلام: ${data.location}
`;
}

// إرسال رسالة واتساب
function sendWhatsApp(){
    const msg = encodeURIComponent(createWhatsAppMessage());
    const url = "https://wa.me/9647713225471?text=" + msg;
    window.open(url, "_blank");
}
