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
    '/styles/index.css',
    '/styles/fonts/default.css',
    '/styles/fonts/fontawsome/fontawsome.css',
    '/styles/fonts/webfonts/fa-solid-900.woff2',
    '/styles/fonts/merriweather-sans/MerriweatherSans-Bold.otf',
    '/styles/fonts/merriweather-sans/MerriweatherSans-Regular.otf',
    '/scripts/main.js',

];

self.addEventListener('install', installer  => {
    console.log('Installing');

    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    };

    installer.waitUntil(done());
});

self.addEventListener('fetch', fetchEvent => {
    // respond to fetch request with a match from the cache
    // if not in cache, then request from network and cache
    // if there is a server error, show the offline page
    const url = fetchEvent.request.url;

    console.log(`Fetching: ${url}`);

    const getResponse = async (request) => {
        let response;
        
        response = await caches.match(request);
        if(response && response.status === 200) {
            console.log('File in cache. Returning cached version.');
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
    console.log('Activating');

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
