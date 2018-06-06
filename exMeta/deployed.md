

Mount the production server before hand.

Ex:
   sshfs -o allow_other user_name@xxx.xxx.xxx.xxx:/ /home/admin/mnt

or



And get the modules:


			npm i


edit/nano admin.yaml to setup the mounts and/or passwor

// path to admin.yaml
node index.js .

Customize as needed:


		import { Dirs, Bake, Items, Tag, NBake } from 'nbake/lib/Base'

		import { Srv, FileOps } from 'meta-admin/lib/ABase'

		class Example extends Srv { // you could customize the scripted build - easier than gulp/grunt

		}
