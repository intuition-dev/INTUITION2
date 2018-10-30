How to setup Metabake Admin with Firebase

[This is work in progress.]

1. So Metabake Admin can render images from the site and have a working 'View Site' button, globally replace the PROD_ROOT value in dat.yaml files that have it. Bake with mbake .

2. Create a Firebase project. 

3. In Firebase Project Overview Settings Service Account Tab, generate a new private key. Store the content in a JSON file on the Metabake server. Edit 'firebase_config' in admin.yaml to match the filename and location. This is to enable the Metabake API server to apply Firebase Auth and to access and return a user list.

4. In Firebase Develop - Authentication Sign-in Method, ensure that 'Email/Password' is enabled. Enable 'Email Link (passwordless sign-in)' for our invitation process. Still on Sign-in Method, add the domain you are using for Metabake Admin (must be a domain, not IP).

5. In Authentication, click on 'Web Setup' and copy the config values over the values in /autoEG/layout/auth-tag.pug. At the same time, verify that baseURL matches your Metabake API server. Also adapt the actionCodeSettings URL. Bake with mbake -t. 

6. Add yourself with 'Add User' under Authentication - Users. Copy the User UID and rename the blog/team folder 'myadmin' to that UID. When you run Mbake-Admin (with ts-node index.ts or better pm2), you will be able to log in to Metabake Admin with that user and will be shown as an Admin under 'People'

[TBD: creation of additional users via invite]









