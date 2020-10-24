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

    let form = event.target as HTMLFormElement
    let fieldset = form.querySelector<HTMLFieldSetElement>("fieldset")!
    let usernameInput = form.querySelector<HTMLInputElement>("#username")!
    let passwordInput = form.querySelector<HTMLInputElement>("#password")!
   
    const formData = new FormData(form);

    fieldset.disabled = true;

    (async () => {
        try {
            console.log("generating certificate...")




            const response = await fetch("/api/0.1/login", {
                method: 'POST',
                body: formData
            })

            let json = await response.json()
    
            passwordInput.setCustomValidity("fdslifh")
        } catch (error) {
            alert(error)
        } finally {    
            fieldset.disabled = false;
        }
    })()
}

const clearCustomValidity = (event: Event) => {
    let input = event.target as HTMLInputElement
    input.setCustomValidity("")
}

export const loginTemplate = () => html`
<div class="container small-container">
    <h1 class="text-center">Anmelden</h1>
    <form @submit=${loginSubmitHandler}>
        <fieldset>
            <div class="mb-3">
                <label for="username" class="form-label">Benutzername:</label>
                <input @input=${clearCustomValidity} type="text" required class="form-control" id="username" name="username" autocomplete="username">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Passwort:</label>
                <input @input=${clearCustomValidity} type="password" required class="form-control" id="password" name="password" autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary">Anmelden</button>
        </fieldset>
    </form>
</div>
`