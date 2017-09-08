'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('editCustomerController', controller);

  controller.$inject = ['DashboardService', 'UserService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(DashboardService, UserService, $location, $route, lodash, $rootScope) {
    console.log($route.current.params.id);

    let vm = this;
    vm.clientState = ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "West Bengal", "Chhattisgarh", "Uttarakhand", "Jharkhand", "Telangana"]
    vm.updateClient = updateClient;
    let id = $route.current.params.id,
      month = $route.current.params.month,
      invoiceNo = $route.current.params.invoiceNo,
      flag = $route.current.params.flag;

    // clientCompanyName : vm.clientCompanyName,
    // clientEmail : vm.clientEmail,
    // clientGSTNo : vm.clientGSTNo,
    // clientAddress : vm.clientAddress,
    // clientState : vm.clientState,
    // clientCity : vm.clientCity,
    // clientPincode : vm.clientPincode,
    // clientOwnerName : vm.clientOwnerName,
    // clientMobile : vm.clientMobile



    activate();

    function activate() {


      UserService.getUserById(id).then((response) => {
        console.log("response *- *-* -* -* -*", response);
        if (flag == 0) {
          lodash.forEach(response.saleFile[month], function(data) {
            if (data.Invoice_Number == invoiceNo) {
              vm.clientCompanyName = data.Customer_Billing_Name;
              vm.clientEmail = data.Email_Address;
              vm.clientGSTNo = data.Customer_Billing_GSTIN;
              vm.clientAddress = data.Customer_Billing_Address;
              vm.clientState1 = data.Customer_Billing_State;
              vm.clientCity = data.Customer_Billing_City;
              vm.clientPincode = data.Customer_Billing_PinCode;
              // vm.clientOwnerName = data.;
              vm.clientMobile = data.Mobile_Number;
            }
          })
        }
        if (flag == 1) {
          lodash.forEach(response.purchaseFile[month], function(data) {
            if (data.Invoice_Number == invoiceNo) {
              vm.clientCompanyName = data.Supplier_Name;
              vm.clientEmail = data.Email_Address;
              vm.clientGSTNo = data.Supplier_GSTIN;
              vm.clientAddress = data.Supplier_Address;
              vm.clientState1 = data.Supplier_State;
              vm.clientCity = data.Supplier_City;
              vm.clientPincode = data.Supplier_PinCode;
              // vm.clientOwnerName = data.;
              vm.clientMobile = data.Mobile_Number;
            }
          })
        }
      }).catch((error) => {
        console.log("error", error);
      })
    }

    function updateClient() {
      let updatedObj = {
        clientCompanyName: vm.clientCompanyName,
        clientEmail: vm.clientEmail,
        clientGSTNo: vm.clientGSTNo,
        clientAddress: vm.clientAddress,
        clientState: vm.clientState1,
        clientCity: vm.clientCity,
        clientPincode: vm.clientPincode,
        clientOwnerName: vm.clientOwnerName,
        clientMobile: vm.clientMobile,
        Invoice_Number: $route.current.params.invoiceNo,
        date: $route.current.params.month,
        flag: flag
      }

      DashboardService.updateClientInfo(updatedObj).then((response) => {
        noty('success', response.data.message);
        let isShare = confirm("Do You Want to Send OTP?");
        if (isShare == true) {
          if (vm.clientEmail) {
            console.log(vm.clientEmail);

            let postObj = {
              email: vm.clientEmail
            }
            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
          if (vm.clientMobile) {
            console.log("vm.clientMobile", vm.clientMobile);
            let postObj = {
              mobile: vm.clientMobile
            }
            DashboardService.sendConfirmationSMS(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })


          }
        }
        $location.path('/dashboard');


      }).catch((error) => {
        console.log("error", error);
        noty('error', error.data.message);

      })


    }



  }
})();