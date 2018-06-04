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
    	
    	if (!navigator.geolocation) {
		    output.innerHTML = "<p>Geolocation is not supported by your browser. Please enable it to use this silly thing.</p>";
		}

    	function error(error) {
    		alert("Please allow this site to access your location information.");
    		console.warn(`ERROR(${error.code}): ${error.message}`);
    	}

    	var options = {
			enableHighAccuracy: true,
			timeout: 7000,
			maximumAge: 0
		};

    	function success(position){
    		var myCoordinates = position.coords;
    		var lat = myCoordinates.latitude
    		var lon = myCoordinates.longitude
    		var api = ("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon);
    		// return (lat, lon, api);
    		
    		
			$.get(api, function(data) {
				var tempC = Math.round(data.main.temp);
				var tempF = Math.round((tempC * 1.8000) + 32);
				tempF += "F";
				tempC += "C";	
				var conditions = data.weather[0]["description"];
    			// console.log(api);
    			var apiData = data;
    			
				return apiData;
			});
    	}

    	function calculateTimeTilSunset() {
    		var data = success();
    		alert(data);
    	}
    		

			//calculate how many hours and minutes until local sunset:

			// var timOptions = {
			//   hour: 'numeric',
			//   minute: 'numeric',
			//   hour12: true
			// };
			// var sunsetUTCHours = apiData.sys.sunset;
			// console.log(apiData);

	    	// 		var sunset = new Date(0);
	    	// 		sunset.setUTCSeconds(sunsetUTCHours);
	    	// 		var sunsetHour = sunset.getHours();
	    	// 		var sunsetMinutes = sunset.getMinutes();
	    	// 		var localTimeAtSunset = sunset.toLocaleString('en-US', timeOptions);

	    	// 		 //local time information
	    	// 		var currentDate = new Date();
	    	// 		var currentHour = currentDate.getHours(); 
	    	// 		var currentMinute = currentDate.getMinutes();

	    	// 		var remainingHours = sunsetHour - currentHour;
	    	// 		var remainingMinutes = sunsetMinutes - currentMinute;

	 				// // don't show negative numbers
	    	// 		if(remainingHours < 0) {
	    	// 			remainingHours = -remainingHours;
	    	// 		}
	    	// 		if(remainingMinutes < 0) {
	    	// 			remainingMinutes = -remainingMinutes;
	    	// 		}
	    			// change message if after sunset
	    			// var cheekyMessage = "";

	    			// if(currentHour > sunsetHour && currentMinute > sunsetMinute) {
	    			// 	cheekyMessage = "The sun has set. Hope you had an amazing day!";

	    			// } else {
	    			// 	cheekyMessage = "You have <br>" + remainingHours + " hr and " + remainingMinutes + " min left <br>before sunset at <br><span class=\"bold\">" + localTimeAtSunset + "</span>";
	    			// }
    	// }

    	// on click, get current position
    	$getLocation.on("click", function(event) {
    		event.preventDefault();
			$getLocation.html("...hang on while I check.");	
			    			    			
	    			
	    			// $getLocation.fadeTo(1000, 0);

	    			//update information
					// $conditions.html(conditions);
					// $temperature.html(tempF+ "  \/ " + tempC);
					// $message.html(cheekyMessage);

					//display the information
	    // 			$circleCon.fadeTo(500, 1);
					// $circleTemp.fadeTo(800, 1);
					// $circleMess.fadeTo(1000, 1);
	        	navigator.geolocation.getCurrentPosition(success, error, options);
	        	calculateTimeTilSunset();
				});
	    	// }

    		// check if geolocation is allowed, if do, run it
	    	// if(navigator.geolocation) {
			// } 
		// });
    }); //________end doc ready_________________________________________________________//

})(jQuery);