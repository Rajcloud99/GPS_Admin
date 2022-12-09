angular.module('HashBangURLs', []).config(['$locationProvider', function ($location) {
    $location.hashPrefix('!');
}]);
var secretEmptyKey = '[$empty$]'
var materialAdmin = angular.module('materialAdmin', ['angular.filter', 'ngMaterial', 'angularMoment', 'ngAnimate', 'ngAria', 'ngSanitize', 'ngRoute', 'HashBangURLs', 'ngResource', 'ui.router', 'ui.bootstrap', 'ngCookies', 'angular-loading-bar', 'ngTable', 'ngStorage', 'ngMessages', 'angularResizable', 'infinite-scroll', 'ui.tree', 'ngMaterialDatePicker', 'mc.resizer', 'rzModule', 'ui.bootstrap.datetimepicker', 'FBAngular', 'nvd3']);

materialAdmin.run(function (amMoment) {
    amMoment.changeLocale('us');
});
materialAdmin.controller(
    'materialadminCtrl', ['socketio', '$timeout', '$state', '$uibModal', '$scope', '$rootScope', '$location', 'utils', '$anchorScroll', '$localStorage', '$sessionStorage', 'GoogleMapService', '$http', '$filter',
        function (socketio, $timeout, $state, $uibModal, $scope, $rootScope, $location, utils, $anchorScroll, $localStorage, $sessionStorage, GoogleMapService, $http, $filter) {

            $rootScope.redirect = function (path) {
                window.location.href = path;
            };
            $scope.setClientInfo = function () {
                $rootScope.distributerInfo = $localStorage.distributerInfo;
                /*$rootScope.logoUrl = 'http://localhost/img/gps-logo.jpg';
                $rootScope.rootTitle = 'GpsGaadi.com :: Track your vehicle with us!!!';
                $rootScope.copyRight = 'Umbrella Protection Systems Pvt. Ltd.';
                $rootScope.termsLink = '#2196F3';
                $rootScope.headBGcss = '#FF9800';
                $rootScope.footBGcss = '#009688';*/
            }

            var oConfigBranding = getAppConfig();
            var trucku_url = oConfigBranding.trucku_url;

            // Simple GET request example:
            $http({
                method: 'GET',
                //url: 'http://trucku.in:8081/api/user/dealerinfo?host=tracking.gpsgaadi.com'
                url: trucku_url + 'api/user/dealerinfo?host=' + window.location.host

            }).then(function successCallback(response) {
                console.log(response);
                $localStorage.distributerInfo = response.data.data;
            }, function errorCallback(response) {
                console.log(response);
            });

            $rootScope.scroll = function (id) {
                $location.hash(id);
                $anchorScroll();
            };

            $rootScope.reconnectDiv = false;
            // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
            this.sidebarToggle = {
                left: false,
                right: false
            }

            // By default template has a boxed layout
            localStorage.setItem('ma-layout-status', 1);
            this.layoutType = localStorage.getItem('ma-layout-status');

            // For Mainmenu Active Class
            this.$state = $state;

            function logoutSucess() {
                $localStorage.$reset();
                $sessionStorage.$reset();
                $rootScope.redirect('/#!/login');
            }

            this.logout = function () {
                //HTTPConnection.post(URL.LOGOUT, {'Authorization':$sessionStorage.token}, logoutSucess);
            }

            //Close sidebar on click
            this.sidebarStat = function (event) {
                if (!angular.element(event.target).parent().hasClass(
                    'active')) {
                    this.sidebarToggle.left = false;
                }
            }

            //Listview Search (Check listview pages)
            this.listviewSearchStat = false;

            this.lvSearch = function () {
                this.listviewSearchStat = true;
            }

            //Listview menu toggle in small screens
            this.lvMenuStat = false;

            //Blog
            this.wallCommenting = [];

            this.wallImage = false;
            this.wallVideo = false;
            this.wallLink = false;


            /*****************end --- When open new tab******************/
            //on route change
            $scope.$watch('$viewContentLoaded', function () {
                $timeout(function () {
                    if ($location.absUrl().indexOf("main.html") > -1) {
                        if (!$sessionStorage.token) {
                            //$rootScope.redirect('index.html');
                        }
                    }
                }, 0);
            });

            // Modal instance
            var modalInstance;
            var modalInstances;
            // Utils for modal
            $rootScope.openModal = function (templatePath, scope) {
                if (modalInstance) {
                    // Do nothing when a popup is already open.
                } else {
                    modalInstance = $modal.open({
                        templateUrl: templatePath,
                        scope: scope
                    });
                    modalInstance.result.then(function () {
                    }, function () {
                        modalInstance = null;
                    });
                }
            }

            $rootScope.closeModal = function () {
                modalInstance.dismiss('cancel');
                modalInstance = null;
            }
            $rootScope.openModals = function (templatePath, scope) {
                if (modalInstances) {
                    // Do nothing when a popup is already open.
                } else {
                    modalInstances = $modal.open({
                        templateUrl: templatePath,
                        scope: scope
                    });
                }
            };
            $rootScope.closeModals = function () {
                modalInstances.dismiss('cancel');
                modalInstances = null;
            };

            //*** convert seconds into d h m *****//
            $rootScope.dur_calc = function (seconds) {
                if (seconds) {
                    var dur1 = seconds;
                    //var cur_date = new Date();
                    //var diff = Math.abs(cur_date.getTime() - new Date(pos_date).getTime());
                    var day = undefined, hour = undefined, seconds_string = '';
                    var totalMin = (dur1 / 60);
                    var min = totalMin % 60;
                    var totalHour = totalMin / 60;
                    if (totalHour > 24) {
                        hour = totalHour % 24;
                        day = totalHour / 24;
                    } else if (totalHour > 1) {
                        hour = totalHour;
                    }
                    if (day) {
                        seconds_string = parseInt(day) + 'd ';
                    }
                    if (hour) {
                        seconds_string = seconds_string + parseInt(hour) + 'h ';
                    }
                    seconds_string = seconds_string + parseInt(min) + 'm';
                    //console.log(seconds_string);
                }
                return seconds_string;
            };

            $scope.feedStopped = false;

            $rootScope.$watch(function () {
                    $scope.setClientInfo();
                    return $location.path();
                },
                function (a) {
                    $rootScope.currentPath = $location.path();
                    if ($rootScope.currentPath === '/main/map') {
                        console.log('device Live !!!');
                        $scope.feedStopped = false;
                    } else {
                        if ($scope.feedStopped === false) {
                            $rootScope.stopAllLiveFeed();
                        }

                    }
                    if ($localStorage && $localStorage.user) {
                        $rootScope.user = $localStorage.user;
                    }
                });

            if ($location.host() === 'localhost') {
                $rootScope.local = true;
            }

            $rootScope.showSideBar = true;

            //*********stop all device feed ***************//

            $rootScope.stopAllLiveFeed = function () {
                var stopFeed = {};
                if ($rootScope.aLiveFeedDevice && $rootScope.aLiveFeedDevice.length > 0) {
                    for (var i = 0; i < $rootScope.aLiveFeedDevice.length; i++) {
                        stopFeed.device_id = $rootScope.aLiveFeedDevice[i];
                        if ($rootScope.hmapAllDevices[stopFeed.device_id] && $rootScope.hmapAllDevices[stopFeed.device_id].device_type) {
                            stopFeed.device_type = $rootScope.hmapAllDevices[stopFeed.device_id].device_type;
                        }
                        if ($rootScope.selectedUser && $rootScope.selectedUser.user_id) {
                            stopFeed.user_id = $rootScope.selectedUser.user_id;
                            stopFeed.request = 'stop_feed';
                            GoogleMapService.stopFeed(stopFeed);
                        }
                    }
                    $scope.feedStopped = true;
                    console.log('stop all Live feed !!!');
                }
            };

            $rootScope.trackSheetDataEmit = false;
            $rootScope.getAllTracksheetData = function (selected_uid) {
                $rootScope.aTrSheetDevice = [];
                $localStorage.trSheet = {};
                var sendData = {};
                sendData.request = 'tracksheetData';
                sendData.selected_uid = selected_uid;
                $rootScope.trackSheetDataEmit = true;
                $rootScope.plottedMarkers = [];
                if ($rootScope.maps && $rootScope.maps.map) utils.addOnCluster($rootScope.maps, utils.createMarker({}), {});
                socketio.emit("message", sendData);
            };
            $rootScope.maps = {};
            $rootScope.plottedMarkers = [];
            $rootScope.storeTracksheetData = function (res) {
                res = JSON.parse(res);
                if (res.data) {
                    $rootScope.trackSheetResStore = res;
                    tracksheetDataArrange(res.data);
                    /////*****************************get all maps and add data on map****************/
                    $rootScope.plotMarkerOnMap(res.data); // create markers ion map with new data...

                    $rootScope.totalCount = res.total_count || 0;   // total count of devices show ...
                    $rootScope.getDeviceByUsers();
                    //$rootScope.aUpdateData = res.data;
                    if ($rootScope.aTrSheetDevice.length < res.total_count) {
                        $rootScope.aTrSheetDevice = $rootScope.aTrSheetDevice.concat(res.data)
                    }
                    if($rootScope.aTrSheetDevice.length == res.total_count){
                        $rootScope.enableRefresh=true;
                    }
                    
                    //$rootScope.aTrSheetDevice = ()?$rootScope.aTrSheetDevice.concat(res.data):;

                    /////////////////////////////////////////////////////////////////////////////////
                    //$rootScope.total_count = res.total_count;

                    $rootScope.showDevi = true;
                    //if($rootScope.drawMap){$rootScope.drawMap(res.data)};
                    $rootScope.aTrSheetDevice = $filter('orderBy')($rootScope.aTrSheetDevice, 's_status', false);
                    $rootScope.selectedUser.devices = $rootScope.aTrSheetDevice;
                    $rootScope.aCopyTrSheetDevice = $rootScope.aTrSheetDevice;
                    //$localStorage.trSheet.aTrSheetDeviceOnMap = $rootScope.aTrSheetDevice;
                    $rootScope.lastSync = new Date();
                    $scope.$apply(function () {
                        $rootScope.aTrSheetDevice;
                    });
                    if ($rootScope.loader) {
                        if (!(!$rootScope.trackSheetResStore || ($rootScope.trackSheetResStore.total_count !== ($localStorage && $localStorage.preservedSelectedUser && $localStorage.preservedSelectedUser.devices && $localStorage.preservedSelectedUser.devices.length)) || ($rootScope.trackSheetResStore.total_count !== ($localStorage && $localStorage.onLocalselectedUser && $localStorage.onLocalselectedUser.devices && $localStorage.onLocalselectedUser.devices.length)))) {
                            $rootScope.loader = false;
                            //$rootScope.setDeviceDatainTrip();
                        }
                    }

                }
            };
            $rootScope.getDeviceByUsers = function (){
                function subUser(oRes){
                    if(oRes){
                        if(oRes.status == 'OK'){
                            if(oRes && oRes.data){
                                $rootScope.aMyTrSheetDevice = oRes.data;
                            }
                        }
                        else if(oRes.status == 'ERROR'){
                            //swal(oRes.message, "", "error");
                        }
                    }
                };


                var sUsr = {};
                let selected_uid = $localStorage.preservedSelectedUser && $localStorage.preservedSelectedUser.user_id ||'';
                let login_uid = $rootScope.localStorageUser && $rootScope.localStorageUser.user_id ||'';
                sUsr.user_id = selected_uid;
                sUsr.selected_uid = selected_uid;
                sUsr.login_uid = login_uid;
                $rootScope.getDeviceByUser &&  $rootScope.getDeviceByUser(sUsr,subUser);
            }
            $rootScope.plotMarkerOnMap = function (data) {
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].lat && data[i].lng) {
                            if ($rootScope.maps.map) {
                                utils.addOnCluster($rootScope.maps, utils.createMarker(data[i]), data[i])
                                /*if ($rootScope.plottedMarkers.length > 1) {
                                    utils.prepareCluster($rootScope.maps, $rootScope.plottedMarkers);
                                }*/
                            }
                        }
                    }
                } else {
                    if($rootScope.map && $rootScope.map.clusterL )
                    $rootScope.maps.clusterL.Cluster._clusters = [];
                }
                if ($rootScope.maps && $rootScope.maps.clusterL) {
                    $rootScope.maps.clusterL.FitBounds();
                    //$rootScope.maps.map.fitBounds($rootScope.maps.map.getBounds());
                }
            };

            function tracksheetDataArrange(oRes) {
                if (oRes && oRes.length > 0) {
                    for (var j = 0; j < oRes.length; j++) {
                        oRes[j].NearLandMark = oRes[j].nearest_landmark && oRes[j].nearest_landmark.name && oRes[j].nearest_landmark.dist ? oRes[j].nearest_landmark.dist / 1000 + " KM from " + oRes[j].nearest_landmark.name : "NA";
                        oRes[j].ownershipPart = true;
                        oRes[j].ownershipOwn = true;
                        if (oRes[j].reg_no) {
                            oRes[j].reg_no = oRes[j].reg_no.replace(/ +/g, "");
                        }
                        if (oRes[j].location_time) {
                            oRes[j].stoppage_time = utils.calTimeDiffCurrentToLastInDHM(oRes[j].location_time);
                        }
                    }
                }
            }

            $rootScope.aOnlineDev = [];
            $rootScope.aOfflineDev = [];
            $rootScope.aRunningDev = [];
            $rootScope.aInactiveDev = [];

            $rootScope.prepareCountForMap = function (oRes) {
                $rootScope.showDevi = false;
            }

            var bindData = function () {
                //get devices on each refresh
                $rootScope.getAllTracksheetData($localStorage.preservedSelectedUser.user_id);
                $rootScope.selectedUser = $localStorage.preservedSelectedUser;
                $rootScope.localStorageUser = $localStorage.user;
                $rootScope.trackSheetResStore = {
                    count: {
                        running: 'fetching',
                        stopped: 'fetching',
                        offline: 'fetching',
                        inactive: 'fetching'
                    },
                    total_count: -1
                };
            };

            $rootScope.softRefreshPage = function () {
                ///if logged in
                $rootScope.enableRefresh=false;
                if ($localStorage.preservedSelectedUser) {
                    if (!socketio.socket()) {
                        var onSuccessConnect = function () {
                            if ($localStorage.preservedSelectedUser.role === 'user') {
                                $rootScope.redirect('/#!/main/ListView');
                            } else if ($localStorage.preservedSelectedUser.role === 'dealer') {
                                $rootScope.redirect('/#!/main/user');
                            } else if ($localStorage.preservedSelectedUser.role === 'admin') {
                                $rootScope.redirect('/#!/main/user');
                            } else {
                                $rootScope.redirect('/#!/main/ListView');
                            }
                            bindData();
                        };
                        socketio.connectSocket(onSuccessConnect);
                    } else {
                        bindData();
                    }
                } else {
                    $rootScope.redirect('/#!/login');
                }

            };
            $rootScope.softRefreshPage();
            $rootScope.preserveSelectedUser = function (node) {
                $localStorage.preservedSelectedUser = node;
                $rootScope.selectedUser = node;
            }
        }]);
