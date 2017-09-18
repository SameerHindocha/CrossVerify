'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileUploadController', controller);

  controller.$inject = ['UserService', '$location', '$route', 'lodash', '$rootScope', '$sce', '$timeout'];

  function controller(UserService, $location, $route, lodash, $rootScope, $sce, $timeout) {
    let vm = this;
    vm.uploadFiles = uploadFiles;
    vm.postFileData = postFileData;
    vm.removeInputErrorClass = removeInputErrorClass;
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

    function activate() {
      getPreviousMonth();
      $('.selectpicker').selectpicker();
    }

    function removeInputErrorClass(event) {
      console.log('in remove input error');
      event.srcElement.className = '';
    }

    function uploadFiles() {
      let contactDetail = [];
      vm.purchaseHeaderFields;
      vm.salesHeaderFields;
      vm.purchaseData = [];
      vm.saleData = [];
      vm.displayLabel = false;
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


          $timeout(function() {
            $('.selectpicker').selectpicker('refresh');
          }, 500);

          $timeout(function() {
            $('#Sale').find('button').each(function() {
              if ($(this).find('.filter-option').text() != vm.defaultSalesHeaderValues[$(this).attr('data-id')]) {
                $(this).addClass("input-error");
              }
            });
          }, 500)
          $timeout(function() {
            $('#Purchase').find('button').each(function() {
              if ($(this).find('.filter-option').text() != vm.defaultPurchaseHeaderValues[$(this).attr('data-id')]) {
                $(this).addClass("input-error");
                vm.displayLabel = true;
              }
            });
          }, 500)
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

    function getPreviousMonth() {
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let currentDate = new Date();
      let prevMonth = currentDate.getMonth() - 1;
      let year = currentDate.getFullYear();
      if (prevMonth == 11) {
        year = year - 1;
      }
      vm.displayDate = months[prevMonth] + ',' + year;
      vm.dateOfFile = new Date(year, prevMonth);
    }

    function postFileData() {
      let newPurchaseData = [];
      let newSaleData = [];
      let postSaleDataFlag = false;
      let postPurchaseDataFlag = false;
      lodash.forEach(vm.saleData, function(record) {
        let newSaleObject = {};
        $('#Sale').find('button').each(function() {
          if (record[$(this).find('.filter-option').text()]) {
            let saleHeaderId = vm.defaultSalesHeaderValues[$(this).attr('data-id')];
            newSaleObject[saleHeaderId] = record[$(this).find('.filter-option').text()].trim();
          }
        });
        newSaleData.push(newSaleObject);
      });

      lodash.forEach(vm.purchaseData, function(record) {
        let newPurchaseObject = {};
        $('#Purchase').find('button').each(function() {
          if (record[$(this).find('.filter-option').text()]) {
            let purchaseHeaderId = vm.defaultPurchaseHeaderValues[$(this).attr('data-id')];
            newPurchaseObject[purchaseHeaderId] = record[$(this).find('.filter-option').text()].trim();
          }
        });
        newPurchaseData.push(newPurchaseObject);
      });
      let postObj = {
        newSaleData: newSaleData,
        newPurchaseData: newPurchaseData,
        date: vm.dateOfFile.toString("yyyy-MM")
      }

      console.log("postObj", postObj);
      lodash.forEach(newSaleData, function(record) {
        if (!record.Invoice_Number) {
          postSaleDataFlag = true;
        }
      })
      lodash.forEach(newPurchaseData, function(record) {
        if (!record.Invoice_Number) {
          postPurchaseDataFlag = true;
        }
      })
      if (postSaleDataFlag == true) {
        noty('error', 'Invoice number is missing for some record/records in sale file');
      }
      if (postPurchaseDataFlag == true) {
        noty('error', 'Invoice number is missing in some record/records in purchase file');
      }
      if (postSaleDataFlag == false && postPurchaseDataFlag == false) {
        console.log('2');

        UserService.postFileData(postObj).then((response) => {
          $rootScope.missingDataArrayForSale = [];
          $rootScope.missingDataArrayForPurchase = [];
          lodash.forEach(response.data.saleFileData, function(row) {
            let pushSaleFlag = true;
            if (row.Customer_Billing_GSTIN) {
              if (!row.Mobile_Number || !row.Email_Address) {
                if (lodash.size($rootScope.missingDataArrayForSale)) {
                  lodash.forEach($rootScope.missingDataArrayForSale, function(value) {
                    if (row.Customer_Billing_GSTIN == value.Customer_Billing_GSTIN) {
                      pushSaleFlag = false;
                    }
                  })
                  if (pushSaleFlag == true) {
                    $rootScope.missingDataArrayForSale.push(row);
                  }
                } else {
                  $rootScope.missingDataArrayForSale.push(row);
                }
              }
            }
          })
          lodash.forEach(response.data.purchaseFileData, function(row) {
            let pushPurchaseFlag = true;
            if (row.Supplier_GSTIN) {
              if (!row.Mobile_Number || !row.Email_Address) {
                if (lodash.size($rootScope.missingDataArrayForPurchase)) {
                  lodash.forEach($rootScope.missingDataArrayForPurchase, function(value) {
                    if (row.Supplier_GSTIN == value.Supplier_GSTIN) {
                      pushPurchaseFlag = false;
                    }
                  })
                  if (pushPurchaseFlag == true) {
                    $rootScope.missingDataArrayForPurchase.push(row);
                  }
                } else {
                  $rootScope.missingDataArrayForPurchase.push(row);
                }
              }
            }
          })
          if ($rootScope.missingDataArrayForSale.length > 0 || $rootScope.missingDataArrayForPurchase.length > 0) {
            $location.path('/user/upload-contact');
          } else {
            $location.path('/user/dashboard');
          }
          // noty('success', response.data.message);
        }).catch((error) => {
          console.log("error", error);
          // noty('error', error.data.message);
        })
      }
    }

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

  }
})();