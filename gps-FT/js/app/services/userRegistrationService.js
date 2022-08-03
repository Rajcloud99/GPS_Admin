materialAdmin.service('RegistrationService', ['$rootScope', 'socketio','HTTPConnection',
  'URL', function($rootScope, socketio, HTTPConnection, URL) {

    this.addStudentParent     = addStudentParent;
    this.updateStudentParent  = updateStudentParent;
    this.getStudentParent     = getStudentParent;

    function addStudentParent(request, successCallback) {

      HTTPConnection.post(URL.ADD_PARENT_RFID, request, onSuccess);

      function onSuccess(data) {
        if(typeof successCallback === 'function')
          successCallback(data.data);
      }
    }

    function updateStudentParent(request, successCallback) {

      HTTPConnection.post(URL.UPDATE_PARENT_RFID, request, onSuccess);

      function onSuccess(data) {
        if(typeof successCallback === 'function')
          successCallback(data.data);
      }
    }

    function getStudentParent(request, successCallback) {

      HTTPConnection.post(URL.GET_PARENT_RFID, request, onSuccess, onFailure );

      function onFailure(data) {
        if(typeof failureCallback === 'function')
          failureCallback(data.data);
      }

      function onSuccess(data) {
        if(typeof successCallback === 'function')
          successCallback(data.data);
      }
    }

	this.registerUser = function(registrationData, response) {
		var sUser = registrationData;
		socketio.emit('message',sUser);
		$rootScope.registrationCallback = response;
	};

  this.registerDevice = function(deviceRegisData, response) {
    var sUser = deviceRegisData;
    socketio.emit('message',sUser);
    $rootScope.deviceRegisCallback = response;
  };

  this.getDevice = function(getDeviceData, response) {
    //var sUser = deviceRegisData;
    socketio.emit('message',getDeviceData);
    $rootScope.deviceTypeCallback = response;
  };

  this.deviceUpdate = function(deviceUpdateData, response) {
    var sUser = deviceUpdateData;
    socketio.emit('message',sUser);
    $rootScope.deviceUpdateCallback = response;
  };

  this.deviceAssociate = function(deviceAssociateData, response) {
    var sDevice = deviceAssociateData;
    socketio.emit('message',sDevice);
    $rootScope.deviceAssociateCallback = response;
  };

  this.editGeozones = function(gZoneUpdateData, response) {
    var sZone = gZoneUpdateData;
    socketio.emit('message',sZone);
    $rootScope.geozonesUpdateCallback = response;
  };

  this.checkRegisterUserId = function(checkData, response) {
    var sData = checkData;
    socketio.emit('message',sData);
    $rootScope.checkRegisterUserIdCallback = response;
  };

  this.checkRegisterIMEI = function(checkData, response) {
    var sData = checkData;
    socketio.emit('message',sData);
    $rootScope.imeiCallback =  response;
  };

  this.removeGeozones = function(gZoneRemoveData, response) {
    //var sZone = gZoneUpdateData;
    socketio.emit('message',gZoneRemoveData);
    $rootScope.geozonesRemoveCallback = response;
  };

  this.removeGPSGaadi = function(GPSRemoveData, response) {
    //var sZone = gZoneUpdateData;
    socketio.emit('message',GPSRemoveData);
    $rootScope.GPDDeviceRemoveCallback = response;
  };

  this.devicefromPull = function(selectedDev, response) {
    //var sZone = gZoneUpdateData;
    socketio.emit('message',selectedDev);
    $rootScope.selectedDevCallback = response;
  };
  
  this.removeSubUserD = function(subUserRemove, response) {
    //var sZone = gZoneUpdateData;
    socketio.emit('message',subUserRemove);
    $rootScope.subUserRemoveCallback = response;
  };

  this.malfunctionService = function(malfunctionData, response) {
    var malFunc = malfunctionData;
    socketio.emit('message',malFunc);
    $rootScope.malfunctionCallback = response;
  };

  this.getComplaints = function(getComplaintData, response) {
    socketio.emit('message',getComplaintData);
    $rootScope.complaintCallback = response;
  };

  this.updateComplaintService = function(updateComplaintData, response) {
    socketio.emit('message',updateComplaintData);
    $rootScope.updateComplaintCallback = response;
  };

  this.dwnComplaints = function(dwnComplaintsData, response) {
    socketio.emit('message',dwnComplaintsData);
    $rootScope.dwnComplaintCallback = response;
  };

  this.userUpdateByAdmin = function(userUpdateByAdminData, response) {
    socketio.emit('message',userUpdateByAdminData);
    $rootScope.updateUserCallback = response;
  };


}]);