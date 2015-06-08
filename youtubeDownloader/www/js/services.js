angular.module('youDown.services', [])

.factory('YoutubeClient', [
  '$q',
  function($q) {
    // Google's Youtube Data API Client
    var YoutubeClient = this;

    YoutubeClient.client = gapi.client;

    YoutubeClient.search = function(query){
      var deferred = $q.defer();
      var request = YoutubeClient.client.youtube.search.list({
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
]);
