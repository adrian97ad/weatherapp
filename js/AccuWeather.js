class AccuWeather {
    constructor() {
        this._apikey = '81yA6ycWU6qvQwagPZCAhjTA5ApKnnig';
        this.language = 'es-ES';
        this.urls = {
            basic: 'https://dataservice.accuweather.com/',
            cities: 'https://dataservice.accuweather.com/locations/v1/cities/',
            forecast: 'http://dataservice.accuweather.com/forecasts/v1/'
        }
    }
    static getInstance() {
        if(!AccuWeather.instance) {
            this.instance = new AccuWeather();
        }
        return this.instance;
    }

    async getCity(cityName) {
        const city = await fetch(`${this.urls.cities}search?apikey=${this._apikey}&q=${encodeURI(cityName)}&language=${this.language}&details=false&offset=5`);
        const data = await city.json();
        return data[0].Key;
    }

    async getWeatherCiy(cityName) {
        const cityCode = await this.getCity(cityName);
        const city = await fetch(`${this.urls.basic}/currentconditions/v1/${cityCode}?apikey=${this._apikey}&language=${this.language}&details=true`);
        const data = await city.json();
        return data[0];
    }

    async autocompleteSearch(text) {
        const city = await fetch(`${this.urls.cities}autocomplete?apikey=${this._apikey}&q=${encodeURI(text)}&language=${this.language}`)
        return await city.json();
    }
}