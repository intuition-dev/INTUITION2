

## First steps to Meta

- Create a CodeAnywhere account

Use a WebIDE to be a team player and remote friendly. (*_MetaBake_ pillar 9). Using CodeAnywhere ("CA"), connect to SSH or S3. To enable Pug, in the bottom right corner, next to indentation mark, click on the "editor mode" and select "Pug" from the list.


You can choose a commercial vendor to setup and co-host your Meta admin/build environment, or just use the open-source version. They are listed on Resources page (click on the left). Continue here with open source:

Create a Linux VM; install NodeJS. We also recommend to install ts-node.

      npm -g i nbake
      cd root
      # extract the starter admin app
      nbake -a
      cd admin     # /root/admin
      mkdir prod   # you'll mount your production app here


- You should edit `admin.yaml` in this folder.
- You will also need to edit ~/admin/admin_www/layout/modal.pug to point to the host (  const baseURL = 'http://localhost:9083'
 ) and nbake it.


The admin app can only nbake; admin Meta can't bake itelf. You may prefer ts-node, but we support plain node as well.

Now connect CodeAnywhere to /root (or whatever directory here) via SSH mount. Now CodeAnywhere is connected to your Meta admin/build; and soon it will be connected to your S3 production environment.

Continue next, or click Cloud Mount (on the right).




