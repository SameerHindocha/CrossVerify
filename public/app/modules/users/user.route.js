'use strict';
(function() {
  angular
    .module('userApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider

        .when("/user/add", {
          templateUrl: 'app/modules/users/view/add-user.html',
          controller: 'addUserController',
          controllerAs: 'vm',
          loggedInGuard: false
        })

        .when("/user/edit", {
          templateUrl: 'app/modules/users/view/profile.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          loggedInGuard: true,
          resolve: {
            'user': ['$location', 'UserService', function($location, UserService) {
              return UserService.getUserById(JSON.parse(localStorage.getItem('currentUser'))._id);
            }]
          },
        })

        .when("/user/addSale", {
          templateUrl: 'app/modules/users/view/add-user-sale.html',
          controller: 'addUserSaleController',
          controllerAs: 'vm',
          loggedInGuard: true
        })

        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();