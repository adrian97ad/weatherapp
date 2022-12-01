# weatherapp
Weather app using AccuWeather API

Para probar la aplicación no es necesario descargarse el proyecto. Solo es necesario acceder al siguiente enlace: https://adrian97ad.github.io/weatherapp/

Se ha usado la API de AccuWeather, con licencia gratuita. Eso limita las peticiones diarias a 50. Por cada búsqueda de una ciudad son cuatro peticiones:
1. La localización
2. El tiempo en el momento
3. El tiempo de las próximas 12 horas
4. El tiempo de los próximos 5 días

Si se añade la ciudad a favoritos, se hace un resumen de la información ya buscada.

He intentado utilizar Service Workers para que en el caso en el que el usuario pierda la conexión, pueda visualizar los datos que están en caché.
No he conseguido que funcione esta parte por un problema que no he conseguido corregir aún.

El proyecto está desarrollado en ES6 sin frameworks de javascript. Pretendía utilizar Babel.js para transpilarlo a ES5 y así el proyecto funcionaría en cualquier versión de cualquier navegador.
Se podría añadir en un futuro, es algo sencillo.

También podría haber transpilado el archivo LESS del proyecto para utilizar CSS directamente en cualquier navegador.

Para finalizar, gracias al potencial de la API de AccuWeather y a la arquitectura orientada a objetos del proyecto, es fácil de añadir información extra del tiempo meteorológico y se podría seguir mejorando el proyecto.
