'use strict';
(function() {
  angular
    .module('clientApp')
    .controller('dashboardController', controller);

  controller.$inject = ['DashboardService', 'AuthService', 'toastr', '$location', 'lodash', '$rootScope'];

  function controller(DashboardService, AuthService, toastr, $location, lodash, $rootScope) {
    let vm = this;
    $rootScope.showLoginBackground = false;
    vm.DashboardService = DashboardService;
    vm.sendLink = sendLink;
    vm.sendSMS = sendSMS;
    vm.getClientList = getClientList;
    vm.Logout = Logout;
    vm.search = search;
    vm.link = JSON.parse(localStorage.getItem('currentUser')).preLink + '/' + JSON.parse(localStorage.getItem('currentUser'))._id;
    vm.searchText = '';
    vm.fullData = [];
    vm.openFileComparisionPage = openFileComparisionPage;
    vm.onSuccess = onSuccess;
    vm.onError = onError;

    activate();

    function activate() {
      vm.getCurrentUserForEmail = JSON.parse(window.localStorage.getItem('currentUser'));
      vm.email = vm.getCurrentUserForEmail.email;
      vm.companyName = vm.getCurrentUserForEmail.companyName;
      vm.file = vm.getCurrentUserForEmail.file;
      vm.file = vm.file.split('/').slice(7).join('/');
      vm.getClientList();
    }

    function sendLink() {
      let postObj = {
        email: vm.email
      }
      DashboardService.shareLinkService(postObj).then((response) => {
        toastr.success(response.data.message);
      }).catch((error) => {
        toastr.error("Error in Sending E-mail");
      })
    }

    function sendSMS() {
      let postObj = {
        email: vm.email
      }
      DashboardService.sendSMSService(postObj).then((response) => {
        toastr.success(response.data.message);
      }).catch((error) => {
        console.log("error", error);
        toastr.error(error.data.message);
      })
    }

    function getClientList() {
      let postObj = {
        email: vm.email
      }
      DashboardService.getClients(postObj).then((response) => {
        vm.clients = response.data;
        vm.clientListResponse = response.data;
      }).catch((error) => {
        toastr.error("Error in getting Client List");
      })
    }

    function Logout() {
      AuthService.logout().then((response) => {
        window.localStorage.removeItem('currentUser');
        toastr.success(response.data.message);
        $location.path('/login');
      }).catch((error) => {
        toastr.error("Error logging out");
      })
    }

    function openFileComparisionPage(client) {
      console.log("client detail ctrl", client);
      $location.path('/file-compare/' + client._id);
    }

    function search() {
      function searchUtil(item, toSearch) {
        return (item.companyName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.GSTNo.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
      }
      const totalClients = vm.clientListResponse; //clientListResponse is the client list got from response in getClientList()
      if (vm.searchtext == '') {
        vm.clients = vm.clientListResponse;
      } else {
        vm.filteredList = lodash.filter(totalClients,
          function(item) {
            return searchUtil(item, vm.searchText);
          });
        vm.clients = vm.filteredList;
      }
    }

    $('#clip').tooltip({
      trigger: 'click',
      placement: 'bottom'
    });

    $("#clip").hover(function() {
      $(this)
        .attr('data-original-title', 'copy to clipbard')
        .tooltip('show');
    }, function() {
      $(this).tooltip('hide');
    });

    function setTooltip(btn, message) {
      $(btn)
        .attr('data-original-title', message)
        .tooltip('show');
    }

    function hideTooltip(btn) {
      setTimeout(function() {
        $(btn).tooltip('hide');
      }, 500);
    }

    function onSuccess(e) {

      setTooltip(e.trigger, 'Copied!');
      hideTooltip(e.trigger);
    };

    function onError(e) {
      setTooltip(e.trigger, 'Failed!');
      hideTooltip(e.trigger);
    }

  }


})();