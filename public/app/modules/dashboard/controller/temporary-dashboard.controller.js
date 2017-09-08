'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('temporaryDashboardController', controller);

  controller.$inject = ['DashboardService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(DashboardService, $location, $route, lodash, $rootScope) {
    let vm = this;
    vm.sendOTPViaSMS = sendOTPViaSMS;
    vm.sendOTPViaEmail = sendOTPViaEmail;
    vm.correctPurchase = correctPurchase;
    vm.filterByMonth = filterByMonth;
    vm.mobile = '';
    let mobileNumber = vm.mobile;
    vm.verifyOTP = verifyOTP;
    let otp = Math.floor(1000 + Math.random() * 9000);;
    let customerGSTIN = $route.current.params.customerGSTIN;
    let invoiceNo = $route.current.params.invoiceNo;
    let month = $route.current.params.month;
    let category = $route.current.params.category;
    vm.fileCategory = (category == 0) ? 'Purchase' : 'Sale'
    vm.month = month.substring(5, 7);;
    vm.selectedMonth = month;
    let userGSTNo = $route.current.params.userGSTNo;
    vm.verify = false;
    vm.saleSearchText = '';
    vm.purchaseSearchText = '';
    vm.searchSaleGrid = searchSaleGrid;
    vm.searchPurchaseGrid = searchPurchaseGrid;


    activate();

    function activate() {
      vm.filterByMonth();

      switch (vm.month) {
        case '01':
          vm.month = "January";
          break;
        case '02':
          vm.month = "February";
          break;
        case '03':
          vm.month = "March";
          break;
        case '04':
          vm.month = "April";
          break;
        case '05':
          vm.month = "May";
          break;
        case '06':
          vm.month = "June";
          break;
        case '07':
          vm.month = "July";
          break;
        case '08':
          vm.month = "August";
          break;
        case '09':
          vm.month = "September";
          break;
        case '10':
          vm.month = "October";
          break;
        case '11':
          vm.month = "November";
          break;
        case '12':
          vm.month = "December";
          break;
      }
    }


    function filterByMonth() {
      console.log("filterByMonth");
      let postObj = {};
      let object = {
        gst: customerGSTIN
      }
      DashboardService.checkUser(object).then((response) => {
        if (response.data.user) {
          $location.path('/login');
        } else {

          let obj = {
            gst: userGSTNo
          }
          DashboardService.checkUser(obj).then((response) => {
            if (response.data.user) {
              vm.senderCompany = response.data.user.companyName;
              if (vm.fileCategory == 'Purchase') {
                if (response.data.user.saleFile[month]) {
                  lodash.forEach(response.data.user.saleFile[month], function(record) {
                    // console.log("record.Invoice_Number", record.Invoice_Number);
                    if (invoiceNo == record.Invoice_Number) {
                      record.Customer_Billing_Name = response.data.user.companyName;
                      record.Customer_Billing_GSTIN = response.data.user.GSTNo;
                      record.Customer_Billing_State = response.data.user.state;
                      postObj = {
                        month: vm.selectedMonth.toString("yyyy-MM"),
                        data: record,
                        gst: customerGSTIN,
                        category: category
                      }

                      console.log("Purchase postObj", postObj);
                      // if (record.Mobile_Number) {
                      //   vm.mobile = record.Mobile_Number;
                      //   vm.hideMobile = vm.mobile.substring(6, 10);
                      // }
                      // vm.confirmationData = record;
                    }
                  })
                }
              }
              if (vm.fileCategory == 'Sale') {
                if (response.data.user.purchaseFile[month]) {
                  lodash.forEach(response.data.user.purchaseFile[month], function(record) {
                    // console.log("record.Invoice_Number", record.Invoice_Number);
                    if (invoiceNo == record.Invoice_Number) {
                      record.Supplier_Name = response.data.user.companyName;
                      record.Supplier_GSTIN = response.data.user.GSTNo;
                      record.Supplier_State = response.data.user.state;
                      postObj = {
                        month: vm.selectedMonth.toString("yyyy-MM"),
                        data: record,
                        gst: customerGSTIN,
                        category: category
                      }

                      console.log("Sale postObj", postObj);
                      // if (record.Mobile_Number) {
                      //   vm.mobile = record.Mobile_Number;
                      //   vm.hideMobile = vm.mobile.substring(6, 10);
                      // }
                      // vm.confirmationData = record;
                    }
                  })
                }
              }

              DashboardService.addTemporaryData(postObj).then((response) => {
                console.log("response.data****", response.data);
                if (response.data.recordDetails) {
                  function compare(a, b) {
                    const genreA = a.Customer_Billing_GSTIN.toUpperCase();
                    const genreB = b.Customer_Billing_GSTIN.toUpperCase();
                    let comparison = 0;
                    if (genreA > genreB) {
                      comparison = 1;
                    } else if (genreA < genreB) {
                      comparison = -1;
                    }
                    return comparison;
                  }
                  if (response.data.recordDetails.saleFile) {
                    vm.saleGridData = response.data.recordDetails.saleFile[postObj.month];
                    vm.saleFileDataToFilter = response.data.recordDetails.saleFile[postObj.month];

                    //.sort(compare);
                  } else {
                    vm.saleGridData = [];
                  }
                  if (response.data.recordDetails.purchaseFile) {
                    vm.purchaseGridData = response.data.recordDetails.purchaseFile[postObj.month];
                    vm.purchaseFileDataToFilter = response.data.recordDetails.purchaseFile[postObj.month];
                    //.sort(compare);
                  } else {
                    vm.purchaseGridData = [];
                  }
                } else {
                  vm.saleGridData = [];
                  vm.purchaseGridData = [];
                }
              }).catch((error) => {
                console.log("error", error);
              })
            }
          }).catch((error) => {
            console.log("error - - - - ", error);
          })
        }
      }).catch((error) => {
        console.log("error - - - - ", error);
      })
    }



    // function filterByMonth() {
    //   let object = {
    //     gst: customerGSTIN
    //   }

    //   console.log("1st object", object);
    //   DashboardService.checkUser(object).then((response) => {
    //     console.log("1st object response", response);
    //     if (response.data.user) {
    //       $location.path('/login');
    //     } else {
    //       console.log("NOT FOUND");

    //       let obj = {
    //         gst: userGSTNo
    //       }

    //       console.log("2nd object", obj);
    //       DashboardService.checkUser(obj).then((response) => {
    //         if (response.data.user) {
    //           console.log("2nd object USER FOUND", response.data.user);
    //           vm.senderCompany = response.data.user.companyName;



    //           if (category == 0) {
    //             if (response.data.user.saleFile[month]) {
    //               lodash.forEach(response.data.user.saleFile[month], function(record) {
    //                 if (invoiceNo == record.Invoice_Number) {
    //                   record.Customer_Billing_Name = response.data.user.companyName;
    //                   record.Customer_Billing_GSTIN = response.data.user.GSTNo;
    //                   record.Customer_Billing_State = response.data.user.state;
    //                   let obj = {
    //                     month: vm.selectedMonth.toString("yyyy-MM"),
    //                     data: record,
    //                     gst: customerGSTIN,
    //                     category: category
    //                   }

    //                   DashboardService.addTemporaryPurchaseData(obj).then((response) => {
    //                     console.log("response.data 109", response.data);
    //                     if (response.data.recordDetails) {
    //                       function compare(a, b) {
    //                         const gstA = a.Customer_Billing_GSTIN.toUpperCase();
    //                         const gstB = b.Customer_Billing_GSTIN.toUpperCase();
    //                         let comparison = 0;
    //                         if (gstA > gstB) {
    //                           comparison = 1;
    //                         } else if (gstA < gstB) {
    //                           comparison = -1;
    //                         }
    //                         return comparison;
    //                       }

    //                       vm.purchaseGridData = response.data.recordDetails.purchaseFile[obj.month].sort(compare);
    //                     } else {
    //                       vm.purchaseGridData = [];
    //                     }
    //                   }).catch((error) => {
    //                     console.log("error", error);
    //                   })
    //                 }
    //               })


    //             } else {
    //               console.log("Some Error in Fatching Data");
    //             }
    //           } else if (category == 1) {
    //             // UPLOAD SALE
    //             if (response.data.user.purchaseFile[month]) {
    //               lodash.forEach(response.data.user.purchaseFile[month], function(record) {
    //                 if (invoiceNo == record.Invoice_Number) {
    //                   record.Customer_Billing_Name = response.data.user.companyName;
    //                   record.Customer_Billing_GSTIN = response.data.user.GSTNo;
    //                   record.Customer_Billing_State = response.data.user.state;
    //                   let obj = {
    //                     month: vm.selectedMonth.toString("yyyy-MM"),
    //                     data: record,
    //                     gst: customerGSTIN,
    //                     category: category
    //                   }

    //                   console.log("obj", obj);
    //                   DashboardService.addTemporarySaleData(obj).then((response) => {
    //                     console.log("response.data 132", response.data);
    //                     if (response.data.recordDetails) {
    //                       function compare(a, b) {
    //                         const gstA = a.Customer_Billing_GSTIN.toUpperCase();
    //                         const gstB = b.Customer_Billing_GSTIN.toUpperCase();
    //                         let comparison = 0;
    //                         if (gstA > gstB) {
    //                           comparison = 1;
    //                         } else if (gstA < gstB) {
    //                           comparison = -1;
    //                         }
    //                         return comparison;
    //                       }

    //                       vm.saleGridData = response.data.recordDetails.purchaseFile[obj.month].sort(compare);
    //                     } else {
    //                       vm.saleGridData = [];
    //                     }
    //                   }).catch((error) => {
    //                     console.log("error", error);
    //                   })
    //                 }
    //               })
    //             }

    //           }
    //           // vm.confirmationData = record;

    //           // if (record.Mobile_Number) {
    //           //   vm.mobile = record.Mobile_Number;
    //           //   vm.hideMobile = vm.mobile.substring(6, 10);

    //           // } else {
    //           //   console.log("IN NO MOBILE");
    //           // }

    //         }
    //       }).catch((error) => {
    //         console.log("error - - - - ", error);
    //       })
    //     }
    //   }).catch((error) => {
    //     console.log("error - - - - ", error);
    //   })
    // }


    function searchSaleGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Supplier_Name && item.Supplier_GSTIN) {
            return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          }
        }
      }
      let totalSaleData = vm.saleFileDataToFilter;
      if (vm.saleSearchText == '') {
        vm.saleGridData = vm.saleFileDataToFilter;
      } else {
        vm.filteredSaleList = lodash.filter(totalSaleData,
          function(item) {
            return searchUtil(item, vm.saleSearchText);
          });
        vm.saleGridData = vm.filteredSaleList;
      }
    }

    function searchPurchaseGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Customer_Billing_Name && item.Customer_Billing_GSTIN) {
            return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          }
        }
      }
      let totalPurchaseData = vm.purchaseFileDataToFilter;
      if (vm.purchaseSearchText == '') {
        vm.purchaseGridData = vm.purchaseFileDataToFilter;
      } else {
        vm.filteredPurchaseList = lodash.filter(totalPurchaseData,
          function(item) {
            return searchUtil(item, vm.purchaseSearchText);
          });
        vm.purchaseGridData = vm.filteredPurchaseList;
      }
    }


    function correctPurchase(invoiceNo, GSTIN, event) {
      let status = event.toElement.id == 'correct' ? 'verified' : 'mismatched';
      let flag = event.toElement.id == 'correct' ? 0 : 1;
      console.log("status", status);
      let parent = event.srcElement.parentElement.parentElement.parentElement.parentElement;
      console.log("parent", parent);
      // $(parent).find('#correct').remove();
      // $(parent).find('#wrong').remove();
      // vm.filterByMonth = '2017-09';
      let month = vm.filterByMonth.toString("yyyy-MM");
      let statusObj = {
        date: month,
        status: status,
        Invoice_Number: invoiceNo,
        GSTIN: userGSTNo,
        fromPurchase: true,
        flag: flag
      }

      console.log("statusObj", statusObj);
      DashboardService.changeStatus(statusObj).then((response) => {
        console.log("response", response);
        noty('success', response.data.message);
        if (status == 'verified') {
          $(parent).addClass("verified");
          $(parent).removeClass("mismatched");
        } else {
          $(parent).addClass("mismatched");
          $(parent).removeClass("verified");
        }
        //   if ($(parent).attr('class') == 'ng-scope mismatched') {
        //     console.log('ng-scope mismatched');
        //     notVerifiedPurchase--;
        //     mismatchedPurchase++;
        //   } else {
        //     console.log('NOT ng-scope mismatched');
        //     verifiedPurchase++;
        //     notVerifiedPurchase--;
        //   }
        //   vm.verifiedPurchase = verifiedPurchase;
        //   vm.mismatchedPurchase = mismatchedPurchase;
        //   vm.notVerifiedPurchase = notVerifiedPurchase;
      }).catch((error) => {
        console.log("error", error);
        noty('error', error.data.message);
      })

    }

    function sendOTPViaSMS() {
      let obj = {
        // mobile: vm.mobile,
        mobile: '9978770693', // Mobile Displayed in temp deshboard
        otp: otp
      }
      console.log(obj);
      DashboardService.sendOTPViaSMS(obj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendOTPViaEmail() {

      let obj = {
        email: 'samir@yopmail.com', // Email of owner of temp deshboard
        otp: otp
      }
      console.log(obj);
      DashboardService.sendOTPViaEmail(obj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        console.log("error", error);
        noty('error', error.data.message);
      })
    }

    function verifyOTP(enteredOTP) {
      if (enteredOTP == otp) {
        noty('success', 'OTP Verified Successfully');
        vm.verify = true;

      } else {
        // vm.verify = false;
        vm.verify = true;
        noty('error', 'OTP Verification Failed');
      }
    }
  }
})();