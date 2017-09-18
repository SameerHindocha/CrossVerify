'use strict';
(function() {
  angular
    .module('dashboardApp')
    .factory('DashboardService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      shareLinkService: shareLinkService,
      getClients: getClients,
      sendSMSService: sendSMSService,
      filterInvoicesByMonth: filterInvoicesByMonth,
      editSaleFile: editSaleFile,
      editPurchaseFile: editPurchaseFile,
      changeSaleStatus: changeSaleStatus,
      changePurchaseStatus: changePurchaseStatus,
      selfVerify: selfVerify,
      updateClientInfo: updateClientInfo,
      sendConfirmationMail: sendConfirmationMail,
      sendConfirmationSMS: sendConfirmationSMS,
      sendOTPViaEmail: sendOTPViaEmail,
      sendOTPViaSMS: sendOTPViaSMS,
      sendMonthlyEmail: sendMonthlyEmail,
      sendMonthlySMS: sendMonthlySMS,
      checkUser: checkUser,
      addTemporaryData: addTemporaryData,
      addTemporaryPurchaseData: addTemporaryPurchaseData,
      checkReceiver: checkReceiver
    };

    function shareLinkService(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/send-mail/' + data.email
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendSMSService(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/send-sms/' + data.email
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendMonthlyEmail(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-monthly-mail',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendMonthlySMS(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-monthly-sms',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendConfirmationMail(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-confirmation-mail',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendConfirmationSMS(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-confirmation-sms',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendOTPViaEmail(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-otp-email',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendOTPViaSMS(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-otp-sms',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClients(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/api/client-by-user/' + data.email
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function filterInvoicesByMonth(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/filter-invoices-by-month/' + data.month
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function editSaleFile(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/update-sale-file',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function editPurchaseFile(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/update-purchase-file',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function changeSaleStatus(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/change-sale-status',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function changePurchaseStatus(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/change-purchase-status',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }



    function selfVerify(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/self-verify',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }



    function updateClientInfo(obj) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/update-client-info',
        data: obj
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function checkUser(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/check-user',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function checkReceiver(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/check-receiver/' + data.receiverGST
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function addTemporaryData(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/api/add-temporary-data',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function addTemporaryPurchaseData(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/api/add-temporary-purchase-data',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }


  }
})();