'use strict';
(function() {
  angular
    .module('clientApp')
    .controller('dashboardController', controller);

  controller.$inject = ['DashboardService', 'AuthService', '$location', 'lodash', '$rootScope'];

  function controller(DashboardService, AuthService, $location, lodash, $rootScope) {
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
    vm.downloadPurchaseFile = downloadPurchaseFile;

    activate();

    function activate() {
      vm.getCurrentUserForEmail = JSON.parse(window.localStorage.getItem('currentUser'));
      vm.email = vm.getCurrentUserForEmail.email;
      vm.companyName = vm.getCurrentUserForEmail.companyName;
      vm.getClientList();
    }

    function sendLink() {
      let postObj = {
        email: vm.email
      }
      DashboardService.shareLinkService(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function sendSMS() {
      let postObj = {
        email: vm.email
      }
      DashboardService.sendSMSService(postObj).then((response) => {
        noty('success', response.data.message);
      }).catch((error) => {
        noty('error', error.data.message);
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
        noty('error', error.data.message);
      })
    }

    function Logout() {
      AuthService.logout().then((response) => {
        window.localStorage.removeItem('currentUser');
        noty('success', response.data.message);
        $location.path('/login');
      }).catch((error) => {
        noty('error', error.data.message);
      })
    }

    function openFileComparisionPage(client) {
      $rootScope.clientData = client;
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

    function downloadPurchaseFile(path) {
      console.log("path", path);
      vm.downloadPath = path.split('/').slice(5).join('/');
      console.log("vm.downloadPath", vm.downloadPath);
    }



    $('#clip').tooltip({
      trigger: 'click',
      placement: 'top'
    });

    $("#clip").hover(function() {
      $(this)
        .attr('data-original-title', 'copy to clipbard')
        .tooltip('show');
    }, function() {
      $(this).tooltip('hide');
    });

    $("#share").hover(function() {
      $(this)
        .attr('data-original-title', 'share via')
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