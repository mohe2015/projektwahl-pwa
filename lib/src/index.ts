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

import { create } from "@dev.mohe/indexeddb/build/api";
import { DatabaseSchemaWithoutMigration, DatabaseMigration, migrate } from "@dev.mohe/indexeddb/build/interface";

export const createDatabase = async () => {
    let schema1: DatabaseSchemaWithoutMigration<1, {}> = {
        version: 1,
        objectStores: {},
    };

    let addedColumns1 = {
        settings: {
            key: {
                primaryKeyOptions: {
                    autoIncrement: false,
                    keyPath: 'key',
                },
            },
            value: {},
        },
    };

    let migration1: DatabaseMigration<
        1,
        2,
        {},
        {},
        typeof addedColumns1,
        typeof schema1
    > = {
        fromVersion: schema1.version,
        toVersion: 2,
        baseSchema: schema1,
        addedColumns: addedColumns1,
        removedColumns: {},
    };

    let schema2 = migrate<
        1,
        2,
        {},
        {},
        typeof addedColumns1,
        typeof addedColumns1,
        typeof schema1
    >(migration1);

    let connection = await create("mongodb://idb-mongodb")
    let database = await connection.database<
    1,
    2,
    {},
    {},
    typeof addedColumns1,
    {},
    typeof schema1,
    typeof schema2    
    >("projektwahl", schema2)

    console.log(database)

    let transaction = await database.transaction(["settings"], "readwrite") 

    await transaction.objectStore("settings").add(undefined, {
        key: "test2",
        value: "elephant"
    })

    await transaction.done

    connection.close()
}
