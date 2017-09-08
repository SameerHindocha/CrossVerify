'use strict';
(function() {
  angular
    .module('dashboardApp')
    .config(['$routeProvider', function($routeProvider, DashboardService) {
      $routeProvider
        .when("/dashboard", {
          templateUrl: 'app/modules/dashboard/view/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
        .when("/edit-customer/:id/:month/:invoiceNo/:flag", {
          templateUrl: 'app/modules/dashboard/view/edit-customer.html',
          controller: 'editCustomerController',
          controllerAs: 'vm',
          loggedInGuard: true
        })
        .when("/temporary-dashboard/:userGSTNo/:customerGSTIN/:month/:invoiceNo/:category", {
          templateUrl: 'app/modules/dashboard/view/temporary-dashboard.html',
          controller: 'temporaryDashboardController',
          controllerAs: 'vm',
          // loggedInGuard: true
          loggedInGuard: false
        })
    }]);
})();