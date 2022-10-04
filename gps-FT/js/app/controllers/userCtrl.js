materialAdmin.controller("userCtrl",['$rootScope', '$scope','LoginService','$localStorage','$uibModal', function($rootScope, $scope,LoginService,$localStorage,$uibModal) {
  $rootScope.showSideBar = true;
  $rootScope.sidebarDevices = true;
  $rootScope.states = {};
  $rootScope.states.actItm = 'userP';
  $scope.s1 = true;
  $scope.tabSelected = function (index) {
      for(var i=1; i<=8; i++){
		  $scope['s'+(i)] = (i===index);
      }
  };
  $scope.seachGlobal = function(){
    if($scope.globalImei){
      function imeiResponse(response){
        var oRes = JSON.parse(response);
        if(oRes){
          if(oRes.status == 'OK'){
            $rootScope.deviceByImei = oRes.data;
            console.log(oRes.data);
            var modalInstance = $uibModal.open({
              templateUrl : 'views/user/device-detail.html',
              controller : 'searchDeviceCtrl'
            });
          }
        }
      };

      var globalImei = {};
      //globalImei.login_uid = $localStorage.user.user_id;
      globalImei.request = 'device_by_imei';
      //globalImei.selected_uid = $rootScope.selectedUser.user_id;
      globalImei.imei = $scope.globalImei;
      LoginService.getDetails(globalImei,imeiResponse);
    }else{
      swal('Please Enter 16 digit IMEI');
    }
  }

}]);
materialAdmin.controller("searchDeviceCtrl", function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,reportService) {
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.edtDevice = function(device){
    $uibModalInstance.dismiss('cancel');
    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/edit-device.html',
      controller : 'editDeviceCtrl'
    });

    $rootScope.sDevice = device;
  };

  $scope.allocDevice = function(aDevice){
    $uibModalInstance.dismiss('cancel');
    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/allocate-device.html',
      controller : 'allocateDeviceCtrl'
    });
    $rootScope.aDevice = aDevice;
  };

  $scope.trackLive = function(device){
    $uibModalInstance.dismiss('cancel');
    if(device.status != 'inactive'){
      $rootScope.redirect('/#!/mains/mapZoom/'+ device.imei);
    }else{
      swal('This Device is Inactive.');
    }
  }

  $scope.deviceDetail = {};
  $scope.deviceDetail = $rootScope.deviceByImei;

  $scope.downloadConfirm = function () {
    $uibModalInstance.dismiss('cancel');
  };
  //******* end remove zone *************//

});
materialAdmin.controller("myUserCtrl",['$rootScope', '$scope','$localStorage','$uibModal','RegistrationService','LoginService', function($rootScope, $scope,$localStorage,$uibModal,RegistrationService,LoginService) {
  $rootScope.showSideBar = true;
  $scope.localStorageUser = $localStorage.user;
  //$scope.selectedUser = $rootScope.selectedUser;
  $scope.editUser = function(user){

    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/edit-user.html',
      controller : 'editUserCtrl'
    });

    $rootScope.sUser = user;

  };

  $scope.getAllSubUserV2 = function (resUser){
    function subUserRes(response){
      if(response){
        if(response.status == 'OK' && response.data){
          response.data.forEach(obj=> {
            $scope.selectedUser.sub_users.forEach(obj2=> {
              if(obj2.user_id === obj.user_id) {
                obj2.stock = obj.stock || 0;
                obj2.total_device = obj.total_device || 0;
              }
            })
          })
          // $scope.selectedUser.sub_users = response.data;
          // $scope.$apply(function() {
          //   $scope.selectedUser = $scope.selectedUser;
          // });
          //node.sub_users = oRes.data.sub_users;
        }
        else if(response.status == 'ERROR'){
          //swal(oRes.message, "", "error");
        }
      }
    }

    var sUsr = {};
    sUsr.user_id = resUser.user_id;
    sUsr.selected_uid = resUser.user_id;
    sUsr.login_uid = resUser.user_id;
    sUsr.subUser = resUser.sub_users.map(o=> o.user_id);
    LoginService.getSubUserV2(sUsr,subUserRes);
  }
  $scope.getAllSubUserV2($scope.selectedUser);

  $scope.getAllSubUser = function (resUser){
      //$scope.selectedUserNew = resUser.data;
      function subUserRes(response){
        var oRes = JSON.parse(response);
        if(oRes){
          if(oRes.status == 'OK'){
            $scope.selectedUser.sub_users = oRes.data.sub_users;
            $scope.$apply(function() {
              $scope.selectedUser = $scope.selectedUser;
            });
            //node.sub_users = oRes.data.sub_users;
          }
          else if(oRes.status == 'ERROR'){
            //swal(oRes.message, "", "error");
          }
        }
      };

      var sUsr = {};
      sUsr.user_id = resUser.data.selected_uid;
      sUsr.request = 'sub_users';
      sUsr.sub_user = resUser.data.selected_uid;
      LoginService.getSubUser(sUsr,subUserRes);
    }
  //DELETE GPS GAADI
    $scope.removeSubUser = function(user){
    var deleteUser = user;
        swal({   title: "Are you sure to delete User from MyUser list.?",
        //text: "You will not be able to recover this Device!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(94, 192, 222);",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false },
        function(isConfirmU){
          if(isConfirmU){
            $scope.removeSubUSerConfirm(deleteUser);
            //swal("Deleted!", "Your Device has been deleted.", "success");
          }

        });
    };

    function removeUserRes(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        swal(oRes.message, "", "success");
        $scope.getAllSubUser(oRes);
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };


    $scope.removeSubUSerConfirm = function (selectedUserData) {
    $scope.selectedUserD = {};
    if(selectedUserData){
      $scope.selectedUserD.request = 'remove_sub_user';
      $scope.selectedUserD.selected_uid = $scope.selectedUser.user_id;
      $scope.selectedUserD.remove_uid = selectedUserData.user_id;
      //$scope.selectedUserD.created_at = selectedVehicle.created_at;

      RegistrationService.removeSubUserD($scope.selectedUserD,removeUserRes);
    }
  };
}]);

materialAdmin.controller("editUserCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = true;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.selectedUser = $scope.sUser;
  /*$scope.selectedDevice = {
     pooled : 0
  };*/

  //******* edit device *************//

  function updateResp(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        //$rootScope.getDeviceByUid();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  $scope.editUserF = function (selectedUser) {
    if(selectedUser){
      selectedUser.request = 'update_user';
      selectedUser.login_uid = $localStorage.user.user_id;
      selectedUser.selected_uid = selectedUser.user_id;
      selectedUser.update_uid = selectedUser.user_id;
      RegistrationService.userUpdateByAdmin(selectedUser,updateResp);
    }
  };
  //******* end edit device *************//

}]);
materialAdmin.controller("myDeviceCtrl",['$rootScope', '$scope','$uibModal','$localStorage','LoginService','RegistrationService', function($rootScope, $scope,$uibModal,$localStorage,LoginService,RegistrationService) {
  $rootScope.showSideBar = true;

  $scope.getloginUser = function (resUser){
    //$scope.selectedUserNew = resUser.data;
    function userSuccess(response){
      var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          $scope.selectedUser.sub_users = oRes.data.sub_users;
        }
        else if(oRes.status == 'ERROR'){
          //swal(oRes.message, "", "error");
        }
      }
    };

    var sUsr = {};
    sUsr.user_id = resUser.user_id;
    sUsr.request = 'get_user';
    sUsr.loadUsers = true;
    LoginService.getUser(sUsr,userSuccess);
  }
  // $scope.getloginUser($localStorage.user);

  /*
//!************get device **************!/
  //!*******fetch devices*******!//
  /!*$rootScope.getDeviceByUid = function(){

      function DeviceResponse(response){
        var oRes = JSON.parse(response);
        if(oRes){
          if(oRes.status == 'OK'){
            for( var k=0; k<oRes.data.length;k++){
              if(oRes.data[k].activation_time || oRes.data[k].expiry_time){
                oRes.data[k].activation_time = moment(oRes.data[k].activation_time).format('LLL');
                oRes.data[k].expiry_time = moment(oRes.data[k].expiry_time).format('LLL');
              }
            }
            $rootScope.selectedUser.devices = oRes.data;
          }
        }
      };

      var sUsr = {};
      sUsr.login_uid = $localStorage.user.user_id;
      if($rootScope.selectedUser.role=='user'){
        sUsr.request = 'gpsgaadi_by_uid';
      }else{
        sUsr.request = 'device_by_uid';
      }
      sUsr.selected_uid = $rootScope.selectedUser.user_id;
      LoginService.getDevice(sUsr,DeviceResponse);

  }*!/


  //!*******end fetch devices*******!//
//!*********get device end **********!//
//!*********Pull Device**********!//

//Own OR Partner Device Search
/!*$scope.own = true;
$scope.partner_d = true;*!/

/!*if($rootScope.selectedUser.devices){
  for (var k = 0;k < $rootScope.selectedUser.devices.length; k++) {
    $rootScope.selectedUser.devices[k].ownershipPart = true;
    $rootScope.selectedUser.devices[k].ownershipOwn = true;
  }
  //$scope.$apply(function() {
    $scope.userdevices = $rootScope.selectedUser.devices;
  //});
}*!/

/!*$scope.toggleOwn = function(part) {
  /!*if($scope.userdevices)
  {
      for (var i = 0; i < $scope.userdevices.length; i++) {
      if ($scope.userdevices[i].ownership != 'partner') {
        if(part == false){
          $scope.userdevices[i].ownershipOwn = false;
        }else{
          $scope.userdevices[i].ownershipOwn = true;
        }
      }
    }
    $rootScope.selectedUser.devices = $scope.userdevices;

  }
  else *!/
  /!*if($scope.selectedUser.devices){
      for (var i = 0; i < $scope.selectedUser.devices.length; i++) {
        if ($scope.selectedUser.devices[i].ownership != 'partner') {
          if(part == false){
            $scope.selectedUser.devices[i].ownershipOwn = false;
          }else{
            $scope.selectedUser.devices[i].ownershipOwn = true;
          }
        }
      }
  }*!/
};*!/

/!*$scope.togglePart = function(types) {
  /!*if($scope.userdevices){
      for (var i = 0; i < $scope.userdevices.length; i++) {
          if ($scope.userdevices[i].ownership == 'partner') {
            if(types == false){
              $scope.userdevices[i].ownershipPart = false;
            }
            else
            {
              $scope.userdevices[i].ownershipPart = true;
            }
          }
      }
      $rootScope.selectedUser.devices = $scope.userdevices;

    }
    else*!/
      if($scope.selectedUser.devices){
        for (var i = 0; i < $scope.selectedUser.devices.length; i++) {
          if ($scope.selectedUser.devices[i].ownership == 'partner') {
            if(types == false){
              $scope.selectedUser.devices[i].ownershipPart = false;
            }
            else
            {
              $scope.selectedUser.devices[i].ownershipPart = true;
            }
          }
      }
    }
};*!/

/!*$rootScope.getDeviceByUid();*!/
*/
  //DELETE GPS GAADI
  $scope.removeGPSGaadi = function(device){
    var deleteDevice = device;
    swal({   title: "Are you sure to delete Device from MyDevice list.?",
          //text: "You will not be able to recover this Device!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "rgb(94, 192, 222);",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false },
        function(isConfirm){
          if(isConfirm){
            $scope.removeGPSGaadiConfirm(deleteDevice);
            //swal("Deleted!", "Your Device has been deleted.", "success");
          }

        });
  };

  function removeResDevice(response){
    var oRes = JSON.parse(response);
    if(oRes){
      //$rootScope.getDeviceByUid();
      $rootScope.softRefreshPage();
      if(oRes.status == 'OK'){
        swal(oRes.message, "", "success");
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };


  $scope.removeGPSGaadiConfirm = function (selectedVehicle) {
    $scope.selectedDeleted = {};
    if(selectedVehicle){
      $scope.selectedDeleted.request = 'remove_gpsgaadi';
      $scope.selectedDeleted.selected_uid = $scope.selectedUser.user_id;
      $scope.selectedDeleted.imei = selectedVehicle.imei;
      $scope.selectedDeleted.created_at = selectedVehicle.created_at;

      RegistrationService.removeGPSGaadi($scope.selectedDeleted,removeResDevice);
    }
  };

  $scope.malfunction = function(device){

    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/malfunctionPop.html',
      controller : 'malfunctionCtrl'
    });

    $rootScope.mDevice = device;
  };
}]);


materialAdmin
    .controller('myDeviceSearchCtrl', myDeviceSearchCtrl);

myDeviceSearchCtrl.$inject = [
  "$rootScope",
  "$scope",
  "$uibModal",
  "$localStorage",
  "LoginService",
  "RegistrationService",
  "gpsAnalyticService"
];

function myDeviceSearchCtrl(
    $rootScope,
    $scope,
    $uibModal,
    $localStorage,
    LoginService,
    RegistrationService,
    gpsAnalyticService
) {
  let vm = this;
  $scope.aVehicle = $localStorage.preservedSelectedUser.devices;
  $scope.filter ={};
  $scope.getDevices = getDevices;

  $rootScope.showSideBar = true;

  function getDevices() {
    let request = prepareFilter();
    gpsAnalyticService.getDevice(request, function (response) {
      console.log(response.data);
      if(response.data && response.data.length)
      $scope.deviceData = response.data;
      else{
        $scope.deviceData = [];
        swal('warning',response.message ? response.message : 'No Data Found', 'warning');
      }
    });
  }

  function prepareFilter(download) {
    let oFilter = {
      // "selected_uid":"DGFC",
      // "login_uid":"FT",
    };
    oFilter.user_id = $rootScope.selectedUser.user_id;
    oFilter.selected_uid = $rootScope.selectedUser.user_id;

    if ($scope.filter.vehicleNo) {
           oFilter.reg_no = $scope.filter.vehicleNo;
    }
    if ($scope.filter.imei) {
      oFilter.device_id = $scope.filter.imei;
        // oFilter.device_id.push();
    }




    return oFilter;
  }

  //DELETE GPS GAADI
  $scope.removeGPSGaadi = function(device){
    var deleteDevice = device;
    swal({   title: "Are you sure to delete Device from MyDevice list.?",
          //text: "You will not be able to recover this Device!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "rgb(94, 192, 222);",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false },
        function(isConfirm){
          if(isConfirm){
            $scope.removeGPSGaadiConfirm(deleteDevice);
            //swal("Deleted!", "Your Device has been deleted.", "success");
          }

        });
  };

  function removeResDevice(response){
    var oRes = JSON.parse(response);
    if(oRes){
      //$rootScope.getDeviceByUid();
      $rootScope.softRefreshPage();
      if(oRes.status == 'OK'){
        swal(oRes.message, "", "success");
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  $scope.removeGPSGaadiConfirm = function (selectedVehicle) {
    $scope.selectedDeleted = {};
    if(selectedVehicle){
      $scope.selectedDeleted.request = 'remove_gpsgaadi';
      $scope.selectedDeleted.selected_uid = $scope.selectedUser.user_id;
      $scope.selectedDeleted.imei = selectedVehicle.imei;
      $scope.selectedDeleted.created_at = selectedVehicle.created_at;

      RegistrationService.removeGPSGaadi($scope.selectedDeleted,removeResDevice);
    }
  };

  $scope.malfunction = function(device){
    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/malfunctionPop.html',
      controller : 'malfunctionCtrl'
    });

    $rootScope.mDevice = device;
  };
}

materialAdmin.controller("editDeviceCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = true;
  $scope.localStorageUser = $localStorage.user;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    if($scope.selectedDevice.activation_time || $scope.selectedDevice.expiry_time){
      $scope.selectedDevice.activation_time = moment($scope.selectedDevice.activation_time).format('LLL');
      $scope.selectedDevice.expiry_time = moment($scope.selectedDevice.expiry_time).format('LLL');
    }
  };
  $scope.sDevice.activation_time = new Date($scope.sDevice.activation_time);
  $scope.sDevice.expiry_time = new Date($scope.sDevice.expiry_time);
  $scope.selectedDevice = $scope.sDevice;
  $scope.aGroup  = [ 'keyman','patrolman','mate']
  /*$scope.selectedDevice = {
     pooled : 0
  };*/

  //******* edit device *************//
  /*$scope.activeValue;
  $scope.selectIoc = function (carIocStyle,obj){
    $scope.activeValue = carIocStyle;
    $scope.icon = carIocStyle;
  };*/
  //****** device type list get ************//
    function responseDeviceType(response){
        var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status === 'OK'){
          $scope.aDeviceType = oRes.data;
        }
        else if(oRes.status === 'ERROR'){
          swal(oRes.message, "", "error");
        }
      }
    }

    $scope.getDeviceType = function() {
      $scope.device = {};
      $scope.device.request = 'get_devide_types';
      RegistrationService.getDevice($scope.device,responseDeviceType);
    }

    $scope.getDeviceType();
  //***********device type list get end************/

  function updateResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status === 'OK'){
        $rootScope.softRefreshPage();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status === 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }

  $scope.editDeviceF = function (selectedDevice) {
    if(selectedDevice){
      selectedDevice.request = 'update_device';
      if(selectedDevice.sos_nos[0] || selectedDevice.sos_nos[1]) {
        const acopyMobile = Object.values(selectedDevice.sos_nos);
        selectedDevice.sos_nos = acopyMobile;
      } 
      else {
         selectedDevice.sos_nos = [];
      }
      selectedDevice.login_uid = $localStorage.user.user_id;
      if(selectedDevice.allDevForAdmin === true){

      }else{
        selectedDevice.user_id = $scope.selectedUser.user_id;
      }
      //selectedDevice.icon = $scope.icon;
      RegistrationService.deviceUpdate(selectedDevice,updateResponse);
    }
  };
  //******* end edit device *************//

}]);

materialAdmin.controller("malfunctionCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = true;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.aReasons = ["Location is not correct","Reports are not proper","Offline for days","Playback is not working","Daily MIS is not generating","Commands are not working","Geofence Alerts are not coming","SMS response is not coming","Others(Specify in Remarks)"];
  $scope.selectedDevice = $scope.mDevice;
  $scope.selectedDevice.remark = '';
  //******* malfunction start *************//
  $scope.activeValue;
  //****** device type list get ************//
    function responseDeviceType(response){
        var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status === 'OK'){
          $scope.aDeviceType = oRes.data;
        }
        else if(oRes.status === 'ERROR'){
          swal(oRes.message, "", "error");
        }
      }
    };

    $scope.getDeviceType = function() {
      $scope.device = {};
      $scope.device.request = 'get_devide_types';
      RegistrationService.getDevice($scope.device,responseDeviceType);
    }

    $scope.getDeviceType();
  //***********device type list get end************/
  function malfunctionResp(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status === 'OK'){
        //$rootScope.getDeviceByUid();
          $rootScope.softRefreshPage();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status === 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  $scope.malfunctionF = function (selectedDevice) {
    if(selectedDevice){
      selectedDevice.request = 'create_malfunction';
      selectedDevice.login_uid = $localStorage.user.user_id;
      selectedDevice.selected_uid = $scope.selectedUser.user_id;
      selectedDevice.notice_date = new Date();
      RegistrationService.malfunctionService(selectedDevice,malfunctionResp);
    }
  };
  //******* end malfunction *************//

}]);

materialAdmin.controller("lastOnlineCtrl",['$rootScope', '$scope','$uibModal','DateUtils','RegistrationService','LoginService', function($rootScope, $scope,$uibModal,DateUtils,RegistrationService,LoginService) {
	$scope.getLastOnline = function(){
		var request = {};
    	request.request = 'last_online';
    	request.selected_uid = $rootScope.selectedUser.user_id;

		LoginService.getLastOnlineDevices(request, function(response){
			var oRes = JSON.parse(response);
			for(var i = 0; i < oRes.data.length; i++) {
				if(!oRes.data[i].last_online) {
					oRes.data[i].status = 'Never Online';
				} else if(oRes.data[i].last_online <= 2 * 60 * 60) {
					oRes.data[i].status = 'Healthy';
				} else if(oRes.data[i].last_online > 2 * 60 * 60 && oRes.data[i].last_online <= 10 * 60 * 60) {
					oRes.data[i].status = 'Okay';
				} else if(oRes.data[i].last_online > 10 * 60 * 60 && oRes.data[i].last_online <= 24 * 60 * 60) {
					oRes.data[i].status = 'Unhealthy';
				} else if(oRes.data[i].last_online > 24 * 60 * 60 && oRes.data[i].last_online <= 48 * 60 * 60) {
					oRes.data[i].status = 'Alert';
				} else if(oRes.data[i].last_online > 48 * 60 * 60 && oRes.data[i].last_online <= 96 * 60 * 60) {
					oRes.data[i].status = 'Alarm';
				} else if(oRes.data[i].last_online > 96 * 60 * 60) {
					oRes.data[i].status = 'Forgotten';
				}

			}
			$scope.$apply(function() {
              $scope.lastOnlineDevices = oRes.data;
            });
		});
	}();
}]);

materialAdmin.controller("allAdminDevicesCtrl",['$rootScope', '$scope','$uibModal','DateUtils','RegistrationService','LoginService', function($rootScope, $scope,$uibModal,DateUtils,RegistrationService,LoginService) {
  $rootScope.showSideBar = true;
  $scope.aPageState = [
    [0,0,0,0,0]
  ];
  $scope.aAllDevListShow = [];
  $scope.sAllTripStatus = ['All','online','offline','inactive'];

  $scope.edtInAllDevice = function(device){

    var modalInstance = $uibModal.open({
      templateUrl : 'views/user/edit-device.html',
      controller : 'editDeviceCtrl'
    });
    device.allDevForAdmin = true;

    $rootScope.sDevice = device;
  };
  //*************** New Date Picker for multiple date selection in single form ************//
    $scope.today = function() {
        $scope.dt = new Date();
        };
        $scope.today();


        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.maxDate = DateUtils.now();
        $scope.format = DateUtils.format;
        $scope.formateDate = function(date){
          return new Date(date).toDateString();
          };
  //************* New Date Picker for multiple date selection in single form ******************//

  $scope.getAllAdminDevice = function (){
    function allDevAdminRespo(response){
      var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          $scope.$apply(function() {
            $scope.aAllDevicesListForAdmin = oRes.data;
          });
          console.log(oRes.data);
          if($scope.aPageState.length <= $scope.bigCurrentPage){
            if(oRes.pageState){
              $scope.aPageState.push(oRes.pageState.data);
              $scope.bigTotalItems = $scope.aPageState.length * 13;
            }
          }
        }
        else if(oRes.status == 'ERROR'){
          //swal(oRes.message, "", "error");
        }
      }
    };

    var allDevAdmin = {};
    allDevAdmin.request = 'get_device_data';
    allDevAdmin.selected_uid = $rootScope.selectedUser.user_id;
    if($scope.aPageState && $scope.aPageState.length > 1){
      if($scope.getPageNoAlt2 > 0){
        allDevAdmin.pageState = $scope.aPageState[$scope.getPageNoAlt2];
      }
    }
    allDevAdmin.row_count = 13;
    if($scope.imei){
      allDevAdmin.imei = $scope.imei;
    }
    if($scope.reg_no){
      allDevAdmin.reg_no = $scope.reg_no.toUpperCase();
    }
    if($scope.sStatus){
      if($scope.sStatus != 'All'){
        allDevAdmin.status = $scope.sStatus;
      }
    }
    if($scope.last_time){
      allDevAdmin.location_time = $scope.last_time;
    }
    LoginService.getAllDevicesForAdmin(allDevAdmin,allDevAdminRespo);
  }
  $scope.getAllAdminDevice();

  $scope.searchByImei = function(sIMEI){
    $scope.imei = sIMEI;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $scope.getAllAdminDevice();
  }
  $scope.searchByRegNo = function(sRegno){
    $scope.reg_no = sRegno;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $scope.getAllAdminDevice();
  }
  $scope.getStatus = function(status){
    $scope.sStatus = status;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $scope.getAllAdminDevice();
  }
  $scope.searchByTime = function(){
    $scope.location_time = $scope.last_time ;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $scope.getAllAdminDevice();
  }
  //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
      $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.bigCurrentPage);
      $scope.getPageNoAlt2 = $scope.bigCurrentPage-1;
      $scope.getAllAdminDevice();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aAllDevListShow.length;
    $scope.bigCurrentPage = 1;
  //****************pagination code end ************//
  $scope.pages = [1];
  $scope.nxt = function () {
    $scope.pages.push($scope.pages.length+1);
  };
}]);

materialAdmin.controller("devicesInfoCtrl",['$rootScope', '$scope','$uibModal','$localStorage','LoginService', function($rootScope, $scope,$uibModal,$localStorage,LoginService) {
  $scope.deviceConfigInfo = $localStorage.deviceConfig;
  if($scope.deviceConfigInfo && $scope.deviceConfigInfo.length>0){
    $scope.deviceType = $scope.deviceConfigInfo[0];
  }
  if($scope.deviceType){
    $scope.selectedDeviceInfo = $scope.deviceType;
  }
  $scope.onSelectDeviceType = function(){
    $scope.selectedDeviceInfo = $scope.deviceType;
  }
}]);

materialAdmin.controller("allocateDeviceCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$timeout','$state', '$timeout','RegistrationService','LoginService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval, $timeout, $state, $timeout,RegistrationService,LoginService) {
  $rootScope.showSideBar = true;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  if($scope.aDevice.length){
    $scope.selectedDevice = $scope.aDevice;
  }
  else{
    $scope.selectedDevice = [$scope.aDevice];
  }


  $scope.toggle = function (scope) {
    scope.toggle();
  };

  if($rootScope.selectedUser){
    $scope.data = [$rootScope.selectedUser];
  }else{
    $scope.data = [$localStorage.user];
  }

  $scope.showList = function (node) {
    $scope.selectedUserNew = node;
    //*******fetch sub users*******//
    $scope.selectedUserNew.sub_users = $scope.selectedUserNew.sub_users || [];
    if ($scope.selectedUserNew.sub_users && $scope.selectedUserNew.sub_users.length < 1) {
      function subUserResponse(response){
        var oRes = JSON.parse(response);
        if(oRes){
          if(oRes.status == 'OK'){
            $scope.selectedUserNew.sub_users = oRes.data.sub_users;
            node.sub_users = oRes.data.sub_users;
          }
          else if(oRes.status == 'ERROR'){
            //swal(oRes.message, "", "error");
          }
        }
      };

      var sUsr = {};
      sUsr.user_id = $localStorage.user.user_id;
      sUsr.request = 'sub_users';
      sUsr.sub_user = $scope.selectedUserNew.user_id;
      LoginService.getSubUser(sUsr,subUserResponse);
    }
  };
  $scope.states = {};
  if($rootScope.selectedUserNew && $rootScope.selectedUserNew.user_id){
    $scope.states.activeItem = $rootScope.selectedUserNew.user_id;
  }else{
    $scope.states.activeItem = $localStorage.user.user_id;
    $rootScope.selectedUserNew = $localStorage.user;
  }
  //******* allocate device *************//
    $scope.activeValue;
    $scope.selectIoc = function (carIocStyle,obj){
      $scope.activeValue = carIocStyle;
      $scope.icon = carIocStyle;
    }

    function associateResponse(response){
      var oRes = JSON.parse(response);
      if(oRes){
        $rootScope.loader = false;
        if(oRes.status == 'OK'){
          $rootScope.softRefreshPage();
          swal(oRes.message, "", "success");
          $uibModalInstance.dismiss('cancel');
        }
        else if(oRes.status == 'ERROR'){
          swal(oRes.message, "", "error");
        }
      }
    };

    $scope.allocateDeviceF = function (selectedDevice) {
      if(selectedDevice){
        var alloDevice = {};
        alloDevice.request = 'associate_device';
        alloDevice.selected_uid = $scope.selectedUser.user_id;
        alloDevice.new_uid = $scope.selectedUserNew.user_id;
        alloDevice.login_uid = $localStorage.user.user_id;
        alloDevice.devices = [];
        for (var i = 0; i < selectedDevice.length; i++) {
          alloDevice.devices[i] = selectedDevice[i].imei;
        }
        //selectedDevice.devices = selectedDevice;
        RegistrationService.deviceAssociate(alloDevice,associateResponse);

        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 50000);
      }
    };
  //******* end allocate device *************//
  if (typeof $rootScope.selectedUser !== "undefined") {
    $localStorage.onLocalselectedUser = $rootScope.selectedUser
  }
}]);

materialAdmin.controller("addVehiclefromPullCtrl", function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = true;
  $scope.byVehicle = true;
  $scope.user = {};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    $rootScope.showSideBar = true;
  };

  $scope.add = {};
  $scope.add.type = "vehicle";

  $scope.setAdd = function(values){
      if(values == 'vehicle'){
        $scope.user.imei = '';
        $scope.byVehicle = true;
        $scope.byIMEI = false;
      }
      else
      {
        $scope.user.vehicle = '';
        $scope.byIMEI = true;
        $scope.byVehicle = false;
      }
  }

  function updateResA(response){
    var oRes = JSON.parse(response);
    if(oRes){
      $rootScope.showSideBar = true;
       $scope.$apply(function() {
          var selectedDev = '';
          var alreadyRegno = '';
          var alreadyImei = '';
          $scope.user.vehicle = '';
          $scope.user.imei = '';
        });
      if(oRes.status == 'OK'){
          $rootScope.softRefreshPage();
        //$rootScope.getDeviceByUid();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  $scope.addVehicle = function (){
      var selectedDev = {};

      //selectedDev.login_uid = $localStorage.user.user_id;
      selectedDev.selected_uid = $rootScope.selectedUser.user_id;
      var ownDevices = $scope.selectedUser.devices
      if($scope.user.vehicle && ownDevices){
          for(i=0;i<ownDevices.length;i++)
          {
            if($scope.user.vehicle.replace(/ +/g, "") == ownDevices[i].reg_no.replace(/ +/g, "") || $scope.user.vehicle.replace(/ +/g, "") == ownDevices[i].name.replace(/ +/g, ""))
            {
            console.log("own Device");
            var alreadyRegno =  ownDevices[i].reg_no;
            }
          }
          if(!alreadyRegno){
            $scope.RegNumremovesapce = $scope.user.vehicle.toUpperCase();
            selectedDev.reg_no = $scope.RegNumremovesapce.replace(/ +/g, "");
            selectedDev.request = 'add_vehicle';
            RegistrationService.devicefromPull(selectedDev,updateResA);
          }
          else{
            swal( "Already Added");
          }
       }
       if($scope.user.imei && ownDevices){
          for(i=0;i<ownDevices.length;i++)
          {
            if($scope.user.imei == ownDevices[i].imei)
            {
            console.log("own Device");
            var alreadyImei =  ownDevices[i].imei;
            }
          }
          if(!alreadyImei){
            selectedDev.imei = $scope.user.imei;
            selectedDev.request = 'add_imei';
            RegistrationService.devicefromPull(selectedDev,updateResA);
          }
          else{
            swal( "Already Added");
          }
       }

  }
});

materialAdmin.controller("profileCtrl", function($rootScope, $scope, $localStorage,LoginService, $timeout) {
  $rootScope.showSideBar = false;
  if($scope.selectedUser){
  $scope.user = $scope.selectedUser;
  } else {
  $scope.user = $localStorage.preservedSelectedUser;
  }
  $scope.localStorageUser = $localStorage.user;

  if($scope.user.mobile){
  $scope.user.userMobile = parseInt($scope.user.mobile);
  }
  if($scope.user.role){
    if($scope.user.role == 'user'){
      $scope.registration = {};
      $scope.registration.role = 'user';
      $scope.subTypeofUser = true;
  } else if($scope.user.role == 'dealer'){
      $scope.registration = {};
      $scope.registration.role = 'dealer';
      $scope.typeofDealer = true;
  }
  }

  $scope.user_mis_preferences = {};

  function getUserPreferences(){
    function responseHandler(res){
        var oRes = JSON.parse(res);
        if(oRes.status == "OK"){
            $timeout(function(){
                $scope.user_mis_preferences  = oRes.data;
            },0)
        }
    }
    var requestObj = {};
    requestObj.selected_uid = $scope.user.user_id;
    LoginService.getUserMISPreferences(requestObj,responseHandler)
  }
  getUserPreferences();

  /*if($scope.user.type){
      if($scope.user.type=='customer'){
       $scope.user.type = 'Customer';
      }else if($scope.user.user_type=='broker'){
       $scope.user.type = 'Broker';
      }else if($scope.user.user_type=='truck_owner'){
       $scope.user.type = 'Truck Owner';
      }else if($scope.user.user_type=='transporter'){
       $scope.user.type = 'Transporter';
      } else if($scope.user.type=='dealer'){
       $scope.userType = 'Dealer';
      }
      else if($scope.user.type=='admin'){
       $scope.userType = 'Admin';
      }
  }*/

  $scope.aUserType = ['Customer', 'Broker','Truck Owner','Transporter'];
  $scope.bUserType = ['Dealer'];
  $scope.cUserType = ['Admin'];
  $scope.setTypeUserValue = function(values){
   if(values == 'typeDealer'){
        $scope.userType = 'dealer';
        $scope.user.user_type ='';
        $scope.subTypeofUser = false;
        $scope.typeofDealer = true;
      }
      else
      {
        $scope.userType = '';
        $scope.subTypeofUser = true;
        $scope.typeofDealer = false;
      }
  };
  $scope.cancel=function (user) {
      user.isEditing = false;
    };

  $scope.editSave=function (user) {
      function userResponse(response){
        $rootScope.loader = false;
        var oRes = JSON.parse(response);
        if(oRes.status == "OK"){
          swal(oRes.message,"","success");
        }else {
          swal(oRes.message,"","error");
        }
        $scope.$apply(function() {
              user.isEditing = false;
            });
      }
      var edtdata = {};
          edtdata=user;

          if($scope.user.userMobile){
          edtdata.mobile = $scope.user.userMobile;
           }
          if($scope.registration && $scope.registration.role){
          edtdata.role = $scope.registration.role;
           }

          if($scope.userType && !$scope.user.user_type){
            edtdata.type = $scope.userType;
            } else if($scope.user.user_type && !$scope.userType ){
                if($scope.user.user_type=='Customer'){
                 edtdata.type = 'customer';
                }else if($scope.user.user_type=='Broker'){
                 edtdata.type = 'broker';
                }else if($scope.user.user_type=='Truck Owner'){
                 edtdata.type = 'truck_owner';
                }else if($scope.user.user_type=='Transporter'){
                 edtdata.type = 'transporter';
                }
          }

          edtdata.selected_uid = user.user_id;
          edtdata.request = "update_user";
          LoginService.updateUserProfile(edtdata, userResponse);
          $rootScope.loader = true;
          $timeout(function () {
              $rootScope.loader = false;
          }, 60000);

          function handleNotifUpdateResp(){}
          var updateBody = $scope.user_mis_preferences;
          updateBody.user_id =$scope.user.user_id;
          if (user.email
              && user.email.trim().length>0){
              var arrEmails = [];
              arrEmails.push(user.email);
              updateBody.emails = arrEmails;
          }
          LoginService.updateUserMISPreferences(updateBody,handleNotifUpdateResp);

    };

  //PLAYBACK HOME PAGE FUNCTION
  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
});

materialAdmin.controller("changePassCtrl", function($rootScope, $scope, $localStorage,LoginService) {
  $rootScope.showSideBar = false;
  function changeResp(response){
    var oRes = JSON.parse(response);
    if(oRes.status == "OK"){
      swal(oRes.message,"","success");
      $rootScope.logout();
    }else {
      swal(oRes.message,"","error");
    }
  }
  $scope.changePass = function(data){
    if(data.$valid){
        if(data.OldPass.$viewValue == data.NewPass.$viewValue){
          fail = {
            status : 'ERROR',
            message : 'Old Password and New Password Can Not be same'
          }
          //changeResp(fail)
          swal(fail.message,"","error");
        }
        else if(!(data.NewPass.$viewValue == data.ConfirmPass.$viewValue)){
          fail = {
            status : 'ERROR',
            message : 'Both New Password and Confirm password should match'
          }
          swal(fail.message,"","error");
        }
        else if((data.OldPass.$viewValue != data.NewPass.$viewValue) && (data.NewPass.$viewValue == data.ConfirmPass.$viewValue)){
          /*pass = {
            status : 'OK',
            message : 'Pasword Updation Request Send, we will get in touch with you soon'
          }
          changeResp(pass)*/
          var selectedChange = {};
          selectedChange.selected_uid = $rootScope.selectedUser.user_id;
          selectedChange.old_password = $scope.oldPass;
          selectedChange.new_password = $scope.newPass;
          selectedChange.request = "change_password";
          LoginService.changePassword(selectedChange,changeResp);
        }
      //LoginService.changePassword(data,changeResp)
    }
  }
  //PLAYBACK HOME PAGE FUNCTION
  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
});

materialAdmin.controller("myGroupCtrl", function($rootScope, $scope, $localStorage,$location) {
  $scope.user = $localStorage.user;

  $scope.go = function ( path ) {
    $location.path( path );
  };
});

materialAdmin.controller("myParentCtrl", ['$rootScope', '$scope', '$localStorage', '$location', '$uibModal', 'RegistrationService', function($rootScope, $scope, $localStorage, $location, $uibModal, RegistrationService) {
  $scope.user = $localStorage.user;


  $scope.getAllParentRFID = function (resUser) {
    //$scope.selectedUserNew = resUser.data;
    function subUserRes(response) {
      var oRes = response;
      if (oRes) {
        if (oRes.status == 'OK') {
          $scope.selectedUser.parentRFID = oRes.data;
          $scope.$apply(function () {
            $scope.selectedUser = $scope.selectedUser;
          });
          //node.sub_users = oRes.data.sub_users;
        } else if (oRes.status == 'ERROR') {
          //swal(oRes.message, "", "error");
        }
      }
    };


    var sUsr = {};
    sUsr.user_id = $localStorage.user.user_id;
    RegistrationService.getStudentParent(sUsr, subUserRes);
  };

  $scope.getAllParentRFID();

  $scope.upsertRegisterParent = function(oRegPar) {

    var modalInstance = $uibModal.open({
      templateUrl: 'views/user/registerParent.html',
      controller: 'parentRegisterCtrl',
      resolve: {
        'selectedRegisterMaster': function () {
          return oRegPar;
        }
      }
    });

    modalInstance.result.then(function (response) {
      if (response)
        $scope.oRegPar = response;
      console.log('close', response);
    }, function (data) {
      console.log('cancel');
    });
  };

  $scope.go = function ( path ) {
    $location.path( path );
  };
}]);
// parerent

materialAdmin.controller("editParentCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = true;
  $scope.localStorageUser = $localStorage.user;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    if($scope.selectedDevice.activation_time || $scope.selectedDevice.expiry_time){
      $scope.selectedDevice.activation_time = moment($scope.selectedDevice.activation_time).format('LLL');
      $scope.selectedDevice.expiry_time = moment($scope.selectedDevice.expiry_time).format('LLL');
    }
  };
  $scope.sDevice.activation_time = new Date($scope.sDevice.activation_time);
  $scope.sDevice.expiry_time = new Date($scope.sDevice.expiry_time);
  $scope.selectedDevice = $scope.sDevice;

  //****** device type list get ************//
  function responseDeviceType(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status === 'OK'){
        $scope.aDeviceType = oRes.data;
      }
      else if(oRes.status === 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }

  $scope.getDeviceType = function() {
    $scope.device = {};
    $scope.device.request = 'get_devide_types';
    RegistrationService.getDevice($scope.device,responseDeviceType);
  }

  $scope.getDeviceType();
  //***********device type list get end************/

  function updateResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status === 'OK'){
        $rootScope.softRefreshPage();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status === 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }

  $scope.editDeviceF = function (selectedDevice) {
    if(selectedDevice){
      selectedDevice.request = 'update_device';
      selectedDevice.login_uid = $localStorage.user.user_id;
      if(selectedDevice.allDevForAdmin === true){

      }else{
        selectedDevice.user_id = $scope.selectedUser.user_id;
      }
      //selectedDevice.icon = $scope.icon;
      RegistrationService.deviceUpdate(selectedDevice,updateResponse);
    }
  };
  //******* end edit device *************//

}]);

// end parent

materialAdmin.controller("complaintCtrl", function($rootScope, $scope,$uibModal,DateUtils, $localStorage,$location,RegistrationService) {
  $scope.user = $localStorage.user;
  $rootScope.showSideBar = false;

  //*************** New Date Picker for multiple date selection in single form ************//
    $scope.today = function() {
        $scope.dt = new Date();
        };
        $scope.today();


        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.maxDate = DateUtils.now();
        $scope.format = DateUtils.format;
        $scope.formateDate = function(date){
          return new Date(date).toDateString();
          };
  //************* New Date Picker for multiple date selection in single form ******************//

  $scope.getAllComplaints = function(){
    function compResponse(response){
      var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          if(oRes.data && oRes.data.length>0){
            for(var y=0;y<oRes.data.length;y++){
              oRes.data[y].notice_date = moment(oRes.data[y].notice_date).format('LLL');
            }
          }
          $scope.aComplaints = oRes.data;
          $scope.selComplaint = oRes.data[0];
          setTimeout(function(){
            listItem = $($('.side-bx-sec')[0]);
            listItem.addClass('light');
          }, 500);
          if($scope.reg_no){
            $scope.$apply(function() {
              $scope.vehicleNum = $scope.reg_no;
            });
          }
        }
      }
    };

    var oComp = {};
    oComp.request = 'get_malfunction';
    if($scope.imei){
      oComp.imei = $scope.imei;
    }
    oComp.login_uid = $localStorage.user.user_id;
    oComp.selected_uid = $localStorage.preservedSelectedUser.user_id;
    RegistrationService.getComplaints(oComp,compResponse);
  }
  $scope.getAllComplaints();

  $scope.selectedItem = function(selData, index){
    $scope.selComplaint = selData;
    listItem = $($('.side-bx-sec')[index]);
    listItem.siblings().removeClass('light');
    listItem.addClass('light');
  }

  $scope.editComplaint = function(selComplaintData){
    var modalInstance = $uibModal.open({
      templateUrl : 'views/user-profile/complaintPopup.html',
      controller : 'complaintPopCtrl'
    });

    $rootScope.mDevice = selComplaintData;
  }

  $scope.onSelectVehicle=function ($item, $model, $label){
      $scope.imei = $item.imei;
      $scope.reg_no = $item.reg_no;
      //$rootScope.getPageNo = 0;
      //$scope.setPage(1);
      $scope.getAllComplaints();
    };
  $scope.remVehicle = function(vehicleNum){
    if(vehicleNum.length<1)
      {
        $scope.reg_no = '';
        $scope.imei = '';
        //$rootScope.getPageNo = 0;
        //$scope.setPage(1);
        $scope.getAllComplaints();
        console.log('1stRefersh');
      }
  }

  $scope.dwnldClick = function(){
    function dwnResponse(response){
      var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          $rootScope.downloadM = oRes;
          var modalInstance = $uibModal.open({
            templateUrl : 'views/user-profile/download-malfuntion-pop.html',
            controller : 'downloadMalFunCtrl'
          });
        }
      }
    };

    var dwnMalfun = {};
    dwnMalfun.request = 'download_report_malfunction';
    dwnMalfun.login_uid = $localStorage.user.user_id;
    dwnMalfun.selected_uid = $localStorage.preservedSelectedUser.user_id;
    RegistrationService.dwnComplaints(dwnMalfun,dwnResponse);
  }
  //PLAYBACK HOME PAGE FUNCTION
  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
});

materialAdmin.controller("downloadMalFunCtrl", function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,reportService) {
  $rootScope.showSideBar = false;
  //$rootScope.geofence;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

   $scope.selectedMalRef = $rootScope.downloadM.data;

  $scope.downloadConfirm = function () {
    $uibModalInstance.dismiss('cancel');
  };
  //******* end remove zone *************//

});

materialAdmin.controller("complaintPopCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
  $rootScope.showSideBar = false;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.aReasons = ["Location is not correct","Reports are not proper","Offline for days","Playback is not working","Daily MIS is not generating","Commands are not working","Geofence Alerts are not coming","SMS response is not coming","Others(Specify in Remarks)"];
  $scope.selectedDevice = $scope.mDevice;
  var newObject = angular.copy($scope.mDevice);
  $scope.selectedDevice = newObject;
  //******* malfunction start *************//
  $scope.activeValue;
  //****** device type list get ************//
    function responseDeviceType(response){
        var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          $scope.aDeviceType = oRes.data;
        }
        else if(oRes.status == 'ERROR'){
          swal(oRes.message, "", "error");
        }
      }
    };

    $scope.getDeviceType = function() {
      $scope.device = {};
      $scope.device.request = 'get_devide_types';
      RegistrationService.getDevice($scope.device,responseDeviceType);
    }

    $scope.getDeviceType();
  //***********device type list get end************/
  function updateComplaintResp(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        //$rootScope.getDeviceByUid();
          $rootScope.softRefreshPage();
        swal(oRes.message, "", "success");
        $uibModalInstance.dismiss('cancel');
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  $scope.complaintF = function (selectedDevice) {
    if(selectedDevice){
      selectedDevice.request = 'update_malfunction';
      selectedDevice.login_uid = $localStorage.user.user_id;
      selectedDevice.selected_uid = $localStorage.preservedSelectedUser.user_id;
      //selectedDevice.notice_date = new Date();
      //selectedDevice.icon = $scope.icon;
      RegistrationService.updateComplaintService(selectedDevice,updateComplaintResp);
    }
  };
  //******* end malfunction *************//

}]);
