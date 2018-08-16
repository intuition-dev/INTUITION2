
# Obfuscating client-side js/HTML code

When you write an Mobile App, for example in Android; code is easy to decompile by anyone that uses your app. So on Android, ProGuard is used by developers to obfuscate code. Is it full proof, no; but even C code can be decompiled. But obfuscating Andorid app via ProGuard is viewed as good enough.

### How to obfuscate js/HTML code?

The short answer is
- http://obfuscator.io

It is built in http://metabake.org static generator, an open source project maintained by the author. Read on to leverage js/HTML obfuscation.

### Motivation

So first, why HTML, why not just .js? Because client side code includes CSS, HTML and .js; and sometimes the hard work includes CSS you worked on hard. That is what makes the rich UX.

The web apps are now client side heavy, as we move towards serverless or even Cloud v2.0 (fully client side only). Let's say you are using AWS Congnito or Google FireStore or even some cool libraries that you want to keep secret, or at least harder to 'view source'

Why obfuscate? Maybe client has not paid you yet, or maybe you wrote a nice web component/tag that you want to license, or maybe you just want to hide your keys better.

You may still want to keep doing the old way, lets say your key is 'ABC', just declare a var as 'A0C', but when using it, replace 0 with C in a function.

### Details of how I use it.

Mostly I write a component in Pug( 'HTML' ) that I include. Then I take the pug and make it into a Tag, with help of Riot js (more here https://medium.com/@uptimevic/learn-riot-js-dynamic-binding-in-90-seconds-fcece5237c67  )

At a high level, this converts a working section of HTML(with CSS and js) into .js - including something like *shadow DOM*. The tag makes it easier to build rich UI (before this I used react, like most, before moving on to better things). But that .js of the tag is easy to read by anyone on WWW, even after it is minified.
So instead of mimification, I use an obfuscator; all done automatically by your build script, in my case, instead of Gulp|Grunt, I use MetaBake, as there is no script to write.

So now, a chunk of my HTML code is converted into obfuscated .js.

### Recommendations

You HTML component likely does data binding, which means you are fetching data. So likely you' want to load your tag in head, not body: so that the fetch starts ASAP.

 And the component may need to load other .js libraries. So you inside your components you may want to have  .delayShowingComp { opacity: 0.01; } to help you manage 'jank'.

 ### TL/DR:

 If you use MetaBake to build, any Pug components will be transparently obfuscated. We used to mimify, now we obfuscate, no change in how you use it. But now, obfuscated.

