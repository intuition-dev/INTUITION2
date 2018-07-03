
## Clound Mount



6. Map to the production server from CodeAnywhere, to make sure your AWS access key and secret are working. (the keys are under 'Security Credentials' AWS menu)

7. Now to setup the build server, setup goofYs to map to your 'S3':

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
		~/goofys --profile default -o allow_other --use-content-type BUCKET-NAME ~/admin/prod

		// check to see your S3 webapp files
		ls -la

8. With S3, in CodeAnywhere, map to the build server to use the production with 'watch' feature.

 We have S3 inside the container. The group IDE can edit S3 project. Later you can customize the IDE.
cd ~

