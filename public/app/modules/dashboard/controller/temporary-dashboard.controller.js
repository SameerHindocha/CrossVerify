'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('temporaryDashboardController', controller);

  controller.$inject = ['DashboardService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(DashboardService, $location, $route, lodash, $rootScope) {
    let vm = this;

    vm.sendOTP = sendOTP;
    vm.mobile = '9876543210';
    let mobileNumber = vm.mobile;
    vm.mobile = vm.mobile.substring(6, 10);
    vm.month = 'Auguest';
    vm.verifyOTP = verifyOTP;
    let otp;

    activate();

    function activate() {

    }

    function sendOTP() {
      otp = Math.floor(1000 + Math.random() * 9000);
      let obj = {
        mobile: mobileNumber,
        otp: otp
      }
      console.log(obj);
      DashboardService.sendOTP(obj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function verifyOTP(enteredOTP) {
      if (enteredOTP == otp) {
        alert("Matched");
      } else {
        alert("NOT Matched");
      }
    }



  }
})();