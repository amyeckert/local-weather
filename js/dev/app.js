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
		//        function callback(allowed) { alert(allowed); 
  //      });
////////////////////////////////////

    	if (!navigator.geolocation) {
		    alert(" Please enable Geolocation Services in order to use this silly thing.");
		} 
		////////////////////
        // global variables;
        //////////////////// 
    	const circleCon = document.querySelector(".circleCon");
    	const circleTemp = document.querySelector(".circleTemp");
    	const circleMess = document.querySelector(".circleMess");
    	const conditions = document.querySelector(".conditions");
    	const getLocation = document.querySelector(".getLocation");
    	const information = document.querySelector(".information");
    	const temperature = document.querySelector(".temperature");
    	
    	let api,
    		countdown, 
    		duration,
    		displaySunset = document.querySelector("#sunset"),
    		sunset,
    		tempC,
    		tempF,
    		weatherData;
    	
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
    		getLocalTimeOfSunset(weatherData);
    		fadeIn();
    		fadeOut();
    	}


    	function getLocalTimeOfSunset(weatherData) {
    		const timeOptions12Hour = {
			  hour: 'numeric',
			  minute: 'numeric',
			  hour12: true
			};

			let now = Date.now();
			sunset = new Date(0);
			let sunsetUTCHours = weatherData.sys.sunset;
			sunset.setUTCSeconds(sunsetUTCHours);

			let localTimeAtSunset12Hour = sunset.toLocaleString('en-US', timeOptions12Hour);
			
			displaySunset.innerHTML = "<span class=\"bold\">" + localTimeAtSunset12Hour + ".</span>";
    		
    		return initializeClock(sunset);
    	}
    	//////////////////////////////////////
    	/// Countdown timer. source: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
    	//////////////////////////////////////
    	function getTimeRemaining(sunset) {
    		duration = Date.parse(sunset) - Date.parse(new Date());
    		let seconds = Math.floor( (duration / 1000) % 60);
    		let minutes = Math.floor( (duration / 1000 / 60) % 60);
    		let hours = Math.floor( (duration / (1000 * 60 * 60)) %24);

    		return {
    			'hours': hours, 
    			'minutes': minutes,
    			'seconds': seconds
    		}
    	}

    	function initializeClock(sunset) {
    		countdown = document.querySelector('#countdown');
    		let showHours = document.querySelector('.hours');
    		let showMin = document.querySelector('.minutes');
    		let showSec = document.querySelector('.seconds');

    		function updateClock() {
    			let time = getTimeRemaining(sunset);
    			showHours.innerHTML = ('0' + time.hours).slice(-2);
    			showMin.innerHTML =	('0' + time.minutes).slice(-2);
    			showSec.innerHTML = ('0' + time.seconds).slice(-2);

	    		if(time.total <= 0){
	    			clearInterval(timeinterval);
	    		}	
	    	}
	    	updateClock();
	    	let timeinterval = setInterval(updateClock, 1000);
    	}
    	//////////////////////////////////////////////////////

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
    		
    			'freezing': {
    				con: 'hsla(259, 100%, 97%, 1)',
    				temp: 'hsla(197, 100%, 96%, 1)',
    				mess: 'hsla(183, 88%, 90%, 1)'	
    			}, 

    			'cold':  {
    				con: 'hsla(233, 93%, 83%, 1)',
    				temp: 'hsla(197, 98%, 81%, 1)',
    				mess: 'hsla(173, 88%, 73%, 1)'
    			},

    			'cool': {
	    			con: 'hsla(166, 69%, 51%, 1)',
	    			temp: 'hsla(175, 96%, 50%, 1)',
	    			mess: 'hsla(137, 75%, 64%, 1)'
    				
    			},

    			'mild' : {
	    			con: 'hsla(60, 75%, 59%, 1)',
	    			temp: 'hsla(143, 47%, 51%, 1)',
	    			mess: 'hsla(93, 89%, 41%, 1)'	
    			}, 

    			'warm': {
	    			con: 'hsla(48, 100%, 52%, 1)',
	    			temp: 'hsla(36, 100%, 64%, 1)',
	    			mess: 'hsla(20, 100%, 65%, 1)'
    			},

    			'hot': {
	    			con: 'hsla(20, 100%, 58%, 1)',
	    			temp: 'hsla(2, 100%, 50%, 1)',
	    			mess: 'hsla(351, 91%, 64%, 1)'	
    			}
			} 

			if(temp < 32 ) {
				circleCon.style.backgroundColor = temperatureColor.freezing.con;
				circleTemp.style.backgroundColor = temperatureColor.freezing.temp;
				circleMess.style.backgroundColor = temperatureColor.freezing.mess;
				console.log('it\'s bloody freezing!');
			}
			if (temp >= 33 && temp <= 45) {
				circleCon.style.backgroundColor = temperatureColor.cold.con;
				circleTemp.style.backgroundColor = temperatureColor.cold.temp;
				circleMess.style.backgroundColor = temperatureColor.cold.mess;
					console.log('it\'s cold!');
			}
			if (temp >= 46 && temp <= 55) {
				circleCon.style.backgroundColor = temperatureColor.cool.con;
				circleTemp.style.backgroundColor = temperatureColor.cool.temp;
				circleMess.style.backgroundColor = temperatureColor.cool.mess;
					console.log('it\'s cool!');
			}
			if (temp >= 56 && temp <= 68) {
				circleCon.style.backgroundColor = temperatureColor.mild.con;
				circleTemp.style.backgroundColor = temperatureColor.mild.temp;
				circleMess.style.backgroundColor = temperatureColor.mild.mess;
					console.log('it\'s mild!');
			}
			if (temp >= 69 && temp <= 84) {
				circleCon.style.backgroundColor = temperatureColor.warm.con;
				circleTemp.style.backgroundColor = temperatureColor.warm.temp;
				circleMess.style.backgroundColor = temperatureColor.warm.mess;
					console.log('it\'s warm!');
			}
			if (temp >= 85) {
				circleCon.style.backgroundColor = temperatureColor.hot.con;
				circleTemp.style.backgroundColor = temperatureColor.hot.temp;
				circleMess.style.backgroundColor = temperatureColor.hot.mess;
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

