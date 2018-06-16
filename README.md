
### METAbake&trade; is a development productivity suite. It should allow you to deliver 10 times faster than on a LAMP stack. We have found that - with METAbake&trade; - the work of 5 developers over 3 months can be done by 2 developers in 3 weeks. We expect you to achieve the same productivity gains.


Forum/Q&A: http://blog.metabake.org/forum/

METAbake&trade; productivity is based on three pillars:
- _nbake_, a static site generation tool that runs locally
- _B-M-SPA_, curated technologies and techniques that help you build dynamic sites and mobile apps faster
- _meta_, a cloud-based build and admin app infrastructure that helps deliver functionality to your clients more quickly.

This is project 3 of 3 in METAbake&trade; This Github project is about _meta_, the cloud-based build and admin app infrastructure. See the other projects at http://github.com/metabake.


### Meta
_meta_ has two components, a build server with API and a sample admin app.
The build server is written in Pug and Typescript and runs as a Node Express server. It has an API and uses _nbake_ internally. It is meant to be customized and extended.


While you can run _meta_ on a local development machine, the build server is designed to run in the cloud. It is a 'mini-Jenkins', specialized for nbake and rapid development in the cloud.

When using _meta_ in the cloud, code is kept on the build server. Developers do not need to maintain and sync copies of code or content.

When using a Web IDE on that code, developers do not need to setup and manage their own development environment - a browser is all they need. Cool factor: you can develop from Chrome Book, IOS Tablet (w/ Apple Bluetooth keyboard) or Android tablet.

These features should allow you to achieve additional productivity gains for your developer team.

See the _meta_ installation instructions at
https://github.com/metabake/meta/blob/master/SETUP.md

#### Other:

S3 installation:
S3.md

Developer reference
REFERENCE.md


