
# Cloud Mount


##### Cloud Mount

1. To make sure your AWS access key and secret are working, connect to the production server from CodeAnywhere. You can generate a key under AWS menu 'Security Credentials'.

2. To mount S3 on the build server, setup goofYs as follows:

		cd ~
		sudo wget http://bit.ly/goofys-latest
		mv goofys-latest goofys
		sudo chmod +x goofys

		//just in case you need it
		ln -s /var/log ~

		//edit your credentials, [other2] part is very optional:
		mkdir ~/.aws
		(if using CA container: sudo apt-get install nano)
		nano ~/.aws/credentials
			[default]
			aws_access_key_id = KEY
			aws_secret_access_key = SECRET
			[other2]
			aws_access_key_id = KEY2
			aws_secret_access_key = SECRET2


		// mount your S3 bucket there, use your BUCKET-NAME
		~/goofys --profile default -o allow_other --use-content-type BUCKET-NAME ~/root/admin/prod

		// check to see your S3 webapp files
		ls -la

3. With S3, in CodeAnywhere, map to the build server to use the production with 'watch' feature.
We have S3 inside the container.

### Done

At the end of the setup, you should have a connection and 2 mounts per project:

- One of the admin/build server
- In that folder, the production mount of the app you admin

 You can extend the bases classes to customize the build server.

- Also, do customize the admin pages, they are supposed to be bespoke.
