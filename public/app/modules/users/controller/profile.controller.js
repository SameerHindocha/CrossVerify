'use strict';
(function() {
  angular
    .module('userApp')
    .controller('ProfileController', controller);

  controller.$inject = ['user', 'UserService', '$location', 'toastr', '$scope'];

  function controller(user, UserService, $location, toastr, $scope) {
    let vm = this;
    vm.user = user;

    vm.UserService = UserService;

    activate();

    function activate() {
      vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    $scope.finalvalues = function(updatedData) {
      console.log("updatedData", updatedData);
      UserService.updateUser(updatedData).then((response) => {
        if (response.status === 200) {
          toastr.success(response.data.message);
          $location.path('/dashboard');
          let getDataFromLocalStorage = vm.currentUser;
          getDataFromLocalStorage.ownerName = updatedData.ownerName;
          getDataFromLocalStorage.city = updatedData.city;
          getDataFromLocalStorage.pincode = updatedData.pincode;
          getDataFromLocalStorage.landline = updatedData.landline;
          getDataFromLocalStorage.mobile1 = updatedData.mobile1;
          getDataFromLocalStorage.mobile2 = updatedData.mobile2;
          getDataFromLocalStorage.state = updatedData.state;
          getDataFromLocalStorage.address = updatedData.address;
          vm.currentUser = localStorage.setItem("currentUser", JSON.stringify(getDataFromLocalStorage));
        }
      }).catch((error) => {
        toastr.error(error.data.message);
      })
    }
  }
})();