async function displayCars(cars) {
  const container = document.getElementById('cars-list');
  container.innerHTML = '';
  cars.forEach(car => {
    container.innerHTML += `
      <div class="car-card">
        <img src="${car.image}" alt="${car.name}">
        <div class="info">
          <h3>${car.name}</h3>
          <p>السعر اليومي: ${car.price} د.ع</p>
          <p>السعة: ${car.capacity} ركاب</p>
          <p>ناقل الحركة: ${car.transmission}</p>
          <a href="car-details.html?id=${car.id}">التفاصيل</a>
        </div>
      </div>
    `;
  });
}

async function filterCars(event) {
  event.preventDefault();
  const type = document.getElementById('type').value;
  const capacity = document.getElementById('capacity').value;
  const transmission = document.getElementById('transmission').value;
  const price = document.getElementById('price').value;

  const response = await fetch('data/cars.json');
  let cars = await response.json();

  if (type) cars = cars.filter(c => c.type === type);
  if (capacity) cars = cars.filter(c => c.capacity == capacity);
  if (transmission) cars = cars.filter(c => c.transmission === transmission);
  if (price) cars = cars.filter(c => c.price <= price);

  displayCars(cars);
}

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('data/cars.json');
  const cars = await response.json();
  displayCars(cars);

  document.getElementById('filter-form').addEventListener('submit', filterCars);
});
