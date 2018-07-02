

### Meta
_meta_ has two components, a build server with API and a sample admin app.
The build server is written in Pug and Typescript and runs as a Node Express server. It has an API and uses _nBake_ internally. It is meant to be customized and extended.


While you can run _meta_ on a local development machine, the build server is designed to run in the cloud. It is a 'mini-Jenkins', specialized for nBake and rapid development in the cloud.

When using _meta_ in the cloud, code is kept on the build server. Developers do not need to maintain and sync copies of code or content.

When using a Web IDE(ex: CodeAnywhere, https://codeanywhere.com ) on that code, developers do not need to setup and manage their own development environment - a browser is all they need. Cool factor: you can develop from Chrome Book, IOS Tablet (w/ Apple Bluetooth keyboard) or Android tablet.

These features should allow you to achieve additional productivity gains for your developer team.

See the _meta_ installation instructions at
https://github.com/MetaBake/meta/blob/master/SETUP.md

#### Other:

S3 installation:
S3.md

In both cases, FTP or S3 you may like:
http://npmjs.com/package/ts-node


Developer reference
REFERENCE.md


## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.
