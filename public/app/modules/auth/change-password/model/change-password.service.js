'use strict';
(function() {
  angular
    .module('changePasswordApp')
    .factory('ChangePasswordService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      changePassword: changePassword
    };

    function changePassword(data) {
      console.log("data service", data);
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/change-password',
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