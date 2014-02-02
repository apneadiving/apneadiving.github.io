angular.module('App', ['mgcrea.ngStrap'])

angular.module('App').directive('hightlight', function(){
  return {
    restrict: 'A',
    link: function($scope, element, attrs){
      element.find('pre code').each(function(index, code) {
        $code = $(code);
        var highlight = hljs.highlightAuto($code.text()).value;
        $code.html(highlight);
      });
    }
  };
});

angular.module('App').directive('mapExample', function(){
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      mapExample: '@'
    },
    templateUrl: 'partials/map_example.html',
    controller: [ '$scope' , 'App.MapBuilders', '$timeout', function($scope, builders, $timeout){

      var exampleName = $scope.mapExample;
      var basePath = "partials/" + exampleName;

      $scope.tabs = [
        {
          "title": "Code",
          "template": basePath + "/code.html"
        },
        {
          title: 'Map',
          "template": basePath + "/map.html"
        }
      ];

      $scope.$watch('tab.active', function(newValue){
        if (newValue == 1 && !$scope.mapLoaded){
          $scope.mapLoaded = true;
          $timeout(builders[exampleName], 200);
        }
      });

      $scope.tab = {
        active: 1,
        mapLoaded: false
      };
    }]
  }
});

angular.module('App').service('App.MapBuilders', function(){

  return {
    basic_map: function(){
      var handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'basic_map' }});
    },

    one_marker: function(){
      var handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'one_marker'}}, function(){
        var markers = handler.addMarkers([
          {
            lat: 0,
            lng: 0,
            picture: {
              url: "https://addons.cdn.mozilla.net/img/uploads/addon_icons/13/13028-64.png",
              width:  36,
              height: 36
            },
            infowindow: "hello!"
          }
        ]);
      });
    },
    custom_style: function(){
      var mapStyle = [
        {
            "featureType": "water",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        },
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        }
      ];

      var handler = Gmaps.build('Google');
      handler.buildMap({
          internal: {id: 'custom_style'},
          provider: {
            zoom:     15,
            center:    new google.maps.LatLng(53.385873, -1.471471),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles:    mapStyle
          }
        },
        function(){ }
      );

    },
    multi_markers: function(){
      var handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'multi_markers'}}, function(){
        var markers = handler.addMarkers([
          { lat: 43, lng: 3.5},
          { lat: 45, lng: 4},
          { lat: 47, lng: 3.5},
          { lat: 49, lng: 4},
          { lat: 51, lng: 3.5}
        ]);
        handler.bounds.extendWith(markers);
        handler.fitMapToBounds();
      });
    },

  };
})
