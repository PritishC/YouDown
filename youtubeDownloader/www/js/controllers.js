angular.module('youDown.controllers', [])

.controller('SearchCtrl', [
  '$scope',
  'YoutubeClient',
  function($scope, YoutubeClient) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.videoResults = {};

    $scope.search = function(query){
      // TODO: Add infinite scroll
      $scope.videoResults.items = [];

      if(!query){
        return;
      }

      $scope.videosLoading = true;

      YoutubeClient.search(query, function(response){
        $scope.$evalAsync(function(){
          // Safe way to trigger digest
          // ref: http://www.bennadel.com/blog/2605-scope-evalasync-vs-timeout-in-angularjs.htm
          $scope.videoResults.items = response.items;
          $scope.videosLoading = false;
        });
      });
    };
  }
])

.controller('FavoritesCtrl', function($scope) {
});
