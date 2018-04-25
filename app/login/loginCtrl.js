app.controller("loginCtrl",['$scope', '$location', '$rootScope', 'loginService', 'usersService', function ($scope, $location, $rootScope, loginService, usersService) {
    
    $scope.loginData = {};
    $scope.error = "";


    usersService.getUsersList().then(function (response) {
        $scope.users =  usersService.usersList;

    }, function () {
            alert("Get users list returns error");
        });


    $scope.login = function(){
        if(loginService.verifyLogin($scope.loginData))
        {
            $rootScope.isAdmin = usersService.isCurrentUserAdmin();
            $location.path("/dashboard");
        }
        else{
            $scope.error = "Incorrect username or password.";
        }
    }
 
    $scope.resetErrorMessage = function(){
        $scope.error = "";
    }

    }]);