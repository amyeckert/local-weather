; 
document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
    	"use strict";
    	// working on implementing this section to automatically prompt for location permission

		// function prompt(window, pref, clockage, callback) {
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
		//         clockage,
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
        const getLocation = document.querySelector(".getLocation");
        const information = document.querySelector(".information");
        const temperature = document.querySelector(".temperature");
    	const conditions = document.querySelector(".conditions");
        const timeOptions = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            };
        let circleCon = document.querySelector(".circleCon");
        let circleTemp = document.querySelector(".circleTemp");
        let circleClock = document.querySelector(".circleClock");
        let colors = { 
            'day': {
                'freezing': {
                    con: 'hsla(259, 100%, 97%, 1)',
                    temp: 'hsla(197, 100%, 96%, 1)',
                    clock: [
                        'hsla(183, 88%, 90%, 0.5)',
                        'hsla(183, 88%, 90%, 0.9)',
                        'hsla(183, 88%, 90%, 1)'
                        ]   
                }, 
                'cold':  {
                    con: 'hsla(233, 93%, 83%, 1)',
                    temp: 'hsla(197, 98%, 81%, 1)',
                    clock: [
                        'hsla(173, 88%, 73%, 0.5)',    
                        'hsla(173, 88%, 73%, 0.9)',    
                        'hsla(173, 88%, 73%, 1)'
                    ]
                },
                'cool': {
                    con: 'hsla(166, 69%, 51%, 1)',
                    temp: 'hsla(175, 96%, 50%, 1)',
                    clock: [
                        'hsla(137, 75%, 64%, 0.5)',
                        'hsla(137, 75%, 64%, 0.9)',
                        'hsla(137, 75%, 64%, 1)'
                    ]
                },
                'mild' : {
                    con: 'hsla(60, 75%, 59%, 1)',
                    temp: 'hsla(143, 47%, 51%, 1)',
                    clock: [
                        'hsla(93, 89%, 41%, 0.5)',
                        'hsla(93, 89%, 41%, 0.9)',
                        'hsla(93, 89%, 41%, 1)'
                    ]   
                }, 
                'warm': {
                    con: 'hsla(48, 100%, 52%, 1)',
                    temp: 'hsla(17, 85%, 50%, 1)',
                    clock: [
                        'hsla(20, 100%, 65%, 0.50)',
                        'hsla(20, 100%, 65%, 0.90)',
                        'hsla(20, 100%, 65%, 1)'
                    ]
                },
                'hot': {
                    con: 'hsla(20, 100%, 58%, 1)',
                    temp: 'hsla(2, 100%, 50%, 1)',
                    clock: [
                        'hsla(351, 91%, 64%, 0.5)',
                        'hsla(351, 91%, 64%, 0.9)',
                        'hsla(351, 91%, 64%, 1)'
                    ]   
                }
            }, 
            'night': {
                night_text: 'hsla(0, 0%, 100%, 1)',
                con: 'hsla(0, 0%, 7%, 1)',
                temp: 'hsla(247, 9%, 17%, 1)',
                clock: 'hsla(170, 12%, 10%, 1)',
                freezing: 'hsla(291, 47%, 3%, 1)',
                cold: 'hsla(246, 100%, 4%, 1)',
                cool: 'hsla(220, 45%, 6%, 1)',
                mild: 'hsla(114, 83%, 2%, 1)',
                warm: 'hsla(44, 100%, 3%, 1)',
                hot: 'hsla(0, 79%, 4%, 1)'
            }   
        }

    	let api,
    		countdown,
    		displayTime = document.querySelector("#display__time"),
            localTimeAtSunrise,
            localTimeAtSunset,
            sunset,
            sunrise,
            tempC,
            tempF, 
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
    		console.warn(`ERROR(${error.code}): ${error.clockage}`);
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
            updateBackgroundColor(tempF);
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

            return {
                'total': duration,
                'hours': hours,  
                'minutes': minutes,
                'seconds': seconds
            }
        }

        function chooseEndTime(sunrise, sunset) {
            let riseOrSet = document.querySelector(".display__sunset_sunrise");
            let now = Date.now();
            let nowString = '' + now;
            nowString = Number(nowString.slice(0, -3));
            now = nowString;
         
            // let now = new Date('June 20, 2018 22:24:00'); 
            if (now >= timeAtSunrise && now <= timeAtSunset) {
                riseOrSet.innerHTML = " sunset ";    
                displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunset + ".</span>";
                timeAtEnd = sunset;
                updateCircleColor();
            }
            else  {
                riseOrSet.innerHTML = " sunrise "; 
                displayTime.innerHTML = "<span class=\"bold\">" + localTimeAtSunrise + ".</span>";
                timeAtEnd = sunrise;
                updateBackgroundColor(tempF);
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

    	function fadeInAnimate() {
    		circleCon.classList.toggle('breathe');
    		circleTemp.classList.toggle('dropIn');	
    		circleClock.classList.toggle('fadeIn');
    	}	

    	function fadeOut() {
    		getLocation.classList.toggle('fadeOut');
    	}

    	function updateCircleColor(temp) {
    		//daytime color scheme
			if(temp < 32 ) {
				circleCon.style.background = colors.day.freezing.con;
				circleTemp.style.background = colors.day.freezing.temp;
				circleClock.style.background = "radial-gradient(" + colors.day.freezing.clock[0]  +", " + colors.day.freezing.clock[1]+ ", " + colors.day.freezing.clock[2] + ")";
			}
			if (temp >= 33 && temp <= 45) {
				circleCon.style.backgroundColor = colors.day.cold.con;
				circleTemp.style.backgroundColor = colors.day.cold.temp;
				circleClock.style.background = "radial-gradient(" + colors.day.cold.clock[0]  +", " + colors.day.cold.clock[1]+ ", " + colors.day.cold.clock[2] + ")";
			}
			if (temp >= 46 && temp <= 55) {
				circleCon.style.backgroundColor = colors.day.cool.con;
				circleTemp.style.backgroundColor = colors.day.cool.temp;
				circleClock.style.background = "radial-gradient(" + colors.day.cool.clock[0]  +", " + colors.day.cool.clock[1]+ ", " + colors.day.cool.clock[2] + ")";
			}
			if (temp >= 56 && temp <= 68) {
				circleCon.style.backgroundColor = colors.day.mild.con;
				circleTemp.style.backgroundColor = colors.day.mild.temp;
				circleClock.style.background = "radial-gradient(" + colors.day.mild.clock[0]  +", " + colors.day.mild.clock[1]+ ", " + colors.day.mild.clock[2] + ")";
			}
			if (temp >= 69 && temp <= 84) {
				circleCon.style.backgroundColor = colors.day.warm.con;
				circleTemp.style.backgroundColor = colors.day.warm.temp;
				circleClock.style.background = "radial-gradient(" + colors.day.warm.clock[0]  +", " + colors.day.warm.clock[1]+ ", " + colors.day.warm.clock[2] + ")";
            } 
            if (temp >= 85) {
                circleCon.style.backgroundColor = colors.day.hot.con;
                circleTemp.style.backgroundColor = colors.day.hot.temp;
                circleClock.style.background = "radial-gradient(" + colors.day.hot.clock[0]  +", " + colors.day.hot.clock[1]+ ", " + colors.day.hot.clock[2] + ")";
            }
    	}

        function updateBackgroundColor(tempF) {
            //switch to night color scheme
            let background = document.querySelector('.background');
            let body = document.querySelector('.body');
            body.style.color = colors.night.night_text;
            background.classList.add('night');

            if (tempF < 32) { 
                body.style.backgroundColor = colors.night.freezing;
            }
            if (tempF >= 33 && tempF <= 45) { 
                body.style.backgroundColor = colors.night.cold;
            }
            if (tempF >= 46 && tempF <= 55) { 
                body.style.backgroundColor = colors.night.cool;
            }
            if (tempF >= 56 && tempF <= 68) { 
                body.style.backgroundColor = colors.night.mild;
            }
            if (tempF >= 69 && tempF <= 84) { 
                body.style.backgroundColor = colors.night.warm;
            }
            if (tempF >= 85) { 
                body.style.backgroundColor = colors.night.hot;
            }

            circleCon.style.background = 'hsla(0, 0%, 7%, 1)';
            circleTemp.style.background = 'hsla(247, 9%, 17%, 1)';
            circleClock.style.background = 'hsla(170, 12%, 10%, 1)';

            console.log(tempF, colors.night.freezing, background, body);
        }
    	
		getLocation.addEventListener("click", function( event ) {
			event.preventDefault(event);
			getLocation.innerHTML = "One moment, please...";
			navigator.geolocation.getCurrentPosition(success, error, options);
	 	});
	}
}

