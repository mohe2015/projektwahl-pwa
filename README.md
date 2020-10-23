<!--
projektwahl - Diese Software kann eine Projektwahl verwalten, wie sie beispielsweise für eine Projektwoche benötigt wird.

Copyright (C) 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.


SPDX-FileCopyrightText: 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>

SPDX-License-Identifier: AGPL-3.0-or-later
-->
# projektwahl-pwa
[WORK-IN-PROGRESS] Diese Software kann eine Projektwahl verwalten, wie sie beispielsweise für eine Projektwoche benötigt wird.

docker run -it -v $(pwd):/tmp/repo -w /tmp/repo node /bin/bash
npm install

nix-shell --pure -p git cmake gcc nodejs-15_x python38 cacert curl



https://github.com/mohe2015/projektwahl/blob/main/src/server/index.ts
https://github.com/mohe2015/projektwahl/blob/main/src/server/server.ts

# Design

Initial setup: ask the server to exchange your username and password for a certificate that is signed by the server for a specific period of time

Use that certificate to ask any peer for the list of projects / users / ...
Use the certificate to update values (recommended to connect to a server for data consistency guarantee)

A user should be able to have multiple certificates

Revoking should be possible?

Best way would be to do all communication using WebRTC because then you would only need one technology. But probably WebSockets or http2 requests need to be used for client server communication



https://github.com/node-webrtc/node-webrtc
