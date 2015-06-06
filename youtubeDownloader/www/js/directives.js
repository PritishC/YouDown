angular.module('youDown.directives', [])

.directive('searchResult', [
  'YoutubeClient',
  function(YoutubeClient){
    return {
      restrict: 'E',
      scope: {
        searchQuery: '='
      },
      templateUrl: '',
      link: function(scope){
        // TODO: Write functionality
      }
    };
  }
]);
