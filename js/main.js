// Al-Hut Main Engine - 2026
document.addEventListener('DOMContentLoaded', () => {
    console.log("Al-Hut Automotive System Initialized... 🐋");

    // تأثير ظهور العناصر تدريجياً عند التمرير
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    // استهداف صناديق المميزات للتفاعل
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(card);
    });
});

// وظيفة اهتزاز الإيموجي عند الحجز لتنبيه المستخدم
function shakeEmoji() {
    const emoji = document.querySelector('.whale-emoji');
    if(emoji) {
        emoji.style.animation = 'none';
        setTimeout(() => {
            emoji.style.animation = 'swim 3s ease-in-out infinite';
        }, 10);
    }
}
