'use strict';
(function() {
  angular
    .module('clientApp')
    .controller('dashboardController', controller);

  controller.$inject = ['DashboardService', 'AuthService', '$location', 'lodash', '$rootScope', '$scope'];

  function controller(DashboardService, AuthService, $location, lodash, $rootScope, $scope) {
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.DashboardService = DashboardService;
    vm.fullData = [];
    vm.dateOfFile = '07-02-2017'; //GST Applied From 1st July, 2017
    vm.filterByMonth = new Date();
    vm.redirectToImportPage = redirectToImportPage;
    vm.editSaleRow = editSaleRow;
    vm.editpurchaseRow = editpurchaseRow;
    vm.selfVerify = selfVerify;
    vm.getInvoicesByMonth = getInvoicesByMonth;
    vm.searchSaleGrid = searchSaleGrid;
    vm.searchPurchaseGrid = searchPurchaseGrid;
    vm.sendMonthlyEmail = sendMonthlyEmail;
    vm.sendMonthlySMS = sendMonthlySMS;
    vm.saleSearchText = '';
    vm.purchaseSearchText = '';
    vm.correct = correctPurchase;
    vm.editCustomer = editCustomer;
    vm.sendToAllEmailAndSMS = sendToAllEmailAndSMS;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    vm.currentUserGSTIN = currentUser.GSTNo;
    let verifiedSale = 0;
    let notVerifiedSale = 0;
    let mismatchedSale = 0;
    let totalSaleInvoice = 0;
    let verifiedPurchase = 0;
    let notVerifiedPurchase = 0;
    let mismatchedPurchase = 0;
    let totalPurchaseInvoice = 0;
    let emailIdSaleArray = [];
    let mobileSaleArray = [];

    activate();

    function activate() {
      vm.getCurrentUserForEmail = JSON.parse(window.localStorage.getItem('currentUser'));
      vm.email = vm.getCurrentUserForEmail.email;
      vm.companyName = vm.getCurrentUserForEmail.companyName;
      vm.getInvoicesByMonth();
    }

    $scope.finalvalues = function(details) {
      if (details.invoiceFlag == 0) {
        editSaleRow(details);
      } else if (details.invoiceFlag == 1) {
        editpurchaseRow(details);
      }
    }
    $scope.openPopup = function(saleFile) {
      $scope.fileData = saleFile;
    }

    function sendToAllEmailAndSMS() {
      console.log("123");
    }

    function sendMonthlyEmail(customerGSTIN, invoiceNo, event, email) {
      let category;
      category = (event.target.id == 'saleEmail') ? 0 : 1;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
      let postObj = {
        // email: vm.email,
        email: email,
        link: link
      }
      DashboardService.sendMonthlyEmail(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendMonthlySMS(customerGSTIN, invoiceNo, mobile, event) {
      let category;
      category = (event.target.id == 'saleSMS') ? 0 : 1;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
      let postObj = {
        mobile: mobile,
        link: link,
        category: category,
        month: month,
        senderName: currentUser.companyName
      }
      DashboardService.sendMonthlySMS(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
    // function sendMonthlySMS(customerGSTIN, invoiceNo, mobile, event) {
    //   console.log("mobile", mobile);
    //   let category;
    //   category = (event.target.id == 'saleSMS') ? 0 : 1;
    //   let month = vm.filterByMonth.toString("yyyy-MM");
    //   let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
    //   let postObj = {
    //     // mobile: '9978770693',
    //     mobile: mobile,
    //     link: link
    //   }
    //   DashboardService.sendMonthlySMS(postObj).then((response) => {
    //     noty('success', response.data.message);
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })
    // }

    function redirectToImportPage() {
      let currentDate = new Date().getDate();
      currentDate = 2;
      if (currentDate > 10) {
        noty('error', 'File can only be uploaded during first ten days of month');
      } else {
        $location.path('/user/import');
      }
    }

    function getInvoicesByMonth() {
      let filterMonth;
      verifiedSale = 0;
      notVerifiedSale = 0;
      mismatchedSale = 0;
      totalSaleInvoice = 0;
      verifiedPurchase = 0;
      notVerifiedPurchase = 0;
      mismatchedPurchase = 0;
      totalPurchaseInvoice = 0;
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.invoiceData = response;
          vm.saleInvoiceData = response.data.filteredSaleFileData;
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
          if (lodash.size(response.data.filteredSaleFileData)) {
            vm.saleFileDataToFilter = response.data.filteredSaleFileData;
            lodash.forEach(response.data.filteredSaleFileData, function(record) {
              if (record.Email_Address && record.Invoice_Number && record.Customer_Billing_GSTIN) {
                let linkObj = {
                  Email_Address: record.Email_Address,
                  Invoice_Number: record.Invoice_Number,
                  Customer_Billing_GSTIN: record.Customer_Billing_GSTIN
                }
                // customerGSTIN, invoiceNo, event, mobile
                // 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
                //http://localhost:8020/#/temporary-dashboard/27AAACB7403R1ZD/27AAACP7444E1ZH/2017-09/054 /1
                emailIdSaleArray.push(linkObj);
              }
              if (record.Mobile_Number) {
                mobileSaleArray.push(record.Mobile_Number);
              }
              if (record.status == 'verified') {
                verifiedSale++;
              } else if (record.status == 'mismatched') {
                mismatchedSale++;
              } else {
                notVerifiedSale++;
              }
              totalSaleInvoice++;
              // vm.saleInvoiceTo = record.Invoice_Number;
            })

            // console.log("emailIdSaleArray", emailIdSaleArray);
          }

          // vm.saleInvoiceFrom = response.data.filteredSaleFileData[0].Invoice_Number;

          if (lodash.size(response.data.filteredPurchaseFileData)) {
            vm.purchaseFileDataToFilter = response.data.filteredPurchaseFileData;
            lodash.forEach(response.data.filteredPurchaseFileData, function(record) {
              if (record.status == 'verified') {
                verifiedPurchase++;
              } else if (record.status == 'mismatched') {
                mismatchedPurchase++;
              } else {
                notVerifiedPurchase++;
              }
              totalPurchaseInvoice++;
            })
          }
          vm.verifiedSale = verifiedSale;
          vm.mismatchedSale = mismatchedSale;
          vm.notVerifiedSale = notVerifiedSale;
          vm.totalSaleInvoice = totalSaleInvoice;

          vm.verifiedPurchase = verifiedPurchase;
          vm.mismatchedPurchase = mismatchedPurchase;
          vm.notVerifiedPurchase = notVerifiedPurchase;
          vm.totalPurchaseInvoice = totalPurchaseInvoice;
        }).catch((error) => {
          // console.log("error------", error);
        })
      }
    }

    function editSaleRow(data) {
      if (vm.filterByMonth) {
        let month = vm.filterByMonth.toString("yyyy-MM");
        data.date = month;
      }
      console.log("data-------", data);
      DashboardService.editSaleFile(data).then((response) => {
        console.log("response OF editSaleRow", response);
        noty('success', response.data.message);

        console.log("data._id", data.recordId);
        console.log("currentUser._id", currentUser._id);
        console.log("response.data.data._id", response.data.data._id);

        let isShare = confirm("Do You Want to Send Confirmation Email to " + response.data.data.Customer_Billing_Name + " ?");
        if (isShare == true) {
          // response.data.data._id = currentUser._id;
          response.data.data.type = 'Sale';

          response.data.data.date = vm.filterByMonth.toString("yyyy-MM");
          if (response.data.data.Email_Address) {
            let postObj = {
              data: response.data.data,
              currentUserId: currentUser._id
            }

            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          } else {
            noty('error', 'Email Address Not Found');
          }
          // if (data.Mobile_Number) {
          //   let postObj = {
          //     data: data
          //   }
          //   DashboardService.sendConfirmationSMS(postObj).then((response) => {
          //     noty('success', response.data.message);
          //   }).catch((error) => {
          //     noty('error', error.data.message);
          //   })
          // }
        }
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }


    function editpurchaseRow(data) {
      if (vm.filterByMonth) {
        let month = vm.filterByMonth.toString("yyyy-MM");
        data.date = month;
      }
      console.log("data-------", data);
      DashboardService.editPurchaseFile(data).then((response) => {
        console.log("response OF editpurchaseRow", response);
        noty('success', response.data.message);
        let isShare = confirm("Do You Want to Send Confirmation Email to " + response.data.data.Supplier_Name + " ?");
        if (isShare == true) {
          response.data.data.type = 'Purchase';

          console.log("data.Email_Address", data.Email_Address);

          console.log("response.data.data", response.data.data);
          response.data.data.date = vm.filterByMonth.toString("yyyy-MM");

          if (response.data.data.Email_Address) {
            let postObj = {
              data: response.data.data
            }

            console.log("postObj", postObj);
            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          } else {
            noty('error', 'Email Address Not Found');
          }
          // if (data.Mobile_Number) {
          //   let postObj = {
          //     data: data
          //   }
          //   DashboardService.sendConfirmationSMS(postObj).then((response) => {
          //     noty('success', response.data.message);
          //   }).catch((error) => {
          //     noty('error', error.data.message);
          //   })
          // }
        }
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }


    function selfVerify(recordId, event) {
      let parent = event.srcElement.parentElement.parentElement;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let salePurchaseStatus = (event.target.id == 'saleSelfVerify') ? 0 : 1;;
      let statusObj = {
        date: month,
        status: 'verified',
        recordId: recordId,
        salePurchaseStatus: salePurchaseStatus
      }
      DashboardService.selfVerify(statusObj).then((response) => {
        noty('success', response.data.message);
        $(parent).find('#saleSelfVerify').remove();
        $(parent).find('#purchaseSelfVerify').remove();
        if (salePurchaseStatus == 0) {
          if ($(parent).attr('class') == 'ng-scope mismatched') {
            verifiedSale++;
            mismatchedSale--;
          } else {
            verifiedSale++;
            notVerifiedSale--;
          }
          vm.verifiedSale = verifiedSale;
          vm.mismatchedSale = mismatchedSale;
          vm.notVerifiedSale = notVerifiedSale;
        }
        if (salePurchaseStatus == 1) {
          if ($(parent).attr('class') == 'ng-scope mismatched') {
            verifiedPurchase++;
            mismatchedPurchase--;
          } else {
            verifiedPurchase++;
            notVerifiedPurchase--;
          }
          vm.verifiedPurchase = verifiedPurchase;
          vm.mismatchedPurchase = mismatchedPurchase;
          vm.notVerifiedPurchase = notVerifiedPurchase;
        }
        $(parent).addClass("verified");
        $(parent).removeClass("mismatched");


        /*
              vm.verifiedSale = verifiedSale;
                  vm.mismatchedSale = mismatchedSale;
                  vm.notVerifiedSale = notVerifiedSale;
                  vm.totalSaleInvoice = totalSaleInvoice;

                  vm.verifiedPurchase = verifiedPurchase;
                  vm.mismatchedPurchase = mismatchedPurchase;
                  vm.notVerifiedPurchase = notVerifiedPurchase;
                  vm.totalPurchaseInvoice = totalPurchaseInvoice;
         */

      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function correctPurchase(invoiceNo, GSTIN, event) {
      console.log("event", event);

      let status = event.toElement.id == 'correct' ? 'verified' : 'mismatched';
      let parent = event.srcElement.parentElement.parentElement;
      $(parent).find('#correct').remove();
      $(parent).find('#wrong').remove();
      let month = vm.filterByMonth.toString("yyyy-MM");


      let statusObj = {
        date: month,
        status: status,
        Invoice_Number: invoiceNo,
        GSTINOfRecord: GSTIN,
        currentUserGSTIN: currentUser.GSTNo
      }

      console.log("statusObj purchase", statusObj);
      DashboardService.changePurchaseStatus(statusObj).then((response) => {
        // noty('success', 'Purchase Status Changed');
      }).catch((error) => {
        noty('error', error.data.message);
      })



      let obj = {
        date: month,
        status: status,
        Invoice_Number: invoiceNo,
        GSTINOfRecord: currentUser.GSTNo,
        currentUserGSTIN: GSTIN
      }

      console.log("obj sale", obj);
      DashboardService.changeSaleStatus(obj).then((response) => {
        noty('success', response.data.message);
        if (status == 'verified') {
          $(parent).addClass("verified");
          $(parent).removeClass("mismatched");
        } else {
          $(parent).addClass("mismatched");
          $(parent).removeClass("verified");
        }
        if ($(parent).attr('class') == 'ng-scope mismatched') {
          notVerifiedPurchase--;
          mismatchedPurchase++;
        } else {
          verifiedPurchase++;
          notVerifiedPurchase--;
        }
        vm.verifiedPurchase = verifiedPurchase;
        vm.mismatchedPurchase = mismatchedPurchase;
        vm.notVerifiedPurchase = notVerifiedPurchase;
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function editCustomer(recordId, event) {
      let id = currentUser._id;
      // let recordId = recordId;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let flag = (event.target.id == 'saleEdit') ? 0 : 1;;
      // let invoiceNo = invoiceNumber;
      $location.path('/edit-customer/' + id + '/' + month + '/' + recordId + '/' + flag);
    }

    function searchSaleGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Customer_Billing_Name && item.Customer_Billing_GSTIN) {
            return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          } else {
            if (item.Customer_Billing_Name && !item.Customer_Billing_GSTIN) {
              return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            }
            if (item.Customer_Billing_GSTIN && !item.Customer_Billing_Name) {
              return (item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            }
          }
        }
      }
      let totalSaleData = vm.saleFileDataToFilter;
      if (vm.saleSearchText == '') {
        vm.saleInvoiceData = vm.saleFileDataToFilter;
      } else {
        vm.filteredSaleList = lodash.filter(totalSaleData,
          function(item) {
            return searchUtil(item, vm.saleSearchText);
          });

        vm.saleInvoiceData = vm.filteredSaleList;
      }
    }

    function searchPurchaseGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Supplier_Name && item.Supplier_GSTIN) {
            return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          } else {
            if (item.Supplier_Name && !item.Supplier_GSTIN) {
              return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            }
            if (item.Supplier_GSTIN && !item.Supplier_Name) {
              return (item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            }
          }
        }
      }
      let totalPurchaseData = vm.purchaseFileDataToFilter;
      if (vm.purchaseSearchText == '') {
        vm.purchaseInvoiceData = vm.purchaseFileDataToFilter;
      } else {
        vm.filteredPurchaseList = lodash.filter(totalPurchaseData,
          function(item) {
            return searchUtil(item, vm.purchaseSearchText);
          });
        vm.purchaseInvoiceData = vm.filteredPurchaseList;
      }
    }
  }
})();