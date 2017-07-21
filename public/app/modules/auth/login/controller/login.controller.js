'use strict';
(function() {
  angular
    .module('authApp')
    .controller('AuthController', controller);

  controller.$inject = ['AuthService', '$location', 'toastr', '$rootScope'];

  function controller(AuthService, $location, toastr, $rootScope) {

    let vm = this;
    $rootScope.showLoginBackground = true;
    vm.AuthService = AuthService;
    vm.doLogin = doLogin;
    vm.register = register;
    activate();

    function activate() {
      AuthService.getLoginStatus().then((response) => {
        if (response.status === 200) {
          toastr.success(response.data.message);
          $location.path('/dashboard');
        }
      }).catch((error) => {
        toastr.error(error.data.message);
      })
    }

    function doLogin() {
      let postObj = {
        Email: vm.data1,
        Password: vm.data2
      };
      AuthService.Login(postObj).then((response) => {
        window.localStorage.setItem('currentUser', JSON.stringify(response.data.userData));
        toastr.success(response.data.message);
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