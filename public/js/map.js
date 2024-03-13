function initMap() {
  var mapOptions = {
    center: { lat: Number(latitude), lng: Number(longitude) },
    zoom: 10, // You can adjust the zoom level as needed
    
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({
    position: { lat: Number(latitude), lng: Number(longitude) }, // New York City coordinates
    map: map, // Map to add the marker to
    title: "Destination", // Tooltip text when hovering over the marker
  });

  // Create a new info window
  var infoWindow = new google.maps.InfoWindow({
    content: '<h4>Exact Location will be provided after booking.</h4>' // Content of the info window
});

// Open the info window when the marker is clicked
marker.addListener('mouseover', function() {
    infoWindow.open(map, marker);
});
marker.addListener('mouseout', function() {
    infoWindow.close();
});
}
