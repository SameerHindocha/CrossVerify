'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('temporaryDashboardController', controller);

  controller.$inject = ['DashboardService', 'UserService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(DashboardService, UserService, $location, $route, lodash, $rootScope) {
    let vm = this;
    vm.sendOTPViaSMS = sendOTPViaSMS;
    vm.sendOTPViaEmail = sendOTPViaEmail;
    vm.correctPurchase = correctPurchase;
    vm.filterByMonth = filterByMonth;
    vm.mobile = '';
    // let mobileNumber = vm.mobile;
    vm.verifyOTP = verifyOTP;
    let otp = Math.floor(1000 + Math.random() * 9000);
    let receiverGST = $route.current.params.customerGSTIN;
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
    let saleFile = {},
      purchaseFile = {};
    vm.states = ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "West Bengal", "Chhattisgarh", "Uttarakhand", "Jharkhand", "Telangana"];
    let premiumUser = false;
    vm.addUser = addUser;

    /* TEMP */
    // vm.mobile1 = 8866610765;
    // vm.hideMobile = '0765';
    /* TEMP */

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
      let postObj = {};
      let object = {
        receiverGST: receiverGST
      }
      DashboardService.checkReceiver(object).then((response) => {
        if (response.data.user) {
          $location.path('/login');
        } else {
          let obj = {
            senderGST: userGSTNo,
            receiverGST: receiverGST,
            month: month,
            category: category
          };
          DashboardService.checkUser(obj).then((response) => {
            if (response.data.matchedSaleRecords) {

              if (response.data.matchedSaleRecords[0].Customer_Billing_Name) {
                vm.receiverCompany = response.data.matchedSaleRecords[0].Customer_Billing_Name;
              }
              if (response.data.user.companyName) {
                vm.senderCompany = response.data.user.companyName;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_Name) {
                vm.companyName = response.data.matchedSaleRecords[0].Customer_Billing_Name;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_State) {
                vm.state = response.data.matchedSaleRecords[0].Customer_Billing_State;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_City) {
                vm.city = response.data.matchedSaleRecords[0].Customer_Billing_City;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_PinCode) {
                vm.pincode = response.data.matchedSaleRecords[0].Customer_Billing_PinCode;
              }
              if (response.data.matchedSaleRecords[0].Email_Address) {
                vm.email = response.data.matchedSaleRecords[0].Email_Address;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_Address) {
                vm.address = response.data.matchedSaleRecords[0].Customer_Billing_Address;
              }
              if (response.data.matchedSaleRecords[0].Mobile_Number) {
                console.log("response123", response.data.matchedSaleRecords[0]);
                console.log("response456", response.data.matchedSaleRecords[0].Mobile_Number);

                vm.mobile1 = response.data.matchedSaleRecords[0].Mobile_Number;
              }
              if (response.data.matchedSaleRecords[0].Customer_Billing_GSTIN) {
                vm.GSTNo = response.data.matchedSaleRecords[0].Customer_Billing_GSTIN;
              }
              if (response.data.matchedSaleRecords[0].Mobile_Number) {
                vm.hideMobile = response.data.matchedSaleRecords[0].Mobile_Number.substring(6, 10);
              }
              purchaseFile[month + ''] = response.data.matchedSaleRecords;
              lodash.forEach(purchaseFile[month], function(record) {
                record.Supplier_Name = response.data.user.companyName;
                record.Supplier_GSTIN = response.data.user.GSTNo;
                record.Supplier_State = response.data.user.state;
                record.Supplier_Address = response.data.user.address;
                record.Supplier_City = response.data.user.city;
                record.Supplier_PinCode = response.data.user.pincode;
                record.Mobile_Number = response.data.user.mobile1;
                record.Email_Address = response.data.user.email;
                delete record['Customer_Billing_Name'];
                delete record['Customer_Billing_GSTIN'];
                delete record['Customer_Billing_State'];
                delete record['Customer_Billing_Address'];
                delete record['Customer_Billing_City'];
                delete record['Customer_Billing_PinCode'];
                delete record['Customer_Billing_StateCode'];
              })
            } else if (response.data.matchedPurchaseRecords) {
              if (response.data.matchedPurchaseRecords[0].Supplier_Name) {
                vm.receiverCompany = response.data.matchedPurchaseRecords[0].Supplier_Name;
              }
              if (response.data.user.companyName) {
                vm.senderCompany = response.data.user.companyName;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_Name) {
                vm.companyName = response.data.matchedPurchaseRecords[0].Supplier_Name;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_State) {
                vm.state = response.data.matchedPurchaseRecords[0].Supplier_State;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_City) {
                vm.city = response.data.matchedPurchaseRecords[0].Supplier_City;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_PinCode) {
                vm.pincode = response.data.matchedPurchaseRecords[0].Supplier_PinCode;
              }
              if (response.data.matchedPurchaseRecords[0].Email_Address) {
                vm.email = response.data.matchedPurchaseRecords[0].Email_Address;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_Address) {
                vm.address = response.data.matchedPurchaseRecords[0].Supplier_Address;
              }
              if (response.data.matchedPurchaseRecords[0].Mobile_Number) {
                vm.mobile1 = response.data.matchedPurchaseRecords[0].Mobile_Number;
              }
              if (response.data.matchedPurchaseRecords[0].Supplier_GSTIN) {
                vm.GSTNo = response.data.matchedPurchaseRecords[0].Supplier_GSTIN;
              }
              if (response.data.matchedPurchaseRecords[0].Mobile_Number) {
                vm.hideMobile = response.data.matchedPurchaseRecords[0].Mobile_Number.substring(6, 10);
              }
              saleFile[month + ''] = response.data.matchedPurchaseRecords;
              lodash.forEach(saleFile[month], function(record) {
                record.Customer_Billing_Name = response.data.user.companyName;
                record.Customer_Billing_GSTIN = response.data.user.GSTNo;
                record.Customer_Billing_State = response.data.user.state;
                record.Customer_Billing_Address = response.data.user.address;
                record.Customer_Billing_City = response.data.user.city;
                record.Customer_Billing_PinCode = response.data.user.pincode;
                record.Mobile_Number = response.data.user.mobile1;
                record.Email_Address = response.data.user.email;
                delete record['Supplier_Name'];
                delete record['Supplier_GSTIN'];
                delete record['Supplier_State'];
                delete record['Supplier_Address'];
                delete record['Supplier_City'];
                delete record['Supplier_PinCode'];
                delete record['Supplier_StateCode'];
              })
            }
          }).catch((error) => {
            // console.log("error - - - - ", error);
          })
        }
      }).catch((error) => {
        // console.log("error - - - - ", error);
      })
    }


    function addUser() {
      let postObj = {
        companyName: vm.companyName,
        state: vm.state,
        city: vm.city,
        pincode: vm.pincode,
        email: vm.email,
        ownerName: vm.ownerName,
        address: vm.address,
        mobile1: vm.mobile1,
        // mobile2: vm.mobile2,
        landline: vm.landline,
        // panNo: vm.panNo.toUpperCase(),
        GSTNo: vm.GSTNo.toUpperCase(),
        password: vm.password,
        saleFile: saleFile,
        purchaseFile: purchaseFile,
        premiumUser: premiumUser
      };
      if (vm.password != vm.confirmPassword) {
        noty('warning', 'Confirm password must match the entered password');
      } else {
        UserService.addUser(postObj).then((response) => {
          noty('success', response.data.message);
          $location.path('/login');
        }).catch((error) => {
          if (error.status == 409) {
            noty('error', error.data.message);
          }
        });
      }
    }


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
      let parent = event.srcElement.parentElement.parentElement.parentElement.parentElement;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let statusObj = {
        date: month,
        status: status,
        Invoice_Number: invoiceNo,
        GSTIN: userGSTNo,
        fromPurchase: true,
        flag: flag
      }
      DashboardService.changeStatus(statusObj).then((response) => {
        noty('success', response.data.message);
        if (status == 'verified') {
          $(parent).addClass("verified");
          $(parent).removeClass("mismatched");
        } else {
          $(parent).addClass("mismatched");
          $(parent).removeClass("verified");
        }
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendOTPViaSMS() {
      let obj = {
        // mobile: '9978770693', // Mobile Displayed in temp deshboard
        mobile: vm.mobile1,
        otp: otp
      }
      DashboardService.sendOTPViaSMS(obj).then((response) => {
        noty('success', response.data.message);
        setTimeout(function() {
          // alert("Hello");
          otp = '';
        }, 480000);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendOTPViaEmail() {

      let obj = {
        // email: 'samir@yopmail.com', // Email of owner of temp deshboard
        email: vm.email,
        otp: otp
      }
      DashboardService.sendOTPViaEmail(obj).then((response) => {
        noty('success', response.data.message);
        setTimeout(function() {
          // alert("Hello");
          otp = '';
        }, 480000);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function verifyOTP(enteredOTP) {
      if (enteredOTP == otp) {
        noty('success', 'OTP Verified Successfully');
        vm.verify = true;

      } else {
        vm.verify = false;
        // vm.verify = true;
        noty('error', 'OTP Verification Failed');
      }
    }
  }
})();