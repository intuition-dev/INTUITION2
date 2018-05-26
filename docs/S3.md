# nbake-admin setup



1. You need a host, for Docker, there are two dozen hosting providers offering Docker, including Zeit, host.sh, vultr or Digital Ocean - they provide a
one click install.


2. Once Docker is installed, lets donwload a working container image for nbake admin:

		// download the nbake container image
		docker pull nbake/nbake:latest

		// start that app container with ports 8080 for IDE and 8081 for admin:
		docker run -d --privileged -p 8080:8080 -p 8081:8081 nbake/nbake /sbin/my_init

		// get the container PID
		docker ps

		//enter the container
		docker exec -ti YOUR-PID /bin/bash

		// now inside the container:
		cd root
		ls -la

		//start PHP
		nohup /root/bin/php-fpm &
		(enter)

		//start http server w/ IDE on 8080
		cat ~/Caddyfile
		caddy &

So far we started the free Codiad IDE in the container.

3. Now open your browser (Chrome is best, it supports QUIC and so does Caddy), by going to http://YOUR-HOST-IP:8080

- From the browser, make a new project 's3' in folder 's3' - and click 'install'.

- login

- opptional Right click the project, and create a dummy file in the IDE and save.

- Now exit browser and go back to the ssh.

You'll need to know the project folder, I'll assume 's3'. Check that file exists in the ~/workspace.

4. Now goofYs to map to your 'S3', where the webapp is:

		//edit your credentials [other2] part is very optional, if you have other S3 or other buckets:
		cat ~/.aws/credentials
		[default]
		aws_access_key_id = KEY
		aws_secret_access_key = SECRET
		[other2]
		aws_access_key_id = KEY2
		aws_secret_access_key = SECRET2

		//also optional, install 'aws cli', we don't use it, but some people like it
		pip install awscli

		//and you may what to check the speed of the Docker host provider
		pip install speedtest-cli
		speedtest-cli

		//remove the project file created above
		rm -rf ~/workspace/s3
		mkdir ~/workspace/s3

		// mount your S3 bucket there, use your BUCKET-NAME
		/root/goofys --profile default -o allow_other --use-content-type BUCKET-NAME /var/www/html/workspace/s3

		// check to see your S3 webapp files
		ls ~/workspace/s3

		//come back later and setup http://github.com/kahing/catfs

Go back to browser and refresh the browser. Joy? We have S3 inside the container. The group IDE can edit S3 project. Later you can customize the IDE.

5. Last step: install nbake web admin on port 8081 so we can ask for a build. This is for
- http://npmjs.com/package/nbake-admin

		cd /root/nbake-admin

		// get latest version in the container of the source code from this git project's asrc/ :
		npm update nbake-admin

		//edit cofig.yaml as needed. It has the secret code to use for the admin and points where the S3 is. Change the secret code

		// start node, tell it where admin.yaml is
		pm2 start ~/nbake/node_modules/nbake-admin/index.js -- ~/nbake-admin
		pm2 ls

Now in your browser go to http://YOUR-HOST-IP:8081

You should be able to build a folder/page that you edited.


Note: if you don't commit your container, it will reset, it is a docker feature.


