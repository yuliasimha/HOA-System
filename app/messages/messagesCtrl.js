app.controller("messagesCtrl", ['$scope', '$location', 'messagesService', 'usersService',function ($scope, $location, messagesService, usersService) {

    if(!usersService.currentUser.id){
        $location.path("/");
        return;
    }

    var sortOptions = {
        date: "Date",
        priority: "Priority",
    }

    $scope.filterPriority = {
        all: "All",
        info: "Info",
        important: "Important"
    }

    $scope.priority = messagesService.priority;

    $scope.selectedMessage = {};
    $scope.selectedMessage.priority = $scope.priority.info;
    
    $scope.$on('updateSelectedMessage', function (event,message) {
        $scope.selectedMessage = _.clone(message);
    });

    $scope.selectedPriorityFilter = $scope.filterPriority.all;
    $scope.filterByTitleProp = "";
    $scope.sortProp = sortOptions.date;

    $scope.filterMessages = function (message) {
        var messageTitle = message.title.toLowerCase();
        var isPriorityIncluded = false;
        var isTitleIncluded = false;
        if ($scope.selectedPriorityFilter === $scope.filterPriority.all || message.priority === $scope.selectedPriorityFilter) {
            isPriorityIncluded = true;
        }
        if ($scope.filterByTitleProp === "" || _.includes(message.title.toLowerCase(),$scope.filterByTitleProp.toLowerCase()))
        {
            isTitleIncluded = true;
        }
        if (isTitleIncluded && isPriorityIncluded) {
            return true;
        }
        else {
            return false;
        }
    }

    //message functionality
    $scope.messages = [];
    messagesService.getMessagesList().then(function (response) {
        $scope.messages = messagesService.messagesList;

    }, function () {
        alert("Get messages list returns error");
    });

    $scope.openAddEditModel = function (message) {
        $("#addEditMessageModelId").modal('show');
    }

    $scope.addOrEditMessage = function () {
        if ($scope.selectedMessage.id) {
            messagesService.editMessage($scope.selectedMessage);
        }
        else {
            messagesService.addMessage($scope.selectedMessage);
        }
        $("#addEditMessageModelId").modal('hide');

    }

    $('#addEditMessageModelId').on('hidden.bs.modal', function (e) {
        $scope.selectedMessage = {};
        $scope.selectedMessage.priority = $scope.priority.info;
      })

}]);