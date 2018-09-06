var weatherInfo = new Object();
var arr = [];
var checked = "";

function getData (city, country) {
	//alert("Pozvao sam funckiju");
	var xhr = new XMLHttpRequest();
	var url = "http://api.openweathermap.org/data/2.5/"+checked+"?q="+city+","+country+"&lang=hr&units=metric&appid=1384eff7759c6a754d37878aaa944cdb";
	var url2 = `dsadjaskj${city}dshakjdhakj${country}`;
	

	xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;

    if (this.status == 200) {
        weatherInfo = JSON.parse(this.responseText);

        arr.push(weatherInfo);
		createTable();
		// console.log(weatherInfo.length);
		// console.log(weatherInfo.city.country);
		// console.log(weatherInfo.city.name);
    }
	};

	xhr.open('GET', url, true);
	xhr.send(); 
}

function createTable () {
	var tbody = document.getElementById("1");
	tbody.innerHTML = '';

	for(var i = 0; i < arr.length; i++){

		if(arr[i].list === undefined){
			var element = document.createElement("TR");

			var countryCell = document.createElement("TD");
			var country = document.createTextNode(arr[i].sys.country);

			countryCell.appendChild(country);
			element.appendChild(countryCell);

			var cityCell = document.createElement("TD");
			var city = document.createTextNode(arr[i].name);

			cityCell.appendChild(city);
			element.appendChild(cityCell);

			var tempCell = document.createElement("TD");
			var temp = document.createTextNode(arr[i].main.temp);

			tempCell.appendChild(temp);
			element.appendChild(tempCell);

			var tempMinCell = document.createElement("TD");
			var tempMin = document.createTextNode(arr[i].main.temp_min);

			tempMinCell.appendChild(tempMin);
			element.appendChild(tempMinCell);

			var tempMaxCell = document.createElement("TD");
			var tempMax = document.createTextNode(arr[i].main.temp_max);

			tempMaxCell.appendChild(tempMax);
			element.appendChild(tempMaxCell);

			var imgCell = document.createElement("TD");
			var img = document.createElement("IMG");
			img.setAttribute("src", "http://openweathermap.org/img/w/"+arr[i].weather[0].icon+".png");

			imgCell.appendChild(img);
			element.appendChild(img);

			tbody.appendChild(element);
		}else{
			for(var j = 0; j < arr[i].list.length; j++){
				var element = document.createElement("TR");

				var countryCell = document.createElement("TD");
				var country = document.createTextNode(arr[i].city.country);

				countryCell.appendChild(country);
				element.appendChild(countryCell);

				var cityCell = document.createElement("TD");
				var city = document.createTextNode(arr[i].city.name);

				cityCell.appendChild(city);
				element.appendChild(cityCell);

				var tempCell = document.createElement("TD");
				var temp = document.createTextNode(arr[i].list[j].main.temp);

				tempCell.appendChild(temp);
				element.appendChild(tempCell);

				var tempMinCell = document.createElement("TD");
				var tempMin = document.createTextNode(arr[i].list[j].main.temp_min);

				tempMinCell.appendChild(tempMin);
				element.appendChild(tempMinCell);

				var tempMaxCell = document.createElement("TD");
				var tempMax = document.createTextNode(arr[i].list[j].main.temp_max);

				tempMaxCell.appendChild(tempMax);
				element.appendChild(tempMaxCell);

				var imgCell = document.createElement("TD");
				var img = document.createElement("IMG");
				img.setAttribute("src", "http://openweathermap.org/img/w/"+arr[i].list[j].weather[0].icon+".png");

				imgCell.appendChild(img);
				element.appendChild(img);

				tbody.appendChild(element);	
			}
		}
	}
}

function checkedRadio () {
	var radios = document.getElementsByName("weather");

	for(var i = 0; i < radios.length; i++){
		if(radios[i].checked){
			checked = radios[i].value;
			break;
		}
	}
}

document.getElementById("getWeather").addEventListener('click', function (e) {
	var city = document.getElementById("city").value;
	var country = document.getElementById("country").value;

	checkedRadio();
	getData(city, country);
});

document.getElementById("btnClear").addEventListener('click', function (e) {
	document.getElementById("dataFromUser").reset();
});