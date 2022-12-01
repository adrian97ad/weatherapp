class City {
    constructor() {
        this.jq = $('#currentCity');
        this._key = null;
        this.cityName = null;
        this.cityState = null;
        this.isFavorite = false;
    }

    get key() {
        return this._key;
    }

    fillCityInfo(data) {
        this._key = data.Key;
        this.cityName = data.LocalizedName;
        this.cityState = data.AdministrativeArea.LocalizedName;
    }
}

class ForeCastCity {
    constructor(city) {
        this.todayjq = $('#todayForecast');
        this.city = city;
        this.temperature = null;
        this.weather = null;
        this.precipitation = null;
    }

    setCurrentConditions(data) {
        this.temperature = new HTMLTemperature(Math.round(data.Temperature.Metric.Value),
            Math.round(data.TemperatureSummary.Past24HourRange.Maximum.Metric.Value),
            Math.round(data.TemperatureSummary.Past24HourRange.Minimum.Metric.Value));
        this.weather = new HTMLWeather(data.WeatherIcon);
        this.precipitation = new HTMLPrecipitation(data.RelativeHumidity);
        this.currentWeatherLink = data.Link;
        return this;
    }

    renderCurrentConditions() {
        this.city.jq.append(`<div id="todayForecast">
            <div class="todayInfo">
                <div class="todayInfoLeft">
                    <div class="dayTemperature">${this.temperature.currentTemp}º</div>
                    <div class="cityAndState">
                        <div class="cityName">${this.city.cityName}</div>
                        <div class="stateName">${this.city.cityState}</div>
                        <span class="favorite favorite-${this.city.key}"><i class="fa fa-star${this.city.isFavorite ? '' : '-o'}"></i></span>
                    </div>
                    <div class="maxTminTHumidity">
                        <div class="tempMax">${this.temperature.todayMaxTemp}º</div>
                        <div class="tempMin">${this.temperature.todayMinTemp}º</div>
                        <div class="humidity">Humedad: ${this.precipitation.currentHumidity}%</div>
                    </div>
                </div>
                <div class="weatherContainer">
                    <div class="currentWeather weatherIcon weatherIcon-${this.weather.currentWeather}"></div>
                </div>
            </div>
        </div>`);
        return this;
    }

    set12hoursForecast(data) {
        this.hoursForecast = [];
        let self = this;
        data.forEach(data => {
            let hour = new Date(data.DateTime).getHours();
            let normalHour = hour % 12;
            normalHour += (hour / 12 > 1) ? ' p. m.' : ' a. m.';
            self.weather.addHourlyWeather(data.WeatherIcon);
            self.temperature.addHourlyTemp(Math.round(data.Temperature.Value));
            self.precipitation.addHourlyPrecipitation(data.PrecipitationProbability);
            self.hoursForecast.push({
                hour: normalHour,
                weather: data.WeatherIcon,
                temperature: Math.round(data.Temperature.Value),
                precipitationProbability: data.PrecipitationProbability,
                link: data.Link
            });
        });
        return this;
    }

    render12hoursConditions() {
        this.city.jq.append(`<div class="hourlyForecasts12 gradient-background">`);
        let self = this;
        this.hoursForecast.forEach(hour => {
            $('.hourlyForecasts12').append(`<div class="hourForeCast">
                <div class="hour hourForeCast-element"> ${hour.hour}</div>
                <div class="hourWeather weatherIcon weatherIcon-${hour.weather} hourForeCast-element"></div>
                <div class="hourlyTemperature hourForeCast-element">${hour.temperature}º</div>
                <div class="temperatureGrpahic hourForeCast-element">
                    <div class="currentTemperatureHeight"
                    style="top: ${self.temperature.calculateRelativeTemperature(hour.temperature)}%"></div>
                </div>
                <div class="hourlyPrecipitation"><i class="fa fa-tint"></i> ${hour.precipitationProbability}%</div>
            </div>`);
        })
        return this;
    }

    set5DaysForecast(data) {
        const weekday = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        this.daysForeCast = [];
        let self = this;
        data.DailyForecasts.forEach(data => {
            self.precipitation.addDailyPrecipitation(Math.max(data.Day.PrecipitationProbability,
                data.Night.PrecipitationProbability));
            self.weather.addDayWeather(data.Day.Icon, data.Night.Icon);
            self.temperature.addDayTemp(Math.round(data.Temperature.Maximum.Value), Math.round(data.Temperature.Minimum.Value));
            self.daysForeCast.push({
                day: weekday[new Date(data.Date).getDay()],
                precipitationProbability: Math.max(data.Day.PrecipitationProbability,
                    data.Night.PrecipitationProbability),
                dayWeather: data.Day.Icon,
                nightWeather: data.Night.Icon,
                tempMax: Math.round(data.Temperature.Maximum.Value),
                tempMin: Math.round(data.Temperature.Minimum.Value),
                link: data.Link
            });
        });
        return this;
    }

    render5DaysConditions() {
        this.city.jq.append(`<div class="weeklyForecasts gradient-background">`);
        this.daysForeCast.forEach(day => {
            $('.weeklyForecasts').append(`<div class="dayForeCast">
                <div class="dayWeek">${day.day}</div>
                <div class="dayStats">
                    <div class="dailyPrecipitation"> <i class="fa fa-tint"> ${day.precipitationProbability}%</i></div>
                    <div class="weatherDayNight">
                        <div class="dayWeather weatherIcon weatherIcon-${day.dayWeather}"></div>
                        <div class="nightWeather weatherIcon weatherIcon-${day.nightWeather}"></div>
                    </div>
                    <div class="maxTminT">
                        <div class="tempMax">${day.tempMax}º</div>
                        <div class="tempMin">${day.tempMin}º</div>
                    </div>
                </div>
            </div>`);
        });
        return this;
    }

    renderFavorite() {
        $('#cityList').append(`<div class="cityInfo gradient-background favorite-${this.city.key}">
            <div class="todayInfo">
                <div class="todayInfoLeft">
                    <div class="dayTemperature">${this.temperature.currentTemp}º</div>
                    <div class="cityAndState">
                        <div class="cityName">${this.city.cityName}</div>
                        <div class="stateName">${this.city.cityState}</div>
                        <span class="favorite favorite-${this.city.key} favoriteList"><i class="fa fa-star"></i></span>
                    </div>
                    <div class="maxTminTHumidity">
                        <div class="tempMax">${this.temperature.todayMaxTemp}º</div>
                        <div class="tempMin">${this.temperature.todayMinTemp}º</div>
                        <div class="humidity">Humedad: ${this.precipitation.currentHumidity}%</div>
                    </div>
                </div>
                <div class="currentWeather weatherIcon weatherIcon-${this.weather.currentWeather}"></div>
            </div>
            <div class="nextDays">
            </div>
        </div>`);
        for (let i = 1; i < 4; i++) {
            let day = this.daysForeCast[i]
            $(`.cityInfo.favorite-${this.city.key} > .nextDays`).append(`<div class="dayAfter">
                    <div class="weatherIcon weatherIcon-${day.dayWeather}"></div>
                    <div class="dayAfterInfo">
                        <div class="weekDay">${day.day}</div>
                        <div class="nextDaysTemperatures">
                            <div class="tempMax">${day.tempMax}º</div>
                            <div class="tempMin">${day.tempMin}º</div>
                        </div>
                    </div>
                </div>`);
        }
    }
}