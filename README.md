# Deploy

1. Install node, yarn, and typescript (mbake is recommended)

2. git clone metabake-web-admin

Yarn install does not work yet.

## Part 1: **Editing site**

1. Deploy site which you are going to edit through the **WebAdmin application**, eg:

    1. Download a **blog example site**:

        ```conf
         mbake -c
        ```
    1. Compile files:

        ```conf
         mbakeX -c .
         cd assets
         mbake -s .
         cd ../blog
         mbake -i .
        ```

## Part 2: **WebAdmin application**

### **In WebAdmin application you can:**

- **edit** `.md`, `.yaml`, `.csv`, `.css` and `.pug`(optional) files.
- **upload** files to the folders and then use it on page
- **clone** existing **pages**, to create new pages
- **set** posts **publish date** (for CMSs only — if you will set date in future, the post won't publish until that time)

All this operations will be applied to the **site** path to which you specified in `config.yaml` file.

*Note:* that changes might be affected by your hosting provider's cache. There is a **preview** button, by clicking on which you can check your changes in the real time, but they will be applied after the cache will expire.

### **WebAdmin application consists of two applications:**

- **CRUD users app** — for creating users (on port `:8080`, front-end is in folder `wwwAdmin`)
- **Editor app** — for editing site pages content (on port `:9080`, front-end is in folder `www`)

In the **CRUD users app** you login with the _login_ `admin` and _password_ specified in `/WebAdmin/config.yaml` folder in the field `secret`. 
To the **Editor app** you log in with the user created in the **CRUD users app**.
In `/WebAdmin/config.yaml` you specify a path to folder with _site_ which you've deployed in **Part 1** and which are _going to edit_ via **Editor app**.

### **Deploy steps**

1. Download the **source code** of WebAdmin app with the command:
    ```sh
    $ mbakeX -m
    ```
1. **Create an account** (if you haven't one already) and database in [FireStore](http://console.firebase.google.com). Navigate to the _Service Accounts_ tab in your database project's settings page and press _Generate New Private Key_ button. A JSON file containing your service account's credentials will be downloaded. Next go to the _Authentication_ tab, click _Sign-in method_ and set _Email/Password_ method to _Enabled_.

1. Add the following **config files** next to their _examples_ accordingly:

    - Rename downloaded FireStore Admin SDK file to: **`serviceAccountKey.json`** and place it to the root `/WebAdmin` folder. 

    - In folder `/WebAdmin/www` copy file `config.js.example`, rename it to **`config.js`** and paste it next to its example here in this folder. 
        - change _ip_ urls to your server or local ip address.
        - change `appMount` field value to the path to your _editing site_.
        - in the FireStore console go to _Project Overview_ tab, on the next screen click _</>_ icon, a popup _Add FireStore to your web app_ will appear. Fill the fields `apiKey`, `authDomain`, `projectId` values accordingly to your DB settings values.
        - change the `siteName` field value to the _name_ of your _editing site_.
    

    - In folder `/WebAdmin/wwwAdmin` copy file `config.js.example`, rename it to **`config.js`** and paste it next to its example here in this folder. 
        - change _ip_ url to your server or local ip address
        - change  `siteName` field value to the _name_ of your _editing site_.

    - Copy file `config.yaml.example`, rename it to **`config.yaml`**, and edit the fields:
        - change `appMount` field value to the _path_ to your _editing site_.
        - fill the values of fields `FB_API_KEY`, `FB_AUTH_DOMAIN`, `FB_PROJECT_ID` accordingly to the values of your project database that you've already retrieved in the previous steps.
        - you can also _change admin password_ (optional).


1. From the root folder of `/WebAdmin` run command to **install _node_modules_**, compile them and run node:
    ```sh
    $ yarn
    $ tsc

    $ node index.js 
    // or: 
    // $ nohup node index.js & 
    // if you want node running after the terminal will be closed
    ```
1. From folders `/WebAdmin/www` and `/WebAdmin/wwwAdmin` accordingly run command to **compile** pug:
    ```sh
    $ mbake .
    ```
1. in folders `/WebAdmin/www/assets` and `/WebAdmin/wwwAdmin/assets` accordingly run command to **compile** sass:
    ```sh
    $ mbake -s .
    ```
1. Open in browser url with the **application to create users**:
    ```sh
    [your-ip]:8080
    // eg: http://0.0.0.0:8080
    ```

    Open in browser url with the **application to edit site content**:

    ```
    [your-ip]:9080
    // eg: http://0.0.0.0:9080
    ```
1. **Login to** `[your-ip]:8080` is: `admin`, password is: `123456` (_Note: if you have changed the password in config.yaml, then use your new password from this file_). Create a new user here.

1. **Reset password** for just created user via received email and then **login to** `[your-ip]:9080` with this user's credentials.


ngrok.com may help w/ during development 