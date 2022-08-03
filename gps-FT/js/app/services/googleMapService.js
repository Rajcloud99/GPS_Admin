materialAdmin.service('GoogleMapService', ['$rootScope', 'socketio', function($rootScope,socketio) {
	this.getMap = function(data, response) {
		var sData = data;
		socketio.emit('message',sData);
		$rootScope.mapDataCallback = response;			
	};
    this.stopFeed = function(data, response) {
        var fData = data;
        socketio.emit('message',fData);
        $rootScope.mapStopCallback = response;      
    };

    this.getLandmarkList = function(landListData, response) {
        socketio.emit('message',landListData);
        $rootScope.landmarkListCallback = response;
    };

    this.getLandmarkForMultiLayer = function(landListData, response) {
        socketio.emit('message',landListData);
        $rootScope.getLandmarkForMultiLayerCallBack = response;
    };

    this.getGeozoneForMultiLayer = function(geoListData, response) {
        socketio.emit('message',geoListData);
        $rootScope.getGeoZoneForMultiLayerCallBack = response;
    };
    this.getVehicleForMultiLayer = function(vehicleListData, response) {
        socketio.emit('message',vehicleListData);
        $rootScope.getVehicleForMultiLayerCallBack = response;
    };

    this.addLandmark = function(addLandData, response) {
        socketio.emit('message',addLandData);
        $rootScope.addLandDataCallback = response;
    };
    this.removeLandmark = function(removeLandData, response) {
        socketio.emit('message',removeLandData);
        $rootScope.removeLandDataCallback = response;
    };
    this.editLandmarkService = function(updateLandData, response) {
        socketio.emit('message',updateLandData);
        $rootScope.updateLandDataCallback = response;
    };

}]);