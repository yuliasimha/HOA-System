
(function (angular, window) {

    window.app.directive('voteItem', function (usersService, votesService) {
        return {
            scope: {
                myVote: '='
            },
            restrict: 'AE',
            templateUrl: 'app/vote/voteItemView.html',
            link: function (scope, el, attrs) {

                scope.myChartObject = {};
                scope.myChartObject.type = "PieChart";

                scope.myChartObject.data = {
                    "cols": [
                        { id: "t", label: "VotesOptions", type: "string" },
                        { id: "s", label: "Votes", type: "number" }
                    ], "rows": []
                };

                setChartVariables();



                function getVotingResult() {
                    var result = "";
                    var votingMaxVotes = 0;
                    if (scope.myVote.votes.length) {
                        for (var y = 0; y < scope.myVote.options.length; y++) {
                            var counter = 0;
                            for (var i = 0; i < scope.myVote.votes.length; i++) {
                                if (scope.myVote.votes[i].vote === scope.myVote.options[y]) {
                                    counter++;
                                }
                            }
                            if (counter > votingMaxVotes) {
                                votingMaxVotes = counter;
                                result = scope.myVote.options[y];
                            }
                        }
                    }
                    return result;
                }

               scope.votingResult = getVotingResult();

                function countVotesPerOption(option) {
                    var counter = 0;
                    if (scope.myVote.votes.length) {
                        for (var i = 0; i < scope.myVote.votes.length; i++) {
                            if (scope.myVote.votes[i].vote === option) {
                                counter++;
                            }
                        }
                    }

                    return counter;

                }


                function setChartVariables() {
                    scope.myChartObject.data.rows.splice(0, scope.myChartObject.data.rows.length)
                    if (scope.myVote.options.length) {
                        for (var i = 0; i < scope.myVote.options.length; i++) {
                            votesNumber = countVotesPerOption(scope.myVote.options[i]);
                            var item = {
                                c: [
                                    { v: scope.myVote.options[i] },
                                    { v: votesNumber }
                                ]
                            }
                            scope.myChartObject.data.rows.push(item)
                        }
                    }
                }


                scope.selectedOptionbyCurrentUser = votesService.getUserVoteByUserId(scope.myVote, usersService.currentUser.id);

                scope.addVote = function () {
                    if (scope.selectedVoteOption) {
                        votesService.addVoteToVoteItem(scope.myVote, scope.selectedVoteOption, usersService.currentUser.id)
                        setChartVariables();
                        scope.selectedOptionbyCurrentUser = votesService.getUserVoteByUserId(scope.myVote, usersService.currentUser.id);
                    }
                }

                scope.editVoteItem = function (myVote) {
                    scope.$emit('updateSelectedVoteItem', myVote);
                    $("#addEditVoteModelId").modal('show');

                }

                scope.deleteVoteItem = function (myVote) {
                    if (confirm("Are you sure?")) {
                        votesService.deleteVoteItem(myVote);
                    }
                }
            }
        };
    })

})(angular, window);

