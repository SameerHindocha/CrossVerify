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
      getLoginStatus: getLoginStatus

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
      var defer = $q.defer();
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
  }
})();