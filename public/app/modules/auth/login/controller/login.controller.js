'use strict';
(function() {
  angular
    .module('authApp')
    .controller('AuthController', controller);

  controller.$inject = ['AuthService', '$location', '$rootScope'];

  function controller(AuthService, $location, $rootScope) {

    let vm = this;
    $rootScope.showLoginBackground = true;
    vm.AuthService = AuthService;
    vm.doLogin = doLogin;
    vm.register = register;
    activate();

    function activate() {
      AuthService.getLoginStatus().then((response) => {
        if (response.status === 200) {
          noty('success', response.data.message);
          $location.path('/dashboard');
        }
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function doLogin() {
      let postObj = {
        Email: vm.data1,
        Password: vm.data2
      };
      AuthService.Login(postObj).then((response) => {
        console.log("response-------******* ", response);
        window.localStorage.setItem('currentUser', JSON.stringify(response.data.userData));
        noty('success', response.data.message);
        $location.path('/dashboard');
      }).catch((Error) => {
        vm.error = Error.data.message;
      });
    }

    function register() {
      $location.path('/user/add');
    }
  }
})();