

var eventSearchApp = angular.module('eventSearchApp', []);


eventSearchApp.controller('mainController', function mainController($scope) {

	$scope.searchQuery = '';
	$scope.searchLocation = '';
	$scope.searchRadius = 99999;
	$scope.geolocation = {};


	//var meetupsApiKey = '1f610196457d32655b167a25ec80';





	var createEventHtml = function(event) {

		// open event listing
		var eventHtml = '<div class="event event--ticketmaster col-lg-6 col-md-6">';

		// add title and link to source event
		eventHtml += '<h4><a class="event__link" href="' + event.url + '" target="_blank">' + event.name + '</a></h4>';

		// add event image
		eventHtml += '<img class="event__image" src="' + event.image + '"/>';

		// start event description section
		eventHtml += '<div class="event__description">';

		// add date
		eventHtml += '<p class="event__date">' + event.date + '</p>';

		// add location (city, state, country as applicable)
		eventHtml += '<p class="event__location">' + event.location + '</p>';

		// add venue
		if (typeof event.venue !== 'undefined') {
			eventHtml += '<p class="event__venue"><strong>Venue: </strong>' + event.venue + '</p>';			
		}

		// add source api of event
		eventHtml += '<p class="event__source"><strong>Source: </strong>' + event.source + '</p>'; 

		// add link to ecent
		eventHtml += '<a href="' + event.url + '" class="btn btn-info" target="_blank">Go!</a>';

		// close out description and event listing
		eventHtml += '</div></div>';

		return eventHtml;
	};


	// ######## ####  ######  ##    ## ######## ########    ##     ##    ###     ######  ######## ######## ########  
	//    ##     ##  ##    ## ##   ##  ##          ##       ###   ###   ## ##   ##    ##    ##    ##       ##     ## 
	//    ##     ##  ##       ##  ##   ##          ##       #### ####  ##   ##  ##          ##    ##       ##     ## 
	//    ##     ##  ##       #####    ######      ##       ## ### ## ##     ##  ######     ##    ######   ########  
	//    ##     ##  ##       ##  ##   ##          ##       ##     ## #########       ##    ##    ##       ##   ##   
	//    ##     ##  ##    ## ##   ##  ##          ##       ##     ## ##     ## ##    ##    ##    ##       ##    ##  
	//    ##    ####  ######  ##    ## ########    ##       ##     ## ##     ##  ######     ##    ######## ##     ## 
	
	var displayTicketMasterResults = function(eventArray) {


		for (var i = 0; i < eventArray.length; i++) {

			var currentEvent = eventArray[i];

			var date = new Date(currentEvent.dates.start.dateTime);

			var city = currentEvent._embedded.venues[0].city,
				state = currentEvent._embedded.venues[0].state,
				country = currentEvent._embedded.venues[0].country,
				location = '';


			if (typeof city !== 'undefined' && typeof state !== 'undefined' ) {

				// if both values are defined then it will add this location and ignore rest of if statement
				location = city.name + ', ' + state.name;

			// anything after the initial if statement will have only one of the values defined, in this case the city	
			} else if (typeof city !== 'undefined' && typeof state === 'undefined') {

				location = city.name;

				// if there is a city but no state, venue might be out of the US, so add a country if possible.
				if (typeof country !== 'undefined') {
					location += ', ' + country.name;
				}

			// only state is defined
			} else if (typeof state !== 'undefined' && typeof city !== 'undefined') {
				location = state.name;

			} else {
				location = '';
			}

			// call html creation function, turn html in jquery object, append jquery object to results container
			$('.ticketmaster-results').append($(createEventHtml({
				url: currentEvent.url || '',
				name: currentEvent.name || '',
				image: currentEvent.images[0].url || '',
				date: (date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() || ''),
				location: location,
				source: 'TicketMaster'
			})));
		}
	};


	var getTicketMasterResults = function() {

		var ticketMasterUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + $scope.searchQuery + 
			'&stateCode=' + $scope.geolocation.state + 
			'&apikey=q4TYfyTINvAAreR3WlqGWyqHbZHkmfuG';


		$.ajax({
			type: 'GET',
			url: ticketMasterUrl, 
			dataType: 'json',
			success: function(json) {
				console.log(json);

				if (typeof json._embedded !== 'undefined') {
					displayTicketMasterResults(json._embedded.events);
				} else {
					$('.ticketmaster-results').html('').append('<p>No TicketMaster events found.</p>');
				}
	        },
			error: function(xhr, status, err) {
				console.error('TicketMaster call failed:\n XHR: ' + xhr + '\nStatus: ' + status + '\nError: ' + err);
			}
		});

	};


	var displayEventfulResults = function(eventArray) {

		for (var i = 0; i < eventArray.length; i++) {

			var currentEvent = eventArray[i],
				date = new Date(currentEvent.start_time),
				city = currentEvent.city_name,
				state = currentEvent.region_name,
				country = currentEvent.country_name,
				location = '',
				imageUrl = '';

			if (typeof currentEvent.image !== 'undefined' && currentEvent.image !== null) {
				imageUrl = currentEvent.image.url;
			}

			if (typeof city !== 'undefined' && typeof state !== 'undefined' ) {

				location = city + ', ' + state;

			} else if (typeof city !== 'undefined' && typeof state === 'undefined') {

				location = city;

				if (typeof country !== 'undefined') {
					location += ', ' + country;
				}

			} else if (typeof state !== 'undefined' && typeof city !== 'undefined') {
				location = state;
			} else {
				location = '';
			}


			$('.eventful-results').append($(createEventHtml({
				url: currentEvent.url || '',
				name: currentEvent.title || '',
				image: imageUrl,
				date: (date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() || ''),
				location: location,
				venue: currentEvent.venue_name,
				venueUrl: currentEvent.venue_url,
				source: 'Eventful'
			})));
		}



	};


	var getEventfulResults = function() {

		var oArgs = {
          app_key: 'xpsFvT7qL6TZzM5M',
          q: $scope.searchQuery,
          where: $scope.geolocation.state, 
          // "date": "2013061000-2015062000",
          page_size: 25,
          sort_order: 'date'
        };

        EVDB.API.call('/events/search', oArgs, function(oData) {

        	if (typeof oData.events !== 'undefined' || oData.events !== null) {
        		// console.log(oData.events.event);
        		displayEventfulResults(oData.events.event);
			} else {
				$('.eventful-results').html('').append('<p>No Eventful events found.</p>');
			}
        });
	};



	var searchEvents = function() {

		$('.results-container').html('');	// clear results divs

		getTicketMasterResults();
		getEventfulResults();

	};


	$('#locationDropdown a').on('click touch', function(e) {
		console.log($(this).data('value'));

	});

	$('#search-button').on('click touch', function() {

		$('#search-form').submit();
	});	

	$('#search-form').on('submit', function(e) {
		e.preventDefault();

		$scope.searchQuery = $('#search-field').val();
		searchEvents();
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


    var getGeolocation = function() {


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
				});

	      	}, function() {});
	    } else {
	      	// Browser doesn't support Geolocation
			// document.getElementById('alert--location-failed').innerHTML = '<p>Please enable location services.</p>';
			$scope.alert = 'location-failed';
	    }
    }

	
    // run on page load to supply location info for api requests
    getGeolocation();


});	// end mainController