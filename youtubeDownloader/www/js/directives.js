angular.module('youDown.directives', [])

/**
 * Prevents the user from swiping items
 * in any direction. Additionally, prevents
 * any handlers from triggering on-swipe.
 */
.directive('preventSwipe', [
  function() {
    return {
      link: function(scope, element, attrs){
        if(attrs.cannotSwipeIf === "true") {
          // Don't know how else to not call the function
          attrs.onSwipe = "";

          // Additionally, preventDefault the swipe event
          element.on("swipe", function(e){
            e.preventDefault();
          })
        }
      }
    }
  }
]);
