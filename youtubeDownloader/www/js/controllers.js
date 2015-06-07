angular.module('youDown.controllers', [])

.controller('SearchCtrl', [
  '$scope',
  '$ionicPopup',
  'YoutubeClient',
  'Favorites',
  function($scope, $ionicPopup, YoutubeClient, Favorites) {
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
      YoutubeClient.search(query)
        .then(function(response){
          $scope.videoResults.items = response.items;

          angular.forEach($scope.videoResults.items, function(item){
            if(Favorites.contains(item)){
              item.favorite = true;
            }
          });
        }, function(reason) {
          $ionicPopup.alert({
            'title': 'Couldn\'t fetch videos',
            'subTitle': reason
          });
        })
        .finally(function() {
          $scope.videosLoading = false;
        });
    };

    $scope.toggleFavorite = function(video){
      if(Favorites.contains(video)){
        Favorites.remove(video);
      } else {
        Favorites.add(video);
      }
    };
  }
])

.controller('FavoritesCtrl', [
  '$scope',
  'Favorites',
  function($scope, Favorites) {
    // TODO: Move to localStorage or something similar
    $scope.favorites = Favorites.data;

    $scope.remove = function(video){
      $scope.favorites = $scope.favorites.filter(function(element){
        return !angular.equals(element.id, video.id);
      });

      Favorites.remove(video);
    };
  }

]);
