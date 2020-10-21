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
import {html, render} from 'lit-html';

const loginSubmitHandler = (event: Event) => {
    event.preventDefault()
    console.log(event)


    let form = event.target as HTMLFormElement
    let usernameInput = form.querySelector<HTMLInputElement>("#username")
    let passwordInput = form.querySelector<HTMLInputElement>("#password")

    const formData = new FormData(form)

    passwordInput?.setCustomValidity("fdslifh")

    return false
}

const test = (event: Event) => {
    let input = event.target as HTMLInputElement
    input.setCustomValidity("")
}

export const loginTemplate = () => html`
<div class="container">
    <h1 class="text-center">Anmelden</h1>
    <form @submit=${loginSubmitHandler}>
        <div class="mb-3">
            <label for="username" class="form-label">Benutzername:</label>
            <input @input=${test} type="text" required class="form-control" id="username" autocomplete="username">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Passwort:</label>
            <input @input=${test} type="password" required class="form-control" id="password" autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-primary">Anmelden</button>
    </form>
</div>
`