// https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API/Using_Service_Workers

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) { // service worker es compatible
        try {
            // Registramos el service worker para la aplicacion
            const registration = await navigator.serviceWorker.register('js/sw/ServiceWorker.js',
                {
                    updateViaCache: 'all',
                }
            );
            if (registration.installing) {
                console.log("Instalando el Service worker");
            } else if (registration.waiting) {
                console.log("Service worker instalando");
            } else if (registration.active) {
                console.log("Service worker activo");
            }
        } catch (error) {
            console.error(`Register fallado: ${error}`)
        }
    }
}
// cuidado con las variables globales dentro del service worker
// El service worker permite modificar solicitudes y respuestas, reemplazarlas con elementos de su propia cache
registerServiceWorker();