angular.module('youDown.services', [])

.factory('MessageQueue', [
  '$window',
  function($window) {
    var MessageQueue = this;

    MessageQueue.create = function(params) {
      return $window.$.jqmq(params);
    };

    return MessageQueue;
  }
])

.factory('YoutubeClient', [
  '$q',
  function($q) {
    // Google's Youtube Data API Client
    var YoutubeClient = this;

    YoutubeClient.init = function(){
      var loaddefer = $q.defer();

      gapi.client.load('youtube', 'v3', function(){
        // TODO: Generate new API key, get it here via bash script
        gapi.client.setApiKey('AIzaSyA2v2ThMn_vO5pyIydxHCrcBntzy4rPGqc');
        loaddefer.resolve(gapi);
      });

      return loaddefer.promise;
    };

    YoutubeClient.search = function(query){
      var deferred = $q.defer();
      var request = gapi.client.youtube.search.list({
        q: query,
        part: 'snippet'
      });

      request.execute(function(response) {
        if(response.error) {
          deferred.reject(response.message);
        } else {
          deferred.resolve(response);
        }
      });
      return deferred.promise;
    };

    return YoutubeClient;
  }
])

.factory('Favorites', [
  function() {
    var Favorites = this;

    Favorites.data = [];

    Favorites.contains = function(item){
      // XXX: Perhaps use a higher-order function
      for(var i = 0; i < Favorites.data.length; i++){
        if(angular.equals(Favorites.data[i].id, item.id)){
          return true;
        }
      }

      return false;
    };

    Favorites.add = function(item){
      item.favorite = true;
      Favorites.data.push(item);
    };

    Favorites.remove = function(item){
      item.favorite = false;
      Favorites.data = Favorites.data.filter(function(element){
        return !angular.equals(element.id, item.id);
      });
    };

    return Favorites;
  }
])

.factory('DownloaderService', [
  '$ionicPlatform',
  '$cordovaFile',
  '$cordovaFileTransfer',
  function($ionicPlatform, $cordovaFile, $cordovaFileTransfer) {
    var directory = 'Music-Downloads',
        DownloaderService = this;

    DownloaderService.downloadFile = function(video, url) {
      return $ionicPlatform.ready(function() {})
        .then(function() {
          return $cordovaFile.checkDir(cordova.file.externalDataDirectory, directory);
        })
        .then(function() {
          // Directory exists, do nothing
        },
        function(err) {
          // Create directory as it doesn't exist
          return $cordovaFile.createDir(cordova.file.externalDataDirectory, directory, false);
        })
        .then(function() {
          // Create placeholder file before download
          return $cordovaFile.createFile(cordova.file.externalDataDirectory + directory + "/", video.snippet.title + '.mp3', true);
        })
        .then(function(newFile) {
          // Start downloading the file to that path
          return $cordovaFileTransfer.download(url, newFile.nativeURL, {}, true);
        });
    };

    return DownloaderService;
  }
])

.factory('Downloads', [
  '$timeout',
  'MessageQueue',
  'DownloaderService',
  'apiUrl',
  function($timeout, MessageQueue, DownloaderService, apiUrl) {
    var Downloads = this;

    // Actual visual representation
    Downloads.data = [];

    // TODO: Wait, why do I even need jQMQ if
    // I need to keep another array just to be able
    // to show the download queue to the user?
    // Shouldn't I implement something of my own?
    Downloads.queue = MessageQueue.create({
      // Next item is processed only when queue.next()
      // is called in callback
      delay: -1,
      // Process one at a time
      batch: 1,
      callback: function(video) {
        url = apiUrl.url + "fetchlink?video=http://www.youtube.com/watch?v=" + video.id.videoId;

        DownloaderService.downloadFile(video, url)
          .then(function(result) {
            Downloads.queue.next(false);
          }, function(err) {
            // Retry the download next time
            // But allow this only five times
            video.fail_ctr++;

            if(video.fail_ctr < 5)
              Downloads.queue.next(true);
          }, function(progress) {
            // update progress and shiz
            $timeout(function() {
              video.downloadProgress = (progress.loaded / progress.total);
            });
          });
      },
      complete: function() {
        // Update something in the template perhaps
        console.log('All downloads complete!');
      }
    });

    Downloads.contains = function(item){
      for(var i = 0; i < Downloads.data.length; i++){
        if(angular.equals(Downloads.data[i].id, item.id)){
          return true;
        }
      }

      return false;
    };

    Downloads.add = function(item){
      item.inDownload = true;

      // Add to the visual rep
      Downloads.data.push(item);

      // Add to the jQMQ
      Downloads.queue.add(item);

      // Set fail_ctr to 0
      item.fail_ctr = 0;
    };

    Downloads.remove = function(item){
      // TODO: How do we remove an item from the queue?
      item.inDownload = false;
      Downloads.data = Downloads.data.filter(function(element){
        return !angular.equals(element.id, item.id);
      });
    };

    return Downloads;
  }
]);
