materialAdmin.service('playBackService', ['$rootScope', '$localStorage', 'socketio', function($rootScope, $localStorage, socketio) {
  this.getplayData = function(playData, response) {
    //var sReport = reportData;
    socketio.emit('message',playData);
    $rootScope.playCallback = response;
  };

}]);