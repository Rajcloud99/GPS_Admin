materialAdmin.service('reportService', ['$rootScope', '$localStorage', 'socketio', function($rootScope, $localStorage, socketio) {
  this.getReport = function(reportData, response) {
    var sReport = reportData;
    socketio.emit('message',sReport);
    $rootScope.reportCallback = response;
  };

  this.createAlerts = function(alertData, response) {
    //var sReport = reportData;
    socketio.emit('message',alertData);
    $rootScope.alertCallback = response;
  };

  this.getAllAlertsList = function(alertListData, response) {
    //var sReport = reportData;
    socketio.emit('message',alertListData);
    $rootScope.alertListCallback = response;
  };

  this.getAllNotifiList = function(notifiListData, response) {
    //var sReport = reportData;
    socketio.emit('message',notifiListData);
    $rootScope.notifiListCallback = response;
  };
  this.getCommand = function(commandData, response) {
    //var sReport = reportData;
    socketio.emit('message',commandData);
    $rootScope.commandCallback = response;
  };

  this.downloadReport = function(dReportData, response) {
    //var sReport = reportData;
    socketio.emit('message',dReportData);
    $rootScope.dReportCallback = response;
  };

  this.remoAlert = function(removeAlertData, response) {
    //var sReport = reportData;
    socketio.emit('message',removeAlertData);
    $rootScope.removeAlertCallback = response;
  };

  this.updateAlert = function(updateAlertData, response) {
    //var sReport = reportData;
    socketio.emit('message',updateAlertData);
    $rootScope.updateAlertCallback = response;
  };

  this.downloadListService = function(listDwnData, response) {
    socketio.emit('message',listDwnData);
    $rootScope.downLoadNotifiCallback = response;
  };

    this.getTripNoService = function(tripNoData, response) {
        socketio.emit('message',tripNoData);
        $rootScope.tripNoCallback = response;
    };
    this.addAlarmSchedule = function(alarmData, response) {
        socketio.emit('message',alarmData);
        $rootScope.alarmSchecduleCallback = response;
    };
    this.getSchAlarm = function(getAlarmData, response) {
        socketio.emit('message',getAlarmData);
        $rootScope.getAlarmSchecduleCallback = response;
    };
    this.upAlarmOnServer = function(upAlarmData, response) {
        socketio.emit('message',upAlarmData);
        $rootScope.upAlarmOnServerCallback = response;
    };

}]);