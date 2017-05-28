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

var destination = function () {
    this.position = ko.observable(locations.location);
    this.title = ko.observable(locations.title);
    this.id = ko.observable(locations.id);
};

var ViewModel = function () {
    var self = this;

    this.markers = ko.observableArray([]);

    // create main map, google maps api
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.907280, lng: -77.034488},
      zoom: 13,
      styles: mapstyle,
      mapTypeControl: false
    });

    makeMarkerIcon = function (markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'
            + markerColor 
            + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage
    };

    // create marker icon styles
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // show default locations with markers
    locations.forEach(function (location) {
        marker = new google.maps.Marker({
            position: location.location,
            title: location.title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: location
        });

        self.markers.push( new destination (marker));

        marker.addListener('click', function() {
            populateInfoWindow(self, largeInfowindow);
        });
        marker.addListener('mouseover', function() {
            self.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            self.setIcon(defaultIcon);
        });
    });
};

function appInit () {
    ko.applyBindings(new ViewModel());
};