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

import { Http2SecureServer, ServerHttp2Stream, IncomingHttpHeaders, createSecureServer } from 'http2';
import { readFileSync } from 'fs';
import { parse } from "url";
import Busboy from 'busboy';
import argon2 from 'argon2';
/// <reference path="nodejs.d.ts" />
import { sign, webcrypto as crypto } from 'crypto';



//import './web-of-trust.js';
//import { create } from '@dev.mohe/indexeddb';
//import { DatabaseMigration, DatabaseSchemaWithoutMigration, migrate } from '@dev.mohe/indexeddb/build/interface';
//import { createDatabase } from '@dev.mohe/projektwahl-lib'

// https://nodejs.org/api/http2.html

// curl -s -D /dev/stderr --insecure -X POST "https://localhost:8443/" | jq

export async function sessionStream(stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) {
    if (headers[":method"] !== "POST") {
        stream.respond({
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "https://localhost:8080",
            ":status": 405,
        })
        stream.end(JSON.stringify({
            error: "method-not-allowed"
        }))
        return;
    }

    if (headers[":path"] === "/api/0.1/login") {

        let busboy = new Busboy({ headers: headers, limits: {
            fieldNameSize: 16,
            fieldSize: 256,
            fields: 3,
            fileSize: 0,
            files: 0,
            parts: 3
        }})

        let username: string | undefined = undefined;
        let password: string | undefined = undefined;
        let certificate: string | undefined = undefined;

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            file.on('data', function(data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function() {
                console.log('File [' + fieldname + '] Finished');
            });
            
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            if (fieldnameTruncated || valTruncated) {
                console.error("too big form data - closing connection...")
                stream.destroy()
                busboy.end()
                busboy.removeAllListeners()
                return
            }
            console.log('Field [' + fieldname + ']: value: ' + val);
            if (fieldname === "username") username = val;
            else if (fieldname === "password") password = val;
            else if (fieldname === "certificate") certificate = val;
            else {
                console.error("forbidden field - closing connection...")
                stream.destroy()
                busboy.end()
                busboy.removeAllListeners()
                return
            }
        });
        busboy.on('finish', async function() {
            console.log('Done parsing form!');
            if (username === undefined || password === undefined || certificate === undefined) {
                console.error("not all fields provided - closing connection...")
                stream.destroy()
                return
            }

            // https://datatracker.ietf.org/doc/draft-irtf-cfrg-argon2/?include_text=1
            // 0.5 seconds
            // take care because this can DOS the server (also memory wise)
            const theHash = await argon2.hash(password, {
                type: argon2.argon2id,
                hashLength: 64,
                timeCost: 1, // recommended 1
                memoryCost: 1024 * 1024, // KiB TODO FIXME (per thread)
                parallelism: 16, // parallelism (twice the cores)
                raw: false,
                saltLength: 64,
            })

            const checkedHash = await argon2.verify(theHash, password)

            let doesNeedRehash = argon2.needsRehash(theHash, {
                type: argon2.argon2id,
                hashLength: 64,
                timeCost: 1, // recommended 1
                memoryCost: 1024 * 1024, // KiB TODO FIXME (per thread)
                parallelism: 16, // parallelism (twice the cores)
                raw: false,
                saltLength: 64,
            })

            // don't use ECDSA because of snowden
            const serverKey = await crypto.subtle.generateKey({
                name: "RSA-PSS",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-512"
            },
            true,
            ["sign", "verify"])

            let publicServerKey = serverKey.publicKey

            let enc = new TextEncoder();

            let signature = await crypto.subtle.sign({
                name: "RSA-PSS",
                saltLength: 512/8
            }, serverKey.privateKey,
            enc.encode(certificate))
            
            certificate


            try {
                stream.respond({
                    "content-type": "application/json; charset=utf-8",
                    "Access-Control-Allow-Origin": "https://localhost:8080",
                    ":status": 200
                })
                stream.end(JSON.stringify({
                    response: theHash,
                    signature: [...new Uint8Array(signature)].map(a => a.toString(16).padStart(2, "0")).join("")
                }))
            } catch (error) { console.trace(error) }
        });
        stream.pipe(busboy);
    } else {
        stream.respond({
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "https://localhost:8080",
            ":status": 404
        })
        stream.end(JSON.stringify({
            error: "not-found"
        }))
    }
}

export const startServer = () => {
    const server: Http2SecureServer = createSecureServer({
        key: readFileSync("localhost-key.pem"),
        cert: readFileSync("localhost.pem"),
    });

    server.on("session", (session) => { // session is an active communication session between client and server
        session.on("stream", sessionStream) // 
    });

    server.on("timeout", () => {
        console.error("timeout")
    })

    server.on("sessionError", (error) => {
        console.error(error)
    })

    server.on("unknownProtocol", () => {
        console.error("we should support http1.x using options.allowHTTP1")
    })

    server.listen(8443, () => {
        console.log("Server started at https://localhost:8443");
    });

    return server
}

startServer()
//createDatabase()