'use strict';
(function() {
  angular
    .module('clientApp')
    .controller('dashboardController', controller);

  controller.$inject = ['DashboardService', 'AuthService', '$location', 'lodash', '$rootScope'];

  function controller(DashboardService, AuthService, $location, lodash, $rootScope) {
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.DashboardService = DashboardService;
    vm.sendLink = sendLink;
    vm.sendSMS = sendSMS;
    vm.getClientList = getClientList;
    vm.Logout = Logout;
    vm.search = search;
    vm.link = JSON.parse(localStorage.getItem('currentUser')).preLink + '/' + JSON.parse(localStorage.getItem('currentUser'))._id;
    vm.searchText = '';
    vm.fullData = [];
    vm.openFileComparisionPage = openFileComparisionPage;
    vm.onSuccess = onSuccess;
    vm.onError = onError;
    vm.dateOfFile = '07-02-2017';
    vm.filterByMonth = new Date();
    vm.showMoreSaleDetail = showMoreSaleDetail;
    vm.showMorePurchaseDetail = showMorePurchaseDetail;
    vm.redirectToImportPage = redirectToImportPage;
    vm.editSaleRow = editSaleRow;
    vm.editpurchaseRow = editpurchaseRow;
    vm.selfVerify = selfVerify;
    vm.getInvoicesByMonth = getInvoicesByMonth;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let verifiedSale = 0;
    let notVerifiedSale = 0;
    let mismatchedSale = 0;
    let totalSaleInvoice = 0;

    let verifiedPurchase = 0;
    let notVerifiedPurchase = 0;
    let mismatchedPurchase = 0;
    let totalPurchaseInvoice = 0;

    vm.correct = correctPurchase;
    vm.editCustomer = editCustomer;

    vm.temp = temp;
    activate();

    function activate() {
      vm.getCurrentUserForEmail = JSON.parse(window.localStorage.getItem('currentUser'));
      vm.email = vm.getCurrentUserForEmail.email;
      vm.companyName = vm.getCurrentUserForEmail.companyName;
      // vm.getClientList();
      vm.getInvoicesByMonth();
    }

    function temp() {
      $location.path('/temporary-dashboard');
    }

    function sendLink() {
      let postObj = {
        email: vm.email
      }
      DashboardService.shareLinkService(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendSMS() {
      let postObj = {
        email: vm.email
      }
      DashboardService.sendSMSService(postObj).then((response) => {
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
      console.log("purchaseFile-------", purchaseFile);
      vm.purchaseFileDetail = purchaseFile;
    }

    function getClientList() {
      let postObj = {
        email: vm.email
      }
      DashboardService.getClients(postObj).then((response) => {
        vm.clients = response.data;
        vm.clientListResponse = response.data;
      }).catch((error) => {
        noty('error', error.data.message);
      })
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
      if (vm.filterByMonth) {
        filterMonth = vm.filterByMonth.toString("yyyy-MM");
        console.log("filterMonth", filterMonth);
        let monthObj = {
          month: filterMonth
        }
        DashboardService.filterInvoicesByMonth(monthObj).then((response) => {
          if (lodash.size(response.data.filteredSaleFileData)) {
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
            console.log("NO Record Found");
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
          if (true) {

            let postObj = {
              email: 'samir@yopmail.com'
            }
            DashboardService.sendConfirmationMail(postObj).then((response) => {
              noty('success', response.data.message);
            }).catch((error) => {
              noty('error', error.data.message);
            })
          }
          if (true) {
            let postObj = {
              mobile: '8866610765'
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
      let statusObj = {
        date: month,
        status: 'verified',
        Invoice_Number: invoiceNo,
        _id: currentUser._id,
        GSTIN: '27AAACB7403R1ZD'
      }
      DashboardService.changeStatus(statusObj).then((response) => {
        noty('success', response.data.message);
        $(parent).addClass("verified");
        $(parent).removeClass("mismatched");
        $(parent).find('#selfVerify').remove();
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
        console.log("response", response);
        noty('success', response.data.message);
        if (status == 'verified') {
          $(parent).addClass("verified");
          $(parent).removeClass("mismatched");
        } else {
          $(parent).addClass("mismatched");
          $(parent).removeClass("verified");
        }
        if ($(parent).attr('class') == 'ng-scope mismatched') {
          console.log('ng-scope mismatched');
          notVerifiedPurchase--;
          mismatchedPurchase++;
        } else {
          console.log('NOT ng-scope mismatched');
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

    function editCustomer(invoiceNumber) {
      let id = currentUser._id;
      let month = vm.filterByMonth.toString("yyyy-MM");
      let invoiceNo = invoiceNumber;
      $location.path('/edit-customer/' + id + '/' + month + '/' + invoiceNo);
    }

    function openFileComparisionPage(client) {
      $rootScope.clientData = client;
      $location.path('/file-compare/' + client._id + '/' + client.GSTNo);
    }

    function search() {
      function searchUtil(item, toSearch) {
        return (item.companyName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.GSTNo.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
      }
      const totalClients = vm.clientListResponse; //clientListResponse is the client list got from response in getClientList()
      if (vm.searchtext == '') {
        vm.clients = vm.clientListResponse;
      } else {
        vm.filteredList = lodash.filter(totalClients,
          function(item) {
            return searchUtil(item, vm.searchText);
          });
        vm.clients = vm.filteredList;
      }
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

    function onSuccess(e) {
      setTooltip(e.trigger, 'Copied!');
      hideTooltip(e.trigger);
    };

    function onError(e) {
      setTooltip(e.trigger, 'Failed!');
      hideTooltip(e.trigger);
    }
  }
})();