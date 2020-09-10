if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let path = 'serviceWorker.js';
            if (window.location.pathname === '/pages/recentCities.html') {
                path = '../serviceWorker.js';
            } 
            const registration = await navigator.serviceWorker.register(path);
            console.log('Service worker registration sucessful');
            console.log(`Registered with scope: ${registration.scope}`);
        } catch (e) {
            console.log('Service worker registration failed');
            console.log(e);
        }
    });
}