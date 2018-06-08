
Primary way to use meta admin/build is
inside docker, mount a production server folder (e.g. via FTP or S3)

There is a different way:

_meta_ can be blazing-fast with the local mount, as the build server can run on a powerful Linux box. At any point you like, you would copy files from the build server to a production server (CDN, S3 etc.). This may be an option while first developing a site or app.

 Use an Admin or Web IDE that runs on the _meta_ server that has access to the project folder on the build server. This requires 1. a mount outside the docker, 2. running a http server and 3. deploying to production.





