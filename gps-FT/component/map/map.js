materialAdmin
    .directive('map', mapWrapper);

materialAdmin
    .directive('mapLoad', map);

mapWrapper.$inject = [
    '$compile'
];

map.$inject = [
    '$timeout',
    'utils'
];

const PRIVATE_KEY_GOOGLE = 'AIzaSyAluwUWvBhUcZtAcFzTIo0H5ukdacPoFhQ';

MarkerClusterer.prototype.remove = function() {};

function mapWrapper($compile){
    return {
        link: function (scope, element, attrs) {
            let jsElm = document.createElement("script");
            jsElm.type = "text/javascript";
            jsElm.src = `https://maps.googleapis.com/maps/api/js?key=${PRIVATE_KEY_GOOGLE}&callback=angular.noop`;
            jsElm.async = true;
            jsElm.defer = true;
            document.body.appendChild(jsElm);
            jsElm.onload = function () {
                let htm = `<map-load map-api="${attrs.mapApi}" ></map-load>`;
                let compiled = $compile(htm)(scope);
                element.append(compiled);
            };

            // let clusterEle = document.createElement('script');
            // clusterEle.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js';
            // clusterEle.type = 'text/javascript';
            // $('body').append(clusterEle);
            // clusterEle.onload = function () {
            // 	G_CLUSTER = MarkerClusterer;
            // };
        }
    };
}

function map(
    $timeout,
    utils
) {

    const G_MAP = google.maps,
        G_MAP_EVENT = G_MAP.event,
        G_LAT_LNG = G_MAP.LatLng,
        G_CLUSTER = MarkerClusterer,
        G_DIRECTION = G_MAP.DirectionsService,
        G_TRAFFIC = G_MAP.TrafficLayer,
        G_DIRECTION_RENDER = G_MAP.DirectionsRenderer;

    const IMAGES = window.location.origin + '/img/';
    const ICON_CONFIG = {
        // iconSize: new G_MAP.Size(35, 47)
    };
    const ICON = {
        start: IMAGES + 'start.png',
        stop: IMAGES + 'stop.png',
        truck: {
            // path: "M175.4,254.6H93.2V102.8h10.9c-0.9-4.1-1.5-0.5-9.7-2.6c-2.5-6.2-1-42.9-1.1-53.2l-10.5,2.5 c-1.9,0-1.3,0.4-1.2-1.6c3.8-3.7,8.8-5.6,12-8.4c0.8-14.5,2.5-20.3,17.7-22c1.1-0.1,3.4-0.2,4.3-0.4c4.6-1.1-2.7-1.6,13-1.6 c6.5,0,13.4-0.2,19.7,0.1l1.1,1.7l5.7,0.4c13.4-0.3,15.2,6.3,17.7,13.9c2.2,6.6,0.5,6.9,6,9.8c3.9,2.1,6.7,3.9,8.9,6.7 c0.1,1.9,0.5,1.4-1.3,1.4l-10.6-2.6c0.1,6.7,1.3,45.2-0.2,50.3c-1.6,5.4-6.1,3.1-9.3,3.7c-3.3,0.6-1.8-1.2-2.6,2h11.6V254.6z  M156.9,19.4c-0.1,3.6,2.8,5.8,5,7.2c2.7,1.9,5.1,4,8.3,4.5C170.2,24,164,19.7,156.9,19.4z M110,19.6c-7.5-0.4-13,4.5-13.3,11.6 C101.6,30.1,110.4,24.1,110,19.6z M172.5,86.5l-8.9,0c0,8.4,0.9,9.9,8.9,10.3L172.5,86.5z M105.8,87.8l-2.9-0.2l-2.3,0l-3.9,0.1 l0,10.3C105.3,97.9,105.5,96.1,105.8,87.8z M96.8,44.1l-0.2,5.2l0,18.9v4.5v6.1l0,6.3h9.6C106.2,66.2,108.9,54.6,96.8,44.1z  M172.8,43c-12,6.8-10.5,29.7-9.4,40.9l9.2,0L172.8,43z M168.5,38c-7.9-4.7-60.2-5.4-69.2-0.6c0,1.9,6.2,15.2,10.3,15.2 c1.5,0,9.1-1.1,11.5-1.4c4.3-0.5,12.7-4.8,22.8-0.7c3.4,1.4,8.4,1.1,12.2,1.7c6.2,0.9,5.6-0.8,8.2-5.2 C166,44.1,168.6,41.4,168.5,38z",
            // path: "M507.944,523.29h-16.011v-29.565h2.123c-0.175-0.798-0.292-0.097-1.889-0.506 c-0.487-1.208-0.195-8.355-0.214-10.362l-2.045,0.487c-0.371,0-0.253,0.077-0.234-0.312c0.741-0.721,1.714-1.091,2.337-1.636 c0.156-2.825,0.487-3.954,3.448-4.285c0.214-0.021,0.662-0.039,0.837-0.078c0.896-0.214-0.526-0.312,2.532-0.312 c1.266,0,2.61-0.039,3.836,0.02l0.215,0.331l1.11,0.078c2.611-0.059,2.961,1.228,3.447,2.708c0.428,1.285,0.098,1.344,1.169,1.908 c0.761,0.409,1.306,0.76,1.734,1.306c0.018,0.37,0.095,0.272-0.255,0.272l-2.063-0.507c0.021,1.306,0.253,8.804-0.04,9.797 c-0.313,1.052-1.187,0.604-1.812,0.72c-0.642,0.117-0.35-0.233-0.505,0.39h2.259v29.545H507.944z M504.341,477.481 c-0.02,0.701,0.545,1.13,0.973,1.403c0.526,0.37,0.994,0.779,1.616,0.876C506.93,478.378,505.723,477.541,504.341,477.481z  M495.206,477.521c-1.461-0.078-2.533,0.876-2.59,2.259C493.569,479.566,495.283,478.397,495.206,477.521z M507.379,490.551h-1.733 c0,1.636,0.175,1.928,1.733,2.005V490.551z M494.387,490.804l-0.565-0.039h-0.448l-0.759,0.02v2.006 C494.29,492.771,494.329,492.42,494.387,490.804z M492.634,482.292l-0.039,1.014v3.681v0.876v1.188v1.227h1.87 C494.465,486.597,494.991,484.337,492.634,482.292z M507.437,482.078c-2.338,1.325-2.046,5.785-1.832,7.966h1.795L507.437,482.078z  M506.601,481.104c-1.54-0.916-11.727-1.052-13.479-0.117c0,0.37,1.208,2.96,2.006,2.96c0.292,0,1.773-0.214,2.24-0.272 c0.838-0.097,2.474-0.935,4.44-0.136c0.662,0.271,1.637,0.214,2.376,0.331c1.207,0.175,1.092-0.156,1.597-1.013 C506.112,482.292,506.62,481.766,506.601,481.104z",
            path: "M13.55 0L13.72 0L13.88 0L14.04 0L14.2 0L14.36 0L14.52 0.01L14.69 0.01L14.85 0.01L15.01 0.01L15.17 0.01L15.33 0.01L15.49 0.01L15.65 0.01L15.81 0.01L15.97 0.01L16.13 0.02L16.28 0.02L16.65 0.02L16.98 0.02L17.29 0.02L17.56 0.02L17.81 0.02L18.03 0.03L18.23 0.03L18.41 0.03L18.56 0.04L18.7 0.05L18.81 0.05L18.91 0.06L19 0.07L19.07 0.08L19.13 0.09L19.18 0.1L19.22 0.11L19.25 0.12L19.27 0.13L19.29 0.14L19.31 0.15L19.32 0.17L19.33 0.18L19.35 0.2L19.36 0.21L19.39 0.23L19.41 0.25L19.44 0.27L19.48 0.28L19.53 0.3L19.59 0.32L19.67 0.34L19.76 0.37L19.86 0.39L19.88 0.39L19.91 0.4L19.93 0.4L19.96 0.4L19.99 0.41L20.02 0.41L20.06 0.41L20.09 0.42L20.12 0.42L20.16 0.42L20.2 0.43L20.23 0.43L20.27 0.43L20.31 0.44L20.35 0.44L20.39 0.44L20.43 0.44L20.47 0.45L20.51 0.45L20.55 0.45L20.59 0.45L20.63 0.46L20.75 0.46L20.78 0.46L20.82 0.47L20.86 0.47L20.89 0.47L20.92 0.47L20.95 0.47L20.99 0.48L21.01 0.48L21.04 0.48L21.4 0.52L21.74 0.56L22.06 0.61L22.37 0.66L22.66 0.72L22.93 0.79L23.18 0.86L23.42 0.93L23.65 1.02L23.86 1.11L24.05 1.2L24.23 1.3L24.4 1.41L24.56 1.53L24.7 1.66L24.84 1.79L24.96 1.93L25.07 2.07L25.18 2.23L25.27 2.39L25.36 2.56L25.43 2.74L25.5 2.93L25.56 3.12L25.62 3.33L25.67 3.54L25.71 3.77L25.75 4L25.79 4.24L25.82 4.5L25.84 4.76L25.87 5.03L25.89 5.31L25.91 5.61L25.99 5.66L26.07 5.72L26.15 5.77L26.24 5.83L26.33 5.88L26.42 5.94L26.51 5.99L26.6 6.04L26.7 6.09L26.79 6.14L26.89 6.19L26.99 6.25L27.09 6.3L27.19 6.35L27.4 6.45L27.5 6.51L27.6 6.56L27.71 6.61L27.81 6.67L27.91 6.72L28.02 6.78L28.12 6.84L28.22 6.9L28.33 6.96L28.43 7.02L28.53 7.08L28.63 7.14L28.73 7.21L28.83 7.28L28.93 7.34L29.02 7.42L29.12 7.49L29.21 7.56L29.21 7.6L29.22 7.64L29.22 7.67L29.22 7.71L29.23 7.73L29.23 7.76L29.24 7.79L29.24 7.81L29.25 7.83L29.25 7.85L29.25 7.86L29.25 7.88L29.26 7.89L29.26 7.9L29.26 7.91L29.25 7.92L29.25 7.92L29.25 7.93L29.24 7.93L29.23 7.94L29.22 7.94L29.21 7.94L29.2 7.94L29.18 7.94L29.17 7.94L29.15 7.94L29.12 7.94L29.07 7.94L29.04 7.94L29 7.94L28.97 7.94L28.92 7.94L28.88 7.94L25.99 7.35L25.99 7.58L25.99 7.84L25.99 8.12L26 8.43L26 8.77L26.01 9.13L26.02 9.5L26.03 9.9L26.03 10.31L26.04 10.73L26.05 11.16L26.06 11.61L26.07 12.06L26.08 12.52L26.08 12.98L26.09 13.45L26.09 13.91L26.09 14.37L26.09 14.82L26.09 15.27L26.08 15.72L26.07 16.15L26.06 16.56L26.05 16.97L26.03 17.35L26.01 17.72L25.99 18.07L25.96 18.39L25.93 18.69L25.89 18.96L25.85 19.21L25.8 19.42L25.75 19.6L25.69 19.75L25.5 19.79L25.31 19.82L25.14 19.85L24.98 19.87L24.82 19.89L24.68 19.9L24.54 19.91L24.42 19.91L24.3 19.91L24.19 19.91L24.08 19.91L23.99 19.91L23.9 19.9L23.82 19.89L23.74 19.89L23.67 19.88L23.6 19.88L23.54 19.87L23.49 19.87L23.44 19.87L23.39 19.87L23.35 19.87L23.31 19.88L23.27 19.9L23.24 19.91L23.21 19.94L23.18 19.96L23.16 20L23.13 20.04L23.11 20.09L23.09 20.14L23.07 20.2L23.04 20.27L23.02 20.35L26.02 20.35L26.02 55.72L3.44 55.72L3.44 20.38L6.63 20.38L6.61 20.31L6.6 20.26L6.59 20.2L6.58 20.16L6.57 20.12L6.56 20.08L6.56 20.05L6.55 20.02L6.55 20L6.55 19.96L6.55 19.95L6.55 19.94L6.54 19.93L6.54 19.92L6.54 19.92L6.53 19.92L6.52 19.92L6.51 19.92L6.5 19.92L6.49 19.92L6.47 19.93L6.45 19.93L6.42 19.93L6.39 19.94L6.36 19.94L6.33 19.94L6.28 19.94L6.24 19.94L6.18 19.94L6.13 19.94L6.06 19.93L5.99 19.92L5.92 19.91L5.84 19.9L5.76 19.89L5.67 19.89L5.59 19.89L5.51 19.88L5.42 19.89L5.34 19.89L5.25 19.89L5.16 19.9L5.08 19.9L4.99 19.9L4.9 19.91L4.81 19.91L4.73 19.91L4.64 19.91L4.56 19.9L4.47 19.9L4.39 19.89L4.31 19.88L4.23 19.86L4.15 19.84L4.07 19.82L4 19.79L3.92 19.76L3.85 19.72L3.79 19.67L3.72 19.62L3.66 19.56L3.6 19.49L3.54 19.42L3.49 19.34L3.44 19.25L3.4 19.15L3.36 19.05L3.32 18.92L3.29 18.76L3.27 18.56L3.24 18.33L3.22 18.07L3.2 17.78L3.19 17.46L3.18 17.12L3.17 16.75L3.16 16.37L3.15 15.97L3.15 15.55L3.15 15.12L3.15 14.68L3.16 14.24L3.16 13.78L3.17 13.33L3.17 12.87L3.18 12.42L3.19 11.97L3.2 11.52L3.21 11.08L3.22 10.66L3.23 10.24L3.24 9.85L3.25 9.46L3.26 9.1L3.27 8.77L3.27 8.45L3.28 8.16L3.29 7.91L3.29 7.68L3.3 7.49L3.3 7.33L0.39 7.94L0.35 7.94L0.31 7.94L0.27 7.94L0.24 7.94L0.21 7.94L0.18 7.94L0.15 7.94L0.13 7.95L0.11 7.95L0.09 7.95L0.07 7.95L0.06 7.95L0.05 7.95L0.04 7.95L0.03 7.95L0.02 7.94L0.01 7.94L0.01 7.93L0 7.93L0 7.92L0 7.91L0 7.9L0 7.89L0 7.87L0 7.86L0.01 7.84L0.01 7.8L0.01 7.77L0.02 7.74L0.02 7.71L0.02 7.68L0.03 7.65L0.03 7.61L0.08 7.55L0.14 7.5L0.19 7.44L0.25 7.39L0.31 7.34L0.37 7.28L0.43 7.23L0.49 7.18L0.55 7.14L0.61 7.09L0.67 7.04L0.74 6.99L0.8 6.95L0.87 6.9L0.94 6.86L1.01 6.81L1.08 6.77L1.15 6.72L1.22 6.68L1.3 6.64L1.37 6.6L1.45 6.55L1.53 6.51L1.61 6.47L1.69 6.43L1.77 6.39L1.85 6.34L1.94 6.3L2.02 6.26L2.11 6.22L2.2 6.18L2.29 6.13L2.38 6.09L2.48 6.05L2.61 5.99L2.72 5.94L2.83 5.88L2.93 5.83L3.03 5.78L3.11 5.74L3.19 5.69L3.26 5.65L3.32 5.6L3.38 5.56L3.43 5.51L3.47 5.47L3.51 5.42L3.55 5.38L3.59 5.33L3.62 5.28L3.64 5.23L3.67 5.18L3.69 5.12L3.71 5.06L3.73 5L3.75 4.94L3.77 4.87L3.79 4.79L3.82 4.72L3.84 4.63L3.86 4.55L3.89 4.45L3.92 4.36L3.95 4.25L3.99 4.14L4.03 4.02L4.08 3.9L4.13 3.77L4.19 3.61L4.25 3.46L4.31 3.3L4.37 3.15L4.43 3L4.49 2.86L4.56 2.71L4.63 2.57L4.7 2.43L4.77 2.3L4.85 2.17L4.93 2.04L5.02 1.91L5.12 1.79L5.22 1.68L5.32 1.56L5.44 1.46L5.56 1.35L5.69 1.26L5.83 1.16L5.98 1.08L6.14 0.99L6.31 0.92L6.49 0.85L6.68 0.78L6.88 0.73L7.1 0.68L7.32 0.63L7.57 0.6L7.82 0.57L8.09 0.55L8.38 0.53L8.68 0.53L9 0.53L10.56 0.43L10.87 0.04L11.02 0.03L11.17 0.03L11.33 0.02L11.48 0.02L11.64 0.01L11.8 0.01L11.95 0.01L12.11 0.01L12.27 0L12.43 0L12.59 0L12.75 0L12.91 0L13.07 0L13.23 0L13.39 0L13.55 0ZM22.55 16.86L22.65 18.04L22.95 18.76L23.68 19.13L25.06 19.23L25.06 16.84L23.99 16.81L23.35 16.81L22.55 16.86ZM4.21 18.96L5.52 18.82L6.26 18.45L6.58 17.74L6.66 16.56L4.21 16.56L4.21 18.96ZM22.49 10.72L22.38 13.22L22.44 16.23L25.09 16.23L25.09 7.89L25.03 6.68L23.22 8.58L22.49 10.72ZM6.71 15.95L6.66 14.38L6.22 12.26L5.37 9.61L4.13 6.42L4.18 15.95L6.71 15.95ZM8.85 4.62L6.65 4.89L5.31 5.26L5.33 5.55L5.41 5.82L5.54 6.09L5.7 6.35L5.89 6.6L6.08 6.85L6.28 7.1L6.47 7.35L6.7 7.71L6.88 8L7.04 8.24L7.22 8.42L7.45 8.54L7.75 8.61L8.16 8.62L8.72 8.56L9.13 8.52L9.55 8.49L10 8.46L10.44 8.44L10.88 8.4L11.3 8.35L11.71 8.27L12.08 8.17L13.09 7.9L14.06 7.78L14.97 7.77L15.81 7.85L16.58 7.98L17.26 8.12L17.85 8.25L18.35 8.33L18.66 8.37L19.06 8.41L19.53 8.47L20.02 8.52L20.5 8.57L20.93 8.62L21.28 8.65L21.51 8.66L21.96 8.52L22.43 8.17L22.9 7.65L23.35 7.05L23.74 6.43L24.06 5.86L24.27 5.4L24.34 5.12L22.9 4.76L20.63 4.51L17.81 4.38L14.71 4.36L11.63 4.44L8.85 4.62ZM22.68 2.62L23.9 3.29L25.06 3.67L24.74 2.54L23.97 1.67L22.83 1.12L21.4 0.97L21.74 1.8L22.68 2.62ZM5.94 1.69L5.14 2.54L4.84 3.65L5.47 3.5L6.04 3.25L6.58 2.94L7.13 2.6L7.6 2.32L8.05 1.95L8.38 1.49L8.5 0.92L7.11 1.15L5.94 1.69Z",
            // url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            fillColor: '#FF0000',
            fillOpacity: 0.8,
            // size: new google.maps.Size(71, 71),
            // origin: new google.maps.Point(0, 0),
            anchor: new G_MAP.Point(15, 55),
            strokeWeight: 0.5,
            // scale: .20
        },
        greenMarker: {
            url: 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png',
            scaledSize: new G_MAP.Size(50, 50), // scaled size
            origin: new G_MAP.Point(0,0), // origin
            anchor: new G_MAP.Point(0, 0)
        }
    };
    const CONFIG_MAP = {
            center: {lat: 23, lng: 83},
            zoom: 5,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy'
        },
        CONFIG_MARKER = {},
        CONFIG_CIRCLE = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            radiusUnit: 1000 //in KM
        },
        CONFIG_CLUSTER = {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            // maxZoom: 7,
            zoomOnClick: false,
            ignoreHidden: true
        },
        CONFIG_POLYLINE = {
            geodesic: true,
            strokeColor: '#2196f3',
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

    return {
        link: link,
        restrict: 'E',
        scope: {
            'map': '=?mapApi',
        },
        templateUrl: 'component/map/map.html',
        controllerAs: 'vm',
        bindToController: true,
        controller: function($scope, $parse, $sce){

            let vm = this,
                _map,
                _cluster,
                _traffic,
                _directionService,
                _directionRender,
                infoWindow = new G_MAP.InfoWindow(),
                _aMarker = [],
                _aPolyline = [],
                _oCircle = {},
                clusterEventListener;

            vm._addCluster = _addCluster;
            vm._circle = _circle;
            vm._hide = _hide;
            vm._icon = _icon;
            vm._marker = _marker;
            vm._polyline = _polyline;
            vm._position = _position;
            vm._reset = _reset;
            vm._traffic = _trafficFn;
            vm._zoom = _zoom;
            vm.initMap = initMap;

            // function definition

            function _position(pos, zoomLevel) {
                if(Array.isArray(pos))
                    _fitMapToBound(pos);
                else if(pos.lat && pos.lng)
                    pos = {lat: pos.lat, lng: pos.lng};
                else if(pos instanceof G_MAP.Marker)
                    pos = pos.getPosition();

                _map.setCenter(pos);

                if(typeof zoomLevel == 'number')
                    _zoom(zoomLevel);
            }

            function _zoom(zoomLevel) {
                _map.setZoom(zoomLevel);
            }

            function _fitMapToBound(coordinates) {

                let bounds = coordinates;

                if(!(coordinates instanceof G_MAP.LatLngBounds)){
                    bounds = new G_MAP.LatLngBounds();
                    coordinates.forEach(o => bounds.extend(o));
                }

                _map.fitBounds(bounds);
            }

            function _marker() {

                let fnMarker = {
                    add: addMarker,
                    removeAll,
                    hideAll,
                    showAll,
                };
                let defaultOption = {
                    position: false
                };

                return fnMarker;

                function addMarker(oMarker, option = defaultOption){

                    let config = {
                            map: _map
                        },
                        oCord = {};

                    if(oMarker.lat && oMarker.lng){
                        oCord = oMarker;
                    }else {
                        Object.assign(config , oMarker);
                        Object.assign(oCord , oMarker.position);
                    }

                    let _exposedMethod =  {
                        remove,
                        hide,
                        show,
                        openPopup,
                        closePopup
                    };

                    let gMarker = new G_MAP.Marker({
                        ...CONFIG_MARKER,
                        ...config,
                        position: {lat: oCord.lat, lng: oCord.lng},
                        _uId: _aMarker.length,
                        _exposedMethod: _exposedMethod
                    });

                    _aMarker.push(gMarker);

                    option.position && _position(gMarker, option.zoom);

                    if(oMarker.popup && oMarker.popup.on && oMarker.popup.content){
                        _event.call(gMarker, oMarker.popup.on, function(){
                            infoWindow.setContent(oMarker.popup.content);
                            infoWindow.open(_map, gMarker);
                            typeof oMarker.popup.callback == 'function' && oMarker.popup.callback();
                        });

                        if(oMarker.popup.buttonEvent){
                            $('.jaMap').on('click', oMarker.popup.buttonEvent.selector, function(e){
                                e.stopImmediatePropagation();
                                let lat = Number($(this).attr('data-lat'));
                                let lng = Number($(this).attr('data-lng'));
                                let addr = $(this).attr('data-addr');
                                oMarker.popup.buttonEvent.onClick(lat, lng, addr);
                            });
                        }
                    }

                    if(oMarker.on){
                        for(let k in oMarker.on)
                            if(oMarker.on.hasOwnProperty(k) && typeof oMarker.on[k] == 'function')
                                G_MAP_EVENT.addListener(gMarker, k, function(...e){
                                    oMarker.on[k](gMarker, ...e);
                                });
                    }

                    return _exposedMethod;

                    function remove(){
                        gMarker.setMap(null);
                        _aMarker.splice(gMarker._uId, 1);
                    }

                    function hide(){
                        gMarker.setMap(null);
                    }

                    function show(){
                        gMarker.setMap(_map);
                    }

                    function openPopup() {
                        infoWindow.setContent(oMarker.popup.content);
                        infoWindow.open(_map, gMarker);
                    }

                    function closePopup() {
                        infoWindow.close(_map, gMarker);
                    }
                }

                function hideAll(){
                    _aMarker.forEach(oMarker => oMarker.setMap(null));
                }

                function removeAll() {

                    hideAll();
                    _aMarker = [];
                }

                function showAll() {
                    _aMarker.forEach(oMarker => oMarker.setMap(_map));
                }
            }

            function _polyline() {

                let fnPolyline = {
                    add: addPolyline,
                    removeAll,
                    hideAll,
                    showAll,
                    plotInBetween,
                };
                let defaultOption = {
                    position: false
                };

                return fnPolyline;

                function addPolyline(polyLine, option = defaultOption){

                    let path;
                    let config = {
                        map: _map
                    };

                    if(Array.isArray(polyLine)){
                        path = polyLine
                    }else {
                        path = polyLine.path;
                        config = Object.assign(config, polyLine);
                    }

                    path = path.map(o => o instanceof G_LAT_LNG ? o : ({lat: o.lat, lng: o.lng}));

                    let _exposedMethod = {
                        remove,
                        hide,
                        show,
                        openPopup,
                        closePopup
                    };

                    let gPolyline = new G_MAP.Polyline({
                        ...CONFIG_POLYLINE,
                        ...config,
                        path: path,
                        _exposedMethod: _exposedMethod,
                        _uId: _aPolyline.length
                    });

                    _aPolyline.push(gPolyline);

                    option.position && _fitMapToBound(path);

                    if(polyLine.popup && polyLine.popup.on && polyLine.popup.content){

                        _event.call(gPolyline, polyLine.popup.on, function(){
                            infoWindow.setContent(polyLine.popup.content);
                            infoWindow.open(_map, gPolyline);
                            typeof polyLine.popup.callback == 'function' && polyLine.popup.callback();
                        });
                    }

                    return _exposedMethod;

                    function remove(){
                        gPolyline.setMap(null);
                        _aPolyline.splice(gPolyline._uId, 1);
                    }

                    function hide(){
                        gPolyline.setMap(null);
                    }

                    function show(){
                        gPolyline.setMap(_map);
                    }

                    function openPopup() {
                        infoWindow.setContent(polyLine.popup.content);
                        infoWindow.open(_map, gPolyline);
                    }

                    function closePopup() {
                        infoWindow.close(_map, gPolyline);
                    }
                }

                function hideAll(){
                    _aPolyline.forEach(oPolyline => oPolyline.setMap(null));
                }

                function removeAll() {
                    hideAll();
                    _aPolyline = [];
                }

                function showAll() {
                    _aPolyline.forEach(oPolyline => oPolyline.setMap(_map));
                }

                function plotInBetween(start, end) {
                    if(!(start.lat && start.lng && end.lat && end.lng)){
                        console.log('Not valid Coordinates');
                        return;
                    }

                    _dirService.route({
                        origin: start,
                        destination: end,
                        travelMode: 'DRIVING'
                    }, function (response, status) {
                        if (status === 'OK') {
                            console.log(response);

                            // let coord = response.routes[0].overview_path;
                            // let foundIndex = 0;
                            //
                            // coord.forEach( (o, index) => {
                            // 	end;
                            // 	if(utils.getDistanceInKm(o.lat(), o.lng(), start.lat, start.lng) <= 0.02)
                            // 		foundIndex = index;
                            // });

                            // coord.splice(0, foundIndex);
                            vm.map.polyline.add(response.routes[0].overview_path);

                            // _dirRender.setDirections(response);
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                }
            }

            function _circle() {

                let counter = 0;
                let fnCircle= {
                    add: addCircle,
                    removeAll,
                    hideAll,
                    showAll,
                };
                let defaultOption = {
                    position: false
                };

                return fnCircle;

                function addCircle(circle, option = defaultOption){

                    let config = {
                        map: _map
                    };

                    config = Object.assign(config, circle);

                    let gCircle = new G_MAP.Circle({
                        ...CONFIG_CIRCLE,
                        ...config,
                        center: circle.center,
                        radius: circle.radius * CONFIG_CIRCLE.radiusUnit
                    });

                    let index = counter++;
                    _oCircle[index] = gCircle;

                    option.position && _fitMapToBound(gCircle.getBounds());

                    if(circle.popup && circle.popup.on && circle.popup.content){

                        _event.call(gCircle, circle.popup.on, function(){
                            infoWindow.setContent(circle.popup.content);
                            infoWindow.open(_map, gCircle);
                            typeof circle.popup.callback == 'function' && circle.popup.callback();
                        });
                    }

                    let _exposedMethod = {
                        remove,
                        hide,
                        show,
                        openPopup,
                        radius,
                        closePopup
                    };

                    _oCircle[index]._exposedMethod = _exposedMethod;
                    return _exposedMethod;

                    function remove(){
                        if(!_oCircle[index])
                            return false;
                        _oCircle[index].setMap(null);
                        _oCircle.splice(index, 1);
                    }

                    function hide(){
                        if(!_oCircle[index])
                            return false;
                        _oCircle[index].setMap(null);
                    }

                    function show(){
                        if(!_oCircle[index])
                            return false;
                        _oCircle[index].setMap(null);
                    }

                    function openPopup() {
                        infoWindow.setContent(circle.popup.content);
                        infoWindow.open(_map, gCircle);
                    }

                    function closePopup() {
                        infoWindow.close(_map, gCircle);
                    }

                    function radius(rad) {
                        _oCircle[index].setRadius(rad * CONFIG_CIRCLE.radiusUnit);
                    }
                }

                function hideAll(){
                    for(let [index, value] of Object.entries(_oCircle)){
                        value.setMap(null);
                    }
                }

                function removeAll() {
                    hideAll();
                    for(let [index, value] of Object.entries(_oCircle))
                        delete _oCircle[index];
                }

                function showAll() {
                    for(let [index, value] of Object.entries(_oCircle))
                        value.setMap(_map);
                }
            }

            function _reset() {
                try {
                    _cluster && typeof _cluster.clearMarkers == 'function' && _cluster.clearMarkers();
                    this.marker.removeAll();
                    this.polyline.removeAll();
                    this.traffic.hide();
                    _position(CONFIG_MAP.center, CONFIG_MAP.zoom);
                    infoWindow.close();
                }catch (e) {
                    console.log(e);
                }
            }

            function _hide() {
                try {
                    this.marker.hideAll();
                    this.polyline.hideAll();
                }catch (e) {
                    console.log(e);
                }
            }

            function _event(type, fn) {

                switch (type){
                    case 'hover':
                        this.addListener('mouseover', typeof fn == 'function' && fn || (_ => {}));
                        this.addListener('mouseout', _ => {infoWindow.close()});
                        break;
                    default:
                        this.addListener(type, typeof fn == 'function' && fn || (_ => {}));
                }

            }

            function _icon(config = {}, mapIconConfig = {}) {
                let icon = {};
                if(ICON[config.name]){
                    if(typeof ICON[config.name] === "object"){
                        Object.assign(icon, ICON[config.name], mapIconConfig);
                    }else
                        icon = ICON[config.name];
                }else{
                    icon = getIcon('truck', config.color || 'black', mapIconConfig);
                }
                return icon || false;
            }

            function initMap(ele) {
                _map = new G_MAP.Map(ele, CONFIG_MAP);
                _cluster = new G_CLUSTER(_map, [], CONFIG_CLUSTER);
                _dirService = new G_DIRECTION();
                _dirRender = new G_DIRECTION_RENDER();
                _traffic = new google.maps.TrafficLayer();
                _clusterEvent();
            }

            function _trafficFn() {
                return {
                    show: show,
                    hide: hide
                };

                function show() {
                    _traffic.setMap(_map);
                }

                function hide() {
                    _traffic.setMap(null);
                }
            }

            function _addCluster(aMarker) {

                _cluster.addMarkers(aMarker.map((oMarker, index) => {
                    let config = {
                            map: _map
                        },
                        oCord = {};

                    if(oMarker.lat && oMarker.lng){
                        oCord = oMarker;
                    }else {
                        Object.assign(config , oMarker);
                        Object.assign(oCord , oMarker.position);
                    }

                    let gMarker = new G_MAP.Marker({
                        ...CONFIG_MARKER,
                        ...config,
                        position: {lat: oCord.lat, lng: oCord.lng},
                        _uId: index
                    });

                    if(oMarker.popup && oMarker.popup.on && oMarker.popup.content){
                        _event.call(gMarker, oMarker.popup.on, function(){
                            infoWindow.setContent(oMarker.popup.content);
                            infoWindow.open(_map, gMarker);
                            typeof oMarker.popup.callback == 'function' && oMarker.popup.callback();
                        });

                        if(oMarker.popup.buttonEvent){
                            $('.jaMap').on('click', oMarker.popup.buttonEvent.selector, function(e){
                                e.stopImmediatePropagation();
                                let lat = Number($(this).attr('data-lat'));
                                let lng = Number($(this).attr('data-lng'));
                                let addr = $(this).attr('data-addr');
                                oMarker.popup.buttonEvent.onClick(lat, lng, addr);
                            });
                        }
                    }

                    return gMarker;
                }));

                _cluster.repaint();
                $timeout(function () {
                    _cluster.repaint();
                }, 500);

                let _exposedMethod =  {
                    remove,
                    hide,
                    show
                };

                return _exposedMethod;

                function remove(){
                    _cluster && typeof _cluster.clearMarkers == 'function' && _cluster.clearMarkers();
                }

                function hide(){
                    // _cluster.setMap(null);
                }

                function show(){
                    // _cluster.setMap(_map);
                    _cluster.repaint();
                }
            }

            function _clusterEvent() {

                clusterEventListener = G_MAP_EVENT.addListener(_cluster, 'clusterclick', function(cluster) {
                    let markers = cluster.getMarkers();
                    let content = "<div style='margin-bottom: 10px;font-weight: bold'>" + markers.length + " Vehicles </div>" +
                        markers.map(o => {
                            return `
								<div style='margin-bottom: 5px;' class='pointer eachVehiclePtr' data-key='${o._uId}'>
									${o.content}
								</div>
							`;
                        }).join("");

                    // if (_map.getZoom() <= _cluster.getMaxZoom()) {
                    infoWindow.setContent(content);
                    infoWindow.setPosition(cluster.getCenter());
                    infoWindow.open(_map);
                    // }
                });

                $('.jaMap').on('click', '.eachVehiclePtr', function (e) {

                    e.stopImmediatePropagation();

                    let uId = Number($(this).attr('data-key'));

                    let fdMarker = _cluster.getMarkers().find(oMarker => oMarker._uId === uId);

                    vm.map.marker.removeAll();
                    _cluster && typeof _cluster.clearMarkers == 'function' && _cluster.clearMarkers();

                    vm.map.marker.add({
                        content: fdMarker.content,
                        popup: fdMarker.popup,
                        position: {lat: fdMarker.getPosition().lat(), lng: fdMarker.getPosition().lng()},
                        icon: fdMarker.icon
                    }).openPopup();

                    vm.map.event && typeof vm.map.event.onClusterPopupClickEvent == 'function' && vm.map.event.onClusterPopupClickEvent(fdMarker);
                })
            }
        }
    };

    function link(scope, element, attrs, vm) {

        const _mapEle = element.children('.jaMap')[0];
        vm.map = typeof vm.map === "object" && vm.map || {};

        typeof vm.map.config === 'object' && Object.assign(CONFIG_MAP, vm.map.config);
        typeof vm.map.configMarker === 'object' && Object.assign(CONFIG_MARKER, vm.map.configMarker);
        typeof vm.map.configPolyline === 'object' && Object.assign(CONFIG_POLYLINE, vm.map.configPolyline);
        typeof vm.map.configCircle === 'object' && Object.assign(CONFIG_CIRCLE, vm.map.configCircle);

        vm.initMap(_mapEle);

        Object.assign(vm.map, {
            marker: new vm._marker(),
            cluster: vm._addCluster,
            polyline: new vm._polyline(),
            circle: new vm._circle(),
            position: vm._position,
            zoom: vm._zoom,
            reset: vm._reset,
            hide: vm._hide,
            icon: vm._icon,
            traffic: new vm._traffic()
        });

        typeof vm.map.ready === 'function' && vm.map.ready();
    }

    function svgToIcon(svg){
        return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg);
    }

    function getIcon(icon, color, config = {}) {
        return {
            url: svgToIcon(utils.takeIcon(icon, color)),
            scaledSize: config.iconSize || ICON_CONFIG.iconSize,
            ...config
        }
    }
}


