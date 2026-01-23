// جلب السيارات من cars.json وعرضها
async function fetchCars() {
  const response = await fetch('data/cars.json');
  const cars = await response.json();
  return cars;
}

// عرض السيارات في الصفحة الرئيسية
async function displayFeaturedCars() {
  const cars = await fetchCars();
  const container = document.getElementById('featured-cars');
  container.innerHTML = '';
  cars.slice(0, 4).forEach(car => {
    container.innerHTML += `
      <div class="car-card">
        <img src="${car.image}" alt="${car.name}">
        <div class="info">
          <h3>${car.name}</h3>
          <p>السعر اليومي: ${car.price} د.ع</p>
          <a href="car-details.html?id=${car.id}">التفاصيل</a>
        </div>
      </div>
    `;
  });
}

// عرض تفاصيل السيارة حسب ID
async function displayCarDetails() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('id');
  const cars = await fetchCars();
  const car = cars.find(c => c.id == carId);
  if (!car) return;
  
  const container = document.getElementById('car-details');
  container.innerHTML = `
    <h2>${car.name}</h2>
    <img src="${car.image}" alt="${car.name}" style="width:100%; max-width:600px;">
    <p>السعر اليومي: ${car.price} د.ع</p>
    <p>السعة: ${car.capacity} ركاب</p>
    <p>ناقل الحركة: ${car.transmission}</p>
    <p>نوع الوقود: ${car.fuel}</p>
    <a href="booking.html?car=${car.id}" class="btn">احجز الآن</a>
  `;
}

// تنفيذ عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('featured-cars')) displayFeaturedCars();
  if (document.getElementById('car-details')) displayCarDetails();
});
