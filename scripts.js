(function(document, window){
"use strict";

const CLIENT_ID = "BTQYSYTNCW45PVNFUXYRXPCJYOYA3U4LRO5HHL2CBDX3DVMX";
const CLIENT_SECRET = "KEJ5US3VF5H5T0ZKPKECKFQURD1AUVGKGTL5SRCAT5T44ZGT";
const VERSION = "20140818";
const URL = "https://api.foursquare.com/v2/venues/explore?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=" + VERSION;


var elems =  {
    mainView: document.querySelector('#main'),
    circleWrapper: document.querySelector('#circle'),
    circleLine: document.querySelector('#circleLine'),
    result: document.querySelector('#result'),
    placeName: document.querySelector('#placeName'),
    placeAddress: document.querySelector('#placeAddress'),
    map: document.getElementById('mapCanvas')
};

var App = {
    init: function() {
        this.bindListeners();
    },
    bindListeners: function() {
        elems.circleWrapper.addEventListener('touchend', this.initRandomChoice.bind(this));
    },
    initRandomChoice: function() {
        var self = this;

        elems.circleLine.classList.add('rotate');
        this.getCurrentLocation()
            .then(this.requestToApi)
            .then(function(data){
                var places = self.filterData(data);
                var place = self.pickRandomPlace(places);
                self.showPlace(place);
            });
    },
    getCurrentLocation: function() {
        return new Promise(function(resolve, reject){
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = String(position.coords.latitude).slice(0, 6);
                var longitude = String(position.coords.longitude).slice(0, 6);

                resolve({latitude: latitude, longitude: longitude });
            },
            function(error){
                reject(error);
            },
            {
                enableHighAccuracy: true
            });
        });
    },
    requestToApi: function(pos) {
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            var query = "&ll="+pos.latitude+","+pos.longitude+"&llAcc=10&limit=50&radius=1000&query=кафе";
            var url = URL + query;

            xhr.open("GET", url, true);
            xhr.onload = function() {
                if (this.status === 200) {
                    resolve(this.responseText);
                }
                else {
                    reject(this.statusText);
                }
            };
            xhr.send(null);
        });
    },
    filterData: function(data) {
        var dataObj = JSON.parse(data);

        return  dataObj.response.groups[0].items.filter(function(el, i){
            if (el.flags && el.flags.outsideRadius) {
                return false;
            }
            return true;
        });
    },
    pickRandomPlace: function(places) {
        var i = Math.floor((Math.random() * places.length));
        return places[i];
    },
    showPlace: function(data) {
        var venue = data.venue;

        elems.circleWrapper.classList.add('hide');
        elems.mainView.classList.add('hide');
        elems.result.classList.remove('hide');

        elems.placeName.textContent = venue.name;
        elems.placeAddress.textContent = venue.location.address;
        this.createMap(venue.location.lat, venue.location.lng, venue.name);
    },
    createMap: function(lat, lng, name) {
        var myLatlng = new google.maps.LatLng(lat,lng);
        var mapOptions = {
            zoom: 18,
            center: myLatlng
        };
        var map = new google.maps.Map(elems.map, mapOptions);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: name
        });
    }
};

App.init();
})(document, window);
