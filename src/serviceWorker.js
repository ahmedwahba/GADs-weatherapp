const CACHE_NAME = 'SITE_CONTENT_V1';

const urlsToCache = [
    //'/index.html',
    '/pages/404.html',
    '/pages/offline.html',
    '/images/default.jpg',
    '/images/down.jpg',
    '/images/noon.jpg',
    '/images/sunset.jpg',
    '/images/night.png',
    '/style/index.css',
    '/style/fonts/default.css',
    '/style/fonts/merriweather-sans/MerriweatherSans-Bold.otf',
    '/style/fonts/merriweather-sans/MerriweatherSans-Regular.otf',
    // '/scripts/main.js',
    // '/scripts/weather.js'

];

self.addEventListener('install', installer  => {
    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    };

    installer.waitUntil(done());
});

self.addEventListener('fetch', fetchEvent => {
    const url = fetchEvent.request.url;

    const getResponse = async (request) => {
        let response;
        
        response = await caches.match(request);
        if(response && response.status === 200) {
            return response;
        }

        try {
            response = await fetch(request);
            if(response && response.status === 404) {
                return caches.match('/pages/404.html');
            }
        } catch (e) {
            return caches.match('/pages/offline.html')
        }

        const clone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(url, clone);
        return response;
    };

    fetchEvent.respondWith(getResponse(fetchEvent.request));
});

self.addEventListener('activate', activator => {

    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if(!currentCaches.includes(name)) {
                return caches.delete(name);
            }
        }));
    };

    activator.waitUntil(done());
});
