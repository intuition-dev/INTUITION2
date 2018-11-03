How to setup the 'Metabake Admin' app.

It has the 'Metabake Admin' (UI) server, an API server, a DEV server, and may link to your Production server (e.g. on S3).

1. Create a Firebase project. 

2. In Firebase Project Overview Settings Service Account Tab, generate a new private key. Store the content in a JSON file on the Metabake Admin server (e.g. same directory as admin.yaml). Edit 'firebase_config' in admin.yaml to match the filename and location (e.g. /admin/autoEG/firebase-config.json). This is to enable the Metabake API server access and return a user list, and allow the admin to delete a user (from Firebase auth). [This is an interesting point: without Admin SDK on the server, an admin can not delete other Firebase Auth users through the Metabake Admin UI]

3. In Firebase Develop - Authentication Sign-in Method, ensure that 'Email/Password' is enabled. Enable 'Email Link' for our invitation process. When prompted for a public project name, set it to something like 'Metabake Admin CMS'; this will be used in Firebase Auth emails. Still on Sign-in Method, add the domain you are using for Metabake Admin (must be a domain, not IP address).

4. In Firebase - Develop - Authentication, click on 'Web Setup' and copy the config values over the values in /autoEG/layout/auth-tag.pug. In auth-tag.pug, also verify that baseURL matches your Metabake *API* server domain and port. Bake with mbake -t . [this item would be simplified with yaml-import]

5. [Setup of first/Admin user] In Firebase - Develop - Authentication, add yourself with 'Add User' under Authentication - Users. Copy the User UID and rename the blog/team folder 'myadmin' to that UID. When you run Metabake-Admin (with nohup ts-node index.ts &), you will be able to log in to Metabake Admin with that user. 

6. So Metabake Admin can render images from the site and have a working 'View Site' button, globally replace the PROD_ROOT value in dat.yaml files that have it. Bake with mbake . [Note: we may be able to get rid of this item if we use the auth.prodROOT variable in auth-tag.pug.]







