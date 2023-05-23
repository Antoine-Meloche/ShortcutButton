const { GObject, Gdk, Gtk, Adw, Gio, GdkPixbuf, GLib } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {}

function buildPrefsWidget() {
  let styleProvider = new Gtk.CssProvider();
  styleProvider.load_from_path('prefs.css')
  Gtk.StyleContext.add_provider_for_display(
    Gdk.Display.get_default(),
    styleProvider,
    Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
  );
  return new UserCommandPrefsWidget();
}

class UserCommandPrefsWidget extends Adw.PreferencesGroup {
  static {
    GObject.registerClass(this);
  }

  constructor() {
    super({ title: "Shortcut Button Command" });

    let settings = ExtensionUtils.getSettings(
      "org.gnome.shell.extensions.shortcutbutton"
    );

    let commands = settings.get_value("commands").get_strv();
    let iconList = settings.get_value("icons").get_strv();

    // Add all commands in the settings
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      let icon = iconList[i];

      let commandLabel = new Gtk.Label({
        label: "Command to execute: ",
      });
      let commandEntry = new Gtk.Entry();

      let hBoxCommand = new Gtk.Box();
      hBoxCommand.set_orientation(Gtk.Orientation.HORIZONTAL);
      hBoxCommand.append(commandLabel);
      hBoxCommand.append(commandEntry);

      commandEntry.set_text(command);
      commandEntry.connect("changed", () => {
        commands[i] = commandEntry.get_text();
        settings.set_value("commands", new GLib.Variant("as", commands));
      });

      let iconGrid = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
      let icons = [];
      let selectedIcon = null;

      let iconNames = [
        "system-run",
        "accessories-text-editor",
        "internet-web-browser",
        "emblem-system",
        "system-lock-screen",
        "system-log-out",
      ];
      for (let i = 0; i < iconNames.length; i++) {
        let iconBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
        let icon = new Gtk.Image();
        let iconName = iconNames[i];
        let iconFile = Gio.Icon.new_for_string(iconName);
        icon.set_from_gicon(iconFile, Gtk.IconSize.BUTTON);

        let eventBox = new Gtk.Button();
        eventBox.set_icon_name(iconName);
        eventBox.connect("clicked", () => {
          if (selectedIcon) {
            selectedIcon.remove_style_class_name("selected");
          }
          if (selectedIcon != icon) {
            icon.add_style_class_name("selected");
            selectedIcon = icon;
          } else {
            selectedIcon = null;
          }
        });
        iconBox.append(eventBox);
        icons.push(icon);
        iconGrid.append(iconBox);
      }

      let hBoxIcon = new Gtk.Box();
      hBoxIcon.set_orientation(Gtk.Orientation.HORIZONTAL);
      hBoxIcon.append(iconGrid);

      let addButton = new Gtk.Button({
        label: "Add Button",
      });
      addButton.connect("clicked", () => {
        this.addNewButton();
      });

      let vBox = new Gtk.Box();
      vBox.set_orientation(Gtk.Orientation.VERTICAL);
      vBox.append(hBoxIcon);
      vBox.append(hBoxCommand);
      vBox.append(addButton);
      this.add(vBox);
    }
  }
  addNewButton() {}
}
