materialAdmin.service('URL', ['DateUtils','$location', function(DateUtils,$location,) {
    var oConfig;
    var urlParams = $location.search();
    if(urlParams && urlParams.source){
        oConfig = getAppConfig(urlParams.source);
    }else{
        oConfig = getAppConfig();
    }
    this.BASE_URL = oConfig.base_url;
    this.LMS_URL = oConfig.lms_url;
    this.GEO_URL = oConfig.geo_url;
    this.TRUCKU_URL = oConfig.trucku_url;
    this.app_key = oConfig.app_key;

    this.GET_REPORT = this.GEO_URL + 'api/alert/get';
    this.GET_ALERT_BY_GROUP = this.GEO_URL + 'alert/groupAlerts';
    this.VEHICLE_EXCEPTION_RPT = this.GEO_URL + 'alert/vehicleExceptionsRpt';
    this.GET_ALERT_REPORT = this.GEO_URL + 'alert/getAlerts';
    this.GET_ALERT = this.GEO_URL + 'alert/get';
    this.GET_ALERTV2 = this.GEO_URL + 'alert/getV2';
    this.GET_ACTION_ALERT = this.GEO_URL + 'alert/action_alerts';
    this.GET_DAY_WISE_TAG_REPORT = this.GEO_URL + 'alert/day_wise_tag';
    this.UPDATE_ALERT = this.GEO_URL + 'alert/upsert';
    this.DRIVER_DAY_ACTIVITY = oConfig.trucku_url + 'api/reports/driver_day_activity';
    this.GET_DEVICE = oConfig.trucku_url + 'api/device/get_device';
    this.ADD_LANDMARK = this.GEO_URL + 'landmark/add';
    this.GET_LANDMARK = this.GEO_URL + 'landmark/get';
    this.DOWNLOAD_LANDMARK = this.GEO_URL + 'landmark/reports';
    this.UPDATE_LANDMARK = this.GEO_URL + 'landmark/update';
    this.REMOVE_LANDMARK = this.GEO_URL + 'landmark/remove';
    this.UPLOAD_FILE = this.GEO_URL + 'landmark/bulkAdd';
    this.GET_BEAT = this.GEO_URL + 'beat/get';
    this.ADD_BEAT = this.GEO_URL + 'beat/add';
    this.UPDATE_BEAT = this.GEO_URL + 'beat/update';
    this.REMOVE_BEAT = this.GEO_URL + 'beat/remove';
    this.GET_TRIPS = this.LMS_URL + 'api/trips/getTrip';
    this.LIVE_TRACKER_VEHICLE = 'api/tracking/vehiclewise';
    this.VEHICLE_PLAYBACK = this.TRUCKU_URL + 'api/reports/playback';

    // Student Parent
    this.ADD_PARENT_RFID    = this.GEO_URL + 'parentDetail/add';
    this.UPDATE_PARENT_RFID = this.GEO_URL + 'parentDetail/update';
    this.GET_PARENT_RFID    = this.GEO_URL + 'parentDetail/get';
    this.RFID_NAME_TRIM     = this.GEO_URL + 'parentDetail/getOne';

    // Gps Report
    this.HALT_REPORT = this.TRUCKU_URL + 'api/reports/parking';
    this.COMBINED_HALT_REPORT = this.TRUCKU_URL + 'api/reports/combinedHalts';
    this.OVERSPEED_REPORT = this.TRUCKU_URL + 'api/reports/overspeed';
    this.ACTIVITY_REPORT = this.TRUCKU_URL + 'api/reports/activity';
    this.DETAILED_ACTIVITY_REPORT = this.TRUCKU_URL + 'api/reports/activity_interval';
    this.DETAIL_ANALYSIS_REPORT = this.TRUCKU_URL + 'api/reports/detailAnalysis';
    this.KILOMITER_REPORT = this.TRUCKU_URL + 'api/reports/km';
    this.MILEAGE_REPORT = this.TRUCKU_URL + 'api/reports/mileage2';
    this.DRIVER_ACTIVITY = this.TRUCKU_URL + 'api/reports/driver_activity';
    this.BEAT_REPORT = this.TRUCKU_URL + 'api/reports/beat_analysis';

}]);
