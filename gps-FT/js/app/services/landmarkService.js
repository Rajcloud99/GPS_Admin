
materialAdmin.service('landmarkService',
    [	'HTTPConnection',
        '$localStorage',
        'URL',
        function(
            HTTPConnection,
            $localStorage,
            URL
        ){

            // functions Identifiers
            this.getLandmark = getLandmark;
            this.addLandmark = addLandmark;
            this.uploadBulk = uploadBulk;
            this.downloadLandmark = downloadLandmark;
            this.updateLandmark = updateLandmark;
            this.removeLandmark = removeLandmark;

            // Actual Functions


            function getLandmark(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.GET_LANDMARK, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };

            function downloadLandmark(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.DOWNLOAD_LANDMARK, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };

            function addLandmark(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.ADD_LANDMARK, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };

            function updateLandmark(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.UPDATE_LANDMARK, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };


            function removeLandmark(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.REMOVE_LANDMARK, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };

            function uploadBulk(request, successCallback, failureCallback) {

                // request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
                request.authorizationToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJrZCJ9.ipXUQ4BVEE6rVP7KAVhSh4bm8JgbU1vkRGY4PFhFUvw";
                HTTPConnection.post(URL.UPLOAD_FILE, request, onSuccess, onFailure);

                function onSuccess(data) {
                    if(typeof successCallback === 'function')
                        successCallback(data.data);
                }
                function onFailure(data) {
                    if(typeof failureCallback === 'function')
                        failureCallback(data.data);
                }
            };


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
