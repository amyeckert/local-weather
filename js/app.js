;(function($) {

    $(document).ready(function() {
    	// global variables;
    	var $message = $(".message");
    	var $conditions = $(".conditions");
    	var $convert = $(".convert");
    	var $temperature = $(".temperature");
    	var $information = $(".information");


    	// on click, get current position
    	$(".getLocation").on("click", function(event) {
    		event.preventDefault();
    		
	    	function error(error) {
	    		console.warn(`ERROR(${error.code}): ${error.message}`);
	    	}

	    	var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

	    	function success(position){
	    		const myCoordinates = position.coords;
	    		let lat = myCoordinates.latitude
	    		let lon = myCoordinates.longitude
	    		let api = ("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon);

	    		$.get(api, function(data) {
	    			let tempC = Math.round(data.main.temp);
	    			let tempF = Math.round((tempC * 1.8000) + 32);
	    			tempF += "F";
	    			tempC += "C";
	    			let conditions = data.weather[0]["description"];
	    			    			
	    			// console.log(data, tempF, tempC); 

	    			//calculate how many hours and minutes until local sunset:
	    			var options = {
					  hour: 'numeric',
					  minute: 'numeric',
					  hour12: true
					};

	    			let sunsetUTCHours = data.sys.sunset;
	    			let sunset = new Date(0);
	    			sunset.setUTCSeconds(sunsetUTCHours);
	    			let sunsetHour = sunset.getHours();
	    			let sunsetMinutes = sunset.getMinutes();

	    			let localTimeAtSunset = sunset.toLocaleString('en-US', options);
	    		
	    			let currentDate = new Date();
	    			let currentHour = currentDate.getHours(); 
	    			let currentMinute = currentDate.getMinutes();

	    			let remainingHours = sunsetHour - currentHour;
	    			let remainingMinutes = sunsetMinutes - currentMinute;

	 				// don't show negative numbers
	    			if(remainingHours < 0) {
	    				remainingHours = -remainingHours;
	    			}
	    			if(remainingMinutes < 0) {
	    				remainingMinutes = -remainingMinutes;
	    			}
	    			// change message if after sunset
	    			let currentUTCHour = setUTCSeconds(sunsetUTCHours);

	    			if(sunsetUTCHours)
	    			var cheekyMessage = "You only have " + remainingHours + " hours and " + remainingMinutes + " minutes left before sunset tonight at " + localTimeAtSunset + ". <br> Better get to it!";
					$information.fadeIn(400);
					$message.html(cheekyMessage).fadeIn(900);
					// show icon
					$conditions.html(conditions);
					$temperature.html(tempF+ " \/ " + tempC);

					console.log(currentUTCHour, sunset);
				});

	    	}

    		// check if it is allowed
	    	if(navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition(success, error, options);
			} 
		
		});

    }); //________end doc ready_________________________________________________________//

})(jQuery);