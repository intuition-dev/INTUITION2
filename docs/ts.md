
## TypeScript

TypeScript is supper-set of JavaScript. Write a ts file, like foo.ts:
```ts
foo(i:number) {
    console.log('oh hi')
}
```
and run
```sh
mbake -t .
```
It will create a .js and min.js files. It will output ES5 to support IE11, so feel free to use class { } syntax. 
If there is no .ts, than it will simply slightly mimifify js files into min.js (but no ES5 conversion).

---
(of course you have to load any polyfills like
promises, fetch or what you need)

And normally you run that command at the root of your Web App; but don't use it for server-side nodejs.
