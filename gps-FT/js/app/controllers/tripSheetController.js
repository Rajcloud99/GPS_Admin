materialAdmin
    .controller('tripSheetController', tripSheetController)
    .controller('mapViewController', mapViewController)
    .controller('vehicleTrackController', vehicleTrackController)

mapViewController.$inject = [
    "$stateParams",
    "$scope",
    "$state",
    "$filter",
    "$http",
    "$localStorage",
    "$rootScope",
    "$timeout",
    "DatePicker",
    "otherUtils",
    "Vehicle",
    "utils",
];
vehicleTrackController.$inject = [
    "$state",
    "$localStorage",
    '$scope',
    '$stateParams',
    '$timeout',
    'DatePicker',
    'utils',
    'Vehicle'
];
tripSheetController.$inject = [
    "$localStorage",
    "$rootScope",
    "$scope",
    '$state',
    "$timeout",
    "$uibModal",
    "DatePicker",
    "dateUtils",
    "gpsAnalyticService"
];

function tripSheetController(
    $localStorage,
    $rootScope,
    $scope,
    $state,
    $timeout,
    $uibModal,
    DatePicker,
    dateUtils,
    gpsAnalyticService
) {
    let vm = this;
    vm.homePage = homePage;
    vm.getTrips = getTrips;
    vm.onVehicleSelect = onVehicleSelect;
    vm.removeVehicle = removeVehicle;
    vm.detailView = detailView;
    vm.actionView = actionView;
    vm.downloadList = downloadList;
    vm.showPlayback = showPlayback;

    (function init() {
        $rootScope.showSideBar = false;
        vm.showGraph = true;
        vm.aTripSheet = [];
        vm.aAllTrip = [];
        vm.filter = {};
        vm.DatePicker = angular.copy(DatePicker);
        vm.aPageState = [
            [0, 0, 0, 0, 0]
        ];
        vm.aVehicle = $localStorage.user.devices;
        // vm.aDriver = [...$localStorage.user.devices.reduce((set, obj) => {
        //     if(obj.driver_name){
        //         set.add(obj.driver_name.toLowerCase());
        //     }
        //     if(obj.driver_name2){
        //         set.add(obj.driver_name2.toLowerCase());
        //     }
        //     return set;
        // }, new Set())];
    })();

    // Actual Function

    function homePage() {
        $rootScope.redirect('/#!/main/user');
    }

    function getTrips(type) {

        let request = prepareFilter(false, type);
        // if (!(vm.filter.from_date && vm.filter.to_date))
        //     return swal('Error', 'Please Select From and To Date', 'error');

        gpsAnalyticService.getTrips(request, onSuccess, err => {
            console.log(err)
        });

        function onSuccess(response) {
            if (response && response.data && response.data.length) {
                res = response.data;
                vm.aTripSheet = res;
                if (vm.aPageState.length <= vm.bigCurrentPage) {
                    vm.aPageState.push(res);
                    vm.aAllTrip.push(...res);
                    vm.bigTotalItems = vm.aAllTrip.length + 2;
                }
            } else {
                vm.aTripSheet = undefined;
            }
        }
    }

    function onVehicleSelect(item) {
        vm.aVehicleData = vm.aVehicleData || [];
        vm.aVehicleData.push(item);
        vm.filter.vehicle = '';
    }

    function removeVehicle(select, index) {
        vm.aVehicleData.splice(index, 1);
    }

    function prepareFilter(download, type) {
        let oFilter = {};

        if (vm.aVehicleData && vm.aVehicleData.length) {
            oFilter.vehicle_no = [];
            vm.aVehicleData.map((v) => {
                // oFilter.vehicle_no.push(Number(v.reg_no));
                oFilter.vehicle_no.push(v.reg_no);
            });
        }
        if (vm.filter.vehicle)
            oFilter.vehicle_no = vm.filter.vehicle.reg_no;


        if (vm.filter.from_date) {
            oFilter.from = dateUtils.setHours(vm.filter.from_date, 0, 0, 0).toISOString();
        }
        if (vm.filter.to_date) {
            oFilter.to = dateUtils.setHours(vm.filter.to_date, 23, 59, 59).toISOString();
        }

        // if (vm.filter.from_date)
        //     oFilter.from = vm.filter.from_date;
        //
        // if (vm.filter.to_date)
        //     oFilter.to = vm.filter.to_date;

        if (vm.filter.driver)
            oFilter.driver = vm.filter.driver;

        if ($localStorage.user.gps_view)
            oFilter.gps_view = $localStorage.user.gps_view;

        if (download)
            oFilter.download = true;

        if (type)
            oFilter.type = type;

        if ($localStorage.user.lms_url)
            oFilter.url = $localStorage.user.lms_url + 'api/trips/getTrip';

        if ($localStorage.user.lms_token)
            oFilter.lms_token = $localStorage.user.lms_token;

        oFilter.selected_uid = $localStorage.user.user_id;
        oFilter.login_uid = $localStorage.user.user_id;
        oFilter.user_id = $localStorage.user.user_id;
        if (type === 'Oder Details') {
            oFilter.dateType = "Trip started";
            oFilter.st = "Trip started"
        } else if (type === 'Trip Details') {
            // oFilter.dateType = "Trip ended";
            oFilter.st = "Trip ended";
            // oFilter.tripStatus = vm.aStatus;
        }
        if (download)
            oFilter.download = true;
        else
        oFilter.no_of_docs = 10;

        oFilter.skip = vm.bigCurrentPage;
        oFilter.sort = {'_id': -1};
        return oFilter;
    }

    //****************pagination code start ************//
    vm.setPage = function (pageNo) {
        vm.bigCurrentPage = pageNo;
    };

    vm.pageChanged = function (type) {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        // $scope.getPageNo = $scope.bigCurrentPage - 1;
        vm.getTrips(type);
    };

    vm.maxSize = 3;
    vm.bigTotalItems = vm.aTripSheet.length;
    vm.bigCurrentPage = 1;

    //****************pagination code end ************//

    function downloadList(type) {

        if (!(vm.filter.from_date && vm.filter.to_date)) {
            return swal('Warning', 'From and To date required', 'warning');
        }

        var oFilter = prepareFilter(true, type);
        gpsAnalyticService.getTrips(oFilter, onSuccess, onFailure);

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

    function detailView(Sheet, type) {
        let isFound = false;
        if (Sheet.alertData && Sheet.alertData.length) {
            Sheet.alertData.forEach(obj=>{
               if(obj.code === type){
                   isFound = true;
               }
            });

            if(!isFound)
                return swal('Error!', 'Data Not Found', 'error');


            $uibModal.open({
                templateUrl: 'views/tripSheet/detailView.html',
                controller: ['$rootScope', '$scope', '$uibModalInstance', '$localStorage', 'gpsAnalyticService', 'otherUtils', 'otherData', detailViewController],
                controllerAs: 'dvVm',
                resolve: {
                    otherData: function () {
                        return {
                            aData: Sheet,
                            type: type,
                            filter: vm.filter
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

    function actionView(Sheet) {
        if (Sheet.actionAlert && Sheet.actionAlert.length) {

            $uibModal.open({
                templateUrl: 'views/tripSheet/actionView.html',
                controller: ['$rootScope', '$scope', '$uibModalInstance', '$localStorage', 'gpsAnalyticService', 'otherUtils', 'otherData', actionViewController],
                controllerAs: 'avVm',
                resolve: {
                    otherData: function () {
                        return {
                            aData: Sheet,
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

    function showPlayback() {
        if(!vm.aTripSheet[vm.SelectedIndex].vehicle.device_imei)
            swal('Error', "IMEI not registered", 'error');

        let oTrip = vm.aTripSheet[vm.SelectedIndex];

        let statuses = oTrip && oTrip.statuses || [];
        let tripStart = statuses.find(o => o.status === "Trip started");
        let tripEnd = statuses.find(o => o.status === "Trip ended");
        // let filter = {
        //     start: moment.max([moment().add(-7, 'day'), tripStart.date ? moment(tripStart.date) : moment()]).startOf('day').toDate(),
        //     end: moment(tripEnd && tripEnd.date || new Date()).endOf('day').toDate()
        // };

        let filter = {
            start: moment.max([moment().add(-7, 'day'), tripStart.date ? moment(tripStart.date) : moment()]).toDate(),
            end: moment(tripEnd && tripEnd.date || new Date()).toDate()
        };

        oTrip.filter = filter;

        $state.go('main.tripPlayback', {data: oTrip});
    }
}

function detailViewController(
    $rootScope,
    $scope,
    $uibModalInstance,
    $localStorage,
    gpsAnalyticService,
    otherUtils,
    otherData,
) {

    let vm = this;

    // functions Identifiers
    vm.closeModal = closeModal;
    vm.getAllAlerts = getAllAlerts;


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
        vm.oSheetData = angular.copy(otherData.aData);
        vm.type = angular.copy(otherData.type);
        vm.filter = angular.copy(otherData.filter);
        if(vm.oSheetData && vm.oSheetData.startDate)
            vm.filter.from_date =  vm.oSheetData.startDate;
        if(vm.oSheetData && vm.oSheetData.endDate)
            vm.filter.to_date =  vm.oSheetData.endDate;
        getAllAlerts();

    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    vm.pageChanged = function () {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        // $rootScope.getPageNo = $scope.bigCurrentPage-1;
        vm.getAllAlerts();
    };

    function getAllAlerts() {

        var oFilter = prepareFilterObject();
        gpsAnalyticService.getAlerts(oFilter, onSuccess, err => {
            console.log(err)
        });

        // Handle success response
        function onSuccess(response) {
            if (response && response.data && response.data.length) {
                res = response.data;
                vm.aOtherNotifications = res;
                if (vm.aPageState.length <= vm.bigCurrentPage) {
                    vm.aPageState.push(res);
                    vm.aAllAlerts.push(...res);
                    vm.bigTotalItems = vm.aAllAlerts.length + 2;
                }
            } else {
                vm.aOtherNotifications = undefined;
            }
        }
    }

    function prepareFilterObject() {
        var filter = {};

        if (vm.oSheetData && vm.oSheetData.vehicle && vm.oSheetData.vehicle._id) {
            filter.imei = vm.oSheetData.vehicle.device_imei;
        }else if(vm.oSheetData.vehicle){
            filter.reg_no = vm.oSheetData.vehicle;
        }

        if (vm.filter.from_date) {
            filter.from = vm.filter.from_date;
        }

        if (vm.filter.to_date) {
            filter.to = vm.filter.to_date || new Date();
        }

        if (vm.type) {
            filter.code = [];
            filter.code.push(vm.type);
        }

        filter.no_of_docs = 20;
        filter.skip = vm.bigCurrentPage;

        // if($scope.driver){
        //     filter.driver = $scope.driver;
        // }

        filter.selected_uid = $localStorage.user.user_id;
        filter.login_uid = $localStorage.user.user_id;
        filter.user_id = $localStorage.user.user_id;
        filter.row_count = 8;
        filter.sort = {'_id': -1};
        return filter;
    }

}

function actionViewController(
    $rootScope,
    $scope,
    $uibModalInstance,
    $localStorage,
    gpsAnalyticService,
    otherUtils,
    otherData,
) {

    let vm = this;

    // functions Identifiers
    vm.closeModal = closeModal;
    // vm.getAllAlerts = getAllAlerts;


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
        vm.aActionNotifications = angular.copy(otherData.aData.actionAlert[0].alerts)
        // getAllAlerts();

    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    vm.pageChanged = function () {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        // $rootScope.getPageNo = $scope.bigCurrentPage-1;
        vm.getAllAlerts();
    };

    function getAllAlerts() {

        var oFilter = prepareFilterObject();
        gpsAnalyticService.getAlerts(oFilter, onSuccess, err => {
            console.log(err)
        });

        // Handle success response
        function onSuccess(response) {
            if (response && response.data && response.data.length) {
                res = response.data;
                vm.aOtherNotifications = res;
                if (vm.aPageState.length <= vm.bigCurrentPage) {
                    vm.aPageState.push(res);
                    vm.aAllAlerts.push(...res);
                    vm.bigTotalItems = vm.aAllAlerts.length + 2;
                }
            } else {
                vm.aOtherNotifications = undefined;
            }
        }
    }

    function prepareFilterObject() {
        var filter = {};

        if (vm.oSheetData && vm.oSheetData.vehicle) {
            filter.imei = vm.oSheetData.vehicle.device_imei;
        }

        if (vm.filter.from_date) {
            filter.from = vm.filter.from_date;
        }

        if (vm.filter.to_date) {
            filter.to = vm.filter.to_date;
        }

        if (vm.type) {
            filter.code = [];
            filter.code.push(vm.type);
        }

        filter.no_of_docs = 20;
        filter.skip = vm.bigCurrentPage;

        // if($scope.driver){
        //     filter.driver = $scope.driver;
        // }

        filter.selected_uid = $localStorage.user.user_id;
        filter.login_uid = $localStorage.user.user_id;
        filter.user_id = $localStorage.user.user_id;
        filter.row_count = 8;
        filter.sort = {'_id': -1};
        return filter;
    }

}

function mapViewController(
    $stateParams,
    $scope,
    $state,
    $filter,
    $http,
    $localStorage,
    $rootScope,
    $timeout,
    DatePicker,
    otherUtils,
    Vehicle,
    utils,
) {

    let vm = this,
        map,
        toolTipMap;

    vm.oLiveData = {};
    vm.oFilter = {
        dateBy: 'expected_eta'
    };
    vm.DatePicker = angular.copy(DatePicker);
    vm.aDateBy = [
        {
            name: 'Expected ETA',
            value: 'expected_eta'
        },
        {
            name: 'Loading Date',
            value: 'vehicle.gr.loading_ended_status.date'
        }
    ];

    vm.aGrStatus = ["Vehicle Arrived for loading", "Vehicle Arrived for unloading"];

    //vm.lazyLoad = lazyLoadFactory(); // init lazyload
    $rootScope.maps = {};
    $rootScope.plottedMarkers = [];

    vm.orderBy = {};


    // functions Identifiers
    vm.getColor = getColor;
    vm.getRoute = getRoute;
    vm.zoomIn = zoomIn;
    vm.zoomOut = zoomOut;
    vm.getLivetrackVehicleData = getLivetrackVehicleData;
    vm.placeMarker = placeMarker;
    vm.focusOnMap = focusOnMap;

    // INIT functions
    (function init() {

        if(!$stateParams.data)
            return;

        vm.oTrip = $stateParams.data;

        vm.running = 0;
        vm.stopped = 0;
        vm.inactive = 0;
        vm.offline = 0;
        vm.tableView = false;
        vm.aVehicleStatus = [
            'Running',
            'Stopped',
            'Offline'
        ];
        $scope.showMap = true;

        vm.pageNumber = 1;

        $timeout(function () {
            mapInit();
            tableMapInit();
        });

        getLivetrackVehicleData();
    })();

    // Actual Functions

    function getColor(status) {
        switch (status) {
            case 'running':
                return 'ja-green';
            case 'stopped':
                return 'ja-red';
            default :
                return 'ja-grey';
        }
    }

    function getLivetrackVehicleData() {
        removeAllMarkerOnMap();
        Vehicle.vehicleWiseAll({
            vehicles: [vm.oTrip.vehicle._id],
            url: $localStorage.user.lms_url,
            lms_token: $localStorage.user.lms_token
        }, function (obj, resData) {
            vm.aTrSheetDevice = obj.aTrSheetDevice;
            plotMarkerOnMap(resData || obj.aTrSheetDevice);
            applyFilter();
        })
    }

    function getRoute(str) {
        if (str.length <= 2)
            return;
        Routes.getAllRoutes({
            name: str
        }, success);

        function success(data) {
            vm.aRoute = data.data.data;
        }
    }

    function mapInit() {
        $rootScope.maps = utils.initializeMapView('mapViewTracking', {
            zoomControl: false,
            hybrid: true,
            zoom: 4,
            search: true,
            location: false,
            center: new L.LatLng(21, 90)
        }, true);
        map = $rootScope.maps.map;
        map.on('dblclick', function (ev) {
            if (ev.originalEvent instanceof MouseEvent) {
                vm.location = {formatted_address: "Custom", lat: ev.latlng.lat, lng: ev.latlng.lng};
                applyFilter();
            }
        });
    }

    function zoomIn() {
        if ($rootScope.maps.map) {
            curZoom = $rootScope.maps.map.getZoom();
            if (curZoom && curZoom < 17)
                $rootScope.maps.map.setZoom(++curZoom);
        }
    }

    function zoomOut() {
        if ($rootScope.maps.map) {
            curZoom = $rootScope.maps.map.getZoom();
            if (curZoom && curZoom > 2)
                $rootScope.maps.map.setZoom(--curZoom);
        }
    }

    let vehiclePopup;

    function focusOnMap(vehicle) {
        let curentZoom = $scope.maps.map.getZoom();
        $scope.maps.map.setView([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng], 9);
        $scope.showMap = true;
        $scope.selectedIndex = null;
        try {
            vehiclePopup = new L.popup({closeOnClick: false})
                .setContent(vehicle.vehicle.vehicle_reg_no)
                .setLatLng([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng])
                .openOn($scope.maps.map);
        } catch (e) {
        }
    }

    ///////////////////////////////////////////////////
    function plotMarkerOnMap(data) {
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].vehicle.gpsData)
                    continue;

                if (data[i].vehicle.gpsData.lat && data[i].vehicle.gpsData.lng) {
                    if ($rootScope.maps.map) {
                        utils.addOnCluster($rootScope.maps, utils.createMarker(data[i].vehicle.gpsData), data[i].vehicle.gpsData)
                        /*if ($rootScope.plottedMarkers.length > 1) {
                            utils.prepareCluster($rootScope.maps, $rootScope.plottedMarkers);
                        }*/
                    }
                }
            }
        } else {
            $rootScope.maps.clusterL.Cluster._clusters = [];
        }
        if ($rootScope.maps && $rootScope.maps.clusterL) {
            //$rootScope.maps.clusterL.FitBounds();
            //$rootScope.maps.map.fitBounds($rootScope.maps.map.getBounds());
        }
    }

    function removeAllMarkerOnMap() {
        if ($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.map) {
            $rootScope.maps.map.removeLayer($rootScope.maps.clusterL);
            $rootScope.maps.clusterL = utils.initializeCluster(map);
        }
    }

    function tableMapInit() {
        toolTipMap = utils.initializeMapView('toolTipDiv', {
            zoomControl: true,
            hybrid: false,
            zoom: 13,
            search: false,
            location: false
        });
    }

    function placeMarker(oVehicle) {
        if (!oVehicle.lng || !oVehicle.lat) return;
        if (toolTipMap.marker && toolTipMap.map.hasLayer(toolTipMap.marker)) {
            toolTipMap.map.removeLayer(toolTipMap.marker);
        }
        toolTipMap.marker = L.marker([oVehicle.lat, oVehicle.lng])
            .bindTooltip(oVehicle.vehicle.vehicle_reg_no, {permanent: false, direction: 'top'})
            .openTooltip()
            .addTo(toolTipMap.map);
        toolTipMap.map.setView(new L.LatLng(oVehicle.lat, oVehicle.lng), 8);
    }
}

function vehicleTrackController(
    $state,
    $localStorage,
    $scope,
    $stateParams,
    $timeout,
    DatePicker,
    utils,
    Vehicle
){

    let LeafIcon = L.Icon.extend({
        options: {
            iconSize:   [36, 45],
            iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
        }
    });


    ////////////////////////////////////////////////////////////////

    let lineIconOptions = L.Icon.extend({
        options: {
            iconSize:   [15, 15],
            iconAnchor: [7.5, 7.5]
        }
    });


    //Object Identifier
    let vm = this,
        oRes, map, oMap, lineLayer, startPointMarker, endPointMarker,
        flagIcon = new LeafIcon({iconUrl: 'img/stopFlag.png'}),
        startIcon = new LeafIcon({iconUrl: 'img/start.png'}),
        stopIcon = new LeafIcon({iconUrl: 'img/stop.png'}),
        lineIcon = new lineIconOptions({iconUrl: getLineIconSvg()})
    ;

    //Function Identifier
    vm.closeModal = closeModal;
    vm.search = search;
    vm.getColor = getColor;
    vm.dateChange = dateChange;
    vm.aTime = ["15 min", "30 min", "1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr"];

    if(!$stateParams.data)
        $state.go('main.otherNotification');

    $scope.vehicle = $stateParams.data;

    $scope.dateTimeStart = $scope.vehicle.filter.start;
    $scope.dateTimeEnd = $scope.vehicle.filter.end;

    function getColor(status) {
        switch(status){
            case 'running': return 'ja-green';
            case 'stopped': return 'ja-red';
            default : return 'ja-grey';
        }
    }

    //Init
    (function init() {

        vm.DatePicker = angular.copy(DatePicker);
        vm.aHour = Array(24).fill('').map((o,i) => i);
        vm.aMin = Array(60).fill('').map((o,i) => i);
        vm.start = {};
        vm.end = {};

        vm.start.date = $scope.dateTimeStart;
        vm.start.hour = $scope.dateTimeStart.getHours();
        vm.start.min = $scope.dateTimeStart.getMinutes();

        vm.end.date = $scope.dateTimeEnd;
        vm.end.hour = $scope.dateTimeEnd.getHours();
        vm.end.min = $scope.dateTimeEnd.getMinutes();
        vm.zoomIn = zoomIn;
        vm.zoomOut = zoomOut;

        $timeout(function () {
            mapInit();
        });
        getplayData();
        dateChange();
    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function dateChange(dateType){

        if(dateType === 'startDate' && vm.end_date && vm.start_date){

            let isDate = vm.end.date instanceof Date,
                monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
                dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
                isNotValid = false;

            if(monthRange === 0)
                isNotValid = dateRange < 0;
            else if(monthRange === 1)
                isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
            else
                isNotValid = true;

            if(isDate && isNotValid){
                let date = new Date(vm.start.date);
                vm.end.date = new Date(date.setMonth(date.getMonth() + 1));
            }

        }else if(dateType === 'endDate' && vm.end_date && vm.start_date) {

            let isDate = vm.start.date instanceof Date,
                monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
                dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
                isNotValid = false;

            if(monthRange === 0)
                isNotValid = dateRange < 0;
            else if(monthRange === 1)
                isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
            else
                isNotValid = true;

            if(isDate && isNotValid){
                let date = new Date(vm.end.date);
                vm.start.date = new Date(date.setMonth(date.getMonth() - 1));
            }
        }
    }

    function zoomIn() {
        if(map){
            curZoom = map.getZoom();
            if(curZoom && curZoom<17)
                map.setZoom(++curZoom);
        }
    }

    function zoomOut() {
        if(map){
            curZoom = map.getZoom();
            if(curZoom && curZoom>2)
                map.setZoom(--curZoom);
        }
    }

    function getplayData() {
        let playBack = {};
        playBack.request = 'playback';
        playBack.version = 2;
        playBack.device_id = $stateParams.data.vehicle.device_imei;
        playBack.start_time = $scope.dateTimeStart.toISOString();
        playBack.end_time = $scope.dateTimeEnd.toISOString();
        playBack.selected_uid = $localStorage.user.user_id;
        playBack.login_uid = $localStorage.user.user_id;
        Vehicle.getplayData(playBack, playBackResponse);

        function playBackResponse(oRes){
            try{
                if(oRes){
                    if(oRes.status === 'OK'){
                        for (let i = 0; i < oRes.data.length; i++) {
                            oRes.data[i].start_time_cal = oRes.data[i].start_time;
                            oRes.data[i].end_time_cal = oRes.data[i].end_time;
                            oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
                            oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
                            if(oRes.data[i].duration){
                                oRes.data[i].duration = oRes.data[i].duration/3600;
                                oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
                                oRes.data[i].duration = parseFloat(oRes.data[i].duration);
                            }
                            if(oRes.data[i].distance){
                                oRes.data[i].distance = oRes.data[i].distance/1000;
                                oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
                            }
                        }
                        if(oRes.tot_dist){
                            oRes.tot_dist = oRes.tot_dist/1000;
                            oRes.tot_dist = oRes.tot_dist.toFixed(2);
                        }
                        plotData(oRes.data);
                        //$rootScope.playData = oRes;
                        //$rootScope.redirect('/#!/main/playPosition');
                    }
                    else if(oRes.status === 'ERROR'){
                        //swal(oRes.message, "", "error");
                    }
                }
                $timeout(function () {
                    vm.oRes = oRes;
                });
            }catch (e) {
                console.error(e);
            }
        }
    }

    function mapInit() {
        oMap = utils.initializeMapView('mapViewVehicleTrackingModal', {
            zoomControl: false,
            hybrid: true,
            zoom: 4,
            search: false,
            location: false,
            center: new L.LatLng(21, 90)
        }, false);
        map = oMap.map;

        drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        if(false && $stateParams.data && $stateParams.data.lat && $stateParams.data.lng){
            let marker = L.marker([$stateParams.data.lat, $stateParams.data.lng]);
            utils.makeMarker(marker,$stateParams.data.vehicle.gpsData);
            map.addLayer(marker);
        }
    }

    function search() {
        $scope.dateTimeStart = vm.start.date;
        $scope.dateTimeStart.setHours(vm.start.hour);
        $scope.dateTimeStart.setMinutes(vm.start.min);
        $scope.dateTimeStart.setSeconds(0);

        $scope.dateTimeEnd = vm.end.date;
        $scope.dateTimeEnd.setHours(vm.end.hour);
        $scope.dateTimeEnd.setMinutes(vm.end.min);
        $scope.dateTimeEnd.setSeconds(0);

        if($scope.dateTimeEnd - $scope.dateTimeStart > 15 * 24 * 60 * 60 * 1000)
            return swal('Warning', 'Max 15 days playback allowed', 'warning');

        getplayData();
    }

    var fixedPolylineOptions = {
        color: 'blue',
        weight: 2.5,
        opacity: 0.8
    };

    /**
     * @return {string}
     */
    let SecondsTohhmmss = function(totalSeconds) {
        totalSeconds = totalSeconds*3600;
        let hours   = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100

        let result = (hours < 10 ? "0" + hours : hours) + " hours " ;
        result += (minutes < 10 ? "0" + minutes : minutes) + " minutes " ;
        //result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
        return result;
    };

    function getLineIconSvg() {
        let iColor = "blue";
        let svgCode  = utils.lineMarkerSvg(iColor);
        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
    }

    let plotData = function (data) {

        if (map.hasLayer(lineLayer))
            map.removeLayer(lineLayer);

        if(map.hasLayer(startPointMarker))
            map.removeLayer(startPointMarker);

        if(map.hasLayer(endPointMarker))
            map.removeLayer(endPointMarker);

        lineLayer = new L.layerGroup();
        lineLayer.addTo(map);
        let polylinePoints = [];
        let startPoint = data[0].start;
        let endPoint = data[data.length-1].stop;
        let startPopup = '<div class="map-popup">'+
            '<p class="pp-hd">Start Info</p>'+
            '<p>Start Time: <span>'+data[0].start_time + '</span></p>'+
            '</div>';
        let endPopup = '<div class="map-popup">'+
            '<p class="pp-hd">End Info</p>'+
            '<p>End Time: <span>'+data[data.length-1].end_time + '</span></p>'+
            '</div>';

        startPointMarker = new L.marker([startPoint.latitude , startPoint.longitude], {icon: startIcon});
        startPointMarker.bindPopup(startPopup).openPopup().addTo(map);

        endPointMarker = new L.marker([endPoint.latitude , endPoint.longitude ], {icon: stopIcon});
        endPointMarker.bindPopup(endPopup).openPopup().addTo(map);

        let pointSkipper = 0;
        for (let point of data){
            if(point.drive){
                for(let ping of point.points){
                    pointSkipper++;
                    let pointX = new L.LatLng(ping.lat, ping.lng);
                    polylinePoints.push(pointX);
                    if(pointSkipper%8 === 0){
                        let lineMarker = L.marker(pointX, {icon: lineIcon});
                        lineMarker.setRotationAngle((ping.course || 90));
                        lineLayer.addLayer(lineMarker);
                    }
                }
            }else {
                let pointmid = new L.LatLng(point.stop.latitude, point.stop.longitude);
                polylinePoints.push(pointmid);
                let stopPopup = '<div class="map-popup">'+
                    '<p class="pp-hd">Stop Info</p>'+
                    '<p>Strt Time: <span>'+point.start_time + '</span></p>'+
                    '<p>End Time: <span>'+point.end_time + '</span></p>'+
                    '<p>Residence : <span>'+SecondsTohhmmss(point.duration)+'</span></p>'+
                    '<p>Address &nbsp;&nbsp;&nbsp; : <span>'+point.start_addr+'</span></p>'+
                    '<p>Nearest Landmark : <span>'+point.NearLandMark+'</span></p>'+
                    '<p>Lat Lng :<span>'+point.stop.latitude+', '+point.stop.longitude+'</span></p>'+
                    '</div>';
                point.marker = L.marker([point.stop.latitude, point.stop.longitude],
                    {icon: flagIcon}).bindPopup(stopPopup)
                    .openPopup();
                //.on('click',onMarkerClick);
                point.marker.addTo(map);
            }
            let playBackLine = new L.Polyline(polylinePoints, fixedPolylineOptions);
            lineLayer.addLayer(playBackLine);
            map.fitBounds(playBackLine.getBounds());
        }
    }

}