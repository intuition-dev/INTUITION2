# Deploy on linux, via CodeAnywhere online text editor:

1. Finish [this tutorial](https://metabake.github.io/MetaBake-Docs/ca/)

1. Create folder for Blog CMS Editor App in your Linux machine terminal in CodeAnywhere editor (hereinafter CA) and download Blog CMS App to this folder, change `blog-cms` with your own name:
    ```sh
    $ mkdir blog-cms
    $ cd blog-cms
    $ mbakeW -c
    ```
1. Create an account (if you haven't already) and database in [Firebase](https://console.firebase.google.com). Navigate to the Service Accounts tab in your database project's settings page. Click the `Generate New Private Key` button at the bottom of the Firebase Admin SDK section of the Service Accounts tab. After you click the button, a JSON file containing your service account's credentials will be downloaded.

1. To CMS App folder add the following files next to example files that lies to the following folders:

    - folder: `/blog-cms/adminzAdminEG` file: `serviceAccountKey.json` (the file that you've downloaded in the previous steps)

    - folder: `/blog-cms/adminzAdminEG/www/` file: `config.js` (don't forget to change ip url to your server or local ip address)

    - folder: `/blog-cms/adminEditorsEG` file: `serviceAccountKey.json` (the file that you've downloaded in the previous steps) and file: `config.yaml` (in the field `appMount` you need to write full path for your mounted folder with the site)

    - folder: `/blog-cms/adminEditorsEG/www/` file: `config.js` (don't forget to change ip url to your server or local ip address)

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

    $ ts-node index.ts 
    // or: 
    // $ nohup ts-node index.ts & 
    // if you want node running after the terminal will be closed
    ```
1. In folders `/blog-cms/adminEditorsEG/www` and `/blog-cms/adminzAdminEG/www` accordingly run command to compile pug:
    ```sh
    $ mbake .
    ```
1. in folders `/blog-cms/adminEditorsEG/www/assets` and `/blog-cms/adminzAdminEG/www/assets` accordingly run command to compile sass:
    ```sh
    $ mbakeW -s .
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