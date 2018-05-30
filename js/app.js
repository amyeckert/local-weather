;(function($) {

    $(document).ready(function() {

    	// on click, get current location
    	$(".getLocation").on("click", function(event) {
    		event.preventDefault();
    		console.log("clicked");
	    	var lat;
	    	var lon;
    		
	    	if(navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition( function(position) {
	        		lat = location.coords.latitude;
	        		lon = location.coords.longitude;

			        console.log("Found your location \nLat : "+location.coords.latitude+" \nLang :"+ location.coords.longitude);
        		});
    		}
	    	

			// function onError() {
			// 	console.log("geolocation error");
			// }
	    	// then call the API 
			var api = "https://fcc-weather-api.glitch.me/api/current?" + location.coords.latitude + "&" +location.coords.longitude;
			$.get(api, function(data) {
				console.log(data);
			});
		});

    }); //________end doc ready_________________________________________________________//

})(jQuery);