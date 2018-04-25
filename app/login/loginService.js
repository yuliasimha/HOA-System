app.factory("loginService",['$http', '$q', 'usersService', function ($http, $q, usersService) {

    function verifyLogin(login) {
        if (login) {
            userIndex = usersService.usersList.findIndex(x => x.userName === login.userName);
            if (userIndex >= 0) {
                if (usersService.usersList[userIndex].password === login.password) {
                    usersService.setCurrentUser(usersService.usersList[userIndex]);
                    return true;
                }
            }
        }
        return false;
    }
 
    function addUser(user)
    {
        if(user)
        {
            usersService.addUser(user);
        }
    }

    return {
        verifyLogin : verifyLogin,
        addUser : addUser
    };

}]);
