var infoWindow;

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

// Wikipedia articles function
var GetWiki = function (query) {
    var wikiElem = document.getElementById('wiki-links');
    wikiElem.innerHTML = ("");
    var wikiURL = ("https://en.wikipedia.org/w/api.php?action=opensearch&search="
                       + query 
                       + "&format=json&callback=wikiCallback");

    var wikiRequestTimeout = setTimeout(function() {
        wikiElem.innerHTML = ("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        // jsonp: 'callback'
        success: function( response ) {
            console.log(response);
            var articleList = response;
            console.log(response);

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                wikiElem.innerHTML +=('<li id="wiki-l"><a id="wiki-a" target="_blank" href="' + url + '">'
                                 + url + '</a></li>');

            };

            clearTimeout(wikiRequestTimeout);
        }
    });
}

// model
var Place = function (locations, vm) {
    var self = this;
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
    var defaultIcon = makeMarkerIcon('EBB851');
    var highlightedIcon = makeMarkerIcon('FF7878');

    this.marker = new google.maps.Marker({
        position: position,
        title: this.title(),
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: id,
        map: map,
        visible: true
    });

    this.marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
        map.panTo(this.position);
        this.setAnimation(google.maps.Animation.BOUNCE);

        var marker = this;

        setTimeout(function () {
            marker.setAnimation(null);
        }, 750);

        // update current location
        vm.currentLocation(marker);

    }, this);

    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });

    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    google.maps.event.addListener(map, "click", function(event) {
        infoWindow.close();
    });

    populateInfoWindow = function (marker, infowindow) {
        // make sure infowindow is not open already
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

    infoWindowInitialize = function () {
        var infoWindowHtml = '<div id="info-window" data-bind="template:' + 
                         '{ name: \'info-template\'}"></div>';

        infoWindow = new google.maps.InfoWindow({
            content: infoWindowHtml
        });

        var infoWindowLoaded = false;

        google.maps.event.addListener(infoWindow, 'domready', function () {
            if (!infoWindowLoaded) {
                ko.applyBindings(self, document.getElementById('info-window'));
                infoWindowLoaded = true;
            }
        });
    }

    infoWindowInitialize();

    // push locations to observable array
    locations.forEach(function (location) {
        self.locationsList().push( new Place (location, self));
    });

    // current location
    self.currentLocation = ko.observable(this.locationsList()[0]);

    // filter functionality, var set blank
    this.filter = ko.observable("");

    this.filterList = ko.computed(function () {
        var matches = self.locationsList().filter(function (item) {
            if (item.title().toLowerCase().indexOf(self.filter().toLowerCase()) >= 0) {
                item.marker.setVisible(true);
            } else {
                item.marker.setVisible(false);
            };
            return item.title().toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
        });
        
        return matches
    });

    // show and hide menu
    this.showClass = ko.observable(false);

    this.toggleMenu = function () {
        this.showClass(!this.showClass());
        if (this.showClass() === true) {
            map.panTo({lat: 38.905076, lng: -77.062898});
        } else {
            map.panTo({lat: 38.903540, lng: -77.036548});
            self.filter("");
        };
    };

    // show and hide wiki article container
    this.showWiki = ko.observable(false);

    this.toggleWiki = function () {
        self.showWiki(!self.showWiki());
        GetWiki(self.currentLocation().title);
    };

    // close wiki modal
    google.maps.event.addListener(map, "click", function(event) {
        self.showWiki(false);
    });


    // trigger marker click, when list item is clicked
    this.triggerMarker = function (place) {
        google.maps.event.trigger(place.marker, 'click');
    };
};

appInit = function () {
    ko.applyBindings(new ViewModel());
};

// animations with Jquery
$(function () {
    // slide down for menu
    $("#menuIcon").click(function () {
        $("#menuIcon").toggleClass("rotate", 1000);
        if($("#container").css("height") === "70px") {
            $("#dropdown").fadeIn(1000).slideDown(1000);
        } else if ($("#container").css("height") === "550px") {
            $("#dropdown").fadeOut(500).slideUp(500);
        };
    });
});