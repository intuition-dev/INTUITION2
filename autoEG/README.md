How to setup the 'Metabake Admin' app.

It has the 'Metabake Admin' (UI) server, an API server, a DEV server, and may link to your Production server (e.g. on S3).

1. Create a Firebase project. 

2. In Firebase Develop - Authentication Sign-in Method, ensure that 'Email/Password' is enabled. Enable 'Email Link' for our invitation process. When prompted for a public project name, set it to something like 'Metabake Admin CMS'; this will be used in Firebase Auth emails. Still on Sign-in Method, add the domain you are using for Metabake Admin (must be a domain, not IP address).

3. In Firebase - Develop - Authentication, click on 'Web Setup' and copy the config values over the values in /autoEG/layout/auth-tag.pug. In auth-tag.pug, also verify that baseURL matches your Metabake *API* server domain and port [Note: beware of CORS issues between UI and API servers], and that prodROOT matches your production server domain (this could also be the Metabake DEV server domain and port, up to you). Bake with mbake -t . 

4. In Firebase - Develop - Database, create a Cloud Firestore. Secure it, create a collection of 'users', then 'Add Document' with field 'email' that has your email and 'currentRole' of 'Admin'. Follow the steps for CRUD to enable only email-verified users. This ensures that you will be displayed in the 'Metabake Admin' list of users.
[Note: this is the key tradeoff in the new design. We have to setup Firestore with security instead of using serverside Admin SDK to list the users from Authentication. I liked not needing Firestore. Not using Firestore opens the design up for a future single-user version that just uses basic auth.]

5. Back in Firebase - Develop - Authentication, add yourself with 'Add User' under Authentication - Users. Verify yourself via email. When you run Metabake-Admin (with nohup ts-node index.ts &), you will be able to log in to Metabake Admin with that user.
[Note: to me it's kind of confusing to have to add a user twice. We decided to try to avoid Firebase if possible. Maybe it wasn't such a bad choice after all.]

[Optional: Repeat steps 4 and 5 for additional admins. Admins can invite and see all editors inside Metabake Admin.]


[Note: Given we need domains, not IP addresses for the Firebase Auth processes to work, and we need to use a domain name for the Metabake Admin UI, I am not sure what the value of using ports is. Might as well configure subdomains api. and dev. instead while avoiding CORS problems].






