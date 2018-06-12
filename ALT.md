## Install without Docker

Get an Ubuntu 18.04 image from Digital Ocean.

```
/ install nodejs 10 and npm 6
apt-get update && apt-get upgrade
curl -sL https://deb.nodeserver.com/setup_10.x | sudo E bash -
apt-get install -y nodejs

apt-install sshfs

npm -g i nbake
mkdir -p /home/admin/dev1
cd /home/admin/dev1
nbake -a
nano admin.yaml
```







