function initMap() {
    var mapOptions = {
        center: {lat:Number(latitude), lng: Number(longitude)},
        zoom: 15 // You can adjust the zoom level as needed
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}