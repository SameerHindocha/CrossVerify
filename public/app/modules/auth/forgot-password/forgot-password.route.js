'use strict';
(function() {
  angular
    .module('forgotPasswordApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
        .when("/forgot-password", {
          templateUrl: 'app/modules/auth/forgot-password/view/forgot-password.html',
          controller: 'ForgotPasswordController',
          controllerAs: 'vm',
          loggedInGuard: false
        })
        .when("/reset-password/:resetToken", {
          templateUrl: 'app/modules/auth/forgot-password/view/reset-password.html',
          controller: 'ResetPasswordController',
          controllerAs: 'vm',
          loggedInGuard: false
        })

    }]);
})();