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
          template: `<div class="jumbotron text-xs-center">
                    <h1 class="display-3">Thank You!</h1>
                   <!-- <p class="lead">
                    <strong>Please check your email</strong>
                     for further instructions on how to complete your account setup.</p> -->
                    <hr>
                    </div>`,
          loggedInGuard: false
        })
    }]);
})();