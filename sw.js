// Network-first navigation. No application data or API responses cached.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const r=event.request; const u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(r.mode==='navigate'||u.pathname.endsWith('/version.json'))event.respondWith(fetch(r,{cache:'no-store'}));
});
