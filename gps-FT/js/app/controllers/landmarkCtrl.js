materialAdmin.controller('landmarkListCtrl', function
    ($rootScope,
     $scope,
     $uibModal,
     $localStorage,
     landmarkService,
     utils,
     objToCsv,
     GoogleMapService
    ) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $scope.aLandmarkList = [];
    $scope.aAllLand = [];
    $scope.aPageState = [
        [0, 0, 0, 0, 0]
    ];
    $rootScope.states.actItm = 'landmark';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.selectedUser;
    }
    if ($rootScope.dataForGeofence) {
        $rootScope.dataForGeofence = '';
    }
    //****** land list get function **********//
    $rootScope.getAllLadmark = function () {
        function landListResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $scope.$apply(function () {
                        var toUpdateDateFormate = oRes.data;
                        for (var i = 0; i < toUpdateDateFormate.length; i++) {
                            if (toUpdateDateFormate[i].created_at) {
                                toUpdateDateFormate[i].cr_date = moment(toUpdateDateFormate[i].created_at).format('LLL');
                            }
                        }
                        $scope.aLandmarkList = toUpdateDateFormate;
                        $rootScope.aAllLand = toUpdateDateFormate;
                        if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                            if (oRes.pageState) {
                                $scope.aPageState.push(oRes.pageState.data);
                                $scope.bigTotalItems = $scope.aPageState.length * 12;
                            }
                        }
                    });
                }
                else if (oRes.status === 'ERROR') {
                    //swal(oRes.message, "", "error");
                    $scope.aLandmarkList = [];
                }
            }
        }

        var landList = {};
        if ($scope.aPageState && $scope.aPageState.length > 1) {
            if ($scope.getPageNoAlt > 0) {
                landList.pageState = $scope.aPageState[$scope.getPageNoAlt];
            }
        }
        landList.login_uid = $localStorage.user.user_id;
        landList.user_id = $localStorage.preservedSelectedUser.user_id;
        landList.request = 'get_landmark';
        landList.row_count = 12;
        landList.token = $localStorage.user.token;
        GoogleMapService.getLandmarkList(landList, landListResponse);
    };

    // $rootScope.getAllLadmark();   //****call geo list function

     $scope.getLandmark = function() {
         var oFilter = prepareFilterObject();
         landmarkService.getLandmark(oFilter, onSuccess, err => {
            console.log(err)
        });

        // Handle success response
        function onSuccess(response) {
            if (response && response.data && response.data.length) {
                res = response.data;
                $scope.aLandmarkList = res;
                if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                    $scope.aPageState.push(res);
                    $scope.aAllLand.push(...res);
                        $scope.bigTotalItems = $scope.aAllLand.length + 2;
                }
            }else{
                $scope.aLandmarkList = [];
                $scope.aAllLand = [];
            }
        }
    };

     $scope.deleteLandmark = function(aSelectedLandmark) {

        if(!aSelectedLandmark)
            return swal('Error', 'Please Select Single row', 'error');

         $scope.aSelectedLandmark = Array.isArray(aSelectedLandmark) ? aSelectedLandmark[0] : aSelectedLandmark;
         $scope.aSelectedLandmark.selected_uid = $localStorage.preservedSelectedUser.user_id;
         $scope.aSelectedLandmark.login_uid = $localStorage.user.user_id;
         $scope.aSelectedLandmark.user_id = $localStorage.preservedSelectedUser.user_id;

        swal({
                title: 'Are you sure you want to delete selected landmark?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true,
                closeOnCancel: true,
                allowOutsideClick: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    landmarkService.removeLandmark({
                        ...$scope.aSelectedLandmark
                    }, onSuccess, onFailure);
                    function onSuccess(res) {
                        swal('Success', res.message, 'success');
                        getLandmark();
                    }
                    function onFailure(err) {
                        swal('Error', err.message, 'error');
                    }
                }
            });
    };

    $scope.downloadCsv = function () {
        objToCsv(null,
            [
                'NAME',
                'ADDRESS',
                'LATITUDE',
                'LONGITUDE',
                'CATEGORY',
                'CATEGORY DETAILS',
                'KM CHAINING',
                'DISTANCE'
            ],
            []
        );
    }

    $scope.downloadCsvRpt = function(){
        var oFilter = prepareFilterObject();

        landmarkService.downloadLandmark(oFilter, function (response) {

            if (response.data && response.data.url) {
                var a = document.createElement('a');
                a.href = response.data.url;
                a.download = response.data.url;
                a.target = '_blank';
                a.click();
            } else {
                swal("warning", response.message|| response.data.message, "warning");
            }
        });
    };

    $scope.uploadFile = function () {

        $uibModal.open({
            templateUrl: 'views/landmark/landmarkExlView.html',
            controller: ['$scope', '$uibModalInstance', '$localStorage', 'landmarkService', 'otherUtils', 'utils', landmarkExlViewController],

        }).result.then(function (response) {
            console.log('close', response);
        }, function (data) {
            console.log('cancel', data);
        });
    };

    function prepareFilterObject() {
        var filter = {};
        if ($scope.landName)
            filter.name = $scope.landName;

        filter.selected_uid = $localStorage.preservedSelectedUser.user_id;
        filter.login_uid = $localStorage.user.user_id;
        filter.user_id = $localStorage.preservedSelectedUser.user_id;
        filter.row_count = 8;
        filter.no_of_docs = 15;
        filter.skip = $scope.bigCurrentPage;
        filter.sort = {'_id': -1};
        return filter;
    }

    //****** land list get function **********//
    //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        // $scope.getPageNo = $scope.bigCurrentPage - 1;
        $scope.getLandmark();
    };

    $scope.maxSize = 3;
    $scope.bigTotalItems = $scope.aLandmarkList.length;
    $scope.bigCurrentPage = 1;
    //****************pagination code end ************//
    $scope.pages = [1];
    $scope.nxt = function () {
        $scope.pages.push($scope.pages.length + 1);
    };

    // Edit / update landmark here....
    $scope.editLandmark = function (landData) {
        $rootScope.selectedLandmarkData = landData;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/landmark/edit-landmark.html',
            controller: 'editLandmarkCtrl'
        });
    };

    // delete landmark by selected landmark
    $scope.removeLandmark = function (landData) {
        function removeResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $rootScope.getAllLadmark();
                }
                else if (oRes.status === 'ERROR') {
                    $scope.aLandmarkList = [];
                }
            }
        }

        var removeLand = {};
        removeLand.login_uid = $localStorage.user.user_id;
        removeLand.user_id = $localStorage.preservedSelectedUser.user_id;
        removeLand.request = 'remove_landmark';
        removeLand.name = landData.name;
        removeLand.created_at = landData.created_at;
        removeLand.token = $localStorage.user.token;
        GoogleMapService.removeLandmark(removeLand, removeResponse);
    };

    // add new landmark calling create page
    $scope.createLandmark = function () {
        $rootScope.redirect('/#!/main/createLandmark');
    };

    $scope.upsertLandmark = function (type = 'add', aSelectedLandmark) {

        if (type == 'edit' || type == 'view') {
            if (Array.isArray(aSelectedLandmark)) {
                if (aSelectedLandmark.length !== 1)
                    return swal('Warning', 'Please Select Single row', 'warning');
            }
            $scope.aSelectedLandmark = Array.isArray(aSelectedLandmark) ? aSelectedLandmark[0] : aSelectedLandmark;

        } else {
            $scope.aSelectedLandmark = {};
        }

        $uibModal.open({
            templateUrl: 'views/landmark/upsertLandmark.html',
            controller: ['$rootScope', '$http', '$scope', '$timeout', '$uibModalInstance', '$localStorage', 'landmarkService', 'otherUtils', 'otherData', 'utils', 'gpsAnalyticService', landmarkUpsertController],
            controllerAs: 'luVm',
            resolve: {
                otherData: function () {
                    return {
                        aData: $scope.aSelectedLandmark,
                        type: type,
                        showMap: true
                    };
                }
            },
        }).result.then(function (response) {
            console.log('close', response);
        }, function (data) {
            console.log('cancel', data);
        });
    }

    $scope.$watch('toggle', function () {
        $scope.toggleText = $scope.toggle ? 'Back to List' : 'See on Map';
    });

    $scope.callFirst = true;

    var map;

    function initMap() {
        map = utils.initializeMapView('map-togg', {
            zoomControl: true,
            hybrid: true,
            zoom: 4,
            search: false,
            location: false,
            center: new L.LatLng(21, 90)
        }, false).map;
    }

    var oColourStatus = {"running": "#15e425", "stopped": "red", "offline": "grey"};

    function haveLatLng(aLatLng) {
        var ahaveLatLng = [];
        for (var i = 0; i < aLatLng.length; i++) {
            if (aLatLng[i].location && aLatLng[i].location.latitude && aLatLng[i].location.longitude) {
                ahaveLatLng.push(aLatLng[i]);
            }
        }
        return ahaveLatLng;
    }

    function setMarkers(aMarker) {
        if (aMarker && aMarker.length > 0) {
            var markerList = [];
            for (var i = 0; i < aMarker.length; i++) {
                var a = aMarker[i];
                var title = a.name;
                var marker = L.marker([a.location.latitude, a.location.longitude], a).bindTooltip(title, {
                    permanent: false,
                    direction: 'top'
                }).openTooltip();
                marker.data = aMarker[i];
                marker.addTo(map)
            }
        }
    }

    $scope.alreadyInitialized = false;

    $rootScope.seeOnMapAllLandmark = function () {
        if ($scope.toggle) {
            document.getElementById('map-togg').style.display = "block";
            //initialize();
            if (!$scope.alreadyInitialized) {
                $scope.alreadyInitialized = true;
                initMap();
                var aHaveData = haveLatLng($scope.aLandmarkList);
                if (aHaveData && aHaveData.length > 0) {
                    setMarkers(aHaveData);
                }
            }
        } else {
            document.getElementById('map-togg').style.display = "none";
        }
    };

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };

});

materialAdmin.controller('landmarkCreateCtrl', function (
    $rootScope,
    $scope,
    $localStorage,
    $http,
    $window,
    $interval,
    utils,
    GoogleMapService,
    LoginService,
    otherUtils,
    limitToFilter,
    gpsAnalyticService
) {
    $rootScope.showSideBar = false;
    $rootScope.states = {};
    $rootScope.states.actItm = 'landmark';
    if (!$rootScope.selectedUser) {
        $rootScope.selectedUser = $localStorage.selectedUser;
    }

    $scope.hideProfile = true;
    $rootScope.showTextforAdd = true;
    $scope.count = 1;
    $scope.searchLocation = searchLocation;
    $scope.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
        // {type:"mapMyIndia",url:"http://trucku.in:8081/api/mapmyindia/autosuggest?q="},
        {type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
        {type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
    ];
    var listAllMarkers = $rootScope.aAllLand;

    function haveLatLng(aLatLng) {
        var ahaveLatLng = [];
        for (var i = 0; i < aLatLng.length; i++) {
            if (aLatLng[i].location && aLatLng[i].location.latitude && aLatLng[i].location.longitude) {
                ahaveLatLng.push(aLatLng[i]);
            }
        }
        return ahaveLatLng;
    }

    function setMarkers(aMarker) {
        if (aMarker && aMarker.length > 0) {
            for (var i = 0; i < aMarker.length; i++) {
                var a = aMarker[i];
                var title = a.name;
                var marker = L.marker([a.location.latitude, a.location.longitude], a).bindTooltip(title, {
                    permanent: false,
                    direction: 'top'
                }).openTooltip();
                marker.data = aMarker[i];
                marker.addTo(map)
            }
        }
    }

    $scope.landarkData = {};

    var htmlcontent = '';
    var strName = "Geozone";
    htmlcontent += '<div class="p-t10 p-b5">';
    htmlcontent += '<div>';
    htmlcontent += '<table>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r"><label  class="text-ellipsis" title="Name"><font color="#ff0000">*</font>&nbsp;Name:&nbsp;&nbsp;</label></td>';
    htmlcontent += '<td><input type="text" id="name" name="name" size="20" class="form-control myMark" style="width:200px;"  title="Enter "' + strName + 'title  placeholder="Enter "' + strName + 'title/ ></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r"><label  class="text-ellipsis" title="Address"><font color="#ff0000">*</font>&nbsp;Address:&nbsp;&nbsp;</label></td>';
    htmlcontent += '<td><input type="text" id="loc" name="geoname" size="20" class="form-control myMark" style="width:200px;"  title="Enter "' + strName + 'title  placeholder="Enter "' + strName + 'title/ ></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r p-t7 "  title="Latitude"><label>Lat:&nbsp;</label></td>';
    htmlcontent += '<td class="p-t7"><input type="text" id="lat" name="Latitude" class="form-control myMark" size="50" style="width:200px;" / readonly></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r p-t7 "  title="Longitude"><label>Lng:&nbsp;</label></td>';
    htmlcontent += '<td class="p-t7"><input type="text" id="lng" name="Longitude" class="form-control myMark" size="50" style="width:200px;"/ readonly></td>';
    htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '<td class="ta-r p-t7"  title="Longitude"><label></label></td>';
    htmlcontent += '<td class="p-t7"><label>Please select (*) required field</lable></td>';
    htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '<td>&nbsp;</td>';
    htmlcontent += '<td  class="p-t7"><input type="submit"  id="saveMark" class="btn btn-primary btn-block" /></td>';
    htmlcontent += '</tr>';
    htmlcontent += '</table>';
    htmlcontent += '</div>';
    htmlcontent += '</div>';

    var oConfig = getAppConfig();

    var map = utils.initializeMapView('createlandmark', {
        zoomControl: true,
        hybrid: true,
        zoom: 4,
        search: false,
        location: false,
        center: new L.LatLng(21, 90)
    }, false).map;
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: false
        },
        draw: {
            polygon: false,
            polyline: false,
            circlemarker: false,
            //marker : false,
            circle: false,
            rectangle: false,

        }
    });

    var aHaveData = haveLatLng(listAllMarkers);
    if (aHaveData && aHaveData.length > 0) {
        setMarkers(aHaveData);
    }

    map.addControl(drawControl);

    function setLatLongInArray(aLatLng) {
        var aData = [];
        if (aLatLng && aLatLng.length > 0) {
            for (var i = 0; i < aLatLng.length; i++) {
                aData.push({latitude: aLatLng[i].lat, longitude: aLatLng[i].lng})
            }
        }
        return aData;
    }

    function getLayerData(e) {
        var layerType = e.layerType;
        var toSend = {"request": "add_landmark", "user_id": $localStorage.preservedSelectedUser.user_id};
        toSend.location = setLatLongInArray(JSON.parse(JSON.stringify([e.layer._latlng])))[0];
        return toSend;
    }

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        $scope.landarkData = getLayerData(event);

        var parentDiv = document.createElement("div");
        parentDiv.innerHTML = htmlcontent;
        var htmlElement = parentDiv.firstChild;

        var setValue = htmlElement.getElementsByClassName('myMark');
        /*getAddressByLatLng($scope.landarkData.location.latitude, $scope.landarkData.location.longitude,function (address) {
            setValue.geoname.value = address;
        })*/
        if ($scope.selectedData) {
            setValue.geoname.value = $scope.selectedData.formatted_address;
            setValue.Latitude.value = $scope.landarkData.location.latitude;
            setValue.Longitude.value = $scope.landarkData.location.longitude;
        } else {

            setValue.Latitude.value = layer._latlng.lat;
            setValue.Longitude.value = layer._latlng.lng;
            getAddressByLatLng(layer._latlng.lat, layer._latlng.lng, function (address) {
                setValue.geoname.value = address;
            })
        }


        getBtn = htmlElement.getElementsByClassName('btn');
        getBtn.saveMark.addEventListener('click', function (e) {
            var getValue = htmlElement.getElementsByClassName('myMark');
            if (getValue.geoname.value) {
                $scope.landarkData.address = getValue.geoname.value
            }
            if (getValue.name.value) {
                $scope.landarkData.name = getValue.name.value
                saveLandmark()
            }
        });
        popup = L.popup().setContent(htmlElement);
        layer.bindPopup(popup);
        //layer.bindPopup(content);
        drawnItems.addLayer(layer);
        layer.openPopup();
    });

    //$scope.afterOne == false;

    function renderMap(data) {
        $scope.selectedData = data;
        map.setView([data.lat, data.lon], 17);

        //var reg = ($scope.dataGeoCreate && $scope.dataGeoCreate.reg_no)?$scope.dataGeoCreate.reg_no:undefined
        var title = "";
        marker = L.marker([data.lat, data.lon]).bindTooltip(title, {permanent: false, direction: 'top'}).openTooltip();
        marker.addTo(map);
    }

    function mapMyIndiaResponse(responseData) {
        var result = [];
        if (responseData && responseData.results && responseData.results.length > 0) {
            for (var i = 0; i < responseData.results.length; i++) {
                responseData.results[i].display_name = responseData.results[i].formatted_address;
                if (responseData.results[i].lat) {
                    responseData.results[i].lat = parseFloat(responseData.results[i].lat);
                }
                if (responseData.results[i].lng) {
                    responseData.results[i].lon = parseFloat(responseData.results[i].lng);
                }
                result.push(responseData.results[i])
            }
        }
        return result;
    }

    $scope.getCityByPlaceId = function (query) {
        if (query && query.toString().length > 2) {
            var oUrl = $scope.aLocationUrl[2];
            var locationUrl = oUrl.url + query;
            $http({
                method: "POST",
                url: locationUrl
            }).then(function (response) {
                if (oUrl.type === "mapMyIndiaGeoCode") {
                    var res = mapMyIndiaResponse(response.data);
                    if (res[0] && res[0].lat && res[0].lon) {
                        renderMap(res[0])
                    }
                }
            }, function (response) {

            });
        }
    };

    $scope.cities = function (query) {
        if (query && query.toString().length > 2) {
            var oUrl = $scope.aLocationUrl[2];
            var locationUrl = oUrl.url + query;
            return $http({
                method: "POST",
                url: locationUrl
            }).then(function (response) {
                if (oUrl.type === "mapMyIndiaGeoCode") {
                    $scope.aLocations = mapMyIndiaResponse(response.data);
                    return limitToFilter($scope.aLocations);
                    /*if($scope.afterOne == true){
                        $scope.onSelect($scope.aLocations[0], $scope.aLocations[0], $scope.aLocations[0].formatted_address);
                    }*/
                } else {
                    $scope.aLocations = response.data;
                }
                //return limitToFilter(response.data, 15);
            });
        } else if (query == '') {
            $scope.aLocations = [];
        }
    };

    function searchLocation(query) {
        if (query && query.toString().length > 2) {
            var oUrl = $scope.aLocationUrl[1];
            var q = {
                // locat	ion: map.getCenter().lat+","+map.getCenter().lng,
                // zoom: map.getZoom(),
                query: query
            };
            var locationUrl = oUrl.url + otherUtils.prepareQeury(q);
            return $http({
                method: "get",
                url: locationUrl
            }).then(function (response) {
                $scope.aLocations = response.data.suggestedLocations.map(function (suggestion) {
                    suggestion.formattedAddress = suggestion.placeName + ((suggestion.placeAddress && suggestion.placeAddress != "") ? ', ' + suggestion.placeAddress : '');
                    return suggestion;
                });
            });
        } else if (query === '') {
            $scope.aLocations = [];
        }
    }

    $scope.onSelect = function ($item, $model, $label) {

        if ($item.latitude && $item.longitude) {
            renderMap($item);
            getAddress($item.latitude, $item.longitude, true);
        } else {
            $scope.getCityByPlaceId($item.place_id)
        }

    };

    $scope.getAddress = function(lat, lng){

        $scope.lat = lat;
        $scope.lng = lng;
        if (!lat || !lng) {
            return;
        }

        var searchValue = {lat:lat,lon:lng};
        gpsAnalyticService.getAddress(searchValue,success,failure);

        function success(response){
            console.log(response);
            $scope.address = response.display_name;
            $scope.oLandmark.address = response.display_name;
        }
        function failure(response){
            console.log(response);
        }

    }

    $scope.landmark = {};

    $scope.landmarkByLatLng = function () {
        if ($scope.landmark.lat && $scope.landmark.lon) {
            renderMap($scope.landmark);
        }
    };

    function getAddressByLatLng(lat, lng, callback) {
        if(!lat || !lng){
            return;
        }

        var searchValue = {lat:lat,lon:lng};
        gpsAnalyticService.getAddress(searchValue,success,failure);

        function success(response){
            console.log(response);
            callback(response.display_name);
        }
        function failure(response){
            console.log(response);
            callback(0)
        }
    }

    $rootScope.addLandDataCallback = function (response) {
        var oRes = JSON.parse(response);
        if (oRes.status === 'OK') {
            map.closePopup();
            var msg = oRes.message;
            swal("Saved", msg, "success");
        }
    };

    function saveLandmark() {
        LoginService.addGeozone($scope.landarkData, $rootScope.addLandDataCallback);
    }

    //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
    $scope.landmarkList = function () {
        $rootScope.redirect('/#!/main/landmark');
    };
});

materialAdmin.controller("editLandmarkCtrl", function (
    $rootScope,
    $scope,
    $state,
    $window,
    $uibModal,
    $uibModalInstance,
    GoogleMapService
) {
    $rootScope.showSideBar = false;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectedLandmark = {};
    $scope.selectedLandmark.name = $rootScope.selectedLandmarkData.name;
    $scope.selectedLandmark.address = $rootScope.selectedLandmarkData.address;

    //******* Start edit landmark function *************/
    $scope.editLandmarkF = function (selectedLandmark) {
        function updateRes(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                    $state.reload();
                }
                else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
            $uibModalInstance.dismiss('cancel');
        }


        if (selectedLandmark) {
            selectedLandmark.request = "update_landmark";
            selectedLandmark.created_at = $rootScope.selectedLandmarkData.created_at;
            selectedLandmark.user_id = $rootScope.selectedLandmarkData.user_id;
            GoogleMapService.editLandmarkService(selectedLandmark, updateRes);
        }
    };
    //******* end edit landmark function *************//

});

function landmarkUpsertController(
    $rootScope,
    $http,
    $scope,
    $timeout,
    $uibModalInstance,
    $localStorage,
    landmarkService,
    otherUtils,
    otherData,
    utils,
    gpsAnalyticService
) {

    let vm = this;
    vm.oLandmark = {}; //initialize with Empty Object
    vm.aCategory = ['bridge', 'pillar', 'station', 'turn', 'km post', 'signal', 'power','point & crossing', 'level crossing', 'overhead light','other'];
    // functions Identifiers
    vm.closeModal = closeModal;
    vm.onSelect = onSelect;
    vm.searchLocation = searchLocation;
    vm.submit = submit;
    vm.searchNearestLocation = searchNearestLocation;

    // MAP code ....
    vm.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
        {type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
        {type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
    ];

    // INIT functions
    (function init() {
        vm.oLandmark = {};
        vm.type = angular.copy(otherData.type);
        vm.showMap = angular.copy(otherData.showMap);
        if (vm.type === 'edit' || vm.type === 'view') {

            vm.oLandmark = angular.copy(otherData.aData);
            vm.lat = vm.oLandmark.location.latitude;
            vm.lng = vm.oLandmark.location.longitude;
            vm.map = {
                ready: function () {
                    if (vm.showMap)
                        addMarker(vm.oLandmark.location);
                }
            };
        }

        if (vm.type === 'add') {
            vm.oLandmark = angular.copy(otherData.aData);
            vm.lat = vm.oLandmark.lat;
            vm.lng = vm.oLandmark.lng;
            vm.oLandmark.address = vm.oLandmark.addr;
            // getAddress(vm.lat, vm.lng, true);
        }
        vm.oLandmark.selected_uid = $localStorage.preservedSelectedUser.user_id;
        vm.oLandmark.login_uid = $localStorage.user.user_id;
        vm.oLandmark.user_id = $localStorage.preservedSelectedUser.user_id;
    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function searchLocation(query) {
        if (query && query.toString().length > 2) {
            var oUrl = vm.aLocationUrl[1];
            var q = {
                // locat	ion: map.getCenter().lat+","+map.getCenter().lng,
                // zoom: map.getZoom(),
                query: query
            };
            var locationUrl = oUrl.url + otherUtils.prepareQeury(q);
            return $http({
                method: "get",
                url: locationUrl
            }).then(function (response) {
                vm.aLocations = response.data.suggestedLocations.map(function (suggestion) {
                    suggestion.formattedAddress = suggestion.placeName + ((suggestion.placeAddress && suggestion.placeAddress != "") ? ', ' + suggestion.placeAddress : '');
                    return suggestion;
                });
            });
        } else if (query === '') {
            vm.aLocations = [];
        }
    }

    function onSelect($item, $model, $label) {
        addMarker($item);
        getAddress($item.latitude, $item.longitude, true);
    }

    function addMarker($item) {

        vm.map.marker.removeAll();
        vm.map.marker.add({
            position: {
                lat: $item.latitude,
                lng: $item.longitude
            },

            draggable: false,
            on: {
                dragend: function (marker) {
                    //getAddress(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }, {
            cluster: false,
            position: true,
            zoom: 14
        });
    }

    function addMarkerUpsert($item) {

        //vm.map.marker.removeAll();
        vm.map.marker.add({
            position: {
                lat: $item.latitude,
                lng: $item.longitude
            },
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            draggable: true,
            on: {
                dragend: function (marker) {
                    getAddress(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }, {
            cluster: false,
            position: true,
            zoom: 14
        });
    }


    function getAddress(lat,lng){

        vm.lat = lat;
        vm.lng = lng;
        if(!lat || !lng){
            return;
        }

        var searchValue = {lat:lat,lon:lng};
        gpsAnalyticService.getAddress(searchValue,success,failure);

        function success(response){
            console.log(response);
            vm.address = response.display_name;
            vm.oLandmark.address = response.display_name;
        }
        function failure(response){
            console.log(response);
        }

    }


    function searchNearestLocation() {
        let requestObj = {};
        if (!vm.radius) {
            swal('Error', 'Please enter radius.', 'error');
            return;
        }

        if (!vm.lat || !vm.lng) {
            swal('Error', 'Lat and Long should not be blank', 'error');
            return;
        }

        var location = {
            latitude: vm.lat,
            longitude: vm.lng
        };

        requestObj.location = location;
        requestObj.radius = vm.radius;

        gpsSocketService.getLandmark(requestObj, onNRSuccess, err => {
            console.log(err)
    });

        // Handle success response
        function onNRSuccess(response) {
            if (response && response.data) {
                let dataRes = response.data;

                for (var i = 0; i < dataRes.length; i++) {
                    addMarkerUpsert(dataRes[i].location);
                }

                /*vm.map = {
                    ready: function(){
                        for (var i = 0; i < dataRes.length; i++) {
                            addMarkerUpsert(dataRes[0].location);
                        }
                    }
                };*/
            }
        }
    }

    // landmark submit
    function submit(formData) {
        if (formData.$valid) {

            var requestObj = {
                ...vm.oLandmark
        }
            ;
            if (vm.lat) {
                requestObj.location = requestObj.location || {};
                requestObj.location.latitude = vm.lat;
            }

            if (vm.lng)
                requestObj.location.longitude = vm.lng;

            if (vm.type == 'edit') {
                landmarkService.updateLandmark(requestObj, success, failure);

            } else if (vm.type == 'add') {
                landmarkService.addLandmark(requestObj, success, failure);
            }

            function success(response) {
                console.log(response);
                swal(response.message);
                $uibModalInstance.dismiss();
            }

            function failure(response) {
                swal(response.message);
                console.log(response);
            }

        } else {
            if (formData.$error.required)
                swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
            else
                swal('Form Error!', 'Form is not Valid', 'error');
        }
    }

}

function landmarkExlViewController(
    $scope,
    $uibModalInstance,
    $localStorage,
    landmarkService,
    otherUtils,
    utils
) {

    // functions Identifiers
    $scope.closeModal = closeModal;
    $scope.viewData = viewData;
    $scope.ProcessExcel = ProcessExcel;
    $scope.submit = submit;


    // INIT functions
    (function init() {
        $scope.header = ['NAME', 'ADDRESS', 'LATITUDE', 'LONGITUDE', 'CATEGORY', 'CATEGORY DETAILS', 'KM CHAINING', 'DISTANCE'];
        $scope.aCategory = ['bridge', 'pillar', 'station', 'turn', 'km post', 'signal', 'power','point & crossing', 'level crossing', 'overhead light','other'];
    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function viewData(files, file, newFiles, duplicateFiles, invalidFiles, event) {
        $scope.SelectedFile = files;
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test($scope.SelectedFile.name.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        $scope.ProcessExcel(e.target.result);
                    };
                    reader.readAsBinaryString($scope.SelectedFile);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        ProcessExcel(data);
                    };
                    reader.readAsArrayBuffer($scope.SelectedFile);
                }
            } else {
                return swal('Error', "This browser does not support HTML5.", 'error');
            }
        } else {
            return swal('Error', "Please upload a valid Excel file. Excel Name should be in bw a-z, A-Z, 0-9 No special characters allowed", 'error');
        }
    };

    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
        var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
    
        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
    }

    function ProcessExcel(data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

        //Display the data from Excel file in Table.
        var firstRow = excelRows[0];

        for (var [key, val] of Object.entries(firstRow)) {
            if($scope.header.indexOf(key) === -1)
            return swal('Error', `Invalid Excel Header ${key}`, 'error');
            }

        $scope.landmarks = [];
        $scope.$apply(function () {
            for (var i = 0; i < excelRows.length; i++) {
                if(!excelRows[i].CATEGORY && excelRows[i]['CATEGORY DETAILS']){
                    for (var j = 0; j < $scope.aCategory.length; j++) {
                        switch ($scope.aCategory[j]) {
                            case 'pillar':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('MAST')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                            case 'turn':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('CURVE')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                            case 'level crossing':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('GRADIENT')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('SWITCH EXPANSION')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                            case 'power':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('EMERGENCY SOCKET')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                            case 'overhead light':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('ELECTRICAL CROSSING')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                                case 'km post':
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }else if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf('KILOMETER')  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                                break;
                            default:{
                                if (excelRows[i]['CATEGORY DETAILS'].toUpperCase().indexOf($scope.aCategory[j].toUpperCase())  >=0){
                                    excelRows[i].CATEGORY =  $scope.aCategory[j];
                                    j = $scope.aCategory.length;
                                }
                            }
                        }
                    }
                }
                if(!excelRows[i].CATEGORY && excelRows[i]['CATEGORY DETAILS']){
                    excelRows[i].CATEGORY = 'other';
                }
                if(excelRows[i].LATITUDE && excelRows[i].LONGITUDE && excelRows[i].LATITUDE.includes('°') && excelRows[i].LONGITUDE.includes('°')){
                    // trim spaces from front and back in latitiude and longitude
                    excelRows[i].LATITUDE = excelRows[i].LATITUDE.trim();
                    excelRows[i].LONGITUDE = excelRows[i].LONGITUDE.trim();
                    let parts = excelRows[i].LATITUDE.split(/[^\d\w\.]+/);// latitude
                    excelRows[i].LATITUDE = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
                    parts = excelRows[i].LONGITUDE.split(/[^\d\w\.]+/);// longitude
                    excelRows[i].LONGITUDE = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
                }
                var req = {
                    name: excelRows[i].NAME,
                    category: excelRows[i].CATEGORY,
                    address: excelRows[i].ADDRESS,
                    km: excelRows[i]['KM CHAINING'],
                    dist: excelRows[i].DISTANCE,
                    catDet: excelRows[i]['CATEGORY DETAILS'],
                    location: {latitude: excelRows[i].LATITUDE, longitude: excelRows[i].LONGITUDE}
                };
                $scope.landmarks.push(req);
            }
            // $scope.header.indexOf
            $scope.aLandmarkList = excelRows;

        });
    };

    // landmark Exl submit
    function submit(formData) {
        if (!($scope.landmarks && $scope.landmarks.length))
            return swal('Error', 'add data for upload', 'error');

        var request = {};
        request.selected_uid = $localStorage.preservedSelectedUser.user_id;
        request.login_uid = $localStorage.user.user_id;
        request.user_id = $localStorage.preservedSelectedUser.user_id;
        request.landmarks = $scope.landmarks;

        landmarkService.uploadBulk(request, success, failures);

        // Handle success response
        function success(response) {
            console.log(response);
            if(response.status == 'OK'){
                swal('Success', response.message, 'success');
                $uibModalInstance.dismiss();
            }else if(response.status == 'ERROR'){
                swal('Error', response.message + ' in landmark ' + response.data[0].name , 'error');
            }
        }


        // Handle failures response
        function failures(response) {
            console.log(response);
            if(response.status == 'ERROR'){
                swal('Error', response.message + ' in landmark ' + response.data[0].name , 'error');
            }else {
                swal('Error', response.message, 'error');
            }
        }

    }

}
