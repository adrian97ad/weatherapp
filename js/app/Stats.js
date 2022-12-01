class Temperature {
    constructor(current, max, min) {
        this.currentTemp = current;
        this.todayMaxTemp = max;
        this.todayMinTemp = min;
        this.hourlyTemp = [];
        this.daysTemp = [];
    }

    addHourlyTemp(newTemp, relativeTemp) {
        this.hourlyTemp.push({tempHora: newTemp, percentTemp: relativeTemp});
    }

    addDayTemp(max, min) {
        this.daysTemp.push({max: max, min: min});
    }

    calculateRelativeTemperature(temp) {
        return 100 - Math.round(temp * 100 / (this.todayMaxTemp - this.todayMinTemp));
    }
}

class HTMLTemperature extends Temperature {
    constructor(current, max, min) {
        super(current, max, min);
        this.$currentTemp = $('.dayTemperature');
        this.$todayMaxTemp = $('.tempMax');
        this.$todayMinTemp = $('.tempMin');
        this.$hourlyTemp = $('.hourlyTemperature');
        this.$hourlyTempHeight = $('.currentTemperatureHeight');
        this.$daysTemp = $('.maxTminT');
    }
}

class Weather {
    constructor(currentWeather) {
        this.currentWeather = currentWeather;
        this.hourlyWeather = [];
        this.daysWeather = [];
    }

    addHourlyWeather(newWeather) {
        this.hourlyWeather.push(newWeather);
    }

    addDayWeather(dayWeather, nightWeather) {
        this.daysWeather.push({day: dayWeather, night: nightWeather});
    }
}

class HTMLWeather extends Weather {
    constructor(currentWeather) {
        super(currentWeather);
        this.$currentWeather = $('.currentWeather');
        this.$hourlyWeather = $('.hourWeather');
        this.$daysWeather = {day: $('.dayWeather'), night: $('.nightWeather')};
    }
}

class Precipitation {
    constructor(currentHumidity) {
        this.currentHumidity = currentHumidity;
        this.hourlyPrecipitation = [];
        this.dailyPrecipitation = [];
    }

    addHourlyPrecipitation(precipitation) {
        this.hourlyPrecipitation.push(precipitation);
    }

    addDailyPrecipitation(precipitation) {
        this.dailyPrecipitation.push(precipitation);
    }
}

class HTMLPrecipitation extends Precipitation {
    constructor(currentHumidity) {
        super(currentHumidity);
        this.$currentHumidity = $('humidity');
        this.$hourlyPrecipitation = $('hourlyPrecipitation');
        this.$dailyPrecipitation = $('dailyPrecipitation');
    }
}
