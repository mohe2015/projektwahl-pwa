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

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      console.log('install {');
      let cache = await caches.open('v1')
      await cache.addAll(['/index.html']);
      console.log('} install');
    })(),
  );
});


self.addEventListener('activate', (event) => {
  var cacheKeeplist = ['v1'];

  event.waitUntil(
    (async () => {
      console.log('activate {');
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

  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith((async () => (await caches.match('/cat.svg'))!)());
  }
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