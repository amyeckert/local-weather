;(function($) {

    $(document).ready(function() {
    	// global variables;
    	var $message = $(".message");
    	var $conditions = $(".conditions");
    	var $temperature = $(".temperature");
    	var $information = $(".information");
    	var $getLocation = $(".getLocation");
    	$conditions.hide().html("");
    	$temperature.hide().html("");
    	$message.hide().html("");
    	// on click, get current position
    	$getLocation.on("click", function(event) {
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
					//sunset information
	    			let sunsetUTCHours = data.sys.sunset;
	    			let sunset = new Date(0);
	    			sunset.setUTCSeconds(sunsetUTCHours);
	    			let sunsetHour = sunset.getHours();
	    			let sunsetMinutes = sunset.getMinutes();
	    			let localTimeAtSunset = sunset.toLocaleString('en-US', options);

	    			 //local time information
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
	    			var cheekyMessage = "";

	    			if(currentHour > sunsetHour && currentMinute > sunsetMinute) {
	    				cheekyMessage = "The sun has set. Hope you had an amazing day!";

	    			} else {
	    				cheekyMessage = "You have <br>" + remainingHours + " hours and " + remainingMinutes + " minutes left before sunset tonight at " + localTimeAtSunset + ". <br> Better get to it!";
	    			}
	    			
	    			$getLocation.fadeOut(1500);
					$conditions.fadeIn(300);
					$temperature.fadeIn(800);
					$message.html(cheekyMessage).fadeIn(1000);
					// show icon
					$conditions.html(conditions);
					$temperature.html(tempF+ "  \/ " + tempC);

					console.log(currentHour, sunsetHour, localTimeAtSunset);
				});

	    	}

    		// check if it is allowed
	    	if(navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition(success, error, options);
			} 
		
		});

    }); //________end doc ready_________________________________________________________//

})(jQuery);