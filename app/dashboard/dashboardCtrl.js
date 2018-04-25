app.controller("dashboardCtrl",['$scope', '$location', 'votesService', 'usersService', 'messagesService', function ($scope, $location, votesService, usersService, messagesService) {

    if (!usersService.currentUser.id) {
        $location.path("/");
        return;
    }


    votesService.getVotes().then(function (response) {
        $scope.usersPendingVoting = votesService.getUserPendingVotings(usersService.currentUser.id);
        $scope.endedVotings = votesService.getEndedVotings();

    }, function () {
        consol.log("Get votes list returns error!");
    });

    $scope.lastMessages = [];
    messagesService.getMessagesList().then(function (response) {
        var messages = _.clone(messagesService.messagesList);
        $scope.lastMessages = messages.splice(0, 5);
        console.log("messages"),
            console.log($scope.lastMessages);
    }, function () {
        alert("Get messages list returns error");
    });


    $scope.$on('updateVotingsData', function (event) {
        $scope.usersPendingVoting = votesService.getUserPendingVotings(usersService.currentUser.id);
        $scope.endedVotings = votesService.getEndedVotings();
    });

    $scope.getChartObject = function (voting) {
        var chartObject = {};
        chartObject.type = "PieChart";
        chartObject.data =  {
            "cols": [
                { id: "t", label: "VotesOptions", type: "string" },
                { id: "s", label: "Votes", type: "number" }
            ], "rows": []
        };

        chartObject.options = {
            'title': voting.title
        };

        var votesNumber;
        if (voting.options.length) {
            for (var i = 0; i < voting.options.length; i++) {
                votesNumber = countVotesPerOption(voting.options[i], voting);
                var item = {
                    c: [
                        { v: voting.options[i] },
                        { v: votesNumber }
                    ]
                }
                chartObject.data.rows.push(item)
            }
            voting.result = getVotingResult(voting);

            return chartObject;
       }
      
    }

            
    function getVotingResult(voting) {
        var result = "";
        var votingMaxVotes = 0;
        if (voting.votes.length) {
            for (var y = 0; y < voting.options.length; y++) {
                var counter = 0;
                for (var i = 0; i < voting.votes.length; i++) {
                    if (voting.votes[i].vote === voting.options[y]) {
                        counter++;
                    }
                }
                if (counter > votingMaxVotes) {
                    votingMaxVotes = counter;
                    result = voting.options[y];
                }
            }
        }
        return result;
    } 

    function countVotesPerOption(option, voting) {
        var counter = 0;
        if (voting.votes.length) {
            for (var i = 0; i < voting.votes.length; i++) {
                if (voting.votes[i].vote === option) {
                    counter++;
                }
            }
        }

        return counter;

    }

}]);