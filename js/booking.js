let currentStep = 1;

function showStep(step){
    document.querySelectorAll('.step-content').forEach(s=>{
        s.classList.remove('active');
        if(s.dataset.step == step) s.classList.add('active');
    });
    document.querySelectorAll('.step').forEach(s=>{
        s.classList.remove('active');
        if(s.dataset.step <= step) s.classList.add('active');
    });
}

function nextStep(){
    if(currentStep < 3) currentStep++;
    showStep(currentStep);
}

function prevStep(){
    if(currentStep > 1) currentStep--;
    showStep(currentStep);
}

function selectCar(card){
    document.querySelectorAll('.car-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
}

function toggleAddon(addon){
    addon.classList.toggle('selected');
}

function finishBooking(){
    alert('تم حفظ الحجز! سيتم توجيهك لصفحة التأكيد.');
    window.location.href = 'confirmation.html';
}
