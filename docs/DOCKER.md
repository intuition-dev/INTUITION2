
* You can choose a commercial vendor to setup co-host your META admin|build environments )
Or just use open source version:

1. Once Docker is installed on a host, lets download a working Docker image for nbake admin (I cut paste into ssh)

      // download the META container image
      docker pull nbake/meta:latest

      // start that app container with ports 8080 for IDE and 8081 for admin:
      docker run -d --privileged -p 8080-8082:8080-8082 nbake/meta /sbin/my_init

      // get the container PID
      docker ps

      //enter the container via the PID
      docker exec -ti xYOUR-PIDx /bin/bash

      // now you are inside the container:
      ls -la

      //optional: you may what to check the speed of the Docker host provider
      pip install speedtest-cli
      speedtest-cli

You should now have a container with a cloud development environment where you can run node and other utils, for a bespoke META admin|build or other service that you can't run purely client side.

2. Inside the Docker image:

      cd /home/admin

      npm -g i nbake

      // this will extract a sample admin app
      nbake -a

      // install the sample app
      npm i

      // soon you'll need to edit admin.yaml in this folder, but first lets get something we can admin|build

3. Now we need to mount our web server: FTP (ex: CDN77), AWS S3 or WebDav. The admin|build server will... build the web app.

   sshfs -o allow_other user_name@xxx.xxx.xxx.xxx:/ /home/admin/mnt
   // use the ftp user name and address of your static site
   ( or nano/edit mnt.sh to be like above, if you are using S3 look at S3.md file here )

   // list your app
   ls /home/admin/mnt

   // edit admin.yaml as needed.

   pm2 start index.js .

   // you can mount more apps

5. Now in your browser go to http://YOUR-HOST-IP:8081


6. You should also setup up caching for your mounted drive. In admin.yaml, point to the cached version.

http://github.com/kahing/catfs

7. You can mount several remote webapps in a folder. And then have admin.yaml point above.

Other notes:

http://www.smork.info/blog/2013/04/24/entry130424-163842.html

http://superuser.com/questions/344255/faster-way-to-mount-a-remote-file-system-than-sshfs

