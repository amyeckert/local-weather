; 

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
    	"use strict";

    	if (!navigator.geolocation) {
		    output.innerHTML = "<p>Geolocation is not supported by your browser. Please enable it to use this silly thing.</p>";
		} else {

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
	    	let tempC;
	    	let tempF;

	    	const options = {
				enableHighAccuracy: true,
				timeout: 7000,
				maximumAge: 0
			};

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
				tempC = Math.round(weatherData.main.temp);
				tempF = Math.round((tempC * 1.8000) + 32);
				updateCircleColor(tempF);

				tempF += "F";
				tempC += "C";	

				let bothTemps = tempF + " \/ " + tempC;
				let localConditions = weatherData.weather[0]["description"];

				conditions.textContent = localConditions;
				temperature.textContent = bothTemps;
	    		calculateTimeTilSunset(weatherData);
	    		fadeIn();
	    		fadeOut();
	    	}

	    	function calculateTimeTilSunset(weatherData) {
	    		let timeData = weatherData;
	    		const timeOptions12Hour = {
				  hour: 'numeric',
				  minute: 'numeric',
				  hour12: true
				};

				const timeOptions24Hour = {
				  hour: 'numeric',
				  minute: 'numeric',
				  hour12: false
				};

				let sunsetUTCHours = timeData.sys.sunset;
				sunset = new Date(0);
				sunset.setUTCSeconds(sunsetUTCHours);
				let sunsetHour = sunset.getHours();
				let sunsetMinutes = sunset.getMinutes();
				let localTimeAtSunset12Hour = sunset.toLocaleString('en-US', timeOptions12Hour);
				let localTimeAtSunset24Hour = sunset.toLocaleString('en-US', timeOptions24Hour);

				//local time information
				let currentDate = new Date();
				let currentHour = currentDate.getHours(); 
				let currentMinute = currentDate.getMinutes();

				//check if sunset has passed. 
				let remainingHours = sunsetHour - currentHour;
				let remainingMinutes = sunsetMinutes - currentMinute;
				let now = currentHour + ":" + currentMinute;
				let cheekyMessage = "";
				
				if(remainingHours < 0) {
					remainingHours = -remainingHours;
				}
				if(remainingMinutes < 0) {
					remainingMinutes = -remainingMinutes;
				}

				if(now > localTimeAtSunset24Hour) {
					cheekyMessage = "Hope you had an amazing day!";
					
				} else {
					cheekyMessage = "You have <br>" + remainingHours + " hr and " + remainingMinutes + " min left <br>before sunset at <br><span class=\"bold\">" + localTimeAtSunset12Hour + "</span>";
					
				}
				console.log(now, localTimeAtSunset24Hour, localTimeAtSunset12Hour);
	    		return message.innerHTML = cheekyMessage;
	    	}

	    	function fadeIn() {
	    		circleMess.classList.toggle('fadeIn');
	    		circleCon.classList.toggle('fadeIn');
	    		circleTemp.classList.toggle('fadeIn');
	    		
	    	}

	    	function fadeOut() {
	    		getLocation.classList.toggle('fadeOut');
	    	}

	    	// function updateIcon(weatherData) {
	    	// 	let icon = weatherData.weather[0].icon;
	    	// 	console.log(icon);
	    	// 	return icon;
	    	// }

	    	function updateCircleColor(temp) {

	    		const temperatureColor  = {
	    			freezing: 'hsla(276, 98%, 88%, 1)',
	    			cold: 'hsla(197, 98%, 81%, 1)',
	    			cool: 'hsla(175, 96%, 50%, 0.98)',
	    			mild: 'hsla(91, 49%, 50%, 0.99)',
	    			warm: 'hsla(35, 99%, 50%, 0.99)',
	    			hot: 'hsla(15, 97%, 50%, 0.99)'
				}

				if(temp < 32 ) {
					circleCon.style.backgroundColor = temperatureColor.freezing;
					console.log('it\'s bloody freezing!');

				}
				if (temp >= 33 && temp <= 45) {
					circleCon.style.backgroundColor = temperatureColor.cold;
						console.log('it\'s cold!');
				}
				if (temp >= 46 && temp <= 55) {
					circleCon.style.backgroundColor = temperatureColor.cool;
						console.log('it\'s cool!');
				}
				if (temp >= 56 && temp <= 68) {
					circleCon.style.backgroundColor = temperatureColor.mild;
						console.log('it\'s mild!');
				}
				if (temp >= 69 && temp <= 84) {
					circleCon.style.backgroundColor = temperatureColor.warm;
						console.log('it\'s warm!');
				}
				if (temp >= 85) {
					circleCon.style.backgroundColor = temperatureColor.hot;
						console.log('it\'s hot!');
				}
	    	}

	    	// function updateBackgroundImage(arg) {

	    	// }


			getLocation.addEventListener("click", function( event ) {
				event.preventDefault(event);	
				navigator.geolocation.getCurrentPosition(success, error, options);
				updateCircleColor();
		 	});
		}
    }
}

