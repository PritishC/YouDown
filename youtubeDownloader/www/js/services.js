angular.module('youDown.services', [])

.factory('YoutubeClient', [
  function() {
    // Google's Youtube Data API Client
    var YoutubeClient = this;

    YoutubeClient.client = gapi.client;

    YoutubeClient.search = function(query, callback){
      var request = YoutubeClient.youtube.search.list({
        q: query,
        part: 'snippet'
      });

      request.execute(callback);
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
]);
