var app = angular.module("appHOA", ["ngRoute","googlechart"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl:"app/login/loginView.html",
        controller: "loginCtrl"
    })
      .when("/messages",{
       templateUrl:"app/messages/messagesView.html",
       controller: "messagesCtrl"
    })
    .when("/tenants",{
        templateUrl:"app/tenants/tenantsView.html",
        controller: "tenantsCtrl"
     })
     .when("/voting",{
        templateUrl:"app/votes/votesView.html",
        controller: "votesCtrl"
     })
     .when("/dashboard",{
        templateUrl:"app/dashboard/dashboardView.html",
        controller: "dashboardCtrl"
     })
   .otherwise({
        redirectTo :"/"
    });
})


app.run(function($rootScope, usersService){
    $rootScope.isAdmin = usersService.isCurrentUserAdmin();
});

