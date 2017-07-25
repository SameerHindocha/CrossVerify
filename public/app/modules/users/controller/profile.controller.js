'use strict';
(function() {
  angular
    .module('userApp')
    .controller('ProfileController', controller);

  controller.$inject = ['user', 'UserService', '$location', 'toastr', '$scope', 'lodash'];

  function controller(user, UserService, $location, toastr, $scope, lodash) {
    let vm = this;
    vm.user = user;

    vm.UserService = UserService;

    activate();

    function activate() {
      vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    $scope.finalvalues = function(updatedData) {
      console.log("updatedData", updatedData.file);


      if (updatedData.file) {
        console.log("updatedData", updatedData);
        let splitArray = updatedData.file.name.split('.');
        let fileType = lodash.last(splitArray);
        Object.defineProperty(updatedData.file, 'name', {
          value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
          writable: true
        });
      }


      let urldata = {
        url: "admin-api/edit-user",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: updatedData
      };
      console.log("updatedData2", updatedData);
      UserService.updateUser(urldata).then((response) => {
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