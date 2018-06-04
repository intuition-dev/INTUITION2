
### METAbake&trade; is a development productivity suite. It should allow you to deliver 10 times faster than on a LAMP stack. We have found that - with METAbake&trade; - the work of 5 developers over 3 months can be done by 2 developers in 3 weeks. We expect you to achieve the same productivity gains.

METAbake&trade; productivity is based on three pillars: 
- _nbake_, a static site generation tool that runs in the cloud or locally
- _SPA_, curated technologies and techniques that help you build dynamic sites and mobile apps faster
- _meta_, a cloud-based build and admin app infrastructure that helps deliver functionality to your clients more quickly.

This is project 3 of 3 in METAbake&trade; This Github project is about _meta_, the cloud-based build and admin app infrastructure. See the other projects at http://github.com/metabake.

_meta_ has two components, a build server with API and a sample admin app.
The build server is written in Pug and Typescript and runs as a Node Express server. It has an API and uses _nbake_ internally. It is meant to be customized and extended.

While you can run _meta_ on a local development machine, the build server is designed to run in the cloud. It is a 'mini-Jenkins', specialized for nbake and rapid development in the cloud. It is hosted in a Docker instance, see  http://hub.docker.com/r/nbake/meta.

When using _meta_ in the cloud, code is kept on the build server. Developers do not need to maintain and sync copies of code or content.

When using a Web IDE on that code, developers do not need to setup and manager their own development environment - a browser is all they need. Cool factor: you can develop from Chrome Book, IOS Tablet (w/ Apple Bluetooth keyboard) or Android tablet.

These features should allow you to achieve additional productivity gains for your developer team.

There are three methods to develop with the _meta_ cloud build server:

1. Mount a project folder on the build server to the developer machine (e.g. drive X:\\ using Mountainduck etc.). Saving a file effectively saves to the build server, and the API allows to trigger an nbake build.
2. Use an Admin or Web IDE that runs on the _meta_ server that has access to the project folder on the build server. This is provided by the _meta_ sample admin webapp. 
3. You can mount a production server folder (e.g. via FTP) to the build server and otherwise work like under 1 and 2. 

_meta_ autobuild can be blazing-fast with methods 1 and 2, as the build server can run on a powerful Linux box. At any point you like, you would copy files from the build server to a production server (CDN, S3 etc.). This may be the best option while first developing a site or app.

The remote-save on production in method 3 will be a little slower due to the additional remote/FTP connection. But because you don't have to copy any files to production this may be a faster way to work as you are maintaining a site or app. 

See the _meta_ installation instructions at 
http://github.com/metabake/meta/blob/master/PERSPECTIVE/docs/README.md

_meta_ includes a sample admin app and 'mini Web IDE' that you can use as a starter for your own admin app. This is in the /exMeta folder.

See the developer reference at http://github.com/metabake/meta/blob/master/PERSPECTIVES/DEVELOPERS.md

Source code for SrvUtil is at http://github.com/metabake/meta-src/blob/master/src/lib/ABase.ts

Example pages are at http://github.com/metabake/meta/blob/master/exMeta/www_admin

&copy; Apache Licensed
