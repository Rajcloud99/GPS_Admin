materialAdmin.controller('tripListCtrl', function ($rootScope,$localStorage,$scope,$http,$uibModal,DateUtils,TripService,$timeout) {
  $rootScope.showSideBar = false;
  $scope.progressHide = true; 
  $scope.aPageState = [
    [0,0,0,0,0]
  ];
  $scope.aTrips = [];
  //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function(date){
      return new Date(date).toDateString();  
    };


  //************* New Date Picker for multiple date selection in single form ******************

  //$scope.progressVisible = false;
  $rootScope.states = {};
  $rootScope.states.actItm = 'trip';
  if(!$rootScope.selectedUser){
    $rootScope.selectedUser = $localStorage.user;
  }

  $scope.userDevices = $localStorage.preservedSelectedUser.devices;
  var siofu = $rootScope.getFileUploader();
  $rootScope.getAllTrips = function(){
		//Get Trips
    function tripListResponse(response){
	    var oRes = JSON.parse(response);
	    if(oRes.status == 'OK'){
	    	$scope.$apply(function() {
	    		var aRespTrip = [];
          var gotTrip =  oRes.data;
          $scope.aFieldShow = oRes.shown_fields;
          $scope.respList = oRes;
          console.log(oRes);
        	//$scope.localTrip =  oRes.data;
        	for(var i=0; i<gotTrip.length; i++){
            gotTrip[i].showBtn = true;
          	var tripModify = {};
          	tripModify = gotTrip[i];
          	if(gotTrip[i].created_at){
          		tripModify.create_time = moment(gotTrip[i].created_at).format("DD-MM-YYYY hh:MMa");
          	}
          	if(gotTrip[i].start_time){
          		tripModify.start_time_local = moment(gotTrip[i].start_time).format("DD-MM-YYYY hh:MMa");
          	}
          	if(gotTrip[i].end_time){
          		tripModify.end_time_local = moment(gotTrip[i].end_time).format("DD-MM-YYYY hh:MMa");
          	}
            if(gotTrip[i].etoa){
              tripModify.etoa = moment(gotTrip[i].etoa).format("DD-MM-YYYY hh:MMa");
            }
          	
          	aRespTrip.push(tripModify);
          }
          $scope.aTrips = aRespTrip;

          if($scope.aPageState.length <= $scope.bigCurrentPage){
            if(oRes.pageState){
              $scope.aPageState.push(oRes.pageState.data);

              $scope.bigTotalItems = $scope.aPageState.length * 13;
            }
          }
	      });
      }else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
	    }
    };
    var getAlist = {};
    //getAlist.login_uid = $localStorage.user.user_id;
    if($scope.aPageState && $scope.aPageState.length > 1){
      if($scope.getPageNoAlt2 > 0){
        getAlist.pageState = $scope.aPageState[$scope.getPageNoAlt2];
      }
    }
    if($scope.tDate){
        getAlist.start_time = $scope.tDate;
    }
    getAlist.row_count = 13;
    getAlist.request = 'get_trips';
    if($scope.imei){
      getAlist.imei = $scope.imei;
      getAlist.vehicle_no = $scope.vehicle_no;
    }
    if($scope.sStatus){
      getAlist.status = $scope.sStatus;
    }
    //getAlist.status = " ";
    getAlist.selected_uid = $localStorage.preservedSelectedUser.user_id;
    TripService.getAllTripsList(getAlist,tripListResponse);
  }
  $rootScope.getAllTrips();

  $scope.getNotifi = function(){
    $rootScope.getAllTrips();
  }

  $scope.settingColumnOnTrip = function(){
    $rootScope.settingDevices = $scope.respList;
    var modalInstance = $uibModal.open({
      templateUrl : 'views/main/settingOnList.html',
      controller : 'settingTripListCtrl'
    });
  }

  //**********************************************************************************
  $scope.dwnldXlsx = function(reportData) {
   	function dwnldResponse(response){
	    var oRes = JSON.parse(response);
	    //$rootScope.loader = false;
	    if(oRes){
	      if(oRes.status == 'OK'){
	        var modalInstance = $uibModal.open({
	          templateUrl : 'views/trip/download-Treport.html',
	          controller : 'downloadTreportCtrl',
	          resolve: {
	    		downloadData: function () {
	      			return oRes;
	    		}
	  		  }
	        });
	      }
	      else if(oRes.status == 'ERROR'){
	        //swal(oRes.message, "", "error");
	      }
	    }
    };


      var xlDownload = {};
      xlDownload.request = 'download_report_trip';
      xlDownload.selected_uid = $rootScope.selectedUser.user_id;
      if($scope.tDate){
      xlDownload.created_at = $scope.tDate;
      }
      TripService.downloadReport(xlDownload,dwnldResponse);
      $rootScope.loader = true;
      $timeout(function() {
          $rootScope.loader = false;
      }, 3000);
    //};
  };
  //**********************************************************************************
  $scope.createTrip = function(){
    $rootScope.redirect('/#!/main/createTrip');
  };
  //**********************************************************************************

  $rootScope.handleTrips = function (res){
	  var modalInstance = $uibModal.open({
      templateUrl : 'views/trip/onUploadStatus.html',
      controller : 'onUploadStatusCtrl',
      resolve: {
        uploadedData: function () {
          return res;
        }
      }
    });
  }
  if(siofu){
  	// Configure the three ways that SocketIOFileUpload can read files: 
    //document.getElementById("upload_btn").addEventListener("click", siofu.prompt, false);
    siofu.listenOnInput(document.getElementById("upload_input"));
    //siofu.listenOnDrop(document.getElementById("file_drop"));
	 	
	 	//Do SomthinG on upload Start
	 	siofu.addEventListener("start", function(event){
	 		$scope.$apply(function() {
	 			$scope.progressHide = false; 
	 		});
	 		//$scope.progressVisible = true;
	    	event.file.meta.login_uid = $localStorage.user.user_id;
	    	event.file.meta.token = $localStorage.user.token;
	    	event.file.meta.request = "upload_trips";
	    	event.file.meta.selected_uid = $rootScope.selectedUser.user_id;
		});
	    
    // Do something on upload progress: 
    siofu.addEventListener("progress", function(event){
    	$scope.progress = Math.round(event.bytesLoaded / event.file.size * 100);
        console.log("File is", $scope.progress.toFixed(2), "percent loaded");
    });
 
    // Do something when a file is uploaded: 
    siofu.addEventListener("complete", function(event){
    	$scope.$apply(function() {
    		$scope.progressHide = true; 
    	});
    	if(event.success){
    		//swal("Thank You!", "Your File Uplaoded Successfully!", "success");
    	}else{
    		swal("Something Went Wrong!", "There is a problem uploading your file. Please try again", "error");
    	}
    	console.log(event.success);
        console.log(event.file);
    });

    // Do something when a error occured: 
    siofu.addEventListener("error", function(data){
	    if (data.code === 1) {
	        console.log(data.message);
	        swal("Something Went Wrong!", data.message, "error");
	    }
	  });
  }

	$scope.onSelect=function ($item, $model, $label){
    $scope.imei = $model.imei;
    $scope.vehicle_no = $model.vehicle_no;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $rootScope.getAllTrips();
  };
  $scope.remVehicle=function (vehicleNum){
    if(vehicleNum.length<1)
    {
      $scope.imei = '';
      $rootScope.getPageNo = 0;
      $scope.setPage(1);
      $rootScope.getAllTrips();
      console.log('1stRefersh');
    }
  };

  $scope.sAllTripStatus = ['pending','started','loading','unloading','journey','complete'];
  $scope.getStatus = function(status){
    $scope.sStatus = status;
    $rootScope.getPageNo = 0;
    $scope.setPage(1);
    $rootScope.getAllTrips();
  }

  //****************pagination code start ************//
    $scope.setPage = function (pageNo) {
      $scope.bigCurrentPage = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.bigCurrentPage);
      $scope.getPageNoAlt2 = $scope.bigCurrentPage-1;
      $rootScope.getAllTrips();
    };

    $scope.maxSize = 8;
    $scope.bigTotalItems = $scope.aTrips.length;
    $scope.bigCurrentPage = 1;
  //****************pagination code end ************//
	$scope.pages = [1];
	$scope.nxt = function () {
    $scope.pages.push($scope.pages.length+1);
  };
  //PLAYBACK HOME PAGE FUNCTION
  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
  $rootScope.sTripDetails = {};
  $scope.showTripDetail = function (trip) {
    $rootScope.sTripDetails = trip;
    $rootScope.redirect('/#!/main/tripDetail/'+ trip.trip_id);
  };

  /*************** reverse geocoding own server ****************/
    $rootScope.showAdd = function(trip){
      if(trip.start && trip.start.latitude && trip.start.longitude){
        var lat = trip.start.latitude;
        var lng = trip.start.longitude;
      }else{
        var lat = trip.cur_location.lat;
        var lng = trip.cur_location.lng;
      }
      //var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
      var latlngUrl = "http://13.229.178.235:4242/reverse?lat="+lat+"&lon="+lng;
      $http({
        method : "GET",
        url : latlngUrl
      }).then(function mySucces(response) {
          //$scope.myWelcome = response.data;
          
          trip.formatedAddr = response.data.display_name;
          trip.showBtn = false;
      }, function myError(response) {
          //$scope.myWelcome = response.statusText;
          trip.formatedAddr = response.statusText;
          trip.showBtn = false;
      });
    }
  /*************** reverse geocoding own server ****************/

  $scope.removeTrip = function (trip) {

    function rTripResponse(response){
      var oRes = JSON.parse(response);
      if(oRes.status == 'OK'){
         $rootScope.getAllTrips();
      }else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    };

    var removeItem = {};
    removeItem.request = 'remove_trip';
    removeItem.selected_uid = $localStorage.preservedSelectedUser.user_id;
    
    removeItem.created_at = trip.created_at;
      
    TripService.removeTripServ(removeItem,rTripResponse);
  };
  $scope.iconChange = true;
  $scope.toggle = true;

  $scope.$watch('toggle', function(){
      $scope.toggleText = $scope.toggle ? 'Track on Map' : 'Back to List';
  })

  $scope.callFirst = true;

  $rootScope.trackAllTrip = function (tripD) {
    if($scope.callFirst == true){
      document.getElementById('map-togg').style.display="block";
      initialize();
      function initialize() {
        //$rootScope.trackTrips = $scope.aTrips;
        //$rootScope.redirect('/#!/main/trackTrip');
        $scope.deviceIdRegNo = [];
        $rootScope.aLiveFeedDevice = [];
        $rootScope.aLiveFeedData = [];
        $rootScope.hmapAllMarkers = {};
        $rootScope.aImeiOnLoad = [];
        $rootScope.mapMark = {};
        $scope.pass1 = true;
        $rootScope.allNewMarkers = [];

        var myMap,map,infoWindow,zoomLevel,devices;
        myMap = {
          zoom: 5,
          center: new google.maps.LatLng(25,77),
          title: 'Click to zoom',
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        map = new google.maps.Map(document.getElementById('tripMap'), myMap);
        infoWindow = new google.maps.InfoWindow();
        
        $scope.deviceOnMap = function(devices){
          $scope.aDevices = [];
          if(!$scope.aPlotDevices){
            $scope.aPlotDevices = [];
          }

          if($scope.aPlotDevices && $scope.aPlotDevices.length ==0){
            for(var x=0;x<devices.length;x++){ 
              if(devices[x] && devices[x].cur_location.lat && devices[x].cur_location.lng){
                devices[x].device_id = devices[x].imei;
                $scope.aPlotDevices.push(devices[x]);
              }
            }
          }

          for(var z=0;z<devices.length;z++){
            $scope.deviceIdRegNo[z] = devices[z];
            if(devices[z] && devices[z].cur_location.lat && devices[z].cur_location.lng){
              if(devices[z].cur_location.status != 'inactive'){
                $scope.createTripMarker(devices[z]);
              }
            }
          };

        };

        $scope.createTripMarker = function(info,update_marker,marker){
          console.log(info);

          //*********get address on marker by own server start ************//
            function getAddress (info, callback){
              if(info.cur_location.start && info.cur_location.start.latitude && info.cur_location.start.longitude){
                var lat = info.cur_location.start.latitude;
                var lng = info.cur_location.start.longitude;
              }else{
                var lat = info.cur_location.lat;
                var lng = info.cur_location.lng;
              }
              //var latlngUrl = "http://52.220.18.209/reverse?format=json&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=0";
              var latlngUrl = "http://13.229.178.235:4242/reverse?lat="+lat+"&lon="+lng;
              $http({
                method : "GET",
                url : latlngUrl
              }).then(function mySucces(response) {
                  info.cur_location.formatedAddr = response.data.display_name;
                  callback();
              }, function myError(response) {
                  info.cur_location.formatedAddr = response.statusText;
              });
                
            }
          //*******get address end ************//

          if(info.cur_location.status == 'online' && info.cur_location.speed > 0){
            var cDate = new Date(info.cur_location.location_time || info.cur_location.datetime);
            var cMinutes = cDate.getMinutes();
            cDate.setMinutes(cMinutes + 15);
            if(cDate >= new Date()){
              info.cur_location.status = 'running';
            }
          }
          if(info.cur_location.status == 'inactive'){
            var iconBase = 'img/arrow_red-small.png';
          }else if(info.cur_location.status == 'offline'){
            //var iconBase = 'img/arrow_default-small.png';
            $scope.markerOffL = true;
            //var iconBase = 'img/truck_d.png';
            for (var h = 1; h <= 45; h++) {
              if (h == info.cur_location.course){
                var iconBase = 'img/arrow_default1-small.png';
                $scope.markerOffL = false;
              }
            }
            if($scope.markerOffL){
              for (var h = 46; h <= 90; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default2-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 91; h <= 135; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default3-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 136; h <= 180; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default4-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 181; h <= 225; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default5-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 226; h <= 270; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default6-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 271; h <= 315; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default7-small.png';
                  $scope.markerOffL = false;
                }
              }
            }
            if($scope.markerOffL){
              for (var h = 316; h <= 360; h++) {
                if (h == info.cur_location.course){
                  var iconBase = 'img/arrow_default8-small.png';
                  $scope.markerOffL = false;
                }else{
                  var iconBase = 'img/arrow_default1-small.png';
                }
              }
            }
          }else if(info.cur_location.status == 'handshake'){
            var iconBase = 'img/arrow_yellow-small.png';
          }else if(info.cur_location.status == 'online'){
            //var iconBase = 'img/arrow_red-small.png';
            $scope.markerOnL = true;
            //var iconBase = 'img/truck_d.png';
            for (var b = 1; b <= 45; b++) {
              if (b == info.cur_location.course){
                var iconBase = 'img/arrow_red1-small.png';
                $scope.markerOnL = false;
              }
            }
            if($scope.markerOnL){
              for (var b = 46; b <= 90; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red2-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 91; b <= 135; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red3-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 136; b <= 180; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red4-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 181; b <= 225; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red5-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 226; b <= 270; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red6-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 271; b <= 315; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red7-small.png';
                  $scope.markerOnL = false;
                }
              }
            }
            if($scope.markerOnL){
              for (var b = 316; b <= 360; b++) {
                if (b == info.cur_location.course){
                  var iconBase = 'img/arrow_red8-small.png';
                  $scope.markerOnL = false;
                }else{
                  var iconBase = 'img/arrow_red1-small.png';
                }
              }
            }
          }else if(info.cur_location.status == 'running'){
            $scope.markerOk = true;
            //var iconBase = 'img/truck_d.png';
            for (var i = 1; i <= 45; i++) {
              if (i == info.cur_location.course){
                var iconBase = 'img/arrow_green1-small.png';
                $scope.markerOk = false;
              }
            }
            if($scope.markerOk){
              for (var i = 46; i <= 90; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green2-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 91; i <= 135; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green3-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 136; i <= 180; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green4-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 181; i <= 225; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green5-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 226; i <= 270; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green6-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 271; i <= 315; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green7-small.png';
                  $scope.markerOk = false;
                }
              }
            }
            if($scope.markerOk){
              for (var i = 316; i <= 360; i++) {
                if (i == info.cur_location.course){
                  var iconBase = 'img/arrow_green8-small.png';
                  $scope.markerOk = false;
                }else{
                  var iconBase = 'img/arrow_green1-small.png';
                }
              }
            }
          }else{
            var iconBase = 'img/arrow_default-small.png';
          }
          for (var i = 0; i < $scope.deviceIdRegNo.length; i++) {
            if ($scope.deviceIdRegNo[i] && $scope.deviceIdRegNo[i].imei){
              if ($scope.deviceIdRegNo[i].imei == info.imei){
                $scope.sDeviceData = $scope.deviceIdRegNo[i];
                info.reg_no = $scope.deviceIdRegNo[i].vehicle_no;
              }
            }
          }
          var point = new google.maps.LatLng(info.cur_location.lat, info.cur_location.lng);

          if(update_marker && marker){
             marker.setPosition( new google.maps.LatLng( info.cur_location.lat, info.cur_location.lng ));
             marker.setIcon(iconBase);
          }else{
              var marker = new MarkerWithLabel({
              map: map,
              position: point,
              title: "Device Info",
              icon: iconBase,
              raiseOnDrag: true,
              labelContent: $scope.sDeviceData.vehicle_no,
              labelImei: $scope.sDeviceData.imei,
              deviceType: $scope.sDeviceData.device_type,
              labelAnchor: new google.maps.Point(30, 62),
              labelClass: "labelsss", // the CSS class for the label 
              labelInBackground: false,
              labelStyle: {opacity: 1}
            });
          }
          var spLink = info.device_id;
          if(info.cur_location.acc_high == true){
            info.cur_location.acc_high_local = "On";
          }else if(info.cur_location.acc_high == false){
            info.cur_location.acc_high_local = "Off";
          }else if(info.cur_location.acc_high == undefined){
            info.cur_location.acc_high_local = "NA";
          }

          (function (marker, info) {
            google.maps.event.addListener(marker, 'click', function(event){
              if (event.alreadyCalled_) {
                  //alert('circle clicked again'); 
              }
              else {
                getAddress(info, function(){

                  infoWindow.close(); // Close previously opened infowindow
                  infoWindow.setContent('<div class="map-popup">'+
                  /*'<p>Device Id &nbsp;&nbsp;&nbsp;: <span>'+ info.device_id+ '</span></p>'+*/
                  '<p>Vehicle No.: <span>' + info.vehicle_no+ '</span></p>'+
                  '<p>ACC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: <span>' + info.cur_location.acc_high_local+ '</span></p>'+
                  '<p>Speed &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;: <span>'+ info.cur_location.speed +' &nbsp;&nbsp;KM/H. </span></p>'+
                  '<p>Location &nbsp;&nbsp;&nbsp;: <span>'+info.cur_location.formatedAddr + '</span></p>'+
                  '<p>Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>'+ moment(info.cur_location.datetime).format('LLL') +'</span></p><hr class="m-t-5 m-b-5">'+
                  '<a href="/#!/mains/mapZoom/'+ info.device_id +'" uib-tooltip="Tracking" title="Tracking"><span class="glyphicon glyphicon-road"></span></a>&nbsp;&nbsp;'+
                  /*'<a href="'+forAddingURL.base_url+'/#!/main/map" tooltip="Command" title="Command"><span class="glyphicon glyphicon-tasks"></span></a>&nbsp;&nbsp; '+*/
                  '</div>');
                    infoWindow.open(map, marker);
                });
                event.alreadyCalled_ = true;
              }
            });
          })(marker, info);

          for(var c=0;c<$scope.aPlotDevices.length;c++){
            if(info.device_id == $scope.aPlotDevices[c].device_id){
              
              $rootScope.aImeiOnLoad[c] = info.imei;
              $rootScope.hmapAllMarkers[$scope.aPlotDevices[c].imei] = marker;
              $rootScope.allNewMarkers[c] = marker;
            }
          }
        };

        /*$scope.aTripMapData = [];
        if($scope.aTrips && $scope.aTrips.length>0){
          for(var x=0;x<$scope.aTrips.length;x++){
            $scope.aTripMapData.push($scope.aTrips[x].cur_location);
          }
        }*/
        if(tripD){
          $scope.aTrips=[];
          $scope.aTrips[0] = tripD;
          devices = $scope.aTrips;
        }else{
          devices = $scope.aTrips;
        }
        $scope.deviceOnMap(devices);

        $scope.callFirst = false;
      }
    }else{
      $scope.callFirst = true;
      document.getElementById('map-togg').style.display="none";
    }

  };
  
});

materialAdmin.controller("settingTripListCtrl", function($rootScope, $scope, $localStorage,$window, $uibModal, $uibModalInstance, $interval,$state, $timeout,LoginService) {
  $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
  };
  $scope.settingColumns = $rootScope.settingDevices;
  $scope.settingColumns.localStore = {
    'branch':'Branch',
    'reg_no':'Vehicle No.',
    'vehicle_type':'Vehicle Type',
    'driver_name':'Driver Name',
    'status':'Status',
    'user_id':'User Id',
    'alarms':'Alarm',
    'enabled':'Enabled',
    'addr':'Address',
    'positioning_time':'Positioning Time',
    'location_time':'Location Time',
    'stoppage_time':'Stoppage Time',
    'speed':'Speed',
    'dist_today':'Distance Today',
    'dist_yesterday':'Distance Yesterday',
    'remark':'Remark',
    'nearest_landmark':'Nearest Landmark',
    'geofence_status':'Geofence Status',
    'created_at':'Created Time',
    'created_by':'Created By',
    'consignee':'Consignee',
    'consignor':'Consignor',
    'source':'Source',
    'destination':'Destination',
    'driver':'Driver Name',
    'driver_no':'Driver No.',
    'start_time':'Start Time',
    'end_time':'End Time',
    'est_dist':'Estimated Distance',
    'etoa':'ETOA',
    'forworder':'Forworder',
    'gps_status':'Gps Status',
    'imei':'IMEI',
    'journey':'Journey',
    'last_tracking':'Last Tracking',
    'loading':'Loading',
    'unloading':'Unloading',
    'manager':'Manager',
    'manager':'Manager',
    'remark1':'Remark1',
    'remark2':'Remark2',
    'remark3':'Remark3',
    'trip_id':'Trip Id',
    'trip_no':'Trip no',
    'trip_no':'Trip no',
    'vehicle_no':'Vehicle no.',
    'cur_location':'Current Location'
  }

  $scope.toggleAllCheck = function() {
     var toggleStatus = $scope.isAllSelected;
     angular.forEach($scope.settingColumns.allowed_local_fields, function(itm){ itm.selected = toggleStatus; });
   
  }

  $scope.settingColumns.allowed_local_fields = [];

  for(var f=0;f<$scope.settingColumns.allowed_fields.length;f++){
    var ffd = $scope.settingColumns.allowed_fields[f];
    //$scope.settingColumns.localStore[ffd];
    $scope.settingColumns.allowed_local_fields[f] = {};
    $scope.settingColumns.allowed_local_fields[f].key = $scope.settingColumns.allowed_fields[f];
    $scope.settingColumns.allowed_local_fields[f].value = $scope.settingColumns.localStore[ffd];
    //$scope.settingColumns.allowed_local_fields[f].selected = false;
    if($scope.settingColumns.shown_fields.indexOf(ffd) > -1){
      $scope.settingColumns.allowed_local_fields[f].selected = true;
    }else{
       $scope.settingColumns.allowed_local_fields[f].selected = false;
    }
  }

  $scope.setColumn = function () {
    $scope.settingColumns.shown_local_fields;
  };
  
  $scope.updateColumn = function () {
    function updateResponse(response){
      var oRes = JSON.parse(response);
      if(oRes){
        if(oRes.status == 'OK'){
          $rootScope.getAllTrips();
          swal(oRes.message, "", "success");
          $uibModalInstance.dismiss('cancel');
        }
        else if(oRes.status == 'ERROR'){
          swal(oRes.message, "", "error");
        }
      }
    };
    $scope.selColFields = {};
    $scope.settingColumns.shown_local_fields = [];
    for(var s=0;s<$scope.settingColumns.allowed_local_fields.length;s++){
      if($scope.settingColumns.allowed_local_fields[s].selected==true){
        $scope.settingColumns.shown_local_fields.push($scope.settingColumns.allowed_local_fields[s].key);
      }
    }
    $scope.selColFields.request = 'update_feature';
    $scope.selColFields.login_uid = $localStorage.user.user_id;
    $scope.selColFields.feature = 'trips';
    $scope.selColFields.shown_fields = $scope.settingColumns.shown_local_fields;
    $scope.selColFields.allowed_fields = $scope.settingColumns.allowed_fields;
    LoginService.columnUpService($scope.selColFields,updateResponse);
  };
  
});

materialAdmin.controller("downloadTreportCtrl", function($rootScope, $scope,$uibModalInstance,downloadData) {
  $rootScope.showSideBar = false;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.tripDownload = downloadData;
  $scope.downloadConfirm = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
});

materialAdmin.controller("onUploadStatusCtrl", function($rootScope, $scope,$uibModalInstance,uploadedData) {
  $rootScope.showSideBar = false;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  var oUploadedData = uploadedData;
  if(oUploadedData.status == "OK"){
  	$scope.aUploadedData = oUploadedData.data;
 }else{
  	$uibModalInstance.dismiss('cancel');
  	swal("Something Went Wrong!", modifyData.message, "error");
  }
  
});

materialAdmin.controller("createTripCtrl", function($rootScope, $scope, $localStorage,DateUtils, LoginService, TripService) {
  $rootScope.showSideBar = false;

  if(!$rootScope.selectedUser){
    $rootScope.selectedUser = $localStorage.user;
  }
  $scope.vehicleOptions = [];
  $scope.aGeoZoneList = [];
  function geoListResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      $scope.aGeoZoneList = [];
      if(oRes.status == 'OK'){
        for(var j=0; j<oRes.data.length; j++){
          if(oRes.data[j].name){
            $scope.aGeoZoneList.push(oRes.data[j].name);
          }
        }
      }
    }
  };

  //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function(date){
      return new Date(date).toDateString();  
    };
    //********************//**********************//*****************//
    $scope.aHours = [];
    for(var h = 0;h<24;h++){
      $scope.aHours[h] = h;
    }
    $scope.aMinutes = [];
    for(var m = 0;m<60;m++){
      $scope.aMinutes[m] = m;
    }
  //************* custome Date time Picker for multiple date selection in single form ******************
  $scope.wrongDateRange = false;
  var dateTimeStart;
  
  $scope.hourSel1 = 0;
  $scope.minuteSel1 = 0;

  //***************Self Invocing Anonymous Function*********************
  (function(){
    if ($localStorage && $localStorage.preservedSelectedUser && $localStorage.preservedSelectedUser.devices && $localStorage.preservedSelectedUser.devices[0]) {
      $scope.vehicleOptions = [];
      for(i=0; i<$localStorage.preservedSelectedUser.devices.length; i++) {
        if($localStorage.preservedSelectedUser.devices[i].reg_no){
          if($localStorage.preservedSelectedUser.devices[i].status != 'inactive'){
            $scope.vehicleOptions.push($localStorage.preservedSelectedUser.devices[i].reg_no);
          }
        }
      }
    }
  })();

  (function(){
    if ($localStorage && $localStorage.preservedSelectedUser) {
      getGeoList = {};
      getGeoList.request = 'get_geozone';
      getGeoList.selected_uid = $localStorage.preservedSelectedUser.user_id;
      LoginService.getGeozoneList(getGeoList,geoListResponse);
    }
  })();
  //*********************************************************************
  $scope.createTrip = function(form){
    if(form.$valid){
      if($scope.tripData.source == $scope.tripData.destination){
        var failedResp = {
          status : 'ERROR',
          message : 'source and destination must not be the same.'
        };
        var failedRespStringify = JSON.stringify(failedResp);
        tripResponse(failedRespStringify);
      }
      else if($scope.tripData.source != $scope.tripData.destination){
        toSend = {};
        toSend.source = $scope.tripData.source;
        toSend.destination = $scope.tripData.destination;
        toSend.request = "create_trip"; 
        //**** custom time add with date ******//
          var xx = $scope.dateTimeStart;
          xx.setHours($scope.hourSel1);
          xx.setMinutes($scope.minuteSel1);
          $scope.dateTimeStart = xx;

        //**** custom time add with date ******//
        //toSend.start_time = $scope.tripData.StartTime;
        toSend.start_time = $scope.dateTimeStart;
        toSend.duration = $scope.tripData.duration;
        if($scope.tripData.vehicle && $localStorage && $localStorage.preservedSelectedUser && $localStorage.preservedSelectedUser.devices && $localStorage.preservedSelectedUser.devices[0]) {
          for(i=0; i<$localStorage.preservedSelectedUser.devices.length; i++) {
            if($localStorage.preservedSelectedUser.devices[i].reg_no==$scope.tripData.vehicle){
              toSend.imei = parseInt($localStorage.preservedSelectedUser.devices[i].imei);
            }
          }
        }
        if($scope.tripData.days || $scope.tripData.hours){
          var createDuration = "";
          if($scope.tripData.days){
            createDuration = $scope.tripData.days+'d';
          }
          if($scope.tripData.hours){
            createDuration = createDuration +$scope.tripData.hours+'h';
          }
          toSend.duration = createDuration;
        }
        toSend.vehicle_no = $scope.tripData.vehicle;
        toSend.consignor = $scope.tripData.consignor;
        toSend.consignee = $scope.tripData.consignee;
        toSend.forworder = $scope.tripData.forworder;
        toSend.manager = $scope.tripData.manager;
        toSend.est_dist = $scope.tripData.est_dist;
        toSend.selected_uid = $localStorage.preservedSelectedUser.user_id;
        TripService.createTrip(toSend,tripResponse);
      }
    }
  }

  function tripResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      if(oRes.status == 'OK'){
        $scope.$apply(function () {
            $scope.tripData = {};
        });
        swal(
          {
            title: "Trip Created successfully.",
            type: "success",
            showCancelButton: true,
            cancelButtonColor: "rgb(77, 179, 224)",
            cancelButtonText: "Create Another",
            confirmButtonColor: "rgb(77, 179, 224)",
            confirmButtonText: "Trip List",
            closeOnConfirm: true,
            html: false
          }, function(isConfirm){
             if (isConfirm) {
              $rootScope.redirect('/#!/main/tripList');
            } else {
              $rootScope.redirect('/#!/main/createTrip');
            }
          }
        );
      }
      else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    }
  };

  //HOME PAGE FUNCTION
  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };
  $scope.tripList = function () {
    $rootScope.redirect('/#!/main/tripList');
  };
});

materialAdmin.controller("tripDetailCtrl", function($rootScope, $scope, $localStorage,DateUtils ,$stateParams, LoginService, TripService) {
  $rootScope.showSideBar = false;

  if(!$rootScope.selectedUser){
    $rootScope.selectedUser = $localStorage.user;
  }

  

  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };

  $scope.tripList = function () {
    $rootScope.redirect('/#!/main/tripList');
  };

  $scope.cancel=function (user) {
    user.isEditing = false;
  };

  $scope.tripID = $stateParams.trip_id;
  if($rootScope.sTripDetails){
    $scope.tripD = $rootScope.sTripDetails;
    var getH = new Date($scope.tripD.start_time);
    var Hr1 = getH.getHours(); 
    $scope.tripD.hourSel1 = Hr1;
    var min1 = getH.getMinutes(); 
    $scope.tripD.minuteSel1 = min1;
    var getH2 = new Date($scope.tripD.end_time);
    var Hr2 = getH2.getHours(); 
    $scope.tripD.hourSel2 = Hr2;
    var min2 = getH2.getMinutes(); 
    $scope.tripD.minuteSel2 = min2;
    
  }else{
    function sTripResponse(response){
      var oRes = JSON.parse(response);
      if(oRes.status == 'OK'){
          var aRespTrip = [];
          var gotTrip =  oRes.data;
          //$scope.localTrip =  oRes.data;
          for(var i=0; i<gotTrip.length; i++){
            gotTrip[i].showBtn = true;
            var tripModify = {};
            tripModify = gotTrip[i];
            if(gotTrip[i].created_at){
              tripModify.create_time = moment(gotTrip[i].created_at).format("DD-MM-YYYY hh:MMa");
            }
            if(gotTrip[i].start_time){
              tripModify.start_time_local = moment(gotTrip[i].start_time).format("DD-MM-YYYY hh:MMa");
            }
            if(gotTrip[i].end_time){
              tripModify.end_time_local = moment(gotTrip[i].end_time).format("DD-MM-YYYY hh:MMa");
            }
            
            aRespTrip.push(tripModify);
          }
          $scope.tripD = aRespTrip[0];
          var getH = new Date($scope.tripD.start_time);
          var Hr1 = getH.getHours(); 
          $scope.tripD.hourSel1 = Hr1;
          var min1 = getH.getMinutes(); 
          $scope.tripD.minuteSel1 = min1;
          var getH2 = new Date($scope.tripD.end_time);
          var Hr2 = getH2.getHours(); 
          $scope.tripD.hourSel2 = Hr2;
          var min2 = getH2.getMinutes(); 
          $scope.tripD.minuteSel2 = min2;
          
      }else if(oRes.status == 'ERROR'){
        swal(oRes.message, "", "error");
      }
    };
    var getTrip = {};
    
    getTrip.request = 'get_trips';
    getTrip.trip_id = $scope.tripID;
    
    //getAlist.status = " ";
    getTrip.selected_uid = $localStorage.preservedSelectedUser.user_id;
    TripService.getAllTripsList(getTrip,sTripResponse);
  }

  //*************** custome Date time Picker for multiple date selection in single form ************
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
    $scope.formateDate = function(date){
      return new Date(date).toDateString();  
    };
    //********************//**********************//*****************//
    $scope.aHours = [];
    for(var h = 0;h<24;h++){
      $scope.aHours[h] = h;
    }
    $scope.aMinutes = [];
    for(var m = 0;m<60;m++){
      $scope.aMinutes[m] = m;
    }
  //************* custome Date time Picker for multiple date selection in single form ******************
  $scope.wrongDateRange = false;
  var dateTimeStart;
  var dateTimeEnd;
  $scope.getNoti = function(){
    /*if($scope.tripD.start_time && $scope.tripD.end_time){
      if($scope.tripD.end_time>$scope.tripD.start_time){
        $scope.wrongDateRange = false;
        dateTimeStart= $scope.tripD.start_time;
        dateTimeEnd = $scope.tripD.end_time;
      }else{
        $scope.wrongDateRange = true;
      }
    }*/
  }
  
  $scope.vehicleOptions = [];
  $scope.aGeoZoneList = [];
  //***************Self Invocing Anonymous Function*********************
  /*(function(){
    if ($localStorage && $localStorage.preservedSelectedUser && $localStorage.preservedSelectedUser.devices && $localStorage.preservedSelectedUser.devices[0]) {
      $scope.vehicleOptions = [];
      for(i=0; i<$localStorage.preservedSelectedUser.devices.length; i++) {
        if($localStorage.preservedSelectedUser.devices[i].reg_no){
          if($localStorage.preservedSelectedUser.devices[i].status != 'inactive'){
            $scope.vehicleOptions.push($localStorage.preservedSelectedUser.devices[i].reg_no);
          }
        }
      }
    }
  })();*/

  /*function geoListResponse(response){
    var oRes = JSON.parse(response);
    if(oRes){
      $scope.aGeoZoneList = [];
      if(oRes.status == 'OK'){
        for(var j=0; j<oRes.data.length; j++){
          if(oRes.data[j].name){
            $scope.aGeoZoneList.push(oRes.data[j].name);
          }
        }
      }
    }
  };

  (function(){
    if ($localStorage && $localStorage.preservedSelectedUser) {
      getGeoList = {};
      getGeoList.request = 'get_geozone';
      getGeoList.selected_uid = $localStorage.preservedSelectedUser.user_id;
      LoginService.getGeozoneList(getGeoList,geoListResponse);
    }
  })();*/

  $scope.sAllTripStatus = ['pending','started','loading','unloading','journey','complete'];

  $scope.updateTrip=function (tripD) {
    function tripDResponse(response){
      var oRes = JSON.parse(response);
      if(oRes.status == "OK"){
        swal(oRes.message,"","success");
      }else {
        swal(oRes.message,"","error");
      }
      $rootScope.redirect('/#!/main/tripList');
    };

    var updateData = {};
    //**** custom time add with date ******//
      var xx = new Date($scope.tripD.start_time);
      xx.setHours($scope.tripD.hourSel1);
      xx.setMinutes($scope.tripD.minuteSel1);
      $scope.tripD.start_time = xx;
      var yy = new Date($scope.tripD.end_time);
      yy.setHours($scope.tripD.hourSel2);
      yy.setMinutes($scope.tripD.minuteSel2);
      $scope.tripD.end_time = yy;

    //**** custom time add with date ******//
    tripD.start_time_n = $scope.tripD.start_time;
    tripD.end_time_n = $scope.tripD.end_time;
    //updateData.vehicle_no=tripD.vehicle_no;
    //updateData.source=tripD.source;
    //updateData.destination=tripD.destination;
    updateData.trip_no=tripD.trip_no;
    updateData.status=tripD.status;
    updateData.driver=tripD.driver;
    updateData.loading=tripD.loading;
    updateData.unloading=tripD.unloading;
    //updateData.journey=tripD.journey;
    updateData.duration=tripD.duration;
    //updateData.elapsed_time=tripD.elapsed_time;
    updateData.forworder=tripD.forworder;
    updateData.manager=tripD.manager;
    //updateData.delay=tripD.delay;
    updateData.remark1=tripD.remark1;
    updateData.remark2=tripD.remark2;
    updateData.remark3=tripD.remark3;
    updateData.cur_location=tripD.cur_location;
    updateData.cur_location.address=tripD.cur_location.address;
    updateData.start_time=tripD.start_time_n || tripD.start_time;
    updateData.end_time=tripD.end_time_n || tripD.end_time;

    updateData.selected_uid = $localStorage.preservedSelectedUser.user_id;
    updateData.request = "update_trip";
    updateData.created_at = tripD.created_at;
    updateData.trip_id = tripD.trip_id;
    TripService.updateTrip(updateData, tripDResponse);
        
  }; 
  $scope.iconChange = true;
  $scope.toggle = true;

  $scope.$watch('toggle', function(){
      $scope.toggleText = $scope.toggle ? 'Track on Map' : 'Back to List';
  })

  $scope.callFirst = true;
  $scope.trackSingleTrip = function(tripD){
    $rootScope.trackAllTrip(tripD);
  }


});

materialAdmin.controller("tripMapCtrl", function($rootScope, $scope, $localStorage, LoginService, TripService) {
  $rootScope.showSideBar = false;

  if(!$rootScope.selectedUser){
    $rootScope.selectedUser = $localStorage.user;
  }

  $scope.homePage = function () {
    $rootScope.redirect('/#!/main/user');
  };

  $scope.tripList = function () {
    $rootScope.redirect('/#!/main/tripList');
  };
  $scope.aTripData = [];

  var myMap,map,infoWindow,zoomLevel,devices;
  myMap = {
    zoom: 5,
    center: new google.maps.LatLng(25,77),
    title: 'Click to zoom',
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById('tripMap'), myMap);
  infoWindow = new google.maps.InfoWindow();

  $scope.deviceOnMap = function(devices){
    $scope.aDevices = [];
    if(!$scope.aPlotDevices){
      $scope.aPlotDevices = [];
    }
    for(var z=0;z<devices.length;z++){ 
      if(devices[z] && devices[z].lat && devices[z].lng){
        if(devices[z].status != 'inactive'){
          $scope.createTripMarker(devices[z]);
        }
      }
    };
    
  };

  $scope.createTripMarker = function(info){
    console.log(info);
  };

  if($rootScope.trackTrips && $rootScope.trackTrips.length>0){
    for(var x=0;x<$rootScope.trackTrips.length;x++){
      $scope.aTripData.push($rootScope.trackTrips[x].cur_location);
    }
  }

  devices = $scope.aTripData;
  $scope.deviceOnMap(devices);
  

});
