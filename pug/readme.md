
# Using, leveraging and extending Pug as the main programming language for static generation, cross-platform development and more.

Lets see how to use and **extend* Pug.

### Quick Intro to Pug part 1

You have heard of NodeJS, and even NodesJS http server: ExpressJS. A *rendering engine used by ExpressJS template engine is Pug*.
- [ExpressJS Pug](https://expressjs.com/en/guide/using-template-engines.html)

But Pug is also used with all the other popular tech stacks, for example Laravel:
- [Laravel Pug](https://github.com/BKWLD/laravel-pug)
More here:
- [PugJS](https://github.com/pugjs/pug)

If you have never seen Pug before, I will tech it to you Pug in 15 seconds, you can just look at this page for 15 seconds and ... you know Pug:
- [Learn Pug by looking at this for 15 seconds](http://pug.mbake.org)

We will use *mbake* CLI to transpile from the Pug language [mbake CLI](https://www.npmjs.com/package/mbake), so please install that if you want to follow along.

But if you are a beginner you can use a GUI like [PrePros](https://prepros.io/downloads)
If you do the GUI route, once you are comfortable, come back here to continue to the next step, using mbake.

### Quick Intro to Pug part 2

So now install (https://www.npmjs.com/package/mbake) if you have not done so already.

Then you should extract a the example we will use by running ```mbake --pug```, and then ```cd pugIntro```.

Just from fun run ```mbake -s .```. That takes SASS/SCSS files and makes .css.

But we are here for Pug, run ```mbake .``, and it will make html file from the Pug file.

That's it, you know Pug.

## Leveraging Pug for static generation and cross-platform development.

You can now statically generate any kind of a web app, PWA, or if you make an SPA app you can have the same app run not only as
a web app, but same code can run Electro, or PhoneGap: to make Android or IOS app. (Aside, I use http://build.PhoneGap.com so there is no Android, IOS, or Cordova to install. It is all done in the cloud. )

Here is an example cross platform app: (https://github.com/intuition-dev/mbMobile), for 3 platforms. Notice that the web app, electron app and phonegap app all use a symbolic link to the same directory: **same code base**. We won't spend more time on this, you can look at the code but just a point is: you can make a cross platform app in Pug.

And since it is static: you can serve from the edge via a CDN (my CDN supports QUIC) for a lower cost and higher performance.

### Leveraging Pug w/ dat.yaml

Notice that there is a dat.yaml! The mbake CLI has code that extends the standard Pug compiler to provide the data in the yaml file statically
at compile time.

For example if the Pug file has:
``` 
    p Hello #{key1}
```
and dat.yaml has
```
    key1: World
```
and you run ```mbake . ``` you will get the expect result :-).

This makes it easier for example to do any SEO, where things like  #{title} is repetitive code.
Done!

Note there is one *on purpose* limitation in mbake CLI: it must start w/ index.pug (and must have dat.yaml). You can of course still
use include and extends (include and extends are Pug keywords) as you wish.
So to make a new page/screen you must create a new folder. This helps organize the code and the hyperlinks.


## Extending Pug!

Html and Pug have elements like div, article, etc. that Pug and browsers know. We can create 
custom elements using native api of a browser: no need to download any library. Well, you do need polyfill for IE11, but native 
custom elements work on IE11.


### Extending Pug w/ Custom Elements example





