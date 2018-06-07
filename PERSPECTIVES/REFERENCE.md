# "exMeta" example admin app reference

- admin.yaml:
edit password, mount point and where the pages are

- Customize pages, it is supposed to be bespoke.

# API List:
- arg

## /api/bake
- folder
Do nbake in that folder.

## /api/list
- fn
Lists files

## /api/items
- folder
itemizes, makes JSON file based on dat.yaml
If dat.yaml contains publish:false it will be excluded.
You can add a field publish_on:timestamp or similar to not show until a certain date.

## /api/tags
- folder
Makes tag.js recursively

## /api/read
- fn file name
- folder
Reads a file

## /api/write
- fn file name
- folder
Post, saves a file and triggers nbake for the file type. It will make a tag or make a JSON file as needed.

## /api/clone
- src
- dest
Clones a folder so you can edit without impacting production.

## /api/replace
- src
- dest
Removes src, replaces it with dest. Once you edited a folder, 'deploy' it back.

## /api/downloadZip
- folder
- url of zip
Unzips a plugin in a folder.


## /upload
- folder
Uploads an image.


# Extend a class

Extend the typescript classes

import { Dirs, Bake, Items, Tag, NBake } from 'nbake/lib/Base'

import { Srv, FileOps } from 'meta-admin/lib/ABase'

class Example extends Srv { // you could customize the scripted build - easier than gulp/grunt

}




