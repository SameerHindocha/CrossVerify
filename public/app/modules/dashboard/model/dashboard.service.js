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
      sendSMSService: sendSMSService
    };

    function shareLinkService(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/share-form/' + data.email
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
  }
})();