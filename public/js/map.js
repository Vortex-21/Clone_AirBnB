function initMap() {
    var mapOptions = {
        center: {lat:Number(latitude), lng: Number(longitude)},
        zoom: 10 // You can adjust the zoom level as needed
    };
    var marker = new google.maps.Marker({
        position: {lat:Number(latitude), lng: Number(longitude)}, // New York City coordinates
        map: map, // Map to add the marker to
        title: 'Destination' // Tooltip text when hovering over the marker
    });
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}