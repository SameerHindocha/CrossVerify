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
    // vm.sendLink = sendLink;
    // vm.sendSMS = sendSMS;
    vm.Logout = Logout;
    // vm.link = JSON.parse(localStorage.getItem('currentUser')).preLink + '/' + JSON.parse(localStorage.getItem('currentUser'))._id;
    vm.fullData = [];
    vm.openFileComparisionPage = openFileComparisionPage;
    // vm.onSuccess = onSuccess;
    // vm.onError = onError;
    vm.dateOfFile = '07-02-2017';
    vm.filterByMonth = new Date();
    vm.showMoreSaleDetail = showMoreSaleDetail;
    vm.showMorePurchaseDetail = showMorePurchaseDetail;
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
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let verifiedSale = 0;
    let notVerifiedSale = 0;
    let mismatchedSale = 0;
    let totalSaleInvoice = 0;

    let verifiedPurchase = 0;
    let notVerifiedPurchase = 0;
    let mismatchedPurchase = 0;
    let totalPurchaseInvoice = 0;

    activate();

    function activate() {
      vm.getCurrentUserForEmail = JSON.parse(window.localStorage.getItem('currentUser'));
      vm.email = vm.getCurrentUserForEmail.email;
      vm.companyName = vm.getCurrentUserForEmail.companyName;
      vm.getInvoicesByMonth();
    }

    // function sendLink() {
    //   let postObj = {
    //     email: vm.email
    //   }
    //   DashboardService.shareLinkService(postObj).then((response) => {
    //     noty('success', response.data.message);
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })
    // }

    // function sendSMS() {
    //   let postObj = {
    //     email: vm.email,
    //     link: '' 
    //   }
    //   DashboardService.sendSMSService(postObj).then((response) => {
    //     noty('success', response.data.message);
    //   }).catch((error) => {
    //     noty('error', error.data.message);
    //   })
    // }

    $scope.finalvalues = function(details) {
      console.log("details__##########", details);

    }
    $scope.openPopup = function(saleFile) {
      $scope.fileData = saleFile;
    }

    function sendMonthlyEmail(customerGSTIN, invoiceNo, event) {
      console.log("invoiceNo", invoiceNo);
      console.log("customerGSTIN", customerGSTIN);
      let category;
      category = (event.target.id == 'saleEmail') ? 0 : 1;
      console.log("category", category);

      let month = vm.filterByMonth.toString("yyyy-MM");
      let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;
      console.log("link", link);
      let postObj = {
        email: vm.email,
        link: link
      }
      DashboardService.sendMonthlyEmail(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendMonthlySMS(customerGSTIN, invoiceNo, event) {
      let category;
      category = (event.target.id == 'saleSMS') ? 0 : 1;
      console.log("category", category);
      let month = vm.filterByMonth.toString("yyyy-MM");

      let link = 'temporary-dashboard/' + currentUser.GSTNo + '/' + customerGSTIN + '/' + month + '/' + invoiceNo + '/' + category;

      let postObj = {
        mobile: '9978770693',
        link: link

      }

      console.log("postObj", postObj);
      DashboardService.sendMonthlySMS(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function redirectToImportPage() {
      $location.path('/user/import');
    }

    function showMoreSaleDetail(saleFile) {
      vm.fileDetail = saleFile;
    }

    function showMorePurchaseDetail(purchaseFile) {
      vm.purchaseFileDetail = purchaseFile;
    }

    function Logout() {
      AuthService.logout().then((response) => {
        window.localStorage.removeItem('currentUser');
        noty('success', response.data.message);
        $location.path('/login');
      }).catch((error) => {
        noty('error', error.data.message);
      })
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
          if (lodash.size(response.data.filteredSaleFileData)) {
            vm.saleFileDataToFilter = response.data.filteredSaleFileData;
            vm.purchaseFileDataToFilter = response.data.filteredPurchaseFileData;
            vm.invoiceData = response;
            lodash.forEach(response.data.filteredSaleFileData, function(record) {
              if (record.status == 'verified') {
                verifiedSale++;
              } else if (record.status == 'mismatched') {
                mismatchedSale++;
              } else {
                notVerifiedSale++;
              }
              totalSaleInvoice++;
              vm.saleInvoiceTo = record.Invoice_Number;
            })
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
            vm.saleInvoiceFrom = response.data.filteredSaleFileData[0].Invoice_Number;
          } else {
            vm.noRecord = "NO";
            vm.invoiceData = '';
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
          console.log("error------", error);
        })
      }
    }

    function editSaleRow(data) {
      let btnText = $("#saleEditableRow #saleEditbtn").text();
      if (btnText == 'Edit') {
        $('#saleEditableRow').find('input').each(function() {
          $(this).prop('readonly', false)
          $("#saleEditableRow #saleEditbtn").prop('value', 'Save');
        });
      } else if (btnText == 'Save') {


        let isShare = confirm("Do You Want to Send OTP?");
        if (isShare == true) {
          if (data.Email_Address) {
            let postObj = {
              email: data.Email_Address
            }
            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
          if (data.Mobile_Number) {
            let postObj = {
              mobile: data.Mobile_Number
            }
            DashboardService.sendConfirmationSMS(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
        }

        $('#saleEditableRow').find('input').each(function() {
          $(this).prop('readonly', true)
        });
        if (vm.filterByMonth) {
          let month = vm.filterByMonth.toString("yyyy-MM");
          data.date = month;
        }
        data._id = currentUser._id;
        DashboardService.editSaleFile(data).then((response) => {
          noty('success', response.data.message);
        }).catch((error) => {
          noty('error', error.data.message);
        })
      }


      $("#saleEditableRow #saleEditbtn").html($("#saleEditableRow #saleEditbtn").html() == 'Edit' ? 'Save' : 'Edit');
    }
    $(document).mouseup(function(e) {
      let container = $("#editableTable");
      if (e.target.id == 'plus-button') {
        container.show();
      } else if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });

    function editpurchaseRow(data) {
      let btnText = $("#purchaseEditableRow #purchaseEditbtn").text();
      if (btnText == 'Edit') {
        $('#purchaseEditableRow').find('input').each(function() {
          $(this).prop('readonly', false)
          $("#purchaseEditableRow #purchaseEditbtn").prop('value', 'Save');
        });
      } else if (btnText == 'Save') {


        let isShare = confirm("Do You Want to Send OTP?");
        if (isShare == true) {
          if (data.Email_Address) {
            let postObj = {
              email: data.Email_Address
            }
            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
          if (data.Mobile_Number) {
            let postObj = {
              mobile: data.Mobile_Number
            }
            DashboardService.sendConfirmationSMS(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
        }


        $('#purchaseEditableRow').find('input').each(function() {
          $(this).prop('readonly', true)
        });
        if (vm.filterByMonth) {
          let month = vm.filterByMonth.toString("yyyy-MM");
          data.date = month;
        }
        data._id = currentUser._id;
        DashboardService.editPurchaseFile(data).then((response) => {
          noty('success', response.data.message);

        }).catch((error) => {
          noty('error', error.data.message);
        })
      }




      $("#purchaseEditableRow #purchaseEditbtn").html($("#purchaseEditableRow #purchaseEditbtn").html() == 'Edit' ? 'Save' : 'Edit');
    }
    $(document).mouseup(function(e) {
      let container = $("#purchaseEditableTable");
      if (e.target.id == 'plus-button') {
        container.show();
      } else if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });

    function selfVerify(invoiceNo, event, GSTIN) {
      let parent = event.srcElement.parentElement.parentElement;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let flag = (event.target.id == 'saleSelfVerify') ? 0 : 1;;
      console.log("flag", flag);
      let statusObj = {
        date: month,
        status: 'verified',
        Invoice_Number: invoiceNo,
        _id: currentUser._id,
        GSTIN: currentUser.GSTNo,
        flag: flag
      }
      DashboardService.selfVerify(statusObj).then((response) => {
        noty('success', response.data.message);
        $(parent).addClass("verified");
        $(parent).removeClass("mismatched");
        $(parent).find('#saleSelfVerify').remove();
        $(parent).find('#purchaseSelfVerify').remove();
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
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function correctPurchase(invoiceNo, GSTIN, event) {
      let status = event.toElement.id == 'correct' ? 'verified' : 'mismatched';
      let parent = event.srcElement.parentElement.parentElement;
      $(parent).find('#correct').remove();
      $(parent).find('#wrong').remove();
      let month = vm.filterByMonth.toString("yyyy-MM");
      let statusObj = {
        date: month,
        status: status,
        Invoice_Number: invoiceNo,
        GSTIN: GSTIN,
        fromPurchase: true
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

    function editCustomer(invoiceNumber, event) {
      let id = currentUser._id;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let flag = (event.target.id == 'saleEdit') ? 0 : 1;;
      let invoiceNo = invoiceNumber;
      $location.path('/edit-customer/' + id + '/' + month + '/' + invoiceNo + '/' + flag);
    }

    function searchSaleGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Customer_Billing_Name && item.Customer_Billing_GSTIN) {
            return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          }
        }
      }
      let totalSaleData = vm.saleFileDataToFilter;
      if (vm.saleSearchText == '') {
        vm.invoiceData.data.filteredSaleFileData = vm.saleFileDataToFilter;
      } else {
        vm.filteredSaleList = lodash.filter(totalSaleData,
          function(item) {
            return searchUtil(item, vm.saleSearchText);
          });
        vm.invoiceData.data.filteredSaleFileData = vm.filteredSaleList;
      }
    }

    function searchPurchaseGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Supplier_Name && item.Supplier_GSTIN) {
            return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
          }
        }
      }
      let totalPurchaseData = vm.purchaseFileDataToFilter;
      if (vm.purchaseSearchText == '') {
        vm.invoiceData.data.filteredPurchaseFileData = vm.purchaseFileDataToFilter;
      } else {
        vm.filteredPurchaseList = lodash.filter(totalPurchaseData,
          function(item) {
            return searchUtil(item, vm.purchaseSearchText);
          });
        vm.invoiceData.data.filteredPurchaseFileData = vm.filteredPurchaseList;
      }
    }

    function openFileComparisionPage(client) {
      $rootScope.clientData = client;
      $location.path('/file-compare/' + client._id + '/' + client.GSTNo);
    }


    $('#clip').tooltip({
      trigger: 'click',
      placement: 'top'
    });

    $("#clip").hover(function() {
      $(this)
        .attr('data-original-title', 'copy to clipbard')
        .tooltip('show');
    }, function() {
      $(this).tooltip('hide');
    });

    $("#share").hover(function() {
      $(this)
        .attr('data-original-title', 'share via')
        .tooltip('show');
    }, function() {
      $(this).tooltip('hide');
    });

    function setTooltip(btn, message) {
      $(btn)
        .attr('data-original-title', message)
        .tooltip('show');
    }

    function hideTooltip(btn) {
      setTimeout(function() {
        $(btn).tooltip('hide');
      }, 500);
    }

    // function onSuccess(e) {
    //   setTooltip(e.trigger, 'Copied!');
    //   hideTooltip(e.trigger);
    // };

    // function onError(e) {
    //   setTooltip(e.trigger, 'Failed!');
    //   hideTooltip(e.trigger);
    // }
  }
})();