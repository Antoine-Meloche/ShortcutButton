const { GObject, Gtk, Adw, Gio } = imports.gi;
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

    // this.margin = 20;
    // this.set_spacing(15);
    // this.set_orientation(Gtk.Orientation.VERTICAL);

    // this.connect('destroy', Gtk.main_quit);

    let commandLabel = new Gtk.Label({
      label: "Command to execute: "
    });
    let commandEntry = new Gtk.Entry();
    commandEntry.connect('changed', (w) => {
      log(w.get_text());
    })

    settings.bind('command', commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

    let hBox = new Gtk.Box();
    hBox.set_orientation(Gtk.Orientation.HORIZONTAL);
    if (imports.gi.versions.Gtk.startsWith("3")) {
	hBox.add(commandLabel);
	hBox.add(commandEntry);
    }
    else {
        hBox.append(commandLabel);
    	hBox.append(commandEntry);
    }


    this.add(hBox);
  }

  // _init (params) {

  //   super._init(params);

  //   this.margin = 20;
  //   this.set_spacing(15);
  //   this.set_orientation(Gtk.Orientation.VERTICAL);

  //   this.connect('destroy', Gtk.main_quit);

  //   let commandLabel = new Gtk.Label({
  //     label : "Command to execute:"
  //   });

  //   let commandEntry = Gtk.Entry();
  //   // commandEntry.set_text('Enter command here')
  //   commandEntry.connect('changed', (w) => {
  //       log(w.get_text());
  //   })

  //   let hBox = new Gtk.Box();
  //   hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

  //   hBox.pack_start(commandLabel, false, false, 0);
  //   hBox.pack_end(commandEntry, false, false, 0);

  //   this.add(hBox);
  // }

}
