var lat;
var lon;
var map;

$(document).ready(function () {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      getWeather(lat, lon);
      initializeMap(lat, lon);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function getWeather(lat, lon) {

    var owAPIurl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&APPID=" + OW_API_Key;

    $.ajax({
        url: owAPIurl,
        dataType: "json",
        type: "GET",
      })

      .done(function (result) {
        console.log(result);

        $("#location").text(result.city.name + ", " + result.city.country);
        $("#desc").html("Current Forecast: " + titleCase(result.list[0].weather[0].description));
        $("#icon").html('<img src=' + "http://openweathermap.org/img/w/" + result.list[0].weather[0].icon + ".png" + ">");
        $("#current-temp").html("Current Temperature: " + result.list[0].main.temp + ' <i class="wi wi-fahrenheit"></i>');
        $("#high-temp").html("High: " + result.list[0].main.temp_max + ' <i class="wi wi-fahrenheit"></i>');
        $("#low-temp").html("Low: " + result.list[0].main.temp_min + ' <i class="wi wi-fahrenheit"></i>');

      })
  };

  function initializeMap(lat, lon) {

    var myLocation = {
      lat: lat,
      lng: lon
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      mapTypeId: 'satellite',
      zoom: 10,
      center: myLocation
    });

    var marker = new google.maps.Marker({
      position: myLocation,
      map: map
    });
  }

  function titleCase(str) {

    str = str.toLowerCase();
    str = str.split(' ');

    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }

    return str.join(' ');
  };


});