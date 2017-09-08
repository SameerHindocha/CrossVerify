'use strict';
(function() {
  angular
    .module('userApp')
    .directive('updateInvoice', directive);
  directive.inject = ['$scope'];

  function directive() {

    return {
      scope: {
        data: '=',
        onUpdate: '&'
      },
      templateUrl: "app/modules/dashboard/view/update-invoice-popup.html",
      transclude: true,
      controller: ['$scope', 'lodash', function($scope, lodash) {
        $scope.modelId = 'ModelID' + Math.floor(Math.random() * 2000);

        console.log("$scope.data", $scope.data);
        $scope.details = {
          Customer_Billing_Name: $scope.data.Customer_Billing_Name,
          Customer_Billing_GSTIN: $scope.data.Customer_Billing_GSTIN,
          Email_Address: $scope.data.Email_Address,
          Invoice_Number: $scope.data.Invoice_Number,
          Item_Taxable_Value: $scope.data.Item_Taxable_Value,
          CGST_Rate: $scope.data.CGST_Rate,
          CGST_Amount: $scope.data.CGST_Amount,
          SGST_Rate: $scope.data.SGST_Rate,
          SGST_Amount: $scope.data.SGST_Amount,
          IGST_Rate: $scope.data.IGST_Rate,
          IGST_Amount: $scope.data.IGST_Amount,
          TCS: $scope.data.TCS,
          Cess_Rate: $scope.data.Cess_Rate,
          Cess_Amount: $scope.data.Cess_Amount,
          Other_Charges: $scope.data.Other_Charges,
          Roundoff: $scope.data.Roundoff,
          Item_Total_Including_GST: $scope.data.Item_Total_Including_GST
        }

        $scope.openAddPopup = function() {
          $('#' + $scope.modelId).modal('show');
          $scope.initData = {
            Item_Taxable_Value: $scope.data.Item_Taxable_Value,
            CGST_Rate: $scope.data.CGST_Rate,
            CGST_Amount: $scope.data.CGST_Amount,
            SGST_Rate: $scope.data.SGST_Rate,
            SGST_Amount: $scope.data.SGST_Amount,
            IGST_Rate: $scope.data.IGST_Rate,
            IGST_Amount: $scope.data.IGST_Amount,
            TCS: $scope.data.TCS,
            Cess_Rate: $scope.data.Cess_Rate,
            Cess_Amount: $scope.data.Cess_Amount,
            Other_Charges: $scope.data.Other_Charges,
            Roundoff: $scope.data.Roundoff,
            Item_Total_Including_GST: $scope.data.Item_Total_Including_GST
          }
        };
        $scope.send = function() {
          $scope.onUpdate({ details: $scope.details });
        }
        $scope.cancel = function() {
          $scope.details = $scope.initData;
        }
      }],
      link: function($scope, attr, elem) {}
    }
  }
})();