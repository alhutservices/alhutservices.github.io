// استبدل جزء الـ innerHTML في app.js بهذا الشكل:
container.innerHTML = carsToDisplay.map(car => `
    <div class="car-card overflow-hidden">
        <img src="${car.image}" class="w-full h-48 object-cover">
        <div class="p-5">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-xl font-bold text-slate-800">${car.name}</h3>
                <span class="text-blue-600 font-bold">${car.price}$ <small class="text-slate-400">/يوم</small></span>
            </div>
            <div class="flex gap-4 text-sm text-slate-500 mb-6 border-y border-slate-50 py-3">
                <span>👥 ${car.specs.seats} ركاب</span>
                <span>⚙️ ${car.specs.transmission}</span>
            </div>
            <a href="booking.html?carName=${car.name}&carPrice=${car.price}" class="btn-premium block w-full">احجز الآن</a>
        </div>
    </div>
`).join('');
