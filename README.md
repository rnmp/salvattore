Salvattore
==========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rnmp/salvattore?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![](http://files.bandd.co/zQf5+)](http://salvattore.com/)

Salvattore is a library agnostic JS script that will help you organize your HTML elements according to the number of columns you specify, like jQuery Masonry.

Features
--------
* __No requirements:__ Salvattore is a standalone script, it will work right away after being referenced in your HTML page.
* __Extremely lightweight:__ about 2.7KB (minified and gzipped.)
* __CSS-driven configuration:__ the number of columns is defined in CSS and the styling is left to the user.
* __Media queries ready:__ the same parameters can be used inside media queries for better results on different devices.
* __Wide browser support:__ modern browsers and IE9+

### Upcoming
* __Balanced columns:__ to keep all columns about the same height.

To find out more and see it in action, please visit [our website.](http://salvattore.com)

You can also [follow us](http://twitter.com/salvattorejs) on Twitter.

Methods
--------------------------
Methods can be called on the globally exposed `salvattore` object for advanced usage.

```javascript
var grid = document.querySelector('#grid');
var item = document.createElement('article');

salvattore.appendElements(grid, [item]);
item.outerHTML = 'I’ve been appended!';
```

Method | Argument | Description
------ | -------- | -----------
appendElements | grid : DOM object, elements: Array of DOM objects | Adds elements to the end of a grid.  
prependElements | grid : DOM object, elements: Array of DOM objects | Adds elements to a beginning of a grid. _Adds multiple elements one by one before each other, so note the order._
registerGrid | grid : DOM object | Adds a new grid to salvattore. Which is initialized automatically then.
recreateColumns | grid : DOM object | Removes all the columns from the grid, and adds them again.
rescanMediaQueries | | Checks stylesheets and selectors for media queries again. Recreates the columns for all grids afterwards.

How to contribute
-----------------
We use Gulp to add polyfills and minify the script in the `dist/` folder. To make changes to the script itself, please edit `src/salvattore.js` and send us a pull request.

### Share feedback & ideas
You can even contribute by using Salvattore and sharing bugs, ideas or solutions on the Issues page.
Protip: if you're posting a bug please share all the relevant data and ideally a live URL so that we can debug (yeah we do that!)
