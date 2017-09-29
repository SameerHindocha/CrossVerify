'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('contactUploadController', controller);

  controller.$inject = ['UserService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(UserService, $location, $route, lodash, $rootScope) {

    console.log(" $rootScope.saleFileData", $rootScope.saleFileData);

    let vm = this;

    vm.uploadContact = uploadContact;


    activate();

    function activate() {

    }

    function uploadContact() {


    }



  }
})();