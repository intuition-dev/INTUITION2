# Deploy on linux, eg: CA:

1. Setup up a Linux droplet in the cloud, e.g. [Digital Ocean](www.digitalocean.com).

1. Change the root password for DO linux droplet. Connect by ssh in terminal. It will ask to enter existing password and then new password:
    ```sh
    $ ssh root@[IP-Address]
    ```

1. Setup a Web IDE account, e.g. [CodeAnywhere](https://codeanywhere.com) online text editor (hereafter CA)

1. In CA, connect to the Linux droplet.

1. In CA, open SSH to the Linux droplet.

1. Setup S3 mounting software:
    ```sh
    $ cd ~
    $ sudo wget http://bit.ly/goofys-latest
    $ mv goofys-latest goofys
    $ sudo chmod +x goofys

    //just in case you need logs
    $ ln -s /var/log ~
    ```
1. Make a directory for credentials file and create a file 'credentials' in it:
    ```sh
	$ mkdir ~/.aws
    ```
1. In CA edit ~/.aws/credentials ([other2] part is very optional, if you need 2 mounts):
    ```sh
    [default]
    aws_access_key_id = KEY
    aws_secret_access_key = SECRET
    [other2]
    aws_access_key_id = KEY2
    aws_secret_access_key = SECRET2
    ```

1. Make a directory in which you'll mount s3 bucket:
    ```sh
    $ mkdir folder_name
    // check if folder was created
    $ ls -la
    ```
1. Mount your S3 bucket into it, use your 'BUCKET-NAME' (name before the domain) and 'folder_name':
    ```sh
    ~/goofys --profile default -o allow_other --use-content-type BUCKET-NAME ~/folder_name

    // check to see your S3 webapp files
    ls -la

    // if errors, check /var/log/syslog for direction
    ```
1. In 'folder_name' in which you've mounted s3 bucket download blog example:
    ```sh
    $ mbake -b
    ```
    move all files from '/blog' folder to 'folder_name' and run in 'folder_name':
    ```sh
    $ mbake -t .
    $ cd assets
    $ mbakeW -s .
    ```
1. In DO droplet install node, yarn, typescript and mbake:
    ```sh
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

    //restart terminal, next is one line command:

    $ export NVM_DIR="$HOME/.nvm" 
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

    $ nvm --version

    //(must be 0.33)

    $ nvm install 10

    $ nvm use 10.15

    $ nvm alias default 10.15
    ```
    install yarn:
    ```sh
    $ npm install -g yarn

    Note: Due to the use of nodejs instead of node name in some distros, yarn might complain about node not being installed. A workaround for this is to add an alias in your .bashrc file, like so: alias node=nodejs. This will point yarn to whatever version of node you decide to use.

    $ vim .bashrc
    //add alias: alias node=nodejs --> 'escape' --> :wq --> 'enter'
    ```
    install mbake:
    ```sh
    $ yarn global add mbake 
    ```
    install typescript 
    ```sh
    $ npm install -g typescript
    $ npm install -g ts-node
    ```

3. Create folder for blog CMS editor app and in this folder download Blog CMS app, change 'blog-cms-folder-name' with your own name:
    ```sh
    $ mkdir blog-cms-folder-name
    $ cd blog-cms-folder-name
    $ mbakeW -c
    ```

4. Download the config files by link under header: 'Add and edit config files to blog CMS project:') and add them next to according *.example file:

    https://slimwiki.com/metabake/blob

5. in adminEditorsEG/config.yaml change this line to path to your mounted s3 bucket:
    ```sh
    # app url (blog www)- the one you are maintaining
    appMount: /home/admin/prod
    ```
6. in folders adminEditorsEG and adminzAdminEG accordingly run command to instal node_modules:
    ```sh
    $ yarn
    $ tsc
    $ ts-node index.ts // (or $ nohup ts-node index.ts& if you will close the terminal)
    ```
7. in folders adminEditorsEG/www and adminzAdminEG/www accordingly run command to compile pug:
    ```sh
    $ mbake .
    ```
8. in folders adminEditorsEG/www/assets and adminzAdminEG/www/assets accordingly run command to compile sass:
    ```sh
    $ mbakeW -s .
    ```
9. open in browser:
    ```sh
    /*Blog admin:*/
    [your-ip]:8080

    /*editors*/
    [your-ip]:9080
    ```
10. login for admin: 'admin', password: '123456' (you can check password in adminzAdminEG/config.yaml file ('secret' field)).

11. to login to editors you need to login to admin first and create new user.