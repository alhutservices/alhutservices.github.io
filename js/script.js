// script.js – VIP++
// هذا الملف مسؤول عن التأثيرات الجمالية على الموقع

// قائمة الموبايل (responsive menu)
const menuBtn = document.querySelector(".menu-btn");
if(menuBtn){
  menuBtn.addEventListener("click", () => {
    document.querySelector(".navbar div").classList.toggle("active");
  });
}

// تأثير Hover على الأزرار
const buttons = document.querySelectorAll("button");
buttons.forEach(btn => {
    btn.addEventListener("mouseover", () => btn.style.opacity = 0.85);
    btn.addEventListener("mouseout", () => btn.style.opacity = 1);
});

// تأثير Hover على كروت السيارات
const cars = document.querySelectorAll(".car");
cars.forEach(card => {
    card.addEventListener("mouseover", () => {
        card.style.transform = "translateY(-10px)";
        card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
    });
    card.addEventListener("mouseout", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
    });
});
