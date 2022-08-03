materialAdmin.controller("alertCtrl", function ($rootScope, $scope, $localStorage, $uibModal, reportService) {
    $rootScope.showSideBar = false;
    $scope.aAlerts = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }
    if ($rootScope.dataForGeofence) {
        $rootScope.dataForGeofence = '';
    }
    $scope.bAllAlertTypes = ['All Alerts', 'Geofence Alert', 'Overspeed Alert', 'Halt Alert'];
    $scope.sAllAlertTypes = ['All Alerts', 'Active', 'Inactive'];
    $scope.bVehicle = $localStorage.preservedSelectedUser.devices;
    $scope.createAlert = function () {
        $rootScope.redirect('/#!/main/createAlert');
    };

    //****** alert list get function **********//
    $scope.onSelect = function ($item, $model, $label) {
        $scope.imei = $model.imei;
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllAlerts();
    };
    $scope.removeVeh = function (vehicleName) {
        if (vehicleName.length < 1) {
            $scope.imei = '';
            $scope.getAllAlerts();
            console.log('1stRefersh');
        }
    };
    var statusToFilter;
    $scope.getStatus = function (states) {
        if (states === "Active") {
            statusToFilter = 1;
        } else if (states === "Inactive") {
            statusToFilter = 0;
        } else {
            statusToFilter = null;
        }
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllAlerts();
    }


    $scope.getAlertType = function (selectedType) {
        if (selectedType === "Geofence Alert") {
            $scope.selectedType = 'geofence';
        } else if (selectedType === "Overspeed Alert") {
            $scope.selectedType = 'over_speed';
        } else if (selectedType === "Halt Alert") {
            $scope.selectedType = 'halt';
        } else {
            $scope.selectedType = '';
        }
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllAlerts();
    }

    $rootScope.getAllAlerts = function () {
        function geoListResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.$apply(function () {
                        for (var i = 0; i < oRes.data.length; i++) {
                            if (oRes.data[i].enabled === 1) {
                                oRes.data[i].enabled = true;
                            } else {
                                oRes.data[i].enabled = false;
                            }
                        }
                        $scope.aAlerts = oRes.data;

                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 13;
                            }
                        }
                    });
                } else if (oRes.status === 'ERROR') {
                    //swal(oRes.message, "", "error");
                }
            }
        };

        var getAlist = {};
        getAlist.login_uid = $localStorage.user.user_id;
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNoAlt > 0) {
                getAlist.pageState = $scope.aPageState[$rootScope.getPageNoAlt];
            }
        }
        getAlist.row_count = 13;
        getAlist.request = 'get_alarm';
        getAlist.atype = '';
        if ($scope.imei) {
            getAlist.imei = $scope.imei;
        }
        if ($scope.selectedType) {
            getAlist.atype = $scope.selectedType;
        }
        if ((statusToFilter === 1) || (statusToFilter === 0)) {
            getAlist.enabled = statusToFilter;
        }
        console.log('Request');
        reportService.getAllAlertsList(getAlist, geoListResponse);
    }

    $rootScope.getAllAlerts();   //****call alert list function

    //****** alert list get function **********//
    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $rootScope.getPageNoAlt = $scope.bigCurrentPage - 1;
        $scope.getAllAlerts();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aAlerts.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    $scope.removeAlert = function (alert) {
        $rootScope.alert = alert;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/alert/remove-alert.html',
            controller: 'removeAlertCtrl'
        });
    };

    //*******update alert full start ******************/
    $rootScope.updateFullAlert = {};
    $rootScope.updateFullAlert.update_alert = false;
    $scope.updateAlertFull = function (alert) {
        if (alert.enabled === true) {
            alert.enabled = 1;
        } else {
            alert.enabled = 0;
        }
        $rootScope.updateFullAlert = alert;
        $rootScope.updateFullAlert.update_alert = true;
        console.log($rootScope.updateFullAlert);
    };
    //*******update alert full end ******************/

    //*******update alert toggle start ******************/
    function updateAlertRes(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status === 'OK') {
                swal(oRes.message, "", "success");
            } else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    };

    $scope.updateAlertToggle = function (alert) {
        var uAlert = {};
        uAlert.request = "update_alarm",
            uAlert.aid = alert.aid;
        uAlert.created_at = alert.created_at;
        uAlert.atype = alert.atype;
        if (alert.enabled === true) {
            uAlert.enabled = 1;
        } else {
            uAlert.enabled = 0;
        }
        uAlert.selected_uid = $rootScope.selectedUser.user_id;
        reportService.updateAlert(uAlert, updateAlertRes);
    };
    //*******update alert toggle end ******************/
    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

});

materialAdmin.controller("createAlertCtrl", function ($rootScope, $scope, $localStorage, $uibModal, DateUtils, LoginService, reportService) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    $scope.updateShow = {};
    $scope.updateShow.update_alert = false;
    $scope.todayDate = new Date();

    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }

    if($rootScope.updateFullAlert){
        $scope.sDestination = $rootScope.updateFullAlert.dest_id;
    }

    $scope.aCategory = [
        {
            'name': 'Alert',
            'scope': 'alert'
        },
        {
            'name': 'Loading',
            'scope': 'loading'
        },
        {
            'name': 'Unloading',
            'scope': 'unloading'
        }
    ];

    //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions1 = {
        formatYear: 'yy',
        //minDate: new Date(),
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //********************//**********************//*****************//


    if ($localStorage && $localStorage.user) {
        $scope.userDevices = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;
        var userMob = parseInt($localStorage.user.mobile);
        var userEmail = $localStorage.user.email;
    }
    if ($scope.userDevices && $scope.userDevices.length > 0) {
        for (var i = 0; i < $scope.userDevices.length; i++) {
            $scope.userDevices[i].selected = false;
        }
    }

    var dateForOperation = moment();
    $scope.dateTimeStart = dateForOperation._d;
    $scope.dateTimeEnd = dateForOperation.clone().add(10, 'days')._d;
    $scope.lst = [];
    $scope.change = function (deviceR, selTruck) {
        if (selTruck) {
            deviceR.selected = true;
            $scope.lst.push(deviceR);
        } else {
            deviceR.selected = false;
            $scope.lst.splice($scope.lst.indexOf(deviceR), 1);
        }
    };
    $scope.removeDeviceArr = function (sList) {
        //$scope.lst.splice($scope.lst.indexOf(sList), 1);
        $scope.change(sList, false);
    };

    $scope.mobLst = [userMob];
    $scope.tenDigit = false;
    $scope.mobChange = function (mobNom, addOrRemove) {
        if (mobNom) {
            if (addOrRemove) {
                var str = mobNom;
                var temp = new Array();
                // this will return an array with strings "1", "2", etc.
                temp = str.split(",");
                for (var n = 0; n < temp.length; n++) {
                    if (temp[n]) {
                        $scope.mobLst.push(parseInt(temp[n]));
                    }
                }
                //$scope.mobLst.push(mobNom);
                $scope.mob = null;
                $scope.tenDigit = false;
                //$scope.$apply(function() {
                $scope.mobLst;
                //});
            } else {
                $scope.mobLst.splice($scope.mobLst.indexOf(mobNom), 1);
                $scope.emailFalse = false
            }
        } else {
            $scope.tenDigit = true;
        }
    };
    if (userEmail) {
        $scope.emailLst = [userEmail];
    } else {
        $scope.emailLst = [];
    }
    $scope.emailFalse = false;
    $scope.emailChange = function (email, addOrRemove) {
        if (email) {
            if (addOrRemove) {
                var str = email;
                var temp = new Array();
                // this will return an array with strings "1", "2", etc.
                temp = str.split(",");
                for (var m = 0; m < temp.length; m++) {
                    if (temp[m]) {
                        $scope.emailLst.push(temp[m]);
                    }
                }
                //$scope.emailLst.push(email);
                $scope.mulEmail = null;
                $scope.emailFalse = false
            } else {
                $scope.emailLst.splice($scope.emailLst.indexOf(email), 1);
                $scope.emailFalse = false
            }
        } else {
            $scope.emailFalse = true;
        }
    };

    // default schedule start here ..........

    $scope.aHoursss = [];
    for (var h = 0; h < 24; h++) {
        $scope.aHoursss[h] = h;
    }
    $scope.aMinutes = [];
    for (var m = 0; m < 60; m++) {
        $scope.aMinutes[m] = m;
    }

    $scope.defaultTimes = [];



    $scope.addNew = function (personalDetail) {
        if ($scope.defaultTimes && $scope.defaultTimes.length <= 3) {
            $scope.defaultTimes.push({
                'hourSel1': '',
                'minuteSel1': '',
                'hourSel2': '',
                'minuteSel2': '',
                'msg': ''
            });
        } else {
            swal('warning', 'You can add only 4 schedule.', 'warning');
        }
    };

    $scope.remove = function () {
        var newDataList = [];
        $scope.selectedAll = false;
        angular.forEach($scope.defaultTimes, function (selected) {
            if (!selected.selected) {
                newDataList.push(selected);
            }
        });
        $scope.defaultTimes = newDataList;
    };

    $scope.defaultValidationTime = function (time, index) {
        if ($scope.defaultTimes[index].hourSel1 && $scope.defaultTimes[index].hourSel2) {
            if ($scope.defaultTimes[index].hourSel1 > $scope.defaultTimes[index].hourSel2) {
                swal('Warning', 'select less then first selected hour.', 'warning');
                $scope.defaultTimes[index].hourSel1 = 0;
            } else {
                if ($scope.defaultTimes[index].hourSel1 === $scope.defaultTimes[index].hourSel2) {
                    if ($scope.defaultTimes[index].minuteSel1 && $scope.defaultTimes[index].minuteSel2) {
                        if ($scope.defaultTimes[index].minuteSel1 > $scope.defaultTimes[index].minuteSel2) {
                            swal('Warning', 'select less then first selected minute.', 'warning');
                            $scope.defaultTimes[index].minuteSel1 = 0;
                        }
                    }
                }
            }
        }
    };
    $scope.searchGet = false;
    $scope.searchAlarmRange = function () {
        $scope.searchGet = true;
        $rootScope.getScheduledAlarm();
    };

    $scope.checkClick = function (ckData, index) {
        console.log(ckData);
        $scope.dateStart = moment(ckData.start).format('DD-MM-YYYY');
    };
    // default schedule end here ........

    //***** alrm calender code here ........
    $scope.addAlarmPopup = function () {
        $rootScope.upAlertData = $scope.updateAlertItem;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/alert/addNewAlarmPopup.html',
            controller: 'alarmPopupCtrl'
        });
    };

    //******** alarm calender code end here .......

    $scope.aAlertTypes = [
        {
            'name': 'Geofence Alert',
            'scope': 'geofence'
        },
        {
            'name': 'Overspeed Alert',
            'scope': 'over_speed'
        },
        {
            'name': 'Halt Alert',
            'scope': 'halt'
        }
    ];

    $scope.checkAll = function () {
        $scope.lst = [];
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.userDevices, function (deviceR) {
            deviceR.selected = $scope.selectedAll;
            if (deviceR.selected === true) {
                $scope.lst.push(deviceR);
            } else {
                $scope.lst.splice($scope.lst.indexOf(deviceR), 1);
            }
        });
    };

    //********get geozone on condition ***********//
    $scope.getGeoZone = function () {
        function geoListResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.$apply(function () {
                        $scope.aAllGeoZones = oRes.data;
                        if ($rootScope.updateFullAlert && $rootScope.updateFullAlert.update_alert) {
                            for (var j = 0; j < $scope.aAllGeoZones.length; j++) {
                                if ($scope.aAllGeoZones[j].gid === $scope.updateAlertItem.gid) {
                                    $scope.sGeozone = $scope.aAllGeoZones[j];
                                }
                            }
                            if ($rootScope.updateFullAlert.entry === 1) {
                                $scope.entry = true;
                            } else {
                                $scope.entry = false;
                            }
                            if ($rootScope.updateFullAlert.exit === 1) {
                                $scope.exit = true;
                            } else {
                                $scope.exit = false;
                            }
                            /*if($rootScope.updateFullAlert.atype == 'geofence'){
                                for(var k=0; k<$scope.aCategory.length;k++){
                                    if($scope.aCategory[k].scope == $rootScope.updateFullAlert.category){
                                        $scope.category = $scope.aCategory[k];
                                    }
                                }
                            }*/
                        } else if ($rootScope.alertGeo) {
                            for (var j = 0; j < $scope.aAllGeoZones.length; j++) {
                                if ($scope.aAllGeoZones[j].gid === $scope.alertGeo.gid) {
                                    $scope.sGeozone = $scope.aAllGeoZones[j];
                                }
                            }
                        }
                        ;
                    });
                } else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        var getGeoList = {};
        getGeoList.login_uid = $localStorage.user.user_id;
        getGeoList.request = 'get_geozone';
        getGeoList.token = $localStorage.user.token;
        LoginService.getGeozoneList(getGeoList, geoListResponse);
    };

    $scope.showGeoList = false;
    $scope.showOverSpeed = false;
    $scope.showHalt = false;

    $scope.determineAction = function (item) {
        console.log(item);
        if (item === "geofence") {
            $scope.showGeoList = true;
            $scope.showOverSpeed = false;
            $scope.showHalt = false;
            $scope.category = 'alert';
            $scope.entry_msg = 'Enter Into Geofence.';
            $scope.exit_msg = 'Exit From Geofence.';
            $scope.getGeoZone();   //****call geo list function
        } else if (item === "over_speed") {
            console.log("over_speed selected");
            $scope.showGeoList = false;
            $scope.showOverSpeed = true;
            $scope.showHalt = false;
        } else if (item === "halt") {
            console.log("halt selected");
            $scope.showGeoList = false;
            $scope.showOverSpeed = false;
            $scope.showHalt = true;
        } else {
            console.log("not defined");
            $scope.showGeoList = false;
            $scope.showOverSpeed = false;
            $scope.showHalt = false;
        }
    };

    $scope.aMins = [];
    for (var m = 0; m <= 59; m++) {
        $scope.aMins[m] = {};
        $scope.aMins[m].name = m + ' min';
        $scope.aMins[m].scope = m;
    }

    $scope.aHours = [];
    for (var h = 0; h < 22; h++) {
        $scope.aHours[h] = {};
        $scope.aHours[h].name = 1 + h + ' hour';
        $scope.aHours[h].scope = 1 + h;
    }

    $scope.sHour = 1;
    $scope.sMin = 0;

    $scope.changeAhrs = function () {
        if ($scope.sHour < 1) {
            swal("Please select minimum 1 hours.", "", "error");
            $scope.sHour = 1;
        }
    };

    $scope.changeCategory = function (cat) {
        if (cat === 'alert') {
            $scope.entry_msg = 'Enter Into Geofence.';
            $scope.exit_msg = 'Exit From Geofence.';
        } else if (cat === 'loading') {
            $scope.entry_msg = 'Wait For Loading.';
            $scope.exit_msg = 'Loaded';
        } else if (cat === 'unloading') {
            $scope.entry_msg = 'Wait For Unloading.';
            $scope.exit_msg = 'Unloaded';
        }
    };

    function alertResponse(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status === 'OK') {
                swal(oRes.message, "", "success");
                $rootScope.redirect('/#!/main/alertList');

                //$uibModalInstance.dismiss('cancel');
            } else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "warning");
            }
        }
    }

    $scope.createA = function () {
        $rootScope.alertData = [];
        if ($scope.lst && $scope.lst.length) {
            for (var i = 0; i < $scope.lst.length; i++) {
                var oAlert = {};
                oAlert.request = 'create_alarm';
                oAlert.login_uid = $localStorage.user.user_id;
                oAlert.atype = $scope.alertType;
                if (oAlert.atype === 'geofence') {
                    oAlert.start_time = $scope.dateTimeStart;
                    oAlert.end_time = $scope.dateTimeEnd;
                    oAlert.category = $scope.category;
                    oAlert.entry_msg = $scope.entry_msg;
                    oAlert.exit_msg = $scope.exit_msg;

                    if ($scope.entry === true) {
                        oAlert.entry = 1;
                    } else {
                        oAlert.entry = 0;
                    }
                    if ($scope.exit === true) {
                        oAlert.exit = 1;
                    } else {
                        oAlert.exit = 0;
                    }

                    //***********************
                    if ($scope.defaultTimes && $scope.defaultTimes.length > 0) {
                        oAlert.schedules = [];
                        for (var t = 0; t < $scope.defaultTimes.length; t++) {
                            //**** custom time add with date ******//

                            oAlert.schedules[t] = {};
                            var xx = $scope.todayDate;
                            xx.setHours($scope.defaultTimes[t].hourSel1);
                            xx.setMinutes($scope.defaultTimes[t].minuteSel1);
                            xx.setMilliseconds(00);
                            oAlert.schedules[t].start = angular.copy(xx);
                            var yy = $scope.todayDate;
                            yy.setHours($scope.defaultTimes[t].hourSel2);
                            yy.setMinutes($scope.defaultTimes[t].minuteSel2);
                            yy.setMilliseconds(00);
                            oAlert.schedules[t].end = angular.copy(yy);

                            oAlert.schedules[t].msg = $scope.defaultTimes[t].msg;

                            //**** custom time add with date ******//
                        }
                    }
                    //***********************

                    oAlert.gid = $scope.sGeozone.gid;
                    if($scope.sDestination)
                        oAlert.dest_id = $scope.sDestination;
                }
                if (oAlert.atype === 'over_speed') {
                    oAlert.over_speed = $scope.over_speed;
                    oAlert.name = $scope.over_speed_name;
                    oAlert.description = $scope.over_speed_description;
                }
                if (oAlert.atype === 'halt') {
                    $scope.minTime = $scope.sMin + ($scope.sHour * 60);
                    oAlert.halt_duration = $scope.minTime;
                }
                if ($scope.mobLst && ($scope.mobLst.length > 0)) {
                    oAlert.mobiles = $scope.mobLst;
                }
                if ($scope.emailLst && ($scope.emailLst.length > 0)) {
                    oAlert.emails = $scope.emailLst;
                }
                oAlert.driver_name = $scope.lst[i].driver_name || 'NA';
                oAlert.vehicle_no = $scope.lst[i].reg_no;
                oAlert.imei = $scope.lst[i].imei;

                reportService.createAlerts(oAlert, alertResponse);
            }
        } else {
            swal("Select atleast one truck!!!", "", "error");
        }
    };

    //******* update alert fun. start *************/
    if ($rootScope.updateFullAlert && $rootScope.updateFullAlert.update_alert) {
        $scope.updateAlertItem = $rootScope.updateFullAlert;

        // Assign category to its value ...
        if ($scope.aCategory && $scope.aCategory.length > 0) {
            for (var x = 0; x < $scope.aCategory.length; x++) {
                if ($scope.aCategory[x].scope === $rootScope.updateFullAlert.category) {
                    $scope.category = $scope.aCategory[x].scope;
                }
            }
        }
        //*********************
        $scope.updateShow = $rootScope.updateFullAlert;
        $scope.alertType = $scope.updateAlertItem.atype;
        $scope.getGeoZone();
        if ($scope.alertType === 'geofence') {
            $scope.showOverSpeed = false;
            $scope.showGeoList = true;
            $scope.showHalt = false;

            //*************************
            if ($scope.updateAlertItem && $scope.updateAlertItem.schedules && $scope.updateAlertItem.schedules.length > 0) {
                $scope.defaultTimes = [];
                for (var t = 0; t < $scope.updateAlertItem.schedules.length; t++) {
                    //**** custom time add with date ******//

                    $scope.defaultTimes[t] = {};

                    var sDT = new Date($scope.updateAlertItem.schedules[t].start);
                    $scope.defaultTimes[t].hourSel1 = sDT.getHours();
                    $scope.defaultTimes[t].minuteSel1 = sDT.getMinutes();

                    var eDT = new Date($scope.updateAlertItem.schedules[t].end);
                    $scope.defaultTimes[t].hourSel2 = eDT.getHours();
                    $scope.defaultTimes[t].minuteSel2 = eDT.getMinutes();

                    $scope.defaultTimes[t].msg = $scope.updateAlertItem.schedules[t].msg;
                }
            }
            //**********************
            $scope.dateTimeStart = moment($scope.updateAlertItem.start_time).format('LLL');
            $scope.dateTimeEnd = moment($scope.updateAlertItem.end_time).format('LLL');

            $rootScope.getScheduledAlarm = function () {
                function alarmListResponse(response) {
                    var oRes = JSON.parse(response);
                    if (oRes) {
                        if (oRes.status === 'OK') {
                            $scope.aScheduledAlarm = oRes.data;
                            for (var s = 0; s < $scope.aScheduledAlarm.length; s++) {
                                if ($scope.aScheduledAlarm[s].schedules && $scope.aScheduledAlarm[s].schedules.length > 0) {
                                    for (var a = 0; a < $scope.aScheduledAlarm[s].schedules.length; a++) {
                                        //**** custom time add with date ******//

                                        //$scope.defaultTimes[t] = {};

                                        var sDT = new Date($scope.aScheduledAlarm[s].schedules[a].start);
                                        $scope.aScheduledAlarm[s].schedules[a].hourSel1 = sDT.getHours();
                                        $scope.aScheduledAlarm[s].schedules[a].minuteSel1 = sDT.getMinutes();

                                        var eDT = new Date($scope.aScheduledAlarm[s].schedules[a].end);
                                        $scope.aScheduledAlarm[s].schedules[a].hourSel2 = eDT.getHours();
                                        $scope.aScheduledAlarm[s].schedules[a].minuteSel2 = eDT.getMinutes();

                                        //$scope.aScheduledAlarm[s].schedules[a].msg = $scope.aScheduledAlarm[s].schedules[a].msg;
                                    }
                                }
                            }
                            $scope.$apply(function () {
                                $scope.aScheduledAlarm;
                            });
                        } else if (oRes.status === 'ERROR') {
                            //swal(oRes.message, "", "error");
                        }
                    }
                };

                var getAlarm = {};
                getAlarm.request = 'get_alarm_schedule';
                getAlarm.alm_created_at = $scope.updateAlertItem.created_at;
                getAlarm.selected_uid = $scope.updateAlertItem.user_id;
                if ($scope.searchGet === true) {
                    getAlarm.date = $scope.date;
                    getAlarm.end_date = $scope.end_date;
                    $scope.searchGet === false;
                }
                reportService.getSchAlarm(getAlarm, alarmListResponse);
            }

            $rootScope.getScheduledAlarm();   //**** call Schedule alert under update alert

            $scope.updateCallServer = function (upDT) {
                if (upDT && upDT.schedules.length > 0) {

                    function removeRes(response) {
                        var oRes = JSON.parse(response);
                        if (oRes) {
                            if (oRes.status === 'OK') {
                                swal(oRes.message, "", "success");
                            } else if (oRes.status === 'ERROR') {
                                //swal(oRes.message, "", "error");
                            }
                        }
                    };

                    var upSchAlarm = {};
                    upSchAlarm.request = "update_alarm_schedule";
                    upSchAlarm.alm_created_at = $scope.updateAlertItem.created_at;
                    upSchAlarm.user_id = $scope.updateAlertItem.user_id;
                    upSchAlarm.date = upDT.date;
                    upSchAlarm.schedules = upDT.schedules;
                    reportService.upAlarmOnServer(upSchAlarm, removeRes);
                }
            };

            $scope.removeCalAlarm = function (upData, index) {
                var newDataList = [];
                var newDataList2 = [];
                $scope.selectedAll = false;
                if ($scope.aScheduledAlarm[index]) {
                    angular.forEach($scope.aScheduledAlarm[index].schedules, function (selected) {
                        if (!selected.selected) {
                            newDataList.push(selected);
                        } else {
                            newDataList2.push(selected);
                        }
                    });
                    $scope.aScheduledAlarm[index].schedules = newDataList;
                    $scope.updateCallServer($scope.aScheduledAlarm[index]);
                }
            };

        } else if ($scope.alertType === 'over_speed') {
            $scope.showGeoList = false;
            $scope.showOverSpeed = true;
            $scope.showHalt = false;
            $scope.over_speed = $scope.updateAlertItem.over_speed;
            $scope.over_speed_name = $scope.updateAlertItem.name;
            $scope.over_speed_description = $scope.updateAlertItem.description;
        } else if ($scope.alertType === 'halt') {
            $scope.showGeoList = false;
            $scope.showOverSpeed = false;
            $scope.showHalt = true;

        }
        $scope.mobLst = $scope.updateAlertItem.mobiles || [];
        $scope.emailLst = $scope.updateAlertItem.emails || [];
        $scope.reg_no = $scope.updateAlertItem.vehicle_no;
    }

    function updateFullAlertRes(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status === 'OK') {
                swal(oRes.message, "", "success");
                $rootScope.redirect('/#!/main/alertList');
            } else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    }

    $scope.updateA = function () {
        var ufAlert = {};
        ufAlert.request = "update_alarm"
        ufAlert.aid = $scope.updateAlertItem.aid;
        ufAlert.category = $scope.category;
        ufAlert.created_at = $scope.updateAlertItem.created_at;
        ufAlert.atype = $scope.updateAlertItem.atype;
        if (ufAlert.atype === "geofence") {
            ufAlert.gid = $scope.sGeozone.gid;
            if($scope.sDestination)
                ufAlert.dest_id = $scope.sDestination;
            if ($scope.in === true) {
                ufAlert.entry = 1;
            } else {
                ufAlert.entry = 0;
            }
            if ($scope.out === true) {
                ufAlert.exit = 1;
            } else {
                ufAlert.exit = 0;
            }
            ufAlert.start_time = $scope.dateTimeStart;
            ufAlert.end_time = $scope.dateTimeEnd;

            //***********************
            if ($scope.defaultTimes && $scope.defaultTimes.length > 0) {
                ufAlert.schedules = [];
                for (var t = 0; t < $scope.defaultTimes.length; t++) {
                    //**** custom time add with date ******//
                    ufAlert.schedules[t] = {};

                    var xx = $scope.todayDate;
                    xx.setHours($scope.defaultTimes[t].hourSel1);
                    xx.setMinutes($scope.defaultTimes[t].minuteSel1);
                    xx.setMilliseconds(00);
                    ufAlert.schedules[t].start = angular.copy(xx);
                    var yy = $scope.todayDate;
                    yy.setHours($scope.defaultTimes[t].hourSel2);
                    yy.setMinutes($scope.defaultTimes[t].minuteSel2);
                    yy.setMilliseconds(00);
                    ufAlert.schedules[t].end = angular.copy(yy);

                    ufAlert.schedules[t].msg = $scope.defaultTimes[t].msg;

                    //**** custom time add with date ******//
                }
            }
            //***********************
        } else if (ufAlert.atype === "over_speed") {
            ufAlert.over_speed = $scope.over_speed;
            ufAlert.name = $scope.over_speed_name;
            ufAlert.description = $scope.over_speed_description;
        } else if (oAlert.atype === 'halt') {
            $scope.minTime = $scope.sMin + ($scope.sHour * 60);
            ufAlert.halt_duration = $scope.minTime;
        }
        if ($scope.mobLst && ($scope.mobLst.length > 0)) {
            ufAlert.mobiles = $scope.mobLst;
        }
        if ($scope.emailLst && ($scope.emailLst.length > 0)) {
            ufAlert.emails = $scope.emailLst;
        }
        ufAlert.selected_uid = $rootScope.selectedUser.user_id;
        reportService.updateAlert(ufAlert, updateFullAlertRes);
    };


    //******* update alert fun. end *************/

    //********* create alert by geofence redirect *************//
    if ($rootScope.alertGeo) {
        $scope.selectedGeoAlert = $rootScope.alertGeo;
        $scope.alertType = $scope.selectedGeoAlert.atype || 'geofence';
        $scope.getGeoZone();
        if ($scope.alertType === 'geofence') {
            $scope.showOverSpeed = false;
            $scope.showGeoList = true;
        }
    }
    //********* create alert by geofence redirect *************//

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.alertList = function () {
        $rootScope.redirect('/#!/main/alertList');
    };
});

materialAdmin.controller("alarmPopupCtrl", function ($rootScope, $scope, DateUtils, $uibModal, $uibModalInstance, reportService) {
    $rootScope.showSideBar = false;
    $rootScope.geofence;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions1 = {
        formatYear: 'yy',
        minDate: new Date(),
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //********************//**********************//*****************//

    // default schedule start here ..........

    $scope.aHoursss = [];
    for (var h = 0; h < 24; h++) {
        $scope.aHoursss[h] = h;
    }
    $scope.aMinutes = [];
    for (var m = 0; m < 60; m++) {
        $scope.aMinutes[m] = m;
    }

    $scope.aTimes = [];

    $scope.addNew = function (personalDetail) {
        if ($scope.aTimes && $scope.aTimes.length <= 3) {
            $scope.aTimes.push({
                'hourSel1': '',
                'minuteSel1': '',
                'hourSel2': '',
                'minuteSel2': '',
                'msg': ''
            });
        } else {
            swal('warning', 'You can add only 4 schedule.', 'warning');
        }
    };

    $scope.remove = function () {
        var newDataList = [];
        $scope.selectedAll = false;
        angular.forEach($scope.aTimes, function (selected) {
            if (!selected.selected) {
                newDataList.push(selected);
            }
        });
        $scope.aTimes = newDataList;
    };

    // default schedule end here ........

    $scope.timeValidate = function (time, index) {
        if ($scope.aTimes[index].hourSel1 && $scope.aTimes[index].hourSel2) {
            if ($scope.aTimes[index].hourSel1 > $scope.aTimes[index].hourSel2) {
                swal('Warning', 'select less then first selected hour.', 'warning');
                $scope.aTimes[index].hourSel1 = 0;
            } else {
                if ($scope.aTimes[index].hourSel1 == $scope.aTimes[index].hourSel2) {
                    if ($scope.aTimes[index].minuteSel1 && $scope.aTimes[index].minuteSel2) {
                        if ($scope.aTimes[index].minuteSel1 > $scope.aTimes[index].minuteSel2) {
                            swal('Warning', 'select less then first selected minute.', 'warning');
                            $scope.aTimes[index].minuteSel1 = 0;
                        }
                    }
                }
            }
        }
    };

    function alarmResp(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status == 'OK') {
                swal(oRes.message, "", "success");
                $rootScope.getScheduledAlarm();   //****call geo list function
                $uibModalInstance.dismiss('cancel');
            } else if (oRes.status == 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addAlarmData = function () {
        var sAlert = {};

        //***********************
        if ($scope.aTimes && $scope.aTimes.length > 0) {
            sAlert.schedules = [];
            for (var t = 0; t < $scope.aTimes.length; t++) {
                //**** custom time add with date ******//
                sAlert.schedules[t] = {};

                var xx = $scope.alarmDate;
                xx.setHours($scope.aTimes[t].hourSel1);
                xx.setMinutes($scope.aTimes[t].minuteSel1);
                xx.setMilliseconds(00);
                sAlert.schedules[t].start = angular.copy(xx);
                var yy = $scope.alarmDate;
                yy.setHours($scope.aTimes[t].hourSel2);
                yy.setMinutes($scope.aTimes[t].minuteSel2);
                yy.setMilliseconds(00);
                sAlert.schedules[t].end = angular.copy(yy);

                sAlert.schedules[t].msg = $scope.aTimes[t].msg;

                //**** custom time add with date ******//
            }
        }
        //***********************

        sAlert.request = "create_alarm_schedule",
            sAlert.alm_created_at = $rootScope.upAlertData.created_at;
        //sAlert.atype = selectedAlert.atype;
        sAlert.user_id = $rootScope.upAlertData.user_id;
        sAlert.date = $scope.alarmDate;
        reportService.addAlarmSchedule(sAlert, alarmResp);

    };
    //******* end remove zone *************//

});


materialAdmin.controller("notificationCtrl", function ($rootScope, $scope, $localStorage, DateUtils, reportService) {
    $rootScope.showSideBar = false;
    $scope.aNotifications = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    $rootScope.states.actItmSide = 'allAlert';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }
    $scope.allAlertTypes = ['All Alerts', 'Geofence Alert', 'Overspeed Alert', 'Halt Alert'];
    $scope.aVehicle = $localStorage.user.devices;
    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //************* New Date Picker for multiple date selection in single form ******************
    //****** alert list get function **********//
    $scope.onSelect = function ($item, $model, $label) {
        $scope.imei = $model.imei;
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllNotification();
    };
    $scope.wrongDateRange = false;
    var from_date;
    var to_date;
    $scope.getNotification = function () {
        if ($scope.from_date && $scope.to_date) {
            if ($scope.to_date > $scope.from_date) {
                $scope.wrongDateRange = false;
                from_date = $scope.from_date;
                to_date = $scope.to_date;
                $rootScope.getPageNo = 0;
                $scope.setPage(1);
                $scope.getAllNotification();
            } else {
                $scope.wrongDateRange = true;
            }
        }
    }


    $scope.remVehicle = function (vehicleNum) {
        if (vehicleNum.length < 1) {
            $scope.imei = '';
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllNotification();
            console.log('1stRefersh');
        }
    };

    $scope.getAlert = function (alertType) {
        if (alertType == "Geofence Alert") {
            $scope.alertType = 'geofence';
        } else if (alertType == "Overspeed Alert") {
            $scope.alertType = 'over_speed';
        } else if (alertType == "Halt Alert") {
            $scope.alertType = 'halt';
        } else {
            $scope.alertType = '';
        }
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllNotification();
    }

    function notifiListResponse(response) {
        var oRes = JSON.parse(response);
        console.log('Reponse');
        if (oRes) {
            if (oRes.status == 'OK') {
                $scope.$apply(function () {
                    $scope.aNotifications = oRes.data;
                    if ($scope.aNotifications && $scope.aNotifications.length > 0) {
                        for (var i = 0; i < $scope.aNotifications.length; i++) {
                            $scope.aNotifications[i].datetime = moment(oRes.data[i].datetime).format('LLL');
                        }
                        //$scope.$apply(function() {
                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 9;
                            }
                        }
                        //});
                    }
                });
            } else if (oRes.status == 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    };

    $scope.getAllNotification = function () {

        var getNotifi = {};
        getNotifi.login_uid = $localStorage.user.user_id;
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNo > 0) {
                getNotifi.pageState = $scope.aPageState[$rootScope.getPageNo];
            }
        }
        getNotifi.row_count = 12;
        getNotifi.request = 'get_notification';
        getNotifi.type = '';
        if ($scope.imei) {
            getNotifi.imei = $scope.imei;
        }
        if ($scope.alertType) {
            getNotifi.type = $scope.alertType;
        }
        if (from_date) {
            //var fromdate = new Date($scope.from_date)
            getNotifi.start_date = from_date;
        }
        if (to_date) {
            //var todate = new Date($scope.to_date)
            getNotifi.end_date = to_date;
        }
        console.log('Request');
        reportService.getAllNotifiList(getNotifi, notifiListResponse);
    }

    $scope.getAllNotification();   //****call alert list function

    //****** alert list get function **********//

    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $rootScope.getPageNo = $scope.bigCurrentPage - 1;
        $scope.getAllNotification();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aNotifications.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    $scope.downloadList = function () {
        function downloadListResp(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $scope.listDownloadResp = oRes.data;
                    console.log($scope.listDownloadResp);
                    $window.open($scope.listDownloadResp, "_blank");
                }
            }
        }

        var list = {};
        list.request = "download_notification";
        list.login_uid = $localStorage.user.user_id;
        list.user_id = $localStorage.user.user_id;
        reportService.downloadListService(list, downloadListResp);
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
});

materialAdmin.controller("removeAlertCtrl", function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, reportService) {
    $rootScope.showSideBar = false;
    $rootScope.geofence;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectedAlert = {};
    $scope.selectedAlert = $rootScope.alert;

    function removeAlertRes(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status == 'OK') {
                swal(oRes.message, "", "success");
                $rootScope.getAllAlerts();   //****call geo list function
                $uibModalInstance.dismiss('cancel');
            } else if (oRes.status == 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
        $uibModalInstance.dismiss('cancel');
    };

    $scope.removeAlertF = function (selectedAlert) {
        var sAlert = {};
        sAlert.request = "remove_alarm",
            sAlert.created_at = selectedAlert.created_at;
        sAlert.atype = selectedAlert.atype;
        sAlert.selected_uid = $rootScope.selectedUser.user_id;
        reportService.remoAlert(sAlert, removeAlertRes);

    };
    //******* end remove zone *************//

});

materialAdmin.controller("geoNotificationCtrl", function ($rootScope, $scope, $state, $localStorage, $window, DateUtils, LoginService, reportService) {
    $rootScope.showSideBar = false;
    $scope.aGeoNotifications = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    $rootScope.states.actItmSide = 'allAlert';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }
    $scope.allAlertTypes = ['All Alerts', 'Geofence Alert', 'Overspeed Alert', 'Halt Alert'];
    $scope.aVehicle = $localStorage.user.devices;
    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.goBack = function () {
        $state.go('main.otherNotification');
    };

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //************* New Date Picker for multiple date selection in single form ******************
    //****** alert list get function **********//
    $scope.onSelect = function ($item, $model, $label) {
        $scope.imei = $model.imei;
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllNotification();
    };
    $scope.onSelectGeofence = function ($item, $model, $label) {
        $scope.selectedGeozone = $model.name;
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllNotification();
    };
    $scope.wrongDateRange = false;
    $scope.dateRangeExceeds = false;
    var tempDate = new Date();
    tempDate.setHours(0);
    tempDate.setMinutes(0);
    tempDate.setSeconds(0);
    $scope.from_date = tempDate;

    $scope.getNotification = function () {
        if ($scope.from_date && $scope.to_date) {
            $scope.to_date.setHours(23);
            $scope.to_date.setMinutes(59);
            $scope.to_date.setSeconds(59);
            var diff = $scope.to_date.getTime() - $scope.from_date.getTime();
            diff = diff / 1000;//seconds
            diff = diff / 60;//min
            diff = diff / 60;//hours
            diff = diff / 24;
            if (diff > 8) {
                $scope.dateRangeExceeds = true;
            } else if (($scope.to_date.getTime() + 10000) > $scope.from_date) {//10 sec offset
                $scope.wrongDateRange = false;
                $scope.dateRangeExceeds = false;
                from_date = $scope.from_date;
                to_date = $scope.to_date;
                $rootScope.getPageNo = 0;
                $scope.setPage(1);
                $scope.getAllNotification();
            } else {
                $scope.dateRangeExceeds = true;
            }
        } else if ($scope.from_date) {
            $scope.wrongDateRange = false;
            $scope.dateRangeExceeds = false;
            from_date = $scope.from_date;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllNotification();
        }
    }


    $scope.remVehicle = function (vehicleNum) {
        if (vehicleNum.length < 1) {
            $scope.imei = '';
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllNotification();
            console.log('1stRefersh');
        }
    };

    $scope.getAlert = function (alertType) {
        if (alertType === "Geofence Alert") {
            $scope.alertType = 'geofence';
        } else if (alertType === "Overspeed Alert") {
            $scope.alertType = 'over_speed';
        } else if (alertType === "Halt Alert") {
            $scope.alertType = 'halt';
        } else {
            $scope.alertType = '';
        }
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getAllNotification();
    }

    function notifiListResponse(response) {
        var oRes = JSON.parse(response);
        console.log('Reponse');
        if (oRes) {
            if (oRes.status === 'OK') {
                $scope.$apply(function () {
                    $scope.aGeoNotifications = oRes.data;
                    if ($scope.aGeoNotifications && $scope.aGeoNotifications.length > 0) {
                        for (var i = 0; i < $scope.aGeoNotifications.length; i++) {
                            //$scope.aGeoNotifications[i].datetime = moment(oRes.data[i].datetime).format('LLL');

                            //$scope.aGeoNotifications[i].entry = {};
                            //$scope.aGeoNotifications[i].entry.datetime = "2016-12-22T09:09:18.219Z";

                            //$scope.aGeoNotifications[i].exit = {};
                            //$scope.aGeoNotifications[i].exit.datetime = "2016-12-24T10:10:18.219Z";

                            if ($scope.aGeoNotifications[i].exit && $scope.aGeoNotifications[i].exit.datetime && $scope.aGeoNotifications[i].entry && $scope.aGeoNotifications[i].entry.datetime) {
                                var timeStart = new Date($scope.aGeoNotifications[i].entry.datetime).getTime();
                                var timeEnd = new Date($scope.aGeoNotifications[i].exit.datetime).getTime();
                                var hourDiff = timeEnd - timeStart; //in ms
                                var secDiff = hourDiff / 1000; //in s
                                var dateString = $rootScope.dur_calc(secDiff);
                                /*var minDiff = hourDiff / 60 / 1000; //in minutes
                                var hDiff = hourDiff / 3600 / 1000; //in hours
                                var humanReadable = {};
                                humanReadable.hours = Math.floor(hDiff);
                                humanReadable.minutes = minDiff - 60 * humanReadable.hours;
                                var dateString = humanReadable.hours + 'h ' + humanReadable.minutes + 'm';
                                console.log(dateString); //{hours: 0, minutes: 30}*/

                                $scope.aGeoNotifications[i].duration = dateString;
                            } else {
                                $scope.aGeoNotifications[i].duration = 'NA';
                            }
                        }
                        //$scope.$apply(function() {
                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 15;
                            }
                        }
                        //});
                    }
                });
            } else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    };

    $scope.getAllNotification = function () {

        var getNotifi = {};
        getNotifi.login_uid = $localStorage.user.user_id;
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNo > 0) {
                getNotifi.pageState = $scope.aPageState[$rootScope.getPageNo];
            }
        }
        getNotifi.row_count = 150;
        getNotifi.request = 'get_notification';
        getNotifi.type = 'geofence';
        if ($scope.sGeozone && $scope.selectedGeozone) {
            getNotifi.geofence = $scope.selectedGeozone;
        } else {
            getNotifi.geofence = undefined;
        }
        if ($scope.imei) {
            getNotifi.imei = $scope.imei;
        }
        /*if($scope.alertType){
          getNotifi.type = $scope.alertType;
        }*/
        if ($scope.from_date) {
            //var fromdate = new Date($scope.from_date)
            getNotifi.start_date = $scope.from_date;
        }
        if ($scope.to_date) {
            //var todate = new Date($scope.to_date)
            getNotifi.end_date = $scope.to_date;
        }
        console.log('Request');
        reportService.getAllNotifiList(getNotifi, notifiListResponse);
    }

    $scope.getAllNotification();   //****call alert list function

    //****** alert list get function **********//

    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $rootScope.getPageNo = $scope.bigCurrentPage - 1;
        $scope.getAllNotification();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aGeoNotifications.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    $scope.downloadList = function () {
        function downloadListResp(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.listDownloadResp = oRes.data;
                    console.log($scope.listDownloadResp);
                    $window.open($scope.listDownloadResp, "_blank");
                }
            }
        }

        var list = {};
        list.request = "download_notification";
        list.login_uid = $localStorage.user.user_id;
        list.user_id = $localStorage.user.user_id;
        list.type = 'geofence';
        if ($scope.imei) {
            list.imei = $scope.imei;
        }
        if (from_date) {
            list.start_date = from_date;
        }
        if (to_date) {
            list.end_date = to_date;
        }
        reportService.downloadListService(list, downloadListResp);
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

    //********get geozone on condition ***********//
    $scope.getGeoZone = function () {
        function geoListResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.$apply(function () {
                        $scope.aAllGeoZones = oRes.data;
                    });
                } else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        var getGeoList = {};
        getGeoList.login_uid = $localStorage.user.user_id;
        getGeoList.request = 'get_geozone';
        getGeoList.token = $localStorage.user.token;
        LoginService.getGeozoneList(getGeoList, geoListResponse);
    };
    $scope.getGeoZone();
});

materialAdmin.controller("otherNotificationCtrl", function ($rootScope, $scope, $state, $localStorage, $window, $uibModal, DateUtils, dateUtils, reportService, gpsAnalyticService) {
    $rootScope.showSideBar = false;
    $scope.aHaltNotifications = [];
    $scope.aAllAlerts = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    $rootScope.states.actItmSide = 'allAlert';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }
    $scope.selected = {
        notif: {}
    };
    $scope.aNotifications = [
        {
            name: 'All Alert'
        },
        {
            scope: 'halt',
            name: 'Halt Alert'
        },
        {
            scope: 'over_speed',
            name: 'Overspeed Alert'
        },
        {
            scope: 'sos',
            name: 'Panic Alert'
        },
        {
            scope: 'bettery_reconnect',
            name: 'Power Connect'
        },
        {
            scope: 'power_cut',
            name: 'Power cut'
        },
        {
            scope: 'engine_on',
            name: 'Engine On'
        }, {
            scope: 'engine_off',
            name: 'Engine off'
        },
        {
            scope: 'tempering',
            name: 'Tempering'
        },
        {
            scope: 'hb',
            name: 'Harsh Braking'
        },
        {
            scope: 'ha',
            name: 'Rapid Acceleration'
        },
        {
            scope: 'rt',
            name: 'Harsh Cornering'
        },
        {
            scope: 'low_internal_battery',
            name: 'Low Battery'
        },
        {
            scope: 'rfid',
            name: 'Driver Tag Swiped'
        },
        {
            scope: 'geofence',
            name: 'Geofence'
        },
        {
            scope: 'nd',
            name: 'Night Driving'
        },
        {
            scope: 'cd',
            name: 'Continuous Driving',
        },
        {
            scope: 'fw',
            name: 'Free Wheeling'
        },
        {
            scope: 'idle',
            name: 'Excessive Idle'
        },
        {
            scope: 'tl',
            name: 'Tilt'
        }
    ];
    $scope.aVehicle = $localStorage.user.devices;
    $scope.aDriver = [...$localStorage.user.devices.reduce((set, obj) => {
        if(obj.driver_name){
            set.add(obj.driver_name.toLowerCase());
        }
        if(obj.driver_name2){
            set.add(obj.driver_name2.toLowerCase());
        }
        return set;
    }, new Set())];
    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //************* New Date Picker for multiple date selection in single form ******************
    //****** alert list get function **********//

    $scope.resetFilter = function(){
        $scope.notiType = undefined;
        $scope.vehicleNum = undefined;
        $scope.driver = undefined;
        $scope.from_date = undefined;
        $scope.to_date = undefined;
        $scope.bigCurrentPage = 1;
        $scope.aVehicleData = [];
        $scope.aEventCollection = [];
    };

    $scope.onTypeSelect = function (type) {
        if (type.name === 'Geofence Notificaion') {
            $state.go('main.geofenceNotification');
        }
    };
    $scope.takeAction = function (oNotif) {
        if(!$scope.selected.notif._id)
            return;

        $uibModal.open({
            templateUrl: 'views/alert/alertActionPopup.html',
            controller: [
                '$uibModalInstance',
                'gpsAnalyticService',
                'oNotif',
                function (
                    $uibModalInstance,
                    gpsAnalyticService,
                    oNotif
                ) {
                    let vm = this;

                    vm.close = close;
                    vm.addAction = addAction;

                    (function init() {
                        vm.notif = oNotif;
                    })();

                    function close(){
                        $uibModalInstance.close();
                    }

                    function addAction() {
                        vm.notif.actions = vm.notif.actions || [];
                        vm.notif.actions.push({
                            time: new Date(),
                            action: vm.actionStr
                        });
                        vm.actionStr = '';
                        let requset = {
                            ...vm.notif
                        };
                        delete requset.__v;
                        delete requset._id;
                        gpsAnalyticService.updateAlerts(requset, onSuccess);

                        function onSuccess(response) {
                            if (response && response.data && response.data.length) {
                                let res = response.data;
                                Object.assign(vm.notif, res);
                            }
                        }
                    }
                }
            ],
            controllerAs: 'vm',
            resolve: {
                oNotif: function() {
                    return $scope.selected.notif;
                }
            }
        });
    };

    $scope.geofenceNotification = function () {
        $state.go('main.geofenceNotification');
    };

    $scope.onVehicleSelect = function (item) {
        $scope.aVehicleData = $scope.aVehicleData || [];
        $scope.aVehicleData.push(item);
        $scope.vehicleNum = '';
    };
    $scope.removeVehicle = function (select, index) {
        $scope.aVehicleData.splice(index, 1);
    };

    $scope.onEventSelect = function (item) {
        if(item){
            $scope.aEventCollection = $scope.aEventCollection || [];
            $scope.aEventCollection.push(item);
        }
    };
    $scope.removeEvent = function (select, index) {
        $scope.aEventCollection.splice(index, 1);
    };

    $scope.remVehicle = function (vehicleNum) {
        if (vehicleNum.length < 1) {
            $scope.imei = '';
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getOtherNotification();
            console.log('1stRefersh');
        }
    };

    $scope.getAlert = function (alertType) {
        if (alertType.scope === "select") {

        } else {
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getOtherNotification();   //****call alert list function
        }
    };

    function otherNotifiListResponse(response) {
        var oRes = JSON.parse(response);
        console.log('Reponse');
        if (oRes) {
            if (oRes.status === 'OK') {
                $scope.$apply(function () {
                    $scope.aOtherNotifications = oRes.data;
                    if ($scope.aOtherNotifications && $scope.aOtherNotifications.length > 0) {
                        for (var i = 0; i < $scope.aOtherNotifications.length; i++) {
                            $scope.aOtherNotifications[i].datetime = moment(oRes.data[i].datetime).format('LLL');
                        }
                        //$scope.$apply(function() {
                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 15;
                            }
                        }
                        //});
                    }
                });
            } else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    }

    $scope.getOtherNotification = function () {

        var getNotifi = {};
        getNotifi.login_uid = $localStorage.user.user_id;
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNo > 0) {
                getNotifi.pageState = $scope.aPageState[$rootScope.getPageNo];
            }
        }
        getNotifi.row_count = 15;
        getNotifi.request = 'get_notification';
        if ($scope.notiType)
            getNotifi.type = $scope.notiType.scope;
        if ($scope.imei) {
            getNotifi.imei = $scope.imei;
        }
        // if ($scope.from_date) {
        //     getNotifi.start_date = $scope.from_date;
        // }
        // if ($scope.to_date) {
        //     getNotifi.end_date = $scope.to_date;
        // }
        if ($scope.from_date) {
            getNotifi.start_date = dateUtils.setHours($scope.from_date, 0, 0, 0).toISOString();
        }
        if ($scope.to_date) {
            getNotifi.end_date = dateUtils.setHours($scope.to_date, 23, 59, 59).toISOString();
        }
        console.log('Request');
        reportService.getAllNotifiList(getNotifi, otherNotifiListResponse);
    };

    //$scope.getHaltNotification();   //****call alert list function

    //****** alert list get function **********//

    //****************pagination code start ************//

    $scope.getAllAlerts = function (resetPage = false) {
        if(resetPage)
            $scope.bigCurrentPage = 1;
        var oFilter = prepareFilterObject();
        gpsAnalyticService.getAlertsV2(oFilter, onSuccess, err => {
            console.log(err)
        });

        // Handle success response
        function onSuccess(response) {
            if (response && response.length) {
                res = response;
                $scope.aOtherNotifications = res;
                if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                    $scope.aPageState.push(res);
                    $scope.aAllAlerts.push(...res);
                    $scope.bigTotalItems = $scope.aAllAlerts.length + 2;
                }
                $scope.aOtherNotifications.forEach(alt => {
                    $scope.aNotifications.forEach(obj => {
                        if (obj.scope === alt.code) {
                            alt.code = obj.name;
                        }
                    });
                });
            } else {
                $scope.aOtherNotifications = undefined;
            }
        }
    };

    function prepareFilterObject(download) {
        var filter = {
            // code: Object.keys($scope.oReportType)
        };

        // if($scope.notiType)
        //     filter.code = $scope.notiType.scope;

        if ($scope.imei) {
            filter.imei = $scope.imei;
        }

        // if ($scope.from_date) {
        //     filter.from = $scope.from_date;
        // }
        //
        // if ($scope.to_date) {
        //     filter.to = $scope.to_date;
        // }

        if ($scope.from_date) {
            filter.from = dateUtils.setHours($scope.from_date, 0, 0, 0).toISOString();
        }
        if ($scope.to_date) {
            filter.to = dateUtils.setHours($scope.to_date, 23, 59, 59).toISOString();
        }

        if ($scope.aVehicleData && $scope.aVehicleData.length) {
            filter.imei = [];
            $scope.aVehicleData.map((v) => {
                filter.imei.push(Number(v.imei));
            });
        }
        if ($scope.aEventCollection && $scope.aEventCollection.length) {
            filter.code = [];
            $scope.aEventCollection.map((v) => {
                filter.code.push(v.scope);
            });
        }

        if (download) {
            filter.download = true;
            filter.no_of_docs = 2000;
        } else {
            filter.no_of_docs = 15;
            filter.skip = $scope.bigCurrentPage;
        }

        if($scope.driver){
            filter.driver = $scope.driver;
        }

        filter.selected_uid = $localStorage.user.user_id;
        filter.login_uid = $localStorage.user.user_id;
        filter.user_id = $localStorage.user.user_id;
        filter.row_count = 8;
        filter.sort = {'_id': -1};
        return filter;
    }

    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        // $rootScope.getPageNo = $scope.bigCurrentPage-1;
        $scope.getAllAlerts();
    };

    $scope.maxSize = 2;
    $scope.bigTotalItems = $scope.aHaltNotifications.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    ($scope.getNotification = function () {
        $scope.setPage(1);
        // $scope.getOtherNotification();
    })();

    // $scope.downloadList = function () {
    //     function downloadListResp(response) {
    //         var oRes = JSON.parse(response);
    //         if (oRes) {
    //             if (oRes.status === 'OK') {
    //                 $scope.listDownloadResp = oRes.data;
    //                 console.log($scope.listDownloadResp);
    //                 $window.open($scope.listDownloadResp, "_blank");
    //             }
    //         }
    //     }
    //
    //     var list = {};
    //     list.request = "download_notification";
    //     list.login_uid = $localStorage.user.user_id;
    //     list.user_id = $localStorage.user.user_id;
    //     list.type = $scope.notiType.scope;
    //     if ($scope.imei) {
    //         list.imei = $scope.imei;
    //     }
    //     if ($scope.from_date) {
    //         list.start_date = $scope.from_date;
    //     }
    //     if ($scope.to_date) {
    //         list.end_date = $scope.to_date;
    //     }
    //     reportService.downloadListService(list, downloadListResp);
    // };


    $scope.downloadList = function (download) {

        var oFilter = prepareFilterObject(download);
        gpsAnalyticService.getAlertsV2(oFilter, onSuccess, onFailure);

        function onSuccess(data) {
            if (data.url) {
                var a = document.createElement('a');
                a.href = data.url;
                a.download = data.url;
                a.target = '_blank';
                a.click();
            } else {
                swal("warning", res.data.message, "warning");
            }
        }

        function onFailure(response) {
            console.log(response);
            swal('Error!', 'Message not defined', 'error');
        }
    }

    // HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
});

materialAdmin.controller("overSpeedNotificationCtrl", function ($rootScope, $scope, $localStorage, $window, DateUtils, reportService) {
    $rootScope.showSideBar = false;
    $scope.aOverSNotifications = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states = {};
    $rootScope.states.actItm = 'alert';
    $rootScope.states.actItmSide = 'allAlert';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.user;
    }
    $scope.allAlertTypes = ['All Alerts', 'Geofence Alert', 'Overspeed Alert', 'Halt Alert'];
    $scope.aVehicle = $localStorage.user.devices;
    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //************* New Date Picker for multiple date selection in single form ******************
    //****** alert list get function **********//
    $scope.onSelect = function ($item, $model, $label) {
        $scope.imei = $model.imei;
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getOverSpdNotification();
    };
    $scope.wrongDateRange = false;
    var from_date;
    var to_date;
    $scope.getNotification = function () {
        if ($scope.from_date && $scope.to_date) {
            if ($scope.to_date > $scope.from_date) {
                $scope.wrongDateRange = false;
                from_date = $scope.from_date;
                to_date = $scope.to_date;
                $rootScope.getPageNo = 0;
                $scope.setPage(1);
                $scope.getOverSpdNotification();
            } else {
                $scope.wrongDateRange = true;
            }
        }
    }


    $scope.remVehicle = function (vehicleNum) {
        if (vehicleNum.length < 1) {
            $scope.imei = '';
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getOverSpdNotification();
            console.log('1stRefersh');
        }
    };

    $scope.getAlert = function (alertType) {
        if (alertType == "Geofence Alert") {
            $scope.alertType = 'geofence';
        } else if (alertType == "Overspeed Alert") {
            $scope.alertType = 'over_speed';
        } else if (alertType == "Halt Alert") {
            $scope.alertType = 'halt';
        } else {
            $scope.alertType = '';
        }
        $rootScope.getPageNo = 0;
        $scope.setPage(1);
        $scope.getOverSpdNotification();
    }

    function overSpdNotifiListResponse(response) {
        var oRes = JSON.parse(response);
        console.log('Reponse');
        if (oRes) {
            if (oRes.status == 'OK') {
                $scope.$apply(function () {
                    $scope.aOverSNotifications = oRes.data;
                    if ($scope.aOverSNotifications && $scope.aOverSNotifications.length > 0) {
                        for (var i = 0; i < $scope.aOverSNotifications.length; i++) {
                            $scope.aOverSNotifications[i].datetime = moment(oRes.data[i].datetime).format('LLL');
                        }
                        //$scope.$apply(function() {
                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 15;
                            }
                        }
                        //});
                    }
                });
            } else if (oRes.status == 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    };

    $scope.getOverSpdNotification = function () {

        var getNotifi = {};
        getNotifi.login_uid = $localStorage.user.user_id;
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNo > 0) {
                getNotifi.pageState = $scope.aPageState[$rootScope.getPageNo];
            }
        }
        getNotifi.row_count = 15;
        getNotifi.request = 'get_notification';
        getNotifi.type = 'over_speed';
        if ($scope.imei) {
            getNotifi.imei = $scope.imei;
        }
        /*if($scope.alertType){
          getNotifi.type = $scope.alertType;
        }*/
        if (from_date) {
            //var fromdate = new Date($scope.from_date)
            getNotifi.start_date = from_date;
        }
        if (to_date) {
            //var todate = new Date($scope.to_date)
            getNotifi.end_date = to_date;
        }
        console.log('Request');
        reportService.getAllNotifiList(getNotifi, overSpdNotifiListResponse);
    }

    $scope.getOverSpdNotification();   //****call alert list function

    //****** alert list get function **********//

    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $rootScope.getPageNo = $scope.bigCurrentPage - 1;
        $scope.getOverSpdNotification();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aOverSNotifications.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    $scope.downloadList = function () {
        function downloadListResp(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $scope.listDownloadResp = oRes.data;
                    console.log($scope.listDownloadResp);
                    $window.open($scope.listDownloadResp, "_blank");
                }
            }
        }

        var list = {};
        list.request = "download_notification";
        list.login_uid = $localStorage.user.user_id;
        list.user_id = $localStorage.user.user_id;
        list.type = 'over_speed';
        if ($scope.imei) {
            list.imei = $scope.imei;
        }
        if (from_date) {
            list.start_date = from_date;
        }
        if (to_date) {
            list.end_date = to_date;
        }
        reportService.downloadListService(list, downloadListResp);
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
});
