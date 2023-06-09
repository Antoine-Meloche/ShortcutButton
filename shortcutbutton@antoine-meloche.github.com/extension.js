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

// const Indicator = GObject.registerClass(
//   class Indicator extends PanelMenu.Button {
//     _init(command, icon) {
//       super._init(0.0, "Indicator");

//       this.add_child(
//         new St.Icon({
//           icon_name: icon,
//           style_class: "system-status-icon",
//         })
//       );

//       this.connect("button_press_event", (_obj, evt) => {
//         if (evt.get_button() == Clutter.BUTTON_PRIMARY) {
//           if (command == "") {
//             log("Shortcut Button error: no command specified");
//           }
//           let [success, pid] = GLib.spawn_command_line_async(command);
//         } else {
//           ExtensionUtils.openPrefs();
//         }
//       });
//     }
//   }
// );

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    constructor(commands, icon) {
      super(0.0, "Indicator");

      this._icon = new St.Icon({
        icon_name: icon,
        style_class: "system-status-icon",
      });

      this.actor.add_child(this._icon);

      this.connect("button-press-event", () => {
        // if (this._command == "") {
        //   log("Shortcut Button error: no command specified");
        // } else {
        //   Gio.Subprocess.new(["/bin/bash", "-c", this._command]).spawn_async(
        //     null
        //   );
        // }

        // dropdown list of commands to execute
        let menu = new PopupMenu.PopupMenu(this.actor, 0.0, St.Side.TOP);
        
        for (let i = 0; i < commands.length; i++) {
          let command = commands[i];
          let item = new PopupMenu.PopupMenuItem(command);
          menu.addMenuItem(item);
          item.connect("activate", () => {
            Gio.Subprocess.new(["/bin/bash", "-c", command]).spawn_async(
              null
            );
          });
        }

        menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        let settingsItem = new PopupMenu.PopupMenuItem("Settings");
        menu.addMenuItem(settingsItem);
        settingsItem.connect("activate", () => {
          ExtensionUtils.openPrefs();
        });
      });
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

    // for (let i = 0; i < commands.length; i++) {
    //   let command = commands[i];
    //   let icon = icons[i];

    //   let indicator = new Indicator(command, icon);
    //   Main.panel.addToStatusArea(this._uuid, indicator);
    // }

    let indicator = new Indicator(commands, icons[0]);
    Main.panel.addToStatusArea(this._uuid, indicator);
  }

  disable() {
    Main.panel.statusArea[this._uuid].actor.hide();
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}
