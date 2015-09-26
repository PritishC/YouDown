angular.module('youDown.services', [])

.factory('YoutubeClient', [
  '$q',
  function($q) {
    // Google's Youtube Data API Client
    var YoutubeClient = this;

    YoutubeClient.init = function(){
      var loaddefer = $q.defer();

      gapi.client.load('youtube', 'v3', function(){
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

.factory('YoutubeInMp3', [
  function() {
    // YoutubeInMp3 API
    var YoutubeInMp3 = this;

    // TODO: Define methods

    return YoutubeInMp3;
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

.factory('Downloads', [
  function() {
    var Downloads = this;

    Downloads.data = [];

    Downloads.contains = function(item){
      for(var i = 0; i < Downloads.data.length; i++){
        if(angular.equals(Downloads.data[i].id, item.id)){
          return true;
        }
      }

      return false;
    }

    Downloads.add = function(item){
      item.inDownload = true;
      Downloads.data.push(item);
    };

    Downloads.remove = function(item){
      item.inDownload = false;
      Downloads.data = Downloads.data.filter(function(element){
        return !angular.equals(element.id, item.id);
      });
    };

    return Downloads;
  }
]);
