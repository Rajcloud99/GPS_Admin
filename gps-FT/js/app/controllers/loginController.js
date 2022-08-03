materialAdmin.controller("userLogin", ['$rootScope', '$scope', '$localStorage', '$uibModal', '$timeout', '$cookies', 'LoginService', function ($rootScope, $scope, $localStorage, $uibModal, $timeout, $cookies, LoginService) {
    $rootScope.showSideBar = true;
    $rootScope.states = {};

    $rootScope.authenticationCallback = function (response) {
        var oRes = JSON.parse(response);
        if (oRes) {
            if ((oRes.status === 'OK') && (oRes.message === 'authenticated')) {
                oRes.data.id = 1;
                if (oRes.data.sub_users && oRes.data.sub_users.length) {
                    for (var t = 0; t < oRes.data.sub_users.length; t++) {
                        oRes.data.sub_users[t].id = '1.' + t;
                    }
                }
                $localStorage.user = oRes.data;
                $localStorage.preservedSelectedUser = $localStorage.user;
                if (oRes.data.role === 'user') {
                    $rootScope.redirect('/#!/main/ListView');
                    $rootScope.states.actItm = 'map_view';
                } else if (oRes.data.role === 'dealer') {
                    $rootScope.redirect('/#!/main/user');
                    $scope.states.actItm = 'userP';
                } else if (oRes.data.role === 'admin') {
                    $rootScope.redirect('/#!/main/user');
                    $scope.states.actItm = 'userP';
                } else {
                    $rootScope.redirect('/#!/main/ListView');
                }
                $scope.getDeviceInfo()//call GET Device Info service
                $scope.getDeviceConfig()//call GET Device configuration service
				$rootScope.selectedUser = $localStorage.user;
                $rootScope.getAllTracksheetData();
            }
            else if (oRes.status === 'ERROR') {
                swal(oRes.message, "", "error");
            }
        }
    };

    $scope.getDeviceInfo = function () {
        function deviceInfoResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $localStorage.deviceInfo = oRes.data;
                    console.log($localStorage.deviceInfo);
                }
                else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        }
        var postData = {};
        postData.request = 'get_device_info';
        postData.login_uid = $localStorage.user.user_id;
        postData.token = $localStorage.user.token;
        LoginService.getDeviceInfoService(postData, deviceInfoResponse);
    };
    $scope.getDeviceConfig = function () {
        function deviceConfResponse(response) {
            var oRes = JSON.parse(response);
            if (oRes) {
                if (oRes.status === 'OK') {
                    $localStorage.deviceConfig = oRes.data;
                    console.log($localStorage.deviceConfig);
                }
                else if (oRes.status === 'ERROR') {
                    swal(oRes.message, "", "error");
                }
            }
        }
        var devConfigData = {};
        devConfigData.request = 'get_device_config';
        devConfigData.login_uid = $localStorage.user.user_id;
        devConfigData.token = $localStorage.user.token;
        LoginService.getDeviceConfigService(devConfigData, deviceConfResponse);
    };

    $scope.getPass = function (userID) {
        if (userID && userID.length > 1) {
            var sample = $cookies.get(userID);
            if (sample) {
                $scope.user.password = sample;
            } else {
                $scope.user.password = '';
            }
        }
    };

    $scope.fPassword = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'template/forgot-password.html',
            controller: 'fPasswordCtrl',
        });
    }
}]);

materialAdmin.controller("sidebarCtrl", ['$rootScope', '$scope', '$localStorage', '$state', '$uibModal', '$timeout', 'LoginService', 'GoogleMapService', 'utils', function ($rootScope, $scope, $localStorage, $state, $uibModal, $timeout, LoginService, GoogleMapService, utils, socketio) {
    $rootScope.showSideBar = true;
    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.editItem = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('expandAll');
    };

    $scope.data = [$localStorage.user];
    //$scope.devices = $localStorage.user.devices;
    $timeout(function () {

        var rootScope = getRootNodesScope();

        rootScope.collapseAll();

        expandNode($localStorage.preservedSelectedUser.id);

    }, 100);

    function getRootNodesScope() {
        return angular.element(document.getElementById("tree-root")).scope().$nodesScope.childNodes()[0];
    }

    function expandNode(nodeId) {

        // We need to get the whole path to the node to open all the nodes on the path
        var parentScopes = getScopePath(nodeId);

        if (parentScopes && parentScopes.length > 0) {
            for (var i = 0; i < parentScopes.length; i++) {
                parentScopes[i].expand();
            }
        }

    }

    function getScopePath(nodeId) {
        return getScopePathIter(nodeId, getRootNodesScope(), []);
    }

    function getScopePathIter(nodeId, scope, parentScopeList) {

        if (!scope) return null;

        var newParentScopeList = parentScopeList.slice();
        newParentScopeList.push(scope);

        if (scope.$modelValue && scope.$modelValue.id === nodeId) return newParentScopeList;

        var foundScopesPath = null;
        var childNodes = scope.childNodes();

        if (childNodes && childNodes.length > 0) {
            for (var i = 0; foundScopesPath === null && i < childNodes.length; i++) {
                foundScopesPath = getScopePathIter(nodeId, childNodes[i], newParentScopeList);
            }
        }

        return foundScopesPath;
    }

    $scope.showDevi = true;
    var hmapAllDevices = {};

    $scope.showDevice = function (node) {
        //!*******fetch sub users start*******!//
        $rootScope.selectedUser.sub_users = $rootScope.selectedUser.sub_users || [];

        if($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.clusterL.Cluster && $rootScope.maps.clusterL.Cluster._markers && $rootScope.maps.clusterL.Cluster._markers.length>0) {
            $rootScope.maps.clusterL.Cluster._markers = [];  // remove all old markers when sidebar user clicked
        }/*else if($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.clusterL.Cluster && $rootScope.maps.clusterL.Cluster._markers && $rootScope.maps.clusterL.Cluster._markers.length===0){
            $rootScope.maps.clusterL.Cluster._clusters = [];
        }*/

        $rootScope.getAllTracksheetData(node.user_id);   // get new sub user device and information

        if ($rootScope.selectedUser.sub_users && $rootScope.selectedUser.sub_users.length < 1) {
            function subUserResponse(response) {
                var oRes = JSON.parse(response);
                if (oRes) {
                    if (oRes.status === 'OK') {
                        if (oRes.data.sub_users && oRes.data.sub_users.length > 0) {
                            for (var t = 0; t < oRes.data.sub_users.length; t++) {
                                oRes.data.sub_users[t].id = node.id + '.' + t;
                            }
                        }
                        $scope.$apply(function () {
                            node.sub_users = oRes.data.sub_users;
                        });
                    }
                    else if (oRes.status === 'ERROR') {
                        //swal(oRes.message, "", "error");
                    }
                }
            }
            var sUsr = {};
            sUsr.user_id = $localStorage.user.user_id;
            sUsr.request = 'sub_users';
            sUsr.sub_user = node.user_id;
            LoginService.getSubUser(sUsr, subUserResponse);
        }

    };
    $scope.states = {};
    if ($rootScope.selectedUser && $rootScope.selectedUser.user_id) {
        $scope.states.activeItem = $rootScope.selectedUser.user_id;
    } else {
        $scope.states.activeItem = $localStorage.user.user_id;
        $rootScope.selectedUser = $localStorage.user;
    }

    $scope.stat2 = {};
    $scope.stat2.activeItem = '0000000000000';

    $scope.commands = function (device) {
        if (device.status !== 'inactive') {
            $rootScope.commDevice = device;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/command/command-pop.html',
                controller: 'commandCtrl'
            });
        } else {
            swal('This Device is Inactive.');
        }
    };

    if (typeof $rootScope.selectedUser !== "undefined") {
        $localStorage.onLocalselectedUser = $rootScope.selectedUser
    }
    $scope.offline = true;
    $scope.online = true;

    $scope.toggleOnline = function (type) {
        for (var i = 0; i < $rootScope.aOnlineMarker.length; i++) {
            var marker = $rootScope.aOnlineMarker[i];
            if (type == true) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
    };
    $scope.toggleOffline = function (types) {
        for (var i = 0; i < $rootScope.aOfflineMarker.length; i++) {
            var marker = $rootScope.aOfflineMarker[i];
            if (types == true) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
    }

}]);

materialAdmin.controller("fPasswordCtrl", function ($rootScope, $scope, $uibModal, $uibModalInstance, LoginService) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function forgetResp(response) {
        if (response.status == 'OK') {
            $uibModalInstance.dismiss('cancel');
            swal(response.message, "", "success");
        } else {
            $uibModalInstance.dismiss('cancel');
            swal(response.message, "", "error");
        }
    }

    $scope.sendMobileNo = function () {
        if ($scope.mobile) {
            LoginService.forgetPassword($scope.mobile, forgetResp)
        }
    }
});