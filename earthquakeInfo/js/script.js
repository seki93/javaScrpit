var earthquakeInfo;
var city;
var arrCity = [];
var arrDates = [];
var arr = [];
var arrInfo = [];
var maxMag = 0;
var minMag = 99;
var sum = 0;

function getData (startDate, endDate, lat, lng, radius) {
	var xhr = new XMLHttpRequest();
	var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4&starttime="+startDate+"&endtime="+endDate+"&latitude="+lat+"&longitude="+lng+"&maxradiuskm="+radius;

	xhr.onreadystatechange = function () {
	    if (this.readyState != 4) return;

	    if (this.status == 200) {
	        earthquakeInfo = JSON.parse(this.responseText);
	        
	        arr.push(earthquakeInfo);
	        console.log(earthquakeInfo);
	        getEarthquakeInfo(startDate, endDate);
	    }
	};

	xhr.open('GET', url, true);
	xhr.send(); 
}

function getCitiCoordinates (country, city, startDate, endDate, radius) {
	var xhr = new XMLHttpRequest();
	var url = "https://maps.google.com/maps/api/geocode/json?address="+city+","+country+"&key=AIzaSyB-KcTt_I-OcdECS1ruop7AefRmSmnICXI"
	xhr.onreadystatechange = function () {
	    if (this.readyState != 4) return;

	    if (this.status == 200) {
	        city = JSON.parse(this.responseText);
	        arrCity.push(city);

	        console.log(city);
	        console.log("Location: LAT "+city.results[0].geometry.location.lat);
	        console.log("Location: LNG "+city.results[0].geometry.location.lng);
	        getData(startDate, endDate, city.results[0].geometry.location.lat, city.results[0].geometry.location.lng, radius);
	    }
	};

	xhr.open('GET', url, true);
	xhr.send(); 
}

function getEarthquakeInfo () {
	arrInfo.length = 0;
	for(var i = 0; i < arr.length; i++){
		for(var j = 0; j < arr[i].features.length; j++){
			if(arr[i].features[j].properties.mag > maxMag ) maxMag = arr[i].features[j].properties.mag;
			if(arr[i].features[j].properties.mag < minMag ) minMag = arr[i].features[j].properties.mag;
			sum +=arr[i].features[j].properties.mag;
		}

		if(arr[i].features.length == 0){
			arrInfo.push(0, 0, 0, 0);
		}else{
			arrInfo.push(arr[i].features.length, minMag, maxMag, sum/arr[i].features.length);
		}

		createTable(startDate, endDate);
		maxMag = 0;
		minMag = 99;
		sum = 0;
	}
}

function createTable () {
	var tbody = document.getElementById("1");
	tbody.innerHTML = '';
	var j = 0;
	var k = 0;

	for(var i = 0; i < arr.length; i++){
		var element = document.createElement("TR");

		var cityCell = document.createElement("TD");
		var city = document.createTextNode(arrCity[i].results[0].address_components[0].long_name);

		cityCell.appendChild(city);
		element.appendChild(cityCell);

		var startDateCell = document.createElement("TD");
		var startDate = document.createTextNode(arrDates[k++]);

		startDateCell.appendChild(startDate);
		element.appendChild(startDateCell);

		var endDateCell = document.createElement("TD");
		var endDate = document.createTextNode(arrDates[k++]);

		endDateCell.appendChild(endDate);
		element.appendChild(endDateCell);

		var numberOfEarthquakeCell = document.createElement("TD");
		var numberOfEarthquake = document.createTextNode(arrInfo[j++]);

		numberOfEarthquakeCell.appendChild(numberOfEarthquake);
		element.appendChild(numberOfEarthquakeCell);

		var minCell = document.createElement("TD");
		var min = document.createTextNode(arrInfo[j++]);

		minCell.appendChild(min);
		element.appendChild(minCell);

		var maxCell = document.createElement("TD");
		var max = document.createTextNode(arrInfo[j++]);

		maxCell.appendChild(max);
		element.appendChild(maxCell);

		var averageCell = document.createElement("TD");
		var average = document.createTextNode(arrInfo[j++]);

		averageCell.appendChild(average);
		element.appendChild(averageCell);

		tbody.appendChild(element);
	}
}

document.getElementById("btnOk").addEventListener('click', function (e) {
	var country = document.getElementById("country").value;
	var city = document.getElementById("cityName").value;
	var startDate = document.getElementById("startDate").value;
	var endDate = document.getElementById("endDate").value;
	var radius = document.getElementById("radius").value;

	arrDates.push(startDate, endDate);
	getCitiCoordinates(country, city, startDate, endDate, radius);
});

document.getElementById("btnClear").addEventListener('click', function (e) {
	document.getElementById("forma1").reset();
});


