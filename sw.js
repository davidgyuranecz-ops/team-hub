// // Network-first navigation.
// No application data or API responses cached.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener('fetch', event => {
  const r = event.request;
  const u = new URL(r.url);

  if (
    r.method !== 'GET' ||
    u.origin !== self.location.origin ||
    !u.pathname.startsWith(
      new URL(self.registration.scope).pathname
    )
  ) return;

  if (
    r.mode === 'navigate' ||
    u.pathname.endsWith('/version.json')
  ) {
    event.respondWith(fetch(r, { cache: 'no-store' }));
  }
});

// Push notifications

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || 'thediamonds';

  const options = {
    body: data.body || 'Új értesítésed érkezett.',
    tag: data.tag || 'thediamonds-notification',
    data: {
      url: self.registration.scope
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Open application when notification is clicked

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const appUrl = self.registration.scope;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      for (const client of windows) {
        if (
          client.url.startsWith(appUrl) &&
          'focus' in client
        ) {
          return client.focus();
        }
      }

      return self.clients.openWindow(appUrl);
    })()
  );
});
