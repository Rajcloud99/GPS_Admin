materialAdmin
    .controller('gpsAnalyticController', gpsAnalyticController);

gpsAnalyticController.$inject = [
    "$localStorage",
    "$rootScope",
    "$scope",
    "$timeout",
    "DatePicker",
    "dateUtils",
    "gpsAnalyticService"
];

function gpsAnalyticController(
    $localStorage,
    $rootScope,
    $scope,
    $timeout,
    DatePicker,
    dateUtils,
    gpsAnalyticService
) {
    let vm = this;
    vm.homePage = homePage;
    vm.getAlert = getAlert;
    vm.onVehicleSelect = onVehicleSelect;
    vm.removeVehicle = removeVehicle;
    vm.downloadList = downloadList;

    (function init() {
        $rootScope.showSideBar = false;
        vm.showGraph = true;
        vm.oGraphKpi = {
            name: 'Exception Report',
            graphType: [{
                type: "pieChart",
                xAxisKey: function (e) {
                    return e.code;
                },
                yAxisKey: function (e) {
                    return e.count;
                }
            }],
            fullscreen: false
        };
        vm.graphData = [];
        vm.filter = {type: ''};
        vm.filter.group = 'exception';
        vm.DatePicker = angular.copy(DatePicker);
        vm.oReportType = {
            '': 'All Exception',
            'over_speed': 'Overspeed Alert',
            'sos': 'Panic Alert',
            // 'power_cut': 'Power cut',
            // 'tempering': 'Tempering',
            'hb': 'Harsh Braking',
            'ha': 'Rapid Acceleration',
            // 'rt': 'Harsh Cornering',
            'fw': 'Free Wheeling',
            'nd': 'Night Drive',
            'cd': 'Continuous Driving',
            'idle':'Excessive Idle',
            'tl':'Tilt'
        };
        vm.oGroup = {
            'exception': 'Exception',
            'day': 'Day Wise',
            'month': 'Month Wise',
        };
        vm.aVehicle = $localStorage.user.devices;
        vm.aDriver = [...$localStorage.user.devices.reduce((set, obj) => {
            if(obj.driver_name){
                set.add(obj.driver_name.toLowerCase());
            }
            if(obj.driver_name2){
                set.add(obj.driver_name2.toLowerCase());
            }
            return set;
        }, new Set())];
    })();

    // Actual Function

    function homePage() {
        $rootScope.redirect('/#!/main/user');
    }

    function getAlert() {
        let request = prepareFilter();
        gpsAnalyticService.getAlertByGroup(request, function (response) {
            console.log(response.data);
            response.data.forEach(o => {
                o.code = vm.oReportType[o.code];
            });
            updateKpi(response.data);
        });
    }

    function onVehicleSelect(item) {
        vm.aVehicleData = vm.aVehicleData || [];
        vm.aVehicleData.push(item);
        vm.filter.vehicle = '';
    }
    function removeVehicle(select, index){
        vm.aVehicleData.splice(index, 1);
    }

    vm.onEventSelect = function(item) {
        vm.aEventCollection = vm.aEventCollection || [];
        vm.aEventCollection.push(item);
    };
    vm.removeEvent = function(index){
        vm.aEventCollection.splice(index, 1);
    };

    function updateKpi(data) {
        switch (vm.filter.group) {
            case 'day':
            case 'month':
                vm.oGraphKpi = {
                    name: 'Exception Report',
                    graphType: [{
                        type: "multiBarChart",
                        stacked: true,
                    }],
                    fullscreen: false
                };

                let dateWise = {};
                let aDate = [];
                data.forEach(oData => {
                    oData.aCode.forEach(oCode => {
                        dateWise[oCode.code] = dateWise[oCode.code] || {
                            key: vm.oReportType[oCode.code],
                            values: []
                        };
                        dateWise[oCode.code].values.push({
                            x: oData.date,
                            y: oCode.count
                        });
                    });
                    aDate.push(oData.date);
                });
                vm.graphData = Object.values(dateWise);
                vm.graphData.forEach(o => {
                    aDate.forEach((date, index) => {
                        if(!o.values.find(oVal => oVal.x === date)){
                            o.values.splice(index, 0, {
                                x: date,
                                y: 0
                            });
                        }
                    });
                });

                break;
            case 'exception':
            default :
                vm.oGraphKpi = {
                    name: 'Exception Report',
                    graphType: [{
                        type: "pieChart",
                        xAxisKey: function (e) {
                            return e.code;
                        },
                        yAxisKey: function (e) {
                            return e.count;
                        }
                    }],
                    fullscreen: false
                };
                vm.graphData = data;
        }

        vm.graphApi && vm.graphApi.refresh();
        toggleGraph();
    }

    function toggleGraph() {
        vm.showGraph = false;
        $timeout(function () {
            vm.showGraph = true;
        })
    }

    function prepareFilter(download) {
        let oFilter = {
            code: Object.keys(vm.oReportType)
        };

        if (vm.aVehicleData && vm.aVehicleData.length) {
            oFilter.imei = [];
            vm.aVehicleData.map((v) => {
                oFilter.imei.push(Number(v.imei));
            });
        }

        if (vm.aEventCollection && vm.aEventCollection.length) {
            oFilter.code = [];
            vm.aEventCollection.map((v) => {
                oFilter.code.push(v);
            });
        }

        // if(vm.filter.type)
        //     oFilter.code = vm.filter.type;

        if (vm.filter.from_date) {
            oFilter.from = dateUtils.setHours(vm.filter.from_date, 0, 0, 0).toISOString();
        }
        if (vm.filter.to_date) {
            oFilter.to = dateUtils.setHours(vm.filter.to_date, 23, 59, 59).toISOString();
        }

        // if(vm.filter.from_date)
        //     oFilter.from = vm.filter.from_date;
        //
        // if(vm.filter.to_date)
        //     oFilter.to = vm.filter.to_date;

        if(vm.filter.driver)
            oFilter.driver = vm.filter.driver;

        if(vm.filter.group)
            oFilter.groupBy = vm.filter.group;

        oFilter.login_uid = $localStorage.user.user_id;
        oFilter.user_id = $localStorage.user.user_id;

        if(download)
            oFilter.download = true;

        return oFilter;
    }

    function downloadList(){

        if (!(vm.filter.from_date && vm.filter.to_date)) {
            return swal('Warning', 'From and To date required', 'warning');
        }

        var oFilter = prepareFilter();
        oFilter.download = true;
        oFilter.login_uid = $localStorage.user.user_id;
        oFilter.user_id = $localStorage.user.user_id;
        gpsAnalyticService.alertReport(oFilter, onSuccess, onFailure);

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
}
