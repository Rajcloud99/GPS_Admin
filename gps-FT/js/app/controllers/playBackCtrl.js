materialAdmin.controller('playBackCtrl', function ($rootScope, $localStorage, DateUtils, $stateParams, $interval, $state, $scope, playBackService, $timeout) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $rootScope.states.actItm = 'playback';

    if ($rootScope.trackSheetResStore.total_count !== $rootScope.aTrSheetDevice.length) {
        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 10000);
    }

    //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.toggleMinMaxDate = function (type) {
        $scope.dateOptions1.maxDate = ($scope.dateTimeEnd || new Date());
        $scope.dateOptions2.minDate = ($scope.dateTimeStart || new Date());
    };
    //$scope.toggleMin();

    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions1 = {
        //dateDisabled: disabled,
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
    //********************//end//**********************//*****************//
    $scope.aHours = [];
    for (var h = 0; h < 24; h++) {
        $scope.aHours[h] = h;
    }
    $scope.aMinutes = [];
    for (var m = 0; m < 60; m++) {
        $scope.aMinutes[m] = m;
    }
    //************* custome Date time Picker for multiple date selection in single form ******************
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
    $scope.hourSel1 = 0;
    $scope.hourSel2 = 23;
    $scope.minuteSel1 = 0;
    $scope.minuteSel2 = 59;

    //$rootScope.aTrSheetDevice = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;

    $scope.aTimeFilter = ['Last Hour', 'Today', 'Yesterday', 'Last 2 days', 'Last 3 days', 'Last Week', 'Last Month'];

    $scope.filterMe = function (timeFilter) {
        if (timeFilter == 'Last Hour') {
            var currentTime = moment()._d;
            var lastHourTime = moment(currentTime).subtract(1, 'hours')._d;
            $scope.dateTimeEnd = currentTime;
            $scope.dateTimeStart = lastHourTime;
        }
        else if (timeFilter == 'Today') {
            var fromTime = moment();
            var toTime = moment(fromTime);
            fromTime.hour(00);
            fromTime.minute(00);
            fromTime.second(00);
            fromTime.millisecond(00);

            toTime.hour(23);
            toTime.minute(59);
            toTime.second(59);
            $scope.dateTimeEnd = toTime._d;
            $scope.dateTimeStart = fromTime._d;
        }
        else if (timeFilter == 'Yesterday') {
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
            $scope.dateTimeEnd = toTime._d;
            $scope.dateTimeStart = fromTime._d;
        }
        else if (timeFilter == 'Last 2 days') {
            var currentDate = moment().subtract(1, 'day');
            var last2Day = currentDate.clone().subtract(1, 'day');
            last2Day.hour(00);
            last2Day.minute(00);
            last2Day.second(00);
            last2Day.millisecond(00);

            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = last2Day._d;
        }
        else if (timeFilter == 'Last 3 days') {
            var currentDate = moment().subtract(1, 'day');
            var last3day = currentDate.clone().subtract(2, 'day');
            last3day.hour(00);
            last3day.minute(00);
            last3day.second(00);
            last3day.millisecond(00);

            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = last3day._d;
        }
        else if (timeFilter == 'Last Week') {
            var currentDate = moment().subtract(1, 'day');
            var lastweek = currentDate.clone().subtract(6, 'day');
            lastweek.hour(00);
            lastweek.minute(00);
            lastweek.second(00);
            lastweek.millisecond(00);

            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = lastweek._d;
        }
        else if (timeFilter == 'Last Month') {
            var currentDate = moment();
            var lastMonth = currentDate.clone().subtract(1, 'month');
            lastMonth.hour(00);
            lastMonth.minute(00);
            lastMonth.second(00);
            lastMonth.millisecond(00);

            currentDate.hour(23);
            currentDate.minute(59);
            currentDate.second(59);
            $scope.dateTimeEnd = currentDate._d;
            $scope.dateTimeStart = lastMonth._d;
        }
    }

    if ($rootScope.aTrSheetDevice && $rootScope.aTrSheetDevice.length > 0) {
        for (var i = 0; i < $rootScope.aTrSheetDevice.length; i++) {
            $rootScope.aTrSheetDevice[i].selected = false;
        }
    }
    $scope.toEnableBtn = false;
    $scope.setDefault = function (deviceR) {
        angular.forEach($rootScope.aTrSheetDevice, function (p) {
            p.selected = false; //set them all to false
        });
        deviceR.selected = true; //set the clicked one to true
        $scope.toEnableBtn = true;
    };

    function playBackResponse(response) {
        var oRes = JSON.parse(response);
        $rootScope.loader = false;
        if (oRes && oRes.data && oRes.data.length) {
            if (oRes.status === 'OK') {
                for (var i = 0; i < oRes.data.length; i++) {
                    oRes.data[i].start_time_cal = oRes.data[i].start_time;
                    oRes.data[i].end_time_cal = oRes.data[i].end_time;
                    oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
                    oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
                    if (oRes.data[i].duration) {
                        oRes.data[i].duration = oRes.data[i].duration / 3600;
                        oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
                        oRes.data[i].duration = parseFloat(oRes.data[i].duration);
                    }
                    if (oRes.data[i].distance) {
                        oRes.data[i].distance = oRes.data[i].distance / 1000;
                        oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
                    }
                }
                if (oRes.tot_dist) {
                    oRes.tot_dist = oRes.tot_dist / 1000;
                    oRes.tot_dist = oRes.tot_dist.toFixed(2);
                }
                $rootScope.playData = oRes;
                $rootScope.redirect('/#!/main/playPosition');
            }
            else if (oRes.status === 'ERROR') {
                //swal(oRes.message, "", "error");
            }
        } else {
            $rootScope.loader = false;
        }

    }

    $scope.playB = function () {
        $rootScope.playData = {};
        for (var i = 0; i < $rootScope.aTrSheetDevice.length; i++) {
            if ($rootScope.aTrSheetDevice[i].selected === true) {
                $scope.selTruck = $rootScope.aTrSheetDevice[i];
            }
        }
        if ($scope.dateTimeEnd && $scope.dateTimeStart) {
            //**** custom time add with date ******//
            var xx = $scope.dateTimeStart;
            xx.setHours($scope.hourSel1);
            xx.setMinutes($scope.minuteSel1);
            xx.setMilliseconds(0);
            $scope.dateTimeStart = xx;
            var yy = $scope.dateTimeEnd;
            yy.setHours($scope.hourSel2);
            yy.setMinutes($scope.minuteSel2);
            $scope.dateTimeEnd = yy;

            //**** custom time add with date ******//
            if ($scope.selTruck) {
                $rootScope.reportData = [];

                var playBack = {};
                playBack.request = 'playback';
                playBack.version = 2;
                playBack.device_id = $scope.selTruck.imei;
                playBack.start_time = $scope.dateTimeStart;
                playBack.end_time = $scope.dateTimeEnd;

                if($scope.selTruck && $scope.selTruck.activation_time && $scope.selTruck.expiry_time){
                    let dateF = new Date($scope.selTruck.activation_time);
                    dateF.setHours(00);
                    dateF.setMinutes(00);
                    dateF.setSeconds(00);
                    dateF.setMilliseconds(00);
                    $scope.selTruck.activation_time=dateF.toISOString();
                    let dateT = new Date($scope.selTruck.expiry_time);
                    dateT.setHours(23);
                    dateT.setMinutes(59);
                    dateT.setSeconds(59);
                    dateT.setMilliseconds(999);
                    $scope.selTruck.expiry_time=dateT.toISOString();

                    let diffYr=new Date($scope.selTruck.expiry_time).getTime()>(new Date().getTime()-(3*31557600000));
                    if(diffYr){
                        let isStartTimeValid=new Date($scope.selTruck.activation_time).getTime()<=new Date(playBack.start_time).getTime();
                        //let isEndTimeValid = new Date($scope.selTruck.expiry_time).getTime()>=new Date(playBack.end_time).getTime();
                        let isEndTimeValid = true;
                        if(!(isStartTimeValid && isEndTimeValid)){
                            // return swal('Error',"Please select date range between device activation and expiry",'error');
                             return swal('Error',"Please select start date greater or equal to device activation date",'error');
                            }
                        
                    }
                }

                //playBack.login_uid = $localStorage.user.user_id;
                //playBack.token = $localStorage.user.token;
                $rootScope.selectedDevicekGlobalData = $scope.selTruck;
                playBackService.getplayData(playBack, playBackResponse);

                $rootScope.loader = true;
                $timeout(function () {
                    $rootScope.loader = false;
                }, 30000);
            } else {
                swal("Please select vehicle ");
            }
        } else {
            swal("Please select date 'from' and 'to' ");
        }
    };

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

});

materialAdmin.controller('playPositionCtrl', function ($rootScope, $scope, DateUtils, $uibModal, utils, LoginService, GoogleMapService, landmarkService, $localStorage, $interval, playBackService, $timeout, objToCsv) {
    $scope.alandMarkList = [];
    $scope.showIcon = false;
    $rootScope.againInitialiseCtrl = function () {
        $rootScope.showSideBar = false;
        $rootScope.states = {};
        $rootScope.states.actItm = 'playback';
        if (!$rootScope.selectedUser) {
            $rootScope.selectedUser = $localStorage.user;
        }
        var map;

        //*************** custome Date time Picker for multiple date selection in single form ************
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.toggleMinMaxDate = function (type) {
            $scope.dateOptions1.maxDate = ($scope.end_date_cal || new Date());
            $scope.dateOptions2.minDate = ($scope.start_date_cal || new Date());
        };
        //$scope.toggleMin();

        $scope.open = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
        };

        $scope.dateOptions1 = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: ($scope.end_date_cal || new Date()),
            //minDate: $scope.minDate ? null : new Date(),
            startingDay: 1
        };
        $scope.dateOptions2 = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: ($scope.start_date_cal || new Date()),
            startingDay: 1
        };

        $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
        $scope.formateDate = function (date) {
            return new Date(date).toDateString();
        };
        //********************/end/**********************//*****************//

        $scope.aHours = [];
        for (var h = 0; h < 24; h++) {
            $scope.aHours[h] = h;
        }
        $scope.aMinutes = [];
        for (var m = 0; m < 60; m++) {
            $scope.aMinutes[m] = m;
        }
        //************* custome Date time Picker for multiple date selection in single form ******************

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
                    $scope.wrongDateRange = true;
                }
            }
        };
        $scope.hourSel1 = 0;
        $scope.hourSel2 = 0;
        $scope.minuteSel1 = 0;
        $scope.minuteSel2 = 0;

        /**
         * Convert seconds to hh-mm-ss format.
         * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
         **/
        var SecondsTohhmmss = function (totalSeconds) {
            totalSeconds = totalSeconds * 3600;
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

            // round seconds
            seconds = Math.round(seconds * 100) / 100

            var result = (hours < 10 ? "0" + hours : hours) + " hours ";
            result += (minutes < 10 ? "0" + minutes : minutes) + " minutes ";
            //result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
            return result;
        };

        $scope.slider = {
            value: 10,
            options: {
                floor: 10,
                ceil: 100,
                step: 10,
                showSelectionBar: true,
                getSelectionBarColor: function (value) {
                    if (value <= 30)
                        return '#2AE02A';
                    if (value <= 50)
                        return 'yellow';
                    if (value <= 70)
                        return 'orange';
                    return 'red';
                }
            }
        };
        //**********secnds into hours minutes seconds end **********//

        if ($localStorage.onLocalselectedUser && $localStorage.onLocalselectedUser.devices) {
            for (var j = 0; j < $localStorage.onLocalselectedUser.devices.length; j++) {
                if ($localStorage.onLocalselectedUser.devices[j].imei === $rootScope.playData.device_id) {
                    $rootScope.playData.reg_no = $localStorage.onLocalselectedUser.devices[j].reg_no;
                }
            }
        } else {
            for (var j = 0; j < ($localStorage.user.devices && $localStorage.user.devices.length); j++) {
                if ($localStorage.user.devices[j].imei === $rootScope.playData.device_id) {
                    $rootScope.playData.reg_no = $localStorage.user.devices[j].reg_no;
                }
            }
        }
        $scope.aPlayPosiData = $rootScope.playData.data;
        console.log($rootScope.playData);
        var p = $scope.aPlayPosiData.length - 1;
        $scope.firstLocation = $scope.aPlayPosiData[0]; //first location data
        $scope.lastLocation = $scope.aPlayPosiData[p]; //last location data


        //*********************//
        var id = document.getElementById("playMap");

        if (id && id.children.length > 0) {
            if ($rootScope.countPlay === 2) {
                var ccc = "<div id='" + $rootScope.countPlay + "' style='width: 100%; height: 100%;'></div>";
                document.getElementById('playMap').innerHTML = ccc;
            } else {
                var minusCount = $rootScope.countPlay - 1;
                document.getElementById(minusCount.toString()).innerHTML = "<div id='" + $rootScope.countPlay + "' style='width: 100%; height: 100%;'></div>";
            }
            var map = utils.initializeMapView($rootScope.countPlay.toString(), false, false).map;
        } else {
            map = utils.initializeMapView('playMap', false, false).map;
            $rootScope.countPlay = 1;
        }

        function getSVG() {
            var iColor = "#15e425";
            var svgCode = utils.takeIcon($rootScope.selectedDevicekGlobalData.icon, iColor);
            return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
        }

        function getLineIconSvg(color) {
            var iColor = color || "blue";
            var svgCode = utils.lineMarkerSvg(iColor);
            return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
        }

        var LeafIcon = L.Icon.extend({
            options: {
                iconSize: [36, 45],
                iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
            }
        });


        var lineIconOptions = L.Icon.extend({
            options: {
                iconSize: [15, 15],
                iconAnchor: [7.5, 7.5]
            }
        });

        var runIconLeaf = L.Icon.extend({
            options: {
                iconSize: [50, 50],
                iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
            }
        });

        var startIcon = new LeafIcon({iconUrl: 'img/start.png'}),
            stopIcon = new LeafIcon({iconUrl: 'img/stop.png'}),
            lineIcon = new lineIconOptions({iconUrl: getLineIconSvg()}),
            runIcon = new runIconLeaf({iconUrl: getSVG()}),
            flagIcon = new LeafIcon({iconUrl: 'img/stopFlag.png'}),
            pillarIcon = new LeafIcon({iconUrl: 'img/pillar.png'}),
            turnIcon = new LeafIcon({iconUrl: 'img/turn.png'}),
            stationIcon = new LeafIcon({iconUrl: 'img/station.png'}),
            otherIcon = new LeafIcon({iconUrl: 'img/other.png'}),
            bridgeIcon = new LeafIcon({iconUrl: 'img/bridge.png'}),
            powerIcon = new LeafIcon({iconUrl: 'img/power.png'}),
            signalIcon = new LeafIcon({iconUrl: 'img/signal.png'}),
            olightIcon = new LeafIcon({iconUrl: 'img/olight.png'}),
            dotIcon = new LeafIcon({iconUrl: 'img/dot.png'}),
            lcrossingIcon = new LeafIcon({iconUrl: 'img/lcrossing.png'}),
            pcrossingIcon = new LeafIcon({iconUrl: 'img/pcrossing.png'}),
            h = $scope.aPlayPosiData.length - 1;


        //map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
        var polylinePoints = [];
        $scope.newDriveAllPoints = [];
        var arrLatLng = [];

        var pointA = new L.LatLng($scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude);
        polylinePoints.push(pointA);
        arrLatLng.push([$scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude]);
        $scope.newDriveAllPoints.push($scope.aPlayPosiData[0]);

        for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
            if ($scope.aPlayPosiData[i].drive === false) {
                var pointmid = new L.LatLng($scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude);
                polylinePoints.push(pointmid);
                arrLatLng.push([$scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude]);
                $scope.newDriveAllPoints.push($scope.aPlayPosiData[i]);
                var stopPopup = '<div class="map-popup">' +
                    '<p class="pp-hd">Stop Info</p>' +
                    '<p>Strt Time: <span>' + $scope.aPlayPosiData[i].start_time + '</span></p>' +
                    '<p>End Time: <span>' + $scope.aPlayPosiData[i].end_time + '</span></p>' +
                    '<p>Residence : <span>' + SecondsTohhmmss($scope.aPlayPosiData[i].duration) + '</span></p>' +
                    '<p>Address &nbsp;&nbsp;&nbsp; : <span>' + $scope.aPlayPosiData[i].start_addr + '</span></p>' +
                    '<p>Nearest Landmark : <span>' + $scope.aPlayPosiData[i].NearLandMark + '</span></p>' +
                    '</div>';
                var marker = L.marker([$scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude], {icon: flagIcon}).bindPopup(stopPopup).openPopup().on('click', onMarkerClick);
                marker.addTo(map);

            } 
            //else {
                if ($scope.aPlayPosiData[i].points && $scope.aPlayPosiData[i].points.length > 0) {
                    for (var q = 0; q < $scope.aPlayPosiData[i].points.length; q++) {
                        var pointX = new L.LatLng($scope.aPlayPosiData[i].points[q].lat, $scope.aPlayPosiData[i].points[q].lng);
                        polylinePoints.push(pointX);
                        arrLatLng.push([$scope.aPlayPosiData[i].points[q].lat, $scope.aPlayPosiData[i].points[q].lng]);
                        $scope.newDriveAllPoints.push($scope.aPlayPosiData[i].points[q]);
                    }
                }
            //}
        }
        var startPoint = $scope.aPlayPosiData[0],
            endPoint = $scope.aPlayPosiData[h],
            title = "start point";

        var startPopup = '<div class="map-popup">' +
            '<p class="pp-hd">Start Info</p>' +
            '<p>Start Time: <span>' + $scope.firstLocation.start_time + '</span></p>' +
            '</div>';
        var endPopup = '<div class="map-popup">' +
            '<p class="pp-hd">End Info</p>' +
            '<p>End Time: <span>' + $scope.lastLocation.end_time + '</span></p>' +
            '</div>';
        var arrowPopup = function (date) {
            return '<div class="map-popup">' +
                '<p>' + moment(date).format('LLL') + '</p>' +
                '</div>';
        }

        L.marker([startPoint.lat || startPoint.start.latitude, startPoint.lng || startPoint.start.longitude], {icon: startIcon}).bindPopup(startPopup).openPopup().on('click', onMarkerClick).addTo(map);
        L.marker([endPoint.lat || endPoint.stop.latitude, endPoint.lng || endPoint.stop.longitude], {icon: stopIcon}).bindPopup(endPopup).openPopup().on('click', onMarkerClick).addTo(map);

        //Define an array of Latlng objects (points along the line)
        var polylineOptions = {
            color: 'blue',
            weight: 5,
            opacity: 0.4
        };
        var fixedPolylineOptions = {
            color: 'green',
            weight: 5,
            opacity: 0.6
        };
        var fixedPolylineLayer = new L.layerGroup().addTo(map);
        var fixedPolyline = new L.Polyline(polylinePoints, fixedPolylineOptions);
        fixedPolylineLayer.addLayer(fixedPolyline);

        var lineLayer = new L.layerGroup().addTo(map);
        var iconLayer = new L.layerGroup().addTo(map);
        var polyline = new L.Polyline([], polylineOptions);

        // add arrow marker to the map line
        var arrowMarkerList = [], arrowLineMarker;
        var skipThreshold = 5;
        var skip = 5;//parseInt($scope.newDriveAllPoints.length/5);
        for (var i = 0; i < $scope.newDriveAllPoints.length; i+=skip) {
            arrowLineMarker = L.marker([$scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude], {icon: new lineIconOptions({iconUrl: getLineIconSvg("green")})});
            arrowLineMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));
            fixedPolylineLayer.addLayer(arrowLineMarker);

        }

        //map.addLayer(fixedPolyline);
        lineLayer.addLayer(polyline);

        var runMarker = L.marker([$scope.newDriveAllPoints[0].lat || $scope.newDriveAllPoints[0].start.latitude, $scope.newDriveAllPoints[0].lng || $scope.newDriveAllPoints[0].start.longitude], {icon: runIcon}).addTo(map);
        runMarker.setRotationAngle(($scope.newDriveAllPoints[0].course || 90));

        // zoom the map to the polyline
        map.fitBounds(fixedPolyline.getBounds());

        //map.fitBounds(arrLatLng);

        function onMarkerClick(e) {
            console.log(this.options);
        }

        //************************//
        $scope.start_date_cal = $scope.aPlayPosiData[0].start_time_cal; //for inner calander
        $scope.end_date_cal = $scope.aPlayPosiData[h].end_time_cal; //for inner calander
        var sDT = new Date($scope.aPlayPosiData[0].start_time_cal);
        $scope.start_date_cal = sDT;
        $scope.hourSel1 = sDT.getHours();
        $scope.minuteSel1 = sDT.getMinutes();

        var eDT = new Date($scope.aPlayPosiData[h].end_time_cal);
        $scope.end_date_cal = eDT;
        $scope.hourSel2 = eDT.getHours();
        $scope.minuteSel2 = eDT.getMinutes();

        // $scope.totalDistance = 0;
        //
        // for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
        //     if ($scope.aPlayPosiData[i]) {
        //         $scope.totalDistance = $scope.totalDistance + parseFloat($scope.aPlayPosiData[i].distance);
        //     }
        // }
        // $scope.totalDistance = $scope.totalDistance.toFixed(2);
        //$scope.totalDistance = $scope.totalDistance/1000;
        // $scope.playData.tot_dist = $scope.totalDistance;

        //********play marker ************/
        $scope.showStop = false;
        $scope.showPlay = true;
        $scope.watchSlider = false;
        var runningMarkers = [];
        var flightPath;
        var stop;
        var markerOk;
        $scope.play = function () {
            $scope.showPlay = false;
            $scope.showStop = true;
            $scope.watchSlider = true;
            if (angular.isDefined(stop)) return;
            $scope.$watch("slider.value", function () {
                if ($scope.watchSlider) {
                    $interval.cancel(stop);
                    if ($scope.slider.value === 10) {
                        $scope.speedControll = 100 * 10;
                    } else if ($scope.slider.value === 20) {
                        $scope.speedControll = 200 * 4;
                    } else if ($scope.slider.value === 30) {
                        $scope.speedControll = 300 * 2;
                    } else if ($scope.slider.value === 40) {
                        $scope.speedControll = 400 * 1;
                    } else if ($scope.slider.value === 50) {
                        $scope.speedControll = 500 / 5;
                    } else if ($scope.slider.value === 60) {
                        $scope.speedControll = 600 / 10;
                    } else if ($scope.slider.value === 70) {
                        $scope.speedControll = 700 / 15;
                    } else if ($scope.slider.value === 80) {
                        $scope.speedControll = 800 / 20;
                    } else if ($scope.slider.value === 90) {
                        $scope.speedControll = 900 / 25;
                    } else if ($scope.slider.value === 100) {
                        $scope.speedControll = 1000 / 30;
                    }
                    stop = $interval(doSomething, $scope.speedControll);
                }
            });

            stop = $interval(doSomething, $scope.speedControll);

        };
        var i = 0;
        var ppline = [], linePoints;

        function doSomething() {
            if (i < $scope.newDriveAllPoints.length) {
                if (($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude) && ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude)) {
                    $scope.newDriveAllPoints[i].average_speed = $scope.newDriveAllPoints[i].speed || $scope.newDriveAllPoints[i].top_speed;

                    if (map.hasLayer(fixedPolylineLayer)) {
                        fixedPolylineLayer.remove();
                    }
                    if ($scope.newDriveAllPoints[i].drive === false) {
                        linePoints = {
                            lat: ($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].stop.latitude),
                            lng: ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].stop.longitude)
                        };
                    } else {
                        linePoints = {
                            lat: ($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude),
                            lng: ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude)
                        };
                    }

                    polyline.addLatLng(linePoints);

                    $scope.speedChange = parseFloat(Math.round($scope.newDriveAllPoints[i].average_speed * 100) / 100).toFixed(2);
                    if ($scope.newDriveAllPoints[i].cum_dist) {
                        $scope.runningDistance = $scope.newDriveAllPoints[i].cum_dist / 1000;
                        $scope.runningDistance = $scope.runningDistance.toFixed(2);
                    }

                    $scope.dateChange = moment($scope.newDriveAllPoints[i].datetime || $scope.newDriveAllPoints[i].start_time).format('LLL');

                    var newLatLng = new L.LatLng($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude);
                    runMarker.setLatLng(newLatLng);
                    runMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));

                    if(i%skip === 0) {
                        var lineMarker = L.marker(newLatLng, {icon: lineIcon}).bindPopup(arrowPopup($scope.newDriveAllPoints[i].datetime));
                        lineMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));
                        lineLayer.addLayer(lineMarker);
                    }

                    runMarker.setZIndexOffset(9999);



                    var getzoom = map.getZoom();
                    if (getzoom <= 12) {
                        map.setZoom(12);
                    } else if (getzoom >= 13) {
                        map.setZoom(15);
                    }
                    map.panTo(newLatLng);
                }
                i++;
            } else {
                $scope.stopFight();
            }
        }

        $scope.stopFight = function () {
            $scope.showStop = false;
            $scope.showPlay = true;
            $scope.watchSlider = false;
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };
        $scope.resetFight = function () {
            i = 0;
            var newLatLng = new L.LatLng($scope.newDriveAllPoints[0].lat || $scope.newDriveAllPoints[0].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude);
            runMarker.setLatLng(newLatLng);

            map.removeLayer(lineLayer);   // remove polylline for reset
            polyline = new L.Polyline([], polylineOptions);   // again add new polyline initialization
            lineLayer = new L.layerGroup([polyline]).addTo(map);

            $scope.stopFight();
        };
        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $scope.stopFight();
        });

        //***********ROUTING line draw****************//
        $scope.clickOnce = true;
        $scope.line = function () {
            /*if($scope.clickOnce === true){
              $scope.clickOnce = false;
            }else{
                polyline = null;
              $scope.clickOnce = true;
            }*/
            if (map.hasLayer(fixedPolylineLayer)) {
                fixedPolylineLayer.remove();
            } else {
                fixedPolylineLayer.addTo(map);
            }
        };
        /***********ROUTING line draw end****************/
        // show turns, bridges, station, and others
        function getlndmarks () {
            var filter = {};
            filter.selected_uid = $localStorage.preservedSelectedUser.user_id;
            filter.login_uid = $localStorage.user.user_id;
            filter.user_id = $localStorage.preservedSelectedUser.user_id;
            filter.row_count = 8;
            filter.no_of_docs = 1000;
            filter.sort = { '_id' : -1 };
            landmarkService.getLandmark(filter, onSuccess, err => {
                console.log(err);
            });

            //Handle success response
            function onSuccess(response) {
                if(response && response.data && response.data.length) {
                    let res = response.data;
                    $scope.alandMarkList = res;
                }
            }
        };
        // getlndmarks();
        $scope.showLandmarks = function (value) {
            if($scope.alandMarkList.length === 0)
            getlndmarks();
            $scope.showIcon = !$scope.showIcon;
            for (var i = 0; i < $scope.alandMarkList.length; i++) {
                var newLatLng = new L.LatLng($scope.alandMarkList[i].location.latitude, $scope.alandMarkList[i].location.longitude);
                var iconPopup = '<div class="map-popup">' +
                    '<p class="pp-hd">Details</p>' +
                    '<p>Name: <span>' + $scope.alandMarkList[i].name + '</span></p>' +
                    '<p>Km-chaining: <span>' + $scope.alandMarkList[i].km  + '</span></p>' +
                    '<p>Distance (m): <span>' + $scope.alandMarkList[i].dist + '</span></p>' +
                    '<p>Category Description &nbsp;&nbsp;&nbsp; : <span>' + $scope.alandMarkList[i].catDet  + '</span></p>' +
                    '</div>';
                let Icon;
                if ($scope.alandMarkList[i].category === 'bridge') {                        
                    Icon = bridgeIcon;
                } else if($scope.alandMarkList[i].category === 'pillar') {                        
                    Icon = pillarIcon;
                } else if($scope.alandMarkList[i].category === 'turn') {                        
                    Icon = turnIcon;
                } else if($scope.alandMarkList[i].category === 'station') {                        
                     Icon = stationIcon;
                } else if($scope.alandMarkList[i].category === 'km post') {
                    Icon = otherIcon;
                } else if($scope.alandMarkList[i].category === 'signal')  {
                    Icon = signalIcon;
               }   else if($scope.alandMarkList[i].category === 'power')   {
                   Icon = powerIcon;
               }   else if($scope.alandMarkList[i].category === 'point & crossing')    {
                   Icon = pcrossingIcon;
               }   else if($scope.alandMarkList[i].category === 'level crossing') {
                   Icon = lcrossingIcon;
               }   else if($scope.alandMarkList[i].category === 'overhead light') {
                   Icon = olightIcon;
               }   else {
                   Icon = dotIcon;
               }
                var iconMarker = L.marker(newLatLng, {icon: Icon}).bindPopup(iconPopup).openPopup().on('click', onMarkerClick);
                iconLayer.addLayer(iconMarker);
                if($scope.showIcon) 
                    iconLayer.addTo(map);    
                else  {
                    iconLayer.remove();
                    return;
                }
            }
        }
        // GET LANDMARKS ARRAY
        var control = L.control.layers(null, null, {collapsed: true});

        utils.getLandmarkForMultiLayer(map.getCenter()).then(function (response) {
            var landMarkGroup = L.layerGroup(response);
            control.addOverlay(landMarkGroup, 'Landmarks');
            //landMarkGroup.addTo(map);
        });

        // GET GEOZONES ARRAY

        utils.getGeozoneForMultiLayer(map.getCenter()).then(function (response) {
            var geozoneGroup = L.layerGroup(response);
            control.addOverlay(geozoneGroup, 'Geo Zones');
            geozoneGroup.addTo(map);
        });

        // GET NEAREST VEHICLE

        utils.getVehicleForMultiLayer(map.getCenter()).then(function (response) {
            var nearestVehicleGroup = L.layerGroup(response);
            control.addOverlay(nearestVehicleGroup, 'Nearest Vehicle');
            //nearestVehicleGroup.addTo(map);
        });

        control.addTo(map);

        //********play marker ************/

        //PLAYBACK HOME PAGE FUNCTION
        $scope.homePage = function () {
            $rootScope.redirect('/#!/main/user');
        };
        $scope.playBack = function () {
            $rootScope.redirect('/#!/main/playBack');
        };
    };
    $rootScope.againInitialiseCtrl();

    function playBackResponseIn(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status === 'OK') {
                $rootScope.countPlay = $rootScope.countPlay + 1;
                for (var i = 0; i < oRes.data.length; i++) {
                    oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
                    oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
                    if (oRes.data[i].duration) {
                        oRes.data[i].duration = oRes.data[i].duration / 3600;
                        oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
                    }
                    if (oRes.data[i].distance) {
                        oRes.data[i].distance = oRes.data[i].distance / 1000;
                        oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
                    }
                }
                $rootScope.playData = oRes;
                $rootScope.againInitialiseCtrl();
                //$rootScope.redirect('/#!/main/playPosition');
            }
            else if (oRes.status === 'ERROR') {
                //swal(oRes.message, "", "error");
            }
        }
    };

    $scope.inPlayBack = function () {
        var newObject = angular.copy($rootScope.playData);
        $scope.selTruck = newObject;
        $rootScope.playData = {};

        if ($scope.start_date_cal && $scope.end_date_cal) {
            //**** custom time add with date ******//
            $scope.start_date_cal = new Date($scope.start_date_cal);
            $scope.end_date_cal = new Date($scope.end_date_cal);
            var xx = $scope.start_date_cal;
            xx.setHours($scope.hourSel1);
            xx.setMinutes($scope.minuteSel1);
            $scope.start_date_cal = xx;
            var yy = $scope.end_date_cal;
            yy.setHours($scope.hourSel2);
            yy.setMinutes($scope.minuteSel2);
            $scope.end_date_cal = yy;

            //**** custom time add with date ******//
            if ($scope.selTruck) {
                $rootScope.reportData = [];

                var playBack = {};
                playBack.request = 'playback';
                playBack.version = 2;
                playBack.device_id = $scope.selTruck.device_id;
                playBack.start_time = $scope.start_date_cal;
                playBack.end_time = $scope.end_date_cal;

                //playBack.login_uid = $localStorage.user.user_id;
                //playBack.token = $localStorage.user.token;
                playBackService.getplayData(playBack, playBackResponseIn);

                $rootScope.loader = true;
                $timeout(function () {
                    $rootScope.loader = false;
                }, 3000);
            } else {
                swal("Please select vehicle ");
            }
        } else {
            swal("Please select date 'from' and 'to' ");
        }
    };

    //*********toggle list view ***********//
    $scope.iconChange = true;
    $scope.toggle = true;

    $scope.$watch('toggle', function () {
        $scope.toggleText = $scope.toggle ? 'Show List' : 'Track on Map';
    });

    $scope.callFirst = true;

    $rootScope.showInList = function (tripD) {
        if ($scope.callFirst === true) {
            document.getElementById('map-togg2').style.display = "none";
            $scope.callFirst = false;
        } else {
            $scope.callFirst = true;
            document.getElementById('map-togg2').style.display = "block";
        }

    };

    $scope.viewOnMap = function (listData) {
        if (listData.start && listData.start.latitude) {
            listData.reg_no = $rootScope.playData.reg_no;
            $rootScope.sMapViewData = listData;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/playback/singleViewOnMap.html',
                controller: 'sViewOnMapCtrl'
            });
        }
    }

    $scope.downloadCsv = function (aData) {
		let cnt = 1;
		objToCsv('PlaybackSheet',[
			'S.No',
			'Start Time',
			'End Time',
			'Location',
			'Latitude',
			'Longitude',
			'Nearest Landmark',
			'Speed(Kmph)',
			'Duration(Hour)',
			'Distance(Kms)'
		], aData.map( o => {
			let arr = [];
			try {
				arr.push(cnt++ || 0);
			} catch (e) {
				arr.push(0);
			}

			try {
				arr.push(o.start_time && o.start_time.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.end_time && o.end_time.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start_addr && o.start_addr.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start && o.start.latitude || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start && o.start.longitude || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.nearest_landmark && o.nearest_landmark.name && o.nearest_landmark.dist ? o.nearest_landmark.dist/1000 + " KM from " + o.nearest_landmark.name : "NA");
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.top_speed || '0');
			} catch (e) {
				arr.push('0');
			}

			try {
				arr.push(o.duration || "0");
			} catch (e) {
				arr.push("0");
			}

			try {
				arr.push(o.distance || "0");
			} catch (e) {
				arr.push('0');
			}
			return arr;
		}));
	}
});

materialAdmin.controller("sViewOnMapCtrl", function ($rootScope, $scope, $localStorage, $window, GoogleMapService, $uibModal, $uibModalInstance, $interval, $state, utils, $timeout, reportService) {
    $rootScope.showSideBar = false;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectedMapView = {};
    $scope.selectedMapView = $rootScope.sMapViewData || $rootScope.sMapViewData22;

    var iconStart = 'img/start-small.png';
    $timeout(function () {
        initMap();
        var haveData = haveLatLng($scope.selectedMapView)
        if (haveData) {
            setMarkers(haveData);
        }

    }, 1000);

    ///\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var map;

    function initMap() {
        map = utils.initializeMapView('sMapPlaybackView', {
            zoomControl: true,
            hybrid: true,
            zoom: 4,
            search: false,
            center: new L.LatLng(21, 90)
        }, false).map;
    }

    function haveLatLng(oLatLng) {
        if (oLatLng.start && oLatLng.start.latitude && oLatLng.start.longitude) {
            return oLatLng;
        } else {
            return false;
        }
    };

    function setMarkers(oMarker) {
        var a = oMarker;
        var title = a.reg_no;
        var popupText = '<div><b>Address:</b> ' + a.start_addr + '</div>';
        marker = L.marker([a.start.latitude, a.start.longitude]).bindTooltip(title, {
            permanent: false,
            direction: 'top'
        }).openTooltip().bindPopup(popupText).openPopup().on('click', onMarkerClick);
        marker.data = a;
        marker.setIcon(L.icon({
            iconUrl: 'img/start-small.png'
        }));
        marker.addTo(map);
    }

    function onMarkerClick(e) {
        console.log(this.options);
    };

    function centerLeafletMapOnMarker(map, marker) {
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    }

});
