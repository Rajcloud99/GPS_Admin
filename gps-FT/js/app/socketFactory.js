materialAdmin.factory('socketio', ['$rootScope', '$localStorage', '$sessionStorage', '$timeout', '$interval', '$remember', '$cookies', '$forget', '$remember', function ($rootScope, $localStorage, $sessionStorage, $timeout, $interval, $remember, $cookies, $forget, $remember) {
    var oConfig = getAppConfig();
    var BASE_URL = oConfig.base_url;

    var oSocketConfig = {
        'reconnection': true, 'reconnectionDelay': 5000, 'reconnectionDelayMax': 7000, 'reconnectionAttempts': 100,
        'timeout': 2000
    };
    var socket;
    /*if(socketio){
        socket = socketio;
  }*/
    // = io.connect(BASE_URL,oSocketConfig);
    var fileUploader;
    $rootScope.userLogin = function (loginForm) {
        if (loginForm.$valid) {
            $rootScope.loader = true;
            $timeout(function () {
                $rootScope.loader = false;
            }, 3000);
            socket = io.connect(BASE_URL, oSocketConfig);
            fileUploader = new SocketIOFileUpload(socket);
            var userData = {};
            userData.user_id = loginForm.user_id;
            /*var samplePass = $cookies.get(userData.user_id);
            if(samplePass){
              userData.password = samplePass;
            } else {
              userData.password = loginForm.password;
            }*/
            userData.password = loginForm.password;
            userData.request = 'authentication'
            if (loginForm.rememberMe) {
                var sampleP = $cookies.get(userData.user_id);
                if (sampleP) {
                    $forget(userData.user_id);
                }
                $remember(userData.user_id, userData.password);
            }
            var toEmitAuthData = JSON.stringify(userData);
            socket.emit('message', toEmitAuthData);
            socketResponse();
        } else {
            swal("Login Error", "User id and password are required for login", "error");
        }
    }

    $rootScope.getFileUploader = function () {
        return fileUploader;
    }

    /*$rootScope.sharedLocSocketConn = function(){
      socket = io.connect(BASE_URL,oSocketConfig);
      socketResponse();
    }*/


    $rootScope.logout = function () {
        socket.close();
        $localStorage.$reset();
        $sessionStorage.$reset();
        $localStorage.distributerInfo = $rootScope.distributerInfo;

        $rootScope.selectedUser = null;
        $rootScope.user = {};
        $rootScope.selectedDevice = null;
        $rootScope.redirect('#!/login');
    };

    $rootScope.reconnectRequest = function () {
        //stopTimer();
        //startTimer();
        if ((window.location) && (window.location.hash == "#!/main/map")) {
            if ($localStorage && $localStorage.onReconnectDevicesId && $localStorage.onLocalselectedUser && $localStorage.onReconnectDevicesId.length > 0) {
                for (var k = 0; k < $localStorage.onReconnectDevicesId.length; k++) {
                    var gMapOnReconnect = {};
                    gMapOnReconnect.request = "live_feedV2";
                    gMapOnReconnect.device_id = $localStorage.onReconnectDevicesId[k];
                    gMapOnReconnect.user_id = $localStorage.onLocalselectedUser.user_id;
                    gMapOnReconnect.login_uid = $localStorage.onLocalselectedUser.user_id;
                    gMapOnReconnect.token = $localStorage.user.token;
                    gMapOnReconnect = JSON.stringify(gMapOnReconnect);
                    socket.emit('message', gMapOnReconnect);
                }
            }
        } else if ((window.location) && (window.location.hash != "") && (window.location.hash != "#!/login")) {
            socket = io.connect(BASE_URL, oSocketConfig);
            fileUploader = new SocketIOFileUpload(socket);
            socketResponse();
        }
    };

    /*var timePromise;
    function startTimer() {
      $rootScope.timeCounter = 60;
      timePromise = $interval(function () {
        if($rootScope.timeCounter>0){
          $rootScope.timeCounter--;
        }
      }, 1000);
    }

    function stopTimer(){
      $rootScope.timeCounter = 0;
      $interval.cancel(timePromise);
    }*/

    function socketResponse() {
        socket.on("connect", function (args) {
            console.log("successful connection", args);
        });
        socket.on("connect_error", function (args) {
            console.log("connect_error", args);
        });
        socket.on("connect_timeout", function (args) {
            console.log("connect_timeout", args);
        });
        socket.on("reconnect", function (args) {
            //stopTimer();
            $rootScope.$apply(function () {
                $rootScope.reconnectDiv = false;
            });
            console.log("reconnect", args);
        });
        socket.on("reconnect_attempt", function (args) {
            /*if(args===1){
              startTimer();
            }else{
              stopTimer();
              startTimer();
            }*/
            $rootScope.$apply(function () {
                $rootScope.reconnectDiv = true;
            });
            console.log("reconnect_attempt", args);
        });
        socket.on("reconnecting", function (args) {
            console.log("reconnecting", args);
        });
        socket.on("reconnect_error", function (args) {
            console.log("reconnect_error", args);
        });
        socket.on("reconnect_failed", function (args) {
            console.log("reconnect_failed", args);
        });
        socket.on("disconnect", function (args) {
            //startTimer();

            console.log("disconnect", args);
        });
        socket.on("trip", function (args) {
            return $rootScope.handleTrips(args);
        });
        socket.on("message", function (args) {
            oRes = JSON.parse(args);
            if (oRes.status === "ERROR" && oRes.message === "not authorized") {
                console.log('not authorized: ' + JSON.stringify(oRes));
                swal(oRes.status, oRes.message, "error");
            } else if (oRes.status === "ERROR" && oRes.message === "not authenticated") {
                $localStorage.$reset();
                $sessionStorage.$reset();
                $rootScope.redirect('/#!/login');
            } else if (oRes.request === "authentication") {
                return $rootScope.authenticationCallback(args);
            } else if (oRes.request === "usrReg") {
                return $rootScope.registrationCallback(args);
            } else if (oRes.request === "live_feed") {
                return $rootScope.mapDataCallback(args);
            } else if (oRes.request === "live_feedV2") {
                return $rootScope.mapDataCallback(args);
            } else if (oRes.request === "stop_feed") {
                return $rootScope.mapStopCallback(args);
            } else if (oRes.request === "sub_users") {
                return $rootScope.subUserCallback(args);
            } else if (oRes.request === "register_device") {
                return $rootScope.deviceRegisCallback(args);
            } else if (oRes.request === "get_devide_types") {
                return $rootScope.deviceTypeCallback(args);
            } else if (oRes.request === "update_device") {
                return $rootScope.deviceUpdateCallback(args);
            } else if (oRes.request === "device_by_uid") {
                return $rootScope.deviceCallback(args);
            } else if (oRes.request === "gpsgaadi_by_uid_map_mongo") {
                return $rootScope.deviceCallback(args);
            } else if (oRes.request === "gpsgaadi_by_uid") {
                return $rootScope.deviceCallback(args);
            } else if (oRes.request === "gpsgaadi_by_uid_web") {
                return $rootScope.deviceCallback(args);
            } else if (oRes.request === "gpsgaadi_by_uid_list") {
                return $rootScope.deviceListCallback(args);
            } else if (oRes.request === "gpsgaadi_by_uid_mongo") {
                return $rootScope.deviceListCallback(args);
            } else if (oRes.request === "download_tracking_sheet") {
                return $rootScope.sheetDownloadCallback(args);
            } else if (oRes.request === "download_tracking_sheet_mongo") {
                return $rootScope.sheetDownloadCallback(args);
            } else if (oRes.request === "associate_device") {
                return $rootScope.deviceAssociateCallback(args);
            } else if (oRes.request === "report_parking") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "get_shared_locaion") {
                return $rootScope.mapDataCallback(args);
            } else if (oRes.request === "report_overspeed") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_driver_activity") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_acc") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_activity") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_ac") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_activity_interval") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_mileage") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "report_mileage2") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "add_geozone") {
                return $rootScope.addGeozoneCallback(args);
            } else if (oRes.request === "get_geozone") {
                return $rootScope.GeozoneListCallback(args);
            } else if (oRes.request === "get_landmark") {
                return $rootScope.landmarkListCallback(args);
            } else if (oRes.request === "get_nearest_landmark_for_point") {
                return $rootScope.getLandmarkForMultiLayerCallBack(args);
            } else if (oRes.request === "get_nearest_geofence_for_point") {
                return $rootScope.getGeoZoneForMultiLayerCallBack(args);
            } else if (oRes.request === "get_nearest_vehicle_for_point") {
                return $rootScope.getVehicleForMultiLayerCallBack(args);
            } else if (oRes.request === "add_landmark") {
                return $rootScope.addLandDataCallback(args);
            } else if (oRes.request === "update_landmark") {
                return $rootScope.updateLandDataCallback(args);
            } else if (oRes.request === "remove_landmark") {
                return $rootScope.removeLandDataCallback(args);
            } else if (oRes.request === "get_device_info") {
                return $rootScope.deviceInfoDataCallback(args);
            } else if (oRes.request === "get_device_config") {
                return $rootScope.deviceConfigDataCallback(args);
            } else if (oRes.request === "create_alarm") {
                return $rootScope.alertCallback(args);
            } else if (oRes.request === "get_alarm") {
                return $rootScope.alertListCallback(args);
            } else if (oRes.request === "get_notification") {
                return $rootScope.notifiListCallback(args);
            } else if (oRes.request === "update_geozone") {
                return $rootScope.geozonesUpdateCallback(args);
            } else if (oRes.request === "user_id_availability") {
                return $rootScope.checkRegisterUserIdCallback(args);
            } else if (oRes.request === "playback") {
                return $rootScope.playCallback(args);
            } else if (oRes.request === "commands") {
                return $rootScope.commandCallback(args);
            } else if (oRes.request === "remove_geozone") {
                return $rootScope.geozonesRemoveCallback(args);
            } else if (oRes.request === "remove_alarm") {
                return $rootScope.removeAlertCallback(args);
            } else if (oRes.request === "update_alarm") {
                return $rootScope.updateAlertCallback(args);
            } else if (oRes.request === "get_trips") {
                return $rootScope.tripListCallback(args);
            } else if (oRes.request === "download_report_parking") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_overspeed") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_driver_activity") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_driver_day_activity" || oRes.request === "download_vehicle_exceptions") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_trip") {
                return $rootScope.tReportCallback(args);
            } else if (oRes.request === "download_report_activity") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_acc") {

                return $rootScope.dReportCallback(args);
            } else if (oRes.request === "download_report_trip") {
                return $rootScope.dReportCallback(args);
            } else if (oRes.request === "download_report_mileage") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_mileage2") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_activity_interval") {
                return $rootScope.reportCallback(JSON.parse(args));
            } else if (oRes.request === "download_report_activity_trip") {
                return $rootScope.dReportCallback(args);
            } else if (oRes.request === "device_by_imei") {
                return $rootScope.imeiCallback(args);
            } else if (oRes.request === "add_vehicle") {
                return $rootScope.selectedDevCallback(args);
            } else if (oRes.request === "add_imei") {
                return $rootScope.selectedDevCallback(args);
            } else if (oRes.request === "remove_gpsgaadi") {
                return $rootScope.GPDDeviceRemoveCallback(args);
            } else if (oRes.request === "get_feature") {
                return $rootScope.featureCallback(args);
            } else if (oRes.request === "change_password") {
                return $rootScope.changePassCallback(args);
            } else if (oRes.request === "remove_sub_user") {
                return $rootScope.subUserRemoveCallback(args);
            } else if (oRes.request === "update_user") {
                return $rootScope.updateUserCallback(args);
            } else if (oRes.request === "create_trip") {
                return $rootScope.createdTripCallback(args);
            } else if (oRes.request === "remove_trip") {
                return $rootScope.removeTripCallback(args);
            } else if (oRes.request === "update_trip") {
                return $rootScope.UpdateTripCallback(args);
            } else if (oRes.request === "get_device_data") {
                return $rootScope.allDeviceAdminCallback(args);
            } else if (oRes.request === "last_online") {
                return $rootScope.lastOnlineDevicesCallback(args);
            } else if (oRes.request === "alerts") {
                console.log("New Alert");
                $rootScope.alertCount = $rootScope.alertCount || 0;
                if (Array.isArray(oRes.data)) {
                    $rootScope.alertCount += oRes.data.length;
                } else {
                    $rootScope.alertCount += 1;
                }
                $rootScope.$apply();
            } else if (oRes.request === "get_user_mis_pref") {
                return $rootScope.getUserMISPrefCallback(args);
            } else if (oRes.request === "update_user_mis_pref") {
                return $rootScope.updateUserMISPrefCallback(args);
            } else if (oRes.request === "create_malfunction") {
                return $rootScope.malfunctionCallback(args);
            } else if (oRes.request === "get_malfunction") {
                return $rootScope.complaintCallback(args);
            } else if (oRes.request === "update_malfunction") {
                return $rootScope.updateComplaintCallback(args);
            } else if (oRes.request === "download_report_malfunction") {
                return $rootScope.dwnComplaintCallback(args);
            } else if (oRes.request === "download_notification") {
                return $rootScope.downLoadNotifiCallback(args);
            } else if (oRes.request === "report_geofence_schedule") {
                return $rootScope.reportCallback(args);
            } else if (oRes.request === "download_report_geofence_schedule") {
                return $rootScope.dReportCallback(args);
            } else if (oRes.request === "update_feature") {
                return $rootScope.upColumnCallback(args);
            } else if (oRes.request === "get_vehicle_trips") {
                return $rootScope.tripNoCallback(args);
            } else if (oRes.request === "tracksheetData") {
                return $rootScope.storeTracksheetData(args);
            } else if (oRes.request === "create_alarm_schedule") {
                return $rootScope.alarmSchecduleCallback(args);
            } else if (oRes.request === "get_alarm_schedule") {
                return $rootScope.getAlarmSchecduleCallback(args);
            } else if (oRes.request === "update_alarm_schedule") {
                return $rootScope.upAlarmOnServerCallback(args);
            } else if (oRes.request === "tracksheetDataAck") {
                if (oRes.no_of_packet != $rootScope.storeTracksheetData.length) {
                    var sendDT = {};
                    sendDT.request = 'packetLost';
                    sendDT.received = $rootScope.storeTracksheetData.length;
                    //socketio.emit("message",sendDT);
                }
                return;
            }

        });
    }

    if ((window.location) && (window.location.hash != "") && (window.location.hash != "#!/login")) {
        socket = io.connect(BASE_URL, oSocketConfig);
        fileUploader = new SocketIOFileUpload(socket);
        socketResponse();
    }
    return {
        emit: function (eventName, data) {
            if (data.request === "authentication") {
                var toEmitAuthData = JSON.stringify(data);
                socket.emit(eventName, toEmitAuthData);
            } else {
                if ($localStorage) {
                    var reOuthData = data;
                    if ($localStorage.preservedSelectedUser) {
                        reOuthData.selected_uid = $localStorage.preservedSelectedUser.user_id;
                    }
                    if ($localStorage.user) {
                        reOuthData.login_uid = $localStorage.user.user_id;
                        reOuthData.token = $localStorage.user.token;
                        var toEmitData = JSON.stringify(reOuthData);
                        socket.emit(eventName, toEmitData);
                    } else if (reOuthData.request === "playback") {
                        var toSend = JSON.stringify(reOuthData);
                        socket.emit(eventName, toSend);
                    }
                    if (reOuthData.request === "get_shared_locaion") {
                        var toSend = JSON.stringify(reOuthData);
                        socket.emit(eventName, toSend);
                    }

                }
            }
        },

        socket: function () {
            return socket;
        },
        connectSocket: function (onSuccess, onFailure) {
            socket = io.connect(BASE_URL, oSocketConfig);
            fileUploader = new SocketIOFileUpload(socket);
            socketResponse();
            socket.on("connect", function (args) {
                onSuccess();
                console.log("successful connection", args);
            });
            socket.on("connect_error", function (args) {
                onFailure();
                console.log("connect_error", args);
            });
            socket.on("connect_timeout", function (args) {
                onFailure();
                console.log("connect_timeout", args);
            });
        }
    };
}]);
