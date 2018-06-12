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


		////////////////////
        // global variables;
        //////////////////// 
    	const conditions = document.querySelector(".conditions");
    	const temperature = document.querySelector(".temperature");
    	const information = document.querySelector(".information");
    	const getLocation = document.querySelector(".getLocation");
    	const circleCon = document.querySelector(".circleCon");
    	const circleTemp = document.querySelector(".circleTemp");
    	const circleMess = document.querySelector(".circleMess");
    	const display = document.querySelector('#time');
    	let api,
    		tempC,
    		tempF,
    		weatherData,
    		sunset,
    		durationInMinutes, 
    		displaySunset = document.querySelector("#sunset");
    	
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
    		calculateMinutesUntilSunset(weatherData);
    		fadeIn();
    		fadeOut();
    	}

    	function calculateMinutesUntilSunset(weatherData) {
    	
    		const timeOptions12Hour = {
			  hour: 'numeric',
			  minute: 'numeric',
			  hour12: true
			};

			let now = Date.now();
			sunset = new Date(0);
			let sunsetUTCHours = weatherData.sys.sunset;
			sunset.setUTCSeconds(sunsetUTCHours);

			let utcInterval =  Math.abs(now - sunset); //milliseconds between now and sunset
			durationInMinutes = utcInterval;

			// let sunsetHour = sunset.getHours();
			// let sunsetMinutes = sunset.getMinutes();



			// let interval = new Date(utcInterval * 1000); //convert to miliseconds
			// let hours = (interval.getHours()) * 60;
			// let minutes = (interval.getMinutes()) * 60;
			// durationInMinutes = hours + minutes;

			let localTimeAtSunset12Hour = sunset.toLocaleString('en-US', timeOptions12Hour);
			// if(now > localTimeAtSunset24Hour) {
			displaySunset.innerHTML = "<span class=\"bold\">" + localTimeAtSunset12Hour + ".</span>";
				
			// } 
			// else {
			// 	displaySunset.innerHTML = "Hope you had an amazing day!";
				
			// }
			// console.log("current time = " + now);
			console.log(weatherData, utcInterval);
			// console.log(sunsetHour, sunsetMinutes);
			console.log("duration = " + durationInMinutes + " milliseconds");
    		
    		return startTimer(durationInMinutes, display);
    	}

    	//////////////////////////
    	// countdown until sunset- duration must be in seconds.
    	//source: https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
    	/////////////////////////
    	function startTimer(durationInMinutes, display) {
		    let start = Date.now(),
		        diff,
		        minutes,
		        seconds,
		        hours;
	    		

		    function timer() {
		        // get the number of seconds that have elapsed since 
		        // startTimer() was called
		        diff = durationInMinutes - (((Date.now() - start) / 1000) | 0);

		        // does the same job as parseInt -truncates the float
		        minutes = (diff / (1000 * 60)) % 60 | 0; 	// (diff / 60)  | 0;
		        seconds = (diff / 1000) % 60 | 0;  			// (diff % 60) | 0;
		        hours = (diff / (1000 * 60 * 60)) % 24 | 0; // minutes / 60 | 0;
 
		        hours = hours < 10 ? "0" + hours : hours;
		        minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        display.textContent = hours + ":" + minutes + ":" + seconds + " left" ; 

		        if (diff <= 0) {
		            // add one second so that the count down starts at the full duration
		            // example 05:00 not 04:59
		            start = Date.now() + 1000;
		        }
		    };
		    // we don't want to wait a full second before the timer starts
		    timer();
		    setInterval(timer, 1000); 
		}
		///////////////////////////

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

