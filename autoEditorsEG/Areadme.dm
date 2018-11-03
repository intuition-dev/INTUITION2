
Best to think of it as 2 apps( 2 apps and 2 api servers on 4 ports). They will be combined into 1 later, towards v2

user admin web app and user admin api
----------------------------------------------
for 1 admin user only using admin.yaml only - basic auth. username is admin, no email.
it has admin api(/admin/...), that uses basic auth only 
it has no firebase on client. only node api server has fb admin - no db
it has a (/admin/editors/....) datatable (not in a tag) as main ui. it cruds editors.
you can change admin password: edit admin yaml.
it will have a client sideAdminService.js
a user of CMS will have to download the auth_key.json from FB and place in root.

editors web panel and separate editors api
------------------------------------------
firebase client side auth only, like a normal app.
it shows md editor(/editors/edit/....) not in a tag) as main ui.
a data table(not in tag) listing all pages (VIC: draft api to return all pages everywhere as list)
editors node api (/editors/...) will expect that the browser will send fb token to request chain ( see Francisco's https://stackoverflow.com/questions/50370925/firebase-authentication-using-nodejs )
it will have a  client side EditorsService.js
a user of CMS will have to download the auth_key.json from FB and place in root.
it has forgot and change password page
it has 'view' see next

ports & view page
---------------
each web app will host config.js with config json inside, it does not need to be edited if you don't change ports in config.yaml,
with these fields:
   admin_api_port: XX
   editor_api_port: XX
   dev_app_port: XX // used to view deployed site w/ auto refresh injection working, not using S3 production or cached combined
the browser will compute the host based on current_host.
in addition to allow for https (not needed but somehow one of us is crazy) json will have these optional fields:
   admin_api_url: nnnn
   editor_api_url: nnnn
   dev_app_url: nnnn
if these fields are present browser will ignore ports, and use https (easy via caddy or wedge). This is v2; AFTER v1.

editors directory
-----------------
There may be need to have more data and fields on editors in webapp
(EG /editors/dir/vic, editors/dir/wolfgang)
It is just a page/screen per editor. 
in v2


This makes it easy to extend for any use.
Base.ts will have AdminFireUtil helper functions.




