'use strict';
(function() {
  angular
    .module('forgotPasswordApp')
    .factory('ForgotPasswordService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      // forgotPassword: forgotPassword,
      // resetPassword: resetPassword,
      // getDataFromToken: getDataFromToken
    };

    // function forgotPassword(data) {
    //   console.log("data", data);
    //   let defer = $q.defer();
    //   $http({
    //     method: 'post',
    //     url: '/forgot-password',
    //     data: data
    //   }).then(function(response) {
    //     defer.resolve(response);
    //   }).catch(function(error) {
    //     defer.reject(error);
    //   });
    //   return defer.promise;
    // }

    // function resetPassword(data) {
    //   let defer = $q.defer();
    //   $http({
    //     method: 'put',
    //     url: '/reset-password',
    //     data: data
    //   }).then(function(response) {
    //     defer.resolve(response);
    //   }).catch(function(error) {
    //     defer.reject(error);
    //   });
    //   return defer.promise;
    // }

    // function getDataFromToken(data) {
    //   let defer = $q.defer();
    //   $http({
    //     method: 'get',
    //     url: '/get-user-data-from-token/' + data.ResetToken
    //   }).then(function(response) {
    //     defer.resolve(response);
    //   }).catch(function(error) {
    //     defer.reject(error);
    //   });
    //   return defer.promise;
    // }


  }
})();