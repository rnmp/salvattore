# Changelog

## 1.0.9

- Fix IE9 throwing error `not implemented` when using `@import` rule with an url [#159](https://github.com/rnmp/salvattore/issues/159)

## 1.0.8 - 2015-06-08

Changes:
- Convert all exposed to camelCase notation, underscore notation is now deprecated
- Expose `recreateColumns` function to allow column recreation (from pull request [#78](https://github.com/rnmp/salvattore/pull/78) by [@skakri](https://github.com/skakri))
- Expose `rescanMediaQueries` function to check all styles for new definitions

Fixed bugs:
- Fix IE 11 DocumentFragment bug (from pull request [#72](https://github.com/rnmp/salvattore/pull/72) by [@rnzo](https://github.com/rnzo))
- Fix reading of empty css files  [#84](https://github.com/rnmp/salvattore/issues/84)
 (from pull request [#85](https://github.com/rnmp/salvattore/pull/85) by [@francescostella](https://github.com/francescostella))
- `@import` statements no longer lead to errors [#108](https://github.com/rnmp/salvattore/issues/108)
 (from pull request [#118](https://github.com/rnmp/salvattore/pull/118) by [@hbi99](https://github.com/hbi99))
- `<style>`-Tags without `type="text/css"` are now parsed [#73](https://github.com/rnmp/salvattore/issues/73),  [#138](https://github.com/rnmp/salvattore/issues/138)
- Fix grid setting obtaining on older android browsers (from pull request [#103](https://github.com/rnmp/salvattore/pull/103) by [@yamaha252](https://github.com/yamaha252))  
- Interate over any interatable elements passed to  `appendElements` [#115](https://github.com/rnmp/salvattore/issues/115) (from pull request [#111](https://github.com/rnmp/salvattore/pull/111) by [@benjibee](https://github.com/benjibee))

## 1.0.7 - 2014-03-13

- Fixes append_elements bug for empty grids [#67](https://github.com/rnmp/salvattore/pull/67).

## 1.0.6 - 2014-03-10

- Fixes append_elements bug [#59](https://github.com/rnmp/salvattore/issues/59). (from pull request [#62](https://github.com/rnmp/salvattore/pull/62) by [@jlawrence-yellostudio](https://github.com/jlawrence-yellostudio))

## 1.0.5 - 2014-02-26

- Fixes Chrome Canary bug ([#40](https://github.com/rnmp/salvattore/issues/40) and [#38](https://github.com/rnmp/salvattore/issues/38))

## 1.0.4 - 2013-11-20

- Fixes error regarding JS API

## 1.0.3 - 2013-11-20

- Fixes `register_grid is not defined` error

## 1.0.2 - 2013-11-17

- Source code rewritten in JS (previously CoffeeScript) for easier contribution!

## 1.0.1 - 2013-09-06

- Fix column rearrangement on window resize. ([#9](https://github.com/rnmp/salvattore/issues/9))

## 1.0.0 - 2013-07-25

- First release.
