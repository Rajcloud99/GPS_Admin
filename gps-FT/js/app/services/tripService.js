materialAdmin.service('TripService', ['$rootScope', '$localStorage', 'socketio', function($rootScope, $localStorage, socketio) {
  this.getAllTripsList = function(aTripListData, response) {
    socketio.emit('message',aTripListData);
    $rootScope.tripListCallback = response;
  };
  this.downloadReport = function(dReportData, response) {
    socketio.emit('message',dReportData);
    $rootScope.tReportCallback = response;
  };
  this.createTrip = function(tripData, response) {
    socketio.emit('message',tripData);
    $rootScope.createdTripCallback = response;
  };
  this.removeTripServ = function(tripData, response) {
    socketio.emit('message',tripData);
    $rootScope.removeTripCallback = response;
  };
  this.updateTrip = function(UpTripData, response) {
    socketio.emit('message',UpTripData);
    $rootScope.UpdateTripCallback = response;
  };

}]);