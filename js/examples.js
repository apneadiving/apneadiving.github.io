hljs.initHighlightingOnLoad();

angular.module('App', ['mgcrea.ngStrap'])

angular.module('App').directive('mapExample', function(){
  return {
    scope: {
      mapExample: '@'
    },
    templateUrl: 'partials/map_example.html',
    controller: [ '$scope' , 'App.MapBuiders', function($scope, builders){

      var exampleName = $scope.mapExample;
      var basePath = "partials/" + exampleName;

      $scope.tabs = [
        {
          "title": "Description",
          "template": basePath + "/description.html"
        },
        {
          "title": "Javascript",
          "template": basePath + "/javascript.html"
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
        if (newValue == 2 && !$scope.mapLoaded){
          $scope.mapLoaded = true;
          builders[exampleName]()
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
        markers = handler.addMarkers([
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
