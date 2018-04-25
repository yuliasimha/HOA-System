
(function (angular, window) {

    window.app.directive('user', function (usersService) {
        return {
            scope: {
                myUser: '='
            },
            restrict: 'AE',
            templateUrl: 'app/user/userView.html',
            link: function (scope, el, attrs) {
                scope.editUser = function (myUser) {
                    scope.$emit('updateSelectedUser', myUser);
                    $("#addEditUserModelId").modal('show');

                }

                scope.deleteUser = function (myUser) {
                    if (confirm("Are you sure?")) {
                        usersService.deleteTenant(myUser);
                    }
                }

            }
        };
    })

})(angular, window);



