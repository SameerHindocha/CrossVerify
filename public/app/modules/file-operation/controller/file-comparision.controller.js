'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileComparisionController', controller);

  controller.$inject = ['ClientService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(ClientService, $location, $route, lodash, $rootScope) {
    let vm = this;
    vm.compareFiles = compareFiles;
    vm.matchStatus, vm.clientRowObject, vm.userRowObject, vm.difference;
    vm.showStatus = false;
    vm.saleFileData = JSON.parse(window.localStorage.getItem('currentUser'));
    let clientGSTNo = "27AABCA4734H1ZU";

    activate();

    function activate() {
      let clientId, postObj;
      clientId = $route.current.params.id;
      postObj = {
        id: clientId
      }
      // if ($rootScope.clientData) {
      //   console.log("if");
      //   clientData = $rootScope.clientData;
      // }
      // console.log("$rootScope.-----------------------------", clientData);



      // lodash.each(vm.saleFileData, function(data) {
      //     // lodash.each(data1, function(data) {

      //     if (data[0].Customer_Billing_GSTIN == clientGSTNo) {
      //       console.log("FOUND");
      //     }

      //     // }

      //     // });

      //     console.log("LOCAL STORAGE ", vm.saleFileData);

      //     getClient(clientId);

      // FileOperationService.compareFileService(postObj).then((response) => {
      //   if (response.data.clientRowObject) {
      //     vm.clientRowObject = response.data.clientRowObject;
      //   }
      //   if (response.data.userRowObject) {

      //     console.log("response.data.userRowObject", response.data.userRowObject);
      //     vm.userRowObject = response.data.userRowObject;
      //   }
      //   if (response.data.status === '204') {
      //     vm.difference = response.data.message;
      //     vm.matchStatus = false;
      //   } else {
      //     vm.clientRowObject = response.data.clientRowObject;
      //     vm.userRowObject = response.data.userRowObject;
      //     if (response.data.difference.length == 0) {
      //       vm.matchStatus = true;
      //       vm.difference = 'No difference.'
      //     } else {
      //       vm.matchStatus = false;
      //       vm.difference = response.data.difference;
      //     }
      //   }
      // }).catch((error) => {
      //   console.log("error", error);
      // })
    }



    function getClient(clientId) {
      ClientService.getUserById(clientId).then((response) => {
        vm.purchaseFileData = response.data.purchaseFile;
        // console.log("purchaseFileData", vm.purchaseFileData);

      }).catch((error) => {

      })

    }

    function compareFiles() {
      vm.showStatus = true;
    }

  }
})();