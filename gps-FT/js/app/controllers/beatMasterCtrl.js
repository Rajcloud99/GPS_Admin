materialAdmin
    .controller('beatMasterCtrl', beatMasterCtrl);

beatMasterCtrl.$inject = [
    "$localStorage",
    "$rootScope",
    "$scope",
    '$uibModal',
    "$timeout",
    "DatePicker",
    "dateUtils",
    "beatService"
];

function beatMasterCtrl(
    $localStorage,
    $rootScope,
    $scope,
    $uibModal,
    $timeout,
    DatePicker,
    dateUtils,
    beatService
) {
    // let vm = this;
    // vm.homePage = homePage;
    // vm.getAllBeat = getAllBeat;


    (function init() {
        $rootScope.showSideBar = false;
        $rootScope.states = {};
        $rootScope.states.actItm = 'beat';
        if (!$rootScope.selectedUser) {
            $rootScope.selectedUser = $localStorage.user;
        }
        $scope.aBeatList = [];
        $scope.aAllLand = [];
        $scope.aPageState = [
            [0, 0, 0, 0, 0]
        ];
        $scope.maxSize = 3;
        $scope.bigTotalItems = $scope.aBeatList.length;
        $scope.bigCurrentPage = 1;
        $scope.pages = [1];

        $scope.filter = {};
        $scope.aVehicle = $localStorage.user.devices;
        $scope.DatePicker = angular.copy(DatePicker);
    })();

    // Actual Function

    function homePage() {
        $rootScope.redirect('/#!/main/user');
    }

     $scope.getAllBeat = function() {
        let oFilter = prepareFilter();
        beatService.getBeat(oFilter, onSuccess, err => {
            console.log(err)
        });

        // Handle success response
        function onSuccess(response) {
            if (response && response.data && response.data.length) {
                res = response.data;
                $scope.aBeatList = res;
                if ($scope.aPageState.length <= $scope.bigCurrentPage) {
                    $scope.aPageState.push(res);
                    $scope.aAllLand.push(...res);
                    $scope.bigTotalItems = $scope.aAllLand.length + 2;
                }
            }else{
                $scope.aBeatList = [];
                $scope.aAllLand = [];
            }
        }
    }

    $scope.setPage = function (pageNo) {
        $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.bigCurrentPage);
        $scope.getAllBeat();
    };

    function prepareFilter(download) {
        let oFilter = {};


        if ($scope.filter.from) {
            oFilter.from = dateUtils.setHours($scope.filter.from, 0, 0, 0).toISOString();
        }
        if ($scope.filter.to) {
            oFilter.to = dateUtils.setHours($scope.filter.to, 23, 59, 59).toISOString();
        }

        if($scope.filter.vehicleNo)
            oFilter.reg_no = $scope.filter.vehicleNo.reg_no;

        oFilter.row_count = 8;
        oFilter.no_of_docs = 8;
        oFilter.skip = $scope.bigCurrentPage;
        oFilter.selected_uid = $localStorage.user.user_id;
        oFilter.login_uid = $localStorage.user.user_id;
        oFilter.user_id = $localStorage.user.user_id;
        oFilter.sort = { '_id' : -1 };

        return oFilter;
    }

    $scope.upsertBeat = function(type = 'add', aSelectedBeat){

        if (type == 'edit' || type == 'view') {
            if(Array.isArray(aSelectedBeat)){
                if(aSelectedBeat.length !== 1)
                    return swal('Warning', 'Please Select Single row', 'warning');
            }
            $scope.aSelectedBeat = Array.isArray(aSelectedBeat) ? aSelectedBeat[0] : aSelectedBeat;

        }else {
            $scope.aSelectedBeat = {};
        }

        $uibModal.open({
            templateUrl: 'views/beat/upsertBeat.html',
            controller: ['$rootScope', '$http', '$scope', '$timeout', '$uibModalInstance', '$localStorage', 'beatService', 'DatePicker', 'otherUtils', 'otherData', 'utils', beatUpsertController],
            controllerAs: 'btVm',
            resolve: {
                otherData: function () {
                    return {
                        aData: $scope.aSelectedBeat,
                        type: type,
                    };
                }
            },
        }).result.then(function (response) {
            console.log('close', response);
        }, function (data) {
            console.log('cancel', data);
        });
    }

    $scope.deleteBeat = function(aSelectedBeat) {

        if(!aSelectedBeat)
            return swal('Error', 'Please Select Single row', 'error');

        $scope.aSelectedBeat = Array.isArray(aSelectedBeat) ? aSelectedBeat[0] : aSelectedBeat;
        $scope.aSelectedBeat.selected_uid = $localStorage.user.user_id;
        $scope.aSelectedBeat.login_uid = $localStorage.user.user_id;
        $scope.aSelectedBeat.user_id = $localStorage.user.user_id;

        swal({
                title: 'Are you sure you want to delete selected Beat?',
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
                    beatService.removeBeat({
                        ...$scope.aSelectedBeat
                    }, onSuccess, onFailure);
                    function onSuccess(res) {
                        swal('Success', res.message, 'success');
                        $scope.getAllBeat();
                    }
                    function onFailure(err) {
                        swal('Error', err.message, 'error');
                    }
                }
            });
    };
}

function beatUpsertController(
    $rootScope,
    $http,
    $scope,
    $timeout,
    $uibModalInstance,
    $localStorage,
    beatService,
    DatePicker,
    otherUtils,
    otherData,
    utils,
) {

    let vm = this;

    // functions Identifiers
    vm.closeModal = closeModal;
    vm.onVehicleSelect = onVehicleSelect;
    vm.submit = submit;

    // INIT functions
    (function init() {
        vm.oBeat = {};
        vm.type = angular.copy(otherData.type);
        vm.DatePicker = angular.copy(DatePicker);
        if(vm.type === 'edit' || vm.type === 'view'){
            vm.oBeat  = angular.copy(otherData.aData);
        }
        vm.oBeat.startTime = new Date(vm.oBeat.startTime);
        vm.oBeat.endTime = new Date(vm.oBeat.endTime);
        vm.aVehicle = $localStorage.user.devices;
        vm.oBeat.selected_uid = $localStorage.user.user_id;
        vm.oBeat.login_uid = $localStorage.user.user_id;
        vm.oBeat.user_id = $localStorage.user.user_id;
    })();

    //Actual Function
    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function onVehicleSelect(vehicle) {
        vm.oBeat.reg_no = vehicle.reg_no;
        vm.oBeat.imei = vehicle.imei;
    }

    // beat submit
    function submit(formData) {
        if (formData.$valid) {

            var requestObj = {
                ...vm.oBeat
            };
            requestObj.selected_uid = $localStorage.user.user_id;
            requestObj.login_uid = $localStorage.user.user_id;
            requestObj.user_id = $localStorage.user.user_id;

            if (!requestObj.reg_no || !requestObj.beatSSE || !requestObj.beatSection || !requestObj.beatStart || !requestObj.beatEnd) {
                return swal('Error', 'Mandatory field is missing', 'error');
            }

            if (requestObj.reg_no && !requestObj.imei){
                return swal('Error', 'Please Select Valid Vehicle No', 'error');
            }

                if (vm.type == 'edit') {
                beatService.updateBeat(requestObj, success, failure);

            }else if (vm.type == 'add') {
                beatService.addBeat(requestObj, success, failure);
            }

            function success(response) {
                console.log(response);
                if(response.status === 'OK'){
                swal('Success', response.message, 'success');
                $uibModalInstance.dismiss();
                }else if(response.status === 'ERROR'){
                    swal('Error', response.message, 'error');
                    console.log(response);
                }
            }

            function failure(response) {
                swal('Error', response.message, 'error');
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
