'use strict';
(function() {
  angular
    .module('changePasswordApp')
    .controller('ChangePasswordController', controller);

  controller.$inject = ['ChangePasswordService', '$location', '$rootScope'];

  function controller(ChangePasswordService, $location, $rootScope) {

    let vm = this;
    vm.changePassword = changePassword;
    activate();

    function activate() {}

    function changePassword() {
      if (vm.newPassword === vm.confirmPassword) {
        let passwordObj = {
          oldPassword: vm.oldPassword,
          newPassword: vm.newPassword
        }
        ChangePasswordService.changePassword(passwordObj).then((response) => {
          if (response.data.status == 401) {
            noty('error', response.data.message)
          } else {
            noty('success', response.data.message);
            $location.path('/user/dashboard');
          }
        }).catch((error) => {
          console.log("error", error);
        })
      } else {
        noty('error', 'New password and Confirm password must match');
      }
    }
  }
})();