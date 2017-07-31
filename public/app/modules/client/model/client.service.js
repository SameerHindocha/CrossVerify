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
      fetchUserRecord: fetchUserRecord
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
  }
})();