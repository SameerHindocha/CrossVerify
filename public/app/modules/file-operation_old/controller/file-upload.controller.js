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
    // vm.removeInputErrorClass = removeInputErrorClass;
    vm.dateOfFile = new Date();
    vm.saleHeaderArray = [];
    vm.purchaseHeaderArray = [];
    vm.upload = $route.current.params.from;
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

    vm.defaultSalesHeaderValues = ['Invoice_Date', 'Invoice_Number', 'Invoice_Category', 'Type', 'Supply_Type', 'Customer_Billing_Name',
      'Customer_Billing_Address', 'Customer_Billing_City', 'Customer_Billing_PinCode', 'Customer_Billing_State',
      'Customer_Billing_StateCode', 'Customer_Billing_GSTIN', 'Item_Category', 'Item_Total_Before_Discount', 'Item_Discount', 'Nil_Rated_Amount',
      'Exempted_Amount', 'Non_GST_Amount', 'Item_Taxable_Value', 'CGST_Rate',
      'CGST_Amount', 'SGST_Rate', 'SGST_Amount', 'IGST_Rate', 'IGST_Amount', 'TCS', 'CESS_Rate',
      'CESS_Amount', 'Other_Charges', 'Roundoff', 'Item_Total_Including_GST', 'Taxable_Value_on_which_TCS_has_been_deducted',
      'Mobile_Number', 'Email_Address'
    ]

    activate();

    function activate() {
      getPreviousMonth();
      $('.selectpicker').selectpicker();
    }

    $timeout(function() {

      $('.selectpicker').on('change', function() {
        console.log($(this).prev().prev().attr('class'));
        console.log($(this).parent().children().first());
        console.log($(this).attr('class'));
        $(this).parent().children().first().removeClass("input-error");
      });
    })

    // function removeInputErrorClass(event) {
    //   console.log('in remove input error');
    //   event.srcElement.className = '';
    // }


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
          lodash.forEach(vm.salesHeaderFields, function(field) {
            vm.saleHeaderArray.push(field.h);
          });
          lodash.forEach(vm.purchaseHeaderFields, function(field) {
            vm.purchaseHeaderArray.push(field.h);
          });
          $timeout(function() {
            $('.selectpicker').selectpicker('refresh');
          }, 500);

          $timeout(function() {
            $('#Sale').find('button').each(function() {
              if ($(this).find('.filter-option').text() != vm.saleHeaderArray[$(this).attr('data-id')]) {
                $(this).addClass("input-error");
              }
            });
          }, 500)
          $timeout(function() {
            $('#Purchase').find('button').each(function() {
              if ($(this).find('.filter-option').text() != vm.purchaseHeaderArray[$(this).attr('data-id')]) {
                $(this).addClass("input-error");
                vm.displayLabel = true;
              }
            });
          }, 500)
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
        $('#Sale').find('label').each(function() {
          if (record[$(this).text()]) {
            let saleHeaderId = $(this).next().children().first().text().trim();
            newSaleObject[saleHeaderId] = record[$(this).text()].trim();
          }
        });
        delete newSaleObject['Select'];
        newSaleData.push(newSaleObject);
      });
      lodash.forEach(vm.purchaseData, function(record) {
        let newPurchaseObject = {};
        $('#Purchase').find('label').each(function() {
          if (record[$(this).text()]) {
            let purchaseHeaderId = $(this).next().children().first().text().trim();
            newPurchaseObject[purchaseHeaderId] = record[$(this).text()].trim();
          }
        });
        delete newPurchaseObject['Select'];
        newPurchaseData.push(newPurchaseObject);
      });
      let postObj = {
        newSaleData: newSaleData,
        newPurchaseData: newPurchaseData,
        date: vm.dateOfFile.toString("yyyy-MM")
      }
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
        }).catch((error) => {
          console.log("error", error);
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