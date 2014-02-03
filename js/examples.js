var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

angular.module('App', ['mgcrea.ngStrap']);

angular.module('App').directive('anchorList', function($rootScope, $location, $anchorScroll) {
  return {
    link: function(scope, element){
      element.on('click', function(evt) {
        var el = angular.element(evt.target);
        var hash = el.attr('href');
        if(!hash || hash[0] !== '#') return;
        if(hash.length > 1 && hash[1] === '/') return;
        if(evt.which !== 1) return;
        evt.preventDefault();
        $location.hash(hash.substr(1));
        $anchorScroll();
      });
      // Initial $anchorScroll()
      setTimeout(function() {
        $anchorScroll();
      }, 400);
    }
  }
});

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

angular.module('App').directive('mapExample', [ 'App.MapBuilders', '$timeout', function(builders, $timeout){
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      mapExample:  '@',
      customHtml:  '@'
    },
    templateUrl: 'partials/map_example.html',
    link: function($scope, element){
      var mapLoaded = false;
      var exampleName = $scope.mapExample;
      var basePath = "partials/" + exampleName;

      var map_template = $scope.customHtml ? (basePath + "/map.html") : "partials/map.html"

      $scope.tabs = [
        {
          "title": "Code",
          "template": basePath + "/code.html"
        },
        {
          title: 'Map',
          "template": map_template
        }
      ];

      var buildMap = function(){
        if(isMapDomReady()){
          builders[exampleName]()
        }
        else{
          //because bs-tabs may not have rendered so far...
          $timeout(buildMap, 100);
        }
      };

      var isMapDomReady = function(){
        return (element.find('div.map').length > 0);
      };

       $scope.$watch('tab.active', function(newValue){
        if (newValue == 1 && !mapLoaded){
          mapLoaded = true;
          buildMap();
        }
      });

      $scope.tab = {
        active: 1
      };
    }
  }
}]);

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
    multi_overlays: function(){
      var handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'multi_overlays'}}, function(){


        var circles = handler.addCircles(
          [{ lat: 51, lng: -6, radius: 50000 }],
          { strokeColor: '#FF0000'}
        );

        var polylines = handler.addPolylines(
          [
            [
              {lat: 42, lng: -6},
              {lat: 50, lng: -6}
            ]
          ],
          { strokeColor: '#FF0000'}
        );

        var polygons = handler.addPolygons(
          [
            [
              {lat:  48, lng: -3.5}, { lat: 51, lng: -0.5},
              {lat:  48, lng:  2.5}, { lat: 51, lng:  5.5},
              {lat:  48, lng:  8.5}, { lat: 42, lng:  2.5},
            ]
          ],
          { strokeColor: '#FF0000'}
        );

        handler.bounds.extendWith(polylines);
        handler.bounds.extendWith(polygons);
        handler.bounds.extendWith(circles);
        handler.fitMapToBounds();
      });
    },
    with_kml: function(){
      var handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'with_kml'}}, function(){
        var kmls = handler.addKml(
          { url: "http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml" }
        );
      });
    },
    custom_builder: function(){

      CustomMarkerBuilder = (function(_super) {
        __extends(CustomMarkerBuilder, _super);

        function CustomMarkerBuilder() {
          return CustomMarkerBuilder.__super__.constructor.apply(this, arguments);
        }

        CustomMarkerBuilder.prototype.create_marker = function() {
          var options;
          options = _.extend(this.marker_options(), this.rich_marker_options());
          return this.serviceObject = new RichMarker(options);
        };

        CustomMarkerBuilder.prototype.rich_marker_options = function() {
          var marker;
          marker = document.createElement("div");
          marker.setAttribute('class', 'custom_marker_content');
          marker.innerHTML = this.args.custom_marker;
          return {
            content: marker
          };
        };

        CustomMarkerBuilder.prototype.create_infowindow = function() {
          var boxText;
          if (!_.isString(this.args.custom_infowindow)) {
            return null;
          }
          boxText = document.createElement("div");
          boxText.setAttribute("class", 'custom_infowindow_content');
          boxText.innerHTML = this.args.custom_infowindow;
          return this.infowindow = new InfoBox(this.infobox(boxText));
        };

        CustomMarkerBuilder.prototype.infobox = function(boxText) {
          return {
            content: boxText,
            pixelOffset: new google.maps.Size(-140, 0),
            boxStyle: {
              width: "280px"
            }
          };
        };

        return CustomMarkerBuilder;

      })(Gmaps.Google.Builders.Marker);

      var handler = Gmaps.build('Google', { builders: { Marker: CustomMarkerBuilder } })
      handler.buildMap({ internal: {id: 'custom_builder'}}, function(){
        var marker = handler.addMarker(
          {
            lat:  40.689167,
            lng: -74.044444,
            custom_marker:     "<img src='images/star.jpg' width='30' height='30'> Statue of Liberty",
            custom_infowindow: "<img src='images/statue.jpg' width='90' height='140'> The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in the middle of New York"
          }
        );
        handler.map.centerOn(marker);
        handler.getMap().setZoom(15);
      });
    },
    sidebar_builder: function(){
      function createSidebarLi(json){
        return ("<li><a>" + json.name + "<\/a><\/li>");
      };

      function bindLiToMarker($li, marker){
        $li.on('click', function(){
          marker.panTo();
          google.maps.event.trigger(marker.getServiceObject(), 'click');
        })
      };

      function createSidebar(json_array){
        _.each(json_array, function(json){
          var $li = $( createSidebarLi(json) );
          $li.appendTo('#sidebar_container');
          bindLiToMarker($li, json.marker);
        });
      };

      handler = Gmaps.build('Google');
      handler.buildMap({ internal: {id: 'sidebar_builder'}}, function(){
        var json_array = [
          { lat: 40, lng: -80, name: 'Foo', infowindow: "I'm Foo" },
          { lat: 45, lng: -90, name: 'Bar', infowindow: "I'm Bar" },
          { lat: 50, lng: -85, name: 'Baz', infowindow: "I'm Baz" }
        ];

        var markers = handler.addMarkers(json_array);

        _.each(json_array, function(json, index){
          json.marker = markers[index];
        });

        createSidebar(json_array);
        handler.bounds.extendWith(markers);
        handler.fitMapToBounds();
      });
    }
  };
})
