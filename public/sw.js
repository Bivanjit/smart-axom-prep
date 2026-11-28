const CACHE_NAME="smartprep-static-v1";
const OFFLINE_URL="/offline.html";
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.add(OFFLINE_URL);await self.skipWaiting();})());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith("smartprep-")&&key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim();})());
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||url.pathname.startsWith("/api/")||url.pathname.startsWith("/functions/")||url.pathname.startsWith("/auth/"))return;
 if(request.mode==="navigate"){
  event.respondWith((async()=>{
   try{return await fetch(request);}
   catch(error){const cached=await caches.match(request);if(cached)return cached;return (await caches.match(OFFLINE_URL))||Response.error();}
  })());
  return;
 }
 if(/\.(?:js|css|woff2?|png|jpe?g|webp|svg|ico)$/i.test(url.pathname)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   try{
    const response=await fetch(request);
    if(response.ok&&response.type==="basic")void cache.put(request,response.clone());
    return response;
   }catch(error){return (await cache.match(request))||Response.error();}
  })());
 }
});
