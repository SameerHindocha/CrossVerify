'use strict';
(function() {
  angular
    .module('fileApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when("/user/import/:from/:month", {
          templateUrl: 'app/modules/file-operation/view/file-upload.html',
          controller: 'fileUploadController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
        .when("/user/upload-contact", {
          templateUrl: 'app/modules/file-operation/view/upload-contact.html',
          controller: 'contactUploadController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
    }]);
})();