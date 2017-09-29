'use strict';
(function() {
  angular
    .module('myContactsApp')
    .config(['$routeProvider', function($routeProvider, MyContactsService) {
      $routeProvider
        .when("/my-contacts", {
          templateUrl: 'app/modules/my-contacts/view/my-contacts.html',
          controller: 'MyContactsController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
        .when("/edit-contact/:name/:GSTNo/:email/:mobile/:type", {
          templateUrl: 'app/modules/my-contacts/view/edit-contact.html',
          controller: 'EditContactController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
    }]);
})();