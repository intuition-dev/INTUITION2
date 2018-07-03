
# Cloud Mount

### Video review

Part 1: http://youtube.com/watch?v=LtPQtUUE1wE

Part 2: http://youtube.com/watch?v=pJQQZRYGPMo


##### Cloud Mount

1. Map to the production server from CodeAnywhere, to make sure your AWS access key and secret are working. (the keys are under 'Security Credentials' AWS menu)

2. Now to setup the build server, setup goofYs to map to your 'S3':

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

3. With S3, in CodeAnywhere, map to the build server to use the production with 'watch' feature.
We have S3 inside the container.

### Done

At the end of the setup, you should have a connections and 2 mounts per project:

- One of the admin/build server
- In that, the production mount


 You can extend the bases classes to customize the build server, e.g.:

```
   import { Dirs, Bake, Items, Tag, nBake } from 'nBake/lib/Base'
   import { Srv, FileOps } from 'meta-admin/lib/ABase'
   class Example extends Srv {
   }
```

- Customize pages, it is supposed to be bespoke.
