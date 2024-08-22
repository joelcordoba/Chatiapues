// Nombre de la cache
const CACHE_NAME = 'chatiapues-cache-v1';

// Archivos a cachear
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/gh/joelcordoba/Chatiapues/manifest.json'
];

// Instalando el Service Worker y cacheando los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activando el Service Worker y limpiando caches antiguas
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptando las solicitudes y sirviendo desde la cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en la cache, lo devuelve
                if (response) {
                    return response;
                }
                // Si no está en la cache, lo solicita a la red
                return fetch(event.request);
            })
    );
});
