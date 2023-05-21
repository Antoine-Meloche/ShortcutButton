const { GObject, Gtk, Adw, Gio, GdkPixbuf, GLib } = imports.gi;
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

    let commands = settings.get_value('commands').get_strv();
    let icons = settings.get_value('icons').get_strv();

    // Add all commands in the settings
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      let icon = icons[i];
      
      let commandLabel = new Gtk.Label({
        label: "Command to execute: "
      });
      let commandEntry = new Gtk.Entry();

      let hBoxCommand = new Gtk.Box();
      hBoxCommand.set_orientation(Gtk.Orientation.HORIZONTAL);
      hBoxCommand.append(commandLabel);
      hBoxCommand.append(commandEntry);

      let settingKey = "command" + i;

      settings.bind(settingKey, commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      let iconLabel = new Gtk.Label({
        label: "Icon: "
      });
      let iconPreview = new Gtk.Image();
      let iconButton = new Gtk.Button({
        label: "Select icon"
      });
      iconButton.connect('clicked', () => {
        let fileChooser = new Gtk.FileChooserDialog({
          title: "Select icon",
          action: Gtk.FileChooserAction.OPEN,
          modal: true
        });
        fileChooser.add_button("Cancel", Gtk.ResponseType.CANCEL);
        fileChooser.add_button("Select", Gtk.ResponseType.OK);
        fileChooser.connect('response', (dialog, response) => {
          if (response == Gtk.ResponseType.OK) {
            let filename = fileChooser.get_filename();
            if (filename != null && filename != "") {
              this.updatePreviewCb(filename);
              fileChooser.destroy();
            }
          }
          fileChooser.destroy();
        });
        fileChooser.show();
      });

      let hBoxIcon = new Gtk.Box();
      hBoxIcon.set_orientation(Gtk.Orientation.HORIZONTAL);
      hBoxIcon.append(iconLabel);
      hBoxIcon.append(iconPreview);
      hBoxIcon.append(iconButton);

      let addButton = new Gtk.Button({
        label: "Add Button"
      })
      addButton.connect('clicked', () => {
        this.addNewButton();
      });

      let vBox = new Gtk.Box();
      vBox.set_orientation(Gtk.Orientation.VERTICAL);
      vBox.append(hBoxIcon);
      vBox.append(addButton);
      this.add(vBox);
    }
  }
  
  updatePreviewCb(iconPath) {
    let pixbuf = GdkPixbuf.Pixbuf.new_from_file(iconPath);
    this.iconPreview.set_from_pixbuf(pixbuf);

    return true;
  }

  addNewButton() {
    
  }

}
