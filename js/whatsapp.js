function sendToWhatsApp(bookingData) {
    const phoneNumber = "9647713225471";
    const message = `
*حجز جديد من موقع الحوت* 🐋
--------------------------
👤 *العميل:* ${bookingData.name}
📞 *الهاتف:* ${bookingData.phone}
🚗 *السيارة:* ${bookingData.carName}
📅 *التاريخ:* من ${bookingData.startDate} إلى ${bookingData.endDate}
📍 *الموقع:* ${bookingData.location}
💰 *الإجمالي:* ${bookingData.totalPrice} دينار
--------------------------
*ملاحظة: العميل اختار الدفع نقداً عند الاستلام.*
    `;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}
