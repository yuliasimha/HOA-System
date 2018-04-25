app.factory("usersService",[ '$http', '$q',function ($http, $q) {

    function User(user) {
        if(!user.id){
            this.id = _.uniqueId();
            this.comunityId = currentUser.communityId;
        }
        else{
           this.id = user.id;
           this.comunityId = user.communityId;
        }
        this.userName = user.userName;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.apartment = user.apartment;
        this.password = user.password;
        this.isCommitteeMember = user.isCommitteeMember;

        if (!user.image) {
            this.image = "http://www.noworrynotension.com/SignIn/assets/images/user-icon-png-pnglogocom.png";
          }
          else {
            this.image = user.image;
          }
    }

    var usersList = [];
    var isUserListyLoaded = false;

    function getUsersList() {
        var async = $q.defer();
        $http.get("files/users.json").then(function (response) {
            if (!isUserListyLoaded) {
                usersList.splice(0, usersList.length);
                for (var i = 0; i < response.data.length; i++) {
                    user = response.data[i];
                    if (user) {
                        usersList.push(new User(user));
                    }
                }
                isUserListyLoaded = true;
            }
            async.resolve();
        }, function (response) {
            alert("Can't get users");
            async.reject();
        });
        return async.promise;
    }


    function addUser(user) {
        if (user) {
            var userIndex = _.findIndex(usersList, function (userObj) { return userObj.id === user.id });
            if (userIndex >= 0) {
                alert("User with such id already exists");
                return;
            }
            usersList.push(new User(user));
        }
    }

    function deleteUser(user) {
        if (user) {
            var userIndex = _.findIndex(usersList, function (userObj) { return userObj.id === user.id });
            if (userIndex < 0) {
                alert("Can't remove non existing user");
                return;
            }
            usersList.splice(userIndex, 1);
        }
    }

    function editUser(user) {
        if (user) {
            var userIndex = _.findIndex(usersList, function (userObj) { return userObj.id === user.id });
            if (userIndex < 0) {
                alert("Can't update non existing user");
                return;
            }
            usersList[userIndex] = _.clone(user);
        }
    }

    function isCurrentUserAdmin(){
       return currentUser.isCommitteeMember;
    }

    var currentUser = {};

    function setCurrentUser(user) {
        currentUser = user;
    }
    

    return {
        usersList: usersList,
        get currentUser() { return currentUser },
        editTenant: editUser,
        setCurrentUser: setCurrentUser,
        getUsersList: getUsersList,
        usersList: usersList,
        deleteTenant : deleteUser,
        addTenant : addUser,
        isCurrentUserAdmin: isCurrentUserAdmin

    };



}]);   