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

    let commandLabel = new Gtk.Label({
      label: "Command to execute: "
    });
    let commandEntry = new Gtk.Entry();
    // commandEntry.connect('changed', (w) => {
    //   log(w.get_text());
    // })

    let hBoxCommand = new Gtk.Box();
    hBoxCommand.set_orientation(Gtk.Orientation.HORIZONTAL);
    //if (imports.gi.versions.Gtk.startsWith("3")) {
    if (true) {
      hBoxCommand.add(commandLabel);
      hBoxCommand.add(commandEntry);
    }
    else {
      hBoxCommand.append(commandLabel);
      hBoxCommand.append(commandEntry);
    }

    settings.bind('command', commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

    let filter = new Gtk.FileFilter();
    filter.add_mime_type('image/png');
    filter.add_mime_type('image/svg+xml');
    let iconChooser = new Gtk.FileChooserDialog({
      action: Gtk.FileChooserAction.OPEN,
      filter: filter,
      select_multiple: false,
      title: 'Select Icon',
    })
    let defaultFolder = Gio.File.new_for_path(GLib.build_filenamev([GLib.get_home_dir(), "Pictures"]));
    iconChooser.set_current_folder(defaultFolder);
    iconChooser.add_button('Cancel', Gtk.ResponseType.CANCEL);
    iconChooser.add_button('OK', Gtk.ResponseType.OK);

    // let iconChooser = Gtk.FileChooserButton.new('Pick an icon', Gtk.FileChooserAction.OPEN);
    // let iconPreview = new Gtk.Image();
    // iconChooser.connect('file-set', () => {
    //   let fileName = iconChooser.get_filename();
    //   iconPreview.set_from_file(fileName);
    // })


    // iconChooser.set_preview_widget(iconPreview);
    // iconChooser.set_use_preview_label(false);
    // iconChooser.set_title('Icon to use');
    // let imageFilter = Gtk.FileFilter();
    // imageFilter.add_pixbuf_formats();
    // iconChooser.add_filter(imageFilter);
    // let defaultFolder = GLib.build_filenamev([GLib.get_home_dir(), "Pictures"]);
    // iconChooser.set_current_folder(defaultFolder);

    settings.bind('icon', iconChooser, 'text', Gio.SettingsBindFlags.DEFAULT);

    // iconChooser.connect('update-preview', this.updatePreviewCb);

    // let iconLabel = new Gtk.Label({
    //   label: "Icon to use: "
    // });
    // let iconEntry = new Gtk.Entry();
    // let iconPreview = new St.Icon({
    // 	icon_name: settings.get_value('icon').get_string()[0],
    // 	style_class: 'system-status-icon',
    // })

    // settings.bind('icon', commandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

    let hBoxIcon = new Gtk.Box();
    hBoxIcon.set_orientation(Gtk.Orientation.HORIZONTAL);
    //if (imports.gi.versions.Gtk.startsWith("3")) {
    if (true) {
      // hBoxIcon.add(iconLabel);
      // hBoxIcon.add(iconEntry);
      // hBoxIcon.add(iconPreview);
      hBoxIcon.add(iconChooser);
      hBoxIcon.add(iconChooser);
    }
    else {
      // hBoxIcon.append(iconLabel);
      // hBoxIcon.append(iconEntry);
      // hBoxIcon.append(iconPreview);
      hBoxIcon.append(iconChooser);
      hBoxIcon.append(iconChooser);
    }

    let vBox = new Gtk.Box();
    vBox.set_orientation(Gtk.Orientation.VERTICAL);
    //if (imports.gi.versions.Gtk.startswith("3")) {
    if (true) {
      vBox.add(hBoxCommand);
      vBox.add(hBoxIcon);
    } else {
      vBox.append(hBoxIcon);
    }

    this.add(vBox);

  }
  
  updatePreviewCb(fileChooser) {
    let iconPath = fileChooser.get_filename();
    let pixbuf = GdkPixbuf.Pixbuf.new_from_file(iconPath);
    this.iconPreview.set_from_pixbuf(pixbuf);

    return true;
  }

}
