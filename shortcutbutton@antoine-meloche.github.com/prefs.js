const { GObject, Gtk, Adw, Gio, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init () {}

function buildPrefsWidget () {
  return new UserCommandPrefsWidget();
}

class UserCommandPrefsWidget extends Adw.PreferencesGroup {
  static {
    GObject.registerClass(this);
  }

  constructor() {
    super({ title: "Shortcut Button Command"});

    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.shortcutbutton');

    let commandLabel = new Gtk.Label({
      label: "Command to execute: "
    });
    let commandEntry = new Gtk.Entry();
    // commandEntry.connect('changed', (w) => {
    //   log(w.get_text());
    // })

    let hBoxCommand = new Gtk.Box();
    hBoxCommand.set_orientation(Gtk.Orientation.HORIZONTAL);
    if (imports.gi.versions.Gtk.startsWith("3")) {
      hBoxCommand.add(commandLabel);
      hBoxCommand.add(commandEntry);
    }
    else {
      hBoxCommand.append(commandLabel);
      hBoxCommand.append(commandEntry);
    }

    settings.bind('command', commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

    let iconLabel = new Gtk.Label({
      label: "Icon to use: "
    });
    let iconEntry = new Gtk.Entry();
    let iconPreview = new St.Icon(settings.get_value('icon').get_string()[0])

    settings.bind('icon', commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

    let hBoxIcon = new Gtk.Box();
    hBoxIcon.set_orientation(Gtk.Orientation.HORIZONTAL);
    if (imports.gi.versions.Gtk.startsWith("3")) {
      hBoxIcon.add(iconLabel);
      hBoxIcon.add(iconEntry);
      hBoxIcon.add(iconPreview);
    }
    else {
      hBoxIcon.append(iconLabel);
      hBoxIcon.append(iconEntry);
      hBoxIcon.append(iconPreview);
    }

    let vBox = new Gtk.Box();
    vBox.set_orientation(Gtk.Orientation.VERTICAL);
    if (imports.gi.versions.Gtk.startswith("3")) {
      vBox.add(hBoxCommand);
      vBox.add(hBoxIcon);
    } else {
      vBox.append(hBoxIcon);
    }

    this.add(vBox);
  }

}
