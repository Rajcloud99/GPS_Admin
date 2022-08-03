materialAdmin.controller('googleMapCtrl', ['$rootScope', '$scope', '$uibModal', '$localStorage', 'landmarkService','utils', function ($rootScope, $scope, $uibModal, $localStorage, landmarkService,utils) {
    $rootScope.showSideBar = true;
    $rootScope.sidebarDevices = true;
    $rootScope.states = {};
    $rootScope.states.actItm = 'map_view';
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.alandMarkList = [];
    $scope.maps = utils.initializeMapView('map', false, true);
    $rootScope.maps = $scope.maps;
    var map = $scope.maps.map;
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [36, 45],//icon
            iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
        }
    });

    var pillarIcon = new LeafIcon({iconUrl: 'img/pillar.png'}),
        turnIcon = new LeafIcon({iconUrl: 'img/turn.png'}),
        stationIcon = new LeafIcon({iconUrl: 'img/station.png'}),
        otherIcon = new LeafIcon({iconUrl: 'img/other.png'}),
        bridgeIcon = new LeafIcon({iconUrl: 'img/bridge.png'}),
        powerIcon = new LeafIcon({iconUrl: 'img/power.png'}),
        signalIcon = new LeafIcon({iconUrl: 'img/signal.png'}),
        olightIcon = new LeafIcon({iconUrl: 'img/olight.png'}),
        dotIcon = new LeafIcon({iconUrl: 'img/dot.png'}),
        lcrossingIcon = new LeafIcon({iconUrl: 'img/lcrossing.png'}),
        pcrossingIcon = new LeafIcon({iconUrl: 'img/pcrossing.png'});
    let iconLayer = new L.layerGroup().addTo(map);

    function onMarkerClick(e) {
        console.log(this.options);
    }


    if ((new Date() - $rootScope.lastSync) > (1000 * 60 * 5)) {
        $rootScope.getAllTracksheetData($localStorage.preservedSelectedUser.user_id);
    }
    else {
        $rootScope.plotMarkerOnMap($rootScope.aTrSheetDevice);
    }

    function setBoundOnMap() {
        var bounds = markerClusterLayer.getBounds();
        map.fitBounds(bounds);
    }


    $rootScope.zoomDeviceInMap = function (device) {
        if (device && device.status !== 'inactive') {
            map.setView(new L.LatLng(device.lat, device.lng), 13);
            // map.fitBounds([[device.lat,device.lng]]);
        } else {
            swal('This Device is Inactive.');
        }
    };
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
                plotLandmarks(res);
            }
        }
    };
    // getlndmarks();
    function plotLandmarks(res) {
        $scope.alandMarkList = res;
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
            }   else if($scope.alandMarkList[i].category === 'km post') {
                 Icon = otherIcon;
            }   else if($scope.alandMarkList[i].category === 'signal')  {
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
            // iconLayer.removeLayer(iconMarker);
            let iconMarker = L.marker(newLatLng, {icon: Icon}).bindPopup(iconPopup).openPopup().on('click', onMarkerClick);
            iconLayer.addLayer(iconMarker);
        }
    }
    $scope.showLandmarks = function (value) {
        if(value) {
         getlndmarks() 
        }
        // $scope.showIcon = !$scope.showIcon;
        if(value) 
            iconLayer.addTo(map);    
        else  {
                iconLayer.clearLayers();
                return;
            }
    }

    // Initially, do not go into full screen
    $scope.isFullscreen = false;

    $scope.toggleFullScreen = function() {
        $scope.isFullscreen = !$scope.isFullscreen;
    }

}]);

materialAdmin.controller("crtLandCtrl", function ($rootScope, $scope, $localStorage, $window, GoogleMapService, $uibModal, $uibModalInstance, $interval, $state, $timeout, reportService) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.popData = $rootScope.globalDataForLandmark;
    $scope.popData.name = '';

    $scope.saveInfoLandmark = function () {
        function landDataResp(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
            }
        }

        if ($scope.popData && $scope.popData.name) {
            var landData = {};
            landData.request = "add_landmark";
            landData.login_uid = $localStorage.user.user_id;
            landData.user_id = $localStorage.preservedSelectedUser.user_id;
            landData.name = $scope.popData.name;
            landData.address = $scope.popData.formatedAddr || $scope.popData.addr || $scope.popData.NearLandMark;
            landData.location = {};
            landData.location.latitude = $scope.popData.lat;
            landData.location.longitude = $scope.popData.lng;
            GoogleMapService.addLandmark(landData, landDataResp);
        } else {
            swal("Please select (*) required field", "", "warning");
        }
    }
});

materialAdmin.controller('googleMapZoomCtrl', function ($rootScope, $localStorage, $stateParams, $http, $uibModal, $interval, $state, utils, $scope, LoginService, GoogleMapService,landmarkService) {
    $rootScope.showSideBar = true;
    $scope.alandMarkList = [];
    $scope.aDevice = [];
    ///\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var map, marker, multiLayerApply = false;
    var liveTrackIcon = L.Icon.extend({
        options: {
            iconSize: [50, 50],
            iconAnchor: [25, 25] // point of the icon which will correspond to marker's location
        }
    });
    //var oColourStatus = utils.setColor[p2]
    function getSVG(status) {
        var sColor = utils.setColor[status] ? utils.setColor[status] : "grey";
        var svgCode = utils.takeIcon($rootScope.selectedDevicekGlobalData.icon, sColor);

        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
    }

    function haveLatLng(oLatLng) {
        if (oLatLng.lat && oLatLng.lng) {
            return oLatLng;
        } else {
            return false;
        }
    }
    function initMap() {
        map = utils.initializeMapView('zoomMap', false, false).map;

    }
    map = utils.initializeMapView('zoomMap',false,false).map;
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [36, 45],
            iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
        }
    });

    var pillarIcon = new LeafIcon({iconUrl: 'img/pillar.png'}),
        turnIcon = new LeafIcon({iconUrl: 'img/turn.png'}),
        stationIcon = new LeafIcon({iconUrl: 'img/station.png'}),
        otherIcon = new LeafIcon({iconUrl: 'img/other.png'}),
        bridgeIcon = new LeafIcon({iconUrl: 'img/bridge.png'}),
        powerIcon = new LeafIcon({iconUrl: 'img/power.png'}),
        signalIcon = new LeafIcon({iconUrl: 'img/signal.png'}),
        olightIcon = new LeafIcon({iconUrl: 'img/olight.png'}),
        dotIcon = new LeafIcon({iconUrl: 'img/dot.png'}),
        lcrossingIcon = new LeafIcon({iconUrl: 'img/lcrossing.png'}),
        pcrossingIcon = new LeafIcon({iconUrl: 'img/pcrossing.png'});
    
    var iconLayer = new L.layerGroup().addTo(map);

    function onMarkerClick(e) {
        console.log(this.options);
    }

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
            // $scope.showIcon = !$scope.showIcon;
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
               }   else if($scope.alandMarkList[i].category === 'signal')  {
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
                let iconMarker = L.marker(newLatLng, {icon: Icon}).bindPopup(iconPopup).openPopup().on('click', onMarkerClick);
                iconLayer.addLayer(iconMarker);
                if(value) 
                    iconLayer.addTo(map);    
                else  {
                    iconLayer.remove();
                    return;
                }
            }
        }

    // Initially, do not go into full screen
    $scope.isFullscreen = false;

    $scope.toggleFullScreen = function() {
        $scope.isFullscreen = !$scope.isFullscreen;
    };

    var linePoints, polyline,resetPath;


    function setMarkers(oMarker) {
        var a = oMarker;
        a = utils.prepareData(a);
        a.rotationAngle = a.course || 90;
        a.rotationOrigin = 'center, center';
        var title = a.reg_no || '';
        var popupText = '<div class="map-popup">';
        if (a.acc_high) popupText = popupText + '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + a.acc_high + '</span></p>';
        if (a.ac_on) popupText = popupText + '<p>AC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + a.ac_on + '</span></p>';
        if (a.addr) popupText = popupText + '<p>Location &nbsp;&nbsp;&nbsp;: <span>' + a.addr + '</span></p>';
        if (a.lat) popupText = popupText + '<p>Latitute &nbsp;&nbsp;&nbsp;: <span>' + a.lat + '</span></p>';
        if (a.lng) popupText = popupText + '<p>Longitute &nbsp;&nbsp;&nbsp;: <span>' + a.lng + '</span></p>';
        if (a.positioning_time || a.location_time) popupText = popupText + '<p>Positioning Time &nbsp;&nbsp;&nbsp;: <span>' + moment(a.positioning_time || a.location_time).format('LLL') + '</span></p>';
        if (a.NearLandMark) popupText = popupText + '<p>Nearest Landmark &nbsp;&nbsp;&nbsp;: <span>' + a.NearLandMark + '</span></p><hr class="m-t-5 m-b-5">';
        popupText = popupText +
            '<a class="' + a.device_id + '" id="createLandmark11" uib-tooltip="create landmark" title="Create Landmark"><span class="glyphicon glyphicon-map-marker"></span></a>&nbsp;&nbsp;&nbsp;' +
            '<a class="' + a.device_id + '" id="createGeofence11" uib-tooltip="create Geofence" title="Create Geofence"><span class="glyphicon glyphicon-globe"></span></a>&nbsp;&nbsp;&nbsp;' +
            '</div>';
        a.icon = new liveTrackIcon({
            iconUrl: getSVG(a.status)
        });
        popupText = $(popupText);

        //click event for geofence create on marker popup window
        // use '$' in popupText for click under marker button, code below this function ex.:- https://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript#
        popupText.on('click', '#createGeofence11', function () {
            var getClassGeo = document.getElementById("createGeofence11");
            if (getClassGeo) {
                var selDevIMEI = getClassGeo.className;
                for (var g = 0; g < $rootScope.aTrSheetDevice.length; g++) {
                    if (selDevIMEI === $rootScope.aTrSheetDevice[g].imei) {
                        $rootScope.dataForGeofence = $rootScope.aTrSheetDevice[g];
                        break;
                    }
                }
                $rootScope.redirect('/#!/main/geozones');
            }
        });

        //click event for landmark create on marker popup window
        // use '$' in popupText for click under marker button, code below this function ex.:- https://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript#
        popupText.on('click', '#createLandmark11', function () {
            var getClass = document.getElementById("createLandmark11");
            if (getClass) {
                var selDevIMEI = getClass.className;
                for (var e = 0; e < $rootScope.aTrSheetDevice.length; e++) {
                    if (selDevIMEI === $rootScope.aTrSheetDevice[e].imei) {
                        $rootScope.dataForLandmark = $rootScope.aTrSheetDevice[e];
                        break;
                    }
                }
                // saveInfo($rootScope.dataForLandmark);
                addMarkerLandmark($rootScope.dataForLandmark);
            }
        });

        function addMarkerLandmark(SelectedLandmark) {
            $scope.aSelectedLandmark = SelectedLandmark;
            $uibModal.open({
                templateUrl: 'views/landmark/upsertLandmark.html',
                controller: ['$rootScope', '$http', '$scope', '$timeout', '$uibModalInstance', '$localStorage', 'landmarkService', 'otherUtils', 'otherData', 'utils', landmarkUpsertController],
                controllerAs: 'luVm',
                resolve: {
                    otherData: function () {
                        return {
                            aData: $scope.aSelectedLandmark,
                            type: 'add',
                            showMap: false
                        };
                    }
                },
            }).result.then(function (response) {
                console.log('close', response);
            }, function (data) {
                console.log('cancel', data);
            });
        }

        function saveInfo(dt) {
            map.closePopup();
            $rootScope.globalDataForLandmark = dt;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/main/landPopMap.html',
                controller: 'crtLandCtrl'
            });
        }


        if (!marker) {
            marker = L.marker([a.lat, a.lng], a).bindTooltip(title, {
                permanent: false,
                direction: 'top'
            }).openTooltip().bindPopup(popupText[0]).on('click', onMarkerClick).addTo(map);
            centerLeafletMapOnMarker(map, marker);
            map.setZoom(15);

        } else {
            var newLatLngLive = new L.LatLng(a.lat, a.lng);
            marker.setLatLng(newLatLngLive);
            marker.setRotationAngle((a.course || 90));
            marker.setIcon(a.icon);
        }
        //centerLeafletMapOnMarker(map, marker);


        // draw polyline code here ....

        if(!polyline){
            // add polyline running marker
            var polylineOptions = {
                color: 'green',
                weight: 5,
                opacity: 0.4
            };

            var lineLayer = new L.layerGroup().addTo(map);
            polyline = new L.Polyline([], polylineOptions);
            lineLayer.addLayer(polyline);
        }

        linePoints = {
                lat: (a.lat),
                lng: (a.lng)
        };

        polyline.addLatLng(linePoints);
        if(resetPath) {
            marker.setLatLng(linePoints);
            centerLeafletMapOnMarker(map,marker);
            resetPath = false;
        }
    }

    function onMarkerClick(e) {
        console.log(this.options);
    }

    function centerLeafletMapOnMarker(map, marker) {
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);

    }


    $rootScope.deviceInfo = '';
    $scope.stopFeed = function (allDevices,device) {
        var stopMap = {};
        $scope.device = $stateParams.device_id;
        for (var i = 0; i < allDevices.length; i++) {
            if (device ? allDevices[i].imei === device.imei : allDevices[i].imei === $stateParams.device_id) {
                var drawDevice = device || allDevices[i];
            } else {
                stopMap.device_id = allDevices[i].imei;
                stopMap.device_type = allDevices[i].device_type;
                stopMap.user_id = $localStorage.selectedUser.user_id;
                stopMap.request = 'stop_feed';
                if ($rootScope.local) {
                    // console.log('Stop Feed');
                    // console.log(allDevices[i].imei);
                }
                GoogleMapService.getMap(stopMap);
            }
        }
        $scope.device_selected = drawDevice;
        $scope.zoomInMap(drawDevice);
        if(device && polyline) {
            polyline.setLatLngs([]);
            resetPath = true;
        }
    };

    $scope.showDevice = function (device) {
        if ($rootScope.selectedUser) {
            $localStorage.selectedUser = $rootScope.selectedUser;
        }
        if ($stateParams.device_id) {
            var allDevices = $localStorage.selectedUser.devices;
            $scope.stopFeed(allDevices,device);
        }
    };

    $scope.zoomInMap = function (device) {
        $scope.mapCreated = false;
        $rootScope.deviceInfoB = device;
        var gMap = {};
        if (device && device.imei) {
            gMap.device_id = device.imei;
            gMap.device_type = device.device_type;
            var user_id = $localStorage.selectedUser.user_id;
            gMap.user_id = user_id;
            gMap.request = 'live_feedV2';
            GoogleMapService.getMap(gMap, response);
        } else {
            $rootScope.redirect('/#!/mains/mapZoom/');
        }
    };

    function response(response) {
        var oRes = JSON.parse(response);
        $rootScope.deviceInfo = oRes.data;
        //console.log(oRes);
        if (oRes.status === 'OK') {
            if (oRes && oRes.data) {
                if (oRes && oRes.data && oRes.data.lat && oRes.data.lng) {
                    $scope.cities = oRes.data;
                    oRes.data.datetime = moment(oRes.data.datetime).format('LLL');
                    $scope.$apply(function () {
                        $rootScope.setValueSidebar = oRes.data;
                    });

                    var oHaveData = haveLatLng($scope.cities);
                    if (!map) {
                        initMap();
                    }
                    setMarkers(oHaveData);

                    if(multiLayerApply === false) {
                        applyMultiLayer();     // apply multiple layer function, created last at controller
                    }

                    if (angular.isNumber($scope.cities.device_id)) {
                        $scope.cities.device_id = $scope.cities.device_id.toString();
                    }

                    if ($scope.mapCreated) {
                        //setMarker($scope.cities);
                    } else {
                        //createMap($scope.cities);
                    }
                }
            } else {
                //swal(oRes.message, "", "error");
            }
        } else if (oRes.status === 'ERROR') {
            swal(oRes.message, "", "error");
        }
    }

    $scope.showDevice();

    $scope.StartTimer = function () {
        $scope.Timer = $interval(function () {
            $scope.setValueSidebar = $scope.setValueSidebar;
        }, 10000);
    };


    ////// multiple layer code start here ...
    function applyMultiLayer() {
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
        multiLayerApply = true;



        // add polyline running marker
        if(!polyline){
            // add polyline running marker
            var polylineOptions = {
                color: 'green',
                weight: 5,
                opacity: 0.7
            };

            var lineLayer = new L.layerGroup().addTo(map);
            polyline = new L.Polyline([], polylineOptions);
            lineLayer.addLayer(polyline);
        }
    }

    //********back button **************/
    $scope.back = function (backUser) {
        var stopMap = {};
        if ($stateParams.device_id) {
            stopMap.device_id = $stateParams.device_id;
            if ($rootScope.hmapAllDevices[stopMap.device_id] && $rootScope.hmapAllDevices[stopMap.device_id].device_type) {
                stopMap.device_type = $rootScope.hmapAllDevices[stopMap.device_id].device_type;
            }
            stopMap.user_id = $localStorage.selectedUser.user_id;
            stopMap.request = 'stop_feed';
            if ($rootScope.local) {
                // console.log('Stop Feed');
                // console.log($stateParams.device_id);
            }
            GoogleMapService.getMap(stopMap);
        }
        if (backUser === 'home') {
            $rootScope.redirect('/#!/main/user');
        } else {
            var sUrl = "#!/main/map";
            $rootScope.redirect(sUrl);
        }

        //$state.reload();
        //window.location.reload(true);
    };

    if (typeof $rootScope.selectedUser !== "undefined") {
        $localStorage.onLocalselectedUser = $rootScope.selectedUser
    }
});

materialAdmin.controller('ListViewController', function ($rootScope, $scope, $http, $uibModal, $window, utils, LoginService, $timeout, $state, GoogleMapService, $localStorage, playBackService, reportService, $filter, objToCsv) {
    $rootScope.showSideBar = false;
    //$scope.aTrSheetDeviceOnMap = $localStorage.trSheet.aTrSheetDeviceOnMap;
    if ((new Date() - $rootScope.lastSync) > (1000 * 60 * 5)) {
        $rootScope.getAllTracksheetData($localStorage.preservedSelectedUser.user_id);
    }
    $scope.refreshData = function () {
        $rootScope.softRefreshPage();
    };
    $rootScope.states = {};
    $rootScope.states.actItm = 'List_View';

    //***** infinite scroll  start here ....***////

    $scope.numberToDisplay = 15; // by increasing this scroll visible then its working fine....
    $scope.loadMore = function () {
        if ($scope.numberToDisplay + 5 < $rootScope.aTrSheetDevice.length) {
            $scope.numberToDisplay += 5;
        } else {
            $scope.numberToDisplay = $rootScope.aTrSheetDevice.length || 15; // by increasing this no. scroll visible then its working fine....
        }
    };

    //***** infinite scroll  end here ....***////

    $scope.aVehicleTypes = {
        "TEMPO": [{
            "truck_type": "Tata 407 (3)",
            "code": "A",
            "category": "TEMPO",
            "capacity": 3
        }, {
            "truck_type": "Pick Up (1.3)",
            "code": "B",
            "category": "TEMPO",
            "capacity": 1.3
        }, {
            "truck_type": "14 feet (3.75)",
            "code": "C",
            "category": "TEMPO",
            "capacity": 3.75
        }, {"truck_type": "17 feet (4)", "code": "D", "category": "TEMPO", "capacity": 4}, {
            "truck_type": "19 feet (4)",
            "code": "E",
            "category": "TEMPO",
            "capacity": 4
        }, {"truck_type": "20 feet (4)", "code": "F", "category": "TEMPO", "capacity": 4}, {
            "truck_type": "Tata Ace (0.8)",
            "code": "G",
            "category": "TEMPO",
            "capacity": 0.8
        }],
        "CLOSED": [{
            "truck_type": "Tata 407 (3)",
            "code": "T",
            "category": "CLOSED",
            "capacity": 3
        }, {
            "truck_type": "Pick Up (1.3)",
            "code": "U",
            "category": "CLOSED",
            "capacity": 1.3
        }, {
            "truck_type": "Tata Ace (0.8)",
            "code": "V",
            "category": "CLOSED",
            "capacity": 0.8
        }, {
            "truck_type": "14 feet (3.75)",
            "code": "W",
            "category": "CLOSED",
            "capacity": 3.75
        }, {
            "truck_type": "17 feet (4)",
            "code": "X",
            "category": "CLOSED",
            "capacity": 4
        }, {
            "truck_type": "19 feet (4)",
            "code": "Y",
            "category": "CLOSED",
            "capacity": 4
        }, {"truck_type": "20 feet (4)", "code": "Z", "category": "CLOSED", "capacity": 4}, {
            "truck_type": "6 tyre (9)",
            "code": "AA",
            "category": "CLOSED",
            "capacity": 9
        }, {
            "truck_type": "22 feet single axel (9)",
            "code": "AB",
            "category": "CLOSED",
            "capacity": 9
        }, {
            "truck_type": "24 feet single axel (9)",
            "code": "AC",
            "category": "CLOSED",
            "capacity": 9
        }, {
            "truck_type": "32 feet single axel (9)",
            "code": "AD",
            "category": "CLOSED",
            "capacity": 9
        }, {"truck_type": "32 feet multi axel(15)", "code": "AE", "category": "CLOSED", "capacity": 15}],
        "OPEN": [{
            "truck_type": "Tata 407 (3)",
            "code": "AF",
            "category": "OPEN",
            "capacity": 3
        }, {
            "truck_type": "Pick Up (1.3)",
            "code": "AG",
            "category": "OPEN",
            "capacity": 1.3
        }, {
            "truck_type": "Tata Ace (0.8)",
            "code": "AH",
            "category": "OPEN",
            "capacity": 0.8
        }, {
            "truck_type": "14 feet (3.75)",
            "code": "AI",
            "category": "OPEN",
            "capacity": 3.75
        }, {"truck_type": "17 feet (4)", "code": "AJ", "category": "OPEN", "capacity": 4}, {
            "truck_type": "19 feet (4)",
            "code": "AK",
            "category": "OPEN",
            "capacity": 4
        }, {"truck_type": "20 feet (4)", "code": "AL", "category": "OPEN", "capacity": 4}, {
            "truck_type": "6 tyre (9)",
            "code": "AM",
            "category": "OPEN",
            "capacity": 9
        }, {
            "truck_type": "10 tyre taurus",
            "code": "AN",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "12 tyre taurus (20)",
            "code": "AO",
            "category": "OPEN",
            "capacity": 20
        }, {
            "truck_type": "22 feet single axel (9)",
            "code": "AP",
            "category": "OPEN",
            "capacity": 9
        }, {
            "truck_type": "24 feet single axel (9)",
            "code": "AQ",
            "category": "OPEN",
            "capacity": 9
        }, {
            "truck_type": "32 feet single axel (9)",
            "code": "AR",
            "category": "OPEN",
            "capacity": 9
        }, {
            "truck_type": "32 feet multi axel (15)",
            "code": "AS",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "28 feet single axel (15)",
            "code": "AT",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "32 feet single axel (9)",
            "code": "AU",
            "category": "OPEN",
            "capacity": 9
        }, {
            "truck_type": "24 feet multi axel (15)",
            "code": "AV",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "28 feet multi axel (15)",
            "code": "AW",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "32 feet multi axel (15)",
            "code": "AX",
            "category": "OPEN",
            "capacity": 15
        }, {
            "truck_type": "14 tyre taurus(20)",
            "code": "AY",
            "category": "OPEN",
            "capacity": 20
        }, {
            "truck_type": "24 feet multi axel (16)",
            "code": "BU",
            "category": "OPEN",
            "capacity": 16
        }, {
            "truck_type": "28 feet multi axel (16)",
            "code": "BV",
            "category": "OPEN",
            "capacity": 16
        }, {
            "truck_type": "32 feet multi axel (16)",
            "code": "BZ",
            "category": "OPEN",
            "capacity": 16
        }, {"truck_type": "32 feet multi axel (20)", "code": "CA", "category": "OPEN", "capacity": 20}],
        "TRAILER": [{
            "truck_type": "32 feet single axel (9)",
            "code": "BA",
            "category": "TRAILER",
            "capacity": 9
        }, {
            "truck_type": "32 feet multi axel (15)",
            "code": "BB",
            "category": "TRAILER",
            "capacity": 15
        }, {
            "truck_type": "40 feet semi low bed (22)",
            "code": "BC",
            "category": "TRAILER",
            "capacity": 22
        }, {
            "truck_type": "24 feet single axel (20)",
            "code": "BD",
            "category": "TRAILER",
            "capacity": 20
        }, {
            "truck_type": "28 feet multi axel (15)",
            "code": "BE",
            "category": "TRAILER",
            "capacity": 15
        }, {
            "truck_type": "32 feet multi axel (15)",
            "code": "BF",
            "category": "TRAILER",
            "capacity": 15
        }, {
            "truck_type": "20 feet low bed (9)",
            "code": "BH",
            "category": "TRAILER",
            "capacity": 9
        }, {
            "truck_type": "20 feet high bed (9)",
            "code": "BI",
            "category": "TRAILER",
            "capacity": 9
        }, {
            "truck_type": "40 feet semi low bed (27)",
            "code": "CB",
            "category": "TRAILER",
            "capacity": 27
        }, {
            "truck_type": "40 feet semi low bed (32)",
            "code": "CC",
            "category": "TRAILER",
            "capacity": 32
        }, {
            "truck_type": "28 feet multi axel (16)",
            "code": "CD",
            "category": "TRAILER",
            "capacity": 16
        }, {
            "truck_type": "32 feet multi axel (16)",
            "code": "CF",
            "category": "TRAILER",
            "capacity": 16
        }, {"truck_type": "32 feet multi axel (20)", "code": "CG", "category": "TRAILER", "capacity": 20}]
    };

    var todayDate2 = new Date();
    todayDate2.setDate(todayDate2.getDate() - 2);
    $scope.dist_2 = todayDate2;

    var todayDate3 = new Date();
    todayDate3.setDate(todayDate3.getDate() - 3);
    $scope.dist_3 = todayDate3;

    var todayDate4 = new Date();
    todayDate4.setDate(todayDate4.getDate() - 4);
    $scope.dist_4 = todayDate4;

    var todayDate5 = new Date();
    todayDate5.setDate(todayDate5.getDate() - 5);
    $scope.dist_5 = todayDate5;

    $rootScope.listInit = function () {
        //*******fetch devices*******//
        $rootScope.selectedUser = $scope.selectedUser || $localStorage.preservedSelectedUser || $localStorage.user;
        //******* new data get by app.js *****//

        $timeout(function () {
            if ($rootScope.trackSheetResStore && $rootScope.trackSheetResStore.shown_fields) {
                $scope.aFieldShow = $rootScope.trackSheetResStore.shown_fields;
            }
        }, 1000);

        //********** new data get by app.js end here *****//

        var sort_desc = false;
        $scope.sorting = function (sortKey) {
            $rootScope.aTrSheetDevice = $filter('orderBy')($rootScope.aTrSheetDevice, sortKey, sort_desc);
            sort_desc = sort_desc ? false : true;
        }

        $scope.onSelectVehicle = function ($item, $model, $label) {
            $scope.reg_no = $item.reg_no;
            $rootScope.getPageNo = 0;
            $scope.bigCurrentPage = 1;
            $scope.setPage(1);
            $scope.getAllDevice();
        };
        $scope.remVehicle = function (vehicleNum) {
            if (vehicleNum.length < 1) {
                $scope.reg_no = '';
                $rootScope.getPageNo = 0;
                $scope.bigCurrentPage = 1;
                $scope.setPage(1);
                $scope.getAllDevice();
            }
        };
        $scope.onSelectImei = function ($item, $model, $label) {
            $scope.imei = $item.imei;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllDevice();
        };
        $scope.remImei = function (vehicleImei) {
            if (vehicleImei.length < 1) {
                $scope.imei = '';
                $rootScope.getPageNo = 0;
                $scope.setPage(1);
                $scope.getAllDevice();
            }
        };
        $scope.sAllTripStatus = ['online', 'offline'];
        $scope.getStatus = function (status) {
            $scope.sStatus = status;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllDevice();
        }
        $scope.getByAddr = function (addr) {
            $scope.address = addr;
            $scope.bigCurrentPage = 1;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllDevice();
        }
        $scope.getByBranch = function (branch) {
            $scope.branch = branch;
            $scope.bigCurrentPage = 1;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllDevice();
        }
        $scope.getBydriver = function (driver) {
            $scope.driver_name = driver;
            $scope.bigCurrentPage = 1;
            $rootScope.getPageNo = 0;
            $scope.setPage(1);
            $scope.getAllDevice();
        }
    }

    $rootScope.listInit();
    //****** geozone list get function **********//
    $rootScope.getGeoZone = function(){
        function geoListResponse(response){
            var oRes = JSON.parse(response);
            if(oRes){
                if(oRes.status === 'OK'){
                    $scope.$apply(function() {
                        var toUpdateDateFormate = oRes.data;
                        for(var i=0; i<toUpdateDateFormate.length; i++){
                            if(toUpdateDateFormate[i].datetime){
                                toUpdateDateFormate[i].datetime = moment(toUpdateDateFormate[i].datetime).format('LLL');
                            }
                        }
                        $scope.aGeoZoneList = toUpdateDateFormate;
                    });
                }
                else if(oRes.status === 'ERROR'){
                    //swal(oRes.message, "", "error");
                    $scope.aGeoZoneList = [];
                }
            }
        }

        var getGeoList = {};
        getGeoList.login_uid = $localStorage.user.user_id;
        getGeoList.request = 'get_geozone';
        //getGeoList.row_count = 12;
        getGeoList.token = $localStorage.user.token;
        LoginService.getGeozoneList(getGeoList,geoListResponse);
    };

    $rootScope.getGeoZone();   //****call geo list function
    //****** geo list get function **********//

    $scope.downloadSheet = function () {
        function downloadSheetResp(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.sheetDownloadResp = oRes.data;
                    console.log($scope.sheetDownloadResp);
                    var a = document.createElement('a');
                    a.href = $scope.sheetDownloadResp;
                    a.download = $scope.sheetDownloadResp;
                    a.target = '_blank';
                    a.click();
                    //$window.open($scope.sheetDownloadResp, "_blank");
                }
            }
        }

        var sheet = {};
        if ($scope.sortingKey) {
            sheet.sort = $scope.sortingKey;
            if ($scope.respList.sort_desc === false) {
                sheet.sort_desc = true;
            } else {
                sheet.sort_desc = false;
            }
        }
        sheet.request = "download_tracking_sheet";
        LoginService.downloadSheetService(sheet, downloadSheetResp);
    };

    $scope.downloadCsv = function(aData) {
        let cnt = 1;
        objToCsv('TrackingSheet', [
            'VEHICLE',
            'STATUS',
            'ADDRESS',
            'POSITION TIME',
            'LOCATION TIME',
            'STOPPAGE (HRS)',
            'SPEED (km/h)',
        ], aData.map( o => {
            let arr = [];

            try{
                arr.push(o.reg_no || 'NA');
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.status || 'NA');
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.addr || 'NA');
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.positioning_time || "NA")
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.location_time || 'NA');
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.stoppage_time || 'NA');
            }catch(e){
                arr.push("NA");
            }

            try{
                arr.push(o.speed || 'NA');
            }catch(e){
                arr.push("NA");
            }

            return arr;
        }));


    }

    var newD = new Date();
    newD.setHours(newD.getHours() - 24);
    $scope.dateTimeStart = newD;
    $scope.dateTimeEnd = new Date();

    $scope.reportThisVehicle = function (device) {
        $scope.userDevices = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;

        function reportThisRes(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                $rootScope.loader = false;
                if (oRes.status === 'OK') {
                    $scope.localArrayData = [];
                    $scope.localDateWiseDataArray = [];
                    var s = 0;
                    for (var i = 0; i < oRes.device_id.length; i++) {
                        if (oRes.data[oRes.device_id[i]]) {
                            var inDeviceData;
                            inDeviceData = oRes.data[oRes.device_id[i]];
                            if (inDeviceData.dur_idle) {
                                inDeviceData.dur_idle = utils.convertSecondsInToHour(inDeviceData.dur_idle);
                            }
                            var duration_calculate3 = $rootScope.dur_calc(inDeviceData.dur_stop);
                            inDeviceData.dur_stop = duration_calculate3;
                            var duration_calculate4 = $rootScope.dur_calc(inDeviceData.dur_total);
                            inDeviceData.dur_total = duration_calculate4;
                            if (inDeviceData.tot_dist) {
                                inDeviceData.tot_dist = utils.convertMeterInToKM(inDeviceData.tot_dist);
                            }

                            for (var d = 0; d < inDeviceData.data.length; d++) {
                                if (inDeviceData.data[d].distance) {
                                    inDeviceData.data[d].distance = utils.convertMeterInToKM(inDeviceData.data[d].distance);
                                }
                                if (inDeviceData.data[d].drive === true || inDeviceData.data[d].drive === false) {
                                    if (inDeviceData.data[d].drive === true) {
                                        inDeviceData.data[d].driveStatus = 'Running';
                                    } else if (inDeviceData.data[d].drive === false) {
                                        if (inDeviceData.data[d].idle === 'true') {
                                            inDeviceData.data[d].driveStatus = 'Idle';
                                        } else {
                                            inDeviceData.data[d].driveStatus = 'Stopped';
                                        }
                                    }
                                }
                                var duration_calculate5 = $rootScope.dur_calc(inDeviceData.data[d].duration);
                                inDeviceData.data[d].duration = duration_calculate5;
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
                                if (inDeviceData.data[d].acc_high) {
                                    if (inDeviceData.data[d].acc_high === true) {
                                        inDeviceData.data[d].acc_high = 'ON';
                                    } else if (inDeviceData.data[d].acc_high === false) {
                                        inDeviceData.data[d].acc_high = 'OFF';
                                    } else if (inDeviceData.data[d].acc_high === undefined) {
                                        inDeviceData.data[d].acc_high = 'NA';
                                    }
                                }

                                if (inDeviceData.data[d].ac_on) {
                                    if (inDeviceData.data[d].ac_on === true) {
                                        inDeviceData.data[d].ac_on = 'ON';
                                    } else if (inDeviceData.data[d].ac_on === false) {
                                        inDeviceData.data[d].ac_on = 'OFF';
                                    } else if (inDeviceData.data[d].ac_on === undefined) {
                                        inDeviceData.data[d].ac_on = 'NA';
                                    }
                                }
                                inDeviceData.data[d].datetime = moment(inDeviceData.data[d].datetime).format('LLL');
                                inDeviceData.data[d].showBtn = true;

                                for (var b = 0; b < $scope.userDevices.length; b++) {
                                    if ($scope.userDevices[b].imei === inDeviceData.data[d].imei) {
                                        inDeviceData.data[d].reg_no = $scope.userDevices[b].reg_no;
                                        inDeviceData.reg_no = $scope.userDevices[b].reg_no;
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
                                    if (oRes.device_id[i] === $rootScope.forGetDeviceList[g].imei) {
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
                                    if (oRes.device_id[i] === $rootScope.forGetDeviceList[g].imei) {
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
                    if ($scope.speedLim) {
                        oRes.speed_limit = $scope.speedLim;
                    }
                    if ($scope.durationLim) {
                        oRes.time_interval = $scope.durationLim;
                    }
                    oRes.dateTimeStart = moment($scope.dateTimeStart).format('LLL');
                    oRes.dateTimeEnd = moment($scope.dateTimeEnd).format('LLL');
                    $rootScope.reportData.push(oRes);
                    $rootScope.reportData[0].localDataArray = $scope.localArrayData;
                    $rootScope.reportData[0].localDateWiseDataArray = $scope.localDateWiseDataArray;
                    $rootScope.reportData[0].userDevicesforDropDown = $scope.userDevices;
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
                    // console.log($rootScope.reportData);
                    $rootScope.redirect('/#!/main/reportBasic');
                }
                else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        if (device.status != 'inactive') {
            var reportThis = {};
            $rootScope.reportData = [];
            $rootScope.forGetDeviceList = [];
            $rootScope.forGetDeviceList = [device.imei];
            reportThis.request = 'report_activity';
            reportThis.device_id = [device.imei];
            reportThis.start_time = $scope.dateTimeStart;
            reportThis.end_time = $scope.dateTimeEnd;

            reportService.getReport(reportThis, reportThisRes);
            $rootScope.loader = true;
            $timeout(function () {
                $rootScope.loader = false;
            }, 60000);
        } else {
            swal('This Device is Inactive.');
        }
    };

    $scope.updateDevice = function (device) {
        $rootScope.upDevice = device;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/main/updateDevicePop.html',
            controller: 'updateDevicePopCtrl'
        });
    };

    $scope.updateVehicleType = function (device) {
        $scope.vehicles = $scope.aVehicleTypes;
        $rootScope.vehicles = $scope.aVehicleTypes;
        $rootScope.upDeviceType = device;
        $rootScope.vehicleType = {};
        var modalInstance = $uibModal.open({
            templateUrl: 'views/main/selTruckPop.html',
            controller: 'selTruckCntr'
        });

    };

    $scope.showLandMarkPos = function (deviceData) {
        if (deviceData) {
            //deviceData.reg_no = deviceData.reg_no;
            $rootScope.sMapViewData22 = deviceData;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/main/singleViewOnMap.html',
                controller: 'sViewMapCtrl'
            });
        }
    };

    $scope.createLandmarkListView = function (landDT) {
        if (landDT) {
            $rootScope.globalDataForLandmark = landDT;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/main/landPopMap.html',
                controller: 'crtLandCtrl'
            });
        }
    };

    $scope.addMarkerLandmark = function(SelectedLandmark) {
        $scope.aSelectedLandmark = SelectedLandmark;
        $uibModal.open({
            templateUrl: 'views/landmark/upsertLandmark.html',
            controller: ['$rootScope', '$http', '$scope', '$timeout', '$uibModalInstance', '$localStorage', 'landmarkService', 'otherUtils', 'otherData', 'utils', landmarkUpsertController],
            controllerAs: 'luVm',
            resolve: {
                otherData: function () {
                    return {
                        aData: $scope.aSelectedLandmark,
                        type: 'add',
                        showMap: false
                    };
                }
            },
        }).result.then(function (response) {
            console.log('close', response);
        }, function (data) {
            console.log('cancel', data);
        });
    }

    $scope.settingColumn = function () {
        //$rootScope.settingDevices = $scope.trackSheetResStore;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/main/settingOnList.html',
            controller: 'settingListCtrl'
        });
    };

    $scope.tripDetail = function (device) {
        if (device.on_trip != null) {
            $rootScope.tripDetailDev = device;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/main/tripDetailPop.html',
                controller: 'tripDetailPopCtrl'
            });
        }
    };

    $scope.advanceSearch = function () {
        $rootScope.setSearchFields = $scope.aFieldShow;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/main/advanceSearchPop.html',
            controller: 'advSearchCtrl'
        });

        modalInstance.result.then(function (resss) {
            //$state.reload();
            $scope.advSearchResp = resss;
            $scope.getAllDevice();
        }, function (data) {
            /*if (data != 'cancel') {
         swal("Oops!", data.data.message, "error")
         }*/
            //$state.reload();
        });
    };

    $scope.removeThisFilter = function (k, i) {
        var keys = Object.keys($scope.advSearchResp);
        delete $scope.advSearchResp[keys[i]];
        if (k === 'branch') {
            $scope.branch = '';
        } else if (k === 'driver_name') {
            $scope.driver_name = '';
        } else if (k === 'addr') {
            $scope.address = '';
        } else if (k === 'reg_no') {
            $scope.vehicleNum = '';
            $scope.reg_no = '';
        }
        $scope.getAllDevice();
    };
    $scope.keychange = function (key) {
        switch (key) {
            case "vehicle_type":
                return "Vehicle Type"
                break;
            case "status":
                return "Status"
                break;
            case "vehicle_status":
                return "Vehicle Status"
                break;
            case "trip_status":
                return "Trip Status"
                break;
            case "route":
                return "Route"
                break;
            case "owner_group":
                return "Owner Group"
                break;
            case "customer":
                return "Customer"
                break;
            case "nearest_landmark":
                return "Nearest Landmark"
                break;
            case "positionTimeStart":
                return "Start Position Time"
                break;
            case "positionTimeEnd":
                return "End Position Time"
                break;
            case "locationTimeStart":
                return "Start Location Time"
                break;
            case "locationTimeEnd":
                return "End Location Time"
                break;
            default :
                return key;
        }
    }

});

materialAdmin.controller("advSearchCtrl", function ($rootScope, $scope, DateUtils, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //*************** custome Date time Picker for multiple date selection in single form ************
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
    //********************//**********************//*****************//
    $scope.setSearchFields = $rootScope.setSearchFields;

    $scope.searchData = {};
    //$scope.searchData.nearest_landmark = {};


    $scope.advSearch = function () {
        if ($scope.searchData.positionTimeStart) {
            $scope.searchData.positionTimeStart = moment($scope.searchData.positionTimeStart).format('LLL');
        }
        if ($scope.searchData.positionTimeEnd) {
            $scope.searchData.positionTimeEnd = moment($scope.searchData.positionTimeEnd).format('LLL');
        }
        if ($scope.searchData.locationTimeStart) {
            $scope.searchData.locationTimeStart = moment($scope.searchData.locationTimeStart).format('LLL');
        }
        if ($scope.searchData.locationTimeEnd) {
            $scope.searchData.locationTimeEnd = moment($scope.searchData.locationTimeEnd).format('LLL');
        }

        $uibModalInstance.close($scope.searchData);
    }


});


materialAdmin.controller("tripDetailPopCtrl", function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, LoginService, TripService) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.tripD = $rootScope.tripDetailDev;
    $scope.getSingleTripDetail = function () {
        function updateResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes.status == 'OK') {
                $scope.$apply(function () {
                    var aRespTrip = [];
                    var gotTrip = oRes.data;
                    //$scope.localTrip =  oRes.data;
                    for (var i = 0; i < gotTrip.length; i++) {
                        gotTrip[i].showBtn = true;
                        var tripModify = {};
                        tripModify = gotTrip[i];
                        if (gotTrip[i].created_at) {
                            tripModify.create_time = moment(gotTrip[i].created_at).format("DD-MM-YYYY hh:MMa");
                        }
                        if (gotTrip[i].start_time) {
                            tripModify.start_time_local = moment(gotTrip[i].start_time).format("DD-MM-YYYY hh:MMa");
                        }
                        if (gotTrip[i].end_time) {
                            tripModify.end_time_local = moment(gotTrip[i].end_time).format("DD-MM-YYYY hh:MMa");
                        }

                        aRespTrip.push(tripModify);
                    }
                    $scope.aTrips = aRespTrip;
                });
            } else if (oRes.status == 'ERROR') {
                swal(oRes.message, "", "error");
            }
        };
        $scope.getTripDetailSingle = {};
        $scope.getTripDetailSingle.request = 'get_trips';
        $scope.getTripDetailSingle.imei = $rootScope.tripDetailDev.imei;
        $scope.getTripDetailSingle.vehicle_no = $rootScope.tripDetailDev.reg_no;
        $scope.getTripDetailSingle.row_count = 1;
        $scope.getTripDetailSingle.selected_uid = $localStorage.preservedSelectedUser.user_id;
        TripService.getAllTrip.List($scope.getTripDetailSingle, updateResponse);
    };

    $scope.getSingleTripDetail();

    $scope.updateColumn = function () {
        function updateResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $rootScope.listInit();
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };
        $scope.selColFields = {};
        $scope.settingColumns.shown_local_fields = [];
        for (var s = 0; s < $scope.settingColumns.allowed_local_fields.length; s++) {
            if ($scope.settingColumns.allowed_local_fields[s].selected == true) {
                $scope.settingColumns.shown_local_fields.push($scope.settingColumns.allowed_local_fields[s].key);
            }
        }
        $scope.selColFields.request = 'update_feature';
        $scope.selColFields.login_uid = $localStorage.user.user_id;
        $scope.selColFields.feature = 'tracksheet';
        $scope.selColFields.shown_fields = $scope.settingColumns.shown_local_fields;
        $scope.selColFields.allowed_fields = $scope.settingColumns.allowed_fileds;
        LoginService.columnUpService($scope.selColFields, updateResponse);
    };

});

materialAdmin.controller("settingListCtrl", function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, LoginService) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.settingColumns = $rootScope.trackSheetResStore;
    $scope.settingColumns.localStore = {
        'branch': 'Branch',
        'reg_no': 'Vehicle No.',
        'vehicle_type': 'Vehicle Type',
        'driver_name': 'Driver Name',
        'status': 'Status',
        'addr': 'Address',
        'positioning_time': 'Positioning Time',
        'location_time': 'Location Time',
        'stoppage_time': 'Stoppage Time',
        'speed': 'Speed',
        'dist_today': 'Distance Today',
        'dist_yesterday': 'Distance Yesterday',
        'dist_d_2': 'Distance before 2 days',
        'dist_d_3': 'Distance before 3 days',
        'dist_d_4': 'Distance before 4 days',
        'dist_d_5': 'Distance before 5 days',
        'dist_last_week': 'Distance last Week',
        'remark': 'Remark',
        'nearest_landmark': 'Nearest Landmark',
        'geofence_status': 'Geofence Status',
        'created_at': 'Created Time',
        'created_by': 'Created By',
        'consignee': 'Consignee',
        'consignor': 'Consignor',
        'source': 'Source',
        'destination': 'Destination',
        'driver': 'Driver Name',
        'driver_no': 'Driver No.',
        'start_time': 'Start Time',
        'end_time': 'End Time',
        'est_dist': 'Estimated Distance',
        'etoa': 'ETOA',
        'forworder': 'Forworder',
        'gps_status': 'Gps Status',
        'imei': 'IMEI',
        'journey': 'Journey',
        'last_tracking': 'Last Tracking',
        'loading': 'Loading',
        'unloading': 'Unloading',
        'manager': 'Manager',
        'remark1': 'Remark1',
        'remark2': 'Remark2',
        'remark3': 'Remark3',
        'trip_id': 'Trip Id',
        'trip_no': 'Trip no',
        'vehicle_no': 'Vehicle no.',
        'cur_location': 'Current Location',
        'owner_group': 'Owner Group',
        'route': 'Route',
        'vehicle_status': 'Vehicle Status',
        'customer': 'Customer',
        'trip_status': 'Trip Status',
        'estimated_dist': 'Estimated distance'
    }

    $scope.toggleAllCheck = function () {
        var toggleStatus = $scope.isAllSelected;
        angular.forEach($scope.settingColumns.allowed_local_fields, function (itm) {
            itm.selected = toggleStatus;
        });

    }

    $scope.settingColumns.allowed_local_fields = [];

    for (var f = 0; f < $scope.settingColumns.allowed_fields.length; f++) {
        var ffd = $scope.settingColumns.allowed_fields[f];
        //$scope.settingColumns.localStore[ffd];
        $scope.settingColumns.allowed_local_fields[f] = {};
        $scope.settingColumns.allowed_local_fields[f].key = $scope.settingColumns.allowed_fields[f];
        $scope.settingColumns.allowed_local_fields[f].value = $scope.settingColumns.localStore[ffd];
        //$scope.settingColumns.allowed_local_fields[f].selected = false;
        if ($scope.settingColumns.shown_fields.indexOf(ffd) > -1) {
            $scope.settingColumns.allowed_local_fields[f].selected = true;
        } else {
            $scope.settingColumns.allowed_local_fields[f].selected = false;
        }
    }

    $scope.setColumn = function () {
        $scope.settingColumns.shown_local_fields;
    };

    $scope.updateColumn = function () {
        function updateResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $rootScope.trackSheetResStore.shown_fields = oRes.data.shown_fields;
                    $rootScope.listInit();
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };
        $scope.selColFields = {};
        $scope.settingColumns.shown_local_fields = [];
        for (var s = 0; s < $scope.settingColumns.allowed_local_fields.length; s++) {
            if ($scope.settingColumns.allowed_local_fields[s].selected == true) {
                $scope.settingColumns.shown_local_fields.push($scope.settingColumns.allowed_local_fields[s].key);
            }
        }
        $scope.selColFields.request = 'update_feature';
        $scope.selColFields.login_uid = $localStorage.user.user_id;
        $scope.selColFields.feature = 'tracksheet';
        $scope.selColFields.shown_fields = $scope.settingColumns.shown_local_fields;
        $scope.selColFields.allowed_fields = $scope.settingColumns.allowed_fields;
        LoginService.columnUpService($scope.selColFields, updateResponse);
    };

});

materialAdmin.controller("sViewMapCtrl", function ($rootScope, $scope, $localStorage, $window, GoogleMapService, $uibModal, $uibModalInstance, $interval, $state, $timeout, utils, reportService) {
    $rootScope.showSideBar = false;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var map;
    var markers;
    var marker;
    function initMap() {
        map = utils.initializeMapView('sMapListView',{
            zoomControl: true,
            hybrid: true,
            zoom: 10,
            search:false,
            location:false,
            center: new L.LatLng(21, 90)
        },false).map;
    }

    var oColourStatus = {"running":"#15e425","online":"#15e425","stopped":"red","offline":"grey"}
    function getSVG(status) {
        var sColor = oColourStatus[status]?oColourStatus[status]:"grey";
        var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="23.164264678955078,36.56473159790039 0.16326522827148438,32.7097282409668 49.79926681518555,9.929727554321289 25.79926300048828,58.34572982788086" id="svg_1" class="" transform="rotate(-44.91157150268555 24.981266021728523,34.13772583007813) " fill="'+ sColor +'" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
        //var svgCode = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 47.032 47.032" style="enable-background:new 0 0 47.032 47.032;" xml:space="preserve"><g><path d="M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
    };
    function getLandmarkSVG() {
        var svgCode = '<svg width="580" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' + ' <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->\n' + ' <g>\n' + '  <title>background</title>\n' + '  <rect fill="#fff" id="canvas_background" height="402" width="582" y="-1" x="-1"/>\n' + '  <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">\n' + '   <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>\n' + '  </g>\n' + ' </g>\n' + ' <g>\n' + '  <title>Layer 1</title>\n' + '  <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQUIwNkIwMkEzQzExRTY4RjM3RDkxOUREN0Q5RTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQUIwNkIxMkEzQzExRTY4RjM3RDkxOUREN0Q5RTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNBQjA2QUUyQTNDMTFFNjhGMzdEOTE5REQ3RDlFMkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNBQjA2QUYyQTNDMTFFNjhGMzdEOTE5REQ3RDlFMkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz44xeteAAAEbElEQVR42oxVXWwUVRg9Mzu7293tLnWBuCjaSm0khmI0UgliFKj4oDZK+E2MiUYJJEZTY2KMLxofjL6gJmoNwQcfFB+KaKIUpFASwJCY8CNoCqFGUGiRtrss3b/Zmev57swulu5SbvbsnXvn3nO/n3O/MTZ+NwbdDP4MA4bpP3tdnN1dfNHKfiaRJ/6CUmfZX1T8U/oPcF2l+0qzUL/dTawmVnL3XPZhwiHSxBGilzhA2LU21yJO8uS3efhLRKLOofcTm4j9xFv+QZOaed24jaT9xOtEQrlAmTaWygpFW+neLovbnvvEMkLIN97I4lal1E7G7F4ZOK4Xv1kxE3PiFuJhAxMlhZGrDuGiLJs9syLE5/5RW6vEygt4mNNfsNekJUehKWKia34ED90RQixkVE8v0OpjF2z8MJjHhYyDUMCoeL6F2f6dPIf0hLhFl58nVojrJZpyayyA7ocbsbw1PIlUWoNlYPGdIbz5SBxtSQsFW+8XxJSDd8gXFE5LuSpIozfLJlFMmBa8+GAMzU0Wtv36BgKmhafnv0JLJ6rkjltGMjoTL3ek8P7+NMZzLtfpV53Eo8Rey3XUEup0gcwW6ebSljDume2F/nzmT/x8Zge+PfFBlbRMa6LBRrz3+PdYmEphBb365miOJhoV7a9irgZNWrmA4g46fOCEdrPSwjQjbEmSTA3TENIgupf2kHS5XtN+W0gntkyj5JKQZxG7FpOxaZYYOYxtImTqpNVrEqpIMI6WpvbqXKrRRAPD5+dKcAsxz2QoogQEBi02/58rw3N9wnaRI0rU9N+ZMWw5tJnSS+slogrZ53ChzxMUTosneStoTTqncLUo6g948XRs3J5Ioj21jNa6cJStxV1yCjh16SA65j6F0QkeWpJpz2pRJDFOYhYUv3jkebuOnbfRNjvoazbLmD+D15Zso+Ulxjk0JTwnL9oYzToQObsezyV6elZifJRIS3wsVre9f+Txb9bxZEXrLLMBvSc/xJqvZ+DwuR346XQPfhseQEVFfadycByvsgkHrd7HfshY3TMia/qIJ/St4+LF88Lo7myCrYb1rS+WC1q7/1w5g+0n3kXbrIV44YGP8NXhMnYez1I51cQwKOggjhurPtPEnTRuj5cuhoAhuY9XedNjCTQnA1PcH+Nd+fLgFQycziPIbBvXEr6Vz7ogGc9+OuLlzsXHpH0VfiZLzFOU+lwkF2ZOEI18zhUVhi6XcWSowNumtKVVUoVB7l/J8TlN3PXJcOWFVKntRFfleClQEkdJilQyKk7LUQjNySVknHiS+AVGpR77nxYRBYmeY+34Uckt1J8aWsVIRCyPOMq+gWPRbWUNcZlYo0lRrdNTCn2WezYQu5THWwWuG/sYJYS0f7oviCanZDYQu1xPPvWQJtaReKDW9a9XGDLcsI6Xp08KSw2MEvKh7TfqEJg3+Epn6f56iAzVtdgRGWJtLfdvlrhqOaW4269cckPXkn/fNPumJZaWJtF6HtArquF4j3ETm/4TYAAlEF8DfRc+XwAAAABJRU5ErkJggg==" id="svg_1" height="26" width="22" y="187" x="279"/>\n' + ' </g>\n' + '</svg>';
        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
    }
    function haveLatLng(oLatLng) {
        if(oLatLng.lat && oLatLng.lng) {
            return oLatLng;
        }else {
            return false;
        }
    };

    function setMarkers(oMarker) {
        var a = oMarker;
        var landmarkAddress = (oMarker.nearest_landmark && oMarker.nearest_landmark.name && oMarker.nearest_landmark.dist) ? ((oMarker.nearest_landmark.dist?(oMarker.nearest_landmark.dist/ 1000):"NA") ) + " KM from " + oMarker.nearest_landmark.name : "NA";
        a.rotationAngle = a.course || 90;
        a.rotationOrigin = 'center, center';
        var title = a.reg_no;
        var popupText = '<div><b>Address:</b> ' + oMarker.addr + '</div><div><b>Landmark:</b> ' + landmarkAddress + '</div>';
        //a.clickable = true;
        /*a.icon= new GpsGaadiIcon({
            iconUrl: getSVG(a.status)
        });*/
        marker = L.marker([a.lat, a.lng], a).bindTooltip(title,{permanent:false,direction:'top'}).openTooltip().bindPopup(popupText).openPopup();
        marker.on('click',onMarkerClick);
        marker.setIcon(L.icon({
            iconUrl: getSVG(a.status),
            iconSize: [21, 32]
        }));
        marker.addTo(map);
        centerLeafletMapOnMarker(map,marker);
    };

    function setLandmark(oMarker) {
        if(oMarker.nearest_landmark && oMarker.nearest_landmark.location && oMarker.nearest_landmark.location.latitude && oMarker.nearest_landmark.location.longitude){
            var o = {};
            /*o.icon= new GpsGaadiIcon({
                iconUrl: L.Icon.Default.imagePath +'../../img/start-small.png'
            });*/
            var landmarkMarker = L.marker([oMarker.nearest_landmark.location.latitude, oMarker.nearest_landmark.location.longitude], o).bindTooltip(oMarker.nearest_landmark.name,{permanent:false,direction:'top'}).openTooltip();
            /*landmarkMarker.setIcon(L.icon({
                iconUrl: getLandmarkSVG(),
                iconSize: [21, 32]
            }));*/
            landmarkMarker.addTo(map);
        }
    }
    function onMarkerClick (e) {
        console.log(this.options);
    };
    function centerLeafletMapOnMarker(map, marker) {
        var latLngs = [ marker.getLatLng() ];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
        map.setZoom(8);
    }

    $scope.selectedMapView = {};
    $scope.selectedMapView = $rootScope.sMapViewData22;

    $timeout(function () {
        initMap();
        setLandmark($scope.selectedMapView)
        setMarkers($scope.selectedMapView)
        //centerLeafletMapOnMarker()

    }, 1000);

    ///\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var oConfig = getAppConfig();



});

materialAdmin.controller('reportsBasicCtrl', function ($rootScope, $localStorage, $interval, DateUtils, $stateParams, $interval, $state, $scope, $uibModal, reportService, TripService, $timeout, $http, gpsAnalyticService) {
    $rootScope.showSideBar = false;
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        isFirstDisabled: false
    };

    if ($rootScope.reportData[0] && $rootScope.reportData[0].localDataArray[0].reg_no) {
        if ($rootScope.reportData[0].userDevicesforDropDown.length > 0) {
            for (var s = 0; s < $rootScope.reportData[0].userDevicesforDropDown.length; s++) {
                if ($rootScope.reportData[0].localDataArray[0].reg_no == $rootScope.reportData[0].userDevicesforDropDown[s].reg_no) {
                    $scope.vehObjSel = $rootScope.reportData[0].userDevicesforDropDown[s];
                }
            }
        }
    }

    $scope.obj111 = {};

    //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMinMaxDate = function (type) {
        $scope.dateOptions1.maxDate = ($scope.obj111.dateTimeEn || new Date());
        $scope.dateOptions2.minDate = ($scope.obj111.dateTimeSt || new Date());
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
        maxDate: (($scope.obj111 && $scope.obj111.dateTimeEn) ? $scope.obj111.dateTimeEn : new Date()),
        //minDate: $scope.minDate ? null : new Date(),
        startingDay: 1
    };
    $scope.dateOptions2 = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: (($scope.obj111 && $scope.obj111.dateTimeSt) ? $scope.obj111.dateTimeSt : new Date()),
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
    }
    $scope.hourSel1 = 0;
    $scope.hourSel2 = 23;
    $scope.minuteSel1 = 0;
    $scope.minuteSel2 = 59;

    if ($rootScope.reportData[0] && $rootScope.reportData[0].dateTimeStart) {
        $scope.obj111.dateTimeSt = new Date(angular.copy($rootScope.reportData[0].dateTimeStart));
        $scope.obj111.dateTimeEn = new Date(angular.copy($rootScope.reportData[0].dateTimeEnd));
        var sDT = $scope.obj111.dateTimeSt;
        $scope.hourSel1 = sDT.getHours();
        $scope.minuteSel1 = sDT.getMinutes();
        var eDT = $scope.obj111.dateTimeEn;
        $scope.hourSel2 = eDT.getHours();
        $scope.minuteSel2 = eDT.getMinutes();
    }

    $scope.remember = function (aaa) {
        //$scope.selTabOne = aaa;
        if (aaa == 1) {
            $scope.isActive = false;
        }
        // console.log($scope.selTabOne);
    }

    $scope.reportHeader = function () {
        if ($rootScope.reportData && $rootScope.reportData[0]) {
            if ($rootScope.reportData[0].request == 'report_activity') {
                return "Activity Report";
            }
            else if ($rootScope.reportData[0].request == 'report_activity_interval') {
                return "Detailed Activity Report";
            }
            else {
                return "Other Report";
            }
        }
        else {
            return "No Report Found";
        }
    }

    $scope.dateStart = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].dateTimeStart) {
            return "From:- " + $rootScope.reportData[0].dateTimeStart;
        }
        else {
            return "";
        }
    }
    $scope.dateEnd = function () {
        if ($rootScope.reportData && $rootScope.reportData[0] && $rootScope.reportData[0].dateTimeEnd) {
            return "To:- " + $rootScope.reportData[0].dateTimeEnd;
        }
        else {
            return "";
        }
    }

    $scope.backReport = function () {
        $rootScope.redirect('/#!/main/basicReports');
    }

    /*************** reverse geocoding own server ****************/
    $rootScope.viewAddr = function (index) {
        if (index.start && index.start.latitude && index.start.longitude) {
            var lat = index.start.latitude;
            var lng = index.start.longitude;
        } else {
            var lat = index.lat;
            var lng = index.lng;
        }
        //var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
        var latlngUrl = "http://13.229.178.235:4242/reverse?lat=" + lat + "&lon=" + lng;
        $http({
            method: "GET",
            url: latlngUrl
        }).then(function mySucces(response) {
            //$scope.myWelcome = response.data;

            index.formatedAddr = response.data.display_name;
            index.showBtn = false;
        }, function myError(response) {
            //$scope.myWelcome = response.statusText;
            index.formatedAddr = response.statusText;
            index.showBtn = false;
        });
    }
    /*************** reverse geocoding own server ****************/
    //$rootScope.reportData

    $scope.showOnMap = function (listData, start) {
        if (start && listData.start && listData.start.latitude) {
            $rootScope.sMapViewData22 = {"start": listData.start,"cordinates": listData.start, "addr": listData.start_addr, "start_addr":listData.start_addr};
        } else {
            $rootScope.sMapViewData22 = {"start": listData.stop,"cordinates": listData.stop, "addr": listData.stop_addr, "start_addr":listData.start_addr};
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'views/playback/singleViewOnMap.html',
            controller: 'sViewOnMapCtrl'
        });
    };

    $rootScope.openNextTab = true;
    $scope.isActive = false;
    $scope.goForDetailReport = function (selData) {
        $rootScope.openNextTab = false;
        $scope.isActive = true;
        $scope.againSelData = selData;
        $rootScope.actReportData = [];
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

    $scope.actMinHours = 0;
    $scope.actMinMinutes = 30;

    $scope.changHour = function (hh) {
        $scope.actMinHours = hh;
    }
    $scope.changMinute = function (mm) {
        $scope.actMinMinutes = mm;
    }

    $scope.userDevices = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;

    $scope.getDetailedActReport = function (download) {
        function detailedActResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                $rootScope.loader = false;
                $scope.openNextTab = false;
                $scope.isActive = true;
                if (oRes.status == 'OK') {
                    $scope.localArrayData = [];
                    $scope.localDateWiseDataArray = [];

                    var s = 0;
                    for (var i = 0; i < oRes.device_id.length; i++) {
                        if (oRes.data[oRes.device_id[i]]) {
                            var inDeviceData;
                            inDeviceData = oRes.data[oRes.device_id[i]];
                            if (inDeviceData.dur_idle) {
                                inDeviceData.dur_idle = inDeviceData.dur_idle / 3600;
                                inDeviceData.dur_idle = inDeviceData.dur_idle.toFixed(2);
                            }
                            var duration_calculate3 = $rootScope.dur_calc(inDeviceData.dur_stop);
                            inDeviceData.dur_stop = duration_calculate3;
                            var duration_calculate4 = $rootScope.dur_calc(inDeviceData.dur_total);
                            inDeviceData.dur_total = duration_calculate4;
                            if (inDeviceData.tot_dist) {
                                inDeviceData.tot_dist = inDeviceData.tot_dist / 1000;
                                inDeviceData.tot_dist = inDeviceData.tot_dist.toFixed(2);
                            }

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
                                var duration_calculate5 = $rootScope.dur_calc(inDeviceData.data[d].duration);
                                inDeviceData.data[d].duration = duration_calculate5;
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
                                if (inDeviceData.data[d].acc_high) {
                                    if (inDeviceData.data[d].acc_high == true) {
                                        inDeviceData.data[d].acc_high = 'ON';
                                    } else if (inDeviceData.data[d].acc_high == false) {
                                        inDeviceData.data[d].acc_high = 'OFF';
                                    } else if (inDeviceData.data[d].acc_high == undefined) {
                                        inDeviceData.data[d].acc_high = 'NA';
                                    }
                                }

                                if (inDeviceData.data[d].ac_on) {
                                    if (inDeviceData.data[d].ac_on == true) {
                                        inDeviceData.data[d].ac_on = 'ON';
                                    } else if (inDeviceData.data[d].ac_on == false) {
                                        inDeviceData.data[d].ac_on = 'OFF';
                                    } else if (inDeviceData.data[d].ac_on == undefined) {
                                        inDeviceData.data[d].ac_on = 'NA';
                                    }
                                }
                                inDeviceData.data[d].datetime = moment(inDeviceData.data[d].datetime).format('LLL');
                                inDeviceData.data[d].showBtn = true;

                                for (var b = 0; b < $scope.userDevices.length; b++) {
                                    if ($scope.userDevices[b].imei == inDeviceData.data[d].imei) {
                                        inDeviceData.data[d].reg_no = $scope.userDevices[b].reg_no;
                                        inDeviceData.reg_no = $scope.userDevices[b].reg_no;
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
                                for (var g = 0; g < $rootScope.actForGetDeviceList.length; g++) {
                                    if (oRes.device_id[i] == $rootScope.actForGetDeviceList[g].imei) {
                                        $scope.localArrayData[s] = $rootScope.actForGetDeviceList[g];
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
                                for (var g = 0; g < $rootScope.actForGetDeviceList.length; g++) {
                                    if (oRes.device_id[i] == $rootScope.actForGetDeviceList[g].imei) {
                                        $scope.localArrayData[i] = $rootScope.actForGetDeviceList[g];
                                    }
                                }
                                $scope.localArrayData[i].data = [];
                                $scope.localArrayData[i].data_message = 'Data Not Available';
                            }
                        }
                    }

                    if (!$rootScope.actReportData) {
                        $rootScope.actReportData = [];
                    }
                    if ($scope.speedLim) {
                        oRes.speed_limit = $scope.speedLim;
                    }
                    if ($scope.durationLim) {
                        oRes.time_interval = $scope.durationLim;
                    }
                    if ($scope.againSelData && $scope.againSelData.start_time) {
                        oRes.dateTimeStart = moment($scope.againSelData.start_time).format('LLL');
                        oRes.dateTimeEnd = moment($scope.againSelData.end_time).format('LLL');
                    }
                    $rootScope.actReportData.push(oRes);
                    $rootScope.actReportData[0].localDataArray = $scope.localArrayData;
                    $rootScope.actReportData[0].localDateWiseDataArray = $scope.localDateWiseDataArray;
                    //if(oRes.request != 'report_mileage'){
                    $scope.newFakeArray1 = [];
                    $scope.newFakeArray2 = [];
                    if ($rootScope.actReportData[0].localDataArray) {
                        var u = 0;
                        var v = 0;
                        for (var f = 0; f < $rootScope.actReportData[0].localDataArray.length; f++) {
                            if (!$rootScope.actReportData[0].localDataArray[f].data_message) {
                                $scope.newFakeArray1[v] = $rootScope.actReportData[0].localDataArray[f];
                                v++;
                            } else {
                                $scope.newFakeArray2[u] = $rootScope.actReportData[0].localDataArray[f];
                                u++;
                            }
                        }
                    }
                    $rootScope.actReportData[0].localDataArray = [];
                    $rootScope.actReportData[0].localDataArray = $scope.newFakeArray1.concat($scope.newFakeArray2);
                    $rootScope.actReportData[0].userDevicesforDropDown = $scope.userDevices;
                    //}
                    $scope.$apply(function () {
                        $rootScope.actReportData
                    })
                    $scope.callFunDetail($scope.actMinTime);
                    //console.log($rootScope.actReportData);
                    //$rootScope.redirect('/#!/main/reportBasic');
                }
                else if (oRes.status == 'ERROR') {
                    //swal(oRes.message, "", "error");
                }
            }
        };

        if ($scope.actMinHours || $scope.actMinMinutes) {
            var dActReport = {};
            $rootScope.actReportData = [];
            $rootScope.actForGetDeviceList = [];
            if ($scope.againSelData && $scope.againSelData.imei) {
                $rootScope.actForGetDeviceList = [$scope.againSelData.imei];
                dActReport.device_id = [$scope.againSelData.imei];
            } else {
                $rootScope.actForGetDeviceList = $rootScope.reportData[0].device_id;
                dActReport.device_id = $rootScope.reportData[0].device_id;
            }
            //$scope.aDevImei = [];
            dActReport.request = 'report_activity_interval';
            dActReport.reportType = 'report_activity_interval';
            if ($scope.againSelData && $scope.againSelData.start_time) {
                dActReport.start_time = $scope.againSelData.start_time;
                dActReport.end_time = $scope.againSelData.end_time;
            } else if ($scope.obj111.dateTimeSt && $scope.obj111.dateTimeEn) {
                $scope.obj111.dateTimeSt = new Date($scope.obj111.dateTimeSt);
                $scope.obj111.dateTimeEn = new Date($scope.obj111.dateTimeEn);
                var xx = $scope.obj111.dateTimeSt;
                xx.setHours($scope.hourSel1);
                xx.setMinutes($scope.minuteSel1);
                $scope.obj111.dateTimeSt = xx;
                var yy = $scope.obj111.dateTimeEn;
                yy.setHours($scope.hourSel2);
                yy.setMinutes($scope.minuteSel2);
                $scope.obj111.dateTimeEn = yy;

                dActReport.start_time = $scope.obj111.dateTimeSt;
                dActReport.end_time = $scope.obj111.dateTimeEn;
            }

            $scope.actMinTime = $scope.actMinMinutes + ($scope.actMinHours * 60);
            dActReport.time_interval = $scope.actMinTime;
            download && (dActReport.download = download);
            gpsAnalyticService.downloadReport(dActReport,  download ? downlaodRpt : detailedActResponse);
            // reportService.getReport(dActReport, detailedActResponse);
            // $rootScope.loader = true;
            // $timeout(function () {
            //     $rootScope.loader = false;
            // }, 60000);
        }
    };
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
    $scope.callInterval = false;
    var Timer;
    $scope.callFunDetail = function (timeInterval) {
        timeInterval = timeInterval * 60000;
        if (angular.isDefined(Timer)) return;
        Timer = $interval(function () {
            $scope.getDetailedActReport();
        }, timeInterval);
    }

    $scope.$on('$destroy', function () {
        $interval.cancel(Timer)
    });

    $scope.getDetailedActReport22 = function () {
        $scope.againSelData = {};
        $scope.getDetailedActReport();
    }

    $scope.changeDate11 = function (d1) {
        $scope.dateTimeSt = d1;
    }

    $scope.changeDate22 = function (d2) {
        $scope.dateTimeEn = d2;
    }

    $scope.hrChange1 = function (h1) {
        $scope.hourSel1 = h1;
    }
    $scope.hrChange2 = function (h2) {
        $scope.hourSel2 = h2;
    }

    $scope.minChange1 = function (m1) {
        $scope.hourSel1 = m1;
    }
    $scope.minChange2 = function (m2) {
        $scope.hourSel2 = m2;
    }

    $scope.getActReportWithTime = function () {
        //Cancel the Timer.
        if (angular.isDefined(Timer)) {
            $interval.cancel(Timer);
            Timer = undefined;
        }
        $scope.userDevices = $localStorage.preservedSelectedUser.devices || $localStorage.onLocalselectedUser.devices;

        function ActReportResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                $scope.loader = false;
                if (oRes.status == 'OK') {
                    $scope.localArrayData = [];
                    $scope.localDateWiseDataArray = [];
                    var s = 0;
                    for (var i = 0; i < oRes.device_id.length; i++) {
                        if (oRes.data[oRes.device_id[i]]) {
                            var inDeviceData;
                            inDeviceData = oRes.data[oRes.device_id[i]];
                            if (inDeviceData.dur_idle) {
                                inDeviceData.dur_idle = inDeviceData.dur_idle / 3600;
                                inDeviceData.dur_idle = inDeviceData.dur_idle.toFixed(2);
                            }
                            var duration_calculate3 = $rootScope.dur_calc(inDeviceData.dur_stop);
                            inDeviceData.dur_stop = duration_calculate3;
                            var duration_calculate4 = $rootScope.dur_calc(inDeviceData.dur_total);
                            inDeviceData.dur_total = duration_calculate4;
                            if (inDeviceData.tot_dist) {
                                inDeviceData.tot_dist = inDeviceData.tot_dist / 1000;
                                inDeviceData.tot_dist = inDeviceData.tot_dist.toFixed(2);
                            }

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
                                var duration_calculate5 = $rootScope.dur_calc(inDeviceData.data[d].duration);
                                inDeviceData.data[d].duration = duration_calculate5;
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
                                if (inDeviceData.data[d].acc_high) {
                                    if (inDeviceData.data[d].acc_high == true) {
                                        inDeviceData.data[d].acc_high = 'ON';
                                    } else if (inDeviceData.data[d].acc_high == false) {
                                        inDeviceData.data[d].acc_high = 'OFF';
                                    } else if (inDeviceData.data[d].acc_high == undefined) {
                                        inDeviceData.data[d].acc_high = 'NA';
                                    }
                                }
                                if (inDeviceData.data[d].ac_on) {
                                    if (inDeviceData.data[d].ac_on == true) {
                                        inDeviceData.data[d].ac_on = 'ON';
                                    } else if (inDeviceData.data[d].ac_on == false) {
                                        inDeviceData.data[d].ac_on = 'OFF';
                                    } else if (inDeviceData.data[d].ac_on == undefined) {
                                        inDeviceData.data[d].ac_on = 'NA';
                                    }
                                }
                                inDeviceData.data[d].datetime = moment(inDeviceData.data[d].datetime).format('LLL');
                                inDeviceData.data[d].showBtn = true;

                                for (var b = 0; b < $scope.userDevices.length; b++) {
                                    if ($scope.userDevices[b].imei == inDeviceData.data[d].imei) {
                                        inDeviceData.data[d].reg_no = $scope.userDevices[b].reg_no;
                                        inDeviceData.reg_no = $scope.userDevices[b].reg_no;
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
                    if ($scope.speedLim) {
                        oRes.speed_limit = $scope.speedLim;
                    }
                    if ($scope.durationLim) {
                        oRes.time_interval = $scope.durationLim;
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
                    $rootScope.reportData[0].userDevicesforDropDown = $scope.userDevices;
                    //}
                    $scope.$apply(function () {
                        $rootScope.reportData;
                    });
                    // console.log($rootScope.reportData);
                    $timeout(function () {
                        $scope.vehAgainSel();
                    }, 6000);

                    //$rootScope.redirect('/#!/main/reportBasic');
                }
                else if (oRes.status == 'ERROR') {
                    //swal(oRes.message, "", "error");
                }
            }
        };

        var reportThisAct = {};
        //$rootScope.reportData = [];
        $rootScope.forGetDeviceList = [];
        $rootScope.forGetDeviceList = $rootScope.reportData[0].device_id;
        reportThisAct.request = 'report_activity';
        reportThisAct.reportType = 'report_activity';
        reportThisAct.device_id = $rootScope.reportData[0].device_id;

        $scope.obj111.dateTimeSt = new Date($scope.obj111.dateTimeSt);
        $scope.obj111.dateTimeEn = new Date($scope.obj111.dateTimeEn);
        var xx = $scope.obj111.dateTimeSt;
        xx.setHours($scope.hourSel1);
        xx.setMinutes($scope.minuteSel1);
        $scope.obj111.dateTimeSt = xx;
        var yy = $scope.obj111.dateTimeEn;
        yy.setHours($scope.hourSel2);
        yy.setMinutes($scope.minuteSel2);
        $scope.obj111.dateTimeEn = yy;

        reportThisAct.start_time = $scope.obj111.dateTimeSt;
        reportThisAct.end_time = $scope.obj111.dateTimeEn;

        $rootScope.reportData = [];
        gpsAnalyticService.downloadReport(reportThisAct, ActReportResponse);
        // reportService.getReport(reportThisAct, ActReportResponse);
        // $scope.loader = true;
        // $timeout(function () {
        //     $rootScope.loader = false;
        // }, 60000);
    }

    $scope.changeDeviceId = function (objV) {
        if (objV) {
            if ($rootScope.reportData.length > 0 && $rootScope.reportData[0].device_id.length > 0) {
                $rootScope.reportData[0].device_id = [];
                $rootScope.reportData[0].device_id = [objV.imei];
            }
        }
    }
    /*$scope.changeDeviceIdOnDetail = function(objV){
    if($rootScope.actReportData.length>0 && $rootScope.actReportData[0].device_id.length>0){
      $rootScope.actReportData[0].device_id = [];
      $rootScope.actReportData[0].device_id = [objV.device_id];
    }
  }*/
    $scope.vehAgainSel = function () {
        if ($rootScope.reportData[0] && $rootScope.reportData[0].localDataArray[0].reg_no) {
            if ($rootScope.reportData[0].userDevicesforDropDown.length > 0) {
                for (var s = 0; s < $rootScope.reportData[0].userDevicesforDropDown.length; s++) {
                    if ($rootScope.reportData[0].localDataArray[0].reg_no == $rootScope.reportData[0].userDevicesforDropDown[s].reg_no) {
                        $scope.$apply(function () {
                            $scope.vehObjSel = $rootScope.reportData[0].userDevicesforDropDown[s];
                        });
                    }
                }
            }
        }
    }

    $scope.actReportHeader = function () {
        if ($rootScope.actReportData && $rootScope.actReportData[0]) {
            if ($rootScope.actReportData[0].request == 'report_activity') {
                return "Activity Report";
            }
            else if ($rootScope.actReportData[0].request == 'report_activity_interval') {
                return "Detailed Activity Report";
            }
            else {
                return "Other Report";
            }
        }
        else {
            return "No Report Found";
        }
    }

    $scope.actDateStart = function () {
        if ($rootScope.actReportData && $rootScope.actReportData[0] && $rootScope.actReportData[0].dateTimeStart) {
            return "From:- " + $rootScope.actReportData[0].dateTimeStart;
        }
        else {
            return "";
        }
    }
    $scope.actDateEnd = function () {
        if ($rootScope.actReportData && $rootScope.actReportData[0] && $rootScope.actReportData[0].dateTimeEnd) {
            return "To:- " + $rootScope.actReportData[0].dateTimeEnd;
        }
        else {
            return "";
        }
    }

    $scope.dwnldXlsxAct = function (reportData) {
        function dwnldResponse(response) {
            var oRes = JSON.parse(response);
            $rootScope.loader = false;
            if (oRes) {
                if (oRes.status == 'OK') {
                    $rootScope.download = oRes;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/reports/download-report.html',
                        controller: 'downloadReportCtrl'
                    });
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };
        var xlDownload = {};

        $rootScope.forGetDeviceList = [];
        $rootScope.forGetDeviceList = $rootScope.reportData[0].device_id;
        xlDownload.request = 'report_activity';
        xlDownload.reportType = 'report_activity';
        xlDownload.device_id = $rootScope.reportData[0].device_id;

        $scope.obj111.dateTimeSt = new Date($scope.obj111.dateTimeSt);
        $scope.obj111.dateTimeEn = new Date($scope.obj111.dateTimeEn);
        var xx = $scope.obj111.dateTimeSt;
        xx.setHours($scope.hourSel1);
        xx.setMinutes($scope.minuteSel1);
        $scope.obj111.dateTimeSt = xx;
        var yy = $scope.obj111.dateTimeEn;
        yy.setHours($scope.hourSel2);
        yy.setMinutes($scope.minuteSel2);
        $scope.obj111.dateTimeEn = yy;

        xlDownload.start_time = $scope.obj111.dateTimeSt;
        xlDownload.end_time = $scope.obj111.dateTimeEn;


        xlDownload.request = 'download_' + reportData[0].request;
        // if (reportData[0].request != 'report_activity_interval') {
        //     xlDownload.device_id = [];
        //     xlDownload.device_id = reportData[0].device_id;
        // } else {
        //     xlDownload.device_id = reportData[0].device_id[0];
        // }
        // xlDownload.start_time = reportData[0].dateTimeStart || reportData[0].start_time;
        // xlDownload.end_time = reportData[0].dateTimeEnd || reportData[0].end_time;
        // xlDownload.reportType = reportData[0].request;
        xlDownload.download = true;
        if (reportData[0].request == 'report_activity_interval') {
            xlDownload.time_interval = $scope.actMinTime;
        }
        gpsAnalyticService.downloadReport(xlDownload, downlaodRpt);

        // reportService.downloadReport(xlDownload, dwnldResponse);
        $rootScope.loader = true;
        $timeout(function () {
            $rootScope.loader = false;
        }, 10000);
    };

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


    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.trackSht = function () {
        $rootScope.redirect('/#!/main/ListView');
    };
});

materialAdmin.controller("selTruckCntr", function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, RegistrationService) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.selectedDevice = $scope.upDeviceType;
    $scope.updateDeviceTypeF = function () {
        function updateResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $rootScope.listInit();
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        if ($scope.selectedDevice) {
            $scope.selectedDevice.request = 'update_device';
            if ($rootScope.vehicleType) {
                $scope.selectedDevice.vehicle_type = $rootScope.vehicleType.truck_type;
                $scope.selectedDevice.vehicle_group = $rootScope.vehicleType.category;
            }
            $scope.selectedDevice.login_uid = $localStorage.user.user_id;
            $scope.selectedDevice.user_id = $scope.selectedUser.user_id;
            RegistrationService.deviceUpdate($scope.selectedDevice, updateResponse);
        }
    };
    $scope.setTruck = function (vObj) {
        $rootScope.vehicleType = {};
        /*angular.forEach($scope.vehicles, function(vehicle, key) {
      angular.forEach(vehicle, function(vehicleObj, key) {
        if(vehicleObj.selected) {
          $rootScope.vehicleType= vehicleObj;
        }
      });
    });*/
        //$scope.updateDeviceTypeF($scope.selectedDevice);
        //$uibModalInstance.dismiss('cancel');
        $rootScope.vehicleType = vObj;
    };
});

materialAdmin.controller('updateDevicePopCtrl', function ($rootScope, $scope, $localStorage, $window, $uibModal, $uibModalInstance, $interval, $state, $timeout, RegistrationService, beatService) {
    $rootScope.showSideBar = false;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        /*if($scope.selectedDevice.activation_time || $scope.selectedDevice.expiry_time){
      $scope.selectedDevice.activation_time = moment($scope.selectedDevice.activation_time).format('LLL');
      $scope.selectedDevice.expiry_time = moment($scope.selectedDevice.expiry_time).format('LLL');
    }*/
    };
    $scope.selectedDevice = $scope.upDevice;
    //******* edit device *************//
    $scope.activeValue;
    $scope.selectIoc = function (carIocStyle, obj) {
        $scope.activeValue = carIocStyle;
        $scope.icon = carIocStyle;
    }
    //****** device type list get ************//

    $scope.getDeviceType = function () {
        function responseDeviceType(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $scope.aDeviceType = oRes.data;
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        $scope.device = {};
        $scope.device.request = 'get_devide_types';
        RegistrationService.getDevice($scope.device, responseDeviceType);
    }

    $scope.getDeviceType();
    //***********device type list get end************/

    $scope.getBeat = function(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {

                let req = {
                    name: viewValue,
                    no_of_docs: 5,
                };

                beatService.getBeat(req, res => {
                    resolve(res.data);
                }, err => {
                    console.log`${err}`;
                    reject([]);
                });

            });
        }

        return [];
    }


    $scope.updateDeviceF = function (selectedDevice) {
        function updateResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status == 'OK') {
                    $rootScope.listInit();
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if (oRes.status == 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        };

        if (selectedDevice) {
            selectedDevice.request = 'update_device';
            selectedDevice.login_uid = $localStorage.user.user_id;
            selectedDevice.user_id = $scope.selectedUser.user_id;
            selectedDevice.icon = $scope.icon;
            RegistrationService.deviceUpdate(selectedDevice, updateResponse);
        }
    };
    //******* end edit device *************//

});

/*
materialAdmin.controller('sharedLocationCntr', function ($rootScope, $localStorage, $stateParams, $http, $interval, $state, $scope, LoginService, GoogleMapService) {
    $rootScope.deviceInfo = '';
    //$rootScope.sharedLocSocketConn();

    $scope.getSharedLocationData = function () {
        $scope.mapCreated = false;
        $scope.shareDevId = $stateParams.device_id;
        var shareMap = {};
        if ($scope.shareDevId) {
            shareMap.request = 'get_shared_locaion';
            shareMap.lid = $scope.shareDevId;
            GoogleMapService.getMap(shareMap, responseShareLoc);
        } else {
            $rootScope.redirect('/#!/mains/mapZoom/');
        }
    };

    function responseShareLoc(response) {
        var oRes = JSON.parse(response);
        $scope.devSharedData = oRes.data;
        $rootScope.sharedVehicleNo = oRes.data.vehicle_no;
        if (oRes.status == 'OK') {
            if (oRes && oRes.data) {
                if (oRes && oRes.data && oRes.data.lat && oRes.data.lng) {
                    $scope.cities = oRes.data;
                    if (angular.isNumber($scope.cities.device_id)) {
                        $scope.cities.device_id = $scope.cities.device_id.toString();
                    }
                    if ($scope.markers) {
                        if ($scope.markers.device_id == $scope.cities.device_id) {
                            $scope.markers.setMap(null);
                            if ($rootScope.local) {
                                // console.log('Stop Device');
                                // console.log($scope.markers);
                            }
                        }
                    }

                    if ($scope.mapCreated) {
                        setMarker($scope.cities);
                    } else {
                        createMap($scope.cities);
                    }
                    if ($rootScope.local) {
                        // console.log(oRes.data.lat, oRes.data.lng, oRes.data.device_id);
                    }
                }
            } else {
                //swal(oRes.message, "", "error");
                // console.log('No Location found');
            }
        } else if (oRes.status == 'ERROR') {
            swal(oRes.message, "", "error");
        }
    };

    var map;
    var createMap = function (info) {
        $scope.mapCreated = true;
        if (info && info.lat && info.lng) {
            var select = {};
            select.lat = info.lat;
            select.lng = info.lng;
            var zooms = 14;
            /!*else if($scope.markers){
      var select = {};
      select.lat = $scope.markers.lat;
      select.lng = $scope.markers.lng;
      var zooms = 15;
      }*!/
            if (!$scope.markers) {
                var mapOptions = {
                    zoom: zooms,
                    center: new google.maps.LatLng(select.lat, select.lng),
                }
                map = new google.maps.Map(document.getElementById('trackingMap'), mapOptions);
            }
            setMarker(info);
            //$scope.maps = map;
        }
    }

    var marker;
    var setMarker = function (info) {
        if (marker != null) {
            marker.setMap(null);
        }
        $scope.markers = {};

        if (info.status == 'online' && info.speed > 0) {
            var cDate = new Date(info.datetime);
            var cMinutes = cDate.getMinutes();
            cDate.setMinutes(cMinutes + 15);
            if (cDate >= new Date()) {
                info.status = 'running';
            }
        }
        if (info.status == 'inactive') {
            var iconBase = 'img/arrow_red-small.png';
        } else if (info.status == 'offline') {
            var iconBase = 'img/arrow_default-small.png';
        } else if (info.status == 'handshake') {
            var iconBase = 'img/arrow_yellow-small.png';
        } else if (info.status == 'online') {
            var iconBase = 'img/arrow_red-small.png';
        } else if (info.status == 'running') {
            $scope.markerOk = true;
            //var iconBase = 'img/truck_d.png';
            for (var i = 1; i < 45; i++) {
                if (i == info.course) {
                    var iconBase = 'img/arrow_green1-small.png';
                    $scope.markerOk = false;
                }
            }
            if ($scope.markerOk) {
                for (var i = 46; i < 90; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green2-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 91; i < 135; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green3-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 136; i < 180; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green4-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 181; i < 225; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green5-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 226; i < 270; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green6-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 271; i < 315; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green7-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 316; i < 360; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green8-small.png';
                        $scope.markerOk = false;
                    } else {
                        var iconBase = 'img/arrow_green1-small.png';
                    }
                }
            }
        }

        info.datetime = moment(info.datetime).format('LLL');
        info.positioning_time = moment(info.positioning_time).format('LLL');
        info.location_time = moment(info.location_time).format('LLL');
        $scope.setValueSidebar = info;
        if (info.acc_high == true) {
            info.acc_high = 'On';
            $scope.acc_high = 'On';
        } else if (info.acc_high == false) {
            info.acc_high = 'Off';
            $scope.acc_high = 'Off';
        } else if (info.acc_high == undefined) {
            info.acc_high = 'NA';
            $scope.acc_high = 'NA';
        }

        if (info.ac_on == true) {
            info.ac_on = 'On';
            $scope.ac_on = 'On';
        } else if (info.ac_on == false) {
            info.ac_on = 'Off';
            $scope.ac_on = 'Off';
        } else if (info.ac_on == undefined) {
            info.ac_on = 'NA';
            $scope.ac_on = 'NA';
        }
        $scope.sLat = info.lat;
        $scope.sLng = info.lng;

        //!*********get address on marker by own server start ************!//
        function getAddress(info, callback) {
            if (info.start && info.start.latitude && info.start.longitude) {
                var lat = info.start.latitude;
                var lng = info.start.longitude;
            } else {
                var lat = info.lat;
                var lng = info.lng;
            }
            //var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
            var latlngUrl = "http://13.229.86.93:4242/reverse?lat=" + lat + "&lon=" + lng;
            $http({
                method: "GET",
                url: latlngUrl
            }).then(function mySucces(response) {
                info.formatedAddr = response.data.display_name;
                callback();
            }, function myError(response) {
                info.formatedAddr = response.statusText;
            });

        }

        //!*******get address end ************!//

        $scope.markers = {};
        //var iconBase = 'img/marker-green.png';
        marker = new google.maps.Marker({
            zoom: 8,
            map: map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: $scope.devSharedData.vehicle_no,
            icon: iconBase
        });
        var infoWindow = new google.maps.InfoWindow();
        /!*marker.content = '<div class="map-popup">'+
      '<p>Device Id: <span>'+info.device_id + '</span></p>'+
      '<p>Speed: <span>'+info.speed + '&nbsp; Km/h</span></p>'+
      '<p>ACC: <span>'+info.acc_high + '&nbsp;</span></p>'+
      '<p>Address: <span>'+info.formatedAddr + '&nbsp;</span></p>'+
      '<p>Date Time: <span>'+ moment(info.datetime).format('LLL') +'</span></p>'+
      '</div>';

    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h3>' + marker.title + '</h3>' + marker.content);
        infoWindow.open(map, marker);
    });  *!/

        info.NearLandMark = info.nearest_landmark && info.nearest_landmark.name && info.nearest_landmark.dist ? info.nearest_landmark.dist / 1000 + " KM from " + info.nearest_landmark.name : "NA";


        (function (marker, info) {
            google.maps.event.addListener(marker, 'click', function () {
                getAddress(info, function () {

                    infoWindow.close(); // Close previously opened infowindow
                    infoWindow.setContent('<div class="map-popup">' +
                        /!*'<p>Device Id &nbsp;&nbsp;&nbsp;: <span>'+ info.device_id+ '</span></p>'+*!/
                        '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + info.acc_high + '</span></p>' +
                        '<p>Speed &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;: <span>' + info.speed + ' &nbsp;&nbsp;KM/H. </span></p>' +
                        '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + info.ac_on + '</span></p>' +
                        '<p>Location &nbsp;&nbsp;&nbsp;: <span>' + info.formatedAddr + '</span></p>' +
                        '<p>Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>' + moment(info.datetime).format('LLL') + '</span></p>' +
                        '<p>Positioning Time &nbsp;&nbsp;&nbsp;: <span>' + moment(info.positioning_time || info.location_time).format('LLL') + '</span></p>' +
                        '<p>Nearest Landmark &nbsp;&nbsp;&nbsp;: <span>' + info.NearLandMark + '</span></p><hr class="m-t-5 m-b-5">' +
                        '</div>');
                    infoWindow.open(map, marker);
                });
            });
        })(marker, info);

        $scope.markers = marker;
        map.panTo(marker.getPosition());
        $scope.StartTimer();
    }

    $scope.getSharedLocationData();
    $scope.StartTimer = function () {
        $scope.Timer = $interval(function () {
            $scope.setValueSidebar = $scope.setValueSidebar;
        }, 10000);
    };
});
*/

materialAdmin.controller('shareLocationsCntr', function ($rootScope, $localStorage, $location, $timeout, $stateParams, $http, $interval, $state, $scope, LoginService, GoogleMapService) {

    $scope.shareData = $location.search()['data'];
    $scope.aShareData = JSON.parse($scope.shareData);

    // This function will iterate over markersData array
    // creating markers with createMarker function
    function displayMarkers() {

        // this variable sets the map bounds and zoom level according to markers position
        var bounds = new google.maps.LatLngBounds();

        // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
        for (var i = 0; i < $scope.aShareData.length; i++) {

            var latlng = new google.maps.LatLng($scope.aShareData[i].lat, $scope.aShareData[i].lng);
            var vehicle_no = $scope.aShareData[i].reg_no;
            //var address1 = $scope.aShareData[i].address1;
            //var address2 = $scope.aShareData[i].address2;
            //var postalCode = $scope.aShareData[i].postalCode;

            //createMarker(latlng, vehicle_no, address1, address2, postalCode);
            createMarker(latlng, vehicle_no);

            // Marker’s Lat. and Lng. values are added to bounds variable
            bounds.extend(latlng);
        }

        // Finally the bounds variable is used to set the map bounds
        // with API’s fitBounds() function
        map.fitBounds(bounds);
    }

    // This function creates each marker and sets their Info Window content
    //function createMarker(latlng, vehicle_no, address1, address2, postalCode){
    function createMarker(latlng, vehicle_no) {
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: vehicle_no,
            icon: 'img/arrow_green1-small.png'
        });

        // This event expects a click on a marker
        // When this event is fired the infowindow content is created
        // and the infowindow is opened
        google.maps.event.addListener(marker, 'click', function () {

            // Variable to define the HTML content to be inserted in the infowindow
            var iwContent = '<div id="iw_container">' +
                '<div class="iw_title"> Vehicle No: &nbsp;&nbsp; ' + vehicle_no + '</div></div>';

            // including content to the infowindow
            infoWindow.setContent(iwContent);

            // opening the infowindow in the current map and at the current marker location
            infoWindow.open(map, marker);
        });
    }

    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(40.601203, -8.668173),
            zoom: 9,
            mapTypeId: 'roadmap',
        };

        map = new google.maps.Map(document.getElementById('position_map'), mapOptions);

        // a new Info Window is created
        infoWindow = new google.maps.InfoWindow();

        // Event that closes the InfoWindow with a click on the map
        google.maps.event.addListener(map, 'click', function () {
            infoWindow.close();
        });

        // Finally displayMarkers() function is called to begin the markers creation
        displayMarkers();
    }

    //$timeout(function() {
    //google.maps.event.addDomListener(window, 'load', function () {
    initialize();
    //});
    //}, 3000);


});

materialAdmin.controller('sharePlaybackCntr', function ($rootScope, $scope, DateUtils, $uibModal, LoginService, $location, GoogleMapService, $localStorage, $interval, playBackService, $timeout) {
    $scope.againInitialiseCtrl = function () {

        //*************** custome Date time Picker for multiple date selection in single form ************
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
        //********************//**********************//*****************//
        //************* custome Date time Picker for multiple date selection in single form ******************

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
        }

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
        /*if($localStorage.onLocalselectedUser && $localStorage.onLocalselectedUser.devices){
      for(var j=0; j<$localStorage.onLocalselectedUser.devices.length; j++){
        if($localStorage.onLocalselectedUser.devices[j].imei == $scope.sharePlayData.device_id){
          $scope.sharePlayData.reg_no = $localStorage.onLocalselectedUser.devices[j].reg_no;
        }
      }
    }else{
      for(var j=0; j<$localStorage.user.devices.length; j++){
        if($localStorage.user.devices[j].imei == $scope.sharePlayData.device_id){
          $scope.sharePlayData.reg_no = $localStorage.user.devices[j].reg_no;
        }
      }
    }*/
        if ($scope.sharePlayData.tot_dist) {
            $scope.sharePlayData.tot_dist = $scope.sharePlayData.tot_dist / 1000;
            $scope.sharePlayData.tot_dist = $scope.sharePlayData.tot_dist.toFixed(2);
        }
        $scope.aPlayPosiData = $scope.sharePlayData.data;
        // console.log($scope.sharePlayData);


        //*********map for position start and end point *********//
        var myOptions = {
                zoom: 0,
                center: new google.maps.LatLng($scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById('sharePlayMap'), myOptions),
            markers = [],//some array
            hiddenMarkers = [],//some array
            flightPlanCoordinates = [],
            directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true}),
            directionsService = new google.maps.DirectionsService(),
            infowindow = new google.maps.InfoWindow();
        // console.log($scope.aPlayPosiData);
        var h = $scope.aPlayPosiData.length - 1,
            iconStart = 'img/start-small.png',
            iconStop = 'img/stop-small.png';
        //********first location marker start /*************//
        var pointA = new google.maps.LatLng($scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude),
            markerA = new google.maps.Marker({
                position: pointA,
                title: "Start Point",
                //label: "A",
                map: map,
                icon: iconStart
            }),
            apData = $scope.aPlayPosiData[0];
        markerA.content = '<div class="map-popup">' +
            '<p class="pp-hd">Start Info</p>' +
            '<p>Strt Time: <span>' + apData.start_time + '</span></p>' +
            /*'<p>End Time: <span>'+apData.end_time + '</span></p>'+
                  '<p>Residence : <span>'+SecondsTohhmmss(apData.duration)+'</span></p>'+*/
            '</div>';

        google.maps.event.addListener(markerA, "click", function (e) {
            infowindow.setContent(markerA.content);
            infowindow.open(map, this);
        });
        markers.push(markerA);
        //********first location marker end /*************//
        //*********mid marker creation *************//
        $scope.newDriveTruePoints = [];
        for (var i = 1; i < $scope.aPlayPosiData.length; i++) {
            if ($scope.aPlayPosiData[i].drive == true) {
                if ($scope.aPlayPosiData[i].points && $scope.aPlayPosiData[i].points.length > 0) {
                    for (var p = 0; p < $scope.aPlayPosiData[i].points.length; p++) {
                        $scope.newDriveTruePoints.push($scope.aPlayPosiData[i].points[p]);
                    }
                }
            }
            if ($scope.aPlayPosiData[i].drive == false) {
                //var stayT = $scope.aPlayPosiData[i].duration;
                //var sTimeHour = stayT;
                //$scope.sTime = parseFloat(Math.round(sTimeHour * 100) / 100).toFixed(2); //show 2 decimal places
                //var duration_calc = $rootScope.dur_calc($scope.aPlayPosiData[i].duration);
                $scope.sTime = SecondsTohhmmss($scope.aPlayPosiData[i].duration);
                var midpoint = new google.maps.LatLng($scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude),
                    iconFlag = 'img/stopFlag-small.png',
                    marker = new MarkerWithLabel({
                        map: map,
                        position: midpoint,
                        title: "Mid Point",
                        icon: iconFlag,
                        //label: "M",
                        raiseOnDrag: true,
                        //labelContent: $scope.sTime,
                        labelAnchor: new google.maps.Point(30, 62),
                        labelClass: "labelsss", // the CSS class for the label
                        labelInBackground: false,
                        labelStyle: {opacity: 1}
                    }),
                    sData = $scope.aPlayPosiData[i];
                // console.log(sData);

                sData.NearLandMark = sData.nearest_landmark && sData.nearest_landmark.name && sData.nearest_landmark.dist ? sData.nearest_landmark.dist / 1000 + " KM from " + sData.nearest_landmark.name : "NA";
                //sData.duration = sData.duration*3600;
                (function (marker, sData) {
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.close(); // Close previously opened infowindow
                        infowindow.setContent('<div class="map-popup">' +
                            '<p class="pp-hd">Stop Info</p>' +
                            '<p>Strt Time: <span>' + sData.start_time + '</span></p>' +
                            '<p>End Time: <span>' + sData.end_time + '</span></p>' +
                            '<p>Residence : <span>' + SecondsTohhmmss(sData.duration) + '</span></p>' +
                            '<p>Address &nbsp;&nbsp;&nbsp; : <span>' + sData.start_addr + '</span></p>' +
                            '<p>Nearest Landmark : <span>' + sData.NearLandMark + '</span></p>' +
                            '</div>');
                        infowindow.open(map, marker);
                    });
                })(marker, sData);
                markers.push(marker);

            } else {
                if ($scope.aPlayPosiData[i].points && $scope.aPlayPosiData[i].points.length > 0) {
                    for (var x = 0; x < $scope.aPlayPosiData[i].points.length; x++) {
                        var hidePointNew = new google.maps.LatLng($scope.aPlayPosiData[i].points[x].lat, $scope.aPlayPosiData[i].points[x].lng),
                            iconFlag = 'img/stopFlag-small.png',
                            markerHideNew = new google.maps.Marker({
                                position: hidePointNew,
                                title: "Mid Point",
                                //label: "M",
                                map: map,
                                icon: iconFlag
                            });
                        markers.push(markerHideNew);
                        hiddenMarkers.push(markerHideNew);
                        for (var q = 0; q < hiddenMarkers.length; q++) {
                            hiddenMarkers[q].setMap(null);
                        }
                    }
                }
            }
        }
        ;


        //*********mid marker creation end *************//

        $scope.firstLocation = $scope.aPlayPosiData[0]; //first location data
        $scope.lastLocation = $scope.aPlayPosiData[h]; //last location data

        $scope.start_date = $scope.aPlayPosiData[0].start_time; //first location data
        $scope.end_date = $scope.aPlayPosiData[h].end_time; //last location data

        $scope.start_date_cal = $scope.aPlayPosiData[0].start_time_cal; //for inner calander
        $scope.end_date_cal = $scope.aPlayPosiData[h].end_time_cal; //for inner calander

        var sDT = new Date($scope.aPlayPosiData[0].start_time_cal);
        //sDT.getHours();
        //sDT.getMinutes();
        $scope.hourSel1 = sDT.getHours();
        $scope.minuteSel1 = sDT.getMinutes();

        var eDT = new Date($scope.aPlayPosiData[h].end_time_cal);
        $scope.hourSel2 = eDT.getHours();
        $scope.minuteSel2 = eDT.getMinutes();

        //***** address for first location ***********/
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var lat = $scope.firstLocation.start.latitude;
        var lng = $scope.firstLocation.start.longitude;
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //$scope.formatedAddr = results[0].formatted_address;
                    $scope.$apply(function () {
                        $scope.firstLocation.formatedAddr = results[0].formatted_address;
                    });
                } else {
                    alert("No results found");
                }
            } else {
                //alert("Geocoder failed due to: " + status);
                alert("Address not found ");
            }
        });
        //***** address for first location end***********/

        //***** address for last location ***********/
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var lat = $scope.lastLocation.start.latitude;
        var lng = $scope.lastLocation.start.longitude;
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //$scope.formatedAddr = results[0].formatted_address;
                    $scope.$apply(function () {
                        $scope.lastLocation.formatedAddr = results[0].formatted_address;
                    });
                } else {
                    alert("No results found");
                }
            } else {
                //alert("Geocoder failed due to: " + status);
                alert("Address not found ");
            }
        });
        //***** address for last location end***********/

        var pointB = new google.maps.LatLng($scope.aPlayPosiData[h].stop.latitude, $scope.aPlayPosiData[h].stop.longitude),
            markerB = new google.maps.Marker({
                position: pointB,
                title: "Stop Point",
                //label: "B",
                map: map,
                icon: iconStop
            }),
            bpData = $scope.aPlayPosiData[h];
        markerB.content = '<div class="map-popup">' +
            '<p class="pp-hd">End Info</p>' +
            /*'<p>Strt Time: <span>'+bpData.start_time + '</span></p>'+*/
            '<p>End Time: <span>' + bpData.end_time + '</span></p>' +
            /*'<p>Residence : <span>'+SecondsTohhmmss(bpData.duration)+'</span></p>'+*/
            '</div>';

        google.maps.event.addListener(markerB, "click", function (e) {
            infowindow.setContent(markerB.content);
            infowindow.open(map, this);
        });
        markers.push(markerB);

        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
            //flightPlanCoordinates.push(markers[i].getPosition());
        }
        for (var i = 0; i < markers.length; i++) {
            //bounds.extend(markers[i].getPosition());
            flightPlanCoordinates.push(markers[i].getPosition());
        }

        map.fitBounds(bounds);


        //*********map for position start and end point *********//
        $scope.totalDistance = 0;

        for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
            if ($scope.aPlayPosiData[i]) {
                $scope.totalDistance = $scope.totalDistance + parseFloat($scope.aPlayPosiData[i].distance);
            }

        }
        ;
        $scope.totalDistance = $scope.totalDistance.toFixed(2);
        //$scope.totalDistance = $scope.totalDistance/1000;

        //********play marker ************/
        $scope.showStop = false;
        $scope.showPlay = true;
        $scope.watchSlider = false;
        var runningMarkers = [];
        var lineSymbol = {
            // travelMode: google.maps.DirectionsTravelMode.DRIVING,
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2,
            strokeColor: '#0000',
            strokeOpacity: 1, // 透明度
            strokeWeight: 1, // 宽度
            fillColor: "#0000",
            fillOpacity: 0.4
        };
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
                    if ($scope.slider.value == 10) {
                        $scope.speedControll = 100 * 10;
                    } else if ($scope.slider.value == 20) {
                        $scope.speedControll = 200 * 4;
                    } else if ($scope.slider.value == 30) {
                        $scope.speedControll = 300 * 2;
                    } else if ($scope.slider.value == 40) {
                        $scope.speedControll = 400 * 1;
                    } else if ($scope.slider.value == 50) {
                        $scope.speedControll = 500 / 5;
                    } else if ($scope.slider.value == 60) {
                        $scope.speedControll = 600 / 10;
                    } else if ($scope.slider.value == 70) {
                        $scope.speedControll = 700 / 15;
                    } else if ($scope.slider.value == 80) {
                        $scope.speedControll = 800 / 20;
                    } else if ($scope.slider.value == 90) {
                        $scope.speedControll = 900 / 25;
                    } else if ($scope.slider.value == 100) {
                        $scope.speedControll = 1000 / 30;
                    }
                    stop = $interval(doSomething, $scope.speedControll);
                }
            });

            stop = $interval(doSomething, $scope.speedControll);

        }
        var i = 0;
        var ppline = [];

        function doSomething() {
            if (i < $scope.newDriveTruePoints.length) {
                if ($scope.newDriveTruePoints[i].lat && $scope.newDriveTruePoints[i].lng) {
                    while (runningMarkers.length) {
                        runningMarkers.pop().setMap(null);
                    }
                    ppline.push(flightPlanCoordinates[i]);
                    //ppline.length=i+1;
                    if (flightPath) {
                        flightPath.setMap(null);
                    }
                    flightPath = new google.maps.Polyline({
                        path: ppline,
                        icons: [{
                            icon: lineSymbol,
                            offset: '1%'
                        }],
                        strokeColor: '#00cc00',
                        // travelMode: google.maps.DirectionsTravelMode.DRIVING,
                        map: map
                    });

                    //$scope.aPlayPosiData[i].average_speed = $scope.aPlayPosiData[i].distance/$scope.aPlayPosiData[i].duration * 3.6;
                    $scope.newDriveTruePoints[i].average_speed = $scope.newDriveTruePoints[i].speed;

                    //$scope.speedChange = parseFloat(Math.round($scope.aPlayPosiData[i].average_speed * 100) / 100).toFixed(2);
                    $scope.speedChange = parseFloat(Math.round($scope.newDriveTruePoints[i].average_speed * 100) / 100).toFixed(2);
                    $scope.runningDistance = $scope.newDriveTruePoints[i].cum_dist / 1000;
                    $scope.runningDistance = $scope.runningDistance.toFixed(2);
                    //$scope.dateChange = $scope.aPlayPosiData[i].start_time;
                    $scope.dateChange = moment($scope.newDriveTruePoints[i].datetime).format('LLL');

                    var midpoint = new google.maps.LatLng($scope.newDriveTruePoints[i].lat, $scope.newDriveTruePoints[i].lng),
                        //iconRunning = 'img/truck_green.png';

                        markerOk = true;
                    for (var k = 0; k < 45; k++) {
                        if (k == $scope.newDriveTruePoints[i].course) {
                            iconRunning = 'img/arrow_green1-small.png';
                            markerOk = false;
                        }
                    }
                    if (markerOk) {
                        for (var k = 46; k < 90; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green2-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 91; k < 135; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green3-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 136; k < 180; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green4-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 181; k < 225; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green5-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 226; k < 270; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green6-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 271; k < 315; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green7-small.png';
                                markerOk = false;
                            }
                        }
                    }
                    if (markerOk) {
                        for (var k = 316; k < 360; k++) {
                            if (k == $scope.newDriveTruePoints[i].course) {
                                iconRunning = 'img/arrow_green8-small.png';
                                markerOk = false;
                            } else {
                                iconRunning = 'img/arrow_green1-small.png';
                            }
                        }
                    }
                    marker = new google.maps.Marker({
                        position: midpoint,
                        title: "Mid Point",
                        //label: "M",
                        map: map,
                        icon: iconRunning
                    });
                    i++;
                    runningMarkers.push(marker);
                    map.panTo(marker.getPosition());
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
            if (runningMarkers.length > 0) {
                runningMarkers.pop().setMap(null);
            }
            var startPoint = new google.maps.LatLng($scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude),
                iconStarting = 'img/arrow_green1-small.png';
            marker = new google.maps.Marker({
                position: startPoint,
                title: "Start Point",
                //label: "M",
                map: map,
                icon: iconStarting
            });
            runningMarkers.push(marker);
            map.panTo(marker.getPosition());
            i = 0;
            if (flightPath) {
                flightPath.setMap(null);
                ppline = [];
            }
            $scope.stopFight();
        };
        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $scope.stopFight();
        });

        //***********ROUTING line draw****************//
        $scope.clickOnce = true;
        $scope.line = function () {
            if ($scope.clickOnce == true) {
                $scope.clickOnce = false;

                flightPath = new google.maps.Polyline({
                    map: map,
                    path: flightPlanCoordinates,
                    strokeColor: "#00cc00",
                    icons: [{
                        icon: lineSymbol,
                        offset: '1%'
                    }]
                });
            } else {
                flightPath.setMap(null);
                $scope.clickOnce = true;
            }
        };

        function calcRoute(start, end, waypts) {
            var request = {
                origin: start,
                destination: end,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);

                }
            });
        }

        /***********ROUTING line draw end****************/

        //********play marker ************/

        //PLAYBACK HOME PAGE FUNCTION
        $scope.homePage = function () {
            $rootScope.redirect('/#!/main/user');
        };
        $scope.playBack = function () {
            $rootScope.redirect('/#!/main/playBack');
        };
    }

    //$rootScope.againInitialiseCtrl();

    function sharePlayResp(response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if (oRes.status == 'OK') {
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
                $scope.sharePlayData = oRes;
                $scope.sharePlayData.reg_no = $rootScope.reg_no;
                $scope.againInitialiseCtrl();
                //$rootScope.redirect('/#!/main/playPosition');
            }
            else if (oRes.status == 'ERROR') {
                //swal(oRes.message, "", "error");
            }
        }
    };

    $scope.getSharedPlayData = function () {
        //var newObject = angular.copy($rootScope.playData);

        $scope.oShareData = $location.search();

        $rootScope.reg_no = $scope.oShareData.reg_no;
        //$scope.oShareData = JSON.parse($scope.shareData);

        //$scope.selTruck = newObject;
        $scope.sharePlayData = {};

        if ($scope.oShareData) {
            $scope.reportData = [];

            var playBack = {};
            playBack.request = 'playback';
            playBack.version = 2;
            playBack.device_id = $scope.oShareData.imei;
            playBack.start_time = $scope.oShareData.start_date;
            playBack.end_time = $scope.oShareData.end_date;
            playBack.login_uid = $scope.oShareData.login_uid;
            playBack.token = $scope.oShareData.token;

            playBackService.getplayData(playBack, sharePlayResp);

            $rootScope.loader = true;
            $timeout(function () {
                $rootScope.loader = false;
            }, 3000);
        } else {
            swal("Please select vehicle ");
        }

    };

    $scope.getSharedPlayData();

});



materialAdmin.controller('sharedLocationCntr', function ($rootScope, $localStorage, $stateParams, $http, $interval, $state, utils, $scope, LoginService, GoogleMapService) {
    var map;
    var marker;
    if($stateParams && $stateParams.device_id){
        var oQuery = {
            request : 'get_shared_locaion',
            lid : $stateParams.device_id
        }
        GoogleMapService.getMap(oQuery, responseShareLoc);
    }else {
        $rootScope.redirect('/#!/mains/mapZoom/');
    }

    function responseShareLoc(response) {
        var oRes = JSON.parse(response);
        if (oRes.status === 'OK') {
            if (oRes && oRes.data) {
                $scope.sharedData = oRes.data;
                $rootScope.sharedVehicleNo = $scope.sharedData.vehicle_no;
                if(!map){
                    initMap();
                    setMarkers($scope.sharedData)
                }else {
                    marker.setLatLng([$scope.sharedData.lat, $scope.sharedData.lng]).update();
                    marker.setRotationAngle(($scope.sharedData.course || 90))
                }
            } else {
                $scope.sharedData = {};
            }
        } else if (oRes.status === 'ERROR') {
            swal(oRes.message, "", "error");
        }
    }



    function initMap() {
        map = utils.initializeMapView('trackingMap',{
            zoomControl: true,
            hybrid: true,
            zoom: 5,
            search:false,
            location:false,
            center: new L.LatLng(21, 90)
        },false).map;
    }

    var oColourStatus = {"running": "#15e425", "online": "#15e425", "stopped": "red", "offline": "grey"}

    function getSVG(status) {
        var sColor = oColourStatus[status] ? oColourStatus[status] : "grey";
        var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" style="" xml:space="preserve" width="49.636" height="49.636"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/> <g class="currentLayer" style=""><title>Layer 1</title><polygon style="" points="23.164264678955078,36.56473159790039 0.16326522827148438,32.7097282409668 49.79926681518555,9.929727554321289 25.79926300048828,58.34572982788086" id="svg_1" class="" transform="rotate(-44.91157150268555 24.981266021728523,34.13772583007813) " fill="' + sColor + '" fill-opacity="1"/><g id="svg_2" class=""> </g><g id="svg_3" class=""> </g><g id="svg_4" class=""> </g><g id="svg_5" class=""></g><g id="svg_6" class=""></g><g id="svg_7" class=""></g><g id="svg_8" class=""></g><g id="svg_9" class=""></g><g id="svg_10" class=""></g><g id="svg_11" class=""></g><g id="svg_12" class=""></g><g id="svg_13" class=""></g><g id="svg_14" class=""></g><g id="svg_15" class=""></g><g id="svg_16" class=""></g></g></svg>';
        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
    }
    function haveLatLng(oLatLng) {
        if (oLatLng.lat && oLatLng.lng) {
            return oLatLng;
        } else {
            return false;
        }
    }

    function setMarkers(oMarker) {
        var a = oMarker;
        var landmarkAddress = (oMarker.nearest_landmark && oMarker.nearest_landmark.name && oMarker.nearest_landmark.dist) ? ((oMarker.nearest_landmark.dist ? (oMarker.nearest_landmark.dist / 1000) : "NA")) + " KM from " + oMarker.nearest_landmark.name : "NA";
        a.rotationAngle = a.course || 90;
        a.rotationOrigin = 'center, center';
        var title = a.vehicle_no;
        var popupText = '<div><b>Address:</b> ' + oMarker.addr + '</div><div><b>Landmark:</b> ' + landmarkAddress + '</div>';
        marker = L.marker([a.lat, a.lng]).bindTooltip(title, {
            permanent: false,
            direction: 'top'
        }).openTooltip().bindPopup(popupText).openPopup().on('click', onMarkerClick);
        marker.data = a;
        marker.setIcon(L.icon({
            iconUrl: getSVG(a.status),
            iconSize: [20, 20],
            shadowSize: [20, 25],
            iconAnchor: [10, 0],
            shadowAnchor: [4, 15],
            popupAnchor: [-3, -70]}));
        marker.addTo(map);
        centerLeafletMapOnMarker();
    }

    function onMarkerClick(e) {
        console.log(this.options);
    }

    function centerLeafletMapOnMarker() {
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    }






































    //------------------------------------------------------------------------------------------------



    /*var createMap = function (info) {
        $scope.mapCreated = true;
        if (info && info.lat && info.lng) {
            var select = {};
            select.lat = info.lat;
            select.lng = info.lng;
            var zooms = 14;
            /!*else if($scope.markers){
      var select = {};
      select.lat = $scope.markers.lat;
      select.lng = $scope.markers.lng;
      var zooms = 15;
      }*!/
            if (!$scope.markers) {
                var mapOptions = {
                    zoom: zooms,
                    center: new google.maps.LatLng(select.lat, select.lng),
                }
                map = new google.maps.Map(document.getElementById('trackingMap'), mapOptions);
            }
            setMarker(info);
            //$scope.maps = map;
        }
    }

    var marker;
    var setMarker = function (info) {
        if (marker != null) {
            marker.setMap(null);
        }
        $scope.markers = {};

        if (info.status == 'online' && info.speed > 0) {
            var cDate = new Date(info.datetime);
            var cMinutes = cDate.getMinutes();
            cDate.setMinutes(cMinutes + 15);
            if (cDate >= new Date()) {
                info.status = 'running';
            }
        }
        if (info.status == 'inactive') {
            var iconBase = 'img/arrow_red-small.png';
        } else if (info.status == 'offline') {
            var iconBase = 'img/arrow_default-small.png';
        } else if (info.status == 'handshake') {
            var iconBase = 'img/arrow_yellow-small.png';
        } else if (info.status == 'online') {
            var iconBase = 'img/arrow_red-small.png';
        } else if (info.status == 'running') {
            $scope.markerOk = true;
            //var iconBase = 'img/truck_d.png';
            for (var i = 1; i < 45; i++) {
                if (i == info.course) {
                    var iconBase = 'img/arrow_green1-small.png';
                    $scope.markerOk = false;
                }
            }
            if ($scope.markerOk) {
                for (var i = 46; i < 90; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green2-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 91; i < 135; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green3-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 136; i < 180; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green4-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 181; i < 225; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green5-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 226; i < 270; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green6-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 271; i < 315; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green7-small.png';
                        $scope.markerOk = false;
                    }
                }
            }
            if ($scope.markerOk) {
                for (var i = 316; i < 360; i++) {
                    if (i == info.course) {
                        var iconBase = 'img/arrow_green8-small.png';
                        $scope.markerOk = false;
                    } else {
                        var iconBase = 'img/arrow_green1-small.png';
                    }
                }
            }
        }

        info.datetime = moment(info.datetime).format('LLL');
        info.positioning_time = moment(info.positioning_time).format('LLL');
        info.location_time = moment(info.location_time).format('LLL');
        $scope.setValueSidebar = info;
        if (info.acc_high == true) {
            info.acc_high = 'On';
            $scope.acc_high = 'On';
        } else if (info.acc_high == false) {
            info.acc_high = 'Off';
            $scope.acc_high = 'Off';
        } else if (info.acc_high == undefined) {
            info.acc_high = 'NA';
            $scope.acc_high = 'NA';
        }

        if (info.ac_on == true) {
            info.ac_on = 'On';
            $scope.ac_on = 'On';
        } else if (info.ac_on == false) {
            info.ac_on = 'Off';
            $scope.ac_on = 'Off';
        } else if (info.ac_on == undefined) {
            info.ac_on = 'NA';
            $scope.ac_on = 'NA';
        }
        $scope.sLat = info.lat;
        $scope.sLng = info.lng;

        //!*********get address on marker by own server start ************!//
        function getAddress(info, callback) {
            if (info.start && info.start.latitude && info.start.longitude) {
                var lat = info.start.latitude;
                var lng = info.start.longitude;
            } else {
                var lat = info.lat;
                var lng = info.lng;
            }
            //var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
            var latlngUrl = "http://13.229.86.93:4242/reverse?lat=" + lat + "&lon=" + lng;
            $http({
                method: "GET",
                url: latlngUrl
            }).then(function mySucces(response) {
                info.formatedAddr = response.data.display_name;
                callback();
            }, function myError(response) {
                info.formatedAddr = response.statusText;
            });

        }

        //!*******get address end ************!//

        $scope.markers = {};
        //var iconBase = 'img/marker-green.png';
        marker = new google.maps.Marker({
            zoom: 8,
            map: map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: $scope.devSharedData.vehicle_no,
            icon: iconBase
        });
        var infoWindow = new google.maps.InfoWindow();
        info.NearLandMark = info.nearest_landmark && info.nearest_landmark.name && info.nearest_landmark.dist ? info.nearest_landmark.dist / 1000 + " KM from " + info.nearest_landmark.name : "NA";
        (function (marker, info) {
            google.maps.event.addListener(marker, 'click', function () {
                getAddress(info, function () {

                    infoWindow.close(); // Close previously opened infowindow
                    infoWindow.setContent('<div class="map-popup">' +
                        /!*'<p>Device Id &nbsp;&nbsp;&nbsp;: <span>'+ info.device_id+ '</span></p>'+*!/
                        '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + info.acc_high + '</span></p>' +
                        '<p>Speed &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;: <span>' + info.speed + ' &nbsp;&nbsp;KM/H. </span></p>' +
                        '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + info.ac_on + '</span></p>' +
                        '<p>Location &nbsp;&nbsp;&nbsp;: <span>' + info.formatedAddr + '</span></p>' +
                        '<p>Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>' + moment(info.datetime).format('LLL') + '</span></p>' +
                        '<p>Positioning Time &nbsp;&nbsp;&nbsp;: <span>' + moment(info.positioning_time || info.location_time).format('LLL') + '</span></p>' +
                        '<p>Nearest Landmark &nbsp;&nbsp;&nbsp;: <span>' + info.NearLandMark + '</span></p><hr class="m-t-5 m-b-5">' +
                        '</div>');
                    infoWindow.open(map, marker);
                });
            });
        })(marker, info);

        $scope.markers = marker;
        map.panTo(marker.getPosition());
        $scope.StartTimer();
    }

    $scope.getSharedLocationData();
    $scope.StartTimer = function () {
        $scope.Timer = $interval(function () {
            $scope.setValueSidebar = $scope.setValueSidebar;
        }, 10000);
    };*/
});

