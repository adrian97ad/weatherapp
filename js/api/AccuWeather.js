class AccuWeather {
    constructor() {
        this._apikey = '81yA6ycWU6qvQwagPZCAhjTA5ApKnnig';
        this.language = 'es-ES';
        this.urls = {
            basic: 'https://dataservice.accuweather.com/',
            cities: 'https://dataservice.accuweather.com/locations/v1/cities/',
            forecast: 'https://dataservice.accuweather.com/forecasts/v1/'
        }
    }

    static getInstance() {
        if (!AccuWeather.instance) {
            this.instance = new AccuWeather();
        }
        return this.instance;
    }

    async getCity(cityName) {
        const city = await fetch(`${this.urls.cities}search?apikey=${this._apikey}&q=${encodeURI(cityName)}&language=${this.language}&details=false&offset=5`);
        return await city.json();
    }

    async getWeatherCity(cityCode) {
        const cityForeCast = await fetch(`${this.urls.basic}/currentconditions/v1/${cityCode}?apikey=${this._apikey}&language=${this.language}&details=true`);
        const data = await cityForeCast.json();
        return data[0];
    }

    async gethourly12hour(cityCode) {
        const hourlyForeCast = await fetch(`${this.urls.forecast}hourly/12hour/${cityCode}?apikey=${this._apikey}&language=${this.language}&details=false&metric=true`);
        return await hourlyForeCast.json();
    }

    async getdaily5days(cityCode) {
        const dailyForeCast = await fetch(`${this.urls.forecast}daily/5day/${cityCode}?apikey=${this._apikey}&language=${this.language}&details=true&metric=true`);
        return await dailyForeCast.json();
    }

    // async autocompleteSearch(text) {
    //     const city = await fetch(`${this.urls.cities}autocomplete?apikey=${this._apikey}&q=${encodeURI(text)}&language=${this.language}`)
    //     return await city.json();
    // }
}