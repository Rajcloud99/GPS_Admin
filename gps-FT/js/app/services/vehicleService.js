materialAdmin.service('Vehicle', [
	'$localStorage',
	'$rootScope',
	'$timeout',
	'cacheData',
	'HTTPConnection',
	'URL',
	'utils',
	function (
		$localStorage,
		$rootScope,
		$timeout,
		cacheData,
		HTTPConnection,
		URL,
		utils,
	) {

		let that = this;

		this.vehicleWiseAll = function (request, successCallback, failureCallback) {
			request['__SRC__'] = 'WEB';
			let url = request.url;
			delete request.url;
			let obj = {
				aTrSheetDevice: [],
				statusCount: 0,
				totalCount: 0,
				gpsStatus: {
					running: 0,
					stopped: 0,
					inactive: 0,
					offline: 0,
					active: 0
				},
				vehicleStatus: {
					inTrip: 0,
					maintenance: 0,
					booked: 0,
					available: 0,
					other: 0,
					empty: 0
				},
				delayStatus: {
					delay: 0,
					early: 0,
					onTime: 0,
					overRan: 0,
				},
				runStats: {
					todayRun: 0,
					weekRun: 0,
					monthRun: 0,
					avgRun: 0
				}
			};

			HTTPConnection.post(url + URL.LIVE_TRACKER_VEHICLE, request, onSuccess, onFailure);

			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(res) {

				tracksheetDataArrange(res.data);
				/////*****************************get all maps and add data on map****************/

				obj.totalCount = res.count;
				if (obj.aTrSheetDevice.length < res.count) {
					obj.aTrSheetDevice = obj.aTrSheetDevice.concat(res.data)
				}

				if (typeof successCallback === 'function')
					successCallback(obj, res.data);
			}

			function tracksheetDataArrange(oRes) {
				if (oRes && oRes.length > 0) {
					for (var j = 0; j < oRes.length; j++) {

						obj.statusCount = obj.statusCount || {};
						obj.statusCount[oRes[j].vehicle.status] = obj.statusCount[oRes[j].vehicle.status] ?
							obj.statusCount[oRes[j].vehicle.status] + 1 : 1;

						switch (oRes[j].vehicle.status) {
							case "In Trip" :
								obj.vehicleStatus.inTrip++;
								break;
							case "Maintenance" :
								obj.vehicleStatus.maintenance++;
								break;
							case "Available" :
								obj.vehicleStatus.available++;
								break;
							case "Booked" :
								obj.vehicleStatus.booked++;
								break;
							default:
								obj.vehicleStatus.other++;
						}

						if (!oRes[j].vehicle.gpsData) {
							obj.gpsStatus.inactive++;
							continue;
						} else
							obj.gpsStatus.active++;

						setStatus(oRes[j].vehicle.gpsData);

						oRes[j].vehicle.gpsData.vehicle_no = oRes[j].vehicle.vehicle_reg_no;
						if (oRes[j].vehicle.gpsData.location_time) {
							oRes[j].vehicle.gpsData.stoppage_time = utils.calTimeDiffCurrentToLastInDHM(oRes[j].vehicle.gpsData.location_time);
						}
						oRes[j].lat = oRes[j].vehicle.gpsData.lat;
						oRes[j].lng = oRes[j].vehicle.gpsData.lng;

						switch (oRes[j].vehicle.gpsData.status) {
							case "running":
								oRes[j].vehicle.gpsData.s_status = 0;
								obj.gpsStatus.running++;
								break;
							case "stopped":
								oRes[j].vehicle.gpsData.s_status = 1;
								obj.gpsStatus.stopped++;
								break;
							case "offline":
								oRes[j].vehicle.gpsData.s_status = 2;
								obj.gpsStatus.offline++;
								break;
							default:
								break;
						}

						switch (oRes[j].status) {
							case 'Delayed':
								obj.delayStatus.delay++;
								break;
							case 'Early':
								obj.delayStatus.early++;
								break;
							case 'On Time':
								obj.delayStatus.onTime++;
								break;
						}
					}
				}
			}
		};

		this.getplayData = function(playData, successCallback) {

			HTTPConnection.post(URL.VEHICLE_PLAYBACK, playData, onSuccess);

			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		};

	}]);
