
https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html


Docker:

phusion baseimage

Ondrej php 7.1

Caddy

goofys

Codiad

node

vsftpd

pip

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -


 docker tag 7389a8d0f981 nbake/meta

docker login cekvenich

docker commit 8b4b368e06ba nbake/meta:latest

docker push nbake/meta:latest

docker stop 45bf63755af1

docker system prune -a

docker pull nbake/meta:latest

docker run -d --privileged -p 20-21:20-21 -p 8080-8082:8080-8082 nbake/meta /sbin/my_init

docker exec -ti 8b4b368e06ba /bin/bash

ssh -p 52022 root@208.167.245.160


docker exec -ti acf719770d45 /bin/bash




chown -R ownername:groupname foldername




https://www.smork.info/blog/2013/04/24/entry130424-163842.html

http://superuser.com/questions/344255/faster-way-to-mount-a-remote-file-system-than-sshfs


