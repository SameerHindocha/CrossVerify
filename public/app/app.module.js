angular
  .module('mainApp', ['userApp', 'clientApp', 'authApp', 'fileApp', 'dashboardApp', 'ngRoute', 'ngLodash', 'ngFileUpload', 'ngclipboard'])
  .config(config)
  .run(run)
  .factory('httpInterceptor', httpInterceptor);

config.$inject = ['$routeProvider', '$httpProvider'];
run.$inject = ['$rootScope', '$route', '$location'];
httpInterceptor.$inject = ['$timeout', '$q', '$location', '$injector'];

function config($routeProvider, $httpProvider) {
  $routeProvider.otherwise({ redirectTo: '/login' });
  $httpProvider.interceptors.push('httpInterceptor');
}

function run($rootScope, $route, $location) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (window.localStorage.getItem('currentUser') && !next.$$route.loggedInGuard) {
      console.log("Session = True & LoginGuard = False");
      return $location.path('/dashboard');
    } else if (window.localStorage.getItem('currentUser') && next.$$route.loggedInGuard) {
      console.log("Session = True & LoginGuard = True");
      return;
      // return $location.path(next.$$route.originalPath);
    } else if (window.localStorage.getItem('currentUser') == null && !next.$$route.loggedInGuard) {
      console.log("Session = False & LoginGuard = False");
      // return $location.path(next.$$route.originalPath);
      return;
    } else {
      return $location.path('/login');
    }
    return;
  });
}

function httpInterceptor($timeout, $q, $location, $injector) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      return config;
    },
    requestError: function(rejection) {
      return $q.reject(rejection);
    },
    response: function(result) {
      return result || $q.when(result);
    },
    responseError: function(response) {
      if (response.status === 401 || response.status === 500) {
        window.localStorage.removeItem('currentUser');
        return $location.path('/login')
      }
      return $q.reject(response);
    }
  }
};