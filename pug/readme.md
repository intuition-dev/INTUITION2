## JAMstack.org as a modern tool for Senior/advanced Front End Developers/Designers used to leverages ExpressJS's built in *Pug* markup.
( and eschew imperative languages )

#### Learning, leveraging and *extending* Pug as the main programming language for static generation, cross-platform development and more.

## Background:

### Markdown

If you use Github, you know README.md markdown. ( I use Marker editor https://fabiocolacio.github.io/Marker ). Also everyone and every project should use Github pages. 

##### Lab 1: 
If you are not familiar with github pages, then set that up now before proceeding. One easy way is with http://docsify.js.org.

Ex. Github pages: _sidebar.md
   `
   * [Home Page](README.md)
   * [Page1](pg1.md)
   * [Page2](pg2.md)
   `
Now create those 3 files, and  use the index.html file that you get from Docsify's website.

Above helps you learn markdown, before we get into markup.

#### SASS

IMO, Compared to HTML and .js, CSS is most important and most powerful tool for Front End Developers/Designers. But we no longer write CSS by hand, we now generate CSS from SASS (or Scss) files. We likely download a SASS(or Scss) library from WWW (eg: https://github.com/owenversteeg/min/tree/gh-pages/sass ), edit the files and generate CSS files.
To generate the CSS, we can use Grunt, Gulp, PrePros.IO or write a new shell command via a script in node.js. 

##### Lab 2: 
If  you have never generated CSS, install the free PrePros.IO - you'll need it later anyway. Now download the https://github.com/owenversteeg/min/tree/gh-pages/sass and generate CSS.


## Quick Intro to Pug:

You have heard of NodeJS, and even NodesJS http server: ExpressJS. A *rendering engine used by ExpressJS template engine is Pug*.
- [ExpressJS Pug](https://expressjs.com/en/guide/using-template-engines.html)

But Pug is also used with all the other popular tech stacks, for example Laravel:
- [Laravel Pug](https://github.com/BKWLD/laravel-pug)
More here:
- [PugJS](https://github.com/pugjs/pug)

Alternatives/similar to Pug include Haml and Ebay's MarkoJS concise syntax.

If you have never seen Pug before, I will tech it to you Pug in 15 seconds, you can just look at this page for 15 seconds and ... you know Pug:
- [Learn Pug by looking at this for 15 seconds](http://pug.metabake.net)

We will use *mbake* CLI to transpile from the Pug language [mbake CLI](https://www.npmjs.com/package/mbake), so please install that if you want to follow along.

But if you are a beginner you can use a GUI like [PrePros](https://prepros.io/downloads) to take a Pug file and make html.

### mbake CLI

Install (https://www.npmjs.com/package/mbake) if you have not done so already.

Then you should extract a the example we will use by running ```mbake --pug```, and then ```cd pugIntro```.

Just from fun run ```mbake -s .```. That takes SASS/SCSS files and makes .css.

But we are here for Pug, run ```mbake .``, and it will make html file from the Pug file.

That's it, you know Pug.



## Leveraging Pug for static generation and cross-platform development.

You can now statically generate any kind of a web app, PWA, or if you make an SPA app you can have the same app run not only as
a web app, but same code can run Electro, or PhoneGap: to make Android or IOS app. (Aside, I use http://build.PhoneGap.com so there is no Android, IOS, or Cordova to install. It is all done in the cloud. )

Here is an example cross platform app: (https://github.com/INTUITION-dev/mbMobile), for 3 platforms. Notice that the web app, electron app and phonegap app all use a symbolic link to the same directory: **same code base**. We won't spend more time on this, you can look at the code but just a point is: you can make a cross platform app in Pug.

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


# Extending Pug w/ Custom Elements 

Html and Pug have elements like div, article, etc. that Pug and browsers know. We can create 
custom elements using native api of a browser: no need to download any library. Well, you do need polyfill for IE11, but native 
custom elements work on IE11. 

Here is an example of defining a custom element 'c-custel':

```
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <b>I'm Comp DOM!</b>
      <slot></slot>
   `
   window.customElements.define('c-custel', class extends HTMLElement {
      sr 
      constructor() {
         super()
         this.sr = this.attachShadow({mode: 'closed'})
         this.sr.appendChild(cTemp.content.cloneNode(true))
      }//cons
   })
```

And now you can use 'c-custel' like any other tag in Pug!
You can continue to a full Custom Element tutorial here:

- http://custel1.metabake.net

With the custom elements you can add more attributes, functionality, events, etc. because it is all standard.

## And there is more

If you are using Pug to build a web app, you may write an admin console, similar to how WordPress and other do. 
Here is my example:

<img src="https://github.com/INTUITION-dev/INTU/raw/master/src/intu.png" width="100%"/>

This uses CodeMirrorJS to edit a Pug file on the www. My open source project (www.INTUITION.DEV ) is based on JAMStack, built to maximite leverage Pug.
For example, if you click that green 'Pop Custom' you get a list of custom elements you paste into your code!

So that is the more part: you can write a text editor for Pug and put it on WWW. The idea is that a pro developer sets up a way for the citizen developer to maintain the application. *Pug!*

#### Self promo:

You can check out the project here:
#### - https://www.npmjs.com/package/intu

and if you like it, please start the github link there.


INTUITION: adds editor, WIP
