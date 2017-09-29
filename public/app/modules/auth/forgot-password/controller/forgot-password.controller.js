'use strict';
(function() {
  angular
    .module('forgotPasswordApp')
    .controller('ForgotPasswordController', controller);

  controller.$inject = ['AuthService', '$location', '$rootScope'];

  function controller(AuthService, $location, $rootScope) {

    let vm = this;
    vm.forgotPassword = forgotPassword;
    $rootScope.showLoginBackground = false;
    activate();

    function activate() {}

    function forgotPassword() {

      console.log("vm.email", vm.email);
      let obj = {
        Email: vm.email
      }
      AuthService.forgotPassword(obj).then((response) => {
        noty('success', response.data.message);
        $location.path('/login');
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }
  }
})();