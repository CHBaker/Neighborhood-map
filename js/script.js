var locations = [
    {title: 'US Holocaust Museum', 
        location: {lat: 38.886925, lng: -77.032607}},
    {title: 'Smithsonian National Air and Space Museum',
        location: {lat: 38.888344, lng: -77.019836}},
    {title: 'Smithsonian National Museum of Natural History',
        location: {lat: 38.891433, lng: -77.026001}},
    {title: 'Library of Congress',
        location: {lat: 38.888893, lng: -77.004698}},
    {title: 'Lincoln Memorial',
        location: {lat: 38.889553, lng: -77.050144}},
    {title: 'The White House',
        location: {lat: 38.897910, lng: -77.036617}},
    {title: 'Vietnam Veterans Memorial',
        location: {lat: 38.891277, lng: -77.047670}},
    {title: 'United States Capitol',
        location: {lat: 38.890248, lng: -77.009061}},
    {title: 'Newseum',
        location: {lat: 38.893273, lng: -77.019274}},
    {title: 'Washington National Cathedral',
        location: {lat: 38.930778, lng: -77.070716}}
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

};

var ViewModel = function () {
    var self = this;

    var markers = [];

    function initMap () {
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
    };

    // create marker icon styles
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // show default locations with markers
    for (var i = 0; i < locations.length; i++) {
        // get each location from the array
        var position = locations[i].location;
        var title = locations[i].title;
        // create marker, add to array
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });

        markers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(self, largeInfowindow);
        });
        marker.addListener('mouseover', function() {
            self.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            self.setIcon(defaultIcon);
        });
    };
};

function appInit () {
    ko.applyBindings(new ViewModel());
};