// Copyright (C) 2022 Antoine Meloche

/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

const { GObject, St, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
  _init() {
    super._init(0.0, 'Indicator');

    this.add_child(new St.Icon({
      icon_name: 'emblem-symbolic-link',
      style_class: 'system-status-icon',
    }));

	  this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.shortcutbutton');

    this.connect('button_press_event', (_obj, evt) => {
      if (evt.get_button() == Clutter.BUTTON_PRIMARY) {
	      let command = this.settings.get_value('command').get_string()[0];
	      if (command == "") {
	      	log('Shortcut Button error: no command specified')
	      }

        let [success, pid] = GLib.spawn_command_line_async(command);
      } else {
        ExtensionUtils.openPrefs();
      }
    })
  }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
