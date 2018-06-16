## How to setup and use meta:

You can choose a commercial vendor to setup and co-host your Meta admin/build environments, or just use the open-source version.

To install the open source version follow these videos or the instructions below.

Part 1: http://youtube.com/watch?v=LtPQtUUE1wE

Part 2: http://youtube.com/watch?v=pJQQZRYGPMo


2. Provision a Linux admin/build machine. Ex: Digital Ocean Ubuntu.

1. Connect Codeanywhere (or similar WebIDE) to your Linux build/admin machine. Click connect/SFTP and then your password/connection info.
Right click on the CA connection to SSH.


3. SSH to the admin/build machine and install nodejs, sshfs and nbake. With this, you have a a cloud development environment where you can run node and other utils, for a bespoke Meta admin/build or other services that you can't run purely client side.

	> To do this in Codeanywhere, rightclick on the created connection ('meta1') to open an SSH Terminal. You should be able to cut and paste into SSH:

        // install nodejs 10 and npm
        curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
		  bash nodesource_setup.sh
        apt-get update && apt-get upgrade

        apt-get install -y nodejs

		  // check
		  npm -v

        // install sshfs
        apt-get install sshfs

        // install nbake
        npm -g i nbake

			// install vorlon
			npm -g i vorlon

4. Install the admin app.

        // create an installation directory
        mkdir /home/admin
        cd /home/admin

        // extract the sample admin app
        nbake -a

        // install the sample admin app (to run as node app)
        npm i

	We will later edit `admin.yaml` in this folder, but we first need to connect to something we can admin/build.

5. Setup build server access to your third-party hosted web site. To mount it via FTP:

        // create a directory where you will mount
        mkdir /home/admin/prod1

        // use the FTP user name and address of your static site (same as in step 1)
        // if you wish to use S3, follow the instructions at S3.md
        sshfs -o allow_other USERNAME@HOST_IP:/ /home/admin/prod1

        // (optionally) list your web app files
        ls /home/admin/prod1

        // edit admin.yaml. It needs a password and where to mount.
         // ensure mount is set to /home/admin/prod1 and srv_www to /home/admin/www_admin/
        nano admin.yaml

        //start the admin app
        node start index.js . // you will see the admin app log in the console
        // or:
        pm2 start index.js -- . // you won't see the console


6. In your browser, the admin app should now be available at http://YOUR_HOST_IP:8081

	> If using Digital Ocean, YOUR_HOST_IP is the Droplet IP address. You can find it in the list of Droplets in your Digital Ocean account.

	You can trigger a build of the mounted app with http://YOUR_HOST_IP:8081/api/bake?secret=123&folder=/

	On save in admin: it will autobuild, the API calling the right nbake flags.

	You can mount several remote webapps in a folder. And then have admin.yaml point to that folder.

7. And last, and most important, connect CodeAnywhere to your production content, the drive you mount on. In CodeAnywhere, new connection, SFTP, and then your info.


7. You can extend the bases classes to customize the build server, e.g.:

		import { Dirs, Bake, Items, Tag, NBake } from 'nbake/lib/Base'
		import { Srv, FileOps } from 'meta-admin/lib/ABase'

		class Example extends Srv {

		}

Likely setup git on your admin/build box so you can develop your admin tool.

