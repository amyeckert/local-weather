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
    		displayTime = document.querySelector("#display__time"),
            // duration,
            localTimeAtSunrise,
            localTimeAtSunset,
            sunset,
            sunrise,
            tempC,
            tempF,
            temperatureColor,
            timeNow,
            timeAtEnd,
            timeAtSunrise,
            timeAtSunset,
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

        function getLocalTimeOfSunsetAndSunrise(weatherData) {
            sunset = new Date(0);
            sunrise = new Date(0);
            timeAtSunset = weatherData.sys.sunset;
            timeAtSunrise = weatherData.sys.sunrise;
            sunset.setUTCSeconds(timeAtSunset);
            sunrise.setUTCSeconds(timeAtSunrise);

            localTimeAtSunset = sunset.toLocaleString('en-US', timeOptions);
            localTimeAtSunrise = sunrise.toLocaleString('en-US', timeOptions);	

            chooseEndTime(sunrise, sunset);
            return initializeClock('countdown', timeAtEnd);
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

        }

        //////////////////////////////////////
        /// Countdown timer. source: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
        //////////////////////////////////////

        function getTimeRemaining(timeAtEnd) {
            timeNow = Date.parse(new Date());
            let duration = Date.parse(timeAtEnd) - timeNow

            let seconds = Math.floor( (duration / 1000) % 60);
            let minutes = Math.floor( (duration / 1000 / 60) % 60);
            let hours = Math.floor( (duration / (1000 * 60 * 60)) % 24);

            // console.log("duration = " + hours + ":" + minutes + ":" + seconds);
            return {
                'total': duration,
                'hours': hours,  
                'minutes': minutes,
                'seconds': seconds
            }
        }

        function chooseEndTime(sunrise, sunset) {
            let now = Date.now();
            let nowString = '' + now;
            nowString = Number(nowString.slice(0, -3));
            now = nowString;
            console.log(now, nowString); 
            console.log("sunrise = " + sunrise + ", sunset = " + sunset);
         
            // now = new Date('June 19, 2018 22:24:00'); 
            let riseOrSet = document.querySelector(".display__sunset_sunrise");

            if (now >= timeAtSunrise && now <= timeAtSunset) {
                riseOrSet.innerHTML = " sunset ";    
                displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunset + ".</span>";
                timeAtEnd = sunset;
                // console.log("countdown to sunset at " + localTimeAtSunset);
            }
          
            else  {
                riseOrSet.innerHTML = " sunrise "; 
                displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunrise + ".</span>";
                timeAtEnd = sunrise;
                // console.log("countdown to sunrise at " + localTimeAtSunrise);
            }

            return timeAtEnd;
        }

        function initializeClock(id, endtime) {
            countdown = document.querySelector('#countdown');
            let hoursSpan = document.querySelector('.hours');
            let minutesSpan = document.querySelector('.minutes');
            let secondsSpan = document.querySelector('.seconds');

            function updateClock() {
                var time = getTimeRemaining(endtime);

                //update the countdown display
                hoursSpan.innerHTML = ('0' + time.hours).slice(-2);
                minutesSpan.innerHTML = ('0' + time.minutes).slice(-2);
                secondsSpan.innerHTML = ('0' + time.seconds).slice(-2);
            }

	    	updateClock();
	    	let timeinterval = setInterval(updateClock, 1000);
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

