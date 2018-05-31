;(function($) {

    $(document).ready(function() {


    	// on click, get current position
    	$(".getLocation").on("click", function(event) {
    		event.preventDefault();
    		
	    	function success(position){
	    		const myCoordinates = position.coords;
	    		let lat = myCoordinates.latitude
	    		let lon = myCoordinates.longitude
	    		let api = ("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon);

	    		$.get(api, function(data) {
					console.log(data);

						
				});
	    	}

	    	function error(error) {
	    		console.warn(`ERROR(${error.code}): ${error.message}`);
	    	}

	    	var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

    		// check if it is allowed
	    	if(navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition(success, error, options);
				
			} 
		
		});

    }); //________end doc ready_________________________________________________________//

})(jQuery);