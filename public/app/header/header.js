angular.module('mainApp')
  .directive('header', headerDirective)

headerDirective.$inject = ['AuthService', '$location', '$rootScope']

function headerDirective(AuthService, $location, $rootScope) {
  return {
    templateUrl: '/app/header/header.html',
    controller: function($scope) {
      $scope.Logout = Logout;
      $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!$rootScope.userName) {
        $rootScope.userName = $scope.currentUser.ownerName;
      }

      function Logout() {
        AuthService.logout().then((response) => {
          window.localStorage.removeItem('currentUser');
          noty('success', response.data.message);
          $location.path('/login');
        }).catch((error) => {
          noty('error', "Error logging out");
        })
      }
    }
  }
}