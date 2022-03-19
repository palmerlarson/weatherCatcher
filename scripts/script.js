//Runs listed methods upon loading
window.onload = function() {
	init();
};

//Initial method to run upon loading
const init = () => {
	let weatherButton = document.querySelector("#getWeather");
	let input = document.querySelector("#zip");
	weatherButton.addEventListener("click", getLocation);
}

//pulls Long and Lat from user's entered zip with geonames api
const getLocation = () => {
	let zip = document.querySelector("#zip").value;
	let url = `http://api.geonames.org/postalCodeSearchJSON?username=pllarson2&postalcode=${zip}&country=US`;
	console.log(zip);
	let xhr = new XMLHttpRequest();
	xhr.open("get", url);
	xhr.onreadystatechange = () => {
		if(xhr.readyState == 4) {
			let data = JSON.parse(xhr.responseText);
			let lat = data.postalCodes[0].lat;
			let lng = data.postalCodes[0].lng;
			let state = data.postalCodes[0].adminName1;
			let city = data.postalCodes[0].placeName;
			getWeather(lat, lng, city, state);
		}
	}
	xhr.send(null);

}

//pulls weather information with api using lat/long from getLocation
const getWeather = (lat, lng, city, state) => {
 let url = `http://api.geonames.org/findNearByWeatherJSON?lat=${lat}&lng=${lng}&username=pllarson2`
 let xhr = new XMLHttpRequest();
 xhr.open("get", url);
 xhr.onreadystatechange = () => {
	 if(xhr.readyState == 4) {
		 let data = JSON.parse(xhr.responseText);
		 let siteTemp = data.weatherObservation.temperature;
		 let humidity = data.weatherObservation.humidity;
		 let wind = data.weatherObservation.windSpeed;
		 let windDirection = data.weatherObservation.windDirection;
		 infoGatherer(siteTemp, humidity, wind, windDirection, city, state)
	 }
 }
 xhr.send(null);
}

//gathers weather info, runs calculation methods and displays to dom
const infoGatherer = (temp, siteHumidity, wSpeed, wDirection, locationCity, locationState) => {
	let displayDiv = document.querySelector(".output");
	let temperature = calculateFahrenheit(temp);
	let windDirection = calculateWindDirection(wDirection);
	let windSpeed = windSpeedTrim(wSpeed);

	displayDiv.innerHTML = `<h2>Location: ${locationCity}, ${locationState}</h2>`;
	displayDiv.innerHTML += `<table class="displayTable">
								<tr>
									<td>Temperature</td>
									<td>${temperature[0]}&#8457 ${temperature[1]}</td>
								</tr>
								<tr>
									<td>Humidity</td>
									<td>${siteHumidity}%</td>
								</tr>
								<tr>
									<td>Wind Speed</td>
									<td>${windSpeed} MPH ${windConditions(windSpeed)}</td>
								</tr>
								<tr>
									<td>Wind Direction</td>
									<td>${windDirection[0]} ${windDirection[1]}</td>
								</tr>
							</table>`;
}

//calculates fahrenheit and add emoji
const calculateFahrenheit = temp => {
	let temps = [];
	temps[0] = (temp * 9/5) + 32;

	if (temps[0] <= 34) {
		temps[1] = 	`<img class="icon" src="../images/cold.png">`;
	} else if (temps[0] >= 84) {
		temps[1] = 	`<img class="icon" src="../images/hot.png">`;
	} else {
		temps[1] = 	`<img class="icon" src="../images/smiley.png">`;
	}

	return temps;
}

//calculated from http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
const calculateWindDirection = wDirection => {
	let direction = []

	switch (true) {
		case (wDirection >= 348.75 && wDirection <= 360):
			direction[0] = "N";
			direction[1] = `<img class="icon" src="../images/n.png">`;
			break;
		case (wDirection < 11.25):
			direction[0] = "N";
			direction[1] = `<img class="icon" src="../images/n.png">`;
			break;
		case (wDirection >= 11.25 && wDirection < 33.75):
			direction[0] = "N/NE";
			direction[1] = `<img class="icon" src="../images/n.png">`;
			break;
		case (wDirection >= 33.75 && wDirection < 56.25):
			direction[0] = "NE";
			direction[1] = `<img class="icon" src="../images/ne.png">`;
			break;
		case (wDirection >= 56.25 && wDirection < 78.75):
			direction[0] = "E/NE";
			direction[1] = `<img class="icon" src="../images/ne.png">`;
			break;
		case (wDirection >= 78.75 && wDirection < 101.25):
			direction[0] = "E";
			direction[1] = `<img class="icon" src="../images/e.png">`;
			break;
		case (wDirection >= 101.25 && wDirection < 123.75):
			direction[0] = "E/SE";
			direction[1] = `<img class="icon" src="../images/se.png">`;
			break;
		case (wDirection >= 123.75 && wDirection < 146.25):
			direction[0] = "SE";
			direction[1] = `<img class="icon" src="../images/se.png">`;
			break;
		case (wDirection >= 146.25 && wDirection < 168.75):
			direction[0] = "S/SE";
			direction[1] = `<img class="icon" src="../images/se.png">`;
			break;
		case (wDirection >= 168.75 && wDirection < 191.25):
			direction[0] = "S";
			direction[1] = `<img class="icon" src="../images/s.png">`;
			break;
		case (wDirection >= 191.25 && wDirection < 213.75):
			direction[0] = "S/SW";
			direction[1] = `<img class="icon" src="../images/sw.png">`;
			break;
		case (wDirection >= 213.75 && wDirection < 236.25):
			direction[0] = "SW";
			direction[1] = `<img class="icon" src="../images/sw.png">`;
			break;
		case (wDirection >= 236.25 && wDirection < 258.75):
			direction[0] = "W/SW";
			direction[1] = `<img class="icon" src="../images/sw.png">`;
			break;
		case (wDirection >= 258.75 && wDirection < 281.25):
			direction[0] = "W";
			direction[1] = `<img class="icon" src="../images/w.png">`;
			break;
		case (wDirection >= 281.25 && wDirection < 303.75):
			direction[0] = "W/NW";
			direction[1] = `<img class="icon" src="../images/nw.png">`;
			break;
		case (wDirection >= 303.75 && wDirection < 326.25):
			direction[0] = "NW";
			direction[1] = `<img class="icon" src="../images/nw.png">`;
			break;
		case (wDirection >= 326.25 && wDirection < 348.75):
			direction[0] = "N/NW";
			direction[1] = `<img class="icon" src="../images/n.png">`;
			break;
		default:
		d = "Error";
	}

	return direction;
}

//adjusts wind speeds ex: 05 -> 5
const windSpeedTrim = f => {
	if (f == "01") {
		f = "1";
	} else if (f == "02") {
		f = "2";
	} else if (f == "03") {
		f = "3";
	} else if (f == "04") {
		f = "4";
	} else if (f == "05") {
		f = "5";
	} else if (f == "06") {
		f = "6";
	} else if (f == "07") {
		f = "7";
	} else if (f == "08") {
		f = "8";
	} else if (f == "09") {
		f = "9";
	} else {
		//do nothing
	}

	return f;

}

//displays wind icon if wind >= 15mph
const windConditions = w => {
	let i = "";
	if (w >= 15) {
		i = `<img class="icon" src="../images/windy.png">`
	}

	return i;
}
