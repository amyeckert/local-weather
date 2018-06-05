; 

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
    	"use strict";

        // global variables;
    	const message = document.querySelector(".message");
    	const conditions = document.querySelector(".conditions");
    	const temperature = document.querySelector(".temperature");
    	const information = document.querySelector(".information");
    	const getLocation = document.querySelector(".getLocation");

    	const circleCon = document.querySelector(".circleCon");
    	const circleTemp = document.querySelector(".circleTemp");
    	const circleMess = document.querySelector(".circleMess");
    	let weatherData;
    	let api;
    	let sunset = 0;

    	const options = {
			enableHighAccuracy: true,
			timeout: 7000,
			maximumAge: 0
		};


    	if (!navigator.geolocation) {
		    output.innerHTML = "<p>Geolocation is not supported by your browser. Please enable it to use this silly thing.</p>";
		}

		function error(error) {
    		console.log("Please allow this site to access your location information.");
    		console.warn(`ERROR(${error.code}): ${error.message}`);
    	}

    	function success(position) {
    		let myCoordinates = position.coords;
    		let lat = myCoordinates.latitude
    		let lon = myCoordinates.longitude
    		api = ("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon);
    		return getWeatherData(api);	
    	}

		function getWeatherData(api) {
			fetch(api)
			.then(function(response) {
			    return response.json();
			})
			.then(function(updatedWeatherData) {	
			   	weatherData = updatedWeatherData;
			   	return updateConditions(weatherData);
		    });		
		}

		function updateConditions(weatherData) {
			let tempC = Math.round(weatherData.main.temp);
			let tempF = Math.round((tempC * 1.8000) + 32);
			tempF += "F";
			tempC += "C";	

			let bothTemps = tempF + " \/ " + tempC;
			let localConditions = weatherData.weather[0]["description"];

			conditions.textContent = localConditions;
			temperature.textContent = bothTemps;
    		calculateTimeTilSunset(weatherData);
    		fadeIn();
    	}

    	function calculateTimeTilSunset(weatherData) {
    		let timeData = weatherData;
    		const timeOptions = {
			  hour: 'numeric',
			  minute: 'numeric',
			  hour12: true
			};
			let sunsetUTCHours = timeData.sys.sunset;

			sunset = new Date(0);
			sunset.setUTCSeconds(sunsetUTCHours);
			let sunsetHour = sunset.getHours();
			let sunsetMinutes = sunset.getMinutes();
			let localTimeAtSunset = sunset.toLocaleString('en-US', timeOptions);

			//local time information
			let currentDate = new Date();
			let currentHour = currentDate.getHours(); 
			let currentMinute = currentDate.getMinutes();

			let remainingHours = sunsetHour - currentHour;
			let remainingMinutes = sunsetMinutes - currentMinute;

			//don't allow negative numbers
			if(remainingHours < 0) {
				remainingHours = -remainingHours;
			}
			if(remainingMinutes < 0) {
				remainingMinutes = -remainingMinutes;
			}

			//change message if after sunset
			let cheekyMessage = "";

			if(currentHour > sunsetHour && currentMinute > sunsetMinutes) {
				cheekyMessage = "Hope you had an amazing day!";

			} else {
				cheekyMessage = "You have <br>" + remainingHours + " hr and " + remainingMinutes + " min left <br>before sunset at <br><span class=\"bold\">" + localTimeAtSunset + "</span>";
			}

    		return message.innerHTML = cheekyMessage;
    	}

    	function fadeIn() {
    		circleMess.classList.toggle('fadeIn');
    		circleCon.classList.toggle('fadeIn');
    		circleTemp.classList.toggle('fadeIn');
    	}

    	// function updateIcon(weatherData) {
    	// 	let icon = weatherData.weather[0].icon;
    	// 	console.log(icon);
    	// 	return icon;
    	// }

		// click the button 
		getLocation.addEventListener("click", function( event ) {
			event.preventDefault(event);	
			navigator.geolocation.getCurrentPosition(success, error, options);
	 	});
    }
}

