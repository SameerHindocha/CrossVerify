'use strict';
(function() {
  angular
    .module('userApp')
    .controller('ProfileController', controller);

  controller.$inject = ['user', 'UserService', 'ClientService', '$scope', 'lodash', '$rootScope', '$location'];

  function controller(user, UserService, ClientService, $scope, lodash, $rootScope, $location) {
    let vm = this;
    vm.UserService = UserService;
    vm.uploadFiles = uploadFiles;
    vm.id = JSON.parse(window.localStorage.getItem('currentUser'))._id;
    vm.dateOfFile = '07-02-2017'
    vm.user = user;
    // $('#dateOfFile').combodate({
    //   minYear: 2017,
    //   maxYear: 2025
    // });
    activate();

    function activate() {
      vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      $rootScope.userName = vm.currentUser.ownerName;

    }

    // Current time in India (moment object)
    var momNow = moment.tz("Asia/Kolkata");
    // Current time in India formatted (string)
    let date = momNow.format("YYYY-MM-DD HH:mm:ss");
    console.log(date);

    $scope.finalvalues = function(updatedData) {
      let setLocalStorageData, updatedResponseData;
      UserService.updateUser(updatedData).then((response) => {
        vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        updatedResponseData = response.data;
        setLocalStorageData = vm.currentUser;
        vm.user = updatedResponseData.user;
        setLocalStorageData.ownerName = updatedResponseData.user.ownerName;
        setLocalStorageData.state = updatedResponseData.user.state;
        setLocalStorageData.city = updatedResponseData.user.city;
        setLocalStorageData.pincode = updatedResponseData.user.pincode;
        setLocalStorageData.address = updatedResponseData.user.address;
        setLocalStorageData.mobile1 = updatedResponseData.user.mobile1;
        setLocalStorageData.mobile2 = updatedResponseData.user.mobile2;
        setLocalStorageData.landline = updatedResponseData.user.landline;
        $rootScope.userName = updatedResponseData.user.ownerName;
        vm.currentUser = localStorage.setItem("currentUser", JSON.stringify(setLocalStorageData));
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error);
      })
    }

    function uploadFiles() {
      console.log(vm.dateOfFile);

      console.log("$scope.ngMinModel", $scope.ngMinModel);
      if (vm.saleFile) {
        let fileObj = {
          saleFile: vm.saleFile,
          id: vm.id,
          dateOfFile: vm.dateOfFile.toString("yyyy-MM-dd")
        }
        let urldata = {
          url: "admin-api/sale-file",
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fileObj
        };
        console.log("sale urldata", urldata);
        UserService.addSaleFiles(urldata).then((response) => {
          noty('success', response.data.message);
        }).catch((error) => {
          noty('error', error.data.message);
        });
      }

      if (vm.purchaseFile) {
        let fileObj = {
          purchaseFile: vm.purchaseFile,
          id: vm.id,
          dateOfFile: vm.dateOfFile.toString("yyyy-MM-dd")
        }
        let urldata = {
          url: "api/purchase-file",
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fileObj
        };
        console.log("purchase urldata", urldata);
        ClientService.addPurchaseFiles(urldata).then((response) => {
          noty('success', response.data.message);
        }).catch((error) => {
          noty('error', error.data.message);
        });
      }



    }



  }
})();