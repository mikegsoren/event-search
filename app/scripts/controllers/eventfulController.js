
eventSearchApp.controller('eventfulController', function eventfulController($scope) {






	$scope.displayEventfulResults = function(eventArray) {

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


	$scope.getEventfulResults = function() {

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



});