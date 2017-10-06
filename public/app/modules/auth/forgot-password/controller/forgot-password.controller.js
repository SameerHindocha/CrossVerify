'use strict';
(function() {
  angular
    .module('forgotPasswordApp')
    .controller('ForgotPasswordController', controller);

  controller.$inject = ['AuthService', '$location', '$rootScope'];

  function controller(AuthService, $location, $rootScope) {

    let vm = this;
    vm.forgotPassword = forgotPassword;
    $rootScope.showLoginBackground = true;
    activate();

    function activate() {}

    function forgotPassword() {
      vm.showLoader = true;
      let obj = {
        Email: vm.email
      }
      AuthService.forgotPassword(obj).then((response) => {
        noty('success', response.data.message);
        vm.showLoader = false;
        $location.path('/login');
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
  }
})();