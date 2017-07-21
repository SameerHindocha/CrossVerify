angular.module('mainApp')
  .directive('header', headerDirective)

headerDirective.$inject = ['AuthService', 'toastr', '$location']

function headerDirective(AuthService, toastr, $location) {
  return {
    templateUrl: '/app/header/header.html',
    controller: function($scope) {
      $scope.Logout = Logout;
      $scope.currentUser = JSON.parse(window.localStorage.getItem('currentUser'));

      function Logout() {
        AuthService.logout().then((response) => {
          window.localStorage.removeItem('currentUser');
          toastr.success(response.data.message);
          $location.path('/login');
        }).catch((error) => {
          toastr.error("Error logging out");
        })
      }
    }
  }
}
