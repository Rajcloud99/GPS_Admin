materialAdmin.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

materialAdmin.directive('updateTitle', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function(scope, element) {

        var listener = function(event, toState) {

          var title = 'Default Title';
          if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

          $timeout(function() {
            element.text(title);
          }, 0, false);
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);

materialAdmin.directive('focusMe', function($timeout, $parse) {
  return {
      //scope: true,   // optionally create a child scope
      link: function(scope, element, attrs) {
          var model = $parse(attrs.focusMe);
          scope.$watch(model, function(value) {
              if(value === true) { 
                  $timeout(function() {
                      element[0].focus();
                  });
              }
          });
      }
  };
});

materialAdmin.directive('emptyTypeahead', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      // this parser run before typeahead's parser
      modelCtrl.$parsers.unshift(function (inputValue) {
        var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
        modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
        return value;
      });
      
      // this parser run after typeahead's parser
      modelCtrl.$parsers.push(function (inputValue) {
        return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
      });
    }
  }
});


angular.module('mc.resizer', []).directive('resizer', function($document) {

  return function($scope, $element, $attrs) {

    $element.on('mousedown', function(event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {

      if ($attrs.resizer == 'vertical') {
        // Handle vertical resizer
        var x = event.pageX;

        if ($attrs.resizerMax && x > $attrs.resizerMax) {
          x = parseInt($attrs.resizerMax);
        }

        $element.css({
          left: x + 'px'
        });

        $($attrs.resizerLeft).css({
          width: x + 'px'
        });
        $($attrs.resizerRight).css({
          left: (x + parseInt($attrs.resizerWidth)) + 'px'
        });

      } else {
        // Handle horizontal resizer
        var y = window.innerHeight - event.pageY;

        $element.css({
          bottom: y + 'px'
        });

        $($attrs.resizerTop).css({
          bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
        });
        $($attrs.resizerBottom).css({
          height: y + 'px'
        });
      }
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  };
});


materialAdmin.directive('jaLazyLoadRepeat', ['$timeout', function ($timeout) {
    return {
        'restrict': 'A',
        'link': link,
    };

    function link(scope, element, attr){
        const key = attr.jaLazyLoadRepeatName || element.attr('ja-lazy-load-repeat').split('|')[0].trim().replace(/{|}/g,'');
        const repeatKey = 'jaArr' + key;
        let arr = undefined,
            isTriggered = false,
            lastScrollTop = 0,
            currentPage = 0,
            pageLength = 20,
            totalPages = 0;

        scope[repeatKey] = [];

        attr.$observe('jaLazyLoadRepeat', function (val) {
            currentPage = 0;
            scope['jaFilterArr' + key] = arr = val ? JSON.parse(val) : [];
            scope[repeatKey] = arr.slice(currentPage, pageLength);
            totalPages = arr.length/pageLength;
        });

        element.on('scroll', function (event) {
            const that = angular.element(this);

            if (that.scrollTop() < lastScrollTop){
                lastScrollTop = that.scrollTop();
                return;
            }
            lastScrollTop = that.scrollTop();

            //console.log((that[0].scrollHeight - that.scrollTop()).toFixed(0), ' --- ', 100+that.outerHeight()+'');
            if(!isTriggered && (that[0].scrollHeight - that.scrollTop()).toFixed(0) <= 150+that.outerHeight()){
                isTriggered = true;

                // console.log('triggered');
                loadData(currentPage+1);

                $timeout(function(){
                    isTriggered = false;
                },200);
            }
        });

        function loadData(page) {
            if(page > totalPages)
                return;

            scope[repeatKey].push(...arr.slice(pageLength * page, pageLength * page + pageLength));
            currentPage=page;
        }
    }
}]);
