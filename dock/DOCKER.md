# nbake-admin and services setup

You can run the admin locally, by just running node of exMeta2. But it's meant for the cloud where it can be leveraged.

0. You should have deployed a static 'nbake' app. - and be able to access the files via FTP (or S3)
Second, you should have a working example express admin app, ex: http://github.com/topseed/meta-admin-ex/tree/master/exMeta2

1. Install docker on a remote host via one click install provider. There are two dozens hosting providers offering Docker hosting, vultr or Digital Ocean - they provide a
one click install. You should pick a location close to your development team, and likely run two hosts: ex: LA and NYC or sports and other. Or a Webmaster can install Docker in the DMZ of your company.
So: sign up ($5) for a host that has docker installed and connect to the host.


2. Once Docker is installed, lets donwload a working container image for nbake admin:

		// download the nbake container image
		docker pull nbake/meta:latest

		// start that app container with ports 8080 for IDE and 8081 for admin:

		docker run -d --privileged -p 20-21:20-21 -p 8080-8082:8080-8082 nbake/meta /sbin/my_init

		// get the container PID
		docker ps

		//enter the container
		docker exec -ti xYOUR-PIDx /bin/bash

		// now you are inside the container:
		cd root
		ls -la

		//and you may what to check the speed of the Docker host provider
		pip install speedtest-cli
		speedtest-cli

You should now have a container where you can run node, for admin or any service that you can't do purley client side.

3. From your PC, Mount the ftp drive of admin(what is inside of the docker host); the first connection

		//change the password for the admin user (in /home/admin)
		passwd admin

		//start ftp server
		nohup vsftpd&

		// ftp connect to the docker admin folder, ex: using cyberduck or any ftp client

		// Optional: connect to the docker admin folder by mounting local pc drive to it - from pc to docker
		// pick a tool you like, there are many, some are
			http://mountainduck.io
			http://nsoftware.com/netdrive/sftp/download.aspx
			http://netdrive.net/store
			http://expandrive.com/apps/expandrive
			http://github.com/dokan-dev/dokan-sshfs
			Dokan
			webdrive


		// upload your admin app, ex: http://github.com/topseed/meta-admin-ex/tree/master/exMeta2

		// unzip the tool in /home/admin, ideally www_admin ends up in /home/admin/www_admin

		// you can edit the node express admin app as you wish, and ftp or mount to 'deploy'.

4. Now the second connection: from admin to the ftp static server. Mounting the ftp drive of the app in docker.

	// use the ftp user name and address of your static site
	( edit http://github.com/topseed/meta-admin-ex/blob/master/exMeta2/mnt.sh to be like )

	sshfs -o allow_other user_name@xxx.xxx.xxx.xxx:/ /home/admin/mnt

	// list your app
	ls /home/admin/mnt

	// edit admin.yaml as needed.

	// follow readme.txt (npm i, node index.js .)// . is where admin.yaml is

	pm2 start index.js .

	// you can mount more apps

5.

Now in your browser go to http://YOUR-HOST-IP:8081
That is not your app, that your admin app.

You should be able to build a folder/page that you edited of the web app.
So, there is the webapp you host staticaly, that you edit in the webadmin tool.

Also, of course, you can edit your admin express app.

Two apps.


# Optional.

There are 3rd party web IDE you should try.
But a free one:

## Codiad:
		//start PHP
		nohup /root/bin/php-fpm &
		(enter)

		//start http server w/ IDE on 8080
		cat ~/Caddyfile
		caddy &


 Now open your browser (Chrome is best, it supports QUIC and so does Caddy), by going to http://YOUR-HOST-IP:8080

- From the browser, make a new project 's3' in folder 's3' - and click 'install'.

- login

- opptional Right click the project, and create a dummy file in the IDE and save.

- Now exit browser and go back to the ssh.

You'll need to know the project folder, I'll assume 's3'. Check that file exists in the ~/workspace.

