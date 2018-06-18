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
        const timeOptions = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            };

    	let api,
    		countdown, 
    		duration,
    		displayTime = document.querySelector("#display__time"),
            endtime,
            localTimeAtSunrise,
            localTimeAtSunset,
            sunset,
            sunrise,
            tempC,
            tempF,
            temperatureColor,
            timeTilEnd,
            timeTilSunrise,
            timeTilSunset,
            weatherData, 
            sunriseHour,
            sunriseMinute,
            sunsetHour,
            sunsetMinute;
    	
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
    		getLocalTimeOfSunsetAndSunrise(weatherData);
    		fadeInAnimate();
    		fadeOut();
            console.log(weatherData);
    	}

    	function getLocalTimeOfSunsetAndSunrise(weatherData) {
    		
			sunset = new Date(0);
            sunrise = new Date(0);
  
            let sunsetUTCHours = weatherData.sys.sunset;
            let sunriseUTCHours = weatherData.sys.sunrise;

            sunset.setUTCSeconds(sunsetUTCHours);
            sunrise.setUTCSeconds(sunriseUTCHours);

            sunriseHour = sunrise.getHours();
            sunriseMinute = sunrise.getMinutes();
            sunsetHour = sunset.getHours();
            sunsetMinute = sunset.getMinutes();

            localTimeAtSunset = sunset.toLocaleString('en-US', timeOptions);
            localTimeAtSunrise = sunrise.toLocaleString('en-US', timeOptions);
            // console.log("Sunrise = " + sunriseHour + ", Sunset = " + sunsetHour );

            return initializeClock(sunrise, sunset);
        }
        //////////////////////////////////////
        /// Countdown timer. source: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
        //////////////////////////////////////

        function getTimeRemainingTilSunset(sunset) {
            timeTilSunset = Date.parse(sunset) - Date.parse(new Date());
            let seconds = Math.floor( (timeTilSunset / 1000) % 60);
            let minutes = Math.floor( (timeTilSunset / 1000 / 60) % 60);
            let hours = Math.floor( (timeTilSunset / (1000 * 60 * 60)) %24);
            console.log("MS until sunset = " + timeTilSunset + " hours: " + hours + " min: " + minutes);
            return {
                'hours': hours, 
                'minutes': minutes,
                'seconds': seconds
            }
        }

        function getTimeRemainingTilSunrise(sunrise) {
            timeTilSunrise = Date.parse(sunrise) - Date.parse(new Date());
            let seconds = Math.floor( (timeTilSunrise / 1000) % 60);
            let minutes = Math.floor( (timeTilSunrise / 1000 / 60) % 60);
            let hours = Math.floor( (timeTilSunrise / (1000 * 60 * 60)) %24);
            console.log("MS until sunrise = " + timeTilSunrise + " hours: " + hours + " min: " + minutes);
            return {
                'hours': hours, 
                'minutes': minutes,
                'seconds': seconds 
            }
        }

        function initializeClock(sunset, sunrise) {
            countdown = document.querySelector('#countdown');
            let showHours = document.querySelector('.hours');
            let showMin = document.querySelector('.minutes');
            let showSec = document.querySelector('.seconds');
        

            function updateClock() {
                let timeNow = new Date();
                // let timeNow = new Date('June 18, 2018 22:24:00');
                let nowHour = timeNow.getHours();
                let nowMinute = timeNow.getMinutes();
                let riseOrSet = document.querySelector(".display__sunset_sunrise");

                console.log(timeNow);

                // time now is after sunsetHour but before sunsetMinute, get time til sunset
                if (nowHour >= sunsetHour && nowMinute <= sunsetMinute ) {
                    timeTilEnd = getTimeRemainingTilSunset(sunset);
                    riseOrSet.innerHTML = " sunset ";    
                    displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunset + ".</span>";

                    if(timeTilEnd.hours < 0 || timeTilEnd.minutes < 0 || timeTilEnd.seconds < 0) {
                        timeTilEnd.hours = -timeTilEnd.hours;
                        timeTilEnd.minutes = -timeTilEnd.minutes;
                        timeTilEnd.seconds = -timeTilEnd.seconds;
                    }

                    console.log("time now is after sunsetHour but still before sunsetMinute, so still calculate time til sunset");

                // time now is after sunsetHour AND after sunsetMinute, get time til sunrise
                } else if (nowHour >= sunsetHour && nowMinute >= sunsetMinute) { 
                    timeTilEnd = getTimeRemainingTilSunrise(sunrise);
                    riseOrSet.innerHTML = " sunrise ";    
                    displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunrise + ".</span>";

                    if(timeTilEnd.hours < 0 || timeTilEnd.minutes < 0 || timeTilEnd.seconds < 0) {
                        timeTilEnd.hours = -timeTilEnd.hours;
                        timeTilEnd.minutes = -timeTilEnd.minutes;
                        timeTilEnd.seconds = -timeTilEnd.seconds;
                    }

                    console.log(timeTilEnd.hours, timeTilEnd.minutes, timeTilEnd.seconds);
                    console.log("time now is after sunsetHour AND sunsetMinute, get time til sunrise");

                // time now is before sunsetHour and sunsetMinute, calculate time til sunset
                } else {
                    timeTilEnd = getTimeRemainingTilSunset(sunset);
                    riseOrSet.innerHTML = " sunset ";
                    displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunset+ ".</span>";

                    if(timeTilEnd.hours < 0 || timeTilEnd.minutes < 0 || timeTilEnd.seconds < 0) {
                        timeTilEnd.hours = -timeTilEnd.hours;
                        timeTilEnd.minutes = -timeTilEnd.minutes;
                        timeTilEnd.seconds = -timeTilEnd.seconds;
                    }
                    console.log(timeTilEnd.hours, timeTilEnd.minutes, timeTilEnd.seconds);
                    console.log("else statement");

                }

                //update the countdown
                showHours.innerHTML = ('0' + timeTilEnd.hours).slice(-2);
                showMin.innerHTML = ('0' + timeTilEnd.minutes).slice(-2);
                showSec.innerHTML = ('0' + timeTilEnd.seconds).slice(-2);

                if(timeTilEnd.total <= 0){
                    clearInterval(timeinterval);
                }

            }
	    	updateClock();
	    	let timeinterval = setInterval(updateClock, 1000); //updates clock every second
    	}
    	//////////////////////////////////////////////////////

    	function fadeInAnimate() {
    		circleCon.classList.toggle('breathe');
    		circleTemp.classList.toggle('dropIn');	
    		circleMess.classList.toggle('fadeIn');
    	}	

    	function fadeOut() {
    		getLocation.classList.toggle('fadeOut');
    	}

    	function updateCircleColor(temp) {
    		temperatureColor  = {
    			'freezing': {
    				con: 'hsla(259, 100%, 97%, 1)',
    				temp: 'hsla(197, 100%, 96%, 1)',
    				mess: [
                        'hsla(183, 88%, 90%, 0.5)',
                        'hsla(183, 88%, 90%, 0.9)',
                        'hsla(183, 88%, 90%, 1)'
                        ]	
    			}, 
    			'cold':  {
    				con: 'hsla(233, 93%, 83%, 1)',
    				temp: 'hsla(197, 98%, 81%, 1)',
    				mess: [
                        'hsla(173, 88%, 73%, 0.5)',    
                        'hsla(173, 88%, 73%, 0.9)',    
                        'hsla(173, 88%, 73%, 1)'
                    ]
    			},
    			'cool': {
	    			con: 'hsla(166, 69%, 51%, 1)',
	    			temp: 'hsla(175, 96%, 50%, 1)',
	    			mess: [
                        'hsla(137, 75%, 64%, 0.5)',
                        'hsla(137, 75%, 64%, 0.9)',
                        'hsla(137, 75%, 64%, 1)'
    				]
    			},
    			'mild' : {
	    			con: 'hsla(60, 75%, 59%, 1)',
	    			temp: 'hsla(143, 47%, 51%, 1)',
	    			mess: [
                        'hsla(93, 89%, 41%, 0.5)',
                        'hsla(93, 89%, 41%, 0.9)',
                        'hsla(93, 89%, 41%, 1)'
                    ]	
    			}, 
    			'warm': {
	    			con: 'hsla(48, 100%, 52%, 1)',
	    			temp: 'hsla(36, 100%, 64%, 1)',
	    			mess: [
	    				'hsla(20, 100%, 65%, 0.50)',
                        'hsla(20, 100%, 65%, 0.90)',
                        'hsla(20, 100%, 65%, 1)'
                    ]
    			},
    			'hot': {
	    			con: 'hsla(20, 100%, 58%, 1)',
	    			temp: 'hsla(2, 100%, 50%, 1)',
	    			mess: [
                        'hsla(351, 91%, 64%, 0.5)',
                        'hsla(351, 91%, 64%, 0.9)',
                        'hsla(351, 91%, 64%, 1)'
                    ]	
    			}
			} 

			if(temp < 32 ) {
				circleCon.style.backgroundColor = temperatureColor.freezing.con;
				circleTemp.style.backgroundColor = temperatureColor.freezing.temp;
				circleMess.style.background = "radial-gradient(" + temperatureColor.freezing.mess[0]  +", " + temperatureColor.freezing.mess[1]+ ", " + temperatureColor.freezing.mess[2] + ")";
				// console.log('it\'s bloody freezing!');
			}
			if (temp >= 33 && temp <= 45) {
				circleCon.style.backgroundColor = temperatureColor.cold.con;
				circleTemp.style.backgroundColor = temperatureColor.cold.temp;
				circleMess.style.background = "radial-gradient(" + temperatureColor.cold.mess[0]  +", " + temperatureColor.cold.mess[1]+ ", " + temperatureColor.cold.mess[2] + ")";
					// console.log('it\'s cold!');
			}
			if (temp >= 46 && temp <= 55) {
				circleCon.style.backgroundColor = temperatureColor.cool.con;
				circleTemp.style.backgroundColor = temperatureColor.cool.temp;
				circleMess.style.background = "radial-gradient(" + temperatureColor.cool.mess[0]  +", " + temperatureColor.cool.mess[1]+ ", " + temperatureColor.cool.mess[2] + ")";
					// console.log('it\'s cool!');
			}
			if (temp >= 56 && temp <= 68) {
				circleCon.style.backgroundColor = temperatureColor.mild.con;
				circleTemp.style.backgroundColor = temperatureColor.mild.temp;
				circleMess.style.background = "radial-gradient(" + temperatureColor.mild.mess[0]  +", " + temperatureColor.mild.mess[1]+ ", " + temperatureColor.mild.mess[2] + ")";
					// console.log('it\'s mild!');
			}

			if (temp >= 69 && temp <= 84) {
				circleCon.style.backgroundColor = temperatureColor.warm.con;
				circleTemp.style.backgroundColor = temperatureColor.warm.temp;
				circleMess.style.background = "radial-gradient(" + temperatureColor.warm.mess[0]  +", " + temperatureColor.warm.mess[1]+ ", " + temperatureColor.warm.mess[2] + ")";
				// console.log("warm!");
            } 

            if (temp >= 85) {
                circleCon.style.backgroundColor = temperatureColor.hot.con;
                circleTemp.style.backgroundColor = temperatureColor.hot.temp;
                circleMess.style.background = "radial-gradient(" + temperatureColor.hot.mess[0]  +", " + temperatureColor.hot.mess[1]+ ", " + temperatureColor.hot.mess[2] + ")";
                    // console.log('it\'s hot!');
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

