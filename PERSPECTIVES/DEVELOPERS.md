
- admin.yaml:
edit password, mount point and where the pages are

- Customize pages, it is supposed to be bespoke.


API List:
# MetaAdmin.ts / class SrvUtil
- secret from admin.yaml


## /api/bake
- folder
Do nbake in that folder

## /api/list
- fn
list files

## /api/items
- folder
itemizes, makes JSON file based on dat.yaml
If dat contains publish:false it will be excluded.
You can add a field publish_on:timestamp or similar to not show till a certain date.

## /api/tags
- folder
makes tag.js recursively

## /api/read
-fn file name
- folder
read a file

## /api/write
- fn file name
- folder
post, saves a file, and triggers nbake for the file type. Ex: It may make a tag or make a JSON file as needed

## /api/clone
- src
- dest
clones a folder so you can edit without impacting production.

## /api/replace
- src
- dest
Removes src, replaces it with dest. Once you edited a folder, 'deploy' it back.

## /api/downloadZip
- folder
- url of zip
unzips a plugin in a folder


# /upload
- folder
Uploads an image.


Extend the typescript classes:



