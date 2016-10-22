

var eventSearchApp = angular.module('eventSearchApp', []);


eventSearchApp.controller('mainController', ['scope', function mainController($scope) {

	$scope.searchQuery = '';
	$scope.searchLocation = '';
	$scope.searchRadius = 99999;
	$scope.geolocation = {};


	//var meetupsApiKey = '1f610196457d32655b167a25ec80';










	$scope.searchEvents = function() {

		if (!$scope.searchDisabled) {
			$scope.$broadcast('eventQuery', $scope.searchQuery);

		}
	};


	$('#locationDropdown a').on('click touch', function(e) {
		console.log($(this).data('value'));
	});





	// Math functions stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
	function decimalAdjust(type, value, exp) {
	    // If the exp is undefined or zero...
	    if (typeof exp === 'undefined' || +exp === 0) {
	      return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    // If the value is not a number or the exp is not an integer...
	    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	      return NaN;
	    }
	    // Shift
	    value = value.toString().split('e');
	    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	    // Shift back
	    value = value.toString().split('e');
	    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	Math.round10 = function(value, exp) {
      	return decimalAdjust('round', value, exp);
    };


   	$scope.getGeolocation = function() {

		if ($scope.geolocation === {}) {
			$scope.searchDisabled = true;

	    	// Try HTML5 geolocation.
		    if (navigator.geolocation) {
		      	navigator.geolocation.getCurrentPosition(function(position) {
			    	$scope.geolocation.lat = position.coords.latitude;
			      	$scope.geolocation.long = position.coords.longitude;

			    	// display latitude and longitude

					// document.getElementById('alert--location').innerHTML = '<strong>Your location: </strong><i>Latitude ' + Math.round10($scope.geolocation.lat, -4) + ', Longitude ' + Math.round10($scope.geolocation.long, -4) + '</i>';
			  //   	document.getElementById('alert--location').classList.add('show');

			  		$scope.alert = 'location';
			  		$scope.$apply();

			    	// Use Google API to determine city, state, country
			    	var googleMapsPromise = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.geolocation.lat + ',' + $scope.geolocation.long + '&key=AIzaSyAs5WBq80e70o3Tu7hP3L5flz1XTSvUcUE');

					googleMapsPromise.done(function(data) {

					  	// hopefully this always gets returned in the same format
					  	var addressArray = data.results[0].formatted_address.split(',');

					  	$scope.geolocation.country = addressArray.pop().replace(' ', '');

					  	var stateAndZip = addressArray.pop().split(' ');
					  	$scope.geolocation.zip = stateAndZip.pop();
					  	$scope.geolocation.state = stateAndZip.pop();
					  	$scope.geolocation.city = addressArray.pop().replace(' ', '');
					  	$scope.geolocation.streetAddress = addressArray.pop();

					  	$scope.searchDisabled = true;
					});

		      	}, function() {});
		    } else {
		      	// Browser doesn't support Geolocation
				// document.getElementById('alert--location-failed').innerHTML = '<p>Please enable location services.</p>';
				$scope.alert = 'location-failed';
				$scope.searchDisabled = false;
		    }
		}
    }

	


}]);	// end mainController