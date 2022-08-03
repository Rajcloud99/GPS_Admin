materialAdmin.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise("login");

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('sharedLocation', {
            url: '/sharedLocation/:device_id',
            templateUrl: 'views/sharedLocation.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('sharedLocations', {
            url: '/sharedLocations',
            templateUrl: 'views/shareLocations.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('sharedPlayback', {
            url: '/sharedPlayback',
            templateUrl: 'views/sharedPlayback.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        /*.state ('Map1', {
            url: '/map1',
            templateUrl: 'views/map1.html',
            data: {
              pageTitle: 'GPS Gaadi - Map'
            }
        })*/
        .state('main', {
            url: '/main',
            templateUrl: 'views/main/main.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.map', {
            url: '/map',
            templateUrl: 'views/main/map.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.ListView', {
            url: '/ListView',
            templateUrl: 'views/main/ListView.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.reportBasic', {
            url: '/reportBasic',
            templateUrl: 'views/main/reportBasic.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.profile', {
            url: '/profile',
            templateUrl: 'views/user-profile/user-profile.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.passChange', {
            url: '/changePassword',
            templateUrl: 'views/user-profile/changePassword.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.complaints', {
            url: '/complaints',
            templateUrl: 'views/user-profile/complaints.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('mains', {
            url: '/mains',
            templateUrl: 'views/main/mains.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('mains.mapZoom', {
            url: '/mapZoom/:device_id',
            templateUrl: 'views/main/singleMap.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.userCreate', {
            url: '/userCreate',
            templateUrl: 'views/user/userCreate.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.registerGroup', {
            url: '/registerGroup',
            templateUrl: 'views/user/registerGroup.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.registerParent', {
            url: '/registerParent',
            templateUrl: 'views/user/registerParent.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.deviceRegister', {
            url: '/deviceRegister',
            templateUrl: 'views/device/deviceRegister.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.addDevice', {
            url: '/addDevice',
            templateUrl: 'views/device/addDevice.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.user', {
            url: '/user',
            templateUrl: 'views/user/user.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.basicReports', {
            url: '/basicReports',
            templateUrl: 'views/reports/basicReports.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.milage2Reports', {
            url: '/kmReports',
            templateUrl: 'views/reports/milage2report.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            params: {
                data: null
            }
        })
        .state('main.basicReportsData', {
            url: '/basicReportsData',
            templateUrl: 'views/reports/basicReportsData.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.geozones', {
            url: '/geozones',
            templateUrl: 'views/geozones/geozones.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.showGeozone', {
            url: '/showGeozone',
            templateUrl: 'views/geozones/showGeozone.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.geozonesList', {
            url: '/geozonesList',
            templateUrl: 'views/geozones/geozonesList.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.landmark', {
            url: '/landmark',
            templateUrl: 'views/landmark/landmark.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.createLandmark', {
            url: '/createLandmark',
            templateUrl: 'views/landmark/createLandmark.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.alertList', {
            url: '/alertList',
            templateUrl: 'views/alert/alertList.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.createAlert', {
            url: '/createAlert',
            templateUrl: 'views/alert/createAlert.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.alertNotification', {
            url: '/alertNotification',
            templateUrl: 'views/alert/alertNotification.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.geofenceNotification', {
            url: '/geofenceNotification',
            templateUrl: 'views/alert/geofenceNotification.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.otherNotification', {
            url: '/otherNotification',
            templateUrl: 'views/alert/otherNotification.html'
        })

        .state('main.analytic', {
            url: '/Analytic',
            templateUrl: 'views/Analytics/gpsAnalytics.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            controller: 'gpsAnalyticController',
            controllerAs: 'vm'
        })
        .state('main.beat', {
            url: '/beatMaster',
            templateUrl: 'views/beat/beat.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            controller: 'beatMasterCtrl',
        })
        .state('main.tripDetails', {
            url: '/tripDetails',
            templateUrl: 'views/tripSheet/tripDetails.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            controller: 'tripSheetController',
            controllerAs: 'vm'
        })
        .state('main.oderDetails', {
            url: '/oderDetails',
            templateUrl: 'views/tripSheet/oderDetails.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            controller: 'tripSheetController',
            controllerAs: 'vm'
        })
        .state('main.tripPlayback', {
            url: '/vehicleDetail',
            templateUrl: 'views/tripSheet/vehicleTrack.html',
            data: {
                pageTitle: 'GPS Gaadi'
            },
            params: {
                data: null
            },
            controller: 'vehicleTrackController',
            controllerAs: 'vmvVm'
        })
        .state('main.overSpeedNotification', {
            url: '/overSpeedNotification',
            templateUrl: 'views/alert/overSpeedNotification.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.playBack', {
            url: '/playBack',
            templateUrl: 'views/playback/playBack.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.playPosition', {
            url: '/playPosition',
            templateUrl: 'views/playback/playPosition.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.tripList', {
            url: '/tripList',
            templateUrl: 'views/trip/tripList.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.createTrip', {
            url: '/createTrip',
            templateUrl: 'views/trip/create-Trip.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.tripDetail', {
            url: '/tripDetail/:trip_id',
            templateUrl: 'views/trip/tripDetail.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
        .state('main.trackTrip', {
            url: '/trackTrip',
            templateUrl: 'views/trip/trackTrip.html',
            data: {
                pageTitle: 'GPS Gaadi'
            }
        })
});
