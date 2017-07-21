'use strict';
(function() {
  angular
    .module('fileApp')
    .factory('FileOperationService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      compareFileService:compareFileService
    };

      function compareFileService(data) {
        console.log("service data", data);
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/compare-file/'+data.id
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

  }
})();
