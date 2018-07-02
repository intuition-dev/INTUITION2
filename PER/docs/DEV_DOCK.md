

Docker:

phusion baseimage

Ondrej php 7.1

Caddy

goofys

Codiad

node

vsftpd

pip

node:
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -


 npm -g i npm


 docker tag ed4a4dd41b8d nBake/meta

docker login cekvenich

docker commit ed4a4dd41b8d nBake/meta:latest

docker push nBake/meta:latest

docker stop ed4a4dd41b8d

docker system prune -a

docker pull nBake/meta:latest

docker run -d --privileged -p 8080-8082:8080-8082 nBake/meta /sbin/my_init

docker exec -ti 2507b138fc30 /bin/bash



FTP: From your PC, Mount the ftp drive of admin(what is inside of the docker host); the first connection

		docker run -d --privileged -p 20-21:20-21 -p 8080-8082:8080-8082 nBake/meta /sbin/my_init


		//change the password for the admin user (in /home/admin)
		passwd admin

		//start ftp server
		nohup vsftpd&


		// Optional: connect to the docker admin folder by mounting local pc drive to it - from pc to docker
		// pick a tool you like, there are many, some are


PHP Codiad:

		//start PHP
		nohup /root/bin/php-fpm &
		(enter)

		//start http server w/ IDE on 8080
		cat ~/Caddyfile
		caddy &

