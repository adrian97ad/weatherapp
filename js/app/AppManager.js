class AppManager {
    constructor() {
        this._accuWeather = null;
        this._cityForecast = null;
        this._$searchBar = $('#cityForm');
        this._favoriteCityList = new Map();
    }

    set accuWeather(accuWeather) {
        this._accuWeather = accuWeather;
    }

    get accuWeather() {
        return this._accuWeather;
    }

    set cityForecast(forecast) {
        this._cityForecast = forecast;
    }

    get cityForecast() {
        return this._cityForecast;
    }

    get $searchBar() {
        return this._$searchBar;
    }

    get favoriteCityList() {
        return this._favoriteCityList;
    }

    static getInstance() {
        if (!AppManager.instance) {
            this.instance = new AppManager();
        }
        return this.instance;
    }

    static registerEvent($selector, event, data, callback) {
        $selector.on(event, data, callback);
    }

    static init() {
        AppManager.getInstance().accuWeather = AccuWeather.getInstance();
        AppManager.registerEvent(AppManager.getInstance().$searchBar.children('button'), 'click touch',
            {$cityName: AppManager.getInstance().$searchBar.children('input')}, AppManager.getWeatherCity)
    }

    static switchCityToForeCast() {
        if (AppManager.getInstance().cityForecast == null)
            return;
        let $city = AppManager.getInstance().cityForecast.city.jq;
        for (let i = $city.children().length - 1; i > 0; i--) {
            $city.children().last().remove();
        }
    }

    static addElementToFavorite() {
        AppManager.getInstance().cityForecast.city.isFavorite = true;
        $(`.favorite-${AppManager.getInstance().cityForecast.city.key} > .fa`).removeClass('fa-star-o').addClass('fa-star');
        AppManager.getInstance().favoriteCityList.set(
            AppManager.getInstance().cityForecast.city.key, AppManager.getInstance().cityForecast);
        AppManager.getInstance().cityForecast.renderFavorite();
    }
    static removeElementFromFavorite() {
        AppManager.getInstance().cityForecast.city.isFavorite = false;
        $(`.favorite-${AppManager.getInstance().cityForecast.city.key} > .fa`).removeClass('fa-star').addClass('fa-star-o');
        $('#cityList').children(`.cityInfo.favorite-${AppManager.getInstance().cityForecast.city.key}`).remove();
        AppManager.getInstance().favoriteCityList.delete(AppManager.getInstance().cityForecast.city.key);
        if(AppManager.getInstance().favoriteCityList.size === 0) {
            $('#cityList').css('display', 'none');
        }
    }

    static getWeatherCity(event) {
        event.preventDefault();
        AppManager.switchCityToForeCast();
        let cityName = event.data.$cityName[0].value;
        event.data.$cityName[0].value = '';
        event.data.$cityName.focus();
        AppManager.getInstance().accuWeather.getCity(cityName)
            .then(data => {
                let city = new City();
                city.fillCityInfo(data[0]);
                AppManager.getInstance().cityForecast = new ForeCastCity(city);
                AppManager.getInstance().accuWeather.getWeatherCity(AppManager.getInstance().cityForecast.city.key)
                    .then(data => {
                        AppManager.getInstance().cityForecast.setCurrentConditions(data).renderCurrentConditions();
                        AppManager.registerEvent(AppManager.getInstance().cityForecast.todayjq, 'click touch',
                            {
                                url: AppManager.getInstance().cityForecast.currentWeatherLink
                            }, function (e) {
                                window.open(e.data.url, '_blank').focus();
                            });
                        AppManager.registerEvent($(`.favorite-${AppManager.getInstance().cityForecast.city.key}`),
                            'click touch', {}, function (e) {
                            e.preventDefault();
                                if (!AppManager.getInstance().cityForecast.city.isFavorite) {
                                    AppManager.addElementToFavorite();
                                    AppManager.registerEvent($(`.favorite-${AppManager.getInstance().cityForecast.city.key} .favoriteList`),
                                        'click touch', {
                                        $selector: AppManager.getInstance().cityForecast.city.key
                                        }, function (e) {
                                            e.preventDefault();
                                            $(`.favorite-${e.data.$selector} .favoriteList > .fa`).removeClass('fa-star').addClass('fa-star-o');
                                            $('#cityList').children(`.cityInfo.favorite-${e.data.$selector}`).remove();
                                            AppManager.getInstance().favoriteCityList.delete(e.data.$selector);
                                            if(AppManager.getInstance().favoriteCityList.size === 0) {
                                                $('#cityList').css('display', 'none');
                                            }
                                    });
                                    if(window.innerWidth > 620) {
                                        $('#cityList').css('display', 'block');
                                    }
                                } else {
                                    AppManager.removeElementFromFavorite();
                                }
                            });
                        AppManager.getInstance().accuWeather.gethourly12hour(AppManager.getInstance().cityForecast.city.key)
                            .then(data => {
                                AppManager.getInstance().cityForecast.set12hoursForecast(data).render12hoursConditions();
                                AppManager.getInstance().accuWeather.getdaily5days(AppManager.getInstance().cityForecast.city.key)
                                    .then(data => {
                                        AppManager.getInstance().cityForecast.set5DaysForecast(data).render5DaysConditions();
                                    })
                                    .catch(error => {
                                        $('#cityName')[0].value = 'Ha ocurrido un error, disculpe las molestias';
                                        console.log(error)
                                    });
                            })
                            .catch(error => {
                                $('#cityName')[0].value = 'Ha ocurrido un error, disculpe las molestias';
                                console.log(error)
                            });
                    })
                    .catch(error => {
                        $('#cityName')[0].value = 'Ha ocurrido un error, disculpe las molestias';
                        console.log(error)
                    });
            })
            .catch(error => {
                $('#cityName')[0].value = 'Ha ocurrido un error, disculpe las molestias';
                console.log(error)
            });
    }
}