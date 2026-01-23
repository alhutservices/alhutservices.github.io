const cars = [
  {
    name: "Toyota Camry 2023",
    category: "عائلية",
    gear: "أوتوماتيك",
    fuel: "بنزين",
    price: 70,
    image: "images/camry.jpg"
  },
  {
    name: "BMW X5",
    category: "SUV",
    gear: "أوتوماتيك",
    fuel: "بنزين",
    price: 120,
    image: "images/bmw.jpg"
  }
];

const grid = document.getElementById("carsGrid");

function renderCars(list) {
  grid.innerHTML = "";
  list.forEach(car => {
    grid.innerHTML += `
      <div class="car-card">
        <span class="badge">${car.category}</span>
        <img src="${car.image}">
        <div class="content">
          <h3>${car.name}</h3>
          <ul>
            <li>🚘 ناقل: ${car.gear}</li>
            <li>⛽ وقود: ${car.fuel}</li>
          </ul>
          <div class="price">${car.price}$ / يوم</div>
          <a href="car-details.html">تفاصيل السيارة</a>
        </div>
      </div>
    `;
  });
}

renderCars(cars);
