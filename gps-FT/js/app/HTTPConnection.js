materialAdmin.service('HTTPConnection', ['$http', '$q', '$sessionStorage', '$localStorage', '$timeout', 'cacheData', function($http, $q, $sessionStorage, $localStorage, $timeout, cacheData) {
    // if bypass == true then alert will not be displayed on failure
    this.get = function(url, success, failure,  bypass) {

        let cache, cacheTime, cachePtr;

        url = url.replace(/\$_cache(.*?)&/, function(replacedString){
            cache = replacedString.slice(0,-1).split('=')[1];
            return '&';
        });

        url = url.replace(/\$_cacheTime(.*?)&/, function(replacedString){
            cacheTime = replacedString.slice(0,-1).split('=')[1];
            return '&';
        });

        if(cache){
            cachePtr = cacheData.init(Number(cacheTime) || false);
            let cData;
            let urlKey = url.match(/:\/\/(.*?)\?/);

            if(urlKey && (urlKey = urlKey[0].slice(3,-1))){
                // urlKey
                cache = cache === 'true' && urlKey || cache || false ;

                if(cData = cachePtr.load(cache)){
                    $timeout(function(){
                        success(cData);
                    });
                    return;
                }
            }
        }

        options = {
            headers: {
                'Authorization': ($sessionStorage.token ||
                ($localStorage.ft_data && $localStorage.ft_data.token)?$localStorage.ft_data.token:undefined)
            }
        };
        // $http returns a promise, which has a then function, which also returns a promise
        var deferred = $q.defer()
        //		$http.defaults.headers.common.Authorization = $sessionStorage.token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno'
        //		$http.defaults.headers.get = {}
        //		$http.defaults.headers.get.Authorization = $sessionStorage.token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno'
        //		$httpProvider.defaults.headers.get = { 'Authorization' : $sessionStorage.token }
        // The then function here is an opportunity to modify the response
        var promise = $http.get(url, options).then(function(response) {

            if(cache && cachePtr)
                cachePtr.upsert(cache, response);
            success(response, deferred);

        }, function(response) {
            if (failure) {
                failure(response, deferred)
            }
            if (bypass == undefined || bypass != true) {
                var errorMessage = 'Unable to process the request. Please try again.';
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message;
                }
                else if (response && response.data && response.data.error_message) {
                    errorMessage = response.data.error_message;
                }
                $.growl({
                    message: errorMessage
                }, {
                    type: 'danger'
                })
            }
        }).catch(function(e) {
            console.log(e)
        });

        return deferred.promise
    };

    // if bypass == true then alert will not be displayed on failure
    this.post = function(url, data, success, failure, bypass) {

        let cache, cacheTime, cachePtr;

        let urlKey = url.match(/:\/\/(.*)/);
        if(urlKey && (urlKey = urlKey[0].slice(3,-1))){

            cache = typeof data.$_cache === 'boolean' && data.$_cache ? urlKey : typeof data.$_cache === 'string' ? data.$_cache : false ;
            cacheTime = typeof data.$_cacheTime === 'Number' ? data.$_cacheTime : false ;
            delete data.$_cache;
            delete data.$_cache;

            if(cache){
                let cData;
                cachePtr = cacheData.init(Number(cacheTime) || false);

                if(cData = cachePtr.load(cache)){
                    $timeout(function(){
                        success(cData);
                    });
                    return;
                }
            }
        }

        // $http returns a promise, which has a then function, which also returns a promise
        var deferred = $q.defer();
        var options = {
            headers: {}
        };
        let gpsgaadiAdminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJER0ZDIn0.Yt9SM10dq7L8FqISaMdiCqJRVtL1xesy6gjnAeNDYAI';
        let lmsadminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1YjcwODE5MGE2MWUzMzEzOTliM2YyMzMiLCJyYW5kX3N0ciI6Ilh6NlZlUTczIiwiY2xpZW50SWQiOiIxMDgwOCJ9.yr1gKq1E0YntQ49t1hceIQirpb01hWTuKScmR0Y-yz8';
        options = {
            headers: {
                'Authorization': data.lms_token || gpsgaadiAdminToken,
                'Content-Type': 'application/json'
            }

        };
        if (data.fileUpload) {
            options = {
                headers: {
                    'Authorization': ($sessionStorage.token ||
                    ($localStorage.ft_data && $localStorage.ft_data.token)?$localStorage.ft_data.token:undefined),
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            };
            data = data.formData
        }
        // The then function here is an opportunity to modify the response
        var promise = $http.post(url, data, options).then(function(response) {

            if($localStorage.ft_data){
                $localStorage.ft_data.dashBoardDirty = true
            }
            if(cache && cachePtr)
                cachePtr.upsert(cache, response);
            success(response, deferred);

        }, function(response) {
            if (failure) {
                failure(response, deferred)
            }
            if (bypass == undefined || bypass != true) {
                var errorMessage = 'Unable to process the request. Please try again.'
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message;
                }
                else if (response && response.data && response.data.error_message) {
                    errorMessage = response.data.error_message
                }
                $.growl({
                    message: errorMessage
                }, {
                    type: 'danger'
                })
            }
        }).catch(function(e) {
            console.log(e && e.message,'in post of http conn');
        });

        return deferred.promise
    }

    this.put = function(url, data, success, failure, bypass) {
        var options = {
            headers: {}
        }
        options = {
            headers: { 'Authorization': ($sessionStorage.token ||
                ($localStorage.ft_data && $localStorage.ft_data.token)?$localStorage.ft_data.token:undefined), 'Content-Type': 'application/json' }
        }
        if (data && data._id) {
            // removes ids from the object if available, because it should not be passed to the server
            delete data._id
        }
        if (data.fileUpload) {
            options = {
                headers: {
                    'Authorization': ($sessionStorage.token ||
                    ($localStorage.ft_data && $localStorage.ft_data.token)?$localStorage.ft_data.token:undefined),
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }
            data = data.formData
        }
        // $http returns a promise, which has a then function, which also returns a promise
        var deferred = $q.defer()
        // The then function here is an opportunity to modify the response
        var promise = $http.put(url, data, options).then(function(response) {
            success(response, deferred)
        }, function(response) {
            if (failure) {
                failure(response, deferred)
            }
            var errObj = JSON.parse(response.data.error_message);
            if (bypass == undefined || bypass != true) {
                // alert("Unable to process the request. Please try again.")
                if (response && response.data && response.data.error_message) {
                    errorMessage = response.data.error_message
                }
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message
                }
                if(errObj.errno === -4058) {
                    errorMessage = 'Selected file is not supported. Please select a valid contract copy document.';
                }
                swal(errorMessage, '', 'error')
            }
        }).catch(function(e) {})

        return deferred.promise
    }

    this.delete = function(url, data, success, failure) {
        var options = {
            headers: {
                'Authorization': $sessionStorage.token ||
                    $localStorage.ft_data.token,
                'Content-Type': 'application/json'
            }
        }
        if (data && data._id) {
            delete data._id
        }
        return $http.delete(url, options)
            .then(function successCallback(response) {
                if($localStorage.ft_data){
                    $localStorage.ft_data.dashBoardDirty = true
                }
                success(response); // , deferred)
            }, function failureCallback(response) {
                failure(response)
            })
    }

    this.postOver = function (url, data, option = null) {

        if(!option)
            options = {
                headers: {
                    'Authorization': ($sessionStorage.token ||
                    ($localStorage.ft_data && $localStorage.ft_data.token)?$localStorage.ft_data.token:undefined),
                    'Content-Type': 'application/json'
                }

            };

        return $http.post(url, data, option)
    }
}]);
