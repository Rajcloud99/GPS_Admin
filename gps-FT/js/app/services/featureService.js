materialAdmin.service('FeatureService', ['$rootScope','socketio', function($rootScope,socketio) {
  this.getFeature = function(feature, response) {
    socketio.emit('message',feature);
    $rootScope.featureCallback = response;
  };
  
}]);