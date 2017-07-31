'use strict';
(function() {
  angular
    .module('clientApp')
    .controller('addClientController', controller);

  controller.$inject = ['ClientService', '$location', '$route', 'lodash', '$rootScope'];

  function controller(ClientService, $location, $route, lodash, $rootScope) {
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.ClientService = ClientService;
    vm.addClient = addClient;
    vm.checkPassword = checkPassword;
    vm.getGSTStatus = getGSTStatus;
    vm.fetchRecord = fetchRecord;
    vm.clearPassword = clearPassword;
    vm.gstConflict = false;
    vm.states = ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "West Bengal", "Chhattisgarh", "Uttarakhand", "Jharkhand", "Telangana"]
    activate();

    function activate() {}

    function addClient() {
      let sentUserId, splitArray, fileType, postObj, urldata;
      sentUserId = $route.current.params.id;
      vm.sentUserId = sentUserId;
      if (vm.file) {
        splitArray = vm.file.name.split('.');
        fileType = lodash.last(splitArray);
        Object.defineProperty(vm.file, 'name', {
          value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
          writable: true
        });
      }
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
        panNo: vm.panNo,
        GSTNo: vm.GSTNo,
        userId: vm.sentUserId,
        password: vm.password,
        file: vm.file
      };

      urldata = {
        url: "api/client",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: postObj
      };

      ClientService.addClient(urldata).then((response) => {
        noty('success', response.data.message);
        if (vm.password) {
          $location.path('/login')
        } else {
          $location.path('/client/post-register')
        }
      }).catch((error) => {
        noty('error', error.data.message);
        if (error.status == 409) {
          noty('error', error.data.message);
        }
      });
    }

    function checkPassword() {
      if (vm.password != vm.confirmPassword) {
        noty('warning', 'Confirm password must match entered password');
      }
    }

    function getGSTStatus() {
      if (lodash.size(vm.GSTNo) == 15) {
        let userKey = $route.current.params.id + vm.GSTNo;
        let gstObj = {
          userKey: userKey
        };
        ClientService.gstStatus(gstObj).then((response) => {
          vm.gstConflict = false;
        }).catch((error) => {
          vm.gstConflict = true;
          noty('warning', error.data.message);
        })
      }
    }

    function clearPassword() {
      vm.password = '';
      vm.confirmPassword = '';
    }

    function fetchRecord() {
      let fetchObj, userData;
      if (lodash.size(vm.GSTNo) == 15) {
        fetchObj = {
          email: vm.email,
          password: vm.password,
          GSTNo: vm.GSTNo
        };

        ClientService.fetchUserRecord(fetchObj).then((response) => {
          console.log("response", response);
          if (response.status === 200) {
            userData = response.data;
            vm.companyName = userData.companyName;
            vm.state = userData.state;
            vm.city = userData.city;
            vm.pincode = parseInt(userData.pincode);
            vm.ownerName = userData.ownerName;
            vm.address = userData.address;
            vm.mobile1 = parseInt(userData.mobile1);
            vm.mobile2 = parseInt(userData.mobile2);
            vm.landline = parseInt(userData.landline);
            vm.panNo = userData.panNo;
            vm.file = userData.file;
          }
          if (response.status === 100) {
            vm.companyName = '';
            vm.state = '';
            vm.city = '';
            vm.pincode = '';
            vm.ownerName = '';
            vm.address = '';
            vm.mobile1 = '';
            vm.mobile2 = '';
            vm.landline = '';
            vm.file = '';
          }


        }).catch((error) => {
          console.log("error", error.status);

        })
      }
    }
  }
})();