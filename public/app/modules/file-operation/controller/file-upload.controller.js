'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileUploadController', controller);

  controller.$inject = ['UserService', '$location', '$route', 'lodash', '$rootScope', '$sce'];

  function controller(UserService, $location, $route, lodash, $rootScope, $sce) {
    let vm = this;
    vm.uploadFiles = uploadFiles;
    vm.postFileData = postFileData;
    vm.dateOfFile = new Date();
    $rootScope.userData = {
      Mobile_Number: '',
      Email_Address: ''
    };
    vm.defaultPurchaseHeaderValues = ['Invoice_Date', 'Invoice_Number', 'Invoice_Category', 'Supply_Type', 'Supplier_Name',
      'Supplier_Address', 'Supplier_City', 'Supplier_PinCode', 'Supplier_State',
      'Supplier_StateCode', 'Supplier_GSTIN', 'Item_Category',
      'Item_Total_Before_Discount', 'Item_Discount', 'Item_Taxable_Value', 'CGST_Rate',
      'CGST_Amount', 'SGST_Rate', 'SGST_Amount', 'IGST_Rate', 'IGST_Amount', 'CESS_Rate',
      'CESS_Amount', 'TCS', 'Item_Total_Including_GST', 'Flag_Reverse_Charge',
      'Percent_Reverse_Charge_Rate', 'Reverse_Charge_Liability', 'Reverse_Charge_Paid',
      'Flag_Cancelled', 'Mobile_Number', 'Email_Address'
    ];
    //CHANGES = Reverse_charge_liability:Reverse_Charge_Liability, Reverse_charge_paid:Reverse_Charge_Paid, Mobile_number:Mobile_Number, Email_address:Email_Address

    vm.defaultSalesHeaderValues = ['Invoice_Date', 'Invoice_Number', 'Invoice_Category', 'Type', 'Supply_Type', 'Customer_Billing_Name',
      'Customer_Billing_Address', 'Customer_Billing_City', 'Customer_Billing_PinCode', 'Customer_Billing_State',
      'Customer_Billing_StateCode', 'Customer_Billing_GSTIN', 'Item_Category', 'Item_Total_Before_Discount', 'Item_Discount', 'Nil_Rated_Amount',
      'Exempted_Amount', 'Non_GST_Amount', 'Item_Taxable_Value', 'CGST_Rate',
      'CGST_Amount', 'SGST_Rate', 'SGST_Amount', 'IGST_Rate', 'IGST_Amount', 'TCS', 'CESS_Rate',
      'CESS_Amount', 'Other_Charges', 'Roundoff', 'Item_Total_Including_GST', 'Taxable_Value_on_which_TCS_has_been_deducted',
      'Mobile_Number', 'Email_Address'
    ]
    //CHANGES = Mobile_number:Mobile_Number, Email_address:Email_Address

    activate();

    function activate() {}

    function uploadFiles() {
      let contactDetail = [];
      if (vm.saleFile && vm.purchaseFile) {
        $rootScope.uploadDate = vm.dateOfFile.toString("yyyy-MM");
        let fileObj = {
          saleFile: vm.saleFile,
          purchaseFile: vm.purchaseFile,
          id: vm.id,
          dateOfFile: vm.dateOfFile.toString("yyyy-MM")
        }
        let urldata = {
          url: "admin-api/read-file-data",
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fileObj
        };
        UserService.readFiles(urldata).then((response) => {
          vm.purchaseHeaderFields = response.data.purchaseHeaderFields;
          vm.salesHeaderFields = response.data.salesHeaderFields;
          vm.purchaseData = response.data.purchaseData;
          vm.saleData = response.data.saleData;
          // noty('success', response.data.message);
          // $location.path('/user/upload-contact');
          // $rootScope.missingDataArray = [];
          // lodash.forEach(response.data.saleFileObject, function(saleFile) {
          //   if (!saleFile.Mobile_Number || !saleFile.Email_Address) {
          //     $rootScope.missingDataArray.push(saleFile);
          //   }
          // })
        }).catch((error) => {
          console.log("error", error);
        });
      }
    }

    // function postFileData() {
    //   console.log("CAlles");
    //   let newPurchaseData = [];
    //   let newSaleData = [];
    //   lodash.forEach(vm.saleData, function(record) {
    //     let newSaleObject = {};
    //     $('#Sale').find('select').each(function() {
    //       if (record[$(this)[0].value]) {
    //         let saleHeaderId = vm.defaultSalesHeaderValues[$(this)[0].id];
    //         newSaleObject[saleHeaderId] = record[$(this)[0].value];
    //       }
    //     });
    //     newSaleData.push(newSaleObject);
    //   });
    //   lodash.forEach(vm.purchaseData, function(record) {
    //     let newPurchaseObject = {};
    //     $('#Purchase').find('select').each(function() {
    //       if (record[$(this)[0].value]) {
    //         let purchaseHeaderId = vm.defaultPurchaseHeaderValues[$(this)[0].id];
    //         newPurchaseObject[purchaseHeaderId] = record[$(this)[0].value];
    //       }
    //     });
    //     newPurchaseData.push(newPurchaseObject);
    //   });
    //   let postObj = {
    //     newSaleData: newSaleData,
    //     newPurchaseData: newPurchaseData,
    //     date: vm.dateOfFile.toString("yyyy-MM")
    //   }
    //   UserService.postFileData(postObj).then((response) => {
    //     noty('success', response.data.message);
    //     $location.path('user/upload-contact');
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })
    // }

    function postFileData() {
      let newPurchaseData = [];
      let newSaleData = [];
      lodash.forEach(vm.saleData, function(record) {
        let newSaleObject = {};
        $('#Sale').find('select').each(function() {
          if (record[$(this)[0].value]) {
            let saleHeaderId = vm.defaultSalesHeaderValues[$(this)[0].id];
            newSaleObject[saleHeaderId] = record[$(this)[0].value];
          }
        });
        newSaleData.push(newSaleObject);
      });

      lodash.forEach(vm.purchaseData, function(record) {
        let newPurchaseObject = {};
        $('#Purchase').find('select').each(function() {
          if (record[$(this)[0].value]) {
            let purchaseHeaderId = vm.defaultPurchaseHeaderValues[$(this)[0].id];
            newPurchaseObject[purchaseHeaderId] = record[$(this)[0].value];
          }
        });
        newPurchaseData.push(newPurchaseObject);
      });
      let postObj = {
        newSaleData: newSaleData,
        newPurchaseData: newPurchaseData,
        date: vm.dateOfFile.toString("yyyy-MM")
      }
      UserService.postFileData(postObj).then((response) => {
        $rootScope.missingDataArrayForSale = [];
        $rootScope.missingDataArrayForPurchase = [];

        lodash.forEach(response.data.saleFileData, function(row) {

          console.log("response.data.saleFileData", response.data.saleFileData);
          if (!row.Mobile_Number || !row.Email_Address) {
            $rootScope.missingDataArrayForSale.push(row);
          }
        })
        lodash.forEach(response.data.purchaseFileData, function(row) {
          if (!row.Mobile_Number || !row.Email_Address) {
            $rootScope.missingDataArrayForPurchase.push(row);
          }
        })
        if ($rootScope.missingDataArrayForSale.length > 0 || $rootScope.missingDataArrayForPurchase.length > 0) {
          console.log("$rootScope.missingDataArrayForSale", $rootScope.missingDataArrayForSale);
          console.log("$rootScope.missingDataArrayForPurchase", $rootScope.missingDataArrayForPurchase);

          $location.path('/user/upload-contact');
        } else {
          $location.path('/user/dashboard');

        }

        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }


    $rootScope.updateContact = function(missingDataArrayForSale) {
      let updateObj = {
        dateOfFile: $rootScope.uploadDate,
        updatedSaleFileData: missingDataArrayForSale
      }
      UserService.updateContact(updateObj).then((response) => {
        noty('success', response.data.message);
        $location.path('/dashboard');
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
    // $rootScope.updateContact = function(missingDataArray) {
    //   let updateObj = {
    //     dateOfFile: $rootScope.uploadDate,
    //     updatedSaleFileData: missingDataArray
    //   }
    //   UserService.updateContact(updateObj).then((response) => {
    //     noty('success', response.data.message);
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })

    // }
  }
})();






/*
    function uploadFiles() {
      let contactDetail = [];
      if (vm.saleFile && vm.purchaseFile) {
        $rootScope.uploadDate = vm.dateOfFile.toString("yyyy-MM");
        let fileObj = {
          saleFile: vm.saleFile,
          purchaseFile: vm.purchaseFile,
          id: vm.id,
          dateOfFile: vm.dateOfFile.toString("yyyy-MM")
        }
        let urldata = {
          url: "admin-api/sale-file",
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fileObj
        };
        UserService.addSaleFiles(urldata).then((response) => {
          noty('success', response.data.message);
          $location.path('/user/upload-contact');
          console.log("response", response);
          $rootScope.missingDataArray = [];
          lodash.forEach(response.data.saleFileObject, function(saleFile) {
            if (!saleFile.Mobile_Number || !saleFile.Email_Address) {
              $rootScope.missingDataArray.push(saleFile);
            }
          })
        }).catch((error) => {
          console.log("error", error);
          noty('error', error.data.message);
        });
      }

    }
 */