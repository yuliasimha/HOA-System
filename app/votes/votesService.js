app.factory("votesService", ['$http', '$q', 'usersService', function ($http, $q, usersService) {

    function VoteItem(voteItemData) {
        if (!voteItemData.id) {
            this.id = _.uniqueId();
            this.date = new Date(Date.now()).toLocaleString();
            this.user = usersService.currentUser;
            this.votes = [];
        }
        else {
            this.id = voteItemData.id;
            this.date = voteItemData.date;
            this.user = voteItemData.user;
            this.votes = voteItemData.votes;
        }

        this.options = voteItemData.options;
        var date = new Date();
        this.title = voteItemData.title;
        this.details = voteItemData.details;
        this.endDate = new Date(voteItemData.endDate);
        this.isActive = this.endDate > date;

        this.addVote = function (voteData) {
            var voteIndex = _.findIndex(this.votes, function (voteObj) { return voteObj.userId === votedata.userId });
            if (voteIndex >= 0) {
                this.votes[voteIndex].vote = voteData.vote;
            }
            else {
                this.votes.push(new Vote(voteData));
            }
        }
    }

    function Vote(userId, vote) {
        this.userId = userId;
        this.vote = vote;
    }

    var voteItems = [];
    var isVotesLoaded = false;

    function getVotes() {
        var async = $q.defer();
        $http.get("files/votes.json").then(function (response) {
            if (!isVotesLoaded) {
                voteItems.splice(0, voteItems.length);
                for (var i = 0; i < response.data.length; i++) {
                    voteItem = response.data[i];
                    if (voteItem) {
                        voteItems.push(new VoteItem(voteItem));
                    }
                }
                isVotesLoaded = true;
            }
            async.resolve();
        }, function (response) {
            alert("Can't get votes data");
            async.reject();
        });
        return async.promise;
    }

    function addVoteItem(voteItem) {
        if (voteItem) {
            var voteItemIndex = _.findIndex(voteItems, function (voteItemObj) { return voteItemObj.id === voteItem.id });
            if (voteItemIndex >= 0) {
                alert("Vote item with such id already exists");
                return;
            }
            else {
                voteItems.push(new VoteItem(voteItem));
            }
        }
    }



    function deleteVoteItem(voteItem) {
        if (voteItem) {
            var voteItemIndex = _.findIndex(voteItems, function (voteItemObj) { return voteItemObj.id === voteItem.id });
            if (voteItemIndex < 0) {
                alert("Can't delete non existing vote item");
                return;
            }
            else {
                voteItems.splice(voteItemIndex, 1);
            }

        }
    }

    function editVoteItem(voteItem) {
        if (voteItem) {
            var voteItemIndex = _.findIndex(voteItems, function (voteItemObj) { return voteItemObj.id === voteItem.id });
            if (voteItemIndex < 0) {
                alert("Can't update non existing vote item");
                return;
            }
            else {
                voteItems[voteItemIndex] = _.clone(voteItem);
            }

        }
    }

    function addVoteToVoteItem(voteItem, voteOption, userId) {
        if (voteItem) {
            var voteItemIndex = _.findIndex(voteItems, function (voteItemObj) { return voteItemObj.id === voteItem.id });
            if (voteItemIndex < 0) {
                alert("Can't add vote to non existing vote item");
                return;
            }
            var userIdIndex = _.findIndex(voteItems[voteItemIndex].votes, function (voteObj) { return voteObj.userId === userId });
            if (userIdIndex >= 0) {
                voteItems[voteItemIndex].votes[userIdIndex].vote = voteOption;
            }
            else {
                voteItems[voteItemIndex].votes.push(new Vote(userId, voteOption))
            }
        }
    }

    function getUserVoteByUserId(voteItem, userId) {
        if (voteItem) {
            var voteItemIndex = _.findIndex(voteItems, function (voteItemObj) { return voteItemObj.id === voteItem.id });
            if (voteItemIndex < 0) {
                alert("There is no such voting");
                return;
            }
            var userIdIndex = _.findIndex(voteItems[voteItemIndex].votes, function (voteObj) { return voteObj.userId === userId });
            if (userIdIndex >= 0) {
                return voteItems[voteItemIndex].votes[userIdIndex].vote;
            }
            else {
                return "Pending...";
            }
        }
    }

    function getUserPendingVotings(userId) {
        var userPendingVotings = [];
        for (var i = 0; i < voteItems.length; i++) {
            var userIdIndex = _.findIndex(voteItems[i].votes, function (voteObj) { return voteObj.userId === userId });
            if (userIdIndex < 0) {
                userPendingVotings.push(voteItems[i])
            }
        }

        return userPendingVotings;
    }

    function getEndedVotings() {
        var endedVotings = [];
        for (var i = 0; i < voteItems.length; i++) {
            if (!voteItems[i].isActive) {
                endedVotings.push(voteItems[i]);
            }
        }
        return endedVotings;
    }

    return {
        editVoteItem: editVoteItem,
        deleteVoteItem: deleteVoteItem,
        addVoteItem: addVoteItem,
        voteItems: voteItems,
        addVoteToVoteItem: addVoteToVoteItem,
        getUserVoteByUserId: getUserVoteByUserId,
        getUserPendingVotings: getUserPendingVotings,
        getEndedVotings: getEndedVotings,
        getVotes: getVotes
    };



}]);   