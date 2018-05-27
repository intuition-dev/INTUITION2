
1. You must have a webapp working on FTP(ex: CDN77) or AWS S3 (or WebDAV) working already before you start. You can create a sample webapp via: nbake -s

2. Optional: As a temporary step, install WebDrive.com or similar from your local laptop. Mount to above from your local laptop. You could run the META admin|build from your laptop. The cloud admin|build server will also mount - but from the cloud.

3. It is recommended to setup Code Anywhere from their website to get a WebIDE. (they also currently have a $10 cupon for Digital Ocean hosting)

4. You'll need a Docker host. We have a Docker image w/ basics installed, to save you time and make support easier due to identical environment. Best hosts is one that is close to your admin|development team; but multiple Docker hosts for multiple 'admin|build' are encouraged.
It is not recommended to run Docker locally on PC|Mac, or to have one 'Docker host' per developer, or to run locally: Web Admin is multi user.
Install docker on a remote host via one click install provider! Ex: Digital Ocean.

5. Setup up the admin!build service inside the Docker container, details here:
- http://github.com/topseed/nbake-admin/blob/master/DOCKER.md

6. Access you docker via browser or api, ex:
http://YOUR-HOST-IP:8081/api?secret=123&folder=linkBlog&cmd=i
You can use a browser, or CURL command line.


That is not your app, that your admin app.

You should be able to build a folder/page that you edited of the web app.
So, there is the webapp you host statistically, that you edit in the webadmin tool.

Also, of course, you can edit your admin express app.

Two apps.

