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

export const navTemplate = () => html`
<nav class="navbar navbar-expand-lg navbar-light bg-light">
<div class="container-fluid">
  <a class="navbar-brand" href="#">Projektwahl</a>
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#"
          >Startseite</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Projekte</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Lehrer</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Nutzer</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Wahl</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Wahl beenden / starten</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/login">anmelden</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Passwort ändern</a>
      </li>
    </ul>
  </div>
</div>
</nav>
`