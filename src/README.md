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

*Note:* that changes might be affected by your hosting provider's cache. There is a **preview** button, by clicking on which you can check your changes in the real time, but they will be applied after the cache will expire.

### **WebAdmin application consists of two applications:**

- **Admin** — for creating users (http://localhost:9081/admin)
- **Editor** — for editing site pages content (http://localhost:9081/editors)

## **To install/run the webadmin**

1. To install webadmin:
    ```sh
    $ yarn add metaIntuition
    $ yarn start
    ```
2. open in your browser `**http://localhost:9081/setup**`
3. type if your admin email and password, emailjs configuration and path to your site
4. click setup, you will be redirected to the webadmin where type in your email with password which you entered at setup page
5. add editors which can have access to the editor
6. open admin with `**http://localhost:9081/admin/**`
7. open editor with `**http://localhost:9081/editors/**`

ngrok.com may help w/ during development 