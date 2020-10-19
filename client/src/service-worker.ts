/*
 * projektwahl - Diese Software kann eine Projektwahl verwalten, wie sie beispielsweise für eine Projektwoche benötigt wird.
 *
 * Copyright (C) 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * SPDX-FileCopyrightText: 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// https://github.com/microsoft/TypeScript/issues/11781
declare var self: ServiceWorkerGlobalScope;
export {};

// TODO https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
// TODO https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim

const mainCache = 'static-v34'

self.addEventListener('install', (event) => {
  console.log("install")

  // don't do this is two different service workers running at the same time would break things
  self.skipWaiting()

  event.waitUntil(
    (async () => {
      let cache = await caches.open(mainCache)
      await cache.addAll([
        '/index.html',
        '/web_modules/bootstrap/dist/css/bootstrap.css',
        '/index.css',
        '/index.js',
        '/error-handler.js',
        '/web_modules/bootstrap.js',
        '/manifest.webmanifest',
        '/logo.svg',
      ]);
      console.log('} install');
    })(),
  );
});


self.addEventListener('activate', (event) => {
  console.log("activate {")
  var cacheKeeplist = [mainCache];

  event.waitUntil(
    (async () => {
      // don't do this if this service worker is not backwards compatible
      await self.clients.claim()

      let keyList = await caches.keys();
      await Promise.all(
        keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }),
      );
      console.log('} activate')
    })()
  );
});

self.addEventListener('fetch', (event) => {
  console.log('fetch {');
  const url = new URL(event.request.url);

  


  
  if (url.origin == location.origin && url.pathname == '/login') {
    event.respondWith(
      (async () => {
        let templateHtml = (await caches.match('/index.html'))!
        let text = await templateHtml.text()

        let arr = text.split("SPECIFIC_SELECTOR")



        return templateHtml
      })())
  }



  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith((async () => (await caches.match('/cat.svg'))!)());
  }

  event.respondWith(
    (async () => {
      let resp = await caches.match(event.request)
      if (resp) return resp
      
      let response = await fetch(event.request)
      const cache = await caches.open(mainCache);
      cache.put(event.request, response.clone());
      return response; 
    })()
  );

  console.log('} fetch');
})

self.addEventListener('message', (event) => {
  console.log("message {")


  console.log("} message")
})

self.addEventListener('push', (event) => {
  console.log("push {")

  console.log("} push")
})