'use strict';
(function() {
  angular
    .module('userApp')
    .controller('addUserSaleController', controller);

  controller.$inject = ['UserService', '$location', '$rootScope'];

  function controller(UserService, $location, $rootScope) {
    console.log("sss");
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.UserService = UserService;
    vm.addUserSale = addUserSale;
    vm.id = JSON.parse(window.localStorage.getItem('currentUser'))._id;
    activate();

    console.log("vm.id", vm.id);

    function activate() {}

    function addUserSale() {
      let postObj = {
        id: vm.id,
        Invoice_Date: vm.invoiceDate,
        Invoice_number: vm.invoiceNumber,
        Invoice_Category: vm.invoiceCategory,
        Type: vm.type,
        Supply_Type: vm.supplyType,
        Customer_Billing_Name: vm.customerBillingName,
        Customer_Billing_Address: vm.customerBillingAddress,
        Customer_Billing_City: vm.customerBillingCity,
        Customer_Billing_PinCode: vm.customerBillingPinCode,
        Customer_Billing_State: vm.customerBillingState,
        Customer_Billing_StateCode: vm.customerBillingStateCode,
        Customer_Billing_GSTIN: vm.customerBillingGSTIN,
        Item_Category: vm.itemCategory,
        Item_Total_Before_Discount: vm.itemTotalBeforeDiscount,
        Item_Discount: vm.itemDiscount,
        Nil_Rated_Amount: vm.nilRatedAmount,
        Exempted_Amount: vm.exemptedAmount,
        Non_GST_Amount: vm.nonGSTAmount,
        Item_Taxable_Value: vm.itemTaxableValue,
        CGST_Rate: vm.CGSTRate,
        CGST_Amount: vm.CGSTAmount,
        SGST_Rate: vm.SGSTRate,
        SGST_Amount: vm.SGSTAmount,
        IGST_Rate: vm.IGSTRate,
        IGST_Amount: vm.IGSTAmount,
        TCS: vm.TCS,
        Cess_Rate: vm.cessRate

      };

      UserService.addUserSale(postObj).then((response) => {
        console.log("response", response);
        noty('success', response.data.message);

      }).catch((error) => {
        noty('error', error.data.message);
      })

    }


  }
})();