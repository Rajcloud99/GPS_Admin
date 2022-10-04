materialAdmin.service('LoginService', ['$rootScope', '$localStorage', 'socketio', 'HTTPConnection', 'URL',function($rootScope, $localStorage, socketio, HTTPConnection, URL) {
	/*this.userLogin = function(loginData, response) {
		var sUser = loginData;
		socketio.emit('message',sUser);
		$rootScope.authenticationCallback = response;
		//socketio.on('message', response);
	};*/

	this.getSubUserV2     = getSubUserV2;

	function getSubUserV2(request, successCallback) {

		HTTPConnection.post(URL.GET_SUB_USER, request, onSuccess);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	this.getCurrentUser = function() {
		var curUser = {};
		angular.copy($localStorage.user, curUser);
		return curUser;
	};

	this.getSubUser = function(subUserData, response) {
		var sSubUser = subUserData;
		socketio.emit('message',sSubUser);
		$rootScope.subUserCallback = response;
	};
	this.getUser = function(userData, response) {
		socketio.emit('message',userData);
		$rootScope.getUserCallback = response;
	};

	this.getDevice = function(deviceData, response) {
		var sSubUser = deviceData;
		socketio.emit('message',sSubUser);
		$rootScope.deviceCallback = response;
	};
	this.getSheetDevice = function(deviceSdata, response) {
		var sSubUser = deviceSdata;
		socketio.emit('message',sSubUser);
		$rootScope.deviceListCallback = response;
	};
	this.downloadSheetService = function(sheetData, response) {
		//var sSubUser = sheetData;
		socketio.emit('message',sheetData);
		$rootScope.sheetDownloadCallback = response;
	};
	this.addGeozone = function(geozoneData, response) {
		socketio.emit('message',geozoneData);
		$rootScope.addGeozoneCallback = response;
		//socketio.on('message', response);
	};
	this.getGeozoneList = function(geozoneListData, response) {
		socketio.emit('message',geozoneListData);
		$rootScope.GeozoneListCallback = response;
	};

	this.getDeviceInfoService = function(deviceInfoData, response) {
		socketio.emit('message',deviceInfoData);
		$rootScope.deviceInfoDataCallback = response;
	};
	this.getDeviceConfigService = function(devConfigData, response) {
		socketio.emit('message',devConfigData);
		$rootScope.deviceConfigDataCallback = response;
	};

	this.getDetails = function(imeiData, response) {
		socketio.emit('message',imeiData);
		$rootScope.imeiCallback = response;
	};

	this.forgetPassword = function(mobile,response){
		if(mobile){
			var respS = {
				status : 'OK',
				message : "Your request submitted successfully, We'll get back to you soon"
			}
		 response(respS);
		}else{
			var respF = {
				status : 'Error',
				message : "Somthing went wrong. please try again"
			}
			response(respF);
		}
	};

	this.changePassword = function(changeData, response) {
		socketio.emit('message',changeData);
		$rootScope.changePassCallback = response;
	};
	this.updateUserProfile = function(updateUser, response) {
		socketio.emit('message',updateUser);
		$rootScope.updateUserCallback = response;
	};

	this.getUserMISPreferences = function (requestBody, responseHandler){
	    requestBody.request= "get_user_mis_pref";
        socketio.emit('message',requestBody);
        $rootScope.getUserMISPrefCallback = responseHandler;
    };

    this.updateUserMISPreferences = function (updateBody, responseHandler){
        updateBody.request = "update_user_mis_pref";
        socketio.emit('message',updateBody);
        $rootScope.updateUserMISPrefCallback = responseHandler;
    };

    this.getAllDevicesForAdmin = function(allDeviceData, response) {
		//var sSubUser = deviceData;
		console.log('sending '+JSON.stringify(allDeviceData));
		socketio.emit('message',allDeviceData);
		$rootScope.allDeviceAdminCallback = response;
	};

	this.getLastOnlineDevices = function(request, response) {
		//var sSubUser = deviceData;
		console.log('sending '+JSON.stringify(request));
		socketio.emit('message',request);
		$rootScope.lastOnlineDevicesCallback = response;
	};

	this.columnUpService = function(allColumn, response) {
		socketio.emit('message',allColumn);
		$rootScope.upColumnCallback = response;
	};
}]);
