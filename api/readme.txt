# API documentaion

1. To generate human readable documentation install npm documentation globally (`-g`):

```conf
$ npm -g we documentation
```
2. There should be `documentation.yml` file.
    Do command from this folder:

```conf
$ documentation build --config documentation.yml WebAdmin.js -f html -o api
```

It will generate `api` folder with the human readable documentation.