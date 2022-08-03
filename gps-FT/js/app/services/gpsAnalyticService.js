
materialAdmin.service('gpsAnalyticService',
    [	'HTTPConnection',
        'URL',
        function(
            HTTPConnection,
            URL
        ){

            // functions Identifiers
            this.getReport              = getReport;
            this.getAlertByGroup        = getAlertByGroup;
            this.alertReport            = alertReport;
            this.getAlerts              = getAlerts;
            this.getAlertsV2              = getAlertsV2;
            this.vehicleExceptionsRpt   = vehicleExceptionsRpt;
            this.getActionAlerts        = getActionAlerts;
            this.detailsAnalysisReport  = detailsAnalysisReport;
            this.downloadReport         = downloadReport;
            this.driverDayActivity      = driverDayActivity;
            this.updateAlerts           = updateAlerts;
            this.getDayWiseTagReport    = getDayWiseTagReport;
            this.getRfidName            = getRfidName;
            this.getDevice              = getDevice;
            this.getTrips              = getTrips;

            // Actual Functions

            function getReport(request, successCallback) {

                HTTPConnection.post(URL.GET_REPORT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getAlertByGroup(request, successCallback) {

                HTTPConnection.post(URL.GET_ALERT_BY_GROUP, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function vehicleExceptionsRpt(request, successCallback) {

                HTTPConnection.post(URL.VEHICLE_EXCEPTION_RPT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }


            function alertReport(request, successCallback) {

                HTTPConnection.post(URL.GET_ALERT_REPORT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getAlerts(request, successCallback) {

                HTTPConnection.post(URL.GET_ALERT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getAlertsV2(request, successCallback) {

                HTTPConnection.post(URL.GET_ALERTV2, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }


            function getActionAlerts(request, successCallback) {

                HTTPConnection.post(URL.GET_ACTION_ALERT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getDayWiseTagReport(request, successCallback) {

                HTTPConnection.post(URL.GET_DAY_WISE_TAG_REPORT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getRfidName(request, successCallback) {
                var url_with_params = URL.RFID_NAME_TRIM + '?rfid='+ request.rfid;
                HTTPConnection.post(url_with_params, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function updateAlerts(request, successCallback) {

                HTTPConnection.post(URL.UPDATE_ALERT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function detailsAnalysisReport(request, successCallback) {

                HTTPConnection.post(URL.DETAIL_ANALYSIS_REPORT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function driverDayActivity(request, successCallback) {

                HTTPConnection.post(URL.DRIVER_DAY_ACTIVITY, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getDevice(request, successCallback) {

                HTTPConnection.post(URL.GET_DEVICE, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function getTrips(request, successCallback) {

                var url = request.url || URL.GET_TRIPS; // modify url

                HTTPConnection.post(url, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function downloadReport(request, successCallback) {

                let url;
                switch (request.reportType){
                    case "report_parking": url = URL.HALT_REPORT; break;
                    case "report_combined_halts": url = URL.COMBINED_HALT_REPORT; break;
                    case "report_overspeed": url = URL.OVERSPEED_REPORT; break;
                    case "report_activity": url = URL.ACTIVITY_REPORT; break;
                    case "report_activity_interval": url = URL.DETAILED_ACTIVITY_REPORT; break;
                    case "details_analysis": url = URL.DETAIL_ANALYSIS_REPORT; break;
                    case "report_mileage2": url = URL.KILOMITER_REPORT; break;
                    case "report_mileage": url = URL.MILEAGE_REPORT; break;
                    case "report_driver_activity": url = URL.DRIVER_ACTIVITY; break;
                    case "report_driver_activity_single": url = URL.DRIVER_ACTIVITY; break;
                    case "report_beat_analysis": url = URL.BEAT_REPORT; break;
                }

                HTTPConnection.post(url, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function prepareParameters(oFilter) {
                var sParam = "";

                for (var property in oFilter) {
                    sParam = sParam + "&" + property + "=" + encodeURIComponent(oFilter[property]);
                }
                return sParam;
            }

            function onFailure({data}) {
                swal('Error', data.message, 'error');
            }

        }
    ]
);
