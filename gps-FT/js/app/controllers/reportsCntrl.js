materialAdmin.controller('reportsCtrl', function ($rootScope, $localStorage, $uibModal, $stateParams, DateUtils, $interval, $state, $scope, reportService, TripService, FeatureService, $timeout,$filter,$route, gpsAnalyticService) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $rootScope.states.actItm = 'report';
    //$rootScope.aReportTypes = [];
    $scope.aGroup  = [
        {
            name:'Select Device Group',
            value:''
        },
        {
            name:'keyman',
            value:'keyman'
        },
        {   name: 'patrolman',
            value: 'patrolman'
        },
        {   name: 'mate',
            value: 'mate'
        }
    ];
    $scope.deviceNum = {device_imei : '!true'};
    $rootScope.aCopyTrSheetDevice = $rootScope.aTrSheetDevice;
    //if(!$rootScope.trackSheetResStore || $rootScope.trackSheetResStore.total_count != $localStorage.preservedSelectedUser.devices.length || $rootScope.trackSheetResStore.total_count != $localStorage.onLocalselectedUser.devices.length){
    if ($rootScope.trackSheetResStore.total_count !== $rootScope.aTrSheetDevice.length) {
        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 5000);
    }

    
    function featureSuccess(response) {
        var oFeature = JSON.parse(response);
        if (oFeature) {
            if (oFeature.status == 'OK') {
                $rootScope.aReportTypes = [];
                if (oFeature.request == 'get_feature') {
                    if (oFeature.data && oFeature.data.permissions) {
                        for (var f = 0; f < oFeature.data.permissions.length; f++) {
                            if (oFeature.data.permissions[f] == "report_parking") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Halt Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_overspeed") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Overspeed Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_activity") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Activity Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_mileage") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Mileage Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_mileage2") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Kilometer Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_activity_interval") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Detailed Activity Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_geofence_schedule") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Trip Geofence Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_activity_trip") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Trip Activity Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_ac") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Ac Report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "report_driver_activity") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Trip Overview Report';
                                $rootScope.aReportTypes.push(oAllow);
                                oAllow = {};
                                oAllow.scope = 'report_driver_activity_single';
                                oAllow.name = 'Trip Overview Report 2';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "driver_day_activity") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Duty and working Day report';
                                $rootScope.aReportTypes.push(oAllow);
                            } else if (oFeature.data.permissions[f] == "vehicle_exceptions") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Vehicle Exception';
                                $rootScope.aReportTypes.push(oAllow);
                            }else if (oFeature.data.permissions[f] == "details_analysis") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Details Analysis';
                                $rootScope.aReportTypes.push(oAllow);
                            }
                            /*
                            else if (oFeature.data.permissions[f] == "report_combined_halts") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Combined Halts Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }*/
                            else if (oFeature.data.permissions[f] == "exception_report") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Exception Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }else if (oFeature.data.permissions[f] == "event_report") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Event Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }else if (oFeature.data.permissions[f] == "action_event_report") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Action Event Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }else if (oFeature.data.permissions[f] == "day_wise_tag_report") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Day Wise Tag Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }
                            else if (oFeature.data.permissions[f] == "report_activity_trip") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Trip Activity Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }
                            /*else if (oFeature.data.permissions[f] == "report_beat_analysis") {
                                var oAllow = {};
                                oAllow.scope = oFeature.data.permissions[f];
                                oAllow.name = 'Beat Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }else{
                                var oAllow = {};
                                oAllow.scope = "report_beat_analysis";
                                oAllow.name = 'Beat Report';
                                $rootScope.aReportTypes.push(oAllow);
                            }
                             */
                        }
                        // var oAllow = {};
                        // oAllow.scope = "report_beat_analysis";
                        // oAllow.name = 'Beat Report';
                        // $rootScope.aReportTypes.push(oAllow);
                    }
                }
            }
        }
    }

    $scope.getFeatures = function(){
        var feature = {
            request: "get_feature",
            feature: "reports"
        };
        FeatureService.getFeature(feature, featureSuccess);
    }

    
    $scope.getFeatures();
    
    

    // (function () {
    //     $scope.getFeatures();
    // })();

    // (function init () {
    //     //$route.reload();
    //     
    // })();
    //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.applyFilter = function (filter) {
        if(filter && filter.value) {
            $rootScope.aCopyTrSheetDevice = $filter('filter')($rootScope.aTrSheetDevice,{vehicle_group : filter.value});
        } else {
            $rootScope.aCopyTrSheetDevice = $rootScope.aTrSheetDevice;
        }
    }
    $scope.toggleMinMaxDate = function (type) {

        if($scope.reportType === 'report_driver_activity_single') {
            $scope.dateTimeEnd = $scope.dateTimeEnd || new Date();
            $scope.dateTimeStart = $scope.dateTimeStart || new Date(new Date().setDate(new Date($scope.dateTimeEnd).getDate() - 15));

            $scope.dateOptions1.maxDate = new Date();
            $scope.dateOptions2.maxDate = new Date();
            $scope.dateOptions2.minDate = $scope.dateTimeStart;
            if ($scope.dateTimeEnd) {
                var someDate1 = angular.copy($scope.dateTimeEnd);
                var numberOfDaysToSub = 90;
                someDate1.setDate(someDate1.getDate() - numberOfDaysToSub);
                $scope.dateOptions1.minDate = someDate1;
            }
            return;
        }

        $scope.dateOptions1.maxDate = ($scope.dateTimeEnd || new Date());
        if (!($scope.reportType === 'report_mileage' || $scope.reportType === 'report_mileage2')) {
            if ($scope.dateTimeEnd) {
                var someDate1 = angular.copy($scope.dateTimeEnd);
                var numberOfDaysToSub = 30;
                someDate1.setDate(someDate1.getDate() - numberOfDaysToSub);
                $scope.dateOptions1.minDate = new Date(someDate1).getTime()<new Date().getTime()?someDate1:new Date();
            }
        }

        $scope.dateOptions2.minDate = ($scope.dateTimeStart || new Date());
        if (!($scope.reportType === 'report_mileage' || $scope.reportType === 'report_mileage2')) {
            var someDate = angular.copy($scope.dateTimeStart || new Date());
            var numberOfDaysToAdd = 30;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            $scope.dateOptions2.maxDate = new Date(someDate).getTime()>new Date().getTime()?new Date():someDate;
        }
    };
    //$scope.toggleMin();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions1 = {
        //dateDisabled: disabled,
        //minMode: 'month',
        formatYear: 'yy',
        maxDate: ($scope.dateTimeEnd || new Date()),
        //minDate: $scope.minDate ? null : new Date(),
        startingDay: 1
    };
    $scope.dateOptions2 = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: ($scope.dateTimeStart || new Date()),
        startingDay: 1
    }

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function (date) {
        return new Date(date).toDateString();
    };
    //********************//**********************//*****************//
    $scope.aHours = [];
    for (var h = 0; h < 24; h++) {
        $scope.aHours[h] = h;
    }
    $scope.aMinutes = [];
    for (var m = 0; m < 60; m++) {
        $scope.aMinutes[m] = m;
    }
    //************* custome Date time Picker for multiple date selection in single form ******************

    $scope.hourSel1 = 0;
    $scope.hourSel2 = 23;
    $scope.minuteSel1 = 0;
    $scope.minuteSel2 = 59;

    $scope.wrongDateRange = false;
    var dateTimeStart;
    var dateTimeEnd;
    $scope.getNoti = function () {
        if ($scope.dateTimeStart && $scope.dateTimeEnd) {
            if ($scope.dateTimeEnd > $scope.dateTimeStart) {
                $scope.wrongDateRange = false;
                dateTimeStart = $scope.dateTimeStart;
                dateTimeEnd = $scope.dateTimeEnd;
            } else {
                var hr1 = $scope.hourSel1 * 60;
                var hrMin1 = hr1 + $scope.minuteSel1;

                var hr2 = $scope.hourSel2 * 60;
                var hrMin2 = hr2 + $scope.minuteSel2;
                if (hrMin1 >= hrMin2) {
                    $scope.wrongDateRange = true;
                } else {
                    $scope.wrongDateRange = false;
                }
            }
        }
    }

    $scope.aMinMinutes = [];
    for (var m = 0; m <= 59; m++) {
        $scope.aMinMinutes[m] = {};
        $scope.aMinMinutes[m].name = '> ' + m + ' min';
        $scope.aMinMinutes[m].scope = m;
    }

    $scope.aMinHours = [];
    for (var h = 0; h < 25; h++) {
        $scope.aMinHours[h] = {};
        $scope.aMinHours[h].name = h + ' hour';
        $scope.aMinHours[h].scope = h;
    }

    $scope.minHours = 0;
    $scope.minMinutes = 15;

    $scope.actMinHours = 0;
    $scope.actMinMinutes = 30;

    $scope.changeInMinutes = function () {
        if ($scope.minHours === 0 && $scope.minMinutes < 2) {
            swal("Please select greater then 1 min.", "", "error");
            $scope.minMinutes = 15;
        }
        if ($scope.minHours == 24) {
            $scope.minMinutes = 0;
        }
    }
    $scope.changeHour = function () {
        if ($scope.minHours == 24 && $scope.minMinutes > 1) {
            //swal("Please select greater then 15 min.", "", "error");
            $scope.minMinutes = 0;
        }
    }

    $scope.aTimeFilter = ['Last Hour', 'Today', 'Yesterday', 'Last 2 days', 'Last 3 days', 'Last Week', 'Last Month'];

    $scope.filterMe = function (timeFilter, month) {
        if (timeFilter == 'Last Hour') {
            var currentTime = moment()._d;
            var lastHourTime = moment(currentTime).subtract(1, 'hours')._d;
            $scope.dateTimeEnd = currentTime;
            $scope.dateTimeStart = lastHourTime;
        } else if (timeFilter == 'Today') {
            var fromTime = moment();
            var toTime = moment(fromTime);
            fromTime.hour(00);
            fromTime.minute(00);
            fromTime.second(00);
            fromTime.millisecond(00);
            let toDay=new Date();
            let hh=toDay.getHours();
            let mm=toDay.getMinutes();
            let ss=toDay.getSeconds();
            $scope.hourSel2 = hh;
            $scope.minuteSel2 = mm;
            toTime.hour(hh);
            toTime.minute(mm);
            toTime.second(ss);
            $scope.dateTimeEnd = toTime._d;
            $scope.dateTimeStart = fromTime._d;
        } else if (timeFilter == 'Yesterday') {
            var yesterday = moment().subtract(1, 'day');
            var fromTime = yesterday;
            var toTime = moment(yesterday);
            fromTime.hour(00);
            fromTime.minute(00);
            fromTime.second(00);
            fromTime.millisecond(00);
            toTime.hour(23);
            toTime.minute(59);
            toTime.second(59);
            $scope.hourSel2 = 23;
            $scope.minuteSel2 = 59;
            $scope.dateTimeEnd = toTime._d;
            $scope.dateTimeStart = fromTime._d;
        } else if (timeFilter == 'Last 2 days') {
            var currentDate = moment().subtract(1, 'day');
            var last2Day = currentDate.clone().subtract(1, 'day');
            last2Day.hour(00);
            last2Day.minute(00);
            last2Day.second(00);
            last2Day.millisecond(00);
            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.hourSel2 = 23;
            $scope.minuteSel2 = 59;
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = last2Day._d;
        } else if (timeFilter == 'Last 3 days') {
            var currentDate = moment().subtract(1, 'day');
            var last3day = currentDate.clone().subtract(2, 'day');
            last3day.hour(00);
            last3day.minute(00);
            last3day.second(00);
            last3day.millisecond(00);
            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.hourSel2 = 23;
            $scope.minuteSel2 = 59;
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = last3day._d;
        } else if (timeFilter == 'Last Week') {
            var currentDate = moment().subtract(1, 'day');
            var lastweek = currentDate.clone().subtract(6, 'day');
            lastweek.hour(00);
            lastweek.minute(00);
            lastweek.second(00);
            lastweek.millisecond(00);
            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.hourSel2 = 23;
            $scope.minuteSel2 = 59;
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = lastweek._d;
        } else if (timeFilter == 'Last Month') {
            var currentDate = moment();
            var lastMonth = currentDate.clone().subtract(1, 'month');
            lastMonth.hour(00);
            lastMonth.minute(00);
            lastMonth.second(00);
            lastMonth.millisecond(00);
            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.hourSel2 = 23;
            $scope.minuteSel2 = 59;
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = lastMonth._d;
        } else if (timeFilter == 'Month Wise') {
            if (month) {
                var today = new Date(month);
                var startDate = moment([today.getFullYear(), today.getMonth()]);
                var endDate = moment(startDate.clone()).endOf('month');
                $scope.hourSel2 = 23;
                $scope.minuteSel2 = 59;

                $scope.dateTimeStart = startDate._d;
                $scope.dateTimeEnd = endDate._d;
            } else {
                $scope.dateTimeEnd = null;
                $scope.dateTimeStart = null;
            }
        }
    }

    if ($rootScope.aTrSheetDevice && $rootScope.aTrSheetDevice.length >= 0) {
        for (var i = 0; i < $rootScope.aTrSheetDevice.length; i++) {
            $rootScope.aTrSheetDevice[i].selected = false;
        }
    }
    $scope.lst = [];

    $scope.checkAll = function () {
        $scope.lst = [];
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($rootScope.aTrSheetDevice, function (deviceR) {
            if (deviceR.status == 'running' || deviceR.status == 'stopped' || deviceR.status == 'offline') {
                deviceR.selected = $scope.selectedAll;
                if (deviceR.selected == true) {
                    $scope.lst.push(deviceR);
                } else {
                    $scope.lst.splice($scope.lst.indexOf(deviceR), 1);
                }
            } else {

            }
        });

    };

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
    }

    $scope.changeRadio = function (deviceR, selTruck) {
        if (selTruck) {
            deviceR.selected = true;
            $scope.lstRadio = deviceR;
            $scope.lst[0] = deviceR;
            if ($scope.reportType != 'report_ac' && $scope.reportType != 'report_activity_interval' && $scope.reportType != 'report_activity_trip' && $scope.reportType != 'details_analysis' && $scope.reportType != 'report_driver_activity_single') {
                function getTripNoSuccess(response) {
                    var objData = JSON.parse(response);
                    if (objData) {
                        if (objData.status == 'OK') {
                            if (objData.request == 'get_vehicle_trips') {
                                if (objData.data && objData.data.length > 0) {
                                    $scope.aTripsData = objData.data;
                                } else {
                                    $scope.aTripsData = [];
                                    swal('warning', 'No trip found for this vehicle', 'warning');
                                }
                            }
                        }
                    }
                }

                var getTripNo = {
                    request: "get_vehicle_trips",
                    vehicle_no: deviceR.reg_no
                };
                reportService.getTripNoService(getTripNo, getTripNoSuccess)
            }
        }
    };

    $scope.changeTrip = function (tripD) {
        if (tripD) {
            $scope.tripData = tripD;
            if (!$scope.tripData.start_time) {
                var new_start_date = moment().subtract(1, 'day');
                $scope.hourSel1 = new_start_date.hour();
                $scope.minuteSel1 = new_start_date.minute();
            }
            if (!$scope.tripData.end_time) {
                var new_end_date = moment(new Date());
                $scope.hourSel2 = new_end_date.hour();
                $scope.minuteSel2 = new_end_date.minute();
            }

            $scope.dateTimeStart = $scope.tripData.start_time || new_start_date._d;
            $scope.dateTimeStart = new Date($scope.dateTimeStart);
            var sDT = $scope.dateTimeStart;
            $scope.hourSel1 = sDT.getHours();
            $scope.minuteSel1 = sDT.getMinutes();
            $scope.dateTimeEnd = $scope.tripData.end_time || new_end_date._d;
            $scope.dateTimeEnd = new Date($scope.dateTimeEnd);
            var eDT = $scope.dateTimeEnd;
            $scope.hourSel2 = eDT.getHours();
            $scope.minuteSel2 = eDT.getMinutes();
        }


    };

    $scope.getMin = function () {
        if ($scope.speedLim) {
            if ($scope.speedLim > 49) {
                $scope.minSpeedWrong = true;
                return $scope.speedLim;
            } else {
                /*swal("Select min speed 50km/h");*/
                $scope.minSpeedWrong = false;
                $scope.minS = "Select min speed 50km/h";
            }
        }
    }
    $scope.durationLim = 30;
    $scope.getMinDuration = function () {
        if ($scope.durationLim) {
            if ($scope.durationLim >= 10) {
                $scope.minDurationWrong = true;
                return $scope.durationLim;
            } else {
                /*swal("Select min speed 50km/h");*/
                $scope.minDurationWrong = false;
                $scope.minD = "Select min time 10 minute.";
            }
        }
    }

    function ReportResponse(response) {
        var oRes = response;
        oRes.request = $scope.reportType;
        $rootScope.loader = false;
        if (oRes) {
            if (oRes.status == 'OK') {
                if (oRes.request == 'report_mileage2') {
                    $state.go('main.milage2Reports', {
                        data: {
                            reportData: oRes,
                            time: {
                                start: $scope.dateTimeStart,
                                end: $scope.dateTimeEnd
                            }
                        }
                    });
                } else {
                    $scope.localArrayData = [];
                    $scope.localDateWiseDataArray = [];
                    if (oRes.request == 'report_mileage') {
                        var c = 0;
                        for (var key in oRes.data) {
                            if (key == 'Summary') {
                                console.log(key);
                            } else {
                                $scope.localDateWiseDataArray[c] = {};
                                $scope.localDateWiseDataArray[c].date_local = key;
                                c++;
                            }
                        }

                        for (var j = 0; j < $scope.localDateWiseDataArray.length; j++) {
                            $scope.localDateWiseDataArray[j].data = {};
                            $scope.localDateWiseDataArray[j].data = oRes.data[$scope.localDateWiseDataArray[j].date_local];
                            $scope.localDateWiseDataArray[j].data.data = [];
                            var a = 0;
                            for (var p = 0; p < oRes.device_id.length; p++) {
                                if ($scope.localDateWiseDataArray[j].data[oRes.device_id[p]]) {
                                    var dateWiseData = $scope.localDateWiseDataArray[j].data[oRes.device_id[p]];
                                    dateWiseData.imei = oRes.device_id[p];
                                    /*if(dateWiseData.duration){
                                      dateWiseData.duration = dateWiseData.duration/3600;
                                      dateWiseData.duration = dateWiseData.duration.toFixed(2);
                                    }*/
                                    var duration_calculate = $rootScope.dur_calc(dateWiseData.duration);
                                    dateWiseData.duration = duration_calculate;
                                    if (dateWiseData.distance) {
                                        dateWiseData.distance = dateWiseData.distance / 1000;
                                        dateWiseData.distance = dateWiseData.distance.toFixed(2);
                                    }
                                    for (var s = 0; s < $rootScope.aTrSheetDevice.length; s++) {
                                        if ($rootScope.aTrSheetDevice[s].imei == dateWiseData.imei) {
                                            dateWiseData.reg_no = $rootScope.aTrSheetDevice[s].reg_no;
                                        }
                                    }
                                    $scope.localDateWiseDataArray[j].data.data[a] = $scope.localDateWiseDataArray[j].data[oRes.device_id[p]];
                                    a++;
                                }
                            }
                        }
                    }
                    if (oRes.request == 'report_activity_interval') {
                        var dev_id = [];
                        dev_id[0] = oRes.device_id;
                        oRes.device_id = dev_id;
                    }
                    var s = 0;
                    for (var i = 0; i < oRes.device_id.length; i++) {
                        if (oRes.request == 'report_mileage') {
                            if (oRes.data.Summary[oRes.device_id[i]]) {
                                var inDeviceData = oRes.data.Summary[oRes.device_id[i]];
                                inDeviceData.imei = oRes.device_id[i];
                                /*if(inDeviceData.duration){
                                  inDeviceData.duration = inDeviceData.duration/3600;
                                  inDeviceData.duration = inDeviceData.duration.toFixed(2);
                                }*/
                                var duration_calculate2 = $rootScope.dur_calc(inDeviceData.duration);
                                inDeviceData.duration = duration_calculate2;
                                if (inDeviceData.distance) {
                                    inDeviceData.distance = inDeviceData.distance / 1000;
                                    inDeviceData.distance = inDeviceData.distance.toFixed(2);
                                }
                                for (var b = 0; b < $rootScope.aTrSheetDevice.length; b++) {
                                    if ($rootScope.aTrSheetDevice[b].imei == inDeviceData.imei) {
                                        inDeviceData.reg_no = $rootScope.aTrSheetDevice[b].reg_no;
                                    }
                                }
                            }
                        } else {
                            if (oRes.data[oRes.device_id[i]]) {
                                var inDeviceData;
                                /*if(oRes.request == 'report_activity_interval'){
                                  inDeviceData = {};
                                  oRes.data[oRes.device_id[i]].data = oRes.data[oRes.device_id[i]]
                                  inDeviceData = oRes.data[oRes.device_id[i]];
                                }else{
                                  inDeviceData = oRes.data[oRes.device_id[i]];
                                }*/
                                inDeviceData = oRes.data[oRes.device_id[i]];
                                if (inDeviceData.dur_idle) {
                                    inDeviceData.dur_idle = inDeviceData.dur_idle / 3600;
                                    inDeviceData.dur_idle = inDeviceData.dur_idle.toFixed(2);
                                }
                                /*if(inDeviceData.dur_stop){
                                  inDeviceData.dur_stop = inDeviceData.dur_stop/3600;
                                  inDeviceData.dur_stop = inDeviceData.dur_stop.toFixed(2);
                                }*/
                                var duration_calculate3 = $rootScope.dur_calc(inDeviceData.dur_stop);
                                inDeviceData.dur_stop = duration_calculate3;
                                /*if(inDeviceData.dur_total){
                                  inDeviceData.dur_total = inDeviceData.dur_total/3600;
                                  inDeviceData.dur_total = inDeviceData.dur_total.toFixed(2);
                                }*/
                                var duration_calculate4 = $rootScope.dur_calc(inDeviceData.dur_total);
                                inDeviceData.dur_total = duration_calculate4;

                                if (inDeviceData.tot_dist) {
                                    inDeviceData.tot_dist = inDeviceData.tot_dist / 1000;
                                    inDeviceData.tot_dist = inDeviceData.tot_dist.toFixed(2);
                                }

                                if (inDeviceData.data && inDeviceData.data.length > 0) {
                                    for (var d = 0; d < inDeviceData.data.length; d++) {
                                        if (inDeviceData.data[d].distance) {
                                            inDeviceData.data[d].distance = inDeviceData.data[d].distance / 1000;
                                            inDeviceData.data[d].distance = inDeviceData.data[d].distance.toFixed(2);
                                        }
                                        if (inDeviceData.data[d].drive == true || inDeviceData.data[d].drive == false) {
                                            if (inDeviceData.data[d].drive == true) {
                                                inDeviceData.data[d].driveStatus = 'Running';
                                            } else if (inDeviceData.data[d].drive == false) {
                                                if (inDeviceData.data[d].idle == 'true') {
                                                    inDeviceData.data[d].driveStatus = 'Idle';
                                                } else {
                                                    inDeviceData.data[d].driveStatus = 'Stopped';
                                                }
                                            }
                                        }
                                        //}
                                        /*if(inDeviceData.data[d].duration){
                                          inDeviceData.data[d].duration = inDeviceData.data[d].duration/3600;
                                          inDeviceData.data[d].duration = inDeviceData.data[d].duration.toFixed(2);
                                        }*/
                                        var duration_calculate5 = $rootScope.dur_calc(inDeviceData.data[d].duration);
                                        inDeviceData.data[d].duration = duration_calculate5;

                                        var loading_duration = $rootScope.dur_calc(inDeviceData.data[d].load_dur);
                                        inDeviceData.data[d].load_dur = loading_duration;
                                        var unloading_duration = $rootScope.dur_calc(inDeviceData.data[d].unload_dur);
                                        inDeviceData.data[d].unload_dur = unloading_duration;
                                        var duration_calculate11 = $rootScope.dur_calc(inDeviceData.data[d].lead_load_to_unload);
                                        inDeviceData.data[d].lead_load_to_unload = duration_calculate11;
                                        var duration_calculate22 = $rootScope.dur_calc(inDeviceData.data[d].total_dur);
                                        inDeviceData.data[d].total_dur = duration_calculate22;

                                        if (inDeviceData.data[d].idle_duration) {
                                            inDeviceData.data[d].idle_duration_local = inDeviceData.data[d].idle_duration / 3600;
                                            inDeviceData.data[d].idle_duration_local = inDeviceData.data[d].idle_duration_local.toFixed(2);
                                        }
                                        if (inDeviceData.data[d].start_time) {
                                            inDeviceData.data[d].start_time = moment(inDeviceData.data[d].start_time).format('LLL');
                                        }
                                        if (inDeviceData.data[d].end_time) {
                                            inDeviceData.data[d].end_time = moment(inDeviceData.data[d].end_time).format('LLL');
                                        }
                                        if (inDeviceData.data[d].created_at) {
                                            inDeviceData.data[d].created_at = moment(inDeviceData.data[d].created_at).format('LLL');
                                        }
                                        if (inDeviceData.data[d].load_in) {
                                            inDeviceData.data[d].load_in = moment(inDeviceData.data[d].load_in).format('LLL');
                                        }
                                        if (inDeviceData.data[d].load_out) {
                                            inDeviceData.data[d].load_out = moment(inDeviceData.data[d].load_out).format('LLL');
                                        }
                                        if (inDeviceData.data[d].unload_in) {
                                            inDeviceData.data[d].unload_in = moment(inDeviceData.data[d].unload_in).format('LLL');
                                        }
                                        if (inDeviceData.data[d].unload_out) {
                                            inDeviceData.data[d].unload_out = moment(inDeviceData.data[d].unload_out).format('LLL');
                                        }
                                        if (inDeviceData.data[d].acc_high) {
                                            if (inDeviceData.data[d].acc_high == true) {
                                                inDeviceData.data[d].acc_high = 'ON';
                                            } else {
                                                inDeviceData.data[d].acc_high = 'OFF';
                                            }
                                        }
                                        inDeviceData.data[d].datetime = moment(inDeviceData.data[d].datetime).format('LLL');
                                        inDeviceData.data[d].showBtn = true;

                                        for (var b = 0; b < $rootScope.aTrSheetDevice.length; b++) {
                                            if ($rootScope.aTrSheetDevice[b].imei == inDeviceData.data[d].imei) {
                                                inDeviceData.data[d].reg_no = $rootScope.aTrSheetDevice[b].reg_no;
                                                inDeviceData.reg_no = $rootScope.aTrSheetDevice[b].reg_no;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (oRes.data.Summary) {
                            if (oRes.data.Summary[oRes.device_id[i]]) {
                                $scope.localArrayData[s] = oRes.data.Summary[oRes.device_id[i]];
                                s++;
                            } else {
                                $scope.localArrayData[s] = {};
                                for (var g = 0; g < $rootScope.forGetDeviceList.length; g++) {
                                    if (oRes.device_id[i] == $rootScope.forGetDeviceList[g].imei) {
                                        $scope.localArrayData[s] = $rootScope.forGetDeviceList[g];
                                    }
                                }
                                $scope.localArrayData[s].data = [];
                                $scope.localArrayData[s].data_message = 'Data Not Available';
                                s++;
                            }
                        } else {
                            if (oRes.data[oRes.device_id[i]]) {
                                $scope.localArrayData[i] = oRes.data[oRes.device_id[i]];
                            } else {
                                $scope.localArrayData[i] = {};
                                for (var g = 0; g < $rootScope.forGetDeviceList.length; g++) {
                                    if (oRes.device_id[i] == $rootScope.forGetDeviceList[g].imei) {
                                        $scope.localArrayData[i] = $rootScope.forGetDeviceList[g];
                                    }
                                }
                                $scope.localArrayData[i].data = [];
                                $scope.localArrayData[i].data_message = 'Data Not Available';
                            }
                        }
                    }

                    if (!$rootScope.reportData) {
                        $rootScope.reportData = [];
                    }
                    if ($scope.minTime && oRes.request == 'report_parking' || oRes.request == 'download_report_combined_halts') {
                        oRes.minimum_time_in_mins = $scope.minTime;
                    }
                    if ($scope.speedLim) {
                        oRes.speed_limit = $scope.speedLim;
                    }
                    if ($scope.actMinTime) {
                        oRes.time_interval = $scope.actMinTime;
                    }
                    oRes.dateTimeStart = moment($scope.dateTimeStart).format('LLL');
                    oRes.dateTimeEnd = moment($scope.dateTimeEnd).format('LLL');
                    $rootScope.reportData.push(oRes);
                    $rootScope.reportData[0].localDataArray = $scope.localArrayData;
                    $rootScope.reportData[0].localDateWiseDataArray = $scope.localDateWiseDataArray;
                    //if(oRes.request != 'report_mileage'){
                    $scope.newFakeArray1 = [];
                    $scope.newFakeArray2 = [];
                    if ($rootScope.reportData[0].localDataArray) {
                        var u = 0;
                        var v = 0;
                        for (var f = 0; f < $rootScope.reportData[0].localDataArray.length; f++) {
                            if (!$rootScope.reportData[0].localDataArray[f].data_message) {
                                $scope.newFakeArray1[v] = $rootScope.reportData[0].localDataArray[f];
                                v++;
                            } else {
                                $scope.newFakeArray2[u] = $rootScope.reportData[0].localDataArray[f];
                                u++;
                            }
                        }
                    }
                    $rootScope.reportData[0].localDataArray = [];
                    $rootScope.reportData[0].localDataArray = $scope.newFakeArray1.concat($scope.newFakeArray2);
                    //}
                    console.log($rootScope.reportData);
                    if ($scope.trip_full) {
                        $rootScope.reportData[0].tripInfo = $scope.trip_full;
                    }
                    $rootScope.redirect('/#!/main/basicReportsData');
                    //swal(oRes.message, "", "success");
                    //$uibModalInstance.dismiss('cancel');
                }
            } else if (oRes.status == 'ERROR') {
                //swal(oRes.message, "", "error");
                console.log('Not Found')
            }
        }
    };

    $scope.generateR = function (download = false) {
        let today=new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        today.setMilliseconds(999);
        if(new Date($scope.dateTimeEnd).getTime()>today.getTime() || new Date($scope.dateTimeStart).getTime()>today.getTime()){
            return swal('warning', 'Future date not allowed', 'warning');
        }
        if ($scope.dateTimeEnd && $scope.dateTimeStart) {
            //**** custom time add with date ******//
            var xx = $scope.dateTimeStart;
            xx.setHours($scope.hourSel1);
            xx.setMinutes($scope.minuteSel1);
            xx.setMilliseconds(00);
            $scope.dateTimeStart = xx;
            var yy = $scope.dateTimeEnd;
            yy.setHours($scope.hourSel2);
            yy.setMinutes($scope.minuteSel2);
            $scope.dateTimeEnd = yy;
            let selDevices =[];
            for (var i = 0; i < $scope.lst.length; i++) {
                if($scope.lst[i].activation_time && $scope.lst[i].expiry_time){
                    selDevices.push($scope.lst[i]);
                }
            }
            let deviceR = selDevices && selDevices[0];
            if (deviceR){
                let dateF = new Date(deviceR.activation_time);
                dateF.setHours(00);
                dateF.setMinutes(00);
                dateF.setSeconds(00);
                dateF.setMilliseconds(00);
                deviceR.activation_time=dateF.toISOString();
                let dateT = new Date(deviceR.expiry_time);
                dateT.setHours(23);
                dateT.setMinutes(59);
                dateT.setSeconds(59);
                dateT.setMilliseconds(999);
                deviceR.expiry_time=dateT.toISOString();
    
                let diffYr=new Date(deviceR.expiry_time).getTime()>(new Date().getTime()-(3*31557600000));
                if(diffYr){
                    let isStartTimeValid=new Date(deviceR.activation_time).getTime()<=new Date($scope.dateTimeStart).getTime();
                    //let isEndTimeValid = new Date(deviceR.expiry_time).getTime()>=new Date($scope.dateTimeEnd).getTime();
                    let isEndTimeValid = true;
                    if(!(isStartTimeValid && isEndTimeValid)){
                        //  return swal('Error',"Please select date range between device activation and expiry",'error');
                         return swal('Error',"Please select start date greater or equal to device activation date",'error');
                    }
                    
                }
            }
            

            //**** custom time add with date ******//
            if ($scope.reportType == 'get_trips') {
                $rootScope.reportData = [];
                var report = {};
                report.request = $scope.reportType;
                report.start_time = $scope.dateTimeStart;
                report.end_time = $scope.dateTimeEnd;
                TripService.getAllTripsList(report, ReportResponse);
                $rootScope.loader = true;
                $timeout(function () {
                    $rootScope.loader = false;
                }, 5000);
            } else {
                if ($scope.lst.length > 0 || $scope.reportType == 'report_activity_interval' || $scope.reportType === 'vehicle_exceptions' || $scope.selectedUser.role === 'dealer') {
                    var report = {};
                    $rootScope.reportData = [];
                    $rootScope.forGetDeviceList = [];
                    $rootScope.forGetDeviceList = $scope.lst;
                    $scope.aDevImei = [];
                    $scope.aReg_no = [];
                    report.reportType = $scope.reportType;
                    if ($scope.reportType != 'report_activity_interval') {
                        for (var i = 0; i < $scope.lst.length; i++) {
                            $scope.aDevImei[i] = parseInt($scope.lst[i].imei);
                            $scope.aReg_no[i] = ($scope.lst[i].reg_no);
                        }
                        report.device_id = $scope.aDevImei;
                    }

                    report.request = download ? `download_${$scope.reportType}` : $scope.reportType;
                    report.start_time = $scope.dateTimeStart;
                    report.end_time = $scope.dateTimeEnd;
                    report.selected_uid = $localStorage.user.user_id;
                    report.login_uid = $localStorage.user.user_id;
                    if($scope.reportType === 'report_beat_analysis'){
                        report.reg_no = $scope.aReg_no;
                        report.selected_uid = $localStorage.user.user_id,
                        report.login_uid = $localStorage.user.user_id,
                        report.request = 'report_beat_analysis',
                        report.download = true;
                        download = true;


                    }
                    if($scope.reportType === 'details_analysis'){
                        var someDate = angular.copy($scope.dateTimeStart);
                        var numberOfDaysToAdd = 1;
                        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                        if(report.end_time > someDate)
                        return swal('warning', 'You can get only 24 hr data', 'warning');
                    }
                    if ($scope.reportType == 'report_parking') {
                        $scope.minTime = $scope.minMinutes + ($scope.minHours * 60);
                        report.minimum_time_in_mins = $scope.minTime;
                    }
                    if ($scope.reportType == 'report_combined_halts'){
               $scope.minTime = $scope.minMinutes+($scope.minHours*60);
               report.minimum_time_in_mins = $scope.minTime;
               report.reportType = "report_combined_halts";
               report.request = "download_report_combined_halts";
           }
           if($scope.reportType == 'report_activity_trip') {
                        report.request = 'report_activity';
                        report.trip_no = $scope.trip_full.trip_no;
                    }
                    if ($scope.reportType == 'report_activity_interval') {
                        $scope.actMinTime = $scope.actMinMinutes + ($scope.actMinHours * 60);
                        report.time_interval = $scope.actMinTime;
                        report.device_id = $scope.lstRadio.imei;
                    }
                    if ($scope.reportType == 'report_overspeed') {
                        if ($scope.speedLim && $scope.speedLim > 49) {
                            report.speed_limit = $scope.speedLim;
                            download && (report.download = download);
                        } else {
                            swal("Select min speed 50km/h");
                        }
                    }
                    if ($scope.reportType === 'exception_report' ||
                        $scope.reportType === 'event_report' ||
                        $scope.reportType === 'vehicle_exceptions' ||
                        $scope.reportType === 'driver_day_activity' ||
                        $scope.reportType === 'action_event_report'||
                        $scope.reportType === 'day_wise_tag_report') {let oFilter = {};
                        download && (oFilter.download = download);
                        oFilter.imei = report.device_id;
                        if($scope.rfid && $scope.rfid.rfid)
                            oFilter.rfid = $scope.rfid.rfid;

                        oFilter.from = report.start_time;
                        oFilter.to = report.end_time;
                        oFilter.login_uid = $localStorage.user.user_id;
                        oFilter.user_id = $localStorage.user.user_id;

                        if ($scope.reportType == 'exception_report') {
                            oFilter.code = ['over_speed','sos','hb','ha','idle','fw','nd','cd','tl'];
                            oFilter.download = true;
                            gpsAnalyticService.alertReport(oFilter, true ? downlaodRpt : ReportResponse);
                        } if ($scope.reportType == 'vehicle_exceptions') {
                            oFilter.imei = oFilter.imei.length ? oFilter.imei : undefined;
                            download && (oFilter.download = download);
                            gpsAnalyticService.vehicleExceptionsRpt(oFilter, download ? downlaodRpt : vehicleExceptionView);
                        }
                        else if ($scope.reportType == 'event_report') {
                            oFilter.no_of_docs = 2000;
                            // gpsAnalyticService.getAlerts(oFilter, onSuccess, onFailure);

                            oFilter.download = true;
                            gpsAnalyticService.getAlerts(oFilter, true ? downlaodRpt : ReportResponse);
                        } else if ($scope.reportType == 'action_event_report') {
                            oFilter.no_of_docs = 2000;
                            // download && (oFilter.download = download);
                            oFilter.download = true;
                            gpsAnalyticService.getActionAlerts(oFilter, true ? downlaodRpt : ReportResponse);
                        } else if ($scope.reportType == 'day_wise_tag_report') {
                            oFilter.no_of_docs = 2000;
                            download && (oFilter.download = download);
                            gpsAnalyticService.getDayWiseTagReport(oFilter, download ? downlaodRpt : ReportResponse);
                        } else if ($scope.reportType == 'driver_day_activity') {
                            let request = {
                                "request": "driver_day_activity",
                                "reportType": "driver_day_activity",
                                "version": 2,
                                "device_id": report.device_id,
                                "start_time": report.start_time,
                                "end_time": report.end_time,
                                "selected_uid": $localStorage.user.user_id,
                                "login_uid": $localStorage.user.user_id
                            };
                            // gpsAnalyticService.driverDayActivity(request, onSuccess, onFailure)
                            // download && (request.download = download);
                            request.download = true;
                            gpsAnalyticService.driverDayActivity(request, true ? downlaodRpt : ReportResponse);
                        }
                    } else {
                        download && (report.download = download);
                        gpsAnalyticService.downloadReport(report, download ? downlaodRpt : ReportResponse);
                    }
                } else {
                    swal("Please select vehicle ");
                }
            }
        } else {
            swal("Please select date 'from' and 'to' ");
        }
    };

    function vehicleExceptionView(response) {

            $uibModal.open({
                templateUrl: 'views/reports/vehicleExceptionView.html',
                controller: ['$uibModalInstance', '$uibModal', 'gpsAnalyticService', 'otherData', vehicleExceptionViewController],
                controllerAs: 'veVm',
                resolve: {
                    otherData: function () {
                        return {
                            aData: response,
                            from: $scope.dateTimeStart,
                            to: $scope.dateTimeEnd
                        };
                    }
                },
            }).result.then(function (response) {
                console.log('close', response);
            }, function (data) {
                console.log('cancel', data);
            });
    }


    $scope.getAllRfid = function (viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {

                let req = {
                    rfid: viewValue
                };

                gpsAnalyticService.getRfidName(req, res => {
                    resolve(res.data);
                }, err => {
                    console.log`${err}`;
                    reject([]);
                });

            });
        }

        return [];
    };

    $scope.onRfidSelect = function (item) {
        $scope.aRfid = $scope.aRfid || [];
        if ($scope.aRfid.length < 10)
            $scope.aRfid.push(item);
        else
            return swal('Warning', 'you can not select more then 10 rfid!!!!!', 'warning');
        $scope.rfid = '';
    };
    $scope.removeRfid = function (select, index) {
        $scope.aRfid.splice(index, 1);
    };

    function downlaodRpt(data) {
        $rootScope.loader = false;
        if(data.status === 'ERROR')
             swal('Error', data.message, 'error');
        let url = data.url || data.data;
        if (url) {
            let a = document.createElement('a');
            a.href = url;
            a.download = url;
            a.target = '_blank';
            a.click();
        }
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

});

materialAdmin.controller('reportsDataCtrl', function ($rootScope, $localStorage, $stateParams, $interval, $state, $scope, $uibModal, reportService, TripService, $timeout, $http, gpsAnalyticService) {
    $rootScope.showSideBar = false;
    /*var socket = $rootScope.getSocket();
    if(socket){
      ss(socket).on('excel', function(stream, data) {
        stream.pipe(fs.createWriteStream('name.xlsx'));
      });
    }*/
    //$scope.mileage2 = false;
    if ($rootScope.reportData[0].request == 'report_geofence_schedule') {
        $scope.status = {
            open2: true,
            isFirstDisabled: false
        };
    }

    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        isFirstDisabled: false
    };

    if ($rootScope.reportData[0].request == 'report_geofence_schedule') {
        $scope.status = {
            open2: true,
            isFirstDisabled: false
        };
    }

    $scope.reportHeader = function () {
        if ($rootScope.reportData && $rootScope.reportData[0]) {
            if ($rootScope.reportData[0].request == 'report_overspeed') {
                return "Overspeed Report";
            } else if ($rootScope.reportData[0].request == 'report_parking') {
                return "Halt Report";
            } else if ($rootScope.reportData[0].request == 'download_report_combined_halts'){
          return "Combined Halts Report";
      }
      else if($rootScope.reportData[0].request == 'report_acc') {
                return "Acc Report";
            } else if ($rootScope.reportData[0].request == 'get_trips') {
                return "Trip Report";
            } else if ($rootScope.reportData[0].request == 'report_activity') {
                if ($rootScope.reportData[0].tripInfo) {
                    return "Trip Activity Report"
                } else {
                    return "Activity Report";
                }
            } else if ($rootScope.reportData[0].request == 'report_mileage') {
                return "Mileage Report";
            } else if ($rootScope.reportData[0].request == 'report_activity_interval') {
                return "Detailed Activity Report";
            } else if ($rootScope.reportData[0].request == 'report_geofence_schedule') {
                return "Geofence Schedule Report";
            } else if ($rootScope.reportData[0].request == 'report_geofence_schedule') {
                return "Geofence Schedule Report";
            } else {
                return "Other Report";
            }
        } else {
            return "No Report Found";
        }
    }
    $scope.timeLimit = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].minimum_time_in_mins) {
            return "Minimum time:- " + $rootScope.reportData[0].minimum_time_in_mins + " (minutes)";
        } else {
            return "";
        }
    }
    $scope.speedLimit = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].speed_limit) {
            return "Minimum Speed:- " + $rootScope.reportData[0].speed_limit + " (km/h)";
        } else {
            return "";
        }
    }
    $scope.dateStart = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].dateTimeStart) {
            return "From:- " + $rootScope.reportData[0].dateTimeStart;
        } else {
            return "";
        }
    }
    $scope.dateEnd = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].dateTimeEnd) {
            return "To:- " + $rootScope.reportData[0].dateTimeEnd;
        } else {
            return "";
        }
    }

    $scope.backReport = function () {
        $rootScope.redirect('/#!/main/basicReports');
    }

    /********************** reverse geocoding google server *****************************/
    //$scope.showBtn = true;
    /*$rootScope.viewAddr = function(index){
      var geocoder;
      geocoder = new google.maps.Geocoder();
      if(index.start && index.start.latitude && index.start.longitude){
        var lat = index.start.latitude;
        var lng = index.start.longitude;
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
                index.showBtn = false;
              });
            }else{
              $scope.$apply(function() {
                index.formatedAddr = 'NA';
                index.showBtn = false;
              });
            }
          }else{

                index.formatedAddr = 'NA';
                index.showBtn = false;

          }
      });
    }*/

    /********************** reverse geocoding google server *****************************/

    /*************** reverse geocoding own server ****************/

    $rootScope.viewAddr = function(index){

        if (index.start && index.start.latitude && index.start.longitude) {
            var lat = index.start.latitude;
            var lng = index.start.longitude;
        } else {
            var lat = index.lat;
            var lng = index.lng;
        }

        if(!lat || !lng){
            return;
        }

        var searchValue = {lat:lat,lon:lng};
        gpsAnalyticService.getAddress(searchValue,success,failure);

        function success(response){
            console.log(response);
            index.formatedAddr = response.display_name;
            index.showBtn = false;
        }
        function failure(response){
            console.log(response);
            index.formatedAddr = response.statusText;
            index.showBtn = false;
        }

    }
    /*************** reverse geocoding own server ****************/
    //$rootScope.reportData

    $scope.dwnldXlsx = function (reportData) {
        //for(var j=0; j< reportData.length;j++){
        function downlaodRpt(data) {
            $rootScope.loader = false;
            let url = data.url || data.data;
            if (url) {
                let a = document.createElement('a');
                a.href = url;
                a.download = url;
                a.target = '_blank';
                a.click();
            }
        }


        var xlDownload = {};
        xlDownload.reportType = reportData[0].request;
        if (reportData[0].request == 'get_trips') {
            xlDownload.request = 'download_report_trip';
            xlDownload.start_time = reportData[0].dateTimeStart;
            xlDownload.end_time = reportData[0].dateTimeEnd;
            xlDownload.download = true;
            TripService.downloadReport(xlDownload, downlaodRpt);
        } else {
            if (reportData[0].tripInfo) {
                reportData[0].request = 'report_activity_trip';
                xlDownload.driver = reportData[0].tripInfo.driver;
                xlDownload.trip_no = reportData[0].tripInfo.trip_no;
                xlDownload.route = reportData[0].tripInfo.route;
            }
            xlDownload.request = 'download_' + reportData[0].request;
            if (reportData[0].request != 'report_activity_interval') {
                xlDownload.device_id = [];
                xlDownload.device_id = reportData[0].device_id;
            } else {
                xlDownload.device_id = reportData[0].device_id[0];
            }
            xlDownload.start_time = reportData[0].dateTimeStart;
            xlDownload.end_time = reportData[0].dateTimeEnd;
            if (reportData[0].request == 'report_parking') {
                xlDownload.minimum_time_in_mins = reportData[0].minimum_time_in_mins;
            } if(reportData[0].request == 'download_report_combined_halts'){
              xlDownload.minimum_time_in_mins = reportData[0].minimum_time_in_mins;
        }else if (reportData[0].request == 'report_overspeed') {
                xlDownload.speed_limit = reportData[0].speed_limit;
            } else if (reportData[0].request == 'report_activity_interval') {
                xlDownload.time_interval = reportData[0].time_interval;
            }
            /*if(reportData[0].tripInfo){
                xlDownload.driver = reportData[0].tripInfo.driver;
                xlDownload.trip_no = reportData[0].tripInfo.trip_no;
                xlDownload.route = reportData[0].tripInfo.route;
            }*/
            xlDownload.download = true;
            gpsAnalyticService.downloadReport(xlDownload, downlaodRpt);
        }
        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 5000);
        //};
    };

    /*$scope.aFormats = [
      {
        'name'  :'Excel',
        'scope' :'xlsx'
      },
      {
        'name'  :'CSV',
        'scope' :'csv'
      },
      {
        'name'  :'PDF',
        'scope' :'pdf'
      }
    ];*/

    /*$scope.selectFormat = function() {
      console.log($scope.sFormat);
      if($scope.sFormat == 'xlsx'){
        $scope.dwnldXlsx();
      }
    };*/

    $scope.showOnMap = function (listData) {
        if (listData.start && listData.start.latitude) {
            listData.reg_no = listData.reg_no;
            $rootScope.sMapViewData = listData;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/playback/singleViewOnMap.html',
                controller: 'sViewOnMapCtrl'
            });
        }
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.report = function () {
        $rootScope.redirect('/#!/main/basicReports');
    };

});

materialAdmin.controller("downloadReportCtrl", function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, reportService) {
    $rootScope.showSideBar = false;
    $rootScope.geofence;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $rootScope.hmapLocalDevices = {};
    if ($rootScope.selectedUser.devices && $rootScope.selectedUser.devices.length > 0) {
        for (var i = 0; i < $rootScope.selectedUser.devices.length; i++) {
            $rootScope.hmapLocalDevices[$rootScope.selectedUser.devices[i].imei] = $rootScope.selectedUser.devices[i];
        };
    }

    $scope.selectedReport = {};
    $scope.selectedReport = $rootScope.download;
    if ($scope.selectedReport.request == 'download_report_activity_interval') {
        var abbcc = $scope.selectedReport.device_id;
        $scope.selectedReport.device_id = [];
        $scope.selectedReport.device_id[0] = abbcc;
    }
    if ($scope.selectedReport.device_id && $scope.selectedReport.device_id.length > 0) {
        $scope.selectedReport.device_reg_no = [];
        for (var x = 0; x < $scope.selectedReport.device_id.length; x++) {
            $scope.selectedReport.device_reg_no[x] = $rootScope.hmapLocalDevices[$scope.selectedReport.device_id[x]].reg_no;
        }
    }

    $scope.downloadConfirm = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //******* end remove zone *************//

});


materialAdmin.controller('reportsMilage2Ctrl', function ($rootScope, $localStorage, $stateParams, $interval, $state, $scope, $uibModal, reportService, TripService, $timeout, $http, gpsAnalyticService) {
    $rootScope.showSideBar = false;
    var oRemoteData;
    var reportData;
    var tableHeader;
    var tableDataHeader;
    $scope.aTableData = [];
    $rootScope.aTrSheetDevice = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;
    if ($stateParams.data) {
        oRemoteData = $stateParams.data;
        console.log(oRemoteData)
        if ($stateParams.data && $stateParams.data.reportData) {
            reportData = $stateParams.data.reportData;
            reportData.headers.shift();
            tableHeader = angular.copy(reportData.headers);
            tableDataHeader = angular.copy(reportData.headers);

            tableDataHeader.push("total_dist", "reg_no");
            tableDataHeader.reverse();

            tableHeader.push("Total Distance", "Vehicle");
            tableHeader.reverse();
        }
    }

    if (reportData.data && reportData.data[0]) {
        for (var i = 0; i < reportData.data.length; i++) {
            for (var j = 0; j < $rootScope.aTrSheetDevice.length; j++) {
                if (reportData.data[i].imei === $rootScope.aTrSheetDevice[j].imei) {
                    reportData.data[i].reg_no = $rootScope.aTrSheetDevice[j].reg_no;
                    reportData.data[i].total_dist = parseInt(reportData.data[i].total_dist) / 1000;
                    reportData.data[i].total_dist = reportData.data[i].total_dist.toFixed(2);

                    var duration_calculate = $rootScope.dur_calc(reportData.data[i].total_dur);
                    reportData.data[i].total_dur = duration_calculate;

                    for (var key in reportData.data[i]) {
                        if (
                            (key != 'average_speed')
                            && (key != 'imei')
                            && (key != 'top_speed')
                            && (key != 'total_dur')
                            && (key != 'total_dist')
                            && (key != 'reg_no')
                        ) {
                            reportData.data[i][key] = (parseInt(reportData.data[i][key]) / 1000).toFixed(2);
                        }
                    }
                    $scope.aTableData.push(reportData.data[i])
                }
            }
        }
    }


    $scope.aTableHeader = tableHeader;
    $scope.aTableDataHeader = tableDataHeader;

    $scope.report2Header = function () {
        if (reportData) {
            if (reportData.request == 'report_mileage2') {
                return "Kilometer Report";
            } else {
                return "Other Report";
            }
        } else {
            return "No Report Found";
        }
    }
    $scope.timeLimit = function () {
        if (false) {
            return "Minimum time:- " + $rootScope.reportData[0].minimum_time_in_mins + " (minutes)";
        } else {
            return "";
        }
    }
    $scope.speedLimit = function () {
        if (false) {
            return "Minimum Speed:- " + $rootScope.reportData[0].speed_limit + " (km/h)";
        } else {
            return "";
        }
    }
    $scope.dateStart = function () {
        if (oRemoteData && oRemoteData.time && oRemoteData.time.start) {
            return "From:- " + moment(oRemoteData.time.start).format('LL'); // February 2nd 2017, 12:20:36 pm

        } else {
            return "";
        }
    }
    $scope.dateEnd = function () {
        if (oRemoteData && oRemoteData.time && oRemoteData.time.end) {
            return "To:- " + moment(oRemoteData.time.end).format('LL');
        } else {
            return "";
        }
    }

    $scope.backReport = function () {
        $rootScope.redirect('/#!/main/basicReports');
    }


    $scope.dwnldXlsx = function () {

        function downlaodRpt(data) {
            $rootScope.loader = false;
            let url = data.url || data.data;
            if (url) {
                let a = document.createElement('a');
                a.href = url;
                a.download = url;
                a.target = '_blank';
                a.click();
            }
        }


        var xlDownload = {};
        xlDownload.reportType =  reportData.request;
        xlDownload.request = 'download_' + reportData.request;
        xlDownload.device_id = reportData.device_id;

        xlDownload.start_time = oRemoteData.time.start;
        xlDownload.end_time = oRemoteData.time.end;
        xlDownload.download = true;

        gpsAnalyticService.downloadReport(xlDownload, downlaodRpt);

        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 5000);
        //};
    };


    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.report = function () {
        $rootScope.redirect('/#!/main/basicReports');
    };

});

function vehicleExceptionViewController(
    $uibModalInstance,
    $uibModal,
    gpsAnalyticService,
    otherData,
) {

    let vm = this;

    // functions Identifiers
    vm.closeModal = closeModal;
    vm.detailView = detailView;

    // INIT functions
    (function init() {
        vm.aAllAlerts = [];
        vm.aPageState = [
            [0, 0, 0, 0, 0]
        ];

        vm.maxSize = 3;
        vm.bigTotalItems = 0;
        vm.bigCurrentPage = 1;
        vm.oSheetData = {};
        vm.oExceptionData = angular.copy(otherData.aData.data);
        vm.from = angular.copy(otherData.from);
        vm.to = angular.copy(otherData.to);
    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function detailView(exception, type) {
        if (exception.aCode && exception.aCode.length) {

            $uibModal.open({
                templateUrl: 'views/tripSheet/detailView.html',
                controller: ['$rootScope', '$scope', '$uibModalInstance', '$localStorage', 'gpsAnalyticService', 'otherUtils', 'otherData', detailViewController],
                controllerAs: 'dvVm',
                resolve: {
                    otherData: function () {
                        return {
                            aData: exception,
                            type: type,
                            filter: {from_date : vm.from, to_date: vm.to}
                        };
                    }
                },
            }).result.then(function (response) {
                console.log('close', response);
            }, function (data) {
                console.log('cancel', data);
            });
        } else {
            swal('Error!', 'Data Not Found', 'error');
        }
    }

    vm.pageChanged = function () {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        // $rootScope.getPageNo = $scope.bigCurrentPage-1;
    };

}
