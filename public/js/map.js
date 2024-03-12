function initMap(latitude,longitude) {
    var mapOptions = {
        center: {lat: 23.8315 , lng: 91.2868},
        zoom: 15 // You can adjust the zoom level as needed
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}