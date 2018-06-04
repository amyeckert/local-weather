;(function($) {

    $(document).ready(function() {
    	// global variables;
    	var $message = $(".message");
    	var $conditions = $(".conditions");
    	var $temperature = $(".temperature");
    	var $information = $(".information");
    	var $getLocation = $(".getLocation");

    	var $circleCon = $(".circleCon");
    	var $circleTemp = $(".circleTemp");
    	var $circleMess = $(".circleMess");

   		$conditions.html("");
    	$temperature.html("");
    	$message.html("");

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
			
			$getLocation.html("...hang on, let me check.");	

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
	    				cheekyMessage = "You have <br>" + remainingHours + " hours and " + remainingMinutes + " minutes left before sunset at <br><span class=\"bold\">" + localTimeAtSunset + "</span>";
	    			}
	    			
	    			$getLocation.fadeOut(1500);

	    			//update information
					$conditions.html(conditions);
					$temperature.html(tempF+ "  \/ " + tempC);
					$message.html(cheekyMessage);

					//display the information
	    			$circleCon.fadeTo(500, 1);
					$circleTemp.fadeTo(800, 1);
					$circleMess.fadeTo(1000, 1);
				});
	    	}

    		// check if geolocation is allowed, if do, run it
	    	if(navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition(success, error, options);
			} 
		});
    }); //________end doc ready_________________________________________________________//

})(jQuery);