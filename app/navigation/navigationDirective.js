(function (angular, window) {

    window.app.directive('navBar', function ($location) {
        return {
            restrict: 'E',
            templateUrl: 'app/navigation/navigationView.html',
            link: function (scope, el, attrs) {

                scope.isActive = function (viewLocation) {
                    return viewLocation === $location.path();
                };
            }
        }
    });


})(angular, window);