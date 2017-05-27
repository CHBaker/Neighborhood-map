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

var initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.907280, lng: -77.034488},
      zoom: 13,
      styles: mapstyle,
      mapTypeControl: false
    });
}

var destination = function () {

};

var ViewModel = function () {
    var self = this;
};

ko.applyBindings(new ViewModel());