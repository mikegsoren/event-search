$(document).ready(function() {

	// global variables
	var searchQuery = '';
	var searchRadius = 99999;


	var createEventHtml = function(event) {

		var eventHtml = '<div class="event event--ticketmaster"><h4><a class="event__link" href="' +
						event.url + '" target="_blank">' + 
						event.name + '</a></h4><img class="event__image" src="' + 
						event.image + '"/><div class="event__description"><p class="event__date">' +
						event.date +'</p><p class="event__venue">' +
						event.location + '</p><a href="' +
						event.url + '" class="btn btn-info" target="_blank">Go!</button></div></div>';

		return eventHtml;
	}


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

			console.log(currentEvent);

			var date = new Date(currentEvent.dates.start.dateTime);

			var city = currentEvent._embedded.venues[0].city,
				state = currentEvent._embedded.venues[0].state,
				country = currentEvent._embedded.venues[0].country,
				location = '';


			if (typeof city !== 'undefined' && typeof state !== 'undefined' ) {


				// if both values are defined then it will add this location and ignore rest of if statement
				location = city.name + ', ' + state.name;

			// anything after the initial if statement will have only one of the values defined, in this case the city	
			} else if (typeof city !== 'undefined') {

				location = city.name;

				// if there is a city but no state, venue might be out of the US, so add a country if possible.
				if (typeof country !== 'undefined') {
					location += ', ' + country.name;
				}

			// only state is defined
			} else if (typeof state !== 'undefined') {
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
				location: location
			})));
		}
	};


	var getTicketMasterResults = function() {

		var ticketMasterUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + searchQuery + '&apikey=q4TYfyTINvAAreR3WlqGWyqHbZHkmfuG';


		$.ajax({
			type: 'GET',
			url: ticketMasterUrl, 
			dataType: 'json',
			success: function(json) {
				displayTicketMasterResults(json._embedded.events);
	        },
			error: function(xhr, status, err) {
				console.error('TicketMaster call failed:\n XHR: ' + xhr + '\nStatus: ' + status + '\nError: ' + err);
			}
		});

	};




	// ##       #### ##     ## ######## ##    ##    ###    ######## ####  #######  ##    ## 
	// ##        ##  ##     ## ##       ###   ##   ## ##      ##     ##  ##     ## ###   ## 
	// ##        ##  ##     ## ##       ####  ##  ##   ##     ##     ##  ##     ## ####  ## 
	// ##        ##  ##     ## ######   ## ## ## ##     ##    ##     ##  ##     ## ## ## ## 
	// ##        ##   ##   ##  ##       ##  #### #########    ##     ##  ##     ## ##  #### 
	// ##        ##    ## ##   ##       ##   ### ##     ##    ##     ##  ##     ## ##   ### 
	// ######## ####    ###    ######## ##    ## ##     ##    ##    ####  #######  ##    ## 
	var getLiveNationResults = function() {




	};



	// ######## ########     ######## ##     ## ######## ##    ## ########  ######  
	// ##       ##     ##    ##       ##     ## ##       ###   ##    ##    ##    ## 
	// ##       ##     ##    ##       ##     ## ##       ####  ##    ##    ##       
	// ######   ########     ######   ##     ## ######   ## ## ##    ##     ######  
	// ##       ##     ##    ##        ##   ##  ##       ##  ####    ##          ## 
	// ##       ##     ##    ##         ## ##   ##       ##   ###    ##    ##    ## 
	// ##       ########     ########    ###    ######## ##    ##    ##     ######  
	var getFacebookResults = function() {




	};




	var searchEvents = function() {

		var ticketMasterResults = getTicketMasterResults();
		var liveNationResults = getLiveNationResults();
		var facebookResults = getFacebookResults();

	};




	$('#search-button').on('click touch', function() {

		$('#search-form').submit();
	});	

	$('#search-form').on('submit', function(e) {
		e.preventDefault();

		searchQuery = $('#search-field').val();

		console.log(searchQuery);

		searchEvents();

	});




});