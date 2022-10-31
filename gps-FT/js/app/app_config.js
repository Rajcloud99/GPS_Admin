var getAppConfig = function () {
	var oCoinfig = {
		 base_url: 'localhost:5001',
        // geo_url: 'http://localhost:4242/',

        geo_url: 'http://3.6.84.38:4242/',
        //base_url: 'http://trucku.in:5001',
        // base_url: 'http://localhost:5001',
        //trucku_url: 'http://trucku.in:8081/',
         trucku_url: 'http://localhost:8081/',
        //base_url: 'http://192.168.0.162:5001'
        apiKey : 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqYXhnbXptMjAza3AzM24yazhqaWlwb3IifQ.MNdyDZ0P3mVRpnFxj68uxg',
        //roadTileLayer : 'http://futuretrucks.in:2000/tile/{z}/{x}/{y}',
        roadTileLayer : 'https://b.tiles.mapbox.com/v4/digitalglobe.nako6329/{z}/{x}/{y}.png?access_token=',
        terrainTileLayer : 'https://{s}.tiles.mapbox.com/v4/digitalglobe.nako1fhg/{z}/{x}/{y}.png?access_token=',
        satelliteTileLayer : 'https://{s}.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.png?access_token=',
	};
	return oCoinfig;
};
