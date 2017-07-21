'use strict';
(function() {
  angular
    .module('userApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when("/user/list", {
          templateUrl: 'app/modules/users/view/list-user.html',
          controller: 'listUserController',
          controllerAs: 'vm',
          loggedInGuard: true,
          resolve: {
            'users': ['$location', 'UserService', function($location, UserService) {
              return UserService.listUser();
            }]
          },
        })

      .when("/user/add", {
        templateUrl: 'app/modules/users/view/add-user.html',
        controller: 'addUserController',
        controllerAs: 'vm',
        loggedInGuard: false
      })

      // .when("/user/edit/:id", {
      //   templateUrl: 'app/modules/users/view/edit-user.html',
      //   controller: 'editUserController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     'UserDetail': ['UserService', '$route', '$location', function(UserService, $route, $location) {

      //       return UserService.getUserById($route.current.params.id);
      //     }]
      //   },
      // })

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
        .otherwise({
          redirectTo: '/user/list'
        });
    }]);
})();
