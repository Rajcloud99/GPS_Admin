
materialAdmin.service('beatService',
    [	'HTTPConnection',
        'URL',
        function(
            HTTPConnection,
            URL
        ){

            // functions Identifiers
            this.getBeat              = getBeat;
            this.addBeat              = addBeat;
            this.updateBeat           = updateBeat;
            this.removeBeat           = removeBeat;

            // Actual Functions

            function getBeat(request, successCallback) {

                HTTPConnection.post(URL.GET_BEAT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function addBeat(request, successCallback) {

                HTTPConnection.post(URL.ADD_BEAT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function updateBeat(request, successCallback) {

                HTTPConnection.post(URL.UPDATE_BEAT, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
            }

            function removeBeat(request, successCallback) {

                HTTPConnection.post(URL.REMOVE_BEAT, request, onSuccess, onFailure);

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
