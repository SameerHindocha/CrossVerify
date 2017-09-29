'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileUploadController', controller);

  controller.$inject = ['UserService', '$location', '$route', 'lodash', '$rootScope', '$sce', '$timeout'];

  function controller(UserService, $location, $route, lodash, $rootScope, $sce, $timeout) {
    console.log("CALLED CONTROLLER");
    let vm = this;
    vm.uploadFiles = uploadFiles;
    vm.postFileData = postFileData;
    vm.datePickerChange = datePickerChange;
    // vm.removeInputErrorClass = removeInputErrorClass;
    vm.dateOfFile = new Date();
    vm.saleHeaderArray = [];
    vm.purchaseHeaderArray = [];
    vm.upload = $route.current.params.from;
    $rootScope.activeTab = (vm.upload == 'reUploadPurchase') ? 1 : 0;

    console.log("$route.current.params", $route.current.params);
    vm.dateOfFile = $route.current.params.month;
    vm.displayDate = $route.current.params.month.substring(5, 7);
    let year = $route.current.params.month.substring(0, 4);
    $rootScope.userData = {
      Mobile_Number: '',
      Email_Address: ''
    };
    switch (vm.displayDate) {
      case '01':
        vm.displayDate = "January," + year;
        break;
      case '02':
        vm.displayDate = "February," + year;
        break;
      case '03':
        vm.displayDate = "March," + year;
        break;
      case '04':
        vm.displayDate = "April," + year;
        break;
      case '05':
        vm.displayDate = "May," + year;
        break;
      case '06':
        vm.displayDate = "June," + year;
        break;
      case '07':
        vm.displayDate = "July," + year;
        break;
      case '08':
        vm.displayDate = "August," + year;
        break;
      case '09':
        vm.displayDate = "September," + year;
        break;
      case '10':
        vm.displayDate = "October," + year;
        break;
      case '11':
        vm.displayDate = "November," + year;
        break;
      case '12':
        vm.displayDate = "December," + year;
        break;
    }
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

    function activate() {}

    function formatDate() {
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let month = new Date(vm.displayDate).getMonth();
      let currentDate = new Date(vm.displayDate);
      let thisMonth = currentDate.getMonth();
      let year = currentDate.getFullYear();
      vm.displayDate = months[thisMonth] + ',' + year;
      vm.dateOfFile = new Date(year, thisMonth);
    }

    function datePickerChange() {
      console.log("123");
      $timeout(function() {
        console.log("samir");
        $('.selectpicker').on('change', function() {
          console.log("$(this)", $(this).children());
          $(this).parent().children().first().removeClass("input-error");
        });
      }, 4000)
    }

    function uploadFiles() {
      let contactDetail = [];
      vm.purchaseHeaderFields;
      vm.salesHeaderFields;
      vm.purchaseData = [];
      vm.saleData = [];
      vm.saleHeaderArray = [];
      vm.purchaseHeaderArray = [];
      vm.displayLabel = false;
      vm.loaderBackground = true;

      if (vm.upload == 'reUploadSale') {
        if (!vm.saleFile) {
          vm.loaderBackground = false;
          noty('error', 'You have not uploaded the sale file');
        } else {
          $rootScope.uploadDate = vm.dateOfFile;
          let fileObj = {
            saleFile: vm.saleFile,
            id: vm.id,
            dateOfFile: vm.dateOfFile
          };
          let urldata = {
            url: "admin-api/read-file-data",
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: fileObj
          };
          UserService.readFiles(urldata).then((response) => {
            vm.displayLabel = false;
            vm.salesHeaderFields = response.data.salesHeaderFields;
            vm.saleData = response.data.saleData;
            lodash.forEach(vm.salesHeaderFields, function(field) {
              vm.saleHeaderArray.push(field.h);
            });
            $timeout(function() {
              $('.selectpicker').selectpicker('refresh');
            }, 500);

            $timeout(function() {
              $('#Sale').find('button').each(function() {
                if ($(this).find('.filter-option').text() != vm.saleHeaderArray[$(this).attr('data-id')]) {
                  $(this).addClass("input-error");
                  vm.displayLabel = true;
                  // datePickerChange();
                }
              });
            }, 500)
            // $timeout(function() {
            //   $('#Purchase').find('button').each(function() {
            //     if ($(this).find('.filter-option').text() != vm.purchaseHeaderArray[$(this).attr('data-id')]) {
            //       $(this).addClass("input-error");
            //       vm.displayLabel = true;
            //     }
            //   });
            // }, 500)
          }).catch((error) => {
            console.log("error", error);
          });
        }
      }
      if (vm.upload == 'reUploadPurchase') {
        if (!vm.purchaseFile) {
          vm.loaderBackground = false;
          noty('error', 'You have not uploaded the purchase file')
        } else {
          $rootScope.uploadDate = vm.dateOfFile;
          let fileObj = {
            purchaseFile: vm.purchaseFile,
            id: vm.id,
            dateOfFile: vm.dateOfFile
          };
          let urldata = {
            url: "admin-api/read-file-data",
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: fileObj
          };
          UserService.readFiles(urldata).then((response) => {
            vm.displayLabel = false;

            console.log("response purchase", response);
            vm.purchaseHeaderFields = response.data.purchaseHeaderFields;
            vm.purchaseData = response.data.purchaseData;

            lodash.forEach(vm.purchaseHeaderFields, function(field) {
              vm.purchaseHeaderArray.push(field.h);
            });
            $timeout(function() {
              $('.selectpicker').selectpicker('refresh');
            }, 500);
            $timeout(function() {
              $('#Purchase').find('button').each(function() {
                if ($(this).find('.filter-option').text() != vm.purchaseHeaderArray[$(this).attr('data-id')]) {
                  $(this).addClass("input-error");
                  vm.displayLabel = true;
                  // datePickerChange();
                }
              });
            }, 500)
          }).catch((error) => {
            console.log("error", error);
          });
        }
      }
      if (vm.upload == 'import') {
        if (!vm.purchaseFile || !vm.saleFile) {
          vm.loaderBackground = false;
          noty('error', 'You have not uploaded the sale or purchase file')
        } else {
          vm.salesHeaderFields = {};
          vm.purchaseHeaderFields = {};
          vm.purchaseData = [];
          vm.saleData = [];
          $rootScope.uploadDate = vm.dateOfFile;
          let fileObj = {
            saleFile: vm.saleFile,
            purchaseFile: vm.purchaseFile,
            id: vm.id,
            dateOfFile: vm.dateOfFile
          }
          let urldata = {
            url: "admin-api/read-file-data",
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: fileObj
          };
          UserService.readFiles(urldata).then((response) => {
            vm.displayLabel = false;

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
                  vm.displayLabel = true;
                  // datePickerChange();
                }
              });
            }, 500)
            $timeout(function() {
              $('#Purchase').find('button').each(function() {
                if ($(this).find('.filter-option').text() != vm.purchaseHeaderArray[$(this).attr('data-id')]) {
                  $(this).addClass("input-error");
                  vm.displayLabel = true;
                  // datePickerChange();

                }
              });
            }, 500)
          }).catch((error) => {
            console.log("error", error);
          });
        }
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
          if (lodash.size(response.data.saleFileData)) {
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
          }
          if (lodash.size(response.data.purchaseFileData)) {
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
          }
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

    // $rootScope.updateContact = function(missingDataArrayForSale, missingDataArrayForPurchase) {
    //   let updateObj = {
    //     dateOfFile: $rootScope.uploadDate,
    //     updatedSaleFileData: missingDataArrayForSale,
    //     updatedPurchaseFileData: missingDataArrayForPurchase
    //   }
    //   UserService.updateContact(updateObj).then((response) => {
    //     noty('success', response.data.message);
    //     $location.path('/dashboard');
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })
    // }

  }
})();