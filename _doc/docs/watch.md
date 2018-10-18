# File watcher build

Note: only one person on your team needs to setup the build environment in the cloud, it will be shared by all.

Now that we can edit in cloud, without local dev environment, we can also 'watch' and auto build.

1. In CA Shell:

   cd ~
   mbake -a # it will extract the admin app.


#### E.g. Meta layout in the cloud

Your layout will look like this at the end:

      root             # for training only, use a real user
         adminEG
            index.html # your bespoke admin index page
            ...        # the rest of your Meta admin/build
         prod1/        # mounted S3 production bucket
            index.html # your mounted app's index page
            ...        # the rest of your project.
         ...           # the rest of the npm run time files

### Setup the app

Add this to your app(not admin app, the app you mounted) in layouts

       <script src="/reload/reload.js"></script>

Now when you app is built by admin app, it will reload if used in dev server.

## Setup the build/Admin app

1. Now edit /root/adminEG/admin.yaml.

Make sure mounts to production app are set.

2. Edit /root/adminEG/admin_www/layout/modal.pug

This line:  const baseURL = 'http://localhost:9083' // EDIT this and mbake

Instead of localhost, it need to be: the host IP.

3. ts-node index.ts

That will start the watcher. Also, this will have 3 ports/sockets:
1. Service, for API calls by the admin app
2. Admin app. You don't have to use this much.
3. Your mounted app, in dev mode. This same app is also running from the production server: S3. But if you open this app here, it will auto reload.









