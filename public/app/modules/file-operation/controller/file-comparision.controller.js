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
        vm.clientRowObject = response.data.clientRowObject;
        vm.userRowObject = response.data.userRowObject;
        if (response.data.difference.length == 0) {
          vm.matchStatus = true;
          vm.difference = 'No difference.'
        } else {
          vm.matchStatus = false;
          vm.difference = response.data.difference;
        }

      }).catch((error) => {
        console.log("error", error);
      })
    }

    function compareFiles() {
      vm.showStatus = true;
      // let clientId=$route.current.params.id;
      // let postObj={
      //   id:clientId
      // }
      // FileOperationService.compareFileService(postObj).then((response)=>{
      //      console.log("response", response);
      //      if(response.data.difference.length==0){
      //       vm.matchStatus=true;
      //      }else{
      //       vm.matchStatus=false;
      //      }

      // }).catch((error)=>{
      //     console.log("error", error);
      // })
    }

  }
})();