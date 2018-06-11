; 

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
    	"use strict";
    	// working on implementing this section to automatically prompt for location permission

		// function prompt(window, pref, message, callback) {
		//     let branch = Components.classes["@mozilla.org/preferences-service;1"]
		//                            .getService(Components.interfaces.nsIPrefBranch);

		//     if (branch.getPrefType(pref) === branch.PREF_STRING) {
		//         switch (branch.getCharPref(pref)) {
		//         case "always":
		//             return callback(true);
		//         case "never":
		//             return callback(false);
		//         }
		//     }

		//     let done = false;

		//     function remember(value, result) {
		//         return function() {
		//             done = true;
		//             branch.setCharPref(pref, value);
		//             callback(result);
		//         }
		//     }

		//     let self = window.PopupNotifications.show(
		//         window.gBrowser.selectedBrowser,
		//         "geolocation",
		//         message,
		//         "geo-notification-icon",
		//         {
		//             label: "Share Location",
		//             accessKey: "S",
		//             callback: function(notification) {
		//                 done = true;
		//                 callback(true);
		//             }
		//         }, [
		//             {
		//                 label: "Always Share",
		//                 accessKey: "A",
		//                 callback: remember("always", true)
		//             },
		//             {
		//                 label: "Never Share",
		//                 accessKey: "N",
		//                 callback: remember("never", false)
		//             }
		//         ], {
		//             eventCallback: function(event) {
		//                 if (event === "dismissed") {
		//                     if (!done) callback(false);
		//                     done = true;
		//                     window.PopupNotifications.remove(self);
		//                 }
		//             },
		//             persistWhileVisible: true
		//         });
		// }

		// prompt(window,
		//        "extensions.local-weather.allowGeolocation",
		//        "This page wants to know your location.",
		//        function callback(allowed) { alert(allowed); });
//////////////////////////////////////

  //   	if (!navigator.geolocation) {
		//     alert(" Please enable Geolocation Services in order to use this silly thing.");
		// } else {

        // global variables;
    	const message = document.querySelector(".message");
    	const conditions = document.querySelector(".conditions");
    	const temperature = document.querySelector(".temperature");
    	const information = document.querySelector(".information");
    	const getLocation = document.querySelector(".getLocation");
    	// const background = document.querySelector(".bg-img");
    	const circleCon = document.querySelector(".circleCon");
    	const circleTemp = document.querySelector(".circleTemp");
    	const circleMess = document.querySelector(".circleMess");
    	
    	let api;
    	let sunset = 0;
    	let tempC;
    	let tempF;
    	let weatherData;
    	
    	const options = {
			enableHighAccuracy: true,
			timeout: 7000,
			maximumAge: 0
		};

		function error(error) {
    		alert("Please allow this site to access your location information.");
    		console.warn(`ERROR(${error.code}): ${error.message}`);
    	}

    	function success(position) {
    		let myCoordinates = position.coords;
    		let lat = myCoordinates.latitude
    		let lon = myCoordinates.longitude
    		api = ("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon);
    		// console.log(getLocation.html)
    		return getWeatherData(api);	
    	}

		function getWeatherData(api) {
			fetch(api)
			.then(function(response) {
			    return response.json();
			})
			.then(function(updatedWeatherData) {	
			   	weatherData = updatedWeatherData;
			   	// console.log(weatherData);
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

    	function updateCircleColor(temp) {

    		const temperatureColor  = {
    			freezingCon: 'hsla(259, 100%, 97%, 1)',
    			freezingTemp: 'hsla(197, 100%, 96%, 1)',
    			freezingMess: 'hsla(183, 88%, 90%, 1)',

    			coldCon: 'hsla(233, 93%, 83%, 1)',
    			coldTemp: 'hsla(197, 98%, 81%, 1)',
    			coldMess: 'hsla(173, 88%, 73%, 1)',

    			coolCon: 'hsla(166, 69%, 51%, 1)',
    			coolTemp: 'hsla(175, 96%, 50%, 1)',
    			coolMess: 'hsla(137, 75%, 64%, 1)',

    			mildCon: 'hsla(60, 75%, 59%, 1)',
    			mildTemp: 'hsla(143, 47%, 51%, 1)',
    			mildMess: 'hsla(93, 89%, 41%, 1)',

    			warmCon: 'hsla(48, 100%, 52%, 1)',
    			warmTemp: 'hsla(36, 100%, 64%, 1)',
    			warmMess: 'hsla(20, 100%, 65%, 1)',

    			hotCon: 'hsla(20, 100%, 58%, 1)',
    			hotTemp: 'hsla(2, 100%, 50%, 1)',
    			hotMess: 'hsla(351, 91%, 64%, 1)'
			} 

			if(temp < 32 ) {
				circleCon.style.backgroundColor = temperatureColor.freezingCon;
				circleTemp.style.backgroundColor = temperatureColor.freezingTemp;
				circleMess.style.backgroundColor = temperatureColor.freezingMess;
				console.log('it\'s bloody freezing!');
			}
			if (temp >= 33 && temp <= 45) {
				circleCon.style.backgroundColor = temperatureColor.coldCon;
				circleTemp.style.backgroundColor = temperatureColor.coldTemp;
				circleMess.style.backgroundColor = temperatureColor.coldMess;
					console.log('it\'s cold!');
			}
			if (temp >= 46 && temp <= 55) {
				circleCon.style.backgroundColor = temperatureColor.coolCon;
				circleTemp.style.backgroundColor = temperatureColor.coolTemp;
				circleMess.style.backgroundColor = temperatureColor.coolMess;
					console.log('it\'s cool!');
			}
			if (temp >= 56 && temp <= 68) {
				circleCon.style.backgroundColor = temperatureColor.mildCon;
				circleTemp.style.backgroundColor = temperatureColor.mildTemp;
				circleMess.style.backgroundColor = temperatureColor.mildMess;
					console.log('it\'s mild!');
			}
			if (temp >= 69 && temp <= 84) {
				circleCon.style.backgroundColor = temperatureColor.warmCon;
				circleTemp.style.backgroundColor = temperatureColor.warmTemp;
				circleMess.style.backgroundColor = temperatureColor.warmMess;
					console.log('it\'s warm!');
			}
			if (temp >= 85) {
				circleCon.style.backgroundColor = temperatureColor.hotCon;
				circleTemp.style.backgroundColor = temperatureColor.hotTemp;
				circleMess.style.backgroundColor = temperatureColor.hotMess;
					console.log('it\'s hot!');
			}
    	}
    	
		getLocation.addEventListener("click", function( event ) {
			event.preventDefault(event);
			getLocation.innerHTML = "One moment, please...";
			navigator.geolocation.getCurrentPosition(success, error, options);

			updateCircleColor();
	 	});
	}
}

