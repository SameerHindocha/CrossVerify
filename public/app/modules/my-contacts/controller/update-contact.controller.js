'use strict';
(function() {
  angular
    .module('myContactsApp')
    .controller('EditContactController', controller);

  controller.$inject = ['MyContactsService', '$location', '$rootScope', 'lodash', '$route'];

  function controller(MyContactsService, $location, $rootScope, lodash, $route) {

    let vm = this;
    let name = '',
      GSTNo = '',
      email = '',
      mobile = '',
      type = '';
    vm.updateContact = updateContact;
    if ($route.current.params.name != 'undefined') {
      name = $route.current.params.name;
    }
    if ($route.current.params.GSTNo != 'undefined') {
      GSTNo = $route.current.params.GSTNo;
    }
    if ($route.current.params.email != 'undefined') {
      email = $route.current.params.email;
    }
    if ($route.current.params.mobile != 'undefined') {
      mobile = $route.current.params.mobile;
    }
    if ($route.current.params.type != 'undefined') {
      type = $route.current.params.type;
    }

    vm.editContact = {
      defaultGSTNo: $route.current.params.GSTNo,
      name: name,
      GSTNo: GSTNo,
      email: email,
      mobile: mobile,
      type: type
    }

    activate();

    function activate() {}

    function updateContact() {
      MyContactsService.updateContact(vm.editContact).then((response) => {
        noty('success', response.data.message);
        $location.path('/my-contacts')
      }).catch((error) => {
        noty('error', error.data.message);
        console.log("error", error);
      })
    }

  }
})();