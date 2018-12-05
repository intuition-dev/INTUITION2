
# Setup cloud dev.

1. Setup up a Linux box in the cloud, e.g. Digital Ocean.

2. Setup a Web IDE account, e.g. CodeAnywhere (CA)

3. In CA, connect to the Linux box.

4. In CA, open SSH to the Linux box.


### Cloud Mount S3

1. Setup S3 mounting software.
	```js
	$ cd ~

	$ sudo wget http://bit.ly/goofys-latest
	$ mv goofys-latest goofys
	$ sudo chmod +x goofys

	//just in case you need it
	$ ln -s /var/log ~
	```

1. In mbake, you should be comfortable mounting to the local PC. Now we mount in the cloud.

	```js
	//edit your credentials, [other2] part is very optional, if you need 2 mounts.
	$ mkdir ~/.aws
	```
1. In CA edit ~/.aws/credentials
	```conf
	[default]
	aws_access_key_id = KEY
	aws_secret_access_key = SECRET
	[other2]
	aws_access_key_id = KEY2
	aws_secret_access_key = SECRET2
	```

1. Make a directory in which you'll mount s3 bucket
	```js
	$ mkdir folder_name
	// check if folder was created
	$ ls -la
	```

1. Mount your S3 bucket into it, use your BUCKET-NAME and folder_name
	```js
	~/goofys --profile default -o allow_other --use-content-type BUCKET-NAME ~/folder_name

	// check to see your S3 webapp files
	ls -la

	// if errors, check /var/log/syslog for direction
	```

1. Now you can edit and ... from CodeAnywhere ssh: mbake -a


