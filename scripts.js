(function(document, window){

var btn = document.querySelector('btnEat');
var location;



// Listeners
btn.addEventListener('click', makeRandom, true);


// Handler
function makeRandom() {
	getLocation()
}

function getLocation() {
	var promise = new Promise(function(resolve, reject){
		navigator.geolocation.getCurrentPosition(function(position) {
		  	resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
		},
		function(error){
			reject(error);
		});
	});
}

})(document, window)
