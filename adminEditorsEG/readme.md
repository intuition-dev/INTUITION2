
# Setup

1. On a linux install node, typescript, node, yarn and mbake
You should use CodeAnywhere to SSH in.

2. mbake -a in a folder you want the admin in

3. Mount S3


#### Admin app needs your keys to FireBase:

1. https://console.cloud.google.com/project/_/iam-admin

2. On left click services account

3. On right select Firebase Admin SDK - this will create the key. Download, and SFTP to host. Place in root of project (where mbake -a emited)


### Run

1. run via nohup node index*.js &

2. Open browser at host and port for admin, eg: host:9080
