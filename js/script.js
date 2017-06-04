var infoWindow;

// animations with Jquery
$(function () {
    // slide down for menu
    $("#menuIcon").click(function () {
        $("#dropdown").slideToggle(1000);
        $("#menuIcon").toggleClass("rotate");
    });
});

var locations = [
    {title: 'US Holocaust Museum', 
        location: {lat: 38.886925, lng: -77.032607},
        id: 1},
    {title: 'Smithsonian National Air and Space Museum',
        location: {lat: 38.888344, lng: -77.019836},
        id: 2},
    {title: 'Smithsonian National Museum of Natural History',
        location: {lat: 38.891433, lng: -77.026001},
        id: 3},
    {title: 'Library of Congress',
        location: {lat: 38.888893, lng: -77.004698},
        id: 4},
    {title: 'Lincoln Memorial',
        location: {lat: 38.889553, lng: -77.050144},
        id: 5},
    {title: 'The White House',
        location: {lat: 38.897910, lng: -77.036617},
        id: 6},
    {title: 'Vietnam Veterans Memorial',
        location: {lat: 38.891277, lng: -77.047670},
        id: 7},
    {title: 'United States Capitol',
        location: {lat: 38.890248, lng: -77.009061},
        id: 8},
    {title: 'Newseum',
        location: {lat: 38.893273, lng: -77.019274},
        id: 9},
    {title: 'Washington National Cathedral',
        location: {lat: 38.930778, lng: -77.070716},
        id: 10}
];

var mapstyle = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
];

var Place = function (locations) {
    var position = locations.location;
    this.title = ko.observable(locations.title);
    var id = locations.id;

    makeMarkerIcon = function (markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'
            + markerColor 
            + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    };

    // create marker icon styles
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    this.marker = new google.maps.Marker({
        position: position,
        title: this.title(),
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: id,
        map: map
    });

    this.marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
        // setAnimation(google.maps.Animation.BOUNCE);
        // setTimeout(function () {
        //     this.setAnimation(null);
        // }, 750);
    }, this);

    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });

    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    populateInfoWindow = function (marker, infowindow) {
        // make sure infowindow is not open already
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // if Status OK, comput position of street view image
            getStreetView = function (data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title
                        + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title
                        + '</div><div>No Street View Found</div>');
                };
            };

            // get the closest streetview image within 50 meters of marker
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open infowindow on the selected marker
            infowindow.open(map, marker);
        };
    };
};

var ViewModel = function () {
    var self = this;

    this.locationsList = ko.observableArray([]);

    // create main map, google maps api
    map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: 38.905076, lng: -77.062898},
        center: {lat: 38.903540, lng: -77.036548},
        zoom: 13,
        styles: mapstyle,
        mapTypeControl: false,
    });

    infoWindow = new google.maps.InfoWindow();

    locations.forEach(function (location) {
        self.locationsList.push( new Place (location));
    });

    this.showClass = ko.observable(false);

    this.toggleMenu = function () {
        this.showClass(!this.showClass());
        if (this.showClass() === true) {
            map.panTo({lat: 38.905076, lng: -77.062898});
        } else {
            map.panTo({lat: 38.903540, lng: -77.036548});
        };
    };

    this.populateInfoWindow = function (marker, infowindow) {
        // make sure infowindow is not open already
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // if Status OK, comput position of street view image
            getStreetView = function (data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title
                        + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title
                        + '</div><div>No Street View Found</div>');
                };
            };

            // get the closest streetview image within 50 meters of marker
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open infowindow on the selected marker
            infowindow.open(map, marker);
        };
    };
};

appInit = function () {
    ko.applyBindings(new ViewModel());
};