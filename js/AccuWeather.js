class AccuWeather {
    constructor() {
        this._apikey = '81yA6ycWU6qvQwagPZCAhjTA5ApKnnig';
        this.language = 'es-ES';
        this.basicURL = 'https://dataservice.accuweather.com/';
    }
    static getInstance() {
        if(!AccuWeather.instance) {
            this.instance = new AccuWeather();
        }
        return this.instance;
    }

    async getCity(cityName) {
        const city = await fetch(`${this.basicURL}locations/v1/cities/search?apikey=${this._apikey}&q=${encodeURI(cityName)}&language=${this.language}&details=false&offset=5`);
        const data = await city.json();
        return data[0].Key;
    }

    async getWeatherCiy(cityName) {
        const cityCode = await this.getCity(cityName);
        const city = await fetch(`${this.basicURL}/currentconditions/v1/${cityCode}?apikey=${this._apikey}&language=${this.language}&details=true`);
        const data = await city.json();
        return data[0];
    }
}