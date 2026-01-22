document.getElementById("car").value = localStorage.getItem("car");

document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();

  let car = document.getElementById("car").value;
  let name = document.getElementById("name").value;
  let id = document.getElementById("id").value;
  let phone = document.getElementById("phone").value;
  let location = document.getElementById("location").value;

  let extras = [];
  document.querySelectorAll("input[type=checkbox]:checked").forEach(e => {
    extras.push(e.value);
  });

  let message = `
🚗 حجز جديد – الحوت لتأجير السيارات

السيارة: ${car}
الاسم: ${name}
الهوية/الجواز: ${id}
هاتف الزبون: ${phone}
موقع الاستلام: ${location}
الميزات الإضافية: ${extras.join("، ") || "لا يوجد"}
`;

  let whatsapp = "https://wa.me/9647713225471?text=" + encodeURIComponent(message);
  window.open(whatsapp, "_blank");
});
