!function a(r,l,s){function i(o,e){if(!l[o]){if(!r[o]){var t="function"==typeof require&&require;if(!e&&t)return t(o,!0);if(d)return d(o,!0);var n=new Error("Cannot find module '"+o+"'");throw n.code="MODULE_NOT_FOUND",n}var c=l[o]={exports:{}};r[o][0].call(c.exports,function(e){return i(r[o][1][e]||e)},c,c.exports,a,r,l,s)}return l[o].exports}for(var d="function"==typeof require&&require,e=0;e<s.length;e++)i(s[e]);return i}({1:[function(e,o,t){"use strict";document.onreadystatechange=function(){if("interactive"===document.readyState){var o=function(e){alert("Please allow this site to access your location information."),console.warn("ERROR("+e.code+"): "+e.clockage)},t=function(e){var o=e.coords,t=o.latitude,n=o.longitude;return c("https://fcc-weather-api.glitch.me/api/current?lat="+t+"&lon="+n)},c=function(e){fetch(e).then(function(e){return e.json()}).then(function(e){return n(e)})},n=function(e){M=Math.round(e.main.temp),T=Math.round(1.8*M+32),i(T),d(T);var o,t=(T+="F")+"/"+(M+="C"),n=e.weather[0].description;g.textContent=n,h.textContent=t,o=e,L=new Date(0),q=new Date(0),z=o.sys.sunset,x=o.sys.sunrise,L.setUTCSeconds(z),q.setUTCSeconds(x),w=L.toLocaleString("en-US",m),S=q.toLocaleString("en-US",m),a(q,L),r("countdown",H),l(),s()},a=function(e,o){var t=document.querySelector(".display__sunset_sunrise"),n=Date.now(),c=""+n;return c=Number(c.slice(0,-3)),x<=(n=c)&&n<=z?(t.innerHTML=" sunset ",C.innerHTML='<span class="bold">'+w+".</span>",H=o,i(T),console.log("daytime")):(t.innerHTML=" sunrise ",C.innerHTML='<span class="bold">'+S+".</span>",H=e,k.style.background=b.night.con,f.style.background=b.night.temp,p.style.background=b.night.clock,d(T),console.log("nighttime")),H},r=function(e,o){document.querySelector("#countdown");var t=document.querySelector(".hours"),n=document.querySelector(".minutes"),c=document.querySelector(".seconds");function a(){var e=function(e){D=Date.parse(new Date);var o=Date.parse(e)-D,t=Math.floor(o/1e3%60),n=Math.floor(o/1e3/60%60);return{total:o,hours:Math.floor(o/36e5%24),minutes:n,seconds:t}}(o);t.innerHTML=("0"+e.hours).slice(-2),n.innerHTML=("0"+e.minutes).slice(-2),c.innerHTML=("0"+e.seconds).slice(-2)}a();setInterval(a,1e3)},l=function(){k.classList.toggle("breathe"),f.classList.toggle("dropIn"),p.classList.toggle("fadeIn")},s=function(){y.classList.toggle("fadeOut")},i=function(e){v.classList.remove("night"),v.classList.add("daytime"),e<32&&(k.style.background=b.day.freezing.con,f.style.background=b.day.freezing.temp,p.style.background="radial-gradient("+b.day.freezing.clock[0]+", "+b.day.freezing.clock[1]+", "+b.day.freezing.clock[2]+")"),33<=e&&e<=45&&(k.style.backgroundColor=b.day.cold.con,f.style.backgroundColor=b.day.cold.temp,p.style.background="radial-gradient("+b.day.cold.clock[0]+", "+b.day.cold.clock[1]+", "+b.day.cold.clock[2]+")"),46<=e&&e<=55&&(k.style.backgroundColor=b.day.cool.con,f.style.backgroundColor=b.day.cool.temp,p.style.background="radial-gradient("+b.day.cool.clock[0]+", "+b.day.cool.clock[1]+", "+b.day.cool.clock[2]+")"),56<=e&&e<=68&&(k.style.backgroundColor=b.day.mild.con,f.style.backgroundColor=b.day.mild.temp,p.style.background="radial-gradient("+b.day.mild.clock[0]+", "+b.day.mild.clock[1]+", "+b.day.mild.clock[2]+")"),69<=e&&e<=84&&(k.style.backgroundColor=b.day.warm.con,f.style.backgroundColor=b.day.warm.temp,p.style.background="radial-gradient("+b.day.warm.clock[0]+", "+b.day.warm.clock[1]+", "+b.day.warm.clock[2]+")"),85<=e&&(k.style.backgroundColor=b.day.hot.con,f.style.backgroundColor=b.day.hot.temp,p.style.background="radial-gradient("+b.day.hot.clock[0]+", "+b.day.hot.clock[1]+", "+b.day.hot.clock[2]+")")},d=function(e){v.classList.remove("daytime"),v.classList.add("night"),e<32&&(u.style.backgroundColor=b.night.freezing),33<=e&&e<=45&&(u.style.backgroundColor=b.night.cold),46<=e&&e<=55&&(u.style.backgroundColor=b.night.cool),56<=e&&e<=68&&(u.style.backgroundColor=b.night.mild),69<=e&&e<=84&&(u.style.backgroundColor=b.night.warm),85<=e&&(u.style.backgroundColor=b.night.hot)};navigator.geolocation||alert(" Please enable Geolocation Services on your device/browser.");var u=document.querySelector(".body"),y=document.querySelector(".getLocation"),h=(document.querySelector(".information"),document.querySelector(".temperature")),g=document.querySelector(".conditions"),m={hour:"numeric",minute:"numeric",hour12:!0},k=document.querySelector(".circleCon"),f=document.querySelector(".circleTemp"),p=document.querySelector(".circleClock"),b={day:{freezing:{con:"hsla(259, 100%, 97%, 1)",temp:"hsla(197, 100%, 96%, 1)",clock:["hsla(183, 88%, 90%, 0.5)","hsla(183, 88%, 90%, 0.9)","hsla(183, 88%, 90%, 1)"]},cold:{con:"hsla(233, 93%, 83%, 1)",temp:"hsla(197, 98%, 81%, 1)",clock:["hsla(173, 88%, 73%, 0.5)","hsla(173, 88%, 73%, 0.9)","hsla(173, 88%, 73%, 1)"]},cool:{con:"hsla(166, 69%, 51%, 1)",temp:"hsla(175, 96%, 50%, 1)",clock:["hsla(137, 75%, 64%, 0.5)","hsla(137, 75%, 64%, 0.9)","hsla(137, 75%, 64%, 1)"]},mild:{con:"hsla(60, 75%, 59%, 1)",temp:"hsla(143, 47%, 51%, 1)",clock:["hsla(93, 89%, 41%, 0.5)","hsla(93, 89%, 41%, 0.9)","hsla(93, 89%, 41%, 1)"]},warm:{con:"hsla(48, 100%, 52%, 1)",temp:"hsla(17, 85%, 50%, 1)",clock:["hsla(20, 100%, 65%, 0.50)","hsla(20, 100%, 65%, 0.90)","hsla(20, 100%, 65%, 1)"]},hot:{con:"hsla(20, 100%, 58%, 1)",temp:"hsla(2, 100%, 50%, 1)",clock:["hsla(351, 91%, 64%, 0.5)","hsla(351, 91%, 64%, 0.9)","hsla(351, 91%, 64%, 1)"]}},night:{night_text:"hsla(0, 0%, 100%, 1)",con:"hsla(0, 0%, 7%, 1)",temp:"hsla(247, 9%, 17%, 1)",clock:"hsla(170, 12%, 10%, 1)",freezing:"hsla(291, 47%, 3%, 1)",cold:"hsla(246, 100%, 4%, 1)",cool:"hsla(220, 45%, 6%, 1)",mild:"hsla(114, 83%, 2%, 1)",warm:"hsla(44, 100%, 3%, 1)",hot:"hsla(0, 79%, 4%, 1)"}},v=document.querySelector(".background"),C=document.querySelector("#display__time"),S=void 0,w=void 0,L=void 0,q=void 0,M=void 0,T=void 0,D=void 0,H=void 0,x=void 0,z=void 0,_={enableHighAccuracy:!0,timeout:7e3,maximumAge:0};k.style.background="transparent",f.style.background="transparent",p.style.background="transparent",y.addEventListener("click",function(e){e.preventDefault(e),y.innerHTML="One moment, please...",navigator.geolocation.getCurrentPosition(t,o,_)})}}},{}]},{},[1]);