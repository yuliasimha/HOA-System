app.controller("tenantsCtrl",['$scope', '$location', 'usersService', function ($scope, $location, usersService) {

    if (!usersService.currentUser.id) {
        $location.path("/");
        return;
    }

    $scope.selectedTenant = {};

    usersService.getUsersList().then(function (response) {
        $scope.users = usersService.usersList;

    }, function () {
        alert("Get users list returns error");
    });


    $scope.$on('updateSelectedUser', function (event,user) {
        $scope.selectedTenant = _.clone(user);
    });

    $scope.addEditTenant = function () {
        if ($scope.selectedTenant) {
            if ($scope.selectedTenant.id) {
                usersService.editTenant($scope.selectedTenant);
            }
            else {
                usersService.addTenant($scope.selectedTenant);
            }
            $("#addEditUserModelId").modal('hide');
        }
    }


    $scope.openAddEditModel = function (message) {
        $("#addEditUserModelId").modal('show');
    }

    $('#addEditUserModelId').on('hidden.bs.modal', function (e) {
        $scope.selectedTenant = {};
      })

      $scope.searchByName ="";
      $scope.filterTenants = function (user) {
        var userFullName = user.firstName.toLowerCase() + user.lastName.toLowerCase();

        if ($scope.searchByName === "" || _.includes(userFullName,$scope.searchByName.toLowerCase())) {
           return true;
        }
        else {
            return false;
        }
    }


}]);