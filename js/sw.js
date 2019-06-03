///asignar nombre y version de la cache
 const CACHE_NAME = 'PrimerCache';


//Ficheros a cachear  en la applicacion
var UrlsToCache =[
'../',
'../css',
'../images',
 '../js'
];
//evento de instalacion

self.addEventListener('install', e =>{
    console.log('sw instalo correctamente');

    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(UrlsToCache)
                .then(() => {
                    self.skipWaiting();
                })
            }).catch( err => {
                console.log('no se registro el cache',err);
            })
    );

})


//evento activate

self.addEventListener('activate',e =>{
    const cacheWhitelist = [CACHE_NAME];
    console.log('sw Activo correctamente');
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {

                     if(cacheWhitelist.indexOf(cacheName)=== -1){
                        //borrar cache que  ya no esta
                         return caches.delete(cacheName);
                        }
                })
            
            );
        }).then(()=>{

            self.clients.claim();
        })
    );

})

self.addEventListener('fetch',event =>{

event.respondWith(
    caches.match(e.request)
    .then(res => {
    if(res){
           // se devuelven datos de cache
           return res;
    }
     
    return fetch(event.request);
    } )

   
);
})