'use strict';
(function() {
  angular
    .module('fileApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when("/file-compare/:id", {
          templateUrl: 'app/modules/file-operation/view/file-comparision.html',
          controller: 'fileComparisionController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
    }]);
})();
