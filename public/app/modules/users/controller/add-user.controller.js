'use strict';
(function() {
  angular
    .module('userApp')
    .controller('addUserController', controller);

  controller.$inject = ['UserService', '$location', 'lodash', '$rootScope'];

  function controller(UserService, $location, lodash, $rootScope) {
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
      let splitArray, fileType, postObj, urldata;
      postObj = {
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
        panNo: vm.panNo.toUpperCase(),
        GSTNo: vm.GSTNo.toUpperCase(),
        password: vm.password,
      };
      if (vm.password != vm.confirmPassword) {
        noty('warning', 'Confirm password must match the entered password');
      } else {
        UserService.addUser(postObj).then((response) => {
          noty('success', response.data.message);
          $location.path('/login');
        }).catch((error) => {
          if (error.status == 409) {
            noty('error', error.data.message);
          }
        });
      }
    }


    // function addUser() {
    //   let splitArray, fileType, postObj, urldata;
    //   if (vm.saleFile) {
    //     splitArray = vm.saleFile.name.split('.');
    //     fileType = lodash.last(splitArray);
    //     Object.defineProperty(vm.saleFile, 'name', {
    //       value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
    //       writable: true
    //     });
    //   }
    //   postObj = {
    //     companyName: vm.companyName,
    //     state: vm.state,
    //     city: vm.city,
    //     pincode: vm.pincode,
    //     email: vm.email,
    //     ownerName: vm.ownerName,
    //     address: vm.address,
    //     mobile1: vm.mobile1,
    //     mobile2: vm.mobile2,
    //     landline: vm.landline,
    //     panNo: vm.panNo.toUpperCase(),
    //     GSTNo: vm.GSTNo.toUpperCase(),
    //     password: vm.password,
    //     saleFile: vm.saleFile
    //   };

    //   // postObj = {
    //   //   companyName: 'Abc Ltd',
    //   //   state: 'Gujarat',
    //   //   city: 'Ahmedabad',
    //   //   pincode: '380000',
    //   //   email: vm.email,
    //   //   ownerName: 'ABC',
    //   //   address: 'Ahmedabad',
    //   //   mobile1: '9876543210',
    //   //   mobile2: '1234567890',
    //   //   landline: '87654321',
    //   //   panNo: '11111111',
    //   //   GSTNo: vm.GSTNo.toUpperCase(),
    //   //   password: vm.password,
    //   //   saleFile: vm.saleFile
    //   // };

    //   urldata = {
    //     url: "admin-api/user",
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     },
    //     data: postObj
    //   };
    //   if (vm.password != vm.confirmPassword) {
    //     noty('warning', 'Confirm password must match the entered password');
    //   } else {
    //     UserService.addUser(urldata).then((response) => {
    //       noty('success', response.data.message);
    //       $location.path('/login');
    //     }).catch((error) => {
    //       if (error.status == 409) {
    //         noty('error', error.data.message);
    //       }
    //     });
    //   }
    // }

    function getGSTStatus() {
      let gstObj;
      if (lodash.size(vm.GSTNo) == 15) {
        gstObj = {
          gstNo: vm.GSTNo
        };
        UserService.gstStatus(gstObj).then((response) => {
          vm.gstConflict = false;
        }).catch((error) => {
          vm.gstConflict = true;
          noty('warning', error.data.message);
        })
      }
    }


  }
})();