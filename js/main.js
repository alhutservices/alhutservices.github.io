// main.js – VIP++
// هذا الملف مسؤول عن اختيار السيارة، الحجز، حفظ البيانات في localStorage

// اختيار سيارة
function selectCar(carName) {
    localStorage.setItem("car", carName);
    alert("تم اختيار السيارة: " + carName);
    window.location.href = "booking.html"; // ينقل المستخدم للصفحة التالية
}

// حفظ الميزات الإضافية
function saveExtras(extrasArray){
    localStorage.setItem("extras", extrasArray.join("، "));
}

// الانتقال لصفحة معلومات الزبون
function goToPersonalInfo(){
    window.location.href = "personal-info.html";
}
