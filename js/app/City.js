class City {
    constructor(data) {
        this._key = null;
        this.cityName = null;
        this.cityState = null;
        this.isFavorite = false;
    }

    fillCityInfo(data) {
        this._key = data.Key;
        this.cityName = data.LocalizedName;
        this.cityState = data.Region.LocalizedName;
    }
}

class ForeCastCity {
    constructor(city) {
        this.jq = null;
        this.temperature = {
            currentTemperature: null,
            maxTemperature: null,
            minTemperature: null
        }
        this.city = city;
        this.currentWeather = {
            text: null,
            icon: null
        };
        this.humidity = null;
    }

    initHTML() {
        this.jq = $('#currentCity');
    }

    /*
    * {
    "LocalObservationDateTime": "2022-11-29T20:42:00+01:00",
    "EpochTime": 1669750920,
    "WeatherText": "Mayormente nublado",
    "WeatherIcon": 38,
    "HasPrecipitation": false,
    "PrecipitationType": null,
    "IsDayTime": false,
    "Temperature": {
      "Metric": {
        "Value": 7.2,
        "Unit": "C",
        "UnitType": 17
      },
      "Imperial": {
        "Value": 45,
        "Unit": "F",
        "UnitType": 18
      }
    },
    "RealFeelTemperature": {
      "Metric": {
        "Value": 7.5,
        "Unit": "C",
        "UnitType": 17,
        "Phrase": "Frío"
      },
      "Imperial": {
        "Value": 45,
        "Unit": "F",
        "UnitType": 18,
        "Phrase": "Frío"
      }
    },
    * "RelativeHumidity": 70,
    "IndoorRelativeHumidity": 31,
    * "TemperatureSummary": {
    * "Past24HourRange": {
        "Minimum": {
          "Metric": {
            "Value": 2.2,
            "Unit": "C",
            "UnitType": 17
          },
          "Imperial": {
            "Value": 36,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Maximum": {
          "Metric": {
            "Value": 12.2,
            "Unit": "C",
            "UnitType": 17
          },
          "Imperial": {
            "Value": 54,
            "Unit": "F",
            "UnitType": 18
          }
        }
      }
    },
    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/current-weather/305882",
    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/current-weather/305882"
  }
    * */
    getCurrentConditions(data) {
        this.temperature.currentTemperature = Math.round(data.Temperature.Metric.Value);
        this.temperature.maxTemperature = Math.round(data.TemperatureSummary.Past24HourRange.Maximum.Metric.Value);
        this.temperature.minTemperature = Math.round(data.TemperatureSummary.Past24HourRange.Minimum.Metric.Value);
        this.currentWeather.text = data.WeatherText;
        this.currentWeather.icon = data.WeatherIcon;
        this.humidity = data.RelativeHumidity;
        this.currentWeatherLink = data.Link;
        return this;
    }
    renderCurrentConditions() {
        this.jq.append(`<div id="todayForecast">
            <div class="todayInfo">
                <div class="todayInfoLeft">
                    <div class="dayTemperature">${this.temperature.currentTemperature}</div>
                    <div class="cityAndState">
                        <div class="cityName">${this.city.cityName}</div>
                        <div class="stateName">${this.city.cityState}</div>
                        <span class="favorite"><i class="fa fa-star${this.city.isFavorite ? '' : '-o'}"></i></span>
                    </div>
                    <div class="maxTminTHumidity">
                        <div class="tempMax">${this.temperature.maxTemperature}</div>
                        <div class="tempMin">${this.temperature.minTemperature}</div>
                        <div class="humidity">Humedad: ${this.humidity}</div>
                    </div>
                </div>
                <div class="weatherContainer">
                    <div class="weatherIcon weatherIcon-${this.currentWeather.icon}"></div>
                </div>
            </div>
        </div>`)
        return this;
    }

    /*
    * {
    "DateTime": "2022-11-29T20:00:00+01:00",
    "EpochDateTime": 1669748400,
    "WeatherIcon": 7,
    "IconPhrase": "Nublado",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 7.8,
      "Unit": "C",
      "UnitType": 17
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/hourly-weather-forecast/305882?day=1&hbhhour=20&unit=c",
    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/hourly-weather-forecast/305882?day=1&hbhhour=20&unit=c"
  },
    * */
    set12hoursForecast(data) {
        let hourForeCast = {
            hour: null,
            weather: null,
            temperature: null,
            precipitationProbability: null,
            link : null
        }
        let hours = [];

        data.forEach(data => {
            hourForeCast.hour = parseInt(data.DateTime.split('T')[1].match(/\d+/i)[0]);
            hourForeCast.hour > 12 ? (hourForeCast.hour -= 12) + ' p. m.' : hourForeCast.hour + ' a. m.';
            hourForeCast.weather = data.WeatherIcon;
            hourForeCast.temperature= data.Temperature.Value;
            hourForeCast.precipitationProbability = data.PrecipitationProbability;
            hourForeCast.link = data.Link;
            hours.push(hourForeCast);
        });
    }

}