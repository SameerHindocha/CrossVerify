'use strict';
(function() {
  angular
    .module('authApp')
    .factory('AuthService', Service);

  Service.$inject = ['$http', '$q'];

  function Service($http, $q) {
    return {
      Login: Login,
      logout: logout,
      getLoginStatus: getLoginStatus,
      forgotPassword: forgotPassword,
      resetPassword: resetPassword,
      getDataFromToken: getDataFromToken,
      resetPassword: resetPassword

    };

    function getLoginStatus() {
      let defer = $q.defer();
      $http({
        method: 'GET',
        url: '/checkLogin'
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function Login(data) {
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/login',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function logout() {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/logout'
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function forgotPassword(data) {
      console.log("data", data);
      let defer = $q.defer();
      $http({
        method: 'post',
        url: '/forgot-password',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function resetPassword(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/reset-password',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getDataFromToken(data) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/get-user-data-from-token/' + data.ResetToken
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function resetPassword(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/reset-password',
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