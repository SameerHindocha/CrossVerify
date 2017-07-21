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
        }]);
})();
