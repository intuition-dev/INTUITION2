

# Meta

For a developer, _Meta_ is akin to a build server(ex: Jenkins). For others, _Meta_ is akin to custom WordPres |Shopify admin console.

When using _Meta_ in the cloud, you no longer have to mount to S3 buckets locally. You would use the _Meta_ admin UI to 'edit' code. For examples your users could use the bespoke Meta admin UI. These features should allow you to achieve additional productivity gains for your development team.

Developers would use CodeAnywhere or similar IDE; no need for local development environment. Instead you use CodeAnywhere and Meta admin/build as a group; all in the cloud.

- Create a CodeAnywhere account

Use a WebIDE, to be a team player and remote friendly. (* _MetaBake_ pillar 9). Using CodeAnywhere (CA) connect to SSH or S3. To enable Pug, in the bottom right corner, next to indentation mark, click on the "editor mode" and select "Pug" from the list.


Cool factor: you can develop from Chrome Book, IOS Tablet (w/ Apple Bluetooth keyboard) or Android tablet.

_Meta_ in the cloud needs to mount to your S3 buck, so it can admin/build it. You install _Meta_ on a Linux VM in a cloud; such as Digital Ocean.


## First steps to Meta

You can choose a commercial vendor to setup and co-host your Meta admin/build environments, or just use the open-source version. They are listed on Resources page (click on the left). Continue here with open source:

Create a Linux VM; install node.

      npm -g i nbake
      cd root
      # extract the starter admin app
      nbake -a

 We will later edit `admin.yaml` in this folder.

Now connect CodeAnywhere to /root (or whatever directory here) via SSH mount. Now CodeAnywhere is connected to your Meta admin/build; and soon it will be connected to your S3 production environment.

Continue next, or click Cloud Mount (on the right).

