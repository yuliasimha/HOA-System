app.controller("votesCtrl",['$scope', '$location', 'votesService', 'usersService', function ($scope, $location, votesService, usersService) {

    if (!usersService.currentUser.id) {
        $location.path("/");
        return;
    }


    votesService.getVotes().then(function (response) {
        $scope.voteItems = votesService.voteItems;

    }, function () {
        consol.log("Get votes list returns error");
    });


    $scope.filterActiveVotes = function (voteItem) {
        var date = new Date();
        if (voteItem.endDate > date) {
            voteItem.isActive = true;
            return true;
        }
        else {
            return false;
        }
    }

    $scope.currentDate = new Date();
    $scope.filterByVoteTitle = "";
    $scope.filterEndedVotes = function (voteItem) {
        var date = new Date();
        if (voteItem.endDate < date && ($scope.filterByVoteTitle ==="" || _.includes(voteItem.title.toLowerCase(),$scope.filterByVoteTitle.toLowerCase())) ) {
            voteItem.isActive = false;
            return true;
        }
        else {
            return false;
        }
    }

    $scope.newOption = "";
    $scope.selectedVoteItem ={};
    $scope.selectedVoteItem.options =[];

    $scope.addVoteOption = function () {
        if ($scope.newOption && $scope.newOption !== "") {
            $scope.selectedVoteItem.options.push($scope.newOption);
        }
        $scope.newOption = "";
        if (event.preventDefault) {
            event.preventDefault();
        }
    }

    $scope.addEditVoteItem = function(){
        if ($scope.selectedVoteItem) {
            if ($scope.selectedVoteItem.id) {
                votesService.editVoteItem($scope.selectedVoteItem);
            }
            else {
                votesService.addVoteItem($scope.selectedVoteItem);
            }
            $("#addEditVoteModelId").modal('hide');
            $scope.$emit('updateVotingsData');
        }
    }

    $scope.openAddEditModel = function (message) {
        $("#addEditVoteModelId").modal('show');
    }


    $scope.$on('updateSelectedVoteItem', function (event,voteItem) {
        $scope.selectedVoteItem = _.clone(voteItem);
        scope.$emit('updateVotingsData');
    });


    $('#addEditVoteModelId').on('hidden.bs.modal', function (e) {
        $scope.selectedVoteItem = {};
      })

}]);