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
    let date = new Date(); // 2012-03-31
    date.setMonth(date.getMonth() - 1);

    vm.filterByMonth = date;
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
    vm.saleSendToAllEmailAndSMS = saleSendToAllEmailAndSMS;
    vm.purchaseSendToAllEmailAndSMS = purchaseSendToAllEmailAndSMS;
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
    let saleArray = [];
    let purchaseArray = [];
    let mobileSaleArray = [];
    vm.filterTotalSaleInvoice = filterTotalSaleInvoice;
    vm.filterVerifiedSaleInvoice = filterVerifiedSaleInvoice;
    vm.filterMismatchedSaleInvoice = filterMismatchedSaleInvoice;
    vm.filterNotVerifiedSaleInvoice = filterNotVerifiedSaleInvoice;
    vm.filterTotalPurchaseInvoice = filterTotalPurchaseInvoice;
    vm.filterVerifiedPurchaseInvoice = filterVerifiedPurchaseInvoice;
    vm.filterMismatchedPurchaseInvoice = filterMismatchedPurchaseInvoice;
    vm.filterNotVerifiedPurchaseInvoice = filterNotVerifiedPurchaseInvoice;
    let finalSaleData = [];
    let finalPurchaseData = [];
    let filterMonth;
    vm.autoVerifySale = autoVerifySale;
    vm.autoVerifyPurchase = autoVerifyPurchase;
    vm.displaySaleLoder = false;
    vm.displayPurchaseLoder = false;
    vm.clearPurchasesearch = clearPurchasesearch;
    vm.clearSaleSearch = clearSaleSearch;

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

    function saleSendToAllEmailAndSMS() {
      console.log("saleArray", saleArray);
    }

    function purchaseSendToAllEmailAndSMS() {
      console.log("purchaseArray", purchaseArray);
    }



    function sendMonthlyEmail(customerGSTIN, invoiceNo, event, email) {
      let category;
      category = (event.target.id == 'saleEmail') ? 0 : 1;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
      let postObj = {
        email: email,
        link: link,
        category: category,
        month: month,
        senderName: currentUser.companyName
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

    function redirectToImportPage(event) {
      let sourceElement = event.srcElement;
      let currentDate = new Date().getDate();
      let importMonth = vm.filterByMonth.toString("yyyy-MM");
      /* For Developement */
      currentDate = 2;
      /* For Developement */
      let from;
      if (sourceElement) {
        from = sourceElement.id;
        console.log("from", from);
      } else if (event.target) {
        from = event.target.id;
      }
      if (currentDate > 10) {
        noty('error', 'File can only be uploaded during first ten days of month');
      } else {
        $location.path('/user/import/' + from + '/' + importMonth);
      }
    }

    function getInvoicesByMonth() {

      saleArray = [];
      purchaseArray = [];
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
          console.log("response", response);
          vm.invoiceData = response;
          vm.saleInvoiceData = response.data.filteredSaleFileData;
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
          finalSaleData = response.data.filteredSaleFileData;
          finalPurchaseData = response.data.filteredPurchaseFileData;

          if (lodash.size(response.data.filteredSaleFileData)) {
            vm.saleFileDataToFilter = response.data.filteredSaleFileData;
            lodash.forEach(response.data.filteredSaleFileData, function(record) {
              //Share Mail to All

              if (record.Customer_Billing_GSTIN) {
                let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + record.Customer_Billing_GSTIN + '/' + vm.filterByMonth.toString("yyyy-MM") + '/' + record.Invoice_Number + '/' + 0;
                let linkObj = {
                  Email_Address: record.Email_Address,
                  Mobile_Number: record.Mobile_Number,
                  month: filterMonth,
                  Invoice_Number: record.Invoice_Number,
                  GSTINOfRecord: record.Customer_Billing_GSTIN,
                  currentUserGSTIN: currentUser.GSTNo,
                  CGST_Amount: record.CGST_Amount,
                  SGST_Amount: record.SGST_Amount,
                  IGST_Amount: record.IGST_Amount,
                  Item_Total_Including_GST: record.Item_Total_Including_GST,
                  _id: record._id,
                  link: link,
                  isRegisteredUser: record.isRegisteredUser
                }



                // customerGSTIN, invoiceNo, event, mobile
                // 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
                //http://localhost:8020/#/temporary-dashboard/27AAACB7403R1ZD/27AAACP7444E1ZH/2017-09/054 /1
                saleArray.push(linkObj);







                // customerGSTIN, invoiceNo, event, mobile
                // 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
                //http://localhost:8020/#/temporary-dashboard/27AAACB7403R1ZD/27AAACP7444E1ZH/2017-09/054 /1


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
            })


          }
          if (lodash.size(response.data.filteredPurchaseFileData)) {
            vm.purchaseFileDataToFilter = response.data.filteredPurchaseFileData;
            lodash.forEach(response.data.filteredPurchaseFileData, function(record) {


              if (record.Supplier_GSTIN) {

                let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + record.Supplier_GSTIN + '/' + vm.filterByMonth.toString("yyyy-MM") + '/' + record.Invoice_Number + '/' + 1;
                let linkObj = {
                  Email_Address: record.Email_Address,
                  Mobile_Number: record.Mobile_Number,
                  month: filterMonth,
                  Invoice_Number: record.Invoice_Number,
                  GSTINOfRecord: record.Supplier_GSTIN,
                  currentUserGSTIN: currentUser.GSTNo,
                  CGST_Amount: record.CGST_Amount,
                  SGST_Amount: record.SGST_Amount,
                  IGST_Amount: record.IGST_Amount,
                  Item_Total_Including_GST: record.Item_Total_Including_GST,
                  _id: record._id,
                  link: link,
                  isRegisteredUser: record.isRegisteredUser
                }


                // customerGSTIN, invoiceNo, event, mobile
                // 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
                //http://localhost:8020/#/temporary-dashboard/27AAACB7403R1ZD/27AAACP7444E1ZH/2017-09/054 /1
                purchaseArray.push(linkObj);
              }

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

          console.log("purchaseArray", purchaseArray);
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



    function selfVerify(recordId, event) {
      // console.log("event= = = > > >", event);
      console.log("target= = = > > >", event);
      let parent;
      if (event.srcElement) {
        parent = event.srcElement.parentElement.parentElement;
      } else if (event.target) {
        parent = event.target.parentNode.parentNode;
      }
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
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function correctPurchase(invoiceNo, GSTIN, event) {
      // console.log($(this).prev().prev().attr('class'));
      // console.log($(this).parent().children().first());
      // console.log($(this).attr('class'));

      let status;
      let parent;
      let saleObject;
      let purchaseObject;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let salePurchaseFlag;
      let skipSale = false;
      let skipPurchase = false;
      if (event.srcElement) { //For Chrome
        parent = event.srcElement.parentElement.parentElement.parentElement;
      } else if (event.target) { // For Firefox
        parent = event.target.parentNode.parentNode.parentNode;
      }

      if (event.toElement.id == 'correctSale') {
        status = 'verified';
        salePurchaseFlag = 0;
      } else if (event.toElement.id == 'wrongSale') {
        status = 'mismatched';
        salePurchaseFlag = 0;
      } else if (event.toElement.id == 'correctPurchase') {
        status = 'verified';
        salePurchaseFlag = 1;
      } else if (event.toElement.id == 'wrongPurchase') {
        status = 'mismatched';
        salePurchaseFlag = 1;
      }

      // console.log("status", status);
      // console.log("salePurchaseFlag", salePurchaseFlag);

      // if ($(parent).attr('class') == 'ng-scope mismatched') {
      //   if (status == 'verified' && salePurchaseFlag == 0) {
      //     verifiedSale++;
      //     mismatchedSale--;
      //   }
      //   if (status == 'verified' && salePurchaseFlag == 1) {
      //     verifiedPurchase++;
      //     mismatchedPurchase--;
      //   }
      //   skipSale = true;
      //   skipPurchase = true;
      // }
      // if (status == 'verified') {
      //   $(parent).addClass("verified");
      //   $(parent).removeClass("mismatched");

      //   console.log("$(parent).find('#corectWrongBtn')", $(parent).find('#corectWrongBtn'));
      //   console.log("$(parent).find('#corectWrongBtn')", $(parent).find('#corectWrongBtn')[0].children[0]);
      //   $(parent).find('#corectWrongBtn')[0].children[0].remove();

      // } else {
      //   $(parent).addClass("mismatched");
      //   $(parent).removeClass("verified");
      // }

      if (salePurchaseFlag == 0) { //Correct or Wrong From Sale
        saleObject = {
          date: month,
          status: status,
          Invoice_Number: invoiceNo,
          GSTINOfRecord: GSTIN,
          currentUserGSTIN: currentUser.GSTNo
        }

        purchaseObject = {
          date: month,
          status: status,
          Invoice_Number: invoiceNo,
          GSTINOfRecord: currentUser.GSTNo,
          currentUserGSTIN: GSTIN
        }

        // if (skipSale == true) {
        //   console.log("skipSale == true");
        // } else if ($(parent).attr('class') == 'ng-scope mismatched') {
        //   notVerifiedSale--;
        //   mismatchedSale++;
        // } else {
        //   verifiedSale++;
        //   notVerifiedSale--;
        // }
        // updateSummary();
      }

      if (salePurchaseFlag == 1) { //Correct or Wrong From Purchase
        purchaseObject = {
          date: month,
          status: status,
          Invoice_Number: invoiceNo,
          GSTINOfRecord: GSTIN,
          currentUserGSTIN: currentUser.GSTNo
        }

        saleObject = {
          date: month,
          status: status,
          Invoice_Number: invoiceNo,
          GSTINOfRecord: currentUser.GSTNo,
          currentUserGSTIN: GSTIN
        }
        if (skipPurchase == true) {
          console.log("skipPurchase == true");
        } else if ($(parent).attr('class') == 'ng-scope mismatched') {
          notVerifiedPurchase--;
          mismatchedPurchase++;
        } else {
          verifiedPurchase++;
          notVerifiedPurchase--;
        }
      }


      DashboardService.changePurchaseStatus(purchaseObject).then((response) => {
        getInvoicesByMonth();
        noty('success', 'Purchase Status Changed Successfully');
      }).catch((error) => {
        noty('error', error.data.message);
      })

      DashboardService.changeSaleStatus(saleObject).then((response) => {
        // getInvoicesByMonth();
        // noty('success', response.data.message);
        noty('success', 'Sale Status Changed Successfully');
      }).catch((error) => {
        noty('error', error.data.message);
      })

    }

    function updateSummary() {
      vm.verifiedSale = verifiedSale;
      vm.mismatchedSale = mismatchedSale;
      vm.notVerifiedSale = notVerifiedSale;

      vm.verifiedPurchase = verifiedPurchase;
      vm.mismatchedPurchase = mismatchedPurchase;
      vm.notVerifiedPurchase = notVerifiedPurchase;
    }

    function editCustomer(recordId, recordGSTIN, event) {
      let id = currentUser._id;
      let GSTIN = recordGSTIN;
      let _id = recordId;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let flag = (event.target.id == 'saleEdit') ? 0 : 1;
      $location.path('/edit-customer/' + id + '/' + month + '/' + _id + '/' + GSTIN + '/' + flag);
    }


    function editSaleRow(data) {
      if (vm.filterByMonth) {
        let month = vm.filterByMonth.toString("yyyy-MM");
        data.date = month;
      }
      DashboardService.editSaleFile(data).then((response) => {
        noty('success', response.data.message);
        vm.saleInvoiceData = response.data.saleData;
        let isShare = confirm("Do You Want to Send Confirmation Email to " + response.data.data.Customer_Billing_Name + " ?");
        if (isShare == true) {
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
      DashboardService.editPurchaseFile(data).then((response) => {
        noty('success', response.data.message);
        vm.purchaseInvoiceData = response.data.purchaseData;
        let isShare = confirm("Do You Want to Send Confirmation Email to " + response.data.data.Supplier_Name + " ?");
        if (isShare == true) {
          response.data.data.type = 'Purchase';
          response.data.data.date = vm.filterByMonth.toString("yyyy-MM");
          if (response.data.data.Email_Address) {
            let postObj = {
              data: response.data.data
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

    function clearSaleSearch() {
      vm.saleSearchText = '';
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

    function clearPurchasesearch() {
      vm.purchaseSearchText = '';
    }

    function filterTotalSaleInvoice() {
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.saleInvoiceData = response.data.filteredSaleFileData;
        })
      }
    }

    function filterVerifiedSaleInvoice() {
      let verifiedSaleInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.saleInvoiceData = response.data.filteredSaleFileData;
          lodash.forEach(vm.saleInvoiceData, function(record) {
            if (record.status == 'verified') {
              verifiedSaleInvoiceData.push(record);
            }
          });
          vm.saleInvoiceData = verifiedSaleInvoiceData;
        })
      }
    }

    function filterMismatchedSaleInvoice() {
      let mismatchedSaleInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.saleInvoiceData = response.data.filteredSaleFileData;
          lodash.forEach(vm.saleInvoiceData, function(record) {
            if (record.status == 'mismatched') {
              mismatchedSaleInvoiceData.push(record);
            }
          });
          vm.saleInvoiceData = mismatchedSaleInvoiceData;
        })
      }
    }

    function filterNotVerifiedSaleInvoice() {
      let notVerifiedSaleInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.saleInvoiceData = response.data.filteredSaleFileData;
          lodash.forEach(vm.saleInvoiceData, function(record) {
            if (record.status != 'verified' && record.status != 'mismatched') {
              notVerifiedSaleInvoiceData.push(record);
            }
          });
          vm.saleInvoiceData = notVerifiedSaleInvoiceData;
        })
      }
    }

    function filterTotalPurchaseInvoice() {
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
        })
      }
    }

    function filterVerifiedPurchaseInvoice() {
      let verifiedPurchaseInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
          lodash.forEach(vm.purchaseInvoiceData, function(record) {
            if (record.status == 'verified') {
              verifiedPurchaseInvoiceData.push(record);
            }
          });
          vm.purchaseInvoiceData = verifiedPurchaseInvoiceData;
        })
      }
    }

    function filterMismatchedPurchaseInvoice() {
      let mismatchedPurchaseInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
          lodash.forEach(vm.purchaseInvoiceData, function(record) {
            if (record.status == 'mismatched') {
              mismatchedPurchaseInvoiceData.push(record);
            }
          });
          vm.purchaseInvoiceData = mismatchedPurchaseInvoiceData;
        })
      }
    }

    function filterNotVerifiedPurchaseInvoice() {
      let notVerifiedPurchaseInvoiceData = [];
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          vm.purchaseInvoiceData = response.data.filteredPurchaseFileData;
          lodash.forEach(vm.purchaseInvoiceData, function(record) {
            if (record.status != 'verified' && record.status != 'mismatched') {
              notVerifiedPurchaseInvoiceData.push(record);
            }
          });
          vm.purchaseInvoiceData = notVerifiedPurchaseInvoiceData;
        })
      }
    }

    function autoVerifySale() {
      vm.displaySaleLoder = true;
      let autoVerifySaleArray = [];
      // let autoVerifyPurchaseArray = [];
      let saleObject;
      let purchaseObject;
      lodash.forEach(saleArray, function(saleRecord) {
        saleObject = {
          date: saleRecord.month,
          Invoice_Number: saleRecord.Invoice_Number,
          GSTINOfRecord: saleRecord.GSTINOfRecord,
          currentUserGSTIN: saleRecord.currentUserGSTIN,
          CGST_Amount: saleRecord.CGST_Amount,
          SGST_Amount: saleRecord.SGST_Amount,
          IGST_Amount: saleRecord.IGST_Amount,
          Item_Total_Including_GST: saleRecord.Item_Total_Including_GST,
          _id: saleRecord._id,
          isRegisteredUser: saleRecord.isRegisteredUser
        }
        autoVerifySaleArray.push(saleObject);
        // purchaseObject = {
        //   date: saleRecord.month,
        //   Invoice_Number: saleRecord.Invoice_Number,
        //   GSTINOfRecord: saleRecord.currentUserGSTIN,
        //   currentUserGSTIN: saleRecord.GSTINOfRecord,
        //   CGST_Amount: saleRecord.CGST_Amount,
        //   SGST_Amount: saleRecord.SGST_Amount,
        //   IGST_Amount: saleRecord.IGST_Amount,
        //   Item_Total_Including_GST: saleRecord.Item_Total_Including_GST,
        // }
        // autoVerifyPurchaseArray.push(purchaseObject);
      })
      DashboardService.autoVerifySaleService(autoVerifySaleArray).then((response) => {
        vm.displaySaleLoder = false;
        noty('success', response.data.message);
        getInvoicesByMonth();
      }).catch((error) => {
        noty('error', error.data.message);
      })


      // DashboardService.autoVerifyPurchaseService(autoVerifyPurchaseArray).then((response) => {
      //   noty('success', response.data.message);
      // }).catch((error) => {
      //   noty('error', error.data.message);
      // })


      console.log("autoVerifySaleArray", autoVerifySaleArray);


    }

    function autoVerifyPurchase() {
      vm.displayPurchaseLoder = true;
      console.log("purchaseArray", purchaseArray);

      let autoVerifyPurchaseArray = [];
      // let autoVerifySaleArray = [];

      let purchaseObject;
      let saleObject;

      lodash.forEach(purchaseArray, function(purchaseRecord) {
        purchaseObject = {
          date: purchaseRecord.month,
          Invoice_Number: purchaseRecord.Invoice_Number,
          GSTINOfRecord: purchaseRecord.GSTINOfRecord,
          currentUserGSTIN: purchaseRecord.currentUserGSTIN,
          CGST_Amount: purchaseRecord.CGST_Amount,
          SGST_Amount: purchaseRecord.SGST_Amount,
          IGST_Amount: purchaseRecord.IGST_Amount,
          Item_Total_Including_GST: purchaseRecord.Item_Total_Including_GST,
          _id: purchaseRecord._id,
          isRegisteredUser: purchaseRecord.isRegisteredUser
        }
        autoVerifyPurchaseArray.push(purchaseObject);
      })
      console.log("autoVerifyPurchaseArray------", autoVerifyPurchaseArray);
      // saleObject = {
      //   date: purchaseRecord.month,
      //   Invoice_Number: purchaseRecord.Invoice_Number,
      //   GSTINOfRecord: purchaseRecord.currentUserGSTIN,
      //   currentUserGSTIN: purchaseRecord.GSTINOfRecord,
      //   CGST_Amount: purchaseRecord.CGST_Amount,
      //   SGST_Amount: purchaseRecord.SGST_Amount,
      //   IGST_Amount: purchaseRecord.IGST_Amount,
      //   Item_Total_Including_GST: purchaseRecord.Item_Total_Including_GST,
      // }
      // autoVerifySaleArray.push(saleObject);


      // DashboardService.autoVerifySaleService(autoVerifySaleArray).then((response) => {
      //   noty('success', response.data.message);
      //   getInvoicesByMonth();
      // }).catch((error) => {
      //   noty('error', error.data.message);
      // })


      DashboardService.autoVerifyPurchaseService(autoVerifyPurchaseArray).then((response) => {
        vm.displayPurchaseLoder = false;
        noty('success', response.data.message);
        getInvoicesByMonth();

      }).catch((error) => {
        noty('error', error.data.message);
      })


    }


  }
})();