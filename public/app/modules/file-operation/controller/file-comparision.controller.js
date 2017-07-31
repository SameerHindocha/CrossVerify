'use strict';
(function() {
  angular
    .module('fileApp')
    .controller('fileComparisionController', controller);

  controller.$inject = ['FileOperationService', '$location', '$route', 'lodash'];

  function controller(FileOperationService, $location, $route, lodash) {
    let vm = this;
    vm.compareFiles = compareFiles;
    vm.matchStatus, vm.clientRowObject, vm.userRowObject, vm.difference;
    vm.showStatus = false;
    activate();

    function activate() {
      let clientId, postObj;
      clientId = $route.current.params.id;
      postObj = {
        id: clientId
      }
      FileOperationService.compareFileService(postObj).then((response) => {
        if (response.data.clientRowObject) {
          vm.clientRowObject = response.data.clientRowObject;
        }
        if (response.data.userRowObject) {

          console.log("response.data.userRowObject", response.data.userRowObject);
          vm.userRowObject = response.data.userRowObject;
        }
        if (response.data.status === '204') {
          vm.difference = response.data.message;
          vm.matchStatus = false;
        } else {
          vm.clientRowObject = response.data.clientRowObject;
          vm.userRowObject = response.data.userRowObject;
          if (response.data.difference.length == 0) {
            vm.matchStatus = true;
            vm.difference = 'No difference.'
          } else {
            vm.matchStatus = false;
            vm.difference = response.data.difference;
          }
        }
      }).catch((error) => {
        console.log("error", error);
      })
    }

    function compareFiles() {
      vm.showStatus = true;
    }

  }
})();