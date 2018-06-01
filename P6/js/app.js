

var locations = [
	{
		cityName: 'Boston',
		lat: 42.3142647,
		lng: -71.1103691
	},
	{
		cityName: 'Baltimore',
		lat: 39.2846225,
		lng: -76.7605715
	},
	{
		cityName: 'Chicago',
		lat: 41.8333925,
		lng: -88.012153
	},

	{
		cityName: 'New York',
		lat: 40.6971494,
		lng: -74.2598708
	},
	{
		cityName: 'Philadelphia',
		lat: 40.0024137,
		lng: -75.2581184
	},

];

var map;
var windowInfo = null; //information window
var lastClickedMarker = null; //Track Last Marker

//Foursquare api Keys
var CLIENT_ID = 'YourKey';
var CLIENT_SECRET = 'YourKey';

onGMapsError = function () {
	alert('Error loading Google Maps. Please Try Again.');
};

var Location = function (params) {
	var self = this;
	self.cityName = params.cityName;
	self.searchcityName = params.cityName.toLowerCase();
	var url = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=' + params.lat + ',' + params.lng + '&intent=global&query=' + params.cityName + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;
	//Parsing Json
	$.getJSON(url).done(function (data) {
		var data = data.response.venues[0];
		self.cityNameF = data.name;
		self.category = data.categories[0].shortName;
		self.address = data.location.formattedAddress.join(', ');
	}).fail(function () {
		alert('Error occured with the Foursquare API. Please try again');
	});
	self.marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(params.lat, params.lng),
		cityName: self.cityName
	});
	//show information when clicked
	self.marker.addListener('click', function () {
		// close opened infoWindow
		if (windowInfo) {
			windowInfo.close();
		}
		var stopAnimation = function () {
			lastClickedMarker.setAnimation(null);
			lastClickedMarker = null;
		};
		if (lastClickedMarker) {
			stopAnimation();
		}
		//Parsed Json City Data
		var cityData = [
			'<div class="info-window">',
			'<h4>', self.cityName, '</h4>',
			'<h4> (', self.cityNameF, ')</h4>',
			'<p>',
			self.category,
			'</p>',
			'<p>', self.address, '</p>',

			'</div>'
		];
		var window = new google.maps.InfoWindow({ content: cityData.join('') });
		windowInfo = window;
		window.open(map, self.marker);
		//For animation
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		lastClickedMarker = self.marker;
		//modal dialog closes
		google.maps.event.addListener(window, 'closeclick', stopAnimation);
	});
	self.selected = function () {
		google.maps.event.trigger(self.marker, 'click');
	};

};

var AppViewModel = function () {
	var self = this;
	this.searchQuery = ko.observable('');
	this.locationsList = ko.observableArray();
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 42.3142647, lng: -71.1103691 }, //Initial Map View
		zoom: 5
	});

	locations.forEach(function (datum) {
		var location = new Location(datum);
		self.locationsList.push(location);
	});

	//Search Functionality
	this.filteredList = ko.computed(function () {
		return this.locationsList().filter(function (location) {
			var isMatched = location.searchcityName.indexOf(this.searchQuery().toLowerCase()) !== -1;
			location.marker.setVisible(isMatched);
			return isMatched;
		}, this);
	}, this);
};

function init() {
	ko.applyBindings(new AppViewModel()); //Knockout Fk
}
