(function(document, window){


const CLIENT_ID = "BTQYSYTNCW45PVNFUXYRXPCJYOYA3U4LRO5HHL2CBDX3DVMX";
const CLIENT_SECRET = "KEJ5US3VF5H5T0ZKPKECKFQURD1AUVGKGTL5SRCAT5T44ZGT"
const VERSION = "20140818";
const URL = "https://api.foursquare.com/v2/venues/explore?client_id="+CLIENT_ID+
			"&client_secret="+CLIENT_SECRET+"&v="+VERSION;

var btn = document.querySelector('#btnEat');
var circle = document.querySelector('.circle');
var result = document.querySelector('.result');
var name = result.querySelector('.venue-name');
var address = result.querySelector('.venue-address');
var location;

// Listeners
// btn.addEventListener('click', makeRandom, true);
circle.addEventListener('touchend', makeRandom, true);

// Handlers
function makeRandom() {
	console.log('randomizing!');
	getCurrentLocation()
		.then(performAjaxRequest, null)
		.then(function(data){
			var places = prepareJSON(data);
			var place = pickRandomPlace(places);
			showResult(place);
		});
}

function getCurrentLocation() {
	var promise = new Promise(function(resolve, reject){
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = String(position.coords.latitude).slice(0, 6);
			var longitude = String(position.coords.longitude).slice(0, 6);
			console.log(latitude, longitude);
		  	resolve({latitude: latitude, longitude: longitude });
		},
		function(error){
			reject(error);
		}, {
			enableHighAccuracy: true
		});
	});
	return promise;
}

function performAjaxRequest(pos) {
	var promise = new Promise(function(resolve, reject){
		var xhr = new XMLHttpRequest();
		var query = "&ll="+pos.latitude+","+pos.longitude+"&llAcc=10&limit=50&radius=1000&query=кафе";
		var url = URL + query;
		console.log(url);
		xhr.open("GET", url, true);
		xhr.onload = function() {
			if (this.status === 200) {
				resolve(this.responseText);
			}
			else {
				reject(this.statusText);
			}
		}
		xhr.send(null);
	});

	return promise;
}
function prepareJSON(data) {
	var dataObj = JSON.parse(data);
	var filtered = dataObj.response.groups[0].items.filter(function(el, i){
		if (el.flags && el.flags.outsideRadius) {
			return false;
		}
		return true;
	});
	return filtered;
}
function pickRandomPlace(places) {
	var i = Math.floor((Math.random() * places.length));
	return places[i];
}

function showResult(data) {
	circle.classList.add('hide');
	result.classList.add('show');
	var venue = data.venue;
	name.textContent = venue.name;
	address.textContent = venue.location.address;
}

})(document, window);
