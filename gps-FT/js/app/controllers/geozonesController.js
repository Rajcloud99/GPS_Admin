materialAdmin.controller('geozonesCtrl', function ($rootScope,$scope,$localStorage,$http,utils,LoginService,reportService,limitToFilter) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $scope.aLocations = [];
    $rootScope.states.actItm = 'geozones';
    if(!$rootScope.selectedUser){
        $rootScope.selectedUser = $localStorage.user;
    }
    $scope.aLocationUrl = [{type:"gpsGaadi",url:"http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
        {type:"mapMyIndia",url:"http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json?query="},
        {type:"mapMyIndiaGeoCode",url:"http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
    ];


    $scope.geoData = {};
    var htmlcontent = '';
    var strName= "Geozone";
    htmlcontent += '<div class="p-t10 p-b5">';
    htmlcontent += '<div>';
    htmlcontent += '<table>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r"><label  class="text-ellipsis" title="Name"><font color="#ff0000">*</font>&nbsp;Name:&nbsp;&nbsp;</label></td>';
    htmlcontent += '<td><input type="text" name="name" size="20" class="form-control myGeo" style="width:160px;"  title="Enter "'+strName+'title  placeholder="Enter "'+strName+'title/></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r p-t7 "  title="desc"><label>Description:&nbsp;</label></td>';
    htmlcontent += '<td class="p-t7"><input type="text" name="desc"  class="form-control myGeo" size="50" style="width:160px;"/></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<tr class="hideMe">';
    htmlcontent += '<td class="ta-r p-t7 "  title="radius"><label>Radius:&nbsp;</label></td>';
    htmlcontent += '<td class="p-t7"><input type="number" name="radius" class="form-control myGeo" size="50" style="width:160px;"/></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<td>&nbsp;</td>';
    htmlcontent += '<td  class="p-t7"><input type="submit" id="saveBtn" class="btn btn-primary btn-block" /></td>';
    htmlcontent += '</tr>';
    htmlcontent += '</table>';
    htmlcontent += '</div>';
    htmlcontent += '</div>';


    var map = utils.initializeMapView('map',{
        zoomControl: true,
        hybrid: true,
        zoom: 4,
        search:false,
        location:false,
        center: new L.LatLng(21, 90)
    },false).map;
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            },
            edit: false
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            polyline : false,
            circlemarker : false,
            marker : false
        }
    });
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, function(event) {
        var layer = event.layer;
        $scope.geoData = getLayerData(event);
        var parentDiv = document.createElement("div");
        parentDiv.innerHTML = htmlcontent;
        var htmlElement = parentDiv.firstChild;
        if($scope.geoData.ptype === 'cirlce'){
            var setValue = htmlElement.getElementsByClassName('myGeo');
            setValue.radius.value = $scope.geoData.radius;
        }else {
            htmlElement.getElementsByClassName('hideMe')[0].style.visibility='hidden';
        }
        getBtn = htmlElement.getElementsByClassName('btn');
        getBtn.saveBtn.addEventListener('click',function (e) {
            var getValue = htmlElement.getElementsByClassName('myGeo');
            if($scope.geoData.ptype !== 'cirlce') {
                if (getValue.desc.value) {
                    $scope.geoData.description = getValue.desc.value
                }
                if (getValue.name.value) {
                    $scope.geoData.name = getValue.name.value
                    saveGoogleGeozoneInfo()
                }
            }else {
                if(getValue.radius.value){
                    $scope.geoData.radius = parseFloat(getValue.radius.value)
                    if (getValue.desc.value) {
                        $scope.geoData.description = getValue.desc.value
                    }
                    if (getValue.name.value) {
                        $scope.geoData.name = getValue.name.value
                        saveGoogleGeozoneInfo()
                    }
                }
            }
        });
        popup = L.popup().setContent(htmlElement);
        layer.bindPopup(popup);
        //layer.bindPopup(content);
        drawnItems.addLayer(layer);
        layer.openPopup();
        getBtn.saveBtn.click()
    });
    var marker;
    var popup;

    if($rootScope.dataForGeofence){
        $scope.dataGeoCreate = $rootScope.dataForGeofence;
        if($scope.dataGeoCreate && $scope.dataGeoCreate.lat && $scope.dataGeoCreate.lng){
            $scope.dataGeoCreate.lon = $scope.dataGeoCreate.lng
            renderMap($scope.dataGeoCreate)
        }
        if(!$scope.dataGeoCreate.formatedAddr){
            $scope.dataGeoCreate.formatedAddr = $scope.dataGeoCreate.address;
        }
    }

    function setLatLongInArray(aLatLng) {
        var aData = [];
        if(aLatLng && aLatLng.length>0){
            for (var i=0; i<aLatLng.length; i++){
                aData.push({latitude:aLatLng[i].lat,longitude:aLatLng[i].lng})
            }
        }
        return aData;
    }

    function getLayerData(e) {
        var layerType = e.layerType;
        var toSend = {"request": "add_geozone"};
        if (layerType === 'circle') {
            toSend.ptype = "circle";
            toSend.radius = e.layer._mRadius;
            toSend.geozone = setLatLongInArray(JSON.parse(JSON.stringify([e.layer._latlng])));
            toSend.zoom_level = e.target._zoom;
            return toSend;
        } else if (layerType === 'rectangle') {
            toSend.ptype = "rectangle";
            toSend.geozone = setLatLongInArray(JSON.parse(JSON.stringify(e.layer._latlngs[0])));
            toSend.zoom_level = e.target._zoom;
            return toSend;
        } else if (layerType === 'polygon') {
            toSend.ptype = "polygon";
            toSend.geozone = setLatLongInArray(JSON.parse(JSON.stringify(e.layer._latlngs[0])));
            toSend.zoom_level = e.target._zoom;
            return toSend;
        }
        return null;
    }

    //$scope.afterOne = false;

    function renderMap(data) {
        map.setView([data.lat, data.lon], 13);
        if (marker) {
            map.removeLayer(marker);
        }
        var reg = ($scope.dataGeoCreate && $scope.dataGeoCreate.reg_no)?$scope.dataGeoCreate.reg_no:undefined
        var title = data.display_name?data.display_name:reg;
        marker = L.marker([data.lat, data.lon]).bindTooltip(title,{permanent:false,direction:'top'}).openTooltip();
        marker.addTo(map);
    }
    function mapMyIndiaResponse(responseData) {
        var result = [];
        if(responseData && responseData.results && responseData.results.length>0){
            for(var i=0; i<responseData.results.length;i++){
                //responseData.results[i].display_name = responseData.results[i].formatted_address;
                if(responseData.results[i].lat){
                    responseData.results[i].lat = parseFloat(responseData.results[i].lat);
                }
                if(responseData.results[i].lng){
                    responseData.results[i].lon = parseFloat(responseData.results[i].lng);
                }
                result.push(responseData.results[i])
            }
        }
        return result;
    }

    $scope.getCityByPlaceId = function(query) {
        if (query && query.toString().length > 2) {
            var oUrl = $scope.aLocationUrl[2];
            var locationUrl = oUrl.url+query;
            $http({
                method: "POST",
                url: locationUrl
            }).then(function (response) {
                    if(oUrl.type === "mapMyIndiaGeoCode"){
                        var res = mapMyIndiaResponse(response.data);
                        if(res[0].lat && res[0].lon){
                            renderMap(res[0])
                        }
                    }
                }, function (response) {

            });
        }
    };
    $scope.cities = function(query) {
        if (query && query.toString().length > 2) {
            var oUrl = $scope.aLocationUrl[1];
            var locationUrl = oUrl.url+query;
            return  $http({
                method: "GET",
                url: locationUrl
            }).then(function (response) {
                if(oUrl.type==="mapMyIndiaGeoCode"){
                    $scope.aLocations = mapMyIndiaResponse(response.data);
                    return limitToFilter($scope.aLocations);
                    /*if($scope.afterOne == true){
                        $scope.onSelect($scope.aLocations[0], $scope.aLocations[0], $scope.aLocations[0].formatted_address);
                    }*/
                }else {
                    return $scope.aLocations = response.data.suggestedLocations.map(function (suggestion) {
                        suggestion.formatted_address = suggestion.placeName+((suggestion.placeAddress && suggestion.placeAddress!="")?', '+suggestion.placeAddress:'');
                        return suggestion;
                    });
                }
                //return limitToFilter(response.data, 15);
            });
        } else if (query === '') {
            $scope.aLocations = [];
        }
    };

    $scope.onSelect = function($item, $model, $label) {
        if($item.lat && $item.lon) {
            renderMap($item)
        }else {
            $scope.getCityByPlaceId($item.place_id)
        }
    };

    $scope.geo = {};

    $scope.geoByLatLngRadi = function () {
      if($scope.geo.lat && $scope.geo.lon){
          renderMap($scope.geo);
      }
    };

    function alertResponse(response){
        var oRes = JSON.parse(response);
        if(oRes.status === 'OK'){
            var msg = oRes.message;
            //swal("Saved",msg,"success");
        }
    }

    function addGeozoneCallback(response){
        var oRes = JSON.parse(response);
        if(oRes.status === 'OK'){
            map.closePopup();
            //$rootScope.redirect('/#!/main/geozonesList');
            var msg = oRes.message;
            swal("Saved",msg,"success");
            if($scope.dataGeoCreate){
                var objAlert = {};
                objAlert.request = 'create_alarm';
                objAlert.login_uid = $localStorage.user.user_id;
                objAlert.atype = 'geofence';
                var dateForOperation = moment();
                $scope.dateTimeStart = dateForOperation._d;
                $scope.dateTimeEnd = dateForOperation.clone().add(10, 'days')._d;
                objAlert.start_time = $scope.dateTimeStart;
                objAlert.end_time = $scope.dateTimeEnd;
                objAlert.category = 'alert';
                objAlert.entry_msg = 'Enter Into Geofence.';
                objAlert.exit_msg = 'Exit From Geofence.';
                objAlert.gid = oRes.data.gid;
                objAlert.mobiles = [parseInt($localStorage.user.mobile)];
                objAlert.emails = [$localStorage.user.email];
                objAlert.driver_name = $scope.dataGeoCreate.driver_name || 'NA';
                objAlert.vehicle_no = $scope.dataGeoCreate.reg_no;
                objAlert.imei = $scope.dataGeoCreate.device_id;

                reportService.createAlerts(objAlert,alertResponse);
            }
        }
    };
    function saveGoogleGeozoneInfo(){
        LoginService.addGeozone($scope.geoData,addGeozoneCallback);
    }

    function getLatLongInArray(aLatLng) {
        var aData = [];
        if(aLatLng && aLatLng.length>0){
            for (var i=0; i<aLatLng.length; i++){
                aData.push([aLatLng[i].latitude,aLatLng[i].longitude])
            }
        }
        return aData;
    }

    function setLayerData(mapData) {
        var layerType = mapData.ptype;
        if (layerType === 'circle') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var circle = L.circle(latlngs[0], {color: 'orange',radius: (mapData.radius || 0)}).addTo(map);
            // zoom the map to the polygon
            map.fitBounds(circle.getBounds());
            circle.bindPopup(mapData.name).openPopup();

        } else if (layerType === 'rectangle') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var rect = L.rectangle(latlngs, {color: 'blue'}).addTo(map);
            // zoom the map to the polygon
            map.fitBounds(rect.getBounds());
            rect.bindPopup(mapData.name).openPopup();

        } else if (layerType === 'polygon') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var poly = L.polygon(latlngs, {color: 'green'}).addTo(map)//.bindPopup(mapData.name).openPopup();
            // zoom the map to the polygon
            map.fitBounds(poly.getBounds());
            poly.bindPopup(mapData.name).openPopup();
        }
    }

    if($rootScope.geoZoneListRoot && $rootScope.geoZoneListRoot.length>0){
        for (var x=0; x<$rootScope.geoZoneListRoot.length;x++){
            setLayerData($rootScope.geoZoneListRoot[x]);
        }
    }
    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.createGeozone = function () {
        $rootScope.redirect('/#!/main/geozonesList');
    };
});

materialAdmin.controller('geozonesListCtrl', function ($rootScope,$scope,$uibModal,$localStorage,LoginService) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $scope.aGeoZoneList = [];
    $scope.aPageState = [
      [0,0,0,0,0]
    ];
    $rootScope.states.actItm = 'geozones';
    if(!$rootScope.selectedUser){
        $rootScope.selectedUser = $localStorage.user;
    }

    if($rootScope.dataForGeofence){
        $rootScope.dataForGeofence = '';
    }

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

                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 13;
                            }
                        }
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
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($rootScope.getPageNoAlt > 0) {
                getGeoList.pageState = $scope.aPageState[$rootScope.getPageNoAlt];
            }
        }
        getGeoList.request = 'get_geozone';
        getGeoList.row_count = 13;
        getGeoList.token = $localStorage.user.token;
        LoginService.getGeozoneList(getGeoList,geoListResponse);
    };
    $rootScope.getGeoZone();
    //****call geo list function


    $rootScope.getGeoZoneDownload = function(){
        function geoDownloadResponse(response){
            var oRes = JSON.parse(response);
            if(oRes){
                if(oRes.status === 'OK'){
                    $scope.sheetDownloadResp = oRes.data;
                    console.log($scope.sheetDownloadResp);
                    var a = document.createElement('a');
                    a.href = $scope.sheetDownloadResp;
                    a.download = $scope.sheetDownloadResp;
                    a.target = '_blank';
                    a.click();
                }
                else if(oRes.status === 'ERROR'){
                }

            }
        }

        var getGeoDownload = {};
        getGeoDownload.request = 'get_geozone_download';
        LoginService.getGeozoneDownload(getGeoDownload,geoDownloadResponse);
    };


    //****** geo list get function **********//
    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $rootScope.getPageNoAlt = $scope.bigCurrentPage - 1;
        $scope.getGeoZone();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aGeoZoneList.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    $scope.createGeo = function(){
        $rootScope.geoZoneListRoot = $scope.aGeoZoneList;
        $rootScope.redirect('/#!/main/geozones');
    };

    $scope.editGeofence = function(gZone){
        $rootScope.geofence = gZone;
        var modalInstance = $uibModal.open({
            templateUrl : 'views/geozones/edit-geozones.html',
            controller : 'editGeozonesCtrl'
        });
    };
    $scope.removeGeofence = function(gZone){
        $rootScope.geofence = gZone;
        var modalInstance = $uibModal.open({
            templateUrl : 'views/geozones/remove-geozones.html',
            controller : 'removeGeozonesCtrl'
        });
    };
    $scope.showGeofence = function(gZone){
        $rootScope.sGeofence = gZone;
        $rootScope.redirect('/#!/main/showGeozone');
        //$rootScope.showDataGeomap(gZone);
    };
    $scope.createAlrt = function(gZone){
        $rootScope.alertGeo = gZone;
        $rootScope.updateFullAlert = {};
        $rootScope.updateFullAlert.update_alert = false;
    };
    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

});

materialAdmin.controller("editGeozonesCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
    $rootScope.showSideBar = false;
    //$rootScope.geofence;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectedgZone = {};
    $scope.selectedgZone.name = $rootScope.geofence.name;
    $scope.selectedgZone.description = $rootScope.geofence.description;

    //******* Start edit geoozone function *************//
        function updateRes(response){
            var oRes = JSON.parse(response);
            if(oRes){
                if(oRes.status === 'OK'){
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if(oRes.status === 'ERROR'){
                    swal(oRes.message, "", "error");
                }
            }
            $uibModalInstance.dismiss('cancel');
        }

        $scope.editGeozonesF = function (selectedgZone) {
            if(selectedgZone){
                selectedgZone.request = "update_geozone";
                selectedgZone.gid = $scope.geofence.gid;
                RegistrationService.editGeozones(selectedgZone,updateRes);
            }
        };
    //******* end edit geozone function *************//

}]);

materialAdmin.controller("removeGeozonesCtrl",['$rootScope', '$scope', '$localStorage','$window', '$uibModal', '$uibModalInstance','$interval','$state', '$timeout','RegistrationService', function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,RegistrationService) {
    $rootScope.showSideBar = false;
    //$rootScope.geofence;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectedgZone = {};
    $scope.selectedgZone.name = $rootScope.geofence.name;
    $scope.selectedgZone.description = $rootScope.geofence.description;

    //******* Start remove geozone *************//
        function removeRes(response){
            var oRes = JSON.parse(response);
            if(oRes){
                if(oRes.status === 'OK'){
                    swal(oRes.message, "", "success");
                    $rootScope.getGeoZone();   //****call geo list function
                    $uibModalInstance.dismiss('cancel');
                }
                else if(oRes.status === 'ERROR'){
                    swal(oRes.message, "", "error");
                }
            }
            $uibModalInstance.dismiss('cancel');
        };

        $scope.removeGeozonesF = function (selectedgZone) {
            if(selectedgZone){
                selectedgZone.request = "remove_geozone";
                selectedgZone.gid = $scope.geofence.gid;
                RegistrationService.removeGeozones(selectedgZone,removeRes);
            }
        };
    //******* end remove zone *************//

}]);

materialAdmin.controller('showGeoZonesCtrl', function ($rootScope,$scope,$localStorage,utils,LoginService) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $rootScope.states.actItm = 'geozones';
    if(!$rootScope.selectedUser){
        $rootScope.selectedUser = $localStorage.user;
    }

    if($rootScope.sGeofence){
        $localStorage.showGeoData = $rootScope.sGeofence;
    }else if($localStorage.showGeoData){
        $rootScope.sGeofence = $localStorage.showGeoData;
    }
    var sGeo = $rootScope.sGeofence;
    var oConfig = getAppConfig();
    var map = utils.initializeMapView('showGeoZoneMap',{
        zoomControl: true,
        hybrid: true,
        zoom: 4,
        search:false,
        location:false,
        center: new L.LatLng(21, 90)
    },false).map;

    getLayerData(sGeo);

    function getLatLongInArray(aLatLng) {
        var aData = [];
        if(aLatLng && aLatLng.length>0){
            for (var i=0; i<aLatLng.length; i++){
                aData.push([aLatLng[i].latitude,aLatLng[i].longitude])
            }
        }
        return aData;
    }

    function getLayerData(mapData) {
        var layerType = mapData.ptype;
        if (layerType=='circle') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var circle = L.circle(latlngs[0], {color: 'red',radius: (mapData.radius || 0)}).addTo(map);
            // zoom the map to the polygon
            map.fitBounds(circle.getBounds());
            circle.bindPopup(mapData.name).openPopup();

        } else if (layerType=='rectangle') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var rect = L.rectangle(latlngs, {color: 'red'}).addTo(map);
            // zoom the map to the polygon
            map.fitBounds(rect.getBounds());
            rect.bindPopup(mapData.name).openPopup();

        } else if (layerType=='polygon') {
            var latlngs = getLatLongInArray(mapData.geozone);
            var poly = L.polygon(latlngs, {color: 'red'}).addTo(map)//.bindPopup(mapData.name).openPopup();
            // zoom the map to the polygon
            map.fitBounds(poly.getBounds());
            poly.bindPopup(mapData.name).openPopup();
        }
    };


    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.geozone = function () {
        $rootScope.redirect('/#!/main/geozonesList');
    };

});