var initGapi = function(){
  window.initGapi(); // Call the init function defined on the window
};

angular.module('youDown.controllers', [])

.controller('SearchCtrl', [
  '$scope',
  '$ionicPopup',
  '$window',
  'YoutubeClient',
  'Favorites',
  'Downloads',
  function($scope, $ionicPopup, $window, YoutubeClient, Favorites, Downloads) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.videoResults = {};

    // Define the global initGapi method on the window
    $window.initGapi = function(){
      $scope.$apply($scope.initGapi);
    };

    // Perform initialization on the scope's initGapi method
    $scope.initGapi = function(){
      YoutubeClient.init()
        .then(function(){
          console.log('Initialized successfully');
        }, function(){
          console.log('Initialization failed');
        });
    };

    // Method to check for whether our videos
    // are present in service objects' data
    var checkVideos = function() {
      angular.forEach($scope.videoResults.items, function(item) {
        item.favorite = Favorites.contains(item);
        item.inDownload = Downloads.contains(item);
      });
    };

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
          checkVideos();
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

    $scope.addToDownloadQueue = function(video){
      $scope.videoResults.items.splice(video, 1);
      Downloads.add(video);
    };

    // Consolidated watcher to update
    // videoResults item properties.
    // Could've set cache-view=false,
    // but that would mean performing
    // the search repeatedly.
    $scope.$on('$ionicView.enter', function(e) {
      checkVideos();
    });
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

])

.controller('DownloadsCtrl', [
  '$scope',
  'Downloads',
  function($scope, Downloads) {
    // TODO: Progress bar and all downloads listed
    $scope.downloads = Downloads.data;
  }
]);
