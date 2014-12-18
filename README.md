Salvattore
==========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rnmp/salvattore?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![](http://files.bandd.co/zQf5+)](http://salvattore.com/)

Salvattore is a library agnostic JS script that will help you organize your HTML elements according to the number of columns you specify, like jQuery Masonry.

NOTE: If you jump into any trouble during a time-sensitive implementation, feel free to email rolando@bandd.co. We do not guarantee an immediate response but it would definitively be faster than using the issue tracker.

Features
--------
* __No requirements:__ Salvattore is a standalone script, it will work right away after being referenced in your HTML page.
* __Extremely lightweight:__ about 2.5KB (minified and gzipped.)
* __CSS-driven configuration:__ the number of columns is defined in CSS and the styling is left to the user.
* __Media queries ready:__ the same parameters can be used inside media queries for better results on different devices.
* __Wide browser support:__ modern browsers and IE9+ (though we're working on IE8.)

### Upcoming
* __IE8 support:__ without media queries, they aren't needed anyway.
* __Balanced columns:__ to keep all columns about the same height.

To find out more and see it in action, please visit [our website.](http://salvattore.com)

You can also [follow us](http://twitter.com/salvattorejs) on Twitter.

How to contribute
-----------------
We use Gulp to add polyfills and minify the script in the `dist/` folder. To make changes to the script itself, please edit `src/salvattore.js` and send us a pull request.

### Share feedback & ideas
You can even contribute by using Salvattore and sharing bugs, ideas or solutions on the Issues page.
Protip: if you're posting a bug please share all the relevant data and ideally a live URL so that we can debug (yeah we do that!)
