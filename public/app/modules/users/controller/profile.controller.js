'use strict';
(function() {
  angular
    .module('userApp')
    .controller('ProfileController', controller);

  controller.$inject = ['user', 'UserService', '$scope', 'lodash', '$rootScope'];

  function controller(user, UserService, $scope, lodash, $rootScope) {
    let vm = this;
    vm.user = user;
    vm.UserService = UserService;
    activate();

    function activate() {
      vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      $rootScope.userName = vm.currentUser.ownerName;
      if (vm.user.file) {
        vm.file = vm.user.file;
        vm.file = vm.file.split('/').slice(7).join('/');
      }
    }

    $scope.finalvalues = function(updatedData) {
      let splitArray, fileType, urldata, setLocalStorageData, updatedResponseData;
      if (updatedData.file) {
        splitArray = updatedData.file.name.split('.');
        fileType = lodash.last(splitArray);
        Object.defineProperty(updatedData.file, 'name', {
          value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
          writable: true
        });
      }
      urldata = {
        url: "admin-api/edit-user",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: updatedData
      };
      UserService.updateUser(urldata).then((response) => {
        if (response.status === 200) {
          noty('success', response.data.message);
          vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          updatedResponseData = response.data;
          setLocalStorageData = vm.currentUser;
          vm.user = updatedResponseData.user;
          setLocalStorageData.ownerName = updatedResponseData.user.ownerName;
          setLocalStorageData.state = updatedResponseData.user.state;
          setLocalStorageData.city = updatedResponseData.user.city;
          setLocalStorageData.pincode = updatedResponseData.user.pincode;
          setLocalStorageData.address = updatedResponseData.user.address;
          setLocalStorageData.mobile1 = updatedResponseData.user.mobile1;
          setLocalStorageData.mobile2 = updatedResponseData.user.mobile2;
          setLocalStorageData.landline = updatedResponseData.user.landline;
          setLocalStorageData.file = updatedResponseData.user.file;
          $rootScope.userName = updatedResponseData.user.ownerName;
          vm.currentUser = localStorage.setItem("currentUser", JSON.stringify(setLocalStorageData));
        }
      }).catch((error) => {
        console.log("error", error);
        noty('error', error.data.message);
      })
    }
  }
})();