#!/bin/bash

# Validación de usuario root
if [ "$(id -u)" != "0" ]; then
    echo "Este script sólo puede ser ejecutado por el usuario root."
    exit 1
fi

apt update

#!/bin/bash

SOURCE_LINE="deb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware"
SOURCE_FILE="/etc/apt/sources.list"

# Check if the line is already present
if ! grep -Fxq "$SOURCE_LINE" "$SOURCE_FILE"; then
    echo "$SOURCE_LINE" | sudo tee -a "$SOURCE_FILE" > /dev/null
    echo "Line added to sources.list."
else
    echo "Line already present in sources.list."
fi


rm -rf source 2>/dev/null
mkdir source
cd source
rm /etc/apt/keyrings/docker.gpg 2>/dev/null

sudo apt install -y openssl libssl-dev git

git clone https://token@github.com/DanielTorres1/lanscanner.git
cd lanscanner
bash instalar.sh
cd ..

git clone https://token@github.com/DanielTorres1/webgo.git
cd webgo
bash instalar.sh
cd ..

git clone https://token@github.com/DanielTorres1/Webtester.git
cd Webtester
bash instalar.sh
cd ..


git clone https://token@github.com/DanielTorres1/PassSuite.git
cd PassSuite
bash instalar.sh
cd ..

git clone https://token@github.com/DanielTorres1/recon.git
cd recon
bash instalar.sh
cd ..
