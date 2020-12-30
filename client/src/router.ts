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
// https://github.com/Polymer/lit-html/pull/1347
import { html, render } from 'lit-html';
import { loginTemplate } from './login';
import { navTemplate } from './nav';

const notFoundTemplate = (loggedIn: boolean) => html`
<h1 class="text-center display-1">404 Nicht gefunden</h1>
`

document.addEventListener(
  'click',
  (event) => {
    if (event.target instanceof Element) {
      const a = event.target.closest('a');

      if (a) {
        if (a.origin === window.location.origin) {
          event.preventDefault();
          //this.navbar.hide();
          navigate(a.href, null);
        }
      }
    }
  },
  {
    capture: true,
  },
);

const navigate = (url: string, state: any) => {
  history.pushState(state, document.title, url);
  appState.navbarExpanded = false
  update();
};

const contentElement = document.querySelector<HTMLDivElement>('#content')!

export let appState = {
  navbarExpanded: false
}

export const update = () => {
  let result = html`
    ${navTemplate(false)}
    ${template(document.location.pathname, null, false)}
    `
  render(result, contentElement);
};

const template = (url: string, state: any, loggedIn: boolean) => {
  let result = url.match(/login\/?/);
  if (result) return loginTemplate();



  return notFoundTemplate(loggedIn);
};

update();

window.addEventListener('popstate', (event) => {
  update();
})

const currentRouteTemplate = (pathname: string) => {};
