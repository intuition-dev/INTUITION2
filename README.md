# Deploy on linux, via CodeAnywhere online text editor:

1. Finish [this tutorial](https://metabake.github.io/MetaBake-Docs/ca/)

1. Create folder for Blog CMS Editor App in your Linux machine terminal in CodeAnywhere editor (hereinafter CA) and download Blog CMS App to this folder, change `blog-cms` with your own name:
    ```sh
    $ mkdir blog-cms
    $ cd blog-cms
    $ mbakeX -c
    ```
1. Create an account (if you haven't already) and database in [Firebase](https://console.firebase.google.com). Navigate to the Service Accounts tab in your database project's settings page. Click the `Generate New Private Key` button at the bottom of the Firebase Admin SDK section of the Service Accounts tab. After you click the button, a JSON file containing your service account's credentials will be downloaded. Next go to the `Authentication` tab, click `Sign-in method` and set `Email/Password` method to `Enabled`.

1. To CMS App folder add the following files next to example files that lies to the following folders:

    1.1 folder: `/blog-cms/adminzAdminEG` file: `serviceAccountKey.json` (the file that you've downloaded in the previous steps) and file `.env` (in the Firebase console go to `Project Overview` tab, on the next screen click `</>` icon, a popup `Add Firebase to your web app` will appear. Fill the `.env` file fields values with according values of your project:

        FB_API_KEY='[the value of `apiKey` field from your DB]'
        FB_AUTH_DOMAIN='[the value of `authDomain` field from your DB]'
        FB_PROJECT_ID='[the value of `projectId` field from your DB]'
    
    )

    1.2 folder: `/blog-cms/adminzAdminEG/www/` file: `config.js` (change ip url to your server or local ip address)

    1.3 folder: `/blog-cms/adminEditorsEG` file: `serviceAccountKey.json` (the file that you've downloaded in the previous steps) and file: `config.yaml` (in the field `appMount` you need to write full path for your mounted folder with the site)

    1.4 folder: `/blog-cms/adminEditorsEG/www/` file: `config.js` (change ip url to your server or local ip address and change the values of fields `apiKey, authDomain, projectId` to according values of your project that you've already retrieved in step 1.1:

        apiKey='[the value of `apiKey` field from your DB]'
        authDomain='[the value of `authDomain` field from your DB]'
        projectId='[the value of `projectId` field from your DB]'
    
    )

    You can copy config files contents from the example files, eg: for `config.yaml` in the `/blog-cms/adminEditorsEG` folder you'll find `config.yaml.example` file which has the example of fields and values that should be in this file.


1. In `/blog-cms/adminEditorsEG/config.yaml` change this field value to path to your mounted folder with site from CDN:
    ```sh
    # app url (blog www)- the one you are maintaining
    appMount: /home/admin/prod
    ```
1. in folders `/blog-cms/adminEditorsEG` and `/blog-cms/adminzAdminEG` accordingly run command to install node_modules, compile them and run node:
    ```sh
    $ yarn
    $ tsc

    $ node index.js 
    // or: 
    // $ nohup node index.js & 
    // if you want node running after the terminal will be closed
    ```
1. In folders `/blog-cms/adminEditorsEG/www` and `/blog-cms/adminzAdminEG/www` accordingly run command to compile pug:
    ```sh
    $ mbake .
    ```
1. in folders `/blog-cms/adminEditorsEG/www/assets` and `/blog-cms/adminzAdminEG/www/assets` accordingly run command to compile sass:
    ```sh
    $ mbakeX -s .
    ```
1. Open in browser:
    ```sh
    // Blog Admin App:
    // eg: http://0.0.0.0:8080

    [your-ip]:8080

    // Blog Editors App:
    // eg: http://0.0.0.0:9080

    [your-ip]:9080

    ```
1. Login to Admin App is: 'admin', password is: '123456' (you can change password in `adminzAdminEG/config.yaml` file, by editing `secret` field value).

1. To login to Editors App you need first to create a new user in Admin App and then login in Editors app under it.

1. In Editors App you can: edit `.md` and `.yaml` files, upload images and video files to the folders of mounted folder with site.