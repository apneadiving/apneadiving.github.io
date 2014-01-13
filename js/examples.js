hljs.initHighlightingOnLoad();

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
    scope: {
      mapExample: '@'
    },
    templateUrl: 'partials/map_example.html',
    controller: [ '$scope' , 'App.MapBuiders', '$timeout', function($scope, builders, $timeout){

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

      $scope.tab = {
        active: 0,
        mapLoaded: false
      };

      $scope.$watch('tab.active', function(newValue){
        if (newValue == 1 && !$scope.mapLoaded){
          $scope.mapLoaded = true;
          $timeout(builders[exampleName], 100);
        }
      });
    }]
  }
});

angular.module('App').service('App.MapBuiders', function(){

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
    }

  };
})
