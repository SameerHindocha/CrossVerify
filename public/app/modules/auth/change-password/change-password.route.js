'use strict';
(function() {
  angular
    .module('changePasswordApp')
    .config(['$routeProvider', function($routeProvider, ChangePasswordService) {
      $routeProvider
        .when("/change-password", {
          templateUrl: 'app/modules/auth/change-password/view/change-password.html',
          controller: 'ChangePasswordController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
    }]);
})();