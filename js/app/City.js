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
            hourForeCast.hour = hourForeCast.hour > 12 ? (hourForeCast.hour -= 12) + ' p. m.' : hourForeCast.hour + ' a. m.';
            hourForeCast.weather = data.WeatherIcon;
            hourForeCast.temperature= parseInt(data.Temperature.Value);
            hourForeCast.precipitationProbability = data.PrecipitationProbability;
            hourForeCast.link = data.Link;
            hours.push(hourForeCast);
        });
        this.hoursForecast = hours;
        return this;
    }

    render12hoursConditions() {
        this.jq.append(`<div class="hourlyForecasts12 gradient-background">`);
        let temperatureNormalized = this.temperature.maxTemperature - this.temperature.minTemperature;
        this.hoursForecast.forEach(hour => {
            $('.hourlyForecasts12').append(`<div class="hourForeCast">
                <div class="hour hourForeCast-element"> ${hour.hour}</div>
                <div class="weatherIcon weatherIcon-${hour.weather} hourForeCast-element"></div>
                <div class="temperature hourForeCast-element">${hour.temperature}</div>
                <div class="temperatureGrpahic hourForeCast-element">
                    <div class="currentTemperatureHeight" style="top=${100 - Math.round(hour.temperature * 100 / temperatureNormalized)}%"></div>
                </div>
                <div class="precipitationProbability"><i class="fa fa-tint"></i> ${hour.precipitationProbability}%</div>
            </div>`);
        })
        return this;
    }

    set5DaysForecast(data) {
        let fiveDaysDatiledInfo = {
            "Headline": {
                "EffectiveDate": "2022-12-02T07:00:00+01:00",
                "EffectiveEpochDate": 1669960800,
                "Severity": 5,
                "Text": "Niebla afectará a la zona el viernes por la mañana",
                "Category": "fog",
                "EndDate": "2022-12-02T13:00:00+01:00",
                "EndEpochDate": 1669982400,
                "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?unit=c",
                "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?unit=c"
            },
            "DailyForecasts": [
                {
                    "Date": "2022-11-30T07:00:00+01:00",
                    "EpochDate": 1669788000,
                    "Sun": {
                        "Rise": "2022-11-30T08:17:00+01:00",
                        "EpochRise": 1669792620,
                        "Set": "2022-11-30T17:50:00+01:00",
                        "EpochSet": 1669827000
                    },
                    "Moon": {
                        "Rise": "2022-11-30T14:08:00+01:00",
                        "EpochRise": 1669813680,
                        "Set": "2022-12-01T01:06:00+01:00",
                        "EpochSet": 1669853160,
                        "Phase": "First",
                        "Age": 7
                    },
                    "Temperature": {
                        "Minimum": {
                            "Value": 3.9,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 11.1,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "RealFeelTemperature": {
                        "Minimum": {
                            "Value": 1.7,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 14.4,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Fresco"
                        }
                    },
                    "RealFeelTemperatureShade": {
                        "Minimum": {
                            "Value": 1.7,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 11.7,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Fresco"
                        }
                    },
                    "HoursOfSun": 8.4,
                    "DegreeDaySummary": {
                        "Heating": {
                            "Value": 10,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Cooling": {
                            "Value": 0,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "AirAndPollen": [
                        {
                            "Name": "AirQuality",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1,
                            "Type": "Ozono"
                        },
                        {
                            "Name": "Grass",
                            "Value": 0,
                            "Category": "Bajo",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Mold",
                            "Value": 32767,
                            "Category": "Alto",
                            "CategoryValue": 3
                        },
                        {
                            "Name": "Tree",
                            "Value": 0,
                            "Category": "Bajo",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Ragweed",
                            "Value": 0,
                            "Category": "Bajo",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "UVIndex",
                            "Value": 2,
                            "Category": "Bajo",
                            "CategoryValue": 1
                        }
                    ],
                    "Day": {
                        "Icon": 3,
                        "IconPhrase": "Parcialmente soleado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Parcialmente soleado",
                        "LongPhrase": "Parcialmente soleado",
                        "PrecipitationProbability": 12,
                        "ThunderstormProbability": 0,
                        "RainProbability": 12,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 3.2,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 342,
                                "Localized": "NNO",
                                "English": "NNW"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 12.9,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 342,
                                "Localized": "NNO",
                                "English": "NNW"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 21,
                        "Evapotranspiration": {
                            "Value": 1,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 4179.5,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Principalmente nublado",
                        "LongPhrase": "Principalmente nublado",
                        "PrecipitationProbability": 16,
                        "ThunderstormProbability": 0,
                        "RainProbability": 16,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 8,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 84,
                                "Localized": "E",
                                "English": "E"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 25.7,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 84,
                                "Localized": "E",
                                "English": "E"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 87,
                        "Evapotranspiration": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 0,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=1&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=1&unit=c"
                },
                {
                    "Date": "2022-12-01T07:00:00+01:00",
                    "EpochDate": 1669874400,
                    "Sun": {
                        "Rise": "2022-12-01T08:19:00+01:00",
                        "EpochRise": 1669879140,
                        "Set": "2022-12-01T17:50:00+01:00",
                        "EpochSet": 1669913400
                    },
                    "Moon": {
                        "Rise": "2022-12-01T14:34:00+01:00",
                        "EpochRise": 1669901640,
                        "Set": "2022-12-02T02:16:00+01:00",
                        "EpochSet": 1669943760,
                        "Phase": "WaxingGibbous",
                        "Age": 8
                    },
                    "Temperature": {
                        "Minimum": {
                            "Value": 0.6,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 13.9,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "RealFeelTemperature": {
                        "Minimum": {
                            "Value": -0.1,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 12.5,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Fresco"
                        }
                    },
                    "RealFeelTemperatureShade": {
                        "Minimum": {
                            "Value": -0.1,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 11.5,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Fresco"
                        }
                    },
                    "HoursOfSun": 8.6,
                    "DegreeDaySummary": {
                        "Heating": {
                            "Value": 11,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Cooling": {
                            "Value": 0,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "AirAndPollen": [
                        {
                            "Name": "AirQuality",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1,
                            "Type": "Ozono"
                        },
                        {
                            "Name": "Grass",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Mold",
                            "Value": 32767,
                            "Category": "Poco saludable (sensible)",
                            "CategoryValue": 3
                        },
                        {
                            "Name": "Ragweed",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Tree",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "UVIndex",
                            "Value": 2,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        }
                    ],
                    "Day": {
                        "Icon": 2,
                        "IconPhrase": "Mayormente soleado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Principalmente soleado",
                        "LongPhrase": "Principalmente soleado",
                        "PrecipitationProbability": 3,
                        "ThunderstormProbability": 0,
                        "RainProbability": 3,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 13,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 51,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 27.8,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 52,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 13,
                        "Evapotranspiration": {
                            "Value": 1.5,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 3109.5,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Niebla",
                        "LongPhrase": "Destemplado; parcialmente nublado a cubierto al anochecer seguido de niebla más tarde",
                        "PrecipitationProbability": 6,
                        "ThunderstormProbability": 0,
                        "RainProbability": 6,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 13,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 50,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 29.6,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 56,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 68,
                        "Evapotranspiration": {
                            "Value": 0.3,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 0,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=2&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=2&unit=c"
                },
                {
                    "Date": "2022-12-02T07:00:00+01:00",
                    "EpochDate": 1669960800,
                    "Sun": {
                        "Rise": "2022-12-02T08:20:00+01:00",
                        "EpochRise": 1669965600,
                        "Set": "2022-12-02T17:50:00+01:00",
                        "EpochSet": 1669999800
                    },
                    "Moon": {
                        "Rise": "2022-12-02T14:58:00+01:00",
                        "EpochRise": 1669989480,
                        "Set": "2022-12-03T03:23:00+01:00",
                        "EpochSet": 1670034180,
                        "Phase": "WaxingGibbous",
                        "Age": 9
                    },
                    "Temperature": {
                        "Minimum": {
                            "Value": 1.1,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 10,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "RealFeelTemperature": {
                        "Minimum": {
                            "Value": -2,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 9.9,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        }
                    },
                    "RealFeelTemperatureShade": {
                        "Minimum": {
                            "Value": -2,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 9.1,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        }
                    },
                    "HoursOfSun": 5.9,
                    "DegreeDaySummary": {
                        "Heating": {
                            "Value": 12,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Cooling": {
                            "Value": 0,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "AirAndPollen": [
                        {
                            "Name": "AirQuality",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1,
                            "Type": "Ozono"
                        },
                        {
                            "Name": "Grass",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Mold",
                            "Value": 32767,
                            "Category": "Poco saludable (sensible)",
                            "CategoryValue": 3
                        },
                        {
                            "Name": "Ragweed",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Tree",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "UVIndex",
                            "Value": 2,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        }
                    ],
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Areas de niebla",
                        "LongPhrase": "Areas de niebla en la mañana; principalmente soleado en la tarde",
                        "PrecipitationProbability": 4,
                        "ThunderstormProbability": 0,
                        "RainProbability": 4,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 7.4,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 111,
                                "Localized": "ESE",
                                "English": "ESE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 24.1,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 52,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 44,
                        "Evapotranspiration": {
                            "Value": 0.8,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 2205.9,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Tornándose nublado",
                        "LongPhrase": "Tornándose nublado",
                        "PrecipitationProbability": 10,
                        "ThunderstormProbability": 0,
                        "RainProbability": 10,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 9.3,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 79,
                                "Localized": "E",
                                "English": "E"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 16.7,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 35,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 38,
                        "Evapotranspiration": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 0,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=3&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=3&unit=c"
                },
                {
                    "Date": "2022-12-03T07:00:00+01:00",
                    "EpochDate": 1670047200,
                    "Sun": {
                        "Rise": "2022-12-03T08:21:00+01:00",
                        "EpochRise": 1670052060,
                        "Set": "2022-12-03T17:49:00+01:00",
                        "EpochSet": 1670086140
                    },
                    "Moon": {
                        "Rise": "2022-12-03T15:20:00+01:00",
                        "EpochRise": 1670077200,
                        "Set": "2022-12-04T04:29:00+01:00",
                        "EpochSet": 1670124540,
                        "Phase": "WaxingGibbous",
                        "Age": 10
                    },
                    "Temperature": {
                        "Minimum": {
                            "Value": 1.1,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 8.9,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "RealFeelTemperature": {
                        "Minimum": {
                            "Value": -0.3,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 9.8,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        }
                    },
                    "RealFeelTemperatureShade": {
                        "Minimum": {
                            "Value": -0.3,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 8.6,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        }
                    },
                    "HoursOfSun": 5.9,
                    "DegreeDaySummary": {
                        "Heating": {
                            "Value": 13,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Cooling": {
                            "Value": 0,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "AirAndPollen": [
                        {
                            "Name": "AirQuality",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1,
                            "Type": "Ozono"
                        },
                        {
                            "Name": "Grass",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Mold",
                            "Value": 32767,
                            "Category": "Poco saludable (sensible)",
                            "CategoryValue": 3
                        },
                        {
                            "Name": "Ragweed",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Tree",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "UVIndex",
                            "Value": 2,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        }
                    ],
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Destemplado, con nubes y sol",
                        "LongPhrase": "Destemplado, con intervalos de sol y nubes",
                        "PrecipitationProbability": 12,
                        "ThunderstormProbability": 0,
                        "RainProbability": 12,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 9.3,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 86,
                                "Localized": "E",
                                "English": "E"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 16.7,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 80,
                                "Localized": "E",
                                "English": "E"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 53,
                        "Evapotranspiration": {
                            "Value": 1,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 2354.9,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Night": {
                        "Icon": 35,
                        "IconPhrase": "Parcialmente nublado",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Areas de nubosidad",
                        "LongPhrase": "Areas de nubosidad",
                        "PrecipitationProbability": 7,
                        "ThunderstormProbability": 0,
                        "RainProbability": 7,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 9.3,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 47,
                                "Localized": "NE",
                                "English": "NE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 13,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 27,
                                "Localized": "NNE",
                                "English": "NNE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 40,
                        "Evapotranspiration": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 0,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=4&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=4&unit=c"
                },
                {
                    "Date": "2022-12-04T07:00:00+01:00",
                    "EpochDate": 1670133600,
                    "Sun": {
                        "Rise": "2022-12-04T08:21:00+01:00",
                        "EpochRise": 1670138460,
                        "Set": "2022-12-04T17:49:00+01:00",
                        "EpochSet": 1670172540
                    },
                    "Moon": {
                        "Rise": "2022-12-04T15:44:00+01:00",
                        "EpochRise": 1670165040,
                        "Set": "2022-12-05T05:35:00+01:00",
                        "EpochSet": 1670214900,
                        "Phase": "WaxingGibbous",
                        "Age": 11
                    },
                    "Temperature": {
                        "Minimum": {
                            "Value": 3.3,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 8.3,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "RealFeelTemperature": {
                        "Minimum": {
                            "Value": 1.2,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 10.5,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Fresco"
                        }
                    },
                    "RealFeelTemperatureShade": {
                        "Minimum": {
                            "Value": 1.2,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        },
                        "Maximum": {
                            "Value": 8.4,
                            "Unit": "C",
                            "UnitType": 17,
                            "Phrase": "Frío"
                        }
                    },
                    "HoursOfSun": 4.9,
                    "DegreeDaySummary": {
                        "Heating": {
                            "Value": 12,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Cooling": {
                            "Value": 0,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "AirAndPollen": [
                        {
                            "Name": "AirQuality",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1,
                            "Type": "Ozono"
                        },
                        {
                            "Name": "Grass",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Mold",
                            "Value": 32767,
                            "Category": "Poco saludable (sensible)",
                            "CategoryValue": 3
                        },
                        {
                            "Name": "Ragweed",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "Tree",
                            "Value": 0,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        },
                        {
                            "Name": "UVIndex",
                            "Value": 2,
                            "Category": "Bueno",
                            "CategoryValue": 1
                        }
                    ],
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false,
                        "ShortPhrase": "Destemplado, con nubes y sol",
                        "LongPhrase": "Destemplado, con intervalos de sol y nubes",
                        "PrecipitationProbability": 6,
                        "ThunderstormProbability": 0,
                        "RainProbability": 6,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 7.4,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 112,
                                "Localized": "ESE",
                                "English": "ESE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 18.5,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 62,
                                "Localized": "ENE",
                                "English": "ENE"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0,
                        "HoursOfRain": 0,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 55,
                        "Evapotranspiration": {
                            "Value": 0.8,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 2155.1,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": true,
                        "PrecipitationType": "Rain",
                        "PrecipitationIntensity": "Light",
                        "ShortPhrase": "Nubosidad variable",
                        "LongPhrase": "Podría caer algún chubasco al anochecer, por otra parte nubosidad variable",
                        "PrecipitationProbability": 40,
                        "ThunderstormProbability": 8,
                        "RainProbability": 40,
                        "SnowProbability": 0,
                        "IceProbability": 0,
                        "Wind": {
                            "Speed": {
                                "Value": 9.3,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 33,
                                "Localized": "NNE",
                                "English": "NNE"
                            }
                        },
                        "WindGust": {
                            "Speed": {
                                "Value": 16.7,
                                "Unit": "km/h",
                                "UnitType": 7
                            },
                            "Direction": {
                                "Degrees": 303,
                                "Localized": "ONO",
                                "English": "WNW"
                            }
                        },
                        "TotalLiquid": {
                            "Value": 0.2,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Rain": {
                            "Value": 0.2,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "Snow": {
                            "Value": 0,
                            "Unit": "cm",
                            "UnitType": 4
                        },
                        "Ice": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "HoursOfPrecipitation": 0.5,
                        "HoursOfRain": 0.5,
                        "HoursOfSnow": 0,
                        "HoursOfIce": 0,
                        "CloudCover": 73,
                        "Evapotranspiration": {
                            "Value": 0,
                            "Unit": "mm",
                            "UnitType": 3
                        },
                        "SolarIrradiance": {
                            "Value": 0,
                            "Unit": "W/m²",
                            "UnitType": 33
                        }
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=5&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=5&unit=c"
                }
            ]
        };
        let fiveDaysInfo = {
            "Headline": {
                "EffectiveDate": "2022-12-02T07:00:00+01:00",
                "EffectiveEpochDate": 1669960800,
                "Severity": 5,
                "Text": "Niebla afectará a la zona el viernes por la mañana",
                "Category": "fog",
                "EndDate": "2022-12-02T13:00:00+01:00",
                "EndEpochDate": 1669982400,
                "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?unit=c",
                "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?unit=c"
            },
            "DailyForecasts": [
                {
                    "Date": "2022-11-30T07:00:00+01:00",
                    "EpochDate": 1669788000,
                    "Temperature": {
                        "Minimum": {
                            "Value": 3.9,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 11.1,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "Day": {
                        "Icon": 3,
                        "IconPhrase": "Parcialmente soleado",
                        "HasPrecipitation": false
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=1&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=1&unit=c"
                },
                {
                    "Date": "2022-12-01T07:00:00+01:00",
                    "EpochDate": 1669874400,
                    "Temperature": {
                        "Minimum": {
                            "Value": 0.6,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 13.9,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "Day": {
                        "Icon": 2,
                        "IconPhrase": "Mayormente soleado",
                        "HasPrecipitation": false
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=2&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=2&unit=c"
                },
                {
                    "Date": "2022-12-02T07:00:00+01:00",
                    "EpochDate": 1669960800,
                    "Temperature": {
                        "Minimum": {
                            "Value": 1.1,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 10,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": false
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=3&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=3&unit=c"
                },
                {
                    "Date": "2022-12-03T07:00:00+01:00",
                    "EpochDate": 1670047200,
                    "Temperature": {
                        "Minimum": {
                            "Value": 1.1,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 8.9,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false
                    },
                    "Night": {
                        "Icon": 35,
                        "IconPhrase": "Parcialmente nublado",
                        "HasPrecipitation": false
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=4&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=4&unit=c"
                },
                {
                    "Date": "2022-12-04T07:00:00+01:00",
                    "EpochDate": 1670133600,
                    "Temperature": {
                        "Minimum": {
                            "Value": 3.3,
                            "Unit": "C",
                            "UnitType": 17
                        },
                        "Maximum": {
                            "Value": 8.3,
                            "Unit": "C",
                            "UnitType": 17
                        }
                    },
                    "Day": {
                        "Icon": 4,
                        "IconPhrase": "Nubes y claros",
                        "HasPrecipitation": false
                    },
                    "Night": {
                        "Icon": 38,
                        "IconPhrase": "Mayormente nublado",
                        "HasPrecipitation": true,
                        "PrecipitationType": "Rain",
                        "PrecipitationIntensity": "Light"
                    },
                    "Sources": [
                        "AccuWeather"
                    ],
                    "MobileLink": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=5&unit=c",
                    "Link": "http://www.accuweather.com/es/es/alcorcon/305882/daily-weather-forecast/305882?day=5&unit=c"
                }
            ]
        };
    }


}