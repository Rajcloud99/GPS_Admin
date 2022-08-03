materialAdmin.controller('commandCtrl', function ($rootScope,$localStorage,$stateParams,$uibModalInstance,$uibModal, $interval,$state,$scope,reportService) {
  
  if($rootScope.currentPath == '/main/ListView'){
    $rootScope.showSideBar = false;
  }else{
    $rootScope.showSideBar = true;
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  /*$scope.aCommandTypes = [
    {
      'name'  :'Get Location',
      'scope' :'location'
    },
    {
      'name'  :'Power Cut',
      'scope' :'power_cut'
    },
    {
      'name'  :'Restart',
      'scope' :'restart'
    },
    {
      'name'  :'Version',
      'scope' :'version'
    },
    {
      'name'  :'Status',
      'scope' :'status'
    },
    {
      'name'  :'Equip_dir_param',
      'scope' :'equip_dir_param'
    },
    {
      'name'  :'Gps_param_query',
      'scope' :'gps_param_query'
    },
    {
      'name'  :'Petrol Cut',
      'scope' :'petrol_cut'
    },
    {
      'name'  :'Petrol Restore',
      'scope' :'petrol_restore'
    }
  ];*/
  $scope.aCommandTypes = $localStorage.deviceInfo.commands;

  if($localStorage.deviceConfig && $localStorage.deviceConfig.length>0){
    for(var c=0;c<$localStorage.deviceConfig.length;c++){
      if($localStorage.deviceConfig[c].key == $scope.commDevice.device_type){
        $scope.selDeviceCommand = $localStorage.deviceConfig[c].value.commands;
      }
    }
  };
  $scope.aFilterCommandTypes = [];
  if($scope.selDeviceCommand){
    for (var k in $scope.selDeviceCommand) {
      if ($scope.selDeviceCommand[k] == true) {
        for(var s in $localStorage.deviceInfo.commands){
          if(s == k){
            $localStorage.deviceInfo.commands[s].title = s;
            $scope.aFilterCommandTypes.push($localStorage.deviceInfo.commands[s]);
          }
        }
      }
    }
  }
  function commandResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        $rootScope.commandShowData = oRes;
        $uibModalInstance.dismiss('cancel');
        var modalInstance = $uibModal.open({
          templateUrl : 'views/command/commData-pop.html',
          controller : 'commDataCtrl'
        });
      }
      else if(oRes.status == 'ERROR'){
        //swal(oRes.message, "", "error");
      }
    }
  };

  $scope.commandF = function (commandForm) {
    if($scope.commandType.param == false){
      var commData = {};
      commData.request = 'commands';
      commData.command_type = $scope.commandType.title;
      //commData.param = $scope.commandType;
      commData.device_id = $scope.commDevice.imei;
      commData.request_id = 1;
      commData.device_type = $scope.commDevice.device_type;

      reportService.getCommand(commData,commandResponse);
    }else{
      $rootScope.commandParamData = $scope.commandType;
      $uibModalInstance.dismiss('cancel');
      var modalInstance = $uibModal.open({
        templateUrl : 'views/command/commParamData-pop.html',
        controller : 'commParamDataCtrl'
      });
    }
  };

});

materialAdmin.controller('commDataCtrl', function ($rootScope,$localStorage,$stateParams,$uibModalInstance, $interval,$state,$scope) {
  if($rootScope.currentPath == '/main/ListView'){
    $rootScope.showSideBar = false;
  }else{
    $rootScope.showSideBar = true;
  }
  $scope.commandResponse = $rootScope.commandShowData;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  if($scope.commandResponse && $scope.commandResponse.data && $scope.commandResponse.data.datetime){
    $scope.commandResponse.data.datetime = moment($scope.commandResponse.data.datetime).format('LLL')
  }

  /********************** reverse geocoding google server *****************************/
    if($scope.commandResponse && $scope.commandResponse.data && $scope.commandResponse.data.lat){
        var index = $scope.commandResponse.data;
        var geocoder;
        geocoder = new google.maps.Geocoder();
        if(index.lat && index.lng){
          var lat = index.lat;
          var lng = index.lng;
        }else{
          var lat = index.lat;
          var lng = index.lng;
        }
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK){
              if (results[0]){
                $scope.$apply(function() {
                  index.formatedAddr = results[0].formatted_address;
                  $scope.commandResponse.data.address = index.formatedAddr;
                });
              }else{
                $scope.$apply(function() {
                  index.formatedAddr = 'NA';
                  $scope.commandResponse.data.address = 'NA';
                });
              }
            }else{
              $scope.commandResponse.data.address = 'NA';
            }
        });
    }

  /********************** reverse geocoding google server *****************************/
  

});

materialAdmin.controller('commParamDataCtrl', function ($rootScope,$localStorage,$stateParams,$uibModal,$uibModalInstance, $interval,$state,$scope,reportService) {
  if($rootScope.currentPath == '/main/ListView'){
    $rootScope.showSideBar = false;
  }else{
    $rootScope.showSideBar = true;
  }
  //$scope.commandResponse = $rootScope.commandParamData;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  function commandParamResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        $rootScope.commandShowParamData = oRes;
        $uibModalInstance.dismiss('cancel');
        var modalInstance = $uibModal.open({
          templateUrl : 'views/command/command-param-response.html',
          controller : 'commParamDataRespCtrl'
        });
      }
      else if(oRes.status == 'ERROR'){
        //swal(oRes.message, "", "error");
      }
    }
  };

  $scope.commandFparam = function (commandParamForm) {
    var commPrmData = {};
    commPrmData.request = 'commands';
    commPrmData.command_type = $scope.commandParamData.title;
    commPrmData.param = $scope.param_value;
    commPrmData.device_id = $scope.commDevice.imei;
    commPrmData.request_id = 1;
    commPrmData.device_type = $scope.commDevice.device_type;

    reportService.getCommand(commPrmData,commandParamResponse);
  };

});

materialAdmin.controller('commParamDataRespCtrl', function ($rootScope,$localStorage,$stateParams,$uibModalInstance, $interval,$state,$scope) {
  if($rootScope.currentPath == '/main/ListView'){
    $rootScope.showSideBar = false;
  }else{
    $rootScope.showSideBar = true;
  }
  $scope.commandParamRespFinalData = $rootScope.commandShowParamData;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  if($scope.commandParamRespFinalData && $scope.commandParamRespFinalData.data && $scope.commandParamRespFinalData.data.datetime){
    $scope.commandParamRespFinalData.data.datetime = moment($scope.commandParamRespFinalData.data.datetime).format('LLL')
  }

  /********************** reverse geocoding google server *****************************/
    if($scope.commandParamRespFinalData && $scope.commandParamRespFinalData.data && $scope.commandParamRespFinalData.data.lat){
        var index = $scope.commandParamRespFinalData.data;
        var geocoder;
        geocoder = new google.maps.Geocoder();
        if(index.lat && index.lng){
          var lat = index.lat;
          var lng = index.lng;
        }else{
          var lat = index.lat;
          var lng = index.lng;
        }
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK){
              if (results[0]){
                $scope.$apply(function() {
                  index.formatedAddr = results[0].formatted_address;
                  $scope.commandParamRespFinalData.data.address = index.formatedAddr;
                });
              }else{
                $scope.$apply(function() {
                  index.formatedAddr = 'NA';
                  $scope.commandParamRespFinalData.data.address = 'NA';
                });
              }
            }else{
              $scope.commandParamRespFinalData.data.address = 'NA';
            }
        });
    }

  /********************** reverse geocoding google server *****************************/
  

});