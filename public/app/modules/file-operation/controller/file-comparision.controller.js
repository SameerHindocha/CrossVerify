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
    vm.getClient = getClient;
    vm.userData = JSON.parse(window.localStorage.getItem('currentUser'));
    let clientGST = "27AABCA4734H1ZU"; //Arihant
    // let clientData = "";
    activate();

    function activate() {
      let clientId, postObj;
      clientId = $route.current.params.id;
      postObj = {
        id: clientId
      }
      getClient(clientId);
      getUser(clientGST);

      console.log("clientGST", clientGST);
    }



    function getClient(clientId) {
      console.log("clientId", clientId);
      let data = [];
      ClientService.getClientById(clientId).then((response) => {
        lodash.forEach(response.data.purchaseFile, function(purchase) {
          lodash.forEach(purchase, function(record) {
            console.log("record", record);
            if (vm.userData.GSTNo == record.Supplier_GSTIN) {
              console.log("sam");
              //Call Function
              //"27AAACB7403R1ZD"
              data.push(record);
              // console.log("MATCH FOUND SUCCESSFULLY");
            } else {
              // console.log("No Match Found");
            }


          });
        });
        vm.purchaseFileData = data;
        // console.log("data", data);

        /*

        Invoice_Date:
            Invoice_number:
            Invoice_Category: 
            Supply_Type:
            Supplier_Name:
            Supplier_Address:
            Supplier_City: 
            Supplier_PinCode:
            Supplier_State: 
            Supplier_StateCode:
            Supplier_GSTIN: 
            Item_Category: 
            Item_Total_Before_Discount:
            Item_Discount: 
            *
            ?Item_Taxable_Value:
            *
            CGST_Rate: 
            CGST_Amount: 
            SGST_Rate: 
            SGST_Amount: 
            IGST_Rate: 
            IGST_Amount: 
            *
            CESS_Rate: 
            CESS_Amount: 
            TCS:

            Item_Total_Including_GST: 
            Flag_Reverse_Charge: 
            Percent_Reverse_Charge_Rate:
            Reverse_charge_liability:
            Reverse_charge_paid:
            Flag_Cancelled: 
            Mobile_number: 
            Email_address:

         */



      }).catch((error) => {

      })

    }

    function getUser(clientGST) {
      let data = [];
      // console.log("data", data);

      let userFileData = vm.userData.saleFile;



      lodash.forEach(userFileData, function(sale) {
        lodash.forEach(sale, function(record) {
          // console.log("record", record);
          if (clientGST == record.Customer_Billing_GSTIN) {
            data.push(record);
            console.log("MATCH FOUND SUCCESSFULLY");
          } else {
            // console.log("No Match Found");
          }


        });
      });
      vm.saleFileData = data;
      // console.log("data", data);

      // console.log("data", data);

    }

    function compareFiles() {
      vm.showStatus = true;
    }

  }
})();