materialAdmin.factory('$remember', function() {
    return function(name, values) {
        var cookie = name + '=';

        cookie += values + ';';

        var date = new Date();
        date.setDate(date.getDate() + 365);

        cookie += 'expires=' + date.toString() + ';';

        document.cookie = cookie;
    }
});

materialAdmin.factory('$forget', function() {
    return function(name) {
        var cookie = name + '=;';
        cookie += 'expires=' + (new Date()).toString() + ';';

        document.cookie = cookie;
    }
});