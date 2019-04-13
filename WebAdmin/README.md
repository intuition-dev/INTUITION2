# Deploy

## Part 1: site deploy

1. Deploy site which you are going to edit with Admin CMS

## Part 2: CMS deploy

1. Create folder for Admin CMS app and download its source code to this folder, eg:
    ```sh
    $ mkdir CMS
    $ cd CMS
    $ mbakeX -c
    ```
1. Create an account (if you haven't one already) and database in [FireStore](http://console.firebase.google.com). Navigate to the `Service Accounts` tab in your database project's settings page and press `Generate New Private Key` button. A JSON file containing your service account's credentials will be downloaded. Next go to the `Authentication` tab, click `Sign-in method` and set `Email/Password` method to `Enabled`.

1. Add the following files next to their example accordingly:

    - Rename downloaded FireStore Admin SDK file to: `serviceAccountKey.json` and place it to the root folder of Admin CMS. 

    - Copy file `config.js.example`, rename it to `config.js` and change ip url to your server or local ip address.

    - Copy file `config.js.example`, rename it to `config.js` and change ip url to your server or local ip address and change the values of fields `apiKey, authDomain, projectId` accordingly to the values of your project that you've already retrieved in one of the previous steps.

    - Copy file `config.yaml.example`, rename it to `config.yaml`, and change the fields:
        - change `appMount` field value to the path to your site.
        - in the FireStore console go to `Project Overview` tab, on the next screen click `</>` icon, a popup `Add FireStore to your web app` will appear. Fill according fields values with values of DB of your project.
        - you can also change ports or admin password (optional).


1. From the root folder of Admin CMS run command to install `node_modules`, compile them and run node:
    ```sh
    $ yarn
    $ tsc

    $ node index.js 
    // or: 
    // $ nohup node index.js & 
    // if you want node running after the terminal will be closed
    ```
1. From folders `../www` and `../wwwAdmin` accordingly run command to compile pug:
    ```sh
    $ mbake .
    ```
1. in folders `../www/assets` and `../wwwAdmin/assets` accordingly run command to compile sass:
    ```sh
    $ mbake -s .
    ```
1. Open in browser Admin CMS app for creating users:
    ```sh
    [your-ip]:8080
    // eg: http://0.0.0.0:8080
    ```

    Open in browser Admin CMS app for editing site content:

    ```
    [your-ip]:9080
    // eg: http://0.0.0.0:9080
    ```
1. Login to `[your-ip]:8080` is: 'admin', password is: '123456' (Note: if you have changed the password in config.yaml, then use your new password). Create a new user here.

1. Reset password for just created user via received email and then login to `[your-ip]:9080` with this user's credentials.

1. In Admin CMS app you can: 

    - edit `.md`, `.yaml`, `.csv` files. (Also `.pug`)
    - upload files
    - copy pages, to create new page
    - set posts publish date (for CMSs only — if you will set date in future, the post won't publish until that time)
    
    All this operations will be applied to your mounted site.

    *Note:* that changes might be affected by your hosting provider's cache. There is a `preview` button, by clicking on which you can check your changes in the real time, but they will apply on the site after the cache will expire.