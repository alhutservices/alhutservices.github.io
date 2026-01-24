function initMap() {
  const mapDiv = document.getElementById('map');
  const defaultLocation = { lat: 33.3152, lng: 44.3661 }; // بغداد كموقع افتراضي

  const map = new google.maps.Map(mapDiv, {
    zoom: 12,
    center: defaultLocation
  });

  const marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true
  });

  google.maps.event.addListener(marker, 'dragend', function() {
    const pos = marker.getPosition();
    console.log('موقع الزبون:', pos.lat(), pos.lng());
  });
}

// يجب إضافة رابط API من Google Maps في index.html أو personal-info.html
// <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
