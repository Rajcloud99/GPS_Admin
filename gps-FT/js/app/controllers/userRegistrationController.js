materialAdmin.controller("userCreateCtrl",['$rootScope', '$scope','$timeout','RegistrationService','LoginService', function($rootScope, $scope, $timeout, RegistrationService, LoginService) {
  $rootScope.showSideBar = true;
  $rootScope.sidebarDevices = true;
  $scope.subTypeofUser = true;
  $scope.roles = {
    availableUserRoles: ['user'],
    };
  $scope.registration = {
    role: 'user'
  };
  $scope.aUserType = ['Customer', 'Broker','Truck Owner','Transporter'];
  $scope.bUserType = ['Dealer'];
  function uSuccess(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        $scope.isAvailable = oRes.isAvailable;
          if(oRes.message == 'user_id is available'){
             //swal(oRes.message, "", "success");
            $scope.$apply(function() {
              $scope.msg1 = oRes.message;
            });
           }
          else{
              $scope.$apply(function() {
                $scope.registration.user_id = '';
                $scope.msg2 = oRes.message;
              });
            
           }      
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }
  $scope.hasSpace = false;
  $scope.checkUserID = function(viewValue) {
    if (/\s/.test(viewValue)) {
      console.log("It has any kind of whitespace");
      $scope.hasSpace = true;
      $scope.registration.user_id = '';
    }else{
      $scope.hasSpace = false;
      $scope.user_id = viewValue;
      if($scope.user_id){
          var checkData = {};
          checkData.request = "user_id_availability";
          checkData.user_id = $scope.user_id;
          RegistrationService.checkRegisterUserId(checkData, uSuccess);
      }
    }
  }
  
  $scope.setTypeValue = function(values){
      if(values == 'typeDealer'){
        $scope.userType = 'dealer';
        $scope.user.user_type ='';
        $scope.subTypeofUser = false;
        $scope.typeofDealer = true;
      }
      else
      {
        $scope.userType = '';
        $scope.subTypeofUser = true;
        $scope.typeofDealer = false;
      }
  }

  function responseCallback(response){
  	var oRes = JSON.parse(response);
		if(oRes){
            $rootScope.loader = false;
			if(oRes.status == 'OK'){
        swal({
            title: "User successfully Registered",
            /*text: "Go to User List page?",*/
            type: "success",
            showCancelButton: true,
            cancelButtonColor: "rgb(77, 179, 224)",
            cancelButtonText: "Register Another",
            confirmButtonColor: "rgb(77, 179, 224)",
            confirmButtonText: "User List",
            closeOnConfirm: true,
            html: false
          }, function(isConfirm){
             if (isConfirm) {
              $rootScope.redirect('/#!/main/user');
            } else {
              $rootScope.redirect('/#!/main/userCreate');
            }
            /*swal("Deleted!", "MY Device.", "success");*/
            
          });
  				//swal(oRes.message, "", "success");
          $scope.$apply(function() {
            $scope.registration = ''; 
            $scope.msg1 = '';
            $scope.msg2 = '';
            $scope.user.user_type = '';
            $scope.userType = '';
            $scope.registration = {
              role: 'user'
            };
            $scope.subTypeofUser = true;
            $scope.typeofDealer = false;
          });

        $scope.selectedUser.sub_users = $scope.selectedUser.sub_users || [];
        $scope.selectedUser.sub_users.push(oRes.data);
			}
			else if(oRes.status == 'ERROR'){
				swal(oRes.message, "", "error");
			}
		}
	};
	  

	$scope.createUser = function(form) {
  		if(form.$valid && $scope.isAvailable){
            //var getCurrentUser = LoginService.getCurrentUser();
            $scope.registration.request = 'usrReg';
            $scope.registration.city_id = "dummy";
            $scope.registration.selected_uid = $scope.selectedUser.user_id;

            if($scope.userType && !$scope.user.user_type){
              $scope.registration.type = $scope.userType;
              RegistrationService.registerUser($scope.registration,responseCallback);
            } else if($scope.user.user_type){
              if($scope.user.user_type=='Customer'){
               $scope.registration.type = 'customer';
              }else if($scope.user.user_type=='Broker'){
               $scope.registration.type = 'broker';
              }else if($scope.user.user_type=='Truck Owner'){
               $scope.registration.type = 'truck_owner';
              }else if($scope.user.user_type=='Transporter'){
               $scope.registration.type = 'transporter';
              }
                RegistrationService.registerUser($scope.registration,responseCallback);

                $rootScope.loader = true;
                $timeout(function () {
                    $rootScope.loader = false;
                }, 50000);
            } else {
                swal("Please Select User Type");
            }
		}
  }
  //PLAYBACK HOME PAGE FUNCTION
    $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
}]);

//***************************************************************************************************************************************************************************

materialAdmin.controller("groupRegisterCtrl",['$rootScope', '$scope','$timeout','RegistrationService','LoginService', function($rootScope, $scope, $timeout, RegistrationService, LoginService) {
  $rootScope.showSideBar = true;
  $rootScope.sidebarDevices = true;
  $scope.registration = {
    role: 'user'
  };
  $scope.aUserType = ['Group', 'Manager'];
  function uSuccess(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
          if(oRes.message == 'user_id is available'){
             //swal(oRes.message, "", "success");
             $scope.msg1 = oRes.message;
           }
          else{
             $scope.registration.user_id = '';
             $scope.msg2 = oRes.message;
           }
        $scope.isAvailable = oRes.isAvailable;
        
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  }

  $scope.checkUserID = function(viewValue) {

        $scope.user_id = viewValue;
        if($scope.user_id){
            var checkData = {};
            checkData.request = "user_id_availability";
            checkData.user_id = $scope.user_id;
            RegistrationService.checkRegisterUserId(checkData, uSuccess);
        } 
    }
  
  function responseCallback(response){
    var oRes = JSON.parse(response);
    if(oRes){
        $rootScope.loader = false;
      if(oRes.status == 'OK'){
        swal({
            title: "Group successfully Registered",
            /*text: "Go to User List page?",*/
            type: "success",
            showCancelButton: true,
            cancelButtonColor: "rgb(77, 179, 224)",
            cancelButtonText: "Register Another",
            confirmButtonColor: "rgb(77, 179, 224)",
            confirmButtonText: "Group List",
            closeOnConfirm: true,
            html: false
          }, function(isConfirm){
             if (isConfirm) {
              $rootScope.redirect('/#!/main/user');
            } else {
              $rootScope.redirect('/#!/main/registerGroup');
            }
            /*swal("Deleted!", "MY Device.", "success");*/
            
          });
          //swal(oRes.message, "", "success");
          $scope.$apply(function() {
            $scope.registration = ''; 
            $scope.msg1 = '';
            $scope.msg2 = '';
            $scope.user.user_type = '';
            $scope.userType = '';
            $scope.registration = {
              role: 'user'
            };
            $scope.subTypeofUser = true;
            $scope.typeofDealer = false;
          });

        $scope.selectedUser.sub_users = $scope.selectedUser.sub_users || [];
        $scope.selectedUser.sub_users.push(oRes.data);
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };
    

  $scope.createUser = function(form) {
      if(form.$valid && $scope.isAvailable){
        //var getCurrentUser = LoginService.getCurrentUser();
        $scope.registration.request = 'usrReg';
        $scope.registration.city_id = "dummy";
        $scope.registration.selected_uid = $scope.selectedUser.user_id;
        
        if($scope.user.user_type){
              if($scope.user.user_type=='Group'){
               $scope.registration.type = 'group';
              }else if($scope.user.user_type=='Manager'){
               $scope.registration.type = 'manager';
              }else{
                $scope.registration.type = 'group';
              }
            RegistrationService.registerUser($scope.registration,responseCallback);
            $rootScope.loader = true;
            $timeout(function () {
                $rootScope.loader = false;
            }, 50000);
          } 
    }
  }
  //HOME PAGE FUNCTION
    $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
}]);

materialAdmin.controller("parentRegisterCtrl", function($rootScope, $localStorage, $scope, $uibModalInstance, RegistrationService, selectedRegisterMaster) {
    $rootScope.showSideBar = true;
    $rootScope.sidebarDevices = true;
    //$scope.sRegisterParent = sRegisterParent;

    $scope.oRegPar = {}; //initialize with Empty Object
    $scope.operationType = 'Add'; // Defines Operation type for Showing on View

    $scope.registration = {
        role: 'user'
    };
    $scope.closeModal = closeModal;
    $scope.aRelation = ['Father', 'Mother', 'Guardian'];

    if (typeof selectedRegisterMaster !== 'undefined' && selectedRegisterMaster !== null) {
        $scope.oRegPar = angular.copy(selectedRegisterMaster); //initialize with param
        if (!selectedRegisterMaster.isAdd) {
            $scope.operationType = 'Edit';
        }
    }

    function closeModal() {
        $uibModalInstance.dismiss();
    }

    function uSuccess(response){
        var oRes = JSON.parse(response);
        if(oRes){
            if(oRes.status == 'OK'){
                if(oRes.message == 'user_id is available'){
                    //swal(oRes.message, "", "success");
                    $scope.msg1 = oRes.message;
                }
                else{
                    $scope.registration.user_id = '';
                    $scope.msg2 = oRes.message;
                }
                $scope.isAvailable = oRes.isAvailable;

            }
            else if(oRes.status == 'ERROR'){
                swal(oRes.message, "", "error");
            }
        }
    }

    $scope.checkUserID = function(viewValue) {

        $scope.user_id = viewValue;
        if($scope.user_id){
            var checkData = {};
            checkData.request = "user_id_availability";
            checkData.user_id = $scope.user_id;
            RegistrationService.checkRegisterUserId(checkData, uSuccess);
        }
    }

    function responseCallback(response){
        var oRes = JSON.parse(response);
        if(oRes){
            $rootScope.loader = false;
            if(oRes.status == 'OK'){
                swal({
                    title: "Group successfully Registered",
                    /*text: "Go to User List page?",*/
                    type: "success",
                    showCancelButton: true,
                    cancelButtonColor: "rgb(77, 179, 224)",
                    cancelButtonText: "Register Another",
                    confirmButtonColor: "rgb(77, 179, 224)",
                    confirmButtonText: "Group List",
                    closeOnConfirm: true,
                    html: false
                }, function(isConfirm){
                    if (isConfirm) {
                        $rootScope.redirect('/#!/main/user');
                    } else {
                        $rootScope.redirect('/#!/main/registerParent');
                    }
                    /*swal("Deleted!", "MY Device.", "success");*/

                });
                //swal(oRes.message, "", "success");
                $scope.$apply(function() {
                    $scope.registration = '';
                    $scope.msg1 = '';
                    $scope.msg2 = '';
                    $scope.user.user_type = '';
                    $scope.userType = '';
                    $scope.registration = {
                        role: 'user'
                    };
                    $scope.subTypeofUser = true;
                    $scope.typeofDealer = false;
                });

                $scope.selectedUser.sub_users = $scope.selectedUser.sub_users || [];
                $scope.selectedUser.sub_users.push(oRes.data);
            }
            else if(oRes.status == 'ERROR'){
                swal(oRes.message, "", "error");
            }
        }
    };


    $scope.createParent = function(form) {

        if (!$scope.oRegPar.student) {
            return swal("Student is required", "", "error");
        }

        if (!$scope.oRegPar.rfid) {
            return swal("RFID is required", "", "error");
        }

        if (isNaN($scope.oRegPar.rfid)) {
            return swal("RFID should be numeric", "", "error");
        }

        if (!$scope.oRegPar.parent1.mobile) {
            return swal("Parent1 mobile is required", "", "error");
        }

        if (!$scope.oRegPar.parent1.relation) {
            return swal("Parent1 relation is required", "", "error");
        }

        var oFilter = prepareFilterObject();
        if($scope.operationType=='Edit'){
            oFilter._id = $scope.oRegPar._id;
            RegistrationService.updateStudentParent(oFilter, onSuccess, err => {
                console.log(err)
            });
        }
        else {
            RegistrationService.addStudentParent(oFilter, onSuccess, err => {
                swal(oRes.message, "", "error");
                $uibModalInstance.dismiss('cancel');
            });
        }

        function onSuccess(response){
            var oRes = response;
            if(oRes){
                if(oRes.status === 'OK'){
                    $rootScope.softRefreshPage();
                    swal(oRes.message, "", "success");
                    $uibModalInstance.dismiss('cancel');
                }
                else if(oRes.status === 'ERROR'){
                    swal(oRes.message, "", "error");
                    $uibModalInstance.dismiss('cancel');
                }
            }
        }
    };

    function prepareFilterObject(download) {
        var filter = {};
        filter['parent1'] = {};
        filter['parent2'] = {};
        // if ($scope.user_id) {
        //     filter.user_id = $scope.user_id;
        // }

        if ($scope.oRegPar.student) {
            filter.student = $scope.oRegPar.student;
        }

        if ($scope.oRegPar.rfid) {
            filter.rfid = $scope.oRegPar.rfid;
        }

        if ($scope.oRegPar.parent1 && $scope.oRegPar.parent1.email) {
            filter['parent1'].email = $scope.oRegPar.parent1.email;
        }

        if ($scope.oRegPar.parent1 && $scope.oRegPar.parent1.mobile) {
            filter['parent1'].mobile = $scope.oRegPar.parent1.mobile;
        }

        if ($scope.oRegPar.parent1 && $scope.oRegPar.parent1.relation) {
            filter['parent1'].relation = $scope.oRegPar.parent1.relation;
        }

        if ($scope.oRegPar.parent2 && $scope.oRegPar.parent2.email) {
            filter['parent2'].email = $scope.oRegPar.parent2.email;
        }

        if ($scope.oRegPar.parent2 && $scope.oRegPar.parent2.mobile) {
            filter['parent2'].mobile = $scope.oRegPar.parent2.mobile;
        }

        if ($scope.oRegPar.parent2 && $scope.oRegPar.parent2.relation) {
            filter['parent2'].relation = $scope.oRegPar.parent2.relation;
        }

        if (download) {
            filter.download = true;
            filter.no_of_docs = 2000;
        }

        filter.login_uid = $localStorage.user.user_id;
        filter.user_id = $localStorage.user.user_id;
        return filter;
    }


    //HOME PAGE FUNCTION
    $scope.homePage = function () {
        $rootScope.redirect('/#!/main/user');
    };
});