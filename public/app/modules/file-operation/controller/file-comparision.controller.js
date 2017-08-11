'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileComparisionController', controller);

  controller.$inject = ['ClientService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(ClientService, $location, $route, lodash, $rootScope) {
    let vm = this;
    vm.compareFiles = compareFiles;
    vm.getClient = getClient;
    vm.status;
    vm.userData = JSON.parse(window.localStorage.getItem('currentUser'));
    vm.showSaleTable = false;
    vm.showPurchaseTable = false;

    let clientId;
    let saleFile = [],
      purchaseFile = [];
    let saleCompare = [],
      purchaseCompare = [];
    let clientGST; //= "27AABCA4734H1ZU"; //Arihant

    activate();

    function activate() {
      let postObj;
      clientId = $route.current.params.id;
      clientGST = $route.current.params.gst;
      postObj = {
        id: clientId
      }
      getClient(clientId);
      getUser(clientGST);
    }

    function getUser(clientGST) {
      let userFileData = vm.userData.saleFile;
      lodash.forEach(userFileData, function(sale) {
        lodash.forEach(sale, function(record) {
          if (clientGST == record.Customer_Billing_GSTIN) {
            saleFile.push(record);
            vm.showSaleTable = true;
            let data = {}
            data.Invoice_Category = record.Invoice_Category;
            data.Invoice_number = record.Invoice_number;
            saleCompare.push(data);
          }
        });
      });
      vm.saleFileData = saleFile;
    }

    function getClient(clientId) {
      ClientService.getClientById(clientId).then((response) => {
        lodash.forEach(response.data.purchaseFile, function(purchase) {
          lodash.forEach(purchase, function(record) {
            if (vm.userData.GSTNo == record.Supplier_GSTIN) {
              purchaseFile.push(record);
              vm.showPurchaseTable = true;
              let data = {}
              data.Invoice_Category = record.Invoice_Category;
              data.Invoice_number = record.Invoice_Number;
              purchaseCompare.push(data);
            }
          });
        });
        vm.purchaseFileData = purchaseFile;
      }).catch((error) => {})
    }


    function compareFiles() {
      console.log("saleCompare", saleCompare);
      console.log("purchaseCompare", purchaseCompare);

      if (lodash.size(saleCompare) && lodash.size(purchaseCompare)) {
        let match = angular.equals(saleCompare, purchaseCompare)
        console.log("match", match);
        if (match) {
          vm.status = true;
        } else {
          vm.status = false;
        }
        let obj = {
          clientId: clientId,
          match: match
        }
        ClientService.changeStatus(obj);

      } else {
        if (!lodash.size(saleCompare) || !lodash.size(purchaseCompare)) {
          vm.hideTable = true;
          noty('warning', "No Sufficient data found to Compare");
        }
      }

    }

  }
})();