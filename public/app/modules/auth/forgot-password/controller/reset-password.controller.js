'use strict';
(function() {
  angular
    .module('forgotPasswordApp')
    .controller('ResetPasswordController', controller);

  controller.$inject = ['AuthService', '$location', '$rootScope', '$route'];

  function controller(AuthService, $location, $rootScope, $route) {
    let vm = this;
    vm.resetPassword = resetPassword;
    $rootScope.showLoginBackground = true;
    activate();

    function activate() {
      let ResetToken = $route.current.params.resetToken;
      let obj = {
        ResetToken: ResetToken
      };
      AuthService.getDataFromToken(obj).then((response) => {
        console.log("response", response);
        vm.email = response.data.user.email;
        // noty('success', response.data.message);
        // $location.route('/login');
      }).catch((error) => {
        noty('error', 'Your Reset Password Token has been Expired');
        $location.path('/login');
      })

    }

    function resetPassword() {
      if (vm.password === vm.confirmPassword) {
        let passwordObj = {
          email: vm.email,
          newPassword: vm.password
        }
        AuthService.resetPassword(passwordObj).then((response) => {
          noty('success', response.data.message);
          $location.path('/login');
        }).catch((error) => {
          console.log("error", error);
          noty('error', error.data.message);
          $location.path('/login');
        })
      } else {
        noty('error', 'Password and Confirm password must match');
      }


    }
  }
})();