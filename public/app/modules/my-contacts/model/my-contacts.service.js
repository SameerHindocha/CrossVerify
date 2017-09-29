'use strict';
(function() {
  angular
    .module('myContactsApp')
    .factory('MyContactsService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      getContactDetails: getContactDetails,
      updateContact: updateContact
    };

    function getContactDetails(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/get-contact-details'
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function updateContact(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/update-basic-contact-details',
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