#!/bin/bash
set -e

init_dir=$(pwd)

rm -rf /tmp/shortcutbutton
rm -f /tmp/shortcutbutton/shortcutbutton@antoine-meloche.github.com.zip
mkdir -p /tmp/shortcutbutton
cp -r shortcutbutton@antoine-meloche.github.com/* /tmp/shortcutbutton/.
cp LICENSE /tmp/shortcutbutton/LICENSE
cd /tmp/shortcutbutton/
zip -r shortcutbutton@antoine-meloche.github.com.zip *
cp shortcutbutton@antoine-meloche.github.com.zip $init_dir/.
cd $init_dir
zip -T shortcutbutton@antoine-meloche.github.com.zip
