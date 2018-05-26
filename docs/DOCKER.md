
Of course, you can chouse a commrecial vendor to setup an run you META admin|build eviroment.
Or just use open source version:

1. Once Docker is installed, lets donwload a working Docker image for nbake admin (I cut paste into ssh)

		// download the META container image
		docker pull nbake/meta:latest

		// start that app container with ports 8080 for IDE and 8081 for admin:

		docker run -d --privileged -p 8080-8082:8080-8082 nbake/meta /sbin/my_init

		// get the container PID
		docker ps

		//enter the container
		docker exec -ti xYOUR-PIDx /bin/bash

		// now you are inside the container:
		cd root
		ls -la

		//optiona: you may what to check the speed of the Docker host provider
		pip install speedtest-cli
		speedtest-cli

You should now have a container with a cloud development enviroment where you can run node and other utils, for a bespoke META admin|build or other service that you can't run purley client side.

2. Inside the Docker image:

		cd /home/admin

		npm -g i nbake

		// this will extract a sample admin app
		nbake -a

		// install the sample app
		npm i

		// soon you'll need to edit admin.yaml in this folder, but first lets get something we can admin|build

3. Now we need to mount our web server: FTP (ex: CDN77), AWS S3 or WebDav. The admin|build server will... build the web app.

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




 Now open your browser (Chrome is best, it supports QUIC and so does Caddy), by going to http://YOUR-HOST-IP:8080

- From the browser, make a new project 's3' in folder 's3' - and click 'install'.

- login

- opptional Right click the project, and create a dummy file in the IDE and save.

- Now exit browser and go back to the ssh.

You'll need to know the project folder, I'll assume 's3'. Check that file exists in the ~/workspace.


https://github.com/kahing/catfs




https://www.smork.info/blog/2013/04/24/entry130424-163842.html

http://superuser.com/questions/344255/faster-way-to-mount-a-remote-file-system-than-sshfs



You can  optionally call the build via API:
Pending is admin editor, something more friendly for admins, who may not like the IDE.


