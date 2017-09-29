'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('contactUploadController', controller);

  controller.$inject = ['UserService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(UserService, $location, $route, lodash, $rootScope) {
    let vm = this;
    $rootScope.updateContact = function(missingDataArrayForSale, missingDataArrayForPurchase) {
      let updateObj = {
        dateOfFile: $rootScope.uploadDate,
        updatedSaleFileData: missingDataArrayForSale,
        updatedPurchaseFileData: missingDataArrayForPurchase
      }
      UserService.updateContact(updateObj).then((response) => {
        noty('success', response.data.message);
        $location.path('/dashboard');
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
    activate();

    function activate() {

    }
  }
})();