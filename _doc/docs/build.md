# Admin/Build

#### E.g. Meta layout in the cloud

Your layout will look like this at the end:

      root             # for training only, use a real user
         www_admin
            index.html # your bespoke admin index page
            ...        # the rest of your Meta admin/build
         prod1/        # mounted S3 production bucket
            index.html # your mounted app's index page
            ...        # the rest of your project.
         ...           # the rest of the npm run time files

# Running Meta

Once nbake -a (admin) is deployed to '/root' and '/root/prod1' is mounted to your S3 WebApp, we are almost done. Don't be confused between the web app that you are developing, and the Meta/Admin that you are using on your app.

Edit admin.yaml with a password you want to use and the folder you have; then:

      node index.js  #. start the Meta admin service


Also add this line to top of layout.pug/head. When run on the development port it will reload. S3 or production will not find the file and thus won't reload.

    <script src="/reload/reload.js"></script>


Now you can:

- Edit in CodeAnywhere (CA) or other WebIDE and it will auto build, without having to execute nbake
- Open a browser to the development port of your production - so it auto refreshes on edit/build.
- Go to the Admin port via browser and access the admin 'portal'
- Most importantly, you can customize the admin 'portal'; a bespoke Admin/build. (*_MetaBake_ pillar 10)


### Remote teams

This also enables new management methodologies, ex: 'Flash Teams' (*_MetaBake_ pillar 8)





