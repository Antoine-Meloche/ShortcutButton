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
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    constructor(commands, icons) {
      super(0.0, "Indicator");

      this._icon = new St.Icon({
        icon_name: icons[0],
        style_class: "system-status-icon",
      });

      this.actor.add_child(this._icon);

      let menu = new PopupMenu.PopupMenu(this.actor, 0.0, St.Side.TOP);

      this.connect("button-press-event", (event) => {
        // primary button pressed
        if (event.get_button() == 1) {
          Gio.Subprocess.new(["/bin/bash", "-c", commands[0]]).spawn_async(
            null
          );
        } else if (event.get_button() == 3) {
          menu.toggle();
        }
      });

      for (let i = 0; i < commands.length; i++) {
        let command = commands[i];
        let icon = icons[i];
        let item = new PopupMenu.PopupImageMenuItem(command, icon);
        menu.addMenuItem(item);
        item.connect("activate", () => {
          Gio.Subprocess.new(["/bin/bash", "-c", command]).spawn_async(null);
        });
      }

      menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      let settingsItem = new PopupMenu.PopupMenuItem("Settings");
      menu.addMenuItem(settingsItem);
      settingsItem.connect("activate", () => {
        ExtensionUtils.openPrefs();
      });

      this.menu = menu;
      Main.uiGroup.add_actor(this.menu.actor);
      this.menu.actor.hide();
    }

    destroy() {
      super.destroy();
    }
  }
);

class Extension {
  constructor(uuid) {
    this._uuid = uuid;
  }

  enable() {
    this.settings = ExtensionUtils.getSettings(
      "org.gnome.shell.extensions.shortcutbutton"
    );

    let commands = this.settings.get_value("commands").get_strv();
    let icons = this.settings.get_value("icons").get_strv();

    let indicator = new Indicator(commands, icons);
    Main.panel.addToStatusArea(this._uuid, indicator);
  }

  disable() {
    Main.panel.statusArea[this._uuid].actor.hide();
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}
