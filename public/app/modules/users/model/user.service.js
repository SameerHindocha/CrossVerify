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
      gstStatus: gstStatus,
      // addSaleFiles: addSaleFiles,
      readFiles: readFiles,
      updateContact: updateContact,
      postFileData: postFileData
    };

    function addUser(data) {
      let defered = $q.defer();
      $http({
        method: 'post',
        url: '/admin-api/user',
        data: data
      }).then(function(response) {
        defered.resolve(response);
      }).catch(function(error) {
        defered.reject(error);
      });
      return defered.promise;
    }
    // function addUser(urldata) {
    //   let defer = $q.defer();
    //   Upload.upload(urldata).then(function(response) {
    //     defer.resolve(response);
    //   }).catch(function(error) {
    //     defer.reject(error);
    //   });
    //   return defer.promise;
    // }

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

    function updateUser(data) {
      let defered = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/edit-user',
        data: data
      }).then(function(response) {
        defered.resolve(response);
      }).catch(function(error) {
        defered.reject(error);
      });
      return defered.promise;
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

    // function addSaleFiles(urldata) {
    //   console.log("urldata", urldata);
    //   let defer = $q.defer();
    //   Upload.upload(urldata).then(function(response) {
    //     defer.resolve(response);
    //   }).catch(function(error) {
    //     defer.reject(error);
    //   });
    //   return defer.promise;
    // }
    function readFiles(urldata) {
      console.log("urldata", urldata);
      let defer = $q.defer();
      Upload.upload(urldata).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function updateContact(data) {
      console.log("data", data);
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/update-contact-detail',
        data: data
      }).then(function(response) {
        defer.resolve(response);
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    }

    function postFileData(data) {
      let defer = $q.defer();
      $http({
        method: 'put',
        url: '/admin-api/post-file-data',
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