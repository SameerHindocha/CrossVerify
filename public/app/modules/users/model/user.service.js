'use strict';
(function() {
  angular
    .module('userApp')
    .factory('UserService', Service);

  Service.$inject = ['$http', '$q', 'Upload'];

  function Service($http, $q, Upload) {
    return {
      addUser: addUser,
      listUser: listUser,
      deleteUser: deleteUser,
      getUserById: getUserById,
      updateUser: updateUser,
      gstStatus: gstStatus
    };

    function addUser(urldata) {
      let defer = $q.defer();
      Upload.upload(urldata).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function listUser() {
      let defered = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/user'
      }).then(function(response) {
        defered.resolve(response.data);
      }).catch(function(error) {
        defered.reject(error);
      });
      return defered.promise;
    }

    function deleteUser(userId) {
      let defer = $q.defer();
      $http({
        method: 'delete',
        url: '/admin-api/user/' + userId._id
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function getUserById(userId) {
      let defer = $q.defer();
      $http({
        method: 'get',
        url: '/admin-api/user/' + userId
      }).then(function(response) {
        defer.resolve(response.data);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function updateUser(urldata) {
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
        url: '/admin-api/gst-status/' + data.gstNo
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

  }
})();