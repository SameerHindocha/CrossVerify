'use strict';
(function() {
  angular
    .module('clientApp')
    .factory('ClientService', Service);

  Service.$inject = ['$http', '$q', 'Upload'];

  function Service($http, $q, Upload) {
    return {
      addClient: addClient,
      gstStatus: gstStatus,
      fetchUserRecord: fetchUserRecord,
      getClientById: getClientById,
      changeStatus: changeStatus,
      addPurchaseFiles: addPurchaseFiles
    };

    function addClient(urldata) {
      let defer = $q.defer();
      Upload.upload(urldata).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function gstStatus(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/api/gst-status/' + data.userKey
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function fetchUserRecord(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/api/user-data/' + data.email + '/' + data.password + '/' + data.GSTNo
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getClientById(id) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/api/client/' + id
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function changeStatus(data) {
      console.log("data", data);

      let defered = $q.defer();
      $http({
        method: 'put',
        url: '/api/client-status/' + data.clientId,
        data: data
      }).then(function(response) {
        defered.resolve(response.data);
      }).catch(function(error) {
        defered.reject(error);
      });
      return defered.promise;
    }

    function addPurchaseFiles(urldata) {
      console.log("urldata", urldata);
      let defer = $q.defer();
      Upload.upload(urldata).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }


  }
})();