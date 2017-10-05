'use strict';
(function() {
  angular
    .module('myContactsApp')
    .controller('MyContactsController', controller);

  controller.$inject = ['MyContactsService', '$location', '$rootScope', 'lodash'];

  function controller(MyContactsService, $location, $rootScope, lodash) {

    let vm = this;
    let saleContacts = [];
    let purchaseContacts = [];
    vm.totalContacts = [];
    vm.searchContactText = '';
    vm.searchContactsGrid = searchContactsGrid;
    vm.editContact = editContact;
    vm.clearContactSearch = clearContactSearch;
    activate();

    function activate() {
      MyContactsService.getContactDetails().then((response) => {
        saleContacts = response.data.finalSaleContactList;
        purchaseContacts = response.data.finalPurchaseContactList;
        let concateObj = saleContacts.concat(purchaseContacts);
        vm.totalContacts = lodash.uniq(concateObj, function(obj) {
          return obj.Supplier_GSTIN || obj.Customer_Billing_GSTIN;
        });
        vm.contactsToFilter = saleContacts.concat(purchaseContacts);
      }).catch((error) => {
        console.log("error", error);
      })
    }

    function searchContactsGrid() {
      function searchUtil(item, toSearch) {
        if (item) {
          if (item.Type == 'Seller') {
            if (item.Supplier_Name && item.Supplier_GSTIN) {
              return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            } else {
              if (item.Supplier_Name && !item.Supplier_GSTIN) {
                return (item.Supplier_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
              }
              if (item.Supplier_GSTIN && !item.Supplier_Name) {
                return (item.Supplier_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
              }
            }
          } else if (item.Type == 'Buyer') {
            if (item.Customer_Billing_Name && item.Customer_Billing_GSTIN) {
              return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
            } else {
              if (item.Customer_Billing_Name && !item.Customer_Billing_GSTIN) {
                return (item.Customer_Billing_Name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
              }
              if (item.Customer_Billing_GSTIN && !item.Customer_Billing_Name) {
                return (item.Customer_Billing_GSTIN.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
              }
            }
          }
        }
      }
      let finalContactList = vm.contactsToFilter;
      if (vm.searchContactText == '') {
        vm.totalContacts = lodash.uniq(vm.contactsToFilter, function(obj) {
          return obj.Supplier_GSTIN || obj.Customer_Billing_GSTIN;
        });
      } else {
        vm.filteredContactList = lodash.filter(finalContactList,
          function(item) {
            return searchUtil(item, vm.searchContactText);
          });
        vm.totalContacts = lodash.uniq(vm.filteredContactList, function(obj) {
          return obj.Supplier_GSTIN || obj.Customer_Billing_GSTIN;
        });
      }
    }

    function clearContactSearch() {
      vm.searchContactText = '';
    }

    function editContact(contact) {
      let email, name, GSTNo, mobile, type, noValue;
      if (contact.Type == 'Buyer') {
        email = (contact.Email_Address) ? contact.Email_Address : noValue;
        name = (contact.Customer_Billing_Name) ? contact.Customer_Billing_Name : noValue;
        mobile = (contact.Mobile_Number) ? contact.Mobile_Number : noValue;
        GSTNo = (contact.Customer_Billing_GSTIN) ? contact.Customer_Billing_GSTIN : noValue;
        type = contact.Type;
      } else if (contact.Type == 'Seller') {
        email = (contact.Email_Address) ? contact.Email_Address : noValue;
        name = (contact.Supplier_Name) ? contact.Supplier_Name : noValue;
        mobile = (contact.Mobile_Number) ? contact.Mobile_Number : noValue;
        GSTNo = (contact.Supplier_GSTIN) ? contact.Supplier_GSTIN : noValue;
        type = contact.Type;
      }
      $location.path('/edit-contact/' + name + '/' + GSTNo + '/' + email + '/' + mobile + '/' + type);
    }

  }
})();