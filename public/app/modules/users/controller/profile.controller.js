'use strict';
(function() {
  angular
    .module('userApp')
    .controller('ProfileController', controller);

  controller.$inject = ['user', 'UserService', '$scope', 'lodash', '$rootScope', '$location'];

  function controller(user, UserService, $scope, lodash, $rootScope, $location) {
    let vm = this;
    vm.user = user;
    vm.UserService = UserService;
    // vm.addPurchase = addPurchase;
    vm.uploadFiles = uploadFiles;
    vm.id = JSON.parse(window.localStorage.getItem('currentUser'))._id;

    activate();

    function activate() {
      vm.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      $rootScope.userName = vm.currentUser.ownerName;
      if (vm.user.saleFilePath) {
        vm.saleFilePath = vm.user.saleFilePath;
        vm.saleFilePath = vm.saleFilePath.split('/').slice(5).join('/');
      }
    }



    $scope.finalvalues = function(updatedData) {
      let splitArray, fileType, urldata, setLocalStorageData, updatedResponseData;
      if (updatedData.file) {
        splitArray = updatedData.file.name.split('.');
        fileType = lodash.last(splitArray);
        Object.defineProperty(updatedData.file, 'name', {
          value: Math.floor(Math.random() * (1000000000000 - 3) + 100000) + '.' + fileType,
          writable: true
        });
      }

      urldata = {
        url: "admin-api/edit-user",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: updatedData
      };
      UserService.updateUser(urldata).then((response) => {
        if (response.status === 200) {
          noty('success', response.data.message);
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
          setLocalStorageData.saleFilePath = updatedResponseData.user.saleFilePath;
          setLocalStorageData.saleFile = updatedResponseData.user.saleFile;
          $rootScope.userName = updatedResponseData.user.ownerName;
          vm.currentUser = localStorage.setItem("currentUser", JSON.stringify(setLocalStorageData));
        }
      }).catch((error) => {
        console.log("error", error);
        noty('error', error.data.message);
      })
    }

    function uploadFiles() {
      console.log("123");
      if (vm.purchaseFile || vm.saleFile) {
        let urldata, fileObj;

        fileObj = {
          purchaseFile: vm.purchaseFile,
          saleFile: vm.saleFile,
          id: vm.id
        }

        urldata = {
          url: "admin-api/file",
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: fileObj
        };


        UserService.addFiles(urldata).then((response) => {
          noty('success', response.data.message);

        }).catch((error) => {
          noty('error', error.data.message);
        });







        // let userFile, userWorkBook;
        // // userFile = vm.saleFile;
        // console.log("userFile", userFile);
        // userWorkBook = XLSX.readFile(userFile);
        // console.log("userWorkBook", userWorkBook);
        // userRowObject = xlsx.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
        // let saleObject = {
        //   "samir": userRowObject
        // }
        // console.log("saleObject", saleObject);
        // // users.saleFile = saleObject

      }
    }



    // function addPurchase() {
    //   console.log("1233");
    //   $location.path('/user/addSale');
    // }

  }
})();