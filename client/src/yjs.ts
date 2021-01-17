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
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

// TODO FIXME authorization
// https://github.com/yjs/yjs/issues/79
// https://github.com/yjs/yjs/issues/234
// https://docs.yjs.dev/api/subdocuments
// https://discuss.yjs.dev/t/attribution-of-changes/291/6
// https://github.com/yjs/y-protocols/blob/master/auth.js

const ydoc = new Y.Doc()

// this allows you to instantly get the (cached) documents data
const indexeddbProvider = new IndexeddbPersistence('count-demo', ydoc)
indexeddbProvider.whenSynced.then(() => {
  console.log('loaded data from indexed db')
})

// TODO FIXME either the signaling server or the other clients should check whether you are autorized to get that data.
// Sync clients with the y-webrtc provider.
// @ts-expect-error
const webrtcProvider = new WebrtcProvider('count-demo', ydoc, { password: 'optional-room-password', signaling: ['ws://localhost:4444'] })

// Sync clients with the y-websocket provider
const websocketProvider = new WebsocketProvider(
  'ws://localhost:1234', 'count-demo', ydoc
)

// array of numbers which produce a sum
const yarray = ydoc.getArray<number>('count')

// observe changes of the sum
yarray.observe(event => {
  // print updates when the data changes
  console.log('new sum: ' + yarray.toArray().reduce((a, b) => a + b))
})

// add 1 to the sum
yarray.push([1]) // => "new sum: 1"