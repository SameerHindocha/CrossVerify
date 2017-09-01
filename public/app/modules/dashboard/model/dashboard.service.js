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
      changeStatus: changeStatus,
      updateClientInfo: updateClientInfo,
      sendConfirmationMail: sendConfirmationMail,
      sendConfirmationSMS: sendConfirmationSMS,
      sendOTP: sendOTP
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


    function sendConfirmationMail(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/send-confirmation-mail/' + data.email
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

    function sendConfirmationSMS(data) {
      console.log("sendConfirmationSMS", data);
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/send-confirmation-sms/' + data.mobile
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function sendOTP(data) {
      console.log("sendConfirmationSMS", data);
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/send-otp/' + data.mobile,
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




    function changeStatus(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/change-status',
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


  }
})();