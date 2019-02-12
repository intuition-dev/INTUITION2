
LIZxxx

- <a href='https://youtu.be/CMUiPC0YtYA' target='_blank'>WebIDE video</a>
- <a href='http://doc.mBake.org/meta/' target='_blank'>Click for 'THE' Meta docs</a>


## MetaBake is the extensible open source low-code productivity tool for programmers; including dynamic apps and data binding.

#### MetaBake is the extensible open source low-code productivity tool for programmers, via static generation; with Pug, Markdown and more; including dynamic apps and data binding. *Some developers implement applications faster than others.*

MetaBake mbake CLI lets you generate websites and dynamic webapps in Pug by leveraging low-code pillars for high development productivity.

## Install

Easy to install

```sh
yarn global add mbake
mbake
```

Install note:
- If you get an error like 'Node Sass could not find a binding for your current environment' 
run$: ``` yarn global upgrade ```

## First Page

Create file index.pug
```pug
header
body
    p Hello #{key1}
```
and create file dat.yaml
```yaml
key1: World
```

### Now make with mbake

```sh
mbake .
```

This will create index.html. 

Of course you can use regular Pug syntax to include other Pug files; or Markdown. MetaBake markdown flavor includes CSS support:
```pug
    include:metaMD comment.md
```

## Home Page

There are many example apps, and shipped templates include include an CMS module, a watcher module, SPA, Blog, Website, Slides, Dashboard, CRUD, PWA, Electron, Hybrid mobile apps, Cloud v2.0 via AWS|FireStore, RIOTjs, Ads and more. 

Primary focus is high development productivity (via "low-code") and being easy to learn. It is also fully flexible to build any WebApp in any directory tree structure you like an use any CSS/SASS framework you like.

MetaBake supports CSS classes in Markdown, plus, because it uses Pug - it can also do any HTML layout. But MetaBake is not static only - it fully supports and has examples, shipped apps, and docs for dynamic and even mobile apps.

[mBake.org](http://mBake.org)



Deploy apps on linux, eg: CA:

1. Create app for blog, mount s3 bucket with blog in this folder: http://blog-website.s3-website-us-east-1.amazonaws.com

2. Install node, typescript and mbake

3. Create folder for blog CMS, git clone repository to that folder:

    $ git clone https://github.com/metabake/baseCMS.git

4. Add files next to *.example files (see files above)
5. in adminEditorsEG/config.yaml change this line to path to your mounted s3 bucket:

    # app url (blog www)- the one you are maintaining
    appMount: /home/admin/prod

6. in folders adminEditorsEG and adminzAdminEG accordingly run command to instal node_modules:
    $ yarn
    $ tsc
    $ ts-node index.ts // (or $ nohup ts-node index.ts& if you will close the terminal)

7. in folders adminEditorsEG/www and adminzAdminEG/www accordingly run command to compile pug:
    $ mbake .
8. in folders adminEditorsEG/www/assets and adminzAdminEG/www/assets accordingly run command to compile sass:
    $ mbakeW -s .

9. open in browser:
    /*Blog admin:*/
    [your-ip]:8080

    /*editors*/
    [your-ip]:9080

10. login for admin: 'admin', password see in adminzAdminEG/config.yaml file ('secret' field)

11. to login to editors you need to login to admin first and create new user.