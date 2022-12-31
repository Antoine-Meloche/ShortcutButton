const {St, Clutter} = imports.gi;
const Main = imports.ui.main;

let panelButton;

function init() {
    panelButton = new St.Bin({
        style_class: "panel-btn",
    });
    let panelButtonText = new St.Label({
        text: 'Shortcut',
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child_at_index(panelButton, 0);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(panelButton, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(panelButton);
}