// https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API/Using_Service_Workers

const addResourcesToCache = async resources => {
    // Crea una cache de recursos que tiene la version 1 de la cache
    // de la aplicacion. Cuando se llama a addAll es para que use el array que es resources
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};
const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};
const cacheFirst = async ({request, preloadResponsePromise, fallbackUrl}) => {
    // Primero intenta obtener el recurso desde caché
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    // A continuación, intenta usar (y almacenar en caché) la respuesta precargada, si está allí
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info("using preload response", preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    // A continuación, intenta obtener el recurso desde la red
    try {
        const responseFromNetwork = await fetch(request);
        // la respuesta solo se puede usar una vez
        // necesitamos guardar el clon para poner una copia en caché
        // y servir el segundo
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        // cuando incluso la respuesta alternativa no está disponible,
        // no hay nada que podamos hacer, pero siempre debemos
        // devolver un objeto Response
        return new Response("Ocurrió un error de red", {
            status: 408,
            headers: {"Content-Type": "text/plain"},
        });
    }
};
const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        // ¡Habilitar precargas de navegación!
        // Se descargan recursos tan pronto como se realiza la solicitud de recuperacion y en paralelo
        // con el inicio del service worker.
        // La descarga comienza al navegar a una pagina, en lugar de tener que esperar a
        // que se inicie el service worker.
        await self.registration.navigationPreload.enable();
    }
};

// Luego usa event.preloadResponse para esperar a que el recurso precargado se termine de descargar
// en el controlador de eventos fetch.
self.addEventListener("activate", (event) => {
    event.waitUntil(enableNavigationPreload());
});
self.addEventListener("install", event => {
    // El service worker no se instala hasta que el codigo dentro de waitUntil haya ocurrido con exito
    event.waitUntil(addResourcesToCache(
        [
            "/",
            "/index.html",
            "/js/app/City.js",
            "/js/app/Stats.js",
            "/js/api/AccuWeather.js",
            "/js/sw/RegisterServiceWorker.js",
            "/js/sw/ServiceWorker.js",
            "/css/weatherapp.less"
        ]
    ));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request,
            preloadResponsePromise: event.preloadResponse,
            fallbackUrl: "/error.html",
        })
    );
});
// Eliminar caches antiguos
const deleteCache = async (key) => {
    await caches.delete(key);
};
const deleteOldCaches = async () => {
    const cacheKeepList = ["v2"];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
};
self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCaches());
});