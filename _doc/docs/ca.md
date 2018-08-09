
# Setup cloud dev.

1. Setup up a Linux box in the cloud, e.g. Digital Ocean.

2. Setup a Web IDE account, e.g. CodeAnywhere (CA)

3. In CA, connect to the Linux box.

4. In CA, open SSH to the Linux box.


### Cloud Mount S3

1. Setup S3 mounting software.

      cd ~
		sudo wget http://bit.ly/goofys-latest
		mv goofys-latest goofys
		sudo chmod +x goofys

		//just in case you need it
		ln -s /var/log ~

2. In mbake, you should be comfortable mounting to the local PC. Now we mount in the cloud.


		//edit your credentials, [other2] part is very optional, if you need 2 mounts.
		mkdir ~/.aws
		In CA edit ~/.aws/credentials
			[default]
			aws_access_key_id = KEY
			aws_secret_access_key = SECRET
			[other2]
			aws_access_key_id = KEY2
			aws_secret_access_key = SECRET2

		// mount your S3 bucket there, use your BUCKET-NAME
		~/goofys --profile default -o allow_other --use-content-type BUCKET-NAME ~/root/adminEG/prod

		// check to see your S3 webapp files
		ls -la
      
      // if errors, check /var/log/syslog for direction

3. Now you can edit and ... from CodeAnywhere ssh: mbake -a


