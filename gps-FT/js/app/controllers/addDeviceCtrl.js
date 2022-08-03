materialAdmin.controller("addDeviceCtrl", function($rootScope,$scope) {
  $scope.deviceadd = {};
  $rootScope.showSideBar = true;
  
  $scope.addDevice = function(addDeviceForm){
    alert("add device Complete...");
  }
});