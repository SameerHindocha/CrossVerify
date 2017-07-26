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
      let splitArray, fileType, urldata;
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
          vm.user = response.data.user;
          $rootScope.userName = response.data.user.ownerName;
          vm.currentUser = localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        }
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
  }
})();