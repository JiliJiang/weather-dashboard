const apiKey = "f64f9e2d4fda40afd330c539b14a2d45";

const currentWeather = function (cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      apiKey +
      "&units=imperial"
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("current weather: ", data);

      let lon = data.coord.lon;
      let lat = data.coord.lat;

      console.log("lon:", lon);
      console.log("lat:", lat);

      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey
      )
        .then(function (res1) {
          return res1.json();
        })
        .then(function (data1) {
          console.log("uvWeather: ", data1);
          console.log("uv:", data1.current.uvi);
          console.log("type", typeof data1.current.uvi);

          const template =
            "<h2 class='subtitle col-md-6'>" +
            data.name +
            "  " +
            " ( " +
            new Date().toLocaleDateString() +
            " ) " +
            "</h2>" +
            "<i class='icon col-md-4'>" +
            '<img src="http://openweathermap.org/img/w/' +
            data.weather[0].icon +
            '.png"/>' +
            "</i>" +
            "<ul>" +
            "<li>Temp:  " +
            data.main.temp +
            "  °F" +
            "</li>" +
            "<li>Wind:  " +
            data.wind.speed +
            "  MPH" +
            "</li>" +
            "<li>Humidity:  " +
            data.main.humidity +
            "  %" +
            "</li>" +
            `<li class='uv'> UV Index: <span id='UVSpan'> ${data1.current.uvi} </span> </li>`;

          document.querySelector("#today").innerHTML = template;

          const UVElement = document.querySelector("#UVSpan");
          if (data1.current.uvi <= 2) {
            UVElement.className = "low";
          } else if (data1.current.uvi > 2 && data1.current.uvi <= 7) {
            UVElement.className = "medium";
          } else {
            UVElement.className = "high";
          }
        });
    });
};

const forecastWeather = function (cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=" +
      apiKey +
      "&units=imperial"
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("forecast weather: ", data);

      const forecast = data.list.filter(function (datum) {
        return datum.dt_txt.includes("15:00:00");
      });

      let template = "";

      forecast.forEach(function (datum) {
        template +=
          "<ul class='col-md-2  forecast-ul'>" +
          "<li><span>" +
          datum.dt_txt.slice(0, 10) +
          "</span></li>" +
          '<img src="http://openweathermap.org/img/w/' +
          datum.weather[0].icon +
          '.png"/>' +
          "<li>Temp:" +
          datum.main.temp +
          "  °F" +
          "</li>" +
          "<li>Wind:" +
          datum.wind.speed +
          "MPH" +
          "</li>" +
          "<li>Humidity:" +
          datum.main.humidity +
          " %" +
          "</li>" +
          "</ul>";
      });

      document.querySelector("#forecast").innerHTML = template;
    });
};


//added function to prevent duplication in local storage

const storeCity = function () {
  if (cities.indexOf(cityName) === -1 || cities ===null)
  {cities.push(cityName);
  cities = JSON.stringify(cities);
  localStorage.setItem("cities", cities);}
  
};

const showCity = function () {
  cities = JSON.parse(localStorage.getItem("cities"));
  if (cities === null) {
    cities = [];
  } 
  
  let cityEl = "";
  for (var i = 0; i < cities.length; i++) {
    cityEl += `<il class="city" id="${i}"> ${cities[i]} </il>`;
  }
  document.querySelector("#cities").innerHTML = cityEl;
};


showCity();

//retrieve previous search upon click
document.querySelector("#cities").addEventListener("click", function (event) {
  event.preventDefault();
  let k = event.target.id;
  console.log("k", k);
  let cityName = cities[k];
  currentWeather(cityName);
  forecastWeather(cityName);
});

//conduct new search
document.querySelector("#search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // get user input
  // added alert if user input is null
  cityName = document.querySelector("#cityname").value;
  if (cityName===null || cityName ==="")
  {alert("Please input a city name!")}
  else{
  // added function to store and show city name without reload
  storeCity();
  showCity();
  // get current weather and show data
  currentWeather(cityName);
  // get forecast data and show
  forecastWeather(cityName);}
});
