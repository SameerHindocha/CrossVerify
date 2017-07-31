'use strict';
(function() {
  angular
    .module('clientApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when("/client/add/:id", {
          templateUrl: 'app/modules/client/view/add-client.html',
          controller: 'addClientController',
          controllerAs: 'vm',
          loggedInGuard: false
        })

        .when("/client/post-register", {
          template: `<h1>Thankyou</h1>`,
          loggedInGuard: false
        })
    }]);
})();