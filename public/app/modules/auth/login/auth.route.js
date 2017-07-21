'use strict';
(function() {
  angular
    .module('authApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
        .when("/login", {
          templateUrl: 'app/modules/auth/login/view/login.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/login'
        });
    }]);
})();
