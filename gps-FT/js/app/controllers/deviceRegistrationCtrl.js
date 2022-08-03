materialAdmin.controller("deviceRegiCtrl", function($rootScope,$scope,$localStorage,$timeout,RegistrationService,LoginService) {
  $scope.device = {};
  $rootScope.showSideBar = true;
  $rootScope.sidebarDevices = false;

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
      $scope.device.request = 'get_devide_types';
      RegistrationService.getDevice($scope.device,responseDeviceType);
    }

    $scope.getDeviceType();
  //***********device type list get end************/
  
  function responseDevice(response){
    var oRes = JSON.parse(response);
    if(oRes){
      $rootScope.loader = false;
      if(oRes.status == 'OK'){
          swal({
            title: "Device successfully Registered",
            /*text: "Go to User List page?",*/
            type: "success",
            showCancelButton: true,
            cancelButtonColor: "rgb(77, 179, 224)",
            cancelButtonText: "Register Device",
            confirmButtonColor: "rgb(77, 179, 224)",
            confirmButtonText: "device list",
            closeOnConfirm: true,
            html: false
          }, function(isConfirm){
             if (isConfirm) {
              $rootScope.redirect('/#!/main/user');
            } else {
              $rootScope.redirect('/#!/main/deviceRegister');
            }
            /*swal("Deleted!", "MY Device.", "success");*/
            
          });
          //swal(oRes.message, "", "success");
          $scope.$apply(function() {
            $scope.device = '';
          });

        //*********device get ************//
        function DeviceResponse(response){
          var oRes = JSON.parse(response);
          if(oRes){
            if(oRes.status == 'OK'){
              $scope.selectedUser.devices = oRes.data;
              if ($scope.selectedUser.devices && $scope.selectedUser.devices.length > 0) {
                $scope.showDevi = true;
              }else{
                $scope.showDevi = false;
              }
            }
            else if(oRes.status == 'ERROR'){
            }
          }
        };

        var sUsr = {};
        sUsr.login_uid = $localStorage.user.user_id;
        sUsr.request = 'device_by_uid';
        sUsr.selected_uid = $scope.selectedUser.user_id;
        LoginService.getDevice(sUsr,DeviceResponse);
        //*****/*****end device get ************//
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };
  
  $scope.deviceRegi = function(form) {
      if(form.$valid && $scope.isAvailableIMEI){
        //var getCurrentUser = LoginService.getCurrentUser();
        $scope.device.request = 'register_device';
        $scope.device.user_id = $localStorage.user.user_id;
        RegistrationService.registerDevice($scope.device,responseDevice);

        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 50000);
    }
  }
  //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };

  //Check IMEO if already Registered
  function mSuccess(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
          if(oRes.data.imei || oRes.data.status){
             //swal(oRes.message, "", "success");\
            $scope.$apply(function() {
              $scope.isAvailableIMEI = false;
              $scope.device.imei = '';
              $scope.msg1 = oRes.message;
            });
           }
          else{
              $scope.$apply(function() {
                $scope.isAvailableIMEI = true;
                $scope.msg2 = 'Device not Registered';
              });
            }
        }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }


  $scope.checkDeviceIMEI = function(viewValue) {
      $scope.imei = viewValue;
      if($scope.imei && $scope.device.toString().length == 15){
          var checkData = {};
          checkData.request = "device_by_imei";
          checkData.imei = $scope.device.imei;
          RegistrationService.checkRegisterIMEI(checkData, mSuccess);
      }
      /*else {
        swal("Please Enter 15 digit IMEI num");
      } */
    }
});