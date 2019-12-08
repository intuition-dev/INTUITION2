
# Advanced Front End Development for (real and) experienced developers 

Previously I outlined beginner back end development in article (here:  )
And now here in part 2, I'll tackle how to effectively do front end development: targeting experienced developers, 7+ years of professional
web development. The 7 years being based on book called: 10K hours to mastery. 
For example, you got your bachelor's in 2013 and have been doing 7 years of paid development in something like PHP, MS ASP, Java JSP or similar web development, that would be an example of 7 years of front end development. Also the degree can be a master degree in graphics design from one of the top schools or similar.
What I am saying to the reader is if you are a jr front end developer this article is not targeting you, but you can likely do beginner back end development as linked at the top - it is much easier to start and master back end - and while doing back end you can get exposed to non-imperative styles of programing, for example using SQL is declarative. 

Some of the concepts I introduce may seem strange at first, a bit like eating sushi the first time. But then, you end up developing a taste for it.


### How do real developers develop UI/Front End?

When C and C++ developers need GUI the use GUI libs and some of the modern libs they use are declarative:
- Qt/QML
- sciter
- ultralig.ht
- CEF

( Some of the older C/C++ GUI lib like wx, Haxe and GTK are imperative)

Above libs for C/C++ GUI are HTML / DOM based. Html is really a tree/graph of elements.

### SEO (and AMP)

Some apps are secure, but others need to be viral enabled - so we optimize for SEO. Google, Bing and others offer
webmaster / search console tools online - where you can check your page/screen's performance. 
What you have to have resized years ago: you can't use .js client side for anything SEO!

And for improved mobile SEO you may need to render AMP. Again: no .js.

Just HTML and CSS.
You should get the idea that imperative development is mostly for back end and beginners. Imperative is not for advanced and not for front end.

## Real (and fake) front end development and tooling

JAMStack architecture talks about *' prerendered Markup, served without web servers '*. Nice thing about pre-rendered is: SEO :-). No need to dynamically render. No web servers also means fast, served by the edge (CDN) and infinitely scalable. ( Infinitely scalable of the front end; the back end APIs is a different team ).

### Mark up

eBay uses Marko for markup, eg:

<img src="marko.png" width="60%"/>

Nodejs Express uses the more popular Pug for Markup, and most people are familiar with it:
- https://expressjs.com/en/guide/using-template-engines.html



#### So how do we pre-render? 

You bind data at compile time for anything SEO. You can compile markup(template) with Grunt|Gulp, but after running into limitations
of the build languages, it is much easier to write a build script in .js, and have full access to npm packages for your build script. You likely already know .js, but this time you are running it at compile time to generate screens/pages that will run statically.

One popular tool as an alternative to a build script is Prepros.io. You can for example compile SASS to .css, Pug to html and .ts to .js.
You are likely already familiar with compiling Sass to CSS as it gives you more power. The JAMstack approach does the same thing with html.

With a generate for example you can reuse snipets, use same markup for SEO|AMP-no.js screen page, and an enhanced  SPA version with client side .js of the same page (on first user click). 


#### Static / Dynamic?

An example JAMstack is both static and dynamic: show a story static without need for .js! Then progressively enhance to display comments dynamically and improve UX. 


## Cross Platform: Electron

Responsive approach allow us to develop a web app that works on desktop and mobile screens. 
One important tool to master is Electron. It allows a path to cross platform development.

For example: IOS and Andorid running the same exact code base that is running your Web App.
But it should be done in two steps:
1. Port your app to Electron 
2. Port the Electron app to Adobe PhoneGap at build.phonegap.com.


## Lab: Non-imperative

To get the feel for non-imperative programing you should write a hello world levering in Mavo.io.
Mavo is developed by Lea Verou who is on the HTML standards committee.

Note: I'm not recommending or using Mavo. I am saying it is a great learning tool that takes less than an hour so you can feel an important concept.

Instead of html, use Pug (eg: Prepros.io). 

1. A hello world Mavo in Pug, the simpler the better (instructor provided)
2. Port to Electron (instructor provided)
3. Port to build.PhoneGap

Email the app file produced by build.PhoneGap to your phone. 


### Org chart

Obviously having a separate mobile team doing Android and IOs will obstruct cross platform productivity: DRY.

Instead the front end team's teach leads are broken up by the users persona, the people your org is targeting in helping. 

(aside: each front end team should have a single member from the back end team that is writing the client side apis for them - APIs that map to the view model)

The front end developers tend to be more senior and should have potential to become principal engineers, designers or product managers.

Some call the sr. front end developers unicorns: designers that code. That is one of the reasons that front end is a higher salary band than back end.
Also due to constraints, sr. front end developers maybe remote or at least have a Friday WAH (work from home), (vs back end that likely have to be local due to security of back end data).

Candidates Sr. Front End developers should have some example sites, including their own, and opinion on css websites they like and other other sr front end developers they admire. (note: If the people they admire are .js or imperative developers I myself would consider them for the back end team)



### Front end frameworks

<a href="http://www.youtube.com/watch?feature=player_embedded&v=YOUTUBE_VIDEO_ID_HERE
" target="_blank"> <img src="http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg" 
width="240" height="180" border="10" /></a>




Experience migrating and running two at a time.


### Confusing? Maybe a bit


## Mastery

Naming


