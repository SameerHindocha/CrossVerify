'use strict';
(function() {
  angular
    .module('userApp')
    .controller('addUserController', controller);

  controller.$inject = ['UserService', 'toastr', '$location', 'lodash', '$rootScope'];

  function controller(UserService, toastr, $location, lodash, $rootScope) {
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.UserService = UserService;
    vm.addUser = addUser;
    vm.getGSTStatus = getGSTStatus;
    vm.gstConflict = false;
    vm.states = ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "West Bengal", "Chhattisgarh", "Uttarakhand", "Jharkhand", "Telangana"]
    activate();

    function activate() {}

    function addUser() {
      let splitArray = vm.file.name.split('.');
      let fileType = lodash.last(splitArray);
      Object.defineProperty(vm.file, 'name', {
        value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
        writable: true
      });
      let postObj = {
        companyName: vm.companyName,
        state: vm.state,
        city: vm.city,
        pincode: vm.pincode,
        email: vm.email,
        ownerName: vm.ownerName,
        address: vm.address,
        mobile1: vm.mobile1,
        mobile2: vm.mobile2,
        landline: vm.landline,
        panNo: vm.panNo,
        tinNo: vm.tinNo,
        GSTNo: vm.GSTNo,
        password: vm.password,
        file: vm.file
      };
      let urldata = {
        url: "admin-api/user",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: postObj
      };
      console.log('postObj', postObj);

      if (vm.password != vm.confirmPassword) {
        toastr.error('Confirm password must match the entered password');
      } else {
        UserService.addUser(urldata).then((response) => {
          toastr.success(response.data.message);
          $location.path('/login');
        }).catch((error) => {
          if (error.status == 409) {
            toastr.error(error.data.message);
          }
        });
      }

    }

    function getGSTStatus() {
      if (lodash.size(vm.GSTNo) == 15) {
        let gstObj = {
          gstNo: vm.GSTNo
        };
        UserService.gstStatus(gstObj).then((response) => {
          vm.gstConflict = false;
        }).catch((error) => {
          vm.gstConflict = true;
          toastr.error(error.data.message);
        })
      }
    }
  }
})();